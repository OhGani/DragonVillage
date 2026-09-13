import { describe, expect, it } from 'vitest';
import { VoxelWorld } from '../chunk/world';
import { mulberry32 } from '../math/prng';
import { parseBlocks } from '../rules/blocks';
import { LightEngine, OUTSIDE_LIGHT, packLight } from './lightEngine';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'glass', name: '유리', hardness: 1, transparent: true, texture: 'glass' },
    { id: 'leaves', name: '나뭇잎', hardness: 1, transparent: true, lightFilter: 1, texture: 'leaves' },
    { id: 'water', name: '물', solid: false, transparent: true, fluid: 'water', texture: 'water' },
    { id: 'torch', name: '횃불', solid: false, lightEmit: 14, texture: 'torch' },
    { id: 'glowstone', name: '발광석', hardness: 1, lightEmit: 15, texture: 'glowstone' },
    { id: 'lava', name: '용암', solid: false, fluid: 'lava', lightEmit: 15, texture: 'lava' },
  ],
});
const AIR = 0;
const STONE = registry.numOf('stone');
const GLASS = registry.numOf('glass');
const LEAVES = registry.numOf('leaves');
const WATER = registry.numOf('water');
const TORCH = registry.numOf('torch');
const GLOW = registry.numOf('glowstone');
const LAVA = registry.numOf('lava');

/** 2×2×2 청크(32³), y<=GROUND 는 돌 */
const GROUND = 10;
function makeWorld(): VoxelWorld {
  const w = new VoxelWorld({ sizeCX: 2, sizeCY: 2, sizeCZ: 2 });
  for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) for (let y = 0; y <= GROUND; y++) w.setBlock(x, y, z, STONE);
  return w;
}

/** 블록을 바꾸고 조명에 알린다 */
function put(w: VoxelWorld, e: LightEngine, x: number, y: number, z: number, id: number): void {
  w.setBlock(x, y, z, id);
  e.markChanged(x, y, z);
}

/** 증분 갱신 결과가 처음부터 계산한 것과 같은지 */
function expectSameAsFresh(w: VoxelWorld, e: LightEngine): void {
  const fresh = new LightEngine(w, registry);
  fresh.computeAll();
  let diff = -1;
  for (let i = 0; i < fresh.light.length; i++)
    if (fresh.light[i] !== e.light[i]) {
      diff = i;
      break;
    }
  if (diff >= 0) {
    const x = diff % 32,
      t = (diff - x) / 32,
      z = t % 32,
      y = (t - z) / 32;
    throw new Error(`(${x},${y},${z}) 증분 ${e.light[diff].toString(16)} ≠ 전체 ${fresh.light[diff].toString(16)}`);
  }
}

