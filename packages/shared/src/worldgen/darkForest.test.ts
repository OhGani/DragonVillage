import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { DARK_FOREST_BOUNDS, DARK_GROUND_Y, MANSION_FLOOR_H, MANSION_HALF_X, MANSION_HALF_Z, generateDarkForest } from './darkForest';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1184:3d20b291:3692209'; // 2: 삐걱이 심장 (2026-11-07)

const gen = generateDarkForest(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const topOf = (x: number, z: number): number => {
  for (let y = world.sizeY - 1; y >= 0; y--) if (world.getBlock(x, y, z) !== AIR_ID) return y;
  return -1;
};
const passable = (x: number, y: number, z: number) => {
  const d = BLOCKS.get(world.getBlock(x, y, z));
  return !d.solid && !d.fluid;
};

/** 스폰에서 걸어서(한 칸 오르내리기) 갈 수 있는 칸들 — 다른 원정지 테스트와 같은 규칙 */
function reachable(from: { x: number; y: number; z: number }, limit = 900_000): Set<string> {
  const seen = new Set<string>();
  const q: [number, number, number][] = [[Math.floor(from.x), Math.floor(from.y), Math.floor(from.z)]];
  seen.add(q[0]!.join(','));
  while (q.length && seen.size < limit) {
    const [x, y, z] = q.pop()!;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as [number, number][])
      for (const dy of [0, 1, -1]) {
        const nx = x + dx,
          ny = y + dy,
          nz = z + dz;
        if (!world.inBounds(nx, ny, nz) || ny < 1) continue;
        if (!passable(nx, ny, nz) || !passable(nx, ny + 1, nz)) continue;
        if (passable(nx, ny - 1, nz)) continue;
        if (dy === 1 && !passable(x, y + 2, z)) continue;
        const k = `${nx},${ny},${nz}`;
        if (seen.has(k)) continue;
        seen.add(k);
        q.push([nx, ny, nz]);
      }
  }
  return seen;
}

describe('generateDarkForest 결정론', () => {
  it('같은 시드 → 같은 숲, 다른 시드 → 다른 숲', () => {
    const again = generateDarkForest(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateDarkForest(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 DARK_FOREST_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateDarkForest 배치 (#252)', () => {
  it('256×96×256, 땅은 잔디 → 흙 3겹 → 돌, 가장자리는 산, 짙은 참나무가 빽빽하다', () => {
    expect(world.sizeX).toBe(DARK_FOREST_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    let logs = 0,
      leavesN = 0;
    for (let z = 20; z < 236; z += 3) for (let x = 20; x < 236; x += 3) for (let y = DARK_GROUND_Y - 5; y < DARK_GROUND_Y + 25; y++) {
      const b = id(x, y, z);
      if (b === 'dark_oak_log') logs++;
      else if (b === 'dark_oak_leaves') leavesN++;
    }
    expect(logs).toBeGreaterThan(300);
    expect(leavesN).toBeGreaterThan(logs);
    expect(topOf(128, 3) - DARK_GROUND_Y).toBeGreaterThan(20);
    expect(id(100, 0, 100)).toBe('bedrock');
    // 어디든 땅 속은 흙 → 돌
    const m = layout.mansion;
    const far = { x: m.x > 128 ? 40 : 216, z: 128 };
    const t = topOf(far.x, far.z);
    let y = t;
    while (y > 1 && id(far.x, y, far.z) !== 'grass') y--; // 옆 나무의 잎·공기를 지나 잔디까지
    expect(id(far.x, y, far.z)).toBe('grass');
    expect(id(far.x, y - 1, far.z)).toBe('dirt');
    expect(['stone', 'coal_ore', 'iron_ore', 'emerald_ore']).toContain(id(far.x, y - 5, far.z));
  });

  it('도착 포탈: 흑요석 문틀 4×5 가 가운데 조약돌 단 위, 스폰은 그 남쪽 공기', () => {
    const p = layout.portal;
    expect(p.x).toBe(128);
    expect(p.z).toBe(128);
    expect(id(p.x, p.y - 1, p.z)).toBe('cobblestone');
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('삼림 대저택: 짙은 참나무 판자 2층집, 1층 상자 셋·변명자 셋, 2층 가운데가 소환사 자리. 스폰에서 걸어서 1층·2층까지 간다', () => {
    const m = layout.mansion;
    expect(Math.hypot(m.x - 128, m.z - 128)).toBeGreaterThan(45);
    expect(id(m.x - MANSION_HALF_X, m.y + 2, m.z)).toBe('dark_oak_log'); // 모서리·기둥은 원목
    expect(id(m.x + 3, m.y + 2, m.z + MANSION_HALF_Z)).toBe('dark_oak_planks');
    expect(id(m.x, m.y + 1, m.z)).toBe('red_wool'); // 양탄자 길
    expect(layout.treasures).toHaveLength(3);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    expect(layout.guards).toHaveLength(3);
    for (const g of layout.guards) {
      expect(id(g.x, g.y, g.z)).toBe('air');
      expect(id(g.x, g.y - 1, g.z)).not.toBe('air');
    }
    const d = layout.den;
    expect(d.y).toBe(m.y + 1 + MANSION_FLOOR_H + 2); // 2층 바닥 위
    expect(id(d.x, d.y, d.z)).toBe('air');
    expect(id(d.x, d.y - 1, d.z)).toBe('dark_oak_planks');
    const seen = reachable(spawn);
    expect(seen.has(`${layout.guards[0]!.x},${layout.guards[0]!.y},${layout.guards[0]!.z}`)).toBe(true); // 1층 가운데
    expect(seen.has(`${d.x},${d.y},${d.z}`)).toBe(true); // 비탈 계단으로 2층
    for (const c of layout.treasures) expect(seen.has(`${c.x},${c.y},${c.z - 1}`) || seen.has(`${c.x},${c.y},${c.z + 1}`) || seen.has(`${c.x - 1},${c.y},${c.z}`) || seen.has(`${c.x + 1},${c.y},${c.z}`)).toBe(true);
  });

  it('expeditions.json 의 어두운 숲은 이제 v1: 생성기가 있고, 변명자 셋이 처음부터 서 있고, 보스는 소환사', () => {
    const def = EXPEDITIONS.require('dark_forest');
    expect(def.release).toBe('v1');
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.bossId).toBe('evoker');
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.spawns.map((s) => s.kind)).toEqual(['vindicator', 'vindicator', 'vindicator']);
    expect(g.den).toEqual(layout.den);
    expect(layout.mushrooms.length).toBeGreaterThanOrEqual(4);
  });
});
