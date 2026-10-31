import { describe, expect, it } from 'vitest';
import { TREE_KINDS, treeBlocks, treeKindOf, type TreeKind } from './trees';
import { BLOCKS } from './data';

describe('나무 8종 (#243)', () => {
  const kinds = Object.keys(TREE_KINDS) as TreeKind[];
  it('묘목 8개의 grows 가 나무 종류로 풀리고, 줄기·잎 블록이 data/blocks.json 에 있다', () => {
    expect(kinds).toHaveLength(8);
    for (const k of kinds) {
      const sap = k === 'oak' ? 'sapling' : `${k}_sapling`;
      expect(treeKindOf(BLOCKS.require(sap).grows)).toBe(k);
      expect(BLOCKS.require(TREE_KINDS[k].log).textures).not.toBeNull();
      expect(BLOCKS.require(TREE_KINDS[k].leaves).bonusDrops).toBe(sap);
    }
    expect(treeKindOf('wheat_ripe')).toBeNull();
    expect(treeKindOf('pine_tree')).toBeNull();
  });

  it('종류마다 줄기와 잎이 나오고, 같은 자리·시드면 같은 모양, 잎은 빈 칸에만', () => {
    for (const k of kinds) {
      const a = treeBlocks(k, { x: 10, y: 5, z: 10 }, 7, () => true);
      const b = treeBlocks(k, { x: 10, y: 5, z: 10 }, 7, () => true);
      expect(a).toEqual(b);
      const logs = a.filter((t) => t.kind === 'log');
      const leaves = a.filter((t) => t.kind === 'leaves');
      expect(logs.length).toBeGreaterThanOrEqual(4);
      expect(leaves.length).toBeGreaterThan(8);
      expect(logs.every((t) => t.x === 10 && t.z === 10)).toBe(true); // 줄기는 한 줄
      expect(logs[0]).toMatchObject({ x: 10, y: 5, z: 10 }); // 묘목 칸이 첫 줄기
      const blocked = treeBlocks(k, { x: 10, y: 5, z: 10 }, 7, (x, y, z) => !(x === 11 && z === 10 && y > 5));
      expect(blocked.some((t) => t.kind === 'leaves' && t.x === 11 && t.z === 10)).toBe(false);
    }
    const spruce = treeBlocks('spruce', { x: 10, y: 5, z: 10 }, 7, () => true).filter((t) => t.kind === 'log').length;
    const oak = treeBlocks('oak', { x: 10, y: 5, z: 10 }, 7, () => true).filter((t) => t.kind === 'log').length;
    expect(spruce).toBeGreaterThan(oak); // 가문비는 키가 크다
    const acacia = treeBlocks('acacia', { x: 10, y: 5, z: 10 }, 7, () => true);
    expect(acacia.some((t) => t.kind === 'leaves' && Math.abs(t.x - 10) === 3)).toBe(true); // 우산 잎은 넓다
  });
});
