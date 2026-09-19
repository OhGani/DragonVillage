/**
 * 가족 연결 (M5-2·M5-3, FAMILY-SYSTEM.md): 부모 계정(이메일 + 비밀번호), 가족 코드 6자리, 아이(닉네임 계정) 연결,
 * 할 일·승인·오늘 카드·플레이 시간 기록.
 *
 * - 부모만 이메일을 받는다(개인정보 최소). 비밀번호는 scrypt 해시. 로그인은 쿠키 세션(sid, 30일).
 * - 가족은 부모가 가입할 때 하나 생기고 코드 6자리를 받는다. 아이는 게임 안에서 가족 코드 + 자기 PIN 으로 연결한다.
 * - 할 일은 아이별. 아이가 게임에서 체크 → 승인 필요 없으면 바로 approved, 필요하면 checked → 부모가 /family 또는 게임 안(부모 플레이어)에서 승인·거절.
 * - 시간: 접속 중 1분마다 used_sec 누적(세션이 addUsage 호출). 오늘 카드는 순수 함수(shared/rules/family)가 만든다.
 *   enforceTime 이 false 면 표시만 하고 막지 않는다 (아빠 2026-09-19: 테스트 동안 제한 없음).
 * - 규칙 4: 할 일 보상은 시간만. 규칙 5: 기본 시간은 서버가 절대 깎지 않는다.
 * - 부모 여러 명(엄마)은 v1.1: 같은 가족 코드로 가입하기.
 */
import { type ApprovalItem, type FamilyRules, type ServerJson, type Todo, type TodayCard, type TodoRepeat, buildTodayCard, repeatFromString, repeatToString, seoulTime, statusAfterCheck } from '@dragon-village/shared';
import { FAMILY_RULES } from '@dragon-village/shared/data';
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AccountService } from './accounts';
import { nickKey } from './accounts';
import type { Storage, TodoRow } from './storage';

export const SESSION_DAYS = 30;
const LOGIN_MAX_TRIES = 5;
const LOGIN_LOCK_MS = 10 * 60_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TITLE_MAX = 30;

export interface Parent {
  id: number;
  familyId: number;
  familyCode: string;
  email: string;
}

