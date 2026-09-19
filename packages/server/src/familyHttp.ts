/**
 * 부모 화면 HTTP (M5): `/family` 페이지(정적 HTML) + `/api/family/*` JSON.
 * 로그인은 쿠키 `dv_parent`(HttpOnly, SameSite=Lax). 요청 본문은 16KB 까지.
 */
import { createReadStream, existsSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TodoRepeat } from '@dragon-village/shared';
import type { FamilyService, Parent } from './family';

const COOKIE = 'dv_parent';
const MAX_BODY = 16 * 1024;

const SIGNUP_KO: Record<string, string> = {
  BAD_EMAIL: '이메일 모양이 아니에요',
  WEAK_PASSWORD: '비밀번호는 6글자 이상이에요',
  EMAIL_TAKEN: '이미 가입한 이메일이에요. 로그인해 주세요',
  BAD_LOGIN: '이메일 또는 비밀번호가 달라요',
  LOCKED: '여러 번 틀려서 잠겼어요. 10분 뒤에 다시',
};

const LINK_KO: Record<string, string> = {
  NO_FAMILY: '가족을 찾을 수 없어요',
  NO_SUCH_NICK: '그 이름의 플레이어가 없어요',
  NO_PIN: '그 이름은 아직 PIN 이 없어요. 게임에서 먼저 PIN 을 정해요',
  BAD_PIN: 'PIN 이 틀렸어요',
  PIN_LOCKED: '여러 번 틀려서 잠겼어요. 10분 뒤에 다시',
  ALREADY_LINKED: '그 이름은 아이로 연결돼 있어요',
};

/** 요청의 repeat → 값. 'daily' | 'once' | [요일…]. 이상하면 null */
function parseRepeat(v: unknown): TodoRepeat | null {
  if (v === 'daily' || v === 'once') return v;
  if (Array.isArray(v)) {
    const days = [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6))].sort();
    return days.length ? days : null;
  }
  return null;
}

