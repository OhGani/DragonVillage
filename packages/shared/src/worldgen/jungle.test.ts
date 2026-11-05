import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { HALL_HALF, HALL_H, JUNGLE_BOUNDS, JUNGLE_GROUND_Y, generateJungle } from './jungle';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1211:740253eb:3710826';

const gen = generateJungle(BLOCKS, SEED, 4);
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

describe('generateJungle 결정론', () => {
  it('같은 시드 → 같은 정글, 다른 시드 → 다른 정글', () => {
    const again = generateJungle(BLOCKS, SEED, 4);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateJungle(BLOCKS, SEED + 1, 4);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 JUNGLE_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateJungle 배치 (#253)', () => {
  it('256×96×256, 높은 정글 나무(줄기 8 이상)와 덤불·수박, 가장자리는 산', () => {
    expect(world.sizeX).toBe(JUNGLE_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    let logs = 0,
      tall = 0,
      melons = 0;
    for (let z = 10; z < 246; z += 2)
      for (let x = 10; x < 246; x += 2) {
        const t = topOf(x, z);
        let y = t;
        while (y > 0 && id(x, y, z) === 'jungle_leaves') y--;
        if (id(x, y, z) === 'jungle_log') {
          logs++;
          let h = 0;
          while (id(x, y - h, z) === 'jungle_log') h++;
          if (h >= 8) tall++;
        }
        if (id(x, t, z) === 'melon') melons++;
      }
    expect(logs).toBeGreaterThan(60);
    expect(tall).toBeGreaterThan(logs * 0.8);
    expect(melons).toBeGreaterThan(5);
    expect(topOf(128, 3) - JUNGLE_GROUND_Y).toBeGreaterThan(20);
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

  it('정글 궁궐: 이끼 낀 조약돌 홀에 금 띠·에메랄드 왕좌, 상자 둘 + 사당 둘, 문 앞 고릴라 둘, 왕좌 앞이 거대 고릴라 자리. 스폰에서 걸어서 홀까지', () => {
    const p = layout.palace;
    expect(Math.hypot(p.x - 128, p.z - 128)).toBeGreaterThan(45);
    const FLOOR = p.y + 2;
    expect(id(p.x + HALL_HALF, FLOOR + 1, p.z + HALL_HALF)).toBe('gold_block'); // 모서리 금 기둥
    expect(id(p.x + 3, FLOOR + 3, p.z - HALL_HALF)).toBe('gold_block'); // 금 띠
    expect(['mossy_cobblestone', 'cobblestone']).toContain(id(p.x + 3, FLOOR + 2, p.z - HALL_HALF));
    expect(id(p.x, FLOOR + 1, p.z - HALL_HALF + 1)).toBe('emerald_block'); // 왕좌
    expect(id(p.x, FLOOR + HALL_H + 1, p.z)).toBe('air'); // 천창
    expect(id(p.x + 5, FLOOR + HALL_H + 1, p.z + 5)).toBe('cobblestone'); // 지붕
    expect(layout.treasures).toHaveLength(4);
    expect(layout.shrines).toHaveLength(2);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    expect(layout.guards).toHaveLength(2);
    for (const g of layout.guards) {
      expect(id(g.x, g.y, g.z)).toBe('air');
      expect(id(g.x, g.y - 1, g.z)).not.toBe('air');
    }
    const d = layout.den;
    expect(id(d.x, d.y, d.z)).toBe('air');
    expect(id(d.x, d.y - 1, d.z)).not.toBe('air');
    const seen = reachable(spawn);
    expect(seen.has(`${d.x},${d.y},${d.z}`)).toBe(true);
    for (const s of layout.shrines) expect(seen.has(`${s.x},${s.y + 1},${s.z + 1}`)).toBe(true); // 사당 상자 앞
  });

  it('expeditions.json 의 정글은 이제 v1: 생성기가 있고, 고릴라 둘이 처음부터 서 있고, 보스는 거대 고릴라, 상자엔 바나나', () => {
    const def = EXPEDITIONS.require('jungle');
    expect(def.release).toBe('v1');
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.bossId).toBe('giant_gorilla');
    expect(def.treasureBonus?.always.map((a) => a.item)).toContain('banana');
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.spawns.map((s) => s.kind)).toEqual(['gorilla', 'gorilla']);
    expect(g.den).toEqual(layout.den);
  });
});
