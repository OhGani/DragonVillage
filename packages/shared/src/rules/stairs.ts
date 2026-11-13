/**
 * 계단 (#291, 아빠 2026-11-13 "계단"). 한 칸을 반 칸짜리 여덟 조각(2×2×2)으로 보고, 그중 어느 조각이 차 있는지로 모양을 적는다.
 *
 *  - 바로 선 계단: 아래 네 조각은 다 차 있고, 위 네 조각 중 높은 쪽(facing) 둘이 차 있다.
 *  - 뒤집힌 계단(top): 위 네 조각이 다 차 있고, 아래는 높은 쪽 둘.
 *  - 모서리: 앞이나 뒤에 옆으로 돌아선 계단이 있으면 ㄱ자로 이어진다 (마인크래프트 규칙 그대로).
 *    바깥 모서리는 한 조각만, 안쪽 모서리는 세 조각.
 *
 * 모서리 모양은 블록에 저장하지 않는다 — 그릴 때(메셔)와 부딪힐 때(물리) 이웃을 보고 그때그때 정한다.
 * 그래서 서버는 이웃 계단을 고쳐 줄 필요가 없고, 저장된 마을에도 방향·뒤집힘 여덟 가지만 남는다.
 *
 * 조각 번호(비트): sx + sz·2 + sy·4 (sx·sy·sz 는 0 = 작은 쪽 반, 1 = 큰 쪽 반)
 */
import { type BlockDef, type BlockRegistry, DOOR_DIR, SLAB_BOTTOM, SLAB_TOP, type StairInfo } from './blocks';
import type { SolidQuery } from '../physics/aabb';
import { type RayHit, raycastVoxels } from '../physics/raycast';
import { FENCE_HEIGHT, fenceFoot, fenceLinksAt, gateFoot, trapFoot, trapSlice } from './fence';

export const STAIR_STRAIGHT = 0;
export const STAIR_INNER_LEFT = 1;
export const STAIR_INNER_RIGHT = 2;
export const STAIR_OUTER_LEFT = 3;
export const STAIR_OUTER_RIGHT = 4;
export type StairShape = 0 | 1 | 2 | 3 | 4;

/** 꽉 찬 칸의 조각 마스크 */
export const FULL_MASK = 255;

/** 옆 칸(dx, dz)의 계단. 계단이 아니면 null */
export type StairNeighbor = (dx: number, dz: number) => { readonly facing: number; readonly top: boolean } | null;

/**
 * 이웃을 보고 모서리 모양을 정한다 (마인크래프트 StairBlock.getStairsShape).
 * 앞(높은 쪽) 칸에 옆으로 돌아선 계단이 있으면 바깥 모서리, 뒤 칸에 있으면 안쪽 모서리.
 * 왼쪽·오른쪽은 계단을 올라가는 사람 기준 (왼쪽 = 반시계 방향).
 */
export function stairShape(facing: number, top: boolean, at: StairNeighbor): StairShape {
  const [fx, fz] = DOOR_DIR[facing & 3]!;
  const ccw = (facing + 3) & 3;
  /** 그쪽 옆 칸이 나와 똑같이 선 계단이면 모서리를 만들지 않는다 (한 줄로 이어진 계단) */
  const canTake = (dir: number): boolean => {
    const [dx, dz] = DOOR_DIR[dir & 3]!;
    const n = at(dx, dz);
    return !n || n.facing !== facing || n.top !== top;
  };
  const front = at(fx, fz);
  if (front && front.top === top && ((front.facing ^ facing) & 1) === 1 && canTake(front.facing ^ 2)) return front.facing === ccw ? STAIR_OUTER_LEFT : STAIR_OUTER_RIGHT;
  const back = at(-fx, -fz);
  if (back && back.top === top && ((back.facing ^ facing) & 1) === 1 && canTake(back.facing)) return back.facing === ccw ? STAIR_INNER_LEFT : STAIR_INNER_RIGHT;
  return STAIR_STRAIGHT;
}

