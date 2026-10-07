/**
 * data/recipes.json 검증·로드 + 제작 규칙 (M4, 결정 #66).
 * 레시피는 모양이 없다 — 재료 개수만(아들 JSON 그대로). 서버가 만들고 클라는 같은 코드로 "만들 수 있는 것"을 미리 보여 준다.
 * station: inventory(가방 2×2, 언제나) / crafting_table(제작대 옆) / furnace(화로 옆) / forge(대장간, M6) / brewing(양조기 — potions.ts) / world(놓아서 생기는 것, 제작 아님) / anvil(v2)
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { type Inventory, give, hasAll, missing, take, cloneInventory } from './inventory';

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
    /** 모양 있는 조합 (#132): 1~3줄, 한 줄 1~3글자. 빈칸은 공백. 글자 → 재료는 key */
    pattern: z.array(z.string().min(1).max(3, '한 줄은 3글자까지예요')).min(1).max(3, '모양은 3줄까지예요').optional(),
    key: z.record(z.string().length(1, '글자 하나여야 해요'), z.string().regex(NAME_RE)).optional(),
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
  pattern: 'pattern(모양)',
  key: 'key(모양 글자 → 재료)',
};

export interface RecipeDef {
  readonly id: string;
  readonly name: string;
  readonly station: Station;
  readonly in: Readonly<Record<string, number>>;
  readonly out: Readonly<Record<string, number>>;
  readonly toolTier: number;
  readonly release: string;
  /** 모양 있는 조합(마인크래프트 제작대, #132): 줄마다 글자, 공백은 빈칸. 없으면 모양 없는 조합(개수만) */
  readonly pattern?: readonly string[];
  readonly key?: Readonly<Record<string, string>>;
}

// ---------------------------------------------------------------- 제작 격자 (#132, 마인크래프트 제작대와 같게)

/** 격자 한 칸: 재료와 개수 (null = 빈칸). 한 번 만들 때 칸마다 1개씩 쓴다 */
export type GridCell = { item: string; count: number } | null;

/** 모양의 글자 격자를 재료 id 격자로 (공백 → null), 줄 길이는 가장 긴 줄에 맞춘다 */
function patternItems(recipe: RecipeDef): (string | null)[][] {
  const rows = recipe.pattern ?? [];
  const w = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => Array.from({ length: w }, (_, x) => (r[x] && r[x] !== ' ' ? (recipe.key?.[r[x]!] ?? null) : null)));
}

