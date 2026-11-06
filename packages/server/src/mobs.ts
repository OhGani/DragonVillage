/**
 * 몹 돌리기 (M7-2·M7-3·M7-4·M7-5): 밤이면 생기고, 사람을 쫓고, 물고, 터진다. 규칙은 shared/rules/mobs.ts, 여기는 세계·플레이어와 잇는 살.
 * 블록은 절대 안 부수고, 피해는 플레이어에게만 간다(몹끼리·드래곤은 없음 = 아군 피해 없음).
 * 어떤 몹이 나오는지는 원정지(`expeditions.json nightMobs`). 항상 어두운 원정지(동굴)는 처음부터 나온다. 거미가 물면 독(초당 1, 3초).
 * 맞은 몹은 때린 쪽 반대로 0.7칸 밀려나고(발 디딜 곳이 있을 때만), `mob hit` 에 피해 숫자(dmg)가 실린다 — 맞았다는 게 눈에 보이게 (#94).
 *
 * 무대(MobArena)는 원정지일 수도, 마을(방어전 M7-5)일 수도 있다. 방어전은 autoSpawn 을 끄고 파도마다 직접 spawnKind 로 넣으며,
 * 사람이 멀면 goal(깃대)로 걸어가게 한다.
 *
 * 좀비 주민 (#244): 좀비·허스크는 사람보다 가까운 주민(사막 마을)을 쫓아 물고, 주민 체력이 다하면 좀비 주민으로 바꾼다(번호 그대로). 황금 사과 → cure 상태로 45초 서서 떨다 주민으로.
 *
 * 보스 (M7-4, 거미 왕): 무대에 굴(den)이 있으면 시작할 때 굴 가운데서 잠들어 있다(state sleep). 사람이 24칸 안에 오면 깨어나
 * (`mob wake` + 알림), 쫓고 물고(독 4초), 8초마다 부하 둘을 옆에 소환(살아 있는 부하 6 까지). 밀려나지 않는다. 죽으면 hooks.bossDefeated —
 * 드롭은 마을 창고로, 경험치는 그 세계에 있는 모두에게. 방어전 소환사도 같은 보스 규칙(잠들지 않고, 변명자를 부른다).
 */
import {
  ANIMAL_FLAG,
  BOSS_AGGRO_RANGE,
  BOSS_KIND,
  BOSS_MINIONS_MAX,
  BOSS_SUMMON_COUNT,
  BOSS_SUMMON_EVERY_MS,
  type BlockRegistry,
  HIT_COOLDOWN_MS,
  HIT_REACH,
  MOB_KIND_NUM,
  MOB_MAX,
  MOB_STATE,
  type MobEntry,
  type MobKind,
  type MobRegistry,
  type MobState,
  POISON_DAMAGE,
  POISON_EVERY_MS,
  SPAWN_EVERY_MS,
  type VoxelWorld,
  ANGRY_MS,
  beamHitsMob,
  bossMinionKind,
  encodeMobsState,
  explosionDamage,
  isBoss,
  isRangedMob,
  mobSize,
  pickKind,
  pickSpawn,
  rollDrops,
  spawnKinds,
  stepMob, isLookingAt, hash3, separationPushes, type SepBody, isMobKind, isWild, WILD_FLEE_MS, WILD_HERD_R, WILD_LEASH, PUFF_R, isZombieKind, zombieVillagerRoll, CURE_MS, CURE_REWARD, MOB_POISON_EVERY_MS, MOB_SLOW_MUL, MOB_WEAK_MUL, SPLASH_RADIUS, type PotionOutcome } from '@dragon-village/shared';

/** 몹이 도는 무대 — 원정지(Expedition) 또는 마을(방어전) */
export interface MobArena {
  readonly world: VoxelWorld;
  readonly seed: number;
  /** 밤 시작 초 (0 = 항상 어두움). 방어전은 0 */
  readonly nightStartsAt: number;
  readonly nightMobs: readonly string[];
  /** 보스 자리 (있으면 시작 때 보스를 세운다 — 거미 왕은 잠들어서, 엔더 드래곤은 깨어서 떠 있다) */
  readonly den: { x: number; y: number; z: number } | null;
  /** 보스 종류 (expeditions.json boss.id). 없으면 거미 왕 */
  readonly boss?: MobKind | null;
  /** 시작부터 서 있는 몹 (#223 설원 눈 골렘) */
  readonly spawns?: readonly { kind: MobKind; x: number; y: number; z: number }[];
  /** 엔드 수정 자리 (#224): 남아 있는 수정만큼 엔더 드래곤이 회복한다 */
  readonly crystals?: readonly { x: number; y: number; z: number }[];
  /** 사냥 동물 (2026-11-05, expeditions.json wildAnimals): 종류 → 마릿수. 시작 때 무리로 푼다 */
  readonly wildAnimals?: Readonly<Record<string, number>>;
  /** 사람이 처음 서는 자리 — 사냥 동물은 여기서 WILD_SAFE_R 칸 밖에만 둔다 */
  readonly safe?: { x: number; y: number; z: number } | null;
  readonly ended: boolean;
  elapsedSec(now: number): number;
}

export interface MobSystemOptions {
  /** 밤에 저절로 생기나 (원정 true, 방어전 false) */
  autoSpawn: boolean;
  /** 사람을 쫓기 시작하는 거리. 그 밖이면 goal 로 (없으면 서성) */
  aggroRange: number;
  /** 사람이 멀 때 걸어갈 곳 (방어전 깃대) */
  goal: { x: number; y: number; z: number } | null;
  /** true 면 tick 이 MobsState 를 스스로 보내지 않는다 (마을이 동물과 합쳐 보낸다) */
  quiet: boolean;
  /** 첫 몹 번호 (#221): 마을에 방어전 우민과 주민이 부른 철 골렘이 같이 있을 때 번호가 안 겹치게 */
  firstId: number;
  /** 마지막 몹 번호 (마을 연어, 2026-11-06): 넘으면 firstId 부터 빈 번호를 다시 쓴다 — 오래 도는 체계가 동물 번호(40000~)를 넘보지 않게 */
  lastId?: number;
}

export interface MobTarget {
  idx: number;
  x: number;
  y: number;
  z: number;
  /** 눈높이 */
  eyeY: number;
  /** 시선 (#222 엔더맨 쳐다보기). 없으면 안 본다 */
  yaw?: number;
  pitch?: number;
}

export interface MobHooks {
  /** 이 무대에 있는 사람들 (now 를 주면 투명화 물약(#245)을 마신 사람은 뺀다) */
  players(now?: number): MobTarget[];
  hurt(idx: number, amount: number, cause: string, now: number): void;
  /** 피해 없이 밀기 (#223 눈 골렘 눈덩이): (x, z) 는 밀리는 방향 단위 벡터 */
  knock?(idx: number, x: number, z: number, now: number, why?: string): void;
  /** 이 무대 사람 모두에게 */
  broadcast(bytes: Uint8Array): void;
  json(obj: unknown): void;
  /** 드롭·경험치를 때린 사람에게 */
  reward(idx: number, drops: { item: string; count: number }[], xp: number, at: { x: number; y: number; z: number }, now: number): void;
  /** 보스가 깨어났다 (M7-4) */
  bossWake(kind: MobKind, at: { x: number; y: number; z: number }, now: number): void;
  /** 보스를 잡았다 (M7-4): 드롭은 마을 창고로, 경험치는 모두에게 */
  bossDefeated(kind: MobKind, drops: { item: string; count: number }[], xp: number, at: { x: number; y: number; z: number }, byIdx: number, now: number): void;
}

const STEP_MS = 100;
/** 맞으면 밀려나는 거리 */
const KNOCKBACK = 0.7;

/** 원정 동행 펫 (#147): 주인을 따라다니다 주인(또는 자기) 6칸 안에 몹이 오면 달려가 문다. 맞지는 않는다 (초5에게 펫이 죽는 건 억울하다) */
const PET_SPEED = 3.2;
const PET_FOLLOW_STOP = 1.6;
const PET_TELEPORT = 14;
const PET_AGGRO = 6;
const PET_REACH = 1.8;
const PET_BITE_MS = 1000;
const PET_DAMAGE = 3;

