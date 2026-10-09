import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { spawnKinds } from '../rules/mobs';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { FORT_HALF, LAVA_SEA_Y, NETHER_BOUNDS, generateNether } from './nether';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1337:33db0b3a:4044664';

const gen = generateNether(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const passable = (x: number, y: number, z: number) => {
  const d = BLOCKS.get(world.getBlock(x, y, z));
  return !d.solid && !d.fluid;
};
/** 천장 아래 첫 블록(땅 또는 용암) 높이 */
const groundTop = (x: number, z: number): number => {
  let y = 1;
  while (y < world.sizeY - 2 && world.getBlock(x, y + 1, z) !== AIR_ID && !passable(x, y + 1, z)) y++;
  return y;
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

describe('generateNether 결정론', () => {
  it('같은 시드 → 같은 네더, 다른 시드 → 다른 네더', () => {
    const again = generateNether(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateNether(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 NETHER_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateNether 배치', () => {
  it('256×96×256, 바닥·천장은 기반암, 천장은 네더랙 덩어리에 발광석, 용암 바다가 넓다', () => {
    expect(world.sizeX).toBe(NETHER_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    for (const [x, z] of [
      [5, 5],
      [128, 128],
      [200, 60],
    ]) {
      expect(id(x!, 0, z!)).toBe('bedrock');
      expect(id(x!, 95, z!)).toBe('bedrock');
    }
    let lava = 0,
      glow = 0,
      rackCeil = 0,
      quartz = 0,
      debris = 0,
      soul = 0,
      wart = 0;
    for (let z = 0; z < world.sizeZ; z += 2)
      for (let x = 0; x < world.sizeX; x += 2) {
        const t = groundTop(x, z);
        if (id(x, t, z) === 'lava') {
          lava++;
          expect(t).toBe(LAVA_SEA_Y);
        }
        if (id(x, t, z) === 'soul_sand') soul++;
        if (id(x, t + 1, z) === 'nether_wart') wart++;
        // 천장: 위에서 내려오며 첫 공기 바로 위 블록
        let c = 94;
        while (c > t + 1 && !passable(x, c, z)) c--;
        const cb = id(x, c + 1, z);
        if (cb === 'netherrack') rackCeil++;
        if (cb === 'glowstone') glow++;
        for (let y = 2; y < t; y += 3) {
          const b = id(x, y, z);
          if (b === 'nether_quartz_ore') quartz++;
          if (b === 'ancient_debris') debris++;
        }
      }
    expect(lava).toBeGreaterThan(1200); // 16384 칸 중 (약 1/10 이 용암 바다)
    expect(rackCeil).toBeGreaterThan(8000);
    expect(glow).toBeGreaterThan(60);
    expect(quartz).toBeGreaterThan(300);
    expect(debris).toBeGreaterThan(5);
    expect(soul).toBeGreaterThan(100);
    expect(wart).toBeGreaterThan(8);
  });

  it('도착 포탈: 흑요석 문틀 4×5 가 가운데 조약돌 단 위에 서 있고 스폰은 그 남쪽 공기', () => {
    const p = layout.portal;
    expect(p.x).toBe(128);
    expect(p.z).toBe(128);
    expect(id(p.x, p.y - 1, p.z)).toBe('cobblestone');
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    expect(id(p.x, p.y + 2, p.z)).toBe('air');
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('네더 요새: 네더 벽돌 바닥·벽·탑, 안쪽 방에 상자 셋 — 스폰에서 걸어서 닿는다. 뜰에 영혼 모래·네더 사마귀', () => {
    const f = layout.fortress;
    expect(f.y).toBeGreaterThanOrEqual(LAVA_SEA_Y + 2);
    expect(id(f.x, f.y, f.z)).toBe('nether_bricks'); // 바닥
    expect(id(f.x + FORT_HALF, f.y + 2, f.z + 5)).toBe('nether_bricks'); // 바깥 벽
    expect(id(f.x + FORT_HALF, f.y + 2, f.z)).toBe('air'); // 동쪽 문
    expect(id(f.x + FORT_HALF - 1, f.y + 8, f.z + FORT_HALF - 1)).toBe('nether_bricks'); // 탑
    expect(id(f.x + FORT_HALF - 1, f.y + 9, f.z + FORT_HALF - 1)).toBe('glowstone');
    expect(id(f.x, f.y + 5, f.z)).toBe('glowstone'); // 방 지붕 불
    expect(id(f.x, f.y + 2, f.z + 4)).toBe('air'); // 방 남쪽 문
    expect(id(f.x + 6, f.y, f.z - 6)).toBe('soul_sand');
    expect(id(f.x + 6, f.y + 1, f.z - 6)).toBe('nether_wart');
    expect(layout.treasures.length).toBe(3);
    const seen = reachable(spawn);
    for (const c of layout.treasures) {
      expect(id(c.x, c.y, c.z)).toBe('chest');
      expect(Math.max(Math.abs(c.x - f.x), Math.abs(c.z - f.z))).toBeLessThanOrEqual(3);
      const spots = [
        [c.x, c.y, c.z + 1],
        [c.x, c.y, c.z - 1],
        [c.x + 1, c.y, c.z],
        [c.x - 1, c.y, c.z],
      ];
      expect(spots.some(([x, y, z]) => seen.has(`${x},${y},${z}`))).toBe(true);
    }
  });

  it('expeditions.json 의 네더가 이 생성기를 쓰고 포탈 4단계로 열리며 처음부터 좀비 피글린·위더 스켈레톤·블레이즈·가스트', () => {
    const def = EXPEDITIONS.require('nether');
    expect(def.generator).toBe('nether');
    expect(hasGenerator('nether')).toBe(true);
    expect(def.unlockedBy).toBe('portal_4');
    expect(def.nightStartsAt).toBe(0);
    expect(spawnKinds(def.nightMobs)).toEqual(['zombified_piglin', 'wither_skeleton', 'blaze', 'ghast']);
    const w = generateExpedition(def, BLOCKS, SEED);
    expect(w.den).toBeNull();
    expect(w.treasures.length).toBe(3);
    expect(fingerprint(w.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
  });

  it('생성 시간을 기록한다', () => {
    expect(gen.ms).toBeGreaterThanOrEqual(0);
    expect(gen.ms).toBeLessThan(5000);
  });
});
