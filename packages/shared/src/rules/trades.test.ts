import { describe, expect, it } from 'vitest';
import { itemName } from './items';
import { BLOCKS, ITEM_NAMES, TRADES } from './data';
import { parseTrades } from './trades';

describe('주민 거래 (#225)', () => {
  it('data/trades.json: 사는 것·파는 것이 있고, 물건마다 한국어 이름이 있다(모르는 id 가 아니다)', () => {
    expect(TRADES.currency).toBe('emerald');
    expect(TRADES.buy.length).toBeGreaterThanOrEqual(5);
    expect(TRADES.sell.length).toBeGreaterThanOrEqual(5);
    for (const t of [...TRADES.buy, ...TRADES.sell]) {
      expect(itemName(t.item, BLOCKS, ITEM_NAMES)).not.toBe(t.item);
      expect(t.count).toBeGreaterThanOrEqual(1);
      expect(t.price).toBeGreaterThanOrEqual(1);
    }
    expect(TRADES.find('buy', 'bread')).toEqual({ kind: 'buy', item: 'bread', count: 3, price: 1 });
    expect(TRADES.find('sell', 'wheat')?.price).toBe(1);
    expect(TRADES.find('sell', 'bread')).toBeNull();
  });

  it('잘못된 파일은 한국어로 알려 준다', () => {
    expect(() => parseTrades({ buy: [{ item: 'bread', count: 0, price: 1 }], sell: [] })).toThrow(/1 이상/);
    expect(() => parseTrades({ buy: [{ item: 'bread', count: 1, price: 1 }, { item: 'bread', count: 2, price: 1 }], sell: [] })).toThrow(/두 번/);
    expect(() => parseTrades({ buy: [{ item: 'emerald', count: 1, price: 1 }], sell: [] })).toThrow(/에메랄드 자체/);
  });
});
