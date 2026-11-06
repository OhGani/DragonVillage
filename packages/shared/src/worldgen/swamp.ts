/**
 * 늪 생성기 — 열한째 원정지 (256×256×96, 아빠 2026-11-06 "원정지 3개 더"). 늪 포탈을 지으면 열린다.
 *
 * 시드 하나로 언제나 같은 늪 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 * 낮 5분 뒤 밤(expeditions.json nightStartsAt 300) — 슬라임·좀비·마녀.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 SWAMP_GROUND_Y = 40 둘레로 아주 평평하고 낮다.
 *   - 땅보다 낮은 곳은 얕은 물(깊이 1~2) 웅덩이. 잔디 1겹, 흙 3겹, 그 아래 돌. 가장자리(108칸 밖)는 언덕.
 *   - 늪 참나무: 줄기 4~6, 넓게 퍼지고 아래로 늘어진 잎. 물가에 버섯(갈색·빨강).
 *   - 마녀 오두막(witch_hut): 가운데서 30~45칸. 가문비 원목 기둥 위(땅 + 2) 가문비 판자 7×9 오두막, 남쪽 문 + 계단.
 *     안에 상자 하나, 오두막 앞에 마녀 둘(spawns).
 *   - 슬라임 웅덩이(slime_pit): 가운데서 55~75칸. 반지름 11 둥근 구덩이(깊이 4), 가장자리는 이끼 낀 조약돌, 바닥은 흙·슬라임 블록 얼룩.
 *     가운데가 큰 슬라임 자리(den), 둘레에 슬라임 넷(spawns). 남쪽에 내려가는 비탈.
 *   - 나머지 상자는 물가 버려진 상자(늪 바닥 판자 위).
 *   - 도착 포탈: 가운데 조약돌 단(모서리 발광석) + 흑요석 문틀 4×5. 스폰은 문틀 남쪽.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const SWAMP_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const SWAMP_GEN_VERSION = 1;
export const SWAMP_GROUND_Y = 40;

const SIZE = SWAMP_BOUNDS.sizeCX * CHUNK_SIZE;
const HEIGHT = SWAMP_BOUNDS.sizeCY * CHUNK_SIZE;
const CENTER = SIZE / 2;
const PORTAL_FLAT_R = 8;
const WALL_R = 108;
const DIRT_DEPTH = 3;
/** 슬라임 웅덩이 반지름·깊이 */
export const PIT_R = 11;
export const PIT_DEPTH = 4;

export interface SwampLayout extends IslandLayout {
  /** 마녀 오두막 바닥 가운데 (판자 바닥 높이) */
  hut: { x: number; y: number; z: number };
  /** 슬라임 웅덩이 가운데 바닥 */
  pit: { x: number; y: number; z: number };
  /** 큰 슬라임 자리 */
  den: { x: number; y: number; z: number };
  /** 마녀 둘 (오두막 앞) */
  witches: { x: number; y: number; z: number }[];
  /** 슬라임 넷 (웅덩이 둘레) */
  slimes: { x: number; y: number; z: number }[];
}

