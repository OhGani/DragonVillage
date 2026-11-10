import { BLOCKS } from '@dragon-village/shared/data';
import { CAMPFIRE, CAMPFIRE_COOK_MS, CAMPFIRE_OFF, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, HP_MAX, MSG, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 95_000_000;

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
  return { bin, json, send };
}

function setup() {
  const storage = new Storage(':memory:');
  const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
  const a = inbox();
  const b = inbox();
  const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
  room.join('b'.repeat(32), '아들', 1, b.send);
  const p = room.players.get(ra.idx)!;
  room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
  const t = { x: 64, y: GROUND_Y + 1, z: 64 };
  room.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf(CAMPFIRE));
  const idAt = () => BLOCKS.get(room.world.getBlock(t.x, t.y, t.z)).id;
  const slotOf = (item: string) => p.inv.findIndex((s) => s?.item === item);
  const tableMsgs = () => b.json.filter((m) => m.t === 'table');
  return { storage, room, a, b, ra, p, t, idAt, slotOf, tableMsgs };
}

describe('모닥불 (#290, 아빠 2026-11-10)', () => {
  it('날것만 올라가고(4개까지), 30초 뒤 익고, 가방에 넣거나 그 자리에서 먹는다. 다른 사람에게도 보인다', () => {
    const { room, ra, p, t, slotOf, tableMsgs } = setup();
    give(p.inv, 'beef', 3);
    give(p.inv, 'potato', 2);
    give(p.inv, 'bread', 1);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('bread'), undefined, T0)).toBe('NOT_COOKABLE'); // 빵은 구울 게 아니다
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('beef'), undefined, T0)).toBeNull();
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('potato'), undefined, T0 + 10_000)).toBeNull();
    expect(tableMsgs().at(-1)).toMatchObject({ items: ['beef', 'potato', null, null], fire: true });
    // 29초: 아직 날것
    room.checkCampfires(T0 + CAMPFIRE_COOK_MS - 1000);
    expect(tableMsgs().at(-1)!.items).toEqual(['beef', 'potato', null, null]);
    // 30초: 먼저 올린 소고기만 익는다
    room.checkCampfires(T0 + CAMPFIRE_COOK_MS);
    expect(tableMsgs().at(-1)!.items).toEqual(['cooked_beef', 'potato', null, null]);
    // 감자는 10초 늦게
    room.checkCampfires(T0 + CAMPFIRE_COOK_MS + 10_000);
    expect(tableMsgs().at(-1)!.items).toEqual(['cooked_beef', 'baked_potato', null, null]);
    // 가방에 · 먹기
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 0, T0 + 50_000)).toBeNull();
    expect(countOf(p.inv, 'cooked_beef')).toBe(1);
    p.hp = 6;
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 1, T0 + 50_000)).toBeNull();
    expect(p.hp).toBeGreaterThan(6);
    // 네 개까지
    give(p.inv, 'beef', 4);
    for (let k = 0; k < 4; k++) expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('beef'), undefined, T0 + 60_000)).toBeNull();
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('beef'), undefined, T0 + 60_000)).toBe('TABLE_FULL');
  });

  it('삽으로 끄면 꺼진 모닥불 — 음식은 남지만 익지 않는다. 라이터로 다시 켜면 그때부터 30초', () => {
    const { room, ra, p, t, idAt, slotOf, tableMsgs } = setup();
    give(p.inv, 'salmon', 1);
    give(p.inv, 'wooden_shovel', 1);
    give(p.inv, 'flint_and_steel', 1);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('salmon'), undefined, T0)).toBeNull();
    expect(room.douse(ra.idx, slotOf('flint_and_steel'), t.x, t.y, t.z)).toBe('NO_SHOVEL');
    expect(room.douse(ra.idx, slotOf('wooden_shovel'), t.x, t.y, t.z)).toBeNull();
    expect(idAt()).toBe(CAMPFIRE_OFF);
    expect(room.douse(ra.idx, slotOf('wooden_shovel'), t.x, t.y, t.z)).toBe('NOT_FIRE');
    room.checkCampfires(T0 + 5 * 60_000);
    expect(tableMsgs().at(-1)!.items).toEqual(['salmon', null, null, null]); // 5분이 지나도 날것
    // 꺼져 있어도 올릴 수는 있다
    give(p.inv, 'cod', 1);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('cod'), undefined, T0 + 5 * 60_000)).toBeNull();
    // 다시 켠다
    const lit = T0 + 6 * 60_000;
    expect(room.ignite(ra.idx, slotOf('wooden_shovel'), t.x, t.y, t.z, lit)).toBe('NO_FLINT');
    expect(room.ignite(ra.idx, slotOf('flint_and_steel'), t.x, t.y, t.z, lit)).toBeNull();
    expect(idAt()).toBe(CAMPFIRE);
    room.checkCampfires(lit + CAMPFIRE_COOK_MS - 1000);
    expect(tableMsgs().at(-1)!.items).toEqual(['salmon', 'cod', null, null]);
    room.checkCampfires(lit + CAMPFIRE_COOK_MS);
    expect(tableMsgs().at(-1)!.items).toEqual(['cooked_salmon', 'cooked_cod', null, null]);
  });

  it('부수면 모닥불과 올린 음식이 가방으로 (꺼진 모닥불을 부숴도 모닥불), 다시 켜도 음식이 남아 30초 뒤 익는다', () => {
    const { storage, room, a, ra, p, t, slotOf } = setup();
    give(p.inv, 'chicken', 2);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slotOf('chicken'), undefined, T0)).toBeNull();
    // 서버를 다시 켠다 (블록은 시험에서 직접 놓았으니 다시 놓는다)
    const again = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    again.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf(CAMPFIRE));
    const c = inbox();
    again.join('c'.repeat(32), '친구', 2, c.send);
    const list = c.json.find((m) => m.t === 'tables')!.list as { x: number; items: (string | null)[]; fire?: boolean }[];
    expect(list.find((x) => x.x === t.x)).toMatchObject({ items: ['chicken', null, null, null], fire: true });
    // 꺼진 채로 부순다
    give(p.inv, 'wooden_shovel', 1);
    expect(room.douse(ra.idx, slotOf('wooden_shovel'), t.x, t.y, t.z)).toBeNull();
    room.onBlockChange(ra.idx, { seq: 1, x: t.x, y: t.y, z: t.z, id: 'air' }, T0 + 1000);
    expect(a.bin.filter((m) => m.type === MSG.BlockChangeRejected)).toEqual([]);
    expect(countOf(p.inv, CAMPFIRE)).toBe(1);
    expect(countOf(p.inv, CAMPFIRE_OFF)).toBe(0);
    expect(countOf(p.inv, 'chicken')).toBe(2); // 올렸던 하나가 돌아왔다
  });

  it('불 위에 서 있으면 0.5초마다 하트 반 칸 — 갑옷은 못 막고, 꺼지면 안 아프다', () => {
    const { room, ra, p, t, slotOf } = setup();
    room.onMove(ra.idx, { x: t.x + 0.5, y: t.y + 1, z: t.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    p.hp = HP_MAX;
    room.tick(T0 + 100);
    expect(p.hp).toBe(HP_MAX - 1);
    room.tick(T0 + 300);
    expect(p.hp).toBe(HP_MAX - 1); // 아직 0.5초가 안 됐다
    room.tick(T0 + 700);
    expect(p.hp).toBe(HP_MAX - 2);
    // 옆 칸으로 내려오면 안 아프다
    room.onMove(ra.idx, { x: t.x + 2.5, y: t.y, z: t.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 800);
    room.tick(T0 + 1300);
    expect(p.hp).toBe(HP_MAX - 2);
    // 꺼진 모닥불 위
    give(p.inv, 'wooden_shovel', 1);
    expect(room.douse(ra.idx, slotOf('wooden_shovel'), t.x, t.y, t.z)).toBeNull();
    room.onMove(ra.idx, { x: t.x + 0.5, y: t.y + 1, z: t.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 1400);
    room.tick(T0 + 2000);
    expect(p.hp).toBe(HP_MAX - 2);
  });
});
