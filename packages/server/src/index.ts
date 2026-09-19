/**
 * 드래곤 크래프트 서버 (M2). Node 22 + ws + better-sqlite3, 프로세스 하나.
 *
 *   PORT            기본 5173 (IDC 에서 이미 열려 있는 포트, 결정 #60)
 *   DV_DATA_DIR     SQLite·백업 위치 (기본 packages/server/data)
 *   DV_CLIENT_DIST  클라이언트 빌드 (기본 packages/client/dist)
 *   DV_DEFAULT_CODE 첫 실행 때 만들 기본 마을의 코드(숫자 6자리). 없으면 무작위
 *
 * HTTP 로 클라이언트를 내주고, 같은 포트의 /ws 로 WebSocket. /health 는 상태 JSON.
 * 실행: pnpm --filter @dragon-village/server start  (tsx 가 TS 를 바로 돈다)
 */
import { BLOCKS } from '@dragon-village/shared/data';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { AccountService } from './accounts';
import { RoomManager } from './rooms';
import { Session } from './session';
import { serveStatic } from './static';
import { Storage } from './storage';
import { TICK_MS } from './village';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 5173);
const DATA_DIR = resolve(process.env.DV_DATA_DIR ?? join(here, '..', 'data'));
const CLIENT_DIST = resolve(process.env.DV_CLIENT_DIST ?? join(here, '..', '..', 'client', 'dist'));
const DB_PATH = join(DATA_DIR, 'dragoncraft.sqlite');
const BACKUP_KEEP = 7;

const log = (msg: string): void => console.log(`${new Date().toISOString().slice(11, 19)} ${msg}`);

mkdirSync(DATA_DIR, { recursive: true });
const storage = new Storage(DB_PATH);
const rooms = new RoomManager(storage, BLOCKS, log);
const accounts = new AccountService(storage);
const home = rooms.ensureDefault(process.env.DV_DEFAULT_CODE);
writeFileSync(join(DATA_DIR, 'default-village-code.txt'), `${home.info.code}\n`);
log(`기본 마을 "${home.info.name}" 코드 ${home.info.code} (저장 청크 ${home.modifiedCount}개)`);
if (!existsSync(join(CLIENT_DIST, 'index.html'))) log(`주의: 클라이언트 빌드가 없어요 (${CLIENT_DIST}). pnpm build 를 먼저 하세요`);

const http = createServer((req, res) => {
  if (req.url?.startsWith('/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(
      JSON.stringify({
        ok: true,
        players: rooms.playerCount,
        villages: rooms.all().map((r) => ({ code: r.info.code, name: r.info.name, players: r.playerCount, modifiedChunks: r.modifiedCount, stats: r.stats })),
        uptimeSec: Math.round(process.uptime()),
      }),
    );
    return;
  }
  serveStatic(CLIENT_DIST, req, res);
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });
http.on('upgrade', (req, socket, head) => {
  if (!req.url?.startsWith('/ws')) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    const remote = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '?');
    new Session(ws, rooms, log, remote, accounts);
  });
});

// 20Hz 틱 (액체·위치·저장)
const ticker = setInterval(() => rooms.tick(Date.now()), TICK_MS);

// 하루 1회 백업, 7개 보관
function backup(): void {
  const stamp = new Date().toISOString().slice(0, 10);
  const dest = join(DATA_DIR, `backup-${stamp}.sqlite`);
  rooms.flushAll(Date.now());
  storage
    .backupTo(dest)
    .then(() => {
      log(`백업 저장 ${dest}`);
      const old = readdirSync(DATA_DIR)
        .filter((f) => /^backup-\d{4}-\d{2}-\d{2}\.sqlite$/.test(f))
        .sort();
      for (const f of old.slice(0, Math.max(0, old.length - BACKUP_KEEP))) unlinkSync(join(DATA_DIR, f));
    })
    .catch((e: unknown) => log(`백업 실패: ${(e as Error).message}`));
}
const backupTimer = setInterval(backup, 24 * 60 * 60 * 1000);
setTimeout(backup, 60 * 1000);

let shuttingDown = false;
function shutdown(sig: string): void {
  if (shuttingDown) return;
  shuttingDown = true;
  log(`${sig} → 저장하고 종료`);
  clearInterval(ticker);
  clearInterval(backupTimer);
  rooms.flushAll(Date.now());
  for (const ws of wss.clients) ws.close(1001, 'SERVER_SHUTDOWN');
  http.close(() => {
    storage.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (e) => {
  log(`치명적 오류: ${e.stack ?? e.message}`);
  shutdown('uncaughtException');
});

http.listen(PORT, '0.0.0.0', () => log(`서버 시작 http://0.0.0.0:${PORT}  (WebSocket /ws, 클라이언트 ${CLIENT_DIST}, 데이터 ${DATA_DIR})`));
