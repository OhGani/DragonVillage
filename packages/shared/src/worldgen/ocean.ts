/**
 * 바다 신전 생성기 — 열째 원정지 (256×256×96, 아빠 2026-11-06 "원정지 3개 더"). 바다 신전 포탈을 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 바다 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 6분 뒤 밤(expeditions.json nightStartsAt 360) — 섬에 좀비·스켈레톤.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 수면 OCEAN_SEA_Y = 40.
 *   - 온통 바다: 바닥은 모래·자갈(깊이 8~14), 가끔 바닥에서 솟은 작은 섬. 가운데 도착 섬(반지름 14) 에 포탈.
 *   - 바다 신전(ocean_monument): 가운데서 55~70칸 바다 위. 바닥에서 솟은 프리즈머린 기둥 위에 31×31 단(수면 높이),
 *     바깥 벽 27×27(높이 7, 어두운 프리즈머린 띠), 안쪽 방 13×13 이 보스방 — 가운데가 엘더 가디언 자리(den).
 *     바깥 벽과 안쪽 방 사이 복도 네 구석에 가디언(spawns), 복도 구석 상자. 지붕은 계단 피라미드 + 바다 랜턴.
 *     안은 마른 땅(물이 없다) — 초5가 숨 걱정 없이 싸우게.
 *   - 다리: 도착 섬에서 신전 남쪽(섬 쪽) 문까지 프리즈머린 벽돌 다리(수면 한 칸 위, 폭 3). 헤엄쳐도 된다.
 *   - 물고기는 바다 어디든(expeditions.json wildAnimals).
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const OCEAN_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const OCEAN_GEN_VERSION = 1;
export const OCEAN_SEA_Y = 40;

const SIZE = OCEAN_BOUNDS.sizeCX * CHUNK_SIZE;
const HEIGHT = OCEAN_BOUNDS.sizeCY * CHUNK_SIZE;
const CENTER = SIZE / 2;
const ISLAND_R = 14;
/** 신전: 단 반폭 15 (31칸), 바깥 벽 반폭 13 (27칸), 안쪽 방 반폭 6 (13칸), 벽 높이 7 */
export const TEMPLE_HALF = 15;
export const OUTER_HALF = 13;
export const INNER_HALF = 6;
export const TEMPLE_H = 7;

export interface OceanLayout extends IslandLayout {
  /** 신전 바닥 가운데 (단 윗면 = 바닥 높이) */
  temple: { x: number; y: number; z: number };
  /** 엘더 가디언 자리 (안쪽 방 가운데 바닥 위) */
  den: { x: number; y: number; z: number };
  /** 복도 가디언 넷 (서버가 spawns 로 세운다) */
  guards: { x: number; y: number; z: number }[];
  /** 다리 위 한 칸 (도착 섬 끝 → 신전 문) — 테스트·나침반용 */
  bridge: { from: { x: number; z: number }; to: { x: number; z: number }; y: number };
}

