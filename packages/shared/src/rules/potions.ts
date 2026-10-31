/**
 * data/potions.json 검증·로드 + 양조 규칙 (마인크래프트 1.21, 아들 8차 디테일, 결정 #61).
 *
 * 아들은 JSON 에 "무엇에 무엇을 넣으면 어떤 물약" 만 적는다. 보조 재료(레드스톤·발광석·화약·
 * 드래곤의 숨결·발효된 거미 눈)가 하는 일과 시간 배율은 여기 코드가 정한다.
 * 순수 함수 — 클라(양조기 UI 미리보기)와 서버(진짜 양조, 결정 #1)가 같은 코드를 쓴다.
 *
 * 효과 (#245): `effects` 표(아들 편집)가 효과마다 숫자 몇 개를 갖는다. 마시면 즉시(heals·hurts) 또는 지속(ActiveEffect)
 * 효과가 붙고, 걷기·점프·공격·맞는 피해 배율은 아래 순수 함수가 계산한다 — 서버가 판정, 클라는 걷기·점프·보기만.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const NAME_RE = /^[a-z0-9_]+$/;
const Id = z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: fire_resistance)');

/** 물약 상태 id 두 개는 JSON 의 potions 가 아니라 base 에 있다 */
export const WATER_BOTTLE = 'water_bottle';
/** 빈 유리병 (#226): 들고 물을 탭하면 물병 */
export const GLASS_BOTTLE = 'glass_bottle';
export const AWKWARD = 'awkward';

export const MODIFIER_KINDS = ['extend', 'amplify', 'splash', 'lingering', 'corrupt'] as const;
export type ModifierKind = (typeof MODIFIER_KINDS)[number];

/** 레드스톤: 3분 → 8분 */
export const EXTEND_MULT = 8 / 3;
/** 발광석: 단계 +1, 시간 반 */
export const AMPLIFY_MULT = 1 / 2;
/** 잔류형(드래곤의 숨결): 시간 1/4 */
export const LINGERING_MULT = 1 / 4;

const RawModifier = z.object({
  name: z.string().min(1, '한국어 이름이 비어 있어요'),
  does: z.enum(MODIFIER_KINDS),
  _note: z.string().optional(),
});

const RawEffect = z.object({
  name: z.string().min(1, '한국어 이름이 비어 있어요'),
  icon: z.string().optional(),
  speedTimes: z.number().positive('0보다 커야 해요').optional(),
  jumpTimes: z.number().positive('0보다 커야 해요').optional(),
  attackPlus: z.number().optional(),
  heals: z.number().min(0, '0 이상이어야 해요').optional(),
  hurts: z.number().min(0, '0 이상이어야 해요').optional(),
  healEverySec: z.number().min(0, '0 이상이어야 해요').optional(),
  hurtEverySec: z.number().min(0, '0 이상이어야 해요').optional(),
  damageTimes: z.number().min(0, '0 이상이어야 해요').optional(),
  _note: z.string().optional(),
});

const RawPotion = z.object({
  id: Id,
  name: z.string().min(1, '한국어 이름이 비어 있어요'),
  from: Id,
  ingredient: Id,
  effect: Id,
  seconds: z.number().min(0, '0 이상이어야 해요 (0 = 마시면 바로 한 번)'),
  canExtend: z.boolean().optional(),
  canAmplify: z.boolean().optional(),
  corruptsTo: Id.optional(),
  release: z.string().optional(),
  _note: z.string().optional(),
});

