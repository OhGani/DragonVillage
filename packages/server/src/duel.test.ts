import { ANIMAL_ID_BASE, DEFAULT_VILLAGE_SEED, DUEL_COOLDOWN_MS, DUEL_LOSE_HP, DUEL_PRIZE, FLAG_GROUND, VILLAGE_GEN_VERSION, countOf, give } from '@dragon-village/shared';
import { BLOCKS, TRADES } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 98_000_000;
const inbox = () => {
  const json: { t: string; [k: string]: unknown }[] = [];
  return { json, send: (d: Uint8Array | string) => (typeof d === 'string' ? json.push(JSON.parse(d)) : 0) };
};

function setup() {
  const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
  const a = inbox(),
    b = inbox();
  const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
  const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
  const p = room.players.get(ra.idx)!;
  const villagers = [...room.animals.animals.values()].filter((v) => v.kind === 'villager' && v.name === null);
  expect(villagers.length).toBeGreaterThan(1);
  /** 플레이어를 주민 바로 옆(1칸)에 세운다 */
  const standBy = (idx: number, v: { x: number; y: number; z: number }, now: number, dx = 1) => room.onMove(idx, { x: v.x + dx, y: v.y, z: v.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, now);
  return { room, a, b, ra, rb, p, villagers, standBy };
}

describe('주민과 결투 (2026-11-19)', () => {
  it('결투 전엔 못 때리고(철 골렘), ⚔️ 로 시작하면 때릴 수 있다. 체력을 0으로 만들면 이기고 에메랄드·경험치, 주민은 멀쩡, 1분 쉰다', () => {
    const { room, a, ra, rb, p, villagers, standBy } = setup();
    const v = villagers[0]!;
    const id = ANIMAL_ID_BASE + v.id;
    v.duelReadyAt = 0;
    standBy(ra.idx, v, T0);
    give(p.inv, 'iron_sword', 1);
    const sword = p.inv.findIndex((s) => s?.item === 'iron_sword');
    expect(room.hitMob(ra.idx, id, sword, T0)).toBe('VILLAGER'); // 결투 전: 철 골렘 (#221)
    expect(room.startDuel(ra.idx, id, T0 + 100)).toBeNull();
    expect(a.json.find((m) => m.t === 'duel')).toEqual({ t: 'duel', id, on: true });
    const job = TRADES.jobFor(id, v.name)!;
    expect(job.duelWeapon).toBeTruthy();
    expect(a.json.find((m) => m.t === 'mob' && m.ev === 'arm')).toMatchObject({ id, item: job.duelWeapon }); // 직업 무기를 꺼내 든다 (모두에게)
    standBy(rb.idx, v, T0 + 100, -1);
    expect(room.startDuel(rb.idx, id, T0 + 100)).toBe('DUEL_BUSY'); // 다른 사람은 끼어들 수 없다
    const emeralds = countOf(p.inv, DUEL_PRIZE.item);
    let t = T0 + 200;
    for (let i = 0; i < 20 && v.duel; i++) {
      v.x = p.pos.x - 1; // 주민이 쫓아오며 움직여도 옆에
      v.z = p.pos.z;
      expect(room.hitMob(ra.idx, id, sword, (t += 700))).toBeNull();
    }
    expect(v.duel).toBeNull();
    expect(a.json.filter((m) => m.t === 'duel').at(-1)).toMatchObject({ on: false, result: 'win' });
    expect(a.json.filter((m) => m.t === 'mob' && m.ev === 'arm').at(-1)).toMatchObject({ id }); // 끝나면 넣는다
    expect(a.json.filter((m) => m.t === 'mob' && m.ev === 'arm').at(-1)!.item).toBeUndefined();
    expect(countOf(p.inv, DUEL_PRIZE.item)).toBe(emeralds + DUEL_PRIZE.count);
    expect(v.hp).toBe(20); // 주민은 다치지 않는다
    expect(room.animals.animals.has(v.id)).toBe(true);
    expect(room.startDuel(ra.idx, id, t + 1000)).toBe('DUEL_TIRED');
    expect(room.startDuel(ra.idx, id, t + DUEL_COOLDOWN_MS + 1)).toBeNull();
  });

  it('주민에게 맞아 하트 2칸 아래가 될 한 대면 진다 — 그 한 대는 안 맞는다. 멀리 가면 무승부', () => {
    const { room, a, ra, p, villagers, standBy } = setup();
    const v = villagers[1]!;
    const id = ANIMAL_ID_BASE + v.id;
    standBy(ra.idx, v, T0);
    expect(room.startDuel(ra.idx, id, T0)).toBeNull();
    // 어느 직업 무기든(1~3) 다음 한 대면 4 아래 → 진다
    p.hp = DUEL_LOSE_HP + Math.min(1, (TRADES.jobFor(id, v.name)?.duelDamage ?? 2) - 1);
    p.lastHurtAt = T0 + 100_000; // 저절로 회복하지 않게
    for (let t = T0; t <= T0 + 6000 && v.duel; t += 100) {
      standBy(ra.idx, v, t);
      room.tick(t);
    }
    expect(a.json.filter((m) => m.t === 'duel').at(-1)).toMatchObject({ on: false, result: 'lose' });
    expect(a.json.some((m) => m.t === 'mob' && m.ev === 'swing' && m.id === id)).toBe(true); // 휘둘렀다
    expect(p.hp).toBe(DUEL_LOSE_HP + Math.min(1, (TRADES.jobFor(id, v.name)?.duelDamage ?? 2) - 1));

    const w = villagers[2] ?? villagers[0]!;
    w.duelReadyAt = 0;
    const wid = ANIMAL_ID_BASE + w.id;
    standBy(ra.idx, w, T0 + 10_000);
    expect(room.startDuel(ra.idx, wid, T0 + 10_000)).toBeNull();
    standBy(ra.idx, w, T0 + 10_100, 30); // 30칸 멀리
    for (let t = T0 + 10_100; t <= T0 + 11_000; t += 100) room.tick(t);
    expect(a.json.filter((m) => m.t === 'duel').at(-1)).toMatchObject({ id: wid, on: false, result: 'draw' });
  });
});
