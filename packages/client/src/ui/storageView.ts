/**
 * 마을 창고 창 (M6-6): 창고 건물 옆에서 연다. 두 탭 —
 *  📦 창고: 마을 공유 재고 ↔ 내 가방 넣기/꺼내기 (개인 기여도 표 없음, DESIGN 6절)
 *  🏗️ 건물: buildings.json 의 건물을 창고 재료로 짓는다. 지어진 것·모자란 재료가 한눈에
 * 서버가 진실 — 여기서는 요청만 보내고 storage/village 메시지로 다시 그린다.
 */
import { type BuildingDef, type BuildingRegistry, type Inventory, PREBUILT, missingCost, siteOf } from '@dragon-village/shared';

export interface StorageDeps {
  buildings: BuildingRegistry;
  icon(id: string, size: number): HTMLCanvasElement | null;
  nameOf(id: string): string;
  /** dir 'in' = 가방 → 창고, 'out' = 창고 → 가방 */
  onMove(item: string, count: number, dir: 'in' | 'out'): void;
  onBuild(id: string): void;
  onClose(): void;
}

type Tab = 'stock' | 'build';

export class StorageView {
  readonly el: HTMLElement;
  private inv: Inventory = [];
  private stock = new Map<string, number>();
  private built = new Set<string>();
  private level = 1;
  private codexCount = 0;
  private tab: Tab = 'stock';
  private readonly title: HTMLElement;
  private readonly tabs: HTMLElement;
  private readonly body: HTMLElement;

