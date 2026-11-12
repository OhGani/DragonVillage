import { PADDED_VOLUME, paddedIndex, parseBlocks } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { buildMeshBlockInfo } from './blockInfo';
import { connectedKeys, connectedName } from './connected';
import { greedyMesh } from './greedyMesher';
import type { MeshBuffers } from './meshTypes';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'grass', name: '잔디', hardness: 1, textureTop: 'grass_top', textureSide: 'grass_side', textureBottom: 'dirt' },
    { id: 'glass', name: '유리', hardness: 1, transparent: true, texture: 'glass' },
    { id: 'water', name: '물', solid: false, transparent: true, fluid: 'water', texture: 'water' },
    { id: 'oak_door', name: '문', hardness: 3, transparent: true, textureTop: 'door_top', textureSide: 'door_bottom', textureBottom: 'door_bottom', shape: 'door' },
    { id: 'torch', name: '횃불', hardness: 0, solid: false, transparent: true, lightEmit: 14, shape: 'torch', texture: 'torch' },
    { id: 'dragon_egg', name: '드래곤 알', transparent: true, lightEmit: 4, shape: 'egg', texture: 'dragon_egg' },
    { id: 'dandelion', name: '민들레', hardness: 0, solid: false, shape: 'cross', texture: 'dandelion' },
    { id: 'bed', name: '침대', hardness: 0.2, shape: 'bed', textureTop: 'bed_top', textureSide: 'bed_side', textureBottom: 'dirt' },
    { id: 'sign', name: '표지판', hardness: 1, solid: false, shape: 'sign', texture: 'sign_board' },
    { id: 'far', name: '먼 그림', hardness: 1, texture: 'far' },
    { id: 'dining_table', name: '식탁', hardness: 2, transparent: true, shape: 'table', texture: 'sign_board' },
    { id: 'campfire', name: '모닥불', hardness: 2, transparent: true, lightEmit: 15, shape: 'campfire', texture: 'campfire_log' },
    { id: 'campfire_off', name: '꺼진 모닥불', hardness: 2, transparent: true, shape: 'campfire', texture: 'campfire_log' },
    { id: 'oak_stairs', name: '계단', hardness: 2, shape: 'stairs', texture: 'stone' },
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
  ['door_top', 7],
  ['door_bottom', 8],
  ['torch', 9],
  ['dragon_egg', 10],
  ['dandelion', 11],
  ['bed_top_foot', 12],
  ['bed_top_head', 13],
  ['bed_side', 14],
  ['sign_board', 15],
  ['far', 300], // 텍스처가 256장을 넘는다 (#202)
  ['campfire_log', 20],
  ['campfire_log_end', 21],
  ['campfire_fire', 22],
]);
for (const k of connectedKeys()) if (k !== 0) texIndex.set(connectedName('glass', k), 100 + k); // 이어지는 유리 (2026-11-09): glass@k → 100+k
const info = buildMeshBlockInfo(registry, texIndex);
const STONE = registry.numOf('stone');
const GRASS = registry.numOf('grass');
const GLASS = registry.numOf('glass');
const WATER = registry.numOf('water');
const DOOR_N = registry.doorVariant(registry.numOf('oak_door'), 0, false, false);
const DOOR_N_OPEN_UP = registry.doorVariant(registry.numOf('oak_door'), 0, true, true);
const TORCH = registry.numOf('torch');
const TORCH_WALL_N = registry.torchVariant(TORCH, 0);
const EGG = registry.numOf('dragon_egg');
const FLOWER = registry.numOf('dandelion');
const BED_FOOT_N = registry.bedVariant(registry.numOf('bed'), 0, false);
const BED_HEAD_N = registry.bedVariant(registry.numOf('bed'), 0, true);
const SIGN = registry.numOf('sign');
const TABLE = registry.numOf('dining_table');

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
    expect(quadCount(r.opaque)).toBe(10); // 사이 면 둘은 없다. 이어지는 그림(2026-11-09) 때문에 두 블록의 면은 그림이 달라 병합되지 않는다: 6 + 6 − 2
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

