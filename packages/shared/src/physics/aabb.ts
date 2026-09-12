/**
 * 축 분리 스윕 AABB — 물리 엔진 없음. 겹치는 복셀만 검사.
 * 몸은 발바닥 중심(pos)과 크기(가로 w, 높이 h)로 표현한다.
 */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BodySize {
  /** x·z 가로 폭 (플레이어 0.6) */
  w: number;
  /** 높이 (플레이어 1.8) */
  h: number;
}

export type SolidQuery = (x: number, y: number, z: number) => boolean;

export interface MoveResult {
  onGround: boolean;
  hitX: boolean;
  hitY: boolean;
  hitZ: boolean;
  hitCeiling: boolean;
}

const EPS = 1e-4;

/** 몸이 차지하는 복셀 범위 안에 solid 가 있으면 true */
export function bodyIntersects(isSolid: SolidQuery, pos: Vec3, size: BodySize): boolean {
  const hw = size.w / 2;
  const x0 = Math.floor(pos.x - hw + EPS),
    x1 = Math.floor(pos.x + hw - EPS);
  const y0 = Math.floor(pos.y + EPS),
    y1 = Math.floor(pos.y + size.h - EPS);
  const z0 = Math.floor(pos.z - hw + EPS),
    z1 = Math.floor(pos.z + hw - EPS);
  for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) if (isSolid(x, y, z)) return true;
  return false;
}

/** 블록 하나(정수 좌표)가 몸과 겹치는지 — 블록 놓기 금지 판정 */
export function bodyOverlapsBlock(pos: Vec3, size: BodySize, bx: number, by: number, bz: number): boolean {
  const hw = size.w / 2;
  return (
    bx + 1 > pos.x - hw + EPS &&
    bx < pos.x + hw - EPS &&
    by + 1 > pos.y + EPS &&
    by < pos.y + size.h - EPS &&
    bz + 1 > pos.z - hw + EPS &&
    bz < pos.z + hw - EPS
  );
}

/**
 * 한 축으로 d 만큼 옮기며 새로 들어가는 복셀 줄을 순서대로 검사한다.
 * 겹침이 있으면 그 면에 멈춘 위치를, 없으면 null 을 돌려준다.
 * axis: 0 x, 1 y, 2 z. min/max 는 그 축의 현재 몸 범위. a0..a1, b0..b1 은 나머지 두 축의 복셀 범위.
 */
function sweepAxis(
  isSolid: SolidQuery,
  axis: number,
  min: number,
  max: number,
  d: number,
  a0: number,
  a1: number,
  b0: number,
  b1: number,
): number | null {
  const test = (r: number): boolean => {
    for (let a = a0; a <= a1; a++)
      for (let b = b0; b <= b1; b++) {
        const hit = axis === 0 ? isSolid(r, a, b) : axis === 1 ? isSolid(a, r, b) : isSolid(a, b, r);
        if (hit) return true;
      }
    return false;
  };
  if (d > 0) {
    const lo = Math.floor(max - EPS) + 1,
      hi = Math.floor(max + d - EPS);
    for (let r = lo; r <= hi; r++) if (test(r)) return r;
  } else {
    const hi = Math.floor(min + EPS) - 1,
      lo = Math.floor(min + d + EPS);
    for (let r = hi; r >= lo; r--) if (test(r)) return r;
  }
  return null;
}

/**
 * pos 를 vel*dt 만큼 옮기되 복셀과 충돌하면 면에 멈춘다. pos·vel 을 제자리에서 바꾼다.
 * 순서: Y → X → Z (마인크래프트와 같음). 새로 들어가는 줄을 전부 검사하므로 빠르게 떨어져도 뚫리지 않는다.
 */
