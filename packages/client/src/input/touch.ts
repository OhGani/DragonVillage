import type { InputSource, InputState } from './InputState';

const TOUCH_SENS = 0.0048; // 라디안/CSS픽셀
const STICK_RADIUS = 56; // CSS px
const DEADZONE = 0.12;
const HOLD_MS = 220; // 이보다 오래 누르면 부수기
const TAP_MOVE_PX = 14; // 이보다 많이 움직이면 탭이 아니라 드래그

export interface TouchUI {
  surface: HTMLElement;
  stickBase: HTMLElement;
  stickKnob: HTMLElement;
  jumpButton: HTMLElement;
  sneakButton: HTMLElement;
  onSneakToggle?: (on: boolean) => void;
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
 *  - 왼쪽 반 터치 → 엄지 자리에 스틱 생성, 드래그로 이동
 *  - 오른쪽(또는 두 번째 손가락) 드래그 → 시점
 *  - 짧은 탭 → 놓기, 꾹 누름 → 부수기 (누른 채 드래그해도 계속 부순다)
 *  - 점프 버튼, 웅크리기 토글 버튼
 */
export class TouchControls implements InputSource {
  private stick: { id: number; ox: number; oy: number; dx: number; dy: number } | null = null;
  private look: LookTouch | null = null;
  private lookDX = 0;
  private lookDY = 0;
  private secondaryTap = false;
  private jumpHeld = false;
  private sneakOn = false;
  lastActive = 0;

  private readonly onStart = (e: TouchEvent) => {
    const w = window.innerWidth;
    let handled = false;
    for (const t of Array.from(e.changedTouches)) {
      // 핫바·버튼·오버레이 위에서 시작한 터치는 조작이 아니다 (preventDefault 하면 버튼 click 이 안 나온다)
      if ((t.target as Element | null)?.closest?.('.hotbar, .tbtn, .sbtn, .topbar, .overlay')) continue;
      handled = true;
      if (this.stick === null && t.clientX < w * 0.5) {
        this.stick = { id: t.identifier, ox: t.clientX, oy: t.clientY, dx: 0, dy: 0 };
        this.showStick();
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
        let dx = t.clientX - this.stick.ox,
          dy = t.clientY - this.stick.oy;
        const len = Math.hypot(dx, dy);
        if (len > STICK_RADIUS) {
          dx *= STICK_RADIUS / len;
          dy *= STICK_RADIUS / len;
        }
        this.stick.dx = dx;
        this.stick.dy = dy;
        this.showStick();
      } else if (this.look && t.identifier === this.look.id) {
        const L = this.look;
        const mx = t.clientX - L.lastX,
          my = t.clientY - L.lastY;
        L.lastX = t.clientX;
        L.lastY = t.clientY;
        if (L.mode === 'undecided' && Math.hypot(t.clientX - L.startX, t.clientY - L.startY) > TAP_MOVE_PX) L.mode = 'look';
        if (L.mode !== 'undecided') {
          this.lookDX += mx * TOUCH_SENS;
          this.lookDY += my * TOUCH_SENS;
        }
      }
    }
  };
  private readonly onEnd = (e: TouchEvent) => {
    let handled = false;
    for (const t of Array.from(e.changedTouches)) {
      if (this.stick && t.identifier === this.stick.id) {
        this.stick = null;
        this.ui.stickBase.hidden = true;
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
    this.jumpHeld = true;
    this.ui.jumpButton.classList.add('active');
  };
  private readonly onJumpEnd = (e: Event) => {
    e.preventDefault();
    this.jumpHeld = false;
    this.ui.jumpButton.classList.remove('active');
  };
  private readonly onSneak = (e: Event) => {
    e.preventDefault();
    this.sneakOn = !this.sneakOn;
    this.ui.sneakButton.classList.toggle('active', this.sneakOn);
    this.ui.onSneakToggle?.(this.sneakOn);
  };

  constructor(private readonly ui: TouchUI) {
    const opt: AddEventListenerOptions = { passive: false };
    ui.surface.addEventListener('touchstart', this.onStart, opt);
    ui.surface.addEventListener('touchmove', this.onMove, opt);
    ui.surface.addEventListener('touchend', this.onEnd, opt);
    ui.surface.addEventListener('touchcancel', this.onEnd, opt);
    ui.jumpButton.addEventListener('touchstart', this.onJumpStart, opt);
    ui.jumpButton.addEventListener('touchend', this.onJumpEnd, opt);
    ui.jumpButton.addEventListener('touchcancel', this.onJumpEnd, opt);
    ui.sneakButton.addEventListener('touchstart', this.onSneak, opt);
    ui.stickBase.hidden = true;
  }

  private showStick(): void {
    if (!this.stick) return;
    const b = this.ui.stickBase;
    b.hidden = false;
    b.style.left = `${this.stick.ox}px`;
    b.style.top = `${this.stick.oy}px`;
    this.ui.stickKnob.style.transform = `translate(${this.stick.dx}px, ${this.stick.dy}px)`;
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
    if (this.jumpHeld) out.jump = true;
    if (this.sneakOn) out.sneak = true;
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
    this.ui.sneakButton.removeEventListener('touchstart', this.onSneak);
  }
}
