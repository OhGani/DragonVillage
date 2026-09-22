/**
 * 드래곤 빔·기력 규칙 (M6-5, docs/DRAGON-SKILLS.md "전투 모델"). 순수 함수 — 서버가 판정하고 클라는 같은 식으로 미리 보여 준다.
 *
 * - 빔은 공통 시스템: 색과 세기(1~5)만 드래곤마다 다르다 (`dragons.json` skills 의 type "beam").
 * - 기력 100, 초당 5 회복. 어른은 최대치 ×1.5 (탑승은 어른만이라 실제로는 150). 빔은 스킬마다 정한 만큼 쓴다.
 * - 이번 단계는 연출만: 사거리 24칸·1.5초. 몹이 없어 피해는 M7, 블록은 부수지 않는다.
 */
import type { DragonDef } from './dragons';

export const STAMINA_MAX = 100;
export const STAMINA_REGEN_PER_SEC = 5;
/** 어른 드래곤 기력 최대치 배율 (dragons.json rules.growth.adultMultipliers.staminaMax 와 같은 값) */
export const ADULT_STAMINA_MULT = 1.5;
export const BEAM_RANGE = 24;
export const BEAM_DURATION_MS = 1500;

/** 빔 하나의 생김새·비용 */
export interface BeamDef {
  /** '#rrggbb' */
  readonly color: string;
  /** 세기 1(약한) ~ 5(가장 강력한). 두께·밝기·소리에 쓴다 */
  readonly power: number;
  readonly stamina: number;
  readonly cooldownSec: number;
}

/** 빔이 없는 드래곤(아들 설계에서 14/16 만 빔이 있다)은 회색 약한 빔으로 — 타면 누구나 쏠 수 있어야 재미가 있다 */
const FALLBACK_BEAM: BeamDef = { color: '#bdbdbd', power: 1, stamina: 25, cooldownSec: 6 };

export function beamOf(def: DragonDef): BeamDef {
  const s = def.skills.find((k) => k.type === 'beam');
  if (!s) return FALLBACK_BEAM;
  const num = (v: number | undefined, d: number, lo: number, hi: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
  return {
    color: typeof s.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.color) ? s.color : def.color,
    power: Math.round(num(s.powerLevel, 1, 1, 5)),
    stamina: num(s.stamina, 25, 0, 1000),
    cooldownSec: num(s.cooldownSec, 6, 0, 600),
  };
}

export function staminaMaxFor(stage: 'baby' | 'adult'): number {
  return stage === 'adult' ? Math.round(STAMINA_MAX * ADULT_STAMINA_MULT) : STAMINA_MAX;
}

/** 기력 상태: 마지막으로 정한 값과 그 시각. 사이는 회복 공식으로 채운다 (틱 없이) */
export interface Stamina {
  value: number;
  at: number;
}

export function staminaAt(s: Stamina, max: number, now: number): number {
  const dt = Math.max(0, now - s.at) / 1000;
  return Math.min(max, s.value + dt * STAMINA_REGEN_PER_SEC);
}

/**
 * 빔을 쏠 수 있나. ok 면 남은 기력과 다음에 쏠 수 있는 시각을 돌려준다.
 * 거절 사유: COOLDOWN(아직 식지 않았다) · NO_STAMINA(기력 부족)
 */
export function tryFire(s: Stamina, max: number, readyAt: number, beam: BeamDef, now: number): { ok: true; stamina: Stamina; readyAt: number } | { ok: false; reason: 'COOLDOWN' | 'NO_STAMINA'; stamina: number } {
  const cur = staminaAt(s, max, now);
  if (now < readyAt) return { ok: false, reason: 'COOLDOWN', stamina: cur };
  if (cur < beam.stamina) return { ok: false, reason: 'NO_STAMINA', stamina: cur };
  return { ok: true, stamina: { value: cur - beam.stamina, at: now }, readyAt: now + beam.cooldownSec * 1000 };
}

/** 시선 방향 단위 벡터 (클라 Player.lookDir 과 같은 식 — 서버가 빔 방향을 정할 때 쓴다) */
export function lookDirOf(yaw: number, pitch: number): { x: number; y: number; z: number } {
  const cp = Math.cos(pitch);
  return { x: -cp * Math.sin(yaw), y: Math.sin(pitch), z: -cp * Math.cos(yaw) };
}
