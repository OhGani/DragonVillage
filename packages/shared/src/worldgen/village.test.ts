import { describe, expect, it } from 'vitest';
import { AIR_ID } from '../rules/blocks';
import { BLOCKS } from '../rules/data';
import { fingerprint } from './fingerprint';
import { DEFAULT_VILLAGE_SEED, GROUND_Y, VILLAGE_BOUNDS, WATER_Y, generateVillage } from './village';

/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '240:ccbdf4e1:743090';

const gen = generateVillage(BLOCKS, DEFAULT_VILLAGE_SEED);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;
const topOf = (x: number, z: number): number => {
  for (let y = world.sizeY - 1; y >= 0; y--) if (world.getBlock(x, y, z) !== AIR_ID) return y;
  return -1;
};

describe('generateVillage 결정론', () => {
  it('같은 시드 → 같은 세계, 다른 시드 → 다른 세계', () => {
    const again = generateVillage(BLOCKS, DEFAULT_VILLAGE_SEED);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.world.chunkCount).toBe(world.chunkCount);
    const other = generateVillage(BLOCKS, DEFAULT_VILLAGE_SEED + 1);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷: 기본 시드의 지문이 기록된 값과 같다 (바꿨으면 VILLAGE_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });

  it('세계 크기 8×8×8 청크, 위쪽 빈 청크는 만들지 않는다', () => {
    expect(world.bounds).toEqual(VILLAGE_BOUNDS);
    expect(world.sizeX).toBe(128);
    expect(world.sizeY).toBe(128);
    let maxCy = 0;
    world.forEachChunk((c) => (maxCy = Math.max(maxCy, c.cy)));
    expect(maxCy).toBeLessThanOrEqual(4); // 언덕 ~52 + 나무 ~8 → cy 3 까지, 여유 1
    expect(world.chunkCount).toBeLessThan(8 * 8 * 5);
  });
});