describe('greedyMesh 정점 빛', () => {
  function lightArr(fill: (x: number, y: number, z: number) => number): Uint8Array {
    const arr = new Uint8Array(PADDED_VOLUME);
    for (let y = -1; y <= 16; y++) for (let z = -1; z <= 16; z++) for (let x = -1; x <= 16; x++) arr[paddedIndex(x, y, z)] = fill(x, y, z);
    return arr;
  }
  const single = padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? STONE : 0));

  it('빛 배열이 없으면 하늘 15·블록 0 (손에 든 블록)', () => {
    const r = greedyMesh(single, info);
    for (let i = 0; i < r.opaque!.vertexCount; i++) expect(r.opaque!.meta[i * 4 + 3]).toBe(0xf0);
  });

  it('면의 바깥쪽 4칸 평균이 꼭짓점 빛이 된다', () => {
    // x=4 평면(돌의 -X 쪽)만 하늘 3·블록 9, 나머지는 15·0
    const r = greedyMesh(
      single,
      info,
      lightArr((x) => (x === 4 ? (3 << 4) | 9 : 0xf0)),
    );
    const b = r.opaque!;
    for (let i = 0; i < b.vertexCount; i++) {
      const face = b.meta[i * 4 + 2],
        lt = b.meta[i * 4 + 3];
      if (face === 1) expect(lt).toBe((3 << 4) | 9); // -X 면의 4칸이 모두 x=4 평면
      if (face === 0) expect(lt).toBe(0xf0); // +X 면은 x=6 평면
    }
  });

  it('불투명 칸은 평균에서 빠진다 (바닥 위 블록의 옆면 아래 꼭짓점)', () => {
    // 바닥(y=0) 위 블록(8,1,8). 블록 옆 공기(y=1)는 하늘 10, 바닥 위 공기(y=1) 전부 10, 그 위(y>=2)는 15
    const world = padded((x, y, z) => (y === 0 ? STONE : x === 8 && y === 1 && z === 8 ? STONE : 0));
    const r = greedyMesh(
      world,
      info,
      lightArr((_x, y) => (y <= 1 ? 10 << 4 : 0xf0)),
    );
    const b = r.opaque!;
    // 블록(8,1,8)의 +X 면: 아래 꼭짓점은 (9,1,*)=10 과 옆 (9,0,*)=바닥(불투명, 제외) → 10. 위 꼭짓점은 (9,1)=10 과 (9,2)=15 → 평균 12~13
    let low = -1,
      high = -1;
    for (let i = 0; i < b.vertexCount; i++) {
      if (b.meta[i * 4 + 2] !== 0) continue;
      const px = b.positions[i * 3],
        py = b.positions[i * 3 + 1];
      if (px !== 9) continue; // 블록의 +X 면 (x=9 평면)
      const sky = b.meta[i * 4 + 3] >> 4;
      if (py === 1) low = sky;
      if (py === 2) high = sky;
    }
    expect(low).toBe(10);
    expect(high).toBeGreaterThan(10);
    expect(high).toBeLessThan(15);
  });

  it('빛이 다른 면은 greedy 로 합쳐지지 않는다', () => {
    const two = padded((x, y, z) => (y === 5 && z === 5 && (x === 5 || x === 6) ? STONE : 0));
    const same = greedyMesh(two, info, lightArr(() => 0xf0));
    expect(quadCount(same.opaque)).toBe(6);
    // 왼쪽 블록 바로 위 칸만 어둡게 → 윗면이 둘로 갈라진다 (다른 면은 그 칸을 안 본다)
    const split = greedyMesh(
      two,
      info,
      lightArr((x, y, z) => (x === 5 && y === 6 && z === 5 ? 8 << 4 : 0xf0)),
    );
    expect(quadCount(split.opaque)).toBe(7);
  });

  it('액체 면은 자기 칸의 빛을 쓴다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x === 8 && y === 8 && z === 8 ? WATER : 0)),
      info,
      lightArr((x, y, z) => (x === 8 && y === 8 && z === 8 ? (14 << 4) | 2 : 0xf0)),
    );
    const b = r.translucent!;
    for (let i = 0; i < b.vertexCount; i++) expect(b.meta[i * 4 + 3]).toBe((14 << 4) | 2);
  });
});

