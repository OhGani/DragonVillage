/**
 * 좀비 가족 복셀 모델 (아빠가 보낸 그림 2026-11-06: 좀비·아기 좀비·좀비 주민·사막 좀비 주민·허스크·드라운드·프로스트바이트).
 * 사람 인형(playerModel)과 같은 부위·축: 머리 8×8×8 (x −4..3, y 0..7, z −4..3), 몸통 8×12×4, 팔·다리 4×12×4 (축 y 0 에서 아래로). 앞이 −z.
 * 칸마다 얼룩이 있고, 종류마다 살·옷 색과 무늬(이끼·서리·두건·로브·코)가 다르다. 아기 좀비는 MobView 가 몸을 작게, 머리를 크게 한다.
 * 그림은 참고만 하고 새로 칠했다.
 */
import type { Voxel } from './voxelGeometry';

export type ZombieKind = 'zombie' | 'husk' | 'zombie_villager' | 'desert_zombie_villager' | 'drowned' | 'frostbite' | 'zombie_king';

function css(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}
const hashOf = (x: number, y: number, z: number, salt: number) => (((x + 40) * 92837111) ^ ((y + 40) * 689287499) ^ ((z + 40) * 283923481) ^ salt) >>> 0;
/** 같은 색 셋 중 하나를 칸마다 (얼룩) */
function pick(cols: readonly number[], x: number, y: number, z: number, salt = 1): number {
  return cols[hashOf(x, y, z, salt) % cols.length]!;
}
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, f: (x: number, y: number, z: number) => number): Voxel[] {
  const out: Voxel[] = [];
  for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(f(x, y, z)) });
  return out;
}

interface Paint {
  skin: readonly number[];
  shirt: readonly number[];
  pants: readonly number[];
  shoes: readonly number[];
  eye: number;
  /** 머리 위 덮개 (이끼·서리·머리카락) — 위 몇 줄 */
  cap?: { cols: readonly number[]; rows: number; patchy: boolean };
  /** 군데군데 덮인 것 (드라운드 이끼, 프로스트바이트 서리) */
  speckle?: { cols: readonly number[]; chance: number };
  /** 소매 길이 (팔 위 몇 칸이 옷) */
  sleeve: number;
}
const GREEN = [0x5e9a46, 0x4f8a3b, 0x6aa852, 0x568f41];
const PAINTS: Record<Exclude<ZombieKind, 'zombie_villager' | 'desert_zombie_villager'>, Paint> = {
  zombie: { skin: GREEN, shirt: [0x1ea3a3, 0x178f8f, 0x22b0ad], pants: [0x3c3a9e, 0x34328c, 0x4441a8], shoes: [0x5c5c5c, 0x4e4e4e], eye: 0x141414, sleeve: 3 },
  zombie_king: { skin: GREEN, shirt: [0x1ea3a3, 0x178f8f, 0x22b0ad], pants: [0x3c3a9e, 0x34328c, 0x4441a8], shoes: [0x5c5c5c, 0x4e4e4e], eye: 0xff3030, sleeve: 3 },
  husk: { skin: [0xb8a274, 0xa18d60, 0xc9b487, 0xad9768], shirt: [0x4f4434, 0x5c4f3a, 0x463c2e], pants: [0x5c4f3a, 0x4f4434, 0x665840], shoes: [0x3a3226, 0x30291f], eye: 0x231d14, cap: { cols: [0x6a5536, 0x7a6342, 0xb8a274], rows: 2, patchy: true }, sleeve: 4 },
  drowned: { skin: [0x4d9a91, 0x3f8a82, 0x5fb0a5, 0x468f86], shirt: [0x7a4f30, 0x4d9a91, 0x6a4428], pants: [0x6b4630, 0x5a3b28, 0x4d9a91], shoes: [0x3f8a82, 0x355f58], eye: 0x9ff7ff, cap: { cols: [0x4caa3a, 0x3f9430, 0x5cba48], rows: 2, patchy: true }, speckle: { cols: [0x6fb85a, 0x2f6f68], chance: 0.12 }, sleeve: 2 },
  frostbite: { skin: [0x8fc4cc, 0xa8d8de, 0x7ab0b8, 0x96cbd2], shirt: [0x2d5f86, 0x264f70, 0x356c96], pants: [0x5a3f2c, 0x4d3524, 0x664a34], shoes: [0xeef8fa, 0xd8eef2], eye: 0x5a2a2a, cap: { cols: [0xeef8fa, 0xd8eef2, 0xc0e2e8], rows: 2, patchy: true }, speckle: { cols: [0xeef8fa, 0xd8eef2], chance: 0.14 }, sleeve: 3 },
};

export interface ZombieVoxels {
  head: Voxel[];
  torso: Voxel[];
  arm: Voxel[];
  leg: Voxel[];
}

