/**
 * 드래곤 둥지 창 (M6-2): 둥지 안에 서면 카드 → 열기. 자리 4개에 알 놓기, 내 알 부화(레벨 소모), 내 드래곤 목록.
 * 서버가 진실 — 여기서는 요청만 보내고 dragons/nest 메시지로 다시 그린다.
 */
import { type DragonInfo, type DragonRegistry, type Inventory, NEST, type NestSlotInfo, type XpRules, hatchCost, isEggItem, xpProgress } from '@dragon-village/shared';

export interface NestDeps {
  dragons: DragonRegistry;
  xp: XpRules;
  nameOf(id: string): string;
  onPlace(slot: number, item: string): void;
  onHatch(id: number): void;
  onClose(): void;
}

export class NestView {
  readonly el: HTMLElement;
  private inv: Inventory = [];
  private mine: DragonInfo[] = [];
  private slots: NestSlotInfo[] = [];
  private xpTotal = 0;
  private readonly body: HTMLElement;

  constructor(
    root: HTMLElement,
    private readonly deps: NestDeps,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'nest-panel';
    this.el.hidden = true;
    this.el.innerHTML = `
      <div class="help-card nest-card">
        <div class="help-head">
          <h2>🥚 드래곤 둥지</h2>
          <button class="help-close nest-close" aria-label="닫기">✕</button>
        </div>
        <div class="nest-body"></div>
      </div>`;
    root.appendChild(this.el);
    this.body = this.el.querySelector('.nest-body')!;
    this.el.querySelector('.nest-close')!.addEventListener('click', () => deps.onClose());
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) deps.onClose();
    });
  }

  get visible(): boolean {
    return !this.el.hidden;
  }

  show(): void {
    this.el.hidden = false;
    this.render();
  }

  hide(): void {
    this.el.hidden = true;
  }

  setInventory(inv: Inventory): void {
    this.inv = inv;
    if (this.visible) this.render();
  }
  setDragons(list: DragonInfo[]): void {
    this.mine = list;
    if (this.visible) this.render();
  }
  setNest(slots: NestSlotInfo[]): void {
    this.slots = slots;
    if (this.visible) this.render();
  }
  setXp(total: number): void {
    this.xpTotal = total;
    if (this.visible) this.render();
  }

  /** 가방에 있는 알 아이템들 (종류별) */
  private eggsInBag(): { item: string; count: number }[] {
    const m = new Map<string, number>();
    for (const s of this.inv) if (s && isEggItem(s.item)) m.set(s.item, (m.get(s.item) ?? 0) + s.count);
    return [...m].map(([item, count]) => ({ item, count }));
  }

  private render(): void {
    const b = this.body;
    b.innerHTML = '';
    const level = xpProgress(this.xpTotal).level;
    const eggs = this.eggsInBag();

    const head = document.createElement('p');
    head.className = 'nest-note';
    head.textContent = `내 레벨 ${level} · 가방에 알 ${eggs.reduce((n, e) => n + e.count, 0)}개 · 내 드래곤 ${this.mine.filter((d) => d.stage !== 'egg').length}마리`;
    b.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'nest-slots';
    for (let i = 0; i < NEST.slots.length; i++) {
      const cell = document.createElement('div');
      cell.className = 'nest-slot';
      const s = this.slots.find((x) => x.slot === i);
      const title = document.createElement('div');
      title.className = 'nest-slot-title';
      if (!s) {
        title.textContent = `${i + 1}번 자리 — 비었어요`;
        cell.appendChild(title);
        for (const e of eggs) {
          const btn = document.createElement('button');
          btn.className = 'plain-btn nest-btn';
          btn.textContent = `${this.deps.nameOf(e.item)} 놓기${e.count > 1 ? ` (${e.count})` : ''}`;
          btn.addEventListener('click', () => this.deps.onPlace(i, e.item));
          cell.appendChild(btn);
        }
        if (eggs.length === 0) {
          const hint = document.createElement('div');
          hint.className = 'nest-hint';
          hint.textContent = '제작대에서 재료로 알을 만들어 와요';
          cell.appendChild(hint);
        }
      } else {
        const def = this.deps.dragons.find(s.dragon);
        const chip = document.createElement('span');
        chip.className = 'nest-chip';
        chip.style.background = def?.color ?? '#999';
        title.append(chip, document.createTextNode(` ${def?.name ?? s.dragon} 알 — ${s.mine ? '내 것' : `${s.owner} 것`}`));
        cell.appendChild(title);
        if (s.mine && def) {
          const cost = hatchCost(this.deps.xp, def.tier);
          const ok = level >= cost;
          const btn = document.createElement('button');
          btn.className = 'big-btn nest-btn';
          btn.textContent = ok ? `부화하기 (레벨 ${cost} 씀)` : `부화하려면 레벨 ${cost} (지금 ${level})`;
          btn.disabled = !ok;
          btn.addEventListener('click', () => this.deps.onHatch(s.id));
          cell.appendChild(btn);
        }
      }
      grid.appendChild(cell);
    }
    b.appendChild(grid);

    const h3 = document.createElement('h3');
    h3.textContent = '내 드래곤';
    b.appendChild(h3);
    const list = document.createElement('ul');
    list.className = 'nest-list';
    const hatched = this.mine.filter((d) => d.stage !== 'egg');
    if (hatched.length === 0) {
      const li = document.createElement('li');
      li.className = 'nest-hint';
      li.textContent = '아직 없어요. 알을 놓고 부화시켜요!';
      list.appendChild(li);
    }
    for (const d of hatched) {
      const def = this.deps.dragons.find(d.dragon);
      const li = document.createElement('li');
      const chip = document.createElement('span');
      chip.className = 'nest-chip';
      chip.style.background = def?.color ?? '#999';
      li.append(chip, document.createTextNode(` ${def?.name ?? d.dragon} · ${d.stage === 'baby' ? '아기' : '어른'} (티어 ${def?.tier ?? '?'})`));
      list.appendChild(li);
    }
    b.appendChild(list);
    const note = document.createElement('p');
    note.className = 'nest-note';
    note.textContent = '부화한 드래곤이 둥지에서 보이는 것, 먹이·성장·타기는 다음 단계에서 생겨요.';
    b.appendChild(note);
  }
}
