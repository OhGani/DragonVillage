/**
 * 동굴 생성기 — 둘째 원정지 (192×64×192 = 12×4×12 청크, M7-3). 포탈 2단계를 지으면 갈 수 있다.
 *
 * 시드 하나로 언제나 같은 동굴 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 항상 어두움(expeditions.json nightStartsAt 0) — 하늘이 없다. 빛은 발광석·용암·가져간 횃불만.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동).
 *   - 세계 전체가 돌덩이. 맨 아래(0)·맨 위(63) 기반암 — 위로 파고 나갈 수 없다.
 *   - 굴: 3D 노이즈 두 개가 동시에 0 근처인 곳(벌레 굴) + 큼직한 방 노이즈. 굵기는 깊을수록 조금 넓다.
 *     4칸 격자에서 노이즈를 재고 사이는 보간한다(빠르게).
 *   - 도착 방: 가운데(96, 바닥 29) 타원 방 반지름 12. 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5 (섬·마을과 같은 모양).
 *     모서리 네 곳에 발광석 기둥. 스폰은 문틀 남쪽.
 *   - 보물 방 N개(expeditions.json treasures): 가운데서 40~70칸, 시드로 각도. 둥근 방(반지름 4.5) 바닥 조약돌, 가운데 상자, 천장 발광석.
 *     **도착 방에서 보물 방까지 3×3 굴을 반드시 판다**(바닥 조약돌 길) — 길을 따라가면 다 찾는다.
 *   - 거미 왕의 굴(`spider_king_den`, 35%): 반지름 9 큰 방, 어둡고 바닥 조약돌, 돌기둥 넷. 굴도 판다. 거미 왕은 M7-4.
 *   - 광맥: 석탄·철(어디나), 금(y<40), 레드스톤(y<32), 청금석(y<30), 다이아몬드(y<16) — expeditions.json depthBonus.
 *   - 용암 호수: y ≤ 9 의 굴은 용암. 굴 천장에 드문드문 발광석.
 */
