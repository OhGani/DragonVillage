import { describe, expect, it } from 'vitest';
import { PADDED_VOLUME, VoxelWorld, chunkKey, paddedIndex } from './world';

describe('VoxelWorld', () => {
  it('전역 좌표 get/set 이 청크를 넘나든다', () => {
    const w = new VoxelWorld({ sizeCX: 2, sizeCY: 1, sizeCZ: 1 });
    expect(w.setBlock(17, 3, 4, 5).changed).toBe(true);
    expect(w.getBlock(17, 3, 4)).toBe(5);
    expect(w.getChunk(1, 0, 0)?.get(1, 3, 4)).toBe(5);
    expect(w.getChunk(0, 0, 0)).toBeUndefined(); // 안 만든 청크는 없다
    expect(w.getBlock(-1, 0, 0)).toBe(0); // 범위 밖 = air
    expect(w.setBlock(-1, 0, 0, 5).changed).toBe(false);
  });

  it('경계 블록을 바꾸면 이웃 청크도 dirty 가 된다', () => {
    const w = new VoxelWorld({ sizeCX: 3, sizeCY: 3, sizeCZ: 3 });
    const mid = w.setBlock(16 + 8, 16 + 8, 16 + 8, 1);
    expect(mid.dirty).toEqual([{ cx: 1, cy: 1, cz: 1 }]);

    const edge = w.setBlock(16, 16 + 8, 16 + 8, 1); // x 경계(로컬 0)
    expect(edge.dirty).toHaveLength(2);
    expect(edge.dirty).toContainEqual({ cx: 0, cy: 1, cz: 1 });

    const corner = w.setBlock(31, 31, 31, 1); // 로컬 15,15,15 → 8개 청크
    expect(corner.dirty).toHaveLength(8);

    const worldEdge = w.setBlock(0, 0, 0, 1); // 월드 밖 이웃은 제외
    expect(worldEdge.dirty).toEqual([{ cx: 0, cy: 0, cz: 0 }]);
  });

  it('buildPadded 는 이웃 청크의 경계 블록을 포함한다', () => {
    const w = new VoxelWorld({ sizeCX: 2, sizeCY: 1, sizeCZ: 1 });
    w.setBlock(15, 5, 5, 3); // 청크 0 의 x=15
    w.setBlock(16, 5, 5, 4); // 청크 1 의 x=0
    const p0 = w.buildPadded(0, 0, 0);
    expect(p0.length).toBe(PADDED_VOLUME);
    expect(p0[paddedIndex(15, 5, 5)]).toBe(3);
    expect(p0[paddedIndex(16, 5, 5)]).toBe(4); // 이웃에서 온 값
    expect(p0[paddedIndex(-1, 5, 5)]).toBe(0); // 월드 밖 = air
    const p1 = w.buildPadded(1, 0, 0);
    expect(p1[paddedIndex(-1, 5, 5)]).toBe(3);
    expect(p1[paddedIndex(0, 5, 5)]).toBe(4);
  });

  it('chunkKey 는 서로 다른 좌표에 다른 키를 준다', () => {
    const keys = new Set<number>();
    for (let x = -2; x < 3; x++) for (let y = -2; y < 3; y++) for (let z = -2; z < 3; z++) keys.add(chunkKey(x, y, z));
    expect(keys.size).toBe(125);
  });
});
