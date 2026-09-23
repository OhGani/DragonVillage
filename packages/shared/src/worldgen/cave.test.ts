import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { CAVE_BOUNDS, CAVE_FLOOR_Y, LAVA_Y, generateCave } from './cave';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '576:bff9500:2134826';

const gen = generateCave(BLOCKS, SEED, 4);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const passable = (x: number, y: number, z: number) => {
  const d = BLOCKS.get(world.getBlock(x, y, z));
  return !d.solid && !d.fluid;
};

/** 스폰에서 걸어서(한 칸 오르내리기, 머리 위 한 칸 더 비어야) 갈 수 있는 칸들 */
function reachable(from: { x: number; y: number; z: number }, limit = 400_000): Set<string> {
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
        if (passable(nx, ny - 1, nz)) continue; // 발 밑이 비었으면 서지 못한다(떨어짐은 안 셈)
        if (dy === 1 && !passable(x, y + 2, z)) continue; // 오를 때 머리
        const k = `${nx},${ny},${nz}`;
        if (seen.has(k)) continue;
        seen.add(k);
        q.push([nx, ny, nz]);
      }
  }
  return seen;
}

describe('generateCave 결정론', () => {
  it('같은 시드 → 같은 동굴, 다른 시드 → 다른 동굴', () => {
    const again = generateCave(BLOCKS, SEED, 4);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateCave(BLOCKS, SEED + 1, 4);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 CAVE_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateCave 배치', () => {
  it('192×64×192, 위아래는 기반암으로 막혀 하늘이 없다', () => {
    expect(world.sizeX).toBe(CAVE_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(64);
    for (const [x, z] of [
      [5, 5],
      [96, 96],
      [150, 40],
    ])
      for (const y of [0, 63]) expect(id(x!, y, z!)).toBe('bedrock');
  });

  it('도착 방: 흑요석 문틀 4×5 가 조약돌 단 위에 서 있고 스폰은 그 남쪽 공기, 발광석 기둥이 있다', () => {
    const p = layout.portal;
    expect(p).toEqual({ x: 96, y: CAVE_FLOOR_Y + 1, z: 96 });
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    for (let y = p.y + 1; y <= p.y + 3; y++) {
      expect(id(p.x - 2, y, p.z)).toBe('obsidian');
      expect(id(p.x + 1, y, p.z)).toBe('obsidian');
      expect(id(p.x - 1, y, p.z)).toBe('air');
      expect(id(p.x, y, p.z)).toBe('air');
    }
    expect(id(96, CAVE_FLOOR_Y, 96)).toBe('cobblestone');
    expect(id(92, CAVE_FLOOR_Y, 93)).toBe('glowstone');
    expect(spawn).toEqual({ x: 96.5, y: CAVE_FLOOR_Y + 1, z: 99.5, yaw: 0 });
    expect(id(96, spawn.y, 99)).toBe('air');
    expect(id(96, spawn.y + 1, 99)).toBe('air');
    expect(BLOCKS.get(world.getBlock(96, spawn.y - 1, 99)).solid).toBe(true);
    expect(portalContains(p, p.x - 0.5, p.y + 1, p.z + 0.5)).toBe(true);
    expect(id(104, CAVE_FLOOR_Y + 4, 104)).toBe('glowstone');
  });

  it('보물 방 4개: 상자가 조약돌 바닥 위, 천장에 발광석, 서로 24칸 이상, 스폰에서 걸어갈 수 있다', () => {
    expect(layout.treasures.length).toBe(4);
    const walk = reachable(spawn);
    for (const t of layout.treasures) {
      expect(id(t.x, t.y, t.z)).toBe('chest');
      expect(id(t.x, t.y - 1, t.z)).toBe('cobblestone');
      expect(id(t.x, t.y + 6, t.z)).toBe('glowstone');
      // 상자 바로 옆 어딘가에 서 있을 수 있어야 한다
      const near = [
        [t.x + 1, t.z],
        [t.x - 1, t.z],
        [t.x, t.z + 1],
        [t.x, t.z - 1],
      ].some(([x, z]) => walk.has(`${x},${t.y},${z}`));
      expect(near, `보물 상자 (${t.x},${t.y},${t.z}) 까지 길이 없어요`).toBe(true);
    }
    for (const a of layout.treasures) for (const b of layout.treasures) if (a !== b) expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThanOrEqual(24);
  });

  it('거미 왕의 굴은 35% 시드에만 생기고, 생기면 큰 방이다', { timeout: 30_000 }, () => {
    let withDen = 0;
    for (let s = 1; s <= 8; s++) {
      const g = generateCave(BLOCKS, s, 4);
      if (!g.layout.den) continue;
      withDen++;
      const d = g.layout.den;
      const bid = (x: number, y: number, z: number) => BLOCKS.get(g.world.getBlock(x, y, z)).id;
      expect(bid(d.x, d.y - 1, d.z)).toBe('cobblestone');
      expect(bid(d.x, d.y, d.z)).toBe('air');
      expect(bid(d.x + 5, d.y + 2, d.z + 5)).toBe('stone'); // 기둥
      expect(bid(d.x + 7, d.y + 1, d.z)).toBe('air'); // 넓다
      expect(g.layout.treasures.length).toBe(4);
    }
    expect(withDen).toBeGreaterThanOrEqual(1);
    expect(withDen).toBeLessThanOrEqual(6);
  });

  it('굴이 충분히 있고(4~30%), 깊은 굴은 용암, 광물 여섯 가지가 다 나온다', () => {
    let air = 0,
      total = 0;
    const found = new Set<string>();
    for (let x = 2; x < 190; x += 3)
      for (let z = 2; z < 190; z += 3)
        for (let y = 4; y <= 57; y++) {
          total++;
          const b = world.getBlock(x, y, z);
          if (b === AIR_ID) air++;
          const name = BLOCKS.get(b).id;
          if (name.endsWith('_ore') || name === 'lava') found.add(name);
        }
    const ratio = air / total;
    expect(ratio).toBeGreaterThan(0.04);
    expect(ratio).toBeLessThan(0.3);
    for (const ore of ['coal_ore', 'iron_ore', 'gold_ore', 'redstone_ore', 'lapis_ore', 'diamond_ore', 'lava']) expect(found.has(ore), ore).toBe(true);
    // 다이아는 16 아래에만, 용암은 LAVA_Y 아래에만
    const diamondNum = BLOCKS.numOf('diamond_ore'),
      lavaNum = BLOCKS.numOf('lava');
    let bad = 0;
    for (let x = 0; x < 192; x += 2)
      for (let z = 0; z < 192; z += 2)
        for (let y = LAVA_Y + 1; y < 60; y++) {
          const b = world.getBlock(x, y, z);
          if (b === lavaNum || (b === diamondNum && y >= 16)) bad++;
        }
    expect(bad).toBe(0);
  });

  it('생성 시간을 기록한다 (2코어 VM 목표 1.5s 미만)', () => {
    expect(gen.ms).toBeGreaterThanOrEqual(0);
    expect(gen.ms).toBeLessThan(1500);
  });
});

describe('generateExpedition 분배', () => {
  it('island·cave 는 있고 나머지는 아직 없다. 동굴 원정지는 동굴을 만든다', () => {
    expect(hasGenerator('island')).toBe(true);
    expect(hasGenerator('cave')).toBe(true);
    expect(hasGenerator('desert')).toBe(false);
    const cave = EXPEDITIONS.require('cave');
    const g = generateExpedition(cave, BLOCKS, SEED);
    expect(g.portal).toEqual(layout.portal);
    expect(g.treasures.length).toBe(cave.treasures);
    expect(g.genVersion).toBe(1);
    const isl = generateExpedition(EXPEDITIONS.require('grass_island'), BLOCKS, SEED);
    expect(isl.world.sizeX).toBe(256);
    expect(isl.den).toBeNull();
    expect(() => generateExpedition({ generator: 'moon', treasures: 1 }, BLOCKS, 1)).toThrow(/아직 없어요/);
  });
});
