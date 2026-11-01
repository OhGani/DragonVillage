import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { POTIONS } from './data';
import { AWKWARD, WATER_BOTTLE, isPotionItem, parsePotions, potionFromItemId, potionItemId, waterBottle, type PotionState, addEffect, pruneEffects, hasEffect, speedMultiplier, jumpMultiplier, attackBonus, damageMultiplier, potionOutcome, isHarmfulEffect, LINGER_RADIUS, LINGER_SECONDS, lingerRadius, lingerOutcome } from './potions';

const small = {
  base: {
    water_bottle: { name: '물병' },
    awkward: { name: '어색한 물약', from: 'water_bottle', ingredient: 'nether_wart' },
  },
  modifiers: {
    redstone: { name: '레드스톤', does: 'extend' },
    glowstone_dust: { name: '발광석 가루', does: 'amplify' },
    gunpowder: { name: '화약', does: 'splash' },
    dragon_breath: { name: '드래곤의 숨결', does: 'lingering' },
    fermented_spider_eye: { name: '발효된 거미 눈', does: 'corrupt' },
  },
  potions: [
    { id: 'speed', name: '신속의 물약', from: 'awkward', ingredient: 'sugar', effect: 'speed', seconds: 180, corruptsTo: 'slowness' },
    { id: 'slowness', name: '감속의 물약', from: 'speed', ingredient: 'fermented_spider_eye', effect: 'slowness', seconds: 90 },
    { id: 'healing', name: '치유의 물약', from: 'awkward', ingredient: 'glistering_melon', effect: 'instant_health', seconds: 0, canExtend: false, corruptsTo: 'harming' },
    { id: 'harming', name: '고통의 물약', from: 'healing', ingredient: 'fermented_spider_eye', effect: 'instant_damage', seconds: 0, canExtend: false },
    { id: 'fire_resistance', name: '화염 저항', from: 'awkward', ingredient: 'magma_cream', effect: 'fire_resistance', seconds: 180, canAmplify: false, release: 'v1.1' },
    { id: 'weakness', name: '나약함', from: 'water_bottle', ingredient: 'fermented_spider_eye', effect: 'weakness', seconds: 90, canAmplify: false },
  ],
};

/** 재료를 차례로 넣는다. 중간에 안 먹히면 null */
function chain(reg: ReturnType<typeof parsePotions>, ...ingredients: string[]): PotionState | null {
  let s: PotionState | null = waterBottle();
  for (const ing of ingredients) {
    if (!s) return null;
    s = reg.brew(s, ing);
  }
  return s;
}

