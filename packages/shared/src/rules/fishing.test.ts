import { describe, expect, it } from 'vitest';
import { FISHING, FOOD, ITEM_NAMES } from './data';
import { fishWaitMs, fishXp, parseFishing, rollCatch } from './fishing';

describe('낚시 (data/fishing.json, 2026-11-06)', () => {
  it('파일이 읽히고, 기다림은 waitMin~waitMax, 경험치는 xp 범위', () => {
    for (let n = 0; n < 200; n++) {
      const w = fishWaitMs(FISHING, 42, n);
      expect(w).toBeGreaterThanOrEqual(FISHING.waitMinMs);
      expect(w).toBeLessThanOrEqual(FISHING.waitMaxMs);
      const xp = fishXp(FISHING, 42, n);
      expect(xp).toBeGreaterThanOrEqual(FISHING.xp[0]);
      expect(xp).toBeLessThanOrEqual(FISHING.xp[1]);
    }
  });

  it('잡히는 것은 무게대로 나오고(대구가 가장 많다), places 밖에선 안 나온다', () => {
    const count = (place: string) => {
      const m = new Map<string, number>();
      for (let n = 0; n < 3000; n++) {
        const c = rollCatch(FISHING, place, 7, n)!;
        m.set(c.item, (m.get(c.item) ?? 0) + 1);
      }
      return m;
    };
    const village = count('village');
    const top = [...village.entries()].sort((a, b) => b[1] - a[1])[0]![0];
    expect(top).toBe('cod');
    expect(village.has('pufferfish')).toBe(false); // 복어는 바다(초원 섬·정글)에서만
    expect(count('grass_island').get('pufferfish')).toBeGreaterThan(0);
    expect(rollCatch(FISHING, 'village', 7, 5)).toEqual(rollCatch(FISHING, 'village', 7, 5)); // 결정론
  });

  it('잡히는 것은 모두 한국어 이름이 있고, 물고기는 먹을 수 있다', () => {
    for (const c of FISHING.catches) expect(ITEM_NAMES.get(c.item) ?? c.name, c.item).toBeTruthy();
    for (const fish of ['cod', 'salmon', 'tropical_fish', 'pufferfish', 'cooked_cod', 'cooked_salmon']) expect(FOOD.foods.has(fish), fish).toBe(true);
  });

  it('틀린 값은 친절한 한국어로 알려 준다', () => {
    expect(() => parseFishing({ range: 12, waitMinSec: 10, waitMaxSec: 5, biteSec: 2, xp: [1, 6], catches: [{ item: 'cod', name: '대구', weight: 1 }] })).toThrow(/waitMaxSec/);
    expect(() => parseFishing({ range: 12, waitMinSec: 5, waitMaxSec: 10, biteSec: 2, xp: [1, 6], catches: [] })).toThrow(/하나는/);
  });
});
