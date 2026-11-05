/**
 * 정글 생성기 — 여덟째 원정지 (256×256×96, v1.2 앞당김 #253). 포탈 3단계를 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 정글 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 6분 뒤 밤(expeditions.json nightStartsAt 360) — 거미·좀비·크리퍼.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 높이 JUNGLE_GROUND_Y = 40 둘레로 높낮이가 큰 언덕.
 *   - 잔디 1겹, 흙 3겹, 그 아래 돌(석탄·철·금). 맨 아래 기반암. 가장자리(가운데서 108칸 밖)는 산.
 *   - 정글 나무: 아주 높은 줄기(8~12) 위에 둥근 잎 세 겹 + 땅의 덤불(잎 한 칸). 수박이 드문드문.
 *   - 정글 궁궐(jungle_palace, "사치스러운"): 가운데서 50~75칸. 이끼 낀 조약돌 기단 27×27 두 단 + 큰 홀 19×19(벽 높이 6,
 *     금 블록 띠·모서리 금 기둥), 남쪽 3칸 문, 가운데 천창. 북쪽 벽 앞 에메랄드 블록 왕좌 앞이 거대 고릴라 자리(den),
 *     문 앞에 고릴라 둘(spawns). 홀 안 구석에 상자 둘, 나머지 상자는 정글 사당(작은 이끼 조약돌 집)에.
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5. 스폰은 문틀 남쪽.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const JUNGLE_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const JUNGLE_GEN_VERSION = 1;
export const JUNGLE_GROUND_Y = 40;

const SIZE = JUNGLE_BOUNDS.sizeCX * CHUNK_SIZE;
const HEIGHT = JUNGLE_BOUNDS.sizeCY * CHUNK_SIZE;
const CENTER = SIZE / 2;
const PORTAL_FLAT_R = 8;
const WALL_R = 108;
const DIRT_DEPTH = 3;
/** 궁궐: 기단 반폭 13 (27칸), 홀 반폭 9 (19칸), 벽 높이 6 */
export const PALACE_HALF = 13;
export const HALL_HALF = 9;
export const HALL_H = 6;

export interface JungleLayout extends IslandLayout {
  /** 궁궐 가운데(기단 높이) */
  palace: { x: number; y: number; z: number };
  /** 거대 고릴라 자리 (왕좌 앞 홀 바닥) */
  den: { x: number; y: number; z: number };
  /** 문 앞 고릴라 둘 (서버가 spawns 로 세운다) */
  guards: { x: number; y: number; z: number }[];
  /** 정글 사당 가운데(바닥 높이) */
  shrines: { x: number; y: number; z: number }[];
}

