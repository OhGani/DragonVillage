/**
 * 먹을 것 (data/food.json, #186). 손에 들고 탭 → 하나 먹고 heals 만큼 체력(하트×2) 회복. 서버가 판정한다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const RawFood = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
    name: z.string().min(1, '이름이 비었어요'),
    heals: z.number().int().min(1, '1 이상이어야 해요').max(20, '20(하트 10개)까지예요'),
  })
  .loose();
const FoodFile = z.object({ _comment: z.string().optional(), foods: z.array(RawFood) }).loose();

export interface FoodDef {
  readonly id: string;
  readonly name: string;
  /** 회복 체력 (하트 하나 = 2) */
  readonly heals: number;
}
export interface FoodRules {
  readonly foods: ReadonlyMap<string, FoodDef>;
}

export function parseFood(raw: unknown, fileName = 'data/food.json'): FoodRules {
  const result = FoodFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const foods = new Map<string, FoodDef>();
  const problems: string[] = [];
  for (const f of result.data.foods) {
    if (foods.has(f.id)) problems.push(`음식 '${f.id}' 가 두 번 나와요`);
    foods.set(f.id, { id: f.id, name: f.name, heals: f.heals });
  }
  if (problems.length) throw new DataError(fileName, problems);
  return { foods };
}

/** 손에 든 것이 먹을 것이면 그 정의, 아니면 null */
export function foodOf(food: FoodRules, item: string | null | undefined): FoodDef | null {
  return item ? (food.foods.get(item) ?? null) : null;
}

/** 식탁 (아빠 2026-11-06): 위에 올릴 수 있는 음식 수. 칸마다 하나씩 */
export const TABLE_SLOTS = 4;

/**
 * 식탁 위 그릇 (아빠 2026-11-20 "그릇에 음식을 담을 수 있게"): 식탁 한 자리에 빈 그릇(`bowl`)을 놓을 수 있고,
 * 먹을 것을 들고 탭하면 빈 그릇이 있으면 거기 담긴다 — 그 자리는 `bowl:<음식>`. 먹거나 음식만 가방에 넣으면 빈 그릇이 남는다
 */
export const BOWL = 'bowl';
const IN_BOWL = 'bowl:';
/** 식탁 한 자리 → 음식·그릇 (빈 자리면 둘 다 없음) */
export function dishOf(slot: string | null | undefined): { food: string | null; bowl: boolean } {
  if (!slot) return { food: null, bowl: false };
  if (slot === BOWL) return { food: null, bowl: true };
  if (slot.startsWith(IN_BOWL)) return { food: slot.slice(IN_BOWL.length), bowl: true };
  return { food: slot, bowl: false };
}
/** 그릇에 담긴 음식의 자리 값 */
export function inBowl(food: string): string {
  return IN_BOWL + food;
}
