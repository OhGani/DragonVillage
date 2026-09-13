import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../math/prng';
import { parseBlocks } from '../rules/blocks';
import { CHUNK_VOLUME, Chunk } from './chunk';
import { decodeChunk, encodeChunk } from './serialize';

const registry = parseBlocks({
  blocks: [
    { id: 'air', name: '공기', solid: false, transparent: true },
    { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
    { id: 'dirt', name: '흙', hardness: 1, texture: 'dirt' },
    { id: 'grass', name: '잔디', hardness: 1, texture: 'grass' },
    { id: 'water', name: '물', solid: false, transparent: true, fluid: 'water', texture: 'water' },
  ],
});
const STONE = registry.numOf('stone'),
  DIRT = registry.numOf('dirt'),
  GRASS = registry.numOf('grass');

describe('encodeChunk / decodeChunk', () => {
  it('빈 청크는 아주 작고 왕복한다', () => {
    const c = new Chunk(0, 0, 0);
    const bytes = encodeChunk(c, registry);
    expect(bytes.length).toBeLessThan(16);
    const d = new Chunk(0, 0, 0);
    d.set(1, 1, 1, STONE); // 덮어써지는지
    const r = decodeChunk(bytes, registry, d);
    expect(r.unknownIds).toEqual([]);
    expect(d.isEmpty()).toBe(true);
    expect(d.palette).toEqual([0]);
  });

  it('평지 청크(층별 같은 블록)는 100바이트 미만', () => {
    const c = new Chunk(0, 0, 0);
    for (let x = 0; x < 16; x++)
      for (let z = 0; z < 16; z++) {
        for (let y = 0; y < 6; y++) c.set(x, y, z, STONE);
        for (let y = 6; y < 9; y++) c.set(x, y, z, DIRT);
        c.set(x, 9, z, GRASS);
      }
    const bytes = encodeChunk(c, registry);
    expect(bytes.length).toBeLessThan(100);
    const d = new Chunk(0, 0, 0);
    decodeChunk(bytes, registry, d);
    expect(d.toBlockIds()).toEqual(c.toBlockIds());
    expect(d.nonAir).toBe(c.nonAir);
  });

  it('무작위(시드) 청크도 정확히 왕복한다', () => {
    const rnd = mulberry32(42);
    const c = new Chunk(1, 2, 3);
    const ids = [0, STONE, DIRT, GRASS, registry.numOf('water'), registry.fluidVariant(registry.numOf('water'), 3, 1)];
    for (let i = 0; i < 2000; i++) {
      c.set(Math.floor(rnd() * 16), Math.floor(rnd() * 16), Math.floor(rnd() * 16), ids[Math.floor(rnd() * ids.length)]);
    }
    const bytes = encodeChunk(c, registry);
    const d = new Chunk(1, 2, 3);
    decodeChunk(bytes, registry, d);
    expect(d.toBlockIds()).toEqual(c.toBlockIds());
    // 팔레트에 쓰인 것만 들어간다 (문자열 id)
    const text = String.fromCharCode(...bytes.slice(0, 80));
    expect(text).toContain('stone');
    expect(text).toContain('water>e~3');
  });

  it('blocks.json 순서가 바뀌어도(번호가 달라져도) 같은 블록으로 읽힌다', () => {
    const c = new Chunk(0, 0, 0);
    c.set(0, 0, 0, STONE);
    c.set(1, 0, 0, GRASS);
    const bytes = encodeChunk(c, registry);
    const reordered = parseBlocks({
      blocks: [
        { id: 'air', name: '공기', solid: false, transparent: true },
        { id: 'grass', name: '잔디', hardness: 1, texture: 'grass' },
        { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
      ],
    });
    const d = new Chunk(0, 0, 0);
    const r = decodeChunk(bytes, reordered, d);
    expect(r.unknownIds).toEqual([]);
    expect(reordered.get(d.get(0, 0, 0)).id).toBe('stone');
    expect(reordered.get(d.get(1, 0, 0)).id).toBe('grass');
  });

  it('없어진 블록 id 는 air 가 되고 이름을 알려준다', () => {
    const c = new Chunk(0, 0, 0);
    c.set(0, 0, 0, DIRT);
    c.set(1, 0, 0, STONE);
    const bytes = encodeChunk(c, registry);
    const noDirt = parseBlocks({
      blocks: [
        { id: 'air', name: '공기', solid: false, transparent: true },
        { id: 'stone', name: '돌', hardness: 1, texture: 'stone' },
      ],
    });
    const d = new Chunk(0, 0, 0);
    const r = decodeChunk(bytes, noDirt, d);
    expect(r.unknownIds).toEqual(['dirt']);
    expect(d.get(0, 0, 0)).toBe(0);
    expect(noDirt.get(d.get(1, 0, 0)).id).toBe('stone');
  });

  it('깨진 데이터는 에러', () => {
    const c = new Chunk(0, 0, 0);
    const bytes = encodeChunk(c, registry);
    const bad = new Uint8Array(bytes);
    bad[0] = 99;
    expect(() => decodeChunk(bad, registry, new Chunk(0, 0, 0))).toThrow(/모르는 청크 저장 형식/);
    expect(() => new Chunk(0, 0, 0).loadBlockIds(new Uint16Array(10))).toThrow(RangeError);
    expect(CHUNK_VOLUME).toBe(4096);
  });
});