describe('문 판 (#71)', () => {
  it('문 반쪽은 3/16 두께 상자 6면, 이웃 블록의 면을 가리지 않는다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? DOOR_N : 0)),
      info,
    );
    expect(quadCount(r.opaque)).toBe(6);
    // 북쪽(-z)을 보고 놓은 닫힌 문 → 놓은 사람 쪽(+z) 가장자리: z 는 5+13/16 ~ 6
    const zs = new Set<number>();
    for (let i = 0; i < r.opaque!.vertexCount; i++) zs.add(Math.round(r.opaque!.positions[i * 3 + 2] * 16));
    expect([...zs].sort((a, b) => a - b)).toEqual([5 * 16 + 13, 6 * 16]);
    expect(r.opaque!.meta[0]).toBe(8); // 아랫칸 그림
    // 열린 윗칸: 왼쪽(-x) 경첩 → x 는 5 ~ 5+3/16, 그림은 door_top
    const o = greedyMesh(
      padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? DOOR_N_OPEN_UP : 0)),
      info,
    );
    const xs = new Set<number>();
    for (let i = 0; i < o.opaque!.vertexCount; i++) xs.add(Math.round(o.opaque!.positions[i * 3] * 16));
    expect([...xs].sort((a, b) => a - b)).toEqual([5 * 16, 5 * 16 + 3]);
    expect(o.opaque!.meta[0]).toBe(7);
    // 문 옆 돌: 돌의 6면이 다 보인다 (문은 불투명이 아님) + 문 6면
    const s = greedyMesh(
      padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? DOOR_N : x === 4 && y === 5 && z === 5 ? STONE : 0)),
      info,
    );
    expect(quadCount(s.opaque)).toBe(12);
  });
});

describe('꽃·풀 (#180)', () => {
  it('십자 판 두 장 양면 = 4면, 칸 안 대각선에 서고 높이 1, 텍스처 v 는 바닥 0 → 위 1', () => {
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? FLOWER : 0)), info).opaque!;
    expect(m.indexCount / 6).toBe(4);
    const ys: number[] = [];
    for (let i = 0; i < m.vertexCount; i++) {
      ys.push(m.positions[i * 3 + 1]!);
      expect(m.positions[i * 3]!).toBeGreaterThanOrEqual(5);
      expect(m.positions[i * 3]!).toBeLessThanOrEqual(6);
      expect(m.meta[i * 4]).toBe(11); // 텍스처 레이어
      expect(m.uvs[i * 2 + 1]).toBe(m.positions[i * 3 + 1]! - 5); // v = 높이
    }
    expect(Math.min(...ys)).toBe(5);
    expect(Math.max(...ys)).toBe(6);
  });
  it('꽃 밑의 잔디 윗면은 그대로 그려진다 (꽃은 면을 가리지 않는다)', () => {
    const withFlower = greedyMesh(padded((x, y, z) => (y < 5 ? GRASS : x === 5 && y === 5 && z === 5 ? FLOWER : 0)), info).opaque!;
    const bare = greedyMesh(padded((_x, y) => (y < 5 ? GRASS : 0)), info).opaque!;
    expect(withFlower.indexCount).toBe(bare.indexCount + 4 * 6);
  });
});

