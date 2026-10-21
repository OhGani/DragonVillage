/**
 * 마을 동물 돌리기 (M8-1). 규칙은 shared/rules/animals.ts, 여기는 세계·플레이어·저장과 잇는 살.
 * 5Hz 로 걷고(한가롭게), 먹이 든 사람·주인을 따르고, 사랑하면 아기를 낳고, 아기는 자란다. 위치·상태는 `animals` 표에 저장 — 서버를 켰다 꺼도 남는다.
 * 클라에는 원정 몹과 같은 MobsState 로 간다(id 는 ANIMAL_ID_BASE 부터, state 윗자리에 아기·길들임·앉음·사랑).
 */
import {
  ANIMAL_FLAG,
  ANIMAL_ID_BASE,
  animalMaxHp,
  ANIMALS_MAX,
  animalSpotCandidate,
  BABY_MS,
  BLACKSMITH_NAME,
  type BlockRegistry,
  BREED_COOLDOWN_MS,
  BREED_RANGE,
  EGG_EVERY_MS,
  EGG_ITEM,
  EGG_MAX,
  FEED_GROW_MS,
  FOLLOW_RANGE,
  FOLLOW_STOP,
  GROUND_Y,
  herdSpotCandidate,
  HIT_COOLDOWN_MS,
  HIT_REACH,
  INITIAL_ANIMALS,
  isAnimalSpot,
  isMountKind,
  LOVE_MS,
  MOB_KIND_NUM,
  MOB_STATE,
  type MobEntry,
  type MobKind,
  type MobRegistry,
  mobSize,
  PET_FOLLOW_STOP,
  PET_TELEPORT_RANGE,
  RESPAWN_BATCH,
  RESPAWN_EVERY_MS,
  rollDrops,
  SADDLE,
  shearRoll,
  SHEARS_ITEM,
  siteOf,
  tameRoll,
  VILLAGER_SPEED_MULT,
  villagerSpot,
  type VoxelWorld,
  WANDER_SPEED_MULT,
  wanderPause,
  wanderPick,
  wanderPickVillager,
  WOOL_ITEM,
  WOOL_REGROW_MS,
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
  /** 풀어놓은 펫 (#174): 주인을 안 따라오고 집(풀어놓은 자리) 둘레를 산책한다 */
  free: boolean;
  homeX: number;
  homeZ: number;
  /** 양털이 다시 자라는 시각 (0 = 털 있음) */
  woolAt: number;
  /** 품은 달걀 수 (닭) */
  eggs: number;
  lastEggAt: number;
  /** 펫 이름 (#109, pet-names.json 에서만) */
  name: string | null;
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
  /** 우민에게 잡혀간 주민 수 (#169): 돌아올 때까지 다시 안 채운다 */
  kidnapped?(): number;
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
  /** 양털 깎은 횟수 (수 결정용) */
  shearCount: number;
  /** 주인 따라 원정에 가 있다 (#145): 마을에선 안 보이고 안 움직인다. 저장 안 함 — 서버가 다시 켜지면 마을로 */
  away: boolean;
  /** 말 (#166): 타고 있는 사람 번호. 타는 동안 목록에서 빠지고(클라가 탄 사람 밑에 그린다) 안 움직인다 */
  ridden: number | null;
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
      const need = n - (kind === 'villager' ? this.houseVillagerCount() + (this.hooks.kidnapped?.() ?? 0) : this.wildCountOf(kind)); // 잡혀간 주민은 안 채운다 (#169), 대장장이는 안 센다 (#173)
      if (need > 0) added += this.spawnHerd(kind, need, i++, now);
    }
    if (added > 0) this.hooks.log(rows.length === 0 ? `동물 ${added}마리를 숲에 풀었어요` : `숲에 동물 ${added}마리를 채웠어요 (${this.animals.size}마리)`);
    this.lastRespawnAt = now;
  }

  private wrap(r: AnimalRow): Animal {
    const def = this.defs.get(r.kind);
    return { ...r, hp: animalMaxHp(def.hp, r.kind, r.owner !== null), yaw: 0, target: null, pauseUntil: 0, turn: 0, loveUntil: 0, breedCooldownUntil: 0, tameAttempts: 0, shearCount: 0, away: false, ridden: null, dirty: false };
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
      if (y !== null) return this.add({ kind, x: c.x, y, z: c.z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: c.x, homeZ: c.z, woolAt: 0, eggs: 0, lastEggAt: now, name: null }, now);
    }
    return null;
  }

  /** 같은 종류 n 마리를 한 무리로: 첫 마리 자리 곁(HERD_SPREAD)에 나머지. 곁에 못 서면 따로 선다. 돌려주는 값 = 실제로 생긴 수 */
  private spawnHerd(kind: MobKind, n: number, i: number, now: number): number {
    if (kind === 'villager') return this.spawnVillagers(n, now); // 주민은 숲이 아니라 집 앞에 (#168)
    const first = this.spawnWild(kind, i, now);
    if (!first) return 0;
    let made = 1;
    for (let k = 1; k < n; k++) {
      let placed: Animal | null = null;
      for (let attempt = 0; attempt < 12 && !placed; attempt++) {
        const c = herdSpotCandidate(this.seed, i, k, attempt, first);
        const y = this.grassSpot(c);
        if (y !== null) placed = this.add({ kind, x: c.x, y, z: c.z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: first.homeX, homeZ: first.homeZ, woolAt: 0, eggs: 0, lastEggAt: now, name: null }, now);
      }
      if (!placed) placed = this.spawnWild(kind, i * 31 + k, now);
      if (placed) made++;
    }
    return made;
  }

  /** 서로 밀어내기 (#174): 0.9칸보다 가까운 둘은 살짝 떨어뜨린다 (앉은 것·탄 말·원정 간 것은 빼고). 밀린 자리에 땅이 없으면 그대로 */
  private separate(): void {
    const list = [...this.animals.values()].filter((a) => !a.away && a.ridden === null && !a.sitting && a.kind !== 'boat');
    // 1칸 격자에 넣고 이웃 칸끼리만 본다 (동물 40마리 × 매 틱이라 전부 비교하면 시험이 느려진다)
    const cell = new Map<string, Animal[]>();
    for (const a of list) {
      const k = `${Math.floor(a.x)},${Math.floor(a.z)}`;
      let bucket = cell.get(k);
      if (!bucket) {
        bucket = [];
        cell.set(k, bucket);
      }
      bucket.push(a);
    }
    for (const a of list)
      for (let ox = -1; ox <= 1; ox++)
        for (let oz = -1; oz <= 1; oz++)
          for (const b of cell.get(`${Math.floor(a.x) + ox},${Math.floor(a.z) + oz}`) ?? []) {
            if (b.id <= a.id) continue;
            const dx = b.x - a.x,
              dz = b.z - a.z;
            const d = Math.hypot(dx, dz);
            if (d >= 0.9 || Math.abs(a.y - b.y) > 1.5) continue;
            const push = (0.9 - d) / 2;
            const ux = d > 0.01 ? dx / d : Math.cos(a.id * 1.7),
              uz = d > 0.01 ? dz / d : Math.sin(a.id * 1.7);
            for (const [c, sgn] of [
              [a, -1],
              [b, 1],
            ] as const) {
              const nx = c.x + ux * push * sgn,
                nz = c.z + uz * push * sgn;
              const gy = this.groundAt(nx, nz, c.y);
              if (gy !== null && Math.abs(gy - c.y) <= 1) {
                c.x = nx;
                c.z = nz;
                c.y = gy;
                c.dirty = true;
              }
            }
          }
  }

  /** 내 펫 전부 부르기 (#174): 앉은 것·풀어놓은 것도 따라오기로 바꾸고 옆에 세운다. 탄 말·원정 간 것은 빼고. 부른 수 */
  callPets(token: string, at: { x: number; y: number; z: number }): number {
    const mine = [...this.animals.values()].filter((a) => a.owner === token && !a.away && a.ridden === null);
    mine.forEach((a, i) => {
      a.sitting = false;
      a.free = false;
      a.target = null;
      const ang = (i / Math.max(1, mine.length)) * Math.PI * 2 + 0.8;
      const nx = at.x + Math.cos(ang) * 2,
        nz = at.z + Math.sin(ang) * 2;
      a.x = nx;
      a.z = nz;
      a.y = this.groundAt(nx, nz, at.y) ?? at.y;
      a.homeX = nx;
      a.homeZ = nz;
      a.dirty = true;
      this.hooks.json({ t: 'mob', ev: 'follow', id: ANIMAL_ID_BASE + a.id, mob: a.kind, x: a.x, y: a.y, z: a.z });
    });
    return mine.length;
  }

  /** 집 주민 수 (대장장이는 빼고, #173) */
  houseVillagerCount(): number {
    let n = 0;
    for (const a of this.animals.values()) if (a.kind === 'villager' && a.name !== BLACKSMITH_NAME) n++;
    return n;
  }
  hasBlacksmith(): boolean {
    return [...this.animals.values()].some((a) => a.kind === 'villager' && a.name === BLACKSMITH_NAME);
  }
  /** 대장장이 (#173): 대장간 문 앞(동쪽)에 선다 */
  spawnBlacksmith(now: number): void {
    const s = siteOf('forge');
    if (!s || this.hasBlacksmith()) return;
    const x = s.x0 + s.size[0] + 1.5,
      z = s.z0 + 2.5;
    const y = this.groundAt(x, z, GROUND_Y + 4) ?? GROUND_Y + 1;
    this.add({ kind: 'villager', x, y, z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: x, homeZ: z, woolAt: 0, eggs: 0, lastEggAt: now, name: BLACKSMITH_NAME }, now);
    this.hooks.log('대장장이가 대장간 앞에 왔어요');
  }

  /** 주민 (#168): 집 문 앞에 하나씩. 집은 세 채, 집마다 한 명씩 돌아가며 */
  private spawnVillagers(n: number, now: number): number {
    let made = 0;
    for (let k = 0; k < n; k++) {
      const c = villagerSpot(this.houseVillagerCount());
      const y = this.groundAt(c.x, c.z, GROUND_Y + 4) ?? GROUND_Y + 1;
      this.add({ kind: 'villager', x: c.x, y, z: c.z, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: c.x, homeZ: c.z, woolAt: 0, eggs: 0, lastEggAt: now, name: null }, now);
      made++;
    }
    return made;
  }

  private add(row0: Omit<AnimalRow, 'id' | 'free'> & { free?: boolean }, now: number): Animal {
    const row: Omit<AnimalRow, 'id'> = { ...row0, free: row0.free ?? false };
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
    if (a.kind === 'sheep' && a.woolAt > now) f |= ANIMAL_FLAG.sheared;
    return f;
  }

  isBaby(a: Animal, now: number): boolean {
    return a.adultAt !== null && a.adultAt > now;
  }

  entries(now: number): MobEntry[] {
    const out: MobEntry[] = [];
    for (const a of this.animals.values()) {
      if (a.away || a.ridden !== null) continue; // 원정에 가 있다 (#145) / 누가 타고 있다 (#166)
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
    for (const a of [...this.animals.values()]) if (!a.away && a.ridden === null) this.step(a, players, dt, now);
    this.separate();
    // 야생이 목표보다 줄면 다시 생긴다 (10분마다, 가장 모자란 종류를 둘씩 무리로) (#106)
    if (this.lastRespawnAt > now) this.lastRespawnAt = now; // 시계가 거꾸로면(테스트·시간 조정) 지금부터
    if (now - this.lastRespawnAt >= RESPAWN_EVERY_MS && this.animals.size < ANIMALS_MAX) {
      this.lastRespawnAt = now;
      let worst: MobKind | null = null,
        worstNeed = 0;
      for (const [kind, n] of Object.entries(INITIAL_ANIMALS) as [MobKind, number][]) {
        const need = n - (kind === 'villager' ? this.houseVillagerCount() + (this.hooks.kidnapped?.() ?? 0) : this.wildCountOf(kind));
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
    if (a.kind === 'boat') return; // 보트는 제자리에 떠 있다 (#209)
    const def = this.defs.get(a.kind);
    // 닭은 6분마다 달걀을 하나 품는다 (최대 3, 아기는 아직)
    if (a.kind === 'chicken' && !this.isBaby(a, now) && now - a.lastEggAt >= EGG_EVERY_MS) {
      if (a.eggs < EGG_MAX) a.eggs++;
      a.lastEggAt = now;
      a.dirty = true;
    }
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
    if (a.owner !== null && !a.free) {
      const owner = players.find((p) => p.token === a.owner);
      if (owner) {
        const d = Math.hypot(owner.x - a.x, owner.z - a.z);
        // 펫마다 주인 둘레 자기 자리 (#174, 아빠 "펫끼리 안 겹치게"): 따라오는 펫을 번호 순으로 둥글게
        const mates = [...this.animals.values()].filter((b) => b.owner === a.owner && !b.sitting && !b.free && !b.away && b.ridden === null).sort((p, q) => p.id - q.id);
        const slot = Math.max(0, mates.indexOf(a));
        const ang = (slot / Math.max(1, mates.length)) * Math.PI * 2 + 0.8;
        const spot = { x: owner.x + Math.cos(ang) * (PET_FOLLOW_STOP + 0.6), z: owner.z + Math.sin(ang) * (PET_FOLLOW_STOP + 0.6) };
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
        } else if (Math.hypot(spot.x - a.x, spot.z - a.z) > 0.9) goal = { x: spot.x, z: spot.z, stop: 0.4 };
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
    const roams = a.kind === 'villager' && a.name !== BLACKSMITH_NAME; // 주민은 마을 전체를 돌아다닌다 (#210). 대장장이는 대장간 앞에
    if (!goal) {
      speed *= roams ? VILLAGER_SPEED_MULT : WANDER_SPEED_MULT;
      if (a.target && Math.hypot(a.target.x - a.x, a.target.z - a.z) < 0.6) {
        a.target = null;
        a.pauseUntil = now + wanderPause(this.seed, a.id, a.turn) * 1000;
      }
      if (!a.target && now >= a.pauseUntil) {
        a.turn++;
        a.target = roams ? wanderPickVillager(this.seed, a.id, a.turn, a) : wanderPick(this.seed, a.id, a.turn, a, { x: a.homeX, z: a.homeZ });
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
    const baby = this.add({ kind: a.kind, x, y, z, bornAt: now, adultAt: now + BABY_MS, owner: null, sitting: false, homeX: a.homeX, homeZ: a.homeZ, woolAt: 0, eggs: 0, lastEggAt: now, name: null }, now);
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
    if (a.kind === 'villager') return 'VILLAGER'; // 주민은 때릴 수 없다 (#168)
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
   * 오류: NO_MOB · TOO_FAR · NOT_FOOD · PET_OTHER · NO_WOOL · NO_EGG · NO_MILK(아기 소). 성공 null
   */
  use(p: AnimalViewer, mobId: number, held: string | null, now: number): string | null {
    const a = this.find(mobId);
    if (!a) return 'NO_MOB';
    if (Math.hypot(a.x - p.x, a.y + mobSize(a.kind).h * 0.5 - p.eyeY, a.z - p.z) > HIT_REACH + 1) return 'TOO_FAR';
    const def = this.defs.get(a.kind);
    const id = ANIMAL_ID_BASE + a.id;
    if (a.owner !== null && a.owner !== p.token) return 'PET_OTHER';
    // 양털 깎기 (M8-1 3차): 가위를 들고 양을 탭 → 양털 1~3, 5분 뒤 다시
    if (held === SHEARS_ITEM && a.kind === 'sheep') {
      if (this.isBaby(a, now) || a.woolAt > now) return 'NO_WOOL';
      a.shearCount++;
      const n = shearRoll(this.seed, a.id, a.shearCount);
      a.woolAt = now + WOOL_REGROW_MS;
      a.dirty = true;
      this.hooks.reward(p.idx, [{ item: WOOL_ITEM, count: n }], 0, { x: a.x, y: a.y + 1, z: a.z }, now);
      this.hooks.json({ t: 'mob', ev: 'shear', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      this.hooks.log(`양털 ${n}개를 깎았어요 (양 #${a.id}, 다시 5분 뒤)`);
      return null;
    }
    // 우유 (#163): 빈 양동이를 들고 어른 소를 탭 → 양동이 하나가 우유 양동이로. 케이크 재료
    if (held === 'bucket' && a.kind === 'cow') {
      if (this.isBaby(a, now)) return 'NO_MILK';
      if (!this.hooks.consume(p.idx, 'bucket')) return 'NO_MILK';
      this.hooks.reward(p.idx, [{ item: 'milk_bucket', count: 1 }], 0, { x: a.x, y: a.y + 1, z: a.z }, now);
      this.hooks.json({ t: 'mob', ev: 'milk', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      return null;
    }
    // 달걀 (M8-1 3차): 빈손으로 닭을 탭 → 품은 달걀을 받는다
    if (!held && a.kind === 'chicken') {
      if (a.eggs <= 0) return 'NO_EGG';
      const n = a.eggs;
      a.eggs = 0;
      a.dirty = true;
      this.hooks.reward(p.idx, [{ item: EGG_ITEM, count: n }], 0, { x: a.x, y: a.y + 1, z: a.z }, now);
      this.hooks.json({ t: 'mob', ev: 'egg', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      return null;
    }
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
    // 말 (#166): 안장을 씌우면 내 말 (아들 7차 "말에 안장을 씌우면 탈 수 있다"). 확률 없음
    if (held === SADDLE && isMountKind(a.kind)) {
      if (a.owner !== null) return 'ALREADY_SADDLED';
      if (this.isBaby(a, now)) return 'NOT_FOOD';
      if (!this.hooks.consume(p.idx, SADDLE)) return 'NOT_FOOD';
      a.owner = p.token;
      a.hp = animalMaxHp(def.hp, a.kind, true);
      a.homeX = a.x;
      a.homeZ = a.z;
      a.dirty = true;
      this.hooks.json({ t: 'mob', ev: 'tame', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      this.hooks.log(`${def.name}에 안장을 씌웠어요 — 이제 ${p.idx}번의 말`);
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
      // 빈손 탭은 세 가지를 돈다 (#174): 따라오기 → 앉기 → 풀어놓기(그 자리 둘레 산책) → 따라오기
      a.target = null;
      a.dirty = true;
      if (!a.sitting && !a.free) {
        a.sitting = true;
        this.hooks.json({ t: 'mob', ev: 'sit', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      } else if (a.sitting) {
        a.sitting = false;
        a.free = true;
        a.homeX = a.x;
        a.homeZ = a.z;
        this.hooks.json({ t: 'mob', ev: 'free', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      } else {
        a.free = false;
        this.hooks.json({ t: 'mob', ev: 'follow', id, mob: a.kind, x: a.x, y: a.y, z: a.z });
      }
      return null;
    }
    return 'NOT_FOOD';
  }

  /** 주민 자리 (#169): 방어전 때 철 골렘이 설 곳 */
  villagerPositions(): { x: number; y: number; z: number }[] {
    return [...this.animals.values()].filter((a) => a.kind === 'villager' && !a.away).map((a) => ({ x: a.x, y: a.y, z: a.z }));
  }

  /** 방어전 패배 (#169, #114): 주민이 잡혀간다 — 다음 승리 때 돌아온다. 잡혀간 수 */
  kidnapVillagers(): number {
    let n = 0;
    for (const a of [...this.animals.values()]) {
      if (a.kind !== 'villager' || a.name === BLACKSMITH_NAME) continue; // 대장장이는 안 잡혀간다 (#173)
      this.animals.delete(a.id);
      this.store?.deleteAnimal(a.id);
      n++;
    }
    return n;
  }

  /** 방어전 승리 (#169): 잡혀갔던 주민이 집 앞으로 돌아온다 */
  returnVillagers(n: number, now: number): number {
    return this.spawnVillagers(n, now);
  }

  /** 이 동물이 내 말·돼지인가 (#166·#185) */
  isMyHorse(mobId: number, token: string): boolean {
    const a = this.find(mobId);
    return !!a && isMountKind(a.kind) && (a.owner === token || a.kind === 'boat'); // 보트는 누구나 (#209)
  }

  /** 동물 종류 (없으면 null) */
  kindOf(mobId: number): MobKind | null {
    return this.find(mobId)?.kind ?? null;
  }

  /** 말 타기 (#166): 내 말(안장 씌운 것)이고 아무도 안 타고 있으면 탄다. 오류: NO_MOB · NOT_HORSE · NOT_MINE · OCCUPIED · TOO_FAR */
  mount(p: AnimalViewer, mobId: number): string | null {
    const a = this.find(mobId);
    if (!a) return 'NO_MOB';
    if (!isMountKind(a.kind)) return 'NOT_HORSE';
    if (a.owner !== p.token && a.kind !== 'boat') return 'NOT_MINE';
    if (a.ridden !== null) return 'OCCUPIED';
    if (Math.hypot(a.x - p.x, a.y + mobSize(a.kind).h * 0.5 - p.eyeY, a.z - p.z) > HIT_REACH + 1) return 'TOO_FAR';
    a.ridden = p.idx;
    a.target = null;
    a.sitting = false;
    a.dirty = true;
    return null;
  }

  /** 보트 띄우기 (#209): 물 칸(x,y,z) 위에 보트를 놓는다. 보트 번호(몹 id)를 돌려준다 */
  placeBoat(x: number, y: number, z: number, now: number): number {
    const a = this.add({ kind: 'boat', x: x + 0.5, y: y + 0.9, z: z + 0.5, bornAt: now, adultAt: null, owner: null, sitting: false, homeX: x + 0.5, homeZ: z + 0.5, woolAt: 0, eggs: 0, lastEggAt: now, name: null }, now);
    return ANIMAL_ID_BASE + a.id;
  }

  /** 내리기 (#166): 그 사람이 타던 말을 그 자리에 세운다. 말 id 를 돌려준다(없으면 null) */
  releaseRider(idx: number, at: { x: number; y: number; z: number }): number | null {
    for (const a of this.animals.values()) {
      if (a.ridden !== idx) continue;
      a.ridden = null;
      a.x = at.x;
      a.y = at.y;
      a.z = at.z;
      a.homeX = a.x;
      a.homeZ = a.z;
      a.target = null;
      a.dirty = true;
      return ANIMAL_ID_BASE + a.id;
    }
    return null;
  }

  /** 펫 이름 짓기 (#109): 내 펫에게만, 목록의 이름만 */
  rename(token: string, mobId: number, name: string, names: { has(n: string): boolean }): string | null {
    const a = this.find(mobId);
    if (!a) return 'NO_MOB';
    if (a.owner !== token) return 'NOT_MINE';
    if (!names.has(name)) return 'BAD_NAME';
    a.name = name;
    a.dirty = true;
    this.hooks.log(`${this.defs.get(a.kind).name}에게 '${name}' 이름을 지어 줬어요`);
    return null;
  }

  /** 길들인 동물 목록 (이름·내 것인지) — 받는 사람 토큰 기준 */
  /**
   * 펫 원정 동행 (#145): 이 사람의 펫 중 앉아 있지 않고 maxDist 안에 있는 것을 데려간다 → 마을에서 사라지고 원정에선 클라가 주인을 따라다니게 그린다.
   * 데려간 것들의 목록을 돌려준다
   */
  takeAlong(token: string, x: number, z: number, maxDist: number): { id: number; kind: number; kindName: MobKind; name: string | null }[] {
    const out: { id: number; kind: number; kindName: MobKind; name: string | null }[] = [];
    for (const a of this.animals.values()) {
      if (a.owner !== token || a.sitting || a.away || isMountKind(a.kind)) continue; // 말·돼지는 원정에 안 따라간다 (#166·#185)
      if (Math.hypot(a.x - x, a.z - z) > maxDist) continue;
      a.away = true;
      a.target = null;
      this.hooks.json({ t: 'mob', ev: 'spawn', id: ANIMAL_ID_BASE + a.id, mob: a.kind, x: a.x, y: a.y, z: a.z }); // 마을 목록에서 빠지는 건 다음 MobsState 가 처리
      out.push({ id: ANIMAL_ID_BASE + a.id, kind: MOB_KIND_NUM[a.kind], kindName: a.kind, name: a.name });
    }
    return out;
  }

  /** 원정에서 돌아온 사람의 펫을 그 사람 옆에 둔다 (#145). 돌아온 수 */
  bringBack(token: string, x: number, y: number, z: number): number {
    let n = 0;
    for (const a of this.animals.values()) {
      if (a.owner !== token || !a.away) continue;
      a.away = false;
      const ang = (n / 4) * Math.PI * 2;
      a.x = x + Math.cos(ang) * 1.5;
      a.z = z + Math.sin(ang) * 1.5;
      a.y = this.groundAt(a.x, a.z, y) ?? y;
      a.homeX = a.x;
      a.homeZ = a.z;
      a.target = null;
      a.dirty = true;
      n++;
    }
    return n;
  }

  /** 지금 원정에 가 있는 펫 전부 (주인 token 별) */
  awayPets(): { id: number; kind: number; name: string | null; owner: string }[] {
    const out: { id: number; kind: number; name: string | null; owner: string }[] = [];
    for (const a of this.animals.values()) if (a.away && a.owner !== null) out.push({ id: ANIMAL_ID_BASE + a.id, kind: MOB_KIND_NUM[a.kind], name: a.name, owner: a.owner });
    return out;
  }

  petsFor(token: string): { id: number; name: string | null; mine: boolean; mode: 'follow' | 'sit' | 'free' }[] {
    const out: { id: number; name: string | null; mine: boolean; mode: 'follow' | 'sit' | 'free' }[] = [];
    for (const a of this.animals.values()) if (a.owner !== null || (a.kind === 'villager' && a.name)) out.push({ id: ANIMAL_ID_BASE + a.id, name: a.name, mine: a.owner === token, mode: a.sitting ? 'sit' : a.free ? 'free' : 'follow' }); // 이름 있는 주민(대장장이)도 이름표를 위해 (#173)
    return out;
  }

  /** 바뀐 동물 저장 (flush 때) */
  save(): void {
    if (!this.store) return;
    for (const a of this.animals.values()) {
      if (!a.dirty) continue;
      a.dirty = false;
      this.store.updateAnimal({ id: a.id, kind: a.kind, x: a.x, y: a.y, z: a.z, bornAt: a.bornAt, adultAt: a.adultAt, owner: a.owner, sitting: a.sitting, free: a.free, homeX: a.homeX, homeZ: a.homeZ, woolAt: a.woolAt, eggs: a.eggs, lastEggAt: a.lastEggAt, name: a.name });
    }
  }
}
