import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { spawnKinds } from '../rules/mobs';
import { DESERT_BOUNDS, DESERT_GROUND_Y, PYRAMID_HALF, PYRAMID_HEIGHT, generateDesert } from './desert';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1115:c7054883:3654890';

const gen = generateDesert(BLOCKS, SEED, 4);
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

/** 스폰에서 걸어서(한 칸 오르내리기) 갈 수 있는 칸들 — 동굴 테스트와 같은 규칙 */
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

describe('generateDesert 결정론', () => {
  it('같은 시드 → 같은 사막, 다른 시드 → 다른 사막', () => {
    const again = generateDesert(BLOCKS, SEED, 4);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateDesert(BLOCKS, SEED + 1, 4);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 DESERT_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateDesert 배치', () => {
  it('256×96×256, 땅은 모래 4겹 → 사암 3겹 → 돌, 가장자리는 모래 산', () => {
    expect(world.sizeX).toBe(DESERT_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    // 포탈·피라미드·마을·오아시스(경사로 포함)에서 떨어진 보통 땅을 하나 고른다
    const far = (x: number, z: number) => [layout.pyramid, layout.village, ...layout.oases].every((s) => Math.max(Math.abs(s.x - x), Math.abs(s.z - z)) > 40);
    let x = 198,
      z = 128; // 각도 0 에서 시작, 가운데서 70칸 둘레를 돈다
    for (let a = 5; a < 360 && !far(x, z); a += 5) {
      x = Math.round(128 + Math.cos((a * Math.PI) / 180) * 70);
      z = Math.round(128 + Math.sin((a * Math.PI) / 180) * 70);
    }
    expect(far(x, z)).toBe(true);
    const t = topOf(x, z);
    expect(Math.abs(t - DESERT_GROUND_Y)).toBeLessThan(16);
    expect(id(x, t, z)).toBe('sand');
    expect(id(x, t - 3, z)).toBe('sand');
    expect(id(x, t - 4, z)).toBe('sandstone');
    expect(id(x, t - 6, z)).toBe('sandstone');
    expect(['stone', 'coal_ore', 'iron_ore', 'gold_ore']).toContain(id(x, t - 7, z));
    expect(id(x, 0, z)).toBe('bedrock');
    // 가장자리(가운데서 125칸 밖)는 안쪽보다 20칸 넘게 높다
    expect(topOf(128, 3) - DESERT_GROUND_Y).toBeGreaterThan(20);
    expect(topOf(252, 128) - DESERT_GROUND_Y).toBeGreaterThan(20);
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
    for (let y = p.y + 1; y <= p.y + 3; y++) {
      expect(id(p.x - 2, y, p.z)).toBe('obsidian');
      expect(id(p.x + 1, y, p.z)).toBe('obsidian');
      expect(id(p.x, y, p.z)).toBe('air');
    }
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y) - 1, Math.floor(spawn.z))).toBe('cobblestone');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('피라미드: 사암 계단 21×21×9, 남쪽 입구로 들어가면 상자 둘', () => {
    const { x, y, z } = layout.pyramid;
    expect(id(x - PYRAMID_HALF, y + 1, z + PYRAMID_HALF)).toBe('sandstone'); // 모서리
    expect(id(x, y + PYRAMID_HEIGHT, z)).toBe('sandstone'); // 꼭대기
    expect(id(x, y + PYRAMID_HEIGHT + 1, z)).toBe('air');
    expect(id(x, y + 2, z)).toBe('air'); // 안쪽 방
    expect(id(x, y + 2, z + PYRAMID_HALF)).toBe('air'); // 입구
    expect(id(x, y + 5, z)).toBe('glowstone');
    const inPyramid = layout.treasures.filter((c) => Math.abs(c.x - x) <= 2 && Math.abs(c.z - z) <= 2);
    expect(inPyramid.length).toBe(2);
    for (const c of inPyramid) expect(id(c.x, c.y, c.z)).toBe('chest');
  });

  it('사막 마을: 우물에 물, 사암 집 3채 안에 남은 상자 둘', () => {
    const v = layout.village;
    expect(id(v.x, v.y, v.z)).toBe('water');
    expect(id(v.x + 1, v.y + 1, v.z)).toBe('cobblestone');
    const others = layout.treasures.filter((c) => !(Math.abs(c.x - layout.pyramid.x) <= 2 && Math.abs(c.z - layout.pyramid.z) <= 2));
    expect(others.length).toBe(2);
    for (const c of others) {
      expect(id(c.x, c.y, c.z)).toBe('chest');
      expect(id(c.x - 2, c.y, c.z)).toBe('sandstone'); // 벽
      expect(id(c.x, c.y + 3, c.z)).toBe('sandstone'); // 지붕
      expect(id(c.x, c.y, c.z + 2)).toBe('air'); // 남쪽 문
      expect(Math.hypot(c.x - v.x, c.z - v.z)).toBeLessThan(16);
    }
    expect(layout.treasures.length).toBe(4);
  });

  it('보물 상자 네 개 모두 스폰에서 걸어서 닿는다', () => {
    const seen = reachable(spawn);
    for (const c of layout.treasures) {
      // 상자 앞(남쪽 한 칸)이나 상자 옆 칸에 설 수 있으면 된다
      const spots = [
        [c.x, c.y, c.z + 1],
        [c.x, c.y, c.z - 1],
        [c.x + 1, c.y, c.z],
        [c.x - 1, c.y, c.z],
      ];
      expect(spots.some(([x, y, z]) => seen.has(`${x},${y},${z}`))).toBe(true);
    }
  });

  it('오아시스 2곳에 물과 사탕수수, 선인장은 모래 위에', () => {
    expect(layout.oases.length).toBe(2);
    let cane = 0;
    for (const o of layout.oases) {
      expect(id(o.x, topOf(o.x, o.z), o.z)).toBe('water');
      for (let dx = -8; dx <= 8; dx++) for (let dz = -8; dz <= 8; dz++) if (id(o.x + dx, topOf(o.x + dx, o.z + dz), o.z + dz) === 'sugar_cane') cane++;
    }
    expect(cane).toBeGreaterThan(4);
    let cactus = 0;
    for (let z = 0; z < world.sizeZ; z += 2)
      for (let x = 0; x < world.sizeX; x += 2) {
        const t = topOf(x, z);
        if (id(x, t, z) === 'cactus') {
          cactus++;
          let b = t;
          while (id(x, b, z) === 'cactus') b--;
          expect(id(x, b, z)).toBe('sand');
        }
      }
    expect(cactus).toBeGreaterThan(10);
  });

  it('expeditions.json 의 사막이 이 생성기를 쓰고 포탈 2단계로 열리며 밤엔 허스크·크리퍼·엔더맨', () => {
    const def = EXPEDITIONS.require('desert');
    expect(def.generator).toBe('desert');
    expect(hasGenerator('desert')).toBe(true);
    expect(def.unlockedBy).toBe('portal_2');
    expect(def.nightStartsAt).toBe(360);
    expect(spawnKinds(def.nightMobs)).toEqual(['husk', 'creeper', 'enderman']);
    const w = generateExpedition(def, BLOCKS, SEED);
    expect(w.den).toBeNull();
    expect(w.treasures.length).toBe(4);
    expect(fingerprint(w.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
  });

  it('생성 시간을 기록한다 (2코어 VM 목표 1.5s 미만)', () => {
    expect(gen.ms).toBeGreaterThanOrEqual(0);
    expect(gen.ms).toBeLessThan(4000);
  });
});
