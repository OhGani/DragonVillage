/**
 * 체력·낙하·죽음 규칙 (M7-1). 순수 함수 — 서버가 판정하고 클라는 표시.
 *
 * - 체력 20(하트 10). 허기 없음(DESIGN "v1에서 뺀다") → 맞은 지 REGEN_DELAY 가 지나면 REGEN_EVERY 마다 1 씩 저절로 찬다.
 * - 낙하: 마인크래프트처럼 3칸까지는 안 아프고 그 위로 한 칸마다 1. 물에 떨어지면 0, 드래곤을 타고 있으면 0.
 * - 죽음: 경험치 7×레벨(최대 100)을 구슬로 떨어뜨리고 레벨 0 (`xp.json death`). 구슬은 그 자리에 남고 지나가면 되찾는다.
 */
import type { XpRules } from './xp';
import { levelFromTotalXp } from './xp';

export const HP_MAX = 20;
/** 이 높이(칸)까지는 낙하 피해 없음 */
export const FALL_SAFE = 3;
/** 맞은 뒤 이만큼 지나야 회복이 시작된다 (ms) */
export const REGEN_DELAY_MS = 5000;
/** 회복 간격 (ms) — 1 씩 */
export const REGEN_EVERY_MS = 3000;
/** 구슬을 되찾는 거리 (칸) */
export const ORB_PICKUP_RANGE = 1.4;

/** 낙하 높이(칸) → 피해. 소수점 높이는 버린다 */
export function fallDamage(height: number): number {
  return Math.max(0, Math.floor(height - FALL_SAFE + 1e-6));
}

/**
 * 위치 흐름에서 낙하를 잰다. 공중에 뜬 동안 가장 높았던 y 를 기억하고, 땅에 닿는 순간 피해를 돌려준다.
 * peak = 공중에서 가장 높았던 y (땅이면 null). 물에 닿았거나 타고 있으면 피해 없이 잊는다.
 */
export function trackFall(peak: number | null, y: number, onGround: boolean, inWater: boolean, riding: boolean): { peak: number | null; damage: number } {
  if (riding || inWater) return { peak: null, damage: 0 };
  if (!onGround) return { peak: peak === null ? y : Math.max(peak, y), damage: 0 };
  if (peak === null) return { peak: null, damage: 0 };
  return { peak: null, damage: fallDamage(peak - y) };
}

/** 죽을 때 떨어뜨리는 경험치 (구슬 양). dropsXp 가 꺼져 있으면 0 */
export function deathXpDrop(rules: XpRules, total: number): number {
  if (!rules.death.dropsXp) return 0;
  const level = levelFromTotalXp(total);
  return Math.min(rules.death.dropMax, level * rules.death.dropPerLevel);
}

/** 죽은 뒤 남는 경험치 총량. 마인크래프트처럼 레벨 0 — dropsXp 가 꺼져 있으면 그대로 */
export function xpAfterDeath(rules: XpRules, total: number): number {
  return rules.death.dropsXp ? 0 : total;
}

/** 회복: 마지막으로 맞은 뒤 REGEN_DELAY 가 지났고, 마지막 회복에서 REGEN_EVERY 가 지났으면 1 */
export function regenAt(hp: number, lastHurtAt: number, lastRegenAt: number, now: number): number {
  if (hp >= HP_MAX) return 0;
  if (now - lastHurtAt < REGEN_DELAY_MS) return 0;
  if (now - Math.max(lastRegenAt, lastHurtAt) < REGEN_EVERY_MS) return 0;
  return 1;
}

/** 경험치 구슬 (세계에 놓인 것) */
export interface OrbInfo {
  id: number;
  x: number;
  y: number;
  z: number;
  amount: number;
}
