import { BLOCKS, FISHING } from '@dragon-village/shared/data';
import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, MSG, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 90_000_000;

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

/** 마을 강의 물 칸 하나(위가 공기)와 그 옆 마른 땅 */
function setup() {
  const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
  const a = inbox();
  const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
  const p = room.players.get(ra.idx)!;
  const w = room.world;
  let water: { x: number; y: number; z: number } | null = null;
  for (let x = 40; x < 216 && !water; x++)
    for (let z = 40; z < 216 && !water; z++)
      for (let y = 60; y > 20; y--) {
        const b = BLOCKS.get(w.getBlock(x, y, z));
        if (b.fluid === 'water' && !BLOCKS.get(w.getBlock(x, y + 1, z)).fluid && !BLOCKS.get(w.getBlock(x, y + 1, z)).solid) water = { x, y, z };
        if (b.solid || b.fluid) break;
      }
  if (!water) throw new Error('마을에 물이 없다');
  // 물에서 4칸 떨어져 선다 (발은 물 높이 + 1)
  room.onMove(ra.idx, { x: water.x + 4.5, y: water.y + 1, z: water.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
  give(p.inv, 'fishing_rod', 1);
  give(p.inv, 'dirt', 1);
  const rod = p.inv.findIndex((s) => s?.item === 'fishing_rod');
  const fishEv = () => a.json.filter((m) => m.t === 'fish').map((m) => m.ev);
  return { room, a, ra, p, water, rod, fishEv };
}

describe('낚시 (2026-11-06)', () => {
  it('낚싯대로 물에 던지면 찌, 기다리면 입질, 그때 건지면 물고기와 경험치', () => {
    const { room, a, ra, p, water, rod, fishEv } = setup();
    expect(room.castLine(ra.idx, rod, water.x, water.y, water.z, T0)).toBeNull();
    expect(fishEv()).toEqual(['cast']);
    let t = T0;
    while (!fishEv().includes('bite') && t < T0 + FISHING.waitMaxMs + 1000) room.tick((t += 100));
    expect(fishEv()).toContain('bite');
    expect(t - T0).toBeGreaterThanOrEqual(FISHING.waitMinMs);
    const xp0 = p.xp;
    const fish0 = ['cod', 'salmon', 'tropical_fish', 'pufferfish', 'stick', 'string', 'bone', 'leather', 'ink_sac', 'saddle', 'name_tag_blank'].reduce((s, i) => s + countOf(p.inv, i), 0);
    expect(room.reelLine(ra.idx, t + 300)).toBeNull();
    const caught = a.json.find((m) => m.t === 'fish' && m.ev === 'catch')!;
    expect(caught).toBeDefined();
    expect(countOf(p.inv, caught.item as string)).toBeGreaterThan(0);
    expect(['cod', 'salmon', 'tropical_fish', 'pufferfish', 'stick', 'string', 'bone', 'leather', 'ink_sac', 'saddle', 'name_tag_blank'].reduce((s, i) => s + countOf(p.inv, i), 0)).toBe(fish0 + 1);
    expect(p.xp).toBeGreaterThan(xp0);
    expect(a.bin.some((m) => m.type === MSG.XpGained)).toBe(true);
    expect(p.fishing).toBeNull();
  });

  it('입질 전에 건지면 빈 줄, 입질을 놓치면 다시 기다려 또 입질한다', () => {
    const { room, ra, water, rod, fishEv } = setup();
    room.castLine(ra.idx, rod, water.x, water.y, water.z, T0);
    expect(room.reelLine(ra.idx, T0 + 500)).toBeNull();
    expect(fishEv()).toEqual(['cast', 'reel']);
    expect(room.reelLine(ra.idx, T0 + 600)).toBe('NO_LINE');
    room.castLine(ra.idx, rod, water.x, water.y, water.z, T0 + 1000);
    for (let t = T0 + 1000; t < T0 + 1000 + (FISHING.waitMaxMs + FISHING.biteMs) * 2 + 3000; t += 100) room.tick(t);
    const ev = fishEv();
    expect(ev).toContain('miss');
    expect(ev.filter((e) => e === 'bite').length).toBeGreaterThanOrEqual(2); // 놓친 뒤 또 입질
  });

  it('멀리 걸어가면 찌가 사라지고, 낚싯대가 아니거나 물이 아니거나 멀면 못 던진다', () => {
    const { room, ra, water, rod, fishEv, p } = setup();
    room.castLine(ra.idx, rod, water.x, water.y, water.z, T0);
    room.onMove(ra.idx, { x: water.x + 4.5 + FISHING.range + 8, y: water.y + 1, z: water.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 100);
    room.tick(T0 + 200);
    expect(fishEv()).toContain('gone');
    expect(p.fishing).toBeNull();
    room.onMove(ra.idx, { x: water.x + 4.5, y: water.y + 1, z: water.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 300);
    const dirt = p.inv.findIndex((s) => s?.item === 'dirt');
    expect(room.castLine(ra.idx, dirt, water.x, water.y, water.z, T0 + 400)).toBe('NO_ROD');
    expect(room.castLine(ra.idx, rod, water.x, water.y + 1, water.z, T0 + 400)).toBe('NOT_WATER');
    room.onMove(ra.idx, { x: water.x + FISHING.range + 6, y: water.y + 1, z: water.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 500);
    expect(room.castLine(ra.idx, rod, water.x, water.y, water.z, T0 + 600)).toBe('TOO_FAR');
  });
});
