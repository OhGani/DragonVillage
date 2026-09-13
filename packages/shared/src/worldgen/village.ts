/**
 * 마을 터 생성기 — 드래곤 빌리지 (128×128×128 = 8×8×8 청크, 결정 #59).
 *
 * 시드 하나로 언제나 같은 세계가 나온다 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 광장 높이 GROUND_Y = 40, 그 아래 40칸은 돌·광물·동굴, 위 88칸은 지을 자리.
 *   - 광장: 가운데(64,64) 반지름 14 평지, 조약돌 원 + 한가운데 돌(스폰). 조약돌 길이 동서남북으로 뻗는다.
 *   - 포탈 자리: 광장 북쪽(z 41~47) 조약돌 단 위에 흑요석 문틀 4×5 (M6 포탈 건물이 여기서 자란다).
 *   - 강: 서쪽 끝에서 동쪽 끝까지, 광장 북쪽을 크게 돌아 흐른다(z 25~45 사이). 폭 4~9, 깊이 1~3, 모래 강변. 수면 = 39.
 *   - 큰 밭 둘: 광장 서쪽(x 20~44)·동쪽(x 84~108), 농지 줄 사이에 물길, 호박·수박, 모서리에 건초 더미.
 *   - 집 뼈대: 광장 남쪽. 아들이 완성할 판자 벽·유리창·문 자리·판자 지붕.
 *   - 참나무 둘레: 가운데서 44칸 밖부터 숲(언덕과 함께 짙어짐), 안쪽은 드문드문.
 *   - 언덕: 가장자리로 갈수록 7~12칸 높아진다. 동남쪽 언덕에 동굴 입구(비스듬한 굴)가 땅속 동굴로 이어진다.
 *   - 땅속: 기반암(0~1), 돌, 광물(석탄·철·금·레드스톤·청금석·다이아·에메랄드, 깊이별), 두 노이즈가 겹치는 자리의 굴 동굴.
 */
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';

export const VILLAGE_BOUNDS: WorldBounds = { sizeCX: 8, sizeCY: 8, sizeCZ: 8 };
/** 저장 키. 생성기가 바뀌어 옛 저장과 맞지 않으면 GEN_VERSION 을 올린다 (저장 폐기 + 안내) */
export const VILLAGE_WORLD_ID = 'village';
export const VILLAGE_GEN_VERSION = 1;
/** M1 은 시드 하나. M2 에서 마을마다 서버가 정한다 */
export const DEFAULT_VILLAGE_SEED = 20260913;

/** 광장(평지) 높이. 이 위가 잔디 */
export const GROUND_Y = 40;
/** 강·밭 물길 수면 */
export const WATER_Y = GROUND_Y - 1;

const SIZE = VILLAGE_BOUNDS.sizeCX * CHUNK_SIZE; // 128
const HEIGHT = VILLAGE_BOUNDS.sizeCY * CHUNK_SIZE; // 128
const CENTER = SIZE / 2; // 64
const PLAZA_R = 14;

export interface SpawnPoint {
  x: number;
  y: number;
  z: number;
  /** 라디안. 0 = 북(-Z) */
  yaw: number;
}

export interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

/** 어디에 무엇이 있는지 (안내문·디버그·M6 건물 배치용) */
export interface VillageLayout {
  center: { x: number; z: number };
  plazaRadius: number;
  /** 흑요석 문틀 아래 가운데 */
  portal: { x: number; y: number; z: number };
  fields: [Rect, Rect];
  house: Rect;
  caveEntrance: { x: number; z: number };
}

export interface VillageResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: VillageLayout;
  /** 생성에 걸린 ms (측정용) */
  ms: number;
}

const FIELD_W: Rect = { x0: 20, z0: 54, x1: 44, z1: 74 };
const FIELD_E: Rect = { x0: 84, z0: 54, x1: 108, z1: 74 };
const HOUSE: Rect = { x0: 61, z0: 82, x1: 66, z1: 86 };
const PORTAL = { x: 64, y: GROUND_Y + 1, z: 44 };
const PORTAL_PAD: Rect = { x0: 61, z0: 41, x1: 67, z1: 47 };
const CAVE = { x: 108, z: 92 };

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function inRect(r: Rect, x: number, z: number, margin = 0): boolean {
  return x >= r.x0 - margin && x <= r.x1 + margin && z >= r.z0 - margin && z <= r.z1 + margin;
}

