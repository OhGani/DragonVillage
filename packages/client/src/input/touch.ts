import type { InputSource, InputState } from './InputState';

/** 시점 감도 (라디안/CSS픽셀). 좌우는 아들 피드백(7차)으로 더 빠르게 */
const TOUCH_SENS_X = 0.0082;
const TOUCH_SENS_Y = 0.0056;
const STICK_RADIUS = 56; // CSS px — 스틱 노브가 움직이는 최대 거리
/** 스틱 바깥 이만큼까지는 스틱으로 친다 (엄지가 살짝 벗어나도 잡히게) */
const STICK_GRAB_MARGIN = 28;
const DEADZONE = 0.12;
const HOLD_MS = 220; // 이보다 오래 누르면 부수기
/** 이 안에 다시 누르면 "두 번 톡톡" = 손을 떼도 계속 눌린 채 (아빠 2026-09-22) */
const DOUBLE_TAP_MS = 320;
const TAP_MOVE_PX = 14; // 이보다 많이 움직이면 탭이 아니라 드래그

export interface TouchUI {
  surface: HTMLElement;
  stickBase: HTMLElement;
  stickKnob: HTMLElement;
  jumpButton: HTMLElement;
  sneakButton: HTMLElement;
  onSneakToggle?: (on: boolean) => void;
}

/**
 * 꾹 누르는 버튼 (▲ 점프 · ▼ 웅크리기).
 * - 한 번 누르면 누르는 동안만, 손을 떼면 멈춘다
 * - 빠르게 두 번 톡톡 치면 손을 떼도 계속 눌린 채 (잠김, 테두리가 노랗게)
 * - 잠긴 상태에서 한 번 더 누르면 풀린다
 */
class HoldButton {
  private held = false;
  private locked = false;
  private lockPending = false;
  private lastUp = 0;

  constructor(
    private readonly el: HTMLElement,
    private readonly onChange?: (on: boolean) => void,
  ) {}

  /** 지금 눌린 것으로 쳐야 하나 */
  get on(): boolean {
    return this.held || this.locked;
  }

  press(now: number): void {
    if (this.locked) {
      // 잠긴 걸 푼다 (이번 터치는 누른 것으로 치지 않는다)
      this.locked = false;
      this.held = false;
      this.lockPending = false;
      this.lastUp = now;
      this.paint();
      return;
    }
    this.lockPending = now - this.lastUp <= DOUBLE_TAP_MS;
    this.held = true;
    this.paint();
  }

  release(now: number): void {
    this.lastUp = now;
    if (this.lockPending) {
      this.locked = true;
      this.lockPending = false;
    }
    this.held = false;
    this.paint();
  }

  /** 전부 풀기 (탑승·세계 전환 등) */
  clear(): void {
    this.held = this.locked = this.lockPending = false;
    this.paint();
  }

  private paint(): void {
    this.el.classList.toggle('active', this.on);
    this.el.classList.toggle('locked', this.locked);
    this.onChange?.(this.on);
  }
}

interface LookTouch {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startTime: number;
  mode: 'undecided' | 'look' | 'break';
}

/**
 * 폰 조작:
 *  - 왼쪽 아래 **고정 스틱**(항상 보임)을 누른 채 밀면 이동. 스틱 자리에서만 (아들 7차)
 *  - 그 밖의 곳 드래그 → 시점
 *  - 짧은 탭 → 놓기, 꾹 누름 → 부수기 (누른 채 드래그해도 계속 부순다)
 *  - 점프 버튼, 웅크리기 토글 버튼
 */
export class TouchControls implements InputSource {
  private stick: { id: number; ox: number; oy: number; dx: number; dy: number } | null = null;
  private look: LookTouch | null = null;
  private lookDX = 0;
  private lookDY = 0;
  private secondaryTap = false;
  private readonly jump: HoldButton;
  private readonly sneak: HoldButton;
  lastActive = 0;

  /** 스틱 원판 중심과, 그 근처(여유 포함)에 닿았는지 */
  private stickCenter(): { cx: number; cy: number } {
    const r = this.ui.stickBase.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }
  private onStickArea(x: number, y: number): boolean {
    const r = this.ui.stickBase.getBoundingClientRect();
    const m = STICK_GRAB_MARGIN;
    return x >= r.left - m && x <= r.right + m && y >= r.top - m && y <= r.bottom + m;
  }

  private readonly onStart = (e: TouchEvent) => {
    let handled = false;
    for (const t of Array.from(e.changedTouches)) {
      // 핫바·버튼·오버레이 위에서 시작한 터치는 조작이 아니다 (preventDefault 하면 버튼 click 이 안 나온다)
      if ((t.target as Element | null)?.closest?.('.hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel, .action-card, .result-panel, .bag-panel, .chat-panel, .side-btns, .time-chip, .today-panel, .approval-card, .nest-panel, .chest-panel')) continue;
      handled = true;
      if (this.stick === null && this.onStickArea(t.clientX, t.clientY)) {
        const { cx, cy } = this.stickCenter();
        this.stick = { id: t.identifier, ox: cx, oy: cy, dx: 0, dy: 0 };
        this.moveStick(t.clientX, t.clientY);
      } else if (this.look === null) {
        this.look = {
          id: t.identifier,
          startX: t.clientX,
          startY: t.clientY,
          lastX: t.clientX,
          lastY: t.clientY,
          startTime: performance.now(),
          mode: 'undecided',
        };
      }
    }
    if (handled) {
      this.lastActive = performance.now();
      e.preventDefault();
    }
  };
  private readonly onMove = (e: TouchEvent) => {
    if (this.stick || this.look) e.preventDefault();
    for (const t of Array.from(e.changedTouches)) {
      if (this.stick && t.identifier === this.stick.id) {
        this.moveStick(t.clientX, t.clientY);
      } else if (this.look && t.identifier === this.look.id) {
        const L = this.look;
        const mx = t.clientX - L.lastX,
          my = t.clientY - L.lastY;
        L.lastX = t.clientX;
        L.lastY = t.clientY;
        if (L.mode === 'undecided' && Math.hypot(t.clientX - L.startX, t.clientY - L.startY) > TAP_MOVE_PX) L.mode = 'look';
        if (L.mode !== 'undecided') {
          this.lookDX += mx * TOUCH_SENS_X;
          this.lookDY += my * TOUCH_SENS_Y;
        }
      }
    }
  };

