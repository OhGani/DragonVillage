import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { REDSTONE } from './data';
import { parseRedstone } from './redstone';

const small = {
  rules: { maxSignal: 15, wireLossPerBlock: 1, tickMs: 100 },
  parts: [
    { id: 'lever', name: '레버', category: 'input', signal: 15, does: '켜고 끈다' },
    { id: 'piston', name: '피스톤', category: 'machine', does: '민다', release: 'v2' },
  ],
};

describe('parseRedstone', () => {
  it('작은 데이터를 읽고 기본 버전은 v1.1', () => {
    const reg = parseRedstone(small);
    expect(reg.count).toBe(2);
    expect(reg.require('lever').release).toBe('v1.1');
    expect(reg.require('lever').signal).toBe(15);
    expect(reg.require('piston').signal).toBeNull();
    expect(reg.byCategory('machine').map((p) => p.id)).toEqual(['piston']);
    expect(reg.rules.maxSignal).toBe(15);
  });

  it('실제 data/redstone.json 이 통과하고 네 분류가 다 있다', () => {
    expect(REDSTONE.count).toBeGreaterThanOrEqual(25);
    for (const c of ['power', 'wire', 'input', 'machine'] as const) {
      expect(REDSTONE.byCategory(c).length).toBeGreaterThan(0);
    }
    // 아빠 9차 목록의 부품들
    for (const id of ['redstone_block', 'redstone_torch', 'redstone_wire', 'repeater', 'comparator', 'observer', 'lever', 'button', 'pressure_plate', 'daylight_sensor', 'tripwire_hook', 'target', 'piston', 'sticky_piston', 'dispenser', 'dropper', 'hopper', 'powered_rail', 'detector_rail', 'activator_rail', 'redstone_lamp', 'copper_bulb', 'note_block', 'tnt', 'iron_door']) {
      REDSTONE.require(id);
    }
    // 회로 부품은 전부 v2
    for (const id of ['repeater', 'comparator', 'observer', 'piston', 'hopper']) {
      expect(REDSTONE.require(id).release).toBe('v2');
    }
    expect(REDSTONE.byRelease('v1').length).toBe(0);
  });

  it('잘못된 값이면 한국어 DataError', () => {
    const bad = { ...small, parts: [{ ...small.parts[0], signal: 16 }] };
    expect(() => parseRedstone(bad)).toThrow(DataError);
    expect(() => parseRedstone(bad)).toThrow(/1번째 부품\(id: lever\)/);
    const v1 = { ...small, parts: [{ ...small.parts[0], release: 'v1' }] };
    expect(() => parseRedstone(v1)).toThrow(/v1 에 없어요/);
    const dup = { ...small, parts: [small.parts[0], small.parts[0]] };
    expect(() => parseRedstone(dup)).toThrow(/두 번 나와요/);
    const badCat = { ...small, parts: [{ ...small.parts[0], category: 'magic' }] };
    expect(() => parseRedstone(badCat)).toThrow(/category/);
  });
});
