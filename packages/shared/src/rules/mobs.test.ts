import { describe, expect, it } from 'vitest';
import { MOBS } from './data';
import { MOB_MAX, MOB_STATE, type MobState, beamHitsMob, explosionDamage, hitDamage, pickSpawn, rollDrops, stepMob } from './mobs';

const flat = () => 41; // 어디나 발 높이 41

function mob(kind: 'zombie' | 'creeper', x: number, z: number): MobState {
  return { id: 1, kind, x, y: 41, z, yaw: 0, hp: MOBS.get(kind).hp, state: 0, fuseAt: 0, lastAttackAt: 0 };
}

describe('원정 밤의 몹 (M7-2)', () => {
  it('mobs.json 에서 이름·드롭·경험치를 읽고 나머지는 기본값', () => {
    const z = MOBS.get('zombie');
    expect(z.name).toBe('좀비');
    expect(z.hp).toBe(20);
    expect(z.damage).toBe(3);
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