  /** 손가락 위치 → 스틱 노브 (중심 기준, 반지름 제한) */
  private moveStick(x: number, y: number): void {
    if (!this.stick) return;
    let dx = x - this.stick.ox,
      dy = y - this.stick.oy;
    const len = Math.hypot(dx, dy);
    if (len > STICK_RADIUS) {
      dx *= STICK_RADIUS / len;
      dy *= STICK_RADIUS / len;
    }
    this.stick.dx = dx;
    this.stick.dy = dy;
    this.ui.stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    this.ui.stickBase.classList.add('active');
  }
  private readonly onEnd = (e: TouchEvent) => {
    let handled = false;
    for (const t of Array.from(e.changedTouches)) {
      if (this.stick && t.identifier === this.stick.id) {
        this.stick = null;
        this.ui.stickKnob.style.transform = 'translate(0px, 0px)';
        this.ui.stickBase.classList.remove('active');
        handled = true;
      } else if (this.look && t.identifier === this.look.id) {
        if (this.look.mode === 'undecided' && performance.now() - this.look.startTime < HOLD_MS) this.secondaryTap = true;
        this.look = null;
        handled = true;
      }
    }
    if (handled) e.preventDefault();
  };
  private readonly onJumpStart = (e: Event) => {
    e.preventDefault();
    this.lastActive = performance.now();
    this.jump.press(this.lastActive);
  };
  private readonly onJumpEnd = (e: Event) => {
    e.preventDefault();
    this.jump.release(performance.now());
  };
  private readonly onSneakStart = (e: Event) => {
    e.preventDefault();
    this.lastActive = performance.now();
    this.sneak.press(this.lastActive);
  };
  private readonly onSneakEnd = (e: Event) => {
    e.preventDefault();
    this.sneak.release(performance.now());
  };

  /** 잠긴 ▲▼ 를 모두 푼다 (세계 전환·내리기 등) */
  clearHolds(): void {
    this.jump.clear();
    this.sneak.clear();
  }

  constructor(private readonly ui: TouchUI) {
    this.jump = new HoldButton(ui.jumpButton);
    this.sneak = new HoldButton(ui.sneakButton, (on) => ui.onSneakToggle?.(on));
    const opt: AddEventListenerOptions = { passive: false };
    ui.surface.addEventListener('touchstart', this.onStart, opt);
    ui.surface.addEventListener('touchmove', this.onMove, opt);
    ui.surface.addEventListener('touchend', this.onEnd, opt);
    ui.surface.addEventListener('touchcancel', this.onEnd, opt);
    ui.jumpButton.addEventListener('touchstart', this.onJumpStart, opt);
    ui.jumpButton.addEventListener('touchend', this.onJumpEnd, opt);
    ui.jumpButton.addEventListener('touchcancel', this.onJumpEnd, opt);
    ui.sneakButton.addEventListener('touchstart', this.onSneakStart, opt);
    ui.sneakButton.addEventListener('touchend', this.onSneakEnd, opt);
    ui.sneakButton.addEventListener('touchcancel', this.onSneakEnd, opt);
    ui.stickBase.hidden = false; // 고정 스틱은 항상 보인다
  }

  poll(out: InputState): void {
    if (this.stick) {
      let x = this.stick.dx / STICK_RADIUS,
        z = -this.stick.dy / STICK_RADIUS;
      const len = Math.hypot(x, z);
      if (len < DEADZONE) x = z = 0;
      else {
        const k = (len - DEADZONE) / (1 - DEADZONE) / len;
        x *= k;
        z *= k;
      }
      out.moveX += x;
      out.moveZ += z;
      // 스틱을 끝까지 앞으로 밀면 달리기
      if (z > 0.97) out.sprint = true;
    }
    if (this.look) {
      const L = this.look;
      if (L.mode === 'undecided' && performance.now() - L.startTime >= HOLD_MS) L.mode = 'break';
      if (L.mode === 'break') out.primary = true;
    }
    out.lookDX += this.lookDX;
    out.lookDY += this.lookDY;
    this.lookDX = 0;
    this.lookDY = 0;
    if (this.secondaryTap) out.secondaryTap = true;
    this.secondaryTap = false;
    if (this.jump.on) out.jump = true;
    if (this.sneak.on) out.sneak = true;
  }

  dispose(): void {
    const s = this.ui.surface;
    s.removeEventListener('touchstart', this.onStart);
    s.removeEventListener('touchmove', this.onMove);
    s.removeEventListener('touchend', this.onEnd);
    s.removeEventListener('touchcancel', this.onEnd);
    this.ui.jumpButton.removeEventListener('touchstart', this.onJumpStart);
    this.ui.jumpButton.removeEventListener('touchend', this.onJumpEnd);
    this.ui.jumpButton.removeEventListener('touchcancel', this.onJumpEnd);
    this.ui.sneakButton.removeEventListener('touchstart', this.onSneakStart);
    this.ui.sneakButton.removeEventListener('touchend', this.onSneakEnd);
    this.ui.sneakButton.removeEventListener('touchcancel', this.onSneakEnd);
  }
}
