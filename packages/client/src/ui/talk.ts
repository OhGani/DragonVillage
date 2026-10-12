/**
 * 주민 대화 시트 (#172): 주민이 먼저 말하고, 대답 버튼 2~3개 중 하나를 고르면 주민이 답한다. 채팅 시트(chat-panel)와 같은 생김새.
 * 자유 입력은 없다(규칙 3). 대답에 action 이 있으면 onAction 으로 알린다(feed → 들고 있는 걸 준다).
 */
import type { TalkDef, TalkReply } from '@dragon-village/shared';

export class TalkSheet {
  private readonly sheet: HTMLElement;
  private readonly title: HTMLElement;
  private readonly say: HTMLElement;
  private readonly list: HTMLElement;
  private readonly close: HTMLButtonElement;
  private mobId: number | null = null;

  constructor(
    root: HTMLElement,
    private readonly onAction: (mobId: number, action: 'feed') => void,
    /** 닫힐 때 (게임 입력을 다시 켜기 위해) */
    private readonly onClose: () => void = () => {},
  ) {
    this.sheet = document.createElement('div');
    this.sheet.className = 'chat-panel talk-sheet';
    this.sheet.hidden = true;
    const card = document.createElement('div');
    card.className = 'chat-card';
    this.title = document.createElement('div');
    this.title.className = 'bag-title';
    this.say = document.createElement('p');
    this.say.className = 'talk-say';
    this.list = document.createElement('div');
    this.list.className = 'chat-phrases talk-replies';
    this.close = document.createElement('button');
    this.close.className = 'plain-btn chat-close';
    this.close.textContent = '다음에 또 봐';
    this.close.addEventListener('click', () => this.hide());
    card.append(this.title, this.say, this.list, this.close);
    this.sheet.appendChild(card);
    this.sheet.addEventListener('click', (e) => {
      if (e.target === this.sheet) this.hide();
    });
    root.appendChild(this.sheet);
  }

  get visible(): boolean {
    return !this.sheet.hidden;
  }

  /** 주민 이름·대화로 연다 */
  show(mobId: number, name: string, talk: TalkDef): void {
    this.mobId = mobId;
    this.title.textContent = `🧑‍🌾 ${name}`;
    this.say.textContent = talk.say;
    this.list.replaceChildren();
    for (const r of talk.replies) {
      const b = document.createElement('button');
      b.className = 'chat-phrase';
      b.textContent = r.text;
      b.addEventListener('click', () => this.answer(r));
      this.list.appendChild(b);
    }
    this.close.textContent = '다음에 또 봐';
    this.sheet.hidden = false;
  }

  private answer(r: TalkReply): void {
    this.say.textContent = r.answer;
    this.list.replaceChildren();
    if (r.action && this.mobId !== null) this.onAction(this.mobId, r.action);
    this.close.textContent = '고마워!';
  }

  hide(): void {
    if (this.sheet.hidden) return;
    this.sheet.hidden = true;
    this.mobId = null;
    this.onClose();
  }
}
