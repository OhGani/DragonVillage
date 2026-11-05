/**
 * 몹·사람이 서로 겹치지 않게 (아빠 2026-11-05 "몹, 캐릭터는 서로 겹치지 않게").
 * 몸을 세운 원기둥(반지름 r, 키 h, 발 y)으로 보고, 높이가 겹치는 둘이 수평으로 r 합보다 가까우면 밀어낸다.
 * - 서버: 몹끼리·동물끼리 `separationPushes` — 겹친 만큼을 무게 비율로 나눠 민다.
 * - 클라: 내 몸만 `pushOutOf` — 몹·동물은 서버가 움직이니 내가 다 비키고, 다른 사람과는 반씩.
 * 같은 자리에 딱 겹치면 번호로 정한 방향으로 민다 (`Math.random` 없이 늘 같은 결과).
 */

export interface SepBody {
  x: number;
  y: number;
  z: number;
  /** 반지름 (몸 폭의 반) */
  r: number;
  /** 키 */
  h: number;
  /** 무게 — 무거운 쪽이 덜 밀린다. 없으면 1 */
  mass?: number;
  /** 안 밀린다 (자는 보스·말 거는 중인 주민·서 있는 보트 …). 다른 쪽이 다 비킨다 */
  fixed?: boolean;
}

export interface Push {
  dx: number;
  dz: number;
}

/** 높이가 겹치나 (발~머리 구간) */
export function bodiesOverlapY(a: SepBody, b: SepBody): boolean {
  return a.y < b.y + b.h && b.y < a.y + a.h;
}

/** 딱 같은 자리일 때 미는 방향 (황금각으로 번호마다 다르게) */
function tieDir(i: number): Push {
  const ang = i * 2.399963;
  return { dx: Math.cos(ang), dz: Math.sin(ang) };
}

/**
 * 서로 밀어낼 몫: 결과[i] 는 i 가 움직일 거리. 한 번에 겹친 만큼을 다 푼다(가벼운 쪽이 더 많이).
 * 둘 다 fixed 면 그대로 둔다. maxStep 은 한 번에 움직이는 상한 (덩어리로 몰려 있을 때 튀지 않게)
 */
export function separationPushes(bodies: readonly SepBody[], maxStep = 0.5): Push[] {
  const out: Push[] = bodies.map(() => ({ dx: 0, dz: 0 }));
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i]!;
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j]!;
      if (a.fixed && b.fixed) continue;
      const min = a.r + b.r;
      const dx = b.x - a.x,
        dz = b.z - a.z;
      if (Math.abs(dx) >= min || Math.abs(dz) >= min) continue;
      const d = Math.hypot(dx, dz);
      if (d >= min || !bodiesOverlapY(a, b)) continue;
      const u = d > 1e-4 ? { dx: dx / d, dz: dz / d } : tieDir(i * 31 + j);
      const depth = min - d;
      const ma = a.mass ?? 1,
        mb = b.mass ?? 1;
      const shareA = a.fixed ? 0 : b.fixed ? 1 : mb / (ma + mb);
      const shareB = 1 - shareA;
      out[i]!.dx -= u.dx * depth * shareA;
      out[i]!.dz -= u.dz * depth * shareA;
      out[j]!.dx += u.dx * depth * shareB;
      out[j]!.dz += u.dz * depth * shareB;
    }
  }
  for (const p of out) {
    const l = Math.hypot(p.dx, p.dz);
    if (l > maxStep) {
      p.dx *= maxStep / l;
      p.dz *= maxStep / l;
    }
  }
  return out;
}

/**
 * 내 몸(me)이 others 에서 빠져나갈 거리. share(o) 는 그 겹침 중 내가 비킬 몫 (몹 1, 다른 사람 0.5).
 * 겹치지 않으면 { 0, 0 }. 여럿에 끼면 합을 maxStep 으로 자른다
 */
export function pushOutOf(me: SepBody, others: Iterable<SepBody>, share: (o: SepBody) => number = () => 1, maxStep = 0.25, seed = 0): Push {
  let px = 0,
    pz = 0,
    k = 0;
  for (const o of others) {
    k++;
    const min = me.r + o.r;
    const dx = me.x - o.x,
      dz = me.z - o.z;
    if (Math.abs(dx) >= min || Math.abs(dz) >= min) continue;
    const d = Math.hypot(dx, dz);
    if (d >= min || !bodiesOverlapY(me, o)) continue;
    const u = d > 1e-4 ? { dx: dx / d, dz: dz / d } : tieDir(seed + k);
    const depth = (min - d) * share(o);
    px += u.dx * depth;
    pz += u.dz * depth;
  }
  const l = Math.hypot(px, pz);
  if (l > maxStep) {
    px *= maxStep / l;
    pz *= maxStep / l;
  }
  return { dx: px, dz: pz };
}
