import { describe, expect, it } from 'vitest';
import { DRAGONS } from './data';
import { BEAM_RANGE, STAMINA_REGEN_PER_SEC, beamOf, lookDirOf, staminaAt, staminaMaxFor, tryFire } from './beam';

describe('드래곤 빔·기력 (M6-5)', () => {
  it('드래곤마다 색·세기가 다르고, 빔이 없는 드래곤도 회색 빔은 쏜다', () => {
    const wood = beamOf(DRAGONS.require('wood'));
    expect(wood).toEqual({ color: '#4CAF50', power: 1, stamina: 25, cooldownSec: 6 });
    const powers = DRAGONS.list.map((d) => beamOf(d).power);
    expect(Math.min(...powers)).toBeGreaterThanOrEqual(1);
    expect(Math.max(...powers)).toBeLessThanOrEqual(5);
    expect(new Set(powers).size).toBeGreaterThan(1); // 세기가 다 같지 않다
    for (const d of DRAGONS.list) expect(beamOf(d).color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(BEAM_RANGE).toBe(24);
  });

  it('기력은 초당 5 회복하고 최대치를 넘지 않는다. 어른은 150', () => {
    expect(staminaMaxFor('adult')).toBe(150);
    expect(staminaMaxFor('baby')).toBe(100);
    expect(staminaAt({ value: 10, at: 0 }, 150, 4000)).toBe(10 + 4 * STAMINA_REGEN_PER_SEC);
    expect(staminaAt({ value: 149, at: 0 }, 150, 60_000)).toBe(150);
    expect(staminaAt({ value: 50, at: 5000 }, 150, 4000)).toBe(50); // 시계가 뒤로 가도 깎지 않는다
  });

  it('쏘면 기력이 빠지고 쿨타임 동안은 못 쏜다. 기력이 모자라면 못 쏜다', () => {
    const beam = { color: '#fff', power: 3, stamina: 40, cooldownSec: 6 };
    const r1 = tryFire({ value: 150, at: 0 }, 150, 0, beam, 1000);
    expect(r1).toMatchObject({ ok: true, stamina: { value: 110, at: 1000 }, readyAt: 7000 });
    if (!r1.ok) throw new Error();
    expect(tryFire(r1.stamina, 150, r1.readyAt, beam, 3000)).toMatchObject({ ok: false, reason: 'COOLDOWN' });
    const r2 = tryFire(r1.stamina, 150, r1.readyAt, beam, 7000);
    expect(r2).toMatchObject({ ok: true, stamina: { value: 110 + 30 - 40 } }); // 6초 동안 30 회복
    expect(tryFire({ value: 10, at: 0 }, 150, 0, beam, 0)).toMatchObject({ ok: false, reason: 'NO_STAMINA', stamina: 10 });
  });

  it('시선 방향: yaw 0 은 -z, 위를 보면 y 가 +', () => {
    expect(lookDirOf(0, 0)).toEqual({ x: -0, y: 0, z: -1 });
    const up = lookDirOf(0, Math.PI / 4);
    expect(up.y).toBeCloseTo(Math.SQRT1_2);
    expect(up.z).toBeCloseTo(-Math.SQRT1_2);
    const left = lookDirOf(Math.PI / 2, 0);
    expect(left.x).toBeCloseTo(-1);
  });
});
