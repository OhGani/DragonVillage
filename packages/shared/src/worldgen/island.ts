/**
 * 초원 섬 생성기 — 첫 원정지 (256×256×128 = 16×16×8 청크, M3).
 *
 * 시드 하나로 언제나 같은 섬이 나온다 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 원정마다 서버가 새 시드를 정하고, 클라는 시드만 받아 같은 섬을 만든다. 저장하지 않는다(DESIGN 3절).
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 수면 SEA_Y = 40.
 *   - 섬: 가운데(128,128) 반지름 ~100 의 둥근 땅(가장자리는 노이즈로 울퉁불퉁). 바깥은 얕은 바다 → 깊은 바다(자연 물, 무한).
 *   - 높이: 해변(모래, 수면 근처) → 잔디 들판 → 가운데·군데군데 언덕(최고 +18). 도착 포탈 둘레 반지름 8 은 평지.
 *   - 도착 포탈: 섬 가운데 조약돌 단 + 흑요석 문틀 4×5 (마을 포탈과 같은 모양, 이 안으로 들어가면 귀환). 스폰은 문틀 남쪽.
 *   - 참나무 숲: 숲 노이즈가 높은 곳에 빽빽, 그 외 드문드문. 포탈·보물 오두막 근처는 비운다.
 *   - 물가 사탕수수(잔디·모래 위, 물 옆), 호박·수박 덤불, 자갈 해변 조각.
 *   - 땅속: 기반암, 돌, 석탄·철(얕은 광물만 — 금·다이아는 동굴 원정지), 작은 굴.
 *   - 보물 오두막 N개(expeditions.json treasures): 조약돌 5×5×3, 안에 상자 + 발광석. 가운데서 45~75칸, 시드로 각도 배치.
 */
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { SpawnPoint } from './village';

export const ISLAND_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 8, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const ISLAND_GEN_VERSION = 1;
/** 수면 */
export const SEA_Y = 40;

const SIZE = ISLAND_BOUNDS.sizeCX * CHUNK_SIZE; // 256
const HEIGHT = ISLAND_BOUNDS.sizeCY * CHUNK_SIZE; // 128
const CENTER = SIZE / 2; // 128
const ISLAND_R = 100;
const PORTAL_FLAT_R = 8;

export interface IslandLayout {
  center: { x: number; z: number };
  /** 흑요석 문틀 아래 가운데 */
  portal: { x: number; y: number; z: number };
  /** 보물 오두막의 상자 위치 */
  treasures: { x: number; y: number; z: number }[];
}

export interface IslandResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: IslandLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

interface Column {
  /** 맨 위 땅 블록 높이 */
  h: number;
  top: number;
  /** 바다 기둥이면 물이 h+1..SEA_Y */
  sea: boolean;
}

