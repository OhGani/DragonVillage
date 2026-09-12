/**
 * 모든 입력 장치(터치·키보드+마우스·게임패드)가 합쳐지는 공통 상태.
 * 매 프레임 InputManager 가 0 으로 비운 뒤 각 장치가 더한다.
 */
export interface InputState {
  /** 오른쪽 +1, 왼쪽 -1 */
  moveX: number;
  /** 앞 +1, 뒤 -1 */
  moveZ: number;
  /** 이번 프레임 시점 회전량 (라디안). 오른쪽·아래가 + */
  lookDX: number;
  lookDY: number;
  jump: boolean;
  sneak: boolean;
  sprint: boolean;
  /** 꾹 누름 = 부수기 */
  primary: boolean;
  /** 이번 프레임에 눌렀다(엣지) = 놓기 */
  secondaryTap: boolean;
  /** 계속 누르는 중 = 반복 놓기 */
  secondaryHold: boolean;
  /** 슬롯 휠 ±1 */
  slotDelta: number;
  /** 슬롯 직접 선택 0..8, 없으면 -1 */
  slotSelect: number;
  toggleDebug: boolean;
}

export function resetInput(s: InputState): void {
  s.moveX = 0;
  s.moveZ = 0;
  s.lookDX = 0;
  s.lookDY = 0;
  s.jump = false;
  s.sneak = false;
  s.sprint = false;
  s.primary = false;
  s.secondaryTap = false;
  s.secondaryHold = false;
  s.slotDelta = 0;
  s.slotSelect = -1;
  s.toggleDebug = false;
}

export function emptyInput(): InputState {
  const s = {} as InputState;
  resetInput(s);
  return s;
}

export interface InputSource {
  /** 자기 상태를 out 에 더하고, 엣지·델타는 비운다 */
  poll(out: InputState, dt: number): void;
  dispose(): void;
}
