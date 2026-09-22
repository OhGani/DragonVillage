/**
 * 플레이어 인형 모델 (#86). 마인크래프트식 비율을 복셀로 쌓는다 — 머리 8 · 몸통 12 · 다리 12 = 32칸.
 * 한 칸이 1.8/32 블록이라 인형 키가 몸 판정(1.8)과 딱 맞는다.
 *
 * 전에는 색 하나로 칠한 상자 여섯 개였다. 이제 얼굴(눈·코·웃는 입)·머리카락·손·신발까지 있고,
 * 고른 색 16가지마다 피부·머리·바지가 달라 열여섯 명이 서로 다른 사람으로 보인다.
 *
 * 좌표: 한 칸 = 복셀 1. x 왼쪽이 −, y 0 이 발바닥, **앞(얼굴)이 −z**. 부위마다 제 축에서 만들고
 * 붙이는 자리는 `PART_AT` 이 정한다 — 팔·다리는 어깨·엉덩이가 회전축이라 y 가 음수다.
 */
import { colorHex } from '../net/colors';
import type { Voxel } from './voxelGeometry';

/** 복셀 한 칸의 크기 (블록). 32칸 = 1.8 = 몸 판정 키 */
export const VOXEL = 1.8 / 32;

/** 얼굴 앞면 8×8 (위 → 아래). h 머리카락 · s 피부 · w 흰자 · e 눈동자 · m 입 */
const FACE: readonly string[] = [
  'hhhhhhhh',
  'hhhhhhhh',
  'hhhhhhhh',
  'swessews',
  'ssssssss',
  'ssmssmss',
  'sssmmsss',
  'ssssssss',
];

export interface SkinPalette {
  /** 셔츠 = 로비에서 고른 색 */
  shirt: number;
  skin: number;
  hair: number;
  pants: number;
  shoes: number;
}

/**
 * 색 16가지마다 다른 캐릭터. 셔츠는 고른 색 그대로이고 나머지만 여기서 정한다.
 * 얼굴·머리 모양을 바꾸고 싶으면 위의 FACE 를, 색을 바꾸고 싶으면 이 표를 고치면 된다.
 */
const CHARACTERS: readonly { skin: number; hair: number; pants: number; shoes: number }[] = [
  { skin: 0xf2cfa9, hair: 0xe3c46a, pants: 0x3c4b7d, shoes: 0x5a3a22 }, // 하양
  { skin: 0xe0ac7e, hair: 0x5c3a1e, pants: 0x3a3f46, shoes: 0x2a2420 }, // 주황
  { skin: 0xf2cfa9, hair: 0x7a4fa3, pants: 0x46325e, shoes: 0x2a2430 }, // 자홍
  { skin: 0xc68642, hair: 0x1b1512, pants: 0x2f5d86, shoes: 0x23323f }, // 하늘
  { skin: 0xe0ac7e, hair: 0x8c4a26, pants: 0x6a5426, shoes: 0x3a2c18 }, // 노랑
  { skin: 0xf2cfa9, hair: 0xd1620f, pants: 0x4a5230, shoes: 0x32341f }, // 연두
  { skin: 0xf7d9b8, hair: 0xf0dfa0, pants: 0x8a5a74, shoes: 0x4a3040 }, // 분홍
  { skin: 0x8d5524, hair: 0x1b1512, pants: 0x2b2f33, shoes: 0x1a1d20 }, // 회색
  { skin: 0xe0ac7e, hair: 0x9a9a9a, pants: 0x4a4a46, shoes: 0x2e2e2c }, // 연회색
  { skin: 0x6b4226, hair: 0x1b1512, pants: 0x1e4a4a, shoes: 0x143030 }, // 청록
  { skin: 0xc68642, hair: 0x3b2317, pants: 0x3a2a52, shoes: 0x241a33 }, // 보라
  { skin: 0xf2cfa9, hair: 0x6a3f1e, pants: 0x24305a, shoes: 0x191f3a }, // 파랑
  { skin: 0xe0ac7e, hair: 0x1b1512, pants: 0x4a3624, shoes: 0x2c2016 }, // 갈색
  { skin: 0xc68642, hair: 0x5c3a1e, pants: 0x3a4a24, shoes: 0x232c16 }, // 초록
  { skin: 0xf2cfa9, hair: 0x1b1512, pants: 0x5a2630, shoes: 0x33161c }, // 빨강
  { skin: 0xf7d9b8, hair: 0xdedede, pants: 0x2a2c32, shoes: 0x17181c }, // 검정
];

export const EYE_WHITE = 0xf4f4f4;
export const EYE_DARK = 0x2b2a33;

