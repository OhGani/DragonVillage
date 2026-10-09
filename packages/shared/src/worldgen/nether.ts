/**
 * 네더 생성기 — 다섯째 원정지 (256×256×96 = 16×16×6 청크, v1.1-3). 포탈 4단계를 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 네더 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 항상 어두움(expeditions.json nightStartsAt 0) — 하늘이 없다. 빛은 용암·발광석·가져간 횃불뿐. 몹은 처음부터 나온다.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동).
 *   - 바닥(0)·천장(95)은 기반암. 땅은 네더랙 — 높이가 LAVA_SEA_Y 아래로 꺼진 곳은 **용암 바다**(자연 용암).
 *     천장은 네더랙 덩어리가 울퉁불퉁 매달려 있고 군데군데 **발광석** 뭉치가 붙어 있다.
 *   - 땅속 네더랙엔 석영 광석(어디나)·**고대 잔해**(y 6~22, 아주 드묾, 다이아 곡괭이) — 네더라이트 재료.
 *   - 영혼 모래 밭이 군데군데(위 두 겹), 그 위에 **네더 사마귀**가 드문드문 자란다(물약 재료).
 *   - 가장자리(가운데서 108칸 밖)는 네더랙 벽이 천장까지 솟는다.
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5. 스폰은 문틀 남쪽.
 *   - 네더 요새(`nether_fortress`): 가운데서 50~75칸 땅 위, 네더 벽돌 21×21 바닥 + 둘레 벽(사방 문) + 모서리 탑 넷(꼭대기 발광석)
 *     + 안쪽 방 9×9(지붕·발광석, 남쪽 문)에 보물 상자 + 영혼 모래 밭의 네더 사마귀.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const NETHER_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const NETHER_GEN_VERSION = 1;
/** 용암 바다 수면 — 이 아래로 꺼진 땅은 용암 */
export const LAVA_SEA_Y = 24;
/** 평균 땅 높이 */
export const NETHER_GROUND_Y = 28;
/** 요새 바닥 반(21×21) */
export const FORT_HALF = 10;

const SIZE = NETHER_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = NETHER_BOUNDS.sizeCY * CHUNK_SIZE; // 96
const CENTER = SIZE / 2; // 128
const PORTAL_FLAT_R = 8;
const WALL_R = 108;
const CEIL_TOP = HEIGHT - 1; // 95 기반암

export interface NetherLayout extends IslandLayout {
  /** 요새 가운데(바닥 높이) */
  fortress: { x: number; y: number; z: number };
}

