import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { AccountService } from './accounts';
import { FamilyService } from './family';
import { listParentEmails, resetParentPassword } from './resetPassword';
import { Storage } from './storage';

describe('부모 비밀번호 다시 정하기 (2026-11-17)', () => {
  it('서버가 켜진 채로 바꿔도 새 비밀번호로 로그인되고, 옛 비밀번호는 안 된다', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dv-reset-'));
    try {
      const path = join(dir, 'dragoncraft.sqlite');
      const storage = new Storage(path);
      const family = new FamilyService(storage, new AccountService(storage));
      expect(family.signup('Dad@Example.com', 'oldpass1', 1000).ok).toBe(true);
      family.signup('mom@example.com', 'mompass1', 1000);
      const db = new Database(path, { fileMustExist: true }); // 명령은 다른 프로세스로 같은 파일을 연다
      expect(listParentEmails(db)).toEqual(['dad@example.com', 'mom@example.com']);
      expect(resetParentPassword(db, ' DAD@example.com ', 'short')).toBe('WEAK_PASSWORD');
      expect(resetParentPassword(db, 'nobody@example.com', 'newpass1')).toBe('NO_PARENT');
      expect(resetParentPassword(db, ' DAD@example.com ', 'newpass1')).toBe('OK');
      db.close();
      expect(family.login('dad@example.com', 'oldpass1', 2000)).toMatchObject({ ok: false, reason: 'BAD_LOGIN' });
      expect(family.login('dad@example.com', 'newpass1', 3000).ok).toBe(true);
      expect(family.login('mom@example.com', 'mompass1', 3000).ok).toBe(true); // 다른 사람은 그대로
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
