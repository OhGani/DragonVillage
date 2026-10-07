import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { RECIPES } from './data';
import { countOf, emptyInventory, give } from './inventory';
import { canCraft, craft, craftableTimes, emptiedBuckets, gridLayout, gridMatches, matchGrid, parseRecipes } from './recipes';

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
    expect(RECIPES.require('stone')).toMatchObject({ station: 'crafting_table', in: { cobblestone: 4 }, out: { stone: 1 } }); // 아들 2026-10-06 (#125)
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

  it('가방이 가득 차 결과가 안 들어가면 만들지 않고 재료도 그대로 (bagFull, #95)', () => {
    const inv = emptyInventory();
    for (let i = 0; i < inv.length; i++) inv[i] = { item: 'stone', count: 64 };
    inv[0] = { item: 'log', count: 1 };
    const res = craft(inv, reg.require('planks'));
    // log 1 을 빼서 0번 칸이 비고 거기에 판자 4 가 들어간다 → 안 사라짐
    expect(res).toEqual({ ok: true });
    expect(inv[0]).toEqual({ item: 'planks', count: 4 });
    // 이번엔 빈 칸이 안 생기는 경우: log 2 짜리 칸에서 1만 쓴다 → 거절, 통나무 2 그대로
    inv[0] = { item: 'log', count: 2 };
    const changed = new Set<number>();
    const res2 = craft(inv, reg.require('planks'), changed);
    expect(res2).toEqual({ ok: false, bagFull: true });
    expect(inv[0]).toEqual({ item: 'log', count: 2 });
    expect(changed.size).toBe(0);
    // 결과가 이미 있는 칸에 합쳐질 수 있으면 된다
    inv[1] = { item: 'planks', count: 60 };
    expect(craft(inv, reg.require('planks'))).toEqual({ ok: true });
    expect(inv[1]).toEqual({ item: 'planks', count: 64 });
    expect(inv[0]).toEqual({ item: 'log', count: 1 });
  });
});

