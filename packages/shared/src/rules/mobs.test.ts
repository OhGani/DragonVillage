import { describe, expect, it } from 'vitest';
import { MOBS } from './data';
import { BOSS_KIND, MOB_MAX, MOB_STATE, type MobKind, type MobState, beamHitsMob, explosionDamage, hitDamage, isBoss, mobSize, pickKind, pickSpawn, rollDrops, spawnKinds, stepMob, bossMinionKind } from './mobs';

const flat = () => 41; // 어디나 발 높이 41

function mob(kind: MobKind, x: number, z: number): MobState {
  return { id: 1, kind, x, y: 41, z, yaw: 0, hp: MOBS.get(kind).hp, state: 0, fuseAt: 0, lastAttackAt: 0 };
}

describe('원정 밤의 몹 (M7-2)', () => {
  it('mobs.json 에서 이름·드롭·경험치·hp·피해·속도를 읽고 나머지는 기본값 (좀비는 아들 13차 #123 로 24·4)', () => {
    const z = MOBS.get('zombie');
    expect(z.name).toBe('좀비');
    expect(z.hp).toBe(24);
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

  it('좀비: 사람을 향해 걷고, 붙으면 1.2초마다 문다. 사람이 없으면 가만히', () => {
    const m = mob('zombie', 100, 100);
    const def = MOBS.get('zombie');
    expect(stepMob(m, def, null, 0.1, 1000, flat)).toBeNull();
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.5, 1000, flat)).toBeNull();
    expect(m.x).toBeCloseTo(100 + def.speed * 0.5);
    expect(m.state).toBe(MOB_STATE.walk);
    m.x = 109; // 1칸 앞
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 2000, flat)).toBe('attack');
    expect(m.state).toBe(MOB_STATE.attack);
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 2500, flat)).toBeNull(); // 아직 1.2초 안
    expect(stepMob(m, def, { x: 110, y: 41, z: 100 }, 0.1, 3300, flat)).toBe('attack');
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
  it('거미: mobs.json 이름·드롭, 빠르고 낮고, 물면 2 + 독 3초', () => {
    const s = MOBS.get('spider');
    expect(s.name).toBe('거미');
    expect(s.hp).toBe(16);
    expect(s.damage).toBe(2);
    expect(s.poisonMs).toBe(3000);
    expect(s.speed).toBeGreaterThan(MOBS.get('zombie').speed);
    expect(s.drops.map((d) => d.item)).toContain('string');
    expect(mobSize('spider')).toEqual({ w: 1.4, h: 0.9 });
    expect(mobSize(0)).toEqual({ w: 0.6, h: 1.9 });
    expect(MOBS.get('zombie').poisonMs).toBe(0);
    const m = mob('spider', 100, 100);
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 5000, flat)).toBe('attack');
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 5500, flat)).toBeNull();
    expect(stepMob(m, s, { x: 101.5, y: 41, z: 100 }, 0.1, 6000, flat)).toBe('attack'); // 1초마다
    // 낮은 몹은 빔 판정도 낮다
    expect(beamHitsMob({ x: 0, y: 1.6, z: 0 }, { x: 0, y: 0, z: -1 }, 24, { x: 0, y: 0, z: -10, kind: 'spider' }, 1)).toBe(false); // 가슴점 0.45 — 눈높이 선에서 1.15 떨어짐
    expect(beamHitsMob({ x: 0, y: 1.6, z: 0 }, { x: 0, y: -0.1, z: -1 }, 24, { x: 0, y: 0, z: -10, kind: 'spider' }, 1)).toBe(true); // 살짝 내려 쏘면 맞는다
  });

  it('원정지 nightMobs 에서 아는 몹만 고르고, 첫째가 셋에 둘', () => {
    expect(spawnKinds(['spider', 'zombie', 'skeleton'])).toEqual(['spider', 'zombie', 'skeleton']); // 스켈레톤은 M8-1 부터 진짜 몹
    expect(spawnKinds(['zombie', 'creeper', 'enderman'])).toEqual(['zombie', 'creeper']);
    expect(spawnKinds(['enderman'])).toEqual(['zombie', 'creeper']);
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
    expect(MOBS.get('zombie')).toMatchObject({ hp: 24, damage: 4, speed: 2.7 });
    expect(MOBS.get('skeleton')).toMatchObject({ hp: 20, damage: 4, speed: 2.5 });
    expect(MOBS.get('creeper').damage).toBe(7);
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
