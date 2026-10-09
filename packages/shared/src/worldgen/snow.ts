/**
 * 설원 생성기 — 넷째 원정지 (256×256×96 = 16×16×6 청크, v1.1-2). 포탈 3단계를 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 설원 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 5분 뒤 밤(expeditions.json nightStartsAt 300) — 스트레이·좀비.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 높이 SNOW_GROUND_Y = 40 둘레로 눈 언덕.
 *   - 눈 블록 2겹, 흙 3겹, 그 아래 돌(석탄·철·청금석). 맨 아래 기반암. 가장자리(가운데서 108칸 밖)는 눈 산.
 *   - 얼어붙은 호수: 호수 노이즈가 높은 곳은 땅이 LAKE_Y 아래로 꺼지고, 물 위에 **얼음**이 덮인다(아들 7차 "눈 바이옴에서 물은 얼음으로").
 *     물가는 비스듬해서 걸어 내려가고 올라온다. 얼음은 곡괭이로 캐면 그대로 나온다(아이스 드래곤 재료).
 *   - 가문비 숲: 길쭉한 원뿔 나무(원목 + 나뭇잎) 가 숲 노이즈가 높은 곳에 빽빽.
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5 (다른 원정지와 같은 모양). 스폰은 문틀 남쪽.
 *   - 이글루 N개(expeditions.json treasures): 가운데서 40~70칸, 눈 블록 반구(반지름 4.5) 안에 상자 + 횃불, 남쪽 입구.
 *   - 눈 골렘 셋(아들 3차 "눈 골렘" v1): 포탈 둘레에 눈 블록 둘 + 조각된 호박 — 지금은 서 있는 조각상.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const SNOW_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const SNOW_GEN_VERSION = 1;
/** 평균 땅 높이 */
export const SNOW_GROUND_Y = 40;
/** 호수 얼음 높이 — 이 아래로 꺼진 땅은 물이 차고 맨 위가 얼음 */
export const LAKE_Y = 38;

const SIZE = SNOW_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = SNOW_BOUNDS.sizeCY * CHUNK_SIZE; // 96
const CENTER = SIZE / 2; // 128
const PORTAL_FLAT_R = 8;
const WALL_R = 108;
const SNOW_DEPTH = 2;
const DIRT_DEPTH = 3;
const IGLOO_R = 4.5;

export interface SnowLayout extends IslandLayout {
  /** 이글루 가운데(바닥 높이) */
  igloos: { x: number; y: number; z: number }[];
  /** 눈 골렘 조각상 발 자리 */
  golems: { x: number; y: number; z: number }[];
}

