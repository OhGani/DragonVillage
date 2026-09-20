import { describe, expect, it } from 'vitest';
import dragonsJson from '../../../../data/dragons.json';
import { DRAGONS, ITEM_NAMES, RECIPES } from './data';
import { NEST, OLD_NEST_SITES, dragonOfEgg, eggItem, eggRecipes, isEggItem, isNestBuiltAt, nestBlocks, nestBlocksAt, nestContains, nestSlotPos, parseDragons } from './dragons';
import { emptyInventory, give } from './inventory';
import { canCraft, craft } from './recipes';

describe('드래곤 16종 (M6-2)', () => {
  it('아들 설계 그대로: 16종, 티어 1~16 한 번씩, 나무 = 원목 5·묘목 1·나뭇잎 2', () => {
    expect(DRAGONS.count).toBe(16);
    expect(new Set(DRAGONS.list.map((d) => d.tier)).size).toBe(16);
    const wood = DRAGONS.require('wood');
    expect(wood).toMatchObject({ name: '나무 드래곤', tier: 1, color: '#8B5A2B' });
    expect(wood.recipe).toEqual([
      { material: 'log', count: 5 },
      { material: 'sapling', count: 1 },
      { material: 'leaves', count: 2 },
    ]);
    expect(DRAGONS.require('ender').tier).toBe(16);
    expect(DRAGONS.rules).toEqual({ baseGrowMinutes: 60, feedShortcutMinutes: 10 });
    expect(DRAGONS.find('nope')).toBeUndefined();
  });

  it('알 아이템 id 와 이름', () => {
    expect(eggItem('wood')).toBe('dragon_egg.wood');
    expect(isEggItem('dragon_egg.fire')).toBe(true);
    expect(isEggItem('egg')).toBe(false);
    expect(dragonOfEgg('dragon_egg.ice')).toBe('ice');
    expect(dragonOfEgg('planks')).toBeNull();
    expect(ITEM_NAMES.get('dragon_egg.wood')).toBe('나무 드래곤 알');
  });

  it('알 레시피가 RECIPES 에 합쳐져 제작대에서 만들 수 있다', () => {
    const eggs = eggRecipes(DRAGONS);
    expect(eggs).toHaveLength(16);
    const r = RECIPES.require('egg_wood');
    expect(r).toMatchObject({ name: '나무 드래곤 알', station: 'crafting_table', in: { log: 5, sapling: 1, leaves: 2 }, out: { 'dragon_egg.wood': 1 } });
    const inv = emptyInventory();
    give(inv, 'log', 5);
    give(inv, 'leaves', 2);
    expect(canCraft(inv, r)).toBe(false);
    give(inv, 'sapling', 1);
    expect(canCraft(inv, r)).toBe(true);
    const res = craft(inv, r);
    expect(res.ok).toBe(true);
    expect(inv.some((s) => s?.item === 'dragon_egg.wood' && s.count === 1)).toBe(true);
    expect(inv.some((s) => s?.item === 'log')).toBe(false);
  });

  it('둥지: 광장 남쪽 집터 7×7(생성기 집 뼈대 x 61~66/z 82~86 을 덮음), 자리 4개, 안에 서 있는 판정', () => {
    expect(NEST).toMatchObject({ x0: 60, z0: 81, size: 7 });
    const blocks = nestBlocks(40);
    expect(blocks.filter((b) => b.y === 40)).toHaveLength(49);
    expect(blocks.find((b) => b.x === 60 && b.z === 81 && b.y === 40)!.id).toBe('log');
    expect(blocks.find((b) => b.x === 63 && b.z === 84 && b.y === 40)!.id).toBe('hay_bale');
    expect(blocks.find((b) => b.x === 60 && b.z === 81 && b.y === 44)!.id).toBe('glowstone');
    expect(blocks.filter((b) => b.y === 42 && b.id === 'air')).toHaveLength(45);
    expect(blocks.filter((b) => b.y === 45)).toHaveLength(49); // 집 지붕(y 45)까지 덮는다
    expect(nestSlotPos(40, 0)).toEqual({ x: 61, y: 41, z: 82 });
    expect(nestSlotPos(40, 4)).toBeNull();
    expect(nestContains(40, 63.5, 41, 84.5)).toBe(true);
    expect(nestContains(40, 64.5, 41, 64.5)).toBe(false);
    expect(nestContains(40, 63.5, 50, 84.5)).toBe(false);
    // 옛 자리(북동쪽)와 판정 함수
    expect(OLD_NEST_SITES).toEqual([{ x0: 74, z0: 42 }]);
    const old = nestBlocksAt(40, 74, 42);
    expect(old.find((b) => b.x === 77 && b.z === 45 && b.y === 40)!.id).toBe('hay_bale');
    const map = new Map(old.map((b) => [`${b.x},${b.y},${b.z}`, b.id]));
    const idAt = (x: number, y: number, z: number) => map.get(`${x},${y},${z}`) ?? 'grass';
    expect(isNestBuiltAt(idAt, 40, 74, 42)).toBe(true);
    expect(isNestBuiltAt(idAt, 40, 60, 81)).toBe(false);
    for (const s of NEST.slots) expect(nestContains(40, s.x + 0.5, 41, s.z + 0.5)).toBe(true);
  });

  it('같은 티어가 둘이면 한국어로 알려준다', () => {
    const raw = JSON.parse(JSON.stringify(dragonsJson)) as { dragons: { tier: number }[] };
    raw.dragons[1]!.tier = 1;
    expect(() => parseDragons(raw)).toThrow(/티어 1/);
  });
});
