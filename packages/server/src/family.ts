/**
 * 가족 연결 (M5-2·M5-3, FAMILY-SYSTEM.md): 부모 계정(이메일 + 비밀번호), 가족 코드 6자리, 아이(닉네임 계정) 연결,
 * 할 일·승인·오늘 카드·플레이 시간 기록.
 *
 * - 부모만 이메일을 받는다(개인정보 최소). 비밀번호는 scrypt 해시. 로그인은 쿠키 세션(sid, 30일).
 * - 가족은 부모가 가입할 때 하나 생기고 코드 6자리를 받는다. 아이는 게임 안에서 가족 코드 + 자기 PIN 으로 연결한다.
 * - 할 일은 아이별. 아이가 게임에서 체크 → 승인 필요 없으면 바로 approved, 필요하면 checked → 부모가 /family 또는 게임 안(부모 플레이어)에서 승인·거절.
 * - 시간: 접속 중 1분마다 used_sec 누적(세션이 addUsage 호출). 오늘 카드는 순수 함수(shared/rules/family)가 만든다.
 *   enforceTime 이 false 면 표시만 하고 막지 않는다 (아빠 2026-09-19: 테스트 동안 제한 없음).
 * - 부모 플레이어(게임 닉네임을 가족에 연결한 부모)도 아이와 같은 분량·같은 시간대만 논다 (#298, parentCardFor).
 * - 규칙 4: 할 일 보상은 시간만. 규칙 5: 기본 시간은 서버가 절대 깎지 않는다.
 * - 부모 여러 명(엄마)은 v1.1: 같은 가족 코드로 가입하기.
 */
import {
  type ApprovalItem,
  type FamilyRules,
  type ServerJson,
  type TimeUpReason,
  type Todo,
  type TodayCard,
  type TodoRepeat,
  buildTodayCard,
  canStartExpedition,
  computeBonusCap,
  lastWeekWindow,
  weekStartOf,
  weeklyRate,
  repeatFromString,
  repeatToString,
  seoulTime,
  statusAfterCheck,
  timeUpMessage,
  timeUpReason,
} from '@dragon-village/shared';
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
const ADJUST_MAX = 120;
const REASON_MAX = 40;

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
  /** 서버를 켠 시각 (시험용). 제한을 처음 켠 날을 적을 때 쓴다 */
  now?: number;
}

type Listener = (msg: ServerJson) => void;

export class FamilyService {
  private readonly fails = new Map<string, number[]>();
  /** 접속 중인 플레이어(닉 키) → 메시지 보내기. 승인·카드 갱신을 실시간으로 밀어 준다 */
  private readonly listeners = new Map<string, Set<Listener>>();
  readonly enforceTime: boolean;
  /**
   * 시간 제한을 (다시) 켠 날 'YYYY-MM-DD' (#302). 꺼져 있으면 null.
   * 제한이 꺼져 있던 동안은 할 일을 해도 얻는 게 없어 아무도 안 한다 — 그 기간을 '지난주 달성률 0%'로 쳐서 다시 켠 주의 보너스 한도를 0 으로 만들면 안 된다.
   * 그래서 주간 정산은 이 날부터의 날짜만 센다. 지난주가 통째로 이 날 이전이면 정산 없음 = 첫 주 한도
   */
  readonly enforceSince: string | null;

