import { describe, expect, it } from 'vitest';
import { FAMILY_RULES } from './data';
import {
  type Todo,
  buildTodayCard,
  computeBonusCap,
  computeTodayBonus,
  isBlockedNow,
  nextOpenHHMM,
  parseFamilyRules,
  repeatFromString,
  repeatLabel,
  repeatToString,
  seoulTime,
  statusAfterCheck,
  todoDueOn,
} from './family';

// 2026-09-19 (토) 10:20 KST = 01:20 UTC
const SAT_1020 = Date.UTC(2026, 8, 19, 1, 20);
// 2026-09-21 (월) 15:30 KST
const MON_1530 = Date.UTC(2026, 8, 21, 6, 30);

describe('family-rules.json', () => {
  it('아들 값이 그대로: 평일 20·주말 30, 보너스 한도 5, 첫 주 5', () => {
    expect(FAMILY_RULES.baseMinutes['1']).toBe(20);
    expect(FAMILY_RULES.baseMinutes['6']).toBe(30);
    expect(FAMILY_RULES.baseMinutes['0']).toBe(30);
    expect(FAMILY_RULES.weeklySettlement.firstWeekBonusCap).toBe(5);
    expect(FAMILY_RULES.expeditionStartMarginMinutes).toBe(3);
  });
  it('요일이 빠지면 한국어로 알려준다', () => {
    const raw = JSON.parse(JSON.stringify(FAMILY_RULES)) as { baseMinutes: Record<string, number> };
    delete raw.baseMinutes['3'];
    expect(() => parseFamilyRules(raw)).toThrow(/요일 "3"/);
  });
});

describe('서울 시간', () => {
  it('UTC → 서울 날짜·요일·분 (자정 넘김 포함)', () => {
    expect(seoulTime(SAT_1020)).toEqual({ date: '2026-09-19', weekday: 6, minuteOfDay: 10 * 60 + 20 });
    // 2026-09-19 23:30 KST 는 UTC 로 14:30 같은 날, 다음 날 00:10 KST 는 UTC 15:10
    expect(seoulTime(Date.UTC(2026, 8, 19, 15, 10)).date).toBe('2026-09-20');
    expect(seoulTime(Date.UTC(2026, 8, 19, 15, 10)).weekday).toBe(0);
  });
  it('접속 불가 시간대: 평일 16시 전·21시 후, 주말 9시 전', () => {
    expect(isBlockedNow(FAMILY_RULES, seoulTime(SAT_1020))).toBe(false);
    expect(isBlockedNow(FAMILY_RULES, seoulTime(MON_1530))).toBe(true);
    expect(nextOpenHHMM(FAMILY_RULES, seoulTime(MON_1530))).toBe('16:00');
    expect(isBlockedNow(FAMILY_RULES, seoulTime(Date.UTC(2026, 8, 21, 7, 0)))).toBe(false); // 월 16:00
    expect(isBlockedNow(FAMILY_RULES, seoulTime(Date.UTC(2026, 8, 21, 12, 0)))).toBe(true); // 월 21:00
    expect(nextOpenHHMM(FAMILY_RULES, seoulTime(Date.UTC(2026, 8, 21, 12, 0)))).toBeNull(); // 오늘은 더 안 열림
  });
});

describe('보너스', () => {
  it('지난주 달성률 → 한도. 첫 주는 5', () => {
    expect(computeBonusCap(null, FAMILY_RULES)).toBe(5);
    expect(computeBonusCap(1, FAMILY_RULES)).toBe(5);
    expect(computeBonusCap(0.9, FAMILY_RULES)).toBe(5);
    expect(computeBonusCap(0.8, FAMILY_RULES)).toBe(4);
    expect(computeBonusCap(0.5, FAMILY_RULES)).toBe(2);
    expect(computeBonusCap(0.2, FAMILY_RULES)).toBe(0);
  });
  it('오늘 보너스 = min(한도, round(승인/전체 × 한도)). 할 일 없으면 0', () => {
    expect(computeTodayBonus(0, 3, 5)).toBe(0);
    expect(computeTodayBonus(1, 3, 5)).toBe(2);
    expect(computeTodayBonus(2, 3, 5)).toBe(3);
    expect(computeTodayBonus(3, 3, 5)).toBe(5);
    expect(computeTodayBonus(0, 0, 5)).toBe(0);
    expect(computeTodayBonus(9, 3, 5)).toBe(5);
  });
});