/** 밝기 배율 */
function shade(hex: number, k: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

const css = (hex: number): string => '#' + hex.toString(16).padStart(6, '0');

export function paletteFor(colorIdx: number): SkinPalette {
  const c = CHARACTERS[((colorIdx % CHARACTERS.length) + CHARACTERS.length) % CHARACTERS.length]!;
  return { shirt: colorHex(colorIdx), skin: c.skin, hair: c.hair, pants: c.pants, shoes: c.shoes };
}

/** 얼굴 글자 → 색 */
function faceColor(ch: string, p: SkinPalette): number {
  switch (ch) {
    case 'h':
      return p.hair;
    case 'w':
      return EYE_WHITE;
    case 'e':
      return EYE_DARK;
    case 'm':
      return shade(p.skin, 0.62);
    default:
      return p.skin;
  }
}

/** 상자 하나를 복셀로 채운다. color(x, y, z) 가 칸마다 색을 정한다 */
function fill(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number): Voxel[] {
  const out: Voxel[] = [];
  for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  return out;
}

/** 머리 8×8×8: 위 세 칸과 뒤 두 칸은 머리카락, 앞면은 얼굴 그림 */
function headVoxels(p: SkinPalette): Voxel[] {
  return fill(-4, 3, 0, 7, -4, 3, (x, y, z) => {
    if (z === -4) return faceColor(FACE[7 - y]![x + 4]!, p);
    return y >= 5 || z >= 2 ? p.hair : p.skin;
  });
}

/** 몸통 8×12×4: 셔츠, 맨 아랫줄은 허리(바지색), 앞 가운데 위는 목(깃) */
function torsoVoxels(p: SkinPalette): Voxel[] {
  return fill(-4, 3, 0, 11, -2, 1, (x, y, z) => {
    if (y === 0) return p.pants;
    if (z === -2 && y === 11 && (x === -1 || x === 0)) return p.skin;
    return p.shirt;
  });
}

/** 팔 4×12×4: 어깨가 회전축(y 0)이라 아래로 자란다. 끝 세 칸은 손 */
function armVoxels(p: SkinPalette): Voxel[] {
  return fill(-2, 1, -12, -1, -2, 1, (_x, y) => (y <= -10 ? p.skin : p.shirt));
}

/** 다리 4×12×4: 끝 세 칸은 신발 */
function legVoxels(p: SkinPalette): Voxel[] {
  return fill(-2, 1, -12, -1, -2, 1, (_x, y) => (y <= -10 ? p.shoes : p.pants));
}

/** 부위별 복셀 (부위마다 제 축 기준) */
export function playerVoxels(p: SkinPalette): { head: Voxel[]; torso: Voxel[]; arm: Voxel[]; leg: Voxel[] } {
  return { head: headVoxels(p), torso: torsoVoxels(p), arm: armVoxels(p), leg: legVoxels(p) };
}

/** 부위를 붙이는 자리 (복셀 단위). 팔·다리는 여기가 회전축 */
export const PART_AT = {
  head: [0, 24],
  torso: [0, 12],
  armL: [-6, 24],
  armR: [6, 24],
  legL: [-2, 12],
  legR: [2, 12],
} as const;

/** 정면에서 보이는 칸 (x, y, 색) — 같은 x·y 면 가장 앞(z 가 작은) 칸. 로비 미리보기가 쓴다 */
export function frontPixels(p: SkinPalette): { x: number; y: number; c: string }[] {
  const v = playerVoxels(p);
  const best = new Map<string, { x: number; y: number; z: number; c: string }>();
  // 팔은 살짝 어둡게 — 정면에서 몸통과 같은 색이면 한 덩어리로 보인다 (미리보기에서만)
  const add = (list: readonly Voxel[], ox: number, oy: number, dim = 1) => {
    for (const q of list) {
      const x = q.x + ox,
        y = q.y + oy;
      const key = `${x},${y}`;
      const cur = best.get(key);
      if (!cur || q.z < cur.z) best.set(key, { x, y, z: q.z, c: dim === 1 ? q.c : css(shade(parseInt(q.c.slice(1), 16), dim)) });
    }
  };
  add(v.leg, PART_AT.legL[0], PART_AT.legL[1]);
  add(v.leg, PART_AT.legR[0], PART_AT.legR[1]);
  add(v.torso, PART_AT.torso[0], PART_AT.torso[1]);
  add(v.arm, PART_AT.armL[0], PART_AT.armL[1], 0.9);
  add(v.arm, PART_AT.armR[0], PART_AT.armR[1], 0.9);
  add(v.head, PART_AT.head[0], PART_AT.head[1]);
  return [...best.values()].map((q) => ({ x: q.x, y: q.y, c: q.c }));
}
