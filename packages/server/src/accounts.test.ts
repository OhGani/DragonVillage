import { describe, expect, it } from 'vitest';
import { AccountService, PIN_LOCK_MS, PIN_MAX_TRIES, hashPin, nickKey, verifyPin } from './accounts';
import { Storage } from './storage';

const A = 'a'.repeat(32),
  B = 'b'.repeat(32);

describe('닉네임 + PIN 이어하기 (#63)', () => {
  it('이름 키는 공백·대소문자를 무시하고, PIN 해시는 맞을 때만 통과', () => {
    expect(nickKey(' 오 가니 ')).toBe('오가니');
    expect(nickKey('Dad')).toBe('dad');
    const h = hashPin('1234');
    expect(verifyPin('1234', h)).toBe(true);
    expect(verifyPin('1235', h)).toBe(false);
    expect(hashPin('1234')).not.toBe(h); // 소금이 다르다
  });

  it('첫 입장은 이름을 내 것으로 하고 PIN 이 필요하다. 같은 토큰은 다시 와도 ok, 다른 토큰은 NICK_TAKEN', () => {
    const acc = new AccountService(new Storage(':memory:'));
    expect(acc.claim(A, '오가니', 1000)).toEqual({ ok: true, needPin: true });
    expect(acc.claim(A, '오가니', 2000)).toEqual({ ok: true, needPin: true });
    expect(acc.claim(B, '오 가니', 3000)).toEqual({ ok: false, reason: 'NICK_TAKEN' });
    expect(acc.setPin(A, '1234')).toBe(true);
    expect(acc.setPin(A, '12a4')).toBe(false);
    expect(acc.setPin(B, '1234')).toBe(false); // 계정이 없다
    expect(acc.claim(A, '오가니', 4000)).toEqual({ ok: true, needPin: false });
    expect(acc.hasPin(A)).toBe(true);
  });

  it('다른 기기: 이름 + PIN 으로 그 계정 토큰을 받는다. 틀리면 5번 뒤 10분 잠금', () => {
    const acc = new AccountService(new Storage(':memory:'));
    acc.claim(A, '쁘뚜', 1000);
    expect(acc.resume('쁘뚜', '1111', 2000)).toEqual({ ok: false, reason: 'NO_PIN' });
    acc.setPin(A, '1111');
    expect(acc.resume('없는이름', '1111', 2000)).toEqual({ ok: false, reason: 'NO_SUCH_NICK' });
    for (let i = 0; i < PIN_MAX_TRIES; i++) expect(acc.resume('쁘뚜', '9999', 3000 + i)).toEqual({ ok: false, reason: 'BAD_PIN' });
    expect(acc.resume('쁘뚜', '1111', 4000)).toEqual({ ok: false, reason: 'PIN_LOCKED' }); // 맞아도 잠김
    expect(acc.resume('쁘뚜', '1111', 4000 + PIN_LOCK_MS)).toEqual({ ok: true, token: A });
    expect(acc.resume('쁘 뚜', '1111', 5000 + PIN_LOCK_MS)).toEqual({ ok: true, token: A });
  });

  it('같은 토큰이 다른 이름으로 오면 이름을 바꾼다(계정은 토큰당 하나), PIN 은 유지', () => {
    const acc = new AccountService(new Storage(':memory:'));
    acc.claim(A, '아빠', 1000);
    acc.setPin(A, '2468');
    expect(acc.claim(A, '오가니', 2000)).toEqual({ ok: true, needPin: false });
    expect(acc.claim(B, '아빠', 3000)).toEqual({ ok: true, needPin: true }); // 옛 이름은 풀렸다
    expect(acc.resume('오가니', '2468', 4000)).toEqual({ ok: true, token: A });
  });

  it('저장·다시 열기', () => {
    const storage = new Storage(':memory:');
    const acc = new AccountService(storage);
    acc.claim(A, '친구', 1000);
    acc.setPin(A, '0000');
    const again = new AccountService(storage);
    expect(again.resume('친구', '0000', 2000)).toEqual({ ok: true, token: A });
  });
});
