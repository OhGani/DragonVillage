/**
 * 원정지 생성기 고르기 (M7-3). `expeditions.json generator` 이름 → 생성기. 서버(Expedition)와 클라(buildWorld)가 같은 함수를 부른다.
 * 여섯 곳 모두 있다 — 사막(desert) v1.1-1 (#157), 설원(snow) v1.1-2 (#160), 네더(nether) v1.1-3 (#161), 엔드(end) v1.1-4 (#162). 모르는 이름이면 hasGenerator 가 false → 서버는 NOT_YET.
 * 아들 보스 설계의 셋을 앞당김 (2026-11-05): 어두운 숲(dark_forest, 소환사 #252), 정글(jungle, 거대 고릴라 #253), 깊은 어둠(deep_dark, 거대 워든 #254).
 */
import type { VoxelWorld } from '../chunk/world';
import type { BlockRegistry } from '../rules/blocks';
import type { ExpeditionDef } from '../rules/expeditions';
import { CAVE_GEN_VERSION, generateCave } from './cave';
import { DESERT_GEN_VERSION, generateDesert } from './desert';
import { END_GEN_VERSION, generateEnd } from './end';
import { NETHER_GEN_VERSION, generateNether } from './nether';
import { SNOW_GEN_VERSION, generateSnow } from './snow';
import { ISLAND_GEN_VERSION, generateIsland } from './island';
import { DARK_FOREST_GEN_VERSION, generateDarkForest } from './darkForest';
import { JUNGLE_GEN_VERSION, generateJungle } from './jungle';
import { DEEP_DARK_GEN_VERSION, generateDeepDark } from './deepDark';
import { OCEAN_GEN_VERSION, generateOcean } from './ocean';
import { SWAMP_GEN_VERSION, generateSwamp } from './swamp';
import { CASTLE_GEN_VERSION, generateAncientCastle } from './ancientCastle';
import type { MobKind } from '../rules/mobs';
import type { SpawnPoint } from './village';

export interface ExpeditionWorld {
  world: VoxelWorld;
  spawn: SpawnPoint;
  /** 흑요석 문틀 아래 가운데 (귀환 판정) */
  portal: { x: number; y: number; z: number };
  /** 보물 상자 자리 */
  treasures: { x: number; y: number; z: number }[];
  /** 보스 자리 (동굴의 거미 왕 굴 바닥 가운데, 엔드의 기반암 분수 꼭대기). 없으면 null. 어떤 보스인지는 expeditions.json boss.id */
  den: { x: number; y: number; z: number } | null;
  /** 시작부터 서 있는 몹 (#223 설원 눈 골렘). 보통은 빈 목록. rank(0~1)가 있으면 서버가 사람 수만큼 줄인다 (고대성, 2026-11-06) */
  spawns: { kind: MobKind; x: number; y: number; z: number; rank?: number }[];
  /** 함께 싸우는 보스 여럿 (고대성 네 왕, 2026-11-06). den 보스와 같이 잠들었다 같이 깬다. 없으면 빈 목록 */
  kings?: { kind: MobKind; x: number; y: number; z: number }[];
  /** 엔드 수정 자리 (#224): 남아 있는 만큼 엔더 드래곤이 회복한다 */
  crystals: { x: number; y: number; z: number }[];
  genVersion: number;
  ms: number;
}

const GENERATORS: Record<string, (registry: BlockRegistry, seed: number, treasures: number) => ExpeditionWorld> = {
  island: (registry, seed, treasures) => {
    const g = generateIsland(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, spawns: [], crystals: [], genVersion: ISLAND_GEN_VERSION, ms: g.ms };
  },
  cave: (registry, seed, treasures) => {
    const g = generateCave(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: [], crystals: [], genVersion: CAVE_GEN_VERSION, ms: g.ms };
  },
  desert: (registry, seed, treasures) => {
    const g = generateDesert(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, spawns: g.layout.villagers.map((p) => ({ kind: 'villager' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: DESERT_GEN_VERSION, ms: g.ms };
  },
  snow: (registry, seed, treasures) => {
    const g = generateSnow(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, spawns: g.layout.golems.map((p) => ({ kind: 'snow_golem' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: SNOW_GEN_VERSION, ms: g.ms };
  },
  nether: (registry, seed, treasures) => {
    const g = generateNether(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: null, spawns: [], crystals: [], genVersion: NETHER_GEN_VERSION, ms: g.ms };
  },
  end: (registry, seed, treasures) => {
    const g = generateEnd(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: [], crystals: g.layout.crystals, genVersion: END_GEN_VERSION, ms: g.ms };
  },
  // 어두운 숲 (#252): 대저택 2층의 소환사가 보스, 1층은 변명자 셋이 지킨다
  dark_forest: (registry, seed, treasures) => {
    const g = generateDarkForest(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: g.layout.guards.map((p) => ({ kind: 'vindicator' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: DARK_FOREST_GEN_VERSION, ms: g.ms };
  },
  // 정글 (#253): 궁궐 왕좌 앞의 거대 고릴라가 보스, 문 앞에 고릴라 둘
  jungle: (registry, seed, treasures) => {
    const g = generateJungle(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: g.layout.guards.map((p) => ({ kind: 'gorilla' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: JUNGLE_GEN_VERSION, ms: g.ms };
  },
  // 깊은 어둠 (#254): 고대 도시 워든의 문 앞 거대 워든이 보스, 문 양옆에 워든 둘
  // 바다 신전 (2026-11-06): 가운데 방의 엘더 가디언이 보스, 복도 구석에 가디언 넷
  ocean: (registry, seed, treasures) => {
    const g = generateOcean(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: g.layout.guards.map((p) => ({ kind: 'guardian' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: OCEAN_GEN_VERSION, ms: g.ms };
  },
  // 늪 (2026-11-06): 슬라임 웅덩이의 큰 슬라임이 보스, 웅덩이에 슬라임 넷, 마녀 오두막 앞에 마녀 둘
  swamp: (registry, seed, treasures) => {
    const g = generateSwamp(registry, seed, treasures);
    const spawns = [...g.layout.slimes.map((p) => ({ kind: 'slime' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), ...g.layout.witches.map((p) => ({ kind: 'witch' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 }))];
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns, crystals: [], genVersion: SWAMP_GEN_VERSION, ms: g.ms };
  },
  // 고대성 (아들 보스 설계, 2026-11-06): 방 넷의 몹(rank 로 사람 수만큼) + 최종 방 네 왕(한 번에)
  ancient_castle: (registry, seed, treasures) => {
    const g = generateAncientCastle(registry, seed, treasures);
    return {
      world: g.world,
      spawn: g.spawn,
      portal: g.layout.portal,
      treasures: g.layout.treasures,
      den: null,
      spawns: g.layout.mobs.map((m) => ({ kind: m.kind, x: m.x + 0.5, y: m.y, z: m.z + 0.5, rank: m.rank })),
      kings: g.layout.kings.map((k) => ({ kind: k.kind, x: k.x + 0.5, y: k.y, z: k.z + 0.5 })),
      crystals: [],
      genVersion: CASTLE_GEN_VERSION,
      ms: g.ms,
    };
  },
  deep_dark: (registry, seed, treasures) => {
    const g = generateDeepDark(registry, seed, treasures);
    return { world: g.world, spawn: g.spawn, portal: g.layout.portal, treasures: g.layout.treasures, den: g.layout.den, spawns: g.layout.guards.map((p) => ({ kind: 'warden' as const, x: p.x + 0.5, y: p.y, z: p.z + 0.5 })), crystals: [], genVersion: DEEP_DARK_GEN_VERSION, ms: g.ms };
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
