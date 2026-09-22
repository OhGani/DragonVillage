/**
 * 드래곤 (M6-2, data/dragons.json — 아들 설계 16종). 검증·조회, 알 아이템, 알 레시피, 둥지 자리.
 *
 * - 알 아이템 id: `dragon_egg.<dragon id>` (예: dragon_egg.wood). 재료(recipe)를 제작대에서 모으면 알 하나.
 * - 둥지(1단계, 4마리)는 마을 광장 남쪽 집터(생성기의 집 뼈대 자리) 7×7. 세계 생성기를 바꾸면 저장이 날아가므로 서버가 켜질 때 블록으로 짓는다(결정 #76).
 *   처음(2026-09-20)엔 북동쪽 x 74~80/z 42~48 에 지었는데 아빠가 지은 집과 겹쳐 남쪽으로 옮겼다 — 옛 자리는 OLD_NEST_SITES 로 서버가 생성 지형으로 되돌린다.
 * - 알을 둥지 자리에 놓으면 `dragon_egg` 블록이 서고(못 부숨), 레벨을 내고 부화시키면 아기 드래곤이 된다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import type { RecipeDef } from './recipes';

const DragonFile = z
  .object({
    _comment: z.string().optional(),
    rules: z
      .object({
        growth: z
          .object({
            baseGrowMinutes: z.number().int().min(1, '1 이상이어야 해요'),
            feedShortcutMinutes: z.number().int().min(0, '0 이상이어야 해요'),
          })
          .loose(),
      })
      .loose(),
    dragons: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9_]+$/, '영문 소문자·숫자·밑줄(_)만'),
            name: z.string().min(1, '이름이 비었어요'),
            tier: z.number().int().min(1, '1~16 사이여야 해요').max(16, '1~16 사이여야 해요'),
            recipe: z.array(z.object({ material: z.string().min(1), count: z.number().int().min(1, '1 이상이어야 해요') }).loose()).min(1, '재료가 하나는 있어야 해요'),
            color: z.string().nullable().optional(),
            model: z.string().optional(),
            skills: z
              .array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    type: z.string(),
                    color: z.string().optional(),
                    powerLevel: z.number().optional(),
                    stamina: z.number().optional(),
                    cooldownSec: z.number().optional(),
                  })
                  .loose(),
              )
              .optional(),
          })
          .loose(),
      )
      .min(1),
  })
  .loose();

export interface DragonDef {
  readonly id: string;
  readonly name: string;
  readonly tier: number;
  readonly recipe: readonly { material: string; count: number }[];
  /** 없으면 회색 */
  readonly color: string;
  readonly model: string | null;
  readonly skills: readonly SkillDef[];
}

/** 스킬 한 개 (아들 설계). 빔(type 'beam')은 color·powerLevel 로 생김새를, stamina·cooldownSec 로 비용을 정한다 (M6-5) */
export interface SkillDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly color?: string;
  /** 세기 1(약한) ~ 5(가장 강력한) */
  readonly powerLevel?: number;
  readonly stamina?: number;
  readonly cooldownSec?: number;
}

export interface DragonRules {
  readonly baseGrowMinutes: number;
  readonly feedShortcutMinutes: number;
}

export class DragonRegistry {
  private readonly byId = new Map<string, DragonDef>();
  constructor(
    readonly list: readonly DragonDef[],
    readonly rules: DragonRules,
  ) {
    for (const d of list) this.byId.set(d.id, d);
  }
  find(id: string): DragonDef | undefined {
    return this.byId.get(id);
  }
  require(id: string): DragonDef {
    const d = this.byId.get(id);
    if (!d) throw new Error(`드래곤 '${id}' 을(를) data/dragons.json 에서 찾을 수 없어요`);
    return d;
  }
  get count(): number {
    return this.list.length;
  }
}

