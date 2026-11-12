import { describe, expect, it } from 'vitest';
import { type MoveResult, moveBody, tryStepUp } from '../physics/aabb';
import { BLOCKS, RECIPES } from './data';
import { itemForPlacing } from './items';
import { FINE_RES, STAIR_INNER_LEFT, STAIR_INNER_RIGHT, STAIR_OUTER_LEFT, STAIR_OUTER_RIGHT, STAIR_STRAIGHT, fineSolidQuery, stairMask, stairShape } from './stairs';

const PLAYER = { w: 0.6, h: 1.8 };
/** 조각 번호: sx + sz·2 + sy·4 */
const bit = (sx: number, sy: number, sz: number) => 1 << (sx + sz * 2 + sy * 4);

describe('계단 (#291, 아빠 2026-11-13)', () => {
  it('JSON 의 계단 하나에서 방향 4 × 뒤집힘 2 = 여덟 가지가 나오고, 어느 것이든 그 계단 아이템 하나로 놓고 하나로 돌아온다', () => {
    const base = BLOCKS.require('oak_stairs');
    expect(base.stairs).toEqual({ base: base.num, facing: 0, top: false });
    expect(base.solid).toBe(true);
    expect(base.transparent).toBe(true); // 반쯤 빈 블록 — 옆 블록의 면을 가리지 않는다
    expect(base.lightFilter).toBe(0);
    const seen = new Set<number>();
    for (const top of [false, true])
      for (let facing = 0; facing < 4; facing++) {
        const d = BLOCKS.get(BLOCKS.stairVariant(base.num, facing, top));
        expect(d.stairs).toEqual({ base: base.num, facing, top });
        expect(d.drops).toBe('oak_stairs');
        expect(itemForPlacing(d.id, BLOCKS)).toBe('oak_stairs');
        seen.add(d.num);
      }
    expect(seen.size).toBe(8);
    expect(BLOCKS.stairVariant(base.num, 0, false)).toBe(base.num); // 북쪽·바로 선 것이 JSON 의 계단 그대로 (저장된 마을의 계단이 살아 있다)
    expect(BLOCKS.find('oak_stairs@e^')?.stairs).toEqual({ base: base.num, facing: 1, top: true });
    expect(BLOCKS.find('oak_stairs@s')?.internal).toBe(true);
  });

  it('계단 16종: 재료 6개 → 4개 (ㄴ자 모양), 그림은 재료 블록 그대로', () => {
    const stairs = BLOCKS.defs.filter((d) => d.shape === 'stairs' && !d.internal);
    expect(stairs.length).toBe(16);
    for (const s of stairs) {
      const r = RECIPES.defs.find((x) => x.out[s.id]);
      expect(r, s.id).toBeDefined();
      expect(r!.out[s.id]).toBe(4);
      const [mat, n] = Object.entries(r!.in)[0]!;
      expect(n).toBe(6);
      expect(BLOCKS.require(mat).textures).toEqual(s.textures);
    }
  });

  it('조각: 바로 선 계단은 아래 넷 + 높은 쪽 위 둘, 뒤집힌 계단은 위 넷 + 높은 쪽 아래 둘', () => {
    // 북쪽(−z)이 높다: 위층의 sz = 0 두 조각
    expect(stairMask(0, false, STAIR_STRAIGHT)).toBe(0x0f | bit(0, 1, 0) | bit(1, 1, 0));
    // 동쪽(+x)이 높다
    expect(stairMask(1, false, STAIR_STRAIGHT)).toBe(0x0f | bit(1, 1, 0) | bit(1, 1, 1));
    expect(stairMask(2, true, STAIR_STRAIGHT)).toBe(0xf0 | bit(0, 0, 1) | bit(1, 0, 1));
    // 모서리: 바깥은 한 조각, 안쪽은 세 조각. 왼쪽 = 올라가는 사람의 왼쪽(북쪽을 보면 서쪽 = sx 0)
    expect(stairMask(0, false, STAIR_OUTER_LEFT)).toBe(0x0f | bit(0, 1, 0));
    expect(stairMask(0, false, STAIR_OUTER_RIGHT)).toBe(0x0f | bit(1, 1, 0));
    expect(stairMask(0, false, STAIR_INNER_LEFT)).toBe(0x0f | bit(0, 1, 0) | bit(1, 1, 0) | bit(0, 1, 1));
    expect(stairMask(0, false, STAIR_INNER_RIGHT)).toBe(0x0f | bit(0, 1, 0) | bit(1, 1, 0) | bit(1, 1, 1));
  });

  it('모서리 모양은 이웃을 보고: 앞에 옆으로 돌아선 계단 → 바깥 모서리, 뒤에 있으면 안쪽 모서리. 한 줄 계단·뒤집힘이 다르면 그대로', () => {
    const at = (cells: Record<string, { facing: number; top: boolean }>) => (dx: number, dz: number) => cells[`${dx},${dz}`] ?? null;
    expect(stairShape(0, false, at({}))).toBe(STAIR_STRAIGHT);
    // 북쪽을 보는 계단의 앞(북, dz −1)에 서쪽을 보는 계단
    expect(stairShape(0, false, at({ '0,-1': { facing: 3, top: false } }))).toBe(STAIR_OUTER_LEFT);
    expect(stairShape(0, false, at({ '0,-1': { facing: 1, top: false } }))).toBe(STAIR_OUTER_RIGHT);
    // 뒤(남, dz +1)에 있으면 안쪽
    expect(stairShape(0, false, at({ '0,1': { facing: 3, top: false } }))).toBe(STAIR_INNER_LEFT);
    expect(stairShape(0, false, at({ '0,1': { facing: 1, top: false } }))).toBe(STAIR_INNER_RIGHT);
    // 같은 축(마주 보거나 같은 쪽)이면 모서리 아님, 뒤집힘이 다르면 모서리 아님
    expect(stairShape(0, false, at({ '0,-1': { facing: 2, top: false } }))).toBe(STAIR_STRAIGHT);
    expect(stairShape(0, false, at({ '0,-1': { facing: 3, top: true } }))).toBe(STAIR_STRAIGHT);
    // 옆 칸(동쪽)에 나와 똑같이 선 계단이 이어져 있으면 그쪽으로는 모서리를 안 만든다 (긴 계단의 가운데)
    expect(stairShape(0, false, at({ '0,-1': { facing: 3, top: false }, '1,0': { facing: 0, top: false } }))).toBe(STAIR_STRAIGHT);
  });

  it('반 칸 턱: 계단 낮은 쪽에 서면 반 칸 높이, 걸어가면 1 → 1.5 → 2 → 2.5 → 3 으로 저절로 올라간다', () => {
    const STONE = BLOCKS.numOf('stone');
    const UP = BLOCKS.stairVariant(BLOCKS.numOf('oak_stairs'), 0, false); // 북쪽(−z)이 높다
    // 바닥 y 0. z 4 에 계단(y 1), z 3 에 돌(y 1) + 계단(y 2), z ≤ 2 는 y 2 까지 돌
    const getBlock = (x: number, y: number, z: number): number => {
      if (y <= 0) return STONE;
      if (x !== 0) return 0;
      if (z === 4) return y === 1 ? UP : 0;
      if (z === 3) return y === 1 ? STONE : y === 2 ? UP : 0;
      if (z <= 2) return y <= 2 ? STONE : 0;
      return 0;
    };
    const solid = fineSolidQuery(BLOCKS, getBlock);
    // 가만히 떨어뜨리면 낮은 쪽(남쪽 반)에서는 y 1.5, 높은 쪽에서는 y 2
    const out: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
    for (const [z, y] of [
      [4.7, 1.5],
      [4.3, 2],
    ] as const) {
      const p = { x: 0.5, y: 4, z };
      // 몸 폭 0.6 이 한 조각(0.5) 안에 안 들어가니 폭을 줄여 조각 하나만 밟게
      moveBody(solid, p, { w: 0.3, h: 1.8 }, { x: 0, y: -10, z: 0 }, 1, out, FINE_RES);
      expect(p.y).toBeCloseTo(y, 5);
      expect(out.onGround).toBe(true);
    }
    // 걸어 올라가기
    const pos = { x: 0.5, y: 1, z: 5.6 };
    const vel = { x: 0, y: 0, z: -4 };
    const heights = new Set<number>();
    let ground = true;
    const dt = 1 / 60;
    for (let i = 0; i < 90; i++) {
      vel.z = -4;
      vel.y -= 32 * dt;
      const start = { ...pos };
      moveBody(solid, pos, PLAYER, vel, dt, out, FINE_RES);
      let onGround = out.onGround;
      if (ground && out.hitZ) {
        const r = tryStepUp(solid, start, pos, PLAYER, 0, -4, dt, 1, true, FINE_RES);
        if (r) {
          vel.y = 0;
          onGround = true;
        }
      }
      ground = onGround;
      if (ground) heights.add(Math.round(pos.y * 100) / 100);
    }
    expect([...heights].sort((a, b) => a - b)).toEqual([1, 1.5, 2, 2.5, 3]);
    expect(pos.z).toBeLessThan(2.5);
    // 눈금 1(칸 그대로)로 보면 계단은 그냥 꽉 찬 블록이다 — 서버의 몹·동물은 이렇게 본다
    expect(BLOCKS.isSolid(UP)).toBe(true);
  });

  it('머리 위가 낮아도 반 칸 턱은 오른다 — 한 칸을 다 못 올라가도 올라간 만큼으로 해 본다', () => {
    const STONE = BLOCKS.numOf('stone');
    const UP = BLOCKS.stairVariant(BLOCKS.numOf('oak_stairs'), 0, false);
    // 바닥 y 0, 천장 y 3, 계단은 (z 4, y 1)
    const solid = fineSolidQuery(BLOCKS, (_x, y, z) => (y <= 0 || y >= 3 ? STONE : z === 4 && y === 1 ? UP : 0));
    const out: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
    const start = { x: 0.5, y: 1, z: 5.31 };
    const tryWith = (h: number) => {
      const size = { w: 0.6, h };
      const pos = { ...start };
      moveBody(solid, pos, size, { x: 0, y: 0, z: -4 }, 1 / 60, out, FINE_RES);
      expect(out.hitZ).toBe(true);
      return tryStepUp(solid, start, pos, size, 0, -4, 1 / 60, 1, true, FINE_RES);
    };
    // 키 1.8: 머리 위 여유가 0.2 칸뿐이라 반 칸 턱도 못 넘는다
    expect(tryWith(1.8)).toBeNull();
    // 키 1.3: 여유 0.7 칸 — 한 칸은 못 올라가지만 반 칸 턱은 넘는다
    expect(tryWith(1.3)?.dy).toBeCloseTo(0.5, 5);
  });
});
