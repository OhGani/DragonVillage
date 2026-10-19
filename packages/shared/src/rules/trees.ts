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

/** base = 묘목이 있던 칸(줄기 첫 칸). isAir 는 그 칸이 비었는지 */
export function oakTreeBlocks(base: { x: number; y: number; z: number }, seed: number, isAir: (x: number, y: number, z: number) => boolean): TreeBlock[] {
  const { x, y, z } = base;
  const out: TreeBlock[] = [];
  const top = y + 3 + Math.floor(hash3(x, 2, z, seed) * 3); // 줄기 4~6 (묘목 칸 포함)
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
