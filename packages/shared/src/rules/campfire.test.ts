import { describe, expect, it } from 'vitest';
import { BLOCKS, FOOD, RECIPES } from './data';
import { CAMPFIRE, CAMPFIRE_OFF, campfireCooks } from './campfire';
import { gridMatches } from './recipes';

describe('모닥불 (#290)', () => {
  it('구울 수 있는 것은 화로 레시피에서 온다: 날고기·생선·감자 → 익힌 것. 광석·모래는 아니다', () => {
    const cooks = campfireCooks(RECIPES, FOOD);
    expect(cooks.get('beef')).toBe('cooked_beef');
    expect(cooks.get('porkchop')).toBe('cooked_porkchop');
    expect(cooks.get('chicken')).toBe('cooked_chicken');
    expect(cooks.get('mutton')).toBe('cooked_mutton');
    expect(cooks.get('cod')).toBe('cooked_cod');
    expect(cooks.get('salmon')).toBe('cooked_salmon');
    expect(cooks.get('potato')).toBe('baked_potato');
    expect(cooks.has('iron_ore')).toBe(false);
    expect(cooks.has('sand')).toBe(false);
    expect(cooks.has('coal')).toBe(false);
    for (const out of cooks.values()) expect(FOOD.foods.has(out)).toBe(true);
  });

  it('블록 둘: 불붙은 모닥불은 빛 15, 꺼진 모닥불은 빛 0 이고 부수면 모닥불', () => {
    const on = BLOCKS.require(CAMPFIRE),
      off = BLOCKS.require(CAMPFIRE_OFF);
    expect(on.shape).toBe('campfire');
    expect(off.shape).toBe('campfire');
    expect(on.lightEmit).toBe(15);
    expect(off.lightEmit).toBe(0);
    expect(off.drops).toBe(CAMPFIRE);
  });

  it('레시피: 막대기 3 + 석탄 1 + 원목 3 (여덟 가지 원목 어느 것이든) → 모닥불 1', () => {
    const logs = ['log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log', 'cherry_log', 'mangrove_log'];
    const made = RECIPES.defs.filter((r) => r.out[CAMPFIRE] === 1);
    expect(made.map((r) => Object.keys(r.in).find((k) => k.endsWith('log'))).sort()).toEqual([...logs].sort());
    for (const r of made) {
      const log = Object.keys(r.in).find((k) => k.endsWith('log'))!;
      expect(r.in).toEqual({ stick: 3, coal: 1, [log]: 3 });
      const cell = (item: string) => ({ item, count: 1 });
      expect(gridMatches(r, [null, cell('stick'), null, cell('stick'), cell('coal'), cell('stick'), cell(log), cell(log), cell(log)], 3)).toBe(true);
    }
  });
});