function buildMask(facing: number, top: boolean, shape: StairShape): number {
  const [fx, fz] = DOOR_DIR[facing]!;
  const [lx, lz] = DOOR_DIR[(facing + 3) & 3]!;
  let quads = 0; // 반 층의 네 조각 (sx + sz·2)
  for (let sz = 0; sz < 2; sz++)
    for (let sx = 0; sx < 2; sx++) {
      const front = fx !== 0 ? sx === (fx > 0 ? 1 : 0) : sz === (fz > 0 ? 1 : 0);
      const left = lx !== 0 ? sx === (lx > 0 ? 1 : 0) : sz === (lz > 0 ? 1 : 0);
      const on = shape === STAIR_STRAIGHT ? front : shape === STAIR_OUTER_LEFT ? front && left : shape === STAIR_OUTER_RIGHT ? front && !left : shape === STAIR_INNER_LEFT ? front || left : front || !left;
      if (on) quads |= 1 << (sx + sz * 2);
    }
  return top ? 0xf0 | quads : 0x0f | (quads << 4);
}

const MASKS: number[] = [];
for (let facing = 0; facing < 4; facing++) for (const top of [false, true]) for (let shape = 0; shape < 5; shape++) MASKS[facing * 10 + (top ? 5 : 0) + shape] = buildMask(facing, top, shape as StairShape);

/** 계단의 조각 마스크 (8비트) */
export function stairMask(facing: number, top: boolean, shape: StairShape): number {
  return MASKS[(facing & 3) * 10 + (top ? 5 : 0) + shape]!;
}

/** 세계 속 (x, y, z) 계단의 조각 마스크 — 이웃을 보고 모서리까지 */
export function stairMaskAt(stairAt: (x: number, y: number, z: number) => StairInfo | null, x: number, y: number, z: number, s: StairInfo): number {
  return stairMask(
    s.facing,
    s.top,
    stairShape(s.facing, s.top, (dx, dz) => stairAt(x + dx, y, z + dz)),
  );
}

/**
 * 블록 하나의 조각 마스크 (#292): 반 블록은 아래 넷 / 위 넷, 계단은 이웃까지 보고, 그 밖의 블록은 여덟 조각 다.
 * 고체인지는 따로 본다 — 여기서는 모양만
 */
export function partMask(d: Pick<BlockDef, 'slab' | 'stairs'>, stairAt: (x: number, y: number, z: number) => StairInfo | null, x: number, y: number, z: number): number {
  if (d.slab) return d.slab.kind === SLAB_BOTTOM ? 0x0f : d.slab.kind === SLAB_TOP ? 0xf0 : FULL_MASK;
  if (d.stairs) return stairMaskAt(stairAt, x, y, z, d.stairs);
  return FULL_MASK;
}

/**
 * 그 블록(bx, by, bz)을 딛고 (x, z) 자리에 섰을 때의 발 높이 (#294 — 서버의 몹·동물·주민).
 * 보통 블록은 칸 꼭대기(by + 1). 계단·반 블록은 발밑 조각을 본다: 위 조각이 차 있으면 꼭대기, 아니면 반 칸(by + ½).
 * 울타리·닫힌 울타리문은 한 칸 반(#295) — 한 칸까지만 오르는 몹·동물은 못 넘는다.
 * 몹은 몸 가운데 한 점으로 땅을 따라가니(moveMob) 이것만 맞추면 계단을 반 칸씩 오르내린다
 */
