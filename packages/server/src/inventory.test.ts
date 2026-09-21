import { DEFAULT_VILLAGE_SEED, EMOTE_EMOJI, EMOTE_PHRASE, GROUND_Y, MSG, REJECT, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, type ServerBinary } from '@dragon-village/shared';
import { BLOCKS, STARTER_KIT } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };

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

function setup(storage: Storage | null = null) {
  const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 777, starterKit: null, gifts: [] });
  const a = inbox();
  const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
  a.clear();
  return { room, a, ia: ra.idx, p: room.players.get(ra.idx)! };
}
const slotsOf = (box: ReturnType<typeof inbox>) => box.bin.filter((m) => m.type === MSG.InvSlots).flatMap((m) => (m.msg as { slots: { slot: number; item: string; count: number }[] }).slots);
const rejected = (box: ReturnType<typeof inbox>) => box.bin.filter((m) => m.type === MSG.BlockChangeRejected).map((m) => m.msg as { seq: number; reason: number });
// 광장 바로 앞 (스폰 64.5, 41, 64.5)
const FRONT = { x: 66, y: GROUND_Y + 1, z: 64 };

describe('가방과 블록 (M4, #66)', () => {
  it('처음 가방은 비어 있고, 없는 블록은 못 놓는다(NO_ITEM). 잔디를 부수면 흙이 들어온다', () => {
    const { room, a, ia, p } = setup();
    expect(p.inv.every((s) => s === null)).toBe(true);
    room.onBlockChange(ia, { seq: 1, ...FRONT, id: 'stone' }, 1000);
    expect(rejected(a)).toEqual([{ seq: 1, reason: REJECT.NO_ITEM }]);
    expect(room.world.getBlock(FRONT.x, FRONT.y, FRONT.z)).toBe(0);
    // 광장 밖 잔디 부수기 → 흙 (광장 안은 조약돌·길)
    const g = { x: 70, y: GROUND_Y, z: 70 };
    room.onMove(ia, { x: 68.5, y: GROUND_Y + 1, z: 68.5, yaw: 0, pitch: 0, flags: 0 });
    expect(BLOCKS.get(room.world.getBlock(g.x, g.y, g.z)).id).toBe('grass');
    room.onBlockChange(ia, { seq: 2, ...g, id: 'air' }, 1100);
    expect(countOf(p.inv, 'dirt')).toBe(1);
    expect(slotsOf(a)).toEqual([{ slot: 0, item: 'dirt', count: 1 }]);
    // 그 흙을 다시 놓으면 가방에서 나간다
    room.onBlockChange(ia, { seq: 3, ...g, id: 'dirt' }, 1200);
    expect(BLOCKS.get(room.world.getBlock(g.x, g.y, g.z)).id).toBe('dirt');
    expect(countOf(p.inv, 'dirt')).toBe(0);
    expect(slotsOf(a).at(-1)).toEqual({ slot: 0, item: '', count: 0 });
  });

  it('물은 양동이로: 빈 양동이가 있어야 떠내고(찬 양동이가 됨), 부으면 빈 양동이가 남는다', () => {
    const { room, a, ia, p } = setup();
    // 광장 옆 밭 물길은 멀다 → 앞에 물을 놓으려면 water_bucket 이 필요
    room.onBlockChange(ia, { seq: 1, ...FRONT, id: 'water%8' }, 1000);
    expect(rejected(a).at(-1)).toMatchObject({ reason: REJECT.NO_ITEM });
    room.giveItems(ia, 'water_bucket', 1);
    room.onBlockChange(ia, { seq: 2, ...FRONT, id: 'water%8' }, 1100);
    expect(BLOCKS.get(room.world.getBlock(FRONT.x, FRONT.y, FRONT.z)).id).toBe('water%8');
    expect(countOf(p.inv, 'water_bucket')).toBe(0);
    expect(countOf(p.inv, 'bucket')).toBe(1);
    // 가득한 칸을 다시 떠내면 찬 양동이
    room.onBlockChange(ia, { seq: 3, ...FRONT, id: 'air' }, 1200);
    expect(countOf(p.inv, 'water_bucket')).toBe(1);
    expect(countOf(p.inv, 'bucket')).toBe(0);
    // 빈 양동이 없이 가득한 물은 못 떠낸다
    room.onBlockChange(ia, { seq: 4, ...FRONT, id: 'water%8' }, 1300);
    room.onInvDrop(ia, { slot: p.inv.findIndex((s) => s?.item === 'bucket'), count: 1 });
    room.onBlockChange(ia, { seq: 5, ...FRONT, id: 'air' }, 1400);
    expect(rejected(a).at(-1)).toMatchObject({ seq: 5, reason: REJECT.NO_ITEM });
  });

  it('옮기기·버리기·저장 라운드트립', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, createdAt: 1 });
    const { room, a, ia, p } = setup(storage);
    room.giveItems(ia, 'planks', 10);
    a.clear();
    room.onInvMove(ia, { from: 0, to: 12, count: 4 });
    expect(p.inv[0]).toEqual({ item: 'planks', count: 6 });
    expect(p.inv[12]).toEqual({ item: 'planks', count: 4 });
    expect(slotsOf(a).map((s) => s.slot)).toEqual([0, 12]);
    a.clear();
    room.onInvMove(ia, { from: 5, to: 6, count: 1 }); // 빈 칸 → 실패, 두 칸 상태를 다시 보내 바로잡는다
    expect(slotsOf(a)).toEqual([
      { slot: 5, item: '', count: 0 },
      { slot: 6, item: '', count: 0 },
    ]);
    room.onInvDrop(ia, { slot: 12, count: 4 });
    expect(p.inv[12]).toBeNull();
    room.flush(5000);
    const loaded = storage.getInventory('a'.repeat(32))!;
    expect(loaded[0]).toEqual({ item: 'planks', count: 6 });
    // 다시 들어오면 그 가방
    const b = inbox();
    const room2 = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: [] });
    const rb = room2.join('a'.repeat(32), '아빠', 0, b.send)!;
    expect(rb.inventory[0]).toEqual({ item: 'planks', count: 6 });
  });
});

