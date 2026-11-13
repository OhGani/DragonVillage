import { describe, expect, it } from 'vitest';
import { type MoveResult, moveBody, tryStepUp } from '../physics/aabb';
import { BLOCKS, RECIPES } from './data';
import { FENCE_E, FENCE_HEIGHT, FENCE_ICON_BOXES, FENCE_N, FENCE_W, fenceBoxes, fenceFoot, fenceLinks, fenceLinksAt, fenceNeighborOf, gateBoxes, gateFoot, trapBoxes, trapFoot, trapSlice } from './fence';
import { itemForPlacing } from './items';
import { FINE_RES, fineSolidQuery, raycastFine, standTop } from './stairs';

const PLAYER = { w: 0.6, h: 1.8 };
const FENCE = BLOCKS.numOf('oak_fence');
const GATE = BLOCKS.numOf('oak_fence_gate');
const STONE = BLOCKS.numOf('stone');
const fresh = (): MoveResult => ({ onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false });

/** 앞으로(−z) 걸으며 계속 뛰어 본다. 끝난 자리의 z */
function pushNorth(getBlock: (x: number, y: number, z: number) => number, steps = 240): { z: number; maxY: number } {
  const solid = fineSolidQuery(BLOCKS, getBlock);
  const pos = { x: 0.5, y: 1, z: 5.5 };
  const vel = { x: 0, y: 0, z: -4 };
  const out = fresh();
  let ground = true,
    maxY = 1;
  const dt = 1 / 60;
  for (let i = 0; i < steps; i++) {
    vel.z = -4;
    if (ground) vel.y = 9; // 점프 (JUMP_V)
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
    maxY = Math.max(maxY, pos.y);
  }
  return { z: pos.z, maxY };
}

