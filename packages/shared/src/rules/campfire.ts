/**
 * 모닥불 (#290, 아빠 2026-11-10 — 마인크래프트 위키 '모닥불'):
 * 날고기·생선·감자를 들고 탭하면 올라가고(4개까지), 연료 없이 30초 뒤 익는다. 빛 15, 불 위에 서면 0.5초마다 1.
 * 삽으로 끄고(꺼진 모닥불) 라이터로 다시 켠다. 꺼져 있어도 음식은 올릴 수 있지만 익지 않는다.
 * 음식 자리는 식탁과 같은 저장 칸을 쓴다 (TABLE_SLOTS).
 */
import type { FoodRules } from './food';
import type { RecipeRegistry } from './recipes';

/** 불붙은 모닥불 블록 id */
export const CAMPFIRE = 'campfire';
/** 꺼진 모닥불 블록 id (부수면 모닥불이 나온다) */
export const CAMPFIRE_OFF = 'campfire_off';
/** 익는 데 걸리는 시간 (마인크래프트 600틱) */
export const CAMPFIRE_COOK_MS = 30_000;
/** 불 위에 서 있으면 이만큼씩 */
export const CAMPFIRE_DAMAGE = 1;
export const CAMPFIRE_HURT_EVERY_MS = 500;
/** 굽는 데 쓰는 연료 (화로 레시피에서 빼고 본다) */
const FUEL = 'coal';

/**
 * 모닥불에 구울 수 있는 것: 화로 레시피 가운데 '재료 하나 + 석탄 → 먹을 것 하나'인 것 (날것 → 익힌 것).
 * 레시피를 고치면 모닥불도 따라간다 — 따로 적는 표가 없다
 */
export function campfireCooks(recipes: RecipeRegistry, food: FoodRules): Map<string, string> {
  const out = new Map<string, string>();
  for (const r of recipes.defs) {
    if (r.station !== 'furnace') continue;
    const ins = Object.entries(r.in).filter(([item]) => item !== FUEL);
    const outs = Object.entries(r.out);
    if (ins.length !== 1 || outs.length !== 1 || ins[0]![1] !== 1 || outs[0]![1] !== 1) continue;
    if (!food.foods.has(outs[0]![0])) continue;
    out.set(ins[0]![0], outs[0]![0]);
  }
  return out;
}
