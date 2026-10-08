/**
 * 사막 생성기 — 셋째 원정지 (256×256×96 = 16×16×6 청크, v1.1-1). 포탈 2단계를 지으면 동굴과 같이 열린다.
 *
 * 시드 하나로 언제나 같은 사막 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 6분 뒤 밤(expeditions.json nightStartsAt 360) — 허스크·크리퍼·엔더맨.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 높이 DESERT_GROUND_Y = 40 둘레로 모래 언덕이 일렁인다.
 *   - 모래 4겹, 그 아래 사암 3겹, 더 아래는 돌(석탄·철·금 광맥 — 금은 y < 34). 맨 아래 기반암.
 *   - 가장자리(가운데서 108칸 밖)는 가파른 모래 산으로 막혀 세계 끝이 안 보인다.
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5 (섬·동굴과 같은 모양). 스폰은 문틀 남쪽.
 *   - 피라미드(`desert_pyramid`): 가운데서 55~80칸, 사암 계단식 21×21×9. 남쪽 입구 → 안쪽 방(5×5)에 보물 상자 둘 + 발광석.
 *   - 작은 사막 마을(아들 3차 "작은 사막 마을"): 피라미드 반대편 45~70칸, 사암 집 3채 이상(5×5, 남쪽 문) + 가운데 우물(물).
 *     남은 보물 상자는 집 안에 하나씩. 구조물 자리는 가운데 높이로 고르고 둘레 10칸을 비스듬히 이어 걸어서 들어갈 수 있다.
 *   - 오아시스 2곳: 움푹한 물웅덩이(자연 물) 둘레에 사탕수수(둘레도 경사로). 선인장은 모래 위에 드문드문(1~3칸).
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const DESERT_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const DESERT_GEN_VERSION = 1;
/** 평균 땅 높이 */
export const DESERT_GROUND_Y = 40;
/** 피라미드 밑변 반(21×21), 높이 */
export const PYRAMID_HALF = 10;
export const PYRAMID_HEIGHT = 9;

const SIZE = DESERT_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = DESERT_BOUNDS.sizeCY * CHUNK_SIZE; // 96
const CENTER = SIZE / 2; // 128
const PORTAL_FLAT_R = 8;
/** 이 거리 밖은 모래 산 */
const WALL_R = 108;
const SAND_DEPTH = 4;
const SANDSTONE_DEPTH = 3;

export interface DesertLayout extends IslandLayout {
  /** 피라미드 밑변 가운데(바닥 높이) */
  pyramid: { x: number; y: number; z: number };
  /** 사막 마을 가운데(우물) */
  village: { x: number; y: number; z: number };
  /** 오아시스 물웅덩이 가운데 */
  oases: { x: number; z: number }[];
}

