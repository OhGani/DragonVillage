/**
 * 날씨 (data/weather.json, 아빠 2026-11-17 "날씨 적용 해줘" — 나무위키 마인크래프트/날씨).
 * 맑음 → 비(추운 곳은 눈) → 맑음… 비 가운데 thunderChance 만큼은 뇌우: 번개가 떨어지고 낮에도 몹이 나온다.
 * 마을과 원정지가 따로 돈다. 곳마다 내리는 것(places): rain · snow · dry(사막 — 하늘만 흐림) · none(동굴·네더·엔드 — 날씨 없음).
 * 언제 바뀌는지는 서버가 시드·차례로 정한다(결정론, Math.random 없음). 클라는 받은 대로 그린다.
 */
import { z } from 'zod';
import { hash3 } from '../math/prng';
import { DataError, koreanizeMessage } from './blocks';

export type WeatherKind = 'clear' | 'rain' | 'thunder';
export type WeatherFall = 'rain' | 'snow' | 'dry' | 'none';
export const WEATHER_KINDS: readonly WeatherKind[] = ['clear', 'rain', 'thunder'];
export const WEATHER_FALLS: readonly WeatherFall[] = ['rain', 'snow', 'dry', 'none'];
export const WEATHER_KO: Record<WeatherKind, string> = { clear: '맑음', rain: '비', thunder: '뇌우' };

const Range = z.tuple([z.number().min(0.1, '0.1분 이상이어야 해요'), z.number().min(0.1, '0.1분 이상이어야 해요')]);
const Cycle = z
  .object({
    clearMinutes: Range,
    rainMinutes: Range,
    thunderChance: z.number().min(0, '0 이상이어야 해요').max(1, '1까지예요'),
    joinWeights: z.object({ clear: z.number().min(0), rain: z.number().min(0), thunder: z.number().min(0) }).optional(),
  })
  .loose();
const WeatherFile = z
  .object({
    village: Cycle,
    expedition: Cycle,
    places: z.record(z.string(), z.string()),
    skyLight: z.object({ rain: z.number().min(0.2).max(1), thunder: z.number().min(0.2).max(1) }).loose(),
    lightning: z
      .object({
        everySeconds: z.tuple([z.number().min(1, '1초 이상이어야 해요'), z.number().min(1, '1초 이상이어야 해요')]),
        range: z.number().min(4, '4칸 이상이어야 해요').max(96, '96칸까지예요'),
        radius: z.number().min(0.5).max(8, '8칸까지예요'),
        damage: z.number().min(0).max(40, '40까지예요'),
        rodRange: z.number().min(0).max(256, '256칸까지예요').optional(),
      })
      .loose(),
    snow: z
      .object({
        layersPerSecond: z.number().min(0).max(40, '40까지예요'),
        range: z.number().min(4, '4칸 이상이어야 해요').max(64, '64칸까지예요'),
      })
      .loose()
      .optional(),
    fishWait: z.number().min(0.1, '0.1 이상이어야 해요').max(1, '1까지예요'),
    rainHurts: z.array(z.string()),
  })
  .loose();

export interface WeatherCycle {
  readonly clearMs: readonly [number, number];
  readonly rainMs: readonly [number, number];
  readonly thunderChance: number;
  /** 아무도 없는 곳에 처음 들어올 때 날씨를 뽑는 비율 (없으면 안 뽑고 그대로) */
  readonly joinWeights: { readonly clear: number; readonly rain: number; readonly thunder: number } | null;
}
export interface WeatherRules {
  readonly village: WeatherCycle;
  readonly expedition: WeatherCycle;
  /** 곳(village 또는 원정지 id) → 내리는 것. 없으면 rain */
  readonly places: ReadonlyMap<string, WeatherFall>;
  readonly skyLight: { readonly rain: number; readonly thunder: number };
  readonly lightning: { readonly everyMs: readonly [number, number]; readonly range: number; readonly radius: number; readonly damage: number; readonly rodRange: number };
  /** 눈 쌓임 (2026-11-17): 1초에 몇 칸·사람 둘레 몇 칸 */
  readonly snow: { readonly layersPerSecond: number; readonly range: number };
  readonly fishWait: number;
  readonly rainHurts: ReadonlySet<string>;
}

