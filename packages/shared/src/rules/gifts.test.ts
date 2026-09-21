import { describe, expect, it } from 'vitest';
import { GIFTS, ITEM_NAMES } from './data';
import { parseGifts } from './gifts';

describe('선물 (#79)', () => {
  it('data/gifts.json 을 읽고, 철 도끼 선물이 있다', () => {
    expect(GIFTS.length).toBeGreaterThanOrEqual(1);
    const axe = GIFTS.find((g) => g.id === 'iron_axe_2026_09_21');
    expect(axe).toMatchObject({ name: '철 도끼', items: { iron_axe: 1 } });
    expect(axe!.message).toContain('철 도끼');
    // 선물 아이템은 모두 한국어 이름이 있어야 가방에서 읽힌다
    for (const g of GIFTS) for (const item of Object.keys(g.items)) expect(ITEM_NAMES.get(item), item).toBeTruthy();
  });

  it('message 를 안 적으면 기본 문구, 같은 id 가 둘이면 한국어로 알려준다', () => {
    const [g] = parseGifts({ gifts: [{ id: 'a', name: '사과', items: { apple: 1 } }] });
    expect(g!.message).toBe('선물이 왔어요: 사과');
    expect(() => parseGifts({ gifts: [{ id: 'a', name: '사과', items: { apple: 1 } }, { id: 'a', name: '빵', items: { bread: 1 } }] })).toThrow(/두 번/);
    expect(() => parseGifts({ gifts: [{ id: 'Big', name: '사과', items: { apple: 1 } }] })).toThrow(/영문 소문자/);
    expect(() => parseGifts({ gifts: [{ id: 'a', name: '너무많음', items: { apple: 700 } }] })).toThrow(/가방/);
  });
});
