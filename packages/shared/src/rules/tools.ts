/**
 * 도구 (data/tools.json) — 곡괭이는 아들 설계(2026-09-20), 도끼는 아빠가 준 마인크래프트 값(2026-09-21, 결정 #80).
 *
 * - 곡괭이가 필요한 블록(blocks.json tool: "pickaxe")은 곡괭이를 들면 speed 배 빨리 캔다.
 * - blocks.json toolTier 가 곡괭이 tier 보다 높으면 못 캔다. 맨손은 tier 0 (toolTier 0 만).
 * - 흑요석은 obsidianSpeed 가 있는 곡괭이만, "맨손으로 돌 캐는 속도" 기준 배수로.
 * - 도끼가 빠른 블록(tool: "axe" — 원목·판자·문·상자 등)은 도끼를 들면 speed 배 빨리 캔다. **등급 제한은 없다**(맨손으로도 캔다).
 * - 곡괭이로 나무를, 도끼로 돌을 캐도 빨라지지 않는다 (종류가 맞아야 한다).
 * - 내구도·인챈트는 값만 두고 아직 안 쓴다 (M6-6 대장간, v1.1 인챈트).
 */
import { z } from 'zod';
import { type BlockDef, DataError, koreanizeMessage } from './blocks';

const RawTool = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
    name: z.string().min(1, '이름이 비었어요'),
    tier: z.number().int().min(0, '0~4 사이여야 해요').max(4, '0~4 사이여야 해요'),
    speed: z.number().min(1, '1 이상이어야 해요'),
    obsidianSpeed: z.number().min(0.1).optional(),
    durability: z.number().int().min(1, '1 이상이어야 해요'),
    /** 검·창만: 몹을 때리는 힘 (맨손 1) */
    damage: z.number().min(0, '0 이상이어야 해요').optional(),
    /** 창만 (#183): 몹에 닿는 거리(칸). 검·맨손은 HIT_REACH 3.5 */
    reach: z.number().min(1, '1 이상이어야 해요').optional(),
  })
  .loose();

const ToolsFile = z
  .object({
    _comment: z.string().optional(),
    enchantSpeedPerLevel: z.number().min(1, '1 이상이어야 해요'),
    pickaxes: z.array(RawTool).min(1, '곡괭이가 하나는 있어야 해요'),
    axes: z.array(RawTool).optional(),
    swords: z.array(RawTool).optional(),
    spears: z.array(RawTool).optional(),
    shovels: z.array(RawTool).optional(),
    hoes: z.array(RawTool).optional(),
  })
  .loose();

/** 도구 종류 — blocks.json 의 tool 과 같은 말 */
export type ToolKind = 'pickaxe' | 'axe' | 'sword' | 'spear' | 'shovel' | 'hoe';

export interface ToolDef {
  readonly id: string;
  readonly name: string;
  readonly kind: ToolKind;
  readonly tier: number;
  readonly speed: number;
  readonly obsidianSpeed: number | null;
  readonly durability: number;
  /** 검의 공격력 (다른 도구는 null → 등급으로 계산) */
  readonly damage: number | null;
  /** 창만: 닿는 거리. 아니면 null */
  readonly reach: number | null;
}

/** 옛 이름 (M6-1 부터 쓰던 것) */
export type PickaxeDef = ToolDef;

export interface ToolRules {
  readonly enchantSpeedPerLevel: number;
  readonly pickaxes: ReadonlyMap<string, ToolDef>;
  readonly axes: ReadonlyMap<string, ToolDef>;
  readonly swords: ReadonlyMap<string, ToolDef>;
  /** 창 (#183): 검보다 멀리 닿는다 */
  readonly spears: ReadonlyMap<string, ToolDef>;
  /** 삽 (#191): 흙·모래를 빨리 파고, 잔디를 길로 다듬는다 */
  readonly shovels: ReadonlyMap<string, ToolDef>;
  /** 괭이 (#193): 흙·잔디를 밭으로 간다 */
  readonly hoes: ReadonlyMap<string, ToolDef>;
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
  const load = (raws: readonly z.infer<typeof RawTool>[], kind: ToolKind, ko: string): Map<string, ToolDef> => {
    const out = new Map<string, ToolDef>();
    for (const t of raws) {
      if (seen.has(t.id)) problems.push(`${ko} '${t.id}' 가 두 번 나와요`);
      seen.add(t.id);
      out.set(t.id, { id: t.id, name: t.name, kind, tier: t.tier, speed: t.speed, obsidianSpeed: t.obsidianSpeed ?? null, durability: t.durability, damage: t.damage ?? null, reach: t.reach ?? null });
    }
    return out;
  };
  const pickaxes = load(result.data.pickaxes, 'pickaxe', '곡괭이');
  const axes = load(result.data.axes ?? [], 'axe', '도끼');
  const swords = load(result.data.swords ?? [], 'sword', '검');
  for (const s of swords.values()) if (s.damage === null) problems.push(`검 '${s.id}' 에 damage(공격력)가 없어요`);
  const spears = load(result.data.spears ?? [], 'spear', '창');
  const shovels = load(result.data.shovels ?? [], 'shovel', '삽');
  const hoes = load(result.data.hoes ?? [], 'hoe', '괭이');
  for (const s of spears.values()) {
    if (s.damage === null) problems.push(`창 '${s.id}' 에 damage(공격력)가 없어요`);
    if (s.reach === null) problems.push(`창 '${s.id}' 에 reach(닿는 거리)가 없어요`);
  }
  if (problems.length) throw new DataError(fileName, problems);
  return { enchantSpeedPerLevel: result.data.enchantSpeedPerLevel, pickaxes, axes, swords, spears, shovels, hoes };
}