const PotionsFile = z.object({
  _comment: z.string().optional(),
  base: z.object({
    water_bottle: z.object({ name: z.string().min(1), _note: z.string().optional() }),
    awkward: z.object({
      name: z.string().min(1),
      from: z.literal(WATER_BOTTLE),
      ingredient: Id,
      _note: z.string().optional(),
    }),
  }),
  modifiers: z.object({ _comment: z.string().optional() }).catchall(RawModifier),
  stand: z
    .object({
      fuel: Id,
      brewsPerFuel: z.number().int().min(1, '1 이상이어야 해요'),
      bottles: z.number().int().min(1, '1 이상이어야 해요').max(3, '양조기 병 자리는 최대 3개예요'),
      brewSeconds: z.number().positive('0보다 커야 해요'),
      _note: z.string().optional(),
    })
    .optional(),
  potions: z.array(RawPotion).min(1, '물약이 하나도 없어요'),
  effects: z.object({ _comment: z.string().optional() }).catchall(RawEffect).optional(),
  ingredients: z.record(z.string(), z.unknown()).optional(),
});

/** 효과 하나의 숫자들 (#245). 없는 값은 1(배율)·0(더하기) */
export interface PotionEffectDef {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly speedTimes: number;
  readonly jumpTimes: number;
  readonly attackPlus: number;
  readonly heals: number;
  readonly hurts: number;
  readonly healEverySec: number;
  readonly hurtEverySec: number;
  readonly damageTimes: number;
}

/** 붙어 있는 효과. until 은 판정하는 쪽의 시계(ms). nextAt 은 서버가 재생·독 간격을 세는 데만 쓴다 */
export interface ActiveEffect {
  id: string;
  level: number;
  until: number;
  nextAt?: number;
}

/** 던진 물약이 퍼지는 반지름 (칸) */
export const SPLASH_RADIUS = 4;
/** 던진 물약이 날아가는 최대 거리 (칸) */
export const THROW_RANGE = 12;
/** 던진 물약이 몹에게: 독은 이 간격마다 1 (죽이진 않음), 감속·나약함은 이 배율 */
export const MOB_POISON_EVERY_MS = 1250;
export const MOB_SLOW_MUL = 0.5;
export const MOB_WEAK_MUL = 0.5;
/** 화염 저항이 막는 피해 원인 */
export const FIRE_CAUSES: readonly string[] = ['blaze', 'ghast', 'fire', 'lava'];

function effectDef(id: string, raw: z.infer<typeof RawEffect> | undefined): PotionEffectDef {
  return {
    id,
    name: raw?.name ?? id,
    icon: raw?.icon ?? '🧪',
    speedTimes: raw?.speedTimes ?? 1,
    jumpTimes: raw?.jumpTimes ?? 1,
    attackPlus: raw?.attackPlus ?? 0,
    heals: raw?.heals ?? 0,
    hurts: raw?.hurts ?? 0,
    healEverySec: raw?.healEverySec ?? 0,
    hurtEverySec: raw?.hurtEverySec ?? 0,
    damageTimes: raw?.damageTimes ?? 1,
  };
}

/** 배율을 단계만큼 벌린다: 1.2 → II 는 1.4, 0.85 → 0.7. 0.1 아래로는 안 내려간다 */
function scaled(times: number, level: number): number {
  return Math.max(0.1, 1 + (times - 1) * level);
}

/** 지난 효과를 뗀다 (새 배열) */
export function pruneEffects(list: readonly ActiveEffect[], now: number): ActiveEffect[] {
  return list.filter((e) => e.until > now);
}

/**
 * 효과를 붙인다 (마인크래프트 규칙): 같은 효과가 더 높은 단계로 있으면 그대로, 같은 단계면 더 긴 쪽, 더 높은 단계면 바꾼다.
 * 새 배열을 돌려준다 (붙은 항목은 새 객체)
 */
export function addEffect(list: readonly ActiveEffect[], id: string, level: number, until: number, now: number): ActiveEffect[] {
  const out = pruneEffects(list, now);
  const i = out.findIndex((e) => e.id === id);
  if (i < 0) return [...out, { id, level, until }];
  const cur = out[i]!;
  if (cur.level > level) return out;
  if (cur.level === level && cur.until >= until) return out;
  out[i] = { id, level, until: cur.level === level ? Math.max(cur.until, until) : until };
  return out;
}