describe('침대 (#188)', () => {
  it('발·머리 각각 몸통 5면(짝 쪽 빼고) + 다리 둘 × 5면 = 15면, 윗면 그림은 발 foot·머리 head, 밑의 잔디 윗면은 그대로 (#203)', () => {
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? BED_FOOT_N : x === 5 && y === 5 && z === 4 ? BED_HEAD_N : 0)), info).opaque!;
    expect(m.indexCount / 6).toBe(30);
    let top = 0;
    const layers = new Set<number>();
    for (let i = 0; i < m.vertexCount; i++) {
      const y = m.positions[i * 3 + 1]!;
      expect(y).toBeGreaterThanOrEqual(5);
      expect(y).toBeLessThanOrEqual(5 + 9 / 16 + 1e-6);
      if (Math.abs(y - (5 + 9 / 16)) < 1e-6 && m.meta[i * 4 + 2] === 2) top++;
      layers.add(m.meta[i * 4]!);
    }
    expect(top).toBe(8); // 윗면 두 장 × 4 꼭짓점
    expect(layers.has(12) && layers.has(13) && layers.has(14)).toBe(true);
    // 다리: y 5~5+3/16 꼭짓점이 있고, 몸통 옆면 밑은 5+3/16 (바닥에서 떠 있다)
    let legVerts = 0;
    for (let i = 0; i < m.vertexCount; i++) if (Math.abs(m.positions[i * 3 + 1]! - 5) < 1e-6) legVerts++;
    expect(legVerts).toBe(48); // 다리마다 옆 4면 × 2 + 바닥 4 = 12, 다리 둘 × 반쪽 둘
    checkWinding(m);
    const withBed = greedyMesh(padded((x, y, z) => (y < 5 ? GRASS : x === 5 && y === 5 && z === 5 ? BED_FOOT_N : 0)), info).opaque!;
    const bare = greedyMesh(padded((_x, y) => (y < 5 ? GRASS : 0)), info).opaque!;
    expect(withBed.indexCount).toBe(bare.indexCount + 15 * 6);
  });
});

describe('텍스처 레이어 256 이상 (#202)', () => {
  it('레이어 300 이 meta 에 그대로 남는다 (8비트면 44 로 감겨 엉뚱한 그림이 나왔다 — 아빠 폰 물이 빨간 침대 무늬)', () => {
    const FAR = registry.numOf('far');
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? FAR : 0)), info).opaque!;
    expect(m.meta).toBeInstanceOf(Uint16Array);
    expect(m.vertexCount).toBe(24);
    for (let i = 0; i < m.vertexCount; i++) expect(m.meta[i * 4]).toBe(300);
  });
});

describe('표지판 (#197)', () => {
  it('기둥 + 판 = 상자 둘 12면, 판은 8/16~16/16 높이에 동서로 넓고 얇다', () => {
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? SIGN : 0)), info).opaque!;
    expect(m.indexCount / 6).toBe(12);
    const zs = new Set<number>();
    for (let i = 0; i < m.vertexCount; i++) {
      expect(m.meta[i * 4]).toBe(15);
      const y = m.positions[i * 3 + 1]!;
      if (y > 5.6) zs.add(Math.round(m.positions[i * 3 + 2]! * 16) / 16); // 판 꼭짓점의 z
    }
    expect([...zs].sort()).toEqual([5 + 7 / 16, 5 + 9 / 16]); // 판 두께 2/16 (앞뒤 1/16)
    checkWinding(m);
  });
});

describe('식탁 (2026-11-06)', () => {
  it('하나면 윗판 6면 + 다리 넷 × 5면 = 26면', () => {
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? TABLE : 0)), info).opaque!;
    expect(m.indexCount / 6).toBe(26);
    checkWinding(m);
  });
  it('둘을 붙이면 긴 식탁 하나 — 맞닿은 옆면 없고 다리는 바깥 모서리 넷만 (아빠가 보낸 그림)', () => {
    const m = greedyMesh(padded((x, y, z) => ((x === 5 || x === 6) && y === 5 && z === 5 ? TABLE : 0)), info).opaque!;
    expect(m.indexCount / 6).toBe(2 * 5 + 4 * 5); // 윗판마다 맞닿은 면 하나 빼고 5면, 다리 넷
    checkWinding(m);
  });
});

