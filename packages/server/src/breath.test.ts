/** 물속 숨 (#246): 눈이 잠기면 15초 뒤부터 1초마다 2, 물 밖에선 4초면 다 참, 수중 호흡 물약 — 서버가 진실 */
import { AIR_MAX_SEC, DEFAULT_VILLAGE_SEED, HP_MAX, VILLAGE_GEN_VERSION, decodeServerBinary, type ServerBinary, give } from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 1_000_000;
const EYE = 1.62;

function inbox() {
  const bin: ServerBinary[] = [];
  const json: { t: string; [k: string]: unknown }[] = [];
  const send = (d: Uint8Array | string) => {
    if (typeof d === 'string') json.push(JSON.parse(d));
    else {
      const m = decodeServerBinary(d);
      if (m) bin.push(m);
    }
  };
  return { bin, json, send, clear: () => ((bin.length = 0), (json.length = 0)) };
}

function setup() {
  const room = new VillageRoom({ ...INFO }, BLOCKS, null, () => {}, { seedFn: () => 777, starterKit: null, gifts: [] });
  const a = inbox();
  const ia = room.join('a'.repeat(32), '아빠', 0, a.send)!.idx;
  a.clear();
  const p = room.players.get(ia)!;
  const eye = { x: Math.floor(p.pos.x), y: Math.floor(p.pos.y + EYE - 0.1), z: Math.floor(p.pos.z) };
  const water = (on: boolean) => room.world.setBlock(eye.x, eye.y, eye.z, on ? BLOCKS.numOf('water') : BLOCKS.numOf('air'));
  return { room, a, ia, p, water };
}

const airMsgs = (box: ReturnType<typeof inbox>) => box.json.filter((m) => m.t === 'air') as unknown as { air: number; max: number }[];
const hpMsgs = (box: ReturnType<typeof inbox>) => box.json.filter((m) => m.t === 'health') as unknown as { hp: number; cause: string }[];

describe('물속 숨 (#246)', () => {
  it('눈이 물에 잠기면 숨이 줄어 15초 뒤부터 1초마다 2 — 갑옷은 못 막는다. 물 밖으로 나오면 4초면 다 찬다', () => {
    const { room, a, p, water } = setup();
    room.tick(T0);
    expect(airMsgs(a).at(-1)).toEqual({ t: 'air', air: AIR_MAX_SEC, max: AIR_MAX_SEC }); // 처음 한 번은 꽉 찬 채로
    a.clear();
    water(true);
    for (let t = T0 + 250; t <= T0 + 14_000; t += 250) room.tick(t);
    expect(p.hp).toBe(HP_MAX);
    expect(p.air).toBeCloseTo(1);
    expect(airMsgs(a).at(-1)).toEqual({ t: 'air', air: 1, max: AIR_MAX_SEC });
    expect(airMsgs(a).length).toBeGreaterThan(20); // 반 초마다
    for (let t = T0 + 14_250; t <= T0 + 15_500; t += 250) room.tick(t);
    expect(p.air).toBe(0);
    expect(p.hp).toBe(HP_MAX - 2); // 15초에 한 번
    expect(hpMsgs(a).at(-1)).toMatchObject({ hp: 18, cause: 'drown' });
    for (let t = T0 + 15_750; t <= T0 + 18_500; t += 250) room.tick(t);
    expect(p.hp).toBe(HP_MAX - 2 * 4); // 15·16·17·18초
    water(false);
    for (let t = T0 + 18_750; t <= T0 + 23_500; t += 250) room.tick(t);
    expect(p.air).toBe(AIR_MAX_SEC);
    expect(hpMsgs(a).filter((m) => m.cause === 'drown').length).toBe(4); // 더는 안 아프다 (3초 뒤부턴 저절로 찬다)
    expect(p.hp).toBeGreaterThanOrEqual(HP_MAX - 8);
    expect(airMsgs(a).at(-1)).toEqual({ t: 'air', air: AIR_MAX_SEC, max: AIR_MAX_SEC });
  });

  it('숨이 다해 쓰러지면 광장에서 다시 — 숨도 꽉 찬다. 수중 호흡 물약이면 물속에서도 안 준다', () => {
    const { room, a, ia, p, water } = setup();
    room.tick(T0);
    water(true);
    for (let t = T0 + 250; t <= T0 + 26_000; t += 250) room.tick(t);
    expect(a.json.find((m) => m.t === 'respawn')).toBeTruthy(); // 15초 + 2×10 = 25초
    expect(p.hp).toBe(HP_MAX);
    expect(p.air).toBeGreaterThanOrEqual(AIR_MAX_SEC - 2); // 24초에 쓰러져 다시 찼다 (광장 눈 자리도 물이라 2초 줄었다)
    water(false);
    for (let t = T0 + 26_250; t <= T0 + 31_000; t += 250) room.tick(t);
    expect(p.air).toBe(AIR_MAX_SEC);
    give(p.inv, 'potion.water_breathing', 1);
    const slot = p.inv.findIndex((s) => s?.item === 'potion.water_breathing');
    expect(room.drink(ia, slot, T0 + 31_000)).toBeNull();
    a.clear();
    water(true);
    for (let t = T0 + 31_250; t <= T0 + 60_000; t += 250) room.tick(t);
    expect(p.air).toBe(AIR_MAX_SEC);
    expect(p.hp).toBe(HP_MAX);
    expect(airMsgs(a)).toEqual([]); // 바뀐 게 없으니 안 보낸다
  });
});
