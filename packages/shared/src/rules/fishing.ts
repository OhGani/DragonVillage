/**
 * 낚시 (data/fishing.json, 2026-11-06 아빠 "낚시 할 수 있게").
 * 낚싯대를 들고 range 칸 안의 물을 탭 → 찌. waitMinSec~waitMaxSec 뒤 입질, biteSec 안에 다시 탭하면 catches 에서 하나(무게 비율).
 * 놓치면 다시 기다린다. 기다림·잡히는 것은 서버가 시드·횟수로 정한다(결정론, Math.random 없음).
 */
import { z } from 'zod';
import { hash3 } from '../math/prng';
import { DataError, koreanizeMessage } from './blocks';

export const FISHING_ROD = 'fishing_rod';

const RawCatch = z
  .object({
    item: z.string().regex(/^[a-z0-9_.]+$/, '영문 소문자·숫자·밑줄(_)만'),
    name: z.string().min(1, '이름이 비었어요'),
    weight: z.number().positive('0보다 커야 해요'),
    count: z.number().int().min(1, '1 이상이어야 해요').max(64, '64까지예요').optional(),
    places: z.array(z.string()).optional(),
  })
  .loose();
const FishingFile = z
  .object({
    _comment: z.string().optional(),
    range: z.number().min(2, '2칸 이상이어야 해요').max(24, '24칸까지예요'),
    waitMinSec: z.number().min(1, '1초 이상이어야 해요'),
    waitMaxSec: z.number().min(1, '1초 이상이어야 해요'),
    biteSec: z.number().min(0.5, '0.5초 이상이어야 해요').max(10, '10초까지예요'),
    xp: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
    catches: z.array(RawCatch).min(1, '잡히는 것이 하나는 있어야 해요'),
  })
  .loose();

export interface FishCatch {
  readonly item: string;
  readonly name: string;
  readonly weight: number;
  readonly count: number;
  /** 이곳(village 또는 원정지 id)에서만. null = 어디서나 */
  readonly places: readonly string[] | null;
}
export interface FishingRules {
  readonly range: number;
  readonly waitMinMs: number;
  readonly waitMaxMs: number;
  readonly biteMs: number;
  readonly xp: readonly [number, number];
  readonly catches: readonly FishCatch[];
}

export function parseFishing(raw: unknown, fileName = 'data/fishing.json'): FishingRules {
  const r = FishingFile.safeParse(raw);
  if (!r.success) throw new DataError(fileName, r.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const d = r.data;
  const problems: string[] = [];
  if (d.waitMaxSec < d.waitMinSec) problems.push(`waitMaxSec(${d.waitMaxSec})가 waitMinSec(${d.waitMinSec})보다 작아요`);
  if (d.xp[1] < d.xp[0]) problems.push(`xp 의 둘째 수(${d.xp[1]})가 첫째(${d.xp[0]})보다 작아요`);
  if (problems.length) throw new DataError(fileName, problems);
  return {
    range: d.range,
    waitMinMs: d.waitMinSec * 1000,
    waitMaxMs: d.waitMaxSec * 1000,
    biteMs: d.biteSec * 1000,
    xp: [d.xp[0], d.xp[1]],
    catches: d.catches.map((c) => ({ item: c.item, name: c.name, weight: c.weight, count: c.count ?? 1, places: c.places ?? null })),
  };
}

/** n 번째 입질까지 기다리는 시간(ms) */
export function fishWaitMs(rules: FishingRules, seed: number, n: number): number {
  return Math.round(rules.waitMinMs + hash3(n, 7, 3, seed) * (rules.waitMaxMs - rules.waitMinMs));
}

/** place(village 또는 원정지 id)에서 n 번째로 낚는 것. 그곳에서 잡히는 게 없으면 null */
export function rollCatch(rules: FishingRules, place: string, seed: number, n: number): { item: string; count: number } | null {
  const here = rules.catches.filter((c) => !c.places || c.places.includes(place));
  const total = here.reduce((s, c) => s + c.weight, 0);
  if (total <= 0) return null;
  let r = hash3(n, 11, 5, seed) * total;
  for (const c of here) {
    r -= c.weight;
    if (r < 0) return { item: c.item, count: c.count };
  }
  const last = here[here.length - 1]!;
  return { item: last.item, count: last.count };
}

/** n 번째로 낚았을 때 경험치 */
export function fishXp(rules: FishingRules, seed: number, n: number): number {
  return rules.xp[0] + Math.floor(hash3(n, 13, 9, seed) * (rules.xp[1] - rules.xp[0] + 1));
}
