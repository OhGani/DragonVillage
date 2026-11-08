import { describe, expect, it } from 'vitest';
import bossesJson from '../../../../data/bosses.json';
import { MOBS } from './data';
import { BOSS_KIND, MOB_MAX, MOB_STATE, type MobKind, type MobState, beamHitsMob, explosionDamage, hitDamage, isBoss, isLookingAt, mobSize, pickKind, pickSpawn, rollDrops, spawnKinds, stepMob, bossMinionKind, bossMinionKinds, KING_KINDS, MOB_KINDS, MOB_KIND_OF, MOB_KIND_NUM, isZombieKind, zombieVillagerRoll, CURE_MS, bodyInWall, bodyR, clearSight, type SolidAt } from './mobs';

const flat = () => 41; // 어디나 발 높이 41

function mob(kind: MobKind, x: number, z: number): MobState {
  return { id: 1, kind, x, y: 41, z, yaw: 0, hp: MOBS.get(kind).hp, state: 0, fuseAt: 0, lastAttackAt: 0 };
}

describe('원정 밤의 몹 (M7-2)', () => {
  it('mobs.json 에서 이름·드롭·경험치·hp·피해·속도를 읽고 나머지는 기본값 (좀비는 #142 로 20·3·2.4 → #248 피해 4)', () => {
    const z = MOBS.get('zombie');
    expect(z.name).toBe('좀비');
    expect(z.hp).toBe(20);
    expect(z.damage).toBe(4);
    expect(z.xp).toBe(5);
    expect(z.drops.map((d) => d.item)).toContain('rotten_flesh');
    const c = MOBS.get('creeper');
    expect(c.fuseMs).toBe(1500);
    expect(c.drops[0]).toMatchObject({ item: 'gunpowder', min: 0, max: 2, chance: 1 });
    expect(MOB_MAX).toBe(8);
  });

  it('스폰 자리는 결정론이고 사람에서 12~24칸, 설 수 없는 곳은 건너뛴다', () => {
    const a = pickSpawn(7, 1, { x: 100, z: 100 }, flat)!;
    const b = pickSpawn(7, 1, { x: 100, z: 100 }, flat)!;
    expect(a).toEqual(b);
    const d = Math.hypot(a.x - 100, a.z - 100);
    expect(d).toBeGreaterThanOrEqual(11.3);
    expect(d).toBeLessThanOrEqual(24.8);
    expect(a.y).toBe(41);
    expect(pickSpawn(7, 2, { x: 100, z: 100 }, flat)).not.toEqual(a); // 다음 차례는 다른 자리
    expect(pickSpawn(7, 3, { x: 100, z: 100 }, () => null)).toBeNull();
  });

  it('좀비: 사람을 향해 걷고, 붙으면 1.8초마다 문다 (#187). 사람이 없으면 가만히', () => {
    const m = mob('zombie', 100, 100);
    const def = MOBS.get('zombie');
    expect(stepMob(m, def, null, 0.1, 1000, flat)).toBeNull();
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.5, 1000, flat)).toBeNull();
    expect(m.x).toBeCloseTo(100 + def.speed * 0.5);
    expect(m.state).toBe(MOB_STATE.walk);
    m.x = 109; // 1칸 앞
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 2000, flat)).toBe('attack');
    expect(m.state).toBe(MOB_STATE.attack);
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 3500, flat)).toBeNull(); // 아직 1.8초 안 (#187)
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 3900, flat)).toBe('attack');
    // 두 칸 턱은 못 오른다
    const wall = (x: number) => (x > 105 ? 43 : 41);
    const m2 = mob('zombie', 105, 100);
    stepMob(m2, def, { x: 110, y: 41, z: 100 }, 0.5, 1000, wall);
    expect(m2.x).toBe(105);
  });

  it('크리퍼: 3칸 안에 들어오면 1.5초 부풀다 터진다, 멀어지면 다시 식는다', () => {
    const m = mob('creeper', 100, 100);
    const def = MOBS.get('creeper');
    expect(stepMob(m, def, { x: 102, y: 41, z: 100 }, 0.1, 1000, flat)).toBeNull();
    expect(m.state).toBe(MOB_STATE.fuse);
    expect(stepMob(m, def, { x: 102, y: 41, z: 100 }, 0.1, 2400, flat)).toBeNull();
    expect(stepMob(m, def, { x: 102, y: 41, z: 100 }, 0.1, 2500, flat)).toBe('explode');
    const m2 = mob('creeper', 100, 100);
    stepMob(m2, def, { x: 102, y: 41, z: 100 }, 0.1, 1000, flat);
    stepMob(m2, def, { x: 110, y: 41, z: 100 }, 0.1, 1200, flat); // 도망갔다
    expect(m2.fuseAt).toBe(0);
    expect(m2.state).toBe(MOB_STATE.walk);
    // 폭발 피해는 가운데 7, 가장자리 0
    expect(explosionDamage(0, 3.5, 7)).toBe(7);
    expect(explosionDamage(1.75, 3.5, 7)).toBe(4);
    expect(explosionDamage(3.5, 3.5, 7)).toBe(0);
  });

  it('때리는 피해는 도구 등급을 따르고, 빔은 길 위의 몹만 맞추고, 드롭은 결정론', () => {
    expect(hitDamage(null)).toBe(1);
    expect(hitDamage(1)).toBe(2);
    expect(hitDamage(3)).toBe(5);
    const from = { x: 0, y: 1.6, z: 0 },
      dir = { x: 0, y: 0, z: -1 };
    expect(beamHitsMob(from, dir, 24, { x: 0.3, y: 0, z: -10 }, 1)).toBe(true);
    expect(beamHitsMob(from, dir, 24, { x: 3, y: 0, z: -10 }, 1)).toBe(false); // 옆으로 3칸
    expect(beamHitsMob(from, dir, 24, { x: 0, y: 0, z: -30 }, 1)).toBe(false); // 사거리 밖
    expect(beamHitsMob(from, dir, 24, { x: 0, y: 0, z: 5 }, 1)).toBe(false); // 뒤
    const d1 = rollDrops(MOBS.get('zombie'), 7, 3);
    expect(rollDrops(MOBS.get('zombie'), 7, 3)).toEqual(d1);
    for (const d of d1) expect(d.count).toBeGreaterThan(0);
  });
});

