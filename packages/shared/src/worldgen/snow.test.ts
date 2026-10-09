import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { spawnKinds } from '../rules/mobs';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { LAKE_Y, SNOW_BOUNDS, SNOW_GROUND_Y, generateSnow } from './snow';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1161:6e07a02a:3614224';

const gen = generateSnow(BLOCKS, SEED, 3);
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

/** 스폰에서 걸어서(한 칸 오르내리기) 갈 수 있는 칸들 — 동굴·사막 테스트와 같은 규칙 */
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

describe('generateSnow 결정론', () => {
  it('같은 시드 → 같은 설원, 다른 시드 → 다른 설원', () => {
    const again = generateSnow(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateSnow(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 SNOW_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateSnow 배치', () => {
  it('256×96×256, 땅은 눈 블록 2겹 → 흙 3겹 → 돌, 가장자리는 눈 산', () => {
    expect(world.sizeX).toBe(SNOW_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    const far = (x: number, z: number) => [...layout.igloos, ...layout.golems].every((s) => Math.max(Math.abs(s.x - x), Math.abs(s.z - z)) > 20) && topOf(x, z) >= LAKE_Y + 1;
    let x = 198,
      z = 128;
    for (let a = 5; a < 360 && !(far(x, z) && id(x, topOf(x, z), z) === 'snow_block'); a += 5) {
      x = Math.round(128 + Math.cos((a * Math.PI) / 180) * 70);
      z = Math.round(128 + Math.sin((a * Math.PI) / 180) * 70);
    }
    const t = topOf(x, z);
    expect(Math.abs(t - SNOW_GROUND_Y)).toBeLessThan(20);
    expect(id(x, t, z)).toBe('snow_block');
    expect(id(x, t - 1, z)).toBe('snow_block');
    expect(id(x, t - 2, z)).toBe('dirt');
    expect(id(x, t - 4, z)).toBe('dirt');
    expect(['stone', 'coal_ore', 'iron_ore', 'lapis_ore']).toContain(id(x, t - 5, z));
    expect(id(x, 0, z)).toBe('bedrock');
    expect(topOf(128, 3) - SNOW_GROUND_Y).toBeGreaterThan(20);
    expect(topOf(252, 128) - SNOW_GROUND_Y).toBeGreaterThan(20);
  });

  it('도착 포탈: 흑요석 문틀 4×5 가 가운데 조약돌 단 위에 서 있고 스폰은 그 남쪽 공기, 눈 골렘 셋', () => {
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
    expect(layout.golems.length).toBe(3);
    for (const g of layout.golems) {
      expect(id(g.x, g.y, g.z)).toBe('snow_block');
      expect(id(g.x, g.y + 1, g.z)).toBe('snow_block');
      expect(id(g.x, g.y + 2, g.z)).toBe('carved_pumpkin');
    }
  });

  it('얼어붙은 호수: 얼음 아래 물, 호수에 서 있는 나무는 없다', () => {
    let ice = 0,
      bad = 0;
    for (let z = 0; z < world.sizeZ; z += 2)
      for (let x = 0; x < world.sizeX; x += 2) {
        const t = topOf(x, z);
        if (id(x, t, z) === 'ice') {
          ice++;
          expect(t).toBe(LAKE_Y);
          if (!['water', 'dirt'].includes(id(x, t - 1, z))) bad++; // 물가 한 칸은 흙 위에 얼음
        }
        if (id(x, t, z) === 'water') bad++; // 얼음 없이 드러난 물은 없다
      }
    expect(ice).toBeGreaterThan(200);
    expect(bad).toBe(0);
  });

  it('이글루 3개: 눈 블록 반구 안에 상자와 횃불, 남쪽 입구로 걸어 들어간다', () => {
    expect(layout.igloos.length).toBe(3);
    expect(layout.treasures.length).toBe(3);
    const seen = reachable(spawn);
    for (const g of layout.igloos) {
      expect(id(g.x, g.y + 1, g.z)).toBe('chest');
      expect(id(g.x - 2, g.y + 1, g.z - 1)).toBe('torch');
      expect(id(g.x, g.y + 5, g.z)).toBe('snow_block'); // 지붕
      expect(id(g.x + 4, g.y + 1, g.z)).toBe('snow_block'); // 벽
      expect(id(g.x, g.y + 1, g.z + 4)).toBe('air'); // 입구
      expect(seen.has(`${g.x},${g.y + 1},${g.z + 1}`)).toBe(true); // 상자 앞
    }
  });

  it('가문비 숲이 있고 나무는 눈 위에 선다', () => {
    let trees = 0;
    for (let z = 0; z < world.sizeZ; z += 2)
      for (let x = 0; x < world.sizeX; x += 2) {
        const t = topOf(x, z);
        if (id(x, t, z) !== 'leaves' || id(x, t - 1, z) !== 'log') continue;
        trees++;
        let b = t - 1;
        while (id(x, b, z) === 'log') b--;
        expect(id(x, b, z)).toBe('snow_block');
        expect(t - b).toBeGreaterThanOrEqual(7);
      }
    expect(trees).toBeGreaterThan(30);
  });

  it('expeditions.json 의 설원이 이 생성기를 쓰고 포탈 3단계로 열리며 밤엔 스트레이·좀비', () => {
    const def = EXPEDITIONS.require('snowfield');
    expect(def.generator).toBe('snow');
    expect(hasGenerator('snow')).toBe(true);
    expect(def.unlockedBy).toBe('portal_3');
    expect(def.nightStartsAt).toBe(300);
    expect(spawnKinds(def.nightMobs)).toEqual(['stray', 'zombie']);
    const w = generateExpedition(def, BLOCKS, SEED);
    expect(w.den).toBeNull();
    expect(w.treasures.length).toBe(3);
    expect(fingerprint(w.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
  });

  it('생성 시간을 기록한다', () => {
    expect(gen.ms).toBeGreaterThanOrEqual(0);
    expect(gen.ms).toBeLessThan(4000);
  });
});
