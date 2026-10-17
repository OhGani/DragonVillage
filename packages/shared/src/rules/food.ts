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
