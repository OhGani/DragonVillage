import { describe, expect, it } from 'vitest';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { PIT_DEPTH, PIT_R, SWAMP_BOUNDS, SWAMP_GROUND_Y, generateSwamp } from './swamp';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1017:bca3fcbc:3317822';

const gen = generateSwamp(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;

/** 걷기 — 얕은 물(발이 물에 잠겨도 바닥이 단단하면)은 걸어서 건넌다 */
function reachable(from: { x: number; y: number; z: number }, limit = 900_000): Set<string> {
  const open = (x: number, y: number, z: number) => {
    const d = BLOCKS.get(world.getBlock(x, y, z));
    return !d.solid;
  };
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
        if (!open(nx, ny, nz) || !open(nx, ny + 1, nz)) continue;
        if (!BLOCKS.get(world.getBlock(nx, ny - 1, nz)).solid) continue;
        if (dy === 1 && !open(x, y + 2, z)) continue;
        const k = `${nx},${ny},${nz}`;
        if (seen.has(k)) continue;
        seen.add(k);
        q.push([nx, ny, nz]);
      }
  }
  return seen;
}

describe('generateSwamp 결정론', () => {
  it('같은 시드 → 같은 늪, 다른 시드 → 다른 늪', () => {
    const again = generateSwamp(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateSwamp(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 SWAMP_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateSwamp 배치 (2026-11-06)', () => {
  it('낮고 평평한 땅에 얕은 물웅덩이(깊이 1~2)가 많고, 늪 참나무·버섯이 있다', () => {
    expect(world.sizeX).toBe(SWAMP_BOUNDS.sizeCX * 16);
    let water = 0,
      deep = 0,
      logs = 0,
      shrooms = 0,
      n = 0;
    for (let z = 30; z < 226; z += 2)
      for (let x = 30; x < 226; x += 2) {
        n++;
        if (id(x, SWAMP_GROUND_Y, z) === 'water') {
          water++;
          if (id(x, SWAMP_GROUND_Y - 3, z) === 'water') deep++;
        }
        for (let y = SWAMP_GROUND_Y + 1; y < SWAMP_GROUND_Y + 6; y++) {
          if (id(x, y, z) === 'log') logs++;
          if (id(x, y, z) === 'brown_mushroom' || id(x, y, z) === 'red_mushroom') shrooms++;
        }
      }
    expect(water / n).toBeGreaterThan(0.15);
    expect(deep).toBe(0); // 깊은 물은 없다 — 걸어서 건넌다
    expect(logs).toBeGreaterThan(30);
    expect(shrooms).toBeGreaterThan(5);
    const p = layout.portal;
    for (let x = p.x - 2; x <= p.x + 1; x++) expect(id(x, p.y, p.z)).toBe('obsidian');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('마녀 오두막: 가문비 판자 집이 물 위 기둥에, 안에 상자, 앞에 마녀 둘. 슬라임 웅덩이: 이끼 조약돌 둘레, 바닥에 슬라임 블록, 가운데 큰 슬라임 자리. 걸어서 다 간다', () => {
    const h = layout.hut;
    expect(id(h.x, h.y, h.z)).toBe('spruce_planks');
    for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]] as [number, number][]) expect(id(h.x + dx, h.y - 1, h.z + dz)).toBe('spruce_log'); // 물속 기둥 넷
    expect(id(h.x - 2, h.y - 3, h.z - 2)).toBe('spruce_log');
    expect(['water', 'spruce_log']).toContain(id(h.x, h.y - 3, h.z)); // 오두막 밑은 물
    expect(id(h.x, h.y - 3, h.z)).toBe('water');
    expect(id(h.x - 2, h.y + 1, h.z + 4)).toBe('oak_fence'); // 툇마루 울타리
    expect(id(h.x + 3, h.y + 4, h.z)).toBe('spruce_planks'); // 처마
    expect(id(h.x + 2, h.y + 4 + 1, h.z)).toBe('spruce_planks'); // 지붕 둘째 겹
    expect(id(h.x, h.y + 1, h.z)).toBe('air');
    expect(layout.witches).toHaveLength(2);
    expect(layout.treasures).toHaveLength(3);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    const p = layout.pit;
    expect(p.y).toBe(SWAMP_GROUND_Y + 1 - PIT_DEPTH);
    let slime = 0;
    for (let dx = -PIT_R; dx <= PIT_R; dx++) for (let dz = -PIT_R; dz <= PIT_R; dz++) if (Math.hypot(dx, dz) <= PIT_R && id(p.x + dx, p.y, p.z + dz) === 'slime_block') slime++;
    expect(slime).toBeGreaterThan(10);
    expect(['mossy_cobblestone', 'cobblestone']).toContain(id(p.x + PIT_R + 1, p.y + 2, p.z));
    expect(layout.slimes).toHaveLength(4);
    for (const s of [...layout.slimes, ...layout.witches]) {
      expect(BLOCKS.get(world.getBlock(s.x, s.y, s.z)).solid).toBe(false);
      expect(BLOCKS.get(world.getBlock(s.x, s.y - 1, s.z)).solid).toBe(true);
    }
    const seen = reachable(spawn);
    const d = layout.den;
    expect(seen.has(`${d.x},${d.y},${d.z}`)).toBe(true); // 비탈로 웅덩이 바닥까지
    expect(seen.has(`${h.x},${h.y + 1},${h.z}`)).toBe(true); // 계단으로 오두막 안까지
  });

  it('expeditions.json 의 늪: 생성기가 있고, 슬라임 넷·마녀 둘이 처음부터, 보스는 큰 슬라임', () => {
    const def = EXPEDITIONS.require('swamp');
    expect(def.release).toBe('v1');
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.bossId).toBe('giant_slime');
    expect(def.unlockedBy).toBe('portal_swamp');
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.spawns.map((s) => s.kind)).toEqual(['slime', 'slime', 'slime', 'slime', 'witch', 'witch']);
    expect(g.den).toEqual(layout.den);
  });
});
