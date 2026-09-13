import { PADDED_VOLUME, paddedIndex, parseBlocks } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { buildMeshBlockInfo } from './blockInfo';
import { greedyMesh } from './greedyMesher';
import type { MeshBuffers } from './meshTypes';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'grass', name: '잔디', hardness: 1, textureTop: 'grass_top', textureSide: 'grass_side', textureBottom: 'dirt' },
    { id: 'glass', name: '유리', hardness: 1, transparent: true, texture: 'glass' },
    { id: 'water', name: '물', solid: false, transparent: true, fluid: 'water', texture: 'water' },
  ],
});
const texIndex = new Map([
  ['missing', 0],
  ['stone', 1],
  ['grass_top', 2],
  ['grass_side', 3],
  ['dirt', 4],
  ['glass', 5],
  ['water', 6],
]);
const info = buildMeshBlockInfo(registry, texIndex);
const STONE = registry.numOf('stone');
const GRASS = registry.numOf('grass');
const GLASS = registry.numOf('glass');
const WATER = registry.numOf('water');

function padded(fill: (x: number, y: number, z: number) => number): Uint16Array {
  const arr = new Uint16Array(PADDED_VOLUME);
  for (let y = -1; y <= 16; y++) for (let z = -1; z <= 16; z++) for (let x = -1; x <= 16; x++) arr[paddedIndex(x, y, z)] = fill(x, y, z);
  return arr;
}

function quadCount(b: MeshBuffers | null): number {
  return b ? b.vertexCount / 4 : 0;
}

/** 삼각형 법선이 면 번호의 방향과 같은지 (와인딩 검사) */
function checkWinding(b: MeshBuffers): void {
  const NORMALS = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  for (let t = 0; t < b.indexCount; t += 3) {
    const i0 = b.indices[t],
      i1 = b.indices[t + 1],
      i2 = b.indices[t + 2];
    const P = (i: number) => [b.positions[i * 3], b.positions[i * 3 + 1], b.positions[i * 3 + 2]];
    const a = P(i0),
      c = P(i1),
      d = P(i2);
    const e1 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const face = b.meta[i0 * 4 + 2];
    const exp = NORMALS[face];
    const dot = n[0] * exp[0] + n[1] * exp[1] + n[2] * exp[2];
    expect(dot, `face ${face} 삼각형 ${t / 3} 와인딩`).toBeGreaterThan(0);
  }
}

