/**
 * 마을 방어전 돌리기 (M7-5). 규칙은 shared/rules/raid.ts. 몹은 MobSystem(마을 무대, 자동 스폰 없음, 깃대가 goal).
 *
 * 흐름: start → warning(종, 45초) → 파도 1 → 다 잡으면 8초 뒤 다음 파도(못 잡아도 150초면 온다) → 파도 3(소환사) → 다 잡으면 승리.
 * 패배: 깃대 옆에 우민이 있고 사람이 없는 채 15초, 또는 10분이 다 됨. 어느 쪽이든 끝나면 몹은 사라지고 결과가 훅으로 간다.
 */
import {
  FLAG_POLE,
  GROUND_Y,
  type MobKind,
  RAID_CAPTURE_SEC,
  RAID_DEFEND_R,
  RAID_FLAG_R,
  RAID_WARNING_SEC,
  RAID_WAVE_MAX_SEC,
  RAID_WAVE_REST_SEC,
  type RaidPhase,
  type RaidRules,
  type RaidStateInfo,
  raidSpawnSpot,
  raidWave,
} from '@dragon-village/shared';
import type { MobSystem, MobTarget } from './mobs';

export interface RaidHooks {
  players(): MobTarget[];
  /** 1Hz 상태 (마을 모두에게) */
  state(s: RaidStateInfo): void;
  /** 종·파도 알림 (마을 모두에게 토스트) */
  notice(code: string, message: string): void;
  /** 끝났다. won 이면 승리 */
  finished(won: boolean, wave: number, now: number): void;
}

/** 깃대 앞 (우민이 노리는 자리) */
export const RAID_GOAL = { x: FLAG_POLE.x + 0.5, y: GROUND_Y + 1, z: FLAG_POLE.z + 1.5 };

export class RaidSystem {
  phase: RaidPhase = 'warning';
  wave = 0;
  /** 이 파도가 시작된 시각 */
  private waveAt = 0;
  /** 파도를 다 잡은 시각 (다음 파도 대기) */
  private clearedAt = 0;
  capture = 0;
  private lastStateAt = 0;
  private lastTickAt: number;
  readonly endsAt: number;
  done = false;

  constructor(
    readonly mobs: MobSystem,
    readonly rules: RaidRules,
    private readonly hooks: RaidHooks,
    readonly startedAt: number,
  ) {
    this.lastTickAt = startedAt;
    this.endsAt = startedAt + rules.durationSec * 1000;
    this.hooks.notice('RAID_BELL', `🔔 종이 울린다! ${RAID_WARNING_SEC}초 뒤 우민들이 북쪽에서 와요 — 깃대를 지켜요`);
  }

  get remaining(): number {
    return this.mobs.mobs.size;
  }

  private spawnWave(now: number): void {
    this.wave++;
    this.waveAt = now;
    this.clearedAt = 0;
    const list = raidWave(this.wave, this.rules.waves, Math.max(1, this.hooks.players().length));
    let i = 0;
    for (const kind of list) {
      const spot = raidSpawnSpot(i++);
      const y = this.mobs.groundAt(spot.x, spot.z, GROUND_Y) ?? GROUND_Y + 1;
      if (kind === 'evoker') this.mobs.spawnBoss(kind as MobKind, spot.x, y, spot.z, true);
      else this.mobs.spawnKind(kind, spot.x, y, spot.z);
    }
    this.phase = 'wave';
    const last = this.wave >= this.rules.waves;
    this.hooks.notice('RAID_WAVE', last ? `⚔️ 마지막 파도! 소환사가 왔다 — 우민 ${list.length}` : `⚔️ ${this.wave}번째 파도 — 우민 ${list.length}`);
  }

  tick(now: number): void {
    if (this.done) return;
    const dt = Math.min(0.5, (now - this.lastTickAt) / 1000);
    this.lastTickAt = now;
    const players = this.hooks.players();
    if (this.phase === 'warning') {
      if (now - this.startedAt >= RAID_WARNING_SEC * 1000) this.spawnWave(now);
    } else if (this.phase === 'wave') {
      this.mobs.tick(now);
      if (this.remaining === 0) {
        if (this.wave >= this.rules.waves) return this.finish(true, now);
        if (this.clearedAt === 0) {
          this.clearedAt = now;
          this.hooks.notice('RAID_CLEAR', `✅ ${this.wave}번째 파도를 막았어요! ${RAID_WAVE_REST_SEC}초 뒤 다음 파도`);
        } else if (now - this.clearedAt >= RAID_WAVE_REST_SEC * 1000) this.spawnWave(now);
      } else if (now - this.waveAt >= RAID_WAVE_MAX_SEC * 1000 && this.wave < this.rules.waves) {
        this.spawnWave(now); // 못 잡아도 다음 파도는 온다
      }
      // 깃대 점령: 우민이 깃대 옆에 있고 사람이 없으면 쌓인다
      let raiderNear = false;
      for (const m of this.mobs.mobs.values()) if (Math.hypot(m.x - RAID_GOAL.x, m.z - RAID_GOAL.z) <= RAID_FLAG_R) raiderNear = true;
      const defender = players.some((p) => Math.hypot(p.x - RAID_GOAL.x, p.z - RAID_GOAL.z) <= RAID_DEFEND_R);
      if (raiderNear && !defender) {
        const before = this.capture;
        this.capture = Math.min(RAID_CAPTURE_SEC, this.capture + dt);
        if (before < 5 && this.capture >= 5) this.hooks.notice('RAID_FLAG', '🚩 우민이 깃대를 잡았어요! 빨리 막아요');
        if (this.capture >= RAID_CAPTURE_SEC) return this.finish(false, now);
      } else this.capture = Math.max(0, this.capture - dt * 0.5);
    }
    if (now >= this.endsAt) return this.finish(false, now);
    if (now - this.lastStateAt >= 1000) {
      this.lastStateAt = now;
      this.hooks.state(this.state(now));
    }
  }

  state(now: number): RaidStateInfo {
    return {
      phase: this.phase,
      wave: this.wave,
      waves: this.rules.waves,
      remaining: this.remaining,
      secLeft: Math.max(0, Math.ceil((this.endsAt - now) / 1000)),
      warnLeft: this.phase === 'warning' ? Math.max(0, Math.ceil((this.startedAt + RAID_WARNING_SEC * 1000 - now) / 1000)) : 0,
      capture: Math.round(this.capture),
    };
  }

  private finish(won: boolean, now: number): void {
    if (this.done) return;
    this.done = true;
    this.phase = won ? 'won' : 'lost';
    this.mobs.clear();
    this.mobs.broadcastState();
    this.hooks.state(this.state(now));
    this.hooks.finished(won, this.wave, now);
  }
}
