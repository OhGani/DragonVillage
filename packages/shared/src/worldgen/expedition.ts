/**
 * 원정지 생성기 고르기 (M7-3). `expeditions.json generator` 이름 → 생성기. 서버(Expedition)와 클라(buildWorld)가 같은 함수를 부른다.
 * 아직 없는 생성기(nether·end)는 hasGenerator 가 false — 출발 카드에 안 나오고 서버는 NOT_YET. 사막(desert)은 v1.1-1 (#157), 설원(snow)은 v1.1-2 (#160).
 */
import type { VoxelWorld } from '../chunk/world';
import type { BlockRegistry } from '../rules/blocks';
import type { ExpeditionDef } from '../rules/expeditions';
import { CAVE_GEN_VERSION, generateCave } from './cave';
import { DESERT_GEN_VERSION, generateDesert } from './desert';
import { SNOW_GEN_VERSION, generateSnow } from './snow';
import { ISLAND_GEN_VERSION, generateIsland } from './island';
import type { SpawnPoint } from './village';

export interface ExpeditionWorld {
  world: VoxelWorld;
  spawn: SpawnPoint;
  /** 흑요석 문틀 아래 가운데 (귀환 판정) */
  portal: { x: number; y: number; z: number };
  /** 보물 상자 자리 */
  treasures: { x: number; y: number; z: number }[];
  /** 보스 굴 바닥 가운데 (동굴의 거미 왕 굴). 없으면 null */
  den: { x: number; y: number; z: number } | null;
  genVersion: number;
  ms: number;
}

const GENERATORS: Record<string, (registry: BlockRegistry, seed: number, treasures: number) => ExpeditionWorld> = {
  island: (registry, seed, treasures) => {
    const g = generateIsland(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, genVersion: ISLAND_GEN_VERSION, ms: g.ms };
  },
  cave: (registry, seed, treasures) => {
    const g = generateCave(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, genVersion: CAVE_GEN_VERSION, ms: g.ms };
  },
  desert: (registry, seed, treasures) => {
    const g = generateDesert(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, genVersion: DESERT_GEN_VERSION, ms: g.ms };
  },
  snow: (registry, seed, treasures) => {
    const g = generateSnow(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, genVersion: SNOW_GEN_VERSION, ms: g.ms };
  },
};

export function hasGenerator(name: string): boolean {
  return Object.hasOwn(GENERATORS, name);
}

export function generateExpedition(def: Pick<ExpeditionDef, 'generator' | 'treasures'>, registry: BlockRegistry, seed: number): ExpeditionWorld {
  const gen = GENERATORS[def.generator];
  if (!gen) throw new Error(`원정지 생성기 '${def.generator}' 는 아직 없어요`);
  return gen(registry, seed, def.treasures);
}
