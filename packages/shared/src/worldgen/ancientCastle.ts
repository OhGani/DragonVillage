/**
 * 고대성 생성기 — 열두째, 마지막 원정지 (256×256×96, 아들 보스 설계 BOSSES.md "네 왕", 아빠 2026-11-06 앞당김).
 * 포탈 6단계(엔드 다음)를 지으면 열린다. 늘 어둡다(nightStartsAt 0).
 *
 * 시드 하나로 언제나 같은 성 (클라·서버 동일, 스냅샷 테스트). 난수는 mulberry32/hash3 만.
 *
 * 배치 (마인크래프트 방위: -Z 북, +X 동). 땅 CASTLE_GROUND_Y = 40 둘레로 잿빛 들판(자갈·흙 얼룩, 시든 풀).
 *   - 도착 포탈은 가운데. 성은 바로 북쪽: 남쪽 성벽이 가운데서 CASTLE_GAP 칸.
 *   - 성: 폭 ROOM_W(25), 방 넷이 남 → 북으로 한 줄 — 입구(깊이 15) → 초반 방(15) → 중간 방(17) → 최종 방(25).
 *     벽은 석재 벽돌(이끼·금 간 것 섞임) 높이 WALL_H, 천장 한 겹. 방 사이 벽에 3칸 넓이 문. 성문(남쪽) 5칸.
 *     네 모서리 탑(7×7, 높이 WALL_H + 8, 톱니 모양). 성문 위 두 탑 사이에 첫 번째 왕들의 머리 넷(3×3×3, 양털·석영으로) — 아들 "첫 번째 왕들의 머리를 달고 있는".
 *   - 방 안의 몹 (bosses.json four_kings.battle.rooms mobsPerKind: 입구 2·초반 8·중간 14·최종 30, 종족 넷 = 스켈레톤·크리퍼·엔더맨·좀비).
 *     자리마다 rank(0~1) 를 붙여 서버가 사람 수만큼 줄인다(6명이면 다, 1명이면 1/4 — 아빠 임시 규칙).
 *   - 최종 방: 북쪽에 금 블록 왕좌, 가운데 둘레에 네 왕(kings). 상자는 초반·중간·최종 방에 하나씩.
 */
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, CHUNK_VOLUME, localIndex } from '../chunk/chunk';
import { VoxelWorld, type WorldBounds } from '../chunk/world';
import { hash3, mulberry32 } from '../math/prng';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import { type MobKind, bossMinionKinds } from '../rules/mobs';
import type { IslandLayout } from './island';
import type { SpawnPoint } from './village';

export const CASTLE_BOUNDS: WorldBounds = { sizeCX: 16, sizeCY: 6, sizeCZ: 16 };
/** 생성기를 고치면 올린다 (클라·서버 버전 불일치 감지) */
export const CASTLE_GEN_VERSION = 1;
export const CASTLE_GROUND_Y = 40;

const SIZE = CASTLE_BOUNDS.sizeCX * CHUNK_SIZE;
const HEIGHT = CASTLE_BOUNDS.sizeCY * CHUNK_SIZE;
const CENTER = SIZE / 2;
const PORTAL_FLAT_R = 10;
const WALL_R = 110;
/** 성 남쪽 벽이 가운데(포탈)에서 이만큼 북쪽 */
export const CASTLE_GAP = 16;
/** 성 폭(안쪽 포함 바깥 벽까지), 벽 높이 */
export const ROOM_W = 25;
export const WALL_H = 11;
/** 방 깊이 (안쪽 칸 수) — 입구·초반·중간·최종 */
export const ROOM_DEPTHS = [15, 15, 17, 25] as const;
/** 방마다 종족별 몹 수 (bosses.json four_kings.battle.rooms 와 같다 — 테스트가 맞춰 본다) */
export const ROOM_MOBS_PER_KIND = [2, 8, 14, 30] as const;
export const ROOM_NAMES = ['입구', '초반 방', '중간 방', '최종 방'] as const;
export const CASTLE_KINDS: readonly MobKind[] = ['skeleton', 'creeper', 'enderman', 'zombie'];
export const KINGS: readonly MobKind[] = ['skeleton_king', 'creeper_king', 'enderman_king', 'zombie_king'];