describe('거미와 원정지별 몹 (M7-3)', () => {
  it('거미: mobs.json 이름·드롭, 빠르고 낮고, 물면 3(#248) + 독 3초', () => {
    const s = MOBS.get('spider');
    expect(s.name).toBe('거미');
    expect(s.hp).toBe(16);
    expect(s.damage).toBe(3);
    expect(s.poisonMs).toBe(3000);
    expect(s.speed).toBeGreaterThan(MOBS.get('zombie').speed);
    expect(s.drops.map((d) => d.item)).toContain('string');
    expect(mobSize('spider')).toEqual({ w: 1.4, h: 0.9 });
    expect(mobSize(0)).toEqual({ w: 0.6, h: 1.9 });
    expect(MOBS.get('zombie').poisonMs).toBe(0);
    const m = mob('spider', 100, 100);
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 5000, flat)).toBe('attack');
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 5500, flat)).toBeNull();
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 6000, flat)).toBeNull(); // 아직 1.5초 안 (#187)
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 6600, flat)).toBe('attack'); // 1.5초마다
    // 낮은 몹은 빔 판정도 낮다
    expect(beamHitsMob({ x: 0, y: 1.6, z: 0 }, { x: 0, y: 0, z: -1 }, 24, { x: 0, y: 0, z: -10, kind: 'spider' }, 1)).toBe(false); // 가슴점 0.45 — 눈높이 선에서 1.15 떨어짐
    expect(beamHitsMob({ x: 0, y: 1.6, z: 0 }, { x: 0, y: -0.1, z: -1 }, 24, { x: 0, y: 0, z: -10, kind: 'spider' }, 1)).toBe(true); // 살짝 내려 쏘면 맞는다
  });

  it('원정지 nightMobs 에서 아는 몹만 고르고, 첫째가 셋에 둘', () => {
    expect(spawnKinds(['spider', 'zombie', 'skeleton'])).toEqual(['spider', 'zombie', 'skeleton']); // 스켈레톤은 M8-1 부터 진짜 몹
    expect(spawnKinds(['zombie', 'creeper', 'enderman'])).toEqual(['zombie', 'creeper', 'enderman']); // 엔더맨·허스크는 v1.1-1 부터 진짜 몹
    expect(spawnKinds(['husk', 'creeper', 'enderman'])).toEqual(['husk', 'creeper', 'enderman']);
    expect(spawnKinds(['stray', 'zombie'])).toEqual(['stray', 'zombie']); // 설원 (v1.1-2)
    expect(spawnKinds(['zombified_piglin', 'wither_skeleton', 'blaze', 'ghast'])).toEqual(['zombified_piglin', 'wither_skeleton', 'blaze', 'ghast']); // 네더 (v1.1-3)
    expect(spawnKinds(['witch'])).toEqual(['witch']); // 마녀는 늪 (2026-11-06) 부터 진짜 몹
    expect(spawnKinds(['illusioner'])).toEqual(['zombie', 'creeper']); // 아직 없는 몹만 적혀 있으면 기본
    expect(spawnKinds(undefined)).toEqual(['zombie', 'creeper']);
    const picks = Array.from({ length: 9 }, (_, i) => pickKind(['spider', 'zombie'], i + 1));
    expect(picks.filter((k) => k === 'spider').length).toBe(6);
    expect(picks.filter((k) => k === 'zombie').length).toBe(3);
    expect(pickKind(['zombie'], 3)).toBe('zombie');
    const three = Array.from({ length: 9 }, (_, i) => pickKind(['zombie', 'creeper', 'spider'], i + 1));
    expect(three.filter((k) => k === 'creeper').length + three.filter((k) => k === 'spider').length).toBe(3);
    expect(new Set(three).size).toBe(3);
  });

  it('거미 왕 (M7-4): bosses.json 에서 이름·hp 200·드롭(실 64·시계 5·TNT 64·라이터 1)·경험치 80. 밤 스폰 목록엔 안 든다', () => {
    const k = MOBS.get(BOSS_KIND);
    expect(isBoss(BOSS_KIND)).toBe(true);
    expect(k.name).toBe('거미 왕');
    expect(k.hp).toBe(200);
    expect(k.xp).toBe(80);
    expect(k.poisonMs).toBe(4000);
    expect(k.drops.map((d) => [d.item, d.min, d.max, d.chance])).toEqual([
      ['string', 64, 64, 1],
      ['clock', 5, 5, 1],
      ['tnt', 64, 64, 1],
      ['flint_and_steel', 1, 1, 1],
    ]);
    expect(rollDrops(k, 1, 1).map((d) => `${d.item}×${d.count}`)).toEqual(['string×64', 'clock×5', 'tnt×64', 'flint_and_steel×1']);
    expect(mobSize(BOSS_KIND).w).toBeGreaterThan(2);
    expect(spawnKinds(['spider', 'spider_king', 'zombie'])).toEqual(['spider', 'zombie']);
  });

  it('우민 (M7-5): 변명자·약탈자·소환사(보스, 변명자를 부른다). 드롭은 bosses.json evoker 에서', () => {
    expect(isBoss('evoker')).toBe(true);
    expect(isBoss('vindicator')).toBe(false);
    expect(bossMinionKind('evoker')).toBe('vindicator');
    expect(bossMinionKind('spider_king')).toBe('spider');
    expect(bossMinionKind('ender_dragon')).toBe('enderman'); // v1.1-4 (#162)
    const e = MOBS.get('evoker');
    expect(e.name).toBe('소환사');
    expect(e.hp).toBe(150);
    expect(e.xp).toBe(100);
    expect(e.drops.map((d) => d.item)).toEqual(['totem_of_undying']);
    expect(MOBS.get('pillager').reach).toBe(6);
    expect(MOBS.get('pillager').drops.map((d) => [d.item, d.chance])).toEqual([['crossbow', 0.3]]);
    expect(MOBS.get('vindicator').drops[0]?.item).toBe('iron_axe');
    expect(spawnKinds(['vindicator', 'zombie'])).toEqual(['vindicator', 'zombie']); // 우민도 원정지에 넣을 수는 있다
  });

  it('동물 5종 + 스켈레톤 (M8-1): mobs.json passive 에서 이름·먹이·길들이기·드롭. 밤 스폰 목록엔 안 든다', () => {
    const cow = MOBS.get('cow');
    expect(cow.name).toBe('소');
    expect(cow.passive).toBe(true);
    expect(cow.food).toEqual(['wheat']);
    expect(cow.drops.map((d) => d.item)).toEqual(['leather', 'beef']);
    expect(cow.xp).toBe(1);
    expect(MOBS.get('pig').food).toEqual(['carrot']);
    expect(MOBS.get('chicken').food).toEqual(['wheat_seeds', 'pumpkin_seeds', 'melon_seeds']);
    expect(MOBS.get('dog').tameWith).toEqual(['bone']);
    expect(MOBS.get('dog').name).toBe('강아지');
    expect(MOBS.get('skeleton').drops.map((d) => d.item)).toContain('bone');
    expect(MOBS.get('skeleton').reach).toBe(6);
    expect(MOBS.get('zombie').passive).toBe(false);
    // 아들 13차 "좀비·스켈레톤 더 무섭게"(2026-10-06): mobs.json 의 hp·damage·speed 가 코드 기본값을 덮는다
    expect(MOBS.get('zombie')).toMatchObject({ hp: 20, damage: 4, speed: 2.4 }); // 아빠 2026-10-07 "아직도 세다" (#142) → 2026-11-03 "조금만 더 강하게" 피해 +1 (#248)
    expect(MOBS.get('skeleton')).toMatchObject({ hp: 20, damage: 4, speed: 2.2 });
    expect(MOBS.get('vindicator').damage).toBe(5);
    expect(MOBS.get('creeper').damage).toBe(6); // 폭발 7 → 5 (#142) → 6 (#248)
    expect(spawnKinds(['spider', 'cow', 'skeleton'])).toEqual(['spider', 'skeleton']);
    expect(mobSize('chicken').h).toBeLessThan(1);
  });

  it('땅 찾기에 높이 힌트가 간다 (동굴처럼 층이 여럿일 때)', () => {
    const seen: (number | undefined)[] = [];
    const g = (_x: number, _z: number, nearY?: number) => {
      seen.push(nearY);
      return 41;
    };
    pickSpawn(1, 1, { x: 100, y: 33, z: 100 }, g);
    expect(seen[0]).toBe(33);
    const m = mob('zombie', 100, 100);
    m.y = 27;
    stepMob(m, MOBS.get('zombie'), { x: 110, y: 27, z: 100 }, 0.1, 1000, g);
    expect(seen.at(-1)).toBe(27);
  });
});

