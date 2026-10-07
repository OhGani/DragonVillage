/**
 * 가방 화면 (M4, 결정 #66): 가방 37칸 · 만들기 · 양조기. 아들 6차 스펙의 배치(갑옷·왼손 칸은 자리만).
 * 서버가 진실 — 여기서는 요청만 보내고, 서버가 보낸 InvSlots 로 그림을 고친다.
 * 조작: 칸을 탭해 고르고 다른 칸을 탭하면 옮긴다(합치기·맞바꾸기). "반만" 을 켜면 반을 옮긴다.
 */
import {
  type DragonRegistry,
  type Inventory,
  type PotionRegistry,
  type GridCell,
  type RecipeDef,
  type RecipeRegistry,
  STACK,
  type Station,
  canCraft,
  craftableTimes,
  gridLayout,
  isPotionItem,
  matchGrid,
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
  /** 마을 도감에 오른 블록 id (M6-6, 마을 공용) */
  codexBlocks(): ReadonlySet<string>;
  /** 도감 대상 블록 목록 [id, 이름] (내부 변형·공기 제외) */
  codexCandidates(): readonly [string, string][];
  icon(id: string, size: number): HTMLCanvasElement | null;
  nameOf(id: string): string;
  onMove(from: number, to: number, count: number): void;
  onDrop(slot: number, count: number): void;
  onCraft(recipe: string): void;
  onBrew(bottles: number[], ingredient: number): void;
  onClose(): void;
  /** 장비 (M8-2): 지금 입은 것, 아이템이 들어가는 칸, 방어 합, 입기/벗기 요청 */
  equipment(): Readonly<Record<string, string | null>>;
  equipSlotOf(item: string): string | null;
  armorDefense(): number;
  onEquip(slot: number): void;
  onUnequip(part: string): void;
}
const EQUIP_LABEL: Record<string, string> = { helmet: '투구', chestplate: '흉갑', leggings: '레깅스', boots: '부츠', shield: '방패' };

/** 근처에 있는 작업대 블록 */
export type Stations = { crafting_table?: boolean; furnace?: boolean; brewing_stand?: boolean; forge?: boolean };
type Tab = 'bag' | 'craft' | 'brew' | 'book' | 'codex';
/** 📜 조합법 탭의 묶음 순서와 제목 (#133) */
const BOOK_GROUPS: readonly [Station, string][] = [
  ['inventory', '🎒 가방에서 (2×2) — 언제나'],
  ['crafting_table', '🔨 제작대 옆에서 (3×3)'],
  ['forge', '⚒️ 대장간 옆에서'],
  ['furnace', '🔥 화로 옆에서'],
  ['world', '🌍 놓아서 생기는 것 (만들기 아님)'],
];

