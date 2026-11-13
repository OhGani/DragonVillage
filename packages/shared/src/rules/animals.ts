/**
 * 마을 동물 규칙 (M8-1, 아빠 2026-09-24 "마을 숲속에 동물, 아기·어른, 길들여 펫처럼"). 순수 함수 — 서버가 돌리고 클라는 그린다.
 *
 * - 종류·먹이·드롭은 `mobs.json passive`(아들 7차): 소·양 = 밀, 돼지 = 당근, 닭 = 씨앗, 강아지(개) = 뼈로 길들이기.
 * - 마을 숲(가운데서 46~100칸 고리, 밭·강·광장 제외)에 **종류별로 무리**(HERD_SPREAD 안에 2~4마리)로 뿌린다(종류별 목표 INITIAL_ANIMALS). 야생이 목표보다 줄면(사냥·죽음)
 *   10분마다 둘씩 무리로 다시 생기고, 서버를 켤 때도 모자란 만큼 채운다 — 숲에 늘 동물이 있게 (아빠 2026-09-24 "숲에 동물이 안 보인다", #106).
 * - 어른에게 먹이를 주면 30초 동안 사랑(♥). 사랑하는 같은 종류 어른 둘이 4칸 안이면 아기가 태어난다(5분 쿨타임). 아기는 20분 뒤 어른, 먹이면 2분씩 빨라진다.
 * - 먹이를 들고 있으면 8칸 안의 그 동물이 따라온다. 길들인 강아지는 주인을 따라다니고(2.5칸에서 멈춤), 20칸 넘게 멀어지면 옆으로 순간이동, 빈손으로 탭하면 앉기/일어나기.
 * - 길들이기: 뼈를 들고 탭 → 1/3 확률(시드·시도 횟수로 결정론). 길들인 동물은 아무도 때릴 수 없다.
 * - 야생 동물은 때릴 수 있고 죽으면 mobs.json 드롭(가죽·고기 등) + 경험치. 마을 블록처럼 "지은 것" 은 아니지만 사라지지 않게 서버가 저장한다.
 */
import { hash3 } from '../math/prng';
import type { MobKind } from './mobs';

/** 동물 종류 (mobs.json passive id). dog = 강아지(늑대) */
export const ANIMAL_KINDS: readonly MobKind[] = ['cow', 'pig', 'sheep', 'chicken', 'dog', 'horse', 'villager', 'boat', 'minecart', 'cat', 'camel'];
export function isAnimal(kind: MobKind): boolean {
  return ANIMAL_KINDS.includes(kind);
}

/** 상태 바이트 윗자리: 아기·길들임·앉음·사랑 (아랫자리는 MOB_STATE 걷기/공격) */
export const ANIMAL_FLAG = { sheared: 0x08, baby: 0x10, tamed: 0x20, sitting: 0x40, love: 0x80 } as const; // 아랫 3비트는 MOB_STATE

/** 동물 id 는 몹 id 와 겹치지 않게 여기서부터 (원정·방어전 몹은 1부터). MobsState 의 id 는 u16 이라 65535 아래여야 한다 */
export const ANIMAL_ID_BASE = 40_000;
/** 말 안장 높이 (#166): 탄 사람 발이 말 등 위 이만큼 */
export const HORSE_SEAT_Y = 1.25;
/** 말을 타면 이 속도로 달린다 (칸/초, 사람 달리기 5.6) */
export const HORSE_SPEED = 9.5;
/** 탈 수 있는 동물 (#166 말, #185 돼지) — 안장을 씌우면 내 것, 빈손 탭으로 탄다 */
/**
 * 끈 (#297, 아빠 2026-11-13 마인크래프트 '끈'): 끈을 들고 동물을 탭하면 매여서 따라오고, 그대로 울타리를 탭하면 거기 묶인다.
 * 맨 동물을 빈손(또는 끈)으로 탭하면 풀리고 끈이 가방으로 돌아온다. 주민·보트·수레는 못 맨다
 */
