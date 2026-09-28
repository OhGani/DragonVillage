/**
 * 전투 장비 규칙 (M8-2, 아빠 2026-09-24 "갑옷·방패·무기 제작 내용 보고 만들어 줘" — 마인크래프트/아이템/전투).
 * - `data/combat.json` 에서 갑옷 등급(가죽·철·황금·다이아몬드·네더라이트)·방패·활·쇠뇌·화살을 읽고, 갑옷 조각 20개와 제작법을 자동으로 만든다.
 * - 장비 칸 5개: 투구·흉갑·레깅스·부츠·방패. 서버가 진실(`players.equipment`), 클라는 가방에서 "입기/벗기" 요청만.
 * - 피해 계산은 마인크래프트 그대로: D × (1 − min(20, max(A/5, A − 4D/(min(T,20)+8))) / 25). 갑옷은 낙하·독에는 안 통한다.
 * - 방패(#107): 몹 근접·폭발 피해 절반, 약탈자 화살은 전부, 변명자 도끼는 무시. 폰이라 "들고 있는 동안만" 은 안 한다.
 * - 활·쇠뇌: 노린 몹을 향해 탭 → 화살 1개 소모, 사거리·피해·간격은 데이터. 화살이 날아가는 그림은 클라 연출.
 */
import { z } from 'zod';
import type { RecipeDef, Station } from './recipes';

export const ARMOR_SLOTS = ['helmet', 'chestplate', 'leggings', 'boots'] as const;
export type ArmorSlot = (typeof ARMOR_SLOTS)[number];
export const EQUIP_SLOTS = [...ARMOR_SLOTS, 'shield'] as const;
export type EquipSlot = (typeof EQUIP_SLOTS)[number];
/** 장비 칸: 아이템 id 또는 비어 있음 */
export type Equipment = Record<EquipSlot, string | null>;

export function emptyEquipment(): Equipment {
  return { helmet: null, chestplate: null, leggings: null, boots: null, shield: null };
}
export function isEquipSlot(v: unknown): v is EquipSlot {
  return typeof v === 'string' && (EQUIP_SLOTS as readonly string[]).includes(v);
}

export interface ArmorPiece {
  readonly id: string;
  readonly name: string;
  readonly slot: ArmorSlot;
  /** 등급 id (leather·iron·golden·diamond·netherite·turtle) */
  readonly tier: string;
  readonly defense: number;
  readonly toughness: number;
  readonly knockbackResist: number;
  readonly durability: number;
}
export interface BowDef {
  readonly id: string;
  readonly name: string;
  readonly damage: number;
  readonly cooldownMs: number;
  /** 시위를 가득 당기는 데 걸리는 시간 (#119) */
  readonly drawMs: number;
  readonly range: number;
}
export interface ShieldRule {
  readonly id: string;
  readonly name: string;
  /** 근접·폭발 피해에 곱하는 값 (0.5 = 절반) */
  readonly meleeBlock: number;
  /** 화살(약탈자) 피해에서 막는 비율 (1 = 전부) */
  readonly arrowBlock: number;
  /** 🛡️ 막기(#118)를 누르는 동안 막는 비율 (1 = 전부) */
  readonly guardBlock: number;
  /** 막는 동안 걸음 배율 */
  readonly guardSlow: number;
  /** 방패를 무시하는 몹 (도끼) */
  readonly ignoredBy: readonly string[];
}
export interface CombatRules {
  readonly armor: ReadonlyMap<string, ArmorPiece>;
  readonly shield: ShieldRule;
  readonly bows: ReadonlyMap<string, BowDef>;
  readonly arrow: { readonly id: string; readonly name: string };
  /** 자동으로 만든 제작법 (갑옷 조각·방패·활·쇠뇌·화살) */
  readonly recipes: readonly RecipeDef[];
  /** 아이템 id → 한국어 이름 */
  readonly itemNames: ReadonlyMap<string, string>;
}

const Count = z.record(z.string(), z.number().int().positive());
const SlotNumbers = z.object({ helmet: z.number(), chestplate: z.number(), leggings: z.number(), boots: z.number() });
const RawTier = z
  .object({
    id: z.string().regex(/^[a-z_]+$/),
    name: z.string(),
    material: z.string(),
    station: z.enum(['crafting_table', 'forge', 'inventory']),
    defense: SlotNumbers,
    toughness: z.number().min(0),
    knockbackResist: z.number().min(0).max(1).optional(),
    durability: SlotNumbers,
    pieceNames: z.object({ helmet: z.string(), chestplate: z.string(), leggings: z.string(), boots: z.string() }).partial().optional(),
    upgradeFrom: z.string().optional(),
  })
  .loose();
