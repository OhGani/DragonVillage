/**
 * SQLite 저장 (better-sqlite3). 마을·바뀐 청크·플레이어. ARCHITECTURE.md '저장' 절의 M2 부분.
 * 청크 blob 은 shared/chunk/serialize 의 형식(문자열 팔레트 + RLE) 그대로.
 */
import { type Inventory, type TodoStatus, isValidInventory } from '@dragon-village/shared';
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
export interface FamilyRow {
  id: number;
  code: string;
  createdAt: number;
}
export interface ParentRow {
  id: number;
  family: number;
  email: string;
  pwHash: string;
  createdAt: number;
}
export interface ChildRow {
  nickKey: string;
  family: number;
  linkedAt: number;
}
/** 할 일 (M5-3). needsApproval·active 는 0/1 */
export interface TodoRow {
  id: number;
  family: number;
  /** 아이 닉 키 */
  child: string;
  title: string;
  /** 'daily' | 'once' | '1,2,3' */
  repeat: string;
  needsApproval: number;
  active: number;
  createdAt: number;
}
export interface TodoLogRow {
  todoId: number;
  date: string;
  /** pending | checked | approved | rejected (shared TodoStatus) */
  status: TodoStatus;
  checkedAt: number | null;
  decidedAt: number | null;
}
export interface LedgerRow {
  child: string;
  date: string;
  usedSec: number;
  manualAdj: number;
  /** 부모 "오늘 게임 없음" (0/1) */
  noPlay: number;
}
/** 주간 정산 한 줄 (week_start = 이번 주 월요일, rate = 지난주 달성률) */
export interface SettlementRow {
  child: string;
  weekStart: string;
  rate: number;
  bonusCap: number;
  approved: number;
  expected: number;
  settledAt: number;
}
/** 드래곤 한 마리 (M6-2). stage: egg(둥지 자리 slot 에 알) / baby / adult */
export interface DragonRow {
  id: number;
  village: string;
  token: string;
  dragon: string;
  stage: 'egg' | 'baby' | 'adult';
  slot: number | null;
  placedAt: number;
  hatchedAt: number | null;
  fed: number;
  restingUntil: number | null;
}
export interface AdjustmentRow {
  id: number;
  child: string;
  date: string;
  deltaMin: number;
  reason: string;
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
  /** 경험치 총량 (M6-1, 토큰별) */
  xpTotal: number;
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
CREATE TABLE IF NOT EXISTS families(
  id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS parents(
  id INTEGER PRIMARY KEY AUTOINCREMENT, family INTEGER NOT NULL, email TEXT NOT NULL UNIQUE, pw_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS parent_sessions(
  sid TEXT PRIMARY KEY, parent_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS children(
  nick_key TEXT PRIMARY KEY, family INTEGER NOT NULL, linked_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS parent_players(
  nick_key TEXT PRIMARY KEY, family INTEGER NOT NULL, linked_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS todos(
  id INTEGER PRIMARY KEY AUTOINCREMENT, family INTEGER NOT NULL, child TEXT NOT NULL, title TEXT NOT NULL, repeat TEXT NOT NULL,
  needs_approval INTEGER NOT NULL, active INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS todos_child ON todos(child);
CREATE TABLE IF NOT EXISTS todo_logs(
  todo_id INTEGER NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL, checked_at INTEGER, decided_at INTEGER, PRIMARY KEY(todo_id, date));
CREATE TABLE IF NOT EXISTS time_ledger(
  child TEXT NOT NULL, date TEXT NOT NULL, used_sec INTEGER NOT NULL DEFAULT 0, manual_adj INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(child, date));
CREATE TABLE IF NOT EXISTS week_settlements(
  child TEXT NOT NULL, week_start TEXT NOT NULL, rate REAL NOT NULL, bonus_cap INTEGER NOT NULL, approved INTEGER NOT NULL, expected INTEGER NOT NULL,
  settled_at INTEGER NOT NULL, PRIMARY KEY(child, week_start));
CREATE TABLE IF NOT EXISTS dragons(
  id INTEGER PRIMARY KEY AUTOINCREMENT, village TEXT NOT NULL, token TEXT NOT NULL, dragon TEXT NOT NULL, stage TEXT NOT NULL,
  slot INTEGER, placed_at INTEGER NOT NULL, hatched_at INTEGER, fed INTEGER NOT NULL DEFAULT 0, resting_until INTEGER);
CREATE INDEX IF NOT EXISTS dragons_owner ON dragons(village, token);
CREATE TABLE IF NOT EXISTS time_adjustments(
  id INTEGER PRIMARY KEY AUTOINCREMENT, child TEXT NOT NULL, date TEXT NOT NULL, delta_min INTEGER NOT NULL, reason TEXT NOT NULL, created_at INTEGER NOT NULL);
`;

export class Storage {
  private readonly db: Database.Database;
  private readonly stmts;

  /** path ':memory:' 면 메모리 DB (테스트) */
  constructor(readonly path: string) {
    this.db = new Database(path);
    if (path !== ':memory:') this.db.pragma('journal_mode = WAL');
    this.db.exec(SCHEMA);
    // 있던 표에 열 추가 (CREATE TABLE IF NOT EXISTS 는 열을 못 더한다)
    this.ensureColumn('time_ledger', 'no_play', 'INTEGER NOT NULL DEFAULT 0');
    this.ensureColumn('players', 'xp_total', 'INTEGER NOT NULL DEFAULT 0');
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
        'SELECT token, village, nick, color, x, y, z, yaw, pitch, last_seen AS lastSeen, xp_total AS xpTotal FROM players WHERE token = ?',
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
      getFamilyByCode: this.db.prepare('SELECT id, code, created_at AS createdAt FROM families WHERE code = ?'),
      getFamilyById: this.db.prepare('SELECT id, code, created_at AS createdAt FROM families WHERE id = ?'),
      insertFamily: this.db.prepare('INSERT INTO families(code, created_at) VALUES (?, ?)'),
      getParentByEmail: this.db.prepare('SELECT id, family, email, pw_hash AS pwHash, created_at AS createdAt FROM parents WHERE email = ?'),
      getParentById: this.db.prepare('SELECT id, family, email, pw_hash AS pwHash, created_at AS createdAt FROM parents WHERE id = ?'),
      insertParent: this.db.prepare('INSERT INTO parents(family, email, pw_hash, created_at) VALUES (?, ?, ?, ?)'),
      insertSession: this.db.prepare('INSERT INTO parent_sessions(sid, parent_id, expires_at) VALUES (?, ?, ?)'),
      getSession: this.db.prepare('SELECT sid, parent_id AS parentId, expires_at AS expiresAt FROM parent_sessions WHERE sid = ?'),
      deleteSession: this.db.prepare('DELETE FROM parent_sessions WHERE sid = ?'),
      getChild: this.db.prepare('SELECT nick_key AS nickKey, family, linked_at AS linkedAt FROM children WHERE nick_key = ?'),
      upsertChild: this.db.prepare('INSERT INTO children(nick_key, family, linked_at) VALUES (?, ?, ?) ON CONFLICT(nick_key) DO UPDATE SET family = excluded.family, linked_at = excluded.linked_at'),
      deleteChild: this.db.prepare('DELETE FROM children WHERE nick_key = ?'),
      listChildren: this.db.prepare('SELECT nick_key AS nickKey, family, linked_at AS linkedAt FROM children WHERE family = ? ORDER BY linked_at'),
      getParentPlayer: this.db.prepare('SELECT nick_key AS nickKey, family, linked_at AS linkedAt FROM parent_players WHERE nick_key = ?'),
      upsertParentPlayer: this.db.prepare('INSERT INTO parent_players(nick_key, family, linked_at) VALUES (?, ?, ?) ON CONFLICT(nick_key) DO UPDATE SET family = excluded.family, linked_at = excluded.linked_at'),
      deleteParentPlayer: this.db.prepare('DELETE FROM parent_players WHERE nick_key = ?'),
      listParentPlayers: this.db.prepare('SELECT nick_key AS nickKey, family, linked_at AS linkedAt FROM parent_players WHERE family = ? ORDER BY linked_at'),
      insertTodo: this.db.prepare('INSERT INTO todos(family, child, title, repeat, needs_approval, active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)'),
      getTodo: this.db.prepare('SELECT id, family, child, title, repeat, needs_approval AS needsApproval, active, created_at AS createdAt FROM todos WHERE id = ?'),
      listTodosByChild: this.db.prepare('SELECT id, family, child, title, repeat, needs_approval AS needsApproval, active, created_at AS createdAt FROM todos WHERE child = ? ORDER BY created_at, id'),
      updateTodo: this.db.prepare('UPDATE todos SET title = @title, repeat = @repeat, needs_approval = @needsApproval, active = @active WHERE id = @id'),
      deleteTodo: this.db.prepare('DELETE FROM todos WHERE id = ?'),
      deleteTodoLogs: this.db.prepare('DELETE FROM todo_logs WHERE todo_id = ?'),
      getLog: this.db.prepare('SELECT todo_id AS todoId, date, status, checked_at AS checkedAt, decided_at AS decidedAt FROM todo_logs WHERE todo_id = ? AND date = ?'),
      upsertLog: this.db.prepare(
        'INSERT INTO todo_logs(todo_id, date, status, checked_at, decided_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(todo_id, date) DO UPDATE SET status = excluded.status, checked_at = excluded.checked_at, decided_at = excluded.decided_at',
      ),
      listLogsByChild: this.db.prepare(
        'SELECT l.todo_id AS todoId, l.date, l.status, l.checked_at AS checkedAt, l.decided_at AS decidedAt FROM todo_logs l JOIN todos t ON t.id = l.todo_id WHERE t.child = ? AND l.date >= ? ORDER BY l.date',
      ),
      listCheckedLogs: this.db.prepare(
        "SELECT l.todo_id AS todoId, l.date, l.checked_at AS checkedAt, t.title, t.child FROM todo_logs l JOIN todos t ON t.id = l.todo_id WHERE t.family = ? AND l.status = 'checked' ORDER BY l.checked_at",
      ),
      getLedger: this.db.prepare('SELECT child, date, used_sec AS usedSec, manual_adj AS manualAdj, no_play AS noPlay FROM time_ledger WHERE child = ? AND date = ?'),
      setNoPlay: this.db.prepare('INSERT INTO time_ledger(child, date, used_sec, manual_adj, no_play) VALUES (?, ?, 0, 0, ?) ON CONFLICT(child, date) DO UPDATE SET no_play = excluded.no_play'),
      insertAdjustment: this.db.prepare('INSERT INTO time_adjustments(child, date, delta_min, reason, created_at) VALUES (?, ?, ?, ?, ?)'),
      listAdjustments: this.db.prepare('SELECT id, child, date, delta_min AS deltaMin, reason, created_at AS createdAt FROM time_adjustments WHERE child = ? AND date = ? ORDER BY id'),
      clearAccountPin: this.db.prepare('UPDATE accounts SET pin_hash = NULL WHERE nick_key = ?'),
      insertDragon: this.db.prepare("INSERT INTO dragons(village, token, dragon, stage, slot, placed_at) VALUES (?, ?, ?, 'egg', ?, ?)"),
      getDragon: this.db.prepare('SELECT id, village, token, dragon, stage, slot, placed_at AS placedAt, hatched_at AS hatchedAt, fed, resting_until AS restingUntil FROM dragons WHERE id = ?'),
      listDragonsByToken: this.db.prepare('SELECT id, village, token, dragon, stage, slot, placed_at AS placedAt, hatched_at AS hatchedAt, fed, resting_until AS restingUntil FROM dragons WHERE village = ? AND token = ? ORDER BY id'),
      listNestEggs: this.db.prepare("SELECT id, village, token, dragon, stage, slot, placed_at AS placedAt, hatched_at AS hatchedAt, fed, resting_until AS restingUntil FROM dragons WHERE village = ? AND stage = 'egg' ORDER BY slot"),
      hatchDragon: this.db.prepare("UPDATE dragons SET stage = 'baby', slot = NULL, hatched_at = ? WHERE id = ?"),
      listHatched: this.db.prepare("SELECT id, village, token, dragon, stage, slot, placed_at AS placedAt, hatched_at AS hatchedAt, fed, resting_until AS restingUntil FROM dragons WHERE village = ? AND stage != 'egg' ORDER BY id"),
      feedDragon: this.db.prepare('UPDATE dragons SET fed = ? WHERE id = ?'),
      growDragon: this.db.prepare("UPDATE dragons SET stage = 'adult' WHERE id = ?"),
      addXpOffline: this.db.prepare('UPDATE players SET xp_total = xp_total + ? WHERE token = ?'),
      getSettlement: this.db.prepare('SELECT child, week_start AS weekStart, rate, bonus_cap AS bonusCap, approved, expected, settled_at AS settledAt FROM week_settlements WHERE child = ? AND week_start = ?'),
      insertSettlement: this.db.prepare('INSERT OR IGNORE INTO week_settlements(child, week_start, rate, bonus_cap, approved, expected, settled_at) VALUES (?, ?, ?, ?, ?, ?, ?)'),
      listSettlements: this.db.prepare('SELECT child, week_start AS weekStart, rate, bonus_cap AS bonusCap, approved, expected, settled_at AS settledAt FROM week_settlements WHERE child = ? ORDER BY week_start DESC LIMIT ?'),
      listAllChildren: this.db.prepare('SELECT nick_key AS nickKey, family, linked_at AS linkedAt FROM children ORDER BY linked_at'),
      addUsage: this.db.prepare('INSERT INTO time_ledger(child, date, used_sec, manual_adj) VALUES (?, ?, ?, 0) ON CONFLICT(child, date) DO UPDATE SET used_sec = used_sec + excluded.used_sec'),
      addManualAdj: this.db.prepare('INSERT INTO time_ledger(child, date, used_sec, manual_adj) VALUES (?, ?, 0, ?) ON CONFLICT(child, date) DO UPDATE SET manual_adj = manual_adj + excluded.manual_adj'),
      listLedger: this.db.prepare('SELECT child, date, used_sec AS usedSec, manual_adj AS manualAdj, no_play AS noPlay FROM time_ledger WHERE child = ? AND date >= ? ORDER BY date'),
      upsertInventory: this.db.prepare(
        'INSERT INTO inventories(token, village, json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(token) DO UPDATE SET village = excluded.village, json = excluded.json, updated_at = excluded.updated_at',
      ),
      upsertPlayer: this.db.prepare(
        `INSERT INTO players(token, village, nick, color, x, y, z, yaw, pitch, last_seen, xp_total)
         VALUES (@token, @village, @nick, @color, @x, @y, @z, @yaw, @pitch, @lastSeen, @xpTotal)
         ON CONFLICT(token) DO UPDATE SET village = excluded.village, nick = excluded.nick, color = excluded.color,
           x = excluded.x, y = excluded.y, z = excluded.z, yaw = excluded.yaw, pitch = excluded.pitch, last_seen = excluded.last_seen,
           xp_total = excluded.xp_total`,
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

  /** 가족 (M5-2) */
  getFamilyByCode(code: string): FamilyRow | undefined {
    return this.stmts.getFamilyByCode.get(code) as FamilyRow | undefined;
  }
  getFamilyById(id: number): FamilyRow | undefined {
    return this.stmts.getFamilyById.get(id) as FamilyRow | undefined;
  }
  createFamily(code: string, now: number): number {
    return Number(this.stmts.insertFamily.run(code, now).lastInsertRowid);
  }
  getParentByEmail(email: string): ParentRow | undefined {
    return this.stmts.getParentByEmail.get(email) as ParentRow | undefined;
  }
  getParentById(id: number): ParentRow | undefined {
    return this.stmts.getParentById.get(id) as ParentRow | undefined;
  }
  createParent(family: number, email: string, pwHash: string, now: number): number {
    return Number(this.stmts.insertParent.run(family, email, pwHash, now).lastInsertRowid);
  }
  createParentSession(sid: string, parentId: number, expiresAt: number): void {
    this.stmts.insertSession.run(sid, parentId, expiresAt);
  }
  getParentSession(sid: string): { sid: string; parentId: number; expiresAt: number } | undefined {
    return this.stmts.getSession.get(sid) as { sid: string; parentId: number; expiresAt: number } | undefined;
  }
  deleteParentSession(sid: string): void {
    this.stmts.deleteSession.run(sid);
  }
  getChild(nickKey: string): ChildRow | undefined {
    return this.stmts.getChild.get(nickKey) as ChildRow | undefined;
  }
  upsertChild(nickKey: string, family: number, now: number): void {
    this.stmts.upsertChild.run(nickKey, family, now);
  }
  deleteChild(nickKey: string): void {
    this.stmts.deleteChild.run(nickKey);
  }
  listChildren(family: number): ChildRow[] {
    return this.stmts.listChildren.all(family) as ChildRow[];
  }

  // ---- 부모 플레이어·할 일·기록·시간 (M5-3)
  getParentPlayer(nickKey: string): ChildRow | undefined {
    return this.stmts.getParentPlayer.get(nickKey) as ChildRow | undefined;
  }
  upsertParentPlayer(nickKey: string, family: number, now: number): void {
    this.stmts.upsertParentPlayer.run(nickKey, family, now);
  }
  deleteParentPlayer(nickKey: string): void {
    this.stmts.deleteParentPlayer.run(nickKey);
  }
  listParentPlayers(family: number): ChildRow[] {
    return this.stmts.listParentPlayers.all(family) as ChildRow[];
  }
  insertTodo(family: number, child: string, title: string, repeat: string, needsApproval: boolean, now: number): number {
    return Number(this.stmts.insertTodo.run(family, child, title, repeat, needsApproval ? 1 : 0, now).lastInsertRowid);
  }
  getTodo(id: number): TodoRow | undefined {
    return this.stmts.getTodo.get(id) as TodoRow | undefined;
  }
  listTodosByChild(child: string): TodoRow[] {
    return this.stmts.listTodosByChild.all(child) as TodoRow[];
  }
  updateTodo(row: TodoRow): void {
    this.stmts.updateTodo.run({ id: row.id, title: row.title, repeat: row.repeat, needsApproval: row.needsApproval, active: row.active });
  }
  deleteTodo(id: number): void {
    this.stmts.deleteTodoLogs.run(id);
    this.stmts.deleteTodo.run(id);
  }
  getLog(todoId: number, date: string): TodoLogRow | undefined {
    return this.stmts.getLog.get(todoId, date) as TodoLogRow | undefined;
  }
  upsertLog(todoId: number, date: string, status: TodoStatus, checkedAt: number | null, decidedAt: number | null): void {
    this.stmts.upsertLog.run(todoId, date, status, checkedAt, decidedAt);
  }
  /** 아이의 기록 (sinceDate 이후) */
  listLogsByChild(child: string, sinceDate: string): TodoLogRow[] {
    return this.stmts.listLogsByChild.all(child, sinceDate) as TodoLogRow[];
  }
  /** 가족의 승인 대기(checked) 기록 + 할 일 제목·아이 */
  listCheckedLogs(family: number): { todoId: number; date: string; checkedAt: number | null; title: string; child: string }[] {
    return this.stmts.listCheckedLogs.all(family) as { todoId: number; date: string; checkedAt: number | null; title: string; child: string }[];
  }
  getLedger(child: string, date: string): LedgerRow | undefined {
    return this.stmts.getLedger.get(child, date) as LedgerRow | undefined;
  }
  addUsage(child: string, date: string, sec: number): void {
    this.stmts.addUsage.run(child, date, sec);
  }
  addManualAdj(child: string, date: string, delta: number): void {
    this.stmts.addManualAdj.run(child, date, delta);
  }
  setNoPlay(child: string, date: string, on: boolean): void {
    this.stmts.setNoPlay.run(child, date, on ? 1 : 0);
  }
  insertAdjustment(child: string, date: string, deltaMin: number, reason: string, now: number): void {
    this.stmts.insertAdjustment.run(child, date, deltaMin, reason, now);
  }
  listAdjustments(child: string, date: string): AdjustmentRow[] {
    return this.stmts.listAdjustments.all(child, date) as AdjustmentRow[];
  }
  clearAccountPin(nickKey: string): void {
    this.stmts.clearAccountPin.run(nickKey);
  }
  // ---- 드래곤 (M6-2)
  insertDragon(village: string, token: string, dragon: string, slot: number, now: number): number {
    return Number(this.stmts.insertDragon.run(village, token, dragon, slot, now).lastInsertRowid);
  }
  getDragon(id: number): DragonRow | undefined {
    return this.stmts.getDragon.get(id) as DragonRow | undefined;
  }
  listDragonsByToken(village: string, token: string): DragonRow[] {
    return this.stmts.listDragonsByToken.all(village, token) as DragonRow[];
  }
  listNestEggs(village: string): DragonRow[] {
    return this.stmts.listNestEggs.all(village) as DragonRow[];
  }
  hatchDragon(id: number, now: number): void {
    this.stmts.hatchDragon.run(now, id);
  }
  /** 부화한 드래곤(아기·어른), id 순 */
  listHatched(village: string): DragonRow[] {
    return this.stmts.listHatched.all(village) as DragonRow[];
  }
  feedDragon(id: number, fed: number): void {
    this.stmts.feedDragon.run(fed, id);
  }
  growDragon(id: number): void {
    this.stmts.growDragon.run(id);
  }
  /** 접속 안 한 주인에게 경험치 (드래곤 성장, M6-3) */
  addXpOffline(token: string, amount: number): void {
    this.stmts.addXpOffline.run(amount, token);
  }

  getSettlement(child: string, weekStart: string): SettlementRow | undefined {
    return this.stmts.getSettlement.get(child, weekStart) as SettlementRow | undefined;
  }
  /** 이미 있으면 그대로 둔다 (정산은 한 번만) */
  insertSettlement(row: SettlementRow): void {
    this.stmts.insertSettlement.run(row.child, row.weekStart, row.rate, row.bonusCap, row.approved, row.expected, row.settledAt);
  }
  listSettlements(child: string, limit = 8): SettlementRow[] {
    return this.stmts.listSettlements.all(child, limit) as SettlementRow[];
  }
  listAllChildren(): ChildRow[] {
    return this.stmts.listAllChildren.all() as ChildRow[];
  }

  private ensureColumn(table: string, column: string, ddl: string): void {
    const cols = this.db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === column)) this.db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  }
  listLedger(child: string, sinceDate: string): LedgerRow[] {
    return this.stmts.listLedger.all(child, sinceDate) as LedgerRow[];
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
