/**
 * SQLite 저장 (better-sqlite3). 마을·바뀐 청크·플레이어. ARCHITECTURE.md '저장' 절의 M2 부분.
 * 청크 blob 은 shared/chunk/serialize 의 형식(문자열 팔레트 + RLE) 그대로.
 */
import { type Inventory, isValidInventory } from '@dragon-village/shared';
import Database from 'better-sqlite3';
import { copyFileSync } from 'node:fs';

export interface VillageRow {
  code: string;
  name: string;
  seed: number;
  genVersion: number;
  createdAt: number;
}
export interface ChunkRow {
  cx: number;
  cy: number;
  cz: number;
  blob: Uint8Array;
}
export interface AccountRow {
  nickKey: string;
  nick: string;
  token: string;
  pinHash: string | null;
  createdAt: number;
}
export interface PlayerRow {
  token: string;
  village: string | null;
  nick: string;
  color: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  lastSeen: number;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS villages(
  code TEXT PRIMARY KEY, name TEXT NOT NULL, seed INTEGER NOT NULL, gen_version INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS chunk_diffs(
  village TEXT NOT NULL, cx INTEGER NOT NULL, cy INTEGER NOT NULL, cz INTEGER NOT NULL, blob BLOB NOT NULL, updated_at INTEGER NOT NULL,
  PRIMARY KEY(village, cx, cy, cz));
CREATE TABLE IF NOT EXISTS players(
  token TEXT PRIMARY KEY, village TEXT, nick TEXT NOT NULL, color INTEGER NOT NULL,
  x REAL NOT NULL, y REAL NOT NULL, z REAL NOT NULL, yaw REAL NOT NULL, pitch REAL NOT NULL, last_seen INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS storage(
  village TEXT NOT NULL, item TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(village, item));
CREATE TABLE IF NOT EXISTS inventories(
  token TEXT PRIMARY KEY, village TEXT, json TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS accounts(
  nick_key TEXT PRIMARY KEY, nick TEXT NOT NULL, token TEXT NOT NULL UNIQUE, pin_hash TEXT, created_at INTEGER NOT NULL);
`;

export class Storage {
  private readonly db: Database.Database;
  private readonly stmts;

  /** path ':memory:' 면 메모리 DB (테스트) */
  constructor(readonly path: string) {
    this.db = new Database(path);
    if (path !== ':memory:') this.db.pragma('journal_mode = WAL');
    this.db.exec(SCHEMA);
    this.stmts = {
      getVillage: this.db.prepare('SELECT code, name, seed, gen_version AS genVersion, created_at AS createdAt FROM villages WHERE code = ?'),
      listVillages: this.db.prepare('SELECT code, name, seed, gen_version AS genVersion, created_at AS createdAt FROM villages ORDER BY created_at'),
      insertVillage: this.db.prepare('INSERT INTO villages(code, name, seed, gen_version, created_at) VALUES (@code, @name, @seed, @genVersion, @createdAt)'),
      deleteChunks: this.db.prepare('DELETE FROM chunk_diffs WHERE village = ?'),
      loadChunks: this.db.prepare('SELECT cx, cy, cz, blob FROM chunk_diffs WHERE village = ?'),
      upsertChunk: this.db.prepare(
        'INSERT INTO chunk_diffs(village, cx, cy, cz, blob, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(village, cx, cy, cz) DO UPDATE SET blob = excluded.blob, updated_at = excluded.updated_at',
      ),
      countChunks: this.db.prepare('SELECT COUNT(*) AS n FROM chunk_diffs WHERE village = ?'),
      getPlayer: this.db.prepare(
        'SELECT token, village, nick, color, x, y, z, yaw, pitch, last_seen AS lastSeen FROM players WHERE token = ?',
      ),
      addItem: this.db.prepare(
        'INSERT INTO storage(village, item, count) VALUES (?, ?, ?) ON CONFLICT(village, item) DO UPDATE SET count = count + excluded.count',
      ),
      getStorage: this.db.prepare('SELECT item, count FROM storage WHERE village = ? ORDER BY item'),
      getInventory: this.db.prepare('SELECT json FROM inventories WHERE token = ?'),
      getAccountByNick: this.db.prepare('SELECT nick_key AS nickKey, nick, token, pin_hash AS pinHash, created_at AS createdAt FROM accounts WHERE nick_key = ?'),
      getAccountByToken: this.db.prepare('SELECT nick_key AS nickKey, nick, token, pin_hash AS pinHash, created_at AS createdAt FROM accounts WHERE token = ?'),
      upsertAccount: this.db.prepare(
        'INSERT INTO accounts(nick_key, nick, token, pin_hash, created_at) VALUES (@nickKey, @nick, @token, @pinHash, @createdAt) ON CONFLICT(nick_key) DO UPDATE SET nick = excluded.nick, token = excluded.token, pin_hash = excluded.pin_hash',
      ),
      deleteAccount: this.db.prepare('DELETE FROM accounts WHERE nick_key = ?'),
      setAccountPin: this.db.prepare('UPDATE accounts SET pin_hash = ? WHERE nick_key = ?'),
      upsertInventory: this.db.prepare(
        'INSERT INTO inventories(token, village, json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(token) DO UPDATE SET village = excluded.village, json = excluded.json, updated_at = excluded.updated_at',
      ),
      upsertPlayer: this.db.prepare(
        `INSERT INTO players(token, village, nick, color, x, y, z, yaw, pitch, last_seen)
         VALUES (@token, @village, @nick, @color, @x, @y, @z, @yaw, @pitch, @lastSeen)
         ON CONFLICT(token) DO UPDATE SET village = excluded.village, nick = excluded.nick, color = excluded.color,
           x = excluded.x, y = excluded.y, z = excluded.z, yaw = excluded.yaw, pitch = excluded.pitch, last_seen = excluded.last_seen`,
      ),
    };
  }

  getVillage(code: string): VillageRow | undefined {
    return this.stmts.getVillage.get(code) as VillageRow | undefined;
  }
  listVillages(): VillageRow[] {
    return this.stmts.listVillages.all() as VillageRow[];
  }
  createVillage(row: VillageRow): void {
    this.stmts.insertVillage.run(row);
  }

  loadChunks(code: string): ChunkRow[] {
    const rows = this.stmts.loadChunks.all(code) as { cx: number; cy: number; cz: number; blob: Buffer }[];
    return rows.map((r) => ({ cx: r.cx, cy: r.cy, cz: r.cz, blob: new Uint8Array(r.blob) }));
  }
  /** 여러 청크를 한 트랜잭션으로 저장(덮어쓰기) */
  saveChunks(code: string, rows: readonly ChunkRow[], now = Date.now()): void {
    if (rows.length === 0) return;
    const tx = this.db.transaction((list: readonly ChunkRow[]) => {
      for (const r of list) this.stmts.upsertChunk.run(code, r.cx, r.cy, r.cz, Buffer.from(r.blob.buffer, r.blob.byteOffset, r.blob.byteLength), now);
    });
    tx(rows);
  }
  countChunks(code: string): number {
    return (this.stmts.countChunks.get(code) as { n: number }).n;
  }
  /** 마을의 저장 청크를 모두 지운다 (생성기 버전이 바뀌었을 때) */
  clearChunks(code: string): void {
    this.stmts.deleteChunks.run(code);
  }

  getPlayer(token: string): PlayerRow | undefined {
    return this.stmts.getPlayer.get(token) as PlayerRow | undefined;
  }
  savePlayer(row: PlayerRow): void {
    this.stmts.upsertPlayer.run(row);
  }

  /** 마을 창고에 더한다 (원정 정산, M3). 0 이하는 무시 */
  addItems(code: string, items: readonly { id: string; count: number }[]): void {
    const tx = this.db.transaction((list: readonly { id: string; count: number }[]) => {
      for (const it of list) if (it.count > 0) this.stmts.addItem.run(code, it.id, it.count);
    });
    tx(items);
  }
  getStorage(code: string): { item: string; count: number }[] {
    return this.stmts.getStorage.all(code) as { item: string; count: number }[];
  }

  /** 가방 (M4). 없으면 null. 모양이 이상하면(옛 저장) null */
  getInventory(token: string): Inventory | null {
    const row = this.stmts.getInventory.get(token) as { json: string } | undefined;
    if (!row) return null;
    try {
      const v: unknown = JSON.parse(row.json);
      return isValidInventory(v) ? v : null;
    } catch {
      return null;
    }
  }
  saveInventory(token: string, village: string, inv: Inventory, now = Date.now()): void {
    this.stmts.upsertInventory.run(token, village, JSON.stringify(inv), now);
  }

  /** 계정 (M5, #63) */
  getAccountByNick(nickKey: string): AccountRow | undefined {
    return this.stmts.getAccountByNick.get(nickKey) as AccountRow | undefined;
  }
  getAccountByToken(token: string): AccountRow | undefined {
    return this.stmts.getAccountByToken.get(token) as AccountRow | undefined;
  }
  upsertAccount(row: AccountRow): void {
    this.stmts.upsertAccount.run(row);
  }
  deleteAccount(nickKey: string): void {
    this.stmts.deleteAccount.run(nickKey);
  }
  setAccountPin(nickKey: string, pinHash: string): void {
    this.stmts.setAccountPin.run(pinHash, nickKey);
  }

  /** 온라인 백업 (WAL 포함 일관된 사본) */
  async backupTo(dest: string): Promise<void> {
    if (this.path === ':memory:') return;
    await this.db.backup(dest);
  }

  /** 마지막 수단: 파일 복사 */
  copyTo(dest: string): void {
    if (this.path === ':memory:') return;
    copyFileSync(this.path, dest);
  }

  close(): void {
    this.db.close();
  }
}
