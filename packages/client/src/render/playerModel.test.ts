import { describe, expect, it } from 'vitest';
import { FACE, PART_AT, PLAYER_SHADES, VOXEL, frontPixels, paletteFor, playerVoxels } from './playerModel';

const css = (hex: number) => '#' + hex.toString(16).padStart(6, '0');

describe('플레이어 인형 (#86)', () => {
  it('마인크래프트 비율 — 머리 8·몸통 12·팔다리 12칸, 다 쌓으면 몸 판정과 같은 1.8', () => {
    const v = playerVoxels(paletteFor(3));
    expect(v.head).toHaveLength(8 * 8 * 8 + 2); // 머리 한 덩어리 + 앞으로 튀어나온 코 두 칸
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

  it('얼굴이 있다 — 앞머리·눈 한 쌍·웃는 입, 좌우 대칭', () => {
    expect(FACE).toHaveLength(8);
    for (const row of FACE) expect(row).toHaveLength(8);
    for (const row of FACE) expect([...row].reverse().join('')).toBe(row); // 거울 대칭
    const all = FACE.join('');
    expect([...all].filter((c) => c === 'w')).toHaveLength(2); // 흰자 둘
    expect([...all].filter((c) => c === 'e')).toHaveLength(2); // 눈동자 둘
    expect([...all].filter((c) => c === 'm')).toHaveLength(4); // ∪ 모양 입
    expect(FACE[0]).toBe('hhhhhhhh'); // 맨 위는 머리카락
    const eyeRow = FACE.findIndex((r) => r.includes('e'));
    const mouthRow = FACE.findIndex((r) => r.includes('m'));
    expect(eyeRow).toBeLessThan(mouthRow); // 눈이 입보다 위
    expect(FACE[mouthRow]!.indexOf('m')).toBeLessThan(FACE[mouthRow + 1]!.indexOf('m')); // 입꼬리가 더 바깥 = 웃는 모양
  });

  it('코는 그림이 아니라 앞으로 튀어나온 칸이다 (아빠 2026-09-22)', () => {
    const v = playerVoxels(paletteFor(3));
    const front = Math.min(...v.head.map((q) => q.z));
    const nose = v.head.filter((q) => q.z === front);
    expect(nose).toHaveLength(2); // 얼굴 면(z = front + 1)보다 한 칸 더 앞
    expect(nose.map((q) => q.x).sort((a, b) => a - b)).toEqual([-1, 0]); // 얼굴 한가운데
    const noseRow = FACE.findIndex((r) => r.includes('n'));
    expect(nose[0]!.y).toBe(FACE.length - 1 - noseRow); // FACE 의 n 자리와 같은 높이
    const eyeRow = FACE.findIndex((r) => r.includes('e'));
    expect(nose[0]!.y).toBeLessThan(FACE.length - 1 - eyeRow); // 눈보다 아래
  });

  it('같은 색 부분도 칸마다 조금씩 달라 밋밋하지 않다 (아빠 2026-09-22)', () => {
    const pal = paletteFor(3);
    const shirt = frontPixels(pal).filter((p) => p.y >= 13 && p.y <= 23 && p.x >= -4 && p.x <= 3);
    expect(shirt.length).toBeGreaterThan(50);
    expect(new Set(shirt.map((p) => p.c)).size).toBeGreaterThan(8); // 한 가지 색 덩어리가 아니다
    expect(shirt.filter((p) => p.c === css(pal.shirt)).length).toBeLessThan(shirt.length / 4); // 원색 그대로인 칸은 드물다
    // 가운데 줄만 보면 위가 밝고 아래가 어둡다 (바깥 줄은 겨드랑이 그늘이 따로 있다)
    const lum = (c: string) => {
      const n = parseInt(c.slice(1), 16);
      return ((n >> 16) & 255) + ((n >> 8) & 255) + (n & 255);
    };
    const mid = shirt.filter((p) => p.x >= -2 && p.x <= 1);
    const top = mid.filter((p) => p.y >= 21).map((p) => lum(p.c));
    const bottom = mid.filter((p) => p.y <= 15).map((p) => lum(p.c));
    const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    expect(avg(top)).toBeGreaterThan(avg(bottom));
  });

  it('면마다 밝기가 달라 옆면이 앞면보다 어둡다', () => {
    const [px, nx, py, ny, pz, nz] = PLAYER_SHADES as number[];
    expect(py).toBeGreaterThan(nz!); // 윗면이 가장 밝다
    expect(nz!).toBeGreaterThan(pz!); // 앞이 뒤보다 밝다
    expect(nz! - px!).toBeGreaterThan(0.15); // 앞과 옆의 차이가 뚜렷해야 입체로 보인다
    expect(px!).toBeGreaterThan(nx!);
    expect(ny!).toBeLessThan(nx!); // 바닥면이 가장 어둡다
  });

  it('색 16가지가 저마다 다른 사람 — 셔츠는 고른 색, 피부·머리는 여러 가지', () => {
    const pals = Array.from({ length: 16 }, (_, i) => paletteFor(i));
    expect(new Set(pals.map((p) => p.shirt)).size).toBe(16);
    expect(new Set(pals.map((p) => `${p.skin}/${p.hair}`)).size).toBeGreaterThanOrEqual(10);
    expect(new Set(pals.map((p) => p.skin)).size).toBeGreaterThanOrEqual(4); // 피부색 여러 가지
    expect(paletteFor(19)).toEqual(paletteFor(3)); // 번호가 넘치면 돌아온다
  });
});
