/**
 * 주민 대화 시트 (#172): 주민이 먼저 말하고, 대답 버튼 2~3개 중 하나를 고르면 주민이 답한다. 채팅 시트(chat-panel)와 같은 생김새.
 * 자유 입력은 없다(규칙 3). 대답에 action 이 있으면 onAction 으로 알린다(feed → 들고 있는 걸 준다).
 */
import type { TalkDef, TalkReply, TradeDef, TradeRules } from '@dragon-village/shared';

export class TalkSheet {
  private readonly sheet: HTMLElement;
  private readonly title: HTMLElement;
  private readonly say: HTMLElement;
  private readonly list: HTMLElement;
  private readonly close: HTMLButtonElement;
  private mobId: number | null = null;
  private name = '';
  private trades: TradeRules | null = null;
  /** 지금 가진 에메랄드 (열 때 Game 이 준다) */
  private emeralds = 0;

  constructor(
    root: HTMLElement,
    private readonly onAction: (mobId: number, action: 'feed' | 'tease') => void,
    /** 거래 (#225): 사기/팔기 버튼 */
    private readonly onTrade: (mobId: number, kind: 'buy' | 'sell', item: string) => void,
    private readonly nameOf: (item: string) => string,
    private readonly iconOf: (item: string, size: number) => HTMLCanvasElement | null,
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

  /** 주민 이름·대화로 연다. trades 를 주면 맨 아래 🛒 거래하기 버튼 (#225) */
  show(mobId: number, name: string, talk: TalkDef, trades: TradeRules | null = null, emeralds = 0): void {
    this.mobId = mobId;
    this.name = name;
    this.trades = trades;
    this.emeralds = emeralds;
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
    if (trades) {
      const b = document.createElement('button');
      b.className = 'chat-phrase talk-trade-btn';
      b.textContent = `🛒 거래하기 (💎 ${emeralds})`;
      b.addEventListener('click', () => this.showTrades());
      this.list.appendChild(b);
    }
    this.close.textContent = '다음에 또 봐';
    this.sheet.hidden = false;
  }

  /** 가게 (#225): 사는 것(에메랄드를 낸다) 먼저, 파는 것(에메랄드를 받는다) 다음 */
  private showTrades(): void {
    const t = this.trades;
    if (!t || this.mobId === null) return;
    this.title.textContent = `🛒 ${this.name}의 가게 — 💎 ${this.emeralds}`;
    this.say.textContent = '에메랄드로 사고, 모은 걸 팔아. 직업마다 파는 게 달라 — 뭐 할래?';
    this.list.replaceChildren();
    const row = (def: TradeDef) => {
      const b = document.createElement('button');
      b.className = 'chat-phrase talk-trade';
      const icon = this.iconOf(def.item, 28);
      if (icon) {
        icon.className = 'talk-trade-icon';
        b.appendChild(icon);
      }
      const text = document.createElement('span');
      text.textContent = def.kind === 'buy' ? `${this.nameOf(def.item)} ${def.count}개 사기 — 💎 ${def.price}` : `${this.nameOf(def.item)} ${def.count}개 팔기 → 💎 ${def.price}`;
      b.appendChild(text);
      b.addEventListener('click', () => this.onTrade(this.mobId!, def.kind, def.item));
      this.list.appendChild(b);
    };
    const head = (label: string) => {
      const h = document.createElement('div');
      h.className = 'talk-trade-head';
      h.textContent = label;
      this.list.appendChild(h);
    };
    head('사기 (에메랄드를 내요)');
    for (const d of t.buy) row(d);
    head('팔기 (에메랄드를 받아요)');
    for (const d of t.sell) row(d);
    this.close.textContent = '가게 닫기';
  }

  /** 에메랄드가 바뀌면 제목만 갱신 (#225) */
  setEmeralds(n: number): void {
    this.emeralds = n;
    if (!this.sheet.hidden && this.title.textContent?.startsWith('🛒')) this.title.textContent = `🛒 ${this.name}의 가게 — 💎 ${n}`;
  }

  private answer(r: TalkReply): void {
    this.say.textContent = r.answer;
    this.list.replaceChildren();
    if (r.action && this.mobId !== null) this.onAction(this.mobId, r.action);
    this.close.textContent = r.action === 'tease' ? '미안, 농담이야' : '고마워!';
  }

  hide(): void {
    if (this.sheet.hidden) return;
    this.sheet.hidden = true;
    this.mobId = null;
    this.onClose();
  }
}