describe('greedyMesh', () => {
  it('블록 하나 → 6면 24정점 36인덱스', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? STONE : 0)),
      info,
    );
    expect(r.translucent).toBeNull();
    expect(r.opaque!.vertexCount).toBe(24);
    expect(r.opaque!.indexCount).toBe(36);
    expect(quadCount(r.opaque)).toBe(6);
    checkWinding(r.opaque!);
    // 6면이 모두 한 번씩
    const faces = new Set<number>();
    for (let i = 0; i < 24; i++) faces.add(r.opaque!.meta[i * 4 + 2]);
    expect(faces.size).toBe(6);
    // 떠 있는 블록은 AO 전부 3
    for (let i = 0; i < 24; i++) expect(r.opaque!.meta[i * 4 + 1]).toBe(3);
  });

  it('2×2×2 꽉 찬 큐브 → greedy 병합으로 6면(24정점)', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x >= 4 && x < 6 && y >= 4 && y < 6 && z >= 4 && z < 6 ? STONE : 0)),
      info,
    );
    expect(quadCount(r.opaque)).toBe(6);
    checkWinding(r.opaque!);
    // 병합된 면의 uv 는 2×2 범위를 덮는다
    const b = r.opaque!;
    let maxSpan = 0;
    for (let q = 0; q < 6; q++) {
      const us = [0, 1, 2, 3].map((i) => b.uvs[(q * 4 + i) * 2]);
      maxSpan = Math.max(maxSpan, Math.max(...us) - Math.min(...us));
    }
    expect(maxSpan).toBe(2);
  });

  it('이웃 청크 경계: 패딩에 있는 이웃 블록이 면을 가린다', () => {
    // x=15 에 돌, 패딩 x=16 에도 돌 → +X 면 없음 (5면)
    const r1 = greedyMesh(
      padded((x, y, z) => (y === 5 && z === 5 && (x === 15 || x === 16) ? STONE : 0)),
      info,
    );
    expect(quadCount(r1.opaque)).toBe(5);
    const faces1 = new Set<number>();
    for (let i = 0; i < r1.opaque!.vertexCount; i++) faces1.add(r1.opaque!.meta[i * 4 + 2]);
    expect(faces1.has(0)).toBe(false); // +X 없음

    // x=0 에 돌, 패딩 x=-1 에도 돌 → -X 면 없음
    const r2 = greedyMesh(
      padded((x, y, z) => (y === 5 && z === 5 && (x === 0 || x === -1) ? STONE : 0)),
      info,
    );
    expect(quadCount(r2.opaque)).toBe(5);
    const faces2 = new Set<number>();
    for (let i = 0; i < r2.opaque!.vertexCount; i++) faces2.add(r2.opaque!.meta[i * 4 + 2]);
    expect(faces2.has(1)).toBe(false);

    // 패딩에만 블록이 있으면 아무 면도 안 만든다 (그 면은 이웃 청크 몫)
    const r3 = greedyMesh(
      padded((x) => (x === -1 || x === 16 ? STONE : 0)),
      info,
    );
    expect(r3.opaque).toBeNull();
  });

  it('16×16×1 평지 → 위·아래 1면씩 + 옆면 4개 = 6면', () => {
    const r = greedyMesh(
      padded((x, y, z) => (y === 0 && x >= 0 && x < 16 && z >= 0 && z < 16 ? GRASS : 0)),
      info,
    );
    expect(quadCount(r.opaque)).toBe(6);
    // 윗면 텍스처 = grass_top(2), 아랫면 = dirt(4), 옆 = grass_side(3)
    const b = r.opaque!;
    for (let i = 0; i < b.vertexCount; i++) {
      const face = b.meta[i * 4 + 2],
        layer = b.meta[i * 4];
      if (face === 2) expect(layer).toBe(2);
      else if (face === 3) expect(layer).toBe(4);
      else expect(layer).toBe(3);
    }
  });

  it('바닥 위 블록 주변은 AO 가 생기고 병합이 갈라진다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (y === 0 && x >= 0 && x < 16 && z >= 0 && z < 16 ? STONE : x === 8 && y === 1 && z === 8 ? STONE : 0)),
      info,
    );
    const b = r.opaque!;
    let darkTop = 0;
    for (let i = 0; i < b.vertexCount; i++) if (b.meta[i * 4 + 2] === 2 && b.meta[i * 4 + 1] < 3) darkTop++;
    expect(darkTop).toBeGreaterThan(0);
    expect(quadCount(r.opaque)).toBeGreaterThan(6 + 5);
  });

  it('유리끼리 붙은 면은 지우고, 물은 반투명 버퍼로 간다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (y === 3 && z === 3 && (x === 3 || x === 4) ? GLASS : x === 8 && y === 8 && z === 8 ? WATER : 0)),
      info,
    );
    expect(quadCount(r.opaque)).toBe(6); // 유리 2개가 한 덩어리처럼 6면 (greedy 로 옆면 병합)
    expect(quadCount(r.translucent)).toBe(6);
  });

  it('액체: 원천 윗면은 8/9 높이, 같은 물끼리 맞닿은 면은 없고 낮은 이웃 위로 드러난 부분만 그린다', () => {
    const W3 = registry.fluidVariant(WATER, 3);
    const r = greedyMesh(
      padded((x, y, z) => (y === 4 && z === 4 && x === 4 ? WATER : y === 4 && z === 4 && x === 5 ? W3 : 0)),
      info,
    );
    const b = r.translucent!;
    // 원천: 위·아래·옆 4 (동쪽은 부분) = 6, 흐름3: 위·아래·옆 3 = 5
    expect(quadCount(r.translucent)).toBe(11);
    checkWinding(b);
    let topY = -1,
      partialMin = 99;
    for (let i = 0; i < b.vertexCount; i++) {
      const face = b.meta[i * 4 + 2];
      const px = b.positions[i * 3],
        py = b.positions[i * 3 + 1];
      if (face === 2 && px <= 5) topY = Math.max(topY, py); // 원천 윗면
      if (face === 0 && px === 5) partialMin = Math.min(partialMin, py); // 원천의 +X 옆면 아랫변
    }
    expect(topY).toBeCloseTo(4 + 8 / 9, 5);
    expect(partialMin).toBeCloseTo(4 + 5 / 9, 5); // 이웃(흐름3, 높이 5/9) 위부터
  });

  it('유리 속 돌: 돌의 면은 보이고 유리의 안쪽 면도 보인다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? STONE : x === 6 && y === 5 && z === 5 ? GLASS : 0)),
      info,
    );
    // 돌: 유리 쪽 +X 면도 보임 → 6면. 유리: 돌 쪽 -X 면은 불투명에 가려짐 → 5면
    expect(quadCount(r.opaque)).toBe(11);
  });
});