export interface CastleRoom {
  name: string;
  /** 안쪽 바닥 범위 (x0..x1, z0..z1 포함), 바닥 위 첫 칸 높이 y */
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  y: number;
}

export interface CastleLayout extends IslandLayout {
  rooms: CastleRoom[];
  /** 성문 바깥 가운데 (땅 위) */
  gate: { x: number; y: number; z: number };
  /** 방의 몹 자리: 종족·rank(0~1, 작을수록 먼저 남는다) */
  /** group = 종족(스켈레톤·크리퍼·엔더맨·좀비), kind = 그 왕의 부하 중 하나(절반은 종족 그대로, 나머지는 변종) */
  mobs: { kind: MobKind; group: MobKind; x: number; y: number; z: number; rank: number; room: number }[];
  /** 네 왕 자리 (최종 방) */
  kings: { kind: MobKind; x: number; y: number; z: number }[];
  /** 왕좌 앞 */
  throne: { x: number; y: number; z: number };
}

export interface CastleResult {
  world: VoxelWorld;
  spawn: SpawnPoint;
  layout: CastleLayout;
  ms: number;
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function generateAncientCastle(registry: BlockRegistry, seed: number, treasures = 3): CastleResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const B = (id: string) => registry.numOf(id);
  const bedrock = B('bedrock'),
    stone = B('stone'),
    cobble = B('cobblestone'),
    gravel = B('gravel'),
    dirt = B('dirt'),
    grass = B('grass'),
    bricks = B('stone_bricks'),
    mossyB = B('mossy_stone_bricks'),
    crackedB = B('cracked_stone_bricks'),
    goldBlock = B('gold_block'),
    obsidian = B('obsidian'),
    glowstone = B('glowstone'),
    chest = B('chest'),
    torch = B('torch'),
    quartz = B('quartz_block'),
    lime = B('lime_wool'),
    black = B('black_wool'),
    green = B('green_wool'),
    purple = B('purple_wool'),
    gray = B('gray_wool');

  const n2 = (salt: number) => createNoise2D(mulberry32((seed ^ (salt * 0x9e3779b9)) >>> 0));
  const hillA = n2(91),
    patchN = n2(92),
    edgeN = n2(93);
  const G = CASTLE_GROUND_Y;

  // 성 범위 (바깥 벽 포함): x cx0..cx1, z zN..zS
  const totalDepth = ROOM_DEPTHS.reduce((s, d) => s + d, 0) + ROOM_DEPTHS.length + 1; // 방 사이 벽 + 양끝 벽
  const half = (ROOM_W - 1) >> 1;
  const cx0 = CENTER - half,
    cx1 = CENTER + half;
  const zS = CENTER - CASTLE_GAP;
  const zN = zS - totalDepth + 1;
  const inCastle = (x: number, z: number, pad: number) => x >= cx0 - 8 - pad && x <= cx1 + 8 + pad && z >= zN - 8 - pad && z <= zS + 8 + pad;