describe('모닥불 (#290)', () => {
  const one = (id: string) => greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? registry.numOf(id) : 0)), info).opaque!;
  const layersOf = (m: MeshBuffers) => {
    const count = new Map<number, number>();
    for (let v = 0; v < m.vertexCount; v += 4) count.set(m.meta[v * 4]!, (count.get(m.meta[v * 4]!) ?? 0) + 1);
    return count;
  };
  it('불붙은 모닥불: 통나무 넷 × 6면 + 불꽃 판 두 장(양면 4) = 28면. 자른 면은 통나무마다 둘, 높이는 반 칸', () => {
    const m = one('campfire');
    expect(m.indexCount / 6).toBe(28);
    const layers = layersOf(m);
    expect(layers.get(20)).toBe(16); // 껍질
    expect(layers.get(21)).toBe(8); // 자른 면
    expect(layers.get(22)).toBe(4); // 불꽃
    let top = 0;
    for (let v = 0; v < m.vertexCount; v++) if (m.meta[v * 4] !== 22) top = Math.max(top, m.positions[v * 3 + 1]!);
    expect(top).toBeCloseTo(5.5, 5);
  });
  it('꺼진 모닥불: 불꽃 없이 통나무만 24면', () => {
    const m = one('campfire_off');
    expect(m.indexCount / 6).toBe(24);
    expect(layersOf(m).has(22)).toBe(false);
  });
});

describe('횃불 (#82)', () => {
  /** 한 칸만 횃불, 나머지는 공기 */
  const oneTorch = (num: number) => greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? num : 0)), info).opaque!;

  it('바닥 횃불은 2/16 굵기 10/16 높이 막대 (상자 여섯 면)', () => {
    const m = oneTorch(TORCH);
    expect(m.indexCount / 6).toBe(6); // 면 6개
    const xs: number[] = [],
      ys: number[] = [],
      zs: number[] = [];
    for (let i = 0; i < m.vertexCount; i++) {
      xs.push(m.positions[i * 3]!);
      ys.push(m.positions[i * 3 + 1]!);
      zs.push(m.positions[i * 3 + 2]!);
    }
    expect(Math.min(...xs)).toBeCloseTo(5 + 7 / 16);
    expect(Math.max(...xs)).toBeCloseTo(5 + 9 / 16);
    expect(Math.min(...zs)).toBeCloseTo(5 + 7 / 16);
    expect(Math.max(...zs)).toBeCloseTo(5 + 9 / 16);
    expect(Math.min(...ys)).toBeCloseTo(5);
    expect(Math.max(...ys)).toBeCloseTo(5 + 10 / 16);
  });

  it('벽 횃불은 벽 쪽에 붙어 반대쪽으로 기운다 (윗끝이 아랫끝보다 벽에서 멀다)', () => {
    const m = oneTorch(TORCH_WALL_N); // 북(-z) 벽에 붙음 → 남(+z)으로 기운다
    expect(m.indexCount / 6).toBe(6);
    let lowZ = 0,
      lowN = 0,
      highZ = 0,
      highN = 0;
    let minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i < m.vertexCount; i++) {
      const y = m.positions[i * 3 + 1]!;
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    for (let i = 0; i < m.vertexCount; i++) {
      const y = m.positions[i * 3 + 1]!;
      const z = m.positions[i * 3 + 2]!;
      if (y < minY + 0.01) {
        lowZ += z;
        lowN++;
      }
      if (y > maxY - 0.01) {
        highZ += z;
        highN++;
      }
    }
    const low = lowZ / lowN,
      high = highZ / highN;
    expect(high).toBeGreaterThan(low); // 남쪽(+z)으로 기울었다
    expect(minY).toBeGreaterThan(5); // 바닥에서 조금 띄워 벽에 붙는다
    expect(maxY - minY).toBeGreaterThan(0.4);
    expect(low).toBeLessThan(5.5); // 아랫끝은 북쪽 벽 가까이
  });

  it('횃불은 greedy 면(네모 덩어리)으로 그려지지 않는다', () => {
    const m = oneTorch(TORCH);
    // 꽉 찬 블록이면 면이 1×1 이라 x 폭이 1 이 된다 — 막대는 2/16
    let minX = Infinity,
      maxX = -Infinity;
    for (let i = 0; i < m.vertexCount; i++) {
      minX = Math.min(minX, m.positions[i * 3]!);
      maxX = Math.max(maxX, m.positions[i * 3]!);
    }
    expect(maxX - minX).toBeCloseTo(2 / 16);
  });
});