export interface Companion {
  /** ANIMAL_ID_BASE + 동물 id (마을 동물과 같은 번호) */
  id: number;
  kind: MobKind;
  /** 주인 플레이어 idx — 물어 잡으면 드롭·경험치는 주인에게 */
  owner: number;
  name: string | null;
  x: number;
  y: number;
  z: number;
  yaw: number;
  nextBiteAt: number;
  /** 지킴이 (#169, 철 골렘): 주인(owner -1) 대신 이 자리를 지킨다 — 가까운 몹을 때리고 돌아온다 */
  home?: { x: number; z: number };
  /** 한 번 때리는 피해 (없으면 펫 3) · 닿는 거리 (없으면 펫 1.8) */
  damage?: number;
  reach?: number;
}
/** 지킴이가 몹을 알아보는 거리 */
const GUARD_AGGRO = 20;
/** 좀비가 주민을 알아보는 거리 (#244) */
const VILLAGER_BITE_RANGE = 16;
const DEFAULT_OPTS: MobSystemOptions = { autoSpawn: true, aggroRange: 40, goal: null, quiet: false, firstId: 1 };
/** 엔더맨 (#222): 화나면 이 간격으로 사람 옆에 순간이동, 맞으면 반은 멀리 달아난다 */
const ENDER_TELEPORT_EVERY_MS = 3000;
const ENDER_NEAR = 2.5;
const ENDER_AWAY = 7;
/** 주민이 부른 철 골렘 (#221): 방어전 골렘(7)보다 약하게 — 초5가 4초 만에 죽지 않게. 3씩 2초마다 */
const GRUDGE_DAMAGE = 3;
/**
 * 사냥 동물 무리를 두는 고리 (사람 시작 자리에서 WILD_SAFE_R ~ WILD_NEAR_R 칸) · 세계 가장자리 여백.
 * 섬 전체에 흩었더니 30~90칸 밖이라 폰(보이는 거리 청크 5개)에서 하나도 안 보였다 (아빠 2026-11-05 "초원섬에서 동물 안 보임")
 */
const WILD_SAFE_R = 16;
const WILD_NEAR_R = 44;
/** 다시 채우는 주기 · 다시 채울 땐 사람에게서 이 거리 밖 (눈앞에서 갑자기 생기지 않게) */
const WILD_REFILL_MS = 20_000; // 45초 → 20초 (아빠 2026-11-06 "아직 적어")
const WILD_REFILL_MIN = 28;
const WILD_EDGE = 6;
const GRUDGE_ATTACK_MS = 2000;

export class MobSystem {
  readonly mobs = new Map<number, MobState>();
  /** 사냥 동물 (2026-11-05): 종류별 정한 수(expeditions.json wildAnimals) · 무리 번호 · 첫 방향 · 다시 채우기 시각·차례 */
  private readonly wildTargets: [MobKind, number][] = [];
  private herdNo = 0;
  private turn0 = 0;
  private lastWildRefill = 0;
  private wildTurn = 0;
  private nextId = 1;
  private lastSpawnAt = 0;
  private lastStepAt = 0;
  private turn = 0;
  private readonly lastHitAt = new Map<number, number>();
  /** 독에 걸린 사람: 끝나는 시각·다음 아픈 시각 */
  readonly poisoned = new Map<number, { until: number; nextAt: number }>();
  readonly kinds: readonly MobKind[];
  /** 보스 (굴이 있는 무대, 또는 spawnBoss 로 넣은 것). 죽으면 null */
  boss: MobState | null = null;
  bossAwake = false;
  private lastSummonAt = 0;
  /** 엔드 수정 회복 (#224): 마지막 회복 시각·마지막으로 센 수정 수 */
  private lastHealAt = 0;
  private lastCrystals = -1;
  /** 보스가 소환한 부하 id */
  readonly minions = new Set<number>();
  /** 원정에 따라온 펫 (#147) */
  readonly companions = new Map<number, Companion>();
  readonly opts: MobSystemOptions;

  constructor(
    private readonly e: MobArena,
    private readonly registry: BlockRegistry,
    private readonly defs: MobRegistry,
    private readonly hooks: MobHooks,
    opts: Partial<MobSystemOptions> = {},
  ) {
    this.opts = { ...DEFAULT_OPTS, ...opts };
    this.nextId = this.opts.firstId;
    this.kinds = spawnKinds(e.nightMobs);
    if (e.den) {
      const kind = e.boss ?? BOSS_KIND;
      const hover = this.defs.get(kind).hover ?? 0;
      const y = (this.groundAt(e.den.x + 0.5, e.den.z + 0.5, e.den.y) ?? e.den.y) + hover;
      this.spawnBoss(kind, e.den.x + 0.5, y, e.den.z + 0.5, false); // 24칸 안에 사람이 오면 깬다 (거미 왕·엔더 드래곤 같음)
    }
    for (const s of e.spawns ?? []) {
      const m = this.spawnKind(s.kind, s.x, this.groundAt(s.x, s.z, s.y) ?? s.y, s.z); // 시작부터 서 있는 몹 (#223 눈 골렘, #228 사막 주민)
      if (s.kind === 'villager') {
        m.yaw = Math.PI; // 집 문 앞에서 남쪽(마을 우물 쪽)을 본다
        m.home = { x: s.x, z: s.z }; // 집 둘레를 산책한다 (#229)
      }
    }
    this.spawnWild(e.wildAnimals ?? {}, e.safe ?? null);
  }

  /**
   * 사냥 동물 풀기 (2026-11-05): 종류마다 3~4마리 무리로(처음엔 2~3, 아빠 "아직 적어"), 땅(나뭇잎·통나무·물 위는 빼고) 위에.
   * 무리는 사람 시작 자리 둘레 WILD_SAFE_R ~ WILD_NEAR_R 칸 고리에 방향을 고르게 나눠(황금각) 둔다 — 포탈에서 둘러보면 보인다.
   * 그 고리에 땅이 없으면(물가) 조금씩 바깥으로 찾는다. 시작 자리를 모르면 세계 곳곳. 시드·무리 번호로 결정론
   */
  private spawnWild(animals: Readonly<Record<string, number>>, safe: { x: number; z: number } | null): void {
    this.turn0 = hash3(this.e.seed, 0, 0, 35) * Math.PI * 2; // 첫 무리 방향 (원정마다 다르게)
    for (const [id, n] of Object.entries(animals)) {
      if (!isMobKind(id) || !isWild(id) || n <= 0) continue;
      this.wildTargets.push([id, n]);
      let left = n;
      for (let tries = 0; left > 0 && tries < 40; tries++) left -= this.placeHerd(id, Math.min(left, hash3(this.e.seed, this.herdNo, 31, 7) < 0.5 ? 3 : 4), safe, WILD_SAFE_R + 2, WILD_NEAR_R - 2);
    }
  }

  /**
   * 무리 하나 놓기: around 둘레 rMin~rMax 칸 고리(무리 번호마다 황금각으로 돌린 방향)에서 설 땅을 찾아 size 마리. 놓은 수.
   * 고리에 땅이 없으면(물가) 스무 번 뒤부터 조금씩 바깥으로. around 가 없으면 세계 곳곳
   */
  private placeHerd(kind: MobKind, size: number, around: { x: number; z: number } | null, rMin: number, rMax: number): number {
    if (this.defs.get(kind).swim) return this.placeSchool(kind, size, around, rMin, rMax);
    const w = this.e.world;
    const h = this.herdNo++;
    let center: { x: number; y: number; z: number } | null = null;
    for (let a = 0; a < 40 && !center; a++) {
      let x: number, z: number;
      if (around) {
        const ang = this.turn0 + h * 2.399963 + a * 0.9;
        const r = rMin + hash3(this.e.seed, h, a, 36) * (rMax - rMin) + Math.max(0, a - 20) * 1.5;
        x = Math.floor(around.x + Math.cos(ang) * r) + 0.5;
        z = Math.floor(around.z + Math.sin(ang) * r) + 0.5;
        if (x < WILD_EDGE || z < WILD_EDGE || x > w.sizeX - WILD_EDGE || z > w.sizeZ - WILD_EDGE) continue;
      } else {
        x = WILD_EDGE + Math.floor(hash3(this.e.seed, h, a, 32) * (w.sizeX - WILD_EDGE * 2)) + 0.5;
        z = WILD_EDGE + Math.floor(hash3(this.e.seed, h, a, 33) * (w.sizeZ - WILD_EDGE * 2)) + 0.5;
      }
      const y = this.wildGround(x, z);
      if (y !== null) center = { x, y, z };
    }
    if (!center) return 0;
    let placed = 0;
    for (let k = 0; k < size; k++) {
      // 무리 곁 자리: 비탈·물가라 못 서면 방향을 돌려 네 번까지 (무리가 2마리로 줄지 않게)
      for (let t = 0; t < 4; t++) {
        const ang = hash3(this.e.seed, h, k, 34) * Math.PI * 2 + t * 1.6,
          r = k === 0 && t === 0 ? 0 : 1.2 + k * 0.6;
        const x = center.x + Math.cos(ang) * r,
          z = center.z + Math.sin(ang) * r;
        const y = r === 0 ? center.y : this.wildGround(x, z);
        if (y === null || Math.abs(y - center.y) > 2) continue;
        const m = this.spawnKind(kind, x, y, z);
        m.home = { x: center.x, z: center.z };
        m.yaw = ang;
        placed++;
        break;
      }
    }
    return placed;
  }

