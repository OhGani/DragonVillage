/**
 * 아이템 한국어 이름 (M3 정산 창·M4 가방).
 * 아이템 파일은 따로 없다 — 블록은 blocks.json, 그 외는 recipes.json 결과물·dragons.json 재료·potions.json 재료에 이미
 * 한국어 이름이 있으므로 거기서 모은다. 어디에도 없는 드롭 몇 개만 여기 적는다.
 */
import { hash3 } from '../math/prng';
import { type BlockDef, type BlockRegistry, FLUID_FULL } from './blocks';

/** blocks.json 이 떨어뜨리지만 어느 파일에도 이름이 없는 것 */
export const ITEM_FALLBACK_KO: Readonly<Record<string, string>> = {
  coal: '석탄',
  glowstone_dust: '발광석 가루',
  emerald: '에메랄드',
  lapis: '청금석',
  quartz: '석영',
  apple: '사과',
  redstone: '레드스톤 가루',
  // 레시피 재료 (recipes.json in)
  leather: '가죽',
  wheat: '밀',
  milk_bucket: '우유 양동이',
  egg: '달걀',
  carrot: '당근',
  snowball: '눈덩이',
  feather: '깃털',
  string: '실',
  flint: '부싯돌',
  pumpkin_seeds: '호박 씨',
  name_tag_blank: '빈 이름표',
  white_wool: '흰 양털',
  ink_sac: '먹물',
  brown_mushroom: '갈색 버섯',
  melon_slice: '수박 조각',
  slime_ball: '슬라임 볼',
  scute: '인갑',
  bucket: '양동이',
  water_bucket: '물 양동이',
  lava_source_block: '용암(원천)',
  water_source_block: '물',
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

// ---------------------------------------------------------------- 아이템 ↔ 블록 (M4, 결정 #66)


export const BUCKET = 'bucket';
export const WATER_BUCKET = 'water_bucket';
export const LAVA_BUCKET = 'lava_bucket';

/** 손에 든 아이템으로 놓을 수 있는 블록 번호. 못 놓는 아이템이면 null */
export function itemToBlock(item: string, registry: BlockRegistry): number | null {
  if (item === WATER_BUCKET) {
    const w = registry.find('water');
    return w ? registry.fluidFinite(w.num, FLUID_FULL) : null;
  }
  if (item === LAVA_BUCKET) {
    const l = registry.find('lava');
    return l ? registry.fluidFinite(l.num, FLUID_FULL) : null;
  }
  const d = registry.find(item);
  if (!d || d.internal || d.fluid || d.num === 0) return null;
  return d.num;
}

/** 이 블록을 놓으려면 가방에서 무엇이 나가나 (놓는 블록 id → 아이템 id). 놓을 수 없으면 null */
export function itemForPlacing(blockId: string, registry: BlockRegistry): string | null {
  const d = registry.find(blockId);
  if (!d || d.num === 0) return null;
  if (d.fluid) return d.fluidVolume === FLUID_FULL ? (d.fluid === 'water' ? WATER_BUCKET : LAVA_BUCKET) : null;
  return d.internal ? null : d.id;
}

/**
 * 블록을 부수면(또는 액체를 떠내면) 무엇이 나오나. 액체 가득한 칸은 양동이가 있어야 하고(needsBucket) 양동이가 찬 것으로 바뀐다.
 * dropCount 범위는 자리·시드로 결정론적으로 뽑는다. 아무것도 안 나오면 null
 */
export function dropOf(def: BlockDef, x: number, y: number, z: number, seed: number): { item: string; count: number; needsBucket: boolean } | null {
  if (def.fluid) {
    if (def.fluidLevel !== 0) return null; // 얕은 웅덩이·흐름은 닦아낼 뿐
    return { item: def.fluid === 'water' ? WATER_BUCKET : LAVA_BUCKET, count: 1, needsBucket: true };
  }
  if (!def.drops) return null;
  const [lo, hi] = def.dropCount;
  const n = hi > lo ? lo + Math.floor(hash3(x, y, z, seed) * (hi - lo + 1)) : lo;
  return n > 0 ? { item: def.drops, count: n, needsBucket: false } : null;
}
