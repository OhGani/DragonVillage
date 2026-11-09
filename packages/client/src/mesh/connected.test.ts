import { describe, expect, it } from 'vitest';
import { canonConnect, connectedImage, connectedKeys, connectedName } from './connected';

/** 테두리 한 줄만 불투명(230), 속은 투명한 16×16 — 유리 기본 그림과 같은 꼴 */
function frameImage(): Uint8ClampedArray {
  const d = new Uint8ClampedArray(16 * 16 * 4);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const i = (y * 16 + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = 255;
      d[i + 3] = x === 0 || x === 15 || y === 0 || y === 15 ? 230 : 0;
    }
  return d;
}
const alpha = (d: Uint8ClampedArray, x: number, y: number) => d[(y * 16 + x) * 4 + 3];

describe('이어지는 유리 그림 (2026-11-09)', () => {
  it('이웃 8비트는 47가지 그림으로 줄어든다, 변이 안 이어진 쪽 대각선은 무시', () => {
    expect(connectedKeys()).toHaveLength(47);
    expect(connectedKeys()[0]).toBe(0);
    expect(canonConnect(16)).toBe(0); // 대각선만 이어짐 → 혼자와 같다
    expect(canonConnect(1 | 4 | 16)).toBe(1 | 4 | 16);
    expect(canonConnect(1 | 16)).toBe(1);
    expect(connectedName('glass', 0)).toBe('glass');
    expect(connectedName('glass', 8)).toBe('glass@8');
  });
  it('위(v+)만 이어지면 윗줄 테두리만 지우고 두 모서리 점은 남는다', () => {
    const d = connectedImage(frameImage(), 16, 8);
    for (let x = 1; x <= 14; x++) expect(alpha(d, x, 0)).toBe(0);
    expect(alpha(d, 0, 0)).toBe(230);
    expect(alpha(d, 15, 0)).toBe(230);
    for (let y = 1; y <= 15; y++) expect(alpha(d, 0, y)).toBe(230); // 왼쪽 변 그대로
    for (let x = 0; x <= 15; x++) expect(alpha(d, x, 15)).toBe(230); // 아랫줄 그대로
  });
  it('왼쪽·위가 이어져도 대각선이 비어 있으면 모서리 점은 남고, 대각선까지 이어지면 지운다', () => {
    expect(alpha(connectedImage(frameImage(), 16, 1 | 8), 0, 0)).toBe(230);
    expect(alpha(connectedImage(frameImage(), 16, 1 | 8 | 128), 0, 0)).toBe(0);
  });
  it('사방이 다 이어지면(255) 테두리가 하나도 없다', () => {
    const d = connectedImage(frameImage(), 16, 255);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) expect(alpha(d, x, y)).toBe(0);
  });
});
