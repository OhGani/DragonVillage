import { describe, expect, it } from 'vitest';
import { RAIDS } from './data';
import { RAID_CAPTURE_SEC, RAID_WARNING_SEC, raidSpawnSpot, raidWave } from './raid';

describe('마을 방어전 규칙 (M7-5)', () => {
  it('bosses.json raids 를 읽는다: 10분 · 레벨 2 · 주 2회 · 파도 3 · 승리 경험치 50', () => {
    expect(RAIDS).toEqual({ durationSec: 600, minVillageLevel: 2, maxPerWeek: 2, waves: 3, xpEach: 50 });
    expect(RAID_WARNING_SEC).toBe(45);
    expect(RAID_CAPTURE_SEC).toBe(15);
  });

  it('파도: 1 = 변명자 3 + 약탈자 1, 2 = 변명자 3 + 약탈자 2, 마지막 = 소환사 + 변명자 2 + 약탈자 2. 사람이 많으면 변명자가 늘어난다', () => {
    // 아들 13차 "우민 수 늘려줘" (#128)
    expect(raidWave(1, 3, 2)).toEqual(['vindicator', 'vindicator', 'vindicator', 'vindicator', 'pillager', 'pillager']);
    expect(raidWave(2, 3, 2)).toEqual(['vindicator', 'vindicator', 'vindicator', 'vindicator', 'vindicator', 'pillager', 'pillager', 'pillager']);
    expect(raidWave(3, 3, 2)).toEqual(['evoker', 'vindicator', 'vindicator', 'vindicator', 'vindicator', 'pillager', 'pillager', 'pillager']);
    expect(raidWave(1, 3, 4).filter((k) => k === 'vindicator')).toHaveLength(6);
    expect(raidWave(1, 3, 1)).toEqual(raidWave(1, 3, 2)); // 혼자여도 줄지는 않는다
  });

  it('나오는 자리는 북쪽 포탈 뒤 둔치(x 60~68, z 36~38)에서 옆으로 퍼진다', () => {
    const spots = Array.from({ length: 12 }, (_, i) => raidSpawnSpot(i));
    for (const s of spots) {
      expect(s.x).toBeGreaterThanOrEqual(60);
      expect(s.x).toBeLessThanOrEqual(69);
      expect(s.z).toBeGreaterThanOrEqual(36);
      expect(s.z).toBeLessThanOrEqual(39);
    }
    expect(new Set(spots.map((s) => `${s.x},${s.z}`)).size).toBe(12);
  });
});
