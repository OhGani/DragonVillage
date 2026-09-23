/**
 * 원정 몹 돌리기 (M7-2): 밤이면 생기고, 사람을 쫓고, 물고, 터진다. 규칙은 shared/rules/mobs.ts, 여기는 세계·플레이어와 잇는 살.
 * 블록은 절대 안 부수고, 피해는 플레이어에게만 간다(몹끼리·드래곤은 없음 = 아군 피해 없음).
 */
import {
  type BlockRegistry,
  HIT_COOLDOWN_MS,
  HIT_REACH,
  MOB_KIND_NUM,
  MOB_MAX,
  MOB_SIZE,
  type MobEntry,
  type MobKind,
  type MobRegistry,
  type MobState,
  SPAWN_EVERY_MS,
  beamHitsMob,
  encodeMobsState,
  explosionDamage,
  pickSpawn,
  rollDrops,
  stepMob,
} from '@dragon-village/shared';
import type { Expedition } from './expedition';

export interface MobTarget {
  idx: number;
  x: number;
  y: number;
  z: number;
  /** 눈높이 */
  eyeY: number;
}

export interface MobHooks {
  /** 원정에 있는 사람들 */
  players(): MobTarget[];
  hurt(idx: number, amount: number, cause: string, now: number): void;
  /** 원정 사람 모두에게 */
  broadcast(bytes: Uint8Array): void;
  json(obj: unknown): void;
  /** 드롭·경험치를 때린 사람에게 */
  reward(idx: number, drops: { item: string; count: number }[], xp: number, at: { x: number; y: number; z: number }, now: number): void;
}

const STEP_MS = 100;

export class MobSystem {
  readonly mobs = new Map<number, MobState>();
  private nextId = 1;
  private lastSpawnAt = 0;
  private lastStepAt = 0;
  private turn = 0;
  private readonly lastHitAt = new Map<number, number>();

  constructor(
    private readonly e: Expedition,
    private readonly registry: BlockRegistry,
    private readonly defs: MobRegistry,
    private readonly hooks: MobHooks,
  ) {}

  /** 밤인가 */
  isNight(now: number): boolean {
    return this.e.def.nightStartsAt > 0 && this.e.elapsedSec(now) >= this.e.def.nightStartsAt;
  }

  /** 그 자리의 발 높이 (위가 두 칸 비어 있는 첫 단단한 블록 위). 없으면 null */
  groundAt = (x: number, z: number): number | null => {
    const bx = Math.floor(x),
      bz = Math.floor(z);
    const w = this.e.world;
    if (!w.inBounds(bx, 0, bz)) return null;
    for (let y = Math.min(w.sizeY - 3, 90); y >= 1; y--) {
      const here = this.registry.get(w.getBlock(bx, y, bz));
      if (!here.solid || here.fluid) continue;
      const a1 = this.registry.get(w.getBlock(bx, y + 1, bz));
      const a2 = this.registry.get(w.getBlock(bx, y + 2, bz));
      if (!a1.solid && !a2.solid && !a1.fluid) return y + 1;
      return null; // 위가 막혀 있으면 못 선다
    }
    return null;
  };

  tick(now: number): void {
    const players = this.hooks.players();
    if (this.isNight(now) && !this.e.ended && players.length && this.mobs.size < MOB_MAX && now - this.lastSpawnAt >= SPAWN_EVERY_MS) {
      this.lastSpawnAt = now;
      this.turn++;
      const around = players[this.turn % players.length]!;
      const spot = pickSpawn(this.e.seed, this.turn, around, this.groundAt);
      if (spot) {
        const kind: MobKind = this.turn % 3 === 0 ? 'creeper' : 'zombie'; // 셋에 하나는 크리퍼
        const id = this.nextId++;
        this.mobs.set(id, { id, kind, x: spot.x, y: spot.y, z: spot.z, yaw: 0, hp: this.defs.get(kind).hp, state: 0, fuseAt: 0, lastAttackAt: 0 });
        this.hooks.json({ t: 'mob', ev: 'spawn', id, mob: kind, x: spot.x, y: spot.y, z: spot.z });
      }
    }
    if (this.mobs.size === 0) return;
    if (now - this.lastStepAt >= STEP_MS) {
      const dt = Math.min(0.5, (now - (this.lastStepAt || now - STEP_MS)) / 1000);
      this.lastStepAt = now;
      for (const m of [...this.mobs.values()]) {
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
        if (best > 40) target = null; // 너무 멀면 서성인다
        const ev = stepMob(m, def, target, dt, now, this.groundAt);
        if (ev === 'attack' && target) this.hooks.hurt(target.idx, def.damage, m.kind, now);
        else if (ev === 'explode') this.explode(m, def, players, now);
      }
    }
    this.hooks.broadcast(encodeMobsState(this.entries()));
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
    return [...this.mobs.values()].map((m) => ({ id: m.id, kind: MOB_KIND_NUM[m.kind], x: m.x, y: m.y, z: m.z, yaw: m.yaw, hp: m.hp, state: m.state }));
  }

  /** 때리기. 오류: NO_MOB · TOO_FAR · COOLDOWN */
  hit(p: MobTarget, mobId: number, damage: number, now: number): string | null {
    const m = this.mobs.get(mobId);
    if (!m) return 'NO_MOB';
    if (Math.hypot(m.x - p.x, m.y + MOB_SIZE.h * 0.5 - p.eyeY, m.z - p.z) > HIT_REACH + 0.6) return 'TOO_FAR';
    const last = this.lastHitAt.get(p.idx) ?? 0;
    if (now - last < HIT_COOLDOWN_MS) return 'COOLDOWN';
    this.lastHitAt.set(p.idx, now);
    this.damage(m, damage, p.idx, now);
    return null;
  }

  /** 드래곤 빔: 길 위 몹 전부에 4×세기. 맞은 수 */
  beam(from: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, range: number, power: number, shooterIdx: number, now: number): number {
    let n = 0;
    for (const m of [...this.mobs.values()]) {
      if (!beamHitsMob(from, dir, range, m, 0.9 + power * 0.15)) continue;
      n++;
      this.damage(m, 4 * power, shooterIdx, now);
    }
    return n;
  }

  private damage(m: MobState, amount: number, byIdx: number, now: number): void {
    m.hp = Math.max(0, m.hp - Math.floor(amount));
    if (m.hp > 0) {
      this.hooks.json({ t: 'mob', ev: 'hit', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
      return;
    }
    const def = this.defs.get(m.kind);
    this.mobs.delete(m.id);
    this.hooks.json({ t: 'mob', ev: 'die', id: m.id, mob: m.kind, x: m.x, y: m.y, z: m.z });
    this.hooks.reward(byIdx, rollDrops(def, this.e.seed, m.id), def.xp, { x: m.x, y: m.y + 1, z: m.z }, now);
  }

  clear(): void {
    this.mobs.clear();
  }
}
