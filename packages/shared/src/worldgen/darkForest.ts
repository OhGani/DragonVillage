/**
 * 어두운 숲 생성기 — 일곱째 원정지 (256×256×96, v1.2 앞당김 #252). 포탈 3단계를 지으면 열린다(설원과 같은 단계).
 *
 * 시드 하나로 언제나 같은 숲 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 4분 뒤 밤(expeditions.json nightStartsAt 240) — 좀비·스켈레톤·거미. 숲이 빽빽해 낮에도 나무 아래는 어둡다.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 높이 DARK_GROUND_Y = 40 둘레로 완만한 언덕.
 *   - 잔디 1겹, 흙 3겹, 그 아래 돌(석탄·철·에메랄드). 맨 아래 기반암. 가장자리(가운데서 108칸 밖)는 산.
 *   - 짙은 참나무 숲: 굵은 줄기(5~7칸) 위에 넓고 납작한 잎(반지름 3, 두 겹)이 서로 붙어 지붕처럼 덮인다.
 *   - 거대 버섯 몇 개(마인크래프트 어두운 숲처럼): 버섯 줄기 + 빨간/갈색 갓.
 *   - 삼림 대저택(woodland_mansion): 가운데서 50~75칸. 짙은 참나무 판자 2층집(25×17, 층 높이 4), 조약돌 기단, 유리창,
 *     남쪽 2칸 문, 안쪽 비탈 계단으로 2층. 1층 구석에 상자(treasures), 1층엔 변명자 셋이 지키고(spawns),
 *     2층 가운데가 소환사의 자리(den) — 24칸 안에 사람이 오면 깨어나 변명자를 부른다. 죽이면 불사의 토템 10 (bosses.json).
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5. 스폰은 문틀 남쪽.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const DARK_FOREST_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const DARK_FOREST_GEN_VERSION = 1;
export const DARK_GROUND_Y = 40;

const SIZE = DARK_FOREST_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = DARK_FOREST_BOUNDS.sizeCY * CHUNK_SIZE; // 96
const CENTER = SIZE / 2;
const PORTAL_FLAT_R = 8;
const WALL_R = 108;
const DIRT_DEPTH = 3;
/** 대저택 크기: 동서 반폭 12 (25칸), 남북 반폭 8 (17칸), 층 높이 4 */
export const MANSION_HALF_X = 12;
export const MANSION_HALF_Z = 8;
export const MANSION_FLOOR_H = 4;

export interface DarkForestLayout extends IslandLayout {
  /** 대저택 가운데(기단 높이) */
  mansion: { x: number; y: number; z: number };
  /** 소환사 자리 (2층 가운데 바닥) */
  den: { x: number; y: number; z: number };
  /** 1층을 지키는 변명자 발 자리 (서버가 spawns 로 세운다) */
  guards: { x: number; y: number; z: number }[];
  /** 거대 버섯 줄기 밑 */
  mushrooms: { x: number; y: number; z: number }[];
}

