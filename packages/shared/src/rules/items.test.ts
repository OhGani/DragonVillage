import { describe, expect, it } from 'vitest';
import { BLOCKS, ITEM_NAMES } from './data';
import { buildItemNames, itemName } from './items';

describe('아이템 이름표', () => {
  it('블록·레시피·드래곤 재료·물약 재료·나머지 드롭 전부 한국어 이름이 있다', () => {
    expect(itemName('cobblestone', BLOCKS, ITEM_NAMES)).toBe('조약돌');
    expect(itemName('glowstone_dust', BLOCKS, ITEM_NAMES)).toBe('발광석 가루');
    expect(itemName('blaze_powder', BLOCKS, ITEM_NAMES)).toBe('블레이즈 가루');
    expect(itemName('ghast_tear', BLOCKS, ITEM_NAMES)).toBe('가스트의 눈물');
    expect(itemName('nether_wart', BLOCKS, ITEM_NAMES)).toBe('네더 사마귀');
    expect(itemName('iron_ingot', BLOCKS, ITEM_NAMES)).toBe('철');
    expect(itemName('no_such_thing', BLOCKS, ITEM_NAMES)).toBe('no_such_thing');
    // blocks.json 이 떨어뜨리는 것은 전부 이름이 있어야 한다 (정산 창에 영문 id 가 보이지 않게)
    for (const d of BLOCKS.defs) {
      if (d.internal || !d.drops) continue;
      expect(itemName(d.drops, BLOCKS, ITEM_NAMES), d.drops).not.toBe(d.drops);
    }
  });

  it('레시피는 결과물 하나짜리만 이름으로 쓰고, 먼저 나온 이름이 이긴다', () => {
    const names = buildItemNames({
      recipes: { recipes: [{ name: '막대기', out: { stick: 4 } }, { name: '이상한 것', out: { a: 1, b: 2 } }, { name: '막대기2', out: { stick: 1 } }] },
      dragons: { materials: [{ id: 'stick', name: '드래곤 막대기' }, { id: 'pearl', name: '엔더 진주' }] },
      potions: { ingredients: { _comment: 'x', sugar: { name: '설탕' } }, modifiers: { redstone: { name: '레드스톤' } } },
    });
    expect(names.get('stick')).toBe('막대기');
    expect(names.has('a')).toBe(false);
    expect(names.get('pearl')).toBe('엔더 진주');
    expect(names.get('sugar')).toBe('설탕');
    expect(names.get('redstone')).toBe('레드스톤'); // modifiers 가 fallback 보다 먼저
    expect(names.get('coal')).toBe('석탄');
  });
});
