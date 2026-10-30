/**
 * 몹 돌리기 (M7-2·M7-3·M7-4·M7-5): 밤이면 생기고, 사람을 쫓고, 물고, 터진다. 규칙은 shared/rules/mobs.ts, 여기는 세계·플레이어와 잇는 살.
 * 블록은 절대 안 부수고, 피해는 플레이어에게만 간다(몹끼리·드래곤은 없음 = 아군 피해 없음).
 * 어떤 몹이 나오는지는 원정지(`expeditions.json nightMobs`). 항상 어두운 원정지(동굴)는 처음부터 나온다. 거미가 물면 독(초당 1, 3초).
 * 맞은 몹은 때린 쪽 반대로 0.7칸 밀려나고(발 디딜 곳이 있을 때만), `mob hit` 에 피해 숫자(dmg)가 실린다 — 맞았다는 게 눈에 보이게 (#94).
 *
 * 무대(MobArena)는 원정지일 수도, 마을(방어전 M7-5)일 수도 있다. 방어전은 autoSpawn 을 끄고 파도마다 직접 spawnKind 로 넣으며,
 * 사람이 멀면 goal(깃대)로 걸어가게 한다.
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
  stepMob, isLookingAt, hash3 } from '@dragon-village/shared';

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
  /** 이 무대에 있는 사람들 */
  players(): MobTarget[];
  hurt(idx: number, amount: number, cause: string, now: number): void;
  /** 피해 없이 밀기 (#223 눈 골렘 눈덩이): (x, z) 는 밀리는 방향 단위 벡터 */
  knock?(idx: number, x: number, z: number, now: number): void;
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
const DEFAULT_OPTS: MobSystemOptions = { autoSpawn: true, aggroRange: 40, goal: null, quiet: false, firstId: 1 };
/** 엔더맨 (#222): 화나면 이 간격으로 사람 옆에 순간이동, 맞으면 반은 멀리 달아난다 */
const ENDER_TELEPORT_EVERY_MS = 3000;
const ENDER_NEAR = 2.5;
const ENDER_AWAY = 7;
/** 주민이 부른 철 골렘 (#221): 방어전 골렘(7)보다 약하게 — 초5가 4초 만에 죽지 않게. 3씩 2초마다 */
const GRUDGE_DAMAGE = 3;
const GRUDGE_ATTACK_MS = 2000;

export class MobSystem {
  readonly mobs = new Map<number, MobState>();
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
  }

  /** 밤인가 (항상 어두운 무대는 언제나) */
  isNight(now: number): boolean {
    return this.e.nightStartsAt <= 0 || this.e.elapsedSec(now) >= this.e.nightStartsAt;
  }

  /** 보스를 빼고 몇 마리 */
  get regularCount(): number {
    return this.mobs.size - (this.boss ? 1 : 0);
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
    const players = this.hooks.players();
    if (this.opts.autoSpawn && this.isNight(now) && !this.e.ended && players.length && this.regularCount < MOB_MAX && now - this.lastSpawnAt >= SPAWN_EVERY_MS) {
      this.lastSpawnAt = now;
      this.turn++;
      const around = players[this.turn % players.length]!;
      const spot = pickSpawn(this.e.seed, this.turn, around, this.groundAt);
      if (spot) this.spawnKind(pickKind(this.kinds, this.turn), spot.x, spot.y, spot.z);
    }
    this.tickBoss(players, now);
    this.tickPoison(players, now);
    if (this.mobs.size === 0 && this.companions.size === 0) return;
    if (now - this.lastStepAt >= STEP_MS) {
      const dt = Math.min(0.5, (now - (this.lastStepAt || now - STEP_MS)) / 1000);
      this.lastStepAt = now;
      this.stepCompanions(players, dt, now);
      for (const m of [...this.mobs.values()]) {
        if (m === this.boss && !this.bossAwake) continue; // 잠든 보스는 안 움직인다
        const def = this.defs.get(m.kind);
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
        if (!target && m.kind === 'villager' && m.home) {
          this.wander(m, def, dt, now); // 원정 주민 산책 (#229, 아빠 "주민이 집에만 있어")
          continue;
        }
        if (target) {
          const ev = stepMob(m, m.grudge !== undefined ? { ...def, damage: GRUDGE_DAMAGE, attackEveryMs: GRUDGE_ATTACK_MS } : def, target, dt, now, this.groundAt);
          if (ev === 'attack') {
            // 원거리 몹은 화살이 날아가는 그림을 먼저 (피해는 바로)
            if (isRangedMob(def)) this.hooks.json({ t: 'arrow', from: { x: m.x, y: m.y + mobSize(m.kind).h * 0.8, z: m.z }, to: { x: target.x, y: target.eyeY - 0.3, z: target.z }, fire: m.kind === 'ghast' || m.kind === 'blaze', snow: m.kind === 'snow_golem' }); // 가스트·블레이즈는 불덩이 (#173), 눈 골렘은 눈덩이 (#223)
            if (def.damage > 0) this.hooks.hurt(target.idx, m.grudge !== undefined ? GRUDGE_DAMAGE : def.damage, m.kind, now);
            else {
              // 눈 골렘 눈덩이 (#223): 안 아프고 밀려나기만
              const kx = target.x - m.x,
                kz = target.z - m.z;
              const kd = Math.hypot(kx, kz) || 1;
              this.hooks.knock?.(target.idx, kx / kd, kz / kd, now);
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
    }
    if (!this.opts.quiet) this.hooks.broadcast(encodeMobsState(this.entries()));
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
  hit(p: MobTarget, mobId: number, damage: number, now: number, reach = HIT_REACH): string | null {
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
    this.damage(m, damage, p.idx, now, { x: dx / d, z: dz / d });
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
  private damage(m: MobState, amount: number, byIdx: number, now: number, push?: { x: number; z: number }): void {
    const dealt = Math.floor(amount);
    m.hp = Math.max(0, m.hp - dealt);
    m.angryUntil = now + ANGRY_MS; // 중립 몹은 맞으면 화난다 (#161)
    if (m === this.boss && !this.bossAwake) this.wake(m, now);
    if (m.hp > 0) {
      if (push && !isBoss(m.kind)) {
        const nx = m.x + push.x * KNOCKBACK,
          nz = m.z + push.z * KNOCKBACK;
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
    this.hooks.reward(byIdx, rollDrops(def, this.e.seed, m.id), def.xp, { x: m.x, y: m.y + 1, z: m.z }, now);
  }

  /** 원정 주민 산책 (#229): 2~6초마다 반은 집 3~10칸 안의 자리로 천천히(0.6배) 걷고, 반은 쉰다. 시드·번호·시각으로 결정론 */
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