export interface DarkForestResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: DarkForestLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateDarkForest(registry: BlockRegistry, seed: number, treasures = 3): DarkForestResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    dirt = B('dirt'),
    grass = B('grass'),
    log = B('dark_oak_log'),
    planks = B('dark_oak_planks'),
    leaves = B('dark_oak_leaves'),
    glass = B('glass'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    torch = B('torch'),
    bookshelf = B('bookshelf'),
    redWool = B('red_wool'),
    stem = B('mushroom_stem'),
    redCap = B('red_mushroom_block'),
    brownCap = B('brown_mushroom_block'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    emeraldOre = B('emerald_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const hillA = n2(41),
    hillB = n2(42),
    mtnN = n2(43),
    edgeN = n2(44),
    forestN = n2(45);

  // ---- 높이: 완만한 언덕 + 군데군데 높은 언덕, 가장자리는 산 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = DARK_GROUND_Y + 3 * hillA(x / 37, z / 37) + 1.2 * hillB(x / 12, z / 12) + Math.max(0, mtnN(x / 59, z / 59)) * 9;
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, dist) * 34;
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (DARK_GROUND_Y + 2 - h) * flat;
    return h;
  };
  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(12, Math.min(HEIGHT - 12, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(DARK_FOREST_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.022) return stone;
    if (r < 0.012) return coal;
    if (r < 0.019) return iron;
    return y < 28 ? emeraldOre : stone;
  };
  for (let cz = 0; cz < DARK_FOREST_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < DARK_FOREST_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < DARK_FOREST_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const H = hAt(x, z);
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || (y === 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y > H) id = AIR_ID;
              else if (y === H) id = grass;
              else if (y > H - 1 - DIRT_DEPTH) id = dirt;
              else id = oreAt(x, y, z);
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
  /** 자리를 평평하게 (사막·설원과 같은 방식) */
  const terrace = (cx: number, cz: number, halfX: number, halfZ: number, blend = 10): number => {
    const lvl = hAt(cx, cz);
    for (let dx = -halfX - blend; dx <= halfX + blend; dx++)
      for (let dz = -halfZ - blend; dz <= halfZ + blend; dz++) {
        const x = cx + dx,
          z = cz + dz;
        if (x < 0 || z < 0 || x >= SIZE || z >= SIZE) continue;
        const h = heights[z * SIZE + x]!;
        const d = Math.max(Math.abs(dx) - halfX, Math.abs(dz) - halfZ);
        const t = d <= 0 ? 0 : d / blend;
        const target = Math.round(lvl + (h - lvl) * t);
        if (target === h) continue;
        if (target < h) {
          for (let y = target + 1; y <= h; y++) set(x, y, z, AIR_ID);
          set(x, target, z, grass);
          for (let y = target - DIRT_DEPTH; y < target; y++) set(x, y, z, dirt);
        } else {
          for (let y = h; y < target; y++) set(x, y, z, dirt);
          set(x, target, z, grass);
        }
        heights[z * SIZE + x] = target;
      }
    return lvl;
  };

  // ---- 도착 포탈 ----
  const PY = hAt(CENTER, CENTER);
  const portal = { x: CENTER, y: PY + 1, z: CENTER };
  for (let x = CENTER - 4; x <= CENTER + 3; x++)
    for (let z = CENTER - 3; z <= CENTER + 3; z++) {
      const corner = (x === CENTER - 4 || x === CENTER + 3) && (z === CENTER - 3 || z === CENTER + 3);
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

  const rng = mulberry32((seed ^ 0xda2cf0) >>> 0);
  const keepClear: { x: number; z: number; r: number }[] = [{ x: CENTER, z: CENTER, r: PORTAL_FLAT_R + 6 }];
  const isClear = (x: number, z: number, extra = 0) => keepClear.every((c) => Math.hypot(c.x - x, c.z - z) > c.r + extra);
  const treasureChests: IslandLayout['treasures'] = [];

  // ---- 삼림 대저택: 가운데서 50~75칸 ----
  const mAng = rng() * Math.PI * 2;
  const mDist = 50 + rng() * 25;
  const mx = Math.round(CENTER + Math.cos(mAng) * mDist),
    mz = Math.round(CENTER + Math.sin(mAng) * mDist);
  const base = terrace(mx, mz, MANSION_HALF_X + 2, MANSION_HALF_Z + 2, 10);
  const F1 = base + 1; // 1층 바닥(조약돌 기단 위 판자)
  const F2 = F1 + MANSION_FLOOR_H + 1; // 2층 바닥
  const ROOF = F2 + MANSION_FLOOR_H + 1;
  // 기단 + 속 비우기
  for (let dx = -MANSION_HALF_X; dx <= MANSION_HALF_X; dx++)
    for (let dz = -MANSION_HALF_Z; dz <= MANSION_HALF_Z; dz++) {
      const x = mx + dx,
        z = mz + dz;
      set(x, base, z, cobble);
      set(x, F1, z, planks);
      set(x, F2, z, planks);
      set(x, ROOF, z, planks);
      for (let y = F1 + 1; y < F2; y++) set(x, y, z, AIR_ID);
      for (let y = F2 + 1; y < ROOF; y++) set(x, y, z, AIR_ID);
    }
  // 벽: 네 변, 모서리와 6칸마다 원목 기둥, 창문은 기둥 사이 가운데
  const wallAt = (x: number, z: number, dx: number, dz: number) => {
    const pillar = Math.abs(dx) === MANSION_HALF_X && Math.abs(dz) === MANSION_HALF_Z ? true : (Math.abs(dx) === MANSION_HALF_X ? (dz + MANSION_HALF_Z) % 4 === 0 : (dx + MANSION_HALF_X) % 6 === 0);
    const window = !pillar && (Math.abs(dx) === MANSION_HALF_X ? (dz + MANSION_HALF_Z) % 4 === 2 : (dx + MANSION_HALF_X) % 6 === 3);
    for (let y = F1 + 1; y < ROOF; y++) {
      const mid = y === F1 + 2 || y === F1 + 3 || y === F2 + 2 || y === F2 + 3;
      set(x, y, z, pillar ? log : window && mid ? glass : planks);
    }
  };
  for (let dx = -MANSION_HALF_X; dx <= MANSION_HALF_X; dx++) {
    wallAt(mx + dx, mz - MANSION_HALF_Z, dx, -MANSION_HALF_Z);
    wallAt(mx + dx, mz + MANSION_HALF_Z, dx, MANSION_HALF_Z);
  }
  for (let dz = -MANSION_HALF_Z + 1; dz < MANSION_HALF_Z; dz++) {
    wallAt(mx - MANSION_HALF_X, mz + dz, -MANSION_HALF_X, dz);
    wallAt(mx + MANSION_HALF_X, mz + dz, MANSION_HALF_X, dz);
  }
  // 남쪽 문 (2칸 넓이, 3칸 높이) + 문 앞 계단 한 칸
  for (const dx of [0, 1]) {
    for (let y = F1 + 1; y <= F1 + 3; y++) set(mx + dx, y, mz + MANSION_HALF_Z, AIR_ID);
    set(mx + dx, base, mz + MANSION_HALF_Z + 1, cobble);
    set(mx + dx, F1 + 1, mz + MANSION_HALF_Z, AIR_ID);
  }
  // 1층 서쪽에 2층으로 오르는 비탈 계단 (한 칸씩, 북쪽으로 올라간다) — 2층 바닥에 구멍
  const sx = mx - MANSION_HALF_X + 2;
  for (let i = 0; i <= MANSION_FLOOR_H; i++) {
    const z = mz + MANSION_HALF_Z - 2 - i;
    for (let y = F1 + 1; y <= F1 + i; y++) set(sx, y, z, planks);
    if (i >= 2) set(sx, F2, z, AIR_ID); // 머리 위 구멍 (마지막 계단에서 북쪽 2층 바닥으로 한 칸 올라선다)
  }
  // 안: 1층 책장 벽 둘, 빨간 양탄자 길, 횃불·발광석
  for (let dz = -MANSION_HALF_Z + 1; dz <= MANSION_HALF_Z - 1; dz++) set(mx, F1, mz + dz, redWool);
  for (let dx = -4; dx <= 4; dx++) {
    set(mx + dx, F1 + 1, mz - MANSION_HALF_Z + 1, bookshelf);
    set(mx + dx, F1 + 2, mz - MANSION_HALF_Z + 1, bookshelf);
  }
  for (const [dx, dz] of [
    [-6, 0],
    [6, 0],
    [0, -4],
    [0, 4],
  ] as [number, number][]) {
    set(mx + dx, F2 - 1, mz + dz, glowstone); // 1층 천장
    set(mx + dx, ROOF - 1, mz + dz, glowstone); // 2층 천장
  }
  set(mx + 3, F1 + 1, mz + MANSION_HALF_Z - 1, torch);
  set(mx - 2, F1 + 1, mz + MANSION_HALF_Z - 1, torch);
  // 상자: 1층 세 구석 (treasures 만큼, 최대 4)
  const chestSpots: [number, number][] = [
    [MANSION_HALF_X - 1, -MANSION_HALF_Z + 1],
    [-MANSION_HALF_X + 1, -MANSION_HALF_Z + 1],
    [MANSION_HALF_X - 1, MANSION_HALF_Z - 1],
    [-MANSION_HALF_X + 4, MANSION_HALF_Z - 1],
  ];
  for (let i = 0; i < Math.min(treasures, chestSpots.length); i++) {
    const [dx, dz] = chestSpots[i]!;
    set(mx + dx, F1 + 1, mz + dz, chest);
    treasureChests.push({ x: mx + dx, y: F1 + 1, z: mz + dz });
  }
  // 변명자 셋: 1층 가운데 양탄자 위, 소환사: 2층 가운데
  const guards: DarkForestLayout['guards'] = [
    { x: mx, y: F1 + 1, z: mz },
    { x: mx + 5, y: F1 + 1, z: mz + 2 },
    { x: mx - 5, y: F1 + 1, z: mz - 2 },
  ];
  const den = { x: mx, y: F2 + 1, z: mz };
  keepClear.push({ x: mx, z: mz, r: Math.max(MANSION_HALF_X, MANSION_HALF_Z) + 8 });
  const mansion = { x: mx, y: base, z: mz };

  // ---- 거대 버섯 6개: 줄기 5~6 + 갓 ----
  const mushrooms: DarkForestLayout['mushrooms'] = [];
  let tries = 0;
  while (mushrooms.length < 6 && tries++ < 200) {
    const ang = rng() * Math.PI * 2;
    const d = 20 + rng() * 75;
    const x = Math.round(CENTER + Math.cos(ang) * d),
      z = Math.round(CENTER + Math.sin(ang) * d);
    if (!isClear(x, z, 4) || mushrooms.some((m) => Math.hypot(m.x - x, m.z - z) < 12)) continue;
    const h = hAt(x, z);
    const tall = 5 + Math.floor(rng() * 2);
    for (let y = h + 1; y <= h + tall; y++) set(x, y, z, stem);
    const cap = rng() < 0.5 ? redCap : brownCap;
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
        set(x + dx, h + tall + 1, z + dz, cap);
        if (Math.abs(dx) === 2 || Math.abs(dz) === 2) set(x + dx, h + tall, z + dz, cap);
      }
    mushrooms.push({ x, y: h + 1, z });
    keepClear.push({ x, z, r: 4 });
  }

  // ---- 짙은 참나무 숲: 줄기 5~7, 넓고 납작한 잎 두 겹 ----
  const treeAt = (x: number, z: number) => {
    const h = hAt(x, z);
    const top = h + 5 + Math.floor(hash3(x, 2, z, seed) * 3);
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    for (let dy = 0; dy <= 1; dy++) {
      const y = top + dy;
      const r = dy === 0 ? 3 : 2;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (Math.abs(dx) === r && Math.abs(dz) === r) continue;
          if (world.getBlock(x + dx, y, z + dz) === AIR_ID) set(x + dx, y, z + dz, leaves);
        }
    }
    set(x, top + 2, z, leaves);
  };
  const trunks = new Set<number>();
  const nearTrunk = (x: number, z: number) => {
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) if (trunks.has((x + dx) * SIZE + z + dz)) return true;
    return false;
  };
  for (let z = 3; z < SIZE - 3; z++)
    for (let x = 3; x < SIZE - 3; x++) {
      const h = hAt(x, z);
      if (world.getBlock(x, h, z) !== grass || world.getBlock(x, h + 1, z) !== AIR_ID) continue;
      if (Math.hypot(x - CENTER, z - CENTER) > WALL_R - 4 || !isClear(x, z)) continue;
      const forest = smoothstep(-0.2, 0.5, forestN(x / 40, z / 40));
      const p = 0.03 + 0.09 * forest; // 설원보다 훨씬 빽빽하다 — 잎이 서로 닿아 지붕이 된다
      if (hash3(x, 1, z, seed) < p && !nearTrunk(x, z)) {
        trunks.add(x * SIZE + z);
        treeAt(x, z);
      }
    }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: DarkForestLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, mansion, den, guards, mushrooms };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
