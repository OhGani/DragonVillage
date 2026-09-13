/**
 * IndexedDB 얇은 래퍼. M1 전용 — M2 부터는 서버 저장이 진실이 되고 이건 캐시/오프라인용으로 남는다.
 * 저장소:
 *   chunks: key `${worldId}|${cx},${cy},${cz}` → { worldId, cx, cy, cz, bytes }
 *   meta:   key worldId → WorldMeta
 */
export interface SavedChunk {
  worldId: string;
  cx: number;
  cy: number;
  cz: number;
  bytes: Uint8Array;
}

export interface WorldMeta {
  worldId: string;
  /** 지형 생성기 버전. 다르면 저장을 버린다 */
  genVersion: number;
  savedAt: number;
  player?: { x: number; y: number; z: number; yaw: number; pitch: number };
  chunkCount: number;
}

const DB_NAME = 'dragoncraft';
const DB_VERSION = 1;

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? new Error('IndexedDB 요청 실패'));
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB 트랜잭션 실패'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB 트랜잭션 중단'));
  });
}

export class WorldStore {
  private constructor(private readonly db: IDBDatabase) {}

  static available(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  static open(): Promise<WorldStore> {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(DB_NAME, DB_VERSION);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains('chunks')) {
          const s = db.createObjectStore('chunks', { keyPath: 'key' });
          s.createIndex('byWorld', 'worldId', { unique: false });
        }
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'worldId' });
      };
      r.onsuccess = () => resolve(new WorldStore(r.result));
      r.onerror = () => reject(r.error ?? new Error('IndexedDB 를 열 수 없어요'));
      r.onblocked = () => reject(new Error('IndexedDB 가 다른 탭에 막혔어요'));
    });
  }

  async loadMeta(worldId: string): Promise<WorldMeta | undefined> {
    const tx = this.db.transaction('meta', 'readonly');
    return (await req(tx.objectStore('meta').get(worldId))) as WorldMeta | undefined;
  }

  async loadChunks(worldId: string): Promise<SavedChunk[]> {
    const tx = this.db.transaction('chunks', 'readonly');
    const rows = (await req(tx.objectStore('chunks').index('byWorld').getAll(worldId))) as (SavedChunk & { key: string })[];
    return rows;
  }

  /** 청크들과 메타를 한 트랜잭션으로 저장 */
  async save(worldId: string, chunks: SavedChunk[], meta: WorldMeta): Promise<void> {
    const tx = this.db.transaction(['chunks', 'meta'], 'readwrite');
    const cs = tx.objectStore('chunks');
    for (const c of chunks) cs.put({ ...c, key: `${worldId}|${c.cx},${c.cy},${c.cz}` });
    tx.objectStore('meta').put(meta);
    await done(tx);
  }

  async clearWorld(worldId: string): Promise<void> {
    const tx = this.db.transaction(['chunks', 'meta'], 'readwrite');
    const cs = tx.objectStore('chunks');
    const keys = (await req(cs.index('byWorld').getAllKeys(worldId))) as IDBValidKey[];
    for (const k of keys) cs.delete(k);
    tx.objectStore('meta').delete(worldId);
    await done(tx);
  }

  close(): void {
    this.db.close();
  }
}
