/**
 * 원정 밤의 몹 (M7-2): 좀비·크리퍼. 순수 함수 — 서버가 돌리고 클라는 그린다.
 *
 * - 원정지가 밤(`nightStartsAt`)이 되면 플레이어 12~24칸 거리, 어두운 잔디 위에 하나씩 생긴다(동시 최대 MOB_MAX).
 * - 좀비: 가장 가까운 사람을 향해 걷고 붙으면 물어 3 (1.2초마다). 크리퍼: 3칸 안에 들어오면 1.5초 부풀다 터진다(7, 멀수록 덜) —
 *   **블록은 안 부순다**(마을 보호 원칙과 같음), 플레이어·드래곤끼리는 절대 안 맞는다(아군 피해 없음).
 * - 때리기: 맨손 1, 도구는 등급이 높을수록. 죽으면 `mobs.json` 드롭 + `xp.json` 경험치. 드래곤 빔은 4×세기.
 * - 수치는 아빠 임시값 — `mobs.json` 에 hp/damage 가 생기면 그걸 읽는다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { hash3 } from '../math/prng';

export type MobKind = 'zombie' | 'creeper';
export const MOB_KINDS: readonly MobKind[] = ['zombie', 'creeper'];
export const MOB_KIND_NUM: Record<MobKind, number> = { zombie: 0, creeper: 1 };
export const MOB_KIND_OF: readonly MobKind[] = ['zombie', 'creeper'];

export interface MobDrop {
  item: string;
  min: number;
  max: number;
  /** 0~1 */
  chance: number;
}

export interface MobDef {
  readonly id: MobKind;
  readonly name: string;
  readonly hp: number;
  /** 근접 피해 (크리퍼는 폭발 피해) */
  readonly damage: number;
  /** 칸/초 */
  readonly speed: number;
  /** 이 거리 안이면 공격(좀비) / 부풀기 시작(크리퍼) */
  readonly reach: number;
  readonly attackEveryMs: number;
  /** 크리퍼만: 부푸는 시간·폭발 반지름 */
  readonly fuseMs: number;
  readonly explodeRadius: number;
  readonly drops: readonly MobDrop[];
  readonly xp: number;
}

const BASE: Record<MobKind, Omit<MobDef, 'drops' | 'xp' | 'name'>> = {
  zombie: { id: 'zombie', hp: 20, damage: 3, speed: 2.3, reach: 1.6, attackEveryMs: 1200, fuseMs: 0, explodeRadius: 0 },
  creeper: { id: 'creeper', hp: 20, damage: 7, speed: 2.6, reach: 3.0, attackEveryMs: 0, fuseMs: 1500, explodeRadius: 3.5 },
};

const MobFile = z
  .object({
    hostile: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          hp: z.number().optional(),
          damage: z.number().optional(),
          xp: z.number().optional(),
          drops: z.array(z.tuple([z.string(), z.tuple([z.number(), z.number()]), z.number()]).rest(z.unknown())).optional(),
        })
        .loose(),
    ),
  })
  .loose();

export class MobRegistry {
  constructor(readonly defs: Readonly<Record<MobKind, MobDef>>) {}
  get(kind: MobKind): MobDef {
    return this.defs[kind];
  }
}

/** mobs.json 에서 좀비·크리퍼의 이름·드롭·경험치를 읽고 나머지 수치는 기본값 (없는 몹은 기본값만) */
export function parseMobs(raw: unknown, xpByMob: ReadonlyMap<string, readonly [number, number]> | null = null, fileName = 'data/mobs.json'): MobRegistry {
  const result = MobFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const defs = {} as Record<MobKind, MobDef>;
  for (const kind of MOB_KINDS) {
    const src = result.data.hostile.find((h) => h.id === kind);
    const base = BASE[kind];
    const drops: MobDrop[] = (src?.drops ?? []).map(([item, [min, max], chance]) => ({ item, min, max, chance }));
    const xpRange = xpByMob?.get(kind);
    defs[kind] = {
      ...base,
      name: src?.name ?? kind,
      hp: src?.hp ?? base.hp,
      damage: src?.damage ?? base.damage,
      drops,
      xp: xpRange ? xpRange[0] : (src?.xp ?? 5),
    };
  }
  return new MobRegistry(defs);
}

export const MOB_MAX = 8;
export const SPAWN_MIN = 12;
export const SPAWN_MAX = 24;
export const SPAWN_EVERY_MS = 4000;
/** 몹 몸 판정 (넓이·높이) */
export const MOB_SIZE = { w: 0.6, h: 1.9 } as const;
/** 플레이어가 때릴 수 있는 거리(눈에서) */
export const HIT_REACH = 3.5;
export const HIT_COOLDOWN_MS = 450;

export const MOB_STATE = { walk: 0, attack: 1, fuse: 2 } as const;

export interface MobState {
  id: number;
  kind: MobKind;
  x: number;
  y: number;
  z: number;
  yaw: number;
  hp: number;
  /** MOB_STATE */
  state: number;
  /** 크리퍼: 부풀기 시작 시각 (0 = 아님) */
  fuseAt: number;
  lastAttackAt: number;
}