describe('시작 키트 (#67)', () => {
  it('처음 들어오면 starter-kit.json 을 받고, 다시 들어오면 안 받는다', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, createdAt: 1 });
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { gifts: [] });
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    expect(countOf(ra.inventory, 'planks')).toBe(STARTER_KIT.planks);
    expect(countOf(ra.inventory, 'crafting_table')).toBe(1);
    expect(countOf(ra.inventory, 'bucket')).toBe(1);
    // 다 쓰고 나가도 다시 안 준다
    ra.inventory.forEach((s, i) => s && room.onInvDrop(ra.idx, { slot: i, count: s.count }));
    room.leave(ra.idx);
    const b = inbox();
    const rb = room.join('a'.repeat(32), '아빠', 0, b.send)!;
    expect(rb.inventory.every((s) => s === null)).toBe(true);
    // 다른 사람은 받는다
    const rc = room.join('c'.repeat(32), '친구', 1, inbox().send)!;
    expect(countOf(rc.inventory, 'planks')).toBe(STARTER_KIT.planks);
  });
});

describe('제작·양조 (M4)', () => {
  it('가방 2×2 는 어디서나, 제작대 레시피는 제작대 5칸 안에서만', () => {
    const { room, ia, p } = setup();
    expect(room.craft(ia, 'planks')).toBe('MISSING');
    room.giveItems(ia, 'log', 2);
    expect(room.craft(ia, 'planks')).toBeNull();
    expect(countOf(p.inv, 'planks')).toBe(4);
    expect(countOf(p.inv, 'log')).toBe(1);
    // 문은 제작대가 있어야
    room.giveItems(ia, 'planks', 6);
    expect(room.craft(ia, 'oak_door')).toBe('NO_STATION');
    expect(room.craft(ia, 'crafting_table')).toBeNull(); // 판자 4 → 제작대 1 (가방에서)
    room.onBlockChange(ia, { seq: 1, ...FRONT, id: 'crafting_table' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(FRONT.x, FRONT.y, FRONT.z)).id).toBe('crafting_table');
    expect(room.craft(ia, 'oak_door')).toBeNull();
    expect(countOf(p.inv, 'oak_door')).toBe(3);
    expect(room.craft(ia, 'no_such')).toBe('BAD_RECIPE');
    expect(room.craft(ia, 'obsidian_from_lava')).toBe('BAD_RECIPE'); // world 레시피는 제작이 아니다
    expect(room.craft(ia, 'iron_pickaxe')).toBe('NOT_YET'); // 대장간은 M6
  });

  it('양조기 옆에서 물병 + 네더 사마귀 → 어색한 물약, 연료 블레이즈 가루', () => {
    const { room, ia, p } = setup();
    room.giveItems(ia, 'brewing_stand', 1);
    room.giveItems(ia, 'water_bottle', 3);
    room.giveItems(ia, 'nether_wart', 2);
    // 0 양조기, 1 물병×3, 2 네더 사마귀×2 → 병을 1·3·4 칸에 하나씩
    room.onInvMove(ia, { from: 1, to: 3, count: 1 });
    room.onInvMove(ia, { from: 1, to: 4, count: 1 });
    expect(p.inv[1]).toEqual({ item: 'water_bottle', count: 1 });
    expect(p.inv[2]).toEqual({ item: 'nether_wart', count: 2 });
    expect(room.brew(ia, [1, 3, 4], 2)).toBe('NO_STATION');
    room.onBlockChange(ia, { seq: 1, ...FRONT, id: 'brewing_stand' }, 1000);
    expect(room.brew(ia, [1, 3, 4], 2)).toBe('NO_FUEL');
    room.giveItems(ia, 'blaze_powder', 1);
    expect(room.brew(ia, [1, 3, 4], 2)).toBeNull();
    for (const s of [1, 3, 4]) expect(p.inv[s]).toEqual({ item: 'potion.awkward', count: 1 });
    expect(p.inv[2]).toEqual({ item: 'nether_wart', count: 1 });
    expect(countOf(p.inv, 'blaze_powder')).toBe(0);
    expect(p.brewFuel).toBe(19);
    // 이제 설탕 → 신속
    room.giveItems(ia, 'sugar', 1);
    const sugarSlot = p.inv.findIndex((s) => s?.item === 'sugar');
    expect(room.brew(ia, [1], sugarSlot)).toBeNull();
    expect(p.inv[1]).toEqual({ item: 'potion.speed', count: 1 });
    expect(p.brewFuel).toBe(18);
    // 안 먹히는 재료
    expect(room.brew(ia, [3], 2)).toBe('NO_EFFECT'); // 어색한 물약 + 네더 사마귀
    expect(room.brew(ia, [3, 3], 2)).toBe('BAD_BOTTLES');
  });
});