describe('LightEngine 기본', () => {
  it('블록 표: lightFilter 기본값 (불투명 15, 물 1, 유리·공기 0, 나뭇잎은 JSON 1)', () => {
    expect(registry.get(AIR).lightFilter).toBe(0);
    expect(registry.get(STONE).lightFilter).toBe(15);
    expect(registry.get(GLASS).lightFilter).toBe(0);
    expect(registry.get(LEAVES).lightFilter).toBe(1);
    expect(registry.get(WATER).lightFilter).toBe(1);
    expect(registry.get(LAVA).lightFilter).toBe(15);
    expect(registry.get(TORCH).lightFilter).toBe(0);
    // 흐르는 물도 물과 같은 값을 물려받는다
    expect(registry.get(registry.fluidVariant(WATER, 3)).lightFilter).toBe(1);
    expect(registry.get(registry.fluidVariant(LAVA, 2)).lightEmit).toBe(15);
  });

  it('열린 하늘 아래 공기는 15, 땅속 돌은 0', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.skyAt(5, GROUND + 1, 5)).toBe(15);
    expect(e.skyAt(5, 31, 5)).toBe(15);
    expect(e.skyAt(5, GROUND, 5)).toBe(0);
    expect(e.skyAt(5, 3, 5)).toBe(0);
    expect(e.blockAt(5, GROUND + 1, 5)).toBe(0);
    expect(e.get(-1, 5, 5)).toBe(OUTSIDE_LIGHT);
  });

  it('지붕 아래는 옆에서 들어온 빛으로 한 칸마다 1씩 어두워진다', () => {
    const w = makeWorld();
    // 3×3 돌 지붕, 가운데 (16,20,16)
    for (let x = 15; x <= 17; x++) for (let z = 15; z <= 17; z++) w.setBlock(x, 20, z, STONE);
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.skyAt(14, 19, 16)).toBe(15); // 지붕 밖
    expect(e.skyAt(15, 19, 16)).toBe(14); // 가장자리 아래
    expect(e.skyAt(16, 19, 16)).toBe(13); // 가운데 아래
    expect(e.skyAt(16, GROUND + 1, 16)).toBe(13); // 그림자는 땅까지 이어진다
    expect(e.skyAt(16, 21, 16)).toBe(15); // 지붕 위는 그대로
  });

  it('유리는 빛을 그대로 통과, 나뭇잎·물은 한 칸마다 1씩 더 어둡다', () => {
    const w = makeWorld();
    for (let x = 0; x < 32; x++)
      for (let z = 0; z < 32; z++) {
        w.setBlock(x, 25, z, x < 11 ? GLASS : x < 22 ? LEAVES : WATER);
      }
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.skyAt(5, 25, 5)).toBe(15); // 유리 안
    expect(e.skyAt(5, 24, 5)).toBe(15); // 유리 아래
    expect(e.skyAt(15, 25, 5)).toBe(14); // 나뭇잎 안
    expect(e.skyAt(15, 24, 5)).toBe(13); // 나뭇잎 아래부터는 15 가 아니므로 계속 줄어든다
    expect(e.skyAt(15, 23, 5)).toBe(12);
    expect(e.skyAt(27, 25, 5)).toBe(14); // 물
    expect(e.skyAt(27, 24, 5)).toBe(13);
  });

  it('완전히 막힌 방은 0, 천장에 구멍을 내면 빛이 들어온다', () => {
    const w = makeWorld();
    // 방: 안쪽 공기 x 13..19, y 12..16, z 13..19, 벽 두께 1
    for (let x = 12; x <= 20; x++)
      for (let y = 11; y <= 17; y++)
        for (let z = 12; z <= 20; z++) {
          const wall = x === 12 || x === 20 || y === 11 || y === 17 || z === 12 || z === 20;
          w.setBlock(x, y, z, wall ? STONE : AIR);
        }
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.skyAt(16, 14, 16)).toBe(0);
    expect(e.skyAt(13, 12, 13)).toBe(0);

    put(w, e, 16, 17, 16, AIR); // 천장 구멍
    const changed = e.flush();
    expect(changed.length).toBeGreaterThan(0);
    expect(e.skyAt(16, 16, 16)).toBe(15); // 구멍 바로 아래는 직사광
    expect(e.skyAt(16, 12, 16)).toBe(15); // 바닥까지 15
    expect(e.skyAt(17, 16, 16)).toBe(14);
    expect(e.skyAt(19, 12, 19)).toBe(15 - 3 - 3); // 기둥(15)에서 가로 맨해튼 거리만큼
    expectSameAsFresh(w, e);

    put(w, e, 16, 17, 16, STONE); // 다시 막는다
    e.flush();
    expect(e.skyAt(16, 14, 16)).toBe(0);
    expectSameAsFresh(w, e);
  });
});