describe('좀비 주민 (#244)', () => {
  it('mobs.json 에서 좀비 주민을 읽는다(좀비와 같은 수치), 번호표는 빈틈 없이 맞고, 좀비·허스크·좀비 주민이 좀비류', () => {
    const zv = MOBS.get('zombie_villager');
    expect(zv.name).toBe('좀비 주민');
    expect(zv).toMatchObject({ hp: 20, damage: 4, xp: 5, passive: false }); // 좀비와 같이 4 (#248)
    expect(zv.drops.map((d) => d.item)).toContain('rotten_flesh');
    expect(mobSize('zombie_villager')).toEqual(mobSize('zombie'));
    MOB_KINDS.forEach((k, i) => {
      expect(MOB_KIND_NUM[k]).toBe(i);
      expect(MOB_KIND_OF[i]).toBe(k);
    });
    expect(isZombieKind('zombie') && isZombieKind('husk') && isZombieKind('zombie_villager')).toBe(true);
    expect(isZombieKind('creeper') || isZombieKind('villager') || isZombieKind('skeleton')).toBe(false);
    expect(spawnKinds(['zombie', 'zombie_villager'])).toEqual(['zombie', 'zombie_villager']); // 목록에 적으면 그대로도 나온다
    expect(MOB_STATE.cure).toBe(5);
    expect(CURE_MS).toBe(45_000);
  });

  it('밤 스폰 좀비·허스크 여덟에 하나쯤은 좀비 주민 — 시드·차례로 결정론', () => {
    let n = 0;
    for (let t = 1; t <= 400; t++) if (zombieVillagerRoll(5, t)) n++;
    expect(n).toBeGreaterThan(25);
    expect(n).toBeLessThan(80);
    expect(zombieVillagerRoll(5, 7)).toBe(zombieVillagerRoll(5, 7));
  });
});