export interface NetherResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: NetherLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateNether(registry: BlockRegistry, seed: number, treasures = 3): NetherResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    rack = B('netherrack'),
    cobble = B('cobblestone'),
    lava = B('lava'),
    glowstone = B('glowstone'),
    soul = B('soul_sand'),
    wart = B('nether_wart'),
    quartz = B('nether_quartz_ore'),
    debris = B('ancient_debris'),
    bricks = B('nether_bricks'),
    obsidian = B('obsidian'),
    chest = B('chest');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const landA = n2(41),
    landB = n2(42),
    hillN = n2(43),
    edgeN = n2(44),
    ceilA = n2(45),
    ceilB = n2(46),
    soulN = n2(47);

  // ---- 땅 높이: 용암 바다 위로 네더랙 땅이 울퉁불퉁. 가장자리는 벽 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = NETHER_GROUND_Y - 3 + 7 * landA(x / 41, z / 41) + 2 * landB(x / 13, z / 13) + Math.max(0, hillN(x / 57, z / 57)) * 14;
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 12, dist) * 70;
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (NETHER_GROUND_Y + 2 - h) * flat;
    return h;
  };
  /** 천장 아랫면 높이 */
  const ceilAt = (x: number, z: number): number => 88 - 6 * ceilA(x / 37, z / 37) - Math.max(0, ceilB(x / 23, z / 23)) * 12;

  const heights = new Int16Array(SIZE * SIZE);
  const ceils = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++)
    for (let x = 0; x < SIZE; x++) {
      heights[z * SIZE + x] = Math.max(8, Math.min(CEIL_TOP - 1, Math.round(heightAt(x, z))));
      ceils[z * SIZE + x] = Math.max(60, Math.min(CEIL_TOP - 1, Math.round(ceilAt(x, z))));
    }
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;
  const cAt = (x: number, z: number) => ceils[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;
  const isSoul = (x: number, z: number) => soulN(x / 19, z / 19) > 0.55;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(NETHER_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const rockAt = (x: number, y: number, z: number, H: number): number => {
    const r = hash3(x, y, z, seed);
    if (r < 0.015) return quartz;
    if (y >= 6 && y <= 22 && y <= H - 3 && r < 0.0155) return debris;
    return rack;
  };
  for (let cz = 0; cz < NETHER_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < NETHER_BOUNDS.sizeCX; cx++) {
      for (let cy = 0; cy < NETHER_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const H = hAt(x, z);
            const C = cAt(x, z);
            const sea = H < LAVA_SEA_Y;
            const soulTop = !sea && isSoul(x, z);
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || y === CEIL_TOP || (y === 1 && hash3(x, y, z, seed) < 0.5) || (y === CEIL_TOP - 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y <= H) id = soulTop && y >= H - 1 ? soul : rockAt(x, y, z, H);
              else if (sea && y <= LAVA_SEA_Y) id = lava;
              else if (y >= C) {
                // 천장: 아랫면에 드문드문 발광석 뭉치
                const g = hash3(x, 11, z, seed);
                id = y <= C + 1 && g < 0.012 ? glowstone : rack;
              } else if (soulTop && y === H + 1 && hash3(x, 12, z, seed) < 0.08) id = wart;
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
  /** 자리를 평평하게 (사막·설원과 같은 방식). 용암 바다였던 칸은 네더랙으로 메운다 */
  const terrace = (cx: number, cz: number, half: number, blend = 10): number => {
    const lvl = Math.max(LAVA_SEA_Y + 2, hAt(cx, cz));
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
        if (target < h) for (let y = target + 1; y <= h; y++) set(x, y, z, AIR_ID);
        else for (let y = h + 1; y <= target; y++) set(x, y, z, rack);
        for (let y = target + 1; y <= target + 2; y++) if (world.getBlock(x, y, z) === wart) set(x, y, z, AIR_ID);
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
      set(x, PY + 1, z, AIR_ID);
    }
  for (let x = portal.x - 2; x <= portal.x + 1; x++) {
    set(x, portal.y, portal.z, obsidian);
    set(x, portal.y + 4, portal.z, obsidian);
  }
  for (let y = portal.y + 1; y <= portal.y + 3; y++) {
    set(portal.x - 2, y, portal.z, obsidian);
    set(portal.x + 1, y, portal.z, obsidian);
  }

  // ---- 네더 요새: 가운데서 50~75칸, 땅(용암 아님) 위 ----
  const rng = mulberry32((seed ^ 0x6e7e4e) >>> 0);
  let fx = CENTER + 60,
    fz = CENTER;
  for (let t = 0; t < 60; t++) {
    const ang = rng() * Math.PI * 2;
    const d = 50 + rng() * 25;
    const x = Math.round(CENTER + Math.cos(ang) * d),
      z = Math.round(CENTER + Math.sin(ang) * d);
    fx = x;
    fz = z;
    if (hAt(x, z) >= LAVA_SEA_Y + 2) break;
  }
  const floor = terrace(fx, fz, FORT_HALF + 1, 8);
  const treasureChests: IslandLayout['treasures'] = [];
  for (let dx = -FORT_HALF; dx <= FORT_HALF; dx++)
    for (let dz = -FORT_HALF; dz <= FORT_HALF; dz++) {
      const x = fx + dx,
        z = fz + dz;
      set(x, floor, z, bricks);
      for (let y = floor + 1; y <= floor + 9; y++) set(x, y, z, AIR_ID);
      const ad = Math.max(Math.abs(dx), Math.abs(dz));
      const corner = Math.abs(dx) >= FORT_HALF - 2 && Math.abs(dz) >= FORT_HALF - 2;
      if (corner) {
        for (let y = floor + 1; y <= floor + 8; y++) set(x, y, z, bricks);
        if (Math.abs(dx) === FORT_HALF - 1 && Math.abs(dz) === FORT_HALF - 1) set(x, floor + 9, z, glowstone);
      } else if (ad === FORT_HALF) {
        const gate = Math.abs(dx) <= 1 || Math.abs(dz) <= 1; // 사방 가운데 문 (3칸 너비·3칸 높이)
        for (let y = floor + 1; y <= floor + 4; y++) set(x, y, z, gate && y <= floor + 3 ? AIR_ID : bricks);
      } else if (ad === 4) {
        // 안쪽 방 벽: 남쪽 문
        const door = dz === 4 && Math.abs(dx) <= 1;
        for (let y = floor + 1; y <= floor + 4; y++) set(x, y, z, door && y <= floor + 3 ? AIR_ID : bricks);
        set(x, floor + 5, z, bricks);
      } else if (ad < 4) {
        set(x, floor + 5, z, (dx === 0 && dz === 0) || (Math.abs(dx) === 3 && Math.abs(dz) === 3) ? glowstone : bricks); // 지붕: 가운데·네 구석에 불
      }
    }
  // 상자: 안쪽 방 구석부터
  const spots: [number, number][] = [
    [-2, -2],
    [2, -2],
    [0, -3],
    [-3, 1],
    [3, 1],
    [-2, 3],
    [2, 3],
  ];
  for (let i = 0; i < Math.min(treasures, spots.length); i++) {
    const [dx, dz] = spots[i]!;
    set(fx + dx, floor + 1, fz + dz, chest);
    treasureChests.push({ x: fx + dx, y: floor + 1, z: fz + dz });
  }
  // 영혼 모래 밭 + 네더 사마귀: 요새 안 동북쪽 뜰 3×3
  for (let dx = 5; dx <= 7; dx++)
    for (let dz = -7; dz <= -5; dz++) {
      set(fx + dx, floor, fz + dz, soul);
      set(fx + dx, floor + 1, fz + dz, wart);
    }
  const fortress = { x: fx, y: floor, z: fz };

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: NetherLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, fortress };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
