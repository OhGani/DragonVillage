import { describe, expect, it } from 'vitest';
import { XP } from './data';
import { FALL_SAFE, HP_MAX, REGEN_DELAY_MS, REGEN_EVERY_MS, deathXpDrop, fallDamage, regenAt, trackFall, xpAfterDeath } from './health';
import { totalXpForLevel } from './xp';

describe('체력·낙하·죽음 (M7-1)', () => {
  it('낙하 피해: 3칸까지 0, 그 위로 한 칸마다 1', () => {
    expect(fallDamage(0)).toBe(0);
    expect(fallDamage(FALL_SAFE)).toBe(0);
    expect(fallDamage(3.9)).toBe(0);
    expect(fallDamage(4)).toBe(1);
    expect(fallDamage(10)).toBe(7);
    expect(fallDamage(23)).toBe(HP_MAX); // 23칸이면 죽는다
  });

  it('위치 흐름에서 낙하를 잰다 — 뛰어 올랐다 내려오는 건 0, 절벽은 아프고, 물·드래곤은 안 아프다', () => {
    let s: { peak: number | null; damage: number } = { peak: null, damage: 0 };
    // 땅 → 점프(1.2 위) → 착지: 0
    s = trackFall(s.peak, 41, true, false, false);
    s = trackFall(s.peak, 42.2, false, false, false);
    s = trackFall(s.peak, 41.5, false, false, false);
    s = trackFall(s.peak, 41, true, false, false);
    expect(s).toEqual({ peak: null, damage: 0 });
    // 절벽: 50 에서 걸어 나가 41 에 착지 → 9칸 → 6
    s = trackFall(null, 50, false, false, false);
    s = trackFall(s.peak, 46, false, false, false);
    expect(s.peak).toBe(50);
    s = trackFall(s.peak, 41, true, false, false);
    expect(s).toEqual({ peak: null, damage: 6 });
    // 물에 떨어지면 잊는다
    s = trackFall(60, 45, false, true, false);
    expect(s).toEqual({ peak: null, damage: 0 });
    // 드래곤을 타고 있으면 아무것도 안 잰다
    expect(trackFall(60, 20, true, false, true)).toEqual({ peak: null, damage: 0 });
  });

  it('죽으면 7×레벨(최대 100)을 떨어뜨리고 레벨 0', () => {
    expect(XP.death.dropsXp).toBe(true);
    expect(deathXpDrop(XP, 0)).toBe(0);
    expect(deathXpDrop(XP, totalXpForLevel(3))).toBe(21);
    expect(deathXpDrop(XP, totalXpForLevel(15))).toBe(100); // 105 → 100
    expect(xpAfterDeath(XP, totalXpForLevel(15))).toBe(0);
    const keep = { ...XP, death: { ...XP.death, dropsXp: false } };
    expect(deathXpDrop(keep, 315)).toBe(0);
    expect(xpAfterDeath(keep, 315)).toBe(315);
  });

  it('회복: 맞은 뒤 5초 지나면 3초마다 1, 가득 차면 0', () => {
    expect(regenAt(HP_MAX, 0, 0, 100_000)).toBe(0);
    expect(regenAt(10, 10_000, 0, 10_000 + REGEN_DELAY_MS - 1)).toBe(0);
    expect(regenAt(10, 10_000, 0, 10_000 + REGEN_DELAY_MS)).toBe(1);
    const t = 10_000 + REGEN_DELAY_MS;
    expect(regenAt(11, 10_000, t, t + REGEN_EVERY_MS - 1)).toBe(0);
    expect(regenAt(11, 10_000, t, t + REGEN_EVERY_MS)).toBe(1);
  });
});
