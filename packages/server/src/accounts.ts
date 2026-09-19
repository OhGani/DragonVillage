/**
 * 계정 = 닉네임 + PIN 4자리 (M5, 결정 #63). 이메일·개인 정보 없음.
 *
 * - 닉네임은 서버 전체에서 하나(대소문자·공백 무시). 첫 입장 때 그 이름이 내 토큰의 것이 되고, PIN 을 정한다.
 * - 다른 기기에서 같은 이름으로 들어오면 NICK_TAKEN → 이름 + PIN 으로 `resume` → 그 계정의 토큰을 받아 이어한다.
 * - PIN 은 scrypt 해시로만 저장. 틀리면 이름당 10분에 5번까지(브루트포스 방지).
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Storage } from './storage';

export const PIN_RE = /^\d{4}$/;
export const PIN_MAX_TRIES = 5;
export const PIN_LOCK_MS = 10 * 60_000;

export interface AccountRow {
  nickKey: string;
  nick: string;
  token: string;
  pinHash: string | null;
  createdAt: number;
}

/** 이름 비교용 키: 앞뒤·중간 공백 제거, 소문자, 유니코드 정규화 */
export function nickKey(nick: string): string {
  return nick.normalize('NFC').replace(/\s+/g, '').toLowerCase();
}

export function hashPin(pin: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(pin, salt, 32);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const hash = scryptSync(pin, Buffer.from(saltHex, 'hex'), 32);
  const want = Buffer.from(hashHex, 'hex');
  return hash.length === want.length && timingSafeEqual(hash, want);
}

export type ClaimResult = { ok: true; needPin: boolean } | { ok: false; reason: 'NICK_TAKEN' };
export type ResumeResult = { ok: true; token: string } | { ok: false; reason: 'NO_SUCH_NICK' | 'NO_PIN' | 'BAD_PIN' | 'PIN_LOCKED' };

export class AccountService {
  /** 이름 키 → 최근 실패 시각들 */
  private readonly fails = new Map<string, number[]>();

  constructor(private readonly storage: Storage) {}

  /**
   * 입장하려는 (토큰, 이름). 이름이 비었거나 내 것이면 ok. 다른 토큰의 이름이면 NICK_TAKEN.
   * 내 토큰이 다른 이름을 갖고 있었으면 이름을 바꾼다(계정은 토큰당 하나).
   */
  claim(token: string, nick: string, now = Date.now()): ClaimResult {
    const key = nickKey(nick);
    const byNick = this.storage.getAccountByNick(key);
    const mine = this.storage.getAccountByToken(token);
    if (byNick && byNick.token !== token) return { ok: false, reason: 'NICK_TAKEN' };
    if (mine && mine.nickKey !== key) {
      this.storage.deleteAccount(mine.nickKey);
      this.storage.upsertAccount({ nickKey: key, nick, token, pinHash: mine.pinHash, createdAt: mine.createdAt });
      return { ok: true, needPin: mine.pinHash === null };
    }
    if (!byNick) {
      this.storage.upsertAccount({ nickKey: key, nick, token, pinHash: null, createdAt: now });
      return { ok: true, needPin: true };
    }
    return { ok: true, needPin: byNick.pinHash === null };
  }

  /** PIN 정하기(또는 바꾸기). 토큰의 계정이 없으면 false */
  setPin(token: string, pin: string): boolean {
    if (!PIN_RE.test(pin)) return false;
    const acc = this.storage.getAccountByToken(token);
    if (!acc) return false;
    this.storage.setAccountPin(acc.nickKey, hashPin(pin));
    return true;
  }

  /** 다른 기기에서 이어하기: 이름 + PIN → 그 계정의 토큰 */
  resume(nick: string, pin: string, now = Date.now()): ResumeResult {
    const key = nickKey(nick);
    const recent = (this.fails.get(key) ?? []).filter((t) => now - t < PIN_LOCK_MS);
    if (recent.length >= PIN_MAX_TRIES) return { ok: false, reason: 'PIN_LOCKED' };
    const acc = this.storage.getAccountByNick(key);
    if (!acc) return { ok: false, reason: 'NO_SUCH_NICK' };
    if (!acc.pinHash) return { ok: false, reason: 'NO_PIN' };
    if (!PIN_RE.test(pin) || !verifyPin(pin, acc.pinHash)) {
      recent.push(now);
      this.fails.set(key, recent);
      return { ok: false, reason: 'BAD_PIN' };
    }
    this.fails.delete(key);
    return { ok: true, token: acc.token };
  }

  /** PIN 초기화 (부모 화면): 다음에 그 기기에서 들어오면 PIN 정하기 창이 다시 뜬다 */
  resetPin(nick: string): boolean {
    const acc = this.storage.getAccountByNick(nickKey(nick));
    if (!acc) return false;
    this.storage.clearAccountPin(acc.nickKey);
    this.fails.delete(acc.nickKey);
    return true;
  }

  hasPin(token: string): boolean {
    return this.storage.getAccountByToken(token)?.pinHash != null;
  }
}
