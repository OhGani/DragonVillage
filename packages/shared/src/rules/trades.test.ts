import { describe, expect, it } from 'vitest';
import { BLACKSMITH_NAME } from './animals';
import { itemName } from './items';
import { BLOCKS, ITEM_NAMES, TRADES } from './data';
import { demandPrice, effectiveBuys, parseTrades } from './trades';

describe('주민 거래 (#225·#228·#229)', () => {
  it('data/trades.json: 공용 + 직업 7개 + 사막, 물건마다 한국어 이름이 있다(모르는 id 가 아니다)', () => {
    expect(TRADES.currency).toBe('emerald');
    expect(TRADES.jobs.size).toBeGreaterThanOrEqual(5);
    const all = [...TRADES.buy, ...TRADES.sell, ...[...TRADES.jobs.values()].flatMap((j) => [...j.buy, ...j.sell]), ...[...TRADES.places.values()].flatMap((p) => [...p.buy, ...p.sell])];
    expect(all.length).toBeGreaterThan(30);
    for (const t of all) {
      expect(itemName(t.item, BLOCKS, ITEM_NAMES), t.item).not.toBe(t.item);
      expect(t.count).toBeGreaterThanOrEqual(1);
      expect(t.price).toBeGreaterThanOrEqual(1);
    }
    for (const j of TRADES.jobs.values()) {
      expect(j.buy.length).toBeGreaterThanOrEqual(2);
      expect(j.sell.length).toBeGreaterThanOrEqual(2);
      expect(j.name.length).toBeGreaterThan(0);
    }
    expect(TRADES.find('buy', 'torch')).toEqual({ kind: 'buy', item: 'torch', count: 8, price: 1 }); // 공용
    expect(TRADES.find('buy', 'bread')).toBeNull(); // 빵은 농부만
  });

  it('직업 (#229): 주민 번호로 정해져 모두에게 같고, 200명이면 모든 직업이 나온다, 대장장이는 무기장이', () => {
    const seen = new Set<string>();
    for (let id = 40_000; id < 40_200; id++) {
      const j = TRADES.jobFor(id)!;
      expect(TRADES.jobFor(id)).toBe(j);
      seen.add(j.id);
    }
    expect(seen.size).toBe(TRADES.jobs.size);
    expect(TRADES.jobFor(40_003, BLACKSMITH_NAME)!.id).toBe('weaponsmith');
    const farmer = TRADES.forVillager('farmer', null);
    expect(farmer.find('buy', 'bread')).toBeDefined();
    expect(farmer.find('buy', 'torch')).toBeDefined(); // 공용도
    expect(farmer.find('buy', 'iron_pickaxe')).toBeNull(); // 도구장이 것
    expect(farmer.find('sell', 'wheat')?.count).toBe(12);
    expect(TRADES.forVillager('toolsmith', null).find('buy', 'iron_pickaxe')).toBeDefined();
  });

  it('곳마다 더 파는 것 (#228): 사막 주민은 직업 + 사막 것, 같은 물건은 사막 값, 마을·다른 곳엔 없다', () => {
    const desert = TRADES.forVillager('weaponsmith', 'desert');
    expect(desert.find('buy', 'sandstone')).toEqual({ kind: 'buy', item: 'sandstone', count: 16, price: 1 });
    expect(desert.find('buy', 'iron_sword')).toBeDefined(); // 직업은 그대로
    expect(desert.find('sell', 'gold_ingot')?.count).toBe(1); // 사막 값이 이긴다
    expect(TRADES.forVillager('weaponsmith', null).find('sell', 'gold_ingot')?.count).toBe(2);
    expect(TRADES.forPlace(null).find('buy', 'sandstone')).toBeNull();
    expect(TRADES.forPlace('grass_island')).toBe(TRADES);
    expect(new Set(desert.sell.map((t) => t.item)).size).toBe(desert.sell.length);
  });

  it('사면 비싸진다 (#230): 2번마다 💎1 씩, 원래 값의 3배까지, 20분마다 한 번씩 내려온다. 파는 값은 그대로', () => {
    const d = TRADES.demand;
    expect(d).toEqual({ everyBuys: 2, step: 1, maxTimes: 3, restockMinutes: 20 });
    expect([0, 1, 2, 3, 4, 5, 6, 10, 100].map((n) => demandPrice(1, n, d))).toEqual([1, 1, 2, 2, 3, 3, 3, 3, 3]);
    expect(demandPrice(4, 7, d)).toBe(7);
    expect(demandPrice(4, 40, d)).toBe(12);
    expect(effectiveBuys(5, 0, 0, d)).toBe(5);
    expect(effectiveBuys(5, 0, 20 * 60_000, d)).toBe(4);
    expect(effectiveBuys(5, 0, 200 * 60_000, d)).toBe(0);
    const bread = TRADES.forVillager('farmer', null).find('buy', 'bread')!;
    expect(TRADES.priceFor(bread, 0)).toBe(1);
    expect(TRADES.priceFor(bread, 4)).toBe(3);
    const wheat = TRADES.forVillager('farmer', null).find('sell', 'wheat')!;
    expect(TRADES.priceFor(wheat, 99)).toBe(wheat.price);
    expect(TRADES.forVillager('farmer', 'desert').demand).toEqual(d);
  });

  it('잘못된 파일은 한국어로 알려 준다', () => {
    expect(() => parseTrades({ common: { buy: [{ item: 'bread', count: 0, price: 1 }] } })).toThrow(/1 이상/);
    expect(() => parseTrades({ jobs: { farmer: { name: '농부', buy: [{ item: 'bread', count: 1, price: 1 }, { item: 'bread', count: 2, price: 1 }] } } })).toThrow(/두 번/);
    expect(() => parseTrades({ common: { buy: [{ item: 'emerald', count: 1, price: 1 }] } })).toThrow(/에메랄드 자체/);
    expect(() => parseTrades({ places: { desert: { buy: [{ item: 'sand', count: 1, price: 1 }, { item: 'sand', count: 2, price: 1 }] } } })).toThrow(/두 번/);
  });
});
