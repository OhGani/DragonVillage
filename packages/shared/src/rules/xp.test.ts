import { describe, expect, it } from 'vitest';
import xpJson from '../../../../data/xp.json';
import { XP } from './data';
import { hatchCost, levelFromTotalXp, miningXp, parseXp, spendLevels, totalXpForLevel, unlockedBetween, xpProgress, xpToNextLevel } from './xp';

describe('레벨 공식 (마인크래프트 Java)', () => {
  it('참고값: 레벨 5 = 55, 10 = 160, 15 = 315, 20 = 550, 30 = 1395', () => {
    expect(totalXpForLevel(5)).toBe(55);
    expect(totalXpForLevel(10)).toBe(160);
    expect(totalXpForLevel(15)).toBe(315);
    expect(totalXpForLevel(20)).toBe(550);
    expect(totalXpForLevel(30)).toBe(1395);
    expect(xpToNextLevel(0)).toBe(7);
    expect(xpToNextLevel(15)).toBe(37);
    expect(xpToNextLevel(16)).toBe(42);
    expect(xpToNextLevel(31)).toBe(121);
  });
  it('총량 ↔ 레벨이 맞물린다 (구간 경계 포함)', () => {
    for (let L = 0; L <= 40; L++) {
      expect(totalXpForLevel(L + 1) - totalXpForLevel(L)).toBe(xpToNextLevel(L));
      expect(levelFromTotalXp(totalXpForLevel(L))).toBe(L);
      expect(levelFromTotalXp(totalXpForLevel(L + 1) - 1)).toBe(L);
    }
    expect(levelFromTotalXp(0)).toBe(0);
    expect(levelFromTotalXp(6)).toBe(0);
    expect(levelFromTotalXp(7)).toBe(1);
  });
  it('진행도 바: 이번 레벨에서 모은 양 / 다음까지', () => {
    expect(xpProgress(0)).toEqual({ level: 0, into: 0, need: 7, progress: 0 });
    expect(xpProgress(60)).toEqual({ level: 5, into: 5, need: 17, progress: 5 / 17 });
    expect(xpProgress(-3).level).toBe(0);
  });
  it('레벨 지불: 모자라면 거절, 되면 그 레벨의 총량으로(진행도는 버림)', () => {
    expect(spendLevels(60, 1)).toEqual({ ok: true, total: totalXpForLevel(4) });
    expect(spendLevels(60, 5)).toEqual({ ok: true, total: 0 });
    expect(spendLevels(60, 6)).toEqual({ ok: false, level: 5 });
  });
});

describe('xp.json', () => {
  it('아들 값: 원정 귀환 10, 보물 5, 도감 5, 전부 모으면 300, 부화 비용 티어 1→1 … 16→15', () => {
    expect(XP.ours.expeditionReturn).toBe(10);
    expect(XP.ours.treasureChestOpen).toBe(5);
    expect(XP.ours.allDragonsCollected).toBe(300);
    expect(hatchCost(XP, 1)).toBe(1);
    expect(hatchCost(XP, 4)).toBe(2);
    expect(hatchCost(XP, 16)).toBe(15);
    expect(XP.mining.get('diamond_ore')).toEqual([3, 7]);
    expect(XP.mining.get('iron_ore')).toEqual([0, 0]);
    expect(XP.cosmeticUnlocksByLevel.get(5)).toBe('hat_basic');
  });
  it('캐기 경험치는 자리·시드로 결정론, 범위 안', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const v = miningXp(XP, 'diamond_ore', i, 12, i * 3, 777);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
      seen.add(v);
    }
    expect(seen.size).toBe(5);
    expect(miningXp(XP, 'diamond_ore', 4, 5, 6, 1)).toBe(miningXp(XP, 'diamond_ore', 4, 5, 6, 1));
    expect(miningXp(XP, 'stone', 1, 2, 3, 1)).toBe(0);
    expect(miningXp(XP, 'coal_ore', 1, 2, 3, 1)).toBeLessThanOrEqual(2);
  });
  it('구간 사이에 열리는 꾸미기', () => {
    expect(unlockedBetween(XP, 4, 5)).toEqual([{ level: 5, id: 'hat_basic' }]);
    expect(unlockedBetween(XP, 0, 12)).toEqual([
      { level: 5, id: 'hat_basic' },
      { level: 10, id: 'cape_basic' },
    ]);
    expect(unlockedBetween(XP, 5, 5)).toEqual([]);
  });
  it('티어가 빠지면 한국어로 알려준다', () => {
    const raw = JSON.parse(JSON.stringify(xpJson)) as { hatchLevelCostByTier: Record<string, unknown> };
    delete raw.hatchLevelCostByTier['9'];
    expect(() => parseXp(raw)).toThrow(/티어 9/);
  });
});
