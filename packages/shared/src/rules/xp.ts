/**
 * 경험치·레벨 (M6-1, docs/XP-SYSTEM.md) — 마인크래프트 Java 공식 그대로. 정본 data/xp.json.
 *
 * - 레벨 공식은 코드, "얻는 양·쓰는 양"은 JSON(아들이 숫자를 바꾼다).
 * - 경험치는 플레이어 개인 것이고 서버가 진실. 할 일과는 절대 연결하지 않는다(규칙 4).
 * - 범위값([최소, 최대])은 자리·시드로 결정론적으로 뽑는다 (Math.random 금지).
 */
import { z } from 'zod';
import { hash3 } from '../math/prng';
import { DataError, koreanizeMessage } from './blocks';

const Range = z.tuple([z.number().int().min(0, '0 이상이어야 해요'), z.number().int().min(0, '0 이상이어야 해요')]);

const XpFile = z
  .object({
    _comment: z.string().optional(),
    levelFormula: z.literal('minecraft-java'),
    mining: z.record(z.string(), z.union([Range, z.string()])),
    smelting: z.record(z.string(), z.union([z.number().min(0), z.string()])),
    mobs: z.record(z.string(), z.union([z.number().int().min(0), Range, z.string()])),
    ours: z
      .object({
        expeditionReturn: z.number().int().min(0),
        treasureChestOpen: z.number().int().min(0),
        codexNewEntry: z.number().int().min(0),
        dragonHatchedPerTier: z.number().int().min(0),
        dragonGrownPerTier: z.number().int().min(0),
        allDragonsCollected: z.number().int().min(0),
        allDragonsTitle: z.string(),
      })
      .loose(),
    hatchLevelCostByTier: z.record(z.string(), z.union([z.number().int().min(0), z.string()])),
    cosmeticUnlocksByLevel: z.record(z.string(), z.string()),
    death: z
      .object({
        dropsXp: z.boolean(),
        dropPerLevel: z.number().int().min(0),
        dropMax: z.number().int().min(0),
      })
      .loose(),
  })
  .loose();

export interface XpRules {
  /** 블록 id → [최소, 최대] */
  readonly mining: ReadonlyMap<string, readonly [number, number]>;
  readonly smelting: ReadonlyMap<string, number>;
  /** 몹 id → [최소, 최대] (숫자 하나면 [n, n]) */
  readonly mobs: ReadonlyMap<string, readonly [number, number]>;
  readonly ours: {
    readonly expeditionReturn: number;
    readonly treasureChestOpen: number;
    readonly codexNewEntry: number;
    readonly dragonHatchedPerTier: number;
    readonly dragonGrownPerTier: number;
    readonly allDragonsCollected: number;
    readonly allDragonsTitle: string;
  };
  /** 티어(1..16) → 부화에 드는 레벨 */
  readonly hatchLevelCostByTier: ReadonlyMap<number, number>;
  /** 레벨 → 해제되는 꾸미기 id */
  readonly cosmeticUnlocksByLevel: ReadonlyMap<number, string>;
  readonly death: { readonly dropsXp: boolean; readonly dropPerLevel: number; readonly dropMax: number };
}

function numMap<T>(rec: Record<string, T | string>, keyFn: (k: string) => number | string = (k) => k): Map<number | string, T> {
  const m = new Map<number | string, T>();
  for (const [k, v] of Object.entries(rec)) {
    if (k.startsWith('_') || typeof v === 'string') continue;
    m.set(keyFn(k), v);
  }
  return m;
}

export function parseXp(raw: unknown, fileName = 'data/xp.json'): XpRules {
  const result = XpFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const d = result.data;
  const problems: string[] = [];
  for (const [k, v] of Object.entries(d.mining)) if (typeof v !== 'string' && v[0] > v[1]) problems.push(`mining.${k}: [최소, 최대] 순서예요`);
  for (let t = 1; t <= 16; t++) if (typeof d.hatchLevelCostByTier[String(t)] !== 'number') problems.push(`hatchLevelCostByTier 에 티어 ${t} 이 없어요`);
  if (problems.length) throw new DataError(fileName, problems);
  return {
    mining: numMap(d.mining) as ReadonlyMap<string, readonly [number, number]>,
    smelting: numMap(d.smelting) as ReadonlyMap<string, number>,
    mobs: new Map([...numMap(d.mobs)].map(([k, v]) => [String(k), typeof v === 'number' ? ([v, v] as const) : (v as readonly [number, number])])),
    ours: d.ours,
    hatchLevelCostByTier: numMap(d.hatchLevelCostByTier, Number) as ReadonlyMap<number, number>,
    cosmeticUnlocksByLevel: new Map(
      Object.entries(d.cosmeticUnlocksByLevel)
        .filter(([k]) => !k.startsWith('_') && Number.isInteger(Number(k)))
        .map(([k, v]) => [Number(k), v] as const),
    ),
    death: d.death,
  };
}