describe('generateVillage 배치', () => {
  it('스폰은 광장 한가운데 돌 위, 서 있을 자리는 공기, 북쪽을 본다', () => {
    expect(spawn).toEqual({ x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0 });
    expect(id(64, GROUND_Y, 64)).toBe('stone');
    expect(id(64, GROUND_Y + 1, 64)).toBe('air');
    expect(id(64, GROUND_Y + 2, 64)).toBe('air');
    expect(id(60, GROUND_Y, 64)).toBe('cobblestone'); // 조약돌 원
    expect(id(64, GROUND_Y, 72)).toBe('cobblestone'); // 남쪽 길
    expect(id(74, GROUND_Y, 60)).toBe('grass'); // 광장 잔디(반지름 14 평지, 길 밖)
    for (let x = 50; x <= 78; x++)
      for (let z = 50; z <= 78; z++) {
        if (Math.hypot(x - 64, z - 64) > layout.plazaRadius) continue;
        expect(topOf(x, z), `광장 (${x},${z}) 높이`).toBe(GROUND_Y);
      }
  });

  it('포탈 자리: 광장 북쪽 조약돌 단 + 흑요석 문틀 4×5, 안은 비어 있다', () => {
    const p = layout.portal;
    expect(id(p.x, GROUND_Y, p.z)).toBe('cobblestone');
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
    expect(id(61, GROUND_Y, 41)).toBe('glowstone'); // 단 모서리
  });

  it('강: 서쪽 끝에서 동쪽 끝까지 이어지고, 수면은 39, 강변은 모래, 물 옆은 막혀 있다', () => {
    for (let x = 0; x < 128; x++) {
      let found = false;
      for (let z = 15; z < 60 && !found; z++) if (id(x, WATER_Y, z) === 'water') found = true;
      expect(found, `x=${x} 에 강이 없다`).toBe(true);
    }
    // 모든 물 원천 옆(같은 높이)은 공기가 아니어야 한다 — 아니면 시작하자마자 흘러 넘친다
    let waterBlocks = 0;
    for (let x = 0; x < 128; x++)
      for (let z = 0; z < 128; z++)
        for (let y = WATER_Y - 4; y <= WATER_Y; y++) {
          if (id(x, y, z) !== 'water') continue;
          waterBlocks++;
          for (const [dx, dz] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const nx = x + dx,
              nz = z + dz;
            if (!world.inBounds(nx, y, nz)) continue;
            expect(id(nx, y, nz), `물 (${x},${y},${z}) 옆 (${nx},${nz})`).not.toBe('air');
          }
          expect(id(x, y - 1, z), `물 (${x},${y},${z}) 아래`).not.toBe('air');
        }
    expect(waterBlocks).toBeGreaterThan(800);
    // 강 위는 공기 (수면이 땅보다 한 칸 낮다)
    let sandBanks = 0;
    for (let x = 0; x < 128; x += 4) for (let z = 15; z < 60; z++) if (id(x, GROUND_Y, z) === 'sand') sandBanks++;
    expect(sandBanks).toBeGreaterThan(30);
  });

  it('밭 둘: 농지 줄 + 물길, 호박·수박·건초, 밭 물길 옆은 막혀 있다', () => {
    for (const r of layout.fields) {
      expect(id(r.x0 + 1, GROUND_Y, r.z0)).toBe('farmland');
      expect(id(r.x0 + 1, GROUND_Y, r.z0 + 2)).toBe('water'); // 5줄마다 물길
      expect(id(r.x0 - 1, GROUND_Y, r.z0 + 2)).not.toBe('air'); // 물길 끝은 막힘
      expect(id(r.x1 + 1, GROUND_Y, r.z0 + 2)).not.toBe('air');
      expect(id(r.x0, GROUND_Y + 1, r.z0)).toBe('hay_bale');
      expect(id(r.x0, GROUND_Y + 2, r.z0)).toBe('hay_bale');
      let crops = 0;
      for (let x = r.x0; x <= r.x1; x++)
        for (let z = r.z0; z <= r.z1; z++) {
          const b = id(x, GROUND_Y + 1, z);
          if (b === 'pumpkin' || b === 'melon') crops++;
        }
      expect(crops).toBeGreaterThan(10);
    }
  });

  it('집 뼈대: 판자 벽·유리창·문 자리·지붕', () => {
    const h = layout.house;
    expect(id(h.x0, GROUND_Y + 1, h.z0)).toBe('planks');
    expect(id(h.x0 + 2, GROUND_Y + 1, h.z0)).toBe('air'); // 문 자리 (북쪽)
    expect(id(h.x0 + 2, GROUND_Y + 2, h.z0)).toBe('air');
    expect(id(h.x0, GROUND_Y + 2, (h.z0 + h.z1) >> 1)).toBe('glass');
    expect(id(h.x0 + 2, GROUND_Y + 5, h.z0 + 2)).toBe('planks'); // 지붕
    expect(id(h.x0 + 2, GROUND_Y + 2, h.z0 + 2)).toBe('air'); // 안은 비었다
  });

  it('참나무 둘레: 가장자리에 나무가 많고 광장엔 없다', () => {
    let edgeLogs = 0,
      plazaLogs = 0;
    for (let x = 0; x < 128; x++)
      for (let z = 0; z < 128; z++) {
        const t = topOf(x, z);
        if (t < 0) continue;
        // 줄기 = 잔디 바로 위 원목
        for (let y = GROUND_Y; y <= t; y++) {
          if (id(x, y, z) !== 'log' || id(x, y - 1, z) !== 'grass') continue;
          const dist = Math.hypot(x - 64, z - 64);
          if (dist > 50) edgeLogs++;
          if (dist < 26) plazaLogs++;
        }
      }
    expect(edgeLogs).toBeGreaterThan(80);
    expect(plazaLogs).toBe(0);
  });

  it('언덕은 가장자리에서 높아지고, 땅속엔 기반암·광물·동굴이 있다', () => {
    expect(topOf(4, 4)).toBeGreaterThan(GROUND_Y + 3);
    expect(topOf(124, 124)).toBeGreaterThan(GROUND_Y + 3);
    let bedrock = 0,
      ores = 0,
      caveAir = 0;
    for (let x = 0; x < 128; x += 2)
      for (let z = 0; z < 128; z += 2) {
        if (id(x, 0, z) === 'bedrock') bedrock++;
        for (let y = 2; y < 36; y++) {
          const b = id(x, y, z);
          if (b.endsWith('_ore')) ores++;
          else if (b === 'air') caveAir++;
        }
      }
    expect(bedrock).toBe(64 * 64);
    expect(ores).toBeGreaterThan(500);
    expect(caveAir).toBeGreaterThan(200);
    // 동굴 입구는 언덕 위에서 시작해 땅속으로
    const c = layout.caveEntrance;
    expect(id(c.x - 2, topOf(c.x, c.z) + 1, c.z)).toBe('air');
  });

  it('밭·강·집이 서로 겹치지 않는다', () => {
    for (const r of layout.fields)
      for (let x = r.x0; x <= r.x1; x++) for (let z = r.z0; z <= r.z1; z++) expect(topOf(x, z), `밭 (${x},${z})`).toBeLessThanOrEqual(GROUND_Y + 2);
    const h = layout.house;
    for (let x = h.x0 - 1; x <= h.x1 + 1; x++) for (let z = h.z0 - 1; z <= h.z1 + 1; z++) expect(id(x, GROUND_Y, z)).not.toBe('water');
  });
});
