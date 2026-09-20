/**
 * 가방 화면 (M4, 결정 #66): 가방 37칸 · 만들기 · 양조기. 아들 6차 스펙의 배치(갑옷·왼손 칸은 자리만).
 * 서버가 진실 — 여기서는 요청만 보내고, 서버가 보낸 InvSlots 로 그림을 고친다.
 * 조작: 칸을 탭해 고르고 다른 칸을 탭하면 옮긴다(합치기·맞바꾸기). "반만" 을 켜면 반을 옮긴다.
 */
import {
  type DragonRegistry,
  type Inventory,
  type PotionRegistry,
  type RecipeDef,
  type RecipeRegistry,
  STACK,
  type Station,
  canCraft,
  craftableTimes,
  isPotionItem,
  missing,
  potionFromItemId,
} from '@dragon-village/shared';
import { HOTBAR_SLOTS, INV_SLOTS } from '@dragon-village/shared';

export interface BagDeps {
  recipes: RecipeRegistry;
  potions: PotionRegistry;
  /** 도감 탭 (M6-2): 드래곤 16종과 내가 얻은 것 */
  dragons: DragonRegistry;
  owned(): ReadonlySet<string>;
  icon(id: string, size: number): HTMLCanvasElement | null;
  nameOf(id: string): string;
  onMove(from: number, to: number, count: number): void;
  onDrop(slot: number, count: number): void;
  onCraft(recipe: string): void;
  onBrew(bottles: number[], ingredient: number): void;
  onClose(): void;
}

/** 근처에 있는 작업대 블록 */
export type Stations = { crafting_table?: boolean; furnace?: boolean; brewing_stand?: boolean };
type Tab = 'bag' | 'craft' | 'brew' | 'codex';

export class BagView {
  readonly el: HTMLElement;
  private inv: Inventory = new Array(INV_SLOTS).fill(null);
  private stations: Stations = {};
  private tab: Tab = 'bag';
  private selected = -1;
  private half = false;
  private confirmDrop = false;
  /** 양조 모드: 고른 병 칸들과 재료 칸 */
  private bottles: number[] = [];
  private ingredient = -1;
  private readonly grid: HTMLElement;
  private readonly side: HTMLElement;
  private readonly tabs: HTMLElement;
  private readonly cells: HTMLElement[] = [];

