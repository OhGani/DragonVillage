/**
 * 드래곤 복셀 모델 (M6-3): `models/dragon-voxels.js` 생성기(아들 스케치 기반, 16종 × 아기·어른)를 그대로 쓴다.
 * 생성기는 UMD 라서 ES 모듈로 불러오면 `self.DragonVoxels` 에 붙는다. 여기서 타입을 씌우고 결과를 캐시한다.
 */
import '../../../../models/dragon-voxels.js';
import type { Voxel } from './voxelGeometry';

export type DragonStage = 'baby' | 'adult';

interface DragonVoxelsApi {
  DRAGONS: Record<string, { id: string; colors: Record<string, string> }>;
  build(params: unknown, stage: DragonStage): Voxel[];
  ids: string[];
}

const api = (globalThis as unknown as { DragonVoxels?: DragonVoxelsApi }).DragonVoxels;
const cache = new Map<string, Voxel[]>();

/** 모델이 없는 드래곤은 나무 드래곤 골격으로 (아들 그림이 오면 생성기에 추가) */
export function dragonVoxels(dragonId: string, stage: DragonStage): Voxel[] {
  const key = `${dragonId}/${stage}`;
  let v = cache.get(key);
  if (!v) {
    const params = api?.DRAGONS[dragonId] ?? api?.DRAGONS['wood'];
    v = api && params ? api.build(params, stage) : [];
    cache.set(key, v);
  }
  return v;
}

export function hasDragonModel(dragonId: string): boolean {
  return !!api?.DRAGONS[dragonId];
}
