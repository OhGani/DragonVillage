import { BLOCKS } from '@dragon-village/shared/data';
import { CHAIR_SEAT, DOOR_DIR, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, TABLE_SLOTS, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
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
  return { bin, json, send, clear: () => ((bin.length = 0), (json.length = 0)) };
}

describe('식탁 (아빠 2026-11-06)', () => {
  it('먹을 것을 올리고(4개까지), 가방에 다시 넣고, 그 자리에서 먹는다. 다른 사람에게도 보이고, 다시 켜도 남고, 부수면 부순 사람 가방으로', () => {
    const storage = new Storage(':memory:');
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const a = inbox();
    const b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.join('b'.repeat(32), '아들', 1, b.send);
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const t = { x: 64, y: GROUND_Y + 1, z: 64 };
    room.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf('dining_table'));
    expect(BLOCKS.get(BLOCKS.numOf('dining_table')).shape).toBe('table');
    give(p.inv, 'bread', 6);
    give(p.inv, 'cobblestone', 1);
    const bread = p.inv.findIndex((s) => s?.item === 'bread');
    const stone = p.inv.findIndex((s) => s?.item === 'cobblestone');
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, stone, undefined, T0)).toBe('NOT_EDIBLE');
    for (let k = 0; k < TABLE_SLOTS; k++) expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, bread, undefined, T0)).toBeNull();
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, bread, undefined, T0)).toBe('TABLE_FULL');
    expect(countOf(p.inv, 'bread')).toBe(6 - TABLE_SLOTS);
    const last = b.json.filter((m) => m.t === 'table').at(-1)!;
    expect(last.items).toEqual(['bread', 'bread', 'bread', 'bread']); // 다른 사람에게도 보인다
    // 가방에 다시
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 0, T0)).toBeNull();
    expect(countOf(p.inv, 'bread')).toBe(3);
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 0, T0)).toBe('EMPTY');
    // 먹기: 하트가 꽉 차면 못 먹고, 줄었으면 먹는다
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 1, T0)).toBe('HP_FULL');
    p.hp = 10;
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 1, T0)).toBeNull();
    expect(p.hp).toBeGreaterThan(10);
    expect(a.json.some((m) => m.t === 'health' && m.cause === 'eat')).toBe(true);
    // 다시 켜도 남는다 (남은 둘)
    const again = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    again.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf('dining_table'));
    const c = inbox();
    again.join('c'.repeat(32), '친구', 2, c.send);
    const tables = c.json.find((m) => m.t === 'tables')!.list as { x: number; items: (string | null)[] }[];
    expect(tables.find((x) => x.x === t.x)?.items.filter(Boolean)).toHaveLength(2);
    // 너무 멀면 안 된다
    room.onMove(ra.idx, { x: 80.5, y: GROUND_Y + 1, z: 80.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 1000);
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 2, T0 + 1000)).toBe('TOO_FAR');
  });

  it('그릇 (2026-11-20): 빈 그릇을 올리면 먹을 것이 거기 담기고, 먹거나 가방에 넣으면 빈 그릇이 남는다. 부수면 그릇과 음식 둘 다', () => {
    const storage = new Storage(':memory:');
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const t = { x: 64, y: GROUND_Y + 1, z: 64 };
    room.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf('dining_table'));
    give(p.inv, 'bowl', 2);
    give(p.inv, 'apple', 3);
    const slot = (item: string) => p.inv.findIndex((s) => s?.item === item);
    const items = () => (a.json.filter((m) => m.t === 'table').at(-1)!.items as (string | null)[]);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('apple'), undefined, T0)).toBeNull(); // 그릇이 없으면 그냥
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('bowl'), undefined, T0)).toBeNull();
    expect(items()).toEqual(['apple', 'bowl', null, null]);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('apple'), undefined, T0)).toBeNull(); // 빈 그릇에 담긴다
    expect(items()).toEqual(['apple', 'bowl:apple', null, null]);
    expect(countOf(p.inv, 'bowl')).toBe(1);
    // 먹으면 빈 그릇이 남는다
    p.hp = 10;
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 1, T0)).toBeNull();
    expect(p.hp).toBeGreaterThan(10);
    expect(items()).toEqual(['apple', 'bowl', null, null]);
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 1, T0)).toBe('NOT_EDIBLE'); // 빈 그릇은 못 먹는다
    // 다시 담고 음식만 가방에 → 그릇은 남는다. 빈 그릇을 가방에 → 그릇이 가방으로
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('apple'), undefined, T0)).toBeNull();
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 1, T0)).toBeNull();
    expect(items()).toEqual(['apple', 'bowl', null, null]);
    expect(countOf(p.inv, 'apple')).toBe(1);
    expect(room.useTable(ra.idx, 'take', t.x, t.y, t.z, undefined, 1, T0)).toBeNull();
    expect(countOf(p.inv, 'bowl')).toBe(2);
    // 담긴 채로 부수면 그릇·음식 둘 다
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('bowl'), undefined, T0)).toBeNull();
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, slot('apple'), undefined, T0)).toBeNull();
    expect(items()).toEqual(['apple', 'bowl:apple', null, null]);
    room.onBlockChange(ra.idx, { seq: 1, x: t.x, y: t.y, z: t.z, id: 'air' }, T0 + 1000);
    expect(countOf(p.inv, 'apple')).toBe(2);
    expect(countOf(p.inv, 'bowl')).toBe(2);
  });

  it('의자 (2026-11-20): 놓은 방향대로 서고, 탭하면 앉는 판 높이에 앉는다(하트는 빨리 안 찬다). 앉아서 식탁의 음식을 먹고, 의자가 부서지면 일어난다', () => {
    const storage = new Storage(':memory:');
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const a = inbox();
    const b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 62.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    room.onMove(rb.idx, { x: 60.5, y: GROUND_Y + 1, z: 60.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const t = { x: 64, y: GROUND_Y + 1, z: 64 };
    room.world.setBlock(t.x, t.y, t.z, BLOCKS.numOf('dining_table'));
    // 식탁 남쪽에 북쪽(식탁)을 보는 의자 — 클라가 고른 변형 그대로 놓인다
    give(p.inv, 'chair', 2);
    const c = { x: 64, y: GROUND_Y + 1, z: 65 };
    room.onBlockChange(ra.idx, { seq: 1, x: c.x, y: c.y, z: c.z, id: 'chair' }, T0);
    const def = BLOCKS.get(room.world.getBlock(c.x, c.y, c.z));
    expect(def.chair).toMatchObject({ facing: 0 });
    expect(countOf(p.inv, 'chair')).toBe(1);
    room.onBlockChange(ra.idx, { seq: 2, x: 63, y: c.y, z: 64, id: 'chair@e' }, T0); // 서쪽 의자는 동쪽(식탁)을 본다
    expect(BLOCKS.get(room.world.getBlock(63, c.y, 64)).chair).toMatchObject({ facing: 1 });
    expect(countOf(p.inv, 'chair')).toBe(0);
    // 앉기: 칸 가운데에서 보는 쪽으로 0.1, 앉는 판 높이. 모두에게 seat 로 알린다
    a.clear();
    expect(room.sleep(ra.idx, c, T0)).toBeNull();
    const [fx, fz] = DOOR_DIR[0]!;
    const spot = { x: c.x + 0.5 + fx * 0.1, y: c.y + CHAIR_SEAT, z: c.z + 0.5 + fz * 0.1, facing: 0, seat: true };
    expect(p.sleeping).toEqual(spot);
    expect(b.json.filter((m) => m.t === 'sleep').at(-1)).toMatchObject({ idx: ra.idx, at: spot });
    expect(room.sleep(rb.idx, c, T0)).toBe('TOO_FAR');
    room.onMove(rb.idx, { x: c.x + 1.5, y: GROUND_Y + 1, z: c.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    expect(room.sleep(rb.idx, c, T0)).toBe('OCCUPIED'); // 남이 앉은 의자
    // 앉아서 식탁 음식 먹기 (닿는 거리)
    give(p.inv, 'bread', 1);
    expect(room.useTable(ra.idx, 'put', t.x, t.y, t.z, p.inv.findIndex((s) => s?.item === 'bread'), undefined, T0)).toBeNull();
    p.hp = 10;
    expect(room.useTable(ra.idx, 'eat', t.x, t.y, t.z, undefined, 0, T0)).toBeNull();
    expect(p.hp).toBeGreaterThan(10);
    // 의자는 침대처럼 하트를 4배로 채우지 않는다: 8초 동안 1초에 1 → 4 이하만 (맞은 지 오래)
    p.hp = 4;
    p.lastHurtAt = T0 - 60_000;
    p.lastRegenAt = T0;
    for (let tt = T0; tt <= T0 + 4000; tt += 100) room.tick(tt);
    expect(p.hp).toBeLessThanOrEqual(9);
    // 의자가 부서지면 일어난다
    room.onBlockChange(rb.idx, { seq: 3, x: c.x, y: c.y, z: c.z, id: 'air' }, T0 + 5000);
    expect(room.world.getBlock(c.x, c.y, c.z)).toBe(0);
    expect(p.sleeping).toBeNull();
    expect(countOf(room.players.get(rb.idx)!.inv, 'chair')).toBe(1);
  });
});