describe('LightEngine 블록라이트', () => {
  it('횃불 14 → 한 칸마다 1씩, 돌은 막는다', () => {
    const w = makeWorld();
    w.setBlock(16, GROUND + 1, 16, TORCH);
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.blockAt(16, GROUND + 1, 16)).toBe(14);
    expect(e.blockAt(17, GROUND + 1, 16)).toBe(13);
    expect(e.blockAt(16, GROUND + 5, 16)).toBe(10);
    expect(e.blockAt(16 + 13, GROUND + 1, 16)).toBe(1);
    expect(e.blockAt(16 + 14, GROUND + 1, 16)).toBe(0);
    expect(e.blockAt(16, GROUND, 16)).toBe(0); // 돌 안
    expect(e.skyAt(16, GROUND + 1, 16)).toBe(15); // 스카이는 별개
  });

  it('발광석은 불투명이지만 자기 칸이 15, 이웃 14', () => {
    const w = makeWorld();
    w.setBlock(16, GROUND + 1, 16, GLOW);
    const e = new LightEngine(w, registry);
    e.computeAll();
    expect(e.blockAt(16, GROUND + 1, 16)).toBe(15);
    expect(e.blockAt(16, GROUND + 2, 16)).toBe(14);
    expect(e.skyAt(16, GROUND + 1, 16)).toBe(0); // 불투명이라 스카이는 없다
    expect(e.skyAt(16, GROUND + 2, 16)).toBe(15);
  });

  it('횃불을 놓고 치우면 블록라이트가 완전히 사라진다', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    put(w, e, 16, GROUND + 1, 16, TORCH);
    e.flush();
    expect(e.blockAt(18, GROUND + 1, 16)).toBe(12);
    expectSameAsFresh(w, e);

    put(w, e, 16, GROUND + 1, 16, AIR);
    e.flush();
    for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) expect(e.blockAt(x, GROUND + 1, z)).toBe(0);
    expectSameAsFresh(w, e);
  });

  it('겹치는 두 광원 중 하나를 치우면 다른 쪽 빛은 남는다', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    put(w, e, 10, GROUND + 1, 16, TORCH);
    put(w, e, 14, GROUND + 1, 16, GLOW);
    e.flush();
    expectSameAsFresh(w, e);
    put(w, e, 14, GROUND + 1, 16, AIR);
    e.flush();
    expect(e.blockAt(10, GROUND + 1, 16)).toBe(14);
    expect(e.blockAt(14, GROUND + 1, 16)).toBe(10);
    expectSameAsFresh(w, e);
  });

  it('용암(불투명 발광)을 물로 바꾸면 빛이 꺼지고 물 필터가 적용된다', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    put(w, e, 16, GROUND + 1, 16, LAVA);
    e.flush();
    expect(e.blockAt(16, GROUND + 2, 16)).toBe(14);
    expect(e.skyAt(16, GROUND + 1, 16)).toBe(0);
    put(w, e, 16, GROUND + 1, 16, WATER);
    e.flush();
    expect(e.blockAt(16, GROUND + 2, 16)).toBe(0);
    expect(e.skyAt(16, GROUND + 1, 16)).toBe(14);
    expectSameAsFresh(w, e);
  });
});

describe('LightEngine 빠른 초기 계산 = 단순 BFS', () => {
  it('지붕·방·물·나뭇잎·언덕이 있는 세계에서 두 방식이 같다', () => {
    const w = makeWorld();
    for (let x = 4; x <= 12; x++) for (let z = 4; z <= 12; z++) w.setBlock(x, 18, z, STONE); // 지붕
    for (let x = 12; x <= 20; x++)
      for (let y = 11; y <= 17; y++)
        for (let z = 12; z <= 20; z++) {
          const wall = x === 12 || x === 20 || y === 11 || y === 17 || z === 12 || z === 20;
          w.setBlock(x, y, z, wall ? STONE : AIR);
        }
    w.setBlock(16, 17, 16, AIR); // 천장 구멍
    for (let x = 22; x <= 28; x++) for (let z = 20; z <= 26; z++) w.setBlock(x, GROUND, z, WATER);
    for (let x = 0; x < 10; x++) for (let z = 20; z < 30; z++) w.setBlock(x, 22, z, LEAVES);
    for (let x = 24; x < 32; x++) for (let z = 0; z < 8; z++) for (let y = GROUND + 1; y <= GROUND + 6; y++) w.setBlock(x, y, z, STONE); // 언덕
    w.setBlock(30, 31, 30, STONE); // 맨 윗줄 블록
    w.setBlock(31, 31, 31, LEAVES);
    w.setBlock(8, 14, 8, TORCH);
    const fast = new LightEngine(w, registry);
    fast.computeAll();
    const naive = new LightEngine(w, registry);
    naive.computeAll(true);
    expect(Buffer.from(fast.light).equals(Buffer.from(naive.light))).toBe(true);
  });
});

