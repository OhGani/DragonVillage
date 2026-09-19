/**
 * 아이템 한국어 이름 (M3 정산 창·M4 가방).
 * 아이템 파일은 따로 없다 — 블록은 blocks.json, 그 외는 recipes.json 결과물·dragons.json 재료·potions.json 재료에 이미
 * 한국어 이름이 있으므로 거기서 모은다. 어디에도 없는 드롭 몇 개만 여기 적는다.
 */
import type { BlockRegistry } from './blocks';

/** blocks.json 이 떨어뜨리지만 어느 파일에도 이름이 없는 것 */
export const ITEM_FALLBACK_KO: Readonly<Record<string, string>> = {
  coal: '석탄',
  glowstone_dust: '발광석 가루',
  emerald: '에메랄드',
  lapis: '청금석',
  quartz: '석영',
  apple: '사과',
  redstone: '레드스톤 가루',
};

/** 이름을 가진 항목 목록에서 id → name 을 뽑는다 (모양이 다르면 건너뛴다) */
function collect(into: Map<string, string>, list: unknown): void {
  if (!Array.isArray(list)) return;
  for (const e of list) {
    if (!e || typeof e !== 'object') continue;
    const { id, name } = e as { id?: unknown; name?: unknown };
    if (typeof id === 'string' && typeof name === 'string' && !into.has(id)) into.set(id, name);
  }
}

/**
 * 이름표 만들기. recipes 는 결과물 하나짜리 레시피의 out 키 = 레시피 이름으로 본다.
 * potions 의 ingredients/modifiers 는 { id: { name } } 모양.
 */
export function buildItemNames(sources: { recipes?: unknown; dragons?: unknown; potions?: unknown }): Map<string, string> {
  const names = new Map<string, string>();
  const rec = (sources.recipes as { recipes?: unknown } | undefined)?.recipes;
  if (Array.isArray(rec)) {
    for (const r of rec) {
      if (!r || typeof r !== 'object') continue;
      const { out, name } = r as { out?: Record<string, unknown>; name?: unknown };
      if (!out || typeof name !== 'string') continue;
      const keys = Object.keys(out);
      if (keys.length === 1 && !names.has(keys[0])) names.set(keys[0], name);
    }
  }
  collect(names, (sources.dragons as { materials?: unknown } | undefined)?.materials);
  const pot = sources.potions as { ingredients?: Record<string, unknown>; modifiers?: Record<string, unknown> } | undefined;
  for (const table of [pot?.ingredients, pot?.modifiers]) {
    if (!table) continue;
    for (const [id, v] of Object.entries(table)) {
      if (id.startsWith('_') || names.has(id)) continue;
      const name = (v as { name?: unknown } | null)?.name;
      if (typeof name === 'string') names.set(id, name);
    }
  }
  for (const [id, name] of Object.entries(ITEM_FALLBACK_KO)) if (!names.has(id)) names.set(id, name);
  return names;
}

/** 아이템 한국어 이름: 블록이면 블록 이름, 아니면 모은 이름표, 없으면 id 그대로 */
export function itemName(id: string, registry: BlockRegistry, names: ReadonlyMap<string, string>): string {
  return registry.find(id)?.name ?? names.get(id) ?? id;
}
