import type { TouchUI } from '../input/touch';

export interface HotbarSlot {
  blockNum: number;
  name: string;
  icon: HTMLCanvasElement | null;
}

const GAUGE_R = 15;
const GAUGE_C = 2 * Math.PI * GAUGE_R;
/** 방위각 0°·45°·… 순서. 마인크래프트와 같이 -Z 가 북, +X 가 동 */
export const HEADING_NAMES = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'] as const;

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
  private readonly compassRose: HTMLElement;
  private readonly compassLabels: HTMLElement[];
  private readonly compassText: HTMLElement;
  private lastBearing = NaN;
  /** 게임 방법 창이 열리고 닫힐 때 (열리면 입력을 멈추기 위해) */
  onHelpToggle: ((open: boolean) => void) | null = null;
  private readonly villageEl: HTMLElement;
  private slots: HotbarSlot[] = [];
  private selected = 0;
  private nameTimer: number | null = null;
  private toastTimer: number | null = null;
  onSelect: ((index: number) => void) | null = null;
  onOverlayClick: (() => void) | null = null;
  private readonly timerEl: HTMLElement;
  private readonly timerPhase: HTMLElement;
  private readonly timerTime: HTMLElement;
  private readonly actionEl: HTMLElement;
  private readonly actionTitle: HTMLElement;
  private readonly actionSub: HTMLElement;
  private readonly actionBtn: HTMLButtonElement;
  private onAction: (() => void) | null = null;
  private readonly resultEl: HTMLElement;
  private onResultAgain: (() => void) | null = null;
  private onResultClose: (() => void) | null = null;

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
      <div class="compass" aria-label="나침반">
        <div class="compass-dial">
          <div class="compass-rose">
            <span class="compass-label compass-n">북</span>
            <span class="compass-label compass-e">동</span>
            <span class="compass-label compass-s">남</span>
            <span class="compass-label compass-w">서</span>
          </div>
          <div class="compass-pointer"></div>
        </div>
        <div class="compass-text">북</div>
      </div>
      <div class="topbar">
        <button class="sbtn help" aria-label="게임 방법">?</button>
        <button class="sbtn fullscreen" aria-label="전체화면">⛶ 전체화면</button>
        <button class="sbtn debug" aria-label="정보">i</button>
      </div>
      <div class="exp-timer" hidden><span class="exp-phase"></span><span class="exp-time"></span></div>
      <pre class="debug-text" hidden></pre>
      <div class="toast" hidden></div>
      <div class="action-card" hidden>
        <div class="action-title"></div>
        <div class="action-sub"></div>
        <button class="big-btn action-btn"></button>
      </div>
      <div class="result-panel" hidden>
        <div class="result-card">
          <h2 class="result-title"></h2>
          <p class="result-sub"></p>
          <ul class="result-items"></ul>
          <div class="result-buttons">
            <button class="big-btn result-again"></button>
            <button class="plain-btn result-close">마을 구경하기</button>
          </div>
        </div>
      </div>
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
          <p class="help-village"></p>
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
    this.overlayBtn = q<HTMLButtonElement>('.overlay .overlay-btn');
    this.fullscreenBtn = q<HTMLButtonElement>('.fullscreen');
    this.debugBtn = q<HTMLButtonElement>('.debug');
    // 주의: 상단 '?' 버튼도 class 에 help 가 있으므로 창은 help-panel 로 구분한다
    this.helpEl = q('.help-panel');
    this.compassRose = q('.compass-rose');
    this.compassLabels = Array.from(el.querySelectorAll<HTMLElement>('.compass-label'));
    this.compassText = q('.compass-text');
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
    q<HTMLButtonElement>('.overlay .overlay-help').addEventListener('click', openHelp);
    q<HTMLButtonElement>('.help-close').addEventListener('click', closeHelp);
    q<HTMLButtonElement>('.help-ok').addEventListener('click', closeHelp);
    this.villageEl = q('.help-village');
    this.timerEl = q('.exp-timer');
    this.timerPhase = q('.exp-phase');
    this.timerTime = q('.exp-time');
    this.actionEl = q('.action-card');
    this.actionTitle = q('.action-title');
    this.actionSub = q('.action-sub');
    this.actionBtn = q<HTMLButtonElement>('.action-btn');
    this.actionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.onAction?.();
    });
    this.resultEl = q('.result-panel');
    q<HTMLButtonElement>('.result-again').addEventListener('click', () => {
      this.hideResult();
      this.onResultAgain?.();
    });
    q<HTMLButtonElement>('.result-close').addEventListener('click', () => {
      this.hideResult();
      this.onResultClose?.();
    });
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
  }

  /**
   * 전체화면 버튼 상태.
   * mode: 'off' 켤 수 있음 / 'on' 켜져 있음(끄기) / 'unavailable' 브라우저가 못 함(누르면 안내) / 'hidden' 이미 앱으로 전체화면
   */
  setFullscreen(mode: 'off' | 'on' | 'unavailable' | 'hidden'): void {
    const b = this.fullscreenBtn;
    b.hidden = mode === 'hidden';
    b.classList.toggle('active', mode === 'on');
    b.textContent = mode === 'on' ? '⛶ 전체화면 끄기' : '⛶ 전체화면';
    b.setAttribute('aria-label', mode === 'on' ? '전체화면 끄기' : '전체화면');
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

  /**
   * 나침반. yaw(라디안, 0 = -Z 북, 양수 = 왼쪽으로 돈 것) → 보는 방향이 맨 위에 오도록 눈금판을 돌린다.
   * 글자는 반대로 돌려 항상 똑바로 서 있게 한다.
   */
  setHeading(yaw: number): void {
    // 방위각: 북 0, 동 90, 남 180, 서 270 (시계 방향). yaw 는 반시계라 부호를 뒤집는다
    const bearing = (((-yaw * 180) / Math.PI) % 360 + 360) % 360;
    if (Math.abs(bearing - this.lastBearing) < 0.3) return;
    this.lastBearing = bearing;
    this.compassRose.style.transform = `rotate(${-bearing}deg)`;
    for (const l of this.compassLabels) l.style.transform = `rotate(${bearing}deg)`;
    this.compassText.textContent = HEADING_NAMES[Math.round(bearing / 45) % 8];
  }

  /** 게임 방법 창 맨 아래: 마을 이름·코드·인원 */
  setVillageInfo(text: string): void {
    this.villageEl.textContent = text;
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

  /** 원정 타이머 (상단 가운데). null 이면 숨김. phase 로 색이 바뀐다 */
  setTimer(remainingSec: number | null, phase: 'day' | 'evening' | 'night' | null): void {
    if (remainingSec === null) {
      this.timerEl.hidden = true;
      return;
    }
    this.timerEl.hidden = false;
    const m = Math.floor(remainingSec / 60),
      sec = Math.floor(remainingSec % 60);
    this.timerTime.textContent = m + ':' + String(sec).padStart(2, '0');
    this.timerPhase.textContent = phase === 'night' ? '🌙 밤' : phase === 'evening' ? '🌇 저녁' : '☀️ 낮';
    this.timerEl.classList.toggle('warn', remainingSec <= 180);
    this.timerEl.classList.toggle('danger', remainingSec <= 60);
    this.timerEl.classList.toggle('night', phase === 'night');
  }

  /** 포탈 앞 카드 (원정 출발 / 따라가기 / 마을로). 같은 내용이면 다시 그리지 않는다 */
  showAction(title: string, sub: string, button: string, onClick: () => void): void {
    this.onAction = onClick;
    if (this.actionTitle.textContent !== title) this.actionTitle.textContent = title;
    if (this.actionSub.textContent !== sub) this.actionSub.textContent = sub;
    if (this.actionBtn.textContent !== button) this.actionBtn.textContent = button;
    this.actionEl.hidden = false;
  }
  hideAction(): void {
    this.actionEl.hidden = true;
    this.onAction = null;
  }
  /** 카드 버튼을 누른 것과 같다 (PC 에서 마우스가 잠겨 있을 때 Enter 키) */
  triggerAction(): void {
    if (!this.actionEl.hidden) this.onAction?.();
  }
  get actionVisible(): boolean {
    return !this.actionEl.hidden;
  }

  /** 귀환 정산 창 */
  showResult(
    title: string,
    sub: string,
    items: { name: string; count: number; icon: HTMLCanvasElement | null }[],
    againLabel: string,
    onAgain: () => void,
    onClose: () => void,
  ): void {
    this.onResultAgain = onAgain;
    this.onResultClose = onClose;
    const q = <T extends Element>(sel: string) => this.resultEl.querySelector(sel) as T;
    q<HTMLElement>('.result-title').textContent = title;
    q<HTMLElement>('.result-sub').textContent = sub;
    const list = q<HTMLElement>('.result-items');
    list.innerHTML = '';
    if (items.length === 0) {
      const li = document.createElement('li');
      li.className = 'result-empty';
      li.textContent = '이번엔 빈손이에요. 블록을 부수면 가져올 수 있어요';
      list.appendChild(li);
    }
    for (const it of items) {
      const li = document.createElement('li');
      if (it.icon) li.appendChild(it.icon);
      const name = document.createElement('span');
      name.className = 'result-name';
      name.textContent = it.name;
      const count = document.createElement('span');
      count.className = 'result-count';
      count.textContent = '×' + it.count;
      li.append(name, count);
      list.appendChild(li);
    }
    q<HTMLButtonElement>('.result-again').textContent = againLabel;
    this.resultEl.hidden = false;
  }
  hideResult(): void {
    this.resultEl.hidden = true;
  }
  get resultVisible(): boolean {
    return !this.resultEl.hidden;
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
        ['걷기', '왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기'],
        ['둘러보기', '스틱이 아닌 곳을 <b>드래그</b>'],
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
    : '폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프';
  const tips = [
    '왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.',
    '한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.',
    '손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.',
    '블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.',
    '내 몸이 있는 자리에는 블록을 놓을 수 없어요.',
    '물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.',
    '내가 놓은 물·용암은 양동이 하나만큼이에요. 사방으로 퍼지면서 낮아지고, 양만큼만 퍼지고 멈춰요(위로는 안 차요). 강·연못 같은 원래 있던 물은 마르지 않아요. 물이나 용암을 꾹 누르면(PC: 왼쪽 클릭) 떠내거나 닦아낼 수 있어요. 물이 용암을 만나면 돌이 돼요.',
    '광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.',
    '<b>원정</b>: 광장 북쪽 보라색 포탈 안에 서면 "원정 출발" 버튼이 나와요. 초원 섬에 10분 동안 다녀오는데, 6분이 지나면 밤이 돼요. 섬 가운데 포탈로 돌아오면 부순 블록을 마을 창고에 가져와요. 시간이 다 되면 저절로 돌아오지만 절반만 가져와요. 친구가 먼저 갔으면 같은 포탈에서 "따라가기".',
    '세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.',
    '만든 것은 서버에 저장돼요. 같은 마을 코드로 들어오면 어느 폰·PC 에서도 같은 마을이에요. 친구에게 마을 코드 6자리를 알려 주면 함께 지을 수 있어요(6명까지).',
    '다른 사람이 놓거나 부순 블록도 바로 보여요. 서버가 "너무 멀어요" 같은 말을 하면 그 블록은 되돌아가요.',
  ];
  return (
    `<table class="help-table">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>` +
    `<p class="help-other">${other}</p>` +
    `<h3>알아두면 좋아요</h3><ul class="help-tips">${tips.map((t) => `<li>${t}</li>`).join('')}</ul>`
  );
}