describe('드래곤 알 (#85)', () => {
  /** 한 칸만 알, 나머지는 공기 */
  const oneEgg = () => greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? EGG : 0)), info).opaque!;
  const span = (m: MeshBuffers, axis: number, pick: (y: number) => boolean) => {
    let lo = Infinity,
      hi = -Infinity;
    for (let i = 0; i < m.vertexCount; i++) {
      if (!pick(m.positions[i * 3 + 1]!)) continue;
      const v = m.positions[i * 3 + axis]!;
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    return [lo, hi];
  };

  it('네모가 아니라 위로 갈수록 좁아지는 상자 여섯 층', () => {
    const m = oneEgg();
    expect(m.indexCount / 6).toBe(31); // 옆면 24 + 층끼리 안 가려지는 위·아래 7
    const [minY, maxY] = span(m, 1, () => true);
    expect(minY).toBeCloseTo(5); // 바닥에 딱 붙고
    expect(maxY).toBeCloseTo(6); // 한 칸을 꽉 채운다
    const [minX, maxX] = span(m, 0, () => true);
    expect(minX).toBeCloseTo(5 + 2 / 16); // 가장 배부른 곳은 2/16 ~ 14/16
    expect(maxX).toBeCloseTo(5 + 14 / 16);
    const [topLo, topHi] = span(m, 0, (y) => y > 6 - 0.001); // 꼭대기는 6/16 ~ 10/16
    expect(topLo).toBeCloseTo(5 + 6 / 16);
    expect(topHi).toBeCloseTo(5 + 10 / 16);
  });

  it('알은 greedy 면(네모 덩어리)으로 그려지지 않는다', () => {
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? EGG : 0)), info).opaque!;
    // 꽉 찬 블록이면 옆면 하나가 1×1 이라 어느 면이든 x 폭 1 짜리가 나온다
    let widest = 0;
    for (let q = 0; q < m.vertexCount; q += 4) {
      let lo = Infinity,
        hi = -Infinity;
      for (let i = q; i < q + 4; i++) {
        lo = Math.min(lo, m.positions[i * 3]!);
        hi = Math.max(hi, m.positions[i * 3]!);
      }
      widest = Math.max(widest, hi - lo);
    }
    expect(widest).toBeCloseTo(12 / 16);
  });
});

