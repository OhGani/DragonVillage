/**
 * M0 테스트 월드 — 하드코딩. 지형 생성기가 아니다 (그건 M1, shared/worldgen).
 * 8×8×4 청크 = 128×128×64. 평평한 광장 + 완만한 언덕 + 연못 + 나무 + 계단 + 기둥 + 집 뼈대 + 동굴 입구.
 */
import { type BlockRegistry, VoxelWorld, type WorldBounds, hash3 } from '@dragon-village/shared';

export const TEST_WORLD_BOUNDS: WorldBounds = { sizeCX: 8, sizeCY: 4, sizeCZ: 8 };
const SEED = 20260912;

export interface SpawnInfo {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export function buildTestWorld(reg: BlockRegistry): { world: VoxelWorld; spawn: SpawnInfo } {
  const B = (id: string) => reg.numOf(id);
  const AIR = 0;
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
    coal = B('coal_ore'),
    iron = B('iron_ore'),
    gold = B('gold_ore'),
    diamond = B('diamond_ore'),
    snow = B('snow'),
    glowstone = B('glowstone');

  const world = new VoxelWorld(TEST_WORLD_BOUNDS);
  const W = world.sizeX,
    D = world.sizeZ,
    H = world.sizeY;
  const set = (x: number, y: number, z: number, id: number) => {
    if (y >= 0 && y < H) world.setBlock(x, y, z, id);
  };

  // ---- 높이 (스폰 광장은 평평하게) ----
  const CX = 64,
    CZ = 64;
  const height = (x: number, z: number): number => {
    const raw =
      24 +
      2.5 * Math.sin(x / 9) * Math.cos(z / 11) +
      1.5 * Math.sin((x + z) / 7 + 1) +
      6 * Math.max(0, Math.sin(x / 23) * Math.cos(z / 19)) +
      3 * Math.max(0, Math.sin((x - 90) / 12) * Math.sin((z - 90) / 12));
    let h = Math.round(raw);
    const dist = Math.hypot(x - CX, z - CZ);
    if (dist < 14) h = 24;
    else if (dist < 22) h = Math.round(24 + ((h - 24) * (dist - 14)) / 8);
    return Math.max(18, Math.min(H - 12, h));
  };

  for (let x = 0; x < W; x++) {
    for (let z = 0; z < D; z++) {
      const h = height(x, z);
      const desert = x < 18;
      const gravelBeach = z > D - 10;
      set(x, 0, z, bedrock);
      for (let y = 1; y <= h - 4; y++) {
        let id = stone;
        const r = hash3(x, y, z, SEED);
        if (r < 0.014 && y < h - 6) id = coal;
        else if (r < 0.02 && y < 18) id = iron;
        else if (r < 0.022 && y < 12) id = gold;
        else if (r < 0.0232 && y < 8) id = diamond;
        set(x, y, z, id);
      }
      for (let y = h - 3; y < h; y++) set(x, y, z, desert ? sand : dirt);
      set(x, h, z, desert ? sand : gravelBeach ? gravel : grass);
      if (h >= 33 && !desert) set(x, h + 1, z, snow);
    }
  }

  // ---- 연못 (광장 서쪽) ----
  const pond = (px: number, pz: number, r: number) => {
    for (let x = px - r - 2; x <= px + r + 2; x++)
      for (let z = pz - r - 2; z <= pz + r + 2; z++) {
        const d = Math.hypot(x - px, z - pz);
        if (d <= r) {
          set(x, 24, z, AIR);
          set(x, 23, z, water);
          set(x, 22, z, water);
          set(x, 21, z, sand);
        } else if (d <= r + 2) {
          set(x, 24, z, sand);
        }
      }
  };
  pond(46, 64, 5);

