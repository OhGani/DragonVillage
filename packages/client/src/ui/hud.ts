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
  private readonly helpEl: HTMLElement;
  /** 게임 방법 창이 열리고 닫힐 때 (열리면 입력을 멈추기 위해) */
  onHelpToggle: ((open: boolean) => void) | null = null;
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
        <button class="sbtn help" aria-label="게임 방법">?</button>
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
          <button class="overlay-help">게임 방법 보기</button>
        </div>
      </div>
      <div class="help-panel" hidden>
        <div class="help-card">
          <div class="help-head">
            <h2>게임 방법</h2>
            <button class="help-close" aria-label="닫기">✕</button>
          </div>
          <div class="help-body"></div>
          <button class="overlay-btn help-ok">알겠어요</button>
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
    // 주의: 상단 '?' 버튼도 class 에 help 가 있으므로 창은 help-panel 로 구분한다
    this.helpEl = q('.help-panel');
    q<HTMLElement>('.help-body').innerHTML = helpHtml(isTouch);
    const openHelp = (e: Event) => {
      e.preventDefault();
      this.showHelp();
    };
    const closeHelp = (e: Event) => {
      e.preventDefault();
      this.hideHelp();
    };
    this.helpEl.addEventListener('click', (e) => {
      if (e.target === this.helpEl) this.hideHelp(); // 카드 바깥(어두운 배경) 탭 = 닫기
    });
    q<HTMLButtonElement>('.sbtn.help').addEventListener('click', openHelp);
    q<HTMLButtonElement>('.overlay-help').addEventListener('click', openHelp);
    q<HTMLButtonElement>('.help-close').addEventListener('click', closeHelp);
    q<HTMLButtonElement>('.help-ok').addEventListener('click', closeHelp);
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
      key.textContent = String((i + 1) % 10); // 10번째 칸은 0
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

  showHelp(): void {
    if (!this.helpEl.hidden) return;
    this.helpEl.hidden = false;
    this.helpEl.querySelector('.help-card')!.scrollTop = 0;
    this.onHelpToggle?.(true);
  }

  hideHelp(): void {
    if (this.helpEl.hidden) return;
    this.helpEl.hidden = true;
    this.onHelpToggle?.(false);
  }

  get helpVisible(): boolean {
    return !this.helpEl.hidden;
  }
}

/** 게임 방법 본문. 초5가 읽는다 — 짧고 쉬운 말, 지금 기기 기준 */
function helpHtml(isTouch: boolean): string {
  const rows: [string, string][] = isTouch
    ? [
        ['걷기', '화면 <b>왼쪽 반</b>을 누르면 그 자리에 스틱이 생겨요. 누른 채 밀기. 끝까지 앞으로 밀면 달리기'],
        ['둘러보기', '화면 <b>오른쪽</b>을 드래그'],
        ['블록 놓기', '놓을 자리를 <b>짧게 탭</b>'],
        ['블록 부수기', '블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요'],
        ['점프', '오른쪽 아래 <b>▲</b>'],
        ['웅크리기', '<b>▼</b> (한 번 누르면 켜짐, 다시 누르면 꺼짐). 웅크리면 모서리에서 안 떨어져요'],
        ['블록 고르기', '아래 칸(핫바)을 탭'],
        ['FPS 보기', '오른쪽 위 <b>i</b>'],
      ]
    : [
        ['걷기 / 달리기', '<b>W A S D</b> / Ctrl 누른 채 W'],
        ['둘러보기', '마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요'],
        ['블록 놓기', '<b>오른쪽 클릭</b> (누르고 있으면 연속)'],
        ['블록 부수기', '<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요'],
        ['점프 / 웅크리기', '<b>Space</b> / <b>Shift</b>'],
        ['블록 고르기', '<b>1~9, 0</b> 또는 마우스 휠'],
        ['정보', '<b>F3</b>'],
      ];
  const other = isTouch
    ? 'PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록'
    : '폰에서는: 왼쪽 반 스틱 · 오른쪽 드래그 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프';
  const tips = [
    '한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.',
    '손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.',
    '블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.',
    '내 몸이 있는 자리에는 블록을 놓을 수 없어요.',
    '물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.',
    '물·용암은 벽이 없으면 옆으로 퍼지고 아래로 흘러요. 물이나 용암을 들고 원천을 꾹 누르면(PC: 왼쪽 클릭) 떠낼 수 있어요. 물이 용암을 만나면 돌이 돼요.',
    '광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동쪽 언덕엔 계단·전망대·동굴 입구가 있어요.',
    '세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요. 아직 저장은 안 돼요 — 새로고침하면 처음으로.',
  ];
  return (
    `<table class="help-table">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>` +
    `<p class="help-other">${other}</p>` +
    `<h3>알아두면 좋아요</h3><ul class="help-tips">${tips.map((t) => `<li>${t}</li>`).join('')}</ul>`
  );
}
