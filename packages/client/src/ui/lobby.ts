/**
 * 로비: 이름·색·마을 코드 → 들어가기 / 새 마을 만들기. 전부 DOM, 초5가 읽을 말로.
 * 마지막 값은 localStorage 에 기억한다. 주소 ?code=123456 이 있으면 코드 칸을 미리 채운다.
 */
import { PLAYER_COLOR_COUNT, VILLAGE_CODE_RE } from '@dragon-village/shared';
import { PLAYER_COLORS, colorCss } from '../net/colors';

export interface LobbyChoice {
  nick: string;
  color: number;
  /** null 이면 새 마을 만들기 */
  code: string | null;
}

export interface LobbyHandle {
  /** 사용자가 버튼을 누르면. 실패하면 setError 뒤 다시 기다린다 (resolve 는 매번 새 Promise) */
  waitChoice(): Promise<LobbyChoice>;
  setStatus(msg: string): void;
  setError(msg: string): void;
  /** 입력을 막고 안내만 보인다 (예: HTTPS 페이지에서 서버 연결 불가) */
  blockWith(html: string): void;
  close(): void;
}

const KEY_NICK = 'dv.nick';
const KEY_COLOR = 'dv.color';
const KEY_CODE = 'dv.code';

function remember(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 무시 */
  }
}
function recall(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function showLobby(root: HTMLElement): LobbyHandle {
  const el = document.createElement('div');
  el.className = 'overlay show lobby';
  const urlCode = new URLSearchParams(location.search).get('code');
  const nick0 = recall(KEY_NICK) ?? '';
  const color0 = Number(recall(KEY_COLOR) ?? '3') % PLAYER_COLOR_COUNT;
  const code0 = urlCode && VILLAGE_CODE_RE.test(urlCode) ? urlCode : (recall(KEY_CODE) ?? '');
  el.innerHTML = `
    <div class="overlay-card lobby-card">
      <h1 class="overlay-title">드래곤 크래프트</h1>
      <p class="overlay-sub">친구와 같은 마을에서 함께 지어요</p>
      <label class="lobby-label">내 이름 <span class="lobby-hint">(8글자까지)</span></label>
      <input class="lobby-input lobby-nick" type="text" maxlength="8" autocomplete="nickname" placeholder="예: 아들" value="${escapeAttr(nick0)}" />
      <label class="lobby-label">내 색</label>
      <div class="lobby-colors"></div>
      <label class="lobby-label">마을 코드 <span class="lobby-hint">(숫자 6자리)</span></label>
      <input class="lobby-input lobby-code" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="예: 482913" value="${escapeAttr(code0)}" />
      <button class="overlay-btn lobby-join">마을에 들어가기</button>
      <button class="overlay-help lobby-create">새 마을 만들기</button>
      <p class="lobby-status" hidden></p>
      <p class="lobby-error" hidden></p>
    </div>`;
  root.appendChild(el);
  const q = <T extends HTMLElement>(sel: string) => el.querySelector(sel) as T;
  const nickEl = q<HTMLInputElement>('.lobby-nick');
  const codeEl = q<HTMLInputElement>('.lobby-code');
  const colorsEl = q<HTMLElement>('.lobby-colors');
  const joinBtn = q<HTMLButtonElement>('.lobby-join');
  const createBtn = q<HTMLButtonElement>('.lobby-create');
  const statusEl = q<HTMLElement>('.lobby-status');
  const errorEl = q<HTMLElement>('.lobby-error');

  let color = color0;
  const swatches: HTMLButtonElement[] = [];
  PLAYER_COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lobby-swatch' + (i === color ? ' selected' : '');
    b.style.background = colorCss(i);
    b.title = c.name;
    b.setAttribute('aria-label', c.name);
    b.addEventListener('click', () => {
      color = i;
      swatches.forEach((s, j) => s.classList.toggle('selected', j === i));
    });
    colorsEl.appendChild(b);
    swatches.push(b);
  });
  codeEl.addEventListener('input', () => (codeEl.value = codeEl.value.replace(/\D/g, '').slice(0, 6)));

  let resolveChoice: ((c: LobbyChoice) => void) | null = null;
  const setBusy = (busy: boolean) => {
    joinBtn.disabled = busy;
    createBtn.disabled = busy;
    nickEl.disabled = busy;
    codeEl.disabled = busy;
  };
  const submit = (create: boolean) => {
    errorEl.hidden = true;
    const nick = nickEl.value.trim();
    if (!nick) {
      errorEl.textContent = '이름을 적어 주세요';
      errorEl.hidden = false;
      nickEl.focus();
      return;
    }
    const code = codeEl.value.trim();
    if (!create && !VILLAGE_CODE_RE.test(code)) {
      errorEl.textContent = '마을 코드는 숫자 6자리예요';
      errorEl.hidden = false;
      codeEl.focus();
      return;
    }
    remember(KEY_NICK, nick);
    remember(KEY_COLOR, String(color));
    if (!create) remember(KEY_CODE, code);
    setBusy(true);
    resolveChoice?.({ nick, color, code: create ? null : code });
    resolveChoice = null;
  };
  joinBtn.addEventListener('click', () => submit(false));
  createBtn.addEventListener('click', () => submit(true));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !joinBtn.disabled) submit(false);
  });
  if (!nick0) nickEl.focus();

  return {
    waitChoice: () =>
      new Promise<LobbyChoice>((resolve) => {
        setBusy(false);
        resolveChoice = resolve;
      }),
    setStatus(msg) {
      statusEl.textContent = msg;
      statusEl.hidden = !msg;
    },
    setError(msg) {
      statusEl.hidden = true;
      errorEl.textContent = msg;
      errorEl.hidden = !msg;
      setBusy(false);
    },
    blockWith(html) {
      setBusy(true);
      statusEl.hidden = true;
      errorEl.innerHTML = html;
      errorEl.hidden = false;
    },
    close() {
      el.remove();
    },
  };
}

/** 코드 공유용 링크 */
export function inviteLink(code: string): string {
  const u = new URL(location.href);
  u.search = `?code=${code}`;
  u.hash = '';
  return u.toString();
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
