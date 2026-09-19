import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { RECIPES } from './data';
import { emptyInventory, give } from './inventory';
import { canCraft, craft, craftableTimes, parseRecipes } from './recipes';

const small = {
  recipes: [
    { id: 'planks', name: '판자', station: 'inventory', in: { log: 1 }, out: { planks: 4 } },
    { id: 'crafting_table', name: '제작대', station: 'inventory', in: { planks: 4 }, out: { crafting_table: 1 } },
    { id: 'oak_door', name: '문', station: 'crafting_table', in: { planks: 6 }, out: { oak_door: 3 } },
    { id: 'obsidian_from_lava', name: '흑요석', station: 'world', in: { water_bucket: 1, lava: 1 }, out: { obsidian: 1 } },
    { id: 'old', name: '옛것', station: 'forge', in: { iron_ingot: 1 }, out: { x: 1 }, release: 'v1.1' },
  ],
};

describe('parseRecipes', () => {
  it('작은 데이터·실제 파일이 통과하고 station 별로 나뉜다', () => {
    const reg = parseRecipes(small);
    expect(reg.count).toBe(5);
    expect(reg.forStation('inventory').map((r) => r.id)).toEqual(['planks', 'crafting_table']);
    expect(reg.forStation('forge')).toEqual([]); // v1.1
    expect(reg.craftable().map((r) => r.id)).toEqual(['planks', 'crafting_table', 'oak_door']);
    expect(RECIPES.count).toBeGreaterThan(60);
    expect(RECIPES.require('planks').out).toEqual({ planks: 4 });
    expect(RECIPES.require('oak_door').in).toEqual({ planks: 6 });
    expect(RECIPES.forStation('inventory').length).toBeGreaterThanOrEqual(9);
    expect(RECIPES.forStation('brewing')).toEqual([]); // 양조는 potions.json
    for (const r of RECIPES.craftable()) expect(r.release).toBe('v1');
  });

  it('잘못된 값이면 한국어 DataError', () => {
    const bad = { recipes: [{ ...small.recipes[0], in: { log: 0 } }] };
    expect(() => parseRecipes(bad)).toThrow(DataError);
    expect(() => parseRecipes(bad)).toThrow(/1번째 레시피\(id: planks\)의 in\(재료\) 'log'/);
    expect(() => parseRecipes({ recipes: [{ ...small.recipes[0], station: 'magic' }] })).toThrow(/station/);
    expect(() => parseRecipes({ recipes: [small.recipes[0], small.recipes[0]] })).toThrow(/두 번 나와요/);
    expect(() => parseRecipes({ recipes: [{ id: 'x', name: 'x', station: 'inventory', in: { a: 1, b: 1, c: 1, d: 1, e: 1 }, out: { y: 1 } }] })).toThrow(/4가지/);
    expect(() => parseRecipes({ recipes: [{ id: 'x', name: 'x', station: 'inventory', in: { a: 1 }, out: { a: 2 } }] })).toThrow(/더 많이/);
  });
});

describe('craft', () => {
  const reg = parseRecipes(small);

  it('재료가 있으면 빼고 결과를 넣는다, 없으면 모자란 것을 알려 준다', () => {
    const inv = emptyInventory();
    give(inv, 'log', 3);
    const planks = reg.require('planks');
    expect(canCraft(inv, planks)).toBe(true);
    expect(craftableTimes(inv, planks)).toBe(3);
    const ch = new Set<number>();
    expect(craft(inv, planks, ch)).toEqual({ ok: true });
    expect(inv[0]).toEqual({ item: 'log', count: 2 });
    expect(inv[1]).toEqual({ item: 'planks', count: 4 });
    expect([...ch].sort()).toEqual([0, 1]);
    const door = reg.require('oak_door');
    expect(craft(inv, door)).toEqual({ ok: false, missing: { planks: 2 } });
    expect(inv[1]!.count).toBe(4); // 아무것도 안 바뀜
    expect(craftableTimes(inv, door)).toBe(0);
  });

  it('가방이 가득 차면 결과 일부는 사라진다(lost)', () => {
    const inv = emptyInventory();
    for (let i = 0; i < inv.length; i++) inv[i] = { item: 'stone', count: 64 };
    inv[0] = { item: 'log', count: 1 };
    const res = craft(inv, reg.require('planks'));
    // log 1 을 빼서 0번 칸이 비고 거기에 판자 4 가 들어간다 → 안 사라짐
    expect(res).toEqual({ ok: true });
    expect(inv[0]).toEqual({ item: 'planks', count: 4 });
    // 이번엔 빈 칸이 안 생기는 경우: log 2 짜리 칸에서 1만 쓴다
    inv[0] = { item: 'log', count: 2 };
    const res2 = craft(inv, reg.require('planks'));
    expect(res2).toEqual({ ok: true, lost: { planks: 4 } });
  });
});