export function standTop(registry: BlockRegistry, getBlock: (x: number, y: number, z: number) => number, bx: number, by: number, bz: number, x: number, z: number): number {
  const d = registry.get(getBlock(bx, by, bz));
  if (d.fence || (d.gate && !d.gate.open)) return by + FENCE_HEIGHT;
  if (d.trap) return by + (d.trap.top ? 1 : 0.25); // 닫힌 다락문 (#296): 바닥 판은 ¼칸, 천장 판은 칸 꼭대기
  if (!d.slab && !d.stairs) return by + 1;
  const mask = partMask(d, (sx, sy, sz) => registry.get(getBlock(sx, sy, sz)).stairs, bx, by, bz);
  const q = (x - bx >= 0.5 ? 1 : 0) + (z - bz >= 0.5 ? 2 : 0);
  return by + (((mask >> (4 + q)) & 1) === 1 ? 1 : 0.5);
}

/**
 * 물리·조준이 세계를 보는 눈금: 한 칸을 넷으로 (#295 — 울타리 기둥이 가운데 두 조각). 계단·반 블록의 반 칸은 두 조각씩.
 * 조각 좌표 = 블록 좌표 × FINE_RES, 칸 안 조각 번호는 0..3
 */
export const FINE_RES = 4;
const SUB = FINE_RES - 1;

/** 블록 종류별로 조각을 어떻게 볼지 — 레지스트리에서 한 번만 뽑아 둔다 */
const K_FULL = 0,
  K_PARTS = 1, // 계단·반 블록 (조각 마스크)
  K_FENCE = 2,
  K_GATE_X = 3, // 닫힌 울타리문, 문짝이 동서로
  K_GATE_Z = 4,
  K_TRAP = 5, // 다락문 (#296): K_TRAP + slice (바닥·천장·열림 넷) — 열려 있어도 얇은 판에 부딪힌다
  K_LADDER = 11; // 사다리 (#299): K_LADDER + 붙은 벽 방향 — 부딪히지 않고(지나간다) 조준만 벽 쪽 한 겹에
const kindTables = new WeakMap<object, Uint8Array>();
function kindTable(registry: BlockRegistry): Uint8Array {
  const hit = kindTables.get(registry);
  if (hit) return hit;
  const defs = (registry as { defs?: readonly BlockDef[] }).defs ?? []; // 시험용 가짜 레지스트리에는 defs 가 없다 → 전부 보통 블록
  const t = new Uint8Array(defs.length);
  for (const d of defs) t[d.num] = d.ladder ? K_LADDER + d.ladder.facing : d.trap ? K_TRAP + trapSlice(d.trap.facing, d.trap.top, d.trap.open) : d.fence ? K_FENCE : d.gate ? (d.gate.open ? K_FULL : (d.gate.facing & 1) === 0 ? K_GATE_X : K_GATE_Z) : (d.slab && d.slab.kind !== 2) || d.stairs ? K_PARTS : K_FULL;
  kindTables.set(registry, t);
  return t;
}

/**
 * 눈금 FINE_RES 의 충돌 질의 (moveBody 에 res = FINE_RES 와 함께 넘긴다). 좌표는 조각 단위.
 * 보통 블록은 조각이 다 차 있고, 계단·반 블록은 조각 마스크대로, 울타리·닫힌 울타리문은 발자국(fence.ts) 모양으로 **한 칸 반 높이** —
 * 그래서 고체가 아닌 칸의 아래쪽 반은 바로 밑 칸이 울타리인지도 본다
 */
