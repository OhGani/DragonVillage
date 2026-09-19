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

describe('FluidSim — 플레이어가 놓은 고인 액체 (양 보존, 결정 #65)', () => {
  /** 세계 전체 고인 액체 양 */
  const volume = (w: VoxelWorld, kind: 'water' | 'lava' = 'water'): number => {
    let n = 0;
    for (let x = 0; x < 32; x++)
      for (let y = 0; y < 16; y++)
        for (let z = 0; z < 32; z++) {
          const d = registry.get(w.getBlock(x, y, z));
          if (d.fluid === kind) n += d.fluidVolume;
        }
    return n;
  };
  const vol = (w: VoxelWorld, x: number, y: number, z: number): number => registry.get(w.getBlock(x, y, z)).fluidVolume;
  const FULL = registry.fluidFinite(WATER, 8);

  it('양동이 하나(8)는 평지에서 8칸의 얇은 웅덩이가 되어 멈추고, 양은 그대로 8', () => {
    const w = flatWorld();
    const sim = new FluidSim(w, registry);
    w.setBlock(16, 1, 16, FULL);
    sim.touch(16, 1, 16);
    run(sim, 200);
    expect(volume(w)).toBe(8);
    expect(countKind(w, 'water')).toBe(8); // 1/8 짜리 8칸
    for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) if (vol(w, x, 1, z)) expect(vol(w, x, 1, z)).toBe(1);
    expect(sim.pendingCount).toBe(0); // 안정
    expect(registry.get(w.getBlock(16, 1, 16)).fluidLevel).toBe(7); // 얕음 = 단계 7 (렌더 높이 1/9)
  });

  it('여러 양동이를 부어도 양은 보존되고 높이가 고르게 된다', () => {
    const w = flatWorld();
    // 돌 벽 안(안쪽 3×3 = 9칸)에 물 4양동이(32) → 9칸에 32 = 평균 3.5 → 3 또는 4
    for (let x = 14; x <= 18; x++)
      for (let z = 14; z <= 18; z++) if (x === 14 || x === 18 || z === 14 || z === 18) w.setBlock(x, 1, z, STONE);
    const sim = new FluidSim(w, registry);
    for (const [x, z] of [[15, 15], [17, 17], [16, 16], [15, 17]]) {
      w.setBlock(x, 1, z, FULL);
      sim.touch(x, 1, z);
    }
    run(sim, 300);
    expect(volume(w)).toBe(32);
    for (let x = 15; x <= 17; x++) for (let z = 15; z <= 17; z++) expect([3, 4]).toContain(vol(w, x, 1, z));
    expect(sim.pendingCount).toBe(0);
  });

  it('구덩이에 부으면 아래로 먼저 내려가 바닥부터 차고, 위로는 안 찬다', () => {
    const w = new VoxelWorld({ sizeCX: 2, sizeCY: 1, sizeCZ: 2 });
    for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) for (let y = 0; y <= 4; y++) w.setBlock(x, y, z, STONE);
    // 1칸 넓이 4칸 깊이 구덩이 (y=1..4) 위에 물 2양동이
    for (let y = 1; y <= 4; y++) w.setBlock(16, y, 16, 0);
    w.setBlock(16, 5, 16, FULL);
    w.setBlock(16, 6, 16, FULL);
    const sim = new FluidSim(w, registry);
    sim.touch(16, 5, 16);
    sim.touch(16, 6, 16);
    run(sim, 100);
    expect(volume(w)).toBe(16);
    expect(vol(w, 16, 1, 16)).toBe(8); // 바닥 가득
    expect(vol(w, 16, 2, 16)).toBe(8);
    expect(w.getBlock(16, 3, 16)).toBe(0); // 그 위는 비어 있다
    expect(w.getBlock(16, 5, 16)).toBe(0);
    expect(w.getBlock(17, 5, 16)).toBe(0); // 지면 위로 퍼지지 않았다
  });

  it('가득한 칸(8/8)만 양동이로 떠낼 수 있다 — 단계 0 이라 기존 검사가 그대로 맞는다', () => {
    expect(registry.get(FULL).fluidLevel).toBe(0);
    expect(registry.get(registry.fluidFinite(WATER, 7)).fluidLevel).toBe(1);
    expect(registry.get(registry.fluidFinite(WATER, 1)).fluidLevel).toBe(7);
    expect(registry.fluidFinite(WATER, 0)).toBe(0);
    expect(registry.get(FULL).id).toBe('water%8');
    expect(registry.get(registry.fluidFinite(WATER, 3)).name).toBe('물(고인 3/8)');
    expect(registry.get(FULL).internal).toBe(true);
    expect(registry.get(FULL).fluidVolume).toBe(8);
    expect(registry.get(WATER).fluidVolume).toBe(0);
  });

  it('자연 연못(무한)은 고인 물을 삼키고, 고인 물은 자연 물 칸으로 못 들어간다', () => {
    const w = flatWorld();
    w.setBlock(20, 1, 16, WATER); // 연못 원천
    w.setBlock(16, 1, 16, FULL); // 그 옆에 부은 물
    const sim = new FluidSim(w, registry);
    sim.touch(16, 1, 16);
    sim.touch(20, 1, 16);
    run(sim, 200);
    expect(registry.get(w.getBlock(20, 1, 16)).fluidLevel).toBe(0); // 원천 그대로
    expect(registry.get(w.getBlock(20, 1, 16)).fluidVolume).toBe(0);
    // 연못은 여전히 7칸 마름모(113칸)를 다 채운다. 웅덩이(1/8)는 더 깊은 자연 흐름이 덮어쓰고,
    // 마름모 가장자리(단계 7 = 같은 깊이)에 남은 웅덩이 칸만 그대로다
    let inDiamond = 0,
      natural = 0;
    for (let x = 0; x < 32; x++)
      for (let z = 0; z < 32; z++) {
        const d = registry.get(w.getBlock(x, 1, z));
        if (d.fluid !== 'water') continue;
        if (Math.abs(x - 20) + Math.abs(z - 16) <= 7) inDiamond++;
        if (d.fluidVolume === 0) natural++;
      }
    expect(inDiamond).toBe(113);
    expect(natural).toBeGreaterThanOrEqual(110);
    expect(volume(w)).toBeLessThan(8); // 웅덩이 일부는 연못에 삼켜졌다
  });

  it('고인 물이 용암 원천을 만나면 흑요석, 고인 용암도 양이 보존된다', () => {
    const w = flatWorld();
    w.setBlock(16, 1, 16, LAVA);
    w.setBlock(17, 1, 16, FULL);
    const sim = new FluidSim(w, registry);
    sim.touch(17, 1, 16);
    run(sim, 40);
    expect(w.getBlock(16, 1, 16)).toBe(registry.numOf('obsidian'));

    const w2 = flatWorld();
    w2.setBlock(16, 1, 16, registry.fluidFinite(LAVA, 8));
    const sim2 = new FluidSim(w2, registry);
    sim2.touch(16, 1, 16);
    run(sim2, FLUID_RULES.lava.interval * 40);
    expect(volume(w2, 'lava')).toBe(8);
    expect(countKind(w2, 'lava')).toBe(8);
  });

  it('두 번 돌려도 결과가 같다 (결정론)', () => {
    const snap = (): string => {
      const w = flatWorld();
      const sim = new FluidSim(w, registry);
      for (const [x, z] of [[16, 16], [16, 17], [10, 10]]) {
        w.setBlock(x, 1, z, FULL);
        sim.touch(x, 1, z);
      }
      run(sim, 150);
      const out: number[] = [];
      for (let x = 0; x < 32; x++) for (let z = 0; z < 32; z++) out.push(w.getBlock(x, 1, z));
      return out.join(',');
    };
    expect(snap()).toBe(snap());
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
    // 고인 변형: 양 1..8, 단계 = 8 - 양
    expect(registry.get(registry.fluidFinite(WATER, 5)).id).toBe('water%5');
    expect(registry.get(registry.fluidFinite(WATER, 5)).fluidLevel).toBe(3);
    expect(registry.get(registry.fluidFinite(LAVA, 8)).name).toBe('용암(고인 8/8)');
    expect(registry.fluidVariant(WATER, 0)).toBe(WATER);
  });

  it('액체인데 solid 면 에러', () => {
    expect(() => parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', fluid: 'water', texture: 'x' }] })).toThrow(/solid 가 false/);
    expect(() => parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', solid: false, fluid: 'juice', texture: 'x' }] })).toThrow(
      /쓸 수 있는 값이 아니에요/,
    );
  });
});
