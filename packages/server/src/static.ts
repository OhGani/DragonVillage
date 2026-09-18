/**
 * 클라이언트 빌드(dist) 정적 서빙. 외부 의존성 없이 최소한만.
 * - /assets/* 는 해시가 붙어 있으니 오래 캐시, 나머지는 캐시 안 함
 * - 확장자 없는 경로는 index.html (앱 라우팅용)
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, normalize } from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
};

export function serveStatic(distDir: string, req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const rel = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let file = join(distDir, rel);
  if (!file.startsWith(distDir)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    if (extname(rel) === '') file = join(distDir, 'index.html');
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('없는 파일이에요');
      return;
    }
  }
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('클라이언트 빌드가 없어요. pnpm build 를 먼저 해 주세요.');
    return;
  }
  const ext = extname(file);
  const headers: Record<string, string> = { 'Content-Type': MIME[ext] ?? 'application/octet-stream' };
  headers['Cache-Control'] = rel.startsWith('assets/') || rel.startsWith('assets\\') ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
}