describe('parsePotions', () => {
  it('작은 데이터를 읽고 기본값을 채운다', () => {
    const reg = parsePotions(small);
    expect(reg.count).toBe(6);
    expect(reg.require('speed').canExtend).toBe(true);
    expect(reg.require('speed').canAmplify).toBe(true);
    expect(reg.require('healing').canExtend).toBe(false);
    expect(reg.require('fire_resistance').canAmplify).toBe(false);
    expect(reg.require('slowness').corruptsTo).toBeNull();
    expect(reg.awkwardIngredient).toBe('nether_wart');
    expect(reg.v1().map((d) => d.id)).not.toContain('fire_resistance');
  });

  it('양조기 규칙: JSON 에 없으면 마인크래프트 기본값, 있으면 그 값', () => {
    expect(parsePotions(small).stand).toEqual({ fuel: 'blaze_powder', brewsPerFuel: 20, bottles: 3, brewSeconds: 20 });
    const custom = parsePotions({ ...small, stand: { fuel: 'coal', brewsPerFuel: 5, bottles: 1, brewSeconds: 10 } });
    expect(custom.stand.bottles).toBe(1);
    expect(() => parsePotions({ ...small, stand: { fuel: 'redstone', brewsPerFuel: 5, bottles: 1, brewSeconds: 10 } })).toThrow(/연료/);
    expect(() => parsePotions({ ...small, stand: { fuel: 'coal', brewsPerFuel: 5, bottles: 4, brewSeconds: 10 } })).toThrow(/최대 3개/);
    expect(POTIONS.stand.fuel).toBe('blaze_powder');
    expect(POTIONS.stand.bottles).toBe(3);
  });

  it('실제 data/potions.json 이 통과하고 사슬이 물병까지 이어진다', () => {
    expect(POTIONS.count).toBeGreaterThanOrEqual(19);
    for (const d of POTIONS.defs) {
      // from 을 따라가면 awkward 나 water_bottle 에 닿는다
      let cur = d.from;
      let hops = 0;
      while (cur !== AWKWARD && cur !== WATER_BOTTLE) {
        cur = POTIONS.require(cur).from;
        if (++hops > 10) throw new Error(`사슬이 너무 길다: ${d.id}`);
      }
      if (d.corruptsTo) POTIONS.require(d.corruptsTo);
    }
    // 가이드의 물약들이 다 있다
    for (const id of ['speed', 'slowness', 'leaping', 'strength', 'healing', 'harming', 'poison', 'regeneration', 'fire_resistance', 'water_breathing', 'night_vision', 'invisibility', 'turtle_master', 'slow_falling', 'wind_charged', 'weaving', 'oozing', 'infested', 'weakness']) {
      POTIONS.require(id);
    }
  });

  it('잘못된 값이면 한국어 DataError 를 던진다', () => {
    const bad = { ...small, potions: [{ ...small.potions[0], seconds: -1 }] };
    let err: unknown;
    try {
      parsePotions(bad);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(DataError);
    const msg = (err as DataError).message;
    expect(msg).toContain('data/potions.json');
    expect(msg).toContain('1번째 물약(id: speed)');
    expect(msg).toContain('seconds');
  });

  it('from·corruptsTo 가 없는 물약을 가리키거나 고리를 만들면 알려준다', () => {
    const missing = { ...small, potions: [{ ...small.potions[0], from: 'nothing', corruptsTo: 'ghost' }] };
    expect(() => parsePotions(missing)).toThrow(/from 'nothing'/);
    expect(() => parsePotions(missing)).toThrow(/corruptsTo 'ghost'/);

    const loop = {
      ...small,
      potions: [
        { id: 'a', name: 'A', from: 'b', ingredient: 'x', effect: 'a', seconds: 10 },
        { id: 'b', name: 'B', from: 'a', ingredient: 'y', effect: 'b', seconds: 10 },
      ],
    };
    expect(() => parsePotions(loop)).toThrow(/빙글빙글/);
  });

  it('레시피가 겹치거나 보조 재료를 물약 재료로 쓰면 알려준다', () => {
    const dup = { ...small, potions: [...small.potions, { ...small.potions[0], id: 'speed2' }] };
    expect(() => parsePotions(dup)).toThrow(/겹쳐요/);
    const modAsIngredient = { ...small, potions: [{ ...small.potions[0], ingredient: 'redstone' }] };
    expect(() => parsePotions(modAsIngredient)).toThrow(/보조 재료\(extend\)/);
    const zeroExtend = { ...small, potions: [{ ...small.potions[2], canExtend: true }] };
    expect(() => parsePotions(zeroExtend)).toThrow(/즉시 효과/);
  });
});

describe('brew (마인크래프트 규칙)', () => {
  const reg = parsePotions(small);

  it('물병 → 어색한 물약 → 신속 → 감속', () => {
    expect(chain(reg, 'nether_wart')?.id).toBe(AWKWARD);
    const speed = chain(reg, 'nether_wart', 'sugar');
    expect(speed?.id).toBe('speed');
    expect(reg.durationSeconds(speed!)).toBe(180);
    expect(reg.displayName(speed!)).toBe('신속의 물약');
    expect(chain(reg, 'nether_wart', 'sugar', 'fermented_spider_eye')?.id).toBe('slowness');
  });

  it('물병에 아무 재료나 넣으면 안 된다 (나약함만 예외)', () => {
    expect(reg.brew(waterBottle(), 'sugar')).toBeNull();
    expect(reg.brew(waterBottle(), 'redstone')).toBeNull();
    expect(reg.brew(waterBottle(), 'fermented_spider_eye')?.id).toBe('weakness');
    // 어색한 물약에 레드스톤·발광석·발효 눈은 아무 일 없음
    const awk = chain(reg, 'nether_wart')!;
    expect(reg.brew(awk, 'redstone')).toBeNull();
    expect(reg.brew(awk, 'glowstone_dust')).toBeNull();
    expect(reg.brew(awk, 'fermented_spider_eye')).toBeNull();
    expect(reg.brew(awk, 'nether_wart')).toBeNull();
  });

  it('레드스톤은 시간 ×8/3, 발광석은 II 단계 + 시간 반, 둘은 서로 배타', () => {
    const speed = chain(reg, 'nether_wart', 'sugar')!;
    const long = reg.brew(speed, 'redstone')!;
    expect(long.extended).toBe(true);
    expect(reg.durationSeconds(long)).toBe(480);
    expect(reg.brew(long, 'redstone')).toBeNull();
    expect(reg.brew(long, 'glowstone_dust')).toBeNull();

    const strong = reg.brew(speed, 'glowstone_dust')!;
    expect(strong.amplified).toBe(true);
    expect(reg.level(strong)).toBe(2);
    expect(reg.durationSeconds(strong)).toBe(90);
    expect(reg.displayName(strong)).toBe('신속의 물약 II');
    expect(reg.brew(strong, 'redstone')).toBeNull();
  });

  it('canExtend / canAmplify 가 false 면 그 보조 재료는 안 먹힌다', () => {
    const healing = chain(reg, 'nether_wart', 'glistering_melon')!;
    expect(reg.brew(healing, 'redstone')).toBeNull();
    expect(reg.brew(healing, 'glowstone_dust')?.amplified).toBe(true);
    expect(reg.durationSeconds(healing)).toBe(0);
    const fire = chain(reg, 'nether_wart', 'magma_cream')!;
    expect(reg.brew(fire, 'glowstone_dust')).toBeNull();
    expect(reg.brew(fire, 'redstone')?.extended).toBe(true);
  });

  it('화약은 마시는 것 → 투척용, 드래곤의 숨결은 투척용 → 잔류형(시간 1/4)', () => {
    const speed = chain(reg, 'nether_wart', 'sugar')!;
    expect(reg.brew(speed, 'dragon_breath')).toBeNull();
    const splash = reg.brew(speed, 'gunpowder')!;
    expect(splash.form).toBe('splash');
    expect(reg.brew(splash, 'gunpowder')).toBeNull();
    expect(reg.displayName(splash)).toBe('신속의 물약 (투척용)');
    const linger = reg.brew(splash, 'dragon_breath')!;
    expect(linger.form).toBe('lingering');
    expect(reg.durationSeconds(linger)).toBe(45);
    expect(reg.brew(linger, 'dragon_breath')).toBeNull();
    // 물병·어색한 물약도 던지는 병이 될 수 있고, 그 뒤에도 양조가 이어진다
    const splashWater = reg.brew(waterBottle(), 'gunpowder')!;
    expect(splashWater.form).toBe('splash');
    expect(reg.brew(splashWater, 'nether_wart')?.id).toBe(AWKWARD);
    expect(reg.displayName(splashWater)).toBe('물병 (투척용)');
  });

  it('뒤집을 때 늘리기·세게 표시는 새 물약이 받을 수 있을 때만 남는다', () => {
    const speed = chain(reg, 'nether_wart', 'sugar')!;
    const longSpeed = reg.brew(speed, 'redstone')!;
    const longSlow = reg.brew(longSpeed, 'fermented_spider_eye')!;
    expect(longSlow).toEqual({ id: 'slowness', extended: true, amplified: false, form: 'drink' });
    expect(reg.durationSeconds(longSlow)).toBe(240);

    const healing = chain(reg, 'nether_wart', 'glistering_melon')!;
    const harming = reg.brew(healing, 'fermented_spider_eye')!;
    expect(harming.id).toBe('harming');
    expect(reg.brew(harming, 'fermented_spider_eye')).toBeNull();
  });

  it('모르는 재료·모르는 상태는 null', () => {
    expect(reg.brew(waterBottle(), 'diamond')).toBeNull();
    expect(reg.brew({ id: 'ghost', extended: false, amplified: false, form: 'drink' }, 'redstone')).toBeNull();
  });

  it('실제 데이터: 가이드의 조합 몇 개', () => {
    const r = POTIONS;
    expect(chain(r, 'nether_wart', 'rabbit_foot', 'fermented_spider_eye')?.id).toBe('slowness');
    expect(chain(r, 'nether_wart', 'spider_eye', 'fermented_spider_eye')?.id).toBe('harming');
    expect(chain(r, 'nether_wart', 'golden_carrot', 'fermented_spider_eye')?.id).toBe('invisibility');
    expect(chain(r, 'nether_wart', 'stone')?.id).toBe('infested');
    expect(chain(r, 'nether_wart', 'glistering_melon', 'gunpowder', 'dragon_breath')?.form).toBe('lingering');
    expect(r.displayName(chain(r, 'nether_wart', 'ghast_tear', 'glowstone_dust')!)).toBe('재생의 물약 II');
  });
});

describe('물약 아이템 id (M4 가방)', () => {
  it('상태 ↔ id 라운드트립', () => {
    const cases: [PotionState, string][] = [
      [waterBottle(), 'water_bottle'],
      [{ id: WATER_BOTTLE, extended: false, amplified: false, form: 'splash' }, 'splash_potion.water'],
      [{ id: AWKWARD, extended: false, amplified: false, form: 'drink' }, 'potion.awkward'],
      [{ id: 'speed', extended: false, amplified: false, form: 'drink' }, 'potion.speed'],
      [{ id: 'speed', extended: true, amplified: false, form: 'drink' }, 'potion.speed.long'],
      [{ id: 'speed', extended: false, amplified: true, form: 'splash' }, 'splash_potion.speed.strong'],
      [{ id: 'healing', extended: false, amplified: false, form: 'lingering' }, 'lingering_potion.healing'],
    ];
    for (const [state, id] of cases) {
      expect(potionItemId(state)).toBe(id);
      expect(potionFromItemId(id)).toEqual(state);
    }
    expect(isPotionItem('dirt')).toBe(false);
    expect(potionFromItemId('potion.speed.huge')).toBeNull();
    expect(potionFromItemId('juice.speed')).toBeNull();
  });
});

describe('물약 효과 (#245)', () => {
  const st = (id: string, extra: Partial<PotionState> = {}): PotionState => ({ id, extended: false, amplified: false, form: 'drink', ...extra });

  it('실제 data/potions.json: 모든 물약의 effect 가 effects 표에 있고 숫자가 채워진다', () => {
    for (const d of POTIONS.defs) expect(POTIONS.effects.has(d.effect), d.id).toBe(true);
    expect(POTIONS.effectOf('speed')).toMatchObject({ name: '신속', speedTimes: 1.2, jumpTimes: 1, attackPlus: 0 });
    expect(POTIONS.effectOf('instant_health').heals).toBe(4);
    expect(POTIONS.effectOf('없는것')).toMatchObject({ id: '없는것', name: '없는것', speedTimes: 1, heals: 0 });
  });

  it('effects 표가 있는데 물약이 모르는 효과를 가리키면 한국어로 알려준다', () => {
    expect(() => parsePotions({ ...small, effects: { speed: { name: '신속' } } })).toThrow(/effect 'slowness'.*effects 표에 없어요/);
  });

  it('마시면: 즉시(치유 I 4, II 8)·지속(신속 180초, 레드스톤 480초, 발광석 II 90초)', () => {
    expect(potionOutcome(POTIONS, st('healing'))).toEqual({ heals: 4, hurts: 0, effect: null, harmful: false });
    expect(potionOutcome(POTIONS, st('healing', { amplified: true })).heals).toBe(8);
    expect(potionOutcome(POTIONS, st('harming'))).toMatchObject({ hurts: 6, harmful: true });
    expect(potionOutcome(POTIONS, st('speed'))).toEqual({ heals: 0, hurts: 0, effect: { id: 'speed', level: 1, seconds: 180 }, harmful: false });
    expect(potionOutcome(POTIONS, st('speed', { extended: true })).effect?.seconds).toBe(480);
    expect(potionOutcome(POTIONS, st('speed', { amplified: true })).effect).toEqual({ id: 'speed', level: 2, seconds: 90 });
    expect(potionOutcome(POTIONS, waterBottle())).toEqual({ heals: 0, hurts: 0, effect: null, harmful: false });
    expect(potionOutcome(POTIONS, st(AWKWARD)).effect).toBeNull();
  });

  it('나쁜 물약은 독·고통·감속·나약함 — 거북 장군은 느려도 피해를 막아 주니 좋은 쪽', () => {
    const bad = ['poison', 'harming', 'slowness', 'weakness'];
    for (const d of POTIONS.defs) expect(isHarmfulEffect(POTIONS.effectOf(d.effect)), d.id).toBe(bad.includes(d.id));
  });

  it('붙이기: 높은 단계가 이기고, 같은 단계는 긴 쪽, 지난 건 떨어진다', () => {
    let list = addEffect([], 'speed', 1, 1000, 0);
    expect(list).toEqual([{ id: 'speed', level: 1, until: 1000 }]);
    list = addEffect(list, 'speed', 1, 500, 0);
    expect(list[0]!.until).toBe(1000); // 짧은 건 안 덮는다
    list = addEffect(list, 'speed', 2, 400, 0);
    expect(list[0]).toEqual({ id: 'speed', level: 2, until: 400 }); // II 가 이긴다 (시간이 짧아도)
    list = addEffect(list, 'speed', 1, 5000, 0);
    expect(list[0]!.level).toBe(2); // I 로는 II 를 못 덮는다
    list = addEffect(list, 'jump_boost', 1, 3000, 0);
    expect(list.length).toBe(2);
    expect(pruneEffects(list, 450)).toEqual([{ id: 'jump_boost', level: 1, until: 3000 }]);
    expect(hasEffect(list, 'speed', 399)).toBe(true);
    expect(hasEffect(list, 'speed', 400)).toBe(false);
    expect(addEffect(list, 'speed', 1, 900, 450)).toEqual([{ id: 'jump_boost', level: 1, until: 3000 }, { id: 'speed', level: 1, until: 900 }]); // 지난 II 자리엔 새로
  });

  it('배율: 신속 1.2 / II 1.4, 감속 0.85, 도약 1.25, 힘 +3 / II +6, 나약함 -4, 거북 장군 0.4·피해 0.4 — 여럿이면 곱·합', () => {
    const now = 0;
    const one = (id: string, level = 1) => [{ id, level, until: 1 }];
    expect(speedMultiplier(one('speed'), POTIONS, now)).toBeCloseTo(1.2);
    expect(speedMultiplier(one('speed', 2), POTIONS, now)).toBeCloseTo(1.4);
    expect(speedMultiplier(one('slowness'), POTIONS, now)).toBeCloseTo(0.85);
    expect(speedMultiplier([...one('speed'), ...one('slowness')], POTIONS, now)).toBeCloseTo(1.02);
    expect(speedMultiplier(one('turtle_master', 2), POTIONS, now)).toBeCloseTo(0.1); // 0.1 아래로는 안 간다
    expect(jumpMultiplier(one('jump_boost'), POTIONS, now)).toBeCloseTo(1.25);
    expect(attackBonus(one('strength'), POTIONS, now)).toBe(3);
    expect(attackBonus(one('strength', 2), POTIONS, now)).toBe(6);
    expect(attackBonus(one('weakness'), POTIONS, now)).toBe(-4);
    expect(damageMultiplier(one('turtle_master'), POTIONS, now)).toBeCloseTo(0.4);
    expect(damageMultiplier(one('speed'), POTIONS, now)).toBe(1);
    expect(speedMultiplier(one('speed'), POTIONS, 5)).toBe(1); // 지난 건 없는 셈
  });
});

describe('잔류형 구름 (#246)', () => {
  it('반지름은 30초에 1칸 줄고, 즉시 효과는 반(치유 4 → 2, 고통 6 → 3), 지속 효과는 병에 적힌 대로(1/4)', () => {
    expect(lingerRadius(LINGER_RADIUS, 0)).toBe(3);
    expect(lingerRadius(LINGER_RADIUS, LINGER_SECONDS * 1000)).toBe(2);
    expect(lingerRadius(2, 15_000)).toBe(1.5);
    const heal = lingerOutcome(potionOutcome(POTIONS, potionFromItemId('lingering_potion.healing')!));
    expect(heal).toMatchObject({ heals: 2, hurts: 0, harmful: false });
    const harm = lingerOutcome(potionOutcome(POTIONS, potionFromItemId('lingering_potion.harming')!));
    expect(harm).toMatchObject({ heals: 0, hurts: 3, harmful: true });
    const slow = lingerOutcome(potionOutcome(POTIONS, potionFromItemId('lingering_potion.slowness')!));
    expect(slow.effect).toEqual({ id: 'slowness', level: 1, seconds: 23 }); // 1분 30초의 1/4 (초로 반올림)
    expect(slow.harmful).toBe(true);
  });
});
