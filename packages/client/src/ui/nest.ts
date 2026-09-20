/**
 * 드래곤 둥지 창 (M6-2·M6-3): 둥지 안에 서면 카드 → 열기. 자리 4개에 알 놓기, 내 알 부화(레벨 소모),
 * 둥지의 드래곤(모두) — 내 아기 드래곤은 먹이(만들 때 쓴 재료)를 줘서 성장 시간을 줄인다.
 * 서버가 진실 — 여기서는 요청만 보내고 dragons/nest 메시지로 다시 그린다.
 */
import { type DragonInfo, type DragonRegistry, type Inventory, NEST, type NestDragonInfo, type NestSlotInfo, SADDLE_ITEM, type XpRules, feedItems, hatchCost, isEggItem, xpProgress } from '@dragon-village/shared';

export interface NestDeps {
  dragons: DragonRegistry;
  xp: XpRules;
  nameOf(id: string): string;
  onPlace(slot: number, item: string): void;
  onHatch(id: number): void;
  onFeed(id: number, item: string): void;
  /** 타기 (M6-4): 내 어른 드래곤, 안장 필요 */
  onRide(id: number): void;
  onClose(): void;
  /** 지금 시각(ms) — 성장 남은 시간 표시용 */
  now?(): number;
}

/** 어른까지 남은 시간 문구 */
export function growText(growAt: number | null, now: number): string {
  if (growAt === null) return '어른';
  const left = growAt - now;
  if (left <= 0) return '곧 어른이 돼요';
  const min = Math.ceil(left / 60_000);
  return min >= 60 ? `어른까지 ${Math.floor(min / 60)}시간 ${min % 60}분` : `어른까지 ${min}분`;
}

export class NestView {
  readonly el: HTMLElement;
  private inv: Inventory = [];
  private mine: DragonInfo[] = [];
  private slots: NestSlotInfo[] = [];
  private nestDragons: NestDragonInfo[] = [];
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
  setNest(slots: NestSlotInfo[], dragons?: NestDragonInfo[]): void {
    this.slots = slots;
    if (dragons) this.nestDragons = dragons;
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

  private countOf(item: string): number {
    let n = 0;
    for (const s of this.inv) if (s && s.item === item) n += s.count;
    return n;
  }

  private chip(color: string | undefined): HTMLSpanElement {
    const chip = document.createElement('span');
    chip.className = 'nest-chip';
    chip.style.background = color ?? '#999';
    return chip;
  }

  private render(): void {
    const b = this.body;
    b.innerHTML = '';
    const level = xpProgress(this.xpTotal).level;
    const eggs = this.eggsInBag();
    const now = this.deps.now ? this.deps.now() : Date.now();

    const head = document.createElement('p');
    head.className = 'nest-note';
    head.textContent = `내 레벨 ${level} · 가방에 알 ${eggs.reduce((n, e) => n + e.count, 0)}개 · 내 드래곤 ${this.mine.filter((d) => d.stage !== 'egg').length}마리`;
    b.appendChild(head);

    // ---- 알 자리 4개
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
        title.append(this.chip(def?.color), document.createTextNode(` ${def?.name ?? s.dragon} 알 — ${s.mine ? '내 것' : `${s.owner} 것`}`));
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

    // ---- 둥지의 드래곤 (모두). 내 아기에게는 먹이 버튼
    const h3 = document.createElement('h3');
    h3.textContent = `둥지의 드래곤 ${this.nestDragons.length}마리`;
    b.appendChild(h3);
    const list = document.createElement('ul');
    list.className = 'nest-list';
    if (this.nestDragons.length === 0) {
      const li = document.createElement('li');
      li.className = 'nest-hint';
      li.textContent = '아직 없어요. 알을 놓고 부화시켜요!';
      list.appendChild(li);
    }
    const sorted = [...this.nestDragons].sort((a, b2) => Number(b2.mine) - Number(a.mine) || a.id - b2.id);
    for (const d of sorted) {
      const def = this.deps.dragons.find(d.dragon);
      const li = document.createElement('li');
      const line = document.createElement('div');
      line.append(this.chip(def?.color), document.createTextNode(` ${def?.name ?? d.dragon} · ${d.stage === 'baby' ? '아기' : '어른'} · ${d.mine ? '내 것' : `${d.owner} 것`}`));
      li.appendChild(line);
      if (d.stage === 'adult' && d.mine) {
        const row = document.createElement('div');
        row.className = 'nest-feed';
        if (this.countOf(SADDLE_ITEM) > 0) {
          const btn = document.createElement('button');
          btn.className = 'big-btn nest-btn';
          btn.textContent = '🐉 타기';
          btn.addEventListener('click', () => this.deps.onRide(d.id));
          row.appendChild(btn);
        } else {
          const hint = document.createElement('span');
          hint.className = 'nest-hint';
          hint.textContent = '안장이 있으면 탈 수 있어요 (제작대: 가죽 5 + 철 2, 가죽은 원정 보물 상자)';
          row.appendChild(hint);
        }
        li.appendChild(row);
      }
      if (d.stage === 'baby') {
        const sub = document.createElement('div');
        sub.className = 'nest-hint';
        sub.textContent = growText(d.growAt, now) + (d.mine ? ` · 먹이 ${d.fed}개 줬어요` : '');
        li.appendChild(sub);
        if (d.mine && def) {
          const row = document.createElement('div');
          row.className = 'nest-feed';
          const foods = feedItems(def);
          let any = false;
          for (const item of foods) {
            const have = this.countOf(item);
            if (have <= 0) continue;
            any = true;
            const btn = document.createElement('button');
            btn.className = 'plain-btn nest-btn';
            btn.textContent = `${this.deps.nameOf(item)} 먹이기 (${have})`;
            btn.addEventListener('click', () => this.deps.onFeed(d.id, item));
            row.appendChild(btn);
          }
          if (!any) {
            const hint = document.createElement('span');
            hint.className = 'nest-hint';
            hint.textContent = `먹이: ${foods.map((f) => this.deps.nameOf(f)).join('·')} (1개 = 10분 빨리 자라요)`;
            row.appendChild(hint);
          }
          li.appendChild(row);
        }
      }
      list.appendChild(li);
    }
    b.appendChild(list);
    const note = document.createElement('p');
    note.className = 'nest-note';
    note.textContent = '아기는 1시간이면 어른이 돼요(먹이로 더 빨리). 어른은 안장을 만들어 탈 수 있어요. 빔은 다음 단계에서.';
    b.appendChild(note);
  }
}
