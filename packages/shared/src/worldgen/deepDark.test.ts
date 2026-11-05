import { describe, expect, it } from 'vitest';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { DEEPSLATE_Y, DEEP_DARK_BOUNDS, DEEP_FLOOR_Y, HALL_HALF_X, HALL_HALF_Z, HALL_HEIGHT, generateDeepDark } from './deepDark';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1536:4eac2e67:6257697';

const gen = generateDeepDark(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const passable = (x: number, y: number, z: number) => {
  const d = BLOCKS.get(world.getBlock(x, y, z));
  return !d.solid && !d.fluid;
};

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

describe('generateDeepDark 결정론', () => {
  it('같은 시드 → 같은 땅속, 다른 시드 → 다른 땅속', () => {
    const again = generateDeepDark(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateDeepDark(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 DEEP_DARK_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateDeepDark 배치 (#254)', () => {
  it('통째로 돌: 위는 돌, 아래는 심층암, 다이아는 심층암 속에만, 위아래는 기반암', () => {
    expect(world.sizeX).toBe(DEEP_DARK_BOUNDS.sizeCX * 16);
    expect(world.chunkCount).toBe(16 * 6 * 16);
    expect(id(20, 0, 20)).toBe('bedrock');
    expect(id(20, 95, 20)).toBe('bedrock');
    let deep = 0,
      up = 0,
      diamondUp = 0,
      diamondDeep = 0;
    for (let x = 5; x < 250; x += 7)
      for (let z = 5; z < 250; z += 7) {
        for (let y = 3; y < DEEPSLATE_Y; y += 3) {
          const b = id(x, y, z);
          if (b === 'deepslate') deep++;
          if (b === 'diamond_ore') diamondDeep++;
        }
        for (let y = DEEPSLATE_Y + 3; y < 90; y += 3) {
          const b = id(x, y, z);
          if (b === 'stone') up++;
          if (b === 'diamond_ore') diamondUp++;
        }
      }
    expect(deep).toBeGreaterThan(5000);
    expect(up).toBeGreaterThan(8000);
    expect(diamondUp).toBe(0);
    expect(diamondDeep).toBeGreaterThan(5);
  });

  it('도착 방: 흑요석 문틀 4×5, 스폰은 그 남쪽 공기, 천장에 발광석', () => {
    const p = layout.portal;
    expect(p).toEqual({ x: 128, y: DEEP_FLOOR_Y + 1, z: 128 });
    expect(id(p.x, p.y - 1, p.z)).toBe('cobblestone');
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(id(128, DEEP_FLOOR_Y + 7, 128)).toBe('glowstone');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('고대 도시: 큰 홀(61×41×14) 바닥에 스컬크 얼룩, 심층암 기둥, 동쪽 끝 흑요석 워든의 문, 그 앞 거대 워든 자리와 워든 둘, 북쪽 상자 방 셋. 굴로 걸어간다', () => {
    const h = layout.hall;
    expect(Math.hypot(h.x - 128, h.z - 128)).toBeGreaterThan(40);
    let sculk = 0,
      floor = 0;
    for (let dx = -HALL_HALF_X + 1; dx < HALL_HALF_X; dx++)
      for (let dz = -HALL_HALF_Z + 1; dz < HALL_HALF_Z; dz++) {
        const b = id(h.x + dx, h.y - 1, h.z + dz);
        if (b === 'sculk') sculk++;
        if (b === 'sculk' || b === 'deepslate') floor++;
        if (dz === 0 || (dx === 0 && Math.abs(dz) !== HALL_HALF_Z - 4)) expect(id(h.x + dx, h.y + HALL_HEIGHT - 1, h.z + dz)).toBe('air'); // 기둥(dx 0, dz ±16 포함) 빼고 가운데 줄·칸은 천장까지 비었다
      }
    expect(sculk).toBeGreaterThan(floor * 0.2);
    expect(sculk).toBeLessThan(floor * 0.7);
    expect(id(h.x, h.y + HALL_HEIGHT, h.z)).toBe('deepslate'); // 천장
    expect(id(h.x - HALL_HALF_X + 6, h.y + 2, h.z - HALL_HALF_Z + 4)).toBe('deepslate'); // 기둥
    const gx = h.x + HALL_HALF_X - 3;
    expect(id(gx, h.y, h.z - 4)).toBe('obsidian');
    expect(id(gx, h.y + 6, h.z)).toBe('obsidian');
    expect(id(gx, h.y + 2, h.z)).toBe('air');
    const d = layout.den;
    expect(id(d.x, d.y, d.z)).toBe('air');
    expect(id(d.x, d.y - 1, d.z)).not.toBe('air');
    expect(layout.guards).toHaveLength(2);
    for (const g of layout.guards) {
      expect(id(g.x, g.y, g.z)).toBe('air');
      expect(id(g.x, g.y - 1, g.z)).not.toBe('air');
    }
    expect(layout.treasures).toHaveLength(3);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    const seen = reachable(spawn);
    expect(seen.has(`${h.x},${h.y},${h.z}`)).toBe(true);
    expect(seen.has(`${d.x},${d.y},${d.z}`)).toBe(true);
    for (const c of layout.treasures) expect(seen.has(`${c.x},${c.y},${c.z + 1}`)).toBe(true); // 상자 앞(입구 쪽)
  });

  it('expeditions.json 의 깊은 어둠은 이제 v1: 항상 어둡고, 워든 둘이 처음부터, 보스는 거대 워든, 상자엔 다이아몬드', () => {
    const def = EXPEDITIONS.require('deep_dark');
    expect(def.release).toBe('v1');
    expect(def.nightStartsAt).toBe(0);
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.bossId).toBe('giant_warden');
    expect(def.treasureBonus?.always.map((a) => a.item)).toContain('diamond');
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.spawns.map((s) => s.kind)).toEqual(['warden', 'warden']);
    expect(g.den).toEqual(layout.den);
  });
});
