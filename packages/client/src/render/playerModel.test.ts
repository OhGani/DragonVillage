import { describe, expect, it } from 'vitest';
import { EYE_DARK, EYE_WHITE, PART_AT, VOXEL, frontPixels, paletteFor, playerVoxels } from './playerModel';

const css = (hex: number) => '#' + hex.toString(16).padStart(6, '0');

describe('플레이어 인형 (#86)', () => {
  it('마인크래프트 비율 — 머리 8·몸통 12·팔다리 12칸, 다 쌓으면 몸 판정과 같은 1.8', () => {
    const v = playerVoxels(paletteFor(3));
    expect(v.head).toHaveLength(8 * 8 * 8);
    expect(v.torso).toHaveLength(8 * 12 * 4);
    expect(v.arm).toHaveLength(4 * 12 * 4);
    expect(v.leg).toHaveLength(4 * 12 * 4);
    expect((PART_AT.head[1] + 8) * VOXEL).toBeCloseTo(1.8); // 머리 꼭대기 = 키
    expect(PART_AT.torso[1] + 12).toBe(PART_AT.head[1]); // 몸통 위에 머리
    expect(PART_AT.armL[1]).toBe(PART_AT.head[1]); // 어깨는 몸통 맨 위
  });

  it('앞에서 보면 발부터 머리까지 꽉 차고 좌우가 똑같다', () => {
    const px = frontPixels(paletteFor(7));
    const ys = px.map((p) => p.y);
    expect(Math.min(...ys)).toBe(0); // 발바닥
    expect(Math.max(...ys)).toBe(31); // 머리 꼭대기
    const xs = px.map((p) => p.x);
    expect(Math.min(...xs)).toBe(-8); // 왼팔 바깥
    expect(Math.max(...xs)).toBe(7);
    const at = new Map(px.map((p) => [`${p.x},${p.y}`, p.c]));
    for (const p of px) expect(at.get(`${-1 - p.x},${p.y}`)).toBe(p.c); // 거울처럼 대칭
  });

  it('얼굴이 있다 — 눈 두 쌍과 웃는 입', () => {
    const px = frontPixels(paletteFor(0));
    expect(px.filter((p) => p.c === css(EYE_WHITE))).toHaveLength(2);
    expect(px.filter((p) => p.c === css(EYE_DARK))).toHaveLength(2);
    // 입 네 칸이 ∪ 모양: 바깥 두 칸이 안쪽 두 칸보다 한 칸 높다
    const eyeY = px.find((p) => p.c === css(EYE_DARK))!.y;
    const mouth = px.filter((p) => p.y < eyeY && p.y > eyeY - 4 && p.c !== px.find((q) => q.x === 0 && q.y === eyeY)!.c);
    expect(mouth.length).toBeGreaterThanOrEqual(4);
  });

  it('색 16가지가 저마다 다른 사람 — 셔츠는 고른 색, 피부·머리는 여러 가지', () => {
    const pals = Array.from({ length: 16 }, (_, i) => paletteFor(i));
    expect(new Set(pals.map((p) => p.shirt)).size).toBe(16);
    expect(new Set(pals.map((p) => `${p.skin}/${p.hair}`)).size).toBeGreaterThanOrEqual(10);
    expect(new Set(pals.map((p) => p.skin)).size).toBeGreaterThanOrEqual(4); // 피부색 여러 가지
    expect(paletteFor(19)).toEqual(paletteFor(3)); // 번호가 넘치면 돌아온다
  });
});
