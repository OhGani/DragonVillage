/**
 * 울타리·울타리문 (#295, 아빠 2026-11-13 "울타리 / 울타리문" + 마인크래프트 그림).
 *
 * 울타리 = 가운데 기둥(4/16 굵기, 한 칸 높이) + 이어진 쪽마다 가로대 둘. 이어지는 상대: 울타리, 나란히 걸린 울타리문, 꽉 찬 불투명 블록.
 * 이어짐은 블록에 저장하지 않는다 — 그릴 때(메셔)·부딪힐 때(물리)·조준할 때 이웃을 보고 정한다(계단 모서리 #291 과 같은 방식).
 *
 * 부딪히는 모양은 보이는 것보다 굵고(기둥 ½칸) **한 칸 반 높이**다 — 사람(점프 1.27칸)도 동물도 못 넘는다.
 * 모양 상자는 16분의 1 단위 [x0, y0, z0, x1, y1, z1].
 */
import { type BlockDef, type BlockRegistry, DOOR_DIR } from './blocks';

export type Box16 = readonly [number, number, number, number, number, number];

/** 울타리·닫힌 울타리문을 딛거나 넘으려면 이 높이 (칸) */
export const FENCE_HEIGHT = 1.5;

/** 이어짐 비트: DOOR_FACING 순서 (1 북 −z, 2 동 +x, 4 남 +z, 8 서 −x) */
export const FENCE_N = 1;
export const FENCE_E = 2;
export const FENCE_S = 4;
export const FENCE_W = 8;

/** 옆 칸 블록의 생김새에서 필요한 것만 (레지스트리의 BlockDef 도, 메셔의 표도 이 모양으로 맞춘다) */
export interface FenceNeighbor {
  readonly fence: boolean;
  /** 울타리문이면 그 facing, 아니면 −1 */
  readonly gateFacing: number;
  /** 꽉 찬 불투명 블록인가 */
  readonly opaque: boolean;
}

/** dir(0 북 1 동 2 남 3 서) 쪽 이웃과 가로대로 이어지나. 울타리문은 문짝이 그 방향으로 걸려 있을 때만(facing 과 직각) */
export function fenceLinks(n: FenceNeighbor | null, dir: number): boolean {
  if (!n) return false;
  if (n.fence || n.opaque) return true;
  return n.gateFacing >= 0 && ((n.gateFacing ^ dir) & 1) === 1;
}

/** 네 이웃 → 이어짐 비트 */
export function fenceLinkBits(at: (dx: number, dz: number) => FenceNeighbor | null): number {
  let bits = 0;
  for (let dir = 0; dir < 4; dir++) {
    const [dx, dz] = DOOR_DIR[dir]!;
    if (fenceLinks(at(dx, dz), dir)) bits |= 1 << dir;
  }
  return bits;
}

/** 레지스트리의 블록 → FenceNeighbor */
export function fenceNeighborOf(d: Pick<BlockDef, 'fence' | 'gate' | 'solid' | 'transparent' | 'fluid'>): FenceNeighbor {
  return { fence: d.fence === true, gateFacing: d.gate ? d.gate.facing : -1, opaque: d.solid === true && d.transparent !== true && !d.fluid };
}

/** 세계 속 (x, y, z) 울타리의 이어짐 비트 */
export function fenceLinksAt(registry: BlockRegistry, getBlock: (x: number, y: number, z: number) => number, x: number, y: number, z: number): number {
  return fenceLinkBits((dx, dz) => fenceNeighborOf(registry.get(getBlock(x + dx, y, z + dz))));
}

/** 보이는 모양: 기둥 + 이어진 쪽마다 가로대 둘 (마인크래프트 치수) */
export function fenceBoxes(links: number): Box16[] {
  const out: Box16[] = [[6, 0, 6, 10, 16, 10]];
  for (const [y0, y1] of [
    [6, 9],
    [12, 15],
  ] as const) {
    if (links & FENCE_N) out.push([7, y0, 0, 9, y1, 6]);
    if (links & FENCE_S) out.push([7, y0, 10, 9, y1, 16]);
    if (links & FENCE_W) out.push([0, y0, 7, 6, y1, 9]);
    if (links & FENCE_E) out.push([10, y0, 7, 16, y1, 9]);
  }
  return out;
}

/** 가방 아이콘용 울타리: 기둥 둘 사이에 가로대 둘 (마인크래프트 가방 그림처럼) */
export const FENCE_ICON_BOXES: readonly Box16[] = [
  [0, 0, 6, 4, 16, 10],
  [12, 0, 6, 16, 16, 10],
  [4, 12, 7, 12, 15, 9],
  [4, 6, 7, 12, 9, 9],
];

