/**
 * 묘목이 자라서 되는 참나무 (#181). 마을 생성기의 참나무(village.ts treeAt)와 같은 모양 — 줄기 4~6 + 잎 4층.
 * 결정론: 자리(x,y,z)와 시드로 줄기 높이·모서리 잎이 정해진다. 잎은 빈 칸(공기)에만 들어간다.
 */
import { hash3 } from '../math/prng';

export interface TreeBlock {
  x: number;
  y: number;
  z: number;
  /** 'log'·'leaves'(참나무) 또는 'stem'·'cap'(거대 버섯 #208) */
  kind: 'log' | 'leaves' | 'stem' | 'cap';
}

/** 나무 종류 (#243): 묘목의 grows `<kind>_tree` → 줄기·잎 블록 id */
export const TREE_KINDS = {
  oak: { log: 'log', leaves: 'leaves' },
  spruce: { log: 'spruce_log', leaves: 'spruce_leaves' },
  birch: { log: 'birch_log', leaves: 'birch_leaves' },
  jungle: { log: 'jungle_log', leaves: 'jungle_leaves' },
  acacia: { log: 'acacia_log', leaves: 'acacia_leaves' },
  dark_oak: { log: 'dark_oak_log', leaves: 'dark_oak_leaves' },
  cherry: { log: 'cherry_log', leaves: 'cherry_leaves' },
  mangrove: { log: 'mangrove_log', leaves: 'mangrove_leaves' },
} as const;
export type TreeKind = keyof typeof TREE_KINDS;
export function treeKindOf(grows: string | null | undefined): TreeKind | null {
  if (!grows || !grows.endsWith('_tree')) return null;
  const k = grows.slice(0, -5);
  return k in TREE_KINDS ? (k as TreeKind) : null;
}

/**
 * 나무 8종 (#243, 아빠 2026-10-31 "나무 종류" — 마인크래프트 묘목 위키). 모두 묘목 하나에서 자란다(2×2 조건은 없음).
 * - 참나무: 줄기 4~6, 둥근 잎 4층 / 자작나무: 줄기 5~7, 참나무 잎 / 맹그로브: 줄기 5~7, 참나무 잎(뿌리는 없음)
 * - 가문비나무: 줄기 6~8, 고깔(위로 갈수록 좁아지는 잎 층, 반지름 1·2 번갈아)
 * - 정글나무: 줄기 6~9, 꼭대기 잎 넓게 3층
 * - 아카시아나무: 줄기 5~6, 꼭대기에 납작한 우산 잎(반지름 3 한 층 + 2 한 층)
 * - 짙은 참나무: 줄기 4~5, 넓고 두꺼운 잎(반지름 3 두 층 + 2 한 층)
 * - 벚나무: 줄기 4~5, 크고 둥근 분홍 잎(반지름 3·3·2·1)
 */
export function treeBlocks(kind: TreeKind, base: { x: number; y: number; z: number }, seed: number, isAir: (x: number, y: number, z: number) => boolean): TreeBlock[] {
  if (kind === 'oak' || kind === 'birch' || kind === 'mangrove') return oakTreeBlocks(base, seed, isAir, kind === 'oak' ? 0 : 1);
  const { x, y, z } = base;
  const out: TreeBlock[] = [];
  const leaf = (lx: number, ly: number, lz: number) => {
    if (isAir(lx, ly, lz)) out.push({ x: lx, y: ly, z: lz, kind: 'leaves' });
  };
  const disc = (cy: number, r: number, corners: boolean) => {
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++) {
        if (dx === 0 && dz === 0) continue;
        if (!corners && Math.abs(dx) === r && Math.abs(dz) === r) continue;
        leaf(x + dx, cy, z + dz);
      }
  };
  const trunk = (h: number) => {
    for (let yy = y; yy < y + h; yy++) if (yy === y || isAir(x, yy, z)) out.push({ x, y: yy, z, kind: 'log' });
    return y + h - 1; // 꼭대기 줄기 칸
  };
  const rnd = (k: number) => hash3(x, k, z, seed);
  if (kind === 'spruce') {
    const top = trunk(6 + Math.floor(rnd(2) * 3));
    let r = 1;
    for (let cy = top; cy >= top - 5; cy--) {
      disc(cy, r, false);
      r = r === 1 ? 2 : 1;
    }
    leaf(x, top + 1, z);
    disc(top + 1, 1, false);
    leaf(x, top + 2, z);
  } else if (kind === 'jungle') {
    const top = trunk(6 + Math.floor(rnd(2) * 4));
    disc(top - 1, 3, false);
    disc(top, 2, true);
    disc(top + 1, 1, true);
    leaf(x, top + 1, z);
    leaf(x, top + 2, z);
  } else if (kind === 'acacia') {
    const top = trunk(5 + Math.floor(rnd(2) * 2));
    disc(top, 3, false);
    disc(top + 1, 2, false);
    leaf(x, top + 1, z);
  } else if (kind === 'dark_oak') {
    const top = trunk(4 + Math.floor(rnd(2) * 2));
    disc(top - 1, 3, false);
    disc(top, 3, false);
    disc(top + 1, 2, false);
    leaf(x, top + 1, z);
    disc(top + 2, 1, true);
    leaf(x, top + 2, z);
  } else {
    // cherry
    const top = trunk(4 + Math.floor(rnd(2) * 2));
    disc(top - 1, 3, false);
    disc(top, 3, true);
    disc(top + 1, 2, false);
    leaf(x, top + 1, z);
    disc(top + 2, 1, true);
    leaf(x, top + 2, z);
  }
  return out;
}