export function parseDragons(raw: unknown, fileName = 'data/dragons.json'): DragonRegistry {
  const result = DragonFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const tiers = new Set<number>();
  const list: DragonDef[] = result.data.dragons.map((d) => {
    if (seen.has(d.id)) problems.push(`드래곤 '${d.id}' 가 두 번 나와요`);
    seen.add(d.id);
    if (tiers.has(d.tier)) problems.push(`티어 ${d.tier} 이 두 드래곤에 있어요 (${d.id})`);
    tiers.add(d.tier);
    return { id: d.id, name: d.name, tier: d.tier, recipe: d.recipe.map((r) => ({ material: r.material, count: r.count })), color: d.color ?? '#9a9a9a', model: d.model ?? null, skills: (d.skills ?? []).map((s) => ({ id: s.id, name: s.name, type: s.type, color: s.color, powerLevel: s.powerLevel, stamina: s.stamina, cooldownSec: s.cooldownSec })) };
  });
  if (problems.length) throw new DataError(fileName, problems);
  return new DragonRegistry(list, { baseGrowMinutes: result.data.rules.growth.baseGrowMinutes, feedShortcutMinutes: result.data.rules.growth.feedShortcutMinutes });
}

// ---------------------------------------------------------------- 알

export const EGG_PREFIX = 'dragon_egg.';
export function eggItem(dragonId: string): string {
  return EGG_PREFIX + dragonId;
}
export function isEggItem(item: string): boolean {
  return item.startsWith(EGG_PREFIX);
}
/** 알 아이템 → 드래곤 id (알 아니면 null) */
export function dragonOfEgg(item: string): string | null {
  return isEggItem(item) ? item.slice(EGG_PREFIX.length) : null;
}

/** 알 레시피 16개 — 제작대에서 재료 → 알 1개. RECIPES 에 합쳐서 가방 "만들기" 탭에 그대로 뜬다 */
export function eggRecipes(dragons: DragonRegistry): RecipeDef[] {
  return dragons.list.map((d) => ({
    id: `egg_${d.id}`,
    name: `${d.name} 알`,
    station: 'crafting_table',
    in: Object.fromEntries(d.recipe.map((r) => [r.material, r.count])),
    out: { [eggItem(d.id)]: 1 },
    toolTier: 0,
    release: 'v1',
  }));
}

// ---------------------------------------------------------------- 둥지 (1단계, 4자리)

/** 둥지 1단계: 마을 광장 남쪽 집터(길 끝, 생성기 HOUSE x 61~66/z 82~86 을 덮는다). 7×7 바닥, 자리 4개. y 는 광장 높이(GROUND_Y) */
export const NEST = {
  x0: 60,
  z0: 81,
  size: 7,
  /** 알 자리 (바닥 위 한 칸에 알 블록이 선다) */
  slots: [
    { x: 61, z: 82 },
    { x: 65, z: 82 },
    { x: 61, z: 86 },
    { x: 65, z: 86 },
  ] as readonly { x: number; z: number }[],
  /** 둥지 안에 서 있는 판정 높이 (바닥 y 부터 이만큼) */
  height: 5,
} as const;

/** 둥지 안(바닥 위)에 서 있나. groundY = 둥지 바닥 높이 */
export function nestContains(groundY: number, px: number, py: number, pz: number): boolean {
  return px >= NEST.x0 && px < NEST.x0 + NEST.size && pz >= NEST.z0 && pz < NEST.z0 + NEST.size && py >= groundY && py < groundY + NEST.height + 1;
}

/** 예전에 둥지를 지었던 자리들 — 서버가 켜질 때 이 자리에 둥지가 남아 있으면 생성 지형으로 되돌린다 (아빠 집과 겹침, 2026-09-20) */
export const OLD_NEST_SITES: readonly { x0: number; z0: number }[] = [{ x0: 74, z0: 42 }];

/** 둥지 구조물: 어디에 무엇을 놓나 (서버가 켜질 때 한 번, 클라 표시용 아님) */
export function nestBlocks(groundY: number): { x: number; y: number; z: number; id: string }[] {
  return nestBlocksAt(groundY, NEST.x0, NEST.z0);
}