/**
 * 울타리문의 보이는 모양. 닫히면 양쪽 기둥 사이에 가로대 둘 + 가운데 빗장, 열리면 문짝 둘이 facing 쪽으로 젖혀진다.
 * 문짝은 facing 과 직각으로 걸린다 (북·남을 보고 놓으면 동서로)
 */
export function gateBoxes(facing: number, open: boolean): Box16[] {
  // 동서로 걸린 문(x 방향)을 기준으로 만들고, 남북으로 걸린 문은 x·z 를 바꾼다. 젖혀지는 쪽 sign: +z(남) 또는 −z(북)
  const alongX = (facing & 1) === 0;
  const [fx, fz] = DOOR_DIR[facing & 3]!;
  const toward = (alongX ? fz : fx) > 0;
  const boxes: Box16[] = [
    [0, 5, 7, 2, 16, 9],
    [14, 5, 7, 16, 16, 9],
  ];
  if (!open) boxes.push([2, 6, 7, 14, 9, 9], [2, 12, 7, 14, 15, 9], [6, 9, 7, 10, 12, 9]);
  else {
    const [z0, z1, e0, e1] = toward ? [9, 15, 13, 15] : [1, 7, 1, 3];
    for (const [x0, x1] of [
      [0, 2],
      [14, 16],
    ] as const)
      boxes.push([x0, 6, z0, x1, 9, z1], [x0, 12, z0, x1, 15, z1], [x0, 9, e0, x1, 12, e1]);
  }
  return alongX ? boxes : boxes.map(([x0, y0, z0, x1, y1, z1]) => [z0, y0, x0, z1, y1, x1] as const);
}

/** 사다리의 보이는 모양 (#299): 붙은 벽(facing) 쪽 가장자리의 1/16 두께 판 — 그림의 빈 곳은 뚫려 보인다 */
export function ladderBoxes(facing: number): Box16[] {
  return [facing === 0 ? [0, 0, 0, 16, 16, 1] : facing === 1 ? [15, 0, 0, 16, 16, 16] : facing === 2 ? [0, 0, 15, 16, 16, 16] : [0, 0, 0, 1, 16, 16]];
}
/** 사다리를 타고 오르는·내려오는 속도 (칸/초). 마인크래프트는 2.35 / 3 */
export const LADDER_UP = 2.6;
export const LADDER_DOWN = 3;

/** 다락문 판 두께 (#296, 마인크래프트 3/16) */
export const TRAP_THICK = 3;

/** 다락문의 보이는 모양 (#296): 닫히면 바닥(또는 천장)에 누운 판, 열리면 facing 쪽 가장자리에 선 판 */
export function trapBoxes(facing: number, top: boolean, open: boolean): Box16[] {
  const t = TRAP_THICK;
  if (!open) return [top ? [0, 16 - t, 0, 16, 16, 16] : [0, 0, 0, 16, t, 16]];
  return [facing === 0 ? [0, 0, 0, 16, 16, t] : facing === 1 ? [16 - t, 0, 0, 16, 16, 16] : facing === 2 ? [0, 0, 16 - t, 16, 16, 16] : [0, 0, 0, t, 16, 16]];
}

/**
 * 다락문의 부딪히는·조준하는 조각 (칸을 넷으로 나눈 sx·sy·sz 0..3): 판이 있는 쪽 한 겹(¼칸).
 * slice: 0 바닥(sy 0) · 1 천장(sy 3) · 2~5 열림 북·동·남·서
 */
export function trapSlice(facing: number, top: boolean, open: boolean): number {
  return open ? 2 + (facing & 3) : top ? 1 : 0;
}
export function trapFoot(slice: number, sx: number, sy: number, sz: number): boolean {
  return slice === 0 ? sy === 0 : slice === 1 ? sy === 3 : slice === 2 ? sz === 0 : slice === 3 ? sx === 3 : slice === 4 ? sz === 3 : sx === 0;
}

/**
 * 부딪히는·조준하는 발자국 (칸을 가로세로 넷으로 나눈 조각 sx·sz 0..3): 울타리는 가운데 2×2 기둥 + 이어진 쪽으로 가장자리까지,
 * 닫힌 울타리문은 문짝이 걸린 방향으로 가운데 두 줄
 */
export function fenceFoot(links: number, sx: number, sz: number): boolean {
  const mx = sx === 1 || sx === 2,
    mz = sz === 1 || sz === 2;
  if (mx && mz) return true;
  if (mx) return sz === 0 ? (links & FENCE_N) !== 0 : (links & FENCE_S) !== 0;
  if (mz) return sx === 0 ? (links & FENCE_W) !== 0 : (links & FENCE_E) !== 0;
  return false;
}
export function gateFoot(facing: number, sx: number, sz: number): boolean {
  return (facing & 1) === 0 ? sz === 1 || sz === 2 : sx === 1 || sx === 2;
}
