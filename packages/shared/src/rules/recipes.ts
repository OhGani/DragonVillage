/**
 * data/recipes.json 검증·로드 + 제작 규칙 (M4, 결정 #66).
 * 레시피는 모양이 없다 — 재료 개수만(아들 JSON 그대로). 서버가 만들고 클라는 같은 코드로 "만들 수 있는 것"을 미리 보여 준다.
 * station: inventory(가방 2×2, 언제나) / crafting_table(제작대 옆) / furnace(화로 옆) / forge(대장간, M6) / brewing(양조기 — potions.ts) / world(놓아서 생기는 것, 제작 아님) / anvil(v2)
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { type Inventory, give, hasAll, missing, take } from './inventory';

const NAME_RE = /^[a-z0-9_]+$/;
export const STATIONS = ['inventory', 'crafting_table', 'furnace', 'forge', 'brewing', 'world', 'anvil'] as const;
export type Station = (typeof STATIONS)[number];
export const STATION_KO: Record<Station, string> = {
  inventory: '가방',
  crafting_table: '제작대',
  furnace: '화로',
  forge: '대장간',
  brewing: '양조기',
  world: '세계',
  anvil: '모루',
};

const Counts = z.record(z.string().regex(NAME_RE, '재료 이름은 영문 소문자·숫자·밑줄(_)만'), z.number().int().positive('개수는 1 이상이어야 해요'));

const RawRecipe = z
  .object({
    id: z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: oak_door)'),
    name: z.string().min(1, '한국어 이름이 비어 있어요'),
    station: z.enum(STATIONS),
    in: Counts,
    out: Counts,
    toolTier: z.number().int().min(0).max(4).optional(),
    release: z.string().optional(),
  })
  .loose();

const RecipesFile = z
  .object({
    _comment: z.string().optional(),
    recipes: z.array(RawRecipe).min(1, '레시피가 하나도 없어요'),
  })
  .loose();

const FIELD_KO: Record<string, string> = {
  id: 'id(영문 이름)',
  name: 'name(한국어 이름)',
  station: 'station(어디서 만드나: inventory / crafting_table / furnace / forge / brewing)',
  in: 'in(재료)',
  out: 'out(결과)',
  toolTier: 'toolTier(도구 등급)',
  release: 'release(버전)',
};

export interface RecipeDef {
  readonly id: string;
  readonly name: string;
  readonly station: Station;
  readonly in: Readonly<Record<string, number>>;
  readonly out: Readonly<Record<string, number>>;
  readonly toolTier: number;
  readonly release: string;
}

export class RecipeRegistry {
  private readonly byId = new Map<string, RecipeDef>();
  constructor(readonly defs: readonly RecipeDef[]) {
    for (const d of defs) this.byId.set(d.id, d);
  }
  get count(): number {
    return this.defs.length;
  }
  find(id: string): RecipeDef | undefined {
    return this.byId.get(id);
  }
  require(id: string): RecipeDef {
    const d = this.byId.get(id);
    if (!d) throw new Error(`레시피 '${id}' 을(를) data/recipes.json 에서 찾을 수 없어요`);
    return d;
  }
  /** v1 이고 그 station 에서 만드는 것 (파일 순서) */
  forStation(station: Station): RecipeDef[] {
    return this.defs.filter((d) => d.station === station && d.release === 'v1');
  }
  /** 손으로 만드는 것 전부 (world 제외) */
  craftable(): RecipeDef[] {
    return this.defs.filter((d) => d.station !== 'world' && d.release === 'v1');
  }
}

/** 만들 수 있나 (재료만 본다 — station 은 서버가 자리로 확인) */
export function canCraft(inv: Inventory, recipe: RecipeDef): boolean {
  return hasAll(inv, recipe.in);
}

/** 몇 번까지 만들 수 있나 (재료 기준) */
export function craftableTimes(inv: Inventory, recipe: RecipeDef): number {
  let n = Infinity;
  for (const [item, need] of Object.entries(recipe.in)) {
    let have = 0;
    for (const s of inv) if (s && s.item === item) have += s.count;
    n = Math.min(n, Math.floor(have / need));
  }
  return n === Infinity ? 0 : n;
}

export interface CraftResult {
  ok: boolean;
  /** 모자란 재료 (ok=false 일 때) */
  missing?: Record<string, number>;
  /** 결과가 가방에 다 안 들어가 사라진 것 */
  lost?: Record<string, number>;
}

/**
 * 만든다: 재료를 빼고 결과를 넣는다. 재료가 모자라면 아무것도 안 바꾸고 missing. 바뀐 칸은 changed 에.
 * 가방이 가득 차 결과가 못 들어가면 그만큼은 사라진다(lost) — 아이템 엔티티가 없다(#66).
 */
export function craft(inv: Inventory, recipe: RecipeDef, changed?: Set<number>): CraftResult {
  if (!hasAll(inv, recipe.in)) return { ok: false, missing: missing(inv, recipe.in) };
  for (const [item, n] of Object.entries(recipe.in)) take(inv, item, n, changed);
  const lost: Record<string, number> = {};
  for (const [item, n] of Object.entries(recipe.out)) {
    const left = give(inv, item, n, changed);
    if (left > 0) lost[item] = left;
  }
  return Object.keys(lost).length ? { ok: true, lost } : { ok: true };
}

function describePath(path: PropertyKey[], raw: unknown): string {
  if (path[0] === 'recipes' && typeof path[1] === 'number') {
    const idx = path[1];
    const list = (raw as { recipes?: unknown[] } | null)?.recipes;
    const entry = Array.isArray(list) ? (list[idx] as { id?: unknown } | undefined) : undefined;
    const id = entry && typeof entry.id === 'string' ? entry.id : '?';
    const field = path[2];
    const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
    const sub = typeof path[3] === 'string' ? ` '${path[3]}'` : '';
    return `${idx + 1}번째 레시피(id: ${id})${fieldKo ? `의 ${fieldKo}${sub}` : ''}`;
  }
  return path.map(String).join('.');
}

export function parseRecipes(raw: unknown, fileName = 'data/recipes.json'): RecipeRegistry {
  const result = RecipesFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${describePath(issue.path, raw)}: ${koreanizeMessage(issue.message)}`,
    );
    throw new DataError(fileName, problems);
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const defs: RecipeDef[] = result.data.recipes.map((r, i) => {
    const where = `${i + 1}번째 레시피(id: ${r.id})`;
    if (seen.has(r.id)) problems.push(`${where}: id 가 두 번 나와요. 하나는 이름을 바꿔 주세요`);
    seen.add(r.id);
    if (Object.keys(r.in).length === 0) problems.push(`${where}: 재료(in)가 비어 있어요`);
    if (Object.keys(r.out).length === 0) problems.push(`${where}: 결과(out)가 비어 있어요`);
    if (r.station === 'inventory' && Object.keys(r.in).length > 4) problems.push(`${where}: 가방(2×2)에서는 재료 종류가 4가지까지예요`);
    if (Object.keys(r.in).length > 9) problems.push(`${where}: 재료 종류가 9가지를 넘어요`);
    for (const k of Object.keys(r.in)) if (r.out[k] !== undefined && r.out[k] >= r.in[k]) problems.push(`${where}: '${k}' 를 넣고 같은 것을 더 많이 받을 수는 없어요`);
    return { id: r.id, name: r.name, station: r.station, in: r.in, out: r.out, toolTier: r.toolTier ?? 0, release: r.release ?? 'v1' };
  });
  if (problems.length) throw new DataError(fileName, problems);
  return new RecipeRegistry(defs);
}