export const LEAD = 'lead';
/** 끄는 사람과 이만큼 벌어지면 끈이 풀린다 (끈은 가방으로) */
export const LEASH_SNAP = 10;
/** 이 안에 있으면 서 있고, 넘으면 따라온다 */
export const LEASH_SLACK = 2.5;
/** 이보다 멀면 끌려오는 속도(칸/초)로 — 걷는 사람(4.3)보다 조금 빠르게 */
export const LEASH_PULL_FAR = 4;
export const LEASH_PULL_SPEED = 5.2;
/** 울타리에 묶이면 이 안에서만 돌아다닌다 */
export const LEASH_POST_R = 4;
const NO_LEASH: readonly string[] = ['villager', 'boat', 'minecart'];
export function canLeash(kind: MobKind): boolean {
  return ANIMAL_KINDS.includes(kind) && !NO_LEASH.includes(kind);
}

export const MOUNT_KINDS = ['horse', 'pig', 'boat', 'minecart', 'camel'] as const; // 낙타 (2026-11-07) // 보트 (#209)·수레 (#237): 주인 없이 누구나 탄다
export type MountKind = (typeof MOUNT_KINDS)[number];
export function isMountKind(kind: string): kind is MountKind {
  return (MOUNT_KINDS as readonly string[]).includes(kind);
}
/** 돼지 안장 높이 (#185): 말보다 낮다 */
export const PIG_SEAT_Y = 0.85;
/** 돼지 (#185, 아들 2026-10-17 마인크래프트 돼지 타기): 당근 낚싯대를 들면 이 속도, 아니면 느릿느릿. 점프는 못 하고 한 칸 턱은 저절로 오른다 */
export const PIG_SPEED = 4.5;
export const PIG_SLOW = 1.2;
export const CARROT_ON_A_STICK = 'carrot_on_a_stick';
/** 보트 (#209, 아빠 2026-10-21 마인크래프트 보트 그림): 보트 아이템을 들고 물을 탭하면 물 위에 뜬다. 빈손 탭으로 타고, 노를 저어 물 위를 간다 */
export const BOAT = 'boat';
export const BOAT_SEAT_Y = 0.35;
export const BOAT_SPEED = 7;
/** 물 밖(땅)에서는 느릿느릿 */
export const BOAT_LAND_SPEED = 1.2;
/** 수레 (#237): 수레 아이템을 들고 철도를 탭하면 놓인다. 빈손 탭으로 타고, 보는 쪽으로 밀면 철도를 따라 달린다 (shared/rules/rails.ts) */
export const MINECART = 'minecart';
export const CART_SEAT_Y = 0.3;
/**
 * 낙타 (아빠가 보낸 그림·나무위키 2026-11-07): 안장을 씌우면 내 낙타(길들이기 없음). 등이 높고(앉은 발 높이 CAMEL_SEAT_Y),
 * 말보다 느리다(CAMEL_SPEED). 점프 대신 앞으로 돌진(CAMEL_DASH_SPEED × CAMEL_DASH_MS ≈ 10칸) — 그 뒤 CAMEL_DASH_COOLDOWN_MS 동안은 걷기만(CAMEL_WALK).
 * 1.5칸 턱도 그냥 넘는다(CAMEL_STEP). 친구가 뒤에 탈 수 있다(두 번째 자리, 앞 사람 뒤 CAMEL_BACK). 타고 있으면 좀비 같은 근접 공격이 안 닿는다.
 * 선인장: 다친 낙타를 치료하고, 어른 둘에게 주면 아기 낙타, 아기는 빨리 자란다
 */
export const CAMEL_SEAT_Y = 1.9;
export const CAMEL_SPEED = 5.2;
export const CAMEL_WALK = 2.6;
export const CAMEL_DASH_SPEED = 18;
export const CAMEL_DASH_MS = 550;
export const CAMEL_DASH_COOLDOWN_MS = 2750;
export const CAMEL_STEP = 1.5;
/** 뒤에 탄 사람은 앞 사람보다 이만큼 뒤 (낙타 혹 뒤) */
export const CAMEL_BACK = 1.05;
/** 뒤에 타려면 앞 사람과 이 안에 있어야 */
export const CAMEL_BACK_REACH = 4.5;
/** 선인장으로 치료하는 양 */
export const CAMEL_CACTUS_HEAL = 4;
/** 안장 아이템 */
export const SADDLE = 'saddle';
/** 대장장이 (#173): 대장간이 지어지면 그 앞에 서는 주민의 이름. 잡혀가지 않는다 */
export const BLACKSMITH_NAME = '대장장이';

