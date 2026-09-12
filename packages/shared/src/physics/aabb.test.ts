import { describe, expect, it } from 'vitest';
import { type MoveResult, bodyIntersects, bodyOverlapsBlock, hasGroundBelow, moveBody, tryStepUp } from './aabb';

const PLAYER = { w: 0.6, h: 1.8 };
const floorAt = (fy: number) => (_x: number, y: number, _z: number) => y <= fy;
const fresh = (): MoveResult => ({ onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false });

describe('moveBody', () => {
  it('떨어지다 바닥에 멈추고 onGround 가 된다 (터널링 없음)', () => {
    const pos = { x: 0.5, y: 5, z: 0.5 };
    const vel = { x: 0, y: -20, z: 0 };
    const out = fresh();
    moveBody(floorAt(2), pos, PLAYER, vel, 1, out); // 한 번에 20블록 낙하
    expect(pos.y).toBe(3);
    expect(vel.y).toBe(0);
    expect(out.onGround).toBe(true);
  });

  it('바닥 위에서 옆으로 걸으면 바닥에 걸리지 않는다', () => {
    const pos = { x: 0.5, y: 3, z: 0.5 };
    const vel = { x: 4, y: -0.5, z: 0 };
    const out = fresh();
    moveBody(floorAt(2), pos, PLAYER, vel, 1 / 60, out);
    expect(pos.x).toBeCloseTo(0.5 + 4 / 60);
    expect(pos.y).toBe(3);
    expect(out.hitX).toBe(false);
    expect(out.onGround).toBe(true);
  });

  it('벽에 부딪히면 벽면에 멈춘다', () => {
    const wall = (x: number, y: number) => y <= 2 || x === 3;
    const pos = { x: 1.0, y: 3, z: 0.5 };
    const vel = { x: 10, y: 0, z: 0 };
    const out = fresh();
    moveBody(wall, pos, PLAYER, vel, 1, out);
    expect(pos.x).toBeCloseTo(3 - 0.3, 3);
    expect(vel.x).toBe(0);
    expect(out.hitX).toBe(true);
  });

  it('천장에 머리를 부딪히면 위로 못 간다', () => {
    const ceil = (_x: number, y: number) => y <= 2 || y === 6;
    const pos = { x: 0.5, y: 3, z: 0.5 };
    const vel = { x: 0, y: 9, z: 0 };
    const out = fresh();
    moveBody(ceil, pos, PLAYER, vel, 1, out);
    expect(pos.y).toBeCloseTo(6 - 1.8, 3);
    expect(out.hitCeiling).toBe(true);
  });

  it('-Z 방향 벽도 막는다', () => {
    const wall = (_x: number, y: number, z: number) => y <= 2 || z === -2;
    const pos = { x: 0.5, y: 3, z: 0.5 };
    const vel = { x: 0, y: 0, z: -10 };
    const out = fresh();
    moveBody(wall, pos, PLAYER, vel, 1, out);
    expect(pos.z).toBeCloseTo(-1 + 0.3, 3);
    expect(out.hitZ).toBe(true);
  });

  it('1블록 높이 턱은 못 올라간다 (자동 계단 없음)', () => {
    const step = (x: number, y: number) => y <= 2 || (x >= 2 && y === 3);
    const pos = { x: 1.0, y: 3, z: 0.5 };
    const vel = { x: 3, y: 0, z: 0 };
    const out = fresh();
    moveBody(step, pos, PLAYER, vel, 1, out);
    expect(pos.x).toBeCloseTo(2 - 0.3, 3);
    expect(out.hitX).toBe(true);
  });
});

describe('tryStepUp (자동 턱 오르기)', () => {
  const H = 1 / 60;
  // 바닥 y<=2, x>=3 은 한 칸 높은 턱(y=3)
  const oneStep = (x: number, y: number) => y <= 2 || (x >= 3 && y === 3);
  // x>=3 은 두 칸 벽
  const twoWall = (x: number, y: number) => y <= 2 || (x >= 3 && (y === 3 || y === 4));
  // 턱 위 천장이 낮음 (y=5): 몸 1.8 이 들어갈 자리가 없다
  const lowCeiling = (x: number, y: number) => oneStep(x, y) || y === 5;

  function walkInto(world: (x: number, y: number, z: number) => boolean) {
    // 몸 오른쪽 끝이 2.99 → 한 스텝(4/60 ≈ 0.067)에 x=3 턱에 닿는다
    const start = { x: 2.69, y: 3, z: 0.5 };
    const pos = { ...start };
    const vel = { x: 4, y: -0.5, z: 0 };
    const out = fresh();
    moveBody(world, pos, PLAYER, vel, H, out);
    return { start, pos, out, vel };
  }

  it('한 칸 턱은 올라간다', () => {
    const { start, pos, out } = walkInto(oneStep);
    expect(out.hitX).toBe(true); // 먼저 막히고
    const r = tryStepUp(oneStep, start, pos, PLAYER, 4, 0, H);
    expect(r).not.toBeNull();
    expect(pos.y).toBe(4); // 턱 위
    expect(pos.x).toBeGreaterThan(start.x); // 앞으로도 갔다
    expect(r!.dy).toBe(1);
    expect(r!.vx).toBe(4); // 수평 속도 유지
  });

  it('두 칸 벽은 못 올라간다', () => {
    const { start, pos } = walkInto(twoWall);
    const before = { ...pos };
    expect(tryStepUp(twoWall, start, pos, PLAYER, 4, 0, H)).toBeNull();
    expect(pos).toEqual(before);
  });

  it('턱 위 천장이 낮으면 포기한다', () => {
    const { start, pos } = walkInto(lowCeiling);
    expect(tryStepUp(lowCeiling, start, pos, PLAYER, 4, 0, H)).toBeNull();
  });

  it('충돌 없이 걸을 땐 아무것도 안 한다', () => {
    const flat = (_x: number, y: number) => y <= 2;
    const { start, pos } = walkInto(flat);
    expect(tryStepUp(flat, start, pos, PLAYER, 4, 0, H)).toBeNull();
    expect(pos.y).toBe(3);
  });
});

describe('겹침 판정', () => {
  it('bodyIntersects / bodyOverlapsBlock / hasGroundBelow', () => {
    const pos = { x: 0.5, y: 3, z: 0.5 };
    expect(bodyIntersects(floorAt(2), pos, PLAYER)).toBe(false);
    expect(bodyIntersects(floorAt(3), pos, PLAYER)).toBe(true);
    expect(bodyOverlapsBlock(pos, PLAYER, 0, 3, 0)).toBe(true); // 발 위치 블록
    expect(bodyOverlapsBlock(pos, PLAYER, 0, 4, 0)).toBe(true); // 머리 위치
    expect(bodyOverlapsBlock(pos, PLAYER, 0, 5, 0)).toBe(false); // 머리 위 (1.8 < 2)
    expect(bodyOverlapsBlock(pos, PLAYER, 1, 3, 0)).toBe(false); // 옆 칸
    expect(hasGroundBelow(floorAt(2), pos, PLAYER)).toBe(true);
    expect(hasGroundBelow(floorAt(1), pos, PLAYER)).toBe(false);
  });
});