describe('정글·깊은 어둠 몹 (#253·#254)', () => {
  it('고릴라·워든은 mobs.json 에서, 거대 고릴라·거대 워든은 bosses.json 에서 읽는다. 거대 고릴라는 고릴라를, 거대 워든은 워든을 부른다', () => {
    const g = MOBS.get('gorilla');
    expect(g.name).toBe('고릴라');
    expect(g).toMatchObject({ hp: 24, damage: 5, knock: true, passive: false, xp: 8 });
    expect(g.drops.map((d) => d.item)).toContain('raw_gorilla_meat');
    const w = MOBS.get('warden');
    expect(w.name).toBe('워든');
    expect(w).toMatchObject({ hp: 40, damage: 6, passive: false, xp: 15 });
    expect(w.drops.map((d) => d.item)).toContain('sculk');
    const gg = MOBS.get('giant_gorilla');
    expect(isBoss('giant_gorilla') && isBoss('giant_warden')).toBe(true);
    expect(gg.name).toBe('거대 고릴라');
    expect(gg.hp).toBe(400);
    expect(gg.xp).toBe(150);
    expect(gg.knock).toBe(true);
    expect(gg.drops.map((d) => `${d.item}×${d.max}`)).toEqual(expect.arrayContaining(['raw_gorilla_meat×10', 'diamond×64', 'netherite_ingot×64']));
    const gw = MOBS.get('giant_warden');
    expect(gw.name).toBe('거대 워든');
    expect(gw.hp).toBe(500);
    expect(gw.reach).toBe(10); // 음파 — 원거리
    expect(gw.drops.map((d) => `${d.item}×${d.max}`)).toEqual(expect.arrayContaining(['ice×64', 'netherite_sword×1']));
    expect(bossMinionKind('giant_gorilla')).toBe('gorilla');
    expect(bossMinionKind('giant_warden')).toBe('warden');
    expect(mobSize('gorilla').h).toBeGreaterThan(1.9); // 사람(1.8)보다 크다
    expect(mobSize('giant_gorilla').h).toBe(mobSize('gorilla').h * 2);
    expect(mobSize('warden').h).toBeGreaterThan(2.5); // 워든은 세 칸 가까이 (#254)
    expect(mobSize('giant_warden').h).toBe(mobSize('warden').h * 2);
    expect(spawnKinds(['skeleton', 'warden', 'zombie', 'giant_warden'])).toEqual(['skeleton', 'warden', 'zombie']); // 보스는 밤 스폰에 안 들어간다
  });
});

