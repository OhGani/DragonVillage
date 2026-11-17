import { describe, expect, it } from 'vitest';
import { BLOCKS, RECIPES } from './data';
import { FINE_RES, fineSolidQuery, raycastFine } from './stairs';
import { itemForPlacing } from './items';

const SNOW = BLOCKS.numOf('snow_layer');
const ROD = BLOCKS.numOf('lightning_rod');
const STONE = BLOCKS.numOf('stone');

describe('눈 층·피뢰침 (2026-11-17)', () => {
  it('눈 층: 지나가는 얇은 판(2/16), 놓을 때 덮어쓴다. 부수면 눈덩이. 눈 블록 3 → 눈 층 6', () => {
    const d = BLOCKS.get(SNOW);
    expect(d.solid).toBe(false);
    expect(d.replaceable).toBe(true);
    expect(d.box).toEqual([[0, 0, 0, 16, 2, 16]]);
    expect(d.drops).toBe('snowball');
    expect(itemForPlacing('snow_layer', BLOCKS)).toBe('snow_layer');
    const solid = fineSolidQuery(BLOCKS, (x, y, z) => (x === 0 && y === 0 && z === 0 ? SNOW : 0));
    for (let s = 0; s < FINE_RES; s++) expect(solid(s, 0, s)).toBe(false);
    // 위에서 내려다보면 맨 아래 한 겹에 맞는다
    const get = (x: number, y: number, z: number) => (x === 0 && z === 0 ? (y === 0 ? STONE : y === 1 ? SNOW : 0) : 0);
    const hit = raycastFine(BLOCKS, get, (id) => id !== 0, 0.5, 4.5, 0.5, 0, -1, 0, 8)!;
    expect(hit.id).toBe(SNOW);
    expect(hit.y).toBe(1);
    expect(hit.distance).toBeCloseTo(4.5 - (1 + 1 / FINE_RES), 1);
    const r = RECIPES.defs.find((x) => x.id === 'snow_layer')!;
    expect(r.in).toEqual({ snow_block: 3 });
    expect(r.out).toEqual({ snow_layer: 6 });
  });

  it('피뢰침: 가운데 기둥에만 부딪히고 조준된다. 철 주괴 3 (세로)', () => {
    const d = BLOCKS.get(ROD);
    expect(d.box?.length).toBe(2);
    expect(d.solid).toBe(false);
    const solid = fineSolidQuery(BLOCKS, (x, y, z) => (x === 0 && y === 0 && z === 0 ? ROD : 0));
    expect(solid(1, 0, 1)).toBe(true);
    expect(solid(2, 3, 2)).toBe(true);
    expect(solid(0, 0, 0)).toBe(false);
    expect(solid(3, 2, 1)).toBe(false);
    const get = (x: number, y: number, z: number) => (x === 0 && y === 0 && z === 0 ? ROD : 0);
    expect(raycastFine(BLOCKS, get, (id) => id !== 0, 0.5, 0.5, 3.5, 0, 0, -1, 6)?.id).toBe(ROD);
    expect(raycastFine(BLOCKS, get, (id) => id !== 0, 0.1, 0.5, 3.5, 0, 0, -1, 6)).toBeNull(); // 옆으로 지나간다
    const r = RECIPES.defs.find((x) => x.id === 'lightning_rod')!;
    expect(r.in).toEqual({ iron_ingot: 3 });
    expect(r.out).toEqual({ lightning_rod: 1 });
  });
});
