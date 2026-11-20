import { describe, expect, it } from 'vitest';
import { BLOCKS, RECIPES } from './data';
import { CHAIR_SEAT, DOOR_FACING, chairBoxes } from './blocks';
import { BOWL, dishOf, inBowl } from './food';
import { itemForPlacing } from './items';
import { FINE_RES, fineSolidQuery, raycastFine, standTop } from './stairs';

const CHAIR = BLOCKS.numOf('chair');

describe('의자·그릇 (아빠 2026-11-20)', () => {
  it('의자: 방향 넷 변형, 어느 쪽이든 의자 하나, 모양 상자는 북쪽 것을 돌린 것 — 등받이가 보는 쪽의 반대편', () => {
    const d = BLOCKS.get(CHAIR);
    expect(d.chair).toEqual({ base: CHAIR, facing: 0 });
    for (let f = 0; f < 4; f++) {
      const num = BLOCKS.chairVariant(CHAIR, f);
      const vd = BLOCKS.get(num);
      expect(vd.chair?.facing).toBe(f);
      expect(vd.id).toBe(f === 0 ? 'chair' : `chair@${DOOR_FACING[f]}`);
      expect(itemForPlacing(vd.id, BLOCKS)).toBe('chair');
      expect(vd.drops ?? vd.id).toBe('chair');
      expect(vd.box).toEqual(chairBoxes(f));
    }
    // 등받이(가장 높은 상자): 북쪽을 보면 남쪽 가장자리, 동쪽을 보면 서쪽 가장자리
    const back = (f: number) => chairBoxes(f).find((b) => b[4] === 16)!;
    expect(back(0)[2]).toBeGreaterThanOrEqual(12);
    expect(back(1)[3]).toBeLessThanOrEqual(4);
    expect(back(2)[5]).toBeLessThanOrEqual(4);
    expect(back(3)[0]).toBeGreaterThanOrEqual(12);
    expect(CHAIR_SEAT).toBe(0.5);
    const r = RECIPES.defs.find((x) => x.id === 'chair')!;
    expect(r.out).toEqual({ chair: 2 });
  });

  it('의자 부딪히기: 앉는 판 높이(아래 반)까지 + 등받이 줄은 위까지. 조준은 칸 어디나. 몹은 반 칸 높이에 선다', () => {
    const east = BLOCKS.chairVariant(CHAIR, 1); // 동쪽을 본다 → 등받이는 서쪽(조각 x 0)
    const get = (x: number, y: number, z: number) => (x === 0 && y === 0 && z === 0 ? east : 0);
    const solid = fineSolidQuery(BLOCKS, get);
    const S = FINE_RES - 1;
    expect(solid(2, 1, 2)).toBe(true); // 아래 반
    expect(solid(2, 2, 2)).toBe(false); // 앉는 판 위는 비었다
    expect(solid(0, 3, 2)).toBe(true); // 서쪽 등받이 줄
    expect(solid(S, 3, 2)).toBe(false);
    const hit = raycastFine(BLOCKS, get, (id) => id !== 0, 3.5, 0.9, 0.5, -1, 0, 0, 8)!; // 동쪽에서 위쪽 반을 겨눠도 의자
    expect(hit.id).toBe(east);
    expect(standTop(BLOCKS, get, 0, 0, 0, 0.5, 0.5)).toBe(0.5);
  });

  it('그릇 자리 값: bowl = 빈 그릇, bowl:<음식> = 담긴 것', () => {
    expect(dishOf(null)).toEqual({ food: null, bowl: false });
    expect(dishOf('apple')).toEqual({ food: 'apple', bowl: false });
    expect(dishOf(BOWL)).toEqual({ food: null, bowl: true });
    expect(dishOf(inBowl('apple'))).toEqual({ food: 'apple', bowl: true });
  });
});
