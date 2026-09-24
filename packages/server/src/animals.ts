/**
 * 마을 동물 돌리기 (M8-1). 규칙은 shared/rules/animals.ts, 여기는 세계·플레이어·저장과 잇는 살.
 * 5Hz 로 걷고(한가롭게), 먹이 든 사람·주인을 따르고, 사랑하면 아기를 낳고, 아기는 자란다. 위치·상태는 `animals` 표에 저장 — 서버를 켰다 꺼도 남는다.
 * 클라에는 원정 몹과 같은 MobsState 로 간다(id 는 ANIMAL_ID_BASE 부터, state 윗자리에 아기·길들임·앉음·사랑).
 */
import {
  ANIMAL_FLAG,
  ANIMAL_ID_BASE,
  ANIMALS_MAX,
  BABY_MS,
  BREED_COOLDOWN_MS,
  BREED_RANGE,
  type BlockRegistry,
  FEED_GROW_MS,
  FOLLOW_RANGE,
  FOLLOW_STOP,
  GROUND_Y,
  HIT_COOLDOWN_MS,
  HIT_REACH,
  INITIAL_ANIMALS,
  LOVE_MS,
  MOB_KIND_NUM,
  MOB_STATE,
  type MobEntry,
  type MobKind,
  type MobRegistry,
  PET_FOLLOW_STOP,
  PET_TELEPORT_RANGE,
  RESPAWN_BATCH,
  RESPAWN_EVERY_MS,
  type VoxelWorld,
  WANDER_SPEED_MULT,
  animalMaxHp,
  animalSpotCandidate,
  herdSpotCandidate,
  isAnimalSpot,
  mobSize,
  rollDrops,
  tameRoll,
  wanderPause,
  wanderPick,
} from '@dragon-village/shared';

export interface AnimalRow {
  id: number;
  kind: MobKind;
  x: number;
  y: number;
  z: number;
  bornAt: number;
  /** null = 어른 */
  adultAt: number | null;
  /** 길들인 주인 토큰 */
  owner: string | null;
  sitting: boolean;
  homeX: number;
  homeZ: number;
}

export interface AnimalStore {
  listAnimals(code: string): AnimalRow[];
  insertAnimal(code: string, row: Omit<AnimalRow, 'id'>): number;
  updateAnimal(row: AnimalRow): void;
  deleteAnimal(id: number): void;
}

export interface AnimalViewer {
  idx: number;
  token: string;
  x: number;
  y: number;
  z: number;
  eyeY: number;
  held: string | null;
}

export interface AnimalHooks {
  /** 마을에 있는 사람들 */
  players(): AnimalViewer[];
  json(obj: unknown): void;
  /** 드롭·경험치를 잡은 사람에게 */
  reward(idx: number, drops: { item: string; count: number }[], xp: number, at: { x: number; y: number; z: number }, now: number): void;
  /** 손에 든 것 하나를 쓴다 (먹이·뼈). 못 쓰면 false */
  consume(idx: number, item: string): boolean;
  log(msg: string): void;
}

interface Animal extends AnimalRow {
  hp: number;
  yaw: number;
  /** 걷기 목표 (없으면 서 있다) */
  target: { x: number; z: number } | null;
  pauseUntil: number;
  turn: number;
  loveUntil: number;
  breedCooldownUntil: number;
  tameAttempts: number;
  dirty: boolean;
}

const STEP_MS = 200;

