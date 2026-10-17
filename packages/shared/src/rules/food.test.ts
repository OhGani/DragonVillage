import { describe, expect, it } from 'vitest';
import { FOOD } from './data';
import { foodOf, parseFood } from './food';

describe('먹을 것 (#186)', () => {
  it('data/food.json: 빵은 5 회복, 먹을 수 없는 건 null', () => {
    expect(foodOf(FOOD, 'bread')?.heals).toBe(5);
    expect(foodOf(FOOD, 'apple')?.heals).toBe(4);
    expect(foodOf(FOOD, 'stick')).toBeNull();
    expect(foodOf(FOOD, null)).toBeNull();
    for (const f of FOOD.foods.values()) expect(f.heals).toBeGreaterThan(0);
  });
  it('잘못된 파일은 한국어로 알려 준다', () => {
    expect(() => parseFood({ foods: [{ id: 'x', name: '엑스', heals: 0 }] })).toThrow(/1 이상/);
    expect(() => parseFood({ foods: [{ id: 'x', name: '엑스', heals: 1 }, { id: 'x', name: '엑스', heals: 2 }] })).toThrow(/두 번/);
  });
});
