/**
 * data/potions.json 검증·로드 + 양조 규칙 (마인크래프트 1.21, 아들 8차 디테일, 결정 #61).
 *
 * 아들은 JSON 에 "무엇에 무엇을 넣으면 어떤 물약" 만 적는다. 보조 재료(레드스톤·발광석·화약·
 * 드래곤의 숨결·발효된 거미 눈)가 하는 일과 시간 배율은 여기 코드가 정한다.
 * 순수 함수 — 클라(양조기 UI 미리보기)와 서버(진짜 양조, 결정 #1)가 같은 코드를 쓴다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const NAME_RE = /^[a-z0-9_]+$/;
const Id = z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: fire_resistance)');

/** 물약 상태 id 두 개는 JSON 의 potions 가 아니라 base 에 있다 */
export const WATER_BOTTLE = 'water_bottle';
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
  ingredients: z.record(z.string(), z.unknown()).optional(),
});

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
  );
}
