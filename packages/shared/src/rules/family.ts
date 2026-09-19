/**
 * 가족 규칙 (M5-3·M5-4, docs/FAMILY-SYSTEM.md) — 순수 함수.
 *
 * - data/family-rules.json 검증 (아들이 정한 값: 평일 20분·주말 30분·보너스 한도 5분)
 * - 서울 날짜·요일 (시간 계산은 전부 서버, Asia/Seoul. 클라 시계는 믿지 않는다)
 * - 오늘 카드: 할 일 상태 + 남은 시간 = 기본 + 오늘 보너스 + 수동 조정 − 쓴 시간
 * - 규칙 4: 할 일 보상은 시간만. 규칙 5: 기본 시간은 서버가 절대 깎지 않는다(수동 조정만 음수가 될 수 있다)
 *
 * Date.now() 는 여기서 쓰지 않는다 — 서버가 now 를 넘긴다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const HHMM = /^(?:[01]\d|2[0-3]):[0-5]\d$|^24:00$/;
const WEEKDAYS = ['0', '1', '2', '3', '4', '5', '6'] as const;

const RulesFile = z
  .object({
    _comment: z.string().optional(),
    maxBonusMinutesPerDay: z.number().int().min(0, '0 이상이어야 해요'),
    bonusMinutesFullCompletion: z.number().int().min(0, '0 이상이어야 해요'),
    baseMinutes: z.record(z.string(), z.number().int().min(0, '0 이상이어야 해요')),
    blockedRanges: z.record(z.string(), z.array(z.tuple([z.string().regex(HHMM, 'HH:MM 꼴이어야 해요'), z.string().regex(HHMM, 'HH:MM 꼴이어야 해요')]))),
    weeklySettlement: z
      .object({
        runAt: z.string(),
        timezone: z.string(),
        firstWeekBonusCap: z.number().int().min(0, '0 이상이어야 해요'),
        tiers: z
          .array(
            z.object({
              minRate: z.number().min(0, '0~1 사이여야 해요').max(1, '0~1 사이여야 해요'),
              bonusCap: z.number().int().min(0, '0 이상이어야 해요'),
              message: z.string(),
            }),
          )
          .min(1, '구간이 하나는 있어야 해요'),
      })
      .loose(),
    idleLogoutMinutes: z.number().int().min(1, '1 이상이어야 해요'),
    warnBeforeEndMinutes: z.array(z.number().int().min(1, '1 이상이어야 해요')),
    expeditionStartMarginMinutes: z.number().int().min(0, '0 이상이어야 해요'),
    parentSelfLimitEnabled: z.boolean(),
  })
  .loose();

export type FamilyRules = Readonly<z.infer<typeof RulesFile>>;

export function parseFamilyRules(raw: unknown, fileName = 'data/family-rules.json'): FamilyRules {
  const result = RulesFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const r = result.data;
  const problems: string[] = [];
  for (const d of WEEKDAYS) {
    if (r.baseMinutes[d] === undefined) problems.push(`baseMinutes 에 요일 "${d}" 이 없어요 (0=일 … 6=토, 7개 다 적어요)`);
    if (r.blockedRanges[d] === undefined) problems.push(`blockedRanges 에 요일 "${d}" 이 없어요`);
  }
  for (const t of r.weeklySettlement.tiers) if (t.bonusCap > r.maxBonusMinutesPerDay) problems.push(`tiers 의 bonusCap ${t.bonusCap} 이 maxBonusMinutesPerDay(${r.maxBonusMinutesPerDay})보다 커요`);
  if (r.weeklySettlement.firstWeekBonusCap > r.maxBonusMinutesPerDay) problems.push(`firstWeekBonusCap 이 maxBonusMinutesPerDay 보다 커요`);
  if (problems.length) throw new DataError(fileName, problems);
  return r;
}

// ---------------------------------------------------------------- 서울 시간

const SEOUL_OFFSET_MS = 9 * 3_600_000;

export interface SeoulTime {
  /** 'YYYY-MM-DD' */
  date: string;
  /** 0=일 … 6=토 */
  weekday: number;
  /** 그날 0시부터 지난 분 */
  minuteOfDay: number;
}

