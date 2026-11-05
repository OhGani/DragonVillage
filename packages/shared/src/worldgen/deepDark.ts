/**
 * 깊은 어둠 생성기 — 아홉째 원정지 (256×256×96 땅속, v1.2 앞당김 #254). 포탈 4단계를 지으면 열린다(네더와 같은 단계).
 *
 * 시드 하나로 언제나 같은 땅속 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 항상 캄캄하다(nightStartsAt 0) — 처음부터 워든·스켈레톤·좀비가 나온다. 하늘빛이 없으니 발광석을 드문드문.
 *
 * 배치 (동굴처럼 통째로 돌이고 방을 판다). 위는 돌, DEEPSLATE_Y 아래는 심층암(deepslate). 맨 아래·맨 위는 기반암.
 *   - 도착 방: 가운데 반지름 7 타원 방, 바닥 조약돌. 포탈 단 + 흑요석 문틀 4×5.
 *   - 고대 도시(ancient_city): 가운데서 45~60칸. 거대한 홀(동서 61 × 남북 41 × 높이 14)을 파고 바닥은 심층암에 스컬크가 얼룩덜룩,
 *     8칸마다 심층암 기둥, 벽 발광석 드문드문. 먼 쪽 끝 가운데 흑요석 틀(9×7, "워든의 문")과 그 앞이 거대 워든 자리(den),
 *     틀 양옆에 워든 둘(spawns). 홀 양 옆벽에 작은 방 N개(treasures)에 상자.
 *   - 도착 방에서 홀까지 3×3 굴(바닥 조약돌 길), 굴 바닥에도 스컬크.
 */
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const DEEP_DARK_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const DEEP_DARK_GEN_VERSION = 1;
/** 도착 방 바닥 높이 */
export const DEEP_FLOOR_Y = 24;
/** 이 아래는 심층암 */
export const DEEPSLATE_Y = 30;
/** 고대 도시 홀: 동서 반폭 30, 남북 반폭 20, 높이 14 */
export const HALL_HALF_X = 30;
export const HALL_HALF_Z = 20;
export const HALL_HEIGHT = 14;

const SIZE = DEEP_DARK_BOUNDS.sizeCX * CHUNK_SIZE;
const HEIGHT = DEEP_DARK_BOUNDS.sizeCY * CHUNK_SIZE;
const CENTER = SIZE / 2;
const CHAMBER_R = 7;

export interface DeepDarkLayout extends IslandLayout {
  /** 고대 도시 홀 가운데(바닥 높이) */
  hall: { x: number; y: number; z: number };
  /** 거대 워든 자리 (흑요석 틀 앞 바닥) */
  den: { x: number; y: number; z: number };
  /** 틀 양옆 워든 둘 (서버가 spawns 로 세운다) */
  guards: { x: number; y: number; z: number }[];
}

export interface DeepDarkResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: DeepDarkLayout;
  ms: number;
}