export function parseWeather(raw: unknown, fileName = 'data/weather.json'): WeatherRules {
  const r = WeatherFile.safeParse(raw);
  if (!r.success) throw new DataError(fileName, r.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const d = r.data;
  const problems: string[] = [];
  const range = (where: string, v: readonly [number, number]) => {
    if (v[1] < v[0]) problems.push(`${where} 의 둘째 수(${v[1]})가 첫째(${v[0]})보다 작아요`);
  };
  range('village.clearMinutes', d.village.clearMinutes);
  range('village.rainMinutes', d.village.rainMinutes);
  range('expedition.clearMinutes', d.expedition.clearMinutes);
  range('expedition.rainMinutes', d.expedition.rainMinutes);
  range('lightning.everySeconds', d.lightning.everySeconds);
  const places = new Map<string, WeatherFall>();
  for (const [k, v] of Object.entries(d.places)) {
    if (k.startsWith('_')) continue;
    if (!(WEATHER_FALLS as readonly string[]).includes(v)) problems.push(`places.${k}: '${v}' 은(는) 몰라요 — rain · snow · dry · none 중 하나`);
    else places.set(k, v as WeatherFall);
  }
  if (problems.length) throw new DataError(fileName, problems);
  const cycle = (c: z.infer<typeof Cycle>): WeatherCycle => ({
    clearMs: [c.clearMinutes[0] * 60_000, c.clearMinutes[1] * 60_000],
    rainMs: [c.rainMinutes[0] * 60_000, c.rainMinutes[1] * 60_000],
    thunderChance: c.thunderChance,
    joinWeights: c.joinWeights && c.joinWeights.clear + c.joinWeights.rain + c.joinWeights.thunder > 0 ? { ...c.joinWeights } : null,
  });
  return {
    village: cycle(d.village),
    expedition: cycle(d.expedition),
    places,
    skyLight: { rain: d.skyLight.rain, thunder: d.skyLight.thunder },
    lightning: { everyMs: [d.lightning.everySeconds[0] * 1000, d.lightning.everySeconds[1] * 1000], range: d.lightning.range, radius: d.lightning.radius, damage: d.lightning.damage, rodRange: d.lightning.rodRange ?? 128 },
    snow: { layersPerSecond: d.snow?.layersPerSecond ?? 4, range: d.snow?.range ?? 24 },
    fishWait: d.fishWait,
    rainHurts: new Set(d.rainHurts),
  };
}

/** 이곳에 내리는 것 (안 적은 곳은 비) */
export function fallOf(rules: WeatherRules, place: string): WeatherFall {
  return rules.places.get(place) ?? 'rain';
}

/** 지금 날씨 다음 차례: 맑음 → 비/뇌우(thunderChance), 비·뇌우 → 맑음. ms = 그 날씨가 가는 시간. 시드·차례 n 으로 결정 */
export function nextWeather(cycle: WeatherCycle, cur: WeatherKind, seed: number, n: number): { kind: WeatherKind; ms: number } {
  const pick = (r: readonly [number, number], salt: number) => Math.round(r[0] + hash3(n, salt, 31, seed) * (r[1] - r[0]));
  if (cur !== 'clear') return { kind: 'clear', ms: pick(cycle.clearMs, 1) };
  return { kind: hash3(n, 2, 31, seed) < cycle.thunderChance ? 'thunder' : 'rain', ms: pick(cycle.rainMs, 3) };
}

/**
 * 들어올 때 새로 뽑는 날씨 (아빠 2026-11-17 "게임 접속하면 날씨 랜덤하게 변경"): joinWeights 비율로 맑음·비·뇌우, 길이는 그 날씨의 범위에서.
 * joinWeights 가 없으면 null
 */
export function joinWeather(cycle: WeatherCycle, seed: number): { kind: WeatherKind; ms: number } | null {
  const w = cycle.joinWeights;
  if (!w) return null;
  let r = hash3(9, 4, 31, seed) * (w.clear + w.rain + w.thunder);
  const kind: WeatherKind = (r -= w.clear) < 0 ? 'clear' : (r -= w.rain) < 0 ? 'rain' : 'thunder';
  const range = kind === 'clear' ? cycle.clearMs : cycle.rainMs;
  return { kind, ms: Math.round(range[0] + hash3(9, 5, 31, seed) * (range[1] - range[0])) };
}

/** 처음 맑음이 가는 시간 (마을은 처음부터 맑음, 원정도 맑음으로 시작) */
export function firstClearMs(cycle: WeatherCycle, seed: number): number {
  return Math.round(cycle.clearMs[0] + hash3(0, 1, 31, seed) * (cycle.clearMs[1] - cycle.clearMs[0]));
}

/** 다음 번개까지 (ms) */
export function lightningGapMs(rules: WeatherRules, seed: number, n: number): number {
  const [a, b] = rules.lightning.everyMs;
  return Math.round(a + hash3(n, 5, 37, seed) * (b - a));
}

/** 날씨가 보이는 곳인가 (동굴·네더·엔드는 아니다) */
export function hasWeather(fall: WeatherFall): boolean {
  return fall !== 'none';
}

/** 비를 맞는가 — 비가 내리는 곳에 비·뇌우. 눈·사막은 아니다 (마인크래프트: 눈은 불도 못 끄고, 사막엔 안 내린다) */
export function isRaining(kind: WeatherKind, fall: WeatherFall): boolean {
  return kind !== 'clear' && fall === 'rain';
}

/** 번개가 치는가 — 뇌우이고 날씨가 있는 곳 (사막에도 친다) */
export function isStorming(kind: WeatherKind, fall: WeatherFall): boolean {
  return kind === 'thunder' && fall !== 'none';
}

/** 하늘 밝기 배율: 맑음 1, 비 0.8, 뇌우 0.67. 날씨 없는 곳은 1 */
export function weatherSkyLight(rules: WeatherRules, kind: WeatherKind, fall: WeatherFall): number {
  if (fall === 'none' || kind === 'clear') return 1;
  return kind === 'thunder' ? rules.skyLight.thunder : rules.skyLight.rain;
}

/** 바뀔 때 띄우는 짧은 말 (초5가 읽는다) */
export function weatherToast(kind: WeatherKind, fall: WeatherFall): string | null {
  if (fall === 'none') return null;
  if (kind === 'clear') return '☀️ 날이 갰어요';
  if (kind === 'thunder') return fall === 'snow' ? '⛈️ 눈보라에 천둥이 쳐요! 몹이 낮에도 나와요' : '⛈️ 천둥 번개! 몹이 낮에도 나와요';
  if (fall === 'snow') return '🌨️ 눈이 내려요';
  if (fall === 'dry') return '☁️ 하늘이 흐려졌어요';
  return '🌧️ 비가 와요';
}