/** 기둥(x,z) 하나의 지형 정보 */
interface Column {
  /** 맨 위 블록 높이 (잔디/모래/강바닥) */
  h: number;
  top: number;
  /** 강 기둥이면 물이 h+1..WATER_Y */
  river: boolean;
}

export function generateVillage(registry: BlockRegistry, seed = DEFAULT_VILLAGE_SEED): VillageResult {
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
    planks = B('planks'),
    glass = B('glass'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    farmland = B('farmland'),
    hay = B('hay_bale'),
    pumpkin = B('pumpkin'),
    melon = B('melon'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    gold = B('gold_ore'),
    redstone = B('redstone_ore'),
    lapis = B('lapis_ore'),
    diamond = B('diamond_ore'),
    emerald = B('emerald_ore');

  // 노이즈마다 다른 시드 (같은 함수를 여러 용도로 쓰면 무늬가 겹친다)
  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const n3 = (salt: number) => createNoise3D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const gentleA = n2(1),
    gentleB = n2(2),
    hillN = n2(3),
    riverMeander = n2(4),
    riverWidth = n2(5),
    caveA = n3(6),
    caveB = n3(7);

  // ---- 강: x 마다 중심 z 와 반폭. 광장 북쐽을 크게 돌아간다 (x=64 에서 z≈27, 양 끝에서 z≈40) ----
  const riverCenter = (x: number) => 36 + 9 * Math.sin(x / 31 - 3.63) + 4 * riverMeander(x / 19, 0.5);
  const riverHalf = (x: number) => 3.2 + 1.3 * riverWidth(x / 23, 7.5);

  // ---- 높이 ----
  const baseHeight = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const dist = Math.hypot(dx, dz);
    const gentle = 2.2 * gentleA(x / 41, z / 41) + 0.9 * gentleB(x / 14, z / 14);
    const edge = smoothstep(44, 62, dist);
    const hill = edge * (7 + 2.5 * (hillN(x / 26, z / 26) + 1));
    let h = GROUND_Y + gentle + hill;
    // 광장은 완전 평지, 바깥으로 갈수록 자연 지형
    const plaza = 1 - smoothstep(PLAZA_R, PLAZA_R + 10, dist);
    h = h + (GROUND_Y - h) * plaza;
    // 밭·포탈 단·집 자리는 평지
    if (inRect(FIELD_W, x, z, 2) || inRect(FIELD_E, x, z, 2) || inRect(PORTAL_PAD, x, z, 2) || inRect(HOUSE, x, z, 3)) h = GROUND_Y;
    return h;
  };

  const columns: Column[] = new Array<Column>(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) {
    for (let x = 0; x < SIZE; x++) {
      let h = baseHeight(x, z);
      let top = grass;
      let river = false;
      const d = Math.abs(z - riverCenter(x));
      const w = riverHalf(x);
      if (d < w) {
        river = true;
        const depth = 1 + Math.floor(2.6 * (1 - (d / w) ** 2)); // 1..3
        h = WATER_Y - depth;
        top = depth >= 3 && hash3(x, 0, z, seed) < 0.5 ? gravel : sand;
      } else if (d < w + 4) {
        // 강변은 완만하게, 그리고 수면(39)보다 반드시 높게 — 아니면 물이 시작하자마자 옆으로 새 나간다
        const t = (d - w) / 4;
        h = Math.max(GROUND_Y, Math.min(h, GROUND_Y + t * 3));
        if (d < w + 1.5) top = sand;
      }
      const H = Math.max(24, Math.min(HEIGHT - 20, Math.round(h)));
      columns[z * SIZE + x] = { h: H, top, river };
    }
  }

  // ---- 청크 채우기 (청크마다 4096 배열을 통째로 넣는다 — setBlock 200만 번보다 훨씬 빠르다) ----
  const world = new VoxelWorld(VILLAGE_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const isCave = (x: number, y: number, z: number): boolean => {
    // 두 노이즈의 0 근처 면이 겹치는 곳 = 굴. 하나만 쓰면 얇은 판이 된다
    const a = caveA(x / 22, y / 14, z / 22);
    if (Math.abs(a) > 0.085) return false;
    const b = caveB(x / 22, y / 14, z / 22);
    return Math.abs(b) < 0.085;
  };
  const oreAt = (x: number, y: number, z: number, H: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.026) return stone;
    if (r < 0.01) return y < H - 6 ? coal : stone;
    if (r < 0.016) return y < 34 ? iron : stone;
    if (r < 0.0185) return y < 20 ? gold : stone;
    if (r < 0.0225) return y < 16 ? redstone : stone;
    if (r < 0.024) return y < 26 ? lapis : stone;
    if (r < 0.025) return y < 13 ? diamond : stone;
    return y < 30 ? emerald : stone;
  };

  for (let cz = 0; cz < VILLAGE_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < VILLAGE_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++)
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const c = columns[(cz * CHUNK_SIZE + lz) * SIZE + cx * CHUNK_SIZE + lx];
          maxH = Math.max(maxH, c.river ? WATER_Y : c.h);
        }
      for (let cy = 0; cy < VILLAGE_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break; // 그 위는 전부 공기 — 청크를 만들지 않는다
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
                if (y >= 4 && y <= H - 7 && isCave(x, y, z)) id = AIR_ID;
                else id = oreAt(x, y, z, H);
              } else if (y < H) id = c.river || c.top === sand ? sand : dirt;
              else if (y === H) id = c.top;
              else if (c.river && y <= WATER_Y) id = water;
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

  const H = (x: number, z: number) => columns[z * SIZE + x].h;
  const set = (x: number, y: number, z: number, id: number) => {
    if (y >= 0 && y < HEIGHT) world.setBlock(x, y, z, id);
  };

  // ---- 광장: 조약돌 원 + 한가운데 돌 ----
  for (let x = CENTER - 6; x <= CENTER + 6; x++)
    for (let z = CENTER - 6; z <= CENTER + 6; z++) {
      const d = Math.hypot(x - CENTER + 0.5, z - CENTER + 0.5);
      if (d <= 5.6) set(x, GROUND_Y, z, cobble);
    }
  set(CENTER, GROUND_Y, CENTER, stone);
  // 길: 광장에서 북(포탈)·남(집)·서·동(밭)으로 2칸 폭, 지형을 따라간다
  const path = (x: number, z: number) => {
    const c = columns[z * SIZE + x];
    if (!c.river && c.top === grass) set(x, c.h, z, cobble);
  };
  for (let z = PORTAL_PAD.z1 + 1; z < CENTER - 5; z++) for (const x of [CENTER - 1, CENTER]) path(x, z);
  for (let z = CENTER + 6; z < HOUSE.z0; z++) for (const x of [CENTER - 1, CENTER]) path(x, z);
  for (let x = FIELD_W.x1 + 1; x < CENTER - 5; x++) for (const z of [CENTER - 1, CENTER]) path(x, z);
  for (let x = CENTER + 6; x < FIELD_E.x0; x++) for (const z of [CENTER - 1, CENTER]) path(x, z);

  // ---- 포탈 자리: 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5 (동서로 서 있고 남쪽 광장을 본다) ----
  for (let x = PORTAL_PAD.x0; x <= PORTAL_PAD.x1; x++)
    for (let z = PORTAL_PAD.z0; z <= PORTAL_PAD.z1; z++) {
      const corner = (x === PORTAL_PAD.x0 || x === PORTAL_PAD.x1) && (z === PORTAL_PAD.z0 || z === PORTAL_PAD.z1);
      set(x, GROUND_Y, z, corner ? glowstone : cobble);
    }
  for (let x = PORTAL.x - 2; x <= PORTAL.x + 1; x++) {
    set(x, PORTAL.y, PORTAL.z, obsidian);
    set(x, PORTAL.y + 4, PORTAL.z, obsidian);
  }
  for (let y = PORTAL.y + 1; y <= PORTAL.y + 3; y++) {
    set(PORTAL.x - 2, y, PORTAL.z, obsidian);
    set(PORTAL.x + 1, y, PORTAL.z, obsidian);
  }

  // ---- 밭 둘: 농지 줄 + 5줄마다 물길, 호박·수박, 모서리 건초 ----
  const field = (r: Rect, salt: number) => {
    for (let z = r.z0; z <= r.z1; z++) {
      const channel = (z - r.z0) % 5 === 2;
      for (let x = r.x0; x <= r.x1; x++) {
        if (channel) set(x, GROUND_Y, z, water);
        else {
          set(x, GROUND_Y, z, farmland);
          const c = hash3(x, salt, z, seed);
          if (c < 0.035) set(x, GROUND_Y + 1, z, pumpkin);
          else if (c < 0.065) set(x, GROUND_Y + 1, z, melon);
        }
      }
    }
    for (const [x, z] of [
      [r.x0, r.z0],
      [r.x1, r.z0],
      [r.x0, r.z1],
      [r.x1, r.z1],
    ]) {
      set(x, GROUND_Y + 1, z, hay);
      set(x, GROUND_Y + 2, z, hay);
    }
    for (let x = r.x0 + 6; x < r.x1; x += 6) {
      set(x, GROUND_Y + 1, r.z0, hay);
      set(x, GROUND_Y + 1, r.z1, hay);
    }
  };
  field(FIELD_W, 11);
  field(FIELD_E, 12);

  // ---- 집 뼈대 (아들이 완성할 것): 판자 벽, 유리창, 북쪽 문 자리, 판자 지붕 ----
  {
    const { x0, z0, x1, z1 } = HOUSE;
    const doorX = x0 + 2;
    for (let x = x0; x <= x1; x++)
      for (let z = z0; z <= z1; z++)
        for (let y = GROUND_Y + 1; y <= GROUND_Y + 4; y++) {
          const wall = x === x0 || x === x1 || z === z0 || z === z1;
          if (!wall) continue;
          let id = planks;
          const midZ = (z0 + z1) >> 1;
          if (y === GROUND_Y + 2 && ((x === x0 && z === midZ) || (x === x1 && z === midZ) || (z === z1 && x === x0 + 2) || (z === z1 && x === x1 - 1)))
            id = glass;
          if (z === z0 && x === doorX && y <= GROUND_Y + 2) id = AIR_ID; // 문 자리 (북쪽, 광장 쪽)
          set(x, y, z, id);
        }
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) set(x, GROUND_Y + 5, z, planks);
  }

  // ---- 동굴 입구: 동남쪽 언덕에서 서쪽으로 비스듬히 내려가는 굴 (땅속 동굴과 만난다) ----
  {
    const y0 = H(CAVE.x, CAVE.z) + 1;
    for (let t = 0; t < 26; t++) {
      const cx = CAVE.x - t;
      const cy = y0 - t * 0.55;
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -1; dy <= 2; dy++)
          for (let dz = -2; dz <= 2; dz++) {
            if (dx * dx + dy * dy * 1.3 + dz * dz > 4.2) continue;
            const yy = Math.floor(cy + dy);
            if (yy >= 2) set(cx + dx, yy, CAVE.z + dz, AIR_ID);
          }
      if (t === 25) set(cx - 2, Math.floor(cy), CAVE.z, glowstone);
    }
  }

  // ---- 참나무: 가장자리 숲 + 안쪽 드문드문. 광장·밭·강·포탈·집·동굴 입구 근처는 비운다 ----
  const treeAt = (x: number, z: number) => {
    const h = H(x, z);
    const top = h + 4 + Math.floor(hash3(x, 2, z, seed) * 3); // 줄기 4~6
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
  for (let z = 2; z < SIZE - 2; z++) {
    for (let x = 2; x < SIZE - 2; x++) {
      const c = columns[z * SIZE + x];
      if (c.top !== grass) continue;
      const dist = Math.hypot(x - CENTER, z - CENTER);
      if (dist < PLAZA_R + 12) continue;
      if (inRect(FIELD_W, x, z, 3) || inRect(FIELD_E, x, z, 3) || inRect(PORTAL_PAD, x, z, 3) || inRect(HOUSE, x, z, 3)) continue;
      if (Math.abs(z - riverCenter(x)) < riverHalf(x) + 5) continue;
      if (Math.hypot(x - CAVE.x, z - CAVE.z) < 5) continue;
      if (Math.abs(x - CENTER) <= 1 || Math.abs(z - CENTER) <= 1) continue; // 길
      const p = 0.012 + 0.1 * smoothstep(40, 60, dist);
      if (hash3(x, 1, z, seed) >= p || nearTrunk(x, z)) continue;
      trunks.add(x * SIZE + z);
      treeAt(x, z);
    }
  }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: GROUND_Y + 1, z: CENTER + 0.5, yaw: 0 };
  const layout: VillageLayout = {
    center: { x: CENTER, z: CENTER },
    plazaRadius: PLAZA_R,
    portal: { ...PORTAL },
    fields: [FIELD_W, FIELD_E],
    house: HOUSE,
    caveEntrance: { ...CAVE },
  };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