/** UTC ms → 서울 날짜·요일·분. 서머타임 없음(KST 고정 +9) */
export function seoulTime(nowMs: number): SeoulTime {
  const d = new Date(nowMs + SEOUL_OFFSET_MS);
  const y = d.getUTCFullYear(),
    m = d.getUTCMonth() + 1,
    day = d.getUTCDate();
  return {
    date: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    weekday: d.getUTCDay(),
    minuteOfDay: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

/** 'HH:MM' → 분 (24:00 = 1440) */
export function hhmmToMinutes(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** 지금 접속 불가 시간대인가 (표시용 — 제한은 M5-4 에서 켠다) */
export function isBlockedNow(rules: FamilyRules, t: SeoulTime): boolean {
  const ranges = rules.blockedRanges[String(t.weekday)] ?? [];
  return ranges.some(([a, b]) => t.minuteOfDay >= hhmmToMinutes(a) && t.minuteOfDay < hhmmToMinutes(b));
}

/** 다음에 열리는 시각 'HH:MM' (지금 막혀 있을 때). 오늘 안에 안 열리면 null */
export function nextOpenHHMM(rules: FamilyRules, t: SeoulTime): string | null {
  const ranges = (rules.blockedRanges[String(t.weekday)] ?? []).map(([a, b]) => [hhmmToMinutes(a), hhmmToMinutes(b)] as const);
  let m = t.minuteOfDay;
  for (let guard = 0; guard < 10; guard++) {
    const hit = ranges.find(([a, b]) => m >= a && m < b);
    if (!hit) return m >= 1440 ? null : `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    m = hit[1];
  }
  return null;
}

// ---------------------------------------------------------------- 시간 계산

export function baseMinutesFor(rules: FamilyRules, weekday: number): number {
  return rules.baseMinutes[String(weekday)] ?? 0;
}

/**
 * 지난주 달성률 → 이번 주 하루 보너스 한도. 기록이 없는 첫 주는 firstWeekBonusCap.
 * 구간표는 minRate 큰 것부터 본다.
 */
export function computeBonusCap(lastWeekRate: number | null, rules: FamilyRules): number {
  const cap = lastWeekRate === null ? rules.weeklySettlement.firstWeekBonusCap : ([...rules.weeklySettlement.tiers].sort((a, b) => b.minRate - a.minRate).find((t) => lastWeekRate >= t.minRate)?.bonusCap ?? 0);
  return Math.min(cap, rules.maxBonusMinutesPerDay);
}

/** 이번 주 문구 (아이 화면). 첫 주는 null */
export function bonusCapMessage(lastWeekRate: number | null, rules: FamilyRules): string | null {
  if (lastWeekRate === null) return null;
  return [...rules.weeklySettlement.tiers].sort((a, b) => b.minRate - a.minRate).find((t) => lastWeekRate >= t.minRate)?.message ?? null;
}

/** 오늘 얻은 보너스 = min(한도, round(승인 / 전체 × 한도)). 할 일이 없으면 0 */
export function computeTodayBonus(approved: number, total: number, cap: number): number {
  if (total <= 0 || cap <= 0) return 0;
  return Math.min(cap, Math.round((Math.min(approved, total) / total) * cap));
}

// ---------------------------------------------------------------- 할 일

/** 반복: 매일 / 한 번 / 요일 목록(0=일 … 6=토) */
export type TodoRepeat = 'daily' | 'once' | readonly number[];
export type TodoStatus = 'pending' | 'checked' | 'approved' | 'rejected';

export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly repeat: TodoRepeat;
  readonly needsApproval: boolean;
  readonly active: boolean;
}
export interface TodoLog {
  readonly todoId: number;
  /** 'YYYY-MM-DD' */
  readonly date: string;
  readonly status: TodoStatus;
}

/** 저장용 문자열 ↔ 반복. 'daily' | 'once' | '1,2,3' */
export function repeatToString(r: TodoRepeat): string {
  return typeof r === 'string' ? r : r.join(',');
}
export function repeatFromString(s: string): TodoRepeat {
  if (s === 'daily' || s === 'once') return s;
  return s
    .split(',')
    .map((x) => Number(x))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
}
/** 반복 → 아이가 읽는 말 */
export function repeatLabel(r: TodoRepeat): string {
  if (r === 'daily') return '매일';
  if (r === 'once') return '한 번';
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  const s = [...r].sort().join('');
  if (s === '12345') return '평일';
  if (s === '06') return '주말';
  return [...r].sort().map((d) => names[d]).join('·');
}

/** 이 할 일이 그날 카드에 뜨는가. '한 번'짜리는 승인될 때까지 매일 뜬다 */
export function todoDueOn(todo: Todo, weekday: number, doneBefore: boolean): boolean {
  if (!todo.active) return false;
  if (todo.repeat === 'daily') return true;
  if (todo.repeat === 'once') return !doneBefore;
  return todo.repeat.includes(weekday);
}

export interface TodayTodo {
  id: number;
  title: string;
  needsApproval: boolean;
  status: TodoStatus;
}

/** 아이 화면 "오늘 카드" — 서버가 만들어 보내고 클라는 그대로 그린다 */
export interface TodayCard {
  date: string;
  weekday: number;
  /** 요일 기본 시간(분). 서버가 절대 깎지 않는다 */
  baseMin: number;
  /** 오늘의 보너스 한도(분) */
  bonusCap: number;
  /** 오늘 얻은 보너스(분) */
  bonusMin: number;
  /** 부모 수동 조정(분, ±) */
  manualAdj: number;
  usedMin: number;
  remainingMin: number;
  /** 시간 제한을 실제로 거는가. false 면 표시만 (아빠 2026-09-19: 테스트 동안 제한 없음) */
  enforced: boolean;
  /** 지금 접속 불가 시간대인가 (표시용) */
  blocked: boolean;
  todos: TodayTodo[];
}

export interface TodayInput {
  todos: readonly Todo[];
  /** 이 아이의 기록 전부(또는 최근). 오늘 것과 '한 번' 완료 판정에 쓴다 */
  logs: readonly TodoLog[];
  time: SeoulTime;
  rules: FamilyRules;
  /** 이번 주 보너스 한도 (지난주 정산 결과). null 이면 첫 주 */
  lastWeekRate: number | null;
  usedSec: number;
  manualAdj: number;
  enforced: boolean;
}

export function buildTodayCard(inp: TodayInput): TodayCard {
  const { time, rules } = inp;
  const todayLogs = new Map<number, TodoLog>();
  const doneBefore = new Set<number>();
  for (const l of inp.logs) {
    if (l.date === time.date) todayLogs.set(l.todoId, l);
    else if (l.date < time.date && l.status === 'approved') doneBefore.add(l.todoId);
  }
  const todos: TodayTodo[] = [];
  for (const t of inp.todos) {
    if (!todoDueOn(t, time.weekday, doneBefore.has(t.id))) continue;
    todos.push({ id: t.id, title: t.title, needsApproval: t.needsApproval, status: todayLogs.get(t.id)?.status ?? 'pending' });
  }
  const approved = todos.filter((t) => t.status === 'approved').length;
  const bonusCap = computeBonusCap(inp.lastWeekRate, rules);
  const bonusMin = computeTodayBonus(approved, todos.length, bonusCap);
  const baseMin = baseMinutesFor(rules, time.weekday);
  const usedMin = Math.floor(inp.usedSec / 60);
  return {
    date: time.date,
    weekday: time.weekday,
    baseMin,
    bonusCap,
    bonusMin,
    manualAdj: inp.manualAdj,
    usedMin,
    remainingMin: Math.max(0, baseMin + bonusMin + inp.manualAdj - usedMin),
    enforced: inp.enforced,
    blocked: isBlockedNow(rules, time),
    todos,
  };
}

/** 체크 → 다음 상태. 승인 필요 없으면 바로 approved */
export function statusAfterCheck(todo: Todo): TodoStatus {
  return todo.needsApproval ? 'checked' : 'approved';
}

/** 원정 출발 조건 (M5-4 에서 켠다): 남은 시간 ≥ 원정 길이 + 여유 */
export function canStartExpedition(remainingMin: number, expeditionMin: number, rules: FamilyRules): boolean {
  return remainingMin >= expeditionMin + rules.expeditionStartMarginMinutes;
}
