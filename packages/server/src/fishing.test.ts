import { BLOCKS, FISHING } from '@dragon-village/shared/data';
import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, MOB_STATE, MSG, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { FISH_ID_BASE, VILLAGE_COD, VILLAGE_SALMON, VillageRoom } from './village';

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

describe('헤엄치는 연어 (2026-11-06)', () => {
  it('마을 강에 연어가 늘 몇 마리 헤엄치고, 1분이 지나도 물 밖으로 안 나온다', () => {
    const { room } = setup();
    for (let t = T0; t < T0 + 60_000; t += 100) room.tick(t);
    const fish = [...room.fishMobs!.mobs.values()].filter((m) => m.kind === 'salmon');
    expect(fish.length).toBe(VILLAGE_SALMON);
    for (const m of fish) {
      expect(m.id).toBeGreaterThanOrEqual(FISH_ID_BASE);
      expect(BLOCKS.get(room.world.getBlock(Math.floor(m.x), Math.floor(m.y + 0.2), Math.floor(m.z))).fluid).toBe('water');
    }
    expect(new Set(fish.map((m) => `${m.x.toFixed(1)},${m.z.toFixed(1)}`)).size).toBeGreaterThan(1);
  });

  it('칼로 치면 달아나고(물 안에서), 잡으면 연어가 가방에. 잡힌 만큼 다시 채워진다', () => {
    const { room, ra, p } = setup();
    room.tick(T0);
    const sys = room.fishMobs!;
    const m = [...sys.mobs.values()][0]!;
    // 연어 바로 옆 물가에 선다 (2칸, 눈높이는 수면 위)
    room.onMove(ra.idx, { x: m.x + 1.6, y: m.y + 0.6, z: m.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 10);
    give(p.inv, 'iron_sword', 1);
    const sword = p.inv.findIndex((s) => s?.item === 'iron_sword');
    // 맨손(피해 1)으로 한 대 → 살아서 달아난다, 물 밖으로는 안 나간다
    const x0 = m.x,
      z0 = m.z;
    expect(room.hitMob(ra.idx, m.id, undefined, T0 + 100)).toBeNull();
    expect(sys.mobs.has(m.id)).toBe(true);
    expect(m.fleeUntil).toBeGreaterThan(T0);
    for (let t = T0 + 200; t < T0 + 2500; t += 100) room.tick(t);
    expect(Math.hypot(m.x - x0, m.z - z0)).toBeGreaterThan(0.5);
    expect(BLOCKS.get(room.world.getBlock(Math.floor(m.x), Math.floor(m.y + 0.2), Math.floor(m.z))).fluid).toBe('water');
    const before = countOf(p.inv, 'salmon');
    for (let i = 0; i < 6 && sys.mobs.has(m.id); i++) {
      room.onMove(ra.idx, { x: m.x + 1.6, y: m.y + 0.6, z: m.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 3000 + i * 1000);
      room.hitMob(ra.idx, m.id, sword, T0 + 3000 + i * 1000 + 10);
    }
    expect(sys.mobs.has(m.id)).toBe(false);
    expect(countOf(p.inv, 'salmon')).toBe(before + 1);
    for (let t = T0 + 9000; t < T0 + 40_000; t += 500) room.tick(t);
    expect([...sys.mobs.values()].filter((f) => f.kind === 'salmon').length).toBe(VILLAGE_SALMON);
  });
});

describe('대구·열대어·복어 (2026-11-06)', () => {
  it('마을 강엔 연어와 함께 대구도 헤엄친다', () => {
    const { room } = setup();
    for (let t = T0; t < T0 + 5000; t += 100) room.tick(t);
    expect([...room.fishMobs!.mobs.values()].filter((m) => m.kind === 'cod').length).toBe(VILLAGE_COD);
  });

  it('복어는 3칸 안에 오면 부풀고(attack), 부푼 채 닿으면 따끔 + 독. 멀면 안 부푼다', () => {
    const { room, ra, p } = setup();
    room.tick(T0);
    const sys = room.fishMobs!;
    const anchor = [...sys.mobs.values()][0]!;
    const puff = sys.spawnKind('pufferfish', anchor.x, anchor.y, anchor.z);
    // 멀리(10칸): 안 부푼다
    room.onMove(ra.idx, { x: puff.x + 10, y: puff.y + 0.6, z: puff.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 10);
    for (let t = T0 + 100; t < T0 + 1000; t += 100) room.tick(t);
    expect(puff.state).not.toBe(MOB_STATE.attack);
    // 2칸: 부푼다, 아직 안 아프다
    const hp0 = p.hp;
    puff.x = anchor.x;
    puff.z = anchor.z;
    room.onMove(ra.idx, { x: puff.x + 2, y: puff.y - 0.4, z: puff.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 1000);
    room.tick(T0 + 1100);
    expect(puff.state).toBe(MOB_STATE.attack);
    expect(p.hp).toBe(hp0);
    // 닿는다(1칸): 따끔 + 독
    room.onMove(ra.idx, { x: puff.x + 0.8, y: puff.y - 0.4, z: puff.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 1200);
    for (let t = T0 + 1300; t < T0 + 4500; t += 100) room.tick(t);
    expect(p.hp).toBeLessThan(hp0);
  });
});
