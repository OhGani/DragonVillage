/**
 * 가족 연결 (M5-2, FAMILY-SYSTEM.md): 부모 계정(이메일 + 비밀번호), 가족 코드 6자리, 아이(닉네임 계정) 연결.
 *
 * - 부모만 이메일을 받는다(개인정보 최소). 비밀번호는 scrypt 해시. 로그인은 쿠키 세션(sid, 30일).
 * - 가족은 부모가 가입할 때 하나 생기고 코드 6자리를 받는다. 아이는 게임 안에서 가족 코드 + 자기 PIN 으로 연결한다.
 * - 부모 여러 명(엄마)은 v1.1: 같은 가족 코드로 가입하기.
 */
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AccountService } from './accounts';
import { nickKey } from './accounts';
import type { Storage } from './storage';

export const SESSION_DAYS = 30;
const LOGIN_MAX_TRIES = 5;
const LOGIN_LOCK_MS = 10 * 60_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Parent {
  id: number;
  familyId: number;
  familyCode: string;
  email: string;
}

function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(pw, salt, 32).toString('hex')}`;
}
function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const h = scryptSync(pw, Buffer.from(saltHex, 'hex'), 32);
  const want = Buffer.from(hashHex, 'hex');
  return h.length === want.length && timingSafeEqual(h, want);
}

export type SignupResult = { ok: true; parent: Parent; sid: string } | { ok: false; reason: 'BAD_EMAIL' | 'WEAK_PASSWORD' | 'EMAIL_TAKEN' };
export type LoginResult = { ok: true; parent: Parent; sid: string } | { ok: false; reason: 'BAD_LOGIN' | 'LOCKED' };
export type LinkResult = { ok: true; familyCode: string } | { ok: false; reason: 'NO_FAMILY' | 'NO_SUCH_NICK' | 'NO_PIN' | 'BAD_PIN' | 'PIN_LOCKED' | 'ALREADY_LINKED' };

export class FamilyService {
  private readonly fails = new Map<string, number[]>();

  constructor(
    private readonly storage: Storage,
    private readonly accounts: AccountService,
  ) {}

  private newFamilyCode(): string {
    for (let i = 0; i < 100; i++) {
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      if (!this.storage.getFamilyByCode(code)) return code;
    }
    throw new Error('가족 코드를 만들 수 없어요');
  }

  /** 부모 가입: 새 가족 + 부모 + 로그인 세션 */
  signup(emailRaw: string, password: string, now = Date.now()): SignupResult {
    const email = emailRaw.trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 120) return { ok: false, reason: 'BAD_EMAIL' };
    if (typeof password !== 'string' || password.length < 6 || password.length > 100) return { ok: false, reason: 'WEAK_PASSWORD' };
    if (this.storage.getParentByEmail(email)) return { ok: false, reason: 'EMAIL_TAKEN' };
    const familyId = this.storage.createFamily(this.newFamilyCode(), now);
    const parentId = this.storage.createParent(familyId, email, hashPassword(password), now);
    const parent = this.parentById(parentId)!;
    return { ok: true, parent, sid: this.newSession(parentId, now) };
  }

  login(emailRaw: string, password: string, now = Date.now()): LoginResult {
    const email = emailRaw.trim().toLowerCase();
    const recent = (this.fails.get(email) ?? []).filter((t) => now - t < LOGIN_LOCK_MS);
    if (recent.length >= LOGIN_MAX_TRIES) return { ok: false, reason: 'LOCKED' };
    const row = this.storage.getParentByEmail(email);
    if (!row || !verifyPassword(password, row.pwHash)) {
      recent.push(now);
      this.fails.set(email, recent);
      return { ok: false, reason: 'BAD_LOGIN' };
    }
    this.fails.delete(email);
    return { ok: true, parent: this.parentById(row.id)!, sid: this.newSession(row.id, now) };
  }

  private newSession(parentId: number, now: number): string {
    const sid = randomBytes(24).toString('hex');
    this.storage.createParentSession(sid, parentId, now + SESSION_DAYS * 86_400_000);
    return sid;
  }

  logout(sid: string): void {
    this.storage.deleteParentSession(sid);
  }

  /** 쿠키의 sid → 부모. 만료됐으면 null */
  parentBySession(sid: string | null | undefined, now = Date.now()): Parent | null {
    if (!sid || !/^[a-f0-9]{48}$/.test(sid)) return null;
    const s = this.storage.getParentSession(sid);
    if (!s || s.expiresAt < now) return null;
    return this.parentById(s.parentId);
  }

  private parentById(id: number): Parent | null {
    const p = this.storage.getParentById(id);
    if (!p) return null;
    const f = this.storage.getFamilyById(p.family);
    if (!f) return null;
    return { id: p.id, familyId: p.family, familyCode: f.code, email: p.email };
  }

  /** 아이 연결: 가족 코드 + 아이 자신의 PIN (게임 안에서, 그 계정의 토큰으로) */
  linkChild(familyCode: string, nick: string, pin: string, now = Date.now()): LinkResult {
    const family = this.storage.getFamilyByCode(String(familyCode).trim());
    if (!family) return { ok: false, reason: 'NO_FAMILY' };
    const key = nickKey(nick);
    const existing = this.storage.getChild(key);
    if (existing && existing.family === family.id) return { ok: true, familyCode: family.code };
    const check = this.accounts.resume(nick, pin, now); // PIN 확인만 (토큰은 쓰지 않는다)
    if (!check.ok) return { ok: false, reason: check.reason };
    this.storage.upsertChild(key, family.id, now);
    return { ok: true, familyCode: family.code };
  }

  /** 이 닉네임이 어느 가족의 아이인가 */
  familyOfNick(nick: string): string | null {
    const c = this.storage.getChild(nickKey(nick));
    if (!c) return null;
    return this.storage.getFamilyById(c.family)?.code ?? null;
  }

  children(familyId: number): { nick: string; linkedAt: number }[] {
    return this.storage.listChildren(familyId).map((c) => ({ nick: this.storage.getAccountByNick(c.nickKey)?.nick ?? c.nickKey, linkedAt: c.linkedAt }));
  }

  unlinkChild(familyId: number, nick: string): boolean {
    const key = nickKey(nick);
    const c = this.storage.getChild(key);
    if (!c || c.family !== familyId) return false;
    this.storage.deleteChild(key);
    return true;
  }
}