describe('이어지는 유리 (아빠 2026-11-09 "유리끼리 맞닿은 쪽은 경계선을 안 보이게")', () => {
  const layersOf = (b: MeshBuffers, face: number, pick: (i: number) => boolean) => {
    const out = new Set<number>();
    for (let i = 0; i < b.vertexCount; i++) if (b.meta[i * 4 + 2] === face && pick(i)) out.add(b.meta[i * 4]!);
    return [...out];
  };
  it('위아래로 쌓은 유리 둘: 옆면은 맞닿은 쪽(v+ / v−) 테두리를 지운 그림, 맨 위·맨 아래는 기본 그림, 사이 면은 없다', () => {
    const r = greedyMesh(
      padded((x, y, z) => (x === 5 && z === 5 && (y === 5 || y === 6) ? GLASS : 0)),
      info,
    );
    const b = r.opaque!;
    expect(quadCount(b)).toBe(10); // 6 + 6 − 사이 2
    for (const face of [0, 1, 4, 5]) {
      // 아래 블록 옆면(y 5..6)은 위가 이어짐(비트 3 = 8), 위 블록 옆면(y 6..7)은 아래가 이어짐(비트 2 = 4). 사각형마다 네 꼭짓점의 가장 낮은 y 로 가른다
      const lo = new Set<number>(),
        hi = new Set<number>();
      for (let qd = 0; qd < b.vertexCount / 4; qd++) {
        if (b.meta[qd * 16 + 2] !== face) continue;
        let minY = Infinity;
        for (let c = 0; c < 4; c++) minY = Math.min(minY, b.positions[(qd * 4 + c) * 3 + 1]!);
        (minY === 5 ? lo : hi).add(b.meta[qd * 16]!);
      }
      expect(lo).toEqual(new Set([108]));
      expect(hi).toEqual(new Set([104]));
    }
    expect(layersOf(b, 2, () => true)).toEqual([5]); // 윗면 기본
    expect(layersOf(b, 3, () => true)).toEqual([5]); // 아랫면 기본
  });
  it('3×3 유리 벽: 가운데 칸 앞뒤 면은 테두리가 하나도 없고(255), 모서리 칸은 안쪽 두 변 + 대각선만 이어진다 — U 축이 반대인 뒷면은 비트도 반대', () => {
    const r = greedyMesh(
      padded((x, y, z) => (z === 5 && x >= 4 && x <= 6 && y >= 4 && y <= 6 ? GLASS : 0)),
      info,
    );
    const b = r.opaque!;
    const at = (x0: number, y0: number) => (i: number) => {
      const x = b.positions[i * 3]!,
        y = b.positions[i * 3 + 1]!;
      return x >= x0 && x <= x0 + 1 && y >= y0 && y <= y0 + 1;
    };
    // 가운데 (5,5): 여덟 이웃 전부 → 255
    expect(layersOf(b, 4, at(5, 5))).toContain(355);
    expect(layersOf(b, 5, at(5, 5))).toContain(355);
    // 모서리 (4,4): +Z 면(U=+x, V=+y)은 u+·v+·(u+,v+) = 2+8+64 = 74, −Z 면(U=−x)은 u−·v+·(u−,v+) = 1+8+128 = 137
    const cornerFront = layersOf(b, 4, (i) => b.positions[i * 3]! <= 4.5 && b.positions[i * 3 + 1]! <= 4.5);
    const cornerBack = layersOf(b, 5, (i) => b.positions[i * 3]! <= 4.5 && b.positions[i * 3 + 1]! <= 4.5);
    expect(cornerFront).toContain(174);
    expect(cornerBack).toContain(237);
    // 맨 윗줄 세 칸의 윗면(U=+x)도 옆 칸과 이어진다: 왼쪽 끝 u+ 만(2), 가운데 u−·u+(3), 오른쪽 끝 u− 만(1)
    expect(new Set(layersOf(b, 2, () => true))).toEqual(new Set([101, 102, 103]));
  });
});