  constructor(
    private readonly storage: Storage,
    private readonly accounts: AccountService,
    readonly rules: FamilyRules = FAMILY_RULES,
    opts: FamilyOptions = {},
  ) {
    this.enforceTime = opts.enforceTime ?? false;
    if (!this.enforceTime) {
      this.storage.delMeta('enforce_since'); // 꺼 두면 잊는다 — 다음에 켜는 날이 새 시작
      this.enforceSince = null;
    } else {
      let since = this.storage.getMeta('enforce_since');
      if (!since) this.storage.setMeta('enforce_since', (since = seoulTime(opts.now ?? Date.now()).date));
      this.enforceSince = since;
    }
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

  // ---------------------------------------------------------------- 할 일

  private toTodo(r: TodoRow): Todo {
    return { id: r.id, title: r.title, repeat: repeatFromString(r.repeat), needsApproval: r.needsApproval === 1, active: r.active === 1, createdDate: seoulTime(r.createdAt).date };
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

  /** 오늘 카드: 아이는 자기 것, 부모 플레이어는 아이와 같은 분량·시간대의 카드(#298). 둘 다 아니면 null */
  todayCard(nick: string, now = Date.now()): TodayCard | null {
    return this.cardOfKey(nickKey(nick), now);
  }

  private cardOfKey(key: string, now: number): TodayCard | null {
    if (this.storage.getChild(key)) return this.cardFor(key, now);
    const pp = this.storage.getParentPlayer(key);
    return pp ? this.parentCardFor(key, pp.family, now) : null;
  }

  /**
   * 부모 플레이어의 오늘 카드 (#298, 아빠 2026-11-13 "아빠도 아들이랑 동일한 시간동안만"):
   * 아이가 오늘 받은 분량(기본 + 보너스 + 조정)·같은 접속 시간대·같은 '오늘 게임 없음'. 쓴 시간만 부모 자기 것(time_ledger 에 부모 닉네임으로).
   * 아이가 여럿이면 오늘 분량이 가장 많은 아이 기준. 가족에 아이가 없으면 null (제한 없음). 할 일 목록은 비운다 — 부모는 체크하지 않는다
   */
  private parentCardFor(key: string, familyId: number, now: number): TodayCard | null {
    let best: TodayCard | null = null,
      bestTotal = -Infinity;
    for (const c of this.storage.listChildren(familyId)) {
      const card = this.cardFor(c.nickKey, now);
      const total = card.baseMin + card.bonusMin + card.manualAdj;
      if (total > bestTotal) {
        best = card;
        bestTotal = total;
      }
    }
    if (!best) return null;
    const usedMin = Math.floor((this.storage.getLedger(key, best.date)?.usedSec ?? 0) / 60);
    return { ...best, usedMin, remainingMin: Math.max(0, bestTotal - usedMin), todos: [] };
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
      lastWeekRate: this.settlementFor(key, time.date)?.rate ?? null, // 이번 주 정산 (M5-5). 없으면 첫 주 한도
      usedSec: ledger?.usedSec ?? 0,
      manualAdj: ledger?.manualAdj ?? 0,
      enforced: this.enforceTime,
      noPlayToday: (ledger?.noPlay ?? 0) === 1,
      adjustments: this.storage.listAdjustments(key, time.date).map((a) => ({ min: a.deltaMin, reason: a.reason })),
    });
  }

  // ---------------------------------------------------------------- 주간 정산 (M5-5)

  /**
   * 이 아이의 이번 주 정산 줄. 없으면(첫 주 또는 아직 안 함) 지난주에 기록·할 일이 있었는지 보고 만든다.
   * 정산은 (아이, 주) 당 한 번만 — 나중에 지난주 기록이 바뀌어도 안 바꾼다 ("지난주가 이번 주를 정한다")
   */
  settlementFor(key: string, dateKey: string): { rate: number; bonusCap: number; approved: number; expected: number; weekStart: string } | null {
    const weekStart = weekStartOf(dateKey);
    const win = lastWeekWindow(weekStart);
    // 제한을 켠 날부터만 센다 (#302). 지난주가 통째로 그 전이면 정산 없음(첫 주 한도) — 꺼 둔 동안 0% 로 적힌 옛 정산 줄이 있어도 안 본다
    const since = this.enforceSince;
    const dates = since ? win.dates.filter((d) => d >= since) : win.dates;
    if (since && dates.length === 0) return null;
    const row = this.storage.getSettlement(key, weekStart);
    if (row) return row;
    const todos = this.storage.listTodosByChild(key).map((r) => this.toTodo(r));
    const logs = this.storage.listLogsByChild(key, win.start).filter((l) => l.date <= win.end);
    const child = this.storage.getChild(key);
    // 지난주에 연결도 안 됐고 기록도 없으면 첫 주 — 정산 없음(첫 주 한도)
    const linkedBefore = child ? seoulTime(child.linkedAt).date <= win.end : false;
    if (!linkedBefore && logs.length === 0) return null;
    // 게임을 아예 안 한 날 (#305): 쓴 시간도 없고 할 일 기록(체크·승인·거절)도 없는 날 — 그날 할 일은 다 한 것으로 센다
    const used = new Map(this.storage.listLedger(key, win.start).map((l) => [l.date, l.usedSec]));
    const idle = new Set(dates.filter((d) => (used.get(d) ?? 0) <= 0 && !logs.some((l) => l.date === d)));
    const r = weeklyRate(todos, logs, dates, idle);
    const settled = { child: key, weekStart, rate: r.rate, bonusCap: computeBonusCap(r.rate, this.rules), approved: r.approved, expected: r.expected, settledAt: Date.now() };
    this.storage.insertSettlement(settled);
    return settled;
  }

