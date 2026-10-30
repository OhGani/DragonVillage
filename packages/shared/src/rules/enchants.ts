/**
 * 인챈트 (#231, v1.1): data/enchants.json. 인챈트 테이블 둘레 책장 수로 단계가 열리고, 경험치 레벨과 청금석을 쓴다.
 * 아이템 하나에 인챈트 하나(id 에 `.ench.<id>.<단계>` 가 붙는다 — items.ts). 효과 수치는 여기(meleeBonus 등)와 각 규칙 코드가 정한다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { type CombatRules, bowOf, equipSlotOf } from './combat';
import { enchantLevelOf, parseEnchanted, baseItemOf, encodeEnchanted } from './items';
import type { MobKind } from './mobs';
import { type ToolRules, toolOf } from './tools';

export const ENCHANT_TARGETS = ['sword', 'spear', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'armor', 'book'] as const;
export type EnchantTarget = (typeof ENCHANT_TARGETS)[number];
export const TARGET_KO: Record<EnchantTarget, string> = { sword: '검', spear: '창', axe: '도끼', pickaxe: '곡괭이', shovel: '삽', hoe: '괭이', bow: '활·쇠뇌', armor: '갑옷', book: '책' };
/** 책: 테이블에서 인챈트하면 인챈트 책(`book.ench.<id>.<단계>`), 모루에서 물건에 붙인다 (#232) */
export const BOOK = 'book';

const RawEnchant = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
    name: z.string().min(1, '이름이 비었어요').max(8, '이름은 8글자까지'),
    for: z.array(z.enum(ENCHANT_TARGETS)).min(1, '어디에 붙는지 하나는 적어요 (sword/spear/axe/pickaxe/shovel/hoe/bow/armor)'),
    max: z.number().int().min(1, '1 이상이어야 해요').max(5, '5단계까지예요'),
    _note: z.string().optional(),
  })
  .loose();
const EnchantFile = z
  .object({
    _comment: z.string().optional(),
    levelsPerLevel: z.number().int().min(0, '0 이상이어야 해요').optional(),
    lapisPerLevel: z.number().int().min(0, '0 이상이어야 해요').optional(),
    shelvesPerLevel: z.number().int().min(1, '1 이상이어야 해요').optional(),
    maxLevel: z.number().int().min(1).max(5, '5단계까지예요').optional(),
    anvilLevelsPerLevel: z.number().int().min(0, '0 이상이어야 해요').optional(),
    enchants: z.array(RawEnchant).min(1, '인챈트가 하나는 있어야 해요'),
  })
  .loose();

export interface EnchantDef {
  readonly id: string;
  readonly name: string;
  readonly for: readonly EnchantTarget[];
  readonly max: number;
  readonly note: string;
}

export class EnchantRules {
  readonly byId: ReadonlyMap<string, EnchantDef>;
  constructor(
    readonly list: readonly EnchantDef[],
    /** 단계마다 쓰는 경험치 레벨 */
    readonly levelsPerLevel: number,
    /** 단계마다 쓰는 청금석 */
    readonly lapisPerLevel: number,
    /** 책장 이만큼마다 한 단계 더 */
    readonly shelvesPerLevel: number,
    readonly maxLevel: number,
    /** 모루(#232): 결과 단계마다 쓰는 경험치 레벨 (청금석은 안 쓴다) */
    readonly anvilLevelsPerLevel = 2,
  ) {
    this.byId = new Map(list.map((e) => [e.id, e]));
  }
  /** 이 인챈트를 이 종류에 붙일 수 있나 — 책에는 어떤 인챈트든 (#232) */
  allows(def: EnchantDef, target: EnchantTarget): boolean {
    return target === 'book' || def.for.includes(target);
  }
  /** 모루에서 결과 단계에 드는 레벨 */
  anvilCost(level: number): number {
    return this.anvilLevelsPerLevel * level;
  }
  get(id: string): EnchantDef | null {
    return this.byId.get(id) ?? null;
  }
  /** 이 종류에 붙일 수 있는 인챈트 */
  optionsFor(target: EnchantTarget): EnchantDef[] {
    return this.list.filter((e) => this.allows(e, target));
  }
  /** 책장 수로 열리는 최대 단계: 0 → 1, shelvesPerLevel 마다 +1, maxLevel 까지 */
  maxLevelByShelves(shelves: number): number {
    return Math.min(this.maxLevel, 1 + Math.floor(Math.max(0, shelves) / this.shelvesPerLevel));
  }
  /** 단계에 드는 것 */
  cost(level: number): { levels: number; lapis: number } {
    return { levels: this.levelsPerLevel * level, lapis: this.lapisPerLevel * level };
  }
}

export function parseEnchants(raw: unknown, fileName = 'data/enchants.json'): EnchantRules {
  const result = EnchantFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const seen = new Set<string>();
  const problems: string[] = [];
  for (const e of result.data.enchants) {
    if (seen.has(e.id)) problems.push(`인챈트 '${e.id}' 가 두 번 있어요`);
    seen.add(e.id);
  }
  if (problems.length) throw new DataError(fileName, problems);
  const d = result.data;
  return new EnchantRules(
    d.enchants.map((e) => ({ id: e.id, name: e.name, for: e.for, max: e.max, note: e._note ?? '' })),
    d.levelsPerLevel ?? 3,
    d.lapisPerLevel ?? 1,
    d.shelvesPerLevel ?? 5,
    d.maxLevel ?? 3,
    d.anvilLevelsPerLevel ?? 2,
  );
}