describe('쳐다보기 (#222 엔더맨)', () => {
  const me = { x: 0, z: 0, eyeY: 1.6, yaw: 0, pitch: 0 };
  it('yaw 0 은 -z 를 본다: 앞 10칸은 보고, 옆·뒤·너무 먼 건 안 본다', () => {
    expect(isLookingAt(me, { x: 0, y: 0, z: -10, kind: 'enderman' })).toBe(true);
    expect(isLookingAt(me, { x: 0, y: 0, z: 10, kind: 'enderman' })).toBe(false);
    expect(isLookingAt(me, { x: 10, y: 0, z: 0, kind: 'enderman' })).toBe(false);
    expect(isLookingAt(me, { x: 0, y: 0, z: -40, kind: 'enderman' })).toBe(false);
    expect(isLookingAt({ ...me, yaw: Math.PI }, { x: 0, y: 0, z: 10, kind: 'enderman' })).toBe(true);
    expect(isLookingAt({ ...me, yaw: Math.PI / 2 }, { x: -10, y: 0, z: 0, kind: 'enderman' })).toBe(true);
  });
  it('조금만 빗나가도 아니다 (8°)', () => {
    expect(isLookingAt(me, { x: 2, y: 0, z: -10, kind: 'enderman' })).toBe(false);
    expect(isLookingAt(me, { x: 0.3, y: 0, z: -10, kind: 'enderman' })).toBe(true);
  });
});