/**
 * 말마다 다른 달리기·점프 (#219, 아들 14차 8번 "말마다 속도·점프 다르게"): 번호로 정해져 누가 봐도 같다.
 * speed 8~11.5 칸/초(사람 달리기의 1.4~2배), jump 는 사람 점프의 1.0~1.45배. stars 는 1~5 (보여 주기용)
 */
export function horseStats(mobId: number): { speed: number; jump: number; speedStars: number; jumpStars: number } {
  const h = Math.imul(mobId | 0, 2654435761) >>> 0;
  const a = (h & 0xffff) / 65536;
  const b = (h >>> 16) / 65536;
  return { speed: 8 + a * 3.5, jump: 1 + b * 0.45, speedStars: 1 + Math.min(4, Math.floor(a * 5)), jumpStars: 1 + Math.min(4, Math.floor(b * 5)) };
}

export const BABY_MS = 20 * 60_000;
/** 아기에게 먹이면 이만큼 빨리 자란다 */
export const FEED_GROW_MS = 2 * 60_000;
export const LOVE_MS = 30_000;
export const BREED_COOLDOWN_MS = 5 * 60_000;
export const BREED_RANGE = 4;
/** 먹이를 든 사람을 따라오는 거리 */
export const FOLLOW_RANGE = 8;
export const FOLLOW_STOP = 1.8;
export const PET_FOLLOW_STOP = 2.5;
export const PET_TELEPORT_RANGE = 20;
/** 한 번 걸어가는 거리 · 집(처음 자리)에서 벗어나지 않는 거리 */
export const WANDER_RANGE = 6;
export const HOME_RANGE = 24;
export const TAME_CHANCE = 0.34;
/** 종류별 야생 목표 수 (처음 뿌리는 수 = 모자라면 채우는 기준. 길들인 것은 세지 않는다). 아빠 2026-09-24: 19 → "너무 많다" 11 → "안 보인다" 무리 16 */
/** 종류별 야생 목표 — 아들 13차 답(2026-10-07, #129) "25마리로 늘려줘" (전엔 3·3·3·4·3 = 16) */
export const INITIAL_ANIMALS: Readonly<Partial<Record<MobKind, number>>> = { cow: 5, pig: 5, sheep: 5, chicken: 6, dog: 4, horse: 3, villager: 6, cat: 5, camel: 2 }; // 낙타 2 (2026-11-07, 마을엔 사막이 없어 숲에 — 원정 사막엔 탈 수 없으니 안 둔다) // 고양이 5 (2026-11-06, 마인크래프트 마을 고양이 최대 5) // 주민 3 → 6 (집마다 둘, #229 아빠 "주민 수 좀 늘려 줘")
export const ANIMALS_MAX = 47; // 낙타 2 더함 (2026-11-07) // 고양이 5 더함 (2026-11-06)
/** 모자란 종류를 채우는 간격 · 한 번에 생기는 수 */
export const RESPAWN_EVERY_MS = 10 * 60_000;
export const RESPAWN_BATCH = 2;
/** 무리: 첫 마리 자리에서 이 안에 나머지가 선다 */
export const HERD_SPREAD = 4;
/** 동물 걸음은 몹 speed 의 이 배 (한가롭게) */
export const WANDER_SPEED_MULT = 0.6;
/** 양털 깎기 (M8-1 3차): 가위를 들고 탭 → 양털 1~3, 5분 뒤 다시 자란다 (마인크래프트는 풀을 뜯어야 자란다 — 시간으로 단순화) */
export const SHEARS_ITEM = 'shears';
export const WOOL_ITEM = 'wool';
export const WOOL_REGROW_MS = 5 * 60_000;
/** 달걀 (M8-1 3차): 어른 닭이 6분마다 하나 품는다(최대 3). 빈손으로 닭을 탭하면 받는다 — 아이템 엔티티가 없어서 (#108) */
export const EGG_ITEM = 'egg';
export const EGG_EVERY_MS = 6 * 60_000;
export const EGG_MAX = 3;

/** 어른 동물의 체력 (아기·길들인 강아지는 다르다) */
export function animalMaxHp(base: number, kind: MobKind, tamed: boolean): number {
  if (kind === 'dog' && tamed) return 20;
  return base;
}

