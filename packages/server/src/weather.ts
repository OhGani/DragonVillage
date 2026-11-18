/**
 * 날씨 시계 (2026-11-17, data/weather.json): 마을 하나, 원정 하나. 맑음 → 비/뇌우 → 맑음…
 * 언제 바뀌고 번개가 언제 치는지는 시드·차례로 정한다 (shared/rules/weather.ts). 방(VillageRoom)이 매 틱 step 을 부르고
 * 바뀌면 그 세계에 { t: 'weather' } 를 보낸다.
 */
import { firstClearMs, isRaining, isStorming, joinWeather, lightningGapMs, nextWeather, snowInstead, type WeatherCycle, type WeatherFall, type WeatherKind, type WeatherRules } from '@dragon-village/shared';

/** 모두 잠든 지 이만큼 지나면 비가 그친다 (마인크래프트: 비 오는 중에 자고 일어나면 갠다) */
export const SLEEP_CLEARS_MS = 3000;

export class WeatherClock {
  kind: WeatherKind = 'clear';
  /** 지금 날씨가 끝나는 서버 시각 */
  until: number;
  /** 몇 번째 바뀜 (시드와 함께 다음 날씨를 정한다) */
  private n = 0;
  private boltN = 0;
  private nextBoltAt = 0;
  /** 이 세계 사람이 모두 누운 때 (0 = 아님) */
  sleptSince = 0;
  /** 지금 내리는 것. 보통은 이곳에 내리는 것(baseFall) 그대로, 마을은 비 대신 눈일 때가 있다 (snowChance, 2026-11-18) */
  fall: WeatherFall;
  private snowN = 0;

  constructor(
    private readonly rules: WeatherRules,
    private readonly cycle: WeatherCycle,
    readonly baseFall: WeatherFall,
    private readonly seed: number,
    now: number,
  ) {
    this.fall = baseFall;
    this.until = now + firstClearMs(cycle, seed);
  }

  /** 비가 시작할 때 비로 올지 눈으로 올지 */
  private pickFall(kind: WeatherKind): WeatherFall {
    if (kind === 'clear') return this.baseFall;
    return snowInstead(this.cycle, this.baseFall, this.seed, ++this.snowN) ? 'snow' : this.baseFall;
  }

  /** 때가 됐으면 다음 날씨로. 바뀌었으면 true */
  step(now: number): boolean {
    if (now < this.until) return false;
    const nx = nextWeather(this.cycle, this.kind, this.seed, ++this.n);
    this.set(nx.kind, nx.ms, now, this.pickFall(nx.kind));
    return true;
  }

  /** 지금부터 ms 동안 이 날씨 (부모 페이지 🛠 카드·테스트·잠자기). fall 을 주면 그 동안 그것이 내린다 (🌨️ 눈 버튼) */
  set(kind: WeatherKind, ms: number, now: number, fall: WeatherFall = this.baseFall): void {
    this.kind = kind;
    this.fall = this.baseFall === 'none' ? 'none' : fall;
    this.until = now + ms;
    this.sleptSince = 0;
    if (kind === 'thunder') this.nextBoltAt = now + lightningGapMs(this.rules, this.seed, ++this.boltN);
  }

  /** 들어올 때 새로 뽑기 (joinWeights). 뽑았으면 true */
  reroll(seed: number, now: number): boolean {
    const w = joinWeather(this.cycle, seed);
    if (!w) return false;
    this.set(w.kind, w.ms, now, this.pickFall(w.kind));
    return true;
  }

  /** 맑게 — 다음 맑음 길이만큼 */
  clear(now: number): void {
    if (this.kind === 'clear') return;
    const nx = nextWeather(this.cycle, this.kind, this.seed, ++this.n);
    this.set('clear', nx.ms, now);
  }

  get raining(): boolean {
    return isRaining(this.kind, this.fall);
  }
  get storming(): boolean {
    return isStorming(this.kind, this.fall);
  }

  /** 번개 칠 때가 됐나 — 됐으면 다음 번개 시각을 정하고 true */
  boltDue(now: number): boolean {
    if (!this.storming || now < this.nextBoltAt) return false;
    this.nextBoltAt = now + lightningGapMs(this.rules, this.seed, ++this.boltN);
    return true;
  }

  /** 번개 자리를 고를 때 쓰는 차례 번호 */
  get bolts(): number {
    return this.boltN;
  }

  message(quiet = false): { t: 'weather'; kind: WeatherKind; fall: WeatherFall; quiet?: boolean } {
    return quiet ? { t: 'weather', kind: this.kind, fall: this.fall, quiet: true } : { t: 'weather', kind: this.kind, fall: this.fall };
  }
}