export function zombieVoxels(kind: ZombieKind): ZombieVoxels {
  if (kind === 'zombie_villager' || kind === 'desert_zombie_villager') return zombieVillager(kind === 'desert_zombie_villager');
  const p = PAINTS[kind];
  const sp = (base: readonly number[], x: number, y: number, z: number, salt: number) => (p.speckle && hashOf(x, y, z, salt + 50) % 100 < p.speckle.chance * 100 ? pick(p.speckle.cols, x, y, z, salt) : pick(base, x, y, z, salt));
  const head = box(-4, 3, 0, 7, -4, 3, (x, y, z) => {
    if (z === -4 && y === 4 && (x === -3 || x === -2 || x === 1 || x === 2)) return p.eye; // 눈 (가늘게 두 칸씩)
    if (z === -4 && y === 3 && (x === -3 || x === 2)) return kind === 'drowned' ? 0x2f6f68 : pick(p.skin, x, y, z, 2); // 눈 밑 그늘
    if (p.cap && y >= 8 - p.cap.rows && (!p.cap.patchy || hashOf(x, y, z, 7) % 4 !== 0)) return pick(p.cap.cols, x, y, z, 3);
    return sp(p.skin, x, y, z, 4);
  });
  const torso = box(-4, 3, 0, 11, -2, 1, (x, y, z) => (y <= 1 ? pick(p.pants, x, y, z, 5) : sp(p.shirt, x, y, z, 6)));
  const arm = box(-2, 1, -12, -1, -2, 1, (x, y, z) => {
    if (y >= -p.sleeve) return pick(p.shirt, x, y, z, 7);
    if (kind === 'frostbite' && y <= -10) return pick(p.cap!.cols, x, y, z, 8); // 서리 낀 손
    return sp(p.skin, x, y, z, 9);
  });
  const leg = box(-2, 1, -12, -1, -2, 1, (x, y, z) => (y <= -11 ? pick(p.shoes, x, y, z, 10) : sp(p.pants, x, y, z, 11)));
  return { head, torso, arm, leg };
}

/** 좀비 주민: 주민처럼 큰 코·두툼한 눈썹, 붉은 눈, 갈색 로브가 무릎까지(이끼 얼룩), 초록 팔. 사막이면 모래빛 두건·주황 띠 */
function zombieVillager(desert: boolean): ZombieVoxels {
  const SKIN = GREEN;
  const ROBE = desert ? [0xc9b48a, 0xb8a274, 0xd6c49c] : [0x5a4030, 0x4d3628, 0x664a38];
  const MOSS = [0x4f8a3b, 0x6aa852];
  const BAND = [0xc0602a, 0xa8521f, 0xd0703a];
  const head = box(-4, 3, 0, 7, -4, 3, (x, y, z) => {
    if (z === -4 && y === 4 && (x === -3 || x === 2)) return 0xc0392b; // 붉은 눈
    if (z === -4 && y === 4 && (x === -2 || x === 1)) return 0xf2e8e0; // 흰자
    if (z === -4 && y === 5 && x >= -3 && x <= 2) return 0x3f6b2e; // 눈썹
    if (desert && y >= 6) return y === 6 ? pick(BAND, x, y, z, 1) : pick([0xd9c8a4, 0xe4d6b4, 0xc9b48a], x, y, z, 2); // 두건 + 주황 띠
    return pick(SKIN, x, y, z, 3);
  });
  // 코 2×4×2 (얼굴 앞으로 튀어나온다)
  head.push(...box(-1, 0, 1, 4, -6, -5, (x, y, z) => pick([0x4f8a3b, 0x5e9a46], x, y, z, 4)));
  // 로브: 몸통 + 무릎까지 늘어진 자락(몸통 아래 y −6..−1, 다리보다 한 칸 넓게)
  const robeAt = (x: number, y: number, z: number) => {
    if (desert && (y === 7 || y === 8)) return pick(BAND, x, y, z, 5); // 주황 띠
    if (hashOf(x, y, z, 6) % 100 < 14) return pick(MOSS, x, y, z, 7);
    return pick(ROBE, x, y, z, 8);
  };
  const torso = box(-4, 3, -6, 11, -3, 2, (x, y, z) => (y < 0 && hashOf(x, y, z, 9) % 100 < 12 && y === -6 ? pick(MOSS, x, y, z, 10) : robeAt(x, y, z)));
  const arm = box(-2, 1, -12, -1, -2, 1, (x, y, z) => (y >= -4 ? robeAt(x, y, z) : pick(SKIN, x, y, z, 11)));
  const leg = box(-2, 1, -12, -1, -2, 1, (x, y, z) => (y <= -11 ? pick([0x5c5c5c, 0x4e4e4e], x, y, z, 12) : pick(desert ? [0x4f8a3b, 0x3f6b2e] : ROBE, x, y, z, 13)));
  return { head, torso, arm, leg };
}

/** 엔더마이트 (아빠 그림 2026-11-06): 검보랏빛 작은 벌레 — 머리·몸 두 마디·꼬리, 옆으로 짧은 다리 자국. 길이 8, 높이 3. 앞이 −z, 바닥 y 0 */
export function endermiteVoxels(): Voxel[] {
  const DARK = [0x2b2533, 0x241f2b, 0x332b3d];
  const SPOT = [0x4a3d5a, 0x5a4a6e];
  const col = (x: number, y: number, z: number) => (hashOf(x, y, z, 21) % 100 < 22 ? pick(SPOT, x, y, z, 22) : pick(DARK, x, y, z, 23));
  return [
    ...box(-1, 0, 0, 1, -4, -3, col), // 머리
    ...box(-2, 1, 0, 2, -2, 0, col), // 가슴 (가장 크다)
    ...box(-2, 1, 0, 1, 1, 2, col), // 배
    ...box(-1, 0, 0, 0, 3, 3, col), // 꼬리
    { x: -1, y: 1, z: -5, c: css(0x4a1f2a) },
    { x: 0, y: 1, z: -5, c: css(0x4a1f2a) }, // 붉은 주둥이 끝
  ];
}

/** MobView 가 쓰는 몹 종류 → 좀비 모델 */
export function zombieKindOf(kindName: string, desert: boolean): ZombieKind | null {
  switch (kindName) {
    case 'zombie':
    case 'baby_zombie':
      return 'zombie';
    case 'zombie_villager':
      return desert ? 'desert_zombie_villager' : 'zombie_villager';
    case 'husk':
    case 'drowned':
    case 'frostbite':
    case 'zombie_king':
      return kindName;
    default:
      return null;
  }
}