describe('할 일', () => {
  const teeth: Todo = { id: 1, title: '이 닦기', repeat: 'daily', needsApproval: false, active: true };
  const math: Todo = { id: 2, title: '수학 숙제', repeat: [1, 2, 3, 4, 5], needsApproval: true, active: true };
  const room: Todo = { id: 3, title: '방 정리', repeat: 'once', needsApproval: true, active: true };
  const off: Todo = { id: 4, title: '꺼진 것', repeat: 'daily', needsApproval: false, active: false };

  it('반복 문자열 ↔ 값, 라벨', () => {
    expect(repeatToString('daily')).toBe('daily');
    expect(repeatToString([1, 2, 3, 4, 5])).toBe('1,2,3,4,5');
    expect(repeatFromString('0,6')).toEqual([0, 6]);
    expect(repeatFromString('once')).toBe('once');
    expect(repeatFromString('9,x,3')).toEqual([3]);
    expect(repeatLabel('daily')).toBe('매일');
    expect(repeatLabel([1, 2, 3, 4, 5])).toBe('평일');
    expect(repeatLabel([0, 6])).toBe('주말');
    expect(repeatLabel([1, 3])).toBe('월·수');
  });

  it('오늘 뜨는 할 일: 매일·요일·한 번(승인 전까지), 꺼진 건 안 뜬다', () => {
    expect(todoDueOn(teeth, 6, false)).toBe(true);
    expect(todoDueOn(math, 6, false)).toBe(false);
    expect(todoDueOn(math, 1, false)).toBe(true);
    expect(todoDueOn(room, 6, false)).toBe(true);
    expect(todoDueOn(room, 6, true)).toBe(false);
    expect(todoDueOn(off, 6, false)).toBe(false);
    expect(statusAfterCheck(teeth)).toBe('approved');
    expect(statusAfterCheck(math)).toBe('checked');
  });

  it('오늘 카드: 토요일 기본 30 + 보너스 + 조정 − 쓴 시간, 제한은 표시만', () => {
    const base = { todos: [teeth, math, room, off], time: seoulTime(SAT_1020), rules: FAMILY_RULES, lastWeekRate: null, usedSec: 7 * 60 + 30, manualAdj: 0, enforced: false };
    const card = buildTodayCard({ ...base, logs: [] });
    expect(card.date).toBe('2026-09-19');
    expect(card.todos.map((t) => t.id)).toEqual([1, 3]); // 수학은 평일만, 꺼진 건 없음
    expect(card.todos.every((t) => t.status === 'pending')).toBe(true);
    expect(card).toMatchObject({ baseMin: 30, bonusCap: 5, bonusMin: 0, usedMin: 7, remainingMin: 23, enforced: false, blocked: false });

    // 이 닦기 승인(자동) + 방 정리 체크(대기) → 승인 1/2 → 보너스 round(0.5 × 5) = 3
    const card2 = buildTodayCard({
      ...base,
      logs: [
        { todoId: 1, date: '2026-09-19', status: 'approved' },
        { todoId: 3, date: '2026-09-19', status: 'checked' },
      ],
    });
    expect(card2.todos.map((t) => t.status)).toEqual(['approved', 'checked']);
    expect(card2.bonusMin).toBe(3);
    expect(card2.remainingMin).toBe(30 + 3 - 7);

    // 방 정리를 어제 승인했으면 오늘 카드에 없다. 수동 조정 −40 이어도 남은 시간은 0 아래로 안 간다
    const card3 = buildTodayCard({ ...base, manualAdj: -40, logs: [{ todoId: 3, date: '2026-09-18', status: 'approved' }] });
    expect(card3.todos.map((t) => t.id)).toEqual([1]);
    expect(card3.remainingMin).toBe(0);
    expect(card3.manualAdj).toBe(-40);
  });
});