// ---------------------------------------------------------------- 레벨 공식 (마인크래프트 Java)

/** 레벨 L 에서 다음 레벨까지 필요한 경험치 */
export function xpToNextLevel(level: number): number {
  if (level <= 15) return 2 * level + 7;
  if (level <= 30) return 5 * level - 38;
  return 9 * level - 158;
}

/** 레벨 L 에 도달하기까지의 총 경험치 */
export function totalXpForLevel(level: number): number {
  if (level <= 16) return level * level + 6 * level;
  if (level <= 31) return 2.5 * level * level - 40.5 * level + 360;
  return 4.5 * level * level - 162.5 * level + 2220;
}

/** 총 경험치 → 레벨 (내림) */
export function levelFromTotalXp(total: number): number {
  let level = 0;
  while (totalXpForLevel(level + 1) <= total) level++;
  return level;
}

export interface XpProgress {
  level: number;
  /** 이번 레벨에서 모은 양 */
  into: number;
  /** 다음 레벨까지 필요한 양 */
  need: number;
  /** 0..1 (바) */
  progress: number;
}

export function xpProgress(total: number): XpProgress {
  const t = Math.max(0, Math.floor(total));
  const level = levelFromTotalXp(t);
  const into = t - totalXpForLevel(level);
  const need = xpToNextLevel(level);
  return { level, into, need, progress: Math.min(1, into / need) };
}

/**
 * 레벨을 지불하고 남는 총 경험치 (부화 등). 마인크래프트 인챈트처럼 "레벨 단위"로 깎는다:
 * 현재 레벨 L, 비용 c → 레벨 L−c 의 총 경험치 + 지금 레벨 안 진행도는 버림(마인크래프트와 같음)
 */
export function spendLevels(total: number, cost: number): { ok: true; total: number } | { ok: false; level: number } {
  const level = levelFromTotalXp(total);
  if (level < cost) return { ok: false, level };
  return { ok: true, total: totalXpForLevel(level - cost) };
}

// ---------------------------------------------------------------- 얻는 양

/** 블록을 캐서 얻는 경험치. 범위는 자리·시드로 결정론. 표에 없으면 0 */
export function miningXp(rules: XpRules, blockId: string, x: number, y: number, z: number, seed: number): number {
  const r = rules.mining.get(blockId);
  if (!r) return 0;
  const [lo, hi] = r;
  return hi > lo ? lo + Math.floor(hash3(x, y, z, seed ^ 0x3a7f11) * (hi - lo + 1)) : lo;
}

/** 티어별 부화 비용(레벨). 모르는 티어는 가장 비싼 값 */
export function hatchCost(rules: XpRules, tier: number): number {
  return rules.hatchLevelCostByTier.get(tier) ?? Math.max(...rules.hatchLevelCostByTier.values());
}

/** 이 레벨 구간을 지나며 새로 열린 꾸미기 (from < level ≤ to) */
export function unlockedBetween(rules: XpRules, from: number, to: number): { level: number; id: string }[] {
  const out: { level: number; id: string }[] = [];
  for (const [level, id] of rules.cosmeticUnlocksByLevel) if (level > from && level <= to) out.push({ level, id });
  return out.sort((a, b) => a.level - b.level);
}

/** 꾸미기 id → 아이가 읽는 말 */
export const COSMETIC_KO: Readonly<Record<string, string>> = {
  hat_basic: '모자',
  cape_basic: '망토',
  particle_trail: '반짝이 꼬리',
  title_veteran: '"베테랑" 칭호',
};

/** 경험치 출처 번호 (XpGained.source) */
export const XP_SOURCE = { mining: 0, expeditionReturn: 1, treasure: 2, codex: 3, hatch: 4, grow: 5, mob: 6 } as const;
