import { describe, expect, it } from 'vitest';
import { AIR_ID, DataError, parseBlocks } from './blocks';
import { BLOCKS } from './data';

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
