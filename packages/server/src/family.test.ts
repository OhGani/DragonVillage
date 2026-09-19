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