export function effectLevel(list: readonly ActiveEffect[], id: string, now: number): number {
  const e = list.find((x) => x.id === id && x.until > now);
  return e ? e.level : 0;
}

export function hasEffect(list: readonly ActiveEffect[], id: string, now: number): boolean {
  return effectLevel(list, id, now) > 0;
}

/** 걷기 배율 (신속·감속·거북 장군). 여러 개면 곱한다 */
export function speedMultiplier(list: readonly ActiveEffect[], reg: PotionRegistry, now: number): number {
  let m = 1;
  for (const e of list) if (e.until > now) m *= scaled(reg.effectOf(e.id).speedTimes, e.level);
  return m;
}

/** 점프 배율 (도약) */
export function jumpMultiplier(list: readonly ActiveEffect[], reg: PotionRegistry, now: number): number {
  let m = 1;
  for (const e of list) if (e.until > now) m *= scaled(reg.effectOf(e.id).jumpTimes, e.level);
  return m;
}

/** 손 공격 더하기 (힘 +3·나약함 -4, 단계만큼) */
export function attackBonus(list: readonly ActiveEffect[], reg: PotionRegistry, now: number): number {
  let b = 0;
  for (const e of list) if (e.until > now) b += reg.effectOf(e.id).attackPlus * e.level;
  return b;
}

/** 맞는 피해 배율 (거북 장군 0.4) */
export function damageMultiplier(list: readonly ActiveEffect[], reg: PotionRegistry, now: number): number {
  let m = 1;
  for (const e of list) if (e.until > now) m *= Math.pow(reg.effectOf(e.id).damageTimes, e.level);
  return m;
}

/** 마시거나 맞았을 때 일어나는 일 */
export interface PotionOutcome {
  /** 바로 차는 체력 */
  heals: number;
  /** 바로 깎이는 체력 */
  hurts: number;
  /** 지속 효과 (없으면 null) */
  effect: { id: string; level: number; seconds: number } | null;
  /** 나쁜 물약인가 (독·고통·감속·나약함) — 던지면 몹에게만, 사람·친구는 안 맞는다 (아군 피해 없음) */
  harmful: boolean;
}

/** 나쁜 효과인가: 아프게 하거나, 느리게 하거나(거북 장군처럼 피해를 막아 주는 건 빼고), 공격을 깎는 것 */
export function isHarmfulEffect(d: PotionEffectDef): boolean {
  return d.hurts > 0 || d.hurtEverySec > 0 || (d.speedTimes < 1 && d.damageTimes >= 1) || d.attackPlus < 0;
}

/** 병 상태 → 일어나는 일. 물병·어색한 물약은 아무것도 안 한다 */
export function potionOutcome(reg: PotionRegistry, state: PotionState): PotionOutcome {
  const def = reg.find(state.id);
  if (!def) return { heals: 0, hurts: 0, effect: null, harmful: false };
  const d = reg.effectOf(def.effect);
  const level = reg.level(state);
  const seconds = reg.durationSeconds(state);
  if (seconds === 0) return { heals: d.heals * level, hurts: d.hurts * level, effect: null, harmful: isHarmfulEffect(d) };
  return { heals: 0, hurts: 0, effect: { id: def.effect, level, seconds }, harmful: isHarmfulEffect(d) };
}

/** 양조기 자체의 규칙 (연료·병 수·한 번 걸리는 시간). JSON 에 없으면 마인크래프트 기본값 */
export interface BrewingStandRules {
  /** 연료 아이템 (블레이즈 가루) */
  readonly fuel: string;
  /** 연료 1개로 몇 번 양조 */
  readonly brewsPerFuel: number;
  /** 한 번에 병 몇 개 (세 병이 같은 재료로 동시에) */
  readonly bottles: number;
  /** 한 번 양조에 걸리는 초 */
  readonly brewSeconds: number;
}
export const DEFAULT_STAND: BrewingStandRules = { fuel: 'blaze_powder', brewsPerFuel: 20, bottles: 3, brewSeconds: 20 };