  // ---- 나무 ----
  const tree = (x: number, z: number) => {
    const h = height(x, z);
    const top = h + 5;
    for (let y = h + 1; y <= top; y++) set(x, y, z, log);
    for (let dy = -2; dy <= 1; dy++) {
      const y = top + dy;
      const r = dy <= -1 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && dy <= 0) continue;
          if (r === 2 && Math.abs(dx) === 2 && Math.abs(dz) === 2 && hash3(x + dx, y, z + dz, SEED) < 0.5) continue;
          if (world.getBlock(x + dx, y, z + dz) === AIR) set(x + dx, y, z + dz, leaves);
        }
    }
    set(x, top + 2, z, leaves);
  };
  for (const [x, z] of [
    [52, 50],
    [76, 48],
    [80, 80],
    [50, 80],
    [64, 42],
    [88, 66],
    [40, 86],
    [92, 40],
    [30, 60],
    [100, 100],
    [36, 106],
    [104, 30],
    [72, 96],
  ])
    tree(x, z);

  // ---- 조약돌 계단 (광장 동쪽) → 판자 전망대 ----
  for (let i = 0; i < 8; i++) {
    const x = 74 + i;
    for (let z = 61; z <= 63; z++) for (let y = 25; y <= 25 + i; y++) set(x, y, z, cobble);
  }
  for (let x = 82; x <= 87; x++) for (let z = 59; z <= 65; z++) set(x, 32, z, planks);
  for (const [x, z] of [
    [82, 59],
    [87, 59],
    [82, 65],
    [87, 65],
  ])
    for (let y = height(x, z) + 1; y < 32; y++) set(x, y, z, log);
  for (let x = 82; x <= 87; x++) {
    set(x, 33, 59, planks);
    set(x, 33, 65, planks);
  }
  for (let z = 59; z <= 65; z++) {
    set(82, 33, z, planks);
    set(87, 33, z, planks);
  }
  set(84, 33, 62, glowstone);

  // ---- 기둥들 (광장 북쪽) ----
  const pillar = (x: number, z: number, h: number, id: number) => {
    for (let y = 25; y < 25 + h; y++) set(x, y, z, id);
  };
  pillar(58, 54, 3, log);
  pillar(61, 54, 5, log);
  pillar(64, 54, 7, log);
  pillar(67, 54, 5, log);
  pillar(70, 54, 3, log);
  for (let x = 70; x <= 71; x++) for (let z = 70; z <= 71; z++) pillar(x, z, 9, stone);

  // ---- 유리 벽 (광장 남서) ----
  for (let x = 54; x <= 59; x++) for (let y = 25; y <= 27; y++) set(x, y, 73, glass);

  // ---- 집 뼈대 (아들이 완성할 것) : x 64..69, z 70..74, 높이 4 ----
  for (let x = 64; x <= 69; x++)
    for (let z = 70; z <= 74; z++)
      for (let y = 25; y <= 28; y++) {
        const wall = x === 64 || x === 69 || z === 70 || z === 74;
        if (!wall) continue;
        let id = planks;
        if (y === 26 && ((x === 64 && z === 72) || (x === 69 && z === 72) || (z === 74 && x === 66))) id = glass;
        if (z === 70 && x === 66 && (y === 25 || y === 26)) id = AIR; // 문 자리
        set(x, y, z, id);
      }
  for (let x = 64; x <= 69; x++) for (let z = 70; z <= 74; z++) set(x, 29, z, planks);

  // ---- 동굴 입구 (동쪽 언덕) ----
  {
    const sx = 104,
      sz = 88;
    const y = height(sx, sz) + 1;
    for (let t = 0; t < 22; t++) {
      const cx = sx - t;
      const cy = y - t * 0.55;
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -1; dy <= 2; dy++)
          for (let dz = -2; dz <= 2; dz++) {
            if (dx * dx + dy * dy * 1.3 + dz * dz > 4.2) continue;
            const yy = Math.floor(cy + dy);
            if (yy >= 2) set(cx + dx, yy, sz + dz, AIR);
          }
      if (t === 21) set(cx - 2, Math.floor(cy), sz, glowstone);
    }
  }

  // ---- 스폰: 광장 중앙, 연못(서쪽)을 바라본다 ----
  return { world, spawn: { x: CX + 0.5, y: 25, z: CZ + 0.5, yaw: Math.PI / 2 } };
}
