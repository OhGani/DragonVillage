import { describe, expect, it } from 'vitest';
import { mobSize } from '@dragon-village/shared';
import { HORSE_COATS, WILD_MODEL_KINDS, animalParts, animalVariant, horseCoat, horseVoxels, wildParts } from './animalModel';

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

describe('원정 사냥 동물 모델 (2026-11-05)', () => {
  const VOXEL = 1.8 / 32;
  for (const kind of WILD_MODEL_KINDS) {
    it(`${kind}: 발이 땅(y 0)에 닿고, 키가 몸 판정(MOB_SIZES)과 비슷하다`, () => {
      const p = wildParts(kind)!;
      const all = [...p.body, ...p.head.v, ...p.legs.flatMap((l) => l.v), ...(p.tail?.v ?? []), ...p.wings.flatMap((w) => w.v)];
      expect(all.length).toBeGreaterThan(30);
      expect(Math.min(...all.map((v) => v.y))).toBe(0);
      const top = (Math.max(...all.map((v) => v.y)) + 1) * VOXEL;
      const h = mobSize(kind).h;
      expect(top).toBeGreaterThan(h * 0.6);
      expect(top).toBeLessThan(h * 1.45);
    });
  }
  it('모르는 종류는 null', () => {
    expect(wildParts('cow')).toBeNull();
  });
});