describe('네 왕의 부하 (아들 설계 + 아빠 그림 변종, 2026-11-06)', () => {
  it('왕마다 부르는 부하에 아들이 bosses.json 에 적은 부하(아직 없는 몹 빼고)가 다 들어 있고, 모두 이름·체력이 있는 몹이다', () => {
    const raw = bossesJson as unknown as { finalBosses: { id: string; kings?: { id: string; minions: string[] }[] }[] };
    const kings = raw.finalBosses.find((b) => b.id === 'four_kings')!.kings!;
    expect(kings.map((k) => k.id)).toEqual([...KING_KINDS]);
    for (const k of kings) {
      const mine = bossMinionKinds(k.id as MobKind);
      for (const m of k.minions) if ((MOB_KINDS as readonly string[]).includes(m)) expect(mine, `${k.id} → ${m}`).toContain(m);
      for (const m of mine) {
        expect(MOBS.get(m).name).not.toBe(m); // 한국어 이름
        expect(MOBS.get(m).hp).toBeGreaterThan(0);
      }
    }
    expect(bossMinionKinds('creeper_king')).toContain('charged_creeper');
    expect(bossMinionKinds('enderman_king')).toContain('endermite');
    expect(bossMinionKinds('skeleton_king')).toEqual(expect.arrayContaining(['stray', 'wither_skeleton', 'bogged', 'parched']));
    expect(bossMinionKinds('zombie_king')).toEqual(expect.arrayContaining(['husk', 'zombie_villager', 'baby_zombie', 'drowned', 'frostbite']));
    expect(MOBS.get('charged_creeper').explodeRadius).toBeGreaterThan(MOBS.get('creeper').explodeRadius);
    expect(MOBS.get('bogged').poisonMs).toBeGreaterThan(0); // 독 화살
    expect(mobSize('baby_zombie').h).toBeLessThan(mobSize('zombie').h);
    for (const z of ['baby_zombie', 'drowned', 'frostbite'] as const) expect(isZombieKind(z)).toBe(true);
  });
});

