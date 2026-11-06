/**
 * 스켈레톤 무리 복셀 모델 (아빠가 보낸 그림 2026-11-06: 스켈레톤·위더 스켈레톤·스트레이·보그드 + 파치트).
 * 사람 인형(playerModel)과 같은 부위·축을 쓴다 — 머리 8×8×8, 몸통 8×12×4 자리, 팔·다리는 어깨·엉덩이가 축(y 0)이고 아래로 자란다.
 * 다른 점: 팔다리가 2×12×2 로 가늘고, 몸통은 갈비뼈(등뼈 + 가로 뼈 셋 + 어깨·골반)라 속이 비어 보인다.
 * 손에 든 것: 활(스켈레톤·스트레이·보그드·파치트), 돌 검(위더 스켈레톤·지옥왕). 스트레이는 해진 옷, 보그드는 이끼·버섯 모자, 파치트는 모래빛 천 감기.
 * 색은 칸마다 살짝 얼룩 — 앞이 −z.
 */
import type { Voxel } from './voxelGeometry';

export type SkeletonKind = 'skeleton' | 'wither' | 'stray' | 'bogged' | 'parched';

interface Paint {
  bone: number;
  light: number;
  dark: number;
  hole: number;
  /** 옷·천 (스트레이 해진 옷, 파치트 천 감기). 없으면 없음 */
  cloth?: number;
  /** 이끼 (보그드) */
  moss?: number;
  item: 'bow' | 'sword';
}
const PAINTS: Record<SkeletonKind, Paint> = {
  skeleton: { bone: 0xbdbdbd, light: 0xd8d8d8, dark: 0x8e8e8e, hole: 0x2b2b2b, item: 'bow' },
  wither: { bone: 0x2c2c2c, light: 0x3c3c3c, dark: 0x1a1a1a, hole: 0x0b0b0b, item: 'sword' },
  stray: { bone: 0xa9b8bb, light: 0xc4d0d2, dark: 0x7c8c90, hole: 0x2f3a3c, cloth: 0x6d8588, item: 'bow' },
  bogged: { bone: 0xa3ad86, light: 0xbcc49c, dark: 0x6f7a55, hole: 0x2a3020, moss: 0x5a6e32, item: 'bow' },
  parched: { bone: 0xd8c7a0, light: 0xe8dbb8, dark: 0xa8936a, hole: 0x3a2e1e, cloth: 0x8d6a42, item: 'bow' },
};

function css(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}
function mottle(base: number, x: number, y: number, z: number, amp = 0.14): number {
  const h = ((x + 17) * 73856093) ^ ((y + 31) * 19349663) ^ ((z + 7) * 83492791);
  const k = 1 - amp / 2 + (((h >>> 0) % 100) / 100) * amp;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (c(base >> 16) << 16) | (c((base >> 8) & 255) << 8) | c(base & 255);
}
const hashOf = (x: number, y: number, z: number, salt: number) => (((x + 40) * 92837111) ^ ((y + 40) * 689287499) ^ ((z + 40) * 283923481) ^ salt) >>> 0;

/** 뼈 색 하나: 대체로 bone, 가끔 밝고 어둡게. 보그드는 이끼 얼룩 */
function boneAt(p: Paint, x: number, y: number, z: number): number {
  const r = hashOf(x, y, z, 5) % 100;
  if (p.moss !== undefined && r < 28) return mottle(p.moss, x, y, z);
  if (r < 14) return mottle(p.light, x, y, z, 0.08);
  if (r < 24) return mottle(p.dark, x, y, z, 0.08);
  return mottle(p.bone, x, y, z, 0.1);
}

export interface SkeletonVoxels {
  head: Voxel[];
  torso: Voxel[];
  arm: Voxel[];
  leg: Voxel[];
  /** 오른손에 든 것 (오른팔 기준 좌표) */
  item: Voxel[];
}