const FIELD_KO: Record<string, string> = {
  id: 'id(영문 이름)',
  name: 'name(한국어 이름)',
  from: 'from(무엇에 넣나)',
  ingredient: 'ingredient(재료)',
  effect: 'effect(효과 종류)',
  seconds: 'seconds(몇 초)',
  canExtend: 'canExtend(레드스톤이 먹히는지)',
  canAmplify: 'canAmplify(발광석이 먹히는지)',
  corruptsTo: 'corruptsTo(발효된 거미 눈을 넣으면)',
  release: 'release(버전)',
  does: 'does(하는 일)',
};

export interface PotionDef {
  readonly id: string;
  readonly name: string;
  /** 무엇에 재료를 넣나: water_bottle / awkward / 다른 물약 id */
  readonly from: string;
  readonly ingredient: string;
  readonly effect: string;
  /** 기본(마시는, I 단계) 지속 초. 0 = 즉시 효과 */
  readonly seconds: number;
  readonly canExtend: boolean;
  readonly canAmplify: boolean;
  /** 발효된 거미 눈을 넣으면 되는 물약. null = 안 바뀜 */
  readonly corruptsTo: string | null;
  readonly release: string;
}

export type PotionForm = 'drink' | 'splash' | 'lingering';

/** 양조기 안 병 하나의 상태. id 는 water_bottle / awkward / 물약 id */
export interface PotionState {
  readonly id: string;
  readonly extended: boolean;
  readonly amplified: boolean;
  readonly form: PotionForm;
}

export const FORM_KO: Record<PotionForm, string> = { drink: '', splash: '투척용', lingering: '잔류형' };

/**
 * 가방 아이템 id ↔ 병 상태 (M4). 예: water_bottle, potion.awkward, potion.speed, potion.speed.long,
 * potion.speed.strong, splash_potion.speed.long, lingering_potion.healing
 */
export function potionItemId(state: PotionState): string {
  if (state.id === WATER_BOTTLE && state.form === 'drink') return WATER_BOTTLE;
  const prefix = state.form === 'splash' ? 'splash_potion' : state.form === 'lingering' ? 'lingering_potion' : 'potion';
  const base = state.id === WATER_BOTTLE ? 'water' : state.id;
  const mod = state.extended ? '.long' : state.amplified ? '.strong' : '';
  return `${prefix}.${base}${mod}`;
}

/** 아이템 id → 병 상태. 물약이 아니면 null */
export function potionFromItemId(item: string): PotionState | null {
  if (item === WATER_BOTTLE) return waterBottle();
  const parts = item.split('.');
  if (parts.length < 2 || parts.length > 3) return null;
  const form: PotionForm | null = parts[0] === 'potion' ? 'drink' : parts[0] === 'splash_potion' ? 'splash' : parts[0] === 'lingering_potion' ? 'lingering' : null;
  if (!form) return null;
  const id = parts[1] === 'water' ? WATER_BOTTLE : parts[1];
  const mod = parts[2];
  if (mod !== undefined && mod !== 'long' && mod !== 'strong') return null;
  return { id, extended: mod === 'long', amplified: mod === 'strong', form };
}

/** 물약 아이템인가 (가방에서 양조기 병 칸에 넣을 수 있는 것) */
export function isPotionItem(item: string): boolean {
  return potionFromItemId(item) !== null;
}

export function waterBottle(): PotionState {
  return { id: WATER_BOTTLE, extended: false, amplified: false, form: 'drink' };
}

export class PotionRegistry {
  private readonly byId = new Map<string, PotionDef>();
  /** `${from}|${ingredient}` → 물약 id */
  private readonly byRecipe = new Map<string, string>();

