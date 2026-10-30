/**
 * 주민 거래 (#225, 아들 14차 4번 "사고 팔 수 있게"): data/trades.json.
 * buy = 에메랄드 price 개를 내고 item 을 count 개, sell = item 을 count 개 주고 에메랄드 price 개. 서버가 판정한다(가방·거리).
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const RawTrade = z
  .object({
    item: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
    count: z.number().int().min(1, '1 이상이어야 해요').max(64, '64까지예요'),
    price: z.number().int().min(1, '에메랄드 1개 이상이어야 해요').max(64, '64까지예요'),
  })
  .loose();
const PlaceTrades = z.object({ _comment: z.string().optional(), buy: z.array(RawTrade).optional(), sell: z.array(RawTrade).optional() }).loose();
const TradeFile = z.object({ _comment: z.string().optional(), currency: z.string().min(1).optional(), buy: z.array(RawTrade), sell: z.array(RawTrade), places: z.record(z.string(), z.union([z.string(), PlaceTrades])).optional() }).loose();

export type TradeKind = 'buy' | 'sell';
export interface TradeDef {
  readonly kind: TradeKind;
  readonly item: string;
  readonly count: number;
  /** 에메랄드 개수 */
  readonly price: number;
}
export class TradeRules {
  constructor(
    /** 돈으로 쓰는 아이템 (에메랄드) */
    readonly currency: string,
    readonly buy: readonly TradeDef[],
    readonly sell: readonly TradeDef[],
    /** 곳마다 더 파는 것 (#228 사막 마을): 원정지 id → 추가 목록. 같은 물건이 있으면 그곳 값이 이긴다 */
    readonly places: ReadonlyMap<string, { buy: readonly TradeDef[]; sell: readonly TradeDef[] }> = new Map(),
  ) {}
  find(kind: TradeKind, item: string): TradeDef | null {
    return (kind === 'buy' ? this.buy : this.sell).find((t) => t.item === item) ?? null;
  }
  /** 그곳(원정지 id, 마을이면 null)의 가게 목록: 공용 + 그곳 것 */
  forPlace(place: string | null): TradeRules {
    const extra = place ? this.places.get(place) : undefined;
    if (!extra) return this;
    const merge = (base: readonly TradeDef[], more: readonly TradeDef[]) => [...base.filter((b) => !more.some((m) => m.item === b.item)), ...more];
    return new TradeRules(this.currency, merge(this.buy, extra.buy), merge(this.sell, extra.sell));
  }
}

export function parseTrades(raw: unknown, fileName = 'data/trades.json'): TradeRules {
  const result = TradeFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const currency = result.data.currency ?? 'emerald';
  const problems: string[] = [];
  for (const kind of ['buy', 'sell'] as const) {
    const seen = new Set<string>();
    for (const t of result.data[kind]) {
      if (seen.has(t.item)) problems.push(`${kind} 에 '${t.item}' 이 두 번 있어요`);
      seen.add(t.item);
      if (t.item === currency) problems.push(`${kind} 에 에메랄드 자체는 못 넣어요`);
    }
  }
  if (problems.length) throw new DataError(fileName, problems);
  const mk = (kind: TradeKind, list: { item: string; count: number; price: number }[]): TradeDef[] => list.map((t) => ({ kind, item: t.item, count: t.count, price: t.price }));
  const places = new Map<string, { buy: TradeDef[]; sell: TradeDef[] }>();
  for (const [place, pt] of Object.entries(result.data.places ?? {})) {
    if (typeof pt === 'string') continue; // _comment
    for (const kind of ['buy', 'sell'] as const) {
      const seen = new Set<string>();
      for (const t of pt[kind] ?? []) {
        if (seen.has(t.item)) problems.push(`places.${place}.${kind} 에 '${t.item}' 이 두 번 있어요`);
        seen.add(t.item);
        if (t.item === currency) problems.push(`places.${place}.${kind} 에 에메랄드 자체는 못 넣어요`);
      }
    }
    places.set(place, { buy: mk('buy', pt.buy ?? []), sell: mk('sell', pt.sell ?? []) });
  }
  if (problems.length) throw new DataError(fileName, problems);
  return new TradeRules(currency, mk('buy', result.data.buy), mk('sell', result.data.sell), places);
}