const RawExtra = z
  .object({ id: z.string(), name: z.string(), slot: z.enum(ARMOR_SLOTS), defense: z.number(), toughness: z.number().min(0), station: z.enum(['crafting_table', 'forge', 'inventory']), in: Count })
  .loose();
const RawCombat = z
  .object({
    armor: z
      .object({
        slots: z.record(z.enum(ARMOR_SLOTS), z.object({ name: z.string(), pieces: z.number().int().positive() }).loose()),
        tiers: z.array(RawTier),
        extra: z.array(RawExtra).optional(),
      })
      .loose(),
    shield: z
      .object({ id: z.string(), name: z.string(), station: z.enum(['crafting_table', 'forge', 'inventory']), in: Count, meleeBlock: z.number().min(0).max(1), arrowBlock: z.number().min(0).max(1), guardBlock: z.number().min(0).max(1).optional(), guardSlow: z.number().min(0).max(1).optional(), ignoredBy: z.array(z.string()).optional() })
      .loose(),
    bows: z.array(z.object({ id: z.string(), name: z.string(), station: z.enum(['crafting_table', 'forge', 'inventory']), in: Count, damage: z.number().positive(), cooldownMs: z.number().positive(), drawMs: z.number().positive().optional(), range: z.number().positive() }).loose()),
    arrow: z.object({ id: z.string(), name: z.string(), station: z.enum(['crafting_table', 'forge', 'inventory']), in: Count, out: z.number().int().positive() }).loose(),
  })
  .loose();

function recipe(id: string, name: string, station: Station, input: Readonly<Record<string, number>>, out: Readonly<Record<string, number>>): RecipeDef {
  return { id, name, station, in: input, out, toolTier: 0, release: 'v1' };
}

export function parseCombat(raw: unknown, fileName = 'data/combat.json'): CombatRules {
  const result = RawCombat.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(전체)'}: ${i.message}`);
    throw new Error(`${fileName} 에 문제가 있어요:\n${lines.join('\n')}`);
  }
  const d = result.data;
  const armor = new Map<string, ArmorPiece>();
  const recipes: RecipeDef[] = [];
  const names = new Map<string, string>();
  for (const t of d.armor.tiers) {
    for (const slot of ARMOR_SLOTS) {
      const id = `${t.id}_${slot}`;
      const name = t.pieceNames?.[slot] ?? `${t.name} ${d.armor.slots[slot].name}`;
      armor.set(id, { id, name, slot, tier: t.id, defense: t.defense[slot], toughness: t.toughness, knockbackResist: t.knockbackResist ?? 0, durability: t.durability[slot] });
      names.set(id, name);
      const input = t.upgradeFrom ? { [`${t.upgradeFrom}_${slot}`]: 1, [t.material]: 1 } : { [t.material]: d.armor.slots[slot].pieces };
      recipes.push(recipe(id, name, t.station, input, { [id]: 1 }));
    }
  }
  for (const e of d.armor.extra ?? []) {
    armor.set(e.id, { id: e.id, name: e.name, slot: e.slot, tier: e.id.replace(/_[a-z]+$/, ''), defense: e.defense, toughness: e.toughness, knockbackResist: 0, durability: 0 });
    names.set(e.id, e.name);
    recipes.push(recipe(e.id, e.name, e.station, e.in, { [e.id]: 1 }));
  }
  const shield: ShieldRule = { id: d.shield.id, name: d.shield.name, meleeBlock: d.shield.meleeBlock, arrowBlock: d.shield.arrowBlock, guardBlock: d.shield.guardBlock ?? 1, guardSlow: d.shield.guardSlow ?? 0.5, ignoredBy: d.shield.ignoredBy ?? [] };
  names.set(shield.id, shield.name);
  recipes.push(recipe(shield.id, shield.name, d.shield.station, d.shield.in, { [shield.id]: 1 }));
  const bows = new Map<string, BowDef>();
  for (const b of d.bows) {
    bows.set(b.id, { id: b.id, name: b.name, damage: b.damage, cooldownMs: b.cooldownMs, drawMs: b.drawMs ?? 1000, range: b.range });
    names.set(b.id, b.name);
    recipes.push(recipe(b.id, b.name, b.station, b.in, { [b.id]: 1 }));
  }
  names.set(d.arrow.id, d.arrow.name);
  recipes.push(recipe(d.arrow.id, d.arrow.name, d.arrow.station, d.arrow.in, { [d.arrow.id]: d.arrow.out }));
  return { armor, shield, bows, arrow: { id: d.arrow.id, name: d.arrow.name }, recipes, itemNames: names };
}