  constructor(
    readonly defs: readonly PotionDef[],
    /** 보조 재료 id → 하는 일 */
    readonly modifiers: ReadonlyMap<string, ModifierKind>,
    /** 물병에 넣으면 어색한 물약이 되는 재료 (네더 사마귀) */
    readonly awkwardIngredient: string,
    private readonly baseNames: Readonly<Record<string, string>>,
    /** 양조기 규칙 */
    readonly stand: BrewingStandRules = DEFAULT_STAND,
    /** 효과 표 (#245). 없는 효과는 이름만 있는 빈 효과 */
    readonly effects: ReadonlyMap<string, PotionEffectDef> = new Map(),
  ) {
    for (const d of defs) {
      this.byId.set(d.id, d);
      this.byRecipe.set(`${d.from}|${d.ingredient}`, d.id);
    }
  }

  get count(): number {
    return this.defs.length;
  }

  find(id: string): PotionDef | undefined {
    return this.byId.get(id);
  }

  /** 효과 숫자들 (#245). 표에 없으면 아무것도 안 하는 효과 */
  effectOf(effectId: string): PotionEffectDef {
    return this.effects.get(effectId) ?? effectDef(effectId, undefined);
  }

  require(id: string): PotionDef {
    const d = this.byId.get(id);
    if (!d) throw new Error(`물약 '${id}' 을(를) data/potions.json 에서 찾을 수 없어요`);
    return d;
  }

  /** v1 에 들어가는 물약만 (release 없음 또는 'v1') */
  v1(): PotionDef[] {
    return this.defs.filter((d) => d.release === 'v1');
  }

  /**
   * 양조 한 단계: 병 상태 + 재료 → 새 상태. 아무 일도 안 일어나면 null (재료가 그대로 남는다).
   * 순서: (1) 물병 + 네더 사마귀 → 어색한 물약 (2) JSON 레시피 (from, ingredient)
   * (3) 보조 재료 — 늘리기·세게는 서로 배타(마인크래프트와 같음), 화약은 마시는 것만,
   * 드래곤의 숨결은 투척용만, 발효된 거미 눈은 corruptsTo.
   */
  brew(state: PotionState, ingredient: string): PotionState | null {
    if (state.id === WATER_BOTTLE && ingredient === this.awkwardIngredient) {
      return { ...state, id: AWKWARD };
    }
    const recipe = this.byRecipe.get(`${state.id}|${ingredient}`);
    if (recipe !== undefined) return this.retarget(state, recipe);

    const mod = this.modifiers.get(ingredient);
    if (!mod) return null;
    const def = this.byId.get(state.id);
    switch (mod) {
      case 'extend':
        if (!def || !def.canExtend || state.extended || state.amplified) return null;
        return { ...state, extended: true };
      case 'amplify':
        if (!def || !def.canAmplify || state.extended || state.amplified) return null;
        return { ...state, amplified: true };
      case 'splash':
        return state.form === 'drink' ? { ...state, form: 'splash' } : null;
      case 'lingering':
        return state.form === 'splash' ? { ...state, form: 'lingering' } : null;
      case 'corrupt':
        if (!def || def.corruptsTo === null) return null;
        return this.retarget(state, def.corruptsTo);
    }
  }

  /** 다른 물약으로 바꾸되, 새 물약이 못 갖는 늘리기·세게 표시는 뗀다 */
  private retarget(state: PotionState, id: string): PotionState {
    const to = this.require(id);
    return {
      id,
      extended: state.extended && to.canExtend,
      amplified: state.amplified && to.canAmplify,
      form: state.form,
    };
  }

  /** 지속 초. 물병·어색한 물약·즉시 효과는 0 */
  durationSeconds(state: PotionState): number {
    const def = this.byId.get(state.id);
    if (!def || def.seconds === 0) return 0;
    let s = def.seconds;
    if (state.extended) s *= EXTEND_MULT;
    if (state.amplified) s *= AMPLIFY_MULT;
    if (state.form === 'lingering') s *= LINGERING_MULT;
    return Math.round(s);
  }

