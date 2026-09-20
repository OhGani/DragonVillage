/**
 * 곡괭이 등급 (아들 설계 2026-09-20, data/tools.json).
 *
 * - 곡괭이가 필요한 블록(blocks.json tool: "pickaxe")은 곡괭이를 들면 speed 배 빨리 캔다.
 * - blocks.json toolTier 가 곡괭이 tier 보다 높으면 못 캔다. 맨손은 tier −1 (toolTier 0 만).
 * - 흑요석은 obsidianSpeed 가 있는 곡괭이만, "맨손으로 돌 캐는 속도" 기준 배수로.
 * - 내구도·인챈트는 값만 두고 아직 안 쓴다 (M6-6 대장간, v1.1 인챈트).
 */
import { z } from 'zod';
import { type BlockDef, DataError, koreanizeMessage } from './blocks';

const ToolsFile = z
  .object({
    _comment: z.string().optional(),
    enchantSpeedPerLevel: z.number().min(1, '1 이상이어야 해요'),
    pickaxes: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
            name: z.string().min(1, '이름이 비었어요'),
            tier: z.number().int().min(0, '0~4 사이여야 해요').max(4, '0~4 사이여야 해요'),
            speed: z.number().min(1, '1 이상이어야 해요'),
            obsidianSpeed: z.number().min(0.1).optional(),
            durability: z.number().int().min(1, '1 이상이어야 해요'),
          })
          .loose(),
      )
      .min(1, '곡괭이가 하나는 있어야 해요'),
  })
  .loose();

export interface PickaxeDef {
  readonly id: string;
  readonly name: string;
  readonly tier: number;
  readonly speed: number;
  readonly obsidianSpeed: number | null;
  readonly durability: number;
}

export interface ToolRules {
  readonly enchantSpeedPerLevel: number;
  readonly pickaxes: ReadonlyMap<string, PickaxeDef>;
}

/** 맨손은 나무 곡괭이와 같은 등급 0 (toolTier 0 인 돌·조약돌만, 속도는 배수 없음) */
export const HAND_TIER = 0;
/** 등급 → 그 등급 곡괭이 이름 (안내 문구용) */
export const TIER_KO: readonly string[] = ['나무', '돌', '철', '다이아몬드', '네더라이트'];

export function parseTools(raw: unknown, fileName = 'data/tools.json'): ToolRules {
  const result = ToolsFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const pickaxes = new Map<string, PickaxeDef>();
  for (const p of result.data.pickaxes) {
    if (seen.has(p.id)) problems.push(`곡괭이 '${p.id}' 가 두 번 나와요`);
    seen.add(p.id);
    pickaxes.set(p.id, { id: p.id, name: p.name, tier: p.tier, speed: p.speed, obsidianSpeed: p.obsidianSpeed ?? null, durability: p.durability });
  }
  if (problems.length) throw new DataError(fileName, problems);
  return { enchantSpeedPerLevel: result.data.enchantSpeedPerLevel, pickaxes };
}

/** 손에 든 아이템이 곡괭이면 그 정의, 아니면 null */
export function pickaxeOf(tools: ToolRules, item: string | null | undefined): PickaxeDef | null {
  return item ? (tools.pickaxes.get(item) ?? null) : null;
}

/** 이 블록을 이 도구로 캘 수 있나 (등급만 본다). 곡괭이가 필요 없는 블록은 언제나 ok */
export function canBreakWith(def: BlockDef, pick: PickaxeDef | null): boolean {
  if (def.hardness === null) return false;
  if (def.tool !== 'pickaxe') return true;
  if (def.id === 'obsidian') return pick !== null && pick.obsidianSpeed !== null && pick.tier >= def.toolTier;
  return (pick?.tier ?? HAND_TIER) >= def.toolTier;
}

/**
 * 부수는 데 걸리는 초. 못 캐면 null.
 * 곡괭이가 필요한 블록은 hardness / speed, 흑요석은 (돌 hardness) / obsidanSpeed. 그 외는 hardness 그대로
 */
export function breakSeconds(def: BlockDef, pick: PickaxeDef | null, stoneHardness = 1.5, enchantLevel = 0, tools?: ToolRules): number | null {
  if (!canBreakWith(def, pick) || def.hardness === null) return null;
  if (def.tool !== 'pickaxe' || !pick) return def.hardness;
  const ench = enchantLevel > 0 && tools ? Math.pow(tools.enchantSpeedPerLevel, enchantLevel) : 1;
  if (def.id === 'obsidian') return stoneHardness / ((pick.obsidianSpeed ?? 1) * ench);
  return def.hardness / (pick.speed * ench);
}

/** 못 캘 때 아이가 읽는 말 */
export function needToolText(def: BlockDef): string {
  if (def.id === 'obsidian') return '흑요석은 다이아몬드 곡괭이가 있어야 캘 수 있어요';
  const name = TIER_KO[def.toolTier] ?? '더 좋은';
  return `${name} 곡괭이가 있어야 캘 수 있어요`;
}
