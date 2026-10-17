import { describe, expect, it } from 'vitest';
import { HORSE_COATS, animalParts, animalVariant, horseCoat, horseVoxels } from './animalModel';

describe('말 털색 (#177)', () => {
  it('검정·갈색·흰색·회색·얼룩말 다섯 가지가 번호로 고르게 나온다', () => {
    const seen = new Set<string>();
    for (let id = 1; id <= 200; id++) seen.add(horseCoat(animalVariant(id)));
    expect([...seen].sort()).toEqual([...HORSE_COATS].sort());
    expect(horseCoat(0)).toBe('black');
    expect(horseCoat(0.999)).toBe('zebra');
  });

  it('얼룩말은 흰 바탕에 검은 줄이 있고, 모든 말은 발굽이 어둡다', () => {
    const zebra = horseVoxels(0.9);
    const colors = new Set(zebra.map((v) => v.c));
    expect(zebra.some((v) => v.c === '#1a1a1a')).toBe(true); // 검은 줄
    expect(colors.size).toBeGreaterThan(10); // 흰 바탕 얼룩
    for (let v = 0.1; v < 1; v += 0.2) {
      const legs = animalParts('horse', v).legs;
      expect(legs).toHaveLength(4);
      for (const l of legs) for (const c of l.v) if (c.y === 0) expect(['#2a2622', '#7a7772']).toContain(c.c);
    }
  });
});
