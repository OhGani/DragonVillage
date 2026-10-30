/**
 * 주민 거래 (#225·#228·#229): data/trades.json.
 * 가게 목록 = common(모든 주민) + 직업(jobs, 주민 번호로 정해진다 — 대장장이는 무기장이) + 그곳(places, 원정지 id).
 * 같은 물건이 겹치면 직업·그곳 값이 이긴다. buy = 에메랄드 price 개를 내고 item 을 count 개, sell = item 을 count 개 주고 에메랄드 price 개.
 * 서버가 판정한다(가방·거리).
 */
import { z } from 'zod';
import { BLACKSMITH_NAME } from './animals';
import { DataError, koreanizeMessage } from './blocks';

const RawTrade = z
  .object({
    item: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
    count: z.number().int().min(1, '1 이상이어야 해요').max(64, '64까지예요'),
    price: z.number().int().min(1, '에메랄드 1개 이상이어야 해요').max(64, '64까지예요'),
  })
  .loose();
const Lists = z.object({ _comment: z.string().optional(), buy: z.array(RawTrade).optional(), sell: z.array(RawTrade).optional() }).loose();
const RawJob = z.object({ name: z.string().min(1, '직업 이름이 비었어요').max(6, '직업 이름은 6글자까지'), buy: z.array(RawTrade).optional(), sell: z.array(RawTrade).optional() }).loose();
const TradeFile = z
  .object({
    _comment: z.string().optional(),
    currency: z.string().min(1).optional(),
    common: Lists.optional(),
    jobs: z.record(z.string(), z.union([z.string(), RawJob])).optional(),
    places: z.record(z.string(), z.union([z.string(), Lists])).optional(),
  })
  .loose();

export type TradeKind = 'buy' | 'sell';
export interface TradeDef {
  readonly kind: TradeKind;
  readonly item: string;
  readonly count: number;
  /** 에메랄드 개수 */
  readonly price: number;
}
export interface TradeLists {
  readonly buy: readonly TradeDef[];
  readonly sell: readonly TradeDef[];
}
export interface JobDef extends TradeLists {
  readonly id: string;
  /** 한국어 이름 (농부·사서…) */
  readonly name: string;
}
/** 대장장이(대장간 앞 주민, #173)의 직업 */
export const BLACKSMITH_JOB = 'weaponsmith';

function mix(n: number): number {
  let h = Math.imul(n | 0, 2246822519) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  return (h ^ (h >>> 13)) >>> 0;
}

export class TradeRules {
  constructor(
    /** 돈으로 쓰는 아이템 (에메랄드) */
    readonly currency: string,
    /** 모든 주민이 다루는 것 */
    readonly buy: readonly TradeDef[],
    readonly sell: readonly TradeDef[],
    /** 직업 id → 가게 (파일 순서) */
    readonly jobs: ReadonlyMap<string, JobDef> = new Map(),
    /** 곳마다 더 파는 것 (#228 사막 마을): 원정지 id → 추가 목록 */
    readonly places: ReadonlyMap<string, TradeLists> = new Map(),
  ) {}

  find(kind: TradeKind, item: string): TradeDef | null {
    return (kind === 'buy' ? this.buy : this.sell).find((t) => t.item === item) ?? null;
  }

  /** 주민 번호(와 이름)로 직업 (#229): 모두에게 같다. 대장장이는 무기장이. 직업이 하나도 없으면 null */
  jobFor(mobId: number, name: string | null = null): JobDef | null {
    const ids = [...this.jobs.keys()];
    if (ids.length === 0) return null;
    if (name === BLACKSMITH_NAME && this.jobs.has(BLACKSMITH_JOB)) return this.jobs.get(BLACKSMITH_JOB)!;
    return this.jobs.get(ids[mix(mobId) % ids.length]!)!;
  }

  /** 이 주민의 가게 목록: 공용 + 직업 + 그곳. 겹치면 뒤의 것이 이긴다 */
  forVillager(job: string | null, place: string | null): TradeRules {
    const j = job ? this.jobs.get(job) : undefined;
    const p = place ? this.places.get(place) : undefined;
    if (!j && !p) return this;
    const merge = (base: readonly TradeDef[], more: readonly TradeDef[] | undefined) => (more ? [...base.filter((b) => !more.some((m) => m.item === b.item)), ...more] : [...base]);
    return new TradeRules(this.currency, merge(merge(this.buy, j?.buy), p?.buy), merge(merge(this.sell, j?.sell), p?.sell));
  }

  /** 그곳(원정지 id, 마을이면 null)의 공용 가게 (직업 없이) */
  forPlace(place: string | null): TradeRules {
    return this.forVillager(null, place);
  }
}

export function parseTrades(raw: unknown, fileName = 'data/trades.json'): TradeRules {
  const result = TradeFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const currency = result.data.currency ?? 'emerald';
  const problems: string[] = [];
  const check = (where: string, list: readonly { item: string }[] | undefined) => {
    const seen = new Set<string>();
    for (const t of list ?? []) {
      if (seen.has(t.item)) problems.push(`${where} 에 '${t.item}' 이 두 번 있어요`);
      seen.add(t.item);
      if (t.item === currency) problems.push(`${where} 에 에메랄드 자체는 못 넣어요`);
    }
  };
  const mk = (kind: TradeKind, list: readonly { item: string; count: number; price: number }[] | undefined): TradeDef[] => (list ?? []).map((t) => ({ kind, item: t.item, count: t.count, price: t.price }));
  check('common.buy', result.data.common?.buy);
  check('common.sell', result.data.common?.sell);
  const jobs = new Map<string, JobDef>();
  for (const [id, j] of Object.entries(result.data.jobs ?? {})) {
    if (typeof j === 'string') continue; // _comment
    check(`jobs.${id}.buy`, j.buy);
    check(`jobs.${id}.sell`, j.sell);
    jobs.set(id, { id, name: j.name, buy: mk('buy', j.buy), sell: mk('sell', j.sell) });
  }
  const places = new Map<string, TradeLists>();
  for (const [place, pt] of Object.entries(result.data.places ?? {})) {
    if (typeof pt === 'string') continue; // _comment
    check(`places.${place}.buy`, pt.buy);
    check(`places.${place}.sell`, pt.sell);
    places.set(place, { buy: mk('buy', pt.buy), sell: mk('sell', pt.sell) });
  }
  if (problems.length) throw new DataError(fileName, problems);
  return new TradeRules(currency, mk('buy', result.data.common?.buy), mk('sell', result.data.common?.sell), jobs, places);
}
