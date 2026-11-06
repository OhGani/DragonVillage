import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS, EXPEDITIONS } from '../rules/data';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';
import { INNER_HALF, OCEAN_BOUNDS, OCEAN_SEA_Y, OUTER_HALF, TEMPLE_H, generateOcean } from './ocean';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '778:f0e593cf:2693503';

const gen = generateOcean(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;

/** 마른 땅으로만 걷기 (물에 안 들어간다) — 다리로 신전까지 갈 수 있나 */
function reachable(from: { x: number; y: number; z: number }, limit = 900_000): Set<string> {
  const open = (x: number, y: number, z: number) => {
    const d = BLOCKS.get(world.getBlock(x, y, z));
    return !d.solid && !d.fluid;
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

describe('generateOcean 결정론', () => {
  it('같은 시드 → 같은 바다, 다른 시드 → 다른 바다', () => {
    const again = generateOcean(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateOcean(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 OCEAN_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateOcean 배치 (2026-11-06)', () => {
  it('256×96×256 대부분 바다(수면 40, 깊이 2칸 넘는 물이 넓다), 가운데 도착 섬에 포탈', () => {
    expect(world.sizeX).toBe(OCEAN_BOUNDS.sizeCX * 16);
    expect(world.sizeY).toBe(96);
    let deep = 0,
      n = 0;
    for (let z = 8; z < 248; z += 8)
      for (let x = 8; x < 248; x += 8) {
        n++;
        if (id(x, OCEAN_SEA_Y, z) === 'water' && id(x, OCEAN_SEA_Y - 2, z) === 'water') deep++;
      }
    expect(deep / n).toBeGreaterThan(0.7);
    const p = layout.portal;
    expect([p.x, p.z]).toEqual([128, 128]);
    for (let x = p.x - 2; x <= p.x + 1; x++) expect(id(x, p.y, p.z)).toBe('obsidian');
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('바다 신전: 프리즈머린 벽·바다 랜턴·지붕, 안은 마른 바닥, 가디언 넷·상자 셋, 가운데가 엘더 가디언 자리. 섬에서 다리로 걸어서 간다', () => {
    const t = layout.temple;
    expect(Math.hypot(t.x - 128, t.z - 128)).toBeGreaterThan(50);
    expect(t.y).toBe(OCEAN_SEA_Y + 1);
    expect(id(t.x + OUTER_HALF, t.y + 1, t.z + OUTER_HALF)).toBe('sea_lantern'); // 바깥 벽 모서리
    expect(['prismarine', 'prismarine_bricks', 'dark_prismarine']).toContain(id(t.x + 2, t.y + 2, t.z - OUTER_HALF));
    expect(id(t.x + INNER_HALF, t.y + 4, t.z + 2)).toBe('dark_prismarine'); // 안쪽 방 띠
    expect(id(t.x, t.y + TEMPLE_H + 1, t.z)).toBe('dark_prismarine'); // 지붕 첫 겹
    // 안은 마른 바닥 (물 없음)
    for (let dx = -OUTER_HALF + 1; dx <= OUTER_HALF - 1; dx += 3) for (let dz = -OUTER_HALF + 1; dz <= OUTER_HALF - 1; dz += 3) expect(id(t.x + dx, t.y + 1, t.z + dz)).not.toBe('water');
    expect(layout.guards).toHaveLength(4);
    for (const g of layout.guards) {
      expect(id(g.x, g.y, g.z)).toBe('air');
      expect(BLOCKS.get(world.getBlock(g.x, g.y - 1, g.z)).solid).toBe(true);
    }
    expect(layout.treasures).toHaveLength(3);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    const d = layout.den;
    expect(id(d.x, d.y, d.z)).toBe('air');
    const seen = reachable(spawn);
    expect(seen.has(`${d.x},${d.y},${d.z}`)).toBe(true); // 다리 → 바깥 문 → 복도 → 안쪽 문 → 보스방
    for (const c of layout.treasures) expect([0, 1, -1].some((k) => seen.has(`${c.x + k},${c.y},${c.z}`) || seen.has(`${c.x},${c.y},${c.z + k}`))).toBe(true);
  });

  it('여러 시드에서도 다리로 신전 보스방까지 걸어서 간다', () => {
    for (const s of [1, 42, 2026, 99999]) {
      const g = generateOcean(BLOCKS, s, 3);
      const w = g.world;
      const open = (x: number, y: number, z: number) => {
        const d = BLOCKS.get(w.getBlock(x, y, z));
        return !d.solid && !d.fluid;
      };
      const seen = new Set<string>();
      const q: [number, number, number][] = [[Math.floor(g.spawn.x), Math.floor(g.spawn.y), Math.floor(g.spawn.z)]];
      seen.add(q[0]!.join(','));
      while (q.length) {
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
            if (!w.inBounds(nx, ny, nz) || ny < 1 || !open(nx, ny, nz) || !open(nx, ny + 1, nz) || !BLOCKS.get(w.getBlock(nx, ny - 1, nz)).solid) continue;
            if (dy === 1 && !open(x, y + 2, z)) continue;
            const k = `${nx},${ny},${nz}`;
            if (!seen.has(k)) {
              seen.add(k);
              q.push([nx, ny, nz]);
            }
          }
      }
      const d = g.layout.den;
      expect(seen.has(`${d.x},${d.y},${d.z}`), `시드 ${s}`).toBe(true);
    }
  });

  it('expeditions.json 의 바다 신전: 생성기가 있고, 가디언 넷이 처음부터, 보스는 엘더 가디언, 바다엔 물고기', () => {
    const def = EXPEDITIONS.require('ocean_monument');
    expect(def.release).toBe('v1');
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.bossId).toBe('elder_guardian');
    expect(def.unlockedBy).toBe('portal_ocean');
    expect(Object.keys(def.wildAnimals ?? {})).toContain('tropical_fish');
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.spawns.map((s) => s.kind)).toEqual(['guardian', 'guardian', 'guardian', 'guardian']);
    expect(g.den).toEqual(layout.den);
    void AIR_ID;
  });
});