  /**
   * 물고기 떼 놓기 (연어, 2026-11-06): 깊이 2칸 이상인 물 칸(waterCells) 중 around 둘레 rMin~rMax 칸 → 없으면 80칸 안 → 어디든.
   * 떼는 가운데 칸 둘레 같은 높이의 물 칸에. 놓은 수
   */
  private placeSchool(kind: MobKind, size: number, around: { x: number; z: number } | null, rMin: number, rMax: number): number {
    const cells = this.waterCells();
    if (!cells.length) return 0;
    const h = this.herdNo++;
    const near = (lo: number, hi: number) => (around ? cells.filter((c) => { const d = Math.hypot(c.x + 0.5 - around.x, c.z + 0.5 - around.z); return d >= lo && d <= hi; }) : cells);
    let pool = near(rMin, rMax);
    if (!pool.length) pool = near(rMin, 80);
    if (!pool.length) pool = cells;
    const c = pool[Math.floor(hash3(this.e.seed, h, 0, 37) * pool.length)]!;
    let placed = 0;
    for (let k = 0; k < size; k++) {
      for (let t = 0; t < 6; t++) {
        const ang = hash3(this.e.seed, h, k * 7 + t, 38) * Math.PI * 2,
          r = k === 0 && t === 0 ? 0 : 0.8 + hash3(this.e.seed, h, k * 7 + t, 39) * 1.6;
        const x = c.x + 0.5 + Math.cos(ang) * r,
          z = c.z + 0.5 + Math.sin(ang) * r;
        if (!this.isWater(x, c.y - 1, z)) continue;
        const m = this.spawnKind(kind, x, c.y - 0.75, z); // 수면 바로 아래 칸 안에서 헤엄친다
        m.home = { x: c.x + 0.5, z: c.z + 0.5 };
        m.yaw = ang;
        placed++;
        break;
      }
    }
    return placed;
  }

  private waterCache: { x: number; y: number; z: number }[] | null = null;
  /** 물고기가 살 물 칸: 위에서 처음 만나는 게 물(수면 y)이고 그 아래도 물인 기둥. 한 번만 훑는다 (물이 바뀌어도 헤엄칠 때 다시 본다) */
  private waterCells(): { x: number; y: number; z: number }[] {
    if (this.waterCache) return this.waterCache;
    const w = this.e.world;
    const out: { x: number; y: number; z: number }[] = [];
    for (let x = WILD_EDGE; x < w.sizeX - WILD_EDGE; x++)
      for (let z = WILD_EDGE; z < w.sizeZ - WILD_EDGE; z++)
        for (let y = Math.min(w.sizeY - 2, 90); y >= 2; y--) {
          const id = w.getBlock(x, y, z);
          if (id === 0) continue;
          const b = this.registry.get(id);
          if (b.fluid === 'water' && this.registry.get(w.getBlock(x, y - 1, z)).fluid === 'water') out.push({ x, y, z });
          break;
        }
    this.waterCache = out;
    return out;
  }

  private isWater(x: number, y: number, z: number): boolean {
    const w = this.e.world;
    const bx = Math.floor(x),
      by = Math.floor(y),
      bz = Math.floor(z);
    return w.inBounds(bx, by, bz) && this.registry.get(w.getBlock(bx, by, bz)).fluid === 'water';
  }