export interface OceanResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: OceanLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateOcean(registry: BlockRegistry, seed: number, treasures = 3): OceanResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    sand = B('sand'),
    gravel = B('gravel'),
    dirt = B('dirt'),
    grass = B('grass'),
    water = B('water'),
    log = B('log'),
    leaves = B('leaves'),
    prismarine = B('prismarine'),
    bricks = B('prismarine_bricks'),
    darkP = B('dark_prismarine'),
    lantern = B('sea_lantern'),
    goldBlock = B('gold_block'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    cobble = B('cobblestone');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const floorA = n2(71),
    floorB = n2(72),
    isleN = n2(73);

  // ---- 신전 자리 (높이보다 먼저 — 그 둘레엔 작은 섬을 안 만든다) ----
  const rng = mulberry32((seed ^ 0x5ea7e) >>> 0);
  const ang = rng() * Math.PI * 2;
  const dist0 = 55 + rng() * 15;
  const tx = Math.round(CENTER + Math.cos(ang) * dist0),
    tz = Math.round(CENTER + Math.sin(ang) * dist0);

  // ---- 높이: 바다 바닥 + 가운데 도착 섬 + 드문 작은 섬 ----
  const SEA = OCEAN_SEA_Y;
  const heightAt = (x: number, z: number): number => {
    const dist = Math.hypot(x - CENTER, z - CENTER);
    let h = SEA - 10 + 3 * floorA(x / 40, z / 40) + 1.5 * floorB(x / 9, z / 9);
    const away = Math.min(smoothstep(TEMPLE_HALF + 4, TEMPLE_HALF + 20, Math.hypot(x - tx, z - tz)), smoothstep(ISLAND_R + 4, ISLAND_R + 20, dist));
    const isle = Math.max(0, isleN(x / 30, z / 30) - 0.62) * 40 * away; // 드문 작은 섬 (봉우리) — 신전·도착 섬 둘레는 비운다
    h += isle;
    const home = 1 - smoothstep(ISLAND_R - 4, ISLAND_R + 6, dist); // 도착 섬
    h = h + (SEA + 2 + (1 - dist / ISLAND_R) * 2 - h) * home;
    return h;
  };
  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(8, Math.min(HEIGHT - 14, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(OCEAN_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  for (let cz = 0; cz < OCEAN_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < OCEAN_BOUNDS.sizeCX; cx++) {
      let maxH = SEA;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < OCEAN_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const H = hAt(x, z);
            const land = H > SEA;
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || (y === 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y > H) id = y <= SEA ? water : AIR_ID;
              else if (y === H) id = land ? (H <= SEA + 1 ? sand : grass) : hash3(x, 0, z, seed) < 0.25 ? gravel : sand;
              else if (y > H - 4) id = land && H > SEA + 1 ? dirt : sand;
              else id = stone;
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

  // ---- 도착 포탈 (섬 가운데) ----
  const PY = hAt(CENTER, CENTER);
  const portal = { x: CENTER, y: PY + 1, z: CENTER };
  for (let x = CENTER - 4; x <= CENTER + 3; x++)
    for (let z = CENTER - 3; z <= CENTER + 3; z++) {
      for (let y = PY + 1; y <= PY + 6; y++) set(x, y, z, AIR_ID);
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
  // 섬에 참나무 몇 그루
  for (const [dx, dz] of [
    [-9, -5],
    [8, -7],
    [-6, 8],
    [9, 6],
  ] as [number, number][]) {
    const x = CENTER + dx,
      z = CENTER + dz,
      h = hAt(x, z);
    if (h <= SEA + 1) continue;
    for (let y = h + 1; y <= h + 5; y++) set(x, y, z, log);
    for (let ly = h + 4; ly <= h + 6; ly++)
      for (let ax = -2; ax <= 2; ax++)
        for (let az = -2; az <= 2; az++) if (Math.abs(ax) + Math.abs(az) <= (ly === h + 6 ? 1 : 3) && world.getBlock(x + ax, ly, z + az) === AIR_ID) set(x + ax, ly, z + az, leaves);
  }

  // ---- 바다 신전 ----
  const FLOOR = SEA + 1; // 단 윗면 = 바닥 (수면 한 칸 위)
  // 기둥·단: 바닥에서 단까지 — 단 가장자리·5칸마다 기둥은 꽉 채우고, 나머지는 단 두께 2 (아래는 물)
  for (let dx = -TEMPLE_HALF; dx <= TEMPLE_HALF; dx++)
    for (let dz = -TEMPLE_HALF; dz <= TEMPLE_HALF; dz++) {
      const x = tx + dx,
        z = tz + dz;
      const pillar = (Math.abs(dx) === TEMPLE_HALF || dx % 5 === 0) && (Math.abs(dz) === TEMPLE_HALF || dz % 5 === 0);
      const bottom = pillar ? hAt(x, z) : FLOOR - 2;
      for (let y = bottom; y < FLOOR; y++) set(x, y, z, pillar ? darkP : bricks);
      set(x, FLOOR, z, (dx + dz) % 2 === 0 ? bricks : prismarine);
    }
  // 바깥 벽 27×27 높이 7: 프리즈머린, 4번째 줄 어두운 띠, 모서리 바다 랜턴 기둥. 안쪽 방 13×13 같은 높이
  const wall = (half: number, x: number, z: number) => Math.max(Math.abs(x - tx), Math.abs(z - tz)) === half;
  for (let dx = -OUTER_HALF; dx <= OUTER_HALF; dx++)
    for (let dz = -OUTER_HALF; dz <= OUTER_HALF; dz++) {
      const x = tx + dx,
        z = tz + dz;
      const outer = wall(OUTER_HALF, x, z),
        inner = wall(INNER_HALF, x, z);
      const corner = Math.abs(dx) === OUTER_HALF && Math.abs(dz) === OUTER_HALF;
      for (let y = FLOOR + 1; y <= FLOOR + TEMPLE_H; y++) {
        if (outer || inner) set(x, y, z, corner ? lantern : y === FLOOR + 4 ? darkP : (x + y + z) % 5 === 0 ? bricks : prismarine);
        else set(x, y, z, AIR_ID);
      }
    }
  // 문: 바깥 벽 섬 쪽, 안쪽 방은 반대쪽에 (복도를 반 바퀴 돌아야 보스방) — 섬 쪽 방향을 네 방위 중 하나로
  const toIsle = Math.atan2(CENTER - tz, CENTER - tx);
  const sides: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  let doorDir = sides[0]!;
  let bestDot = -Infinity;
  for (const s of sides) {
    const dot = s[0] * Math.cos(toIsle) + s[1] * Math.sin(toIsle);
    if (dot > bestDot) {
      bestDot = dot;
      doorDir = s;
    }
  }
  const [ddx, ddz] = doorDir;
  for (let w = -1; w <= 1; w++)
    for (let y = FLOOR + 1; y <= FLOOR + 4; y++) {
      // 바깥 문 (섬 쪽)
      set(tx + ddx * OUTER_HALF + (ddz !== 0 ? w : 0), y, tz + ddz * OUTER_HALF + (ddx !== 0 ? w : 0), AIR_ID);
      // 안쪽 문 (반대쪽)
      set(tx - ddx * INNER_HALF + (ddz !== 0 ? w : 0), y, tz - ddz * INNER_HALF + (ddx !== 0 ? w : 0), AIR_ID);
    }
  // 지붕: 바깥 벽 위 두 겹 어두운 프리즈머린 + 계단 피라미드(반폭 13 → 3), 꼭대기 바다 랜턴
  for (let layer = 0; layer <= 10; layer++) {
    const half = OUTER_HALF - layer;
    if (half < 2) break;
    const y = FLOOR + TEMPLE_H + 1 + layer;
    for (let dx = -half; dx <= half; dx++)
      for (let dz = -half; dz <= half; dz++) {
        const edge = Math.abs(dx) === half || Math.abs(dz) === half;
        if (layer === 0 || edge) set(tx + dx, y, tz + dz, layer % 3 === 2 && edge ? lantern : layer === 0 ? darkP : prismarine);
      }
  }
  // 안쪽 방: 바닥 금 블록 무늬, 천장 바다 랜턴 (방은 지붕 첫 겹 아래)
  for (let dx = -INNER_HALF + 1; dx <= INNER_HALF - 1; dx++)
    for (let dz = -INNER_HALF + 1; dz <= INNER_HALF - 1; dz++) if (Math.abs(dx) === Math.abs(dz) && Math.abs(dx) % 2 === 0) set(tx + dx, FLOOR, tz + dz, goldBlock);
  for (const [dx, dz] of [
    [0, 0],
    [-3, -3],
    [3, -3],
    [-3, 3],
    [3, 3],
  ] as [number, number][])
    set(tx + dx, FLOOR + TEMPLE_H, tz + dz, lantern);
  // 복도 천장 랜턴
  for (let k = -OUTER_HALF + 3; k <= OUTER_HALF - 3; k += 5) {
    for (const [x, z] of [
      [tx + k, tz - 10],
      [tx + k, tz + 10],
      [tx - 10, tz + k],
      [tx + 10, tz + k],
    ] as [number, number][])
      set(x, FLOOR + TEMPLE_H, z, lantern);
  }
  const den = { x: tx, y: FLOOR + 1, z: tz };
  // 복도 구석: 가디언 넷, 상자 (treasures 만큼, 가디언과 다른 구석 옆)
  const R = Math.round((OUTER_HALF + INNER_HALF) / 2); // 복도 가운데 줄 (≈10)
  const guards: OceanLayout['guards'] = [
    { x: tx - R, y: FLOOR + 1, z: tz - R },
    { x: tx + R, y: FLOOR + 1, z: tz - R },
    { x: tx - R, y: FLOOR + 1, z: tz + R },
    { x: tx + R, y: FLOOR + 1, z: tz + R },
  ];
  const treasureChests: IslandLayout['treasures'] = [];
  const chestSpots: [number, number][] = [
    [-OUTER_HALF + 1, -OUTER_HALF + 1],
    [OUTER_HALF - 1, -OUTER_HALF + 1],
    [-OUTER_HALF + 1, OUTER_HALF - 1],
    [OUTER_HALF - 1, OUTER_HALF - 1],
  ];
  for (let i = 0; i < Math.min(treasures, chestSpots.length); i++) {
    const [dx, dz] = chestSpots[i]!;
    set(tx + dx, FLOOR + 1, tz + dz, chest);
    treasureChests.push({ x: tx + dx, y: FLOOR + 1, z: tz + dz });
  }

  // ---- 다리: 섬 가장자리에서 신전 문까지, 폭 3, 수면 위 한 칸(= 단 높이), 4칸마다 바다 랜턴 난간 ----
  const doorX = tx + ddx * (TEMPLE_HALF + 1),
    doorZ = tz + ddz * (TEMPLE_HALF + 1);
  const bx0 = CENTER + Math.round(Math.cos(Math.atan2(doorZ - CENTER, doorX - CENTER)) * (ISLAND_R - 6)),
    bz0 = CENTER + Math.round(Math.sin(Math.atan2(doorZ - CENTER, doorX - CENTER)) * (ISLAND_R - 6));
  // 섬 → 문 앞까지 곧장, 마지막은 문 축에 맞춰 꺾는다 (L자)
  const corner = ddx !== 0 ? { x: doorX, z: bz0 } : { x: bx0, z: doorZ };
  const lay = (ax: number, az: number, bx: number, bz: number) => {
    const n = Math.max(Math.abs(bx - ax), Math.abs(bz - az));
    const perpX = Math.abs(bz - az) >= Math.abs(bx - ax) ? 1 : 0,
      perpZ = 1 - perpX;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(ax + ((bx - ax) * i) / Math.max(1, n)),
        z = Math.round(az + ((bz - az) * i) / Math.max(1, n));
      for (let w = -1; w <= 1; w++) {
        const px = x + perpX * w,
          pz = z + perpZ * w;
        if (Math.hypot(px - CENTER, pz - CENTER) < ISLAND_R + 1 && hAt(px, pz) >= FLOOR) continue; // 도착 섬 땅 위는 그대로
        if (Math.max(Math.abs(px - tx), Math.abs(pz - tz)) <= TEMPLE_HALF) continue; // 신전 단
        set(px, FLOOR, pz, bricks);
        for (let y = FLOOR + 1; y <= FLOOR + 3; y++) if (world.getBlock(px, y, pz) !== AIR_ID) set(px, y, pz, AIR_ID); // 작은 섬을 지나면 뚫는다
      }
      if (i % 4 === 0 && Math.hypot(x - CENTER, z - CENTER) >= ISLAND_R + 1) {
        set(x + perpX * 2, FLOOR, z + perpZ * 2, darkP);
        set(x + perpX * 2, FLOOR + 1, z + perpZ * 2, lantern);
      }
    }
  };
  lay(bx0, bz0, corner.x, corner.z);
  lay(corner.x, corner.z, doorX, doorZ);

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: OceanLayout = {
    center: { x: CENTER, z: CENTER },
    portal,
    treasures: treasureChests,
    temple: { x: tx, y: FLOOR, z: tz },
    den,
    guards,
    bridge: { from: { x: bx0, z: bz0 }, to: { x: doorX, z: doorZ }, y: FLOOR },
  };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