describe('제작 격자 (#132, 마인크래프트 제작대와 같게)', () => {
  const shapedSmall = {
    recipes: [
      { id: 'stick', name: '막대기', station: 'crafting_table', in: { planks: 2 }, out: { stick: 4 }, pattern: ['p', 'p'], key: { p: 'planks' } },
      { id: 'wooden_axe', name: '나무 도끼', station: 'crafting_table', in: { planks: 3, stick: 2 }, out: { wooden_axe: 1 }, pattern: ['pp', 'ps', ' s'], key: { p: 'planks', s: 'stick' } },
      { id: 'bucket', name: '양동이', station: 'crafting_table', in: { iron_ingot: 3 }, out: { bucket: 1 } },
    ],
  };
  const cell = (item: string | null) => (item ? { item, count: 1 } : null);
  const g = (...ids: (string | null)[]) => ids.map(cell);

  it('모양 있는 조합: 어디에 놓아도, 좌우를 뒤집어도 맞고, 모양이 다르면 안 맞는다', () => {
    const reg = parseRecipes(shapedSmall);
    const stick = reg.require('stick');
    expect(gridMatches(stick, g('planks', null, null, 'planks', null, null, null, null, null), 3)).toBe(true); // 왼쪽 위
    expect(gridMatches(stick, g(null, null, null, null, null, 'planks', null, null, 'planks'), 3)).toBe(true); // 오른쪽 아래
    expect(gridMatches(stick, g('planks', 'planks', null, null, null, null, null, null, null), 3)).toBe(false); // 가로는 안 됨
    expect(gridMatches(stick, g('planks', null, 'planks', null), 2)).toBe(true); // 2×2 에서도
    const axe = reg.require('wooden_axe');
    expect(gridMatches(axe, g('planks', 'planks', null, 'planks', 'stick', null, null, 'stick', null), 3)).toBe(true);
    expect(gridMatches(axe, g(null, 'planks', 'planks', null, 'stick', 'planks', null, 'stick', null), 3)).toBe(true); // 좌우 뒤집기
    expect(gridMatches(axe, g('planks', 'planks', 'planks', null, 'stick', null, null, 'stick', null), 3)).toBe(false); // 곡괭이 모양
    expect(matchGrid(reg.defs, g(null, 'planks', 'planks', null, 'stick', 'planks', null, 'stick', null), 3)?.id).toBe('wooden_axe');
    expect(matchGrid(reg.defs, g(null, null, null, null, null, null, null, null, null), 3)).toBeNull();
  });

  it('모양 없는 조합: 칸마다 1개씩 세어 개수가 꼭 같아야 한다', () => {
    const reg = parseRecipes(shapedSmall);
    const bucket = reg.require('bucket');
    expect(gridMatches(bucket, g('iron_ingot', null, 'iron_ingot', null, 'iron_ingot', null, null, null, null), 3)).toBe(true);
    expect(gridMatches(bucket, g('iron_ingot', 'iron_ingot', null, null, null, null, null, null, null), 3)).toBe(false); // 2개
    expect(gridMatches(bucket, g('iron_ingot', 'iron_ingot', 'iron_ingot', 'stick', null, null, null, null, null), 3)).toBe(false); // 딴 것 섞임
    // 한 칸에 여러 개 있어도 한 번 만들 때는 1개로 센다
    expect(gridMatches(bucket, [{ item: 'iron_ingot', count: 5 }, cell('iron_ingot'), cell('iron_ingot'), null, null, null, null, null, null], 3)).toBe(true);
  });

  it('조합법 책 자동 채우기: 모양은 왼쪽 위부터, 모양 없으면 재료 순서대로, 안 들어가면 null', () => {
    const reg = parseRecipes(shapedSmall);
    expect(gridLayout(reg.require('wooden_axe'), 3)).toEqual(['planks', 'planks', null, 'planks', 'stick', null, null, 'stick', null]);
    expect(gridLayout(reg.require('stick'), 2)).toEqual(['planks', null, 'planks', null]);
    expect(gridLayout(reg.require('bucket'), 2)).toEqual(['iron_ingot', 'iron_ingot', 'iron_ingot', null]);
    expect(gridLayout(reg.require('wooden_axe'), 2)).toBeNull(); // 3줄이라 2×2 에 안 들어간다
    expect(gridLayout({ ...reg.require('bucket'), in: { iron_ingot: 10 } }, 3)).toBeNull();
    // 채운 모양은 바로 그 레시피와 맞는다
    for (const r of reg.defs) expect(gridMatches(r, gridLayout(r, 3)!.map(cell), 3)).toBe(true);
  });

  it('실제 파일: 모양 있는 레시피는 모양대로 채우면 맞고, 글자가 key 에 없거나 개수가 다르면 한국어 에러', () => {
    const shapedOnes = RECIPES.defs.filter((r) => r.pattern);
    expect(shapedOnes.length).toBeGreaterThan(60);
    for (const r of shapedOnes) {
      const w = r.station === 'inventory' ? 2 : 3;
      const lay = gridLayout(r, w);
      expect(lay, r.id).not.toBeNull();
      expect(gridMatches(r, lay!.map(cell), w), r.id).toBe(true);
    }
    expect(RECIPES.require('iron_helmet').pattern).toEqual(['mmm', 'm m']); // combat.json 에서 만든 것도
    expect(RECIPES.require('netherite_helmet').pattern).toBeUndefined(); // 업그레이드는 모양 없음
    expect(() => parseRecipes({ recipes: [{ id: 'x', name: 'x', station: 'crafting_table', in: { planks: 2 }, out: { x: 1 }, pattern: ['pq'], key: { p: 'planks' } }] })).toThrow(/'q' 가 key 에 없어요/);
    expect(() => parseRecipes({ recipes: [{ id: 'x', name: 'x', station: 'crafting_table', in: { planks: 2 }, out: { x: 1 }, pattern: ['ppp'], key: { p: 'planks' } }] })).toThrow(/모양\(pattern\)에서 센 재료/);
    expect(() => parseRecipes({ recipes: [{ id: 'x', name: 'x', station: 'inventory', in: { planks: 3 }, out: { x: 1 }, pattern: ['ppp'], key: { p: 'planks' } }] })).toThrow(/2줄·2글자까지/);
  });
});

describe('찬 양동이는 재료로 써도 빈 양동이로 돌아온다 (#137)', () => {
  it('워터 드래곤 알(물 양동이 1)·케이크(우유 3)를 만들면 빈 양동이가 남고, 빈 양동이 자리도 없으면 안 만든다', () => {
    const egg = RECIPES.require('egg_water');
    expect(egg.in.water_bucket).toBe(1);
    expect(emptiedBuckets(egg)).toBe(1);
    expect(emptiedBuckets(RECIPES.require('cake'))).toBe(3);
    expect(emptiedBuckets(RECIPES.require('planks'))).toBe(0);
    const inv = emptyInventory();
    for (const [item, n] of Object.entries(egg.in)) give(inv, item, n);
    expect(craft(inv, egg)).toEqual({ ok: true });
    expect(countOf(inv, 'water_bucket')).toBe(0);
    expect(countOf(inv, 'bucket')).toBe(1);
    // 가방이 꽉 차서 빈 양동이가 들어갈 칸이 없으면 만들지 않는다 (재료 그대로)
    const full = emptyInventory();
    for (const [item, n] of Object.entries(egg.in)) give(full, item, item === 'water_bucket' ? n : n + 1); // 다른 재료 칸은 하나씩 남아 안 비고
    for (let i = 0; i < full.length; i++) if (!full[i]) full[i] = { item: 'dirt', count: 64 };
    // 물 양동이 칸 하나만 비는데 알이 거기 들어가면 빈 양동이 자리가 없다
    expect(craft(full, egg)).toEqual({ ok: false, bagFull: true });
    expect(countOf(full, 'water_bucket')).toBe(1);
  });
});
