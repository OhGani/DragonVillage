import { describe, expect, it } from 'vitest';
import { pushOutOf, type SepBody, separationPushes } from './separation';

const body = (x: number, z: number, extra: Partial<SepBody> = {}): SepBody => ({ x, y: 10, z, r: 0.3, h: 1.9, ...extra });
const apply = (bs: SepBody[]) => {
  const p = separationPushes(bs);
  bs.forEach((b, i) => {
    b.x += p[i]!.dx;
    b.z += p[i]!.dz;
  });
};
const gap = (a: SepBody, b: SepBody) => Math.hypot(a.x - b.x, a.z - b.z) - a.r - b.r;

describe('separationPushes', () => {
  it('겹친 둘은 한 번에 딱 붙은 자리까지 반씩 밀린다', () => {
    const a = body(5, 5),
      b = body(5.2, 5);
    apply([a, b]);
    expect(gap(a, b)).toBeCloseTo(0, 6);
    expect(a.x).toBeCloseTo(4.8, 6);
    expect(b.x).toBeCloseTo(5.4, 6);
  });

  it('안 겹치면 그대로, 높이가 다르면(위층) 그대로', () => {
    const p = separationPushes([body(5, 5), body(5.7, 5), body(5.1, 5, { y: 14 })]);
    for (const q of p) expect(Math.hypot(q.dx, q.dz)).toBe(0);
  });

  it('딱 같은 자리여도 갈라진다 (방향은 늘 같다)', () => {
    const a = body(5, 5),
      b = body(5, 5);
    apply([a, b]);
    expect(gap(a, b)).toBeCloseTo(0, 6);
    const c = body(5, 5),
      d = body(5, 5);
    apply([c, d]);
    expect(c.x).toBe(a.x);
    expect(d.z).toBe(b.z);
  });

  it('fixed 는 안 밀리고 다른 쪽이 다 비킨다, 무거운 쪽은 덜 밀린다', () => {
    const boss = body(5, 5, { r: 1.4, fixed: true }),
      z = body(6.3, 5);
    apply([boss, z]);
    expect(boss.x).toBe(5);
    expect(gap(boss, z)).toBeCloseTo(0, 6);
    const golem = body(5, 5, { r: 0.7, mass: 9 }),
      v = body(5.5, 5);
    apply([golem, v]);
    expect(5 - golem.x).toBeLessThan(v.x - 5.5);
  });

  it('여덟 마리가 한 점에 몰려도 몇 번 밀면 다 떨어진다', () => {
    const bs = Array.from({ length: 8 }, (_, i) => body(5 + i * 0.01, 5));
    for (let k = 0; k < 40; k++) apply(bs);
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) expect(gap(bs[i]!, bs[j]!)).toBeGreaterThan(-0.02);
  });
});

describe('pushOutOf', () => {
  it('몹 안으로 걸어 들어가면 다 비키고, 다른 사람과는 반만', () => {
    const me = body(5, 5);
    const zombie = body(5.4, 5);
    const p = pushOutOf(me, [zombie]);
    expect(p.dx).toBeCloseTo(-0.2, 6);
    const half = pushOutOf(me, [zombie], () => 0.5);
    expect(half.dx).toBeCloseTo(-0.1, 6);
  });

  it('겹치지 않거나 높이가 다르면 0, 한 번에 maxStep 까지만', () => {
    expect(pushOutOf(body(5, 5), [body(6, 5), body(5, 5, { y: 30 })])).toEqual({ dx: 0, dz: 0 });
    const p = pushOutOf(body(5, 5), [body(5.01, 5, { r: 2 })], () => 1, 0.25);
    expect(Math.hypot(p.dx, p.dz)).toBeCloseTo(0.25, 6);
  });
});