/** 줄 배열에서 재료가 있는 칸만 둘러싼 직사각형을 잘라 낸다. 다 비었으면 null */
function trimRows(rows: readonly (readonly (string | null)[])[]): (string | null)[][] | null {
  const h = rows.length;
  const w = Math.max(0, ...rows.map((r) => r.length));
  let x0 = w,
    x1 = -1,
    y0 = h,
    y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (rows[y]![x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
  if (x1 < 0) return null;
  return rows.slice(y0, y1 + 1).map((r) => Array.from({ length: x1 - x0 + 1 }, (_, i) => r[x0 + i] ?? null));
}

/** 격자(w×w, 줄 우선)를 잘라 낸다 */
function trimGrid(cells: readonly (string | null)[], w: number): (string | null)[][] | null {
  const rows: (string | null)[][] = [];
  for (let y = 0; y < w; y++) rows.push(Array.from({ length: w }, (_, x) => cells[y * w + x] ?? null));
  return trimRows(rows);
}

function sameRows(a: readonly (string | null)[][], b: readonly (string | null)[][]): boolean {
  if (a.length !== b.length) return false;
  for (let y = 0; y < a.length; y++) {
    if (a[y]!.length !== b[y]!.length) return false;
    for (let x = 0; x < a[y]!.length; x++) if (a[y]![x] !== b[y]![x]) return false;
  }
  return true;
}

/**
 * 격자에 놓인 재료가 이 레시피와 맞나. 모양 있는 조합은 어디에 놓아도(평행 이동) 되고 좌우가 뒤집혀도 된다(마인크래프트와 같게).
 * 모양 없는 조합은 칸마다 1개씩 세어 재료 개수가 꼭 같아야 한다
 */
export function gridMatches(recipe: RecipeDef, cells: readonly GridCell[], w: number): boolean {
  const ids = cells.map((c) => (c && c.count > 0 ? c.item : null));
  const placed = trimGrid(ids, w);
  if (!placed) return false;
  if (recipe.pattern && recipe.pattern.length) {
    const want = trimRows(patternItems(recipe));
    if (!want) return false;
    const mirrored = want.map((r) => [...r].reverse());
    return sameRows(placed, want) || sameRows(placed, mirrored);
  }
  const have: Record<string, number> = {};
  for (const id of ids) if (id) have[id] = (have[id] ?? 0) + 1;
  const keys = Object.keys(recipe.in);
  if (Object.keys(have).length !== keys.length) return false;
  for (const k of keys) if (have[k] !== recipe.in[k]) return false;
  return true;
}

/** 격자에 맞는 레시피 (목록 순서대로 처음 것). 없으면 null */
export function matchGrid(recipes: readonly RecipeDef[], cells: readonly GridCell[], w: number): RecipeDef | null {
  for (const r of recipes) if (gridMatches(r, cells, w)) return r;
  return null;
}

/**
 * 조합법 책: 이 레시피를 w×w 격자에 놓으면 어떤 모양인가 (칸마다 재료 id 1개, 줄 우선). 모양 있는 조합은 왼쪽 위부터,
 * 모양 없는 조합은 재료 순서대로 한 칸에 하나씩. 격자에 안 들어가면(칸보다 재료가 많거나 모양이 크면) null
 */
export function gridLayout(recipe: RecipeDef, w: number): (string | null)[] | null {
  const cells: (string | null)[] = new Array(w * w).fill(null);
  if (recipe.pattern && recipe.pattern.length) {
    const rows = patternItems(recipe);
    if (rows.length > w || rows.some((r) => r.length > w)) return null;
    rows.forEach((r, y) => r.forEach((id, x) => (cells[y * w + x] = id)));
    return cells;
  }
  let i = 0;
  for (const [item, n] of Object.entries(recipe.in)) for (let k = 0; k < n; k++) cells[i++] = item;
  return i > w * w ? null : cells;
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
  /** 결과가 가방에 다 안 들어간다 (ok=false 일 때) — 재료도 빼지 않았다 */
  bagFull?: boolean;
}

/**
 * 만든다: 재료를 빼고 결과를 넣는다. 재료가 모자라면 아무것도 안 바꾸고 missing. 바뀐 칸은 changed 에.
 * 결과가 가방에 다 들어가지 않으면 **아무것도 안 바꾸고** bagFull (#95 — 예전엔 재료만 빠지고 결과가 사라졐다). 아이템 엔티티가 없다(#66).
 */
export function craft(inv: Inventory, recipe: RecipeDef, changed?: Set<number>): CraftResult {
  if (!hasAll(inv, recipe.in)) return { ok: false, missing: missing(inv, recipe.in) };
  // 먼저 복사본에서 해 보고, 다 들어갈 때만 진짜로
  const trial = cloneInventory(inv);
  for (const [item, n] of Object.entries(recipe.in)) take(trial, item, n);
  for (const [item, n] of Object.entries(recipe.out)) if (give(trial, item, n) > 0) return { ok: false, bagFull: true };
  for (const [item, n] of Object.entries(recipe.in)) take(inv, item, n, changed);
  for (const [item, n] of Object.entries(recipe.out)) give(inv, item, n, changed);
  return { ok: true };
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
    // 모양 있는 조합 (#132): 글자마다 key 에 있어야 하고, 모양에서 센 개수가 in 과 같아야 한다
    if (r.pattern) {
      const counts: Record<string, number> = {};
      for (const row of r.pattern)
        for (const ch of row) {
          if (ch === ' ') continue;
          const item = r.key?.[ch];
          if (!item) {
            problems.push(`${where}: 모양(pattern)의 글자 '${ch}' 가 key 에 없어요`);
            continue;
          }
          counts[item] = (counts[item] ?? 0) + 1;
        }
      const a = Object.entries(counts).sort().map(([k, v]) => `${k}:${v}`).join(',');
      const b = Object.entries(r.in).sort().map(([k, v]) => `${k}:${v}`).join(',');
      if (a !== b) problems.push(`${where}: 모양(pattern)에서 센 재료(${a})가 in(${b})과 달라요`);
      if (r.station === 'inventory' && (r.pattern.length > 2 || r.pattern.some((row) => row.length > 2))) problems.push(`${where}: 가방(2×2)에서는 모양이 2줄·2글자까지예요`);
    }
    const def: RecipeDef = { id: r.id, name: r.name, station: r.station, in: r.in, out: r.out, toolTier: r.toolTier ?? 0, release: r.release ?? 'v1' };
    return r.pattern ? { ...def, pattern: r.pattern, key: r.key ?? {} } : def;
  });
  if (problems.length) throw new DataError(fileName, problems);
  return new RecipeRegistry(defs);
}
