import { describe, expect, it } from 'vitest';
import { buildVoxelGeometry, exposedFaceCount } from './voxelGeometry';

describe('복셀 → 지오메트리 (M6-3)', () => {
  it('붙어 있는 두 복셀은 맞닿은 면을 빼고 10면, 꼭짓점 40개·인덱스 60개', () => {
    const v = [
      { x: 0, y: 0, z: 0, c: '#ff0000' },
      { x: 1, y: 0, z: 0, c: '#00ff00' },
    ];
    expect(exposedFaceCount(v)).toBe(10);
    const g = buildVoxelGeometry(v, 1 / 16);
    expect(g.attributes.position!.count).toBe(40);
    expect(g.index!.count).toBe(60);
    expect(g.attributes.color!.count).toBe(40);
    // 윗면은 원색 그대로(밝기 1), 바닥면은 절반
    const colors = g.attributes.color!.array as Float32Array;
    const reds = new Set<number>();
    for (let i = 0; i < 40; i++) if (colors[i * 3 + 1] === 0) reds.add(Math.round(colors[i * 3]! * 100) / 100);
    expect(reds.has(1)).toBe(true);
    expect(reds.has(0.5)).toBe(true);
  });

  it('복셀 하나는 6면, 크기는 scale 만큼', () => {
    const g = buildVoxelGeometry([{ x: 0, y: 0, z: 0, c: '#123456' }], 0.5);
    expect(g.attributes.position!.count).toBe(24);
    const bb = g.boundingBox!;
    expect(bb.max.x - bb.min.x).toBeCloseTo(0.5);
    expect(bb.min.y).toBeCloseTo(0);
    expect(bb.max.y).toBeCloseTo(0.5);
  });
});
