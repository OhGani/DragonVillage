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

/** 물리가 세계를 보는 눈금: 한 칸을 둘로 (계단·반 블록의 반 칸 턱) */
export const FINE_RES = 2;

/**
 * 반 칸 눈금의 충돌 질의 (moveBody 에 res = FINE_RES 와 함께 넘긴다). 좌표는 반 칸 단위.
 * 보통 블록은 여덟 조각이 다 차 있고, 계단·반 블록만 조각마다 다르다.
 */
export function fineSolidQuery(registry: BlockRegistry, getBlock: (x: number, y: number, z: number) => number): SolidQuery {
  const stairAt = (x: number, y: number, z: number): StairInfo | null => registry.get(getBlock(x, y, z)).stairs;
  return (hx, hy, hz) => {
    const x = hx >> 1,
      y = hy >> 1,
      z = hz >> 1;
    const id = getBlock(x, y, z);
    if (!registry.isSolid(id)) return false;
    const mask = partMask(registry.get(id), stairAt, x, y, z);
    return mask === FULL_MASK || ((mask >> ((hx & 1) | ((hz & 1) << 1) | ((hy & 1) << 2))) & 1) === 1;
  };
}

/**
 * 조준 (#292): raycastVoxels 를 반 칸 눈금으로 — 계단·반 블록의 빈 반쪽은 지나가고 실제로 보이는 면에 맞는다.
 * 돌려주는 자리(x, y, z)와 거리는 블록 단위, face·법선은 맞은 조각의 면 (반 블록 윗면을 맞히면 그 반 블록 칸 + 위쪽 법선).
 * 시작 칸(눈이 들어 있는 블록)은 전처럼 통째로 건너뛴다
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
  const stairAt = (x: number, y: number, z: number): StairInfo | null => registry.get(getBlock(x, y, z)).stairs;
  const hit = raycastVoxels(
    (hx, hy, hz) => {
      const x = hx >> 1,
        y = hy >> 1,
        z = hz >> 1;
      if (x === sx && y === sy && z === sz) return 0;
      const id = getBlock(x, y, z);
      if (id === 0) return 0;
      const mask = partMask(registry.get(id), stairAt, x, y, z);
      return mask === FULL_MASK || ((mask >> ((hx & 1) | ((hz & 1) << 1) | ((hy & 1) << 2))) & 1) === 1 ? id : 0;
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
  hit.x >>= 1;
  hit.y >>= 1;
  hit.z >>= 1;
  hit.distance /= FINE_RES;
  return hit;
}