/** 통신용 (MobsState) */
export interface MobEntry {
  id: number;
  kind: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  hp: number;
  state: number;
}

/** 스폰 자리 뽑기 (결정론: 시드·차례·플레이어 번호). 사람에서 12~24칸, 방향은 무작위. groundAt 이 null 이면 못 선다 */
export function pickSpawn(seed: number, turn: number, around: { x: number; z: number }, groundAt: (x: number, z: number) => number | null): { x: number; y: number; z: number } | null {
  for (let i = 0; i < 6; i++) {
    const a = hash3(turn, i, 1, seed) * Math.PI * 2;
    const d = SPAWN_MIN + hash3(turn, i, 2, seed) * (SPAWN_MAX - SPAWN_MIN);
    const x = Math.floor(around.x + Math.cos(a) * d) + 0.5;
    const z = Math.floor(around.z + Math.sin(a) * d) + 0.5;
    const y = groundAt(x, z);
    if (y !== null) return { x, y, z };
  }
  return null;
}

/**
 * 몹 한 걸음 (dt 초). target 은 가장 가까운 사람의 발 위치. groundAt 으로 땅을 따라간다(한 칸 오르기까지).
 * 돌려주는 event: 'attack'(좀비가 물었다) · 'explode'(크리퍼가 터졌다) · null
 */
export function stepMob(m: MobState, def: MobDef, target: { x: number; y: number; z: number } | null, dt: number, now: number, groundAt: (x: number, z: number) => number | null): 'attack' | 'explode' | null {
  if (!target) {
    m.state = MOB_STATE.walk;
    m.fuseAt = 0;
    return null;
  }
  const dx = target.x - m.x,
    dz = target.z - m.z;
  const dist = Math.hypot(dx, dz);
  m.yaw = Math.atan2(-dx, -dz); // 플레이어 인형과 같은 규약: yaw 0 = -z 를 본다
  if (def.fuseMs > 0) {
    // 크리퍼
    if (dist <= def.reach && Math.abs(target.y - m.y) < 3) {
      if (m.fuseAt === 0) m.fuseAt = now;
      m.state = MOB_STATE.fuse;
      if (now - m.fuseAt >= def.fuseMs) return 'explode';
      return null;
    }
    m.fuseAt = 0;
    m.state = MOB_STATE.walk;
  } else if (dist <= def.reach && Math.abs(target.y - m.y) < 2) {
    m.state = MOB_STATE.attack;
    if (now - m.lastAttackAt >= def.attackEveryMs) {
      m.lastAttackAt = now;
      return 'attack';
    }
    return null;
  } else m.state = MOB_STATE.walk;
  // 걷기
  if (dist > 0.01) {
    const step = Math.min(dist, def.speed * dt);
    const nx = m.x + (dx / dist) * step,
      nz = m.z + (dz / dist) * step;
    const gy = groundAt(nx, nz);
    if (gy !== null && gy - m.y <= 1.05) {
      m.x = nx;
      m.z = nz;
      m.y = gy;
    }
  }
  return null;
}

/** 폭발 피해: 가운데 damage, 반지름에서 0 */
export function explosionDamage(dist: number, radius: number, damage: number): number {
  if (dist >= radius) return 0;
  return Math.max(1, Math.round(damage * (1 - dist / radius)));
}

/** 빔(from 에서 dir 로 range 칸)이 몹에 닿나 — 몹 가슴점과 선분 거리 */
export function beamHitsMob(from: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, range: number, m: { x: number; y: number; z: number }, radius: number): boolean {
  const cx = m.x - from.x,
    cy = m.y + MOB_SIZE.h * 0.5 - from.y,
    cz = m.z - from.z;
  const t = Math.max(0, Math.min(range, cx * dir.x + cy * dir.y + cz * dir.z));
  const px = from.x + dir.x * t,
    py = from.y + dir.y * t,
    pz = from.z + dir.z * t;
  return Math.hypot(m.x - px, m.y + MOB_SIZE.h * 0.5 - py, m.z - pz) <= radius;
}

/** 때리는 피해: 맨손 1, 도구 등급마다 +1.5 (나무 2 · 돌 4 · 철 5 · 다이아 7 · 네더라이트 8) */
export function hitDamage(toolTier: number | null): number {
  return Math.floor(1 + (toolTier ?? 0) * 1.5);
}

/** 드롭 뽑기 (결정론: 시드·몹 id) */
export function rollDrops(def: MobDef, seed: number, mobId: number): { item: string; count: number }[] {
  const out: { item: string; count: number }[] = [];
  def.drops.forEach((d, i) => {
    if (hash3(mobId, i, 7, seed) >= d.chance) return;
    const n = d.min + Math.floor(hash3(mobId, i, 8, seed) * (d.max - d.min + 1));
    if (n > 0) out.push({ item: d.item, count: n });
  });
  return out;
}