export interface JungleResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: JungleLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateJungle(registry: BlockRegistry, seed: number, treasures = 4): JungleResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    mossy = B('mossy_cobblestone'),
    dirt = B('dirt'),
    grass = B('grass'),
    log = B('jungle_log'),
    leaves = B('jungle_leaves'),
    melon = B('melon'),
    goldBlock = B('gold_block'),
    emeraldBlock = B('emerald_block'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    torch = B('torch'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    gold = B('gold_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const hillA = n2(51),
    hillB = n2(52),
    mtnN = n2(53),
    edgeN = n2(54),
    forestN = n2(55);

  // ---- 높이: 굴곡이 큰 언덕, 가장자리는 산 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = JUNGLE_GROUND_Y + 5 * hillA(x / 33, z / 33) + 2 * hillB(x / 11, z / 11) + Math.max(0, mtnN(x / 55, z / 55)) * 12;
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, dist) * 34;
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (JUNGLE_GROUND_Y + 2 - h) * flat;
    return h;
  };
  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(12, Math.min(HEIGHT - 14, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(JUNGLE_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.022) return stone;
    if (r < 0.012) return coal;
    if (r < 0.018) return iron;
    return y < 32 ? gold : stone;
  };
  for (let cz = 0; cz < JUNGLE_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < JUNGLE_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < JUNGLE_BOUNDS.sizeCY; cy++) {
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

  const rng = mulberry32((seed ^ 0x9ac1e) >>> 0);
  const keepClear: { x: number; z: number; r: number }[] = [{ x: CENTER, z: CENTER, r: PORTAL_FLAT_R + 6 }];
  const isClear = (x: number, z: number, extra = 0) => keepClear.every((c) => Math.hypot(c.x - x, c.z - z) > c.r + extra);
  const treasureChests: IslandLayout['treasures'] = [];

  // ---- 정글 궁궐: 가운데서 50~75칸 ----
  const pAng = rng() * Math.PI * 2;
  const pDist = 50 + rng() * 25;
  const px = Math.round(CENTER + Math.cos(pAng) * pDist),
    pz = Math.round(CENTER + Math.sin(pAng) * pDist);
  const base = terrace(px, pz, PALACE_HALF + 2, 10);
  const mixAt = (x: number, z: number) => (hash3(x, 5, z, seed) < 0.55 ? mossy : cobble);
  // 기단 두 단: 27×27 (높이 1), 23×23 (높이 1)
  for (let dx = -PALACE_HALF; dx <= PALACE_HALF; dx++)
    for (let dz = -PALACE_HALF; dz <= PALACE_HALF; dz++) {
      set(px + dx, base + 1, pz + dz, mixAt(px + dx, pz + dz));
      if (Math.abs(dx) <= PALACE_HALF - 4 && Math.abs(dz) <= PALACE_HALF - 4) set(px + dx, base + 2, pz + dz, mixAt(px + dx + 7, pz + dz));
    }
  const FLOOR = base + 2; // 홀 바닥 높이 (둘째 단)
  // 홀: 19×19 벽 높이 6, 모서리 금 기둥, 3번째 줄 금 띠, 지붕 조약돌 + 가운데 5×5 천창
  for (let dx = -HALL_HALF; dx <= HALL_HALF; dx++)
    for (let dz = -HALL_HALF; dz <= HALL_HALF; dz++) {
      const x = px + dx,
        z = pz + dz;
      const edge = Math.abs(dx) === HALL_HALF || Math.abs(dz) === HALL_HALF;
      const corner = Math.abs(dx) === HALL_HALF && Math.abs(dz) === HALL_HALF;
      for (let y = FLOOR + 1; y <= FLOOR + HALL_H; y++) {
        if (!edge) {
          set(x, y, z, AIR_ID);
          continue;
        }
        set(x, y, z, corner ? goldBlock : y === FLOOR + 3 ? goldBlock : mixAt(x + y, z));
      }
      const skylight = Math.abs(dx) <= 2 && Math.abs(dz) <= 2;
      set(x, FLOOR + HALL_H + 1, z, skylight ? AIR_ID : cobble);
    }
  // 남쪽 문 3칸 넓이 4칸 높이 + 기단 계단(남쪽 가장자리 두 단은 그대로 한 칸씩이라 걸어 오른다)
  for (let dx = -1; dx <= 1; dx++) for (let y = FLOOR + 1; y <= FLOOR + 4; y++) set(px + dx, y, pz + HALL_HALF, AIR_ID);
  // 왕좌: 북쪽 벽 앞 에메랄드 블록 3개 + 금 블록 등받이, 그 앞이 거대 고릴라 자리
  for (let dx = -1; dx <= 1; dx++) {
    set(px + dx, FLOOR + 1, pz - HALL_HALF + 1, emeraldBlock);
    set(px + dx, FLOOR + 2, pz - HALL_HALF + 1, goldBlock);
  }
  const den = { x: px, y: FLOOR + 1, z: pz - HALL_HALF + 4 };
  // 빛: 벽 안쪽 발광석, 문 옆 횃불
  for (const [dx, dz] of [
    [-HALL_HALF + 1, -HALL_HALF + 1],
    [HALL_HALF - 1, -HALL_HALF + 1],
    [-HALL_HALF + 1, HALL_HALF - 1],
    [HALL_HALF - 1, HALL_HALF - 1],
    [0, 0],
  ] as [number, number][])
    set(px + dx, FLOOR + HALL_H, pz + dz, glowstone);
  set(px + 2, FLOOR + 1, pz + HALL_HALF - 1, torch);
  set(px - 2, FLOOR + 1, pz + HALL_HALF - 1, torch);
  // 상자: 홀 안 동서 구석 둘 (treasures 가 2 이상이면)
  const hallChests = Math.min(2, treasures);
  const hallSpots: [number, number][] = [
    [HALL_HALF - 2, -HALL_HALF + 2],
    [-HALL_HALF + 2, -HALL_HALF + 2],
  ];
  for (let i = 0; i < hallChests; i++) {
    const [dx, dz] = hallSpots[i]!;
    set(px + dx, FLOOR + 1, pz + dz, chest);
    treasureChests.push({ x: px + dx, y: FLOOR + 1, z: pz + dz });
  }
  // 고릴라 둘: 문 앞 기단 위
  const guards: JungleLayout['guards'] = [
    { x: px - 3, y: FLOOR, z: pz + HALL_HALF + 2 }, // 둘째 단 밖 첫째 단 위라 한 칸 낮다
    { x: px + 3, y: FLOOR, z: pz + HALL_HALF + 2 },
  ];
  keepClear.push({ x: px, z: pz, r: PALACE_HALF + 8 });
  const palace = { x: px, y: base, z: pz };

  // ---- 정글 사당: 남은 상자 수만큼, 가운데서 30~70칸 — 5×5 이끼 조약돌 집, 남쪽 입구 ----
  const shrines: JungleLayout['shrines'] = [];
  let left = Math.max(0, treasures - hallChests);
  let tries = 0;
  while (left > 0 && tries++ < 300) {
    const ang = rng() * Math.PI * 2;
    const d = 30 + rng() * 40;
    const sx = Math.round(CENTER + Math.cos(ang) * d),
      sz = Math.round(CENTER + Math.sin(ang) * d);
    if (!isClear(sx, sz, 8) || shrines.some((o) => Math.hypot(o.x - sx, o.z - sz) < 25)) continue;
    const floor = terrace(sx, sz, 3, 8);
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        set(sx + dx, floor, sz + dz, mixAt(sx + dx, sz + dz));
        const wall = Math.abs(dx) === 2 || Math.abs(dz) === 2;
        for (let y = floor + 1; y <= floor + 3; y++) {
          const door = dz === 2 && dx === 0 && y <= floor + 2;
          set(sx + dx, y, sz + dz, wall && !door ? mixAt(sx + dx + y, sz + dz) : AIR_ID);
        }
        set(sx + dx, floor + 4, sz + dz, mossy);
      }
    set(sx, floor + 3, sz - 1, glowstone);
    set(sx, floor + 1, sz, chest);
    treasureChests.push({ x: sx, y: floor + 1, z: sz });
    shrines.push({ x: sx, y: floor, z: sz });
    keepClear.push({ x: sx, z: sz, r: 8 });
    left--;
  }

  // ---- 정글 나무: 줄기 8~12, 둥근 잎 세 겹. 덤불·수박은 땅에 ----
  const treeAt = (x: number, z: number) => {
    const h = hAt(x, z);
    const top = h + 8 + Math.floor(hash3(x, 2, z, seed) * 5);
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    for (let dy = -1; dy <= 1; dy++) {
      const y = top + dy;
      const r = dy === 0 ? 3 : 2;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (Math.hypot(dx, dz) > r + 0.4) continue;
          if (world.getBlock(x + dx, y, z + dz) === AIR_ID) set(x + dx, y, z + dz, leaves);
        }
    }
    set(x, top + 2, z, leaves);
  };
  const trunks = new Set<number>();
  const nearTrunk = (x: number, z: number) => {
    for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) if (trunks.has((x + dx) * SIZE + z + dz)) return true;
    return false;
  };
  for (let z = 3; z < SIZE - 3; z++)
    for (let x = 3; x < SIZE - 3; x++) {
      const h = hAt(x, z);
      if (world.getBlock(x, h, z) !== grass || world.getBlock(x, h + 1, z) !== AIR_ID) continue;
      if (Math.hypot(x - CENTER, z - CENTER) > WALL_R - 4 || !isClear(x, z)) continue;
      const forest = smoothstep(-0.1, 0.6, forestN(x / 45, z / 45));
      const r = hash3(x, 1, z, seed);
      if (r < 0.02 + 0.05 * forest && !nearTrunk(x, z)) {
        trunks.add(x * SIZE + z);
        treeAt(x, z);
      } else if (r > 0.9 && r < 0.93) set(x, h + 1, z, leaves); // 덤불
      else if (r > 0.995) set(x, h + 1, z, melon); // 수박
    }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: JungleLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, palace, den, guards, shrines };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