export class AnimalSystem {
  readonly animals = new Map<number, Animal>();
  private lastStepAt = 0;
  private lastRespawnAt = 0;
  private readonly lastHitAt = new Map<number, number>();
  private tempId = -1;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    private readonly defs: MobRegistry,
    private readonly seed: number,
    private readonly store: AnimalStore | null,
    private readonly code: string,
    private readonly hooks: AnimalHooks,
  ) {}

  /** 켤 때: 저장된 동물을 불러오고, 없으면 숲에 처음 뿌린다 */
  load(now: number): void {
    const rows = this.store?.listAnimals(this.code) ?? [];
    for (const r of rows) this.animals.set(r.id, this.wrap(r));
    // 종류별 목표보다 모자라면 무리로 채운다 (처음 켤 때 = 전부, 사냥으로 줄었으면 그만큼) — 숲에 늘 동물이 있게 (#106)
    let added = 0;
    let i = rows.length;
    for (const [kind, n] of Object.entries(INITIAL_ANIMALS) as [MobKind, number][]) {
      const need = n - this.wildCountOf(kind);
      if (need > 0) added += this.spawnHerd(kind, need, i++, now);
    }
    if (added > 0) this.hooks.log(rows.length === 0 ? `동물 ${added}마리를 숲에 풀었어요` : `숲에 동물 ${added}마리를 채웠어요 (${this.animals.size}마리)`);
    this.lastRespawnAt = now;
  }

  private wrap(r: AnimalRow): Animal {
    const def = this.defs.get(r.kind);
    return { ...r, hp: animalMaxHp(def.hp, r.kind, r.owner !== null), yaw: 0, target: null, pauseUntil: 0, turn: 0, loveUntil: 0, breedCooldownUntil: 0, tameAttempts: 0, dirty: false };
  }

  /** 발 높이 (그 자리 근처 층). 못 서면 null */
  groundAt = (x: number, z: number, nearY: number): number | null => {
    const bx = Math.floor(x),
      bz = Math.floor(z);
    const w = this.world;
    if (!w.inBounds(bx, 0, bz)) return null;
    const y0 = Math.floor(nearY);
    for (let y = Math.min(w.sizeY - 3, y0 + 2); y >= Math.max(1, y0 - 6); y--) {
      const here = this.registry.get(w.getBlock(bx, y, bz));
      if (!here.solid || here.fluid) continue;
      const a1 = this.registry.get(w.getBlock(bx, y + 1, bz));
      const a2 = this.registry.get(w.getBlock(bx, y + 2, bz));
      if (!a1.solid && !a2.solid && !a1.fluid && !a2.fluid) return y + 1;
    }
    return null;
  };

  /** 잔디 위에 설 수 있는 숲 자리인가 → 발 높이 */
  private grassSpot(c: { x: number; z: number }): number | null {
    if (!isAnimalSpot(c.x, c.z)) return null;
    const y = this.groundAt(c.x, c.z, GROUND_Y + 4);
    if (y === null || this.world.getBlock(Math.floor(c.x), y - 1, Math.floor(c.z)) !== this.registry.numOf('grass')) return null;
    return y;
  }

  /** 숲 자리에 야생 동물 하나 */
  private spawnWild(kind: MobKind, i: number, now: number): Animal | null {
    for (let attempt = 0; attempt < 40; attempt++) {
      const c = animalSpotCandidate(this.seed, i, attempt);
      const y = this.grassSpot(c);
      if (y !== null) return this.add({ kind, x: c.x, y, z: c.z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: c.x, homeZ: c.z }, now);
    }
    return null;
  }

  /** 같은 종류 n 마리를 한 무리로: 첫 마리 자리 곁(HERD_SPREAD)에 나머지. 곁에 못 서면 따로 선다. 돌려주는 값 = 실제로 생긴 수 */
  private spawnHerd(kind: MobKind, n: number, i: number, now: number): number {
    const first = this.spawnWild(kind, i, now);
    if (!first) return 0;
    let made = 1;
    for (let k = 1; k < n; k++) {
      let placed: Animal | null = null;
      for (let attempt = 0; attempt < 12 && !placed; attempt++) {
        const c = herdSpotCandidate(this.seed, i, k, attempt, first);
        const y = this.grassSpot(c);
        if (y !== null) placed = this.add({ kind, x: c.x, y, z: c.z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: first.homeX, homeZ: first.homeZ }, now);
      }
      if (!placed) placed = this.spawnWild(kind, i * 31 + k, now);
      if (placed) made++;
    }
    return made;
  }

  private add(row: Omit<AnimalRow, 'id'>, now: number): Animal {
    const id = this.store ? this.store.insertAnimal(this.code, row) : this.tempId--;
    const a = this.wrap({ ...row, id });
    this.animals.set(id, a);
    this.hooks.json({ t: 'mob', ev: 'spawn', id: ANIMAL_ID_BASE + id, mob: row.kind, x: row.x, y: row.y, z: row.z });
    void now;
    return a;
  }

  private flags(a: Animal, now: number): number {
    let f = 0;
    if (a.adultAt !== null && a.adultAt > now) f |= ANIMAL_FLAG.baby;
    if (a.owner !== null) f |= ANIMAL_FLAG.tamed;
    if (a.sitting) f |= ANIMAL_FLAG.sitting;
    if (a.loveUntil > now) f |= ANIMAL_FLAG.love;
    return f;
  }

  isBaby(a: Animal, now: number): boolean {
    return a.adultAt !== null && a.adultAt > now;
  }

  entries(now: number): MobEntry[] {
    const out: MobEntry[] = [];
    for (const a of this.animals.values()) {
      const moving = a.target !== null && !a.sitting;
      out.push({ id: ANIMAL_ID_BASE + a.id, kind: MOB_KIND_NUM[a.kind], x: a.x, y: a.y, z: a.z, yaw: a.yaw, hp: a.hp, state: (moving ? MOB_STATE.walk : 0) | this.flags(a, now) });
    }
    return out;
  }

  tick(now: number): void {
    if (now - this.lastStepAt < STEP_MS) return;
    const dt = Math.min(1, (now - (this.lastStepAt || now - STEP_MS)) / 1000);
    this.lastStepAt = now;
    const players = this.hooks.players();
    for (const a of [...this.animals.values()]) this.step(a, players, dt, now);
    // 야생이 목표보다 줄면 다시 생긴다 (10분마다, 가장 모자란 종류를 둘씩 무리로) (#106)
    if (this.lastRespawnAt > now) this.lastRespawnAt = now; // 시계가 거꾸로면(테스트·시간 조정) 지금부터
    if (now - this.lastRespawnAt >= RESPAWN_EVERY_MS && this.animals.size < ANIMALS_MAX) {
      this.lastRespawnAt = now;
      let worst: MobKind | null = null,
        worstNeed = 0;
      for (const [kind, n] of Object.entries(INITIAL_ANIMALS) as [MobKind, number][]) {
        const need = n - this.wildCountOf(kind);
        if (need > worstNeed) (worst = kind), (worstNeed = need);
      }
      if (worst) {
        const made = this.spawnHerd(worst, Math.min(RESPAWN_BATCH, worstNeed, ANIMALS_MAX - this.animals.size), this.animals.size + Math.floor(now / 1000), now);
        if (made > 0) this.hooks.log(`${this.defs.get(worst).name} ${made}마리가 숲에 새로 나타났어요`);
      }
    }
  }

  countOf(kind: MobKind): number {
    let n = 0;
    for (const a of this.animals.values()) if (a.kind === kind) n++;
    return n;
  }

  /** 야생(주인 없는) 수 — 길들인 강아지는 숲 목표에 세지 않는다 */
  wildCountOf(kind: MobKind): number {
    let n = 0;
    for (const a of this.animals.values()) if (a.kind === kind && a.owner === null) n++;
    return n;
  }

  private step(a: Animal, players: AnimalViewer[], dt: number, now: number): void {
    const def = this.defs.get(a.kind);
    // 아기 → 어른
    if (a.adultAt !== null && a.adultAt <= now) {
      a.adultAt = null;
      a.hp = animalMaxHp(def.hp, a.kind, a.owner !== null);
      a.dirty = true;
      this.hooks.json({ t: 'mob', ev: 'grow', id: ANIMAL_ID_BASE + a.id, mob: a.kind, x: a.x, y: a.y, z: a.z });
    }
    if (a.sitting) return;
    // 사랑: 짝을 찾는다
    if (a.loveUntil > now && a.adultAt === null) {
      for (const b of this.animals.values()) {
        if (b === a || b.kind !== a.kind || b.loveUntil <= now || b.adultAt !== null) continue;
        if (Math.hypot(a.x - b.x, a.z - b.z) > BREED_RANGE) continue;
        this.breed(a, b, now);
        break;
      }
    }
    // 목표: 주인 > 먹이 든 사람 > 산책
    let goal: { x: number; z: number; stop: number } | null = null;
    if (a.owner !== null) {
      const owner = players.find((p) => p.token === a.owner);
      if (owner) {
        const d = Math.hypot(owner.x - a.x, owner.z - a.z);
        if (d > PET_TELEPORT_RANGE) {
          for (let k = 0; k < 8; k++) {
            const ang = (k / 8) * Math.PI * 2;
            const tx = owner.x + Math.cos(ang) * 1.5,
              tz = owner.z + Math.sin(ang) * 1.5;
            const y = this.groundAt(tx, tz, owner.y);
            if (y === null) continue;
            a.x = tx;
            a.z = tz;
            a.y = y;
            a.target = null;
            a.dirty = true;
            break;
          }
        } else if (d > PET_FOLLOW_STOP) goal = { x: owner.x, z: owner.z, stop: PET_FOLLOW_STOP };
      }
    }
    if (!goal) {
      let best = FOLLOW_RANGE;
      for (const p of players) {
        if (!p.held || !def.food.includes(p.held)) continue;
        const d = Math.hypot(p.x - a.x, p.z - a.z);
        if (d < best) {
          best = d;
          goal = { x: p.x, z: p.z, stop: FOLLOW_STOP };
        }
      }
    }
    let speed = def.speed;
    if (!goal) {
      speed *= WANDER_SPEED_MULT;
      if (a.target && Math.hypot(a.target.x - a.x, a.target.z - a.z) < 0.6) {
        a.target = null;
        a.pauseUntil = now + wanderPause(this.seed, a.id, a.turn) * 1000;
      }
      if (!a.target && now >= a.pauseUntil) {
        a.turn++;
        a.target = wanderPick(this.seed, a.id, a.turn, a, { x: a.homeX, z: a.homeZ });
      }
      if (a.target) goal = { x: a.target.x, z: a.target.z, stop: 0.3 };
    } else a.target = { x: goal.x, z: goal.z };
    if (!goal) return;
    const dx = goal.x - a.x,
      dz = goal.z - a.z;
    const dist = Math.hypot(dx, dz);
    a.yaw = Math.atan2(-dx, -dz);
    if (dist <= goal.stop) {
      if (goal.stop > 0.5) a.target = null; // 따라가기 멈춤 — 다음 산책은 새로
      return;
    }
    const stepLen = Math.min(dist - goal.stop, speed * dt);
    const nx = a.x + (dx / dist) * stepLen,
      nz = a.z + (dz / dist) * stepLen;
    const gy = this.groundAt(nx, nz, a.y);
    if (gy !== null && gy - a.y <= 1.05 && a.y - gy <= 2) {
      a.x = nx;
      a.z = nz;
      a.y = gy;
      a.dirty = true;
    } else {
      a.target = null; // 막혔다 — 다음 산책
      a.pauseUntil = now + 1000;
    }
  }

  private breed(a: Animal, b: Animal, now: number): void {
    a.loveUntil = b.loveUntil = 0;
    a.breedCooldownUntil = b.breedCooldownUntil = now + BREED_COOLDOWN_MS;
    const x = (a.x + b.x) / 2,
      z = (a.z + b.z) / 2;
    const y = this.groundAt(x, z, a.y) ?? a.y;
    const baby = this.add({ kind: a.kind, x, y, z, bornAt: now, adultAt: now + BABY_MS, owner: null, sitting: false, homeX: a.homeX, homeZ: a.homeZ }, now);
    this.hooks.json({ t: 'mob', ev: 'love', id: ANIMAL_ID_BASE + baby.id, mob: baby.kind, x, y, z });
    this.hooks.log(`${this.defs.get(a.kind).name} 아기가 태어났어요`);
  }

  private find(mobId: number): Animal | undefined {
    return this.animals.get(mobId - ANIMAL_ID_BASE);
  }

  /** 때리기. 길들인 동물은 못 때린다. 오류: NO_MOB · PET · TOO_FAR · COOLDOWN */
  hit(p: AnimalViewer, mobId: number, damage: number, now: number, reach = HIT_REACH): string | null {
    const a = this.find(mobId);
    if (!a) return 'NO_MOB';
    if (a.owner !== null) return 'PET';
    if (Math.hypot(a.x - p.x, a.y + mobSize(a.kind).h * 0.5 - p.eyeY, a.z - p.z) > reach + 0.6) return 'TOO_FAR';
    const last = this.lastHitAt.get(p.idx) ?? 0;
    if (now - last < HIT_COOLDOWN_MS) return 'COOLDOWN';
    this.lastHitAt.set(p.idx, now);
    a.hp = Math.max(0, a.hp - Math.floor(damage));
    const id = ANIMAL_ID_BASE + a.id;
    if (a.hp > 0) {
      // 놀라서 때린 사람 반대쪽으로 달아난다
      const dx = a.x - p.x,
        dz = a.z - p.z;
      const d = Math.hypot(dx, dz) || 1;
      a.target = { x: a.x + (dx / d) * 6, z: a.z + (dz / d) * 6 };
      a.pauseUntil = 0;
      this.hooks.json({ t: 'mob', ev: 'hit', id, mob: a.kind, x: a.x, y: a.y, z: a.z, dmg: Math.floor(damage) });
      return null;
    }
    const def = this.defs.get(a.kind);
    this.animals.delete(a.id);
    this.store?.deleteAnimal(a.id);
    this.hooks.json({ t: 'mob', ev: 'die', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
    const baby = this.isBaby(a, now);
    this.hooks.log(`${def.name}${baby ? ' 아기' : ''}이(가) 잡혔어요 (남은 ${def.name} ${this.wildCountOf(a.kind)}마리)`);
    this.hooks.reward(p.idx, baby ? [] : rollDrops(def, this.seed, a.id), def.xp, { x: a.x, y: a.y + 1, z: a.z }, now);
    return null;
  }

  /**
   * 탭(보조): 먹이면 먹고(아기는 빨리 자라고, 어른은 사랑), 뼈면 길들이기, 내 강아지에 빈손이면 앉기/일어나기.
   * 오류: NO_MOB · TOO_FAR · NOT_FOOD · PET_OTHER. 성공 null
   */
  use(p: AnimalViewer, mobId: number, held: string | null, now: number): string | null {
    const a = this.find(mobId);
    if (!a) return 'NO_MOB';
    if (Math.hypot(a.x - p.x, a.y + mobSize(a.kind).h * 0.5 - p.eyeY, a.z - p.z) > HIT_REACH + 1) return 'TOO_FAR';
    const def = this.defs.get(a.kind);
    const id = ANIMAL_ID_BASE + a.id;
    if (a.owner !== null && a.owner !== p.token) return 'PET_OTHER';
    if (held && def.food.includes(held)) {
      if (!this.hooks.consume(p.idx, held)) return 'NOT_FOOD';
      if (this.isBaby(a, now)) {
        a.adultAt = Math.max(now, (a.adultAt ?? now) - FEED_GROW_MS);
        a.dirty = true;
        this.hooks.json({ t: 'mob', ev: 'eat', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      } else if (a.breedCooldownUntil <= now) {
        a.loveUntil = now + LOVE_MS;
        this.hooks.json({ t: 'mob', ev: 'love', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      } else this.hooks.json({ t: 'mob', ev: 'eat', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      return null;
    }
    if (held && a.owner === null && def.tameWith.includes(held)) {
      if (!this.hooks.consume(p.idx, held)) return 'NOT_FOOD';
      a.tameAttempts++;
      if (tameRoll(this.seed, a.id, a.tameAttempts)) {
        a.owner = p.token;
        a.hp = animalMaxHp(def.hp, a.kind, true);
        a.homeX = a.x;
        a.homeZ = a.z;
        a.dirty = true;
        this.hooks.json({ t: 'mob', ev: 'tame', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
        this.hooks.log(`${def.name}이(가) 길들여졌어요`);
      } else this.hooks.json({ t: 'mob', ev: 'eat', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      return null;
    }
    if (a.owner === p.token && !held) {
      a.sitting = !a.sitting;
      a.target = null;
      a.dirty = true;
      this.hooks.json({ t: 'mob', ev: 'sit', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      return null;
    }
    return 'NOT_FOOD';
  }

  /** 바뀐 동물 저장 (flush 때) */
  save(): void {
    if (!this.store) return;
    for (const a of this.animals.values()) {
      if (!a.dirty) continue;
      a.dirty = false;
      this.store.updateAnimal({ id: a.id, kind: a.kind, x: a.x, y: a.y, z: a.z, bornAt: a.bornAt, adultAt: a.adultAt, owner: a.owner, sitting: a.sitting, homeX: a.homeX, homeZ: a.homeZ });
    }
  }
}
