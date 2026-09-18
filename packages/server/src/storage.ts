/**
 * SQLite 저장 (better-sqlite3). 마을·바뀐 청크·플레이어. ARCHITECTURE.md '저장' 절의 M2 부분.
 * 청크 blob 은 shared/chunk/serialize 의 형식(문자열 팔레트 + RLE) 그대로.
 */
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