export function generateDeepDark(registry: BlockRegistry, seed: number, treasures = 3): DeepDarkResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    deepslate = B('deepslate'),
    sculk = B('sculk'),
    cobble = B('cobblestone'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    diamond = B('diamond_ore'),
    lapis = B('lapis_ore');

  // ---- 통째로 돌: 위는 돌, 아래는 심층암, 광물 드문드문 ----
  const world = new VoxelWorld(DEEP_DARK_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  const oreAt = (x: number, y: number, z: number): number => {
    const r = hash3(x, y, z, seed);
    const plain = y < DEEPSLATE_Y ? deepslate : stone;
    if (r >= 0.024) return plain;
    if (r < 0.01) return coal;
    if (r < 0.016) return iron;
    if (r < 0.02) return lapis;
    return y < DEEPSLATE_Y ? diamond : plain; // 다이아는 심층암 속에만
  };
  for (let cz = 0; cz < DEEP_DARK_BOUNDS.sizeCZ; cz++)
    for (let cx = 0; cx < DEEP_DARK_BOUNDS.sizeCX; cx++)
      for (let cy = 0; cy < DEEP_DARK_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        for (let lz = 0; lz < CHUNK_SIZE; lz++)
          for (let lx = 0; lx < CHUNK_SIZE; lx++)
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const x = cx * CHUNK_SIZE + lx,
                y = by + ly,
                z = cz * CHUNK_SIZE + lz;
              let id: number;
              if (y === 0 || y === HEIGHT - 1 || ((y === 1 || y === HEIGHT - 2) && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else id = oreAt(x, y, z);
              ids[localIndex(lx, ly, lz)] = id;
            }
        world.getOrCreateChunk(cx, cy, cz).loadBlockIds(ids);
      }

  const set = (x: number, y: number, z: number, id: number) => {
    if (x >= 1 && z >= 1 && x < SIZE - 1 && z < SIZE - 1 && y >= 1 && y < HEIGHT - 1) world.setBlock(x, y, z, id);
  };
  /** 속이 빈 타원 방 (동굴과 같다). 바닥(fy-1)은 floorId */
  const carveRoom = (cx: number, fy: number, cz: number, rx: number, ry: number, floorId: number) => {
    const cy = fy + ry - 1;
    for (let x = cx - rx; x <= cx + rx; x++)
      for (let z = cz - rx; z <= cz + rx; z++) {
        const dd = ((x - cx) / rx) ** 2 + ((z - cz) / rx) ** 2;
        if (dd >= 1) continue;
        for (let y = fy; y <= cy + ry; y++) if (dd + ((y - cy) / ry) ** 2 < 1) set(x, y, z, AIR_ID);
        set(x, fy - 1, z, floorId);
      }
  };

  // ---- 도착 방 + 포탈 ----
  const PY = DEEP_FLOOR_Y;
  carveRoom(CENTER, PY + 1, CENTER, CHAMBER_R, 6, cobble);
  const portal = { x: CENTER, y: PY + 1, z: CENTER };

  // ---- 고대 도시 홀: 가운데서 45~60칸, 동서로 긴 홀. 가운데 x 는 세계 안에 들어가게 ----
  const rng = mulberry32((seed ^ 0xdeedda) >>> 0);
  const ang = rng() * Math.PI * 2;
  const dist = 45 + rng() * 15;
  const hx = Math.max(HALL_HALF_X + 8, Math.min(SIZE - HALL_HALF_X - 9, Math.round(CENTER + Math.cos(ang) * dist))),
    hz = Math.max(HALL_HALF_Z + 8, Math.min(SIZE - HALL_HALF_Z - 9, Math.round(CENTER + Math.sin(ang) * dist)));
  const HF = PY + 1; // 홀 바닥(서는 높이)
  for (let dx = -HALL_HALF_X; dx <= HALL_HALF_X; dx++)
    for (let dz = -HALL_HALF_Z; dz <= HALL_HALF_Z; dz++) {
      const x = hx + dx,
        z = hz + dz;
      for (let y = HF; y < HF + HALL_HEIGHT; y++) set(x, y, z, AIR_ID);
      // 바닥: 심층암에 스컬크 얼룩 (가운데로 갈수록 많다)
      const s = hash3(x, 3, z, seed) < 0.25 + 0.3 * (1 - Math.hypot(dx / HALL_HALF_X, dz / HALL_HALF_Z));
      set(x, HF - 1, z, s ? sculk : deepslate);
      set(x, HF + HALL_HEIGHT, z, deepslate); // 천장
      // 벽
      if (Math.abs(dx) === HALL_HALF_X || Math.abs(dz) === HALL_HALF_Z) {
        for (let y = HF; y < HF + HALL_HEIGHT; y++) set(x, y, z, hash3(x, y, z, seed ^ 0x11) < 0.03 ? glowstone : deepslate);
      }
    }
  // 기둥: 8칸마다 (벽에서 4칸 안쪽 두 줄)
  for (let dx = -HALL_HALF_X + 6; dx <= HALL_HALF_X - 6; dx += 8)
    for (const dz of [-HALL_HALF_Z + 4, HALL_HALF_Z - 4]) {
      for (let y = HF; y < HF + HALL_HEIGHT; y++) set(hx + dx, y, hz + dz, deepslate);
      set(hx + dx, HF + 4, hz + dz, glowstone);
    }
  // 워든의 문: 먼 쪽(동쪽) 끝 가운데 흑요석 틀 9 넓이 × 7 높이, 속은 비었다. 그 앞이 거대 워든 자리
  const gx = hx + HALL_HALF_X - 3;
  for (let dz = -4; dz <= 4; dz++)
    for (let y = HF; y < HF + 7; y++) {
      const edge = Math.abs(dz) === 4 || y === HF + 6;
      set(gx, y, hz + dz, edge ? obsidian : AIR_ID);
    }
  const den = { x: gx - 4, y: HF, z: hz };
  const guards: DeepDarkLayout['guards'] = [
    { x: gx - 2, y: HF, z: hz - 6 },
    { x: gx - 2, y: HF, z: hz + 6 },
  ];
  // 상자 방: 북쪽 벽 바깥에 5×5 방 N개 (treasures), 벽에 입구
  const treasureChests: IslandLayout['treasures'] = [];
  for (let i = 0; i < treasures; i++) {
    const rx = hx - HALL_HALF_X + 10 + Math.round((i * (HALL_HALF_X * 2 - 20)) / Math.max(1, treasures - 1 || 1));
    const rz = hz - HALL_HALF_Z - 4; // 방 가운데 (벽 바깥 4칸)
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        for (let y = HF; y < HF + 4; y++) set(rx + dx, y, rz + dz, AIR_ID);
        set(rx + dx, HF - 1, rz + dz, hash3(rx + dx, 4, rz + dz, seed) < 0.4 ? sculk : deepslate);
      }
    for (let dz = rz + 3; dz <= hz - HALL_HALF_Z; dz++) for (let y = HF; y < HF + 3; y++) set(rx, y, dz, AIR_ID); // 입구 굴
    set(rx, HF, rz, chest);
    set(rx, HF + 4, rz, glowstone);
    set(rx, HF + 3, rz, AIR_ID);
    treasureChests.push({ x: rx, y: HF, z: rz });
  }
  const hall = { x: hx, y: HF, z: hz };

  // ---- 도착 방 → 홀 서쪽 끝까지 3×3 굴, 바닥 조약돌 길·스컬크 ----
  const tx = hx - HALL_HALF_X,
    tz = hz;
  {
    const sx = CENTER + 0.5,
      sz = CENTER + 0.5;
    const len = Math.hypot(tx - sx, tz - sz);
    const steps = Math.ceil(len * 2);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const wob = Math.sin(t * Math.PI * 3 + seed * 0.001) * 2.5 * Math.sin(t * Math.PI);
      const px = Math.floor(sx + (tx + 0.5 - sx) * t + (-(tz - sz) / len) * wob),
        pz = Math.floor(sz + (tz + 0.5 - sz) * t + ((tx - sx) / len) * wob);
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = 0; dy <= 2; dy++) set(px + dx, HF + dy, pz + dz, AIR_ID);
          set(px + dx, HF - 1, pz + dz, hash3(px + dx, 6, pz + dz, seed) < 0.3 ? sculk : cobble);
        }
      if (i % 12 === 0) set(px, HF + 3, pz, glowstone);
    }
  }

  // ---- 포탈 단·문틀은 굴을 다 판 뒤에 (굴이 도착 방 가운데서 시작하니까) ----
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
  set(CENTER, PY + 7, CENTER, glowstone);
  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: DeepDarkLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, hall, den, guards };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