describe('LightEngine 증분 갱신 = 전체 재계산', () => {
  it('무작위(시드) 블록 변경 200회 뒤에도 같다', () => {
    const w = makeWorld();
    // 시작 지형: 지붕 + 방 + 물웅덩이 + 광원
    for (let x = 4; x <= 12; x++) for (let z = 4; z <= 12; z++) w.setBlock(x, 18, z, STONE);
    for (let x = 20; x <= 26; x++) for (let z = 20; z <= 26; z++) w.setBlock(x, GROUND, z, WATER);
    w.setBlock(8, 14, 8, TORCH);
    w.setBlock(24, 24, 24, GLOW);
    const e = new LightEngine(w, registry);
    e.computeAll();

    const rng = mulberry32(20260913);
    const ids = [AIR, AIR, STONE, STONE, GLASS, LEAVES, WATER, TORCH, GLOW, LAVA];
    for (let round = 0; round < 40; round++) {
      const n = 1 + Math.floor(rng() * 5); // 한 flush 에 여러 칸
      for (let k = 0; k < n; k++) {
        const x = Math.floor(rng() * 32);
        const y = GROUND - 2 + Math.floor(rng() * 22);
        const z = Math.floor(rng() * 32);
        put(w, e, x, y, z, ids[Math.floor(rng() * ids.length)]);
      }
      e.flush();
      expectSameAsFresh(w, e);
    }
  });

  it('맨 윗줄 블록을 놓고 치워도 같다 (가상 하늘 규칙)', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    put(w, e, 5, 31, 5, STONE);
    e.flush();
    expect(e.skyAt(5, 30, 5)).toBe(14);
    expectSameAsFresh(w, e);
    put(w, e, 5, 31, 5, LEAVES);
    e.flush();
    expect(e.skyAt(5, 31, 5)).toBe(14);
    expect(e.skyAt(5, 30, 5)).toBe(14); // 옆 15 에서 온 14 가 더 밝다
    expectSameAsFresh(w, e);
    put(w, e, 5, 31, 5, AIR);
    e.flush();
    expect(e.skyAt(5, 30, 5)).toBe(15);
    expectSameAsFresh(w, e);
  });

  it('빛과 상관없는 변경(돌→유리 아닌 돌→돌)은 아무 청크도 돌려주지 않는다', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    put(w, e, 5, GROUND, 5, STONE); // 값이 같다
    expect(e.flush()).toEqual([]);
    put(w, e, 5, GROUND + 1, 5, GLASS); // 공기 → 유리: 필터 0 → 0
    expect(e.flush()).toEqual([]);
  });
});

describe('LightEngine 청크·메싱 연동', () => {
  it('경계 칸의 빛이 바뀌면 이웃 청크도 돌려준다', () => {
    const w = makeWorld();
    const e = new LightEngine(w, registry);
    e.computeAll();
    // 완전히 막힌 작은 방 안(어두움)에 횃불 → 빛이 x=15 (청크 0 의 경계) 에 닿는다
    for (let x = 12; x <= 16; x++)
      for (let y = 12; y <= 16; y++)
        for (let z = 12; z <= 16; z++) {
          const wall = x === 12 || x === 16 || y === 12 || y === 16 || z === 12 || z === 16;
          w.setBlock(x, y, z, wall ? STONE : AIR);
        }
    const e2 = new LightEngine(w, registry);
    e2.computeAll();
    put(w, e2, 13, 14, 14, TORCH);
    const changed = e2.flush();
    const keys = changed.map((c) => `${c.cx},${c.cy},${c.cz}`);
    expect(keys).toContain('0,0,0');
    expect(keys).toContain('1,0,0'); // x=15 칸이 바뀌었으니 오른쪽 이웃도
    void e;
  });

  it('buildPaddedLight 는 세계 밖을 하늘 15 로 채우고 안쪽은 그대로', () => {
    const w = makeWorld();
    w.setBlock(3, GROUND + 1, 3, TORCH);
    const e = new LightEngine(w, registry);
    e.computeAll();
    const p = e.buildPaddedLight(0, 0, 0);
    expect(p.length).toBe(18 * 18 * 18);
    const at = (x: number, y: number, z: number) => p[((y + 1) * 18 + (z + 1)) * 18 + (x + 1)];
    expect(at(-1, 5, 5)).toBe(OUTSIDE_LIGHT);
    expect(at(3, GROUND + 1, 3)).toBe(packLight(15, 14));
    expect(at(3, GROUND, 3)).toBe(0);
    expect(at(16, GROUND + 1, 3)).toBe(packLight(15, 1)); // 이웃 청크 값 (거리 13)
  });
});
