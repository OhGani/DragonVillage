import { describe, expect, it } from 'vitest';
import { WEATHER } from './data';
import { fallOf, firstClearMs, isRaining, isStorming, lightningGapMs, nextWeather, parseWeather, weatherSkyLight, weatherToast } from './weather';
import { DataError } from './blocks';

describe('날씨 (data/weather.json, 2026-11-17)', () => {
  it('곳마다 내리는 것: 마을·초원 섬 비, 설원 눈, 사막 흐림만, 동굴·네더·엔드 없음. 안 적은 곳은 비', () => {
    expect(fallOf(WEATHER, 'village')).toBe('rain');
    expect(fallOf(WEATHER, 'grass_island')).toBe('rain');
    expect(fallOf(WEATHER, 'snowfield')).toBe('snow');
    expect(fallOf(WEATHER, 'desert')).toBe('dry');
    for (const id of ['cave', 'nether', 'the_end', 'deep_dark']) expect(fallOf(WEATHER, id)).toBe('none');
    expect(fallOf(WEATHER, 'somewhere_new')).toBe('rain');
  });

  it('맑음 → 비/뇌우 → 맑음 차례로, 길이는 적은 범위 안. 뇌우는 대략 thunderChance 만큼', () => {
    const c = WEATHER.village;
    let thunder = 0;
    for (let n = 1; n <= 400; n++) {
      const w = nextWeather(c, 'clear', 77, n);
      expect(w.kind).not.toBe('clear');
      expect(w.ms).toBeGreaterThanOrEqual(c.rainMs[0]);
      expect(w.ms).toBeLessThanOrEqual(c.rainMs[1]);
      if (w.kind === 'thunder') thunder++;
      const back = nextWeather(c, w.kind, 77, n + 1000);
      expect(back.kind).toBe('clear');
      expect(back.ms).toBeGreaterThanOrEqual(c.clearMs[0]);
      expect(back.ms).toBeLessThanOrEqual(c.clearMs[1]);
    }
    expect(thunder / 400).toBeGreaterThan(c.thunderChance - 0.1);
    expect(thunder / 400).toBeLessThan(c.thunderChance + 0.1);
    expect(nextWeather(c, 'clear', 5, 3)).toEqual(nextWeather(c, 'clear', 5, 3)); // 결정론
    expect(firstClearMs(WEATHER.expedition, 9)).toBeGreaterThanOrEqual(WEATHER.expedition.clearMs[0]);
    const gap = lightningGapMs(WEATHER, 9, 1);
    expect(gap).toBeGreaterThanOrEqual(WEATHER.lightning.everyMs[0]);
    expect(gap).toBeLessThanOrEqual(WEATHER.lightning.everyMs[1]);
  });

  it('비를 맞는 건 비 내리는 곳뿐, 번개는 사막에도 친다. 하늘은 비 0.8·뇌우 0.67, 날씨 없는 곳은 그대로', () => {
    expect(isRaining('rain', 'rain')).toBe(true);
    expect(isRaining('thunder', 'rain')).toBe(true);
    expect(isRaining('rain', 'snow')).toBe(false);
    expect(isRaining('rain', 'dry')).toBe(false);
    expect(isStorming('thunder', 'dry')).toBe(true);
    expect(isStorming('thunder', 'none')).toBe(false);
    expect(isStorming('rain', 'rain')).toBe(false);
    expect(weatherSkyLight(WEATHER, 'rain', 'rain')).toBeCloseTo(0.8);
    expect(weatherSkyLight(WEATHER, 'thunder', 'snow')).toBeCloseTo(0.67);
    expect(weatherSkyLight(WEATHER, 'thunder', 'none')).toBe(1);
    expect(weatherToast('rain', 'snow')).toContain('눈');
    expect(weatherToast('rain', 'none')).toBeNull();
  });

  it('아들이 잘못 적으면 한국어로 알려 준다', () => {
    const bad = { ...JSON.parse(JSON.stringify(rawOk())), places: { village: 'sunny' } };
    expect(() => parseWeather(bad)).toThrow(DataError);
    expect(() => parseWeather(bad)).toThrow(/rain · snow · dry · none/);
    const rev = rawOk();
    rev.village.rainMinutes = [10, 5];
    expect(() => parseWeather(rev)).toThrow(/둘째 수/);
  });
});

function rawOk() {
  return {
    village: { clearMinutes: [15, 40], rainMinutes: [5, 10], thunderChance: 0.25 },
    expedition: { clearMinutes: [3, 10], rainMinutes: [2, 5], thunderChance: 0.3 },
    places: { _comment: '설명', village: 'rain' },
    skyLight: { rain: 0.8, thunder: 0.67 },
    lightning: { everySeconds: [10, 30], range: 40, radius: 3, damage: 5 },
    fishWait: 0.75,
    rainHurts: ['enderman'],
  };
}
