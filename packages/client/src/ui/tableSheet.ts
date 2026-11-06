/**
 * 식탁 창 (아빠 2026-11-06 "식탁 위에 올린 음식 다시 가방에 넣거나 먹을 수 있음"): 액자 넷 — 음식마다 😋 먹기 · 🎒 가방에.
 * 채팅 시트와 같은 생김새(chat-panel). 먹을 것을 들고 식탁을 탭하면 창 없이 바로 올라간다
 */
export class TableSheet {
  private readonly sheet: HTMLElement;
  private readonly list: HTMLElement;
  private at: { x: number; y: number; z: number } | null = null;

  constructor(
    root: HTMLElement,
    private readonly iconOf: (id: string) => HTMLCanvasElement | null,
    private readonly nameOf: (id: string) => string,
    private readonly onEat: (at: { x: number; y: number; z: number }, i: number) => void,
    private readonly onTake: (at: { x: number; y: number; z: number }, i: number) => void,
    private readonly onClose: () => void,
  ) {
    this.sheet = document.createElement('div');
    this.sheet.className = 'chat-panel table-sheet';
    this.sheet.hidden = true;
    const card = document.createElement('div');
    card.className = 'chat-card';
    const title = document.createElement('div');
    title.className = 'bag-title';
    title.textContent = '🍽️ 식탁';
    this.list = document.createElement('div');
    this.list.style.display = 'flex';
    this.list.style.flexDirection = 'column';
    this.list.style.gap = '8px';
    this.list.style.margin = '8px 0';
    const hint = document.createElement('div');
    hint.style.fontSize = '13px';
    hint.style.opacity = '0.8';
    hint.textContent = '먹을 것을 손에 들고 식탁을 탭하면 올라가요 (4개까지)';
    const close = document.createElement('button');
    close.className = 'plain-btn chat-close';
    close.textContent = '닫기';
    close.addEventListener('click', () => this.hide());
    card.append(title, this.list, hint, close);
    this.sheet.appendChild(card);
    this.sheet.addEventListener('click', (e) => {
      if (e.target === this.sheet) this.hide();
    });
    root.appendChild(this.sheet);
  }

  get visible(): boolean {
    return !this.sheet.hidden;
  }

  /** 지금 열린 식탁인가 */
  isAt(x: number, y: number, z: number): boolean {
    return this.visible && this.at !== null && this.at.x === x && this.at.y === y && this.at.z === z;
  }

  show(x: number, y: number, z: number, items: readonly (string | null)[]): void {
    this.at = { x, y, z };
    this.render(items);
    this.sheet.hidden = false;
  }

  /** 서버가 바뀐 걸 알려 주면 다시 그린다 */
  update(items: readonly (string | null)[]): void {
    if (this.visible) this.render(items);
  }

  private render(items: readonly (string | null)[]): void {
    this.list.replaceChildren();
    const at = this.at!;
    items.forEach((id, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      if (!id) {
        row.textContent = '🟫 빈 자리';
        row.style.opacity = '0.6';
        this.list.appendChild(row);
        return;
      }
      const icon = this.iconOf(id);
      if (icon) {
        const img = document.createElement('img');
        img.src = icon.toDataURL();
        img.width = 32;
        img.height = 32;
        img.style.imageRendering = 'pixelated';
        row.appendChild(img);
      }
      const name = document.createElement('span');
      name.textContent = this.nameOf(id);
      name.style.flex = '1';
      const eat = document.createElement('button');
      eat.className = 'chat-phrase';
      eat.textContent = '😋 먹기';
      eat.addEventListener('click', () => this.onEat(at, i));
      const take = document.createElement('button');
      take.className = 'chat-phrase';
      take.textContent = '🎒 가방에';
      take.addEventListener('click', () => this.onTake(at, i));
      row.append(name, eat, take);
      this.list.appendChild(row);
    });
  }

  hide(): void {
    if (this.sheet.hidden) return;
    this.sheet.hidden = true;
    this.at = null;
    this.onClose();
  }
}
