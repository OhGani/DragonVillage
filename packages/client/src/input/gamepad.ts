import type { InputSource, InputState } from './InputState';

const DEADZONE = 0.18;
const LOOK_RATE = 3.2; // 라디안/초 (스틱 끝까지)

/** 게임패드 기본 매핑 (표준 레이아웃). 선택 사항. */
export class GamepadInput implements InputSource {
  private prevButtons: boolean[] = [];
  lastActive = 0;

  private axis(v: number): number {
    const a = Math.abs(v);
    if (a < DEADZONE) return 0;
    return Math.sign(v) * ((a - DEADZONE) / (1 - DEADZONE));
  }

  poll(out: InputState, dt: number): void {
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    const gp = Array.from(pads).find((p): p is Gamepad => !!p && p.connected);
    if (!gp) return;
    const b = gp.buttons.map((x) => x.pressed);
    const edge = (i: number) => b[i] && !this.prevButtons[i];

    const mx = this.axis(gp.axes[0] ?? 0),
      mz = -this.axis(gp.axes[1] ?? 0);
    const lx = this.axis(gp.axes[2] ?? 0),
      ly = this.axis(gp.axes[3] ?? 0);
    if (mx || mz || lx || ly || b.some(Boolean)) this.lastActive = performance.now();

    out.moveX += mx;
    out.moveZ += mz;
    out.lookDX += lx * LOOK_RATE * dt;
    out.lookDY += ly * LOOK_RATE * dt;
    if (b[0]) out.jump = true; // A
    if (b[1]) out.sneak = true; // B
    if (b[10]) out.sprint = true; // L3
    if (b[7]) out.primary = true; // RT
    if (b[6]) out.secondaryHold = true; // LT
    if (edge(6)) out.secondaryTap = true;
    if (edge(5)) out.slotDelta += 1; // RB
    if (edge(4)) out.slotDelta -= 1; // LB
    if (edge(9)) out.toggleDebug = true; // Start
    this.prevButtons = b;
  }

  dispose(): void {
    /* 없음 */
  }
}
