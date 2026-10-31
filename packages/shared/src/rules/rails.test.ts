import { describe, expect, it } from 'vitest';
import { BLOCKS } from './data';
import { type CartState, type RailDir, advanceCart, railShapeFor } from './rails';

describe('철도·수레 (#237)', () => {
  it('철도 모양: 마주 보면 곧게, 꺾이면 굽게, 하나뿐이면 그쪽으로', () => {
    expect(railShapeFor(true, false, true, false)).toBe('ns');
    expect(railShapeFor(false, true, false, true)).toBe('ew');
    expect(railShapeFor(true, true, false, false)).toBe('ne');
    expect(railShapeFor(false, false, true, true)).toBe('sw');
    expect(railShapeFor(false, true, false, false)).toBe('ew');
    expect(railShapeFor(false, false, false, false)).toBe('ns');
    expect(railShapeFor(true, true, true, false)).toBe('ns'); // 셋이면 곧은 쪽 먼저
  });

  it('blocks.json 철도: 변형 5개가 생기고 어느 것이든 철도 아이템을 떨군다', () => {
    const base = BLOCKS.require('rail');
    expect(base.rail?.dir).toBe('ns');
    for (const dir of ['ew', 'ne', 'nw', 'se', 'sw'] as const) {
      const v = BLOCKS.get(BLOCKS.railVariant(base.num, dir));
      expect(v.rail).toEqual({ base: base.num, dir });
      expect(v.internal).toBe(true);
      expect(v.drops).toBe('rail');
      expect(v.textures?.[0]).toBe(dir === 'ew' ? 'rail' : 'rail_corner');
    }
    expect(BLOCKS.railVariant(base.num, 'ns')).toBe(base.num);
  });

  it('수레: 곧은 철도를 따라 가다 굽은 데서 꺾이고, 끝에서 가운데에 선다, 반대로 밀면 돌아온다', () => {
    // (0,0) ns → (0,1) ne(북·동) → (1,1) ew → (2,1) ew  [z 가 남쪽 +]
    const rails = new Map<string, RailDir>([['0,0', 'ns'], ['0,1', 'ne'], ['1,1', 'ew'], ['2,1', 'ew']]);
    const railAt = (bx: number, _by: number, bz: number) => rails.get(`${bx},${bz}`) ?? null;
    const st: CartState = { x: 0.5, y: 0, z: 0.5, heading: null, speed: 0 };
    advanceCart(st, 0.05, railAt, { x: 0, z: 0 });
    expect(st.heading).toBeNull(); // 안 밀면 안 간다
    for (let i = 0; i < 40; i++) advanceCart(st, 0.05, railAt, { x: 0, z: 1 }); // 남쪽으로 2초
    expect(st.heading).toBe('e'); // 굽은 데서 동쪽으로 꺾였다
    expect(st.z).toBeCloseTo(1.5, 5);
    expect(st.x).toBeGreaterThan(0.5);
    for (let i = 0; i < 60; i++) advanceCart(st, 0.05, railAt, { x: 1, z: 0 }); // 동쪽으로 계속
    expect(st.speed).toBe(0); // 끝에서 멈춤
    expect(st.x).toBeCloseTo(2.5, 5);
    expect(st.z).toBeCloseTo(1.5, 5);
    for (let i = 0; i < 60; i++) advanceCart(st, 0.05, railAt, { x: -1, z: 0 }); // 반대로 밀면 되돌아간다
    expect(st.heading === 'w' || st.heading === 'n').toBe(true);
    expect(st.x).toBeLessThan(2.5);
  });

  it('수레: 철도가 없는 칸이면 선다', () => {
    const st: CartState = { x: 0.5, y: 0, z: 0.5, heading: 's', speed: 5 };
    advanceCart(st, 0.1, () => null, { x: 0, z: 1 });
    expect(st.speed).toBe(0);
    expect(st.heading).toBeNull();
  });
});