describe('채팅 (M4, 규칙 3)', () => {
  it('정해진 이모지·문구만, 초당 1개, 같은 세계 사람에게', () => {
    const { room, a, ia } = setup();
    const b = inbox();
    const ib = room.join('b'.repeat(32), '아들', 1, b.send)!.idx;
    a.clear();
    expect(room.onEmote(ia, EMOTE_PHRASE, 1, 1000)).toBe(true);
    expect(a.bin.find((m) => m.type === MSG.Emote)).toMatchObject({ msg: { idx: ia, kind: EMOTE_PHRASE, id: 1 } });
    expect(b.bin.find((m) => m.type === MSG.Emote)).toMatchObject({ msg: { idx: ia, kind: EMOTE_PHRASE, id: 1 } });
    expect(room.onEmote(ia, EMOTE_EMOJI, 0, 1500)).toBe(false); // 너무 빨라
    expect(room.onEmote(ia, EMOTE_EMOJI, 99, 3000)).toBe(false); // 없는 이모지
    expect(room.onEmote(ia, 7, 1, 3000)).toBe(false);
    expect(room.onEmote(ia, EMOTE_EMOJI, 0, 3000)).toBe(true);
    // 원정에 나간 사람에게는 마을 채팅이 안 간다
    room.startExpedition(ib, 'grass_island', 4000);
    b.clear();
    expect(room.onEmote(ia, EMOTE_PHRASE, 2, 5000)).toBe(true);
    expect(b.bin.find((m) => m.type === MSG.Emote)).toBeUndefined();
  });
});
