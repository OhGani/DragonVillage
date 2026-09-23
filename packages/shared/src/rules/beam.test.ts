import { describe, expect, it } from 'vitest';
import { DRAGONS } from './data';
import { BEAM_RANGE, STAMINA_REGEN_PER_SEC, beamOf, lookDirOf, staminaAt, staminaMaxFor, tryFire } from './beam';

describe('드래곤 빔·기력 (M6-5)', () => {
  it('드래곤마다 색·세기가 다르고, 빔이 없는 드래곤도 회색 빔은 쏜다', () => {
    const wood = beamOf(DRAGONS.require('wood'));
    expect(wood).toEqual({ color: '#4CAF50', power: 1, stamina: 25, cooldownSec: 1.5 }); // 쿨타임은 빔이 사라지는 1.5초 — 제한은 기력 (#90)
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

  it('연달아 6발 쏘면 기력이 바닥나고, 5초 쉬면 한 발 더 (#90)', () => {
    const beam = beamOf(DRAGONS.require('wood'));
    let st = { value: 150, at: 0 };
    let ready = 0;
    let t = 0;
    for (let i = 0; i < 6; i++) {
      const r = tryFire(st, 150, ready, beam, t);
      expect(r.ok, `${i + 1}발`).toBe(true);
      if (!r.ok) throw new Error();
      st = r.stamina;
      ready = r.readyAt;
      t += 1500; // 쿨타임(1.5초)만 기다리며 연발
    }
    // 6발 뒤: 150 − 6×25 + 사이사이 회복(7.5초 × 5 = 37.5) ≈ 37.5 → 한 발은 되고 두 발은 안 된다
    const left = staminaAt(st, 150, t);
    expect(left).toBeLessThan(beam.stamina * 2); // 두 발은 못 쏜다
    const r7 = tryFire(st, 150, ready, beam, t);
    if (!r7.ok) {
      expect(r7.reason).toBe('NO_STAMINA');
      expect(tryFire(st, 150, ready, beam, t + 5000).ok).toBe(true); // 5초면 25 찬다
    }
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
