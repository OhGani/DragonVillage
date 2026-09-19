/**
 * 채팅 (규칙 3: 자유 입력 없음). 이모지 + 문구 시트, 왼쪽 위 로그 5줄.
 */
import { EMOTE_EMOJI, EMOTE_PHRASE, type PhraseRegistry } from '@dragon-village/shared';

export class ChatView {
  readonly sheet: HTMLElement;
  readonly log: HTMLElement;
  private readonly lines: string[] = [];
  private hideTimer: number | null = null;

  constructor(
    root: HTMLElement,
    phrases: PhraseRegistry,
    private readonly onSend: (kind: number, id: number) => void,
    private readonly onClose: () => void,
  ) {
    this.sheet = document.createElement('div');
    this.sheet.className = 'chat-panel';
    this.sheet.hidden = true;
    const card = document.createElement('div');
    card.className = 'chat-card';
    const emojis = document.createElement('div');
    emojis.className = 'chat-emojis';
    phrases.emojis.forEach((e, i) => {
      const b = document.createElement('button');
      b.className = 'chat-emoji';
      b.textContent = e;
      b.addEventListener('click', () => this.send(EMOTE_EMOJI, i));
      emojis.appendChild(b);
    });
    const list = document.createElement('div');
    list.className = 'chat-phrases';
    for (const p of phrases.phrases) {
      const b = document.createElement('button');
      b.className = 'chat-phrase';
      b.textContent = p.text;
      b.addEventListener('click', () => this.send(EMOTE_PHRASE, p.id));
      list.appendChild(b);
    }
    const close = document.createElement('button');
    close.className = 'plain-btn chat-close';
    close.textContent = '닫기';
    close.addEventListener('click', () => onClose());
    card.append(emojis, list, close);
    this.sheet.appendChild(card);
    this.sheet.addEventListener('click', (e) => {
      if (e.target === this.sheet) onClose();
    });
    root.appendChild(this.sheet);

    this.log = document.createElement('div');
    this.log.className = 'chat-log';
    this.log.hidden = true;
    root.appendChild(this.log);
  }

  private send(kind: number, id: number): void {
    this.onSend(kind, id);
    this.onClose();
  }

  get visible(): boolean {
    return !this.sheet.hidden;
  }
  show(): void {
    this.sheet.hidden = false;
  }
  hide(): void {
    this.sheet.hidden = true;
  }

  /** 로그에 한 줄 (5줄 유지, 8초 뒤 숨김) */
  add(nick: string, text: string): void {
    this.lines.push(`${nick}: ${text}`);
    if (this.lines.length > 5) this.lines.shift();
    this.log.innerHTML = '';
    for (const l of this.lines) {
      const d = document.createElement('div');
      d.textContent = l;
      this.log.appendChild(d);
    }
    this.log.hidden = false;
    if (this.hideTimer) window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => {
      this.log.hidden = true;
      this.lines.length = 0;
    }, 8000);
  }
}