/** 이 아이템은 어떤 종류인가 (인챈트를 붙일 수 있는 것만). 아니면 null */
export function enchantTargetOf(item: string | null | undefined, tools: ToolRules, combat: CombatRules): EnchantTarget | null {
  if (!item) return null;
  if (baseItemOf(item) === BOOK) return 'book';
  const t = toolOf(tools, item);
  if (t) return t.kind;
  if (bowOf(combat, item)) return 'bow';
  const slot = equipSlotOf(combat, item);
  if (slot && slot !== 'shield') return 'armor';
  return null;
}

/** 붙일 수 있나: 종류가 맞고 아직 안 붙어 있어야 */
export function canEnchant(item: string, tools: ToolRules, combat: CombatRules): { ok: true; target: EnchantTarget } | { ok: false; reason: 'ALREADY' | 'NOT_TARGET' } {
  if (parseEnchanted(item)) return { ok: false, reason: 'ALREADY' };
  const target = enchantTargetOf(item, tools, combat);
  return target ? { ok: true, target } : { ok: false, reason: 'NOT_TARGET' };
}

/** 테이블 둘레 책장 수: 한 칸 띄운 5×5 테두리, 테이블 높이와 그 위 한 층 (마인크래프트처럼). 최대 32 */
export function countBookshelves(idAt: (x: number, y: number, z: number) => string, x: number, y: number, z: number): number {
  let n = 0;
  for (let dy = 0; dy <= 1; dy++)
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) < 2 && Math.abs(dz) < 2) continue;
        if (idAt(x + dx, y + dy, z + dz) === 'bookshelf') n++;
      }
  return n;
}

export type AnvilReason = 'NEED_TWO' | 'NEED_ENCHANTED' | 'NOT_TARGET' | 'NOT_SAME' | 'BAD_ENCHANT' | 'OTHER_ENCHANT' | 'NO_GAIN';
export const ANVIL_REASON_KO: Record<AnvilReason, string> = {
  NEED_TWO: '왼쪽에 물건, 오른쪽에 인챈트 책(또는 같은 인챈트가 붙은 같은 물건)을 골라요',
  NEED_ENCHANTED: '오른쪽은 인챈트 책이나 인챈트가 붙은 물건이어야 해요',
  NOT_TARGET: '왼쪽은 도구·활·갑옷·인챈트 책이어야 해요',
  NOT_SAME: '같은 물건끼리만 합칠 수 있어요 (아니면 인챈트 책을 써요)',
  BAD_ENCHANT: '그 인챈트는 이 물건에 못 붙여요',
  OTHER_ENCHANT: '이미 다른 인챈트가 붙어 있어요 (하나만 붙어요)',
  NO_GAIN: '이미 그 단계예요 — 같은 단계 둘을 합쳐야 한 단계 올라가요',
};
/**
 * 모루 합치기 (#232): a(왼쪽) + b(오른쪽) → 결과 아이템과 드는 레벨. b 는 인챈트 책이거나 a 와 같은 물건(둘 다 인챈트 붙음).
 * a 에 아무것도 없으면 b 의 인챈트를 옮기고, 같은 인챈트면 단계가 높은 쪽 — 같은 단계면 한 단계 위(인챈트 max 까지). 다른 인챈트면 거절(하나만).
 */
export function anvilCombine(
  a: string | null | undefined,
  b: string | null | undefined,
  rules: EnchantRules,
  tools: ToolRules,
  combat: CombatRules,
): { ok: true; out: string; levels: number; level: number; ench: EnchantDef } | { ok: false; reason: AnvilReason } {
  if (!a || !b) return { ok: false, reason: 'NEED_TWO' };
  const eb = parseEnchanted(b);
  if (!eb) return { ok: false, reason: 'NEED_ENCHANTED' };
  const def = rules.get(eb.ench);
  if (!def) return { ok: false, reason: 'BAD_ENCHANT' };
  const ea = parseEnchanted(a);
  const base = ea?.base ?? a;
  const target = enchantTargetOf(base, tools, combat);
  if (!target) return { ok: false, reason: 'NOT_TARGET' };
  if (eb.base !== BOOK && eb.base !== base) return { ok: false, reason: 'NOT_SAME' };
  if (target === 'book' && !ea) return { ok: false, reason: 'NOT_TARGET' }; // 빈 책 + 인챈트 책은 옮기기일 뿐 — 책끼리는 둘 다 인챈트 책
  if (!rules.allows(def, target)) return { ok: false, reason: 'BAD_ENCHANT' };
  let level = eb.level;
  if (ea) {
    if (ea.ench !== eb.ench) return { ok: false, reason: 'OTHER_ENCHANT' };
    level = ea.level === eb.level ? Math.min(def.max, ea.level + 1) : Math.max(ea.level, eb.level);
    if (level <= ea.level) return { ok: false, reason: 'NO_GAIN' };
  }
  level = Math.min(level, def.max);
  return { ok: true, out: encodeEnchanted(base, eb.ench, level), levels: rules.anvilCost(level), level, ench: def };
}

const UNDEAD: readonly MobKind[] = ['zombie', 'husk', 'skeleton', 'stray', 'wither_skeleton', 'zombified_piglin'];
const ARTHROPODS: readonly MobKind[] = ['spider', 'spider_king'];

/** 근접 무기 인챈트가 이 몹에게 더 주는 피해: 날카로움 +1/단계, 강타(언데드) +2/단계, 살충(거미) +2/단계 */
export function meleeBonus(item: string | null | undefined, kind: MobKind): number {
  return enchantLevelOf(item, 'sharpness') + (UNDEAD.includes(kind) ? 2 * enchantLevelOf(item, 'smite') : 0) + (ARTHROPODS.includes(kind) ? 2 * enchantLevelOf(item, 'bane_of_arthropods') : 0);
}
/** 밀치기 배율: 단계마다 +0.8 */
export function knockbackFactor(item: string | null | undefined): number {
  return 1 + 0.8 * enchantLevelOf(item, 'knockback');
}
