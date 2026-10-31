/**
 * 철도·수레 (#237, 아빠 2026-10-31 마인크래프트 위키 "광산 수레").
 * 철도 블록은 옆 철도에 맞춰 곧게(ns·ew) 또는 굽게(ne·nw·se·sw) 이어진다 — 놓거나 부술 때 서버가 그 칸과 네 이웃을 다시 맞춘다(railShapeFor).
 * 수레는 철도 칸 가운데 줄을 따라서만 움직인다(advanceCart): 칸 가운데에서 다음 방향을 고르고, 굽은 철도에선 꺾인다. 오르막·전동 레일은 아직.
 * 순수 함수 — 클라(탄 사람이 움직임)와 테스트가 같이 쓴다.
 */
export const RAIL_DIRS = ['ns', 'ew', 'ne', 'nw', 'se', 'sw'] as const;
export type RailDir = (typeof RAIL_DIRS)[number];
export type Side = 'n' | 'e' | 's' | 'w';
const SIDE_VEC: Record<Side, readonly [number, number]> = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
const OPPOSITE: Record<Side, Side> = { n: 's', s: 'n', e: 'w', w: 'e' };
/** 철도 모양마다 이어지는 두 쪽 */
export const RAIL_CONNECTS: Record<RailDir, readonly [Side, Side]> = { ns: ['n', 's'], ew: ['e', 'w'], ne: ['n', 'e'], nw: ['n', 'w'], se: ['s', 'e'], sw: ['s', 'w'] };

/** 네 이웃에 철도가 있는지로 이 칸의 모양. 마주 보는 둘이 있으면 곧게, 아니면 굽게, 하나뿐이면 그쪽으로 곧게 */
export function railShapeFor(n: boolean, e: boolean, s: boolean, w: boolean): RailDir {
  if (n && s) return 'ns';
  if (e && w) return 'ew';
  if (n && e) return 'ne';
  if (n && w) return 'nw';
  if (s && e) return 'se';
  if (s && w) return 'sw';
  if (e || w) return 'ew';
  return 'ns';
}

/** 수레 최고 속도(칸/초)·가속·제동·저절로 느려짐 */
export const CART_MAX_SPEED = 8;
export const CART_ACCEL = 5;
export const CART_BRAKE = 10;
export const CART_FRICTION = 1.0;

export interface CartState {
  x: number;
  /** 철도 블록의 y (수레 바닥) */
  y: number;
  z: number;
  /** 가는 방향. 서 있으면 null */
  heading: Side | null;
  /** 칸/초, 0 이상 (뒤로 밀면 멈췄다가 방향이 바뀐다) */
  speed: number;
}

/**
 * 한 걸음(dt 초). railAt 은 그 칸의 철도 모양(없으면 null). want 는 탄 사람이 미는 방향(보는 쪽 × 스틱, 길이 0~1).
 * 가는 쪽으로 밀면 빨라지고, 반대로 밀면 느려지다 되돌아가고, 안 밀면 천천히 선다. 철도가 끝나면 마지막 칸 가운데에 선다
 */
export function advanceCart(st: CartState, dt: number, railAt: (bx: number, by: number, bz: number) => RailDir | null, want: { x: number; z: number }): void {
  const dir = railAt(Math.floor(st.x), st.y, Math.floor(st.z));
  if (!dir) {
    st.speed = 0;
    st.heading = null;
    return;
  }
  const wl = Math.hypot(want.x, want.z);
  if (st.heading === null) {
    if (wl < 0.1) return;
    const [a, b] = RAIL_CONNECTS[dir];
    const da = SIDE_VEC[a][0] * want.x + SIDE_VEC[a][1] * want.z;
    const db = SIDE_VEC[b][0] * want.x + SIDE_VEC[b][1] * want.z;
    st.heading = da >= db ? a : b;
  }
  const hv: readonly [number, number] = SIDE_VEC[st.heading];
  const push = wl < 0.1 ? 0 : hv[0] * want.x + hv[1] * want.z;
  if (push > 0.2) st.speed = Math.min(CART_MAX_SPEED, st.speed + CART_ACCEL * dt * push);
  else if (push < -0.2) {
    st.speed -= CART_BRAKE * dt * -push;
    if (st.speed < 0) {
      st.speed = 0.3;
      st.heading = OPPOSITE[st.heading];
    }
  } else st.speed = Math.max(0, st.speed - CART_FRICTION * dt);
  if (st.speed < 0.02) {
    st.speed = 0;
    return;
  }
  let remaining = st.speed * dt;
  for (let i = 0; i < 8 && remaining > 1e-6; i++) {
    const bx = Math.floor(st.x),
      bz = Math.floor(st.z);
    const here = railAt(bx, st.y, bz);
    if (!here) {
      st.speed = 0;
      break;
    }
    const h: Side = st.heading!;
    const [hx, hz] = SIDE_VEC[h];
    const cx = bx + 0.5,
      cz = bz + 0.5;
    if (hx !== 0) st.z = cz;
    else st.x = cx; // 가운데 줄에 맞춘다
    const dc = (cx - st.x) * hx + (cz - st.z) * hz; // 가운데까지 남은 거리 (가는 방향 기준)
    if (dc > 1e-6) {
      const m = Math.min(remaining, dc);
      st.x += hx * m;
      st.z += hz * m;
      remaining -= m;
      continue;
    }
    // 가운데: 들어온 쪽의 반대편으로 나간다 (굽은 철도면 꺾인다)
    const conn: readonly [Side, Side] = RAIL_CONNECTS[here];
    const ca: Side = conn[0],
      cb: Side = conn[1];
    const entry: Side = OPPOSITE[h];
    const exit: Side | null = ca === entry ? cb : cb === entry ? ca : ca === h || cb === h ? h : null;
    if (!exit) {
      st.x = cx;
      st.z = cz;
      st.speed = 0;
      break;
    }
    st.heading = exit;
    const [ex, ez] = SIDE_VEC[exit];
    if (!railAt(bx + ex, st.y, bz + ez)) {
      // 철도 끝 — 마지막 칸 가운데에 선다
      st.x = cx;
      st.z = cz;
      st.speed = 0;
      break;
    }
    const past = (st.x - cx) * ex + (st.z - cz) * ez;
    const m = Math.min(remaining, 1 - past + 1e-4);
    st.x += ex * m;
    st.z += ez * m;
    remaining -= m;
  }
}
