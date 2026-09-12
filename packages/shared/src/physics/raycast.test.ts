import { describe, expect, it } from 'vitest';
import { raycastVoxels } from './raycast';

const solidAt = (sx: number, sy: number, sz: number) => (x: number, y: number, z: number) =>
  x === sx && y === sy && z === sz ? 1 : 0;
const isSolid = (id: number) => id !== 0;

describe('raycastVoxels', () => {
  it('+X 로 쏘면 블록의 -X 면(face 1)을 맞춘다', () => {
    const hit = raycastVoxels(solidAt(5, 0, 0), isSolid, 0.5, 0.5, 0.5, 1, 0, 0, 10);
    expect(hit).not.toBeNull();
    expect([hit!.x, hit!.y, hit!.z]).toEqual([5, 0, 0]);
    expect(hit!.face).toBe(1);
    expect([hit!.nx, hit!.ny, hit!.nz]).toEqual([-1, 0, 0]);
    expect(hit!.distance).toBeCloseTo(4.5);
  });

  it('아래로 쏘면 윗면(face 2)을 맞춘다', () => {
    const hit = raycastVoxels(solidAt(0, -3, 0), isSolid, 0.5, 1.6, 0.5, 0, -1, 0, 10);
    expect(hit!.face).toBe(2);
    expect(hit!.y).toBe(-3);
    expect(hit!.distance).toBeCloseTo(3.6);
  });

  it('사거리 밖이면 null', () => {
    expect(raycastVoxels(solidAt(8, 0, 0), isSolid, 0.5, 0.5, 0.5, 1, 0, 0, 5)).toBeNull();
  });

  it('대각선도 격자를 따라 정확히 간다', () => {
    const hit = raycastVoxels(solidAt(3, 0, 3), isSolid, 0.5, 0.5, 0.5, 1, 0, 1, 10);
    expect(hit).not.toBeNull();
    expect([hit!.x, hit!.z]).toEqual([3, 3]);
  });

  it('시작 칸 안의 블록은 무시한다', () => {
    const hit = raycastVoxels(solidAt(0, 0, 0), isSolid, 0.5, 0.5, 0.5, 1, 0, 0, 5);
    expect(hit).toBeNull();
  });

  it('맞출 수 없는 블록(물)은 통과한다', () => {
    const world = (x: number) => (x === 2 ? 9 : x === 4 ? 1 : 0);
    const hit = raycastVoxels(world, (id) => id === 1, 0.5, 0.5, 0.5, 1, 0, 0, 10);
    expect(hit!.x).toBe(4);
  });
});
