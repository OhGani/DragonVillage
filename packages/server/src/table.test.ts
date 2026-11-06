import { BLOCKS } from '@dragon-village/shared/data';
import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, TABLE_SLOTS, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
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
});
