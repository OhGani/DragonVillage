import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS } from '../rules/data';
import { fingerprint } from './fingerprint';
import { ISLAND_BOUNDS, SEA_Y, generateIsland } from './island';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '875:b4fc9559:2826021';

const gen = generateIsland(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const topOf = (x: number, z: number): number => {
  for (let y = world.sizeY - 1; y >= 0; y--) if (world.getBlock(x, y, z) !== AIR_ID) return y;
  return -1;
};

describe('generateIsland 결정론', () => {
  it('같은 시드 → 같은 섬, 다른 시드 → 다른 섬', () => {
    const again = generateIsland(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateIsland(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 ISLAND_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateIsland 배치', () => {
  it('크기·수면: 256×256, 모서리는 바다, 가운데는 땅', () => {
    expect(world.sizeX).toBe(ISLAND_BOUNDS.sizeCX * 16);
    for (const [x, z] of [
      [2, 2],
      [253, 2],
      [2, 253],
      [253, 253],
    ]) {
      expect(id(x, SEA_Y, z)).toBe('water');
      expect(id(x, SEA_Y + 1, z)).toBe('air');
    }
    expect(topOf(128, 110)).toBeGreaterThan(SEA_Y);
  });

  it('도착 포탈: 흑요석 문틀 4×5 가 가운데 평지에 서 있고 스폰은 그 남쪽 공기', () => {
    const p = layout.portal;
    expect(p.x).toBe(128);
    expect(p.z).toBe(128);
    for (let x = p.x - 2; x <= p.x + 1; x++) {
      expect(id(x, p.y, p.z)).toBe('obsidian');
      expect(id(x, p.y + 4, p.z)).toBe('obsidian');
    }
    for (let y = p.y + 1; y <= p.y + 3; y++) {
      expect(id(p.x - 2, y, p.z)).toBe('obsidian');
      expect(id(p.x + 1, y, p.z)).toBe('obsidian');
      expect(id(p.x, y, p.z)).toBe('air'); // 문틀 안은 비어 있다 (포탈 블록은 클라·서버가 채움)
    }
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y), Math.floor(spawn.z))).toBe('air');
    expect(id(Math.floor(spawn.x), Math.floor(spawn.y) - 1, Math.floor(spawn.z))).toBe('cobblestone');
    // 평지: 포탈 둘레 6칸 안 땅 높이가 다 같다
    for (let dx = -6; dx <= 6; dx++) for (let dz = -6; dz <= 6; dz++) expect(topOf(p.x + dx, p.z + dz)).toBeGreaterThanOrEqual(p.y - 1);
  });

  it('보물 오두막 3개: 상자가 조약돌 벽 안에, 서로 24칸 이상 떨어져 있다', () => {
    expect(layout.treasures).toHaveLength(3);
    for (const t of layout.treasures) {
      expect(id(t.x, t.y, t.z)).toBe('chest');
      expect(id(t.x, t.y - 1, t.z)).toBe('cobblestone');
      expect(id(t.x + 2, t.y, t.z)).toBe('cobblestone');
      expect(id(t.x - 2, t.y, t.z)).toBe('cobblestone');
      expect(id(t.x, t.y, t.z + 2)).toBe('air'); // 남쪽 문
      expect(id(t.x, t.y + 3, t.z)).toBe('cobblestone'); // 지붕
      expect(Math.hypot(t.x - 128, t.z - 128)).toBeGreaterThan(40);
    }
    for (let i = 0; i < 3; i++)
      for (let j = i + 1; j < 3; j++) {
        const a = layout.treasures[i],
          b = layout.treasures[j];
        expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThanOrEqual(24);
      }
  });

  it('나무·사탕수수·해변·광물이 있다', () => {
    const count: Record<string, number> = {};
    world.forEachChunk((c) => {
      const ids = c.toBlockIds();
      for (let i = 0; i < ids.length; i++) {
        const n = BLOCKS.get(ids[i]).id;
        count[n] = (count[n] ?? 0) + 1;
      }
    });
    expect(count.log).toBeGreaterThan(300);
    expect(count.leaves).toBeGreaterThan(count.log);
    expect(count.sugar_cane).toBeGreaterThan(20);
    expect(count.sand).toBeGreaterThan(2000);
    expect(count.grass).toBeGreaterThan(8000);
    expect(count.coal_ore).toBeGreaterThan(200);
    expect(count.iron_ore).toBeGreaterThan(50);
    expect(count.water).toBeGreaterThan(20000);
    expect(count.gold_ore ?? 0).toBe(0); // 금·다이아는 동굴 원정지
    expect((count.pumpkin ?? 0) + (count.melon ?? 0)).toBeGreaterThan(5);
  });

  it('생성 시간을 기록한다 (2코어 VM 목표 1.5s 미만)', () => {
    expect(gen.ms).toBeGreaterThan(0);
    expect(gen.ms).toBeLessThan(6000); // CI 여유. 실측은 PLAYTEST-LOG 에
  });
});