  /** 효과 단계 1 또는 2. 물병·어색한 물약은 0 */
  level(state: PotionState): number {
    if (!this.byId.has(state.id)) return 0;
    return state.amplified ? 2 : 1;
  }

  /** 예: "신속의 물약 II (투척용)", "물병", "어색한 물약 (잔류형)" */
  displayName(state: PotionState): string {
    const def = this.byId.get(state.id);
    const base = def ? def.name : (this.baseNames[state.id] ?? state.id);
    const parts = [base];
    if (def && state.amplified) parts.push('II');
    const form = FORM_KO[state.form];
    if (form) parts.push(`(${form})`);
    return parts.join(' ');
  }
}

function describePath(path: PropertyKey[], raw: unknown): string {
  if (path[0] === 'potions' && typeof path[1] === 'number') {
    const idx = path[1];
    const potions = (raw as { potions?: unknown[] } | null)?.potions;
    const entry = Array.isArray(potions) ? (potions[idx] as { id?: unknown } | undefined) : undefined;
    const id = entry && typeof entry.id === 'string' ? entry.id : '?';
    const field = path[2];
    const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
    return `${idx + 1}번째 물약(id: ${id})${fieldKo ? `의 ${fieldKo}` : ''}`;
  }
  if (path[0] === 'modifiers' && typeof path[1] === 'string') {
    const field = path[2];
    const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
    return `보조 재료 '${path[1]}'${fieldKo ? `의 ${fieldKo}` : ''}`;
  }
  return path.map(String).join('.');
}

/**
 * potions.json 내용(파싱된 객체)을 검증해 레지스트리로 만든다.
 * 실패하면 DataError (한국어) 를 던진다.
 */
