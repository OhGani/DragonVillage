import { describe, expect, it } from 'vitest';
import { CAT_COATS, mobSize } from '@dragon-village/shared';
import { CAT_COAT_LIST, HORSE_COATS, animalVoxels, catCoat, collarVoxels, TROPICAL_VARIANTS, WILD_MODEL_KINDS, animalParts, animalVariant, horseCoat, horseVoxels, pufferPuffedVoxels, wildParts } from './animalModel';

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

describe('물고기 모델 (2026-11-06)', () => {
  it('열대어 12가지가 모두 만들어지고 색이 서로 다르다, 높은 몸(B)이 작은 몸(A)보다 크다', () => {
    const sig = new Set<string>();
    let maxA = 0,
      maxB = 0;
    TROPICAL_VARIANTS.forEach((v, i) => {
      const p = wildParts('tropical_fish', (i + 0.5) / TROPICAL_VARIANTS.length)!;
      const all = [...p.body, ...p.head.v, ...(p.tail?.v ?? [])];
      expect(Math.min(...all.map((c) => c.y))).toBe(0);
      sig.add([...new Set(all.map((c) => c.c))].sort().join());
      const top = Math.max(...all.map((c) => c.y));
      if (v.tall) maxB = Math.max(maxB, top);
      else maxA = Math.max(maxA, top);
    });
    expect(sig.size).toBe(TROPICAL_VARIANTS.length);
    expect(maxB).toBeGreaterThan(maxA);
  });

  it('부푼 복어는 작은 복어보다 훨씬 크다', () => {
    const small = wildParts('pufferfish')!.body;
    const big = pufferPuffedVoxels();
    const h = (vs: { y: number }[]) => Math.max(...vs.map((v) => v.y)) - Math.min(...vs.map((v) => v.y)) + 1;
    expect(h(big)).toBeGreaterThanOrEqual(h(small) * 2);
  });
});

describe('고양이 모델 (2026-11-06)', () => {
  const VOXEL = 1.8 / 32;
  it('털 11가지가 번호로 다 나오고(공유 CAT_COATS 와 같은 순서), 서로 색이 다르다', () => {
    expect([...CAT_COAT_LIST]).toEqual([...CAT_COATS]);
    const seen = new Set<string>();
    for (let id = 1; id <= 400; id++) seen.add(catCoat(animalVariant(id)));
    expect(seen.size).toBe(11);
    const sigs = new Set(CAT_COAT_LIST.map((_, i) => animalVoxels('cat', (i + 0.5) / CAT_COAT_LIST.length).map((v) => v.c).sort().join()));
    expect(sigs.size).toBe(11);
  });
  it('발이 땅에 닿고 키가 몸 판정과 비슷하다, 페르시안만 주둥이가 없다, 목걸이는 몸과 안 겹친다', () => {
    for (let i = 0; i < 11; i++) {
      const v = (i + 0.5) / 11;
      const all = animalVoxels('cat', v);
      expect(Math.min(...all.map((c) => c.y))).toBe(0);
      const h = (Math.max(...all.map((c) => c.y)) + 1) * VOXEL;
      expect(Math.abs(h - mobSize('cat').h)).toBeLessThan(0.15);
      const muzzle = animalParts('cat', v).head.v.some((c) => c.z === -12);
      expect(muzzle).toBe(catCoat(v) !== 'persian');
    }
    const body = new Set(animalParts('cat', 0.05).body.map((c) => `${c.x},${c.y},${c.z}`));
    for (const c of collarVoxels('cat')) expect(body.has(`${c.x},${c.y},${c.z}`)).toBe(false);
  });
});
