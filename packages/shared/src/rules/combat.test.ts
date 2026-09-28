import { describe, expect, it } from 'vitest';
import { BLOCKS, COMBAT, ITEM_NAMES, RECIPES } from './data';
import { armorTotals, bowDamage, emptyEquipment, equipSlotOf, finalDamage, reduceDamage, sanitizeEquipment, shieldFactor } from './combat';
import { itemName } from './items';

describe('전투 장비 (M8-2, combat.json)', () => {
  it('갑옷 5등급 × 4부위 + 거북 등딱지 = 21조각, 방패·활·쇠뇌·화살 제작법이 자동으로 나온다', () => {
    expect(COMBAT.armor.size).toBe(21);
    expect(COMBAT.armor.get('iron_chestplate')).toMatchObject({ slot: 'chestplate', defense: 6, toughness: 0, name: '철 흉갑' });
    expect(COMBAT.armor.get('leather_boots')?.name).toBe('가죽 장화');
    expect(COMBAT.armor.get('diamond_helmet')?.toughness).toBe(2);
    expect(COMBAT.recipes.length).toBe(21 + 1 + 2 + 1);
    const chest = RECIPES.find('iron_chestplate')!;
    expect(chest.in).toEqual({ iron_ingot: 8 });
    expect(chest.station).toBe('forge');
    expect(RECIPES.find('leather_helmet')!.in).toEqual({ leather: 5 });
    expect(RECIPES.find('leather_helmet')!.station).toBe('crafting_table');
    expect(RECIPES.find('netherite_boots')!.in).toEqual({ diamond_boots: 1, netherite: 1 });
    expect(RECIPES.find('arrow')!.out).toEqual({ arrow: 4 });
    expect(RECIPES.find('shield')!.in).toEqual({ planks: 6, iron_ingot: 1 });
  });

  it('모든 장비·재료에 한국어 이름이 있다', () => {
    for (const r of COMBAT.recipes) {
      for (const id of [...Object.keys(r.in), ...Object.keys(r.out)]) expect(itemName(id, BLOCKS, ITEM_NAMES), id).not.toBe(id);
    }
  });

  it('장비 칸: 갑옷은 부위대로, 방패는 shield, 나머지는 null', () => {
    expect(equipSlotOf(COMBAT, 'golden_leggings')).toBe('leggings');
    expect(equipSlotOf(COMBAT, 'shield')).toBe('shield');
    expect(equipSlotOf(COMBAT, 'turtle_helmet')).toBe('helmet');
    expect(equipSlotOf(COMBAT, 'iron_sword')).toBeNull();
    expect(equipSlotOf(COMBAT, null)).toBeNull();
  });

  it('마인크래프트 갑옷 공식: 철 풀세트(15)에 10 피해 → 6, 다이아 풀세트(20, 강도 8) → 3, 가죽(7) → 최대 28%', () => {
    expect(reduceDamage(10, 15, 0)).toBeCloseTo(6, 5);
    expect(reduceDamage(10, 20, 8)).toBeCloseTo(3, 5);
    expect(reduceDamage(1, 7, 0)).toBeCloseTo(0.74, 5); // 가죽: 1 피해면 26% 막음 (최대 28% 는 피해 0 근처)
    expect(reduceDamage(10, 0, 0)).toBe(10);
    // 큰 피해는 방어가 덜 통한다 (최소 A/5)
    expect(reduceDamage(100, 15, 0)).toBeCloseTo(100 * (1 - 3 / 25), 5);
  });

  it('입은 것 합치기·최종 피해: 갑옷은 최소 1 은 아프고, 낙하·독에는 안 통한다', () => {
    const eq = { ...emptyEquipment(), helmet: 'iron_helmet', chestplate: 'iron_chestplate', leggings: 'iron_leggings', boots: 'iron_boots' };
    expect(armorTotals(COMBAT, eq)).toEqual({ defense: 15, toughness: 0 });
    expect(finalDamage(COMBAT, eq, 10, 'zombie')).toBe(6);
    expect(finalDamage(COMBAT, eq, 3, 'zombie')).toBe(1); // 3 × 0.4 = 1.2 → 1
    expect(finalDamage(COMBAT, eq, 1, 'zombie')).toBe(1); // 최소 1
    expect(finalDamage(COMBAT, eq, 5, 'fall')).toBe(5);
    expect(finalDamage(COMBAT, eq, 1, 'poison')).toBe(1);
    expect(finalDamage(COMBAT, emptyEquipment(), 7, 'creeper')).toBe(7);
  });

  it('방패: 근접·폭발 절반, 약탈자 화살 전부, 변명자 도끼는 무시 (#107)', () => {
    const eq = { ...emptyEquipment(), shield: 'shield' };
    expect(shieldFactor(COMBAT, eq, 'zombie')).toBe(0.5);
    expect(shieldFactor(COMBAT, eq, 'creeper')).toBe(0.5);
    expect(shieldFactor(COMBAT, eq, 'pillager')).toBe(0);
    expect(shieldFactor(COMBAT, eq, 'vindicator')).toBe(1);
    expect(shieldFactor(COMBAT, eq, 'fall')).toBe(1);
    expect(shieldFactor(COMBAT, emptyEquipment(), 'zombie')).toBe(1);
    expect(finalDamage(COMBAT, eq, 6, 'pillager')).toBe(0);
    expect(finalDamage(COMBAT, eq, 7, 'creeper')).toBe(4); // 3.5 → 4
    // 🛡️ 막기 중(#118): 전부 막는다, 변명자는 그래도 뚫는다, 방패 없으면 소용없다
    expect(shieldFactor(COMBAT, eq, 'zombie', true)).toBe(0);
    expect(finalDamage(COMBAT, eq, 7, 'creeper', true)).toBe(0);
    expect(finalDamage(COMBAT, eq, 5, 'vindicator', true)).toBe(5);
    expect(finalDamage(COMBAT, eq, 5, 'fall', true)).toBe(5);
    expect(finalDamage(COMBAT, emptyEquipment(), 5, 'zombie', true)).toBe(5);
    expect(COMBAT.shield.guardSlow).toBe(0.5);
  });

  it('활 당기기 (#119): 안 당기면 30%, 가득 당기면 100%, 넘게 당겨도 그대로', () => {
    const bow = COMBAT.bows.get('bow')!;
    expect(bow.drawMs).toBe(1000);
    expect(bowDamage(bow, 0)).toBe(2);
    expect(bowDamage(bow, 500)).toBe(4);
    expect(bowDamage(bow, 1000)).toBe(6);
    expect(bowDamage(bow, 5000)).toBe(6);
    expect(bowDamage(COMBAT.bows.get('crossbow')!, 1250)).toBe(9);
  });

  it('저장된 장비 JSON 은 검사해서 읽는다 (모르는 것·엉뚱한 칸은 비움)', () => {
    const eq = sanitizeEquipment(COMBAT, { helmet: 'iron_helmet', chestplate: 'iron_helmet', shield: 'shield', boots: 42, junk: 1 });
    expect(eq).toEqual({ helmet: 'iron_helmet', chestplate: null, leggings: null, boots: null, shield: 'shield' });
    expect(sanitizeEquipment(COMBAT, null)).toEqual(emptyEquipment());
  });
});
