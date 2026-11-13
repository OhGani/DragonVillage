import { describe, expect, it } from 'vitest';
import { type MoveResult, moveBody } from '../physics/aabb';
import { SLAB_BOTTOM, SLAB_DOUBLE, SLAB_TOP } from './blocks';
import { BLOCKS, RECIPES } from './data';
import { dropOf, itemForPlacing } from './items';
import { FINE_RES, FULL_MASK, fineSolidQuery, partMask, raycastFine, standTop } from './stairs';

const noStairs = () => null;

describe('반 블록 (#292, 아빠 2026-11-13)', () => {
  const base = BLOCKS.require('oak_slab');
  const TOP = BLOCKS.slabVariant(base.num, SLAB_TOP);
  const DOUBLE = BLOCKS.slabVariant(base.num, SLAB_DOUBLE);

  it('JSON 의 반 블록 하나에서 아래·위·합친 한 칸이 나온다. 놓을 땐 언제나 반 블록 하나, 합친 것을 부수면 둘', () => {
    expect(base.slab).toEqual({ base: base.num, kind: SLAB_BOTTOM });
    expect(base.transparent).toBe(true);
    expect(base.lightFilter).toBe(0);
    expect(BLOCKS.slabVariant(base.num, SLAB_BOTTOM)).toBe(base.num);
    const top = BLOCKS.get(TOP),
      dbl = BLOCKS.get(DOUBLE);
    expect(top.id).toBe('oak_slab@^');
    expect(dbl.id).toBe('oak_slab@2');
    expect([top.internal, dbl.internal]).toEqual([true, true]);
    // 합친 것은 보통 블록: 불투명·빛을 막는다
    expect(BLOCKS.isOpaque(DOUBLE)).toBe(true);
    expect(dbl.lightFilter).toBe(15);
    expect(BLOCKS.isOpaque(TOP)).toBe(false);
    for (const d of [base, top, dbl]) expect(itemForPlacing(d.id, BLOCKS)).toBe('oak_slab');
    expect(dropOf(base, 1, 2, 3, 7)).toMatchObject({ item: 'oak_slab', count: 1 });
    expect(dropOf(top, 1, 2, 3, 7)).toMatchObject({ item: 'oak_slab', count: 1 });
    expect(dropOf(dbl, 1, 2, 3, 7)).toMatchObject({ item: 'oak_slab', count: 2 });
  });

  it('반 블록 16종: 재료 3개 한 줄 → 6개, 그림은 재료 블록 그대로', () => {
    const slabs = BLOCKS.defs.filter((d) => d.shape === 'slab' && !d.internal);
    expect(slabs.length).toBe(16);
    for (const s of slabs) {
      const r = RECIPES.defs.find((x) => x.out[s.id]);
      expect(r, s.id).toBeDefined();
      expect(r!.out[s.id]).toBe(6);
      const [mat, n] = Object.entries(r!.in)[0]!;
      expect(n).toBe(3);
      expect(BLOCKS.require(mat).textures).toEqual(s.textures);
    }
  });

  it('조각: 아래 반은 아래 넷, 위 반은 위 넷, 합친 것과 보통 블록은 여덟', () => {
    expect(partMask(base, noStairs, 0, 0, 0)).toBe(0x0f);
    expect(partMask(BLOCKS.get(TOP), noStairs, 0, 0, 0)).toBe(0xf0);
    expect(partMask(BLOCKS.get(DOUBLE), noStairs, 0, 0, 0)).toBe(FULL_MASK);
    expect(partMask(BLOCKS.require('stone'), noStairs, 0, 0, 0)).toBe(FULL_MASK);
  });

  it('아래 반 위에 서면 반 칸 높이, 위 반 아래로는 반 칸 틈이 있다', () => {
    const STONE = BLOCKS.numOf('stone');
    // 바닥 y 0. (0,1,0) 아래 반, (2,1,0) 위 반
    const solid = fineSolidQuery(BLOCKS, (x, y, z) => (y <= 0 ? STONE : y === 1 && z === 0 ? (x === 0 ? base.num : x === 2 ? TOP : 0) : 0));
    const out: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
    const a = { x: 0.5, y: 4, z: 0.5 };
    moveBody(solid, a, { w: 0.6, h: 1.8 }, { x: 0, y: -10, z: 0 }, 1, out, FINE_RES);
    expect(a.y).toBeCloseTo(1.5, 5);
    const b = { x: 2.5, y: 4, z: 0.5 };
    moveBody(solid, b, { w: 0.6, h: 1.8 }, { x: 0, y: -10, z: 0 }, 1, out, FINE_RES);
    expect(b.y).toBeCloseTo(2, 5); // 위 반의 윗면 = 칸 꼭대기
    // 키 0.4 짜리는 위 반 아래 틈(반 칸)에 들어간다
    const c = { x: 4.5, y: 1, z: 0.5 };
    moveBody(solid, c, { w: 0.6, h: 0.4 }, { x: -10, y: 0, z: 0 }, 1, out, FINE_RES);
    expect(c.x).toBeLessThan(2); // 위 반 아래를 지나 아래 반(반 칸 턱)에서 멈춘다
    expect(c.x).toBeCloseTo(1 + 0.3, 3);
  });

  it('조준은 보이는 면에: 반 블록 윗면은 반 칸 높이에서 맞고, 빈 반쪽으로 쏜 줄은 지나가 뒤 블록에 맞는다', () => {
    const STONE = BLOCKS.numOf('stone');
    // (5,1,5) 아래 반, 그 뒤 (5,1,3) 돌, 바닥 y 0
    const getBlock = (x: number, y: number, z: number) => (y <= 0 ? STONE : x === 5 && y === 1 && z === 5 ? base.num : x === 5 && y === 1 && z === 3 ? STONE : 0);
    const any = (id: number) => id !== 0;
    // 위에서 아래로
    const down = raycastFine(BLOCKS, getBlock, any, 5.5, 4, 5.5, 0, -1, 0, 6)!;
    expect(down).toMatchObject({ x: 5, y: 1, z: 5, ny: 1 });
    expect(down.distance).toBeCloseTo(2.5, 5); // y 4 → 1.5
    // 옆에서, 위쪽 반 높이(y 1.75)로 북쪽을 향해: 반 블록 위를 지나 뒤의 돌에
    const over = raycastFine(BLOCKS, getBlock, any, 5.5, 1.75, 8.5, 0, 0, -1, 8)!;
    expect(over).toMatchObject({ x: 5, y: 1, z: 3, nz: 1 });
    // 아래쪽 반 높이(y 1.25)면 반 블록 옆면에
    const side = raycastFine(BLOCKS, getBlock, any, 5.5, 1.25, 8.5, 0, 0, -1, 8)!;
    expect(side).toMatchObject({ x: 5, y: 1, z: 5, nz: 1 });
    expect(side.distance).toBeCloseTo(2.5, 5);
    // 눈이 들어 있는 칸은 통째로 건너뛴다 (전과 같음)
    const inside = raycastFine(BLOCKS, getBlock, any, 5.5, 1.9, 5.5, 0, -1, 0, 6)!;
    expect(inside).toMatchObject({ x: 5, y: 0, z: 5 });
    // 계단: 북쪽이 높은 계단을 남쪽에서 위쪽 반 높이로 쏘면 칸 가운데의 챌판에 맞는다
    const STAIR = BLOCKS.numOf('oak_stairs');
    const riser = raycastFine(BLOCKS, (x, y, z) => (x === 5 && y === 1 && z === 5 ? STAIR : 0), any, 5.5, 1.75, 8.5, 0, 0, -1, 8)!;
    expect(riser).toMatchObject({ x: 5, y: 1, z: 5, nz: 1 });
    expect(riser.distance).toBeCloseTo(3, 5); // z 8.5 → 5.5
  });

  it('딛는 높이 (#294): 보통 블록은 칸 꼭대기, 아래 반은 반 칸, 계단은 발밑 조각에 따라 — 모서리 계단도', () => {
    const STONE = BLOCKS.numOf('stone');
    const OAK = BLOCKS.numOf('oak_stairs'); // 북쪽이 높다
    const WEST = BLOCKS.stairVariant(OAK, 3, false);
    // (0,0,0) 돌, (1,0,0) 아래 반, (2,0,0) 위 반, (3,0,0) 계단, (5,0,5) 계단 + 그 북쪽 (5,0,4) 에 서쪽 계단 → 바깥 모서리
    const getBlock = (x: number, y: number, z: number) => (y !== 0 ? 0 : z === 0 ? [STONE, base.num, TOP, OAK][x] ?? 0 : x === 5 && z === 5 ? OAK : x === 5 && z === 4 ? WEST : 0);
    const top = (bx: number, bz: number, x: number, z: number) => standTop(BLOCKS, getBlock, bx, 0, bz, x, z);
    expect(top(0, 0, 0.5, 0.5)).toBe(1);
    expect(top(1, 0, 1.5, 0.5)).toBe(0.5);
    expect(top(2, 0, 2.5, 0.5)).toBe(1);
    expect(top(3, 0, 3.5, 0.2)).toBe(1);
    expect(top(3, 0, 3.5, 0.8)).toBe(0.5);
    // 바깥 모서리: 북서 조각만 높다
    expect(top(5, 5, 5.2, 5.2)).toBe(1);
    expect(top(5, 5, 5.8, 5.2)).toBe(0.5);
    expect(top(5, 5, 5.2, 5.8)).toBe(0.5);
  });
});
