import { FENCE_E, STAIR_INNER_LEFT, STAIR_OUTER_LEFT, STAIR_STRAIGHT, fenceBoxes, gateBoxes, stairMask } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { boxEdges, outlineEdges, partBoxes, type Seg } from './partOutline';

const len = (e: Seg) => Math.abs(e[3] - e[0]) + Math.abs(e[4] - e[1]) + Math.abs(e[5] - e[2]);
const total = (es: Seg[]) => es.reduce((s, e) => s + len(e), 0);
const yRange = (es: Seg[]) => [Math.min(...es.map((e) => Math.min(e[1], e[4]))), Math.max(...es.map((e) => Math.max(e[1], e[4])))];

describe('조준 외곽선 모양 (#293)', () => {
  it('보통 블록: 한 칸짜리 모서리 12개 (평평한 면 가운데에는 선이 없다)', () => {
    const es = outlineEdges(255);
    expect(es.length).toBe(12);
    expect(es.every((e) => len(e) === 1)).toBe(true);
    expect(partBoxes(255)).toEqual([[0, 0, 0, 1, 1, 1]]);
  });
  it('반 블록: 반 칸 높이 상자 — 아래 반은 0~½, 위 반은 ½~1', () => {
    const lo = outlineEdges(0x0f),
      hi = outlineEdges(0xf0);
    expect(lo.length).toBe(12);
    expect(total(lo)).toBe(8 + 4 * 0.5); // 가로 8개 + 세로 반 칸 4개
    expect(yRange(lo)).toEqual([0, 0.5]);
    expect(yRange(hi)).toEqual([0.5, 1]);
    expect(partBoxes(0x0f)).toEqual([[0, 0, 0, 1, 0.5, 1]]);
    expect(partBoxes(0xf0)).toEqual([[0, 0.5, 0, 1, 1, 1]]);
  });
  it('곧은 계단: ㄴ자 기둥 — 모서리 18개(옆모습 6각 × 2 + 잇는 선 6)', () => {
    const es = outlineEdges(stairMask(0, false, STAIR_STRAIGHT));
    expect(es.length).toBe(18);
    // 옆모습 둘레 = 1 + 1 + ½ + ½ + ½ + ½ = 4, 둘이니 8. 잇는 선 6 × 1
    expect(total(es)).toBe(14);
    // 챌판 아래 모서리(오목): y ½, z ½ 에 x 방향으로 한 칸
    expect(es.some((e) => e[1] === 0.5 && e[4] === 0.5 && e[2] === 0.5 && e[5] === 0.5 && len(e) === 1)).toBe(true);
    expect(partBoxes(stairMask(0, false, STAIR_STRAIGHT)).length).toBe(3); // 아래 반 한 장 + 위 조각 둘
  });
  it('모서리 계단도 모양대로: 바깥은 위 조각 하나, 안쪽은 셋', () => {
    const outer = partBoxes(stairMask(0, false, STAIR_OUTER_LEFT)),
      inner = partBoxes(stairMask(0, false, STAIR_INNER_LEFT));
    expect(outer.length).toBe(2);
    expect(inner.length).toBe(4);
    const es = outlineEdges(stairMask(0, false, STAIR_OUTER_LEFT));
    // 바깥 모서리: 바닥 둘레 4 + 세로 2.5(작은 상자와 이어진 귀퉁이는 한 칸) + 아래 반 윗면 둘레 중 드러난 3 + 작은 상자 밑동 1 + 세로 1.5 + 꼭대기 2
    expect(es.every((e) => len(e) === 0.5 || len(e) === 1)).toBe(true);
    expect(total(es)).toBe(14);
  });
  it('울타리 (#295): 혼자면 기둥 상자의 모서리 12개, 가로대가 붙으면 그 모양대로. 전부 칸 안', () => {
    const post = boxEdges(fenceBoxes(0));
    expect(post.length).toBe(12);
    expect(total(post)).toBeCloseTo(8 * 0.25 + 4 * 1, 6);
    expect(Math.min(...post.map((e) => e[0]))).toBe(6 / 16);
    const arm = boxEdges(fenceBoxes(FENCE_E));
    expect(arm.length).toBeGreaterThan(12);
    expect(Math.max(...arm.map((e) => e[3]))).toBe(1); // 가로대가 칸 끝까지
    for (const shape of [fenceBoxes(15), gateBoxes(0, false), gateBoxes(3, true)]) {
      const es = boxEdges(shape);
      expect(es.length).toBeGreaterThan(12);
      for (const e of es) for (const v of e) expect(v >= 0 && v <= 1).toBe(true);
    }
  });
});