/** 둥지가 (x0, z0) 에 지어져 있나: 모서리 원목·가운데 건초·기둥 위 발광석 세 곳을 본다 */
export function isNestBuiltAt(idAt: (x: number, y: number, z: number) => string, groundY: number, x0: number, z0: number): boolean {
  const mid = (NEST.size - 1) >> 1;
  return idAt(x0, groundY, z0) === 'log' && idAt(x0 + mid, groundY, z0 + mid) === 'hay_bale' && idAt(x0, groundY + 4, z0) === 'glowstone';
}

/** 둥지 구조물을 (x0, z0) 기준으로 */
export function nestBlocksAt(groundY: number, x0: number, z0: number): { x: number; y: number; z: number; id: string }[] {
  const out: { x: number; y: number; z: number; id: string }[] = [];
  const { size } = NEST;
  for (let dx = 0; dx < size; dx++)
    for (let dz = 0; dz < size; dz++) {
      const x = x0 + dx,
        z = z0 + dz;
      const edge = dx === 0 || dz === 0 || dx === size - 1 || dz === size - 1;
      const corner = (dx === 0 || dx === size - 1) && (dz === 0 || dz === size - 1);
      out.push({ x, y: groundY, z, id: corner ? 'log' : edge ? 'cobblestone' : 'hay_bale' });
      for (let y = groundY + 1; y <= groundY + NEST.height; y++) out.push({ x, y, z, id: corner && y <= groundY + 3 ? 'log' : corner && y === groundY + 4 ? 'glowstone' : 'air' });
    }
  return out;
}

/** 둥지 자리 번호 → 알 블록 좌표 */
/**
 * 큰 둥지(2단계)·드래곤 성(3단계)이 여는 알 자리 (M6-6, #89). 2단계 고리(11×11)의 안쪽 줄에 놓인다 — 가운데서 다 보인다.
 * 자리 번호 4·5 는 큰 둥지, 6·7 은 드래곤 성이 열어 준다. 아빠 임시안 — "마을이 커지면 둥지도 커진다"(아들 답변 14)
 */
export const NEST_EXTRA_SLOTS: readonly { x: number; z: number; needs: string }[] = [
  { x: 61, z: 80, needs: 'dragon_nest_2' },
  { x: 65, z: 80, needs: 'dragon_nest_2' },
  { x: 59, z: 84, needs: 'dragon_nest_3' },
  { x: 67, z: 84, needs: 'dragon_nest_3' },
];

/** 지금 열려 있는 알 자리 수 (기본 4 + 지어진 둥지 단계마다 2) */
export function eggSlotsOpen(built: readonly string[]): number {
  return NEST.slots.length + NEST_EXTRA_SLOTS.filter((s) => built.includes(s.needs)).length;
}

/** 둥지 자리 번호 → 알 블록 좌표. open 보다 큰 번호는 아직 안 열린 자리(null) */
export function nestSlotPos(groundY: number, slot: number, open = NEST.slots.length): { x: number; y: number; z: number } | null {
  if (slot < 0 || slot >= open) return null;
  const s = slot < NEST.slots.length ? NEST.slots[slot] : NEST_EXTRA_SLOTS[slot - NEST.slots.length];
  return s ? { x: s.x, y: groundY + 1, z: s.z } : null;
}

/** 모든 알 자리 수 (단계를 다 지었을 때) */
export const NEST_MAX_SLOTS = 8;

/** 드래곤 한 마리 (서버 → 클라, 내 것). stage: egg(둥지에 놓인 알) / baby / adult */
export interface DragonInfo {
  id: number;
  dragon: string;
  stage: 'egg' | 'baby' | 'adult';
  /** 알이면 둥지 자리 번호 */
  slot: number | null;
  /** 부화 시각 (ms). 알이면 null */
  hatchedAt: number | null;
  /** 먹인 재료 수 (M6-3) */
  fed: number;
  /** 어른이 되는 시각 (ms, 서버 시계). 아기일 때만 */
  growAt: number | null;
}

