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
const TradeFile = z.object({ _comment: z.string().optional(), currency: z.string().min(1).optional(), buy: z.array(RawTrade), sell: z.array(RawTrade) }).loose();

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
  ) {}
  find(kind: TradeKind, item: string): TradeDef | null {
    return (kind === 'buy' ? this.buy : this.sell).find((t) => t.item === item) ?? null;
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
  return new TradeRules(currency, mk('buy', result.data.buy), mk('sell', result.data.sell));
}
