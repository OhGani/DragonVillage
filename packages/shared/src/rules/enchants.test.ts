import { describe, expect, it } from 'vitest';
import { armorTotals, bowOf, equipSlotOf } from './combat';
import { BLOCKS, COMBAT, ENCHANTS, ITEM_NAMES, TOOLS } from './data';
import { anvilCombine, canEnchant, countBookshelves, enchantTargetOf, knockbackFactor, meleeBonus, parseEnchants } from './enchants';
import { stackOf } from './inventory';
import { baseItemOf, encodeEnchanted, enchantLevelOf, itemName, parseEnchanted } from './items';
import { toolOf } from './tools';

describe('인챈트 (#231)', () => {
  it('data/enchants.json: 9개, 단계·값, 책장 수로 열리는 단계', () => {
    expect(ENCHANTS.list.length).toBeGreaterThanOrEqual(8);
    expect(ENCHANTS.get('sharpness')).toMatchObject({ name: '날카로움', max: 3 });
    expect(ENCHANTS.optionsFor('sword').map((e) => e.id)).toContain('sharpness');
    expect(ENCHANTS.optionsFor('bow').map((e) => e.id)).toEqual(['power']);
    expect(ENCHANTS.optionsFor('armor').map((e) => e.id)).toEqual(['protection']);
    expect([0, 4, 5, 9, 10, 15, 30].map((n) => ENCHANTS.maxLevelByShelves(n))).toEqual([1, 1, 2, 2, 3, 3, 3]);
    expect(ENCHANTS.cost(2)).toEqual({ levels: 6, lapis: 2 });
    expect(() => parseEnchants({ enchants: [{ id: 'a', name: 'x', for: ['sword'], max: 1 }, { id: 'a', name: 'y', for: ['bow'], max: 1 }] })).toThrow(/두 번/);
    expect(() => parseEnchants({ enchants: [{ id: 'a', name: 'x', for: ['hat'], max: 1 }] })).toThrow();
  });

  it('아이템 id: 붙이기·읽기·떼기, 이름은 "철 검 ✨날카로움 II", 하나씩만 쌓인다', () => {
    const id = encodeEnchanted('iron_sword', 'sharpness', 2);
    expect(id).toBe('iron_sword.ench.sharpness.2');
    expect(parseEnchanted(id)).toEqual({ base: 'iron_sword', ench: 'sharpness', level: 2 });
    expect(parseEnchanted('iron_sword')).toBeNull();
    expect(parseEnchanted('iron_sword.ench.sharpness.x')).toBeNull();
    expect(baseItemOf(id)).toBe('iron_sword');
    expect(enchantLevelOf(id, 'sharpness')).toBe(2);
    expect(enchantLevelOf(id, 'smite')).toBe(0);
    expect(itemName(id, BLOCKS, ITEM_NAMES)).toBe('철 검 ✨날카로움 II');
    expect(stackOf(id)).toBe(1);
  });

  it('도구·활·갑옷 조회는 인챈트가 붙어도 된다, 종류 판정, 보호는 방어 +단계', () => {
    expect(toolOf(TOOLS, 'iron_sword.ench.sharpness.2')?.id).toBe('iron_sword');
    expect(bowOf(COMBAT, 'bow.ench.power.1')?.id).toBe('bow');
    expect(equipSlotOf(COMBAT, 'iron_helmet.ench.protection.3')).toBe('helmet');
    expect(enchantTargetOf('iron_sword', TOOLS, COMBAT)).toBe('sword');
    expect(enchantTargetOf('iron_pickaxe', TOOLS, COMBAT)).toBe('pickaxe');
    expect(enchantTargetOf('crossbow', TOOLS, COMBAT)).toBe('bow');
    expect(enchantTargetOf('iron_chestplate', TOOLS, COMBAT)).toBe('armor');
    expect(enchantTargetOf('shield', TOOLS, COMBAT)).toBeNull();
    expect(enchantTargetOf('bread', TOOLS, COMBAT)).toBeNull();
    expect(canEnchant('iron_sword.ench.sharpness.1', TOOLS, COMBAT)).toEqual({ ok: false, reason: 'ALREADY' });
    expect(canEnchant('bread', TOOLS, COMBAT)).toEqual({ ok: false, reason: 'NOT_TARGET' });
    const plain = armorTotals(COMBAT, { helmet: 'iron_helmet', chestplate: null, leggings: null, boots: null, shield: null });
    const prot = armorTotals(COMBAT, { helmet: 'iron_helmet.ench.protection.3', chestplate: null, leggings: null, boots: null, shield: null });
    expect(prot.defense).toBe(plain.defense + 3);
  });

  it('근접 보너스: 날카로움 +1/단계, 강타는 언데드만 +2/단계, 살충은 거미만, 밀치기 배율', () => {
    expect(meleeBonus('iron_sword.ench.sharpness.3', 'zombie')).toBe(3);
    expect(meleeBonus('iron_sword.ench.smite.2', 'zombie')).toBe(4);
    expect(meleeBonus('iron_sword.ench.smite.2', 'spider')).toBe(0);
    expect(meleeBonus('iron_sword.ench.bane_of_arthropods.1', 'spider_king')).toBe(2);
    expect(meleeBonus('iron_sword', 'zombie')).toBe(0);
    expect(knockbackFactor('iron_sword.ench.knockback.2')).toBeCloseTo(2.6);
  });

  it('책장 세기: 테이블 둘레 한 칸 띄운 5×5 테두리 두 층만', () => {
    const shelves = new Set(['-2,0,0', '2,0,0', '0,0,-2', '0,1,2', '1,0,0', '0,0,0']); // 뒤의 둘은 바로 옆·테이블 자리 → 안 센다
    const idAt = (x: number, y: number, z: number) => (shelves.has(`${x},${y},${z}`) ? 'bookshelf' : 'air');
    expect(countBookshelves(idAt, 0, 0, 0)).toBe(4);
  });

  it('책 (#232): 책은 어떤 인챈트든 붙어 인챈트 책이 된다, 이름', () => {
    expect(enchantTargetOf('book', TOOLS, COMBAT)).toBe('book');
    expect(canEnchant('book', TOOLS, COMBAT)).toEqual({ ok: true, target: 'book' });
    expect(ENCHANTS.optionsFor('book').length).toBe(ENCHANTS.list.length);
    expect(ENCHANTS.allows(ENCHANTS.get('power')!, 'book')).toBe(true);
    expect(ENCHANTS.allows(ENCHANTS.get('power')!, 'sword')).toBe(false);
    expect(itemName('book.ench.power.2', BLOCKS, ITEM_NAMES)).toBe('책 ✨힘 II');
    expect(ENCHANTS.anvilCost(3)).toBe(6);
  });

  it('모루 합치기 (#232): 책 붙이기, 같은 단계 둘 → 한 단계 위, 다른 인챈트·다른 물건·빈 책은 거절', () => {
    const c = (a: string | null, b: string | null) => anvilCombine(a, b, ENCHANTS, TOOLS, COMBAT);
    expect(c('iron_sword', 'book.ench.sharpness.2')).toMatchObject({ ok: true, out: 'iron_sword.ench.sharpness.2', levels: 4, level: 2 });
    expect(c('iron_sword.ench.sharpness.1', 'book.ench.sharpness.1')).toMatchObject({ ok: true, out: 'iron_sword.ench.sharpness.2', levels: 4 });
    expect(c('iron_sword.ench.sharpness.1', 'book.ench.sharpness.3')).toMatchObject({ ok: true, out: 'iron_sword.ench.sharpness.3', levels: 6 });
    expect(c('iron_sword.ench.sharpness.3', 'book.ench.sharpness.3')).toEqual({ ok: false, reason: 'NO_GAIN' }); // 최대 3
    expect(c('iron_sword.ench.sharpness.2', 'book.ench.sharpness.1')).toEqual({ ok: false, reason: 'NO_GAIN' });
    expect(c('iron_sword.ench.sharpness.1', 'book.ench.smite.1')).toEqual({ ok: false, reason: 'OTHER_ENCHANT' });
    expect(c('iron_sword', 'book.ench.power.1')).toEqual({ ok: false, reason: 'BAD_ENCHANT' }); // 힘은 활에만
    expect(c('iron_sword', 'book')).toEqual({ ok: false, reason: 'NEED_ENCHANTED' });
    expect(c('bread', 'book.ench.sharpness.1')).toEqual({ ok: false, reason: 'NOT_TARGET' });
    expect(c('book', 'book.ench.sharpness.1')).toEqual({ ok: false, reason: 'NOT_TARGET' }); // 빈 책엔 옮기기만 — 안 됨
    expect(c('book.ench.sharpness.1', 'book.ench.sharpness.1')).toMatchObject({ ok: true, out: 'book.ench.sharpness.2' }); // 책끼리
    expect(c('iron_sword.ench.sharpness.1', 'iron_sword.ench.sharpness.1')).toMatchObject({ ok: true, out: 'iron_sword.ench.sharpness.2' }); // 같은 물건끼리
    expect(c('iron_sword', 'iron_sword.ench.sharpness.1')).toMatchObject({ ok: true, out: 'iron_sword.ench.sharpness.1' }); // 옮기기
    expect(c('iron_sword', 'diamond_sword.ench.sharpness.1')).toEqual({ ok: false, reason: 'NOT_SAME' });
    expect(c(null, 'book.ench.sharpness.1')).toEqual({ ok: false, reason: 'NEED_TWO' });
  });
});
