/**
 * 묘목이 자라서 되는 참나무 (#181). 마을 생성기의 참나무(village.ts treeAt)와 같은 모양 — 줄기 4~6 + 잎 4층.
 * 결정론: 자리(x,y,z)와 시드로 줄기 높이·모서리 잎이 정해진다. 잎은 빈 칸(공기)에만 들어간다.
 */
import { hash3 } from '../math/prng';

export interface TreeBlock {
  x: number;
  y: number;
  z: number;
  /** 'log' 또는 'leaves' */
  kind: 'log' | 'leaves';
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
