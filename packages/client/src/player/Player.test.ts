import { describe, expect, it } from 'vitest';
import { HORSE_SEAT_Y, PIG_SEAT_Y, PIG_SLOW, PIG_SPEED, RIDE_SEAT_Y } from '@dragon-village/shared';
import { Player } from './Player';
import type { InputState } from '../input/InputState';

/** 바닥 y<8 만 돌인 납작한 세계 */
function flatWorld() {
  const world = { sizeX: 64, sizeY: 32, sizeZ: 64, getBlock: (_x: number, y: number, _z: number) => (y < 8 ? 1 : 0) };
  const registry = { isSolid: (id: number) => id === 1, get: () => ({ fluid: null }) };
  return { world, registry };
}
const IDLE = { moveX: 0, moveZ: 0, lookDX: 0, lookDY: 0, jump: false, sneak: false, sprint: false, primary: false, secondaryTap: false, secondaryHold: false, guard: false, slotDelta: 0, slotSelect: -1, toggleDebug: false } satisfies InputState;

describe('탈것을 타면 바닥 밑으로 안 들어간다 (#178)', () => {
  it('말을 타면 발이 땅 + 안장 높이에 서고, 내리면 다시 땅에 선다', () => {
    const { world, registry } = flatWorld();
    const p = new Player(world as never, registry as never, { x: 10, y: 8, z: 10 });
    for (let i = 0; i < 30; i++) p.update(IDLE, 1 / 30);
    expect(p.pos.y).toBeCloseTo(8, 2);
    p.riding = true;
    p.mountKind = 'horse';
    p.liftForMount();
    for (let i = 0; i < 60; i++) p.update(IDLE, 1 / 30);
    expect(p.pos.y).toBeCloseTo(8 + HORSE_SEAT_Y, 2);
    expect(p.onGround).toBe(true);
    p.riding = false;
    p.mountKind = null;
    for (let i = 0; i < 60; i++) p.update(IDLE, 1 / 30);
    expect(p.pos.y).toBeCloseTo(8, 2);
  });

  it('드래곤은 안장 높이가 다르고, 천장이 낮으면 닿기 직전까지만 올린다', () => {
    const { world, registry } = flatWorld();
    const p = new Player(world as never, registry as never, { x: 10, y: 8, z: 10 });
    p.riding = true;
    p.liftForMount();
    expect(p.pos.y).toBeCloseTo(8 + RIDE_SEAT_Y, 5);
    const low = { ...world, getBlock: (_x: number, y: number, _z: number) => (y < 8 || y === 10 ? 1 : 0) }; // 천장 y 10 (머리 위 2칸)
    const q = new Player(low as never, registry as never, { x: 10, y: 8, z: 10 });
    q.riding = true;
    q.mountKind = 'horse';
    q.liftForMount();
    expect(q.pos.y).toBeCloseTo(10 - 1.8 - 0.002, 3); // 머리가 천장에 닿기 직전까지
    for (let i = 0; i < 30; i++) q.update(IDLE, 1 / 30);
    expect(q.pos.y).toBeCloseTo(10 - 1.8 - 0.002, 2); // 끼이지 않고 그 높이에 선다
  });
});

describe('돼지 타기 (#185)', () => {
  it('돼지는 발이 땅 + 0.85 에 서고, 당근 낚싯대 없이는 느리고, 점프는 못 한다', () => {
    const world = { sizeX: 64, sizeY: 32, sizeZ: 64, getBlock: (_x: number, y: number, _z: number) => (y < 8 ? 1 : 0) };
    const registry = { isSolid: (id: number) => id === 1, get: () => ({ fluid: null }) };
    const p = new Player(world as never, registry as never, { x: 32, y: 8, z: 56 }); // -z 로 달리니 끝에 안 닿게 멀리서
    p.riding = true;
    p.mountKind = 'pig';
    p.liftForMount();
    for (let i = 0; i < 60; i++) p.update(IDLE, 1 / 30);
    expect(p.pos.y).toBeCloseTo(8 + PIG_SEAT_Y, 2);
    const forward = { ...IDLE, moveZ: 1 };
    for (let i = 0; i < 90; i++) p.update(forward, 1 / 30);
    expect(p.horizontalSpeed).toBeLessThan(PIG_SLOW + 0.05);
    p.carrotStick = true;
    for (let i = 0; i < 90; i++) p.update(forward, 1 / 30);
    expect(p.horizontalSpeed).toBeGreaterThan(PIG_SPEED - 0.3);
    const y0 = p.pos.y;
    for (let i = 0; i < 10; i++) p.update({ ...IDLE, jump: true }, 1 / 30);
    expect(p.pos.y).toBeCloseTo(y0, 2); // 점프 안 됨
  });
});

describe('드래곤 타고 날 때 턱 넘기 (아빠 2026-11-05 "턱에 걸려서 움직이지 않는다")', () => {
  /** 바닥 y<8, z<40 부터는 한 칸 높은 턱(y 8 도 돌). wallH 를 주면 z 39 한 줄이 그 높이까지 벽 */
  function ledgeWorld(wallH = 0) {
    const world = { sizeX: 64, sizeY: 32, sizeZ: 64, getBlock: (_x: number, y: number, z: number) => (y < 8 || (z < 40 && y === 8) || (z === 39 && y < 8 + wallH) ? 1 : 0) };
    const registry = { isSolid: (id: number) => id === 1, get: () => ({ fluid: null }) };
    return { world, registry };
  }
  const forward = { ...IDLE, moveZ: 1 };

  it('땅에 붙어 날다 한 칸 턱을 만나면 저절로 넘어간다 (앞으로만 밀어도)', () => {
    const { world, registry } = ledgeWorld();
    const p = new Player(world as never, registry as never, { x: 32, y: 8, z: 46 });
    p.riding = true;
    p.liftForMount();
    for (let i = 0; i < 60; i++) p.update(forward, 1 / 30); // 2초 = 18칸
    expect(p.pos.z).toBeLessThan(36);
    expect(p.pos.y).toBeGreaterThanOrEqual(9 + RIDE_SEAT_Y - 0.01); // 턱 위 (드래곤 등 높이만큼)
  });

  it('높은 벽(세 칸)은 저절로 못 넘는다 — ▲ 로 올라가야 한다', () => {
    const { world, registry } = ledgeWorld(3);
    const p = new Player(world as never, registry as never, { x: 32, y: 8, z: 46 });
    p.riding = true;
    p.liftForMount();
    for (let i = 0; i < 60; i++) p.update(forward, 1 / 30);
    expect(p.pos.z).toBeGreaterThan(40);
    for (let i = 0; i < 60; i++) p.update({ ...forward, jump: true }, 1 / 30);
    expect(p.pos.z).toBeLessThan(38);
  });
});
