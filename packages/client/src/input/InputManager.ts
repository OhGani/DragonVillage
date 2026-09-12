import { type InputSource, type InputState, emptyInput, resetInput } from './InputState';

/** 여러 장치를 하나의 InputState 로 합친다 */
export class InputManager {
  readonly state: InputState = emptyInput();
  private readonly sources: InputSource[] = [];
  /** true 면 입력을 전부 무시 (일시정지·오버레이) */
  paused = false;

  add(src: InputSource): void {
    this.sources.push(src);
  }

  frame(dt: number): InputState {
    const s = this.state;
    resetInput(s);
    if (this.paused) {
      // 장치 내부 엣지는 비워 둔다
      const scratch = emptyInput();
      for (const src of this.sources) src.poll(scratch, dt);
      return s;
    }
    for (const src of this.sources) src.poll(s, dt);
    // 여러 장치 합산 시 범위 정리
    const len = Math.hypot(s.moveX, s.moveZ);
    if (len > 1) {
      s.moveX /= len;
      s.moveZ /= len;
    }
    return s;
  }

  dispose(): void {
    for (const src of this.sources) src.dispose();
    this.sources.length = 0;
  }
}
