import type { TouchUI } from '../input/touch';

export interface HotbarSlot {
  blockNum: number;
  name: string;
  icon: HTMLCanvasElement | null;
}

const GAUGE_R = 15;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

/** 십자선·핫바·부수기 게이지·터치 버튼·오버레이·디버그. 전부 DOM. */
export class Hud {
  readonly el: HTMLElement;
  readonly touchUI: TouchUI;
  private readonly gaugeFg: SVGCircleElement;
  private readonly hotbar: HTMLElement;
  private readonly slotEls: HTMLElement[] = [];
  private readonly slotName: HTMLElement;
  private readonly toastEl: HTMLElement;
  private readonly debugEl: HTMLElement;
  private readonly overlay: HTMLElement;
  private readonly overlayTitle: HTMLElement;
  private readonly overlaySub: HTMLElement;
  private readonly overlayBtn: HTMLButtonElement;
  readonly fullscreenBtn: HTMLButtonElement;
  readonly debugBtn: HTMLButtonElement;
  private slots: HotbarSlot[] = [];
  private selected = 0;
  private nameTimer: number | null = null;
  private toastTimer: number | null = null;
  onSelect: ((index: number) => void) | null = null;
  onOverlayClick: (() => void) | null = null;

  constructor(root: HTMLElement, isTouch: boolean) {
    const el = document.createElement('div');
    el.className = `hud${isTouch ? ' touch' : ''}`;
    el.innerHTML = `
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${GAUGE_R}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${GAUGE_R}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="hotbar"></div>
      <div class="touch-controls">
        <div class="stick-base" hidden><div class="stick-knob"></div></div>
        <button class="tbtn jump" aria-label="점프">▲</button>
        <button class="tbtn sneak" aria-label="웅크리기">▼</button>
      </div>
      <div class="topbar">
        <button class="sbtn fullscreen" aria-label="전체화면">⛶</button>
        <button class="sbtn debug" aria-label="정보">i</button>
      </div>
      <pre class="debug-text" hidden></pre>
      <div class="toast" hidden></div>
      <div class="overlay">
        <div class="overlay-card">
          <h1 class="overlay-title"></h1>
          <p class="overlay-sub"></p>
          <button class="overlay-btn"></button>
        </div>
      </div>`;
    root.appendChild(el);
    this.el = el;
    const q = <T extends Element>(sel: string) => el.querySelector(sel) as T;
    this.gaugeFg = q<SVGCircleElement>('.gauge-fg');
    this.gaugeFg.style.strokeDasharray = `${GAUGE_C}`;
    this.gaugeFg.style.strokeDashoffset = `${GAUGE_C}`;
    this.hotbar = q('.hotbar');
    this.slotName = q('.slot-name');
    this.toastEl = q('.toast');
    this.debugEl = q('.debug-text');
    this.overlay = q('.overlay');
    this.overlayTitle = q('.overlay-title');
    this.overlaySub = q('.overlay-sub');
    this.overlayBtn = q<HTMLButtonElement>('.overlay-btn');
    this.fullscreenBtn = q<HTMLButtonElement>('.fullscreen');
    this.debugBtn = q<HTMLButtonElement>('.debug');
    this.touchUI = {
      surface: el,
      stickBase: q('.stick-base'),
      stickKnob: q('.stick-knob'),
      jumpButton: q('.jump'),
      sneakButton: q('.sneak'),
    };
    this.overlayBtn.addEventListener('click', () => this.onOverlayClick?.());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.onOverlayClick?.();
    });
    if (!document.fullscreenEnabled) this.fullscreenBtn.hidden = true;
  }

  setSlots(slots: HotbarSlot[]): void {
    this.slots = slots;
    this.hotbar.innerHTML = '';
    this.slotEls.length = 0;
    slots.forEach((s, i) => {
      const d = document.createElement('div');
      d.className = 'slot';
      d.dataset.index = String(i);
      if (s.icon) d.appendChild(s.icon);
      const key = document.createElement('span');
      key.className = 'slot-key';
      key.textContent = String(i + 1);
      d.appendChild(key);
      d.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.select(i);
        this.onSelect?.(i);
      });
      this.hotbar.appendChild(d);
      this.slotEls.push(d);
    });
    this.select(0, false);
  }

  select(i: number, announce = true): void {
    if (this.slots.length === 0) return;
    i = ((i % this.slots.length) + this.slots.length) % this.slots.length;
    this.selected = i;
    this.slotEls.forEach((el, j) => el.classList.toggle('selected', j === i));
    if (announce) this.showSlotName(this.slots[i].name);
  }

  selectDelta(d: number): void {
    this.select(this.selected + d);
  }

  get selectedIndex(): number {
    return this.selected;
  }

  get selectedBlock(): number {
    return this.slots[this.selected]?.blockNum ?? 0;
  }

  private showSlotName(name: string): void {
    this.slotName.textContent = name;
    this.slotName.classList.add('show');
    if (this.nameTimer) window.clearTimeout(this.nameTimer);
    this.nameTimer = window.setTimeout(() => this.slotName.classList.remove('show'), 1200);
  }

  /** 부수기 게이지 0..1 (0 이면 숨김) */
  setProgress(p: number): void {
    const show = p > 0;
    this.gaugeFg.parentElement!.classList.toggle('show', show);
    if (show) this.gaugeFg.style.strokeDashoffset = `${GAUGE_C * (1 - Math.min(1, p))}`;
  }

  toast(msg: string, ms = 4000): void {
    this.toastEl.textContent = msg;
    this.toastEl.hidden = false;
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toastEl.hidden = true), ms);
  }

  setDebug(text: string | null): void {
    this.debugEl.hidden = text === null;
    if (text !== null) this.debugEl.textContent = text;
  }

  showOverlay(title: string, sub: string, button: string | null): void {
    this.overlayTitle.textContent = title;
    this.overlaySub.textContent = sub;
    this.overlayBtn.textContent = button ?? '';
    this.overlayBtn.hidden = button === null;
    this.overlay.classList.add('show');
  }

  hideOverlay(): void {
    this.overlay.classList.remove('show');
  }

  get overlayVisible(): boolean {
    return this.overlay.classList.contains('show');
  }
}