export interface SwampResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: SwampLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateSwamp(registry: BlockRegistry, seed: number, treasures = 3): SwampResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    mossy = B('mossy_cobblestone'),
    dirt = B('dirt'),
    grass = B('grass'),
    water = B('water'),
    log = B('log'),
    leaves = B('leaves'),
    spruceLog = B('spruce_log'),
    sprucePlanks = B('spruce_planks'),
    slimeBlock = B('slime_block'),
    brownM = B('brown_mushroom'),
    redM = B('red_mushroom'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    torch = B('torch'),
    coal = B('coal_ore'),
    iron = B('iron_ore');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const lowA = n2(81),
    lowB = n2(82),
    edgeN = n2(83),
    treeN = n2(84);
  const G = SWAMP_GROUND_Y;

  // ---- 높이: 땅 G 둘레로 ±2, 낮은 곳은 물 (물 높이 = G) ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const d = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = G - 0.2 + 1.6 * lowA(x / 26, z / 26) + 0.8 * lowB(x / 7, z / 7);
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, d) * 26;
    const flat = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 8, d);
    h = h + (G + 1 - h) * flat;
    return h;
  };
  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(G - 2, Math.min(HEIGHT - 14, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  // ---- 청크 채우기: H < G 이면 H+1..G 가 물 ----
  const world = new VoxelWorld(SWAMP_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  for (let cz = 0; cz < SWAMP_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < SWAMP_BOUNDS.sizeCX; cx++) {
      let maxH = G;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < SWAMP_BOUNDS.sizeCY; cy++) {
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
              else if (y > H) id = y <= G ? water : AIR_ID;
              else if (y === H) id = H < G ? dirt : grass;
              else if (y > H - 1 - DIRT_DEPTH) id = dirt;
              else {
                const r = hash3(x, y, z, seed);
                id = r < 0.012 ? coal : r < 0.018 ? iron : stone;
              }
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
  /** 둘레를 높이 lvl 의 마른 땅으로 (물은 메운다) */
  const dryPad = (cx: number, cz: number, half: number, lvl: number) => {
    for (let dx = -half; dx <= half; dx++)
      for (let dz = -half; dz <= half; dz++) {
        const x = cx + dx,
          z = cz + dz;
        if (x < 0 || z < 0 || x >= SIZE || z >= SIZE) continue;
        const h = heights[z * SIZE + x]!;
        for (let y = Math.min(h, lvl) - 2; y < lvl; y++) set(x, y, z, dirt);
        set(x, lvl, z, grass);
        for (let y = lvl + 1; y <= Math.max(h, G) + 2; y++) set(x, y, z, AIR_ID);
        heights[z * SIZE + x] = lvl;
      }
  };

  // ---- 도착 포탈 ----
  const PY = G + 1;
  dryPad(CENTER, CENTER, PORTAL_FLAT_R, PY);
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

  const rng = mulberry32((seed ^ 0x5a3b9) >>> 0);
  const keepClear: { x: number; z: number; r: number }[] = [{ x: CENTER, z: CENTER, r: PORTAL_FLAT_R + 4 }];
  const isClear = (x: number, z: number, extra = 0) => keepClear.every((c) => Math.hypot(c.x - x, c.z - z) > c.r + extra);
  const treasureChests: IslandLayout['treasures'] = [];

  // ---- 마녀 오두막: 가운데서 30~45칸 ----
  const hAng = rng() * Math.PI * 2;
  const hDist = 30 + rng() * 15;
  const hx = Math.round(CENTER + Math.cos(hAng) * hDist),
    hz = Math.round(CENTER + Math.sin(hAng) * hDist);
  const HF = G + 3; // 판자 바닥 (물 위 세 칸)
  // 둘레 땅을 G 높이 마른 땅으로 (기둥이 서고, 앞에 마녀가 선다)
  dryPad(hx, hz + 6, 4, G);
  for (const [dx, dz] of [
    [-3, -4],
    [3, -4],
    [-3, 4],
    [3, 4],
  ] as [number, number][])
    for (let y = Math.min(hAt(hx + dx, hz + dz), G) - 2; y < HF; y++) set(hx + dx, y, hz + dz, spruceLog);
  for (let dx = -3; dx <= 3; dx++)
    for (let dz = -4; dz <= 4; dz++) {
      const x = hx + dx,
        z = hz + dz;
      set(x, HF, z, sprucePlanks);
      const edge = Math.abs(dx) === 3 || Math.abs(dz) === 4;
      for (let y = HF + 1; y <= HF + 3; y++) {
        const door = dz === 4 && dx === 0 && y <= HF + 2;
        const window = (Math.abs(dx) === 3 && dz === 0 && y === HF + 2) || (dz === -4 && dx === 0 && y === HF + 2);
        set(x, y, z, edge && !door && !window ? ((Math.abs(dx) === 3 && Math.abs(dz) === 4) ? spruceLog : sprucePlanks) : AIR_ID);
      }
      set(x, HF + 4, z, sprucePlanks);
    }
  // 지붕 한 겹 더 (가운데 줄)
  for (let dz = -5; dz <= 5; dz++) for (let dx = -2; dx <= 2; dx++) set(hx + dx, HF + 5, hz + dz, sprucePlanks);
  // 문 앞 계단 (흙 → 판자 두 칸)
  set(hx, HF - 1, hz + 5, sprucePlanks);
  set(hx, HF - 2, hz + 6, sprucePlanks);
  for (let y = HF; y <= HF + 2; y++) set(hx, y, hz + 5, AIR_ID);
  for (let y = HF - 1; y <= HF + 1; y++) set(hx, y, hz + 6, AIR_ID);
  set(hx, HF - 2 - 1, hz + 6, dirt);
  // 안: 상자·횃불·버섯 화분 느낌
  set(hx - 2, HF + 1, hz - 3, chest);
  treasureChests.push({ x: hx - 2, y: HF + 1, z: hz - 3 });
  set(hx + 2, HF + 1, hz - 3, brownM);
  set(hx + 2, HF + 3, hz + 3, torch);
  const witches: SwampLayout['witches'] = [
    { x: hx - 2, y: G + 1, z: hz + 7 },
    { x: hx + 2, y: G + 1, z: hz + 7 },
  ];
  keepClear.push({ x: hx, z: hz, r: 10 });
  const hut = { x: hx, y: HF, z: hz };

  // ---- 슬라임 웅덩이: 가운데서 55~75칸, 오두막과 40칸 넘게 떨어진 쪽 ----
  let px = 0,
    pz = 0;
  for (let tries = 0; tries < 60; tries++) {
    const a = rng() * Math.PI * 2;
    const d = 55 + rng() * 20;
    px = Math.round(CENTER + Math.cos(a) * d);
    pz = Math.round(CENTER + Math.sin(a) * d);
    if (Math.hypot(px - hx, pz - hz) > 40) break;
  }
  dryPad(px, pz, PIT_R + 3, G + 1);
  const bottom = G + 1 - PIT_DEPTH;
  for (let dx = -PIT_R - 1; dx <= PIT_R + 1; dx++)
    for (let dz = -PIT_R - 1; dz <= PIT_R + 1; dz++) {
      const r = Math.hypot(dx, dz);
      const x = px + dx,
        z = pz + dz;
      if (r <= PIT_R) {
        for (let y = bottom + 1; y <= G + 3; y++) set(x, y, z, AIR_ID);
        set(x, bottom, z, hash3(x, 7, z, seed) < 0.18 ? slimeBlock : dirt);
        for (let y = bottom - 3; y < bottom; y++) set(x, y, z, dirt);
        heights[z * SIZE + x] = bottom;
      } else if (r <= PIT_R + 1.2) for (let y = bottom; y <= G + 1; y++) set(x, y, z, hash3(x, y, z, seed) < 0.6 ? mossy : cobble); // 가장자리 벽
    }
  // 남쪽 비탈: 폭 3, 웅덩이 밖에서 바닥까지 한 칸씩
  for (let k = 0; k <= PIT_DEPTH + 1; k++) {
    const z = pz + PIT_R + 2 - k;
    const y = G + 1 - k;
    for (let w = -1; w <= 1; w++) {
      for (let yy = y + 1; yy <= G + 3; yy++) set(px + w, yy, z, AIR_ID);
      set(px + w, Math.max(bottom, y), z, mossy);
    }
  }
  // 웅덩이 가장자리 발광석 넷 (밤에도 보이게)
  for (const [dx, dz] of [
    [PIT_R + 1, 0],
    [-PIT_R - 1, 0],
    [0, -PIT_R - 1],
  ] as [number, number][])
    set(px + dx, G + 2, pz + dz, glowstone);
  const den = { x: px, y: bottom + 1, z: pz };
  const slimes: SwampLayout['slimes'] = [
    { x: px - 6, y: bottom + 1, z: pz },
    { x: px + 6, y: bottom + 1, z: pz },
    { x: px, y: bottom + 1, z: pz - 6 },
    { x: px - 4, y: bottom + 1, z: pz + 5 },
  ];
  keepClear.push({ x: px, z: pz, r: PIT_R + 6 });
  const pit = { x: px, y: bottom, z: pz };

  // ---- 버려진 상자: 남은 수만큼, 물가 판자 위 ----
  let left = Math.max(0, treasures - 1);
  for (let tries = 0; left > 0 && tries < 400; tries++) {
    const a = rng() * Math.PI * 2;
    const d = 20 + rng() * 70;
    const x = Math.round(CENTER + Math.cos(a) * d),
      z = Math.round(CENTER + Math.sin(a) * d);
    if (!isClear(x, z, 4) || treasureChests.some((t) => Math.hypot(t.x - x, t.z - z) < 20)) continue;
    if (hAt(x, z) !== G) continue; // 물가 마른 땅
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) set(x + dx, G, z + dz, sprucePlanks);
    set(x, G + 1, z, chest);
    treasureChests.push({ x, y: G + 1, z });
    keepClear.push({ x, z, r: 4 });
    left--;
  }

  // ---- 늪 참나무 + 버섯 ----
  const treeAt = (x: number, z: number) => {
    const h = hAt(x, z);
    const top = Math.max(h, G) + 4 + Math.floor(hash3(x, 2, z, seed) * 3);
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    for (let dy = -1; dy <= 1; dy++) {
      const y = top + dy;
      const r = dy === 1 ? 2 : 3;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (Math.hypot(dx, dz) > r + 0.5) continue;
          if (world.getBlock(x + dx, y, z + dz) === AIR_ID) set(x + dx, y, z + dz, leaves);
        }
    }
    // 아래로 늘어진 잎 (덩굴처럼)
    for (const [dx, dz] of [
      [-3, 0],
      [3, 0],
      [0, -3],
      [0, 3],
      [-2, -2],
      [2, 2],
    ] as [number, number][]) {
      const len = 1 + Math.floor(hash3(x + dx, 3, z + dz, seed) * 3);
      for (let k = 1; k <= len; k++) if (world.getBlock(x + dx, top - 1 - k, z + dz) === AIR_ID) set(x + dx, top - 1 - k, z + dz, leaves);
    }
  };
  const trunks = new Set<number>();
  const nearTrunk = (x: number, z: number) => {
    for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) if (trunks.has((x + dx) * SIZE + z + dz)) return true;
    return false;
  };
  for (let z = 4; z < SIZE - 4; z++)
    for (let x = 4; x < SIZE - 4; x++) {
      if (Math.hypot(x - CENTER, z - CENTER) > WALL_R - 4 || !isClear(x, z)) continue;
      const h = hAt(x, z);
      const r = hash3(x, 1, z, seed);
      const dense = smoothstep(-0.2, 0.6, treeN(x / 40, z / 40));
      if (h >= G && world.getBlock(x, h, z) === grass && world.getBlock(x, h + 1, z) === AIR_ID) {
        if (r < 0.006 + 0.014 * dense && !nearTrunk(x, z)) {
          trunks.add(x * SIZE + z);
          treeAt(x, z);
        } else if (r > 0.97 && r < 0.985) set(x, h + 1, z, brownM);
        else if (r > 0.985 && r < 0.992) set(x, h + 1, z, redM);
      } else if (h === G - 1 && r < 0.004 * dense && !nearTrunk(x, z)) {
        // 얕은 물속에서 자란 나무
        trunks.add(x * SIZE + z);
        treeAt(x, z);
      }
    }

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: SwampLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, hut, pit, den, witches, slimes };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
