import { type TodayCard, xpProgress } from '@dragon-village/shared';
import type { ApprovalAsk } from '../net/NetClient';
import type { TouchUI } from '../input/touch';

export interface HotbarSlot {
  /** 아이템 id. null = 빈 칸 */
  item: string | null;
  count: number;
  name: string;
  icon: HTMLCanvasElement | null;
}

let orbSeed = 0x2545f491;
function orbRnd(): number {
  orbSeed ^= orbSeed << 13;
  orbSeed ^= orbSeed >>> 17;
  orbSeed ^= orbSeed << 5;
  return (orbSeed >>> 0) / 4294967296;
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
  // 경험치 바 (M6-1)
  private readonly xpBar: HTMLElement;
  private readonly xpFill: HTMLElement;
  private readonly xpLevel: HTMLElement;
  private readonly orbLayer: HTMLElement;
  /** 날아가는 구슬·글자 (tickEffects 가 움직인다) */
  private readonly effects: { el: HTMLElement; kind: 'orb' | 'label'; t: number; delay: number; dur: number; sx: number; sy: number; mx: number; my: number; tx: number; ty: number }[] = [];
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
  readonly bagBtn: HTMLButtonElement;
  readonly familyBtn: HTMLButtonElement;
  private readonly familyText: HTMLElement;
  // 오늘 카드·승인 (M5-3)
  private readonly timeChip: HTMLButtonElement;
  private readonly timeChipMin: HTMLElement;
  private readonly timeChipSub: HTMLElement;
  private readonly todayEl: HTMLElement;
  private readonly todayTime: HTMLElement;
  private readonly todayList: HTMLElement;
  private readonly todayNote: HTMLElement;
  private readonly approvalEl: HTMLElement;
  private readonly approvalText: HTMLElement;
  private today: TodayCard | null = null;
  private readonly approveChip: HTMLButtonElement;
  private readonly approveChipText: HTMLElement;
  /** 서버가 알려 준 승인 대기 목록 (부모 플레이어) */
  private pending: ApprovalAsk[] = [];
  /** 지금 카드로 떠 있는 것 */
  private currentAsk: ApprovalAsk | null = null;
  /** 아이가 할 일을 체크했다 */
  onCheckTodo: ((id: number) => void) | null = null;
  /** 부모가 게임 안에서 승인(true)·거절(false)했다 */
  onApprove: ((ask: ApprovalAsk, ok: boolean) => void) | null = null;
  readonly chatBtn: HTMLButtonElement;
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
      <div class="xp-bar" hidden><div class="xp-fill"></div><div class="xp-level"></div></div>
      <div class="xp-orbs"></div>
      <div class="hotbar"></div>
      <div class="side-btns">
        <button class="sbtn bag-btn" aria-label="가방">🎒</button>
        <button class="sbtn chat-btn" aria-label="채팅">💬</button>
      </div>
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
      <button class="time-chip" hidden aria-label="오늘 남은 시간과 할 일"><span class="time-chip-min"></span><span class="time-chip-sub"></span></button>
      <button class="time-chip approve-chip" hidden aria-label="승인 기다리는 할 일"><span class="approve-chip-text"></span></button>
      <div class="approval-card" hidden>
        <div class="approval-text"></div>
        <div class="approval-btns"><button class="big-btn approval-ok">승인</button><button class="plain-btn approval-no">아직</button><button class="plain-btn approval-later">나중에</button></div>
      </div>
      <div class="today-panel" hidden>
        <div class="help-card today-card">
          <div class="help-head">
            <h2>오늘</h2>
            <button class="help-close today-close" aria-label="닫기">✕</button>
          </div>
          <div class="today-time"></div>
          <ul class="today-list"></ul>
          <p class="today-note"></p>
        </div>
      </div>
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
          <div class="help-family">
            <span class="help-family-text"></span>
            <button class="plain-btn help-family-btn">가족 연결</button>
          </div>
        </div>
      </div>`;
    root.appendChild(el);
    this.el = el;
    const q = <T extends Element>(sel: string) => el.querySelector(sel) as T;
    this.gaugeFg = q<SVGCircleElement>('.gauge-fg');
    this.gaugeFg.style.strokeDasharray = `${GAUGE_C}`;
    this.gaugeFg.style.strokeDashoffset = `${GAUGE_C}`;
    this.hotbar = q('.hotbar');
    this.xpBar = q('.xp-bar');
    this.xpFill = q('.xp-fill');
    this.xpLevel = q('.xp-level');
    this.orbLayer = q('.xp-orbs');
    this.slotName = q('.slot-name');
    this.toastEl = q('.toast');
    this.debugEl = q('.debug-text');
    this.overlay = q('.overlay');
    this.overlayTitle = q('.overlay-title');
    this.overlaySub = q('.overlay-sub');
    this.overlayBtn = q<HTMLButtonElement>('.overlay .overlay-btn');
    this.fullscreenBtn = q<HTMLButtonElement>('.fullscreen');
    this.debugBtn = q<HTMLButtonElement>('.debug');
    this.bagBtn = q<HTMLButtonElement>('.bag-btn');
    this.familyBtn = q<HTMLButtonElement>('.help-family-btn');
    this.familyText = q('.help-family-text');
    this.timeChip = q<HTMLButtonElement>('.time-chip');
    this.timeChipMin = q('.time-chip-min');
    this.timeChipSub = q('.time-chip-sub');
    this.todayEl = q('.today-panel');
    this.todayTime = q('.today-time');
    this.todayList = q('.today-list');
    this.todayNote = q('.today-note');
    this.approvalEl = q('.approval-card');
    this.approvalText = q('.approval-text');
    this.approveChip = q<HTMLButtonElement>('.approve-chip');
    this.approveChipText = q('.approve-chip-text');
    this.approveChip.addEventListener('click', (e) => {
      e.preventDefault();
      const first = this.pending[0];
      if (first) this.showApproval(first);
    });
    this.timeChip.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.todayEl.hidden) this.showToday();
      else this.hideToday();
    });
    q<HTMLButtonElement>('.today-close').addEventListener('click', () => this.hideToday());
    this.todayEl.addEventListener('click', (e) => {
      if (e.target === this.todayEl) this.hideToday();
    });
    q<HTMLButtonElement>('.approval-ok').addEventListener('click', () => this.decideApproval(true));
    q<HTMLButtonElement>('.approval-no').addEventListener('click', () => this.decideApproval(false));
    q<HTMLButtonElement>('.approval-later').addEventListener('click', () => this.decideApproval(null));
    this.chatBtn = q<HTMLButtonElement>('.chat-btn');
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
    q<HTMLButtonElement>('.help-panel .help-close').addEventListener('click', closeHelp); // 오늘 창의 닫기(.today-close)도 help-close 클래스를 쓰므로 범위를 좁힌다
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
    const rebuild = this.slotEls.length !== slots.length;
    this.slots = slots;
    if (rebuild) {
      this.hotbar.innerHTML = '';
      this.slotEls.length = 0;
      slots.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'slot';
        d.dataset.index = String(i);
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
    }
    slots.forEach((s, i) => this.paintSlot(i, s));
    if (rebuild) this.select(0, false);
    else this.select(this.selected, false);
  }

  /** 칸 하나 다시 그리기 (가방이 바뀌었을 때) */
  private paintSlot(i: number, s: HotbarSlot): void {
    const d = this.slotEls[i];
    if (!d) return;
    d.querySelectorAll('canvas, .slot-count').forEach((n) => n.remove());
    d.classList.toggle('empty', s.item === null);
    if (s.icon) d.appendChild(s.icon);
    if (s.count > 1) {
      const n = document.createElement('span');
      n.className = 'slot-count';
      n.textContent = String(s.count);
      d.appendChild(n);
    }
  }

  select(i: number, announce = true): void {
    if (this.slots.length === 0) return;
    i = ((i % this.slots.length) + this.slots.length) % this.slots.length;
    this.selected = i;
    this.slotEls.forEach((el, j) => el.classList.toggle('selected', j === i));
    if (announce) this.showSlotName(this.slots[i].item ? this.slots[i].name : '빈 칸');
  }

  selectDelta(d: number): void {
    this.select(this.selected + d);
  }

  get selectedIndex(): number {
    return this.selected;
  }

  /** 손에 든 아이템 id (빈 칸이면 null) */
  get selectedItem(): string | null {
    return this.slots[this.selected]?.item ?? null;
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
  // ---------------------------------------------------------------- 오늘 카드 (M5-3)

  get todayVisible(): boolean {
    return !this.todayEl.hidden;
  }

  /** 아이의 오늘 카드. null 이면(아이 아님) 칩·창을 숨긴다 */
  setToday(card: TodayCard | null): void {
    this.today = card;
    if (!card) {
      this.timeChip.hidden = true;
      this.todayEl.hidden = true;
      return;
    }
    this.timeChip.hidden = false;
    const done = card.todos.filter((t) => t.status === 'approved').length;
    this.timeChipMin.textContent = `⏱ ${card.remainingMin}분`;
    this.timeChipSub.textContent = card.todos.length ? `할 일 ${done}/${card.todos.length}` : '';
    this.timeChip.classList.toggle('warn', card.remainingMin > 0 && card.remainingMin <= 5);
    this.timeChip.classList.toggle('danger', card.remainingMin <= 0);
    this.renderToday();
  }

  private renderToday(): void {
    const c = this.today;
    if (!c) return;
    const adj = c.manualAdj ? ` ${c.manualAdj > 0 ? '+' : '−'}${Math.abs(c.manualAdj)}분 조정` : '';
    this.todayTime.innerHTML = '';
    const big = document.createElement('div');
    big.className = 'today-remaining';
    big.textContent = `남은 시간 ${c.remainingMin}분`;
    const detail = document.createElement('div');
    detail.className = 'today-detail';
    detail.textContent = `기본 ${c.baseMin}분 + 보너스 ${c.bonusMin}/${c.bonusCap}분${adj} − 쓴 ${c.usedMin}분`;
    this.todayTime.append(big, detail);
    this.todayList.innerHTML = '';
    if (c.todos.length === 0) {
      const li = document.createElement('li');
      li.className = 'today-empty';
      li.textContent = '오늘 할 일이 없어요. 아빠·엄마가 /family 에서 만들어요';
      this.todayList.appendChild(li);
    }
    for (const t of c.todos) {
      const li = document.createElement('li');
      const title = document.createElement('span');
      title.className = 'todo-title';
      title.textContent = t.title;
      li.appendChild(title);
      if (t.status === 'pending' || t.status === 'rejected') {
        if (t.status === 'rejected') {
          const s = document.createElement('span');
          s.className = 'todo-state';
          s.textContent = '다시 해 봐요';
          li.appendChild(s);
        }
        const btn = document.createElement('button');
        btn.className = 'todo-btn';
        btn.textContent = '했어요';
        btn.addEventListener('click', () => {
          btn.disabled = true;
          this.onCheckTodo?.(t.id);
        });
        li.appendChild(btn);
      } else {
        const s = document.createElement('span');
        s.className = 'todo-state';
        s.textContent = t.status === 'approved' ? '✅ 했어요' : '⏳ 확인 기다리는 중';
        li.appendChild(s);
      }
      this.todayList.appendChild(li);
    }
    for (const a of c.adjustments) {
      const li = document.createElement('li');
      li.className = 'today-adjust';
      const t = document.createElement('span');
      t.className = 'todo-title';
      t.textContent = `아빠·엄마 조정 ${a.min > 0 ? '+' : '−'}${Math.abs(a.min)}분${a.reason ? ` — ${a.reason}` : ''}`;
      li.appendChild(t);
      this.todayList.appendChild(li);
    }
    const notes: string[] = [];
    if (c.weekMessage) notes.push(c.weekMessage);
    else notes.push('처음이니까 믿고 시작할게. 이번 주 할 일을 잘하면 다음 주 보너스가 정해져요.');
    if (c.noPlayToday) notes.push('오늘은 게임 없는 날이에요.');
    if (c.todos.some((t) => t.needsApproval)) notes.push('아빠·엄마가 확인해 주면 시간이 더 생겨요.');
    if (c.blocked) notes.push(c.nextOpen ? `지금은 게임 시간이 아니에요. ${c.nextOpen} 에 열려요.` : '지금은 게임 시간이 아니에요.');
    else if (c.minutesUntilBlocked < 1440) notes.push(`게임 시간은 ${c.minutesUntilBlocked}분 뒤에 끝나요.`);
    notes.push(c.enforced ? '남은 시간이 0 이 되면 마을에서 나가요. 5분 동안 가만히 있어도 나가요.' : '지금은 시간을 재기만 해요. 0 이 돼도 게임은 계속돼요.');
    this.todayNote.textContent = notes.join(' ');
  }

  showToday(): void {
    if (!this.today) return;
    this.renderToday();
    this.todayEl.hidden = false;
  }

  hideToday(): void {
    this.todayEl.hidden = true;
  }

  /** 부모 플레이어: 승인 기다리는 목록 → 위 가운데 "✅ 승인 n" 칩. 0 이면 숨김. 카드로 떠 있던 것이 목록에서 사라지면 카드도 내린다 */
  setPending(items: ApprovalAsk[]): void {
    this.pending = items;
    this.approveChip.hidden = items.length === 0;
    this.approveChipText.textContent = `✅ 승인 ${items.length}`;
    if (this.currentAsk && !items.some((i) => i.id === this.currentAsk!.id && i.date === this.currentAsk!.date)) {
      this.currentAsk = null;
      this.approvalEl.hidden = true;
    }
  }

  /** 부모 플레이어에게 승인 카드 하나 (아이가 체크한 순간, 또는 칩을 눌렀을 때) */
  showApproval(ask: ApprovalAsk): void {
    this.currentAsk = ask;
    const rest = this.pending.filter((i) => !(i.id === ask.id && i.date === ask.date)).length;
    this.approvalText.textContent = `${ask.child}: "${ask.title}" 했대요. 확인해 주세요${rest > 0 ? ` (${rest}개 더 기다려요)` : ''}`;
    this.approvalEl.hidden = false;
  }

  private decideApproval(ok: boolean | null): void {
    const ask = this.currentAsk;
    this.currentAsk = null;
    this.approvalEl.hidden = true;
    if (!ask || ok === null) return; // "나중에": 칩에 남아 있다
    this.onApprove?.(ask, ok);
    // 서버가 곧 새 목록을 보내지만, 먼저 칩 숫자를 내려 둔다
    this.setPending(this.pending.filter((i) => !(i.id === ask.id && i.date === ask.date)));
  }

  // ---------------------------------------------------------------- 경험치 (M6-1)

  /** 초록 바 + 레벨 숫자. 마인크래프트처럼 핫바 바로 위 */
  setXp(total: number): void {
    const p = xpProgress(total);
    this.xpBar.hidden = false;
    this.xpFill.style.width = `${Math.round(p.progress * 100)}%`;
    this.xpLevel.textContent = String(p.level);
    this.xpLevel.classList.toggle('zero', p.level === 0);
  }

  /**
   * 구슬 연출: 화면 (sx, sy) 에서 튀어나와 경험치 바로 날아간다. "+N" 글자도 바 위로 떠오른다.
   * 브라우저 애니메이션 API 대신 게임 프레임(tickEffects)에서 직접 움직인다 — 폰에서 확실히 보이고, 숨긴 탭·테스트에서도 같은 코드
   * (흔들림은 시드 xorshift — Math.random 금지 규칙 통일)
   */
  xpOrbs(sx: number, sy: number, count: number, amount = 0): void {
    const bar = this.xpBar.getBoundingClientRect();
    const host = this.el.getBoundingClientRect();
    const tx = bar.left + bar.width / 2 - host.left;
    const ty = bar.top + bar.height / 2 - host.top;
    if (amount > 0) {
      const label = document.createElement('div');
      label.className = 'xp-float';
      label.textContent = `+${amount}`;
      label.style.left = `${tx}px`;
      label.style.top = `${ty - 28}px`;
      label.style.opacity = '0';
      this.orbLayer.appendChild(label);
      this.effects.push({ el: label, kind: 'label', t: 0, delay: 0, dur: 1.6, sx: tx, sy: ty - 28, mx: tx, my: ty - 68, tx, ty: ty - 68 });
    }
    for (let i = 0; i < count; i++) {
      const orb = document.createElement('div');
      orb.className = 'xp-orb';
      orb.style.left = `${sx}px`;
      orb.style.top = `${sy}px`;
      orb.style.opacity = '0';
      this.orbLayer.appendChild(orb);
      const ang = orbRnd() * Math.PI * 2;
      const r = 24 + orbRnd() * 56;
      this.effects.push({ el: orb, kind: 'orb', t: 0, delay: i * 0.07, dur: 1.1 + orbRnd() * 0.5, sx, sy, mx: sx + Math.cos(ang) * r, my: sy + Math.sin(ang) * r - 40, tx, ty });
    }
  }

  /** 매 프레임: 구슬·글자를 움직인다 (Game 의 tick 에서) */
  tickEffects(dt: number): void {
    if (this.effects.length === 0) return;
    const ease = (u: number) => 1 - (1 - u) * (1 - u);
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i]!;
      e.t += dt;
      const u = Math.max(0, Math.min(1, (e.t - e.delay) / e.dur));
      if (e.t < e.delay) continue;
      let x: number, y: number, scale: number, opacity: number;
      if (e.kind === 'label') {
        x = e.sx;
        y = e.sy + (e.ty - e.sy) * u;
        scale = u < 0.2 ? 0.8 + (u / 0.2) * 0.35 : 1.15 - ((u - 0.2) / 0.8) * 0.15;
        opacity = u < 0.2 ? u / 0.2 : 1 - (u - 0.2) / 0.8;
      } else if (u < 0.3) {
        const v = ease(u / 0.3); // 튀어나오기
        x = e.sx + (e.mx - e.sx) * v;
        y = e.sy + (e.my - e.sy) * v;
        scale = 0.6 + 0.5 * v;
        opacity = 0.9 + 0.1 * v;
      } else {
        const v = (u - 0.3) / 0.7; // 바로 날아가기 (점점 빨라짐)
        const w = v * v;
        x = e.mx + (e.tx - e.mx) * w;
        y = e.my + (e.ty - e.my) * w;
        scale = 1.1 - 0.6 * v;
        opacity = 1 - 0.8 * v;
      }
      e.el.style.left = `${x}px`;
      e.el.style.top = `${y}px`;
      e.el.style.opacity = String(opacity);
      e.el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      if (u >= 1) {
        e.el.remove();
        this.effects.splice(i, 1);
      }
    }
  }

  /** 가족 연결 상태 (게임 방법 창 아래). code 가 있으면 연결됨 */
  setFamily(code: string | null, parentOf: string | null = null): void {
    if (parentOf) {
      this.familyText.textContent = `부모로 연결됨 (가족 코드 ${parentOf}) — 아이가 할 일을 체크하면 승인 카드가 떠요`;
      this.familyBtn.hidden = true;
      return;
    }
    this.familyBtn.hidden = false;
    this.familyText.textContent = code ? `가족 연결됨 (코드 ${code}) — 위의 ⏱ 에서 오늘 할 일과 남은 시간을 봐요` : '아빠·엄마 화면(/family)의 가족 코드로 내 계정을 연결해요 (아이만)';
    this.familyBtn.textContent = code ? '다시 연결' : '가족 연결';
  }

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
        ['가방 · 만들기', '핫바 옆 <b>🎒</b>. 칸을 탭해 고르고 다른 칸을 탭하면 옮겨요'],
        ['채팅', '<b>💬</b> → 이모지나 문구를 골라요'],
        ['FPS 보기', '오른콽 위 <b>i</b>'],
      ]
    : [
        ['걷기 / 달리기', '<b>W A S D</b> / Ctrl 누른 채 W'],
        ['둘러보기', '마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요'],
        ['블록 놓기', '<b>오른쪽 클릭</b> (누르고 있으면 연속)'],
        ['블록 부수기', '<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요'],
        ['점프 / 웅크리기', '<b>Space</b> / <b>Shift</b>'],
        ['블록 고르기', '<b>1~9, 0</b> 또는 마우스 휠'],
        ['가방 · 만들기', '<b>E</b> (또는 핫바 옆 🎒)'],
        ['채팅', '<b>T</b> (또는 💬) → 이모지·문구 고르기'],
        ['정보', '<b>F3</b>'],
      ];
  const other = isTouch
    ? 'PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록'
    : '폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프';
  const tips = [
    '왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.',
    '<b>블록은 유한</b>해요. 부수면 가방에 들어오고, 놓으면 가방에서 나가요. 처음엔 시작 키트(판자·흙·조약돌·횃불·유리·제작대·양동이)를 받아요. 물은 빈 양동이로 떠서 옮겨요.',
    '<b>만들기</b>: 가방 화면의 🔨 탭. 판자·제작대 같은 건 어디서나, 문·계단 같은 건 <b>제작대</b>를 놓고 그 옆(5칸)에서. 양조기 옆에서는 ⚗️ 탭이 생겨요. 레시피는 아빠·아들이 recipes.json 에 적어요.',
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
