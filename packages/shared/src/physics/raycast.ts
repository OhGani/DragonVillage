/**
 * Amanatides–Woo 복셀 레이캐스트. 클라(조준)와 서버(검증)가 같은 함수를 쓴다.
 * face: 0 +X, 1 -X, 2 +Y, 3 -Y, 4 +Z, 5 -Z  — 맞은 블록의 어느 면인지
 */
export interface RayHit {
  x: number;
  y: number;
  z: number;
  face: number;
  nx: number;
  ny: number;
  nz: number;
  distance: number;
  id: number;
}

export const FACE_NORMALS: readonly (readonly [number, number, number])[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export function raycastVoxels(
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
  const len = Math.hypot(dx, dy, dz);
  if (len === 0) return null;
  dx /= len;
  dy /= len;
  dz /= len;

  let x = Math.floor(ox),
    y = Math.floor(oy),
    z = Math.floor(oz);
  const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  const stepZ = dz > 0 ? 1 : dz < 0 ? -1 : 0;
  const tDeltaX = stepX ? Math.abs(1 / dx) : Infinity;
  const tDeltaY = stepY ? Math.abs(1 / dy) : Infinity;
  const tDeltaZ = stepZ ? Math.abs(1 / dz) : Infinity;
  let tMaxX = stepX > 0 ? (x + 1 - ox) / dx : stepX < 0 ? (ox - x) / -dx : Infinity;
  let tMaxY = stepY > 0 ? (y + 1 - oy) / dy : stepY < 0 ? (oy - y) / -dy : Infinity;
  let tMaxZ = stepZ > 0 ? (z + 1 - oz) / dz : stepZ < 0 ? (oz - z) / -dz : Infinity;

  let face = -1;
  let t = 0;
  // 시작 칸은 건너뛴다 (머리가 박힌 블록은 조준 안 함)
  for (let iter = 0; iter < 256; iter++) {
    if (face >= 0) {
      const id = getBlock(x, y, z);
      if (hits(id)) {
        const n = FACE_NORMALS[face];
        return { x, y, z, face, nx: n[0], ny: n[1], nz: n[2], distance: t, id };
      }
    }
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      t = tMaxX;
      if (t > maxDist) return null;
      x += stepX;
      tMaxX += tDeltaX;
      face = stepX > 0 ? 1 : 0;
    } else if (tMaxY < tMaxZ) {
      t = tMaxY;
      if (t > maxDist) return null;
      y += stepY;
      tMaxY += tDeltaY;
      face = stepY > 0 ? 3 : 2;
    } else {
      t = tMaxZ;
      if (t > maxDist) return null;
      z += stepZ;
      tMaxZ += tDeltaZ;
      face = stepZ > 0 ? 5 : 4;
    }
  }
  return null;
}
