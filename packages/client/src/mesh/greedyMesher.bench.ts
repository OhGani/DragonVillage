/**
 * 메싱 속도 벤치. 실행: pnpm exec vitest bench --run
 * 목표(ARCHITECTURE.md): 청크 1개 < 4ms (워커).
 */
import { PADDED_VOLUME, paddedIndex, parseBlocks } from '@dragon-village/shared';
import { bench, describe } from 'vitest';
import { buildMeshBlockInfo } from './blockInfo';
import { greedyMesh } from './greedyMesher';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'dirt', name: '흙', hardness: 1, texture: 'dirt' },
    { id: 'grass', name: '잔디', hardness: 1, textureTop: 'grass_top', textureSide: 'grass_side', textureBottom: 'dirt' },
    { id: 'leaves', name: '잎', hardness: 1, transparent: true, texture: 'leaves' },
  ],
});
const info = buildMeshBlockInfo(
  registry,
  new Map([
    ['missing', 0],
    ['stone', 1],
    ['dirt', 2],
    ['grass_top', 3],
    ['grass_side', 4],
    ['leaves', 5],
  ]),
);
const STONE = registry.numOf('stone'),
  DIRT = registry.numOf('dirt'),
  GRASS = registry.numOf('grass'),
  LEAVES = registry.numOf('leaves');

function padded(fill: (x: number, y: number, z: number) => number): Uint16Array {
  const arr = new Uint16Array(PADDED_VOLUME);
  for (let y = -1; y <= 16; y++) for (let z = -1; z <= 16; z++) for (let x = -1; x <= 16; x++) arr[paddedIndex(x, y, z)] = fill(x, y, z);
  return arr;
}

// 지표면 청크: 언덕 + 흙층 + 나뭇잎 덩어리 (실제 게임과 비슷한 밀도)
const surface = padded((x, y, z) => {
  const h = 6 + Math.round(3 * Math.sin(x / 3) * Math.cos(z / 4));
  if (y < h - 3) return STONE;
  if (y < h) return DIRT;
  if (y === h) return GRASS;
  if (y > h + 2 && y < h + 6 && ((x * 7 + z * 13 + y) & 3) === 0) return LEAVES;
  return 0;
});
// 최악: 체커보드 (병합 불가, 면 최다)
const checker = padded((x, y, z) => ((x + y + z) & 1 ? STONE : 0));
// 꽉 찬 청크 (내부 면 없음, 겉면 6개)
const full = padded(() => STONE);
// 빛: 위는 하늘 15, 아래로 갈수록 어둡고 한쪽 구석에 광원 — 병합이 실제처럼 갈라지도록
const light = new Uint8Array(PADDED_VOLUME);
for (let y = -1; y <= 16; y++)
  for (let z = -1; z <= 16; z++)
    for (let x = -1; x <= 16; x++) {
      const sky = Math.max(0, Math.min(15, y + 4));
      const blk = Math.max(0, 14 - Math.abs(x - 3) - Math.abs(y - 8) - Math.abs(z - 3));
      light[paddedIndex(x, y, z)] = (sky << 4) | blk;
    }

describe('greedyMesh', () => {
  bench('지표면 청크', () => {
    greedyMesh(surface, info, light);
  });
  bench('지표면 청크 (빛 없이)', () => {
    greedyMesh(surface, info);
  });
  bench('체커보드 (최악)', () => {
    greedyMesh(checker, info, light);
  });
  bench('꽉 찬 청크', () => {
    greedyMesh(full, info, light);
  });
});