  /** 월요일 00:00(서울) 크론 + 서버 시작 보정: 모든 아이의 이번 주 정산을 만들어 둔다. 만든 아이 수 */
  settleAll(now = Date.now()): number {
    const date = seoulTime(now).date;
    let n = 0;
    for (const c of this.storage.listAllChildren()) {
      const before = this.storage.getSettlement(c.nickKey, weekStartOf(date));
      if (!before && this.settlementFor(c.nickKey, date)) {
        n++;
        this.pushCard(c.nickKey, now);
      }
    }
    return n;
  }

  /** 부모 화면용: 최근 정산 줄들 */
  settlements(familyId: number, childNick: string): { weekStart: string; rate: number; bonusCap: number; approved: number; expected: number }[] {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return [];
    return this.storage.listSettlements(key).map((s) => ({ weekStart: s.weekStart, rate: s.rate, bonusCap: s.bonusCap, approved: s.approved, expected: s.expected }));
  }

  // ---------------------------------------------------------------- 시간 조정·제한 (M5-4)

  /** 부모 수동 조정 ±분 + 사유 (규칙 5: 기본 시간은 서버가 안 깎는다 — 부모만). 아이 화면에도 보인다 */
  adjustTime(familyId: number, childNick: string, deltaMin: number, reasonRaw: string, now = Date.now()): TodayCard | null {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return null;
    if (!Number.isInteger(deltaMin) || deltaMin === 0 || Math.abs(deltaMin) > ADJUST_MAX) return null;
    const reason = String(reasonRaw ?? '')
      .replace(/\p{Cc}/gu, '')
      .trim()
      .slice(0, REASON_MAX);
    const date = seoulTime(now).date;
    this.storage.addManualAdj(key, date, deltaMin);
    this.storage.insertAdjustment(key, date, deltaMin, reason, now);
    this.pushCard(key, now);
    this.kickIfNeeded(key, now);
    return this.cardFor(key, now);
  }

  /** "오늘 게임 없음" 켜고 끄기. 제한이 켜져 있으면 접속 중인 아이는 바로 나간다 */
  setNoPlay(familyId: number, childNick: string, on: boolean, now = Date.now()): TodayCard | null {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return null;
    this.storage.setNoPlay(key, seoulTime(now).date, on);
    this.pushCard(key, now);
    this.kickIfNeeded(key, now);
    return this.cardFor(key, now);
  }

