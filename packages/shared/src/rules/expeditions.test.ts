import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { EXPEDITIONS } from './data';
import { EVENING_SEC, NIGHT_SKY, parseExpeditions, phaseAt, remainingSec, skyLightAt } from './expeditions';

const small = {
  returnGraceSec: 60,
  failedReturnKeepRatio: 0.5,
  minStartMarginMin: 3,
  expeditions: [
    { id: 'grass_island', name: '초원 섬', generator: 'island', durationSec: 600, nightStartsAt: 360, treasures: 3, unlockedBy: 'portal_1', danger: 1, materials: ['log'] },
    { id: 'cave', name: '동굴', generator: 'cave', durationSec: 600, nightStartsAt: 0, treasures: 4, unlockedBy: 'portal_2', danger: 2, materials: ['iron_ingot'], release: 'v1.1' },
  ],
};

describe('parseExpeditions', () => {
  it('작은 데이터를 읽고 기본 버전은 v1', () => {
    const reg = parseExpeditions(small);
    expect(reg.count).toBe(2);
    expect(reg.require('grass_island').release).toBe('v1');
    expect(reg.v1().map((d) => d.id)).toEqual(['grass_island']);
    expect(reg.rules).toEqual({ returnGraceSec: 60, failedReturnKeepRatio: 0.5, minStartMarginMin: 3, treasureChestGives: {} });
  });

  it('실제 data/expeditions.json 이 통과하고 v1 6곳이 순서대로 있다', () => {
    expect(EXPEDITIONS.v1().map((d) => d.id)).toEqual(['grass_island', 'cave', 'desert', 'snowfield', 'nether', 'the_end']);
    const island = EXPEDITIONS.require('grass_island');
    expect(island.generator).toBe('island');
    expect(island.durationSec).toBe(600);
    expect(island.treasures).toBe(3);
    expect(EXPEDITIONS.rules.failedReturnKeepRatio).toBe(0.5);
    for (const d of EXPEDITIONS.defs) expect(d.nightStartsAt).toBeLessThanOrEqual(d.durationSec);
  });

  it('잘못된 값이면 한국어 DataError', () => {
    const bad = { ...small, expeditions: [{ ...small.expeditions[0], durationSec: 0 }] };
    expect(() => parseExpeditions(bad)).toThrow(DataError);
    expect(() => parseExpeditions(bad)).toThrow(/1번째 원정지\(id: grass_island\)의 durationSec/);
    const late = { ...small, expeditions: [{ ...small.expeditions[0], nightStartsAt: 700 }] };
    expect(() => parseExpeditions(late)).toThrow(/밤 시작.*늦어요/);
    const dup = { ...small, expeditions: [small.expeditions[0], small.expeditions[0]] };
    expect(() => parseExpeditions(dup)).toThrow(/두 번 나와요/);
    const ratio = { ...small, failedReturnKeepRatio: 1.5 };
    expect(() => parseExpeditions(ratio)).toThrow(/0~1/);
  });
});

describe('낮·저녁·밤', () => {
  const island = { nightStartsAt: 360, durationSec: 600 };
  const cave = { nightStartsAt: 0, durationSec: 600 };

  it('단계 경계', () => {
    expect(phaseAt(island, 0)).toBe('day');
    expect(phaseAt(island, 360 - EVENING_SEC - 1)).toBe('day');
    expect(phaseAt(island, 360 - EVENING_SEC)).toBe('evening');
    expect(phaseAt(island, 359)).toBe('evening');
    expect(phaseAt(island, 360)).toBe('night');
    expect(phaseAt(cave, 0)).toBe('night');
  });

  it('스카이라이트는 낮 1 → 저녁 0.6 → 밤 0.22 로 이어지고 단조 감소', () => {
    expect(skyLightAt(island, 0)).toBe(1);
    expect(skyLightAt(island, 360 - EVENING_SEC)).toBe(1);
    expect(skyLightAt(island, 360)).toBeCloseTo(0.6, 5);
    expect(skyLightAt(island, 360 + 60)).toBeCloseTo(NIGHT_SKY, 5);
    expect(skyLightAt(island, 600)).toBeCloseTo(NIGHT_SKY, 5);
    let prev = 1;
    for (let s = 0; s <= 600; s += 5) {
      const v = skyLightAt(island, s);
      expect(v).toBeLessThanOrEqual(prev + 1e-9);
      expect(v).toBeGreaterThanOrEqual(NIGHT_SKY - 1e-9);
      prev = v;
    }
    expect(skyLightAt(cave, 0)).toBe(NIGHT_SKY);
    expect(skyLightAt(cave, 500)).toBe(NIGHT_SKY);
  });

  it('남은 시간', () => {
    expect(remainingSec(island, 0)).toBe(600);
    expect(remainingSec(island, 599.5)).toBe(0.5);
    expect(remainingSec(island, 700)).toBe(0);
  });
});
