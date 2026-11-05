// 마을 데이터를 파일 하나로 뽑는다 (서버 이전용, 2026-11-05).
// SQLite 온라인 백업이라 서버가 돌고 있어도 깨지지 않지만, 옮기는 날엔 서버를 먼저 끄고 뽑아야 그 뒤에 바뀐 것이 안 빠진다.
//   node tools/dev/export-db.mjs [원본 sqlite] [내보낼 파일]
//   기본: packages/server/data/dragoncraft.sqlite → dragoncraft-export.sqlite (저장소 맨 위)
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(root, 'packages', 'server', 'package.json')); // better-sqlite3 는 서버 패키지에 있다
const Database = require('better-sqlite3');

const src = resolve(process.argv[2] ?? join(root, 'packages', 'server', 'data', 'dragoncraft.sqlite'));
const out = resolve(process.argv[3] ?? join(root, 'dragoncraft-export.sqlite'));

const db = new Database(src, { readonly: true, fileMustExist: true });
await db.backup(out);
db.close();

const check = new Database(out, { readonly: true });
const ok = check.prepare('PRAGMA integrity_check').get();
const count = (table) => {
  try {
    return check.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
  } catch {
    return '?';
  }
};
console.log(`내보냄: ${out}`);
console.log(`검사: ${ok.integrity_check} · 계정 ${count('accounts')} · 가방 ${count('inventories')} · 드래곤 ${count('dragons')} · 바뀐 청크 ${count('chunk_diffs')} · 동물 ${count('animals')}`);
check.close();