function readCookie(req: IncomingMessage, name: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function json(res: ServerResponse, status: number, body: unknown, extraHeaders: Record<string, string> = {}): void {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) {
        resolve(null);
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        const v: unknown = text ? JSON.parse(text) : {};
        resolve(v && typeof v === 'object' ? (v as Record<string, unknown>) : null);
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function sessionCookie(sid: string | null): string {
  return sid ? `${COOKIE}=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 86400}` : `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function meJson(family: FamilyService, parent: Parent) {
  return {
    email: parent.email,
    familyCode: parent.familyCode,
    enforced: family.enforceTime,
    children: family.childrenStatus(parent.familyId),
    pending: family.pendingApprovals(parent.familyId),
    parentPlayers: family.parentPlayers(parent.familyId),
  };
}

/**
 * `/family`·`/api/family/*` 를 처리했으면 true. 아니면 false (정적 서빙으로 넘긴다)
 */
export async function handleFamilyHttp(req: IncomingMessage, res: ServerResponse, family: FamilyService, pageFile: string): Promise<boolean> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname === '/family' || url.pathname === '/family/') {
    if (!existsSync(pageFile)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('가족 페이지 파일이 없어요');
      return true;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    createReadStream(pageFile).pipe(res);
    return true;
  }
  if (!url.pathname.startsWith('/api/family/')) return false;
  const action = url.pathname.slice('/api/family/'.length);
  const parent = family.parentBySession(readCookie(req, COOKIE));

  if (req.method === 'GET' && action === 'me') {
    if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
    return json(res, 200, meJson(family, parent)), true;
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'METHOD' }), true;
  const body = await readBody(req);
  if (!body) return json(res, 400, { error: 'BAD_BODY', message: '요청이 이상해요' }), true;

  switch (action) {
    case 'signup': {
      const r = family.signup(String(body.email ?? ''), String(body.password ?? ''));
      if (!r.ok) return json(res, 400, { error: r.reason, message: SIGNUP_KO[r.reason] }), true;
      return json(res, 200, meJson(family, r.parent), { 'Set-Cookie': sessionCookie(r.sid) }), true;
    }
    case 'login': {
      const r = family.login(String(body.email ?? ''), String(body.password ?? ''));
      if (!r.ok) return json(res, 401, { error: r.reason, message: SIGNUP_KO[r.reason] }), true;
      return json(res, 200, meJson(family, r.parent), { 'Set-Cookie': sessionCookie(r.sid) }), true;
    }
    case 'logout': {
      const sid = readCookie(req, COOKIE);
      if (sid) family.logout(sid);
      return json(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(null) }), true;
    }
    case 'unlink': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const ok = family.unlinkChild(parent.familyId, String(body.nick ?? ''));
      return json(res, ok ? 200 : 404, ok ? meJson(family, parent) : { error: 'NO_CHILD', message: '그런 아이가 없어요' }), true;
    }
    // ---- 할 일·승인·부모 플레이어 (M5-3)
    case 'todoAdd': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const repeat = parseRepeat(body.repeat);
      if (!repeat) return json(res, 400, { error: 'BAD_REPEAT', message: '반복(매일·요일·한 번)을 골라 주세요' }), true;
      const t = family.addTodo(parent.familyId, String(body.nick ?? ''), String(body.title ?? ''), repeat, body.needsApproval === true);
      if (!t) return json(res, 400, { error: 'BAD_TODO', message: '제목(1~30글자)과 아이를 확인해 주세요' }), true;
      return json(res, 200, meJson(family, parent)), true;
    }
    case 'todoUpdate': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const patch: { title?: string; repeat?: TodoRepeat; needsApproval?: boolean; active?: boolean } = {};
      if (typeof body.title === 'string') patch.title = body.title;
      if (body.repeat !== undefined) {
        const r = parseRepeat(body.repeat);
        if (!r) return json(res, 400, { error: 'BAD_REPEAT', message: '반복(매일·요일·한 번)을 골라 주세요' }), true;
        patch.repeat = r;
      }
      if (typeof body.needsApproval === 'boolean') patch.needsApproval = body.needsApproval;
      if (typeof body.active === 'boolean') patch.active = body.active;
      const ok = family.updateTodo(parent.familyId, Number(body.id), patch);
      return json(res, ok ? 200 : 404, ok ? meJson(family, parent) : { error: 'NO_TODO', message: '그 할 일을 찾을 수 없어요' }), true;
    }
    case 'todoDelete': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const ok = family.deleteTodo(parent.familyId, Number(body.id));
      return json(res, ok ? 200 : 404, ok ? meJson(family, parent) : { error: 'NO_TODO', message: '그 할 일을 찾을 수 없어요' }), true;
    }
    case 'decide': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const ok = family.decideTodo(parent.familyId, Number(body.id), String(body.date ?? ''), body.ok === true);
      return json(res, ok ? 200 : 404, ok ? meJson(family, parent) : { error: 'NO_TODO', message: '그 할 일을 찾을 수 없어요' }), true;
    }
    case 'linkParent': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const r = family.linkParentPlayer(parent.familyId, String(body.nick ?? ''), String(body.pin ?? ''));
      if (!r.ok) return json(res, 400, { error: r.reason, message: LINK_KO[r.reason] ?? '연결할 수 없어요' }), true;
      return json(res, 200, meJson(family, parent)), true;
    }
    case 'unlinkParent': {
      if (!parent) return json(res, 401, { error: 'NOT_LOGGED_IN' }), true;
      const ok = family.unlinkParentPlayer(parent.familyId, String(body.nick ?? ''));
      return json(res, ok ? 200 : 404, ok ? meJson(family, parent) : { error: 'NO_PLAYER', message: '그 플레이어가 없어요' }), true;
    }
    default:
      return json(res, 404, { error: 'NO_ACTION' }), true;
  }
}
