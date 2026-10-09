/**
 * 엔드 생성기 — 마지막 원정지 (256×256×96 = 16×16×6 청크, v1.1-4). 포탈 5단계를 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 엔드 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 항상 어둑하다(expeditions.json nightStartsAt 0) — 엔더맨이 처음부터 나온다. 빛은 기둥 꼭대기 발광석·가져간 횃불.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동).
 *   - 엔드 돌 섬 하나가 SURFACE_Y = 50 높이에 떠 있다(반지름 ~72, 가장자리 울퉁불퉁, 가운데는 두껍고 가장자리는 얇다).
 *     섬 밖은 허공 — 떨어지면 저 아래 기반암(y 0)까지. 떨어져 죽으면 포탈에서 다시 일어난다.
 *   - 가운데 **기반암 분수**(5×5 → 3×3, 높이 5): 그 꼭대기가 엔더 드래곤의 자리(den). 드래곤은 그 위 7칸에 떠서 기다린다.
 *   - **흑요석 기둥 8개**: 가운데서 36칸 둘레, 높이 16~34, 3×3, 꼭대기 발광석.
 *   - 도착 포탈: 섬 남쪽(가운데서 52칸) 조약돌 단 + 흑요석 문틀. 스폰은 문틀 남쪽. 드래곤까지 걸어가며 마음을 먹는다.
 *   - **엔드 시티**(아들 3차 "엔드 시티"): 섬 북쪽(가운데서 48칸) 석영 탑 9×9×9, 남쪽 문 옆에 양조기, 안쪽 뒤 구석에 상자 2.
 *     셜커·겉날개는 v1.1 뒤.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const END_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const END_GEN_VERSION = 1;
/** 섬 윗면 높이 */
export const SURFACE_Y = 50;
/** 섬 반지름 */
export const ISLAND_R = 72;
export const PILLAR_COUNT = 8;
export const PILLAR_R = 36;
/** 도착 포탈·엔드 시티가 가운데서 떨어진 거리 */
export const PORTAL_DIST = 52;
export const CITY_DIST = 48;

const SIZE = END_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = END_BOUNDS.sizeCY * CHUNK_SIZE; // 96
const CENTER = SIZE / 2; // 128

export interface EndLayout extends IslandLayout {
  /** 엔더 드래곤 자리 (기반암 분수 꼭대기) */
  den: { x: number; y: number; z: number };
  /** 흑요석 기둥 발 자리와 높이 */
  pillars: { x: number; z: number; h: number }[];
  /** 엔드 시티 탑 가운데(바닥 높이) */
  city: { x: number; y: number; z: number };
}