export function moveBody(isSolid: SolidQuery, pos: Vec3, size: BodySize, vel: Vec3, dt: number, out: MoveResult): void {
  out.onGround = false;
  out.hitX = out.hitY = out.hitZ = out.hitCeiling = false;
  const hw = size.w / 2;

  // ---- Y ----
  let d = vel.y * dt;
  if (d !== 0) {
    const x0 = Math.floor(pos.x - hw + EPS),
      x1 = Math.floor(pos.x + hw - EPS);
    const z0 = Math.floor(pos.z - hw + EPS),
      z1 = Math.floor(pos.z + hw - EPS);
    const r = sweepAxis(isSolid, 1, pos.y, pos.y + size.h, d, x0, x1, z0, z1);
    if (r === null) pos.y += d;
    else if (d > 0) {
      pos.y = r - size.h - EPS;
      vel.y = 0;
      out.hitY = out.hitCeiling = true;
    } else {
      pos.y = r + 1;
      vel.y = 0;
      out.hitY = out.onGround = true;
    }
  }

  // ---- X ----
  d = vel.x * dt;
  if (d !== 0) {
    const y0 = Math.floor(pos.y + EPS),
      y1 = Math.floor(pos.y + size.h - EPS);
    const z0 = Math.floor(pos.z - hw + EPS),
      z1 = Math.floor(pos.z + hw - EPS);
    const r = sweepAxis(isSolid, 0, pos.x - hw, pos.x + hw, d, y0, y1, z0, z1);
    if (r === null) pos.x += d;
    else {
      pos.x = d > 0 ? r - hw - EPS : r + 1 + hw + EPS;
      vel.x = 0;
      out.hitX = true;
    }
  }

  // ---- Z ----
  d = vel.z * dt;
  if (d !== 0) {
    const y0 = Math.floor(pos.y + EPS),
      y1 = Math.floor(pos.y + size.h - EPS);
    const x0 = Math.floor(pos.x - hw + EPS),
      x1 = Math.floor(pos.x + hw - EPS);
    const r = sweepAxis(isSolid, 2, pos.z - hw, pos.z + hw, d, x0, x1, y0, y1);
    if (r === null) pos.z += d;
    else {
      pos.z = d > 0 ? r - hw - EPS : r + 1 + hw + EPS;
      vel.z = 0;
      out.hitZ = true;
    }
  }
}

export interface StepUpResult {
  /** 올라간 높이 */
  dy: number;
  /** 턱 위에서 수평으로 움직인 뒤의 속도 (한 축이 막혔으면 0) */
  vx: number;
  vz: number;
}

const scratchMove: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };

/**
 * 자동 턱 오르기. moveBody 로 옮긴 뒤 수평 충돌이 있었을 때 부른다.
 * start = 이동 전 위치, pos = 이동 후 위치(충돌로 막힌). 시작 위치에서 maxStep 만큼 올라가 → 수평 이동 → 내려앉기를 시도해,
 * 원래보다 더 멀리 갔고 더 높은 바닥에 섰으면 pos 를 그 자리로 옮기고 결과를 준다. 아니면 null (pos 그대로).
 */
export function tryStepUp(
  isSolid: SolidQuery,
  start: Vec3,
  pos: Vec3,
  size: BodySize,
  vx: number,
  vz: number,
  dt: number,
  maxStep = 1,
): StepUpResult | null {
  if (dt <= 0 || (vx === 0 && vz === 0)) return null;
  const p: Vec3 = { x: start.x, y: start.y, z: start.z };
  const v: Vec3 = { x: 0, y: maxStep / dt, z: 0 };
  // 1) 위로 (머리 위 공간이 모자라면 포기)
  moveBody(isSolid, p, size, v, dt, scratchMove);
  if (p.y - start.y < maxStep - 0.05) return null;
  // 2) 턱 높이에서 수평 이동
  v.x = vx;
  v.y = 0;
  v.z = vz;
  moveBody(isSolid, p, size, v, dt, scratchMove);
  const movedTry = (p.x - start.x) ** 2 + (p.z - start.z) ** 2;
  const movedOrig = (pos.x - start.x) ** 2 + (pos.z - start.z) ** 2;
  if (movedTry <= movedOrig + 1e-9) return null;
  const hvx = v.x,
    hvz = v.z;
  // 3) 내려앉기 — 턱 위에 서야 성공
  v.x = 0;
  v.y = -(maxStep + 0.05) / dt;
  v.z = 0;
  moveBody(isSolid, p, size, v, dt, scratchMove);
  if (!scratchMove.onGround || p.y <= start.y + 1e-4) return null;
  const dy = p.y - start.y;
  pos.x = p.x;
  pos.y = p.y;
  pos.z = p.z;
  return { dy, vx: hvx, vz: hvz };
}

/** 발밑(아주 조금 아래)에 solid 가 있는지 — 웅크리기 낙하 방지·onGround 보조 */
export function hasGroundBelow(isSolid: SolidQuery, pos: Vec3, size: BodySize, probe = 0.05): boolean {
  const hw = size.w / 2;
  const y = Math.floor(pos.y - probe);
  const x0 = Math.floor(pos.x - hw + EPS),
    x1 = Math.floor(pos.x + hw - EPS);
  const z0 = Math.floor(pos.z - hw + EPS),
    z1 = Math.floor(pos.z + hw - EPS);
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) if (isSolid(x, y, z)) return true;
  return false;
}
