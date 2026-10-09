/**
 * 원정 밤의 몹 (M7-2): 좀비·크리퍼, (M7-3) 거미. 순수 함수 — 서버가 돌리고 클라는 그린다.
 *
 * - 원정지가 밤(`nightStartsAt`)이 되면 플레이어 12~24칸 거리, 어두운 잔디 위에 하나씩 생긴다(동시 최대 MOB_MAX).
 * - 좀비: 가장 가까운 사람을 향해 걷고 붙으면 물어 3 (1.2초마다). 크리퍼: 3칸 안에 들어오면 1.5초 부풀다 터진다(7, 멀수록 덜) —
 *   **블록은 안 부순다**(마을 보호 원칙과 같음), 플레이어·드래곤끼리는 절대 안 맞는다(아군 피해 없음).
 * - 때리기: 맨손 1, 도구는 등급이 높을수록. 죽으면 `mobs.json` 드롭 + `xp.json` 경험치. 드래곤 빔은 4×세기.
 * - 거미(M7-3): 빠르고(3.4칸/초) 낮다. 물면 2 + 독 3초(초당 1). 벽 타기는 없다. 어느 원정지에 어떤 몹이 나오는지는 `expeditions.json nightMobs`.
 * - 거미 왕(M7-4, `bosses.json spider_king`): 동굴 거미 굴에서 잠자다 사람이 24칸 안에 오면 깨어난다. hp 200, 물면 4 + 독 4초, 8초마다 거미 둘 소환(최대 6).
 *   밀려나지 않는다. 죽으면 드롭은 **마을 창고**로, 경험치 80 은 원정에 있는 모두에게 (협동). 왕관은 아들 확인 뒤.
 * - 우민(M7-5, 마을 방어전): 변명자(도끼 4, #131)·약탈자(석궁, 6칸)·소환사(보스 hp 150, 변명자 소환). 드롭은 bosses.json evoker.minionDrops/drops.
 * - 수치는 아빠 임시값 — `mobs.json` 에 hp/damage/speed 가 있으면 그걸 읽는다 (좀비·스켈레톤은 아들 13차 "더 무섭게", 2026-10-06).
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { hash3 } from '../math/prng';

export type MobKind = 'zombie' | 'creeper' | 'spider' | 'spider_king' | 'vindicator' | 'pillager' | 'evoker' | 'skeleton' | 'cow' | 'pig' | 'sheep' | 'chicken' | 'dog' | 'husk' | 'enderman' | 'stray';
export const MOB_KINDS: readonly MobKind[] = ['zombie', 'creeper', 'spider', 'spider_king', 'vindicator', 'pillager', 'evoker', 'skeleton', 'cow', 'pig', 'sheep', 'chicken', 'dog', 'husk', 'enderman', 'stray'];
export const MOB_KIND_NUM: Record<MobKind, number> = { zombie: 0, creeper: 1, spider: 2, spider_king: 3, vindicator: 4, pillager: 5, evoker: 6, skeleton: 7, cow: 8, pig: 9, sheep: 10, chicken: 11, dog: 12, husk: 13, enderman: 14, stray: 15 };
export const MOB_KIND_OF: readonly MobKind[] = ['zombie', 'creeper', 'spider', 'spider_king', 'vindicator', 'pillager', 'evoker', 'skeleton', 'cow', 'pig', 'sheep', 'chicken', 'dog', 'husk', 'enderman', 'stray'];
/** 순한 동물 (마을, M8-1). 규칙은 animals.ts */
const PASSIVE_KINDS: readonly MobKind[] = ['cow', 'pig', 'sheep', 'chicken', 'dog'];

/** 굴 보스 (M7-4, 거미 왕). 보스는 밤 스폰 목록에 안 들어가고, 원정지 구조물(거미 굴)에 하나만. 소환사(M7-5)는 방어전 마지막 파도의 보스 */
export const BOSS_KIND: MobKind = 'spider_king';
export const BOSS_KINDS: readonly MobKind[] = ['spider_king', 'evoker'];
export function isBoss(kind: MobKind): boolean {
  return BOSS_KINDS.includes(kind);
}
/** 보스가 부르는 부하 */
export function bossMinionKind(kind: MobKind): MobKind {
  return kind === 'evoker' ? 'vindicator' : 'spider';
}
/** 우민 (마을 방어전 M7-5) */
export const RAIDER_KINDS: readonly MobKind[] = ['vindicator', 'pillager', 'evoker'];
/** 보스가 깨어나는 거리(칸) · 소환 주기 · 소환 수 · 살아 있는 부하 최대 */
export const BOSS_AGGRO_RANGE = 24;
export const BOSS_SUMMON_EVERY_MS = 8000;
export const BOSS_SUMMON_COUNT = 2;
export const BOSS_MINIONS_MAX = 6;