/**
 * 고양이 (2026-11-06, 아빠가 보낸 마인크래프트 고양이 그림 11가지 + 위키 설명).
 * - 마을 주민 집 둘레에 산다(숲이 아니라). 길들이지 않은 고양이는 사람을 피한다 — CAT_SHY_R 안에 오면 CAT_FLEE 칸 떨어지게 달아난다.
 *   단, 대구·연어를 들고 있으면 피하지 않고 다가온다(먹이 따라오기).
 * - 대구·연어를 들고 탭 → 1/3 확률로 길들임(강아지와 같다). 길들이면 빨간 목걸이, 주인을 따라다니고, 빈손 탭으로 앉기·풀어놓기.
 * - 길들인 어른 둘에게 대구·연어를 주면 아기 고양이 — 아기도 같은 주인의 고양이.
 * - 크리퍼는 고양이를 무서워해 CREEPER_CAT_R 칸 안에 고양이가 있으면 터지지 않고 달아난다.
 * - 주인이 침대에서 CAT_GIFT_SLEEP_MS 넘게 자고 일어나면, 곁(CAT_GIFT_R)의 내 고양이가 CAT_GIFT_CHANCE 확률로 선물(mobs.json cat gifts)을 준다. 한 사람에게 CAT_GIFT_COOLDOWN_MS 에 한 번.
 */
export const CAT_SHY_R = 6;
export const CAT_FLEE = 10;
export const CREEPER_CAT_R = 6;
export const CAT_GIFT_CHANCE = 0.7;
export const CAT_GIFT_SLEEP_MS = 10_000;
export const CAT_GIFT_R = 16;
export const CAT_GIFT_COOLDOWN_MS = 5 * 60_000;
/** 고양이 털 11가지 (마인크래프트 자바판 순서) — 동물 번호로 정해져 모두에게 같은 고양이 */
export const CAT_COATS = ['tabby', 'tuxedo', 'red', 'siamese', 'british', 'calico', 'persian', 'ragdoll', 'white', 'jellie', 'black'] as const;
export type CatCoat = (typeof CAT_COATS)[number];
export const CAT_COAT_NAMES: Record<CatCoat, string> = { tabby: '얼룩 고양이', tuxedo: '턱시도 고양이', red: '치즈 고양이', siamese: '샴고양이', british: '브리티시 쇼트헤어', calico: '삼색 고양이', persian: '페르시안', ragdoll: '래그돌', white: '흰 고양이', jellie: '젤리 고양이', black: '검은 고양이' };

/** 고양이 선물 뽑기 (결정론: 시드·사람·몇 번째 잠). 안 주면 null */
export function catGiftRoll(gifts: readonly { item: string; weight: number }[], seed: number, who: number, n: number): string | null {
  if (gifts.length === 0 || hash3(who, n, 51, seed) >= CAT_GIFT_CHANCE) return null;
  const total = gifts.reduce((s, g) => s + g.weight, 0);
  let r = hash3(who, n, 52, seed) * total;
  for (const g of gifts) {
    r -= g.weight;
    if (r < 0) return g.item;
  }
  return gifts[gifts.length - 1]!.item;
}

/** 걷기 목표 뽑기 (결정론: 시드·id·차례). 지금 자리에서 WANDER_RANGE 안, 집에서 HOME_RANGE 안으로 당긴다 */
export function wanderPick(seed: number, id: number, turn: number, cur: { x: number; z: number }, home: { x: number; z: number }): { x: number; z: number } {
  const a = hash3(id, turn, 11, seed) * Math.PI * 2;
  const d = 2 + hash3(id, turn, 12, seed) * (WANDER_RANGE - 2);
  let x = cur.x + Math.cos(a) * d,
    z = cur.z + Math.sin(a) * d;
  const hd = Math.hypot(x - home.x, z - home.z);
  if (hd > HOME_RANGE) {
    x = home.x + ((x - home.x) / hd) * HOME_RANGE * 0.8;
    z = home.z + ((z - home.z) / hd) * HOME_RANGE * 0.8;
  }
  return { x, z };
}

