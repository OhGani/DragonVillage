import { describe, expect, it } from 'vitest';
import { VoxelWorld } from '../chunk/world';
import { parseBlocks } from '../rules/blocks';
import { FLUID_RULES, FluidSim } from './fluidSim';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'cobblestone', name: '조약돌', hardness: 1, texture: 'cobblestone' },
    { id: 'obsidian', name: '흑요석', hardness: 1, texture: 'obsidian' },
    { id: 'water', name: '물', solid: false, transparent: true, fluid: 'water', texture: 'water' },
    { id: 'lava', name: '용암', solid: false, fluid: 'lava', texture: 'lava' },
  ],
});
const STONE = registry.numOf('stone');
const WATER = registry.numOf('water');
const LAVA = registry.numOf('lava');

/** 바닥(y=0 돌) 위에 빈 세상 */
function flatWorld(): VoxelWorld {
  const w = new VoxelWorld({ sizeCX: 2, sizeCY: 1, sizeCZ: 2 });
  for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) w.setBlock(x, 0, z, STONE);
  return w;
}

function run(sim: FluidSim, ticks: number): void {
  for (let i = 0; i < ticks; i++) sim.tick();
}

function countKind(w: VoxelWorld, kind: 'water' | 'lava'): number {
  let n = 0;
  for (let x = 0; x < 32; x++) for (let y = 0; y < 16; y++) for (let z = 0; z < 32; z++) if (registry.get(w.getBlock(x, y, z)).fluid === kind) n++;
  return n;
}

describe('FluidSim — 물', () => {
  it('원천 하나가 평지에서 7칸까지 마름모로 퍼진다', () => {
    const w = flatWorld();
    const sim = new FluidSim(w, registry);
    w.setBlock(16, 1, 16, WATER);
    sim.touch(16, 1, 16);
    run(sim, FLUID_RULES.water.interval * 10);
    // 맨해튼 거리 ≤ 7 인 칸 수 = 1 + 4·(1+2+…+7) = 113
    expect(countKind(w, 'water')).toBe(113);
    expect(registry.get(w.getBlock(16, 1, 16)).fluidLevel).toBe(0);
    expect(registry.get(w.getBlock(19, 1, 16)).fluidLevel).toBe(3);
    expect(registry.get(w.getBlock(23, 1, 16)).fluidLevel).toBe(7);
    expect(w.getBlock(24, 1, 16)).toBe(0);
    expect(sim.pendingCount).toBe(0); // 안정되면 할 일이 없다
  });

  it('원천을 없애면 전부 말라붙는다', () => {
    const w = flatWorld();
    const sim = new FluidSim(w, registry);
    w.setBlock(16, 1, 16, WATER);
    sim.touch(16, 1, 16);
    run(sim, 60);
    w.setBlock(16, 1, 16, 0);
    sim.touch(16, 1, 16);
    run(sim, 120);
    expect(countKind(w, 'water')).toBe(0);
  });

  it('벽 안의 물은 가만히 있고, 벽을 부수면 새어 나간다', () => {
    const w = flatWorld();
    for (let x = 14; x <= 18; x++)
      for (let z = 14; z <= 18; z++) {
        const wall = x === 14 || x === 18 || z === 14 || z === 18;
        w.setBlock(x, 1, z, wall ? STONE : WATER);
      }
    const sim = new FluidSim(w, registry);
    for (let x = 15; x <= 17; x++) for (let z = 15; z <= 17; z++) sim.touch(x, 1, z);
    run(sim, 40);
    expect(countKind(w, 'water')).toBe(9);
    w.setBlock(18, 1, 16, 0); // 동쪽 벽 한 칸 부수기
    sim.touch(18, 1, 16);
    run(sim, 80);
    expect(countKind(w, 'water')).toBeGreaterThan(9);
    expect(registry.get(w.getBlock(18, 1, 16)).fluid).toBe('water');
    expect(registry.get(w.getBlock(22, 1, 16)).fluid).toBe('water');
  });

  it('구멍이 있으면 아래로 먼저 떨어지고 바닥에서 퍼진다', () => {
    const w = new VoxelWorld({ sizeCX: 2, sizeCY: 1, sizeCZ: 2 });
    for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) for (let y = 0; y <= 4; y++) w.setBlock(x, y, z, STONE);
    // 5층 위에 원천, 바로 옆에 바닥까지 뚫린 구멍
    w.setBlock(16, 5, 16, WATER);
    for (let y = 1; y <= 4; y++) w.setBlock(17, y, 16, 0);
    const sim = new FluidSim(w, registry);
    sim.touch(16, 5, 16);
    run(sim, 100);
    expect(registry.get(w.getBlock(17, 5, 16)).fluidLevel).toBe(1); // 옆으로 한 칸
    expect(registry.get(w.getBlock(17, 1, 16)).fluidLevel).toBe(1); // 떨어진 물은 다시 최대 세기
    expect(registry.get(w.getBlock(17, 3, 16)).fluid).toBe('water');
    // 바닥(y=1)에서는 갇혀서 못 퍼진다(돌로 둘러싸임) → 위층(y=5)에서 7칸 마름모
    expect(w.getBlock(18, 5, 16)).not.toBe(0);
  });

  it('원천 둘 사이 한 칸은 원천이 된다 (무한 물)', () => {
    const w = flatWorld();
    w.setBlock(16, 1, 16, WATER);
    w.setBlock(18, 1, 16, WATER);
    const sim = new FluidSim(w, registry);
    sim.touch(16, 1, 16);
    sim.touch(18, 1, 16);
    run(sim, 30);
    expect(registry.get(w.getBlock(17, 1, 16)).fluidLevel).toBe(0);
  });
});