export function isMobKind(s: string): s is MobKind {
  return (MOB_KINDS as readonly string[]).includes(s);
}

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
  /** 거미만: 물면 이만큼 독 (초당 1) */
  readonly poisonMs: number;
  readonly drops: readonly MobDrop[];
  readonly xp: number;
  /** 순한 동물인가 (때리지 않으면 안 덤빈다) */
  readonly passive: boolean;
  /** 먹이 (mobs.json breedWith·followsWhenHolding). 들고 있으면 따라오고, 주면 사랑한다 */
  readonly food: readonly string[];
  /** 길들이는 아이템 (mobs.json tameWith) */
  readonly tameWith: readonly string[];
}

const BASE: Record<MobKind, Omit<MobDef, 'drops' | 'xp' | 'name' | 'passive' | 'food' | 'tameWith'>> = {
  zombie: { id: 'zombie', hp: 20, damage: 3, speed: 2.3, reach: 1.6, attackEveryMs: 1200, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  creeper: { id: 'creeper', hp: 20, damage: 7, speed: 2.6, reach: 3.0, attackEveryMs: 0, fuseMs: 1500, explodeRadius: 3.5, poisonMs: 0 },
  spider: { id: 'spider', hp: 16, damage: 2, speed: 3.4, reach: 1.9, attackEveryMs: 1000, fuseMs: 0, explodeRadius: 0, poisonMs: 3000 },
  spider_king: { id: 'spider_king', hp: 200, damage: 4, speed: 2.4, reach: 2.8, attackEveryMs: 1500, fuseMs: 0, explodeRadius: 0, poisonMs: 4000 },
  // 우민 (M7-5): 변명자는 도끼(세다), 약탈자는 석궁(6칸에서 쏜다, 화살 연출은 클라), 소환사는 보스 — 변명자를 부른다
  vindicator: { id: 'vindicator', hp: 24, damage: 4, speed: 2.6, reach: 1.8, attackEveryMs: 1200, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  pillager: { id: 'pillager', hp: 24, damage: 3, speed: 2.4, reach: 6, attackEveryMs: 2000, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  evoker: { id: 'evoker', hp: 150, damage: 3, speed: 2.2, reach: 2.0, attackEveryMs: 1500, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  // 스켈레톤 (M8-1): 활 — 6칸에서 쏜다(약탈자처럼). 뼈를 떨군다 → 강아지 길들이기
  skeleton: { id: 'skeleton', hp: 20, damage: 3, speed: 2.2, reach: 6, attackEveryMs: 2000, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  // 동물 (M8-1): 공격 없음. speed 는 따라올 때, 산책은 그 0.6배
  cow: { id: 'cow', hp: 10, damage: 0, speed: 1.8, reach: 0, attackEveryMs: 0, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  pig: { id: 'pig', hp: 10, damage: 0, speed: 1.8, reach: 0, attackEveryMs: 0, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  sheep: { id: 'sheep', hp: 8, damage: 0, speed: 1.8, reach: 0, attackEveryMs: 0, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  chicken: { id: 'chicken', hp: 4, damage: 0, speed: 1.6, reach: 0, attackEveryMs: 0, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  dog: { id: 'dog', hp: 8, damage: 0, speed: 2.6, reach: 0, attackEveryMs: 0, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  // 사막 (v1.1-1, #157): 허스크는 모래색 좀비(조금 느리다). 엔더맨은 키 크고 빠르지만 순간이동은 없다 — 엔더 진주 출처
  husk: { id: 'husk', hp: 20, damage: 3, speed: 2.1, reach: 1.6, attackEveryMs: 1200, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  enderman: { id: 'enderman', hp: 40, damage: 4, speed: 3.0, reach: 1.8, attackEveryMs: 1200, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
  // 설원 (v1.1-2, #160): 스트레이는 눈 덮인 스켈레톤 — 활은 같고 조금 느리다
  stray: { id: 'stray', hp: 20, damage: 3, speed: 2.0, reach: 6, attackEveryMs: 2000, fuseMs: 0, explodeRadius: 0, poisonMs: 0 },
};

const RawPassive = z
  .object({
    id: z.string(),
    name: z.string(),
    breedWith: z.string().optional(),
    followsWhenHolding: z.string().optional(),
    tameWith: z.union([z.string(), z.array(z.string())]).optional(),
    drops: z.array(z.tuple([z.string(), z.tuple([z.number(), z.number()]), z.number()]).rest(z.unknown())).optional(),
    xp: z.union([z.number(), z.tuple([z.number(), z.number()])]).optional(),
  })
  .loose();

const MobFile = z
  .object({
    passive: z.array(RawPassive).optional(),
    hostile: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          hp: z.number().optional(),
          damage: z.number().optional(),
          speed: z.number().optional(),
          xp: z.number().optional(),
          drops: z.array(z.tuple([z.string(), z.tuple([z.number(), z.number()]), z.number()]).rest(z.unknown())).optional(),
        })
        .loose(),
    ),
  })
  .loose();

/** bosses.json 에서 읽는 것 (midBosses 의 id·name·hp·drops·xp) */
const BossFile = z
  .object({
    midBosses: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string(),
            hp: z.number().optional(),
            xp: z.number().optional(),
            drops: z.array(z.object({ material: z.string(), count: z.number().int().min(1), chance: z.number().min(0).max(1) }).loose()).optional(),
            /** 부하 드롭 (소환사의 minionDrops: 우민 종류 → 드롭 표). _comment 같은 글도 섞여 있어 배열만 골라 쓴다 */
            minionDrops: z.record(z.string(), z.unknown()).optional(),
          })
          .loose(),
      )
      .optional(),
  })
  .loose();

const BOSS_NAME_KO: Partial<Record<MobKind, string>> = { spider_king: '거미 왕', evoker: '소환사' };
const BOSS_XP: Partial<Record<MobKind, number>> = { spider_king: 80, evoker: 100 };

function dropsFromRaw(raw: unknown): MobDrop[] {
  if (!Array.isArray(raw)) return [];
  const out: MobDrop[] = [];
  for (const d of raw) {
    if (!d || typeof d !== 'object') continue;
    const o = d as { material?: unknown; count?: unknown; chance?: unknown };
    if (typeof o.material !== 'string' || typeof o.count !== 'number') continue;
    out.push({ item: o.material, min: o.count, max: o.count, chance: typeof o.chance === 'number' ? o.chance : 1 });
  }
  return out;
}

export class MobRegistry {
  constructor(readonly defs: Readonly<Record<MobKind, MobDef>>) {}
  get(kind: MobKind): MobDef {
    return this.defs[kind];
  }
}

/**
 * mobs.json 에서 좀비·크리퍼·거미의 이름·드롭·경험치를 읽고 나머지 수치는 기본값 (없는 몹은 기본값만).
 * 보스(거미 왕)는 bosses.json(bossesRaw) 의 midBosses 에서 이름·hp·드롭·경험치를 읽는다.
 */
export function parseMobs(raw: unknown, xpByMob: ReadonlyMap<string, readonly [number, number]> | null = null, fileName = 'data/mobs.json', bossesRaw: unknown = null): MobRegistry {
  const result = MobFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  let bosses: z.infer<typeof BossFile>['midBosses'] = [];
  if (bossesRaw !== null) {
    const b = BossFile.safeParse(bossesRaw);
    if (!b.success) throw new DataError('data/bosses.json', b.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
    bosses = b.data.midBosses ?? [];
  }
  const defs = {} as Record<MobKind, MobDef>;
  for (const kind of MOB_KINDS) {
    const base = BASE[kind];
    if (isBoss(kind)) {
      const src = bosses.find((x) => x.id === kind);
      defs[kind] = {
        ...base,
        name: src?.name?.replace(/\s*\(.*\)\s*$/, '') ?? BOSS_NAME_KO[kind] ?? kind, // "소환사 (우민 보스)" → "소환사"
        hp: src?.hp ?? base.hp,
        drops: dropsFromRaw(src?.drops),
        xp: src?.xp ?? BOSS_XP[kind] ?? 80,
        passive: false,
        food: [],
        tameWith: [],
      };
      continue;
    }
    if (PASSIVE_KINDS.includes(kind)) {
      const src = (result.data.passive ?? []).find((h) => h.id === kind);
      const food = [...new Set([src?.breedWith, src?.followsWhenHolding, ...(kind === 'chicken' ? ['pumpkin_seeds', 'melon_seeds'] : [])].filter((x): x is string => typeof x === 'string'))];
      const tame = src?.tameWith === undefined ? [] : Array.isArray(src.tameWith) ? src.tameWith : [src.tameWith];
      const xpRange = xpByMob?.get(kind);
      defs[kind] = {
        ...base,
        name: src?.name ?? kind,
        drops: (src?.drops ?? []).map(([item, [min, max], chance]) => ({ item, min, max, chance })),
        xp: xpRange ? xpRange[0] : typeof src?.xp === 'number' ? src.xp : 1,
        passive: true,
        food,
        tameWith: tame,
      };
      continue;
    }
    const src = result.data.hostile.find((h) => h.id === kind);
    const evoker = bosses.find((x) => x.id === 'evoker');
    const minion = evoker?.minionDrops?.[kind];
    const drops: MobDrop[] = src ? (src.drops ?? []).map(([item, [min, max], chance]) => ({ item, min, max, chance })) : dropsFromRaw(minion);
    const xpRange = xpByMob?.get(kind);
    defs[kind] = {
      ...base,
      name: src?.name ?? kind,
      hp: src?.hp ?? base.hp,
      damage: src?.damage ?? base.damage,
      speed: src?.speed ?? base.speed,
      drops,
      xp: xpRange ? xpRange[0] : (src?.xp ?? 5),
      passive: false,
      food: [],
      tameWith: [],
    };
  }
  return new MobRegistry(defs);
}

export const MOB_MAX = 8;
export const SPAWN_MIN = 12;
export const SPAWN_MAX = 24;
export const SPAWN_EVERY_MS = 4000;
/** 몹 몸 판정 (넓이·높이) — 좀비·크리퍼. 거미는 넓고 낮다 */
export const MOB_SIZE = { w: 0.6, h: 1.9 } as const;
export const MOB_SIZES: Record<MobKind, { w: number; h: number }> = {
  zombie: MOB_SIZE,
  creeper: MOB_SIZE,
  spider: { w: 1.4, h: 0.9 },
  spider_king: { w: 2.8, h: 1.7 },
  vindicator: MOB_SIZE,
  pillager: MOB_SIZE,
  evoker: MOB_SIZE,
  skeleton: MOB_SIZE,
  cow: { w: 0.9, h: 1.4 },
  pig: { w: 0.9, h: 0.9 },
  sheep: { w: 0.9, h: 1.3 },
  chicken: { w: 0.4, h: 0.7 },
  dog: { w: 0.6, h: 0.85 },
  husk: MOB_SIZE,
  enderman: { w: 0.6, h: 2.9 },
  stray: MOB_SIZE,
};
export function mobSize(kind: MobKind | number): { w: number; h: number } {
  return MOB_SIZES[typeof kind === 'number' ? (MOB_KIND_OF[kind] ?? 'zombie') : kind];
}
/** 원거리 몹 (활·석궁): 닿는 거리가 이 이상이면 화살을 쏘는 것으로 본다 — 서버가 'arrow' 로 알리고 클라가 그린다 (M8-2) */
export const RANGED_REACH = 4;
export function isRangedMob(def: { reach: number }): boolean {
  return def.reach >= RANGED_REACH;
}
/** 독: 초당 1 */
export const POISON_EVERY_MS = 1000;
export const POISON_DAMAGE = 1;

/** 이 원정지에 나오는 몹 — expeditions.json nightMobs 중 아는 것만(보스 제외). 하나도 없으면 좀비·크리퍼 */
export function spawnKinds(nightMobs: readonly string[] | undefined): MobKind[] {
  const kinds = (nightMobs ?? []).filter(isMobKind).filter((k) => !isBoss(k) && !PASSIVE_KINDS.includes(k));
  return kinds.length ? [...new Set(kinds)] : ['zombie', 'creeper'];
}

/** 차례(turn)로 몹 고르기: 첫째가 셋에 둘, 나머지가 셋에 하나씩 돌아가며 */
export function pickKind(kinds: readonly MobKind[], turn: number): MobKind {
  if (kinds.length <= 1) return kinds[0] ?? 'zombie';
  if (turn % 3 !== 0) return kinds[0]!;
  return kinds[1 + (Math.floor(turn / 3) % (kinds.length - 1))]!;
}
/** 플레이어가 때릴 수 있는 거리(눈에서) */
export const HIT_REACH = 3.5;
export const HIT_COOLDOWN_MS = 450;

export const MOB_STATE = { walk: 0, attack: 1, fuse: 2, sleep: 3, summon: 4 } as const;

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

/** 발 높이 찾기: (x, z) 에서, nearY 가 있으면 그 근처(동굴처럼 층이 여럿일 때). 못 서면 null */
export type GroundAt = (x: number, z: number, nearY?: number) => number | null;

/** 한 차례에 자리를 몇 번 뽑아 보나 (동굴은 대부분 돌이라 넉넉히) */
export const SPAWN_TRIES = 12;

/** 스폰 자리 뽑기 (결정론: 시드·차례·플레이어 번호). 사람에서 12~24칸, 방향은 무작위, 사람 높이 근처. groundAt 이 null 이면 못 선다 */
export function pickSpawn(seed: number, turn: number, around: { x: number; y?: number; z: number }, groundAt: GroundAt): { x: number; y: number; z: number } | null {
  for (let i = 0; i < SPAWN_TRIES; i++) {
    const a = hash3(turn, i, 1, seed) * Math.PI * 2;
    const d = SPAWN_MIN + hash3(turn, i, 2, seed) * (SPAWN_MAX - SPAWN_MIN);
    const x = Math.floor(around.x + Math.cos(a) * d) + 0.5;
    const z = Math.floor(around.z + Math.sin(a) * d) + 0.5;
    const y = groundAt(x, z, around.y);
    if (y !== null) return { x, y, z };
  }
  return null;
}

/**
 * 몹 한 걸음 (dt 초). target 은 가장 가까운 사람의 발 위치. groundAt 으로 땅을 따라간다(한 칸 오르기까지).
 * 돌려주는 event: 'attack'(좀비가 물었다) · 'explode'(크리퍼가 터졌다) · null
 */
export function stepMob(m: MobState, def: MobDef, target: { x: number; y: number; z: number } | null, dt: number, now: number, groundAt: GroundAt): 'attack' | 'explode' | null {
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
    const gy = groundAt(nx, nz, m.y);
    if (gy !== null && gy - m.y <= 1.05 && m.y - gy <= 3) {
      // 한 칸까지 오르고, 세 칸까지만 내려간다 (깊은 구멍·용암엔 안 뛰어든다)
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
export function beamHitsMob(from: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, range: number, m: { x: number; y: number; z: number; kind?: MobKind }, radius: number): boolean {
  const h = m.kind ? mobSize(m.kind).h : MOB_SIZE.h;
  const cx = m.x - from.x,
    cy = m.y + h * 0.5 - from.y,
    cz = m.z - from.z;
  const t = Math.max(0, Math.min(range, cx * dir.x + cy * dir.y + cz * dir.z));
  const px = from.x + dir.x * t,
    py = from.y + dir.y * t,
    pz = from.z + dir.z * t;
  return Math.hypot(m.x - px, m.y + h * 0.5 - py, m.z - pz) <= radius;
}

/** 때리는 피해: 맨손 1, 도구 등급마다 +1.5 (나무 2 · 돌 4 · 철 5 · 다이아 7 · 네더라이트 8) */
export function hitDamage(toolTier: number | null): number {
  return Math.floor(1 + (toolTier ?? 0) * 1.5);
}

/** 손에 든 도구의 공격력: 검은 tools.json damage(나무 5 · 돌 6 · 철 7 · 금 5 · 다이아 8 · 네더라이트 9, #131), 곡괭이·도끼는 등급으로, 맨손 1 */
export function attackDamageOf(tool: { kind: string; tier: number; damage: number | null } | null): number {
  if (tool?.kind === 'sword' && tool.damage !== null) return Math.floor(tool.damage);
  return hitDamage(tool ? tool.tier : null);
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