/** 주민 (#210, 아빠 2026-10-21 "주민들이 주민 집에만 있음 — 마을 전체를 돌아다니게"): 집 둘레가 아니라 광장 가운데(64,64)에서 이 반지름 안을 돌아다닌다 */
export const VILLAGER_ROAM_CENTER = { x: 64.5, z: 64.5 };
export const VILLAGER_ROAM_RANGE = 64;
/** 주민 한 걸음 길이 4~14 (동물의 2~6 보다 멀리) · 걸음 속도는 몹 speed 의 이 배 */
export const VILLAGER_HOP_MIN = 4;
export const VILLAGER_HOP_MAX = 14;
export const VILLAGER_SPEED_MULT = 0.85;
/** 주민이 다음에 갈 곳 (#210): 마을 어디든. 가끔(5번 중 1번) 광장 쪽으로 향해 사람 사는 데로 모인다 */
export function wanderPickVillager(seed: number, id: number, turn: number, cur: { x: number; z: number }): { x: number; z: number } {
  const toPlaza = hash3(id, turn, 14, seed) < 0.2;
  const a = toPlaza ? Math.atan2(VILLAGER_ROAM_CENTER.z - cur.z, VILLAGER_ROAM_CENTER.x - cur.x) : hash3(id, turn, 11, seed) * Math.PI * 2;
  const d = VILLAGER_HOP_MIN + hash3(id, turn, 12, seed) * (VILLAGER_HOP_MAX - VILLAGER_HOP_MIN);
  let x = cur.x + Math.cos(a) * d,
    z = cur.z + Math.sin(a) * d;
  const hd = Math.hypot(x - VILLAGER_ROAM_CENTER.x, z - VILLAGER_ROAM_CENTER.z);
  if (hd > VILLAGER_ROAM_RANGE) {
    x = VILLAGER_ROAM_CENTER.x + ((x - VILLAGER_ROAM_CENTER.x) / hd) * VILLAGER_ROAM_RANGE * 0.9;
    z = VILLAGER_ROAM_CENTER.z + ((z - VILLAGER_ROAM_CENTER.z) / hd) * VILLAGER_ROAM_RANGE * 0.9;
  }
  return { x, z };
}

/** 이번 걸음 뒤 서 있는 시간(초) 2~5 */
export function wanderPause(seed: number, id: number, turn: number): number {
  return 2 + hash3(id, turn, 13, seed) * 3;
}

/** 양털 깎을 때 나오는 수 1~3 (결정론: 시드·id·몇 번째) */
export function shearRoll(seed: number, id: number, n: number): number {
  return 1 + Math.floor(hash3(id, n, 41, seed) * 3);
}

/** 길들이기 시도 결과 (결정론: 시드·id·시도 횟수) */
export function tameRoll(seed: number, id: number, attempt: number): boolean {
  return hash3(id, attempt, 21, seed) < TAME_CHANCE;
}

/** 마을 숲 자리: 가운데(64,64)에서 46~100칸 고리(나무가 빽빽한 곳까지), 밭(서 20~44·동 84~108, z 54~74)·강(z<48)·남쪽 둥지(z>76 & x 54~72) 는 피한다 */
export function isAnimalSpot(x: number, z: number): boolean {
  const d = Math.hypot(x - 64, z - 64);
  if (d < 46 || d > 100) return false;
  if (z < 48) return false;
  if (z >= 52 && z <= 76 && ((x >= 18 && x <= 46) || (x >= 82 && x <= 110))) return false;
  if (z > 76 && x >= 54 && x <= 72) return false;
  return true;
}

/** i 번째 동물이 처음 서는 자리 후보 (결정론). 못 서면 groundAt 이 null 이라 서버가 다음 후보를 본다 */
export function animalSpotCandidate(seed: number, i: number, attempt: number): { x: number; z: number } {
  const a = hash3(i, attempt, 31, seed) * Math.PI * 2;
  const d = 46 + hash3(i, attempt, 32, seed) * 54;
  return { x: Math.floor(64 + Math.cos(a) * d) + 0.5, z: Math.floor(64 + Math.sin(a) * d) + 0.5 };
}

/** 무리의 k 번째가 첫 마리(anchor) 곁에 서는 자리 후보 (결정론) */
export function herdSpotCandidate(seed: number, i: number, k: number, attempt: number, anchor: { x: number; z: number }): { x: number; z: number } {
  const a = hash3(i * 7 + k, attempt, 33, seed) * Math.PI * 2;
  const d = 1.5 + hash3(i * 7 + k, attempt, 34, seed) * (HERD_SPREAD - 1.5);
  return { x: Math.floor(anchor.x + Math.cos(a) * d) + 0.5, z: Math.floor(anchor.z + Math.sin(a) * d) + 0.5 };
}
