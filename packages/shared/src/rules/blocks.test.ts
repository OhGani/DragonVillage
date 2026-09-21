import { describe, expect, it } from 'vitest';
import { AIR_ID, DataError, doorHinge, facingFromYaw, parseBlocks } from './blocks';
import { BLOCKS } from './data';
import { itemForPlacing } from './items';

const ok = {
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1.5, tool: 'pickaxe', drops: 'cobblestone', texture: 'stone' },
    { id: 'grass', name: '잔디', hardness: 0.6, textureTop: 'grass_top', textureSide: 'grass_side', textureBottom: 'dirt' },
    { id: 'water', name: '물', solid: false, transparent: true, texture: 'water' },
  ],
};

describe('parseBlocks', () => {
  it('정상 데이터를 읽고 air 를 0번으로 둔다', () => {
    const reg = parseBlocks(ok);
    expect(reg.count).toBe(4);
    expect(reg.get(AIR_ID).id).toBe('air');
    expect(reg.require('stone').num).toBe(1);
    expect(reg.require('stone').drops).toBe('cobblestone');
    expect(reg.require('grass').textures).toEqual(['grass_top', 'grass_side', 'dirt']);
    expect(reg.require('grass').drops).toBe('grass');
    expect(reg.require('water').solid).toBe(false);
    expect(reg.require('water').hardness).toBeNull();
    expect(reg.isOpaque(reg.numOf('stone'))).toBe(true);
    expect(reg.isOpaque(reg.numOf('water'))).toBe(false);
  });

  it('air 가 뒤에 있어도 0번이 된다', () => {
    const reg = parseBlocks({ blocks: [ok.blocks[1], ok.blocks[0]] });
    expect(reg.get(0).id).toBe('air');
    expect(reg.require('stone').num).toBe(1);
  });

  it('잘못된 값이면 한국어 DataError 를 던진다', () => {
    const bad = { blocks: [ok.blocks[0], { id: 'dirt', name: '흙', hardness: -1, texture: 'dirt' }] };
    let err: unknown;
    try {
      parseBlocks(bad);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(DataError);
    const msg = (err as DataError).message;
    expect(msg).toContain('data/blocks.json');
    expect(msg).toContain('2번째 블록(id: dirt)');
    expect(msg).toContain('hardness');
    expect(msg).toContain('0 이상');
  });

  it('id 가 겹치거나 그림이 없으면 알려준다', () => {
    const bad = {
      blocks: [
        ok.blocks[0],
        { id: 'stone', name: '돌', texture: 'stone' },
        { id: 'stone', name: '돌2', texture: 'stone' },
        { id: 'noimg', name: '없음' },
      ],
    };
    expect(() => parseBlocks(bad)).toThrow(/두 번 나와요/);
    expect(() => parseBlocks(bad)).toThrow(/noimg.*그림이 없어요/);
  });

  it('숫자 자리에 글자를 넣으면 쉬운 말로 알려준다', () => {
    const bad = { blocks: [ok.blocks[0], { id: 'sand', name: '모래', hardness: '빨리', texture: 'sand' }] };
    expect(() => parseBlocks(bad)).toThrow(/숫자여야 해요/);
  });
});

describe('실제 data/blocks.json', () => {
  it('검증을 통과하고 기본 블록이 있다', () => {
    expect(BLOCKS.get(0).id).toBe('air');
    for (const id of ['stone', 'dirt', 'grass', 'sand', 'gravel', 'log', 'planks', 'glass', 'leaves', 'water', 'bedrock']) {
      expect(BLOCKS.find(id), id).toBeDefined();
    }
    expect(BLOCKS.require('bedrock').hardness).toBeNull();
    expect(BLOCKS.require('stone').tool).toBe('pickaxe');
  });
});

describe('dropCount', () => {
  it('기본 [1,1], 범위를 적으면 그대로, 순서가 틀리면 알려준다', () => {
    const reg = parseBlocks({
      blocks: [
        { id: 'air', name: '공기', solid: false, transparent: true },
        { id: 'glowstone', name: '발광석', texture: 'g', bonusDrops: 'glowstone_dust', bonusCount: [0, 3] },
        { id: 'gravel', name: '자갈', texture: 'g', drops: 'flint', dropCount: [2, 4] },
        { id: 'stone', name: '돌', texture: 's' },
      ],
    });
    expect(reg.require('gravel').dropCount).toEqual([2, 4]);
    expect(reg.require('stone').dropCount).toEqual([1, 1]);
    expect(reg.require('glowstone').drops).toBe('glowstone');
    expect(reg.require('glowstone').bonusDrops).toBe('glowstone_dust');
    expect(reg.require('glowstone').bonusCount).toEqual([0, 3]);
    expect(reg.require('stone').bonusDrops).toBeNull();
    expect(() =>
      parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', texture: 'x', bonusCount: [0, 2] }] }),
    ).toThrow(/bonusDrops/);
    expect(() =>
      parseBlocks({ blocks: [{ id: 'air', name: '공기' }, { id: 'x', name: 'x', texture: 'x', dropCount: [4, 2] }] }),
    ).toThrow(/최소, 최대/);
    expect(BLOCKS.require('glowstone').drops).toBe('glowstone');
    expect(BLOCKS.require('glowstone').bonusDrops).toBe('glowstone_dust');
    expect(BLOCKS.require('glowstone').bonusCount).toEqual([0, 3]);
  });
});

describe('문 변형 (#71)', () => {
  it('문 하나에 32개 내부 변형(방향 4 × 위아래 × 열림 × 경첩 2), 열린 문은 지나갈 수 있고, 윗칸은 드롭 없음', () => {
    const reg = parseBlocks({
      blocks: [
        { id: 'air', name: '공기', solid: false, transparent: true },
        { id: 'oak_door', name: '문', hardness: 3, textureTop: 'door_top', textureSide: 'door_bottom', textureBottom: 'door_bottom', shape: 'door' },
      ],
    });
    const base = reg.numOf('oak_door');
    expect(reg.defs.filter((d) => d.door)).toHaveLength(32);
    const lower = reg.get(reg.doorVariant(base, 0, false, false));
    expect(lower.id).toBe('oak_door@n');
    expect(lower.solid).toBe(true);
    expect(lower.internal).toBe(true);
    expect(lower.textures?.[1]).toBe('door_bottom');
    expect(lower.drops).toBe('oak_door');
    const upperOpen = reg.get(reg.doorVariant(base, 2, true, true));
    expect(upperOpen.id).toBe('oak_door@s^>');
    expect(upperOpen.solid).toBe(false);
    expect(upperOpen.drops).toBeNull();
    expect(upperOpen.textures?.[1]).toBe('door_top');
    expect(upperOpen.door).toEqual({ base, facing: 2, upper: true, open: true, hinge: 0 });
    // 오른쪽 경첩은 id 뒤에 r — 왼쪽 경첩 id 는 예전 그대로라 저장된 마을의 문이 살아 있다 (#83)
    expect(reg.get(reg.doorVariant(base, 2, true, true, 1)).id).toBe('oak_door@s^>r');
    expect(reg.get(reg.doorVariant(base, 0, false, false, 1)).id).toBe('oak_door@nr');
    expect(reg.isDoor(base)).toBe(true);
    expect(reg.isDoor(AIR_ID)).toBe(false);
    // 놓을 때는 아래·닫힘 변형만 문 아이템 하나를 쓴다
    expect(itemForPlacing('oak_door@n', reg)).toBe('oak_door');
    expect(itemForPlacing('oak_door@n^', reg)).toBeNull();
    expect(itemForPlacing('oak_door@n>', reg)).toBeNull();
    // yaw 0 = 북(-z), π/2 = 서(-x)
    expect(facingFromYaw(0)).toBe(0);
    expect(facingFromYaw(Math.PI / 2)).toBe(3);
    expect(facingFromYaw(Math.PI)).toBe(2);
    expect(BLOCKS.defs.filter((d) => d.door)).toHaveLength(32);
  });
});

describe('횃불 벽 변형 (#82)', () => {
  it('바닥 횃불 하나 + 벽 4방향 변형, 벽 변형은 핫바에 안 보이고 부수면 횃불', () => {
    const base = BLOCKS.require('torch');
    expect(base.torch).toEqual({ base: base.num, wall: -1 });
    expect(base.internal).toBe(false);
    for (const [wall, id] of [[0, 'torch@n'], [1, 'torch@e'], [2, 'torch@s'], [3, 'torch@w']] as const) {
      const v = BLOCKS.require(id);
      expect(v.torch, id).toEqual({ base: base.num, wall });
      expect(v.internal, id).toBe(true);
      expect(v.drops, id).toBe('torch');
      expect(v.lightEmit, id).toBe(base.lightEmit);
      expect(v.solid, id).toBe(false);
      expect(BLOCKS.torchVariant(base.num, wall), id).toBe(v.num);
    }
    expect(BLOCKS.v1().some((d) => d.id === 'torch@n')).toBe(false); // 도감·핫바에는 바닥 횃불만
    expect(BLOCKS.v1().some((d) => d.id === 'torch')).toBe(true);
  });

  it('벽에 붙인 횃불을 놓아도 횃불 아이템 하나', () => {
    expect(itemForPlacing('torch', BLOCKS)).toBe('torch');
    expect(itemForPlacing('torch@w', BLOCKS)).toBe('torch');
  });
});

describe('문 경첩 (#83, 아빠 2026-09-22)', () => {
  // 북(-z)을 보고 놓은 문 기준: 왼쪽 = −x(서), 오른쪽 = +x(동)
  const NORTH = 0;
  const wallsAt = (...cells: [number, number, number][]) => {
    const set = new Set(cells.map((c) => c.join(',')));
    return (x: number, y: number, z: number) => set.has([x, y, z].join(','));
  };

  it('한쪽만 벽이면 그 벽 쪽에 붙는다', () => {
    expect(doorHinge(wallsAt([9, 5, 5]), 10, 5, 5, NORTH)).toBe(0); // 왼쪽(−x)만 벽 → 왼쪽
    expect(doorHinge(wallsAt([11, 5, 5]), 10, 5, 5, NORTH)).toBe(1); // 오른쪽(+x)만 벽 → 오른쪽
  });

  it('양쪽 다 벽이거나 둘 다 아니면 왼쪽', () => {
    expect(doorHinge(wallsAt([11, 5, 5], [9, 5, 5]), 10, 5, 5, NORTH)).toBe(0);
    expect(doorHinge(() => false, 10, 5, 5, NORTH)).toBe(0);
  });

  it('윗칸만 벽이어도 그 쪽으로 붙는다 (벽은 보통 두 칸)', () => {
    expect(doorHinge(wallsAt([11, 6, 5]), 10, 5, 5, NORTH)).toBe(1);
  });

  it('보는 방향이 바뀌면 왼쪽·오른쪽도 같이 돈다', () => {
    // 동(+x)을 보고 놓으면 왼쪽 = −z(북)
    expect(doorHinge(wallsAt([10, 5, 4]), 10, 5, 5, 1)).toBe(0);
    expect(doorHinge(wallsAt([10, 5, 6]), 10, 5, 5, 1)).toBe(1);
  });
});
