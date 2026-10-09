import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { spawnKinds } from '../rules/mobs';
import { CITY_DIST, END_BOUNDS, PILLAR_COUNT, PORTAL_DIST, SURFACE_Y, generateEnd } from './end';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '483:8e08dbd7:324492';

const gen = generateEnd(BLOCKS, SEED, 2);
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

function reachable(from: { x: number; y: number; z: number }, limit = 600_000): Set<string> {
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

describe('generateEnd 결정론', () => {
  it('같은 시드 → 같은 엔드, 다른 시드 → 다른 엔드', () => {
    const again = generateEnd(BLOCKS, SEED, 2);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateEnd(BLOCKS, SEED + 1, 2);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 END_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateEnd 배치', () => {
  it('256×96×256, 엔드 돌 섬이 떠 있고 밖은 허공, 바닥은 기반암', () => {
    expect(world.sizeX).toBe(END_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    expect(id(128, 0, 128)).toBe('bedrock');
    expect(id(10, 0, 10)).toBe('bedrock');
    expect(topOf(10, 10)).toBe(0); // 섬 밖은 기반암뿐
    expect(topOf(128, 170)).toBeGreaterThanOrEqual(SURFACE_Y - 3);
    expect(id(128, topOf(128, 170), 170)).toBe('end_stone');
    // 섬 아래는 비어 있다 (떠 있는 섬)
    expect(id(128, 20, 170)).toBe('air');
    let endStone = 0;
    for (let z = 0; z < world.sizeZ; z += 4) for (let x = 0; x < world.sizeX; x += 4) if (id(x, topOf(x, z), z) === 'end_stone') endStone++;
    expect(endStone).toBeGreaterThan(700); // 4096 표본 중 섬 ~ 1/4
  });

  it('가운데 기반암 분수 꼭대기가 드래곤 자리, 흑요석 기둥 8개 꼭대기에 발광석', () => {
    const d = layout.den;
    expect(d.x).toBe(128);
    expect(d.z).toBe(128);
    expect(id(d.x, d.y - 1, d.z)).toBe('bedrock');
    expect(id(d.x, d.y, d.z)).toBe('air');
    expect(id(d.x + 2, d.y - 3, d.z + 2)).toBe('bedrock');
    expect(layout.pillars.length).toBe(PILLAR_COUNT);
    for (const p of layout.pillars) {
      const t = topOf(p.x, p.z);
      expect(id(p.x, t, p.z)).toBe('glowstone');
      expect(id(p.x, t - 1, p.z)).toBe('obsidian');
      expect(id(p.x + 1, t - 1, p.z + 1)).toBe('obsidian');
      expect(t - 1 - (SURFACE_Y - 3)).toBeGreaterThanOrEqual(16);
      expect(Math.hypot(p.x - 128, p.z - 128)).toBeCloseTo(36, -1);
    }
  });

  it('도착 포탈은 섬 남쪽: 흑요석 문틀이 조약돌 단 위에, 스폰은 그 남쪽 공기', () => {
    const p = layout.portal;
    expect(p.x).toBe(128);
    expect(p.z).toBe(128 + PORTAL_DIST);
    expect(id(p.x, p.y - 1, p.z)).toBe('cobblestone');
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('엔드 시티 탑(북쪽): 석영 벽·유리 띠·남쪽 문·양조기, 안에 상자 둘 — 스폰에서 걸어서 닿는다', () => {
    const c = layout.city;
    expect(c.z).toBe(128 - CITY_DIST);
    expect(id(c.x + 4, c.y + 2, c.z)).toBe('quartz_block');
    expect(id(c.x + 4, c.y + 5, c.z)).toBe('glass');
    expect(id(c.x, c.y + 1, c.z + 4)).toBe('air'); // 문
    expect(id(c.x, c.y + 9, c.z)).toBe('glowstone');
    expect(id(c.x - 2, c.y + 1, c.z + 2)).toBe('brewing_stand');
    expect(layout.treasures.length).toBe(2);
    const seen = reachable(spawn);
    expect(seen.has(`${layout.den.x},${layout.den.y - 4},${layout.den.z + 3}`)).toBe(true); // 분수 앞까지 (바닥 C 위에 서면 발은 C+1)
    for (const t of layout.treasures) {
      expect(id(t.x, t.y, t.z)).toBe('chest');
      const spots = [
        [t.x, t.y, t.z + 1],
        [t.x, t.y, t.z - 1],
        [t.x + 1, t.y, t.z],
        [t.x - 1, t.y, t.z],
      ];
      expect(spots.some(([x, y, z]) => seen.has(`${x},${y},${z}`))).toBe(true);
    }
  });

  it('expeditions.json 의 엔드가 이 생성기를 쓰고 포탈 5단계로 열리며 엔더맨이 나오고 보스는 엔더 드래곤', () => {
    const def = EXPEDITIONS.require('the_end');
    expect(def.generator).toBe('end');
    expect(hasGenerator('end')).toBe(true);
    expect(def.unlockedBy).toBe('portal_5');
    expect(def.nightStartsAt).toBe(0);
    expect(def.durationSec).toBe(900);
    expect(spawnKinds(def.nightMobs)).toEqual(['enderman']);
    expect(def.bossId).toBe('ender_dragon');
    const w = generateExpedition(def, BLOCKS, SEED);
    expect(w.den).toEqual(layout.den);
    expect(w.treasures.length).toBe(2);
    expect(fingerprint(w.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
  });

  it('생성 시간을 기록한다', () => {
    expect(gen.ms).toBeGreaterThanOrEqual(0);
    expect(gen.ms).toBeLessThan(5000);
  });
});