  /** 아이 PIN 초기화 (부모 화면). 다음에 아이 기기에서 들어오면 PIN 정하기 창 */
  resetChildPin(familyId: number, childNick: string): boolean {
    const key = nickKey(childNick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return false;
    return this.accounts.resetPin(childNick);
  }

  /**
   * 지금 이 아이를 들여보내면 안 되는(또는 내보내야 하는) 이유. 제한이 꺼져 있거나 아이가 아니면 null.
   * 세션이 입장 때와 1분마다 부른다
   */
  timeBlock(nick: string, now = Date.now()): { reason: Exclude<TimeUpReason, 'idle'>; message: string } | null {
    if (!this.enforceTime) return null;
    const card = this.cardOfKey(nickKey(nick), now); // 아이, 또는 부모 플레이어 (#298)
    if (!card) return null;
    const reason = timeUpReason(card);
    return reason ? { reason, message: timeUpMessage(reason, card) } : null;
  }

  /** 내보내는 말 (5분 무입력 포함) */
  timeUpText(reason: TimeUpReason, nick: string, now = Date.now()): string {
    return timeUpMessage(reason, this.cardOfKey(nickKey(nick), now));
  }

  /** 원정 출발해도 되나. 제한이 꺼져 있거나 아이가 아니면 항상 ok */
  expeditionCheck(nick: string, expeditionSec: number, now = Date.now()): { ok: true } | { ok: false; message: string } {
    if (!this.enforceTime) return { ok: true };
    const card = this.cardOfKey(nickKey(nick), now); // 부모 플레이어도 아이와 같은 조건 (#298)
    if (!card) return { ok: true };
    const expMin = Math.ceil(expeditionSec / 60);
    // 시간이 조금이라도 남아 있으면 출발 (#303). 원정 중에 끝나면 그 자리에서 나가고 모은 것은 그대로
    if (canStartExpedition(card, expMin, this.rules)) return { ok: true };
    if (card.noPlayToday) return { ok: false, message: '오늘은 게임 없는 날이에요' };
    if (card.minutesUntilBlocked <= 0) return { ok: false, message: '지금은 게임 시간이 아니에요' };
    return { ok: false, message: '오늘 게임 시간을 다 썼어요' };
  }

  /** 제한이 켜져 있고 지금 내보내야 하면, 접속 중인 아이에게 timeUp (세션이 연결을 닫는다) */
  private kickIfNeeded(key: string, now: number): void {
    if (!this.enforceTime) return;
    for (const k of this.withParents(key)) {
      if (!this.listeners.has(k)) continue;
      const card = this.cardOfKey(k, now);
      const reason = card ? timeUpReason(card) : null;
      if (card && reason) this.notify(k, { t: 'timeUp', reason, message: timeUpMessage(reason, card) });
    }
  }

  /** 카드가 바뀌었을 때 접속 중인 아이에게 밀어 준다. 아이의 분량이 바뀌면 부모 플레이어의 카드도 같이 바뀐다 (#298) */
  private pushCard(key: string, now: number): void {
    for (const k of this.withParents(key)) {
      if (!this.listeners.has(k)) continue;
      const card = this.cardOfKey(k, now);
      if (card) this.notify(k, { t: 'today', card });
    }
  }

  /** 이 닉네임 + (아이라면) 그 가족의 부모 플레이어들 */
  private withParents(key: string): string[] {
    const c = this.storage.getChild(key);
    return c ? [key, ...this.storage.listParentPlayers(c.family).map((p) => p.nickKey)] : [key];
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

  /** 접속 중 시간 누적 (세션이 1분마다). 아이도 부모 플레이어(#298)도 아니면 null */
  addUsage(nick: string, sec: number, now = Date.now()): TodayCard | null {
    const key = nickKey(nick);
    if (!this.cardOfKey(key, now)) return null;
    this.storage.addUsage(key, seoulTime(now).date, Math.max(0, Math.floor(sec)));
    return this.cardOfKey(key, now);
  }

  /** 부모 화면용: 아이별 오늘 카드 + 할 일 */
  childrenStatus(
    familyId: number,
    now = Date.now(),
  ): { nick: string; linkedAt: number; online: boolean; today: TodayCard; todos: TodoView[]; settlements: { weekStart: string; rate: number; bonusCap: number; approved: number; expected: number }[] }[] {
    return this.storage.listChildren(familyId).map((c) => ({
      nick: this.storage.getAccountByNick(c.nickKey)?.nick ?? c.nickKey,
      linkedAt: c.linkedAt,
      online: this.listeners.has(c.nickKey),
      today: this.cardFor(c.nickKey, now),
      todos: this.storage.listTodosByChild(c.nickKey).map((r) => this.toView(r)),
      settlements: this.storage.listSettlements(c.nickKey, 4).map((s) => ({ weekStart: s.weekStart, rate: s.rate, bonusCap: s.bonusCap, approved: s.approved, expected: s.expected })),
    }));
  }
}
