import type { InputSource, InputState } from './InputState';

const MOUSE_SENS = 0.0022; // 라디안/픽셀

/** 키보드 + 마우스(Pointer Lock). PC 조작. */
export class KeyboardMouse implements InputSource {
  private readonly keys = new Set<string>();
  private lookDX = 0;
  private lookDY = 0;
  private primary = false;
  private secondaryHold = false;
  private secondaryTap = false;
  private slotDelta = 0;
  private slotSelect = -1;
  private toggleDebug = false;
  /** 마지막으로 키·마우스를 쓴 시각 — 어떤 장치를 쓰는지 HUD 판단용 */
  lastActive = 0;
  /**
   * Pointer Lock 을 쓸 수 없는 환경(iframe·내장 브라우저 등).
   * true 면 잠금 없이도 마우스 이동·버튼을 그대로 받는다 (열화 모드).
   */
  lockFailed = false;
  /** 게임이 시작돼 마우스를 받아도 되는지 (오버레이 중엔 false) */
  enabled = false;

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    this.lastActive = performance.now();
    this.keys.add(e.code);
    if (e.code.startsWith('Digit')) {
      const n = Number(e.code.slice(5));
      if (n >= 1 && n <= 9) this.slotSelect = n - 1;
    }
    if (e.code === 'F3') {
      this.toggleDebug = true;
      e.preventDefault();
    }
    if (e.code === 'Space' || e.code === 'Tab') e.preventDefault();
  };
  private readonly onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };
  private readonly onBlur = () => {
    this.keys.clear();
    this.primary = false;
    this.secondaryHold = false;
  };
  private readonly onMouseMove = (e: MouseEvent) => {
    if (!this.active) return;
    this.lookDX += e.movementX * MOUSE_SENS;
    this.lookDY += e.movementY * MOUSE_SENS;
  };
  private readonly onMouseDown = (e: MouseEvent) => {
    if (!this.active) return;
    this.lastActive = performance.now();
    if (e.button === 0) this.primary = true;
    if (e.button === 2) {
      this.secondaryHold = true;
      this.secondaryTap = true;
    }
  };
  private readonly onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.primary = false;
    if (e.button === 2) this.secondaryHold = false;
  };
  private readonly onWheel = (e: WheelEvent) => {
    if (!this.active) return;
    if (e.deltaY > 0) this.slotDelta++;
    else if (e.deltaY < 0) this.slotDelta--;
  };
  private readonly onContextMenu = (e: Event) => e.preventDefault();
  private readonly onLockError = () => {
    this.lockFailed = true;
  };

  constructor(private readonly element: HTMLElement) {
    document.addEventListener('pointerlockerror', this.onLockError);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('wheel', this.onWheel, { passive: true });
    document.addEventListener('contextmenu', this.onContextMenu);
  }

  get locked(): boolean {
    return document.pointerLockElement === this.element;
  }

  /** 마우스를 받을 상태: 잠금됨, 또는 잠금 불가 환경에서 게임 중 */
  get active(): boolean {
    return this.locked || (this.lockFailed && this.enabled);
  }

  /** 잠금 성공이면 true. 실패하면 lockFailed 를 켜고 false */
  async requestLock(): Promise<boolean> {
    if (this.locked) return true;
    if (!this.element.requestPointerLock) {
      this.lockFailed = true;
      return false;
    }
    const request = this.element.requestPointerLock as (o?: { unadjustedMovement: boolean }) => Promise<void> | void;
    try {
      // unadjustedMovement: 마우스 가속 없이 (지원 브라우저만)
      await request.call(this.element, { unadjustedMovement: true });
    } catch {
      try {
        await request.call(this.element);
      } catch {
        this.lockFailed = true;
        return false;
      }
    }
    // 브라우저에 따라 promise 없이 조용히 실패하기도 한다 → 잠시 뒤 확인
    await new Promise((r) => setTimeout(r, 50));
    if (!this.locked) {
      this.lockFailed = true;
      return false;
    }
    this.lockFailed = false;
    return true;
  }

  private down(...codes: string[]): boolean {
    for (const c of codes) if (this.keys.has(c)) return true;
    return false;
  }

  poll(out: InputState): void {
    if (this.down('KeyW', 'ArrowUp')) out.moveZ += 1;
    if (this.down('KeyS', 'ArrowDown')) out.moveZ -= 1;
    if (this.down('KeyD', 'ArrowRight')) out.moveX += 1;
    if (this.down('KeyA', 'ArrowLeft')) out.moveX -= 1;
    if (this.down('Space')) out.jump = true;
    if (this.down('ShiftLeft', 'ShiftRight')) out.sneak = true;
    if (this.down('ControlLeft', 'ControlRight')) out.sprint = true;
    out.lookDX += this.lookDX;
    out.lookDY += this.lookDY;
    this.lookDX = 0;
    this.lookDY = 0;
    if (this.primary) out.primary = true;
    if (this.secondaryHold) out.secondaryHold = true;
    if (this.secondaryTap) out.secondaryTap = true;
    this.secondaryTap = false;
    out.slotDelta += this.slotDelta;
    this.slotDelta = 0;
    if (this.slotSelect >= 0) out.slotSelect = this.slotSelect;
    this.slotSelect = -1;
    if (this.toggleDebug) out.toggleDebug = true;
    this.toggleDebug = false;
  }

  dispose(): void {
    document.removeEventListener('pointerlockerror', this.onLockError);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('contextmenu', this.onContextMenu);
  }
}