describe('울타리·울타리문 (#295, 아빠 2026-11-13)', () => {
  it('울타리는 블록 하나, 울타리문은 방향 4 × 열림 2. 열린 문만 지나갈 수 있고, 놓을 때·부술 때는 언제나 문 하나', () => {
    const f = BLOCKS.get(FENCE);
    expect([f.fence, f.solid, f.transparent, f.lightFilter]).toEqual([true, true, true, 0]);
    const g = BLOCKS.get(GATE);
    expect(g.gate).toEqual({ base: GATE, facing: 0, open: false });
    const seen = new Set<number>();
    for (let facing = 0; facing < 4; facing++)
      for (const open of [false, true]) {
        const d = BLOCKS.get(BLOCKS.gateVariant(GATE, facing, open));
        expect(d.gate).toEqual({ base: GATE, facing, open });
        expect(d.solid).toBe(!open);
        expect(d.drops).toBe('oak_fence_gate');
        expect(itemForPlacing(d.id, BLOCKS)).toBe(open ? null : 'oak_fence_gate');
        seen.add(d.num);
      }
    expect(seen.size).toBe(8);
    expect(BLOCKS.find('oak_fence_gate@e>')?.gate).toEqual({ base: GATE, facing: 1, open: true });
  });

  it('나무 8종: 울타리는 판자 4 + 막대기 2 → 3, 울타리문은 막대기 4 + 판자 2 → 1', () => {
    const fences = BLOCKS.defs.filter((d) => d.shape === 'fence' && !d.internal),
      gates = BLOCKS.defs.filter((d) => d.shape === 'fence_gate' && !d.internal);
    expect([fences.length, gates.length]).toEqual([8, 8]);
    for (const d of fences) {
      const r = RECIPES.require(d.id);
      expect([r.out[d.id], r.in.stick]).toEqual([3, 2]);
    }
    for (const d of gates) {
      const r = RECIPES.require(d.id);
      expect([r.out[d.id], r.in.stick]).toEqual([1, 4]);
    }
  });

  it('가로대는 울타리·나란히 걸린 울타리문·꽉 찬 블록 쪽으로만 이어진다 (유리·계단·반 블록·열린 방향이 다른 문은 아님)', () => {
    const n = (id: string) => fenceNeighborOf(BLOCKS.require(id));
    for (let dir = 0; dir < 4; dir++) {
      expect(fenceLinks(n('spruce_fence'), dir)).toBe(true); // 다른 나무 울타리와도
      expect(fenceLinks(n('stone'), dir)).toBe(true);
      expect(fenceLinks(n('oak_slab@2'), dir)).toBe(true); // 합친 반 블록은 보통 블록
      for (const id of ['air', 'glass', 'oak_stairs', 'oak_slab', 'water', 'torch']) expect(fenceLinks(n(id), dir), id).toBe(false);
    }
    // 북쪽을 보고 놓은 문은 동서로 걸린다 → 그 동·서의 울타리와 이어진다 (열려 있어도)
    expect([0, 1, 2, 3].map((dir) => fenceLinks(n('oak_fence_gate'), dir))).toEqual([false, true, false, true]);
    expect([0, 1, 2, 3].map((dir) => fenceLinks(n('oak_fence_gate@e>'), dir))).toEqual([true, false, true, false]);
    // 세계에서: (0,0,0) 울타리, 북쪽에 울타리, 동쪽에 돌, 서쪽에 동서로 걸린 문
    const at = (x: number, _y: number, z: number) => (x === 0 && z === 0 ? FENCE : x === 0 && z === -1 ? FENCE : x === 1 && z === 0 ? STONE : x === -1 && z === 0 ? GATE : 0);
    expect(fenceLinksAt(BLOCKS, at, 0, 0, 0)).toBe(FENCE_N | FENCE_E | FENCE_W);
  });

  it('모양 상자: 기둥 하나 + 이어진 쪽마다 가로대 둘. 문은 닫히면 다섯 조각, 열리면 문짝이 보던 쪽으로', () => {
    expect(fenceBoxes(0)).toEqual([[6, 0, 6, 10, 16, 10]]);
    expect(fenceBoxes(FENCE_N | FENCE_E).length).toBe(5);
    expect(fenceBoxes(15).length).toBe(9);
    expect(FENCE_ICON_BOXES.length).toBe(4);
    const closed = gateBoxes(0, false);
    expect(closed.length).toBe(5);
    expect(closed.every((b) => b[2] === 7 && b[5] === 9)).toBe(true); // 동서로 걸린 얇은 판
    expect(gateBoxes(1, false).every((b) => b[0] === 7 && b[3] === 9)).toBe(true); // 동쪽을 보고 놓으면 남북으로
    // 열림: 북쪽(−z)을 보고 놓은 문은 문짝이 북쪽으로, 남쪽이면 남쪽으로
    const north = gateBoxes(0, true),
      south = gateBoxes(2, true);
    expect(north.length).toBe(8);
    expect(Math.min(...north.map((b) => b[2]))).toBe(1);
    expect(Math.max(...north.map((b) => b[5]))).toBe(9);
    expect(Math.max(...south.map((b) => b[5]))).toBe(15);
    for (const b of [...fenceBoxes(15), ...closed, ...north, ...south, ...gateBoxes(1, true), ...gateBoxes(3, true)]) {
      expect(Math.min(...b)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...b)).toBeLessThanOrEqual(16);
      expect(b[3] > b[0] && b[4] > b[1] && b[5] > b[2]).toBe(true);
    }
  });

  it('발자국: 울타리는 가운데 기둥 + 이어진 쪽, 닫힌 문은 걸린 방향으로 가운데 두 줄', () => {
    expect(fenceFoot(0, 1, 2)).toBe(true);
    expect(fenceFoot(0, 0, 1)).toBe(false);
    expect(fenceFoot(FENCE_W, 0, 1)).toBe(true);
    expect(fenceFoot(FENCE_W, 3, 1)).toBe(false);
    expect(fenceFoot(FENCE_N, 2, 0)).toBe(true);
    expect(fenceFoot(15, 0, 0)).toBe(false); // 귀퉁이는 언제나 비어 있다
    expect([0, 1, 2, 3].map((sz) => gateFoot(0, 0, sz))).toEqual([false, true, true, false]);
    expect([0, 1, 2, 3].map((sx) => gateFoot(1, sx, 0))).toEqual([false, true, true, false]);
  });

  it('사람은 울타리를 못 넘는다(점프 1.27칸 < 한 칸 반). 돌 한 칸은 넘는다. 위에 떨어지면 한 칸 반 높이에 선다', () => {
    const floor = (y: number) => (y <= 0 ? STONE : 0);
    // 동서로 길게 이어진 울타리 (z 3)
    const fenced = pushNorth((_x, y, z) => (y === 1 && z === 3 ? FENCE : floor(y)));
    expect(fenced.z).toBeGreaterThan(3.5);
    expect(fenced.maxY).toBeGreaterThan(2); // 뛰기는 뛴다
    const stone = pushNorth((_x, y, z) => (y === 1 && z === 3 ? STONE : floor(y)));
    expect(stone.z).toBeLessThan(2);
    // 떨어뜨리면 기둥 위 한 칸 반
    const solid = fineSolidQuery(BLOCKS, (x, y, z) => (y === 1 && x === 0 && z === 0 ? FENCE : floor(y)));
    const p = { x: 0.5, y: 5, z: 0.5 };
    const out = fresh();
    moveBody(solid, p, PLAYER, { x: 0, y: -10, z: 0 }, 1, out, FINE_RES);
    expect(p.y).toBeCloseTo(1 + FENCE_HEIGHT, 5);
    expect(standTop(BLOCKS, (x, y, z) => (y === 1 && x === 0 && z === 0 ? FENCE : floor(y)), 0, 1, 0, 0.5, 0.5)).toBe(1 + FENCE_HEIGHT);
  });

  it('닫힌 울타리문은 막고 열린 문은 지나간다', () => {
    const line = (gate: number) => (x: number, y: number, z: number) => (y <= 0 ? STONE : y === 1 && z === 3 ? (x === 0 ? gate : FENCE) : 0);
    expect(pushNorth(line(GATE)).z).toBeGreaterThan(3.5);
    expect(pushNorth(line(BLOCKS.gateVariant(GATE, 0, true))).z).toBeLessThan(2);
    expect(standTop(BLOCKS, line(GATE), 0, 1, 3, 0.5, 3.5)).toBe(1 + FENCE_HEIGHT);
  });

  it('조준: 혼자 선 울타리는 기둥에만 맞고 옆 빈 곳으로는 지나간다. 닫힌 문은 얇은 판에', () => {
    const any = (id: number) => id !== 0;
    const world = (x: number, y: number, z: number) => (x === 5 && y === 1 && z === 5 ? FENCE : x === 5 && y === 1 && z === 2 ? STONE : x === 8 && y === 1 && z === 5 ? GATE : 0);
    const post = raycastFine(BLOCKS, world, any, 5.5, 1.5, 8.5, 0, 0, -1, 8)!;
    expect(post).toMatchObject({ x: 5, y: 1, z: 5, nz: 1 });
    expect(post.distance).toBeCloseTo(2.75, 5); // 기둥의 남쪽 면 z 5.75
    const beside = raycastFine(BLOCKS, world, any, 5.1, 1.5, 8.5, 0, 0, -1, 8)!;
    expect(beside).toMatchObject({ x: 5, y: 1, z: 2 }); // 기둥 옆을 지나 뒤의 돌에
    const gate = raycastFine(BLOCKS, world, any, 8.1, 1.5, 8.5, 0, 0, -1, 8)!;
    expect(gate).toMatchObject({ x: 8, y: 1, z: 5, nz: 1 });
    expect(gate.distance).toBeCloseTo(2.75, 5);
  });
});