export function parsePotions(raw: unknown, fileName = 'data/potions.json'): PotionRegistry {
  const result = PotionsFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${describePath(issue.path, raw)}: ${koreanizeMessage(issue.message)}`,
    );
    throw new DataError(fileName, problems);
  }

  const problems: string[] = [];
  const file = result.data;

  const modifiers = new Map<string, ModifierKind>();
  for (const [id, m] of Object.entries(file.modifiers)) {
    if (id === '_comment') continue;
    if (!NAME_RE.test(id)) problems.push(`보조 재료 '${id}': 이름은 영문 소문자·숫자·밑줄(_)만 쓸 수 있어요`);
    modifiers.set(id, (m as z.infer<typeof RawModifier>).does);
  }
  for (const kind of MODIFIER_KINDS) {
    if (![...modifiers.values()].includes(kind)) problems.push(`'${kind}' 를 하는 보조 재료가 없어요 (modifiers 에 하나 넣어 주세요)`);
  }
  if (modifiers.has(file.base.awkward.ingredient)) {
    problems.push(`'${file.base.awkward.ingredient}'(어색한 물약 재료)는 보조 재료로 쓸 수 없어요`);
  }

  const effects = new Map<string, PotionEffectDef>();
  if (file.effects) {
    for (const [id, e] of Object.entries(file.effects)) {
      if (id === '_comment') continue;
      if (!NAME_RE.test(id)) problems.push(`효과 '${id}': 이름은 영문 소문자·숫자·밑줄(_)만 쓸 수 있어요`);
      effects.set(id, effectDef(id, e as z.infer<typeof RawEffect>));
    }
    for (const p of file.potions) if (!effects.has(p.effect)) problems.push(`물약 '${p.id}' 의 effect '${p.effect}': effects 표에 없어요 (이름만이라도 넣어 주세요)`);
  }

  const ids = new Set<string>();
  file.potions.forEach((p, i) => {
    const where = `${i + 1}번째 물약(id: ${p.id})`;
    if (ids.has(p.id)) problems.push(`${where}: id 가 두 번 나와요. 하나는 이름을 바꿔 주세요`);
    if (p.id === WATER_BOTTLE || p.id === AWKWARD) problems.push(`${where}: '${p.id}' 는 base 에 있는 이름이라 물약 id 로 쓸 수 없어요`);
    ids.add(p.id);
  });

  const recipes = new Map<string, string>();
  const defs: PotionDef[] = file.potions.map((p, i) => {
    const where = `${i + 1}번째 물약(id: ${p.id})`;
    const canExtend = p.canExtend ?? p.seconds > 0;
    const canAmplify = p.canAmplify ?? true;

    if (p.from !== WATER_BOTTLE && p.from !== AWKWARD && !ids.has(p.from)) {
      problems.push(`${where}의 from '${p.from}': water_bottle, awkward, 또는 다른 물약의 id 여야 해요`);
    }
    if (p.from === p.id) problems.push(`${where}의 from: 자기 자신에 넣을 수는 없어요`);
    if (p.corruptsTo !== undefined && !ids.has(p.corruptsTo)) {
      problems.push(`${where}의 corruptsTo '${p.corruptsTo}': 그런 물약이 없어요`);
    }
    if (p.corruptsTo === p.id) problems.push(`${where}의 corruptsTo: 자기 자신이 될 수는 없어요`);
    if (p.seconds === 0 && p.canExtend) problems.push(`${where}: 즉시 효과(seconds 0)는 레드스톤으로 늘릴 수 없어요 (canExtend 를 빼 주세요)`);

    const modKind = modifiers.get(p.ingredient);
    if (modKind !== undefined && modKind !== 'corrupt') {
      problems.push(`${where}의 ingredient '${p.ingredient}': 보조 재료(${modKind})는 물약 재료로 쓸 수 없어요`);
    }
    if (p.ingredient === file.base.awkward.ingredient && p.from === WATER_BOTTLE) {
      problems.push(`${where}: 물병 + '${p.ingredient}' 는 어색한 물약이 되는 자리예요`);
    }
    const key = `${p.from}|${p.ingredient}`;
    const dup = recipes.get(key);
    if (dup !== undefined) problems.push(`${where}: '${p.from}' 에 '${p.ingredient}' 를 넣는 레시피가 '${dup}' 와 겹쳐요`);
    recipes.set(key, p.id);

    return {
      id: p.id,
      name: p.name,
      from: p.from,
      ingredient: p.ingredient,
      effect: p.effect,
      seconds: p.seconds,
      canExtend,
      canAmplify,
      corruptsTo: p.corruptsTo ?? null,
      release: p.release ?? 'v1',
    };
  });

  // from 사슬이 물병까지 이어지는지 (고리가 있으면 영원히 못 만든다)
  const byId = new Map(defs.map((d) => [d.id, d]));
  for (const d of defs) {
    const seen = new Set<string>([d.id]);
    let cur = d.from;
    while (cur !== WATER_BOTTLE && cur !== AWKWARD) {
      if (seen.has(cur)) {
        problems.push(`물약 '${d.id}': from 이 빙글빙글 돌아요 (${[...seen].join(' → ')}). 어딘가는 awkward 나 water_bottle 에서 시작해야 해요`);
        break;
      }
      seen.add(cur);
      const next = byId.get(cur);
      if (!next) break; // 위에서 이미 알려줌
      cur = next.from;
    }
  }

  if (problems.length) throw new DataError(fileName, problems);

  const s = file.stand;
  const stand: BrewingStandRules = s
    ? { fuel: s.fuel, brewsPerFuel: s.brewsPerFuel, bottles: s.bottles, brewSeconds: s.brewSeconds }
    : DEFAULT_STAND;
  if (s && modifiers.has(s.fuel)) problems.push(`양조기 연료 '${s.fuel}' 는 보조 재료와 같은 아이템일 수 없어요`);
  if (problems.length) throw new DataError(fileName, problems);

  return new PotionRegistry(
    defs,
    modifiers,
    file.base.awkward.ingredient,
    { [WATER_BOTTLE]: file.base.water_bottle.name, [AWKWARD]: file.base.awkward.name },
    stand,
    effects,
  );
}
