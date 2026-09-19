import type { ServerJson } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { AccountService } from './accounts';
import { FamilyService, SESSION_DAYS } from './family';
import { Storage } from './storage';

const A = 'a'.repeat(32);

function setup() {
  const storage = new Storage(':memory:');
  const accounts = new AccountService(storage);
  const family = new FamilyService(storage, accounts);
  return { storage, accounts, family };
}

describe('부모 계정·가족 코드 (M5-2)', () => {
  it('가입하면 가족 코드 6자리와 로그인 세션이 생기고, 같은 이메일은 두 번 못 쓴다', () => {
    const { family } = setup();
    const r = family.signup(' Dad@Example.com ', 'secret1', 1000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.parent.email).toBe('dad@example.com');
    expect(r.parent.familyCode).toMatch(/^\d{6}$/);
    expect(family.parentBySession(r.sid, 2000)).toMatchObject({ id: r.parent.id, familyCode: r.parent.familyCode });
    expect(family.parentBySession(r.sid, 2000 + SESSION_DAYS * 86_400_000 + 1)).toBeNull(); // 만료
    expect(family.parentBySession('nope', 2000)).toBeNull();
    expect(family.signup('dad@example.com', 'another1', 3000)).toEqual({ ok: false, reason: 'EMAIL_TAKEN' });
    expect(family.signup('not-an-email', 'secret1', 3000)).toEqual({ ok: false, reason: 'BAD_EMAIL' });
    expect(family.signup('x@y.z', '123', 3000)).toEqual({ ok: false, reason: 'WEAK_PASSWORD' });
  });

  it('로그인: 맞으면 새 세션, 틀리면 BAD_LOGIN, 5번 틀리면 10분 잠금, 로그아웃', () => {
    const { family } = setup();
    family.signup('mom@example.com', 'secret1', 1000);
    for (let i = 0; i < 5; i++) expect(family.login('mom@example.com', 'wrong', 2000 + i)).toEqual({ ok: false, reason: 'BAD_LOGIN' });
    expect(family.login('mom@example.com', 'secret1', 3000)).toEqual({ ok: false, reason: 'LOCKED' });
    const r = family.login('MOM@example.com', 'secret1', 3000 + 10 * 60_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(family.parentBySession(r.sid, 4000 + 10 * 60_000)).not.toBeNull();
    family.logout(r.sid);
    expect(family.parentBySession(r.sid, 4000 + 10 * 60_000)).toBeNull();
    expect(family.login('nobody@example.com', 'secret1', 5000)).toEqual({ ok: false, reason: 'BAD_LOGIN' });
  });

  it('아이 연결: 가족 코드 + 아이 PIN. 코드가 없거나 PIN 이 틀리면 거절, 연결되면 목록에 보인다', () => {
    const { family, accounts } = setup();
    const p = family.signup('dad@example.com', 'secret1', 1000);
    if (!p.ok) throw new Error();
    accounts.claim(A, '쁘뚜', 1000);
    expect(family.linkChild(p.parent.familyCode, '쁘뚜', '1111', 2000)).toEqual({ ok: false, reason: 'NO_PIN' });
    accounts.setPin(A, '1111');
    expect(family.linkChild('000000', '쁘뚜', '1111', 2000)).toEqual({ ok: false, reason: 'NO_FAMILY' });
    expect(family.linkChild(p.parent.familyCode, '쁘뚜', '9999', 2000)).toEqual({ ok: false, reason: 'BAD_PIN' });
    expect(family.linkChild(p.parent.familyCode, '없는애', '1111', 2000)).toEqual({ ok: false, reason: 'NO_SUCH_NICK' });
    expect(family.linkChild(p.parent.familyCode, '쁘 뚜', '1111', 2000)).toEqual({ ok: true, familyCode: p.parent.familyCode });
    expect(family.familyOfNick('쁘뚜')).toBe(p.parent.familyCode);
    expect(family.children(p.parent.familyId)).toEqual([{ nick: '쁘뚜', linkedAt: 2000 }]);
    // 이미 연결된 아이는 PIN 없이도 ok (다시 눌러도 그대로)
    expect(family.linkChild(p.parent.familyCode, '쁘뚜', '0000', 3000)).toEqual({ ok: true, familyCode: p.parent.familyCode });
    expect(family.unlinkChild(p.parent.familyId, '쁘뚜')).toBe(true);
    expect(family.familyOfNick('쁘뚜')).toBeNull();
    expect(family.unlinkChild(p.parent.familyId, '쁘뚜')).toBe(false);
  });
});

describe('할 일·승인·시간 (M5-3)', () => {
  const SAT = Date.UTC(2026, 8, 19, 1, 20); // 2026-09-19 토 10:20 KST
  const B = 'b'.repeat(32);
  function withChild() {
    const s = setup();
    const p = s.family.signup('dad@example.com', 'secret1', 1000);
    if (!p.ok) throw new Error();
    s.accounts.claim(A, '쁘뚜', 1000);
    s.accounts.setPin(A, '1111');
    s.family.linkChild(p.parent.familyCode, '쁘뚜', '1111', 2000);
    return { ...s, fid: p.parent.familyId, code: p.parent.familyCode };
  }

  it('할 일 추가 → 카드에 뜨고, 체크 → 자동 승인 또는 부모 승인 → 보너스, 시간 누적, 끄기·삭제', () => {
    const { family, fid } = withChild();
    expect(family.todayCard('없는애', SAT)).toBeNull();
    const teeth = family.addTodo(fid, '쁘뚜', ' 이 닦기 ', 'daily', false, SAT)!;
    const math = family.addTodo(fid, '쁘뚜', '수학 숙제', [0, 6], true, SAT)!;
    expect(teeth.title).toBe('이 닦기');
    expect(family.addTodo(fid, '누구', 'x', 'daily', false, SAT)).toBeNull();
    expect(family.addTodo(fid, '쁘뚜', '   ', 'daily', false, SAT)).toBeNull();
    expect(family.addTodo(999, '쁘뚜', 'x', 'daily', false, SAT)).toBeNull();
    let card = family.todayCard('쁘뚜', SAT)!;
    expect(card.todos.map((t) => t.title)).toEqual(['이 닦기', '수학 숙제']);
    expect(card).toMatchObject({ date: '2026-09-19', baseMin: 30, bonusCap: 5, bonusMin: 0, remainingMin: 30, enforced: false });

    const r1 = family.checkTodo('쁘뚜', teeth.id, SAT + 1000);
    expect(r1.ok && !r1.needsApproval).toBe(true);
    if (r1.ok) expect(r1.card.bonusMin).toBe(3); // 1/2 × 5 = 2.5 → 3
    const r2 = family.checkTodo('쁘뚜', math.id, SAT + 2000);
    expect(r2.ok && r2.needsApproval).toBe(true);
    expect(family.checkTodo('쁘뚜', math.id, SAT + 3000)).toEqual({ ok: false, reason: 'ALREADY' });
    expect(family.checkTodo('쁘뚜', 12345, SAT)).toEqual({ ok: false, reason: 'NO_TODO' });
    expect(family.checkTodo('없는애', teeth.id, SAT)).toEqual({ ok: false, reason: 'NOT_CHILD' });
    expect(family.pendingApprovals(fid)).toMatchObject([{ todoId: math.id, child: '쁘뚜', title: '수학 숙제', date: '2026-09-19' }]);

    // 거절 → 다시 체크할 수 있다. 승인 → 보너스 5
    expect(family.decideTodo(fid, math.id, '2026-09-19', false, SAT + 4000)).toBe(true);
    expect(family.todayCard('쁘뚜', SAT)!.todos[1]!.status).toBe('rejected');
    expect(family.checkTodo('쁘뚜', math.id, SAT + 5000).ok).toBe(true);
    expect(family.decideTodo(fid, math.id, '2026-09-19', true, SAT + 6000)).toBe(true);
    card = family.todayCard('쁘뚜', SAT + 6000)!;
    expect(card.bonusMin).toBe(5);
    expect(card.remainingMin).toBe(35);
    expect(family.pendingApprovals(fid)).toEqual([]);
    expect(family.decideTodo(999, math.id, '2026-09-19', true)).toBe(false); // 다른 가족
    expect(family.decideTodo(fid, math.id, 'nope', true)).toBe(false);

    // 시간 누적: 90초 → 쓴 1분, +30초 → 2분
    expect(family.addUsage('쁘뚜', 90, SAT + 7000)!.usedMin).toBe(1);
    expect(family.addUsage('쁘뚜', 30, SAT + 8000)!.remainingMin).toBe(33);
    expect(family.addUsage('없는애', 60, SAT)).toBeNull();

    // 끄기 → 카드에서 사라짐. 삭제
    expect(family.updateTodo(fid, teeth.id, { active: false }, SAT)).toBe(true);
    expect(family.todayCard('쁘뚜', SAT)!.todos.map((t) => t.id)).toEqual([math.id]);
    expect(family.updateTodo(fid, teeth.id, { title: '  ' }, SAT)).toBe(false);
    expect(family.updateTodo(999, teeth.id, { active: true }, SAT)).toBe(false);
    expect(family.deleteTodo(fid, math.id, SAT)).toBe(true);
    expect(family.todosOf(fid, '쁘뚜')).toHaveLength(1);
    expect(family.childrenStatus(fid, SAT)[0]).toMatchObject({ nick: '쁘뚜', online: false, today: { remainingMin: 28 } });
  });

  it('한 번짜리 할 일은 승인되면 다음 날 카드에 없다', () => {
    const { family, fid } = withChild();
    const room = family.addTodo(fid, '쁘뚜', '방 정리', 'once', false, SAT)!;
    expect(family.checkTodo('쁘뚜', room.id, SAT).ok).toBe(true);
    expect(family.todayCard('쁘뚜', SAT + 86_400_000)!.todos).toEqual([]);
  });

  it('부모 플레이어 연결과 실시간 알림: 아이가 체크하면 부모에게 approvalAsk, 승인하면 아이에게 today', () => {
    const { family, accounts, fid, code } = withChild();
    accounts.claim(B, '오가니', 1000);
    accounts.setPin(B, '2222');
    expect(family.linkParentPlayer(fid, '쁘뚜', '1111')).toEqual({ ok: false, reason: 'ALREADY_LINKED' });
    expect(family.linkParentPlayer(fid, '오가니', '9999')).toEqual({ ok: false, reason: 'BAD_PIN' });
    expect(family.linkParentPlayer(fid, '오가니', '2222')).toEqual({ ok: true, familyCode: code });
    expect(family.parentFamilyOfNick('오가니')).toBe(code);
    expect(family.parentFamilyOfNick('쁘뚜')).toBeNull();
    expect(family.parentPlayers(fid)).toEqual(['오가니']);
    // 부모 플레이어는 아이로 연결할 수 없다 (아빠가 게임 안 "가족 연결"을 눌렀던 실수)
    expect(family.linkChild(code, '오가니', '2222')).toEqual({ ok: false, reason: 'IS_PARENT' });
    expect(family.familyOfNick('오가니')).toBeNull();

    const gotParent: ServerJson[] = [];
    const gotChild: ServerJson[] = [];
    const lp = (m: ServerJson) => gotParent.push(m);
    const lc = (m: ServerJson) => gotChild.push(m);
    family.attach('오가니', lp);
    family.attach('쁘뚜', lc);
    const t = family.addTodo(fid, '쁘뚜', '수학', 'daily', true, SAT)!;
    expect(gotChild.at(-1)).toMatchObject({ t: 'today', card: { todos: [{ id: t.id, status: 'pending' }] } });
    expect(family.childrenStatus(fid, SAT)[0]!.online).toBe(true);
    family.checkTodo('쁘뚜', t.id, SAT);
    expect(gotParent[0]).toMatchObject({ t: 'approvalAsk', id: t.id, date: '2026-09-19', child: '쁘뚜', title: '수학' });
    expect(gotParent[1]).toMatchObject({ t: 'pending', items: [{ id: t.id, date: '2026-09-19', child: '쁘뚜', title: '수학' }] });
    expect(family.pendingItems(fid)).toHaveLength(1);
    family.decideTodo(fid, t.id, '2026-09-19', true, SAT);
    expect(gotChild.at(-1)).toMatchObject({ t: 'today', card: { bonusMin: 5, todos: [{ status: 'approved' }] } });
    expect(gotParent.at(-1)).toEqual({ t: 'pending', items: [] });
    family.detach('오가니', lp);
    family.detach('쁘뚜', lc);
    const n = gotChild.length;
    family.addTodo(fid, '쁘뚜', '하나 더', 'daily', false, SAT);
    expect(gotChild.length).toBe(n); // 떼면 안 온다
    expect(family.unlinkParentPlayer(fid, '오가니')).toBe(true);
    expect(family.parentFamilyOfNick('오가니')).toBeNull();
  });
});

describe('시간 조정·오늘 게임 없음·PIN 초기화·제한 판정 (M5-4)', () => {
  const SAT = Date.UTC(2026, 8, 19, 1, 20); // 토 10:20 KST, 기본 30분
  function withChildEnforced(enforce: boolean) {
    const storage = new Storage(':memory:');
    const accounts = new AccountService(storage);
    const family = new FamilyService(storage, accounts, undefined, { enforceTime: enforce });
    const p = family.signup('dad@example.com', 'secret1', 1000);
    if (!p.ok) throw new Error();
    accounts.claim(A, '쁘뚜', 1000);
    accounts.setPin(A, '1111');
    family.linkChild(p.parent.familyCode, '쁘뚜', '1111', 2000);
    return { storage, accounts, family, fid: p.parent.familyId };
  }

  it('수동 조정 ±분 + 사유가 카드에 실리고, 이상한 값은 거절', () => {
    const { family, fid } = withChildEnforced(false);
    const card = family.adjustTime(fid, '쁘뚜', 10, '  방 청소 잘함 ', SAT)!;
    expect(card.manualAdj).toBe(10);
    expect(card.remainingMin).toBe(40);
    expect(card.adjustments).toEqual([{ min: 10, reason: '방 청소 잘함' }]);
    expect(family.adjustTime(fid, '쁘뚜', -5, '', SAT)!.remainingMin).toBe(35);
    expect(family.adjustTime(fid, '쁘뚜', 0, 'x', SAT)).toBeNull();
    expect(family.adjustTime(fid, '쁘뚜', 500, 'x', SAT)).toBeNull();
    expect(family.adjustTime(fid, '쁘뚜', 2.5, 'x', SAT)).toBeNull();
    expect(family.adjustTime(999, '쁘뚜', 5, 'x', SAT)).toBeNull();
    expect(family.adjustTime(fid, '누구', 5, 'x', SAT)).toBeNull();
    // 제한이 꺼져 있으면 아무 것도 막지 않는다
    expect(family.timeBlock('쁘뚜', SAT)).toBeNull();
    expect(family.setNoPlay(fid, '쁘뚜', true, SAT)!.noPlayToday).toBe(true);
    expect(family.timeBlock('쁘뚜', SAT)).toBeNull();
    expect(family.expeditionCheck('쁘뚜', 600, SAT)).toEqual({ ok: true });
  });

  it('제한이 켜져 있으면: 오늘 게임 없음·차단·시간 다 씀에 입장 거절, 원정은 시간이 충분할 때만, 접속 중이면 timeUp', () => {
    const { family, fid } = withChildEnforced(true);
    const got: ServerJson[] = [];
    const l = (m: ServerJson) => got.push(m);
    family.attach('쁘뚜', l);
    expect(family.timeBlock('쁘뚜', SAT)).toBeNull();
    expect(family.timeBlock('오가니', SAT)).toBeNull(); // 아이 아님
    // 원정 10분 + 여유 3 = 13분 필요. 남은 30분 → ok. 조정 −20 → 10분 → 안 됨
    expect(family.expeditionCheck('쁘뚜', 600, SAT)).toEqual({ ok: true });
    family.adjustTime(fid, '쁘뚜', -20, '숙제 안 함', SAT);
    const c = family.expeditionCheck('쁘뚜', 600, SAT);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.message).toMatch(/남은 시간 10분/);
    // 차단 시간대(월 15:30) → blocked
    const MON = Date.UTC(2026, 8, 21, 6, 30);
    expect(family.timeBlock('쁘뚜', MON)).toMatchObject({ reason: 'blocked', message: /16:00/ });
    // 오늘 게임 없음 → noPlay, 접속 중인 아이에게 timeUp
    got.length = 0;
    family.setNoPlay(fid, '쁘뚜', true, SAT);
    expect(family.timeBlock('쁘뚜', SAT)).toMatchObject({ reason: 'noPlay' });
    expect(got.some((m) => m.t === 'timeUp' && m.reason === 'noPlay')).toBe(true);
    family.setNoPlay(fid, '쁘뚜', false, SAT);
    // 시간 다 씀 → over
    family.addUsage('쁘뚜', 10 * 60, SAT);
    expect(family.timeBlock('쁘뚜', SAT)).toMatchObject({ reason: 'over' });
    expect(family.expeditionCheck('쁘뚜', 600, SAT).ok).toBe(false);
    family.detach('쁘뚜', l);
  });

  it('PIN 초기화: 다음 입장 때 PIN 정하기가 다시 뜬다', () => {
    const { family, accounts, fid } = withChildEnforced(false);
    expect(family.resetChildPin(fid, '없는애')).toBe(false);
    expect(family.resetChildPin(999, '쁘뚜')).toBe(false);
    expect(family.resetChildPin(fid, '쁘뚜')).toBe(true);
    expect(accounts.hasPin(A)).toBe(false);
    expect(accounts.claim(A, '쁘뚜', 3000)).toEqual({ ok: true, needPin: true });
    expect(accounts.resume('쁘뚜', '1111', 3000)).toEqual({ ok: false, reason: 'NO_PIN' });
  });
});