export function generateIsland(registry: BlockRegistry, seed: number, treasures = 3): IslandResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    dirt = B('dirt'),
    grass = B('grass'),
    sand = B('sand'),
    gravel = B('gravel'),
    water = B('water'),
    log = B('log'),
    leaves = B('leaves'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    cane = B('sugar_cane'),
    pumpkin = B('pumpkin'),
    melon = B('melon'),
    coal = B('coal_ore'),
    iron = B('iron_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const n3 = (salt: number) => createNoise3D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const edgeN = n2(11),
    hillA = n2(12),
    hillB = n2(13),
    gentleN = n2(14),
    forestN = n2(15),
    caveA = n3(16),
    caveB = n3(17);

  // ---- 높이 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    // 가장자리를 노이즈로 흔든다 (둥글지만 울퉁불퉁한 섬)
    const r = ISLAND_R + 14 * edgeN(Math.cos(ang) * 1.7, Math.sin(ang) * 1.7) + 5 * edgeN(x / 37, z / 37);
    const inland = 1 - smoothstep(r - 22, r + 6, dist); // 1 = 섬 안쪽, 0 = 바다
    const gentle = 1.5 * gentleN(x / 33, z / 33);
    const hills = Math.max(0, hillA(x / 47, z / 47)) * 11 + Math.max(0, hillB(x / 21, z / 21)) * 5;
    let h = SEA_Y - 12 + inland * (15 + gentle + hills * smoothstep(0.35, 0.8, inland));
    // 포탈 둘레는 평지
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 10, dist);
    h = h + (SEA_Y + 3 - h) * flat;
    return h;
  };

  const columns: Column[] = new Array<Column>(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) {
    for (let x = 0; x < SIZE; x++) {
      const H = Math.max(20, Math.min(HEIGHT - 20, Math.round(heightAt(x, z))));
      const sea = H < SEA_Y;
      let top = grass;
      if (sea) top = H >= SEA_Y - 3 ? sand : hash3(x, 0, z, seed) < 0.3 ? gravel : sand;
      else if (H <= SEA_Y + 1) top = sand;
      else if (H === SEA_Y + 2 && hash3(x, 3, z, seed) < 0.5) top = sand;
      columns[z * SIZE + x] = { h: H, top, sea };
    }
  }

  // ---- 청크 채우기 ----
  const world = new VoxelWorld(ISLAND_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const isCave = (x: number, y: number, z: number): boolean => {
    const a = caveA(x / 24, y / 15, z / 24);
    if (Math.abs(a) > 0.07) return false;
    return Math.abs(caveB(x / 24, y / 15, z / 24)) < 0.07;
  };
  const oreAt = (x: number, y: number, z: number, H: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.02) return stone;
    if (r < 0.012) return y < H - 5 ? coal : stone;
    return y < 34 ? iron : stone;
  };

  for (let cz = 0; cz < ISLAND_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < ISLAND_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++)
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const c = columns[(cz * CHUNK_SIZE + lz) * SIZE + cx * CHUNK_SIZE + lx];
          maxH = Math.max(maxH, c.sea ? SEA_Y : c.h);
        }
      for (let cy = 0; cy < ISLAND_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const c = columns[z * SIZE + x];
            const H = c.h;
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || (y === 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y <= H - 4) {
                if (y >= 4 && y <= H - 7 && !c.sea && isCave(x, y, z)) id = AIR_ID;
                else id = oreAt(x, y, z, H);
              } else if (y < H) id = c.sea || c.top === sand ? sand : dirt;
              else if (y === H) id = c.top;
              else if (c.sea && y <= SEA_Y) id = water;
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

  const col = (x: number, z: number) => columns[z * SIZE + x];
  const set = (x: number, y: number, z: number, id: number) => {
    if (x >= 0 && z >= 0 && x < SIZE && z < SIZE && y >= 0 && y < HEIGHT) world.setBlock(x, y, z, id);
  };
  const nearWater = (x: number, z: number): boolean => {
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const c = col(Math.max(0, Math.min(SIZE - 1, x + dx)), Math.max(0, Math.min(SIZE - 1, z + dz)));
      if (c.sea) return true;
    }
    return false;
  };

  // ---- 도착 포탈: 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5 (동서로 서 있고 남쪽을 본다) ----
  const PY = col(CENTER, CENTER).h;
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

  // ---- 보물 오두막: 가운데서 45~75칸, 시드로 각도. 땅(바다 아닌 곳)만 ----
  const rng = mulberry32((seed ^ 0x51ed27) >>> 0);
  const huts: { x: number; z: number }[] = [];
  const treasureChests: IslandLayout['treasures'] = [];
  let tries = 0;
  while (huts.length < treasures && tries++ < 200) {
    const ang = rng() * Math.PI * 2;
    const r = 45 + rng() * 30;
    const hx = Math.round(CENTER + Math.cos(ang) * r),
      hz = Math.round(CENTER + Math.sin(ang) * r);
    if (hx < 4 || hz < 4 || hx >= SIZE - 4 || hz >= SIZE - 4) continue;
    if (col(hx, hz).sea || col(hx, hz).h <= SEA_Y + 1) continue;
    if (huts.some((o) => Math.hypot(o.x - hx, o.z - hz) < 24)) continue;
    huts.push({ x: hx, z: hz });
  }
  for (const { x: hx, z: hz } of huts) {
    // 바닥 높이 = 5×5 안 가장 높은 땅. 그 위에 벽 3칸, 지붕. 문은 남쪽 가운데
    let floor = 0;
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) floor = Math.max(floor, col(hx + dx, hz + dz).h);
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        // 바닥 아래를 돌로 채워 공중에 뜨지 않게
        for (let y = col(hx + dx, hz + dz).h + 1; y <= floor; y++) set(hx + dx, y, hz + dz, cobble);
        set(hx + dx, floor, hz + dz, cobble);
        const wall = Math.abs(dx) === 2 || Math.abs(dz) === 2;
        for (let y = floor + 1; y <= floor + 3; y++) {
          const door = dz === 2 && dx === 0 && y <= floor + 2;
          set(hx + dx, y, hz + dz, wall && !door ? cobble : AIR_ID);
        }
        set(hx + dx, floor + 4, hz + dz, cobble);
      }
    set(hx, floor + 1, hz, chest);
    set(hx, floor + 3, hz - 1, glowstone);
    treasureChests.push({ x: hx, y: floor + 1, z: hz });
  }
  const nearHut = (x: number, z: number) => huts.some((o) => Math.abs(o.x - x) <= 4 && Math.abs(o.z - z) <= 4);

  // ---- 나무·사탕수수·호박·수박 ----
  const treeAt = (x: number, z: number) => {
    const h = col(x, z).h;
    const top = h + 4 + Math.floor(hash3(x, 2, z, seed) * 3);
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    for (let dy = -2; dy <= 1; dy++) {
      const y = top + dy;
      const r = dy <= -1 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && dy <= 0) continue;
          if (r === 2 && Math.abs(dx) === 2 && Math.abs(dz) === 2 && hash3(x + dx, y, z + dz, seed) < 0.5) continue;
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
  for (let z = 3; z < SIZE - 3; z++) {
    for (let x = 3; x < SIZE - 3; x++) {
      const c = col(x, z);
      if (c.sea) continue;
      const distC = Math.hypot(x - CENTER, z - CENTER);
      if (c.top === grass) {
        if (distC < PORTAL_FLAT_R + 6 || nearHut(x, z)) continue;
        const forest = smoothstep(0.1, 0.6, forestN(x / 45, z / 45));
        const p = 0.006 + 0.09 * forest;
        const r = hash3(x, 1, z, seed);
        if (r < p) {
          if (nearTrunk(x, z)) continue;
          trunks.add(x * SIZE + z);
          treeAt(x, z);
        } else if (r > 0.997) set(x, c.h + 1, z, hash3(x, 4, z, seed) < 0.5 ? pumpkin : melon);
      }
      // 사탕수수: 물가 잔디·모래 위 2~3칸
      if ((c.top === grass || c.top === sand) && c.h <= SEA_Y + 2 && nearWater(x, z) && hash3(x, 5, z, seed) < 0.22) {
        const n = 2 + (hash3(x, 6, z, seed) < 0.4 ? 1 : 0);
        for (let i = 1; i <= n; i++) set(x, c.h + i, z, cane);
      }
    }
  }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: IslandLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