export interface SnowResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: SnowLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateSnow(registry: BlockRegistry, seed: number, treasures = 3): SnowResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    dirt = B('dirt'),
    snow = B('snow_block'),
    ice = B('ice'),
    water = B('water'),
    log = B('log'),
    leaves = B('leaves'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    torch = B('torch'),
    pumpkin = B('carved_pumpkin'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    lapis = B('lapis_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const hillA = n2(31),
    hillB = n2(32),
    mtnN = n2(33),
    edgeN = n2(34),
    lakeN = n2(35),
    forestN = n2(36);

  // ---- 높이: 눈 언덕 + 군데군데 높은 언덕, 호수는 꺼지고, 가장자리는 눈 산 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = SNOW_GROUND_Y + 4 * hillA(x / 41, z / 41) + 1.5 * hillB(x / 13, z / 13) + Math.max(0, mtnN(x / 61, z / 61)) * 14;
    const lake = smoothstep(0.3, 0.55, lakeN(x / 43, z / 43));
    h = h + (LAKE_Y - 3 - h) * lake; // 호수 가운데는 LAKE_Y-3 까지 꺼지고 가장자리는 비스듬
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, dist) * 34;
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (SNOW_GROUND_Y + 2 - h) * flat;
    return h;
  };

  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(12, Math.min(HEIGHT - 12, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(SNOW_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.022) return stone;
    if (r < 0.012) return coal;
    if (r < 0.019) return iron;
    return y < 30 ? lapis : stone;
  };
  for (let cz = 0; cz < SNOW_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < SNOW_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz), LAKE_Y);
      for (let cy = 0; cy < SNOW_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const H = hAt(x, z);
            const lake = H < LAKE_Y;
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || (y === 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y > H) {
                if (lake && y < LAKE_Y) id = water;
                else if (lake && y === LAKE_Y) id = ice;
              } else if (y > H - SNOW_DEPTH) id = lake ? dirt : snow;
              else if (y > H - SNOW_DEPTH - DIRT_DEPTH) id = dirt;
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
  /** 자리를 평평하게 (사막과 같은 방식): 가운데 높이로 고르고 바깥 blend 칸은 비스듬히 잇는다 */
  const terrace = (cx: number, cz: number, half: number, blend = 10): number => {
    const lvl = hAt(cx, cz);
    for (let dx = -half - blend; dx <= half + blend; dx++)
      for (let dz = -half - blend; dz <= half + blend; dz++) {
        const x = cx + dx,
          z = cz + dz;
        if (x < 0 || z < 0 || x >= SIZE || z >= SIZE) continue;
        const h = heights[z * SIZE + x]!;
        const d = Math.max(Math.abs(dx), Math.abs(dz));
        const t = d <= half ? 0 : (d - half) / blend;
        const target = Math.round(lvl + (h - lvl) * t);
        if (target === h) continue;
        const lake = h < LAKE_Y;
        if (target < h) {
          for (let y = target + 1; y <= h; y++) set(x, y, z, lake ? water : AIR_ID);
          for (let y = target - SNOW_DEPTH + 1; y <= target; y++) set(x, y, z, lake ? dirt : snow);
        } else {
          for (let y = h + 1; y <= target; y++) set(x, y, z, lake && y < LAKE_Y ? dirt : snow); // 호수 바닥은 흙, 물 위로 올라오면 눈
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

  const rng = mulberry32((seed ^ 0x5a0f1ce) >>> 0);
  const keepClear: { x: number; z: number; r: number }[] = [{ x: CENTER, z: CENTER, r: PORTAL_FLAT_R + 6 }];
  const isClear = (x: number, z: number, extra = 0) => keepClear.every((c) => Math.hypot(c.x - x, c.z - z) > c.r + extra);

  // ---- 눈 골렘 조각상 셋: 포탈 둘레 11칸 ----
  const golems: SnowLayout['golems'] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.6;
    const gx = Math.round(CENTER + Math.cos(a) * 11),
      gz = Math.round(CENTER + Math.sin(a) * 11);
    const h = hAt(gx, gz);
    set(gx, h + 1, gz, snow);
    set(gx, h + 2, gz, snow);
    set(gx, h + 3, gz, pumpkin);
    golems.push({ x: gx, y: h + 1, z: gz });
  }

  // ---- 이글루: 가운데서 40~70칸, 서로 30칸 이상, 호수 아닌 곳 ----
  const igloos: SnowLayout['igloos'] = [];
  const treasureChests: IslandLayout['treasures'] = [];
  let tries = 0;
  while (igloos.length < treasures && tries++ < 300) {
    const ang = rng() * Math.PI * 2;
    const d = 40 + rng() * 30;
    const ix = Math.round(CENTER + Math.cos(ang) * d),
      iz = Math.round(CENTER + Math.sin(ang) * d);
    if (hAt(ix, iz) < LAKE_Y + 1 || !isClear(ix, iz, 8) || igloos.some((o) => Math.hypot(o.x - ix, o.z - iz) < 30)) continue;
    const floor = terrace(ix, iz, 5, 8);
    for (let dx = -5; dx <= 5; dx++)
      for (let dz = -5; dz <= 5; dz++)
        for (let dy = 0; dy <= 5; dy++) {
          const dd = Math.hypot(dx, dz, dy);
          if (dd > IGLOO_R + 0.5) continue;
          set(ix + dx, floor + 1 + dy, iz + dz, dd > IGLOO_R - 1.1 ? snow : AIR_ID);
        }
    for (let dz = 3; dz <= 5; dz++) for (let y = floor + 1; y <= floor + 2; y++) set(ix, y, iz + dz, AIR_ID); // 남쪽 입구
    set(ix, floor + 1, iz, chest);
    set(ix - 2, floor + 1, iz - 1, torch);
    treasureChests.push({ x: ix, y: floor + 1, z: iz });
    igloos.push({ x: ix, y: floor, z: iz });
    keepClear.push({ x: ix, z: iz, r: 9 });
  }

  // ---- 가문비 숲: 원뿔 나무 ----
  const treeAt = (x: number, z: number) => {
    const h = hAt(x, z);
    const top = h + 6 + Math.floor(hash3(x, 2, z, seed) * 3); // 6~8
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    set(x, top + 1, z, leaves);
    for (let dy = 1; dy <= 6; dy++) {
      const y = top + 1 - dy;
      const r = dy <= 2 ? 1 : dy <= 4 ? 2 : dy === 5 ? 1 : 2;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0) continue;
          if (r === 2 && Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          if (world.getBlock(x + dx, y, z + dz) === AIR_ID) set(x + dx, y, z + dz, leaves);
        }
    }
  };
  const trunks = new Set<number>();
  const nearTrunk = (x: number, z: number) => {
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) if (trunks.has((x + dx) * SIZE + z + dz)) return true;
    return false;
  };
  for (let z = 3; z < SIZE - 3; z++)
    for (let x = 3; x < SIZE - 3; x++) {
      const h = hAt(x, z);
      if (h < LAKE_Y + 1 || world.getBlock(x, h, z) !== snow || world.getBlock(x, h + 1, z) !== AIR_ID) continue;
      if (Math.hypot(x - CENTER, z - CENTER) > WALL_R - 4 || !isClear(x, z)) continue;
      const forest = smoothstep(0.1, 0.6, forestN(x / 45, z / 45));
      const p = 0.004 + 0.08 * forest;
      if (hash3(x, 1, z, seed) < p && !nearTrunk(x, z)) {
        trunks.add(x * SIZE + z);
        treeAt(x, z);
      }
    }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: SnowLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, igloos, golems };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
