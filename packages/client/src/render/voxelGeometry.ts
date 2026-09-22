/**
 * 복셀 목록 → Three.js BufferGeometry (M6-3). 이웃이 있는 면은 빼고, 면마다 밝기를 달리한 꼭짓점 색.
 * `models/dragon-voxels.js` 가 만드는 { x, y, z, c } 목록을 그대로 받는다. y 0 이 발바닥, +z 가 머리 방향.
 */
import * as THREE from 'three';

export interface Voxel {
  x: number;
  y: number;
  z: number;
  /** '#rrggbb' */
  c: string;
}

/** 면 순서: +X -X +Y -Y +Z -Z. 조명 없는 씬에서 입체감을 주는 밝기 */
const FACES: { n: [number, number, number]; shade: number; corners: [number, number, number][] }[] = [
  { n: [1, 0, 0], shade: 0.78, corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { n: [-1, 0, 0], shade: 0.72, corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
  { n: [0, 1, 0], shade: 1.0, corners: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
  { n: [0, -1, 0], shade: 0.5, corners: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]] },
  { n: [0, 0, 1], shade: 0.88, corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { n: [0, 0, -1], shade: 0.84, corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
];

/** 보이는 면 수 (테스트·통계용) */
export function exposedFaceCount(voxels: readonly Voxel[]): number {
  const occ = new Set(voxels.map((v) => `${v.x},${v.y},${v.z}`));
  let n = 0;
  for (const v of voxels) for (const f of FACES) if (!occ.has(`${v.x + f.n[0]},${v.y + f.n[1]},${v.z + f.n[2]}`)) n++;
  return n;
}

/**
 * scale = 복셀 한 칸의 크기(블록 단위). x 는 가운데 정렬(모델이 x 대칭), y 0 = 바닥, z 는 그대로.
 * 꼭짓점 색(color) 속성이 있으니 MeshBasicMaterial({ vertexColors: true }) 로 그린다.
 *
 * shades = 면별 밝기를 직접 정한다(+X −X +Y −Y +Z −Z). 없으면 드래곤용 기본값.
 * 사람 인형은 앞뒤·옆 차이를 더 크게 줘서 입체로 보이게 한다 (#86).
 */
export function buildVoxelGeometry(voxels: readonly Voxel[], scale: number, shades?: readonly number[]): THREE.BufferGeometry {
  const occ = new Set(voxels.map((v) => `${v.x},${v.y},${v.z}`));
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const color = new THREE.Color();
  for (const v of voxels) {
    color.set(v.c);
    for (let fi = 0; fi < FACES.length; fi++) {
      const f = FACES[fi]!;
      if (occ.has(`${v.x + f.n[0]},${v.y + f.n[1]},${v.z + f.n[2]}`)) continue;
      const sh = shades?.[fi] ?? f.shade;
      const base = pos.length / 3;
      for (const [cx, cy, cz] of f.corners) {
        pos.push((v.x + cx) * scale, (v.y + cy) * scale, (v.z + cz) * scale);
        col.push(color.r * sh, color.g * sh, color.b * sh);
      }
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geom.setIndex(idx);
  // 모델은 x 대칭(-w..w)이라 가운데가 x=0.5·scale 에 오므로 반 칸 옮겨 정렬
  geom.translate(-0.5 * scale, 0, -0.5 * scale);
  geom.computeBoundingBox();
  return geom;
}