  /** 헤엄 한 걸음 (연어): 목표 쪽으로, 다음 자리가 물 칸일 때만 간다. 막혔으면 false. 높이는 그대로(수면 아래 한 칸) */
  private swimToward(m: MobState, tx: number, tz: number, speed: number, dt: number): boolean {
    const dx = tx - m.x,
      dz = tz - m.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.05) return true;
    const step = Math.min(d, speed * dt);
    const nx = m.x + (dx / d) * step,
      nz = m.z + (dz / d) * step;
    m.yaw = Math.atan2(-dx, -dz);
    m.state = MOB_STATE.walk;
    // 몸 앞쪽(0.35칸)까지 물이어야 — 둑에 머리를 박지 않는다
    if (!this.isWater(nx, m.y + 0.2, nz) || !this.isWater(nx + (dx / d) * 0.35, m.y + 0.2, nz + (dz / d) * 0.35)) return false;
    m.x = nx;
    m.z = nz;
    return true;
  }

  /**
   * 물고기 한 걸음 (2026-11-06): 맞았으면 fleeDir 로 1.6배 빠르게(막히면 꺾는다), 아니면 집 둘레 2~6칸 물 칸을 천천히 돈다.
   * 복어(puff)는 사람이 PUFF_R 칸 안에 오면 그 자리에서 부풀고(state attack), 부푼 채 reach 안이면 따끔 + 독
   */
  private stepSwim(m: MobState, def: ReturnType<MobRegistry['get']>, dt: number, now: number, players: MobTarget[]): void {
    if (!this.isWater(m.x, m.y + 0.2, m.z)) {
      // 물이 없어졌다(퍼낸 곳) — 그 자리에서 끝 (땅 위 물고기는 없다)
      this.vanish(m);
      return;
    }
    if (def.puff) {
      let near: MobTarget | null = null,
        nd = Infinity;
      for (const p of players) {
        const d = Math.hypot(p.x - m.x, p.y + 0.9 - m.y, p.z - m.z);
        if (d < nd) {
          nd = d;
          near = p;
        }
      }
      if (near && nd <= PUFF_R) {
        m.state = MOB_STATE.attack; // 부풀었다
        m.wanderTo = null;
        m.yaw = Math.atan2(-(near.x - m.x), -(near.z - m.z));
        if (nd <= def.reach + 0.4 && now - m.lastAttackAt >= def.attackEveryMs) {
          m.lastAttackAt = now;
          if (def.damage > 0) this.hooks.hurt(near.idx, def.damage, m.kind, now);
          if (def.poisonMs > 0) this.poisoned.set(near.idx, { until: now + def.poisonMs, nextAt: now + POISON_EVERY_MS });
        }
        return;
      }
    }
    m.state = MOB_STATE.walk;
    if ((m.fleeUntil ?? 0) > now && m.fleeDir) {
      if (!this.swimToward(m, m.x + m.fleeDir.x * 4, m.z + m.fleeDir.z * 4, def.speed * 1.6, dt)) {
        const a = Math.atan2(m.fleeDir.z, m.fleeDir.x) + (hash3(m.id, Math.floor(now / 300), 43, this.e.seed) < 0.5 ? 1.3 : -1.3);
        m.fleeDir = { x: Math.cos(a), z: Math.sin(a) };
      }
      m.home = { x: m.x, z: m.z };
      m.wanderTo = null;
      return;
    }
    const home = m.home ?? { x: m.x, z: m.z };
    if (!m.wanderTo && now >= (m.wanderAt ?? 0)) {
      const a = hash3(m.id, Math.floor(now / 500), 44, this.e.seed) * Math.PI * 2,
        r = 2 + hash3(m.id, Math.floor(now / 500), 45, this.e.seed) * 4;
      m.wanderTo = { x: home.x + Math.cos(a) * r, y: m.y, z: home.z + Math.sin(a) * r };
      m.wanderAt = now + 1500 + hash3(m.id, Math.floor(now / 500), 46, this.e.seed) * 3000;
    }
    if (m.wanderTo) {
      const ok = this.swimToward(m, m.wanderTo.x, m.wanderTo.z, def.speed * 0.5, dt);
      if (!ok || Math.hypot(m.wanderTo.x - m.x, m.wanderTo.z - m.z) < 0.3) m.wanderTo = null;
    }
  }

  /**
   * 사냥 동물 다시 채우기 (아빠 2026-11-06 "라쿤 2마리만 — 너무 적다"): WILD_REFILL_MS 마다, 정한 수보다 적은 종류 하나에
   * 무리 하나(3~4마리)를 사람 한 명(차례로) 둘레 WILD_REFILL_MIN~WILD_NEAR_R 칸에 — 눈앞에서 갑자기 생기지 않게 조금 멀리
   */
  private refillWild(players: MobTarget[], now: number): void {
    if (!this.wildTargets.length || !players.length || this.e.ended) return;
    if (this.lastWildRefill === 0 || this.lastWildRefill > now) this.lastWildRefill = now;
    if (now - this.lastWildRefill < WILD_REFILL_MS) return;
    this.lastWildRefill = now;
    for (let i = 0; i < this.wildTargets.length; i++) {
      const [kind, target] = this.wildTargets[(this.wildTurn + i) % this.wildTargets.length]!;
      const need = target - this.countOf(kind);
      if (need <= 0) continue;
      this.wildTurn = (this.wildTurn + i + 1) % this.wildTargets.length; // 다음엔 다른 종류부터
      const p = players[this.herdNo % players.length]!;
      this.placeHerd(kind, Math.min(need, hash3(this.e.seed, this.herdNo, 31, 7) < 0.5 ? 3 : 4), p, WILD_REFILL_MIN, WILD_NEAR_R);
      return;
    }
  }

  /** 사냥 동물이 설 땅: 하늘에서 내려오며 나뭇잎·통나무(나무 위)는 지나치고, 물 위·위가 막힌 곳은 못 선다 */
  private wildGround(x: number, z: number): number | null {
    const bx = Math.floor(x),
      bz = Math.floor(z);
    const w = this.e.world;
    if (!w.inBounds(bx, 0, bz)) return null;
    for (let y = Math.min(w.sizeY - 3, 90); y >= 1; y--) {
      const here = this.registry.get(w.getBlock(bx, y, bz));
      if (here.fluid) return null; // 물·용암 위
      if (!here.solid) continue;
      if (here.id.includes('leaves') || here.id.endsWith('_log') || here.id === 'log') continue; // 나무 위가 아니라 그 밑 땅
      const a1 = this.registry.get(w.getBlock(bx, y + 1, bz)),
        a2 = this.registry.get(w.getBlock(bx, y + 2, bz));
      return !a1.solid && !a2.solid && !a1.fluid && !a2.fluid ? y + 1 : null;
    }
    return null;
  }

  /** 밤인가 (항상 어두운 무대는 언제나) */
  isNight(now: number): boolean {
    return this.e.nightStartsAt <= 0 || this.e.elapsedSec(now) >= this.e.nightStartsAt;
  }

  /** 보스·주민(순한 것)을 빼고 몇 마리 — 밤 스폰 상한(MOB_MAX)에 세는 수. 사막 마을 주민 8이 상한을 다 차지해 밤 몹이 하나도 안 나오던 것 (#244 에서 고침) */
  get regularCount(): number {
    let n = 0;
    for (const m of this.mobs.values()) if (m !== this.boss && !this.defs.get(m.kind).passive && !isWild(m.kind)) n++; // 사냥 동물도 안 센다 (2026-11-05)
    return n;
  }

  /**
   * 그 자리의 발 높이. nearY 를 주면 그 근처(위 2칸 ~ 아래 6칸)에서 위가 두 칸 비어 있는 첫 단단한 블록 위 — 동굴처럼 층이 여럿일 때.
   * 없으면 하늘에서 내려오며 첫 단단한 블록(초원 섬·마을). 못 서면 null
   */
  groundAt = (x: number, z: number, nearY?: number): number | null => {
    const bx = Math.floor(x),
      bz = Math.floor(z);
    const w = this.e.world;
    if (!w.inBounds(bx, 0, bz)) return null;
    const standable = (y: number): boolean => {
      const here = this.registry.get(w.getBlock(bx, y, bz));
      if (!here.solid || here.fluid) return false;
      const a1 = this.registry.get(w.getBlock(bx, y + 1, bz));
      const a2 = this.registry.get(w.getBlock(bx, y + 2, bz));
      return !a1.solid && !a2.solid && !a1.fluid && !a2.fluid;
    };
    if (nearY !== undefined) {
      const y0 = Math.floor(nearY);
      for (let y = Math.min(w.sizeY - 3, y0 + 2); y >= Math.max(1, y0 - 6); y--) if (standable(y)) return y + 1;
      return null;
    }
    for (let y = Math.min(w.sizeY - 3, 90); y >= 1; y--) {
      const here = this.registry.get(w.getBlock(bx, y, bz));
      if (!here.solid || here.fluid) continue;
      return standable(y) ? y + 1 : null; // 위가 막혀 있으면 못 선다
    }
    return null;
  };

  /** 몹 하나 넣기 (방어전 파도·소환). 모두에게 spawn 알림 */
  spawnKind(kind: MobKind, x: number, y: number, z: number): MobState {
    if (this.opts.lastId !== undefined && this.nextId > this.opts.lastId) this.nextId = this.opts.firstId;
    while (this.mobs.has(this.nextId)) this.nextId++;
    const id = this.nextId++;
    const m: MobState = { id, kind, x, y, z, yaw: 0, hp: this.defs.get(kind).hp, state: 0, fuseAt: 0, lastAttackAt: 0 };
    this.mobs.set(id, m);
    this.hooks.json({ t: 'mob', ev: 'spawn', id, mob: kind, x, y, z });
    return m;
  }

  /** 보스 넣기. asleep 이면 가까이 올 때까지 잔다 (거미 왕), 아니면 바로 덤빈다 (소환사) */
  spawnBoss(kind: MobKind, x: number, y: number, z: number, awake: boolean): MobState {
    const id = this.nextId++;
    const m: MobState = { id, kind, x, y, z, yaw: 0, hp: this.defs.get(kind).hp, state: awake ? MOB_STATE.walk : MOB_STATE.sleep, fuseAt: 0, lastAttackAt: 0 };
    this.mobs.set(id, m);
    this.boss = m;
    this.bossAwake = awake;
    this.lastSummonAt = 0;
    this.hooks.json({ t: 'mob', ev: 'spawn', id, mob: kind, x, y, z });
    return m;
  }

  /** 살아 있는 몹 수 (종류별) */
  countOf(kind: MobKind): number {
    let n = 0;
    for (const m of this.mobs.values()) if (m.kind === kind) n++;
    return n;
  }

  tick(now: number): void {
    const players = this.hooks.players(now);
    if (this.opts.autoSpawn && this.isNight(now) && !this.e.ended && players.length && this.regularCount < MOB_MAX && now - this.lastSpawnAt >= SPAWN_EVERY_MS) {
      this.lastSpawnAt = now;
      this.turn++;
      const around = players[this.turn % players.length]!;
      const spot = pickSpawn(this.e.seed, this.turn, around, this.groundAt);
      if (spot) {
        let kind = pickKind(this.kinds, this.turn);
        if (isZombieKind(kind) && kind !== 'zombie_villager' && zombieVillagerRoll(this.e.seed, this.turn)) kind = 'zombie_villager'; // 좀비·허스크 여덟에 하나는 좀비 주민 (#244)
        this.spawnKind(kind, spot.x, spot.y, spot.z);
      }
    }
    this.tickBoss(players, now);
    this.refillWild(players, now);
    this.tickPoison(players, now);
    this.tickMobPotions(now);
    if (this.mobs.size === 0 && this.companions.size === 0) return;
    if (now - this.lastStepAt >= STEP_MS) {
      const dt = Math.min(0.5, (now - (this.lastStepAt || now - STEP_MS)) / 1000);
      this.lastStepAt = now;
      this.stepCompanions(players, dt, now);
      for (const m of [...this.mobs.values()]) {
        if (m === this.boss && !this.bossAwake) continue; // 잠든 보스는 안 움직인다
        if (m.cureAt !== undefined) {
          // 좀비 주민이 황금 사과를 먹었다 (#244): 돌아올 때까지 서서 떤다
          if (now >= m.cureAt) this.cureDone(m, now);
          else m.state = MOB_STATE.cure;
          continue;
        }
        const def0 = this.defs.get(m.kind);
        const def = (m.slowUntil ?? 0) > now ? { ...def0, speed: def0.speed * MOB_SLOW_MUL } : def0; // 감속 물약 (#245)
        let target: MobTarget | null = null;
        let best = Infinity;
        for (const p of players) {
          const d = Math.hypot(p.x - m.x, p.z - m.z);
          if (d < best) {
            best = d;
            target = p;
          }
        }
        if (best > this.opts.aggroRange) target = null; // 너무 멀면 서성이거나 goal 로
        if (isWild(m.kind)) {
          // 사냥 동물 (2026-11-05): 달아나거나 산책했으면 끝, 덤빌 사람이 있으면 아래 공통 공격으로
          target = this.stepWild(m, def, players, dt, now);
          if (!target) continue;
          best = Math.hypot(target.x - m.x, target.z - m.z);
        }
        if (m.grudge !== undefined) {
          // 주민이 부른 철 골렘 (#221): 주민을 때린 사람만 쫓고, 그 사람이 없어지거나 시간이 지나면 사라진다
          target = players.find((p) => p.idx === m.grudge) ?? null;
          if (!target || (m.despawnAt !== undefined && now >= m.despawnAt)) {
            this.vanish(m);
            continue;
          }
        }
        if (m.kind === 'enderman' && (m.angryUntil ?? 0) < now) {
          // 엔더맨 (#222, 아들 14차 2번): 쳐다보면 화난다
          for (const p of players)
            if (p.yaw !== undefined && p.pitch !== undefined && isLookingAt({ x: p.x, z: p.z, eyeY: p.eyeY, yaw: p.yaw, pitch: p.pitch }, m)) {
              m.angryUntil = now + ANGRY_MS;
              this.hooks.json({ t: 'mob', ev: 'stare', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
              break;
            }
        }
        if (def.neutral && (m.angryUntil ?? 0) < now) target = null; // 중립(좀비 피글린·엔더맨·눈 골렘): 맞기 전엔 가만히 (#161)
        if (target && m.kind === 'enderman') this.teleportNear(m, target, now);
        if (m.kind === 'villager' && (m.busyUntil ?? 0) > now) {
          // 말 걸거나 거래 중 (#233): 서서 그 사람을 본다
          const p = players.find((t) => t.idx === m.busyWith);
          if (p) m.yaw = Math.atan2(-(p.x - m.x), -(p.z - m.z));
          m.wanderTo = null;
          continue;
        }
        if (!target && m.kind === 'villager' && m.home) {
          this.wander(m, def, dt, now); // 원정 주민 산책 (#229, 아빠 "주민이 집에만 있어")
          continue;
        }
        if (isZombieKind(m.kind) && m.kind !== 'zombie_villager') {
          // 좀비·허스크는 사람보다 가까운 주민을 문다 (#244, 아들 7차 "주민이 좀비에게 물리면 좀비 주민"). 좀비 주민은 사람만 — 연쇄로 마을이 비지 않게
          let victim: MobState | null = null;
          let vd = Math.min(target ? best : Infinity, VILLAGER_BITE_RANGE); // 주민은 이 거리 안에 있을 때만 (마을 전체가 한 밤에 다 물리지 않게)
          for (const v of this.mobs.values()) {
            if (v.kind !== 'villager') continue;
            const d = Math.hypot(v.x - m.x, v.z - m.z);
            if (d < vd) {
              vd = d;
              victim = v;
            }
          }
          if (victim) {
            if (stepMob(m, def, victim, dt, now, this.groundAt) === 'attack') this.biteVillager(victim, def.damage, now);
            continue;
          }
        }
        if (target) {
          const ev = stepMob(m, m.grudge !== undefined ? { ...def, damage: GRUDGE_DAMAGE, attackEveryMs: GRUDGE_ATTACK_MS } : def, target, dt, now, this.groundAt);
          if (ev === 'attack') {
            // 원거리 몹은 화살이 날아가는 그림을 먼저 (피해는 바로)
            if (isRangedMob(def)) this.hooks.json({ t: 'arrow', from: { x: m.x, y: m.y + mobSize(m.kind).h * 0.8, z: m.z }, to: { x: target.x, y: target.eyeY - 0.3, z: target.z }, fire: m.kind === 'ghast' || m.kind === 'blaze', snow: m.kind === 'snow_golem', sonic: m.kind === 'giant_warden' }); // 가스트·블레이즈는 불덩이 (#173), 눈 골렘은 눈덩이 (#223), 거대 워든은 음파 (#254)
            if (def.damage > 0) this.hooks.hurt(target.idx, m.grudge !== undefined ? GRUDGE_DAMAGE : (m.weakUntil ?? 0) > now ? Math.max(1, Math.floor(def.damage * MOB_WEAK_MUL)) : def.damage, m.kind, now); // 나약함 물약 (#245)
            if (def.damage <= 0 || def.knock) {
              // 눈 골렘 눈덩이 (#223): 안 아프고 밀려나기만. 고릴라 (#253): 아프고 나서 밀려난다
              const kx = target.x - m.x,
                kz = target.z - m.z;
              const kd = Math.hypot(kx, kz) || 1;
              this.hooks.knock?.(target.idx, kx / kd, kz / kd, now, def.knock ? 'gorilla' : 'snow');
            }
            if (def.poisonMs > 0) this.poisoned.set(target.idx, { until: now + def.poisonMs, nextAt: now + POISON_EVERY_MS });
          } else if (ev === 'explode') this.explode(m, def, players, now);
        } else if (this.opts.goal) {
          // 깃대로 걸어간다 — 닿아도 '공격' 은 없다 (블록은 안 부순다)
          const g = this.opts.goal;
          if (Math.hypot(g.x - m.x, g.z - m.z) > 1.2) stepMob(m, { ...def, reach: 0, fuseMs: 0 }, g, dt, now, this.groundAt);
          else m.state = MOB_STATE.walk;
        } else stepMob(m, def, null, dt, now, this.groundAt);
      }
      this.separate(now);
    }
    if (!this.opts.quiet) this.hooks.broadcast(encodeMobsState(this.entries()));
  }

  /**
   * 서로 겹치지 않게 (아빠 2026-11-05 "몹, 캐릭터는 서로 겹치지 않게"): 몹·동행 펫·지킴이끼리 몸 폭만큼 밀어낸다.
   * 큰 몸(거미 왕·철 골렘)은 덜 밀리고, 잠든 보스·돌아오는 좀비 주민·말 거는 중인 주민은 안 밀린다.
   * 떠 있는 몹(가스트·엔더 드래곤)은 빼고, 밀린 자리에 설 땅이 없거나 한 칸 넘게 높낮이가 다르면 그대로 (절벽·용암으로 안 밀린다)
   */
  private separate(now: number): void {
    const ents: { x: number; y: number; z: number }[] = [];
    const bodies: SepBody[] = [];
    const add = (e: { x: number; y: number; z: number }, kind: MobKind, fixed: boolean): void => {
      if (this.defs.get(kind).hover || this.defs.get(kind).swim) return; // 떠 있는 몹·물고기는 땅 높이로 옮기면 안 된다
      const s = mobSize(kind);
      ents.push(e);
      bodies.push({ x: e.x, y: e.y, z: e.z, r: s.w / 2, h: s.h, mass: s.w * s.w * s.h, fixed });
    };
    for (const m of this.mobs.values()) add(m, m.kind, (m === this.boss && !this.bossAwake) || m.cureAt !== undefined || (m.busyUntil ?? 0) > now);
    for (const c of this.companions.values()) add(c, c.kind, false);
    if (bodies.length < 2) return;
    separationPushes(bodies).forEach((p, i) => {
      if (p.dx === 0 && p.dz === 0) return;
      const e = ents[i]!;
      const nx = e.x + p.dx,
        nz = e.z + p.dz;
      const gy = this.groundAt(nx, nz, e.y);
      if (gy !== null && Math.abs(gy - e.y) <= 1) {
        e.x = nx;
        e.z = nz;
        e.y = gy;
      }
    });
  }

  /** 보스: 가까이 오면 깨어나고, 깨어 있으면 주기마다 부하를 부른다 */
  private tickBoss(players: MobTarget[], now: number): void {
    const b = this.boss;
    if (!b) return;
    if (!this.bossAwake) {
      const near = players.some((p) => Math.hypot(p.x - b.x, p.y - b.y, p.z - b.z) <= BOSS_AGGRO_RANGE);
      if (near) this.wake(b, now);
      return;
    }
    if (this.lastSummonAt === 0) this.lastSummonAt = now; // 첫 소환은 주기 뒤
    if (b.kind === 'ender_dragon' && this.e.crystals?.length && now - this.lastHealAt >= 1000) {
      // 엔드 수정 (#224, 아들 14차 8번 "회복도 있어"): 남은 수정 수만큼 1초마다 회복 (셋에 1, 최소 1). 깨지면 모두에게 알린다
      this.lastHealAt = now;
      const left = this.crystalsLeft();
      if (this.lastCrystals >= 0 && left < this.lastCrystals) this.hooks.json({ t: 'error', code: 'CRYSTAL_DOWN', message: left > 0 ? `💎 엔드 수정이 깨졌어요! 남은 수정 ${left}개 — 드래곤 회복이 줄어요` : '💎 엔드 수정을 다 깼어요! 이제 드래곤은 회복하지 못해요' });
      this.lastCrystals = left;
      const max = this.defs.get(b.kind).hp;
      if (left > 0 && b.hp < max) {
        b.hp = Math.min(max, b.hp + Math.max(1, Math.ceil(left / 3)));
        this.hooks.json({ t: 'mob', ev: 'heal', id: b.id, mob: b.kind, x: b.x, y: b.y, z: b.z });
      }
    }
    for (const id of [...this.minions]) if (!this.mobs.has(id)) this.minions.delete(id);
    if (now - this.lastSummonAt >= BOSS_SUMMON_EVERY_MS && this.minions.size < BOSS_MINIONS_MAX && players.length) {
      this.lastSummonAt = now;
      const kind = bossMinionKind(b.kind);
      let n = 0;
      for (let i = 0; i < 8 && n < BOSS_SUMMON_COUNT && this.minions.size < BOSS_MINIONS_MAX; i++) {
        const a = (i / 8) * Math.PI * 2 + this.turn;
        const x = Math.floor(b.x + Math.cos(a) * 3) + 0.5,
          z = Math.floor(b.z + Math.sin(a) * 3) + 0.5;
        const y = this.groundAt(x, z, b.y - (this.defs.get(b.kind).hover ?? 0)); // 떠 있는 보스(드래곤)는 그 아래 땅에 부하를 세운다
        if (y === null) continue;
        const m = this.spawnKind(kind, x, y, z);
        this.minions.add(m.id);
        n++;
      }
      if (n > 0) {
        b.state = MOB_STATE.summon;
        this.hooks.json({ t: 'mob', ev: 'summon', id: b.id, mob: b.kind, x: b.x, y: b.y, z: b.z });
      }
    }
  }

  /** 아직 서 있는 엔드 수정 수 (#224) */
  crystalsLeft(): number {
    let n = 0;
    for (const c of this.e.crystals ?? []) if (this.e.world.inBounds(c.x, c.y, c.z) && this.registry.get(this.e.world.getBlock(c.x, c.y, c.z)).id === 'end_crystal') n++;
    return n;
  }

  private wake(b: MobState, now: number): void {
    this.bossAwake = true;
    b.state = MOB_STATE.walk;
    this.lastSummonAt = now; // 첫 소환은 주기 뒤
    this.hooks.json({ t: 'mob', ev: 'wake', id: b.id, mob: b.kind, x: b.x, y: b.y, z: b.z });
    this.hooks.bossWake(b.kind, { x: b.x, y: b.y, z: b.z }, now);
  }

  /** 독: 초당 1, 끝나거나 무대에서 나가면 풀린다 */
  /** 던진 물약이 몹에게 (#245): 독은 1.25초마다 1 — 체력 1 아래로는 안 내려간다 (마인크래프트처럼 독으론 안 죽는다) */
  private tickMobPotions(now: number): void {
    for (const m of this.mobs.values()) {
      if (m.poisonUntil === undefined) continue;
      if (now >= m.poisonUntil) {
        delete m.poisonUntil;
        delete m.poisonNextAt;
        continue;
      }
      if (now >= (m.poisonNextAt ?? 0)) {
        m.poisonNextAt = now + MOB_POISON_EVERY_MS;
        if (m.hp > 1) {
          m.hp -= 1;
          this.hooks.json({ t: 'mob', ev: 'hit', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z, dmg: 1 });
        }
      }
    }
  }

  /**
   * 던진 물약이 떨어졌다 (#245): at 에서 SPLASH_RADIUS 안의 몹(주민 빼고)에게 나쁜 효과만 —
   * 고통은 바로 피해(때린 사람 몫), 독·감속·나약함은 그 시간 동안. 좋은 물약은 몹에겐 아무것도 안 한다. 맞은 수
   */
  splash(byIdx: number, at: { x: number; y: number; z: number }, out: PotionOutcome, now: number, radius = SPLASH_RADIUS): number {
    if (!out.harmful) return 0;
    let n = 0;
    for (const m of [...this.mobs.values()]) {
      if (m.kind === 'villager' || m.cureAt !== undefined) continue;
      if (Math.hypot(m.x - at.x, m.y + mobSize(m.kind).h * 0.5 - at.y, m.z - at.z) > radius) continue;
      n++;
      if (out.hurts > 0) this.damage(m, out.hurts, byIdx, now);
      const e = out.effect;
      if (!e) continue;
      const until = now + e.seconds * 1000;
      if (e.id === 'poison') {
        m.poisonUntil = Math.max(m.poisonUntil ?? 0, until);
        m.poisonNextAt ??= now + MOB_POISON_EVERY_MS;
      } else if (e.id === 'slowness') m.slowUntil = Math.max(m.slowUntil ?? 0, until);
      else if (e.id === 'weakness') m.weakUntil = Math.max(m.weakUntil ?? 0, until);
    }
    return n;
  }

  /** TNT 폭발 (#247): radius 안의 몹(주민·치료 중인 좀비 주민 빼고)이 멀수록 적게 다치고 바깥으로 밀린다. byIdx 가 잡은 것으로 보상. 맞은 수 */
  blast(at: { x: number; y: number; z: number }, radius: number, damage: number, byIdx: number, now: number): number {
    let n = 0;
    for (const m of [...this.mobs.values()]) {
      if (m.kind === 'villager' || m.cureAt !== undefined) continue;
      const dx = m.x - at.x,
        dz = m.z - at.z;
      const dmg = explosionDamage(Math.hypot(dx, m.y + mobSize(m.kind).h * 0.5 - at.y, dz), radius, damage);
      if (dmg <= 0) continue;
      n++;
      const d = Math.hypot(dx, dz) || 1;
      this.damage(m, dmg, byIdx, now, { x: dx / d, z: dz / d }, 1.5);
    }
    return n;
  }

  private tickPoison(players: MobTarget[], now: number): void {
    for (const [idx, p] of [...this.poisoned]) {
      if (!players.some((t) => t.idx === idx) || now >= p.until) {
        this.poisoned.delete(idx);
        continue;
      }
      if (now >= p.nextAt) {
        p.nextAt += POISON_EVERY_MS;
        this.hooks.hurt(idx, POISON_DAMAGE, 'poison', now);
      }
    }
  }

  private explode(m: MobState, def: ReturnType<MobRegistry['get']>, players: MobTarget[], now: number): void {
    for (const p of players) {
      const d = Math.hypot(p.x - m.x, p.y - m.y, p.z - m.z);
      const dmg = explosionDamage(d, def.explodeRadius, def.damage);
      if (dmg > 0) this.hooks.hurt(p.idx, dmg, 'creeper', now);
    }
    this.mobs.delete(m.id);
    this.hooks.json({ t: 'mob', ev: 'explode', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
  }

  entries(): MobEntry[] {
    const out: MobEntry[] = [...this.mobs.values()].map((m) => ({ id: m.id, kind: MOB_KIND_NUM[m.kind], x: m.x, y: m.y, z: m.z, yaw: m.yaw, hp: m.hp, state: m.state }));
    for (const c of this.companions.values()) out.push({ id: c.id, kind: MOB_KIND_NUM[c.kind], x: c.x, y: c.y, z: c.z, yaw: c.yaw, hp: 8, state: ANIMAL_FLAG.tamed });
    return out;
  }

  // ---------------------------------------------------------------- 원정 동행 펫 (#147)

  addCompanion(c: { id: number; kind: MobKind; owner: number; name: string | null; x: number; y: number; z: number; home?: { x: number; z: number }; damage?: number; reach?: number }): void {
    this.companions.set(c.id, { ...c, yaw: 0, nextBiteAt: 0 });
  }

  /** 이 사람의 펫을 전부 뺀다 (돌아가거나 끊겼을 때). 뺀 수 */
  removeCompanionsOf(owner: number): number {
    let n = 0;
    for (const [id, c] of this.companions) if (c.owner === owner) {
        this.companions.delete(id);
        n++;
      }
    return n;
  }

  private stepCompanions(players: MobTarget[], dt: number, now: number): void {
    for (const c of this.companions.values()) {
      const owner = c.owner >= 0 ? players.find((p) => p.idx === c.owner) : undefined;
      if (c.owner >= 0 && !owner) continue;
      const guard = !owner; // 지킴이 (#169): 주인 없이 home 을 지킨다
      const reach = c.reach ?? PET_REACH;
      // 주인 근처(또는 내 근처) 가장 가까운 몹 — 잠든 보스는 건드리지 않는다
      let prey: MobState | null = null;
      let best = guard ? GUARD_AGGRO : PET_AGGRO;
      for (const m of this.mobs.values()) {
        if (m === this.boss && !this.bossAwake) continue;
        if (m.cureAt !== undefined || m.kind === 'villager') continue; // 주민·돌아오는 중인 좀비 주민은 안 문다 (#244)
        const d = owner ? Math.min(Math.hypot(m.x - owner.x, m.z - owner.z), Math.hypot(m.x - c.x, m.z - c.z)) : Math.hypot(m.x - c.x, m.z - c.z);
        if (d < best) {
          best = d;
          prey = m;
        }
      }
      const anchor = owner ?? c.home ?? { x: c.x, z: c.z };
      const goal = prey ? { x: prey.x, z: prey.z, stop: reach } : { x: anchor.x, z: anchor.z, stop: owner ? PET_FOLLOW_STOP : 0.5 };
      const dOwner = owner ? Math.hypot(owner.x - c.x, owner.z - c.z) : 0;
      if (owner && dOwner > PET_TELEPORT) {
        c.x = owner.x - 1.2;
        c.z = owner.z;
        c.y = this.groundAt(c.x, c.z, owner.y) ?? owner.y;
        continue;
      }
      const dx = goal.x - c.x,
        dz = goal.z - c.z;
      const d = Math.hypot(dx, dz);
      if (d > goal.stop) {
        const step = Math.min(d - goal.stop, PET_SPEED * dt);
        const nx = c.x + (dx / d) * step,
          nz = c.z + (dz / d) * step;
        const gy = this.groundAt(nx, nz, c.y);
        if (gy !== null && Math.abs(gy - c.y) <= 1.2) {
          c.x = nx;
          c.z = nz;
          c.y = gy;
        }
        c.yaw = Math.atan2(-dx, -dz);
      }
      if (prey && Math.hypot(prey.x - c.x, prey.z - c.z) <= reach + 0.4 && now >= c.nextBiteAt) {
        c.nextBiteAt = now + (guard ? 1200 : PET_BITE_MS);
        const pd = Math.hypot(prey.x - c.x, prey.z - c.z) || 1;
        this.damage(prey, c.damage ?? PET_DAMAGE, c.owner, now, { x: (prey.x - c.x) / pd, z: (prey.z - c.z) / pd }); // owner -1 이면 보상은 아무에게도
      }
    }
  }

  /** 때리기. 오류: NO_MOB · TOO_FAR · COOLDOWN. 보스는 몸이 커서 한 칸 더 멀리서도 닿는다 */
  /** 때리기. reach = 닿는 거리 (기본 손·검, 활은 사거리) */
  /** ench (#231): bonus = 몹 종류별 추가 피해(강타·살충·날카로움), knock = 밀치기 배율, looting = 약탈 단계 */
  hit(p: MobTarget, mobId: number, damage: number, now: number, reach = HIT_REACH, ench?: { bonus?: (kind: MobKind) => number; knock?: number; looting?: number }): string | null {
    const m = this.mobs.get(mobId);
    if (!m) return 'NO_MOB';
    if (m.kind === 'villager') return 'VILLAGER'; // 사막 마을 주민도 못 때린다 (#228, #168)
    if (Math.hypot(m.x - p.x, m.y + mobSize(m.kind).h * 0.5 - p.eyeY, m.z - p.z) > reach + 0.6 + (isBoss(m.kind) ? 1 : 0)) return 'TOO_FAR';
    const last = this.lastHitAt.get(p.idx) ?? 0;
    if (now - last < HIT_COOLDOWN_MS) return 'COOLDOWN';
    this.lastHitAt.set(p.idx, now);
    const dx = m.x - p.x,
      dz = m.z - p.z;
    const d = Math.hypot(dx, dz) || 1;
    this.damage(m, damage + (ench?.bonus?.(m.kind) ?? 0), p.idx, now, { x: dx / d, z: dz / d }, ench?.knock ?? 1, ench?.looting ?? 0);
    return null;
  }

  /** 드래곤 빔: 길 위 몹 전부에 4×세기. 맞은 수. 보스는 몸이 커서 더 넓게 맞는다 */
  beam(from: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, range: number, power: number, shooterIdx: number, now: number): number {
    let n = 0;
    for (const m of [...this.mobs.values()]) {
      if (m.kind === 'villager') continue; // 빔도 주민은 안 맞는다 (#228)
      if (!beamHitsMob(from, dir, range, m, 0.9 + power * 0.15 + (isBoss(m.kind) ? 0.8 : 0))) continue;
      n++;
      const h = Math.hypot(dir.x, dir.z) || 1;
      this.damage(m, 4 * power, shooterIdx, now, { x: dir.x / h, z: dir.z / h });
    }
    return n;
  }

  /** push = 밀려나는 방향(가로 단위 벡터). 보스는 밀리지 않고, 자다가 맞으면 깬다 */
  private damage(m: MobState, amount: number, byIdx: number, now: number, push?: { x: number; z: number }, knock = 1, looting = 0): void {
    const dealt = Math.floor(amount);
    m.hp = Math.max(0, m.hp - dealt);
    m.angryUntil = now + ANGRY_MS; // 중립 몹은 맞으면 화난다 (#161)
    if (isWild(m.kind) && m.hp > 0) this.wildHurt(m, byIdx, push, now);
    if (m === this.boss && !this.bossAwake) this.wake(m, now);
    if (m.hp > 0) {
      if (push && !isBoss(m.kind) && !this.defs.get(m.kind).swim) { // 물고기는 안 밀린다 — 둑 위로 밀려 나가면 안 된다
        const nx = m.x + push.x * KNOCKBACK * knock,
          nz = m.z + push.z * KNOCKBACK * knock;
        const gy = this.groundAt(nx, nz, m.y);
        if (gy !== null && Math.abs(gy - m.y) <= 1) {
          m.x = nx;
          m.z = nz;
          m.y = gy;
        }
      }
      this.hooks.json({ t: 'mob', ev: 'hit', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z, dmg: dealt });
      if (m.kind === 'enderman' && push && hash3(m.id, m.hp, 9, this.e.seed) < 0.5) this.teleportTo(m, m.x + push.x * ENDER_AWAY, m.z + push.z * ENDER_AWAY, m.y, now); // 맞으면 반은 멀리 달아난다 (#222)
      return;
    }
    const def = this.defs.get(m.kind);
    this.mobs.delete(m.id);
    this.hooks.json({ t: 'mob', ev: 'die', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
    if (m === this.boss) {
      this.boss = null;
      this.hooks.bossDefeated(m.kind, rollDrops(def, this.e.seed, m.id), def.xp, { x: m.x, y: m.y + 1, z: m.z }, byIdx, now);
      return;
    }
    this.hooks.reward(byIdx, rollDrops(def, this.e.seed, m.id, looting), def.xp, { x: m.x, y: m.y + 1, z: m.z }, now); // 약탈 (#231)
  }

  /**
   * 사냥 동물 한 걸음 (2026-11-05). 덤빌 사람을 돌려주면 공통 공격(stepMob·피해·밀침·독)으로 간다. null 이면 이번 걸음은 끝.
   * - 달아나는 동물: fleeUntil 까지 fleeDir 쪽으로 1.5배 빠르기로 뛴다(막히면 옆으로 꺾는다). 아니면 집 둘레 산책
   * - 덤비는 동물: aggroR 안에 들어온 사람(또는 때린 사람)을 쫓고, aggroR × WILD_LEASH(화났으면 24칸) 밖으로 멀어지면 포기
   */
  private stepWild(m: MobState, def: ReturnType<MobRegistry['get']>, players: MobTarget[], dt: number, now: number): MobTarget | null {
    if (!m.home) m.home = { x: m.x, z: m.z };
    if (def.swim) {
      this.stepSwim(m, def, dt, now, players);
      return null;
    }
    if (def.flee) {
      if ((m.fleeUntil ?? 0) > now && m.fleeDir) {
        const bx = m.x,
          bz = m.z;
        stepMob(m, { ...def, speed: def.speed * 1.5, reach: 0, fuseMs: 0 }, { x: m.x + m.fleeDir.x * 4, y: m.y, z: m.z + m.fleeDir.z * 4 }, dt, now, this.groundAt);
        if (m.x === bx && m.z === bz) {
          const a = Math.atan2(m.fleeDir.z, m.fleeDir.x) + (hash3(m.id, Math.floor(now / 300), 41, this.e.seed) < 0.5 ? 1.2 : -1.2);
          m.fleeDir = { x: Math.cos(a), z: Math.sin(a) };
        }
        m.home = { x: m.x, z: m.z }; // 달아난 곳이 새 집 (되돌아오지 않는다)
        m.wanderTo = null;
        return null;
      }
      this.wander(m, def, dt, now);
      return null;
    }
    const aggro = def.aggroR ?? 6;
    const angry = (m.angryUntil ?? 0) > now;
    let cur = m.huntIdx !== undefined ? players.find((p) => p.idx === m.huntIdx) : undefined;
    if (cur && Math.hypot(cur.x - m.x, cur.z - m.z) > (angry ? 24 : aggro * WILD_LEASH)) cur = undefined;
    if (!cur) {
      let best = aggro;
      for (const p of players) {
        const d = Math.hypot(p.x - m.x, p.z - m.z);
        if (d <= best && Math.abs(p.y - m.y) < 4) {
          best = d;
          cur = p;
        }
      }
    }
    m.huntIdx = cur?.idx;
    if (cur) {
      m.wanderTo = null;
      return cur;
    }
    this.wander(m, def, dt, now);
    return null;
  }

  /** 사냥 동물이 맞았다: 달아나는 동물은 무리(WILD_HERD_R 안 같은 종류)째 맞은 쪽 반대로, 덤비는 동물은 때린 사람을 쫓는다 */
  private wildHurt(m: MobState, byIdx: number, push: { x: number; z: number } | undefined, now: number): void {
    const def = this.defs.get(m.kind);
    if (!def.flee) {
      if (byIdx >= 0) m.huntIdx = byIdx;
      return;
    }
    let dir = push;
    if (!dir || (dir.x === 0 && dir.z === 0)) {
      const a = hash3(m.id, m.hp, 42, this.e.seed) * Math.PI * 2;
      dir = { x: Math.cos(a), z: Math.sin(a) };
    }
    const l = Math.hypot(dir.x, dir.z) || 1;
    const ux = dir.x / l,
      uz = dir.z / l;
    // 때린 쪽(맞은 동물에서 밀린 방향 반대로 2칸)에서 각자 멀어지는 쪽으로 — 무리 반대편 동물이 사람을 가로질러 뛰지 않게
    const fromX = m.x - ux * 2,
      fromZ = m.z - uz * 2;
    for (const o of this.mobs.values()) {
      if (o.kind !== m.kind || (o !== m && Math.hypot(o.x - m.x, o.z - m.z) > WILD_HERD_R)) continue;
      const ox = o.x - fromX,
        oz = o.z - fromZ;
      const ol = Math.hypot(ox, oz);
      o.fleeUntil = now + WILD_FLEE_MS;
      o.fleeDir = o === m || ol < 0.01 ? { x: ux, z: uz } : { x: ox / ol, z: oz / ol };
    }
  }

  /** 원정 주민 산책 (#229): 2~6초마다 반은 집 3~10칸 안의 자리로 천천히(0.6배) 걷고, 반은 쉰다. 시드·번호·시각으로 결정론 */
  /** 대화·가게 열림/닫힘 (#233) — 주민만 */
  setBusy(id: number, idx: number, on: boolean, now: number): void {
    const m = this.mobs.get(id);
    if (!m || m.kind !== 'villager') return;
    if (on) {
      m.busyUntil = now + 120_000;
      m.busyWith = idx;
    } else if (m.busyWith === idx) m.busyUntil = 0;
  }

  private wander(m: MobState, def: ReturnType<MobRegistry['get']>, dt: number, now: number): void {
    const home = m.home!;
    if (!m.wanderTo && now >= (m.wanderAt ?? 0)) {
      const r = hash3(m.id, Math.floor(now / 500), 21, this.e.seed);
      if (r < 0.5) {
        const a = hash3(m.id, Math.floor(now / 500), 22, this.e.seed) * Math.PI * 2;
        const d = 3 + hash3(m.id, Math.floor(now / 500), 23, this.e.seed) * 7;
        const tx = Math.floor(home.x + Math.cos(a) * d) + 0.5,
          tz = Math.floor(home.z + Math.sin(a) * d) + 0.5;
        const y = this.groundAt(tx, tz, m.y);
        if (y !== null && Math.abs(y - m.y) <= 2) m.wanderTo = { x: tx, y, z: tz };
      }
      m.wanderAt = now + 2000 + r * 4000;
    }
    if (m.wanderTo) {
      stepMob(m, { ...def, speed: def.speed * 0.6, reach: 0, fuseMs: 0 }, m.wanderTo, dt, now, this.groundAt);
      if (Math.hypot(m.wanderTo.x - m.x, m.wanderTo.z - m.z) < 0.6) m.wanderTo = null;
    } else m.state = MOB_STATE.walk;
  }

  // ---------------------------------------------------------------- 좀비 주민 (#244)

  /** 좀비가 주민을 물었다: 체력이 다하면 그 자리에서 좀비 주민이 된다 (번호·집은 그대로 — 되돌리면 같은 주민) */
  private biteVillager(v: MobState, dmg: number, now: number): void {
    v.hp = Math.max(0, v.hp - dmg);
    this.hooks.json({ t: 'mob', ev: 'hit', id: v.id, mob: v.kind, x: v.x, y: v.y, z: v.z, dmg });
    if (v.hp > 0) return;
    v.kind = 'zombie_villager';
    v.hp = this.defs.get('zombie_villager').hp;
    v.state = MOB_STATE.walk;
    v.busyUntil = 0;
    v.wanderTo = null;
    v.lastAttackAt = now;
    this.hooks.json({ t: 'mob', ev: 'zombify', id: v.id, mob: v.kind, x: v.x, y: v.y, z: v.z });
    this.hooks.json({ t: 'error', code: 'VILLAGER_ZOMBIFIED', message: '🧟 주민이 좀비에게 물려 좀비 주민이 됐어요! 🍎 황금 사과를 들고 탭하면 되돌릴 수 있어요' });
  }

  /** 황금 사과 먹이기 (#244): 좀비 주민만, 가까이서. 오류: NO_MOB · NOT_ZOMBIE_VILLAGER · ALREADY_CURING · TOO_FAR. 아이템은 부른 쪽이 뺀다 */
  cure(p: MobTarget, mobId: number, now: number): string | null {
    const m = this.mobs.get(mobId);
    if (!m) return 'NO_MOB';
    if (m.kind !== 'zombie_villager') return 'NOT_ZOMBIE_VILLAGER';
    if (m.cureAt !== undefined) return 'ALREADY_CURING';
    if (Math.hypot(m.x - p.x, m.y + mobSize(m.kind).h * 0.5 - p.eyeY, m.z - p.z) > HIT_REACH + 1) return 'TOO_FAR';
    m.cureAt = now + CURE_MS;
    m.curedBy = p.idx;
    m.state = MOB_STATE.cure;
    m.fuseAt = 0;
    this.hooks.json({ t: 'mob', ev: 'cure', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
    this.hooks.json({ t: 'error', code: 'CURE_START', message: `🍎 좀비 주민이 황금 사과를 먹었어요! ${Math.round(CURE_MS / 1000)}초 뒤 주민으로 돌아와요 — 그동안 때리지 말아요` });
    return null;
  }

  /** 주민으로 돌아왔다: 그 자리가 집(산책 둘레). 먹인 사람에게 에메랄드 1 + 경험치 10 */
  private cureDone(m: MobState, now: number): void {
    const by = m.curedBy ?? -1;
    m.kind = 'villager';
    m.hp = this.defs.get('villager').hp;
    m.state = MOB_STATE.walk;
    m.cureAt = undefined;
    m.curedBy = undefined;
    m.angryUntil = 0;
    m.home = { x: m.x, z: m.z };
    m.wanderTo = null;
    m.wanderAt = now + 2000;
    this.hooks.json({ t: 'mob', ev: 'cured', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
    this.hooks.json({ t: 'error', code: 'CURE_DONE', message: `🧑‍🌾 주민이 돌아왔어요! 고마워서 에메랄드 ${CURE_REWARD.count}개를 줬어요` });
    if (by >= 0) this.hooks.reward(by, [{ item: CURE_REWARD.item, count: CURE_REWARD.count }], CURE_REWARD.xp, { x: m.x, y: m.y + 1, z: m.z }, now);
  }

  /** 조용히 사라진다 (#221 철 골렘): 드롭·경험치 없이. 클라는 die 로 지운다 */
  private vanish(m: MobState): void {
    this.mobs.delete(m.id);
    this.hooks.json({ t: 'mob', ev: 'die', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
  }

  /** 엔더맨 순간이동 (#222): 설 수 있는 자리면 옮기고 모두에게 teleport 를 알린다. 됐으면 true */
  private teleportTo(m: MobState, x: number, z: number, nearY: number, now: number): boolean {
    const tx = Math.floor(x) + 0.5,
      tz = Math.floor(z) + 0.5;
    const y = this.groundAt(tx, tz, nearY);
    if (y === null) return false;
    m.x = tx;
    m.y = y;
    m.z = tz;
    m.nextTeleportAt = now + ENDER_TELEPORT_EVERY_MS;
    this.hooks.json({ t: 'mob', ev: 'teleport', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
    return true;
  }

  /** 화난 엔더맨: 3초마다 사람 옆(2.5칸)으로 순간이동 — 방향은 결정론(시드·번호·시각) */
  private teleportNear(m: MobState, target: MobTarget, now: number): void {
    if (now < (m.nextTeleportAt ?? 0)) return;
    if (Math.hypot(target.x - m.x, target.z - m.z) <= ENDER_NEAR + 1.5) {
      m.nextTeleportAt = now + ENDER_TELEPORT_EVERY_MS;
      return;
    }
    const a = hash3(m.id, Math.floor(now / 1000), 11, this.e.seed) * Math.PI * 2;
    if (!this.teleportTo(m, target.x + Math.cos(a) * ENDER_NEAR, target.z + Math.sin(a) * ENDER_NEAR, target.y, now)) m.nextTeleportAt = now + 1000;
  }

  /** 지금 목록을 모두에게 (비었으면 빈 목록 — 클라가 인형을 지운다) */
  broadcastState(): void {
    this.hooks.broadcast(encodeMobsState(this.entries()));
  }

  clear(): void {
    this.mobs.clear();
    this.poisoned.clear();
    this.minions.clear();
    this.boss = null;
  }
}