/** 당긴 시간(ms)에 따른 화살 피해 (#119): 안 당기면 30%, drawMs 이상이면 100%. 최소 1 */
export const DRAW_MIN_RATIO = 0.3;
export function bowDamage(bow: BowDef, chargeMs: number): number {
  const c = Math.max(0, Math.min(1, chargeMs / Math.max(1, bow.drawMs)));
  return Math.max(1, Math.round(bow.damage * (DRAW_MIN_RATIO + (1 - DRAW_MIN_RATIO) * c)));
}

/** 이 아이템이 들어가는 장비 칸 (없으면 null) */
export function equipSlotOf(rules: CombatRules, item: string | null | undefined): EquipSlot | null {
  if (!item) return null;
  if (item === rules.shield.id) return 'shield';
  return rules.armor.get(item)?.slot ?? null;
}
export function armorOf(rules: CombatRules, item: string | null | undefined): ArmorPiece | null {
  return item ? (rules.armor.get(item) ?? null) : null;
}
export function bowOf(rules: CombatRules, item: string | null | undefined): BowDef | null {
  return item ? (rules.bows.get(item) ?? null) : null;
}

/** 입은 갑옷의 방어·강도 합 (방패는 방어 수치가 없다) */
export function armorTotals(rules: CombatRules, eq: Equipment): { defense: number; toughness: number } {
  let defense = 0,
    toughness = 0;
  for (const slot of ARMOR_SLOTS) {
    const a = armorOf(rules, eq[slot]);
    if (a) {
      defense += a.defense;
      toughness += a.toughness;
    }
  }
  return { defense, toughness };
}

/** 마인크래프트 갑옷 공식. 방어 0 이면 그대로 */
export function reduceDamage(damage: number, defense: number, toughness: number): number {
  if (defense <= 0 || damage <= 0) return damage;
  const a = Math.min(20, Math.max(defense / 5, defense - (4 * damage) / (Math.min(toughness, 20) + 8)));
  return damage * (1 - a / 25);
}

/** 갑옷이 줄여 주는 피해인가 — 낙하·독·굶주림은 아니다 */
export function armorApplies(cause: string): boolean {
  return cause !== 'fall' && cause !== 'poison' && cause !== 'drown' && cause !== 'respawn';
}
/** 화살(원거리)로 치는 몹 */
export const ARROW_CAUSES: readonly string[] = ['pillager', 'skeleton'];

/** 🛡️ 막기(#118)는 이만큼 지나면 서버가 저절로 푼다 (클라가 끊겨도 영원히 막지 않게). 클라는 누르는 동안 5초마다 다시 보낸다 */
export const GUARD_MAX_MS = 15_000;
export const GUARD_RESEND_MS = 5_000;

/**
 * 방패가 있을 때 피해에 곱하는 값: 화살은 (1 − arrowBlock), 근접·폭발은 meleeBlock, 방패를 무시하는 몹(변명자)은 1.
 * 🛡️ 막기 중(guarding)이면 (1 − guardBlock) — 변명자는 그래도 뚫는다. 방패가 없거나 갑옷이 안 통하는 피해(낙하·독)면 1
 */
export function shieldFactor(rules: CombatRules, eq: Equipment, cause: string, guarding = false): number {
  if (eq.shield !== rules.shield.id || !armorApplies(cause)) return 1;
  if (rules.shield.ignoredBy.includes(cause)) return 1;
  if (guarding) return 1 - rules.shield.guardBlock;
  if (ARROW_CAUSES.includes(cause)) return 1 - rules.shield.arrowBlock;
  return rules.shield.meleeBlock;
}

/** 실제로 깎이는 체력: 방패 → 갑옷 순서. 0 이면 완전히 막은 것. 조금이라도 남으면 최소 1 (갑옷이 있어도 아프긴 하다) */
export function finalDamage(rules: CombatRules, eq: Equipment, damage: number, cause: string, guarding = false): number {
  if (damage <= 0) return 0;
  const shielded = damage * shieldFactor(rules, eq, cause, guarding);
  if (shielded <= 0) return 0;
  const t = armorApplies(cause) ? armorTotals(rules, eq) : { defense: 0, toughness: 0 };
  return Math.max(1, Math.round(reduceDamage(shielded, t.defense, t.toughness)));
}

/** 저장된 장비 JSON 검사: 모르는 아이템·칸은 비운다 */
export function sanitizeEquipment(rules: CombatRules, raw: unknown): Equipment {
  const eq = emptyEquipment();
  if (!raw || typeof raw !== 'object') return eq;
  for (const slot of EQUIP_SLOTS) {
    const v = (raw as Record<string, unknown>)[slot];
    if (typeof v === 'string' && equipSlotOf(rules, v) === slot) eq[slot] = v;
  }
  return eq;
}