  // ---- 높이: 잿빛 들판, 성·포탈 둘레는 평평, 가장자리 언덕 ----
  const heightAt = (x: number, z: number): number => {
    const dx = x - CENTER,
      dz = z - CENTER;
    const d = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    let h = G + 2.5 * hillA(x / 30, z / 30);
    const wallR = WALL_R + 6 * edgeN(Math.cos(ang) * 1.9, Math.sin(ang) * 1.9);
    h += smoothstep(wallR, wallR + 14, d) * 30;
    // 성 둘레·포탈 둘레·그 사이 길은 G 로
    const flatC = inCastle(x, z, 0) ? 1 : inCastle(x, z, 8) ? 0.5 : 0;
    const flatP = 1 - smoothstep(PORTAL_FLAT_R, PORTAL_FLAT_R + 8, d);
    const path = Math.abs(dx) <= 4 && z <= CENTER && z >= zS ? 1 : 0;
    const flat = Math.max(flatC, flatP, path);
    return h + (G - h) * flat;
  };
  const heights = new Int16Array(SIZE * SIZE);
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) heights[z * SIZE + x] = Math.max(12, Math.min(HEIGHT - 14, Math.round(heightAt(x, z))));
  const hAt = (x: number, z: number) => heights[Math.max(0, Math.min(SIZE - 1, z)) * SIZE + Math.max(0, Math.min(SIZE - 1, x))]!;

  const world = new VoxelWorld(CASTLE_BOUNDS);
  const ids = new Uint16Array(CHUNK_VOLUME);
  for (let cz = 0; cz < CASTLE_BOUNDS.sizeCZ; cz++) {
    for (let cx = 0; cx < CASTLE_BOUNDS.sizeCX; cx++) {
      let maxH = 0;
      for (let lz = 0; lz < CHUNK_SIZE; lz++) for (let lx = 0; lx < CHUNK_SIZE; lx++) maxH = Math.max(maxH, hAt(cx * CHUNK_SIZE + lx, cz * CHUNK_SIZE + lz));
      for (let cy = 0; cy < CASTLE_BOUNDS.sizeCY; cy++) {
        const by = cy * CHUNK_SIZE;
        if (by > maxH) break;
        ids.fill(AIR_ID);
        let nonAir = 0;
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const z = cz * CHUNK_SIZE + lz;
          for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            const x = cx * CHUNK_SIZE + lx;
            const H = hAt(x, z);
            const p = patchN(x / 12, z / 12);
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
              const y = by + ly;
              let id = AIR_ID;
              if (y === 0 || (y === 1 && hash3(x, y, z, seed) < 0.5)) id = bedrock;
              else if (y > H) id = AIR_ID;
              else if (y === H) id = p > 0.35 ? gravel : p < -0.4 ? dirt : grass;
              else if (y > H - 4) id = dirt;
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
  const wallBlock = (x: number, y: number, z: number) => {
    const r = hash3(x, y, z, seed ^ 0x51);
    return r < 0.2 ? mossyB : r < 0.32 ? crackedB : bricks;
  };

  // ---- 도착 포탈 ----
  const PY = G;
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
  // 포탈 → 성문 돌길
  for (let z = zS + 1; z <= CENTER - 4; z++) for (let dx = -2; dx <= 2; dx++) set(CENTER + dx, G, z, hash3(CENTER + dx, 0, z, seed) < 0.7 ? cobble : gravel);

  // ---- 성 ----
  const FL = G + 1; // 바닥 블록 높이 — 그 위가 방
  // 바닥·외벽·천장
  for (let x = cx0; x <= cx1; x++)
    for (let z = zN; z <= zS; z++) {
      for (let y = G - 2; y <= FL; y++) set(x, y, z, y === FL ? ((x + z) % 2 === 0 ? bricks : cobble) : stone);
      const outer = x === cx0 || x === cx1 || z === zN || z === zS;
      for (let y = FL + 1; y <= FL + WALL_H; y++) set(x, y, z, outer ? wallBlock(x, y, z) : AIR_ID);
      set(x, FL + WALL_H + 1, z, wallBlock(x, FL + WALL_H + 1, z));
      // 지붕 톱니
      if (outer && (x + z) % 2 === 0) set(x, FL + WALL_H + 2, z, wallBlock(x, FL + WALL_H + 2, z));
    }
  // 방 사이 벽 + 방 목록 (남 → 북)
  const rooms: CastleRoom[] = [];
  let zSouthInner = zS - 1;
  for (let i = 0; i < ROOM_DEPTHS.length; i++) {
    const d = ROOM_DEPTHS[i]!;
    const z1 = zSouthInner,
      z0 = zSouthInner - d + 1;
    rooms.push({ name: ROOM_NAMES[i]!, x0: cx0 + 1, x1: cx1 - 1, z0, z1, y: FL + 1 });
    const wz = z0 - 1; // 이 방 북쪽 벽
    if (i < ROOM_DEPTHS.length - 1) {
      for (let x = cx0; x <= cx1; x++) for (let y = FL + 1; y <= FL + WALL_H; y++) set(x, y, wz, wallBlock(x, y, wz));
      // 문: 3칸 넓이 5칸 높이 (가운데)
      for (let dx = -1; dx <= 1; dx++) for (let y = FL + 1; y <= FL + 5; y++) set(CENTER + dx, y, wz, AIR_ID);
      set(CENTER - 2, FL + 4, wz + 1, torch);
      set(CENTER + 2, FL + 4, wz + 1, torch);
    }
    zSouthInner = wz - 1;
    // 방 안 빛: 천장 발광석 격자, 벽 횃불
    for (let x = cx0 + 3; x <= cx1 - 3; x += 6) for (let z = z0 + 2; z <= z1 - 2; z += 6) set(x, FL + WALL_H, z, glowstone);
    for (let z = z0 + 2; z <= z1 - 2; z += 5) {
      set(cx0 + 1, FL + 3, z, torch);
      set(cx1 - 1, FL + 3, z, torch);
    }
  }
  // 성문: 남쪽 벽 5칸 넓이 6칸 높이
  for (let dx = -2; dx <= 2; dx++) for (let y = FL + 1; y <= FL + 6; y++) set(CENTER + dx, y, zS, AIR_ID);
  // 성문 앞 계단 (땅 G → 바닥 FL 한 칸)
  for (let dx = -2; dx <= 2; dx++) set(CENTER + dx, FL, zS + 1, bricks);

  // ---- 네 모서리 탑 (7×7, 벽보다 8칸 높다) ----
  const towerTop = FL + WALL_H + 8;
  // 탑은 성 바깥 모서리에 붙는다 (안쪽 두 면이 성벽과 겹친다) — 방 안을 파먹지 않게
  for (const [tx, tz] of [
    [cx0 - 3, zS + 3],
    [cx1 + 3, zS + 3],
    [cx0 - 3, zN - 3],
    [cx1 + 3, zN - 3],
  ] as [number, number][]) {
    for (let dx = -3; dx <= 3; dx++)
      for (let dz = -3; dz <= 3; dz++) {
        const x = tx + dx,
          z = tz + dz;
        const edge = Math.abs(dx) === 3 || Math.abs(dz) === 3;
        for (let y = G - 1; y <= towerTop; y++) {
          if (y <= FL) set(x, y, z, stone);
          else if (edge) set(x, y, z, wallBlock(x, y, z));
          else if (y === FL + WALL_H + 1 || y === towerTop) set(x, y, z, bricks);
        }
        if (edge && (dx + dz) % 2 === 0) set(x, towerTop + 1, z, wallBlock(x, towerTop + 1, z));
      }
    set(tx, towerTop + 1, tz, glowstone);
  }
  // 첫 번째 왕들의 머리 넷: 성문 위 남쪽 벽 꼭대기에 3×3×3 — 스켈레톤(석영)·크리퍼(연두)·엔더맨(검정)·좀비(초록)
  const heads: { base: number; eye: number; mouth: number }[] = [
    { base: quartz, eye: black, mouth: gray },
    { base: lime, eye: black, mouth: black },
    { base: black, eye: purple, mouth: black },
    { base: green, eye: black, mouth: gray },
  ];
  heads.forEach((hd, i) => {
    const hx0 = CENTER - 8 + i * 4; // -8, -4, 0, 4 → 머리 x hx0..hx0+2
    const y0 = FL + WALL_H + 2;
    for (let dx = 0; dx < 3; dx++) for (let dy = 0; dy < 3; dy++) for (let dz = 0; dz < 3; dz++) set(hx0 + dx, y0 + dy, zS - 1 + dz, hd.base);
    // 얼굴은 남쪽(+z) 면: 눈 둘(위 줄 양끝), 입(아래 줄 가운데)
    set(hx0, y0 + 1, zS + 1, hd.eye);
    set(hx0 + 2, y0 + 1, zS + 1, hd.eye);
    set(hx0 + 1, y0, zS + 1, hd.mouth);
  });

  // ---- 방 안: 몹 자리 · 상자 · 왕좌 · 왕 ----
  const mobs: CastleLayout['mobs'] = [];
  const rng = mulberry32((seed ^ 0xca571e) >>> 0);
  rooms.forEach((r, ri) => {
    const per = ROOM_MOBS_PER_KIND[ri]!;
    const used = new Set<string>();
    CASTLE_KINDS.forEach((kind, ki) => {
      for (let k = 0; k < per; k++) {
        // 방 안쪽 2칸 띄우고, 최종 방은 왕좌·왕 둘레(가운데 9칸)를 비운다
        let x = 0,
          z = 0;
        for (let tries = 0; tries < 40; tries++) {
          x = r.x0 + 2 + Math.floor(rng() * (r.x1 - r.x0 - 3));
          z = r.z0 + 2 + Math.floor(rng() * (r.z1 - r.z0 - 3));
          const key = `${x},${z}`;
          const nearKing = ri === rooms.length - 1 && Math.abs(x - CENTER) <= 6 && z <= r.z0 + 12;
          if (!used.has(key) && !nearKing) {
            used.add(key);
            break;
          }
        }
        // rank: 종족마다 k 번째 — 사람이 적으면 앞 번호만 남는다. 종족끼리 섞이게 ki 로 조금 어긋낸다
        // 종족마다 그 왕의 부하 변종을 섞는다 (아빠 그림 2026-11-06): 짝수 번째는 종족 그대로, 홀수 번째는 변종 중 하나
        const variants = bossMinionKinds(KINGS[ki]!);
        const variant = k % 2 === 0 ? kind : variants[1 + (Math.floor(k / 2) % Math.max(1, variants.length - 1))] ?? kind;
        mobs.push({ kind: variant, group: kind, x, y: r.y, z, rank: (k + 0.25 + ki * 0.125) / per, room: ri });
      }
    });
  });
  // 상자: 초반·중간·최종 방 북동 구석부터 (treasures 만큼)
  const treasureChests: IslandLayout['treasures'] = [];
  for (let i = 0; i < Math.min(treasures, 3); i++) {
    const r = rooms[i + 1]!;
    const x = i % 2 === 0 ? r.x1 - 1 : r.x0 + 1,
      z = r.z0 + 1;
    set(x, r.y, z, chest);
    treasureChests.push({ x, y: r.y, z });
  }
  // 최종 방: 북쪽 벽 앞 금 블록 왕좌 (3칸 + 등받이), 앞에 네 왕
  const fin = rooms[rooms.length - 1]!;
  for (let dx = -2; dx <= 2; dx++) {
    set(CENTER + dx, fin.y, fin.z0 + 1, goldBlock);
    if (Math.abs(dx) <= 1) set(CENTER + dx, fin.y + 1, fin.z0, goldBlock);
  }
  set(CENTER, fin.y + 2, fin.z0, goldBlock);
  const throne = { x: CENTER, y: fin.y, z: fin.z0 + 3 };
  const kz = fin.z0 + 7;
  const kings: CastleLayout['kings'] = [
    { kind: KINGS[0]!, x: CENTER - 5, y: fin.y, z: kz - 2 },
    { kind: KINGS[1]!, x: CENTER + 5, y: fin.y, z: kz - 2 },
    { kind: KINGS[2]!, x: CENTER - 5, y: fin.y, z: kz + 4 },
    { kind: KINGS[3]!, x: CENTER + 5, y: fin.y, z: kz + 4 },
  ];

  const spawn: SpawnPoint = { x: CENTER + 0.5, y: PY + 1, z: CENTER + 3.5, yaw: 0 };
  const layout: CastleLayout = { center: { x: CENTER, z: CENTER }, portal, treasures: treasureChests, rooms, gate: { x: CENTER, y: G + 1, z: zS + 2 }, mobs, kings, throne };
  const ms = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  return { world, spawn, layout, ms };
}
