import { type BlockRegistry, type ChunkCoord, type VoxelWorld, chunkKey, decodeChunk, encodeChunk } from '@dragon-village/shared';
import { type SavedChunk, type WorldMeta, WorldStore } from './WorldStore';

export interface PlayerSave {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface LoadResult {
  /** 저장이 있어서 불러왔나 */
  loaded: boolean;
  chunks: number;
  player: PlayerSave | null;
  /** 지형 버전이 달라 버린 저장이 있었나 */
  discardedOldWorld: boolean;
  unknownIds: string[];
}

const DEBOUNCE_MS = 1500;
const PERIODIC_MS = 20000;

/**
 * 바뀐 청크만 모아 IndexedDB 에 저장한다 (M1 완료 기준: 껐다 켜도 집이 그대로).
 * - 블록이 바뀌면 markChunk → 1.5초 뒤 저장. 20초마다도 저장. 탭이 숨겨지거나 닫힐 때 즉시 저장.
 * - 저장을 못 쓰는 브라우저(시크릿 모드 등)면 조용히 꺼진다 (available=false).
 */
export class SaveManager {
  private readonly modified = new Map<number, ChunkCoord>();
  private timer: number | null = null;
  private periodic: number | null = null;
  private flushing: Promise<void> | null = null;
  private player: (() => PlayerSave) | null = null;
  lastSavedAt = 0;
  lastError: string | null = null;
  onSaved: ((count: number) => void) | null = null;

  private constructor(
    private readonly store: WorldStore | null,
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    readonly worldId: string,
    readonly genVersion: number,
  ) {}

  static async create(world: VoxelWorld, registry: BlockRegistry, worldId: string, genVersion: number): Promise<SaveManager> {
    let store: WorldStore | null = null;
    if (WorldStore.available()) {
      try {
        store = await WorldStore.open();
      } catch (e) {
        console.warn('저장소를 열 수 없어요 — 저장 없이 진행', e);
      }
    }
    return new SaveManager(store, world, registry, worldId, genVersion);
  }

  get available(): boolean {
    return this.store !== null;
  }

  get pendingCount(): number {
    return this.modified.size;
  }

  /** 플레이어 위치를 어디서 읽을지 */
  bindPlayer(getter: () => PlayerSave): void {
    this.player = getter;
  }

  /** 예전 세계 id 의 저장을 지운다 (M0 테스트 월드 → 마을). 지운 게 있었으면 true */
  async discardLegacy(worldId: string): Promise<boolean> {
    if (!this.store) return false;
    try {
      const meta = await this.store.loadMeta(worldId);
      if (!meta) return false;
      await this.store.clearWorld(worldId);
      return true;
    } catch {
      return false;
    }
  }

  /** 저장된 청크로 월드를 덮어쓴다. 생성기 버전이 다르면 버린다 */
  async load(): Promise<LoadResult> {
    const none: LoadResult = { loaded: false, chunks: 0, player: null, discardedOldWorld: false, unknownIds: [] };
    if (!this.store) return none;
    try {
      const meta = await this.store.loadMeta(this.worldId);
      if (!meta) return none;
      if (meta.genVersion !== this.genVersion) {
        await this.store.clearWorld(this.worldId);
        return { ...none, discardedOldWorld: true };
      }
      const rows = await this.store.loadChunks(this.worldId);
      const unknown = new Set<string>();
      for (const r of rows) {
        if (!this.world.chunkInBounds(r.cx, r.cy, r.cz)) continue;
        const chunk = this.world.getOrCreateChunk(r.cx, r.cy, r.cz);
        const res = decodeChunk(r.bytes, this.registry, chunk);
        for (const id of res.unknownIds) unknown.add(id);
      }
      return { loaded: true, chunks: rows.length, player: meta.player ?? null, discardedOldWorld: false, unknownIds: [...unknown] };
    } catch (e) {
      this.lastError = e instanceof Error ? e.message : String(e);
      console.warn('저장 불러오기 실패', e);
      return none;
    }
  }

  /** 이 청크의 블록이 바뀌었다 */
  markChunk(cx: number, cy: number, cz: number): void {
    if (!this.store || !this.world.chunkInBounds(cx, cy, cz)) return;
    this.modified.set(chunkKey(cx, cy, cz), { cx, cy, cz });
    this.schedule();
  }

  markBlock(x: number, y: number, z: number): void {
    this.markChunk(x >> 4, y >> 4, z >> 4);
  }

  markChunks(coords: readonly ChunkCoord[]): void {
    for (const c of coords) this.markChunk(c.cx, c.cy, c.cz);
  }

  private schedule(): void {
    if (this.timer !== null) return;
    this.timer = window.setTimeout(() => {
      this.timer = null;
      void this.flush();
    }, DEBOUNCE_MS);
  }

  /** 페이지 수명 이벤트에 붙인다 */
  attachLifecycle(): void {
    if (!this.store) return;
    this.periodic = window.setInterval(() => void this.flush(), PERIODIC_MS);
    const now = () => void this.flush(true);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') now();
    });
    window.addEventListener('pagehide', now);
    window.addEventListener('beforeunload', now);
  }

  /**
   * 바뀐 청크 + 플레이어 위치 저장. 바뀐 게 없으면 위치만(includePlayerOnly) 또는 건너뜀.
   */
  flush(force = false): Promise<void> {
    if (!this.store) return Promise.resolve();
    if (this.flushing) return this.flushing;
    if (this.modified.size === 0 && !force) return Promise.resolve();
    const store = this.store;
    const batch = [...this.modified.values()];
    this.modified.clear();
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.flushing = (async () => {
      try {
        const chunks: SavedChunk[] = [];
        for (const c of batch) {
          const chunk = this.world.getChunk(c.cx, c.cy, c.cz);
          if (!chunk) continue;
          chunks.push({ worldId: this.worldId, cx: c.cx, cy: c.cy, cz: c.cz, bytes: encodeChunk(chunk, this.registry) });
        }
        const prev = await store.loadMeta(this.worldId);
        const meta: WorldMeta = {
          worldId: this.worldId,
          genVersion: this.genVersion,
          savedAt: Date.now(),
          player: this.player?.() ?? prev?.player,
          chunkCount: (prev?.chunkCount ?? 0) + chunks.length, // 근사값(덮어쓰기 포함). 표시용
        };
        await store.save(this.worldId, chunks, meta);
        this.lastSavedAt = meta.savedAt;
        this.lastError = null;
        this.onSaved?.(chunks.length);
      } catch (e) {
        // 실패하면 다음에 다시 시도하도록 되돌린다
        for (const c of batch) this.modified.set(chunkKey(c.cx, c.cy, c.cz), c);
        this.lastError = e instanceof Error ? e.message : String(e);
        console.warn('저장 실패', e);
      } finally {
        this.flushing = null;
      }
    })();
    return this.flushing;
  }

  /** 이 세계의 저장을 모두 지운다 (처음부터 다시) */
  async clear(): Promise<void> {
    if (!this.store) return;
    this.modified.clear();
    await this.store.clearWorld(this.worldId);
  }

  dispose(): void {
    if (this.timer !== null) window.clearTimeout(this.timer);
    if (this.periodic !== null) window.clearInterval(this.periodic);
    this.store?.close();
  }
}