  constructor(
    root: HTMLElement,
    private readonly deps: StorageDeps,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'bag-panel storage-panel';
    this.el.hidden = true;
    this.el.innerHTML = `
      <div class="bag-card storage-card">
        <div class="bag-head">
          <div class="bag-tabs storage-tabs"></div>
          <button class="plain-btn storage-close" aria-label="닫기">✕</button>
        </div>
        <div class="storage-title"></div>
        <div class="storage-body"></div>
      </div>`;
    root.appendChild(this.el);
    this.title = this.el.querySelector('.storage-title')!;
    this.tabs = this.el.querySelector('.storage-tabs')!;
    this.body = this.el.querySelector('.storage-body')!;
    this.el.querySelector('.storage-close')!.addEventListener('click', () => deps.onClose());
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) deps.onClose();
    });
  }

  get visible(): boolean {
    return !this.el.hidden;
  }
  show(tab: Tab = 'stock'): void {
    this.tab = tab;
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
  /** 서버의 storage 메시지 */
  setStorage(items: { item: string; count: number }[]): void {
    this.stock = new Map(items.map((i) => [i.item, i.count]));
    if (this.visible) this.render();
  }
  /** 서버의 village 메시지 (지어진 건물·레벨·도감 수) */
  setVillage(built: string[], level: number, codexCount: number): void {
    this.built = new Set(built);
    this.level = level;
    this.codexCount = codexCount;
    if (this.visible) this.render();
  }

  private mine(item: string): number {
    let n = 0;
    for (const s of this.inv) if (s && s.item === item) n += s.count;
    return n;
  }

  private render(): void {
    // 다시 그려도 보던 자리 그대로 (가방 창과 같은 이유)
    const keep = this.body.querySelector<HTMLElement>('.storage-list')?.scrollTop ?? 0;
    this.tabs.innerHTML = '';
    const tabs: [Tab, string][] = [
      ['stock', '📦 창고'],
      ['build', '🏗️ 건물'],
    ];
    for (const [id, label] of tabs) {
      const b = document.createElement('button');
      b.className = 'bag-tab' + (this.tab === id ? ' on' : '');
      b.textContent = label;
      b.addEventListener('click', () => {
        this.tab = id;
        this.render();
      });
      this.tabs.appendChild(b);
    }
    this.title.textContent = `🏘️ 마을 레벨 ${this.level} · 건물 ${this.built.size}개 · 도감 ${this.codexCount}종`;
    this.body.innerHTML = '';
    if (this.tab === 'stock') this.renderStock();
    else this.renderBuild();
    const list = this.body.querySelector<HTMLElement>('.storage-list');
    if (list && keep > 0) list.scrollTop = keep;
  }

  private btn(label: string, cls: string, onClick: () => void, disabled = false): HTMLButtonElement {
    const b = document.createElement('button');
    b.className = cls;
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  private renderStock(): void {
    const tip = document.createElement('p');
    tip.className = 'bag-tip';
    tip.textContent = '마을 모두가 같이 쓰는 창고예요. 넣은 재료로 건물을 지어요. 누가 얼마나 넣었는지는 세지 않아요.';
    this.body.appendChild(tip);
    // 창고에 있는 것 + 내 가방에 있는 것을 한 표로
    const items = new Set<string>([...this.stock.keys()]);
    for (const s of this.inv) if (s) items.add(s.item);
    const list = document.createElement('div');
    list.className = 'storage-list';
    const sorted = [...items].sort((a, b) => (this.stock.get(b) ?? 0) - (this.stock.get(a) ?? 0) || a.localeCompare(b));
    for (const item of sorted) {
      const have = this.stock.get(item) ?? 0;
      const mine = this.mine(item);
      const row = document.createElement('div');
      row.className = 'storage-row';
      const icon = this.deps.icon(item, 28);
      if (icon) row.appendChild(icon);
      const text = document.createElement('div');
      text.className = 'storage-text';
      text.innerHTML = `<b>${this.deps.nameOf(item)}</b><br><span class="storage-sub">창고 ${have} · 내 가방 ${mine}</span>`;
      row.appendChild(text);
      const acts = document.createElement('div');
      acts.className = 'storage-acts';
      acts.append(
        this.btn('넣기 1', 'plain-btn small', () => this.deps.onMove(item, 1, 'in'), mine < 1),
        this.btn('전부 넣기', 'plain-btn small', () => this.deps.onMove(item, mine, 'in'), mine < 1),
        this.btn('꺼내기 1', 'plain-btn small', () => this.deps.onMove(item, 1, 'out'), have < 1),
        this.btn('꺼내기 16', 'plain-btn small', () => this.deps.onMove(item, Math.min(16, have), 'out'), have < 1),
      );
      row.appendChild(acts);
      list.appendChild(row);
    }
    if (sorted.length === 0) list.textContent = '창고도 가방도 비어 있어요. 원정에서 모아 와요!';
    this.body.appendChild(list);
  }

  private renderBuild(): void {
    const list = document.createElement('div');
    list.className = 'storage-list';
    const defs: BuildingDef[] = [...this.deps.buildings.list].sort((a, b) => a.level - b.level);
    const has = (id: string) => this.built.has(id) || PREBUILT.includes(id) || id === 'dragon_nest_1';
    for (const d of defs) {
      const site = siteOf(d.id);
      const built = has(d.id);
      const row = document.createElement('div');
      row.className = 'storage-row' + (built ? ' built' : '');
      const text = document.createElement('div');
      text.className = 'storage-text';
      const cost = Object.entries(d.cost)
        .map(([item, n]) => `${this.deps.nameOf(item)} ${Math.min(this.stock.get(item) ?? 0, n)}/${n}`)
        .join(' · ');
      const miss = missingCost(this.stock, d.cost);
      const needReq = d.requires && !has(d.requires) ? this.deps.buildings.find(d.requires)?.name : null;
      let status: string;
      if (built) status = '✅ 지어졌어요';
      else if (!site) status = '🔒 다음 단계에서';
      else if (this.level < d.level) status = `마을 레벨 ${d.level} 필요 (지금 ${this.level})`;
      else if (needReq) status = `${needReq}를 먼저 지어요`;
      else if (Object.keys(miss).length) status = `모자라요: ${Object.entries(miss).map(([i, n]) => `${this.deps.nameOf(i)} ${n}`).join(', ')}`;
      else status = '지을 수 있어요!';
      text.innerHTML = `<b>${d.name}</b> <span class="craft-station">레벨 ${d.level}</span><br><span class="storage-sub">${cost || '비용 없음'}</span><br><span class="storage-sub">${status}</span>`;
      row.appendChild(text);
      if (!built && site) {
        const ok = this.level >= d.level && !needReq && Object.keys(miss).length === 0;
        row.appendChild(this.btn('짓기', 'big-btn small', () => this.deps.onBuild(d.id), !ok));
      }
      list.appendChild(row);
    }
    this.body.appendChild(list);
    const note = document.createElement('p');
    note.className = 'nest-note';
    note.textContent = '건물은 광장 둘레 정해진 자리에 서고, 아무도 부술 수 없어요. 마을 레벨은 건물 수와 도감(처음 손에 넣은 블록 종류 10개마다)으로 올라가고, 광장 북쪽 깃대에 레벨만큼 깃발이 걸려요.';
    this.body.appendChild(note);
  }
}
