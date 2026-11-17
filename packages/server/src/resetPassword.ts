/**
 * 부모 페이지 비밀번호 다시 정하기 (아빠 2026-11-17 "비밀번호 다시 정하는 명령 만들어 줘").
 * 비밀번호는 scrypt 해시로만 저장돼서 꺼내 볼 수 없다 — 잊어버리면 서버에서 새로 정한다.
 * 쓰는 법은 tools/linux/reset-password.sh (서버에서 이메일 목록을 보여 주고, 새 비밀번호를 두 번 묻는다).
 *
 *   tsx src/resetPassword.ts list            부모 계정 이메일 목록
 *   DV_NEW_PASSWORD=… tsx src/resetPassword.ts set <이메일>   그 계정의 비밀번호를 바꾼다 (명령 줄에 비밀번호를 안 남기려고 환경 변수로)
 *
 * 게임 서버가 켜져 있어도 된다 (WAL). 로그인 잠김(10분)은 서버 메모리에 있어서 이것으로는 안 풀린다.
 */
import Database from 'better-sqlite3';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hashPassword } from './family';

export type ResetResult = 'OK' | 'NO_PARENT' | 'WEAK_PASSWORD';

/** 부모 계정 이메일 전부 (가입 순서) */
export function listParentEmails(db: Database.Database): string[] {
  return (db.prepare('SELECT email FROM parents ORDER BY id').all() as { email: string }[]).map((r) => r.email);
}

/** 이 이메일의 비밀번호를 바꾼다. 가입과 같은 규칙: 6~100자 */
export function resetParentPassword(db: Database.Database, emailRaw: string, password: string): ResetResult {
  if (typeof password !== 'string' || password.length < 6 || password.length > 100) return 'WEAK_PASSWORD';
  const email = emailRaw.trim().toLowerCase();
  const r = db.prepare('UPDATE parents SET pw_hash = ? WHERE email = ?').run(hashPassword(password), email);
  return r.changes > 0 ? 'OK' : 'NO_PARENT';
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const dbPath = join(resolve(process.env.DV_DATA_DIR ?? join(here, '..', 'data')), 'dragoncraft.sqlite');
  const db = new Database(dbPath, { fileMustExist: true });
  db.pragma('busy_timeout = 5000');
  const [cmd, email] = process.argv.slice(2);
  try {
    if (cmd === 'list') {
      const list = listParentEmails(db);
      console.log(list.length ? list.map((e) => `  - ${e}`).join('\n') : '  (부모 계정이 없어요)');
      return;
    }
    if (cmd === 'set' && email) {
      const r = resetParentPassword(db, email, process.env.DV_NEW_PASSWORD ?? '');
      if (r === 'OK') console.log(`✅ ${email.trim().toLowerCase()} 의 비밀번호를 바꿨어요. 부모 페이지에서 새 비밀번호로 로그인하세요.\n   (아까 여러 번 틀려 잠겼다면 10분 기다리거나 update.sh --now 로 서버를 다시 켜세요)`);
      else console.error(r === 'NO_PARENT' ? `❌ ${email} 이메일의 부모 계정이 없어요 — 위 목록의 이메일을 그대로 쳐 주세요` : '❌ 비밀번호는 6자 이상 100자 이하예요');
      process.exitCode = r === 'OK' ? 0 : 1;
      return;
    }
    console.error('쓰는 법: resetPassword.ts list | resetPassword.ts set <이메일> (새 비밀번호는 DV_NEW_PASSWORD 로)');
    process.exitCode = 2;
  } finally {
    db.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