describe('계단 (#291)', () => {
  const OAK = registry.numOf('oak_stairs');
  const mesh = (cells: Record<string, number>) => greedyMesh(padded((x, y, z) => cells[`${x},${y},${z}`] ?? 0), info).opaque!;
  /** 법선 방향(면 번호)별 넓이 합 */
  const areas = (m: MeshBuffers) => {
    const out = [0, 0, 0, 0, 0, 0];
    for (let q = 0; q < m.vertexCount; q += 4) {
      const p = (i: number) => [m.positions[(q + i) * 3]!, m.positions[(q + i) * 3 + 1]!, m.positions[(q + i) * 3 + 2]!];
      const a = p(0),
        b = p(1),
        c = p(3);
      const e1 = [b[0]! - a[0]!, b[1]! - a[1]!, b[2]! - a[2]!],
        e2 = [c[0]! - a[0]!, c[1]! - a[1]!, c[2]! - a[2]!];
      out[m.meta[q * 4 + 2]!]! += Math.hypot(e1[1]! * e2[2]! - e1[2]! * e2[1]!, e1[2]! * e2[0]! - e1[0]! * e2[2]!, e1[0]! * e2[1]! - e1[1]! * e2[0]!);
    }
    return out;
  };
  it('곧은 계단 하나: 면 10장. 윗면 넓이 1(디딤판 둘), 높은 쪽 옆면 1, 낮은 쪽 옆면 1(챌판 + 앞면), 양옆 ㄴ자 0.75', () => {
    const m = mesh({ '5,5,5': OAK }); // 북쪽(−z)이 높다
    expect(m.indexCount / 6).toBe(10);
    const a = areas(m);
    expect(a[2]).toBeCloseTo(1, 5); // +Y
    expect(a[3]).toBeCloseTo(1, 5); // −Y
    expect(a[5]).toBeCloseTo(1, 5); // −Z (높은 쪽, 꽉 찬 면)
    expect(a[4]).toBeCloseTo(1, 5); // +Z (챌판 반 + 앞면 반)
    expect(a[0]).toBeCloseTo(0.75, 5);
    expect(a[1]).toBeCloseTo(0.75, 5);
    // 윗 디딤판은 y 6 의 북쪽 반, 아래 디딤판은 y 5.5 의 남쪽 반
    let hi = 0,
      lo = 0;
    for (let q = 0; q < m.vertexCount; q += 4)
      if (m.meta[q * 4 + 2] === 2) {
        const y = m.positions[q * 3 + 1]!;
        if (Math.abs(y - 6) < 1e-6) hi++;
        else if (Math.abs(y - 5.5) < 1e-6) lo++;
      }
    expect([hi, lo]).toEqual([1, 1]);
  });
  it('뒤집힌 계단은 위가 꽉 찬 면', () => {
    const m = mesh({ '5,5,5': registry.stairVariant(OAK, 0, true) });
    expect(m.indexCount / 6).toBe(10);
    let full = 0;
    for (let q = 0; q < m.vertexCount; q += 4) if (m.meta[q * 4 + 2] === 2 && Math.abs(m.positions[q * 3 + 1]! - 6) < 1e-6) full++;
    expect(full).toBe(1);
    expect(areas(m)[3]).toBeCloseTo(1, 5); // 아래는 반 칸 높이의 면 + 바닥 쪽 반
  });
  it('모서리: 앞에 옆으로 돌아선 계단이 있으면 바깥 모서리(위 조각 하나), 뒤에 있으면 안쪽 모서리(셋)', () => {
    const WEST = registry.stairVariant(OAK, 3, false);
    // 위층(y 5.5~6)의 윗면 넓이 = 위 조각 수 × 0.25
    const topArea = (m: MeshBuffers, x0: number) => {
      let s = 0;
      for (let q = 0; q < m.vertexCount; q += 4) {
        if (m.meta[q * 4 + 2] !== 2 || Math.abs(m.positions[q * 3 + 1]! - 6) > 1e-6) continue;
        const xs = [0, 1, 2, 3].map((i) => m.positions[(q + i) * 3]!),
          zs = [0, 1, 2, 3].map((i) => m.positions[(q + i) * 3 + 2]!);
        if (Math.min(...xs) < x0 || Math.max(...xs) > x0 + 1) continue;
        s += (Math.max(...xs) - Math.min(...xs)) * (Math.max(...zs) - Math.min(...zs));
      }
      return s;
    };
    const outer = mesh({ '5,5,5': OAK, '5,5,4': WEST }); // 북쪽을 보는 계단의 앞(북)에 서쪽을 보는 계단
    expect(topArea(outer, 5) - 0.5).toBeCloseTo(0.25, 5); // (5,5,5) 의 위 조각 하나 + (5,5,4) 의 둘 = 0.75 → 내 것 0.25
    const inner = mesh({ '5,5,5': OAK, '5,5,6': WEST }); // 뒤(남)에 있으면
    expect(topArea(inner, 5) - 0.5).toBeCloseTo(0.75, 5);
  });
  it('옆 칸이 불투명 블록이면 그쪽 가장자리 면은 안 그린다', () => {
    const STONE = registry.numOf('stone');
    const m = greedyMesh(padded((x, y, z) => (x === 5 && y === 5 && z === 5 ? OAK : x === 5 && y === 4 && z === 5 ? STONE : 0)), info).opaque!;
    let below = 0;
    for (let q = 0; q < m.vertexCount; q += 4) if (m.meta[q * 4 + 2] === 3 && Math.abs(m.positions[q * 3 + 1]! - 5) < 1e-6) below++;
    expect(below).toBe(0); // 계단 아랫면 없음 (돌 윗면은 계단이 불투명이 아니라 그대로 있다)
  });
});
