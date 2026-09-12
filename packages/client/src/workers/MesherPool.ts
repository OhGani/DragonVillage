import type { MeshBlockInfo, MesherRequest, MesherResponse } from '../mesh/meshTypes';

interface Pending {
  resolve: (r: MesherResponse) => void;
  reject: (e: unknown) => void;
  worker: number;
}

/** 메싱 워커 풀. hardwareConcurrency-1 개 (1~4). */
export class MesherPool {
  private readonly workers: Worker[] = [];
  private readonly busy: number[] = [];
  private readonly pending = new Map<number, Pending>();
  private nextJob = 1;

  constructor(blockInfo: MeshBlockInfo[], count = MesherPool.defaultCount()) {
    for (let i = 0; i < count; i++) {
      const w = new Worker(new URL('./mesher.worker.ts', import.meta.url), { type: 'module', name: `mesher-${i}` });
      w.onmessage = (e: MessageEvent<MesherResponse>) => this.onMessage(e.data);
      w.onerror = (e) => console.error('메싱 워커 오류', e);
      const init: MesherRequest = { type: 'init', blockInfo };
      w.postMessage(init);
      this.workers.push(w);
      this.busy.push(0);
    }
  }

  static defaultCount(): number {
    const hc = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2;
    return Math.max(1, Math.min(4, hc - 1));
  }

  get size(): number {
    return this.workers.length;
  }

  get inflight(): number {
    return this.pending.size;
  }

  mesh(cx: number, cy: number, cz: number, padded: Uint16Array): Promise<MesherResponse> {
    let wi = 0;
    for (let i = 1; i < this.busy.length; i++) if (this.busy[i] < this.busy[wi]) wi = i;
    const jobId = this.nextJob++;
    this.busy[wi]++;
    return new Promise<MesherResponse>((resolve, reject) => {
      this.pending.set(jobId, { resolve, reject, worker: wi });
      const req: MesherRequest = { type: 'mesh', jobId, cx, cy, cz, padded };
      this.workers[wi].postMessage(req, [padded.buffer as ArrayBuffer]);
    });
  }

  private onMessage(res: MesherResponse): void {
    const p = this.pending.get(res.jobId);
    if (!p) return;
    this.pending.delete(res.jobId);
    this.busy[p.worker]--;
    p.resolve(res);
  }

  dispose(): void {
    for (const w of this.workers) w.terminate();
    this.workers.length = 0;
    for (const p of this.pending.values()) p.reject(new Error('워커 풀 종료'));
    this.pending.clear();
  }
}