  constructor(
    root: HTMLElement,
    private readonly deps: BagDeps,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'bag-panel';
    this.el.hidden = true;
    this.el.innerHTML = `
      <div class="bag-card">
        <div class="bag-head">
          <div class="bag-tabs"></div>
          <button class="plain-btn bag-close" aria-label="닫기">✕</button>
        </div>
        <div class="bag-body">
          <div class="bag-grid"></div>
          <div class="bag-side"></div>
        </div>
      </div>`;
    root.appendChild(this.el);
    this.grid = this.el.querySelector('.bag-grid')!;
    this.side = this.el.querySelector('.bag-side')!;
    this.tabs = this.el.querySelector('.bag-tabs')!;
    this.el.querySelector('.bag-close')!.addEventListener('click', () => deps.onClose());
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) deps.onClose();
    });
    for (let i = 0; i < INV_SLOTS; i++) {
      const c = document.createElement('button');
      c.className = 'bag-cell' + (i < HOTBAR_SLOTS ? ' hot' : '');
      c.dataset.slot = String(i);
      c.addEventListener('click', () => this.tapCell(i));
      this.cells.push(c);
    }
    this.renderTabs();
    this.renderGrid();
    this.renderSide();
  }

  get visible(): boolean {
    return !this.el.hidden;
  }
  show(tab: Tab = 'bag'): void {
    this.tab = tab;
    this.selected = -1;
    this.confirmDrop = false;
    this.el.hidden = false;
    this.renderAll();
  }
  hide(): void {
    this.el.hidden = true;
  }

  setInventory(inv: Inventory): void {
    this.inv = inv;
    if (this.visible) this.renderAll();
  }
  /** 근처에 있는 작업대 (제작대·화로·양조기) — 탭이 켜지고 꺼진다 */
  setStations(s: Stations): void {
    const changed = JSON.stringify(s) !== JSON.stringify(this.stations);
    this.stations = s;
    if (this.tab === 'brew' && !s.brewing_stand) this.tab = 'bag';
    if (changed && this.visible) this.renderAll();
  }

  private renderAll(): void {
    this.renderTabs();
    this.renderGrid();
    this.renderSide();
  }

  private renderTabs(): void {
    const tabs: [Tab, string][] = [
      ['bag', '🎒 가방'],
      ['craft', '🔨 만들기'],
    ];
    if (this.stations.brewing_stand) tabs.push(['brew', '⚗️ 양조']);
    tabs.push(['codex', '📖 도감']);
    this.tabs.innerHTML = '';
    for (const [id, label] of tabs) {
      const b = document.createElement('button');
      b.className = 'bag-tab' + (this.tab === id ? ' on' : '');
      b.textContent = label;
      b.addEventListener('click', () => {
        this.tab = id;
        this.selected = -1;
        this.renderAll();
      });
      this.tabs.appendChild(b);
    }
  }

  private renderGrid(): void {
    this.grid.innerHTML = '';
    const hot = document.createElement('div');
    hot.className = 'bag-row hotrow';
    const bag = document.createElement('div');
    bag.className = 'bag-row bagrow';
    for (let i = 0; i < INV_SLOTS; i++) {
      const c = this.cells[i];
      const s = this.inv[i];
      c.innerHTML = '';
      c.classList.toggle('selected', i === this.selected);
      c.classList.toggle('bottle', this.tab === 'brew' && this.bottles.includes(i));
      c.classList.toggle('ingredient', this.tab === 'brew' && this.ingredient === i);
      c.title = s ? `${this.deps.nameOf(s.item)} ×${s.count}` : '';
      if (s) {
        const icon = this.deps.icon(s.item, 36);
        if (icon) c.appendChild(icon);
        if (s.count > 1) {
          const n = document.createElement('span');
          n.className = 'bag-count';
          n.textContent = String(s.count);
          c.appendChild(n);
        }
      }
      (i < HOTBAR_SLOTS ? hot : bag).appendChild(c);
    }
    const lab = document.createElement('div');
    lab.className = 'bag-label';
    lab.textContent = '아래 10칸이 게임 화면의 핫바예요';
    this.grid.append(bag, lab, hot);
  }

  private tapCell(i: number): void {
    const s = this.inv[i];
    if (this.tab === 'brew') {
      // 양조: 물병·물약 칸은 병으로(3개까지), 그 외는 재료로
      if (!s) return;
      if (isPotionItem(s.item)) {
        const k = this.bottles.indexOf(i);
        if (k >= 0) this.bottles.splice(k, 1);
        else if (this.bottles.length < this.deps.potions.stand.bottles) this.bottles.push(i);
      } else this.ingredient = this.ingredient === i ? -1 : i;
      this.renderGrid();
      this.renderSide();
      return;
    }
    this.confirmDrop = false;
    if (this.selected < 0) {
      if (s) this.selected = i;
    } else if (this.selected === i) {
      this.selected = -1;
    } else {
      const from = this.inv[this.selected];
      if (from) {
        const count = this.half ? Math.max(1, Math.floor(from.count / 2)) : from.count;
        this.deps.onMove(this.selected, i, count);
      }
      this.selected = -1;
    }
    this.renderGrid();
    this.renderSide();
  }

  private renderSide(): void {
    this.side.innerHTML = '';
    this.grid.hidden = this.tab === 'codex';
    if (this.tab === 'bag') this.renderBagSide();
    else if (this.tab === 'craft') this.renderCraftSide();
    else if (this.tab === 'codex') this.renderCodex();
    else this.renderBrewSide();
  }

  /** 도감: 드래곤 16종. 얻은 것은 색, 아직이면 회색 + 재료 */
  private renderCodex(): void {
    const owned = this.deps.owned();
    const h = document.createElement('div');
    h.className = 'bag-title';
    h.textContent = `드래곤 도감 ${[...owned].length}/${this.deps.dragons.count}`;
    this.side.appendChild(h);
    const grid = document.createElement('div');
    grid.className = 'codex-grid';
    for (const d of this.deps.dragons.list) {
      const cell = document.createElement('div');
      const has = owned.has(d.id);
      cell.className = 'codex-cell' + (has ? ' on' : '');
      const chip = document.createElement('span');
      chip.className = 'nest-chip';
      chip.style.background = has ? d.color : '#444';
      const name = document.createElement('span');
      name.className = 'codex-name';
      name.textContent = `${d.tier}. ${d.name}`;
      const sub = document.createElement('span');
      sub.className = 'codex-sub';
      sub.textContent = has ? '얻었어요!' : d.recipe.map((r) => `${this.deps.nameOf(r.material)} ${r.count}`).join(' · ');
      cell.append(chip, name, sub);
      grid.appendChild(cell);
    }
    this.side.appendChild(grid);
  }

  private button(label: string, cls: string, onClick: () => void, disabled = false): HTMLButtonElement {
    const b = document.createElement('button');
    b.className = cls;
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  private renderBagSide(): void {
    const s = this.selected >= 0 ? this.inv[this.selected] : null;
    const info = document.createElement('div');
    info.className = 'bag-info';
    info.textContent = s ? `${this.deps.nameOf(s.item)} ×${s.count}` : '칸을 탭해서 고르고, 다른 칸을 탭하면 옮겨요';
    this.side.appendChild(info);
    const half = this.button(this.half ? '반만 옮기기: 켜짐' : '반만 옮기기: 꺼짐', 'plain-btn' + (this.half ? ' on' : ''), () => {
      this.half = !this.half;
      this.renderSide();
    });
    this.side.appendChild(half);
    if (s) {
      const drop = this.button(this.confirmDrop ? '정말 버릴까요? (사라져요)' : '버리기', 'plain-btn danger', () => {
        if (!this.confirmDrop) {
          this.confirmDrop = true;
          this.renderSide();
          return;
        }
        this.deps.onDrop(this.selected, s.count);
        this.selected = -1;
        this.confirmDrop = false;
        this.renderGrid();
        this.renderSide();
      });
      this.side.appendChild(drop);
    }
    const near = (['crafting_table', 'furnace', 'brewing_stand'] as const).filter((k) => this.stations[k]);
    const tip = document.createElement('div');
    tip.className = 'bag-tip';
    tip.textContent = near.length ? `가까이에: ${near.map((k) => this.deps.nameOf(k)).join(', ')}` : '제작대·화로·양조기 가까이 가면 더 만들 수 있어요';
    this.side.appendChild(tip);
  }

  private renderCraftSide(): void {
    const list = document.createElement('div');
    list.className = 'craft-list';
    const stations: Station[] = ['inventory'];
    if (this.stations.crafting_table) stations.push('crafting_table');
    if (this.stations.furnace) stations.push('furnace');
    const recipes: RecipeDef[] = stations.flatMap((st) => this.deps.recipes.forStation(st));
    // 만들 수 있는 것 먼저
    recipes.sort((a, b) => Number(canCraft(this.inv, b)) - Number(canCraft(this.inv, a)));
    for (const r of recipes) {
      const ok = canCraft(this.inv, r);
      const row = document.createElement('div');
      row.className = 'craft-row' + (ok ? '' : ' no');
      const outId = Object.keys(r.out)[0];
      const icon = this.deps.icon(outId, 32);
      if (icon) row.appendChild(icon);
      const text = document.createElement('div');
      text.className = 'craft-text';
      const outCount = r.out[outId];
      const need = Object.entries(r.in)
        .map(([id, n]) => {
          const have = this.inv.reduce((s, c) => (c && c.item === id ? s + c.count : s), 0);
          return `${this.deps.nameOf(id)} ${Math.min(have, n)}/${n}`;
        })
        .join(' · ');
      const miss = ok ? '' : Object.keys(missing(this.inv, r.in)).length ? '' : '';
      text.innerHTML = `<b>${r.name}${outCount > 1 ? ` ×${outCount}` : ''}</b>${r.station !== 'inventory' ? ` <span class="craft-station">${this.deps.nameOf(r.station)}</span>` : ''}<br><span class="craft-need">${need}${miss}</span>`;
      row.appendChild(text);
      const times = craftableTimes(this.inv, r);
      row.appendChild(this.button(ok ? `만들기${times > 1 ? ` (${times}번 가능)` : ''}` : '재료 부족', 'big-btn small', () => this.deps.onCraft(r.id), !ok));
      list.appendChild(row);
    }
    if (recipes.length === 0) list.textContent = '만들 수 있는 것이 없어요';
    this.side.appendChild(list);
  }

  private renderBrewSide(): void {
    const box = document.createElement('div');
    box.className = 'brew-box';
    const stand = this.deps.potions.stand;
    const head = document.createElement('div');
    head.className = 'bag-info';
    head.textContent = `병 ${this.bottles.length}/${stand.bottles} · 재료 ${this.ingredient >= 0 ? this.deps.nameOf(this.inv[this.ingredient]!.item) : '없음'}`;
    box.appendChild(head);
    const tip = document.createElement('div');
    tip.className = 'bag-tip';
    tip.textContent = `가방에서 물병·물약을 탭하면 병 칸(최대 ${stand.bottles}개), 다른 것을 탭하면 재료. 연료: ${this.deps.nameOf(stand.fuel)} 1개 = ${stand.brewsPerFuel}번`;
    box.appendChild(tip);
    const ing = this.ingredient >= 0 ? this.inv[this.ingredient] : null;
    const preview = document.createElement('ul');
    preview.className = 'brew-preview';
    let any = false;
    for (const b of this.bottles) {
      const s = this.inv[b];
      if (!s) continue;
      const state = potionFromItemId(s.item)!;
      const next = ing ? this.deps.potions.brew(state, ing.item) : null;
      const li = document.createElement('li');
      li.textContent = `${this.deps.potions.displayName(state)} → ${next ? this.deps.potions.displayName(next) : ing ? '(아무 일 없음)' : '?'}`;
      if (next) any = true;
      preview.appendChild(li);
    }
    box.appendChild(preview);
    box.appendChild(this.button('양조하기', 'big-btn small', () => this.deps.onBrew([...this.bottles], this.ingredient), !(any && ing && this.bottles.length > 0)));
    this.side.appendChild(box);
  }

  /** 양조 뒤 고른 칸을 비운다 (서버가 새 칸 내용을 보내면 그림은 저절로 바뀐다) */
  clearBrewSelection(): void {
    this.bottles = [];
    this.ingredient = -1;
    if (this.visible) this.renderAll();
  }
}

export { STACK };