describe('벽 (아빠 2026-11-07 "건물 안 몹이 공격함 · 벽 밖으로 얼굴이 나옴")', () => {
  // x = 105 칸에 높이 41~43 벽이 남북으로 길게 서 있다. 바닥은 어디나 41
  const wall: SolidAt = (x, y, z) => y < 41 || (x === 105 && y >= 41 && y <= 43 && z > 80 && z < 120);
  // 벽 칸 위에는 설 수 없다(groundAt 이 null) — 서버 groundAt 과 같은 규칙
  const ground: (x: number, z: number) => number | null = (x) => (Math.floor(x) === 105 ? null : 41);

  it('벽 너머 사람은 붙어 있어도 못 때린다 (안 막혔으면 때린다)', () => {
    const def = MOBS.get('zombie');
    const m = mob('zombie', 104.7, 100);
    const target = { x: 106.25, y: 41, z: 100 }; // 1.55칸 — 손이 닿는 거리지만 벽 너머
    for (let t = 0; t < 20; t++) expect(stepMob(m, def, target, 0.1, 10_000 + t * 100, ground, wall)).toBeNull();
    const open = mob('zombie', 104.7, 130); // 벽이 없는 곳
    expect(stepMob(open, def, { x: 106.25, y: 41, z: 130 }, 0.1, 10_000, flat, wall)).toBe('attack');
  });

  it('스켈레톤도 벽 너머로는 안 쏜다, 크리퍼도 심지를 안 켠다', () => {
    const sk = mob('skeleton', 100, 100);
    expect(stepMob(sk, MOBS.get('skeleton'), { x: 110, y: 41, z: 100 }, 0.1, 10_000, ground, wall)).toBeNull();
    const cr = mob('creeper', 104.5, 100);
    stepMob(cr, MOBS.get('creeper'), { x: 106.5, y: 41, z: 100 }, 0.1, 10_000, ground, wall);
    expect(cr.fuseAt).toBe(0);
  });

  it('벽 쪽으로 걸어가도 몸 모서리가 벽 앞에서 멈춘다 — 몸이 넓은 거미도', () => {
    for (const kind of ['zombie', 'spider', 'gorilla'] as const) {
      const def = { ...MOBS.get(kind), reach: 0, fuseMs: 0 };
      const m = mob(kind, 100.5, 100.5);
      for (let t = 0; t < 100; t++) stepMob(m, def, { x: 110, y: 41, z: 100.5 }, 0.1, 10_000 + t * 100, ground, wall);
      expect(m.x + bodyR(kind)).toBeLessThanOrEqual(105);
      expect(m.x + bodyR(kind)).toBeGreaterThan(104.5); // 벽 앞까지는 온다
      expect(bodyInWall(wall, m.x, m.z, m.y, bodyR(kind))).toBe(false);
    }
  });

  it('거대 고릴라 (아빠 2026-11-08 "아직도 벽 밖으로 보임"): 그림 크기(긴 쪽 반 2.8)만큼 벽 앞에서 멈추고, 몸 가운데 앞의 기둥 하나에도 막힌다', () => {
    expect(bodyR('giant_gorilla')).toBeGreaterThanOrEqual(2.8);
    const def = { ...MOBS.get('giant_gorilla'), reach: 0 };
    const m = mob('giant_gorilla', 96.5, 100.5);
    for (let t = 0; t < 100; t++) stepMob(m, def, { x: 110, y: 41, z: 100.5 }, 0.1, 10_000 + t * 100, ground, wall);
    expect(m.x + 2.8).toBeLessThanOrEqual(105); // 그림 앞끝이 벽 안쪽 면을 안 넘는다
    expect(m.x + 2.8).toBeGreaterThan(104); // 벽 앞까지는 온다
    // 기둥 한 칸 (x 105, z 100): 네 모서리(z 97·103)는 비어 있지만 몸 한가운데 앞이라 막힌다
    const pillar: SolidAt = (x, y, z) => y < 41 || (x === 105 && z === 100 && y >= 41 && y <= 43);
    const g = mob('giant_gorilla', 96.5, 100.5);
    for (let t = 0; t < 100; t++) stepMob(g, def, { x: 110, y: 41, z: 100.5 }, 0.1, 10_000 + t * 100, (x) => (Math.floor(x) === 105 ? null : 41), pillar);
    expect(g.x + 2.8).toBeLessThanOrEqual(105);
  });

  it('벽에 막히면 벽을 따라 미끄러진다', () => {
    const def = { ...MOBS.get('zombie'), reach: 0 };
    const m = mob('zombie', 104.5, 100);
    for (let t = 0; t < 30; t++) stepMob(m, def, { x: 110, y: 41, z: 125 }, 0.1, 10_000 + t * 100, ground, wall);
    expect(m.z).toBeGreaterThan(105); // 비스듬히 막혀도 z 쪽으로는 간다
  });

  it('한 칸 턱은 그대로 올라선다 (벽 검사는 발보다 한 칸 위만)', () => {
    const step: SolidAt = (x, y) => y < 41 || (x >= 103 && y === 41);
    const stepGround = (x: number) => (Math.floor(x) >= 103 ? 42 : 41);
    const m = mob('zombie', 101.5, 100.5);
    const def = { ...MOBS.get('zombie'), reach: 0 };
    for (let t = 0; t < 40; t++) stepMob(m, def, { x: 106, y: 42, z: 100.5 }, 0.1, 10_000 + t * 100, stepGround, step);
    expect(m.y).toBe(42);
    expect(m.x).toBeGreaterThan(104);
  });

  it('clearSight: 벽이 끼면 false, 트인 곳은 true', () => {
    expect(clearSight(wall, 104.5, 42.5, 100, 106.5, 42.5, 100)).toBe(false);
    expect(clearSight(wall, 104.5, 42.5, 130, 106.5, 42.5, 130)).toBe(true);
    expect(clearSight(wall, 100, 42.5, 100, 104.5, 42.5, 100)).toBe(true);
  });
});