/** base = 묘목이 있던 칸(줄기 첫 칸). isAir 는 그 칸이 비었는지. taller 1 = 자작·맹그로브(한 칸 더 큼) */
export function oakTreeBlocks(base: { x: number; y: number; z: number }, seed: number, isAir: (x: number, y: number, z: number) => boolean, taller = 0): TreeBlock[] {
  const { x, y, z } = base;
  const out: TreeBlock[] = [];
  const top = y + 3 + taller + Math.floor(hash3(x, 2, z, seed) * 3); // 줄기 4~6 (묘목 칸 포함)
  for (let yy = y; yy <= top; yy++) if (yy === y || isAir(x, yy, z)) out.push({ x, y: yy, z, kind: 'log' });
  for (let dy = -2; dy <= 1; dy++) {
    const yy = top + dy;
    const r = dy <= -1 ? 2 : 1;
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++) {
        if (dx === 0 && dz === 0 && dy <= 0) continue;
        if (r === 2 && Math.abs(dx) === 2 && Math.abs(dz) === 2 && hash3(x + dx, yy, z + dz, seed) < 0.5) continue;
        if (isAir(x + dx, yy, z + dz)) out.push({ x: x + dx, y: yy, z: z + dz, kind: 'leaves' });
      }
  }
  if (isAir(x, top + 2, z)) out.push({ x, y: top + 2, z, kind: 'leaves' });
  return out;
}

/**
 * 거대 버섯 (#208, 아들 거대 버섯 그림 2026-10-20): 버섯에 뼛가루 → 줄기 4~5 + 갓. 마인크래프트 모양.
 * 빨강: 꼭대기 3×3 + 그 아래 두 층은 5×5 테두리(모서리 빼고). 갈색: 꼭대기에 7×7 평평한 갓(모서리 빼고).
 * base = 버섯이 있던 칸(줄기 첫 칸). 다른 칸은 빈 칸(공기)에만 들어간다
 */
export function hugeMushroomBlocks(base: { x: number; y: number; z: number }, kind: 'red' | 'brown', seed: number, isAir: (x: number, y: number, z: number) => boolean): TreeBlock[] {
  const { x, y, z } = base;
  const out: TreeBlock[] = [];
  const h = 4 + Math.floor(hash3(x, 7, z, seed) * 2); // 줄기 4~5
  for (let yy = y; yy < y + h; yy++) if (yy === y || isAir(x, yy, z)) out.push({ x, y: yy, z, kind: 'stem' });
  const top = y + h;
  const cap = (cx: number, cy: number, cz: number) => {
    if (isAir(cx, cy, cz)) out.push({ x: cx, y: cy, z: cz, kind: 'cap' });
  };
  if (kind === 'red') {
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) cap(x + dx, top, z + dz);
    for (let dy = 1; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++)
        for (let dz = -2; dz <= 2; dz++) {
          if (Math.abs(dx) !== 2 && Math.abs(dz) !== 2) continue; // 테두리만
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue; // 모서리 빼고
          cap(x + dx, top - dy, z + dz);
        }
  } else {
    for (let dx = -3; dx <= 3; dx++)
      for (let dz = -3; dz <= 3; dz++) {
        if (Math.abs(dx) === 3 && Math.abs(dz) === 3) continue;
        if (dx === 0 && dz === 0) continue; // 가운데는 줄기 꼭대기 칸 위 — 갓으로 덮는다
        cap(x + dx, top, z + dz);
      }
    cap(x, top, z);
  }
  return out;
}