import { createNoise3D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const CAVE_BOUNDS: WorldBounds = { sizeCX: 12, sizeCY: 4, sizeCZ: 12 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const CAVE_GEN_VERSION = 1;
/** 이 높이 아래의 굴은 용암 */
export const LAVA_Y = 9;
/** 도착 방 바닥(단) 높이 */
export const CAVE_FLOOR_Y = 29;
/** 거미 왕의 굴이 생길 확률 (expeditions.json cave.boss.spawnChance) */
export const DEN_CHANCE = 0.35;

const SIZE = CAVE_BOUNDS.sizeCX * CHUNK_SIZE; // 192
const HEIGHT = CAVE_BOUNDS.sizeCY * CHUNK_SIZE; // 64
const CENTER = SIZE / 2; // 96
const CARVE_MIN_Y = 4;
const CARVE_MAX_Y = 57;
const CHAMBER_R = 12;
const GRID = 4;

export interface CaveLayout extends IslandLayout {
  /** 거미 왕의 굴 바닥 가운데 (없으면 null) */
  den: { x: number; y: number; z: number } | null;
}

export interface CaveResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: CaveLayout;
  ms: number;
}

export function generateCave(registry: BlockRegistry, seed: number, treasures = 4): CaveResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    lava = B('lava'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    gold = B('gold_ore'),
    redstone = B('redstone_ore'),
    lapis = B('lapis_ore'),
    diamond = B('diamond_ore');

  // ---- 노이즈: 4칸 격자에서 재고 보간 ----
  const n3 = (salt: number) => createNoise3D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const wormA = n3(21),
    wormB = n3(22),
    roomN = n3(23);
  const GX = SIZE / GRID + 1,
    GY = HEIGHT / GRID + 1;
  const gA = new Float32Array(GX * GY * GX),
    gB = new Float32Array(GX * GY * GX),
    gR = new Float32Array(GX * GY * GX);
  const gi = (x: number, y: number, z: number) => (z * GY + y) * GX + x;
  for (let z = 0; z < GX; z++)
    for (let y = 0; y < GY; y++)
      for (let x = 0; x < GX; x++) {
        const wx = x * GRID,
          wy = y * GRID,
          wz = z * GRID;
        const i = gi(x, y, z);
        gA[i] = wormA(wx / 30, wy / 18, wz / 30);
        gB[i] = wormB(wx / 30, wy / 18, wz / 30);
        gR[i] = roomN(wx / 46, wy / 28, wz / 46);
      }
  const sample = (g: Float32Array, x: number, y: number, z: number): number => {
    const x0 = x >> 2,
      y0 = y >> 2,
      z0 = z >> 2;
    const fx = (x & 3) / GRID,
      fy = (y & 3) / GRID,
      fz = (z & 3) / GRID;
    const c000 = g[gi(x0, y0, z0)]!,
      c100 = g[gi(x0 + 1, y0, z0)]!,
      c010 = g[gi(x0, y0 + 1, z0)]!,
      c110 = g[gi(x0 + 1, y0 + 1, z0)]!,
      c001 = g[gi(x0, y0, z0 + 1)]!,
      c101 = g[gi(x0 + 1, y0, z0 + 1)]!,
      c011 = g[gi(x0, y0 + 1, z0 + 1)]!,
      c111 = g[gi(x0 + 1, y0 + 1, z0 + 1)]!;
    const a = c000 + (c100 - c000) * fx,
      b = c010 + (c110 - c010) * fx,
      c = c001 + (c101 - c001) * fx,
      d = c011 + (c111 - c011) * fx;
    const e = a + (b - a) * fy,
      f = c + (d - c) * fy;
    return e + (f - e) * fz;
  };
  const isCarved = (x: number, y: number, z: number): boolean => {
    if (y < CARVE_MIN_Y || y > CARVE_MAX_Y) return false;
    const t = 0.085 + 0.03 * (1 - y / HEIGHT); // 깊을수록 조금 굵다
    if (Math.abs(sample(gA, x, y, z)) < t && Math.abs(sample(gB, x, y, z)) < t) return true;
    return sample(gR, x, y, z) > 0.58;
  };
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    if (r >= 0.035) return stone;
    if (r < 0.012) return coal;
    if (r < 0.02) return iron;
    if (r < 0.0235 && y < 40) return gold;
    if (r < 0.0295 && y < 32) return redstone;
    if (r < 0.0315 && y < 30) return lapis;
    if (r < 0.033 && y < 16) return diamond;
    return stone;
  };

  // ---- 채우기: 청크 기둥(16×16×64)마다 위→아래로 만들고 4개 청크로 나눈다 ----
  const world = new VoxelWorld(CAVE_BOUNDS);
  const colIds = new Uint16Array(CHUNK_SIZE * CHUNK_SIZE * HEIGHT);
  const ci = (lx: number, y: number, lz: number) => (lz * CHUNK_SIZE + lx) * HEIGHT + y;
  const ids = new Uint16Array(CHUNK_VOLUME);
  for (let cz = 0; cz < CAVE_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < CAVE_BOUNDS.sizeCX; cx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const z = cz * CHUNK_SIZE + lz;
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const x = cx * CHUNK_SIZE + lx;
          let aboveStone = false;
          for (let y = HEIGHT - 1; y >= 0; y--) {
            let id: number;
            if (y === 0 || y === HEIGHT - 1 || ((y === 1 || y === HEIGHT - 2) && hash3(x, y, z, seed) < 0.5)) id = bedrock;
            else if (isCarved(x, y, z)) {
              id = y <= LAVA_Y ? lava : AIR_ID;
              // 천장에 드문드문 발광석
              if (id === AIR_ID && aboveStone && hash3(x, y, z, seed ^ 0x5eed) < 0.012) colIds[ci(lx, y + 1, lz)] = glowstone;
            } else id = oreAt(x, y, z);
            colIds[ci(lx, y, lz)] = id;
            aboveStone = id !== AIR_ID && id !== lava;
          }
        }
      }
      for (let cy = 0; cy < CAVE_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        for (let lz = 0; lz < CHUNK_SIZE; lz++)
          for (let lx = 0; lx < CHUNK_SIZE; lx++)
            for (let ly = 0; ly < CHUNK_SIZE; ly++) ids[localIndex(lx, ly, lz)] = colIds[ci(lx, by + ly, lz)]!;
        world.getOrCreateChunk(cx, cy, cz).loadBlockIds(ids);
      }
    }
  }

  const set = (x: number, y: number, z: number, id: number) => {
    if (x >= 1 && z >= 1 && x < SIZE - 1 && z < SIZE - 1 && y >= 1 && y < HEIGHT - 1) world.setBlock(x, y, z, id);
  };
  /** 속이 빈 타원 방. 바닥(fy-1)은 floorId, 그 아래 두 칸은 돌(용암·굴로 빠지지 않게) */
  const carveRoom = (cx: number, fy: number, cz: number, rx: number, ry: number, floorId: number) => {
    const cy = fy + ry - 1;
    for (let x = cx - rx; x <= cx + rx; x++)
      for (let z = cz - rx; z <= cz + rx; z++) {
        const dd = ((x - cx) / rx) ** 2 + ((z - cz) / rx) ** 2;
        if (dd >= 1) continue;
        for (let y = fy; y <= cy + ry; y++) if (dd + ((y - cy) / ry) ** 2 < 1) set(x, y, z, AIR_ID);
        set(x, fy - 1, z, floorId);
        set(x, fy - 2, z, stone);
        set(x, fy - 3, z, stone);
      }
  };

  // ---- 도착 방 (단·문틀·기둥은 굴을 다 판 뒤에 놓는다 — 굴이 지나가도 남게) ----
  const PY = CAVE_FLOOR_Y;
  carveRoom(CENTER, PY + 1, CENTER, CHAMBER_R, 7, stone);
  const portal = { x: CENTER, y: PY + 1, z: CENTER };

  // ---- 보물 방·거미 굴 자리: 가운데서 40~70칸, 서로 24칸 이상 ----
  const rng = mulberry32((seed ^ 0xca7e) >>> 0);
  const spots: { x: number; y: number; z: number; den: boolean }[] = [];
  const wantDen = hash3(1, 2, 3, seed ^ 0xd3a) < DEN_CHANCE;
  const want = treasures + (wantDen ? 1 : 0);
  let tries = 0;
  while (spots.length < want && tries++ < 300) {
    const ang = rng() * Math.PI * 2;
    const r = 40 + rng() * 30;
    const x = Math.round(CENTER + Math.cos(ang) * r),
      z = Math.round(CENTER + Math.sin(ang) * r);
    if (x < 14 || z < 14 || x > SIZE - 15 || z > SIZE - 15) continue;
    if (spots.some((o) => Math.hypot(o.x - x, o.z - z) < 24)) continue;
    const y = Math.max(12, Math.min(48, PY + 1 + Math.round((rng() - 0.55) * 26)));
    spots.push({ x, y, z, den: wantDen && spots.length === 0 });
  }

  /** 도착 방에서 그 자리까지 3×3 굴 (바닥 조약돌 길) */
  const tunnelTo = (tx: number, ty: number, tz: number) => {
    const sx = CENTER + 0.5,
      sy = PY + 1,
      sz = CENTER + 0.5;
    const len = Math.hypot(tx - sx, tz - sz);
    const steps = Math.ceil(len * 2);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const wob = Math.sin(t * Math.PI * 3 + seed * 0.001) * 2.5 * Math.sin(t * Math.PI); // 살짝 굽은 길, 양끝은 곧다
      const px = Math.floor(sx + (tx + 0.5 - sx) * t + (-(tz - sz) / len) * wob),
        pz = Math.floor(sz + (tz + 0.5 - sz) * t + ((tx - sx) / len) * wob),
        py = Math.round(sy + (ty - sy) * t);
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = 0; dy <= 2; dy++) set(px + dx, py + dy, pz + dz, AIR_ID);
          set(px + dx, py - 1, pz + dz, cobble);
          const below = world.getBlock(px + dx, py - 2, pz + dz);
          if (below === AIR_ID || below === lava) set(px + dx, py - 2, pz + dz, stone);
        }
    }
  };

  const treasureChests: CaveLayout['treasures'] = [];
  let den: CaveLayout['den'] = null;
  for (const s of spots) {
    if (s.den) {
      carveRoom(s.x, s.y, s.z, 9, 5, cobble);
      for (const [dx, dz] of [
        [-5, -5],
        [5, -5],
        [-5, 5],
        [5, 5],
      ] as [number, number][])
        for (let y = s.y; y <= s.y + 4; y++) set(s.x + dx, y, s.z + dz, stone);
      den = { x: s.x, y: s.y, z: s.z };
    } else {
      carveRoom(s.x, s.y, s.z, 4, 3, cobble);
      set(s.x, s.y, s.z, chest);
      set(s.x, s.y + 6, s.z, glowstone); // 방 천장 바로 위 — 아래로 빛이 든다
      set(s.x, s.y + 5, s.z, AIR_ID);
      treasureChests.push({ x: s.x, y: s.y, z: s.z });
    }
    tunnelTo(s.x, s.y, s.z);
  }
  // ---- 굴을 다 판 뒤: 상자, 조약돌 단(모서리 발광석), 흑요석 문틀, 방 모서리 발광석 기둥 넷 ----
  for (const t of treasureChests) set(t.x, t.y, t.z, chest);
  for (let x = CENTER - 4; x <= CENTER + 3; x++)
    for (let z = CENTER - 3; z <= CENTER + 3; z++) {
      const corner = (x === CENTER - 4 || x === CENTER + 3) && (z === CENTER - 3 || z === CENTER + 3);
      set(x, PY, z, corner ? glowstone : cobble);
    }
  for (const [dx, dz] of [
    [-8, -8],
    [8, -8],
    [-8, 8],
    [8, 8],
  ] as [number, number][]) {
    for (let y = PY + 1; y <= PY + 3; y++) set(CENTER + dx, y, CENTER + dz, cobble);
    set(CENTER + dx, PY + 4, CENTER + dz, glowstone);
  }
  for (let x = portal.x - 2; x <= portal.x + 1; x++) {
    set(x, portal.y, portal.z, obsidian);
    set(x, portal.y + 4, portal.z, obsidian);
  }
  for (let y = portal.y + 1; y <= portal.y + 3; y++) {
    set(portal.x - 2, y, portal.z, obsidian);
    set(portal.x + 1, y, portal.z, obsidian);
    set(portal.x - 1, y, portal.z, AIR_ID);
    set(portal.x, y, portal.z, AIR_ID);
  }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: CaveLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, den };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
