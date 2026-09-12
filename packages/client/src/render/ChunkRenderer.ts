import { CHUNK_SIZE, type ChunkCoord, type VoxelWorld, chunkKey } from '@dragon-village/shared';
import * as THREE from 'three';
import type { MesherResponse } from '../mesh/meshTypes';
import type { MesherPool } from '../workers/MesherPool';
import type { ChunkMaterials } from './ChunkMaterial';
import { buffersToGeometry } from './geometry';

interface Entry extends ChunkCoord {
  opaque: THREE.Mesh | null;
  translucent: THREE.Mesh | null;
  inflight: boolean;
  /** 메싱 중에 다시 dirty 표시가 들어옴 → 끝나면 한 번 더 */
  redo: boolean;
}

export interface RenderStats {
  meshed: number;
  lastMs: number;
  avgMs: number;
  maxMs: number;
  visibleChunks: number;
}

/**
 * 청크 메시 관리자. dirty 큐 → 워커 → BufferGeometry 교체.
 * 프레임당 재메싱 상한 2 (DECISIONS #20). 초기 로딩 중에는 burst.
 */
export class ChunkRenderer {
  readonly group = new THREE.Group();
  readonly stats: RenderStats = { meshed: 0, lastMs: 0, avgMs: 0, maxMs: 0, visibleChunks: 0 };
  /** 청크 단위 렌더 거리 */
  renderDistance = 8;
  maxPerFrame = 2;
  burst = true;

  private readonly entries = new Map<number, Entry>();
  private readonly dirty = new Map<number, ChunkCoord>();
  private readonly boundingRadius = (Math.sqrt(3) * CHUNK_SIZE) / 2 + 0.5;
  private paddedScratch: Uint16Array | null = null;

  constructor(
    private readonly world: VoxelWorld,
    private readonly materials: ChunkMaterials,
    private readonly pool: MesherPool,
    scene: THREE.Scene,
  ) {
    scene.add(this.group);
  }

  get queued(): number {
    return this.dirty.size;
  }

  get inflight(): number {
    return this.pool.inflight;
  }

  markDirty(cx: number, cy: number, cz: number): void {
    if (!this.world.chunkInBounds(cx, cy, cz)) return;
    this.dirty.set(chunkKey(cx, cy, cz), { cx, cy, cz });
  }

  markDirtyAll(coords: readonly ChunkCoord[]): void {
    for (const c of coords) this.markDirty(c.cx, c.cy, c.cz);
  }

  markAll(): void {
    this.world.forEachChunk((c) => this.markDirty(c.cx, c.cy, c.cz));
  }

  /** 매 프레임: 가까운 dirty 청크부터 워커로 보내고, 거리 밖 청크는 숨긴다 */
  update(px: number, pz: number): void {
    const pcx = Math.floor(px / CHUNK_SIZE),
      pcz = Math.floor(pz / CHUNK_SIZE);

    if (this.dirty.size > 0) {
      const limit = this.burst ? 24 : this.maxPerFrame;
      const list = [...this.dirty.values()];
      if (list.length > 1) {
        list.sort((a, b) => {
          const da = (a.cx - pcx) ** 2 + (a.cz - pcz) ** 2 + (a.cy - 1) ** 2;
          const db = (b.cx - pcx) ** 2 + (b.cz - pcz) ** 2 + (b.cy - 1) ** 2;
          return da - db;
        });
      }
      let n = 0;
      for (const c of list) {
        if (n >= limit || this.pool.inflight >= this.pool.size * 3) break;
        this.dirty.delete(chunkKey(c.cx, c.cy, c.cz));
        if (this.dispatch(c)) n++;
      }
    } else if (this.burst && this.pool.inflight === 0) {
      this.burst = false;
    }

    let visible = 0;
    for (const e of this.entries.values()) {
      const dx = Math.abs(e.cx - pcx),
        dz = Math.abs(e.cz - pcz);
      const show = Math.max(dx, dz) <= this.renderDistance;
      if (e.opaque) e.opaque.visible = show;
      if (e.translucent) e.translucent.visible = show;
      if (show && (e.opaque || e.translucent)) visible++;
    }
    this.stats.visibleChunks = visible;
  }

  private entry(c: ChunkCoord): Entry {
    const key = chunkKey(c.cx, c.cy, c.cz);
    let e = this.entries.get(key);
    if (!e) {
      e = { cx: c.cx, cy: c.cy, cz: c.cz, opaque: null, translucent: null, inflight: false, redo: false };
      this.entries.set(key, e);
    }
    return e;
  }

  private dispatch(c: ChunkCoord): boolean {
    const e = this.entry(c);
    const chunk = this.world.getChunk(c.cx, c.cy, c.cz);
    if (!chunk || chunk.isEmpty()) {
      this.removeMesh(e, 'opaque');
      this.removeMesh(e, 'translucent');
      return false;
    }
    if (e.inflight) {
      e.redo = true;
      return false;
    }
    e.inflight = true;
    const version = chunk.version;
    // 워커로 transfer 되므로 매번 새 버퍼가 필요하다 (scratch 는 재사용 불가) — 작아서(11.6KB) 괜찮다
    const padded = this.world.buildPadded(c.cx, c.cy, c.cz, this.paddedScratch ?? undefined);
    this.paddedScratch = null;
    void this.pool.mesh(c.cx, c.cy, c.cz, padded).then(
      (res) => {
        e.inflight = false;
        this.apply(e, res);
        if (e.redo || chunk.version !== version) {
          e.redo = false;
          this.markDirty(c.cx, c.cy, c.cz);
        }
      },
      (err: unknown) => {
        e.inflight = false;
        console.error('메싱 실패', c, err);
      },
    );
    return true;
  }

  private apply(e: Entry, res: MesherResponse): void {
    const s = this.stats;
    s.meshed++;
    s.lastMs = res.ms;
    s.avgMs = s.avgMs === 0 ? res.ms : s.avgMs * 0.9 + res.ms * 0.1;
    s.maxMs = Math.max(s.maxMs, res.ms);

    const center = new THREE.Vector3(CHUNK_SIZE / 2, CHUNK_SIZE / 2, CHUNK_SIZE / 2);
    for (const kind of ['opaque', 'translucent'] as const) {
      const buf = res.result[kind];
      if (!buf) {
        this.removeMesh(e, kind);
        continue;
      }
      const geom = buffersToGeometry(buf, this.boundingRadius, center);
      let mesh = e[kind];
      if (!mesh) {
        mesh = new THREE.Mesh(geom, kind === 'opaque' ? this.materials.opaque : this.materials.translucent);
        mesh.position.set(e.cx * CHUNK_SIZE, e.cy * CHUNK_SIZE, e.cz * CHUNK_SIZE);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        mesh.renderOrder = kind === 'opaque' ? 0 : 10;
        e[kind] = mesh;
        this.group.add(mesh);
      } else {
        mesh.geometry.dispose();
        mesh.geometry = geom;
      }
    }
  }

  private removeMesh(e: Entry, kind: 'opaque' | 'translucent'): void {
    const m = e[kind];
    if (!m) return;
    this.group.remove(m);
    m.geometry.dispose();
    e[kind] = null;
  }

  dispose(): void {
    for (const e of this.entries.values()) {
      this.removeMesh(e, 'opaque');
      this.removeMesh(e, 'translucent');
    }
    this.entries.clear();
    this.dirty.clear();
  }
}
