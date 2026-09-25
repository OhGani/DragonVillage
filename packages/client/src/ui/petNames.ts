/**
 * 펫 이름 고르기 (M8-1 4차, #109): 정해진 이름 목록에서 하나를 탭한다. 채팅 시트와 같은 생김새(chat-panel).
 */
export class PetNamePicker {
  private readonly sheet: HTMLElement;
  private readonly title: HTMLElement;
  private mobId: number | null = null;

  constructor(
    root: HTMLElement,
    names: readonly string[],
    private readonly onPick: (mobId: number, name: string) => void,
    /** 닫힐 때 (게임 입력을 다시 켜기 위해) */
    private readonly onClose: () => void = () => {},
  ) {
    this.sheet = document.createElement('div');
    this.sheet.className = 'chat-panel pet-names';
    this.sheet.hidden = true;
    const card = document.createElement('div');
    card.className = 'chat-card';
    this.title = document.createElement('div');
    this.title.className = 'bag-title';
    this.title.textContent = '🐾 이름 고르기';
    const list = document.createElement('div');
    list.className = 'chat-phrases';
    for (const n of names) {
      const b = document.createElement('button');
      b.className = 'chat-phrase';
      b.textContent = n;
      b.addEventListener('click', () => {
        if (this.mobId !== null) this.onPick(this.mobId, n);
        this.hide();
      });
      list.appendChild(b);
    }
    const close = document.createElement('button');
    close.className = 'plain-btn chat-close';
    close.textContent = '닫기';
    close.addEventListener('click', () => this.hide());
    card.append(this.title, list, close);
    this.sheet.appendChild(card);
    this.sheet.addEventListener('click', (e) => {
      if (e.target === this.sheet) this.hide();
    });
    root.appendChild(this.sheet);
  }

  get visible(): boolean {
    return !this.sheet.hidden;
  }

  show(mobId: number, current: string | null): void {
    this.mobId = mobId;
    this.title.textContent = current ? `🐾 ${current} — 다른 이름으로 바꾸기` : '🐾 이름 고르기';
    this.sheet.hidden = false;
  }

  hide(): void {
    if (this.sheet.hidden) return;
    this.sheet.hidden = true;
    this.mobId = null;
    this.onClose();
  }
}