export interface EndResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: EndLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateEnd(registry: BlockRegistry, seed: number, treasures = 2): EndResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    endStone = B('end_stone'),
    cobble = B('cobblestone'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    quartz = B('quartz_block'),
    glass = B('glass'),
    chest = B('chest'),
    brewing = B('brewing_stand'),
    torch = B('torch');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const edgeN = n2(51),
    topN = n2(52),
    botN = n2(53);

  // ---- 섬: 가운데서 멀어질수록 얇아지고, 반지름 밖은 허공 ----
  const tops = new Int16Array(SIZE * SIZE);
  const bots = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++)
    for (let x = 0; x < SIZE; x++) {
      const dx = x - CENTER,
        dz = z - CENTER;
      const dist = Math.hypot(dx, dz);
      const ang = Math.atan2(dz, dx);
      const r = ISLAND_R + 8 * edgeN(Math.cos(ang) * 1.6, Math.sin(ang) * 1.6) + 3 * edgeN(x / 23, z / 23);
      if (dist > r) {
        tops[z * SIZE + x] = -1;
        bots[z * SIZE + x] = -1;
        continue;
      }
      const inland = 1 - smoothstep(r - 24, r, dist);
      const top = Math.round(SURFACE_Y + 2 * topN(x / 29, z / 29) * inland);
      const thick = 3 + 16 * inland + 5 * Math.max(0, botN(x / 31, z / 31));
      tops[z * SIZE + x] = Math.min(HEIGHT - 20, top);
      bots[z * SIZE + x] = Math.max(2, Math.round(top - thick));
    }
  const topAt = (x: number, z: number) => (x < 0 || z < 0 || x >= SIZE || z >= SIZE ? -1 : tops[z * SIZE + x]!);

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(END_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  for (let cz = 0; cz < END_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < END_BOUNDS.sizeCX; cx++) {
      for (let cy = 0; cy < END_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const T = tops[z * SIZE + x]!;
            const Bt = bots[z * SIZE + x]!;
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0) id = bedrock;
              else if (T >= 0 && y >= Bt && y <= T) id = endStone;
              if (id !== AIR_ID) {
                ids[localIndex(lx, ly, lz)] = id;
                nonAir++;
              }
            }
          }
        }
        if (nonAir > 0) world.getOrCreateChunk(cx, cy, cz).loadBlockIds(ids);
      }
    }
  }

  const set = (x: number, y: number, z: number, id: number) => {
    if (x >= 0 && z >= 0 && x < SIZE && z < SIZE && y >= 0 && y < HEIGHT) world.setBlock(x, y, z, id);
  };
  /** 자리를 평평하게 (사막·설원·네더와 같은 방식). 섬 밖(허공)은 엔드 돌로 받친다 */
  const terrace = (cx: number, cz: number, half: number, blend = 8): number => {
    const lvl = topAt(cx, cz) >= 0 ? topAt(cx, cz) : SURFACE_Y;
    for (let dx = -half - blend; dx <= half + blend; dx++)
      for (let dz = -half - blend; dz <= half + blend; dz++) {
        const x = cx + dx,
          z = cz + dz;
        if (x < 0 || z < 0 || x >= SIZE || z >= SIZE) continue;
        const h = tops[z * SIZE + x]!;
        const d = Math.max(Math.abs(dx), Math.abs(dz));
        const t = d <= half ? 0 : (d - half) / blend;
        if (h < 0) {
          if (d > half) continue; // 허공은 발자국 안만 받친다
          for (let y = lvl - 4; y <= lvl; y++) set(x, y, z, endStone);
          tops[z * SIZE + x] = lvl;
          continue;
        }
        const target = Math.round(lvl + (h - lvl) * t);
        if (target === h) continue;
        if (target < h) for (let y = target + 1; y <= h; y++) set(x, y, z, AIR_ID);
        else for (let y = h + 1; y <= target; y++) set(x, y, z, endStone);
        tops[z * SIZE + x] = target;
      }
    return lvl;
  };

  // ---- 기반암 분수 (드래곤 자리) ----
  const C = terrace(CENTER, CENTER, 4, 8);
  for (let dx = -2; dx <= 2; dx++)
    for (let dz = -2; dz <= 2; dz++) {
      for (let y = C + 1; y <= C + 3; y++) set(CENTER + dx, y, CENTER + dz, bedrock);
      if (Math.abs(dx) <= 1 && Math.abs(dz) <= 1) set(CENTER + dx, C + 4, CENTER + dz, bedrock);
    }
  const den = { x: CENTER, y: C + 5, z: CENTER };

  // ---- 흑요석 기둥 8개 ----
  const pillars: EndLayout['pillars'] = [];
  for (let i = 0; i < PILLAR_COUNT; i++) {
    const a = (i / PILLAR_COUNT) * Math.PI * 2 + 0.2;
    const px = Math.round(CENTER + Math.cos(a) * PILLAR_R),
      pz = Math.round(CENTER + Math.sin(a) * PILLAR_R);
    const base = terrace(px, pz, 2, 4);
    const h = 16 + ((i * 5 + (seed % 7)) % 19);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let y = base + 1; y <= base + h; y++) set(px + dx, y, pz + dz, obsidian);
    set(px, base + h + 1, pz, glowstone);
    pillars.push({ x: px, z: pz, h });
  }

  // ---- 도착 포탈 (남쪽) ----
  const PX = CENTER,
    PZ = CENTER + PORTAL_DIST;
  const PY = terrace(PX, PZ, 6, 8);
  const portal = { x: PX, y: PY + 1, z: PZ };
  for (let x = PX - 4; x <= PX + 3; x++)
    for (let z = PZ - 3; z <= PZ + 3; z++) {
      const corner = (x === PX - 4 || x === PX + 3) && (z === PZ - 3 || z === PZ + 3);
      set(x, PY, z, corner ? glowstone : cobble);
    }
  for (let x = portal.x - 2; x <= portal.x + 1; x++) {
    set(x, portal.y, portal.z, obsidian);
    set(x, portal.y + 4, portal.z, obsidian);
  }
  for (let y = portal.y + 1; y <= portal.y + 3; y++) {
    set(portal.x - 2, y, portal.z, obsidian);
    set(portal.x + 1, y, portal.z, obsidian);
  }

  // ---- 엔드 시티 탑 (북쪽): 석영 벽 9×9, 높이 8, 유리 띠, 남쪽 문, 양조기, 상자 ----
  const KX = CENTER,
    KZ = CENTER - CITY_DIST;
  const floor = terrace(KX, KZ, 6, 8);
  const treasureChests: IslandLayout['treasures'] = [];
  for (let dx = -4; dx <= 4; dx++)
    for (let dz = -4; dz <= 4; dz++) {
      const x = KX + dx,
        z = KZ + dz;
      set(x, floor, z, endStone);
      const wall = Math.abs(dx) === 4 || Math.abs(dz) === 4;
      for (let y = floor + 1; y <= floor + 8; y++) {
        const door = dz === 4 && Math.abs(dx) <= 1 && y <= floor + 2;
        const window = wall && y === floor + 5 && !(Math.abs(dx) === 4 && Math.abs(dz) === 4);
        set(x, y, z, wall && !door ? (window ? glass : quartz) : AIR_ID);
      }
      set(x, floor + 9, z, (dx === 0 && dz === 0) || (Math.abs(dx) === 3 && Math.abs(dz) === 3) ? glowstone : quartz);
    }
  set(KX - 2, floor + 1, KZ + 2, brewing); // 문 옆 양조기 (아들: 입구 양조기)
  set(KX + 2, floor + 1, KZ + 2, torch);
  const spots: [number, number][] = [
    [-3, -3],
    [3, -3],
    [0, -3],
    [-3, 0],
    [3, 0],
  ];
  for (let i = 0; i < Math.min(treasures, spots.length); i++) {
    const [dx, dz] = spots[i]!;
    set(KX + dx, floor + 1, KZ + dz, chest);
    treasureChests.push({ x: KX + dx, y: floor + 1, z: KZ + dz });
  }
  const city = { x: KX, y: floor, z: KZ };

  const spawn: SpawnPoint = { x: PX + 0.5, y: PY + 1, z: PZ + 3.5, yaw: 0 };
  const layout: EndLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, den, pillars, city };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
