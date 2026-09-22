/**
 * 상자 창 (결정 #84): 위는 상자 칸(혼자 27칸 / 큰 상자 54칸), 아래는 내 가방.
 * 칸을 탭해서 고르고 다른 칸을 탭하면 옮긴다 (가방 창과 같은 방식). 서버가 진실 — 옮기기는 요청만 보낸다.
 */
import { BIG_CHEST_SLOTS, HOTBAR_SLOTS, INV_SLOTS, type Inventory } from '@dragon-village/shared';

export interface ChestDeps {
  icon(id: string, size: number): HTMLCanvasElement | null;
  nameOf(id: string): string;
  /** from·to 는 이어 붙인 번호 (0~상자칸−1 상자, 그다음 가방) */
  onMove(from: number, to: number, count: number): void;
  onClose(): void;
}

export class ChestView {
  readonly el: HTMLElement;
  /** 열려 있는 상자 자리 (대표 칸). 없으면 안 열린 것 */
  private at: { x: number; y: number; z: number } | null = null;
  private chest: Inventory = [];
  private bag: Inventory = new Array(INV_SLOTS).fill(null);
  private selected = -1;
  private half = false;
  private readonly title: HTMLElement;
  private readonly chestGrid: HTMLElement;
  private readonly bagGrid: HTMLElement;
  private readonly halfBtn: HTMLButtonElement;

  constructor(
    root: HTMLElement,
    private readonly deps: ChestDeps,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'bag-panel chest-panel';
    this.el.hidden = true;
    this.el.innerHTML = `
      <div class="bag-card chest-card">
        <div class="bag-head">
          <div class="chest-title">상자</div>
          <button class="plain-btn chest-half">반만 옮기기: 꺼짐</button>
          <button class="plain-btn chest-close" aria-label="닫기">✕</button>
        </div>
        <div class="chest-body">
          <div class="chest-grid"></div>
          <div class="chest-label">내 가방</div>
          <div class="chest-bag"></div>
        </div>
      </div>`;
    root.appendChild(this.el);
    this.title = this.el.querySelector('.chest-title')!;
    this.chestGrid = this.el.querySelector('.chest-grid')!;
    this.bagGrid = this.el.querySelector('.chest-bag')!;
    this.halfBtn = this.el.querySelector('.chest-half')!;
    this.el.querySelector('.chest-close')!.addEventListener('click', () => deps.onClose());
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) deps.onClose();
    });
    this.halfBtn.addEventListener('click', () => {
      this.half = !this.half;
      this.halfBtn.textContent = `반만 옮기기: ${this.half ? '켜짐' : '꺼짐'}`;
      this.halfBtn.classList.toggle('on', this.half);
    });
  }

  get visible(): boolean {
    return !this.el.hidden;
  }

  /** 지금 열려 있는 상자 자리 */
  get position(): { x: number; y: number; z: number } | null {
    return this.at;
  }

  /** 서버가 보낸 상자 속 (열 때·옮길 때마다) */
  setChest(x: number, y: number, z: number, slots: Inventory): void {
    const moved = !this.at || this.at.x !== x || this.at.y !== y || this.at.z !== z;
    this.at = { x, y, z };
    this.chest = slots;
    if (moved) this.selected = -1;
    this.el.hidden = false;
    this.render();
  }

  setInventory(inv: Inventory): void {
    this.bag = inv;
    if (this.visible) this.render();
  }

  hide(): void {
    this.el.hidden = true;
    this.at = null;
    this.selected = -1;
  }

  private cell(index: number, slot: Inventory[number], hot: boolean): HTMLElement {
    const c = document.createElement('button');
    c.className = 'bag-cell' + (hot ? ' hot' : '') + (index === this.selected ? ' selected' : '');
    c.title = slot ? `${this.deps.nameOf(slot.item)} ×${slot.count}` : '';
    if (slot) {
      const icon = this.deps.icon(slot.item, 36);
      if (icon) c.appendChild(icon);
      if (slot.count > 1) {
        const n = document.createElement('span');
        n.className = 'bag-count';
        n.textContent = String(slot.count);
        c.appendChild(n);
      }
    }
    c.addEventListener('click', () => this.tap(index));
    return c;
  }

  private render(): void {
    const big = this.chest.length === BIG_CHEST_SLOTS;
    this.title.textContent = `${big ? '큰 상자' : '상자'} (${this.chest.filter(Boolean).length}/${this.chest.length}칸 참)`;
    this.chestGrid.innerHTML = '';
    this.chestGrid.classList.toggle('big', big);
    for (let i = 0; i < this.chest.length; i++) this.chestGrid.appendChild(this.cell(i, this.chest[i]!, false));
    this.bagGrid.innerHTML = '';
    const n = this.chest.length;
    for (let i = 0; i < INV_SLOTS; i++) this.bagGrid.appendChild(this.cell(n + i, this.bag[i]!, i < HOTBAR_SLOTS));
  }

  private slotAt(index: number): Inventory[number] {
    const n = this.chest.length;
    return index < n ? this.chest[index]! : (this.bag[index - n] ?? null);
  }

  private tap(index: number): void {
    if (this.selected < 0) {
      if (this.slotAt(index)) this.selected = index;
    } else if (this.selected === index) {
      this.selected = -1;
    } else {
      const from = this.slotAt(this.selected);
      if (from) {
        const count = this.half ? Math.max(1, Math.floor(from.count / 2)) : from.count;
        this.deps.onMove(this.selected, index, count);
      }
      this.selected = -1;
    }
    this.render();
  }
}