export function skeletonVoxels(kind: SkeletonKind): SkeletonVoxels {
  const p = PAINTS[kind];
  // ---- 머리 8×8×8: 앞면에 눈구멍 둘(2×2)·콧구멍·이 사이 줄
  const head: Voxel[] = [];
  const FACE = ['        ', '        ', '        ', ' hh  hh ', ' hh  hh ', '   hh   ', ' hhhhhh ', '  h  h  ']; // 위(y 7) → 아래(y 0)
  for (let y = 0; y < 8; y++)
    for (let z = -4; z <= 3; z++)
      for (let x = -4; x <= 3; x++) {
        let c = boneAt(p, x, y, z);
        if (z === -4 && FACE[7 - y]![x + 4] === 'h') c = p.hole;
        // 스트레이: 머리 위·뒤를 덮은 두건 / 파치트: 이마에 천
        if (p.cloth !== undefined && kind === 'stray' && (y === 7 || z === 3)) c = mottle(p.cloth, x, y, z, 0.18);
        if (p.cloth !== undefined && kind === 'parched' && y === 6 && z !== -4) c = mottle(p.cloth, x, y, z, 0.18);
        head.push({ x, y, z, c: css(c) });
      }
  if (kind === 'bogged') {
    // 머리 위 버섯: 빨간 버섯(흰 점) 하나, 갈색 버섯 하나
    for (let x = -3; x <= -1; x++) for (let z = -2; z <= 0; z++) head.push({ x, y: 9, z, c: css((x + z) % 2 === 0 ? 0xf2f2f2 : 0xc0392b) });
    head.push({ x: -2, y: 8, z: -1, c: css(0xe8dcc8) });
    for (let x = 1; x <= 2; x++) for (let z = 0; z <= 1; z++) head.push({ x, y: 9, z, c: css(0x8a6040) });
    head.push({ x: 1, y: 8, z: 0, c: css(0xe8dcc8) });
  }
  // ---- 몸통: 등뼈(2×12×2) + 어깨 막대(y 10~11) + 갈비 셋(y 8·6·4) + 골반(y 0~1)
  const torso: Voxel[] = [];
  const put = (x: number, y: number, z: number, c?: number) => torso.push({ x, y, z, c: css(c ?? boneAt(p, x, y, z)) });
  for (let y = 0; y < 12; y++) for (const x of [-1, 0]) for (const z of [0, 1]) put(x, y, z); // 등뼈 (뒤쪽)
  for (let y = 10; y < 12; y++) for (let x = -4; x <= 3; x++) for (let z = -1; z <= 1; z++) put(x, y, z); // 어깨
  for (const y of [8, 6, 4])
    for (let x = -3; x <= 2; x++) {
      put(x, y, -1); // 앞 갈비
      if (x === -3 || x === 2) put(x, y, 0);
    }
  for (let y = 0; y < 2; y++) for (let x = -3; x <= 2; x++) for (let z = -1; z <= 1; z++) put(x, y, z); // 골반
  if (p.cloth !== undefined && kind === 'stray') {
    // 해진 옷: 몸통을 감싼 겉옷, 아래 끝은 들쭉날쭉, 군데군데 구멍(갈비가 보인다)
    for (let y = -2; y < 12; y++)
      for (let x = -4; x <= 3; x++)
        for (const z of [-2, 2]) {
          const ragged = y < 1 && hashOf(x, y, z, 9) % 3 !== 0;
          if (ragged || (y >= 3 && y <= 8 && z === -2 && hashOf(x, y, z, 3) % 4 === 0)) continue;
          torso.push({ x, y, z, c: css(mottle(p.cloth, x, y, z, 0.2)) });
        }
    for (let y = 0; y < 12; y++) for (const x of [-4, 3]) for (let z = -1; z <= 1; z++) if (!(y < 2 && hashOf(x, y, z, 4) % 2 === 0)) torso.push({ x, y, z, c: css(mottle(p.cloth, x, y, z, 0.2)) });
  }
  if (p.cloth !== undefined && kind === 'parched') {
    // 천 감기: 허리·가슴에 띠 둘
    for (const y of [2, 7]) for (let x = -4; x <= 3; x++) for (const z of [-2, 1]) torso.push({ x, y, z, c: css(mottle(p.cloth, x, y, z, 0.2)) });
  }
  // ---- 팔·다리 2×12×2 (축 y 0 에서 아래로)
  const limb = (sleeve: boolean): Voxel[] => {
    const out: Voxel[] = [];
    for (let y = -12; y <= -1; y++)
      for (const x of [-1, 0])
        for (const z of [-1, 0]) {
          let c = boneAt(p, x, y, z);
          if (sleeve && p.cloth !== undefined && kind === 'stray' && y >= -6) c = mottle(p.cloth, x, y, z, 0.2);
          out.push({ x, y, z, c: css(c) });
        }
    if (sleeve && kind === 'stray') for (let y = -8; y <= -1; y++) for (const z of [-2, 1]) if (hashOf(0, y, z, 2) % 3 !== 0) out.push({ x: -1, y, z, c: css(mottle(p.cloth!, 0, y, z, 0.2)) }); // 너풀거리는 소매
    return out;
  };
  // ---- 손에 든 것 (오른팔 끝 y −11 둘레, 앞 −z)
  const item: Voxel[] = [];
  if (p.item === 'bow') {
    const WOOD = 0x5e3f22,
      WOOD2 = 0x7a5530,
      STRING = 0xcfcfcf;
    const arc: [number, number][] = [
      [-6, -1],
      [-7, -2],
      [-8, -3],
      [-9, -3],
      [-10, -3],
      [-11, -3],
      [-12, -3],
      [-13, -3],
      [-14, -2],
      [-15, -1],
    ];
    arc.forEach(([y, z], i) => item.push({ x: 0, y, z, c: css(i % 2 ? WOOD : WOOD2) }));
    for (let y = -14; y <= -7; y++) item.push({ x: 0, y, z: -1, c: css(STRING) });
  } else {
    // 돌 검: 손잡이(갈색)·가드(짙은 잿빛)·날(잿빛, 앞으로 7칸)
    item.push({ x: 0, y: -11, z: 0, c: css(0x5e3f22) }, { x: 0, y: -11, z: -1, c: css(0x5e3f22) });
    for (let x = -1; x <= 1; x++) item.push({ x, y: -11, z: -2, c: css(0x3a3a3a) });
    for (let z = -3; z >= -9; z--) item.push({ x: 0, y: -11, z, c: css(z === -9 ? 0x6e6e6e : (z % 2 ? 0x8c8c8c : 0x7a7a7a)) });
    item.push({ x: 0, y: -10, z: -4, c: css(0x9a9a9a) }, { x: 0, y: -10, z: -6, c: css(0x9a9a9a) });
  }
  return { head, torso, arm: limb(true), leg: limb(false), item };
}