// ---------------------------------------------------------------- 성장·먹이 (M6-3, 결정 #77)

/** 어른이 되는 시각: 부화 + 기본 60분 − 먹이 1개당 10분 (dragons.json rules.growth) */
export function growAtOf(rules: DragonRules, hatchedAt: number, fed: number): number {
  return hatchedAt + rules.baseGrowMinutes * 60_000 - fed * rules.feedShortcutMinutes * 60_000;
}

/** 먹이 = 만들 때 쓴 재료들 (아들 답변 4: feedWithRecipeMaterials) */
export function feedItems(def: DragonDef): string[] {
  return def.recipe.map((r) => r.material);
}

/**
 * 부화한 드래곤이 서는 자리(둥지 안쪽 5×5 에서 알 자리 4개를 뺀 21칸). 가운데부터, 처음 다섯은 서로 2칸 떨어져 어른도 겹치지 않게.
 * i 번째 드래곤(id 순) → perches[i % 21]. 서버가 정하고 모두에게 같은 자리로 보인다
 */
export const NEST_PERCHES: readonly { x: number; z: number }[] = (() => {
  const cx = NEST.x0 + 3,
    cz = NEST.z0 + 3;
  const order: [number, number][] = [
    [0, 0], [0, -2], [-2, 0], [2, 0], [0, 2],
    [-1, -1], [1, -1], [-1, 1], [1, 1],
    [-1, -2], [1, -2], [-2, -1], [2, -1], [-2, 1], [2, 1], [-1, 2], [1, 2],
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];
  return order.map(([dx, dz]) => ({ x: cx + dx, z: cz + dz }));
})();

export function perchOf(index: number): { x: number; z: number } {
  return NEST_PERCHES[((index % NEST_PERCHES.length) + NEST_PERCHES.length) % NEST_PERCHES.length]!;
}

/** 드래곤이 보는 방향 (라디안). 대체로 북쪽(광장 쪽, 모델 머리 +z → π) 을 보되 id 로 조금씩 다르게 */
export function perchYaw(id: number): number {
  return Math.PI + (((id * 37) % 100) / 100 - 0.5) * 0.9;
}

// ---------------------------------------------------------------- 탑승 (M6-4, 결정 #78)

/** 안장 아이템 (recipes.json saddle: 가죽 5 + 철 2, 제작대) */
export const SADDLE_ITEM = 'saddle';
/** 탄 사람의 발은 드래곤 발보다 이만큼 위 (어른 등 높이 ≈ 12/16 블록) */
export const RIDE_SEAT_Y = 0.75;
/** 드래곤 자리에서 이 거리(블록) 안에 서 있어야 탄다 */
export const RIDE_RANGE = 6;
/** 누가 무엇을 타고 있나 (PlayerInfo·mount 메시지) */
export interface RidingInfo {
  /** 드래곤 행 id */
  id: number;
  /** 드래곤 종류 (모델) */
  dragon: string;
}

/** 둥지에 있는 드래곤 하나 (모두에게). 위치·단계는 서버가 정한다 */
export interface NestDragonInfo {
  id: number;
  dragon: string;
  owner: string;
  mine: boolean;
  stage: 'baby' | 'adult';
  perch: { x: number; y: number; z: number };
  yaw: number;
  fed: number;
  growAt: number | null;
}

/** 둥지 자리 하나 (모두에게): 누구의 무슨 알인가 */
export interface NestSlotInfo {
  slot: number;
  dragon: string;
  /** 주인 닉 */
  owner: string;
  /** 내 것인가 (받는 사람 기준) */
  mine: boolean;
  /** 드래곤 행 id (내 것일 때 부화용) */
  id: number;
}