export function fineSolidQuery(registry: BlockRegistry, getBlock: (x: number, y: number, z: number) => number): SolidQuery {
  const kinds = kindTable(registry);
  const stairAt = (x: number, y: number, z: number): StairInfo | null => registry.get(getBlock(x, y, z)).stairs;
  const foot = (k: number, x: number, y: number, z: number, sx: number, sz: number): boolean =>
    k === K_FENCE ? fenceFoot(fenceLinksAt(registry, getBlock, x, y, z), sx, sz) : gateFoot(k === K_GATE_X ? 0 : 1, sx, sz);
  return (hx, hy, hz) => {
    const x = hx >> 2,
      y = hy >> 2,
      z = hz >> 2;
    const id = getBlock(x, y, z);
    const k = kinds[id] ?? K_FULL;
    if (k >= K_LADDER) return false;
    if (k >= K_TRAP) return trapFoot(k - K_TRAP, hx & SUB, hy & SUB, hz & SUB);
    if (k >= K_FENCE) return foot(k, x, y, z, hx & SUB, hz & SUB);
    if (k === K_PARTS) {
      const mask = partMask(registry.get(id), stairAt, x, y, z);
      return ((mask >> (((hx & SUB) >> 1) | (((hz & SUB) >> 1) << 1) | (((hy & SUB) >> 1) << 2))) & 1) === 1;
    }
    if (registry.isSolid(id)) return true;
    if ((hy & SUB) < 2) {
      // 울타리 위 반 칸: 넘지 못하게 막는다
      const kb = kinds[getBlock(x, y - 1, z)] ?? K_FULL;
      if (kb >= K_FENCE && kb < K_TRAP) return foot(kb, x, y - 1, z, hx & SUB, hz & SUB);
    }
    return false;
  };
}

/**
 * 조준 (#292): raycastVoxels 를 조각 눈금으로 — 계단·반 블록의 빈 반쪽, 울타리의 빈 곳은 지나가고 실제로 보이는 면에 맞는다.
 * 돌려주는 자리(x, y, z)와 거리는 블록 단위, face·법선은 맞은 조각의 면 (반 블록 윗면을 맞히면 그 반 블록 칸 + 위쪽 법선).
 * 시작 칸(눈이 들어 있는 블록)은 전처럼 통째로 건너뛴다. 울타리는 칸 안의 발자국만(위 반 칸 더는 조준에 없다)
 */
export function raycastFine(
  registry: BlockRegistry,
  getBlock: (x: number, y: number, z: number) => number,
  hits: (id: number) => boolean,
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxDist: number,
): RayHit | null {
  const sx = Math.floor(ox),
    sy = Math.floor(oy),
    sz = Math.floor(oz);
  const kinds = kindTable(registry);
  const stairAt = (x: number, y: number, z: number): StairInfo | null => registry.get(getBlock(x, y, z)).stairs;
  const hit = raycastVoxels(
    (hx, hy, hz) => {
      const x = hx >> 2,
        y = hy >> 2,
        z = hz >> 2;
      if (x === sx && y === sy && z === sz) return 0;
      const id = getBlock(x, y, z);
      if (id === 0) return 0;
      const k = kinds[id] ?? K_FULL;
      if (k === K_FULL) return id;
      if (k === K_PARTS) {
        const mask = partMask(registry.get(id), stairAt, x, y, z);
        return ((mask >> (((hx & SUB) >> 1) | (((hz & SUB) >> 1) << 1) | (((hy & SUB) >> 1) << 2))) & 1) === 1 ? id : 0;
      }
      if (k >= K_LADDER) return trapFoot(2 + (k - K_LADDER), hx & SUB, hy & SUB, hz & SUB) ? id : 0; // 벽 쪽 한 겹 (열린 다락문과 같은 조각)
      if (k >= K_TRAP) return trapFoot(k - K_TRAP, hx & SUB, hy & SUB, hz & SUB) ? id : 0;
      const inFoot = k === K_FENCE ? fenceFoot(fenceLinksAt(registry, getBlock, x, y, z), hx & SUB, hz & SUB) : gateFoot(k === K_GATE_X ? 0 : 1, hx & SUB, hz & SUB);
      return inFoot ? id : 0;
    },
    hits,
    ox * FINE_RES,
    oy * FINE_RES,
    oz * FINE_RES,
    dx,
    dy,
    dz,
    maxDist * FINE_RES,
  );
  if (!hit) return null;
  hit.x >>= 2;
  hit.y >>= 2;
  hit.z >>= 2;
  hit.distance /= FINE_RES;
  return hit;
}