export const SKELETON_KIND_OF: Readonly<Record<string, SkeletonKind>> = {
  skeleton: 'skeleton',
  wither_skeleton: 'wither',
  stray: 'stray',
  bogged: 'bogged',
  parched: 'parched',
  skeleton_king: 'skeleton', // 스켈레톤 왕도 같은 뼈 모양 + 왕관
};

/**
 * 엔더맨 (아빠가 보낸 그림 2026-11-06): 머리 8×8×8·몸통 8×12×4 는 사람과 같고, 팔·다리는 2×30×2 로 아주 길고 가늘다(키 50칸 ≈ 2.8m).
 * 새까만 몸에 짙은 얼룩, 앞면 가운데 아래쪽에 분홍빛 눈 둘(가운데가 밝다). 부위 자리는 ENDERMAN_SPOTS
 */
export function endermanVoxels(eyes = 0xd98cf0): { head: Voxel[]; torso: Voxel[]; arm: Voxel[]; leg: Voxel[] } {
  const BLACK = 0x161618,
    DARK = 0x0c0c0e,
    GREY = 0x26262a;
  const col = (x: number, y: number, z: number) => {
    const r = hashOf(x, y, z, 11) % 100;
    return r < 18 ? DARK : r < 30 ? GREY : BLACK;
  };
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, f: (x: number, y: number, z: number) => number): Voxel[] => {
    const out: Voxel[] = [];
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(f(x, y, z)) });
    return out;
  };
  const head = box(-4, 3, 0, 7, -4, 3, (x, y, z) => {
    if (z === -4 && y === 3 && ((x >= -3 && x <= -1) || (x >= 1 && x <= 3))) return x === -2 || x === 2 ? 0xf8dcff : eyes; // 눈 (가운데 밝게)
    return col(x, y, z);
  });
  const torso = box(-4, 3, 0, 11, -2, 1, col);
  const limb = box(-1, 0, -30, -1, -1, 0, col);
  return { head, torso, arm: limb, leg: limb };
}
/** 엔더맨 부위 자리 (복셀 단위): 다리 축 y 30, 몸통 30~41, 머리 42~49, 팔 축 어깨 y 42 */
export const ENDERMAN_SPOTS = { torso: [0, 30], head: [0, 42], legL: [-2, 30], legR: [2, 30], armL: [-5, 42], armR: [5, 42] } as const;