describe('FluidSim — 용암', () => {
  it('용암은 3칸까지, 단계 2씩 약해진다', () => {
    const w = flatWorld();
    w.setBlock(16, 1, 16, LAVA);
    const sim = new FluidSim(w, registry);
    sim.touch(16, 1, 16);
    run(sim, FLUID_RULES.lava.interval * 6);
    expect(registry.get(w.getBlock(17, 1, 16)).fluidLevel).toBe(2);
    expect(registry.get(w.getBlock(19, 1, 16)).fluidLevel).toBe(6);
    expect(w.getBlock(20, 1, 16)).toBe(0);
    expect(countKind(w, 'lava')).toBe(1 + 4 * (1 + 2 + 3)); // 맨해튼 ≤ 3 = 25
  });

  it('물이 용암 원천을 만나면 흑요석, 흐르는 용암을 만나면 조약돌', () => {
    const w = flatWorld();
    w.setBlock(16, 1, 16, LAVA);
    const sim = new FluidSim(w, registry);
    sim.touch(16, 1, 16);
    run(sim, FLUID_RULES.lava.interval * 6); // 용암 퍼짐
    w.setBlock(21, 1, 16, WATER); // 용암 끝(19)에서 두 칸 떨어진 곳
    sim.touch(21, 1, 16);
    run(sim, 120);
    expect(w.getBlock(19, 1, 16)).toBe(registry.numOf('cobblestone')); // 흐르는 용암 자리
    // 물을 원천 바로 옆에 두면 흑요석
    const w2 = flatWorld();
    w2.setBlock(16, 1, 16, LAVA);
    w2.setBlock(17, 1, 16, WATER);
    const sim2 = new FluidSim(w2, registry);
    sim2.touch(17, 1, 16);
    run(sim2, 20);
    expect(w2.getBlock(16, 1, 16)).toBe(registry.numOf('obsidian'));
  });
});

describe('레지스트리 액체 변형', () => {
  it('원천마다 흐름 1..7 내부 블록이 생기고 v1 목록엔 안 나온다', () => {
    expect(registry.fluidVariant(WATER, 0)).toBe(WATER);
    const w3 = registry.fluidVariant(WATER, 3);
    const d = registry.get(w3);
    expect(d.fluid).toBe('water');
    expect(d.fluidLevel).toBe(3);
    expect(d.fluidSource).toBe(WATER);
    expect(d.internal).toBe(true);
    expect(d.solid).toBe(false);
    expect(registry.v1().some((x) => x.internal)).toBe(false);
    expect(registry.get(registry.fluidVariant(LAVA, 6)).name).toBe('용암(흐름 6)');
  });

  it('액체인데 solid 면 에러', () => {
    expect(() => parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', fluid: 'water', texture: 'x' }] })).toThrow(/solid 가 false/);
    expect(() => parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', solid: false, fluid: 'juice', texture: 'x' }] })).toThrow(
      /쓸 수 있는 값이 아니에요/,
    );
  });
});