/** 손에 든 아이템이 곡괭이면 그 정의, 아니면 null */
export function pickaxeOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.pickaxes.get(item) ?? null) : null;
}

/** 손에 든 아이템이 도끼면 그 정의, 아니면 null */
export function axeOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.axes.get(item) ?? null) : null;
}

/** 손에 든 아이템이 검이면 그 정의, 아니면 null */
export function swordOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.swords.get(item) ?? null) : null;
}

/** 손에 든 아이템이 창이면 그 정의, 아니면 null (#183) */
export function spearOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.spears.get(item) ?? null) : null;
}

/** 손에 든 아이템이 삽이면 그 정의, 아니면 null (#191) */
export function shovelOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.shovels.get(item) ?? null) : null;
}

/** 손에 든 아이템이 괭이면 그 정의, 아니면 null (#193) */
export function hoeOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return item ? (tools.hoes.get(item) ?? null) : null;
}

/** 괭이로 밭을 갈 수 있는 땅 (#193) */
export const TILLABLE = new Set(['dirt', 'grass', 'grass_path']);
/** 밭에 물이 닿는 거리 (#193, 마인크래프트 4칸): 같은 높이나 한 칸 위에 물이 있으면 된다 */
export const FARM_WATER_RANGE = 4;
/** (x,y,z) 둘레 FARM_WATER_RANGE 칸 안(같은 높이·한 칸 위)에 물이 있나. isWater 는 블록 번호가 물인지 */
export function hasWaterNear(isWater: (x: number, y: number, z: number) => boolean, x: number, y: number, z: number): boolean {
  for (let dy = 0; dy <= 1; dy++)
    for (let dx = -FARM_WATER_RANGE; dx <= FARM_WATER_RANGE; dx++)
      for (let dz = -FARM_WATER_RANGE; dz <= FARM_WATER_RANGE; dz++)
        if (isWater(x + dx, y + dy, z + dz)) return true;
  return false;
}
/** 뼛가루 (#193): 자라는 것(작물 싹·묘목)에 쓰면 바로 다 자란다 */
export const BONE_MEAL = 'bone_meal';

/** 손에 든 아이템이 도구(곡괭이·도끼·검·창·삽·괭이)면 그 정의, 아니면 null */
export function toolOf(tools: ToolRules, item: string | null | undefined): ToolDef | null {
  return pickaxeOf(tools, item) ?? axeOf(tools, item) ?? swordOf(tools, item) ?? spearOf(tools, item) ?? shovelOf(tools, item) ?? hoeOf(tools, item);
}

/** 이 도구로 몹에 닿는 거리: 창은 제 reach, 나머지는 기본 (#183) */
export function hitReachOf(tool: ToolDef | null, base: number): number {
  return tool?.kind === 'spear' && tool.reach !== null ? tool.reach : base;
}

/** 이 블록을 이 도구로 캘 수 있나 (등급만 본다). 곡괭이가 필요 없는 블록은 언제나 ok (도끼 블록도 맨손으로 캔다) */
export function canBreakWith(def: BlockDef, tool: ToolDef | null): boolean {
  if (def.hardness === null) return false;
  if (def.tool !== 'pickaxe') return true;
  const pick = tool?.kind === 'pickaxe' ? tool : null;
  if (def.id === 'obsidian') return pick !== null && pick.obsidianSpeed !== null && pick.tier >= def.toolTier;
  return (pick?.tier ?? HAND_TIER) >= def.toolTier;
}

/**
 * 부수는 데 걸리는 초. 못 캐면 null.
 * 블록이 바라는 도구(tool)와 손에 든 도구 종류가 맞아야 빨라진다 — hardness / speed.
 * 흑요석만 (돌 hardness) / obsidianSpeed. 맞는 도구가 없으면 hardness 그대로(맨손 속도)
 */
export function breakSeconds(def: BlockDef, tool: ToolDef | null, stoneHardness = 1.5, enchantLevel = 0, tools?: ToolRules): number | null {
  if (!canBreakWith(def, tool) || def.hardness === null) return null;
  if (def.tool === null || !tool || tool.kind !== def.tool) return def.hardness;
  const ench = enchantLevel > 0 && tools ? Math.pow(tools.enchantSpeedPerLevel, enchantLevel) : 1;
  if (def.id === 'obsidian') return stoneHardness / ((tool.obsidianSpeed ?? 1) * ench);
  return def.hardness / (tool.speed * ench);
}

/** 못 캘 때 아이가 읽는 말 */
export function needToolText(def: BlockDef): string {
  if (def.id === 'obsidian') return '흑요석은 다이아몬드 곡괭이가 있어야 캘 수 있어요';
  const name = TIER_KO[def.toolTier] ?? '더 좋은';
  return `${name} 곡괭이가 있어야 캘 수 있어요`;
}