export class BagView {
  readonly el: HTMLElement;
  private inv: Inventory = new Array(INV_SLOTS).fill(null);
  private stations: Stations = {};
  private tab: Tab = 'bag';
  /** 마지막으로 그린 탭. 같은 탭을 다시 그릴 때만 스크롤 자리를 되돌린다 */
  private drawnTab: Tab | null = null;
  private selected = -1;
  private half = false;
  private confirmDrop = false;
  /** 양조 모드: 고른 병 칸들과 재료 칸 */
  private bottles: number[] = [];
  private ingredient = -1;
  /**
   * 제작 격자 (#132, 마인크래프트 제작대와 같게): 가방 2×2 또는 제작대·대장간 옆 3×3. 가방 물건을 "놓아 둔" 것처럼 보이지만
   * 실제로는 만들기를 누를 때 서버가 가방에서 뺀다(서버가 진실). ghost 는 조합법 책에서 고른 모양 중 가방에 없는 재료
   */
  private craftCells: GridCell[] = new Array(9).fill(null);
  private craftGhost: (string | null)[] = new Array(9).fill(null);
  private craftWidth = 0;
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
    this.drawnTab = null; // 새로 열 때는 맨 위부터
    this.clearCraftGrid();
    this.el.hidden = false;
    this.renderAll();
  }
  hide(): void {
    this.el.hidden = true;
    this.clearCraftGrid();
  }

  setInventory(inv: Inventory): void {
    this.inv = inv;
    this.clampCraftGrid();
    if (this.visible) this.renderAll();
  }

  // ---------------------------------------------------------------- 제작 격자 (#132)

  /** 지금 격자 크기: 제작대·대장간 옆이면 3, 아니면 가방 2×2 */
  private craftW(): number {
    return this.stations.crafting_table || this.stations.forge ? 3 : 2;
  }
  private clearCraftGrid(): void {
    this.craftCells.fill(null);
    this.craftGhost.fill(null);
  }
  /** 가방에 있는 개수에서 격자에 놓아 둔 것을 뺀 나머지 */
  private craftAvailable(item: string): number {
    let have = 0;
    for (const s of this.inv) if (s && s.item === item) have += s.count;
    for (const c of this.craftCells) if (c && c.item === item) have -= c.count;
    return have;
  }
  /** 가방이 바뀌었으면(만들었거나 버렸거나) 격자에 놓아 둔 개수를 가방에 맞게 줄인다 */
  private clampCraftGrid(): void {
    const have: Record<string, number> = {};
    for (const s of this.inv) if (s) have[s.item] = (have[s.item] ?? 0) + s.count;
    for (let i = 0; i < this.craftCells.length; i++) {
      const c = this.craftCells[i];
      if (!c) continue;
      const left = have[c.item] ?? 0;
      const take = Math.min(c.count, left);
      have[c.item] = left - take;
      this.craftCells[i] = take > 0 ? { item: c.item, count: take } : null;
    }
  }
  /** 조합법 책에서 고른 레시피를 격자에 채운다. 가방에 없는 재료는 ghost(흐리게)로 */
  private fillCraftGrid(r: RecipeDef): void {
    const w = this.craftW();
    const layout = gridLayout(r, w);
    this.clearCraftGrid();
    if (!layout) return;
    for (let i = 0; i < layout.length; i++) {
      const item = layout[i];
      if (!item) continue;
      if (this.craftAvailable(item) > 0) this.craftCells[i] = { item, count: 1 };
      else this.craftGhost[i] = item;
    }
  }
  /** 격자 칸 탭: 고른 가방 물건이 있으면 하나 놓고, 없으면 그 칸을 비운다(물건은 가방에 그대로) */
  private tapCraftCell(i: number): void {
    const sel = this.selected >= 0 ? this.inv[this.selected] : null;
    const cur = this.craftCells[i];
    if (sel && (!cur || cur.item === sel.item)) {
      if (this.craftAvailable(sel.item) > 0) {
        this.craftCells[i] = { item: sel.item, count: (cur?.count ?? 0) + 1 };
        this.craftGhost[i] = null;
      }
    } else if (cur) {
      this.craftCells[i] = null;
    } else if (this.craftGhost[i] && this.craftAvailable(this.craftGhost[i]!) > 0) {
      this.craftCells[i] = { item: this.craftGhost[i]!, count: 1 };
      this.craftGhost[i] = null;
    }
    this.renderGrid();
    this.renderSide();
  }
  /** 격자에 맞는 레시피 (근처 작업대에서 만들 수 있는 것 중) */
  private craftMatch(recipes: readonly RecipeDef[]): RecipeDef | null {
    const w = this.craftW();
    return matchGrid(recipes, this.craftCells.slice(0, w * w), w);
  }
  /** 장비가 바뀌었다 (M8-2) — 열려 있으면 다시 그린다 */
  refresh(): void {
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
    tabs.push(['book', '📜 조합법']);
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
    if (this.tab === 'craft') {
      // 만들기 탭에서는 가방 칸은 고르기만 (옮기기는 가방 탭에서). 고른 채로 격자 칸을 탭하면 하나씩 놓인다 (#132)
      this.selected = this.selected === i ? -1 : s ? i : this.selected;
      this.renderGrid();
      this.renderSide();
      return;
    }
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

  /**
   * 오른쪽 칸을 다시 그린다. 만들기·도감처럼 긴 목록은 **보던 자리에 그대로 있게** 스크롤을 되돌린다
   * (아빠 2026-09-22: 만들기 버튼을 누르면 맨 위로 튀어 올라갔다).
   * 스크롤되는 곳이 둘이다 — 폰에서는 카드 전체, 넓은 화면에서는 목록. 둘 다 챙긴다.
   */
  private renderSide(): void {
    const card = this.el.querySelector<HTMLElement>('.bag-card');
    const keep = this.drawnTab === this.tab;
    const cardTop = keep ? (card?.scrollTop ?? 0) : 0;
    const listTop = keep ? (this.side.querySelector<HTMLElement>('.craft-list, .codex-grid, .book-list')?.scrollTop ?? 0) : 0;

    this.side.innerHTML = '';
    this.grid.hidden = this.tab === 'codex' || this.tab === 'book';
    if (this.tab === 'bag') this.renderBagSide();
    else if (this.tab === 'craft') this.renderCraftSide();
    else if (this.tab === 'book') this.renderBook();
    else if (this.tab === 'codex') this.renderCodex();
    else this.renderBrewSide();
    this.drawnTab = this.tab;

    // 내용이 다시 채워진 뒤에 되돌려야 한다 (빈 동안은 브라우저가 0 으로 깎는다)
    const list = this.side.querySelector<HTMLElement>('.craft-list, .codex-grid, .book-list');
    if (list && listTop > 0) list.scrollTop = listTop;
    if (card && cardTop > 0) card.scrollTop = cardTop;
  }

  /** 이 레시피의 작업대가 지금 옆에 있나 (가방은 언제나) */
  private stationNear(st: Station): boolean {
    return st === 'inventory' || (st === 'crafting_table' && !!this.stations.crafting_table) || (st === 'forge' && !!this.stations.forge) || (st === 'furnace' && !!this.stations.furnace);
  }

  /** 모양 축소판 (#133): 3×3(가방은 2×2) 작은 칸에 재료 아이콘. 모양 없는 조합은 재료를 순서대로 */
  private patternThumb(r: RecipeDef): HTMLElement | null {
    const w = r.station === 'inventory' ? 2 : 3;
    const layout = gridLayout(r, w);
    if (!layout) return null;
    const box = document.createElement('div');
    box.className = 'pattern-thumb';
    box.style.gridTemplateColumns = `repeat(${w}, 18px)`;
    for (const id of layout) {
      const cell = document.createElement('span');
      if (id) {
        const icon = this.deps.icon(id, 16);
        if (icon) cell.appendChild(icon);
        cell.title = this.deps.nameOf(id);
      }
      box.appendChild(cell);
    }
    return box;
  }

  /**
   * 📜 조합법 (#133, 아빠 2026-10-07 "만들 수 있는 모든 레시피를 게임에서 볼 수 있게"): v1 레시피 전부를 작업대별로.
   * 줄마다 결과·재료·모양 축소판. 작업대가 옆에 있고 재료도 있으면 "만들기", 작업대가 옆에 있으면 탭해서 🔨 격자에 채우기
   */
  private renderBook(): void {
    const all = this.deps.recipes.craftable().concat(this.deps.recipes.forStation('world'));
    const h = document.createElement('div');
    h.className = 'bag-title';
    h.textContent = `📜 조합법 ${all.length}개`;
    this.side.appendChild(h);
    const tip = document.createElement('div');
    tip.className = 'bag-tip';
    tip.textContent = '초록 줄은 지금 만들 수 있는 것. 작업대 옆에서 줄을 탭하면 🔨 격자에 모양대로 채워져요';
    this.side.appendChild(tip);
    const list = document.createElement('div');
    list.className = 'book-list';
    for (const [st, title] of BOOK_GROUPS) {
      const rows = all.filter((r) => r.station === st);
      if (rows.length === 0) continue;
      const head = document.createElement('div');
      head.className = 'book-head';
      head.textContent = `${title} · ${rows.length}`;
      list.appendChild(head);
      for (const r of rows) list.appendChild(this.bookRow(r));
    }
    this.side.appendChild(list);
  }

  private bookRow(r: RecipeDef): HTMLElement {
    const near = this.stationNear(r.station);
    const ok = r.station !== 'world' && near && canCraft(this.inv, r);
    const row = document.createElement('div');
    row.className = 'craft-row book-row' + (ok ? ' ok' : near || r.station === 'world' ? '' : ' far');
    const outId = Object.keys(r.out)[0]!;
    const icon = this.deps.icon(outId, 32);
    if (icon) row.appendChild(icon);
    const text = document.createElement('div');
    text.className = 'craft-text';
    const outCount = r.out[outId]!;
    const need = Object.entries(r.in)
      .map(([id, n]) => `${this.deps.nameOf(id)} ${n}`)
      .join(' + ');
    text.innerHTML = `<b>${r.name}${outCount > 1 ? ` ×${outCount}` : ''}</b><br><span class="craft-need">${need}</span>`;
    row.appendChild(text);
    const thumb = this.patternThumb(r);
    if (thumb) row.appendChild(thumb);
    if (r.station !== 'world') {
      if (near) {
        row.title = '탭하면 🔨 격자에 모양대로 채워요';
        row.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          this.tab = 'craft';
          this.selected = -1;
          this.fillCraftGrid(r);
          this.renderAll();
        });
        if (ok) row.appendChild(this.button('만들기', 'big-btn small', () => this.deps.onCraft(r.id)));
      } else {
        const where = document.createElement('span');
        where.className = 'craft-station';
        where.textContent = `${this.deps.nameOf(r.station)} 옆에서`;
        row.appendChild(where);
      }
    }
    return row;
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

    // 블록 도감 (M6-6): 마을 사람 누구든 처음 손에 넣은 블록. 10종마다 마을 레벨 +1
    const found = this.deps.codexBlocks();
    const all = this.deps.codexCandidates();
    const h2 = document.createElement('div');
    h2.className = 'bag-title';
    h2.textContent = `블록 도감 ${found.size}/${all.length} (마을 공용 · 10종마다 마을 레벨 +1)`;
    this.side.appendChild(h2);
    const blocks = document.createElement('div');
    blocks.className = 'codex-blocks';
    for (const [id, label] of all) {
      const has = found.has(id);
      const cell = document.createElement('div');
      cell.className = 'codex-block' + (has ? ' on' : '');
      const icon = this.deps.icon(id, 24);
      if (icon) cell.appendChild(icon);
      const n = document.createElement('span');
      n.textContent = has ? label : '???';
      cell.appendChild(n);
      blocks.appendChild(cell);
    }
    this.side.appendChild(blocks);
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
      const part = this.deps.equipSlotOf(s.item);
      if (part) {
        const wear = this.button(part === 'shield' ? '🛡️ 방패 들기' : `🛡️ 입기 (${EQUIP_LABEL[part]})`, 'big-btn small', () => {
          this.deps.onEquip(this.selected);
          this.selected = -1;
          this.renderGrid();
          this.renderSide();
        });
        this.side.appendChild(wear);
      }
    }
    // 장비 칸 (M8-2): 투구·흉갑·레깅스·부츠·방패 + 방어 합
    const eq = this.deps.equipment();
    const box = document.createElement('div');
    box.className = 'equip-box';
    const title = document.createElement('div');
    title.className = 'bag-title';
    const def = this.deps.armorDefense();
    title.textContent = `🛡️ 장비${def > 0 ? ` · 방어 ${def}` : ''}`;
    box.appendChild(title);
    for (const part of ['helmet', 'chestplate', 'leggings', 'boots', 'shield']) {
      const row = document.createElement('div');
      row.className = 'equip-row';
      const label = document.createElement('span');
      label.className = 'equip-label';
      label.textContent = EQUIP_LABEL[part] ?? part;
      row.appendChild(label);
      const item = eq[part] ?? null;
      if (item) {
        const icon = this.deps.icon(item, 24);
        if (icon) row.appendChild(icon);
      }
      const name = document.createElement('span');
      name.className = 'equip-name' + (item ? '' : ' none');
      name.textContent = item ? this.deps.nameOf(item) : '비었어요';
      row.appendChild(name);
      if (item) row.appendChild(this.button('벗기', 'plain-btn', () => this.deps.onUnequip(part)));
      box.appendChild(row);
    }
    this.side.appendChild(box);
    const near = (['crafting_table', 'furnace', 'brewing_stand', 'forge'] as const).filter((k) => this.stations[k]);
    const tip = document.createElement('div');
    tip.className = 'bag-tip';
    tip.textContent = near.length ? `가까이에: ${near.map((k) => this.deps.nameOf(k)).join(', ')}` : '제작대·화로·양조기 가까이 가면 더 만들 수 있어요';
    this.side.appendChild(tip);
  }

  private renderCraftSide(): void {
    const stations: Station[] = ['inventory'];
    if (this.stations.crafting_table) stations.push('crafting_table');
    if (this.stations.furnace) stations.push('furnace');
    if (this.stations.forge) stations.push('forge');
    const recipes: RecipeDef[] = stations.flatMap((st) => this.deps.recipes.forStation(st));
    this.renderCraftGrid(recipes);
    const list = document.createElement('div');
    list.className = 'craft-list';
    // 만들 수 있는 것 먼저
    recipes.sort((a, b) => Number(canCraft(this.inv, b)) - Number(canCraft(this.inv, a)));
    for (const r of recipes) {
      const ok = canCraft(this.inv, r);
      const row = document.createElement('div');
      row.className = 'craft-row' + (ok ? '' : ' no');
      row.title = '탭하면 격자에 모양대로 채워요';
      row.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('button')) return; // 만들기 버튼은 따로
        this.fillCraftGrid(r);
        this.renderGrid();
        this.renderSide();
      });
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

  /** 제작 격자 + 결과 칸 (#132): 마인크래프트 제작대 화면처럼 격자 → 화살표 → 결과 */
  private renderCraftGrid(recipes: readonly RecipeDef[]): void {
    const w = this.craftW();
    if (w !== this.craftWidth) {
      this.craftWidth = w;
      this.clearCraftGrid();
    }
    const area = document.createElement('div');
    area.className = 'craft-area';
    const grid = document.createElement('div');
    grid.className = 'craft-grid';
    grid.style.gridTemplateColumns = `repeat(${w}, 42px)`;
    for (let i = 0; i < w * w; i++) {
      const c = document.createElement('button');
      const cell = this.craftCells[i];
      const ghost = cell ? null : this.craftGhost[i];
      c.className = 'bag-cell craft-cell' + (ghost ? ' ghost' : '');
      c.title = cell ? `${this.deps.nameOf(cell.item)} ×${cell.count}` : ghost ? `${this.deps.nameOf(ghost)} (가방에 없어요)` : '';
      const shown = cell?.item ?? ghost;
      if (shown) {
        const icon = this.deps.icon(shown, 36);
        if (icon) c.appendChild(icon);
        if (cell && cell.count > 1) {
          const n = document.createElement('span');
          n.className = 'bag-count';
          n.textContent = String(cell.count);
          c.appendChild(n);
        }
      }
      c.addEventListener('click', () => this.tapCraftCell(i));
      grid.appendChild(c);
    }
    area.appendChild(grid);
    const arrow = document.createElement('div');
    arrow.className = 'craft-arrow';
    arrow.textContent = '➜';
    area.appendChild(arrow);
    const match = this.craftMatch(recipes);
    const result = document.createElement('button');
    result.className = 'bag-cell craft-result' + (match ? ' ok' : '');
    if (match) {
      const outId = Object.keys(match.out)[0]!;
      const icon = this.deps.icon(outId, 36);
      if (icon) result.appendChild(icon);
      const n = match.out[outId]!;
      if (n > 1) {
        const cnt = document.createElement('span');
        cnt.className = 'bag-count';
        cnt.textContent = String(n);
        result.appendChild(cnt);
      }
      result.title = `${match.name} 만들기`;
      result.addEventListener('click', () => {
        this.deps.onCraft(match.id);
        // 격자에서 칸마다 하나씩 쓴 것으로 (서버가 가방에서 빼면 clamp 로 한 번 더 맞춘다)
        for (let i = 0; i < this.craftCells.length; i++) {
          const c = this.craftCells[i];
          if (c) this.craftCells[i] = c.count > 1 ? { item: c.item, count: c.count - 1 } : null;
        }
        this.renderGrid();
        this.renderSide();
      });
    } else {
      result.disabled = true;
      result.title = '격자에 재료를 모양대로 놓으면 여기에 결과가 나와요';
    }
    area.appendChild(result);
    const name = document.createElement('div');
    name.className = 'craft-result-name';
    name.textContent = match ? `${match.name} — 탭해서 만들기` : this.craftCells.some(Boolean) ? '이 모양으로는 아무것도 안 돼요' : w === 3 ? '제작대 3×3' : '가방 2×2 (제작대 옆에서는 3×3)';
    area.appendChild(name);
    if (this.craftCells.some(Boolean) || this.craftGhost.some(Boolean)) {
      area.appendChild(
        this.button('비우기', 'plain-btn craft-clear', () => {
          this.clearCraftGrid();
          this.renderGrid();
          this.renderSide();
        }),
      );
    }
    this.side.appendChild(area);
    const hint = document.createElement('div');
    hint.className = 'bag-tip';
    hint.textContent = this.selected >= 0 && this.inv[this.selected] ? `${this.deps.nameOf(this.inv[this.selected]!.item)} 을(를) 골랐어요 — 격자 칸을 탭하면 하나씩 놓여요` : '가방 칸을 탭해 고르고 격자에 놓거나, 아래 조합법을 탭하면 모양대로 채워져요';
    this.side.appendChild(hint);
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