function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(pw, salt, 32).toString('hex')}`;
}
function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const h = scryptSync(pw, Buffer.from(saltHex, 'hex'), 32);
  const want = Buffer.from(hashHex, 'hex');
  return h.length === want.length && timingSafeEqual(h, want);
}

export type SignupResult = { ok: true; parent: Parent; sid: string } | { ok: false; reason: 'BAD_EMAIL' | 'WEAK_PASSWORD' | 'EMAIL_TAKEN' };
export type LoginResult = { ok: true; parent: Parent; sid: string } | { ok: false; reason: 'BAD_LOGIN' | 'LOCKED' };
export type LinkResult = { ok: true; familyCode: string } | { ok: false; reason: 'NO_FAMILY' | 'NO_SUCH_NICK' | 'NO_PIN' | 'BAD_PIN' | 'PIN_LOCKED' | 'ALREADY_LINKED' | 'IS_PARENT' };
export type CheckResult = { ok: true; card: TodayCard; needsApproval: boolean } | { ok: false; reason: 'NOT_CHILD' | 'NO_TODO' | 'NOT_TODAY' | 'ALREADY' };

/** 부모 화면용 할 일 한 줄 */
export interface TodoView {
  id: number;
  title: string;
  repeat: string;
  needsApproval: boolean;
  active: boolean;
}
/** 승인 대기 한 줄 */
export interface PendingApproval {
  todoId: number;
  date: string;
  child: string;
  title: string;
  checkedAt: number;
}

export interface FamilyOptions {
  /** 시간 제한을 실제로 거는가 (M5-4). 기본 false = 표시만 */
  enforceTime?: boolean;
}

type Listener = (msg: ServerJson) => void;

export class FamilyService {
  private readonly fails = new Map<string, number[]>();
  /** 접속 중인 플레이어(닉 키) → 메시지 보내기. 승인·카드 갱신을 실시간으로 밀어 준다 */
  private readonly listeners = new Map<string, Set<Listener>>();
  readonly enforceTime: boolean;

  constructor(
    private readonly storage: Storage,
    private readonly accounts: AccountService,
    readonly rules: FamilyRules = FAMILY_RULES,
    opts: FamilyOptions = {},
  ) {
    this.enforceTime = opts.enforceTime ?? false;
  }

  private newFamilyCode(): string {
    for (let i = 0; i < 100; i++) {
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      if (!this.storage.getFamilyByCode(code)) return code;
    }
    throw new Error('가족 코드를 만들 수 없어요');
  }

  // ---------------------------------------------------------------- 부모 계정

  /** 부모 가입: 새 가족 + 부모 + 로그인 세션 */
  signup(emailRaw: string, password: string, now = Date.now()): SignupResult {
    const email = emailRaw.trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 120) return { ok: false, reason: 'BAD_EMAIL' };
    if (typeof password !== 'string' || password.length < 6 || password.length > 100) return { ok: false, reason: 'WEAK_PASSWORD' };
    if (this.storage.getParentByEmail(email)) return { ok: false, reason: 'EMAIL_TAKEN' };
    const familyId = this.storage.createFamily(this.newFamilyCode(), now);
    const parentId = this.storage.createParent(familyId, email, hashPassword(password), now);
    const parent = this.parentById(parentId)!;
    return { ok: true, parent, sid: this.newSession(parentId, now) };
  }

  login(emailRaw: string, password: string, now = Date.now()): LoginResult {
    const email = emailRaw.trim().toLowerCase();
    const recent = (this.fails.get(email) ?? []).filter((t) => now - t < LOGIN_LOCK_MS);
    if (recent.length >= LOGIN_MAX_TRIES) return { ok: false, reason: 'LOCKED' };
    const row = this.storage.getParentByEmail(email);
    if (!row || !verifyPassword(password, row.pwHash)) {
      recent.push(now);
      this.fails.set(email, recent);
      return { ok: false, reason: 'BAD_LOGIN' };
    }
    this.fails.delete(email);
    return { ok: true, parent: this.parentById(row.id)!, sid: this.newSession(row.id, now) };
  }

  private newSession(parentId: number, now: number): string {
    const sid = randomBytes(24).toString('hex');
    this.storage.createParentSession(sid, parentId, now + SESSION_DAYS * 86_400_000);
    return sid;
  }

  logout(sid: string): void {
    this.storage.deleteParentSession(sid);
  }

  /** 쿠키의 sid → 부모. 만료됐으면 null */
  parentBySession(sid: string | null | undefined, now = Date.now()): Parent | null {
    if (!sid || !/^[a-f0-9]{48}$/.test(sid)) return null;
    const s = this.storage.getParentSession(sid);
    if (!s || s.expiresAt < now) return null;
    return this.parentById(s.parentId);
  }

  private parentById(id: number): Parent | null {
    const p = this.storage.getParentById(id);
    if (!p) return null;
    const f = this.storage.getFamilyById(p.family);
    if (!f) return null;
    return { id: p.id, familyId: p.family, familyCode: f.code, email: p.email };
  }

  // ---------------------------------------------------------------- 아이·부모 플레이어 연결

  /** 아이 연결: 가족 코드 + 아이 자신의 PIN (게임 안에서, 그 계정의 토큰으로) */
  linkChild(familyCode: string, nick: string, pin: string, now = Date.now()): LinkResult {
    const family = this.storage.getFamilyByCode(String(familyCode).trim());
    if (!family) return { ok: false, reason: 'NO_FAMILY' };
    const key = nickKey(nick);
    if (this.storage.getParentPlayer(key)) return { ok: false, reason: 'IS_PARENT' }; // 부모 플레이어는 아이가 될 수 없다 (아빠가 실수로 눌렀던 것, 2026-09-19)
    const existing = this.storage.getChild(key);
    if (existing && existing.family === family.id) return { ok: true, familyCode: family.code };
    const check = this.accounts.resume(nick, pin, now); // PIN 확인만 (토큰은 쓰지 않는다)
    if (!check.ok) return { ok: false, reason: check.reason };
    this.storage.upsertChild(key, family.id, now);
    return { ok: true, familyCode: family.code };
  }

  /** 이 닉네임이 어느 가족의 아이인가 */
  familyOfNick(nick: string): string | null {
    const c = this.storage.getChild(nickKey(nick));
    if (!c) return null;
    return this.storage.getFamilyById(c.family)?.code ?? null;
  }

  children(familyId: number): { nick: string; linkedAt: number }[] {
    return this.storage.listChildren(familyId).map((c) => ({ nick: this.storage.getAccountByNick(c.nickKey)?.nick ?? c.nickKey, linkedAt: c.linkedAt }));
  }

  unlinkChild(familyId: number, nick: string): boolean {
    const key = nickKey(nick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return false;
    this.storage.deleteChild(key);
    return true;
  }

  /**
   * 부모의 플레이어 계정 연결 (M5-3): 부모 화면에서 자기 게임 이름 + PIN → 그 플레이어가 게임 중이면 승인 카드를 받는다.
   * 아이로 연결된 이름은 부모로 못 쓴다
   */
  linkParentPlayer(familyId: number, nick: string, pin: string, now = Date.now()): LinkResult {
    const family = this.storage.getFamilyById(familyId);
    if (!family) return { ok: false, reason: 'NO_FAMILY' };
    const key = nickKey(nick);
    if (this.storage.getChild(key)) return { ok: false, reason: 'ALREADY_LINKED' };
    const existing = this.storage.getParentPlayer(key);
    if (existing && existing.family === familyId) return { ok: true, familyCode: family.code };
    const check = this.accounts.resume(nick, pin, now);
    if (!check.ok) return { ok: false, reason: check.reason };
    this.storage.upsertParentPlayer(key, familyId, now);
    return { ok: true, familyCode: family.code };
  }

  unlinkParentPlayer(familyId: number, nick: string): boolean {
    const key = nickKey(nick);
    const p = this.storage.getParentPlayer(key);
    if (!p || p.family !== familyId) return false;
    this.storage.deleteParentPlayer(key);
    return true;
  }

  parentPlayers(familyId: number): string[] {
    return this.storage.listParentPlayers(familyId).map((p) => this.storage.getAccountByNick(p.nickKey)?.nick ?? p.nickKey);
  }

  /** 이 닉네임이 어느 가족의 부모 플레이어인가 (가족 id). 아니면 null */
  parentFamilyIdOfNick(nick: string): number | null {
    return this.storage.getParentPlayer(nickKey(nick))?.family ?? null;
  }

  /** 이 닉네임이 어느 가족의 부모 플레이어인가 (가족 코드) */
  parentFamilyOfNick(nick: string): string | null {
    const id = this.parentFamilyIdOfNick(nick);
    return id === null ? null : (this.storage.getFamilyById(id)?.code ?? null);
  }

  // ---------------------------------------------------------------- 실시간 알림

  attach(nick: string, send: Listener): void {
    const key = nickKey(nick);
    let set = this.listeners.get(key);
    if (!set) this.listeners.set(key, (set = new Set()));
    set.add(send);
  }

  detach(nick: string, send: Listener): void {
    const key = nickKey(nick);
    const set = this.listeners.get(key);
    if (!set) return;
    set.delete(send);
    if (set.size === 0) this.listeners.delete(key);
  }

  private notify(key: string, msg: ServerJson): void {
    for (const send of this.listeners.get(key) ?? []) send(msg);
  }

  private notifyParents(familyId: number, msg: ServerJson): void {
    for (const p of this.storage.listParentPlayers(familyId)) this.notify(p.nickKey, msg);
  }

  /** 부모 플레이어의 게임 화면용: 승인 기다리는 목록 */
  pendingItems(familyId: number): ApprovalItem[] {
    return this.pendingApprovals(familyId).map((p) => ({ id: p.todoId, date: p.date, child: p.child, title: p.title }));
  }

  /** 승인 대기 목록이 바뀌면 접속 중인 부모 플레이어에게 */
  private pushPending(familyId: number): void {
    this.notifyParents(familyId, { t: 'pending', items: this.pendingItems(familyId) });
  }

  /** 부모 플레이어의 게임 화면용: 승인 기다리는 목록 */
  pendingItems(familyId: number): ApprovalItem[] {
    return this.pendingApprovals(familyId).map((p) => ({ id: p.todoId, date: p.date, child: p.child, title: p.title }));
  }

  /** 승인 대기 목록이 바뀌면 접속 중인 부모 플레이어에게 */
  private pushPending(familyId: number): void {
    this.notifyParents(familyId, { t: 'pending', items: this.pendingItems(familyId) });
  }

  // ---------------------------------------------------------------- 할 일

  private toTodo(r: TodoRow): Todo {
    return { id: r.id, title: r.title, repeat: repeatFromString(r.repeat), needsApproval: r.needsApproval === 1, active: r.active === 1 };
  }

  private toView(r: TodoRow): TodoView {
    return { id: r.id, title: r.title, repeat: r.repeat, needsApproval: r.needsApproval === 1, active: r.active === 1 };
  }

  /** 아이의 할 일 목록 (부모 화면) */
  todosOf(familyId: number, childNick: string): TodoView[] {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return [];
    return this.storage.listTodosByChild(key).map((r) => this.toView(r));
  }

  addTodo(familyId: number, childNick: string, titleRaw: string, repeat: TodoRepeat, needsApproval: boolean, now = Date.now()): TodoView | null {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return null;
    const title = String(titleRaw ?? '')
      .replace(/\p{Cc}/gu, '')
      .trim()
      .slice(0, TITLE_MAX);
    if (!title) return null;
    if (Array.isArray(repeat) && repeat.length === 0) return null;
    const id = this.storage.insertTodo(familyId, key, title, repeatToString(repeat), needsApproval, now);
    this.pushCard(key, now);
    return this.toView(this.storage.getTodo(id)!);
  }

  updateTodo(familyId: number, id: number, patch: { title?: string; repeat?: TodoRepeat; needsApproval?: boolean; active?: boolean }, now = Date.now()): boolean {
    const r = this.storage.getTodo(id);
    if (!r || r.family !== familyId) return false;
    const title = patch.title === undefined ? r.title : String(patch.title).replace(/\p{Cc}/gu, '').trim().slice(0, TITLE_MAX);
    if (!title) return false;
    if (Array.isArray(patch.repeat) && patch.repeat.length === 0) return false;
    this.storage.updateTodo({
      ...r,
      title,
      repeat: patch.repeat === undefined ? r.repeat : repeatToString(patch.repeat),
      needsApproval: patch.needsApproval === undefined ? r.needsApproval : patch.needsApproval ? 1 : 0,
      active: patch.active === undefined ? r.active : patch.active ? 1 : 0,
    });
    this.pushCard(r.child, now);
    this.pushPending(r.family);
    return true;
  }

  deleteTodo(familyId: number, id: number, now = Date.now()): boolean {
    const r = this.storage.getTodo(id);
    if (!r || r.family !== familyId) return false;
    this.storage.deleteTodo(id);
    this.pushCard(r.child, now);
    this.pushPending(r.family);
    return true;
  }

  /** 승인 기다리는 것 (부모 화면 맨 위) */
  pendingApprovals(familyId: number): PendingApproval[] {
    return this.storage.listCheckedLogs(familyId).map((l) => ({ todoId: l.todoId, date: l.date, child: this.storage.getAccountByNick(l.child)?.nick ?? l.child, title: l.title, checkedAt: l.checkedAt ?? 0 }));
  }

  // ---------------------------------------------------------------- 오늘 카드·시간

  /** 아이의 오늘 카드. 아이가 아니면 null */
  todayCard(nick: string, now = Date.now()): TodayCard | null {
    const key = nickKey(nick);
    const c = this.storage.getChild(key);
    if (!c) return null;
    return this.cardFor(key, now);
  }

  private cardFor(key: string, now: number): TodayCard {
    const time = seoulTime(now);
    const ledger = this.storage.getLedger(key, time.date);
    const since = seoulTime(now - 40 * 86_400_000).date; // '한 번' 완료 판정용 최근 40일
    return buildTodayCard({
      todos: this.storage.listTodosByChild(key).map((r) => this.toTodo(r)),
      logs: this.storage.listLogsByChild(key, since),
      time,
      rules: this.rules,
      lastWeekRate: null, // M5-5 주간 정산 전까지는 첫 주 한도
      usedSec: ledger?.usedSec ?? 0,
      manualAdj: ledger?.manualAdj ?? 0,
      enforced: this.enforceTime,
    });
  }

  /** 카드가 바뀌었을 때 접속 중인 아이에게 밀어 준다 */
  private pushCard(key: string, now: number): void {
    if (!this.listeners.has(key)) return;
    this.notify(key, { t: 'today', card: this.cardFor(key, now) });
  }

  /** 아이가 할 일을 체크했다 */
  checkTodo(nick: string, todoId: number, now = Date.now()): CheckResult {
    const key = nickKey(nick);
    const c = this.storage.getChild(key);
    if (!c) return { ok: false, reason: 'NOT_CHILD' };
    const r = this.storage.getTodo(todoId);
    if (!r || r.child !== key || r.active !== 1) return { ok: false, reason: 'NO_TODO' };
    const card = this.cardFor(key, now);
    const item = card.todos.find((t) => t.id === todoId);
    if (!item) return { ok: false, reason: 'NOT_TODAY' };
    if (item.status !== 'pending' && item.status !== 'rejected') return { ok: false, reason: 'ALREADY' };
    const todo = this.toTodo(r);
    const status = statusAfterCheck(todo);
    this.storage.upsertLog(todoId, card.date, status, now, status === 'approved' ? now : null);
    if (status === 'checked') {
      this.notifyParents(c.family, { t: 'approvalAsk', id: todoId, date: card.date, child: this.storage.getAccountByNick(key)?.nick ?? key, title: r.title });
      this.pushPending(c.family);
    }
    return { ok: true, card: this.cardFor(key, now), needsApproval: status === 'checked' };
  }

  /** 부모가 승인·거절했다 (부모 화면 또는 게임 안 부모 플레이어). 체크 전(pending)이어도 승인은 된다 */
  decideTodo(familyId: number, todoId: number, date: string, approve: boolean, now = Date.now()): boolean {
    const r = this.storage.getTodo(todoId);
    if (!r || r.family !== familyId) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const log = this.storage.getLog(todoId, date);
    if (log?.status === 'approved' && approve) return true;
    if (!approve && log?.status !== 'checked') return false;
    this.storage.upsertLog(todoId, date, approve ? 'approved' : 'rejected', log?.checkedAt ?? now, now);
    this.pushCard(r.child, now);
    this.pushPending(familyId);
    return true;
  }

  /** 접속 중 시간 누적 (세션이 1분마다). 아이가 아니면 null */
  addUsage(nick: string, sec: number, now = Date.now()): TodayCard | null {
    const key = nickKey(nick);
    if (!this.storage.getChild(key)) return null;
    this.storage.addUsage(key, seoulTime(now).date, Math.max(0, Math.floor(sec)));
    return this.cardFor(key, now);
  }

  /** 부모 화면용: 아이별 오늘 카드 + 할 일 */
  childrenStatus(familyId: number, now = Date.now()): { nick: string; linkedAt: number; online: boolean; today: TodayCard; todos: TodoView[] }[] {
    return this.storage.listChildren(familyId).map((c) => ({
      nick: this.storage.getAccountByNick(c.nickKey)?.nick ?? c.nickKey,
      linkedAt: c.linkedAt,
      online: this.listeners.has(c.nickKey),
      today: this.cardFor(c.nickKey, now),
      todos: this.storage.listTodosByChild(c.nickKey).map((r) => this.toView(r)),
    }));
  }
}
