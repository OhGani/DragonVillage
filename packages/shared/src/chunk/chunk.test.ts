import { describe, expect, it } from 'vitest';
import { CHUNK_SIZE, CHUNK_VOLUME, Chunk, localIndex } from './chunk';

describe('Chunk', () => {
  it('처음엔 전부 air(0)이고 비어 있다', () => {
    const c = new Chunk(0, 0, 0);
    expect(c.isEmpty()).toBe(true);
    expect(c.get(3, 4, 5)).toBe(0);
    expect(c.palette).toEqual([0]);
  });

  it('set/get 이 왕복하고 팔레트가 자란다', () => {
    const c = new Chunk(0, 0, 0);
    expect(c.set(1, 2, 3, 7)).toBe(true);
    expect(c.set(1, 2, 3, 7)).toBe(false); // 같은 값 → 변화 없음
    expect(c.set(15, 15, 15, 9)).toBe(true);
    expect(c.get(1, 2, 3)).toBe(7);
    expect(c.get(15, 15, 15)).toBe(9);
    expect(c.palette).toEqual([0, 7, 9]);
    expect(c.nonAir).toBe(2);
    expect(c.version).toBe(2);
    expect(c.data[localIndex(1, 2, 3)]).toBe(1); // 팔레트 인덱스가 저장된다
  });

  it('air 로 되돌리면 nonAir 가 줄고 비어 있음이 된다', () => {
    const c = new Chunk(0, 0, 0);
    c.set(0, 0, 0, 5);
    c.set(0, 0, 0, 0);
    expect(c.nonAir).toBe(0);
    expect(c.isEmpty()).toBe(true);
  });

  it('fill 은 4096칸을 채운다', () => {
    const c = new Chunk(0, 0, 0);
    c.fill(2);
    expect(c.nonAir).toBe(CHUNK_VOLUME);
    expect(c.get(CHUNK_SIZE - 1, 0, CHUNK_SIZE - 1)).toBe(2);
  });

  it('범위 밖 좌표는 에러', () => {
    const c = new Chunk(0, 0, 0);
    expect(() => c.get(16, 0, 0)).toThrow(RangeError);
    expect(() => c.set(0, -1, 0, 1)).toThrow(RangeError);
  });

  it('compactPalette 는 안 쓰는 항목을 지우고 데이터를 보존한다', () => {
    const c = new Chunk(0, 0, 0);
    c.set(0, 0, 0, 5);
    c.set(1, 0, 0, 8);
    c.set(0, 0, 0, 0); // 5 는 더 이상 안 쓰임
    c.compactPalette();
    expect(c.palette).toEqual([0, 8]);
    expect(c.get(1, 0, 0)).toBe(8);
    expect(c.get(0, 0, 0)).toBe(0);
    c.set(2, 0, 0, 8); // lookup 도 갱신됐는지
    expect(c.palette).toEqual([0, 8]);
  });
});