describe('다락문 (#296, 아빠 2026-11-13)', () => {
  const TRAP = BLOCKS.numOf('oak_trapdoor');
  const v = (facing: number, top: boolean, open: boolean) => BLOCKS.trapVariant(TRAP, facing, top, open);

  it('JSON 의 다락문 하나에서 방향 4 × 위아래 2 × 열림 2 = 열여섯. 닫힌 것만 단단하고, 놓을 때·부술 때는 언제나 다락문 하나', () => {
    expect(BLOCKS.get(TRAP).trap).toEqual({ base: TRAP, facing: 0, top: false, open: false });
    expect([BLOCKS.get(TRAP).transparent, BLOCKS.get(TRAP).lightFilter]).toEqual([true, 0]);
    const seen = new Set<number>();
    for (let facing = 0; facing < 4; facing++)
      for (const top of [false, true])
        for (const open of [false, true]) {
          const d = BLOCKS.get(v(facing, top, open));
          expect(d.trap).toEqual({ base: TRAP, facing, top, open });
          expect(d.solid).toBe(!open);
          expect(d.drops).toBe('oak_trapdoor');
          expect(itemForPlacing(d.id, BLOCKS)).toBe(open ? null : 'oak_trapdoor');
          seen.add(d.num);
        }
    expect(seen.size).toBe(16);
    expect(v(0, false, false)).toBe(TRAP);
    expect(BLOCKS.find('oak_trapdoor@s^>')?.trap).toEqual({ base: TRAP, facing: 2, top: true, open: true });
  });

  it('나무 8종: 판자 6 → 다락문 2, 그림은 저마다', () => {
    const traps = BLOCKS.defs.filter((d) => d.shape === 'trapdoor' && !d.internal);
    expect(traps.length).toBe(8);
    expect(new Set(traps.map((d) => d.textures![0])).size).toBe(8);
    for (const d of traps) {
      const r = RECIPES.require(d.id);
      expect([r.out[d.id], Object.values(r.in)[0]]).toEqual([2, 6]);
    }
  });

  it('모양: 닫히면 바닥(또는 천장)에 누운 3/16 판, 열리면 보던 쪽 가장자리에 선 판', () => {
    expect(trapBoxes(0, false, false)).toEqual([[0, 0, 0, 16, 3, 16]]);
    expect(trapBoxes(2, true, false)).toEqual([[0, 13, 0, 16, 16, 16]]);
    expect(trapBoxes(0, false, true)).toEqual([[0, 0, 0, 16, 16, 3]]); // 북
    expect(trapBoxes(1, true, true)).toEqual([[13, 0, 0, 16, 16, 16]]); // 동
    expect(trapBoxes(2, false, true)).toEqual([[0, 0, 13, 16, 16, 16]]); // 남
    expect(trapBoxes(3, false, true)).toEqual([[0, 0, 0, 3, 16, 16]]); // 서
    // 부딪히는 조각은 그 판이 있는 쪽 한 겹
    expect(trapFoot(trapSlice(0, false, false), 2, 0, 2)).toBe(true);
    expect(trapFoot(trapSlice(0, false, false), 2, 1, 2)).toBe(false);
    expect(trapFoot(trapSlice(0, true, false), 0, 3, 0)).toBe(true);
    expect(trapFoot(trapSlice(1, false, true), 3, 2, 1)).toBe(true);
    expect(trapFoot(trapSlice(1, false, true), 2, 2, 1)).toBe(false);
    expect(trapFoot(trapSlice(3, true, true), 0, 2, 1)).toBe(true);
  });

  it('구덩이 위의 다락문: 닫히면 그 위에 서고(¼칸), 열면 떨어진다. 열린 판은 옆에서 막는다', () => {
    // 바닥 y 0, (0, 1, 0) 이 구덩이(공기), 둘레는 y 1 까지 돌. 구덩이 칸에 다락문
    const world = (trap: number) => (x: number, y: number, z: number) => (y <= 0 ? STONE : y === 1 ? (x === 0 && z === 0 ? trap : STONE) : 0);
    const drop = (trap: number) => {
      const p = { x: 0.5, y: 4, z: 0.5 };
      const out = fresh();
      moveBody(fineSolidQuery(BLOCKS, world(trap)), p, { w: 0.4, h: 1.8 }, { x: 0, y: -10, z: 0 }, 1, out, FINE_RES);
      return p.y;
    };
    expect(drop(TRAP)).toBeCloseTo(1.25, 5); // 바닥 판 위
    expect(drop(v(0, true, false))).toBeCloseTo(2, 5); // 천장 쪽 판 = 칸 꼭대기
    expect(drop(v(1, false, true))).toBeCloseTo(1, 5); // 열면 구덩이 바닥까지 (몸 폭 0.4 — 선 판 옆으로)
    expect(standTop(BLOCKS, world(TRAP), 0, 1, 0, 0.5, 0.5)).toBe(1.25);
    expect(standTop(BLOCKS, world(v(2, true, false)), 0, 1, 0, 0.5, 0.5)).toBe(2);
    // 평지에 선 열린 판(북쪽 가장자리, z 3.0~3.25): 남쪽에서 밀면 판의 남쪽 면에서 멈춘다 (한 칸 높이라 턱 오르기·점프로는 넘는다 — 다른 한 칸 블록처럼)
    const flat = (_x: number, y: number, z: number) => (y <= 0 ? STONE : y === 1 && z === 3 ? v(0, false, true) : 0);
    const q = { x: 0.5, y: 1, z: 5.5 };
    const out = fresh();
    moveBody(fineSolidQuery(BLOCKS, flat), q, PLAYER, { x: 0, y: 0, z: -10 }, 1, out, FINE_RES);
    expect(out.hitZ).toBe(true);
    expect(q.z).toBeCloseTo(3.25 + 0.3, 3);
    // 닫힌 바닥 판은 ¼칸 턱 — 그냥 넘어간다
    expect(pushNorth((_x, y, z) => (y <= 0 ? STONE : y === 1 && z === 3 ? TRAP : 0), 120).z).toBeLessThan(2);
  });

  it('조준: 닫힌 판은 ¼칸 높이의 윗면에, 열린 판은 선 면에 맞는다', () => {
    const any = (id: number) => id !== 0;
    const down = raycastFine(BLOCKS, (x, y, z) => (x === 5 && y === 1 && z === 5 ? TRAP : 0), any, 5.5, 4, 5.5, 0, -1, 0, 6)!;
    expect(down).toMatchObject({ x: 5, y: 1, z: 5, ny: 1 });
    expect(down.distance).toBeCloseTo(2.75, 5);
    const open = raycastFine(BLOCKS, (x, y, z) => (x === 5 && y === 1 && z === 5 ? v(0, false, true) : 0), any, 5.5, 1.5, 8.5, 0, 0, -1, 8)!;
    expect(open).toMatchObject({ x: 5, y: 1, z: 5, nz: 1 });
    expect(open.distance).toBeCloseTo(3.25, 5); // 판의 남쪽 면 z 5.25
  });
});