export interface DesertResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: DesertLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateDesert(registry: BlockRegistry, seed: number, treasures = 4): DesertResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    sand = B('sand'),
    sandstone = B('sandstone'),
    water = B('water'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    cane = B('sugar_cane'),
    cactus = B('cactus'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    gold = B('gold_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const duneA = n2(21),
    duneB = n2(22),
    hillN = n2(23),
    edgeN = n2(24);

  // ---- 높이: 완만한 모래 언덕 + 군데군데 높은 언덕, 가장자리는 모래 산 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = DESERT_GROUND_Y + 3 * duneA(x / 31, z / 31) + 1.5 * duneB(x / 11, z / 11) + Math.max(0, hillN(x / 57, z / 57)) * 10;
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, dist) * 34; // 12~14칸 사이에 34칸 — 걸어선 못 오른다
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (DESERT_GROUND_Y + 2 - h) * flat;
    return h;
  };

  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(12, Math.min(HEIGHT - 12, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(DESERT_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.022) return stone;
    if (r < 0.012) return coal;
    if (r < 0.018) return iron;
    return y < 34 ? gold : stone;
  };
  for (let cz = 0; cz < DESERT_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < DESERT_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < DESERT_BOUNDS.sizeCY; cy++) {
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
              else if (y > H - SAND_DEPTH) id = sand;
              else if (y > H - SAND_DEPTH - SANDSTONE_DEPTH) id = sandstone;
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
  /**
   * 자리를 평평하게: 가운데 땅 높이로 발자국(±half)을 고르고, 바깥 blend 칸은 원래 땅으로 비스듬히 잇는다(한 칸씩 오르내릴 수 있게).
   * 깎은 곳은 위 네 겹을 모래로, 메운 곳은 모래로 채운다. heights 도 같이 고쳐 뒤의 선인장·오아시스가 새 땅을 본다.
   */
  const terrace = (cx: number, cz: number, half: number, blend = 10): number => {
    const lvl = hAt(cx, cz);
    for (let dx = -half - blend; dx <= half + blend; dx++)
      for (let dz = -half - blend; dz <= half + blend; dz++) {
        const x = cx + dx,
          z = cz + dz;
        if (x < 0 || z < 0 || x >= SIZE || z >= SIZE) continue;
        const h = heights[z * SIZE + x]!;
        const d = Math.max(Math.abs(dx), Math.abs(dz));
        const t = d <= half ? 0 : (d - half) / blend; // 0 = 평지, 1 = 원래 땅
        const target = Math.round(lvl + (h - lvl) * t);
        if (target === h) continue;
        if (target < h) {
          for (let y = target + 1; y <= h; y++) set(x, y, z, AIR_ID);
          for (let y = target - SAND_DEPTH + 1; y <= target; y++) set(x, y, z, sand);
        } else {
          for (let y = h + 1; y <= target; y++) set(x, y, z, sand);
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

  const rng = mulberry32((seed ^ 0xde5e27) >>> 0);
  const treasureChests: IslandLayout['treasures'] = [];
  const keepClear: { x: number; z: number; r: number }[] = [{ x: CENTER, z: CENTER, r: PORTAL_FLAT_R + 6 }];

  // ---- 피라미드: 가운데서 55~80칸 ----
  const pyrAng = rng() * Math.PI * 2;
  const pyrDist = 55 + rng() * 25;
  const px = Math.round(CENTER + Math.cos(pyrAng) * pyrDist),
    pz = Math.round(CENTER + Math.sin(pyrAng) * pyrDist);
  const pyrFloor = terrace(px, pz, PYRAMID_HALF + 1);
  for (let k = 0; k < PYRAMID_HEIGHT; k++) {
    const half = PYRAMID_HALF - k;
    for (let dx = -half; dx <= half; dx++) for (let dz = -half; dz <= half; dz++) set(px + dx, pyrFloor + 1 + k, pz + dz, sandstone);
  }
  // 안쪽 방 5×5×3 (바닥은 조약돌), 남쪽으로 2칸 높이 통로
  for (let dx = -2; dx <= 2; dx++)
    for (let dz = -2; dz <= 2; dz++) {
      set(px + dx, pyrFloor + 1, pz + dz, cobble);
      for (let y = pyrFloor + 2; y <= pyrFloor + 4; y++) set(px + dx, y, pz + dz, AIR_ID);
    }
  for (let dz = 3; dz <= PYRAMID_HALF; dz++) for (let y = pyrFloor + 2; y <= pyrFloor + 3; y++) set(px, y, pz + dz, AIR_ID);
  set(px, pyrFloor + 5, pz, glowstone);
  set(px, pyrFloor + 1, pz + 4, glowstone); // 통로 입구 바닥 불빛
  const pyramidChests = Math.min(2, treasures);
  if (pyramidChests >= 1) {
    set(px - 2, pyrFloor + 2, pz - 2, chest);
    treasureChests.push({ x: px - 2, y: pyrFloor + 2, z: pz - 2 });
  }
  if (pyramidChests >= 2) {
    set(px + 2, pyrFloor + 2, pz - 2, chest);
    treasureChests.push({ x: px + 2, y: pyrFloor + 2, z: pz - 2 });
  }
  keepClear.push({ x: px, z: pz, r: PYRAMID_HALF + 6 });
  const pyramid = { x: px, y: pyrFloor, z: pz };

  // ---- 작은 사막 마을: 피라미드 반대편 45~70칸. 집 3채 이상(남은 상자 수만큼 더), 가운데 우물 ----
  const vilAng = pyrAng + Math.PI + (rng() - 0.5) * 0.8;
  const vilDist = 45 + rng() * 25;
  const vx = Math.round(CENTER + Math.cos(vilAng) * vilDist),
    vz = Math.round(CENTER + Math.sin(vilAng) * vilDist);
  const restChests = Math.max(0, treasures - pyramidChests);
  const houseCount = Math.max(3, restChests);
  const houses: { x: number; z: number }[] = [];
  for (let i = 0; i < houseCount; i++) {
    const a = (i / houseCount) * Math.PI * 2 + rng() * 0.5;
    const d = 9 + rng() * 4;
    houses.push({ x: Math.round(vx + Math.cos(a) * d), z: Math.round(vz + Math.sin(a) * d) });
  }
  const wellFloor = terrace(vx, vz, 16); // 마을 전체를 한 높이로 (집 문 앞이 낮지 않게)
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const rim = Math.abs(dx) === 1 || Math.abs(dz) === 1;
      set(vx + dx, wellFloor + 1, vz + dz, rim ? cobble : AIR_ID);
      if (!rim) {
        set(vx, wellFloor, vz, water);
        set(vx, wellFloor - 1, vz, water);
        set(vx, wellFloor - 2, vz, cobble);
      }
    }
  let chestsLeft = restChests;
  for (const { x: hx, z: hz } of houses) {
    const floor = wellFloor;
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        set(hx + dx, floor, hz + dz, sandstone);
        const wall = Math.abs(dx) === 2 || Math.abs(dz) === 2;
        for (let y = floor + 1; y <= floor + 3; y++) {
          const door = dz === 2 && dx === 0 && y <= floor + 2;
          set(hx + dx, y, hz + dz, wall && !door ? sandstone : AIR_ID);
        }
        set(hx + dx, floor + 4, hz + dz, sandstone);
      }
    set(hx, floor + 3, hz - 1, glowstone);
    if (chestsLeft > 0) {
      set(hx, floor + 1, hz, chest);
      treasureChests.push({ x: hx, y: floor + 1, z: hz });
      chestsLeft--;
    }
  }
  keepClear.push({ x: vx, z: vz, r: 20 });
  const village = { x: vx, y: wellFloor, z: vz };

  // ---- 오아시스 2곳: 움푹한 웅덩이(반지름 4~6) 물 2겹, 둘레 사탕수수 ----
  const isClear = (x: number, z: number, extra = 0) => keepClear.every((c) => Math.hypot(c.x - x, c.z - z) > c.r + extra);
  const oases: { x: number; z: number }[] = [];
  let tries = 0;
  while (oases.length < 2 && tries++ < 100) {
    const ang = rng() * Math.PI * 2;
    const d = 30 + rng() * 55;
    const ox = Math.round(CENTER + Math.cos(ang) * d),
      oz = Math.round(CENTER + Math.sin(ang) * d);
    if (!isClear(ox, oz, 8) || oases.some((o) => Math.hypot(o.x - ox, o.z - oz) < 30)) continue;
    oases.push({ x: ox, z: oz });
    const r = 4 + rng() * 2;
    const floor = terrace(ox, oz, Math.ceil(r) + 2, 8); // 웅덩이 둘레를 한 높이로, 바깥은 경사로 (절벽이 생기면 걸음이 막힌다)
    for (let dx = -7; dx <= 7; dx++)
      for (let dz = -7; dz <= 7; dz++) {
        const dd = Math.hypot(dx, dz);
        const x = ox + dx,
          z = oz + dz;
        if (dd <= r) {
          // 물: 바닥 높이와 그 아래 한 겹
          set(x, floor - 2, z, sand);
          set(x, floor - 1, z, water);
          set(x, floor, z, water);
        } else if (dd <= r + 2.5 && hash3(x, 7, z, seed) < 0.45) {
          const n = 2 + (hash3(x, 8, z, seed) < 0.4 ? 1 : 0);
          for (let i = 1; i <= n; i++) set(x, floor + i, z, cane);
        }
      }
    keepClear.push({ x: ox, z: oz, r: 10 });
  }

  // ---- 선인장: 모래 위 드문드문, 1~3칸. 구조물·포탈·오아시스 근처는 비운다 ----
  for (let z = 2; z < SIZE - 2; z++)
    for (let x = 2; x < SIZE - 2; x++) {
      if (hash3(x, 9, z, seed) >= 0.004) continue;
      if (!isClear(x, z)) continue;
      const h = hAt(x, z);
      if (Math.hypot(x - CENTER, z - CENTER) > WALL_R - 4) continue;
      if (world.getBlock(x, h, z) !== sand || world.getBlock(x, h + 1, z) !== AIR_ID) continue;
      const n = 1 + Math.floor(hash3(x, 10, z, seed) * 3);
      for (let i = 1; i <= n; i++) set(x, h + i, z, cactus);
    }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: DesertLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, pyramid, village, oases };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
