import { ANIMAL_ID_BASE, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, HP_MAX, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary } from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 80_000_000;

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
const makeRoom = (storage: Storage) => new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });

describe('전투 장비 (M8-2): 입기·벗기·피해 줄이기·활', () => {
  it('갑옷을 입으면 가방에서 빠지고 방어가 오르며, 저장돼서 다시 들어와도 입고 있다. 벗으면 가방으로', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    give(p.inv, 'iron_helmet', 1);
    give(p.inv, 'iron_chestplate', 2);
    give(p.inv, 'shield', 1);
    give(p.inv, 'stick', 1);
    const slotOf = (item: string) => p.inv.findIndex((s) => s?.item === item);
    expect(room.equip(ra.idx, slotOf('stick'))).toBe('NOT_EQUIPPABLE');
    expect(room.equip(ra.idx, 36)).toBe('EMPTY');
    a.clear();
    expect(room.equip(ra.idx, slotOf('iron_helmet'))).toBeNull();
    expect(room.equip(ra.idx, slotOf('iron_chestplate'))).toBeNull();
    expect(room.equip(ra.idx, slotOf('shield'))).toBeNull();
    expect(p.equip).toMatchObject({ helmet: 'iron_helmet', chestplate: 'iron_chestplate', shield: 'shield', leggings: null, boots: null });
    expect(countOf(p.inv, 'iron_helmet')).toBe(0);
    expect(countOf(p.inv, 'iron_chestplate')).toBe(1);
    const eq = a.json.filter((m) => m.t === 'equip').at(-1)!;
    expect(eq.defense).toBe(8);
    // 같은 부위를 다시 입으면 옛것이 가방으로
    give(p.inv, 'leather_helmet', 1);
    expect(room.equip(ra.idx, slotOf('leather_helmet'))).toBeNull();
    expect(p.equip.helmet).toBe('leather_helmet');
    expect(countOf(p.inv, 'iron_helmet')).toBe(1);
    // 저장 → 다시 들어오면 그대로
    room.flush(T0);
    room.leave(ra.idx);
    const again = makeRoom(storage);
    const b = inbox();
    const rb = again.join('a'.repeat(32), '아빠', 0, b.send)!;
    expect(rb.spawn.equip).toMatchObject({ helmet: 'leather_helmet', chestplate: 'iron_chestplate', shield: 'shield' });
    // 벗기
    expect(again.unequip(rb.idx, 'boots')).toBe('NOTHING');
    expect(again.unequip(rb.idx, 'shield')).toBeNull();
    expect(again.players.get(rb.idx)!.equip.shield).toBeNull();
    expect(countOf(again.players.get(rb.idx)!.inv, 'shield')).toBe(1);
  });

  it('맞을 때 방패 → 갑옷 순서로 깎인다: 철 풀세트 좀비 3 → 1, 방패는 크리퍼 절반·약탈자 화살 전부, 낙하는 그대로', () => {
    const room = makeRoom(new Storage(':memory:'));
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.hurt(p, 3, 'zombie', T0);
    expect(p.hp).toBe(HP_MAX - 3);
    p.hp = HP_MAX;
    p.equip = { helmet: 'iron_helmet', chestplate: 'iron_chestplate', leggings: 'iron_leggings', boots: 'iron_boots', shield: null };
    room.hurt(p, 3, 'zombie', T0 + 1000);
    expect(p.hp).toBe(HP_MAX - 1);
    room.hurt(p, 10, 'zombie', T0 + 2000);
    expect(p.hp).toBe(HP_MAX - 1 - 6);
    p.hp = HP_MAX;
    room.hurt(p, 5, 'fall', T0 + 3000);
    expect(p.hp).toBe(HP_MAX - 5); // 갑옷은 낙하에 안 통한다
    p.hp = HP_MAX;
    p.equip = { helmet: null, chestplate: null, leggings: null, boots: null, shield: 'shield' };
    a.clear();
    room.hurt(p, 7, 'creeper', T0 + 4000);
    expect(p.hp).toBe(HP_MAX - 4); // 3.5 → 4
    room.hurt(p, 6, 'pillager', T0 + 5000);
    expect(p.hp).toBe(HP_MAX - 4); // 화살은 전부 막음
    expect(a.json.some((m) => m.t === 'health' && m.cause === 'blocked')).toBe(true);
    room.hurt(p, 5, 'vindicator', T0 + 6000);
    expect(p.hp).toBe(HP_MAX - 4 - 5); // 도끼는 방패를 무시
  });

  it('활: 활을 들고 화살이 있어야 하고, 24칸 안의 몹을 맞히면 화살 1개가 줄고 모두에게 shot 이 간다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const cow = [...room.animals.animals.values()].find((an) => an.kind === 'cow')!;
    cow.x = p.pos.x + 12;
    cow.z = p.pos.z;
    cow.y = p.pos.y;
    const id = ANIMAL_ID_BASE + cow.id;
    give(p.inv, 'bow', 1);
    const bowSlot = p.inv.findIndex((s) => s?.item === 'bow');
    expect(room.hitMob(ra.idx, id, bowSlot, T0)).toBe('TOO_FAR'); // 손으로는 멀다
    expect(room.shoot(ra.idx, id, 9, T0)).toBe('NO_BOW'); // 빈 칸을 들고는 못 쏜다
    expect(room.shoot(ra.idx, id, bowSlot, T0)).toBe('NO_ARROW');
    give(p.inv, 'arrow', 4);
    const hp0 = cow.hp;
    a.clear();
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 1000)).toBeNull();
    expect(cow.hp).toBe(hp0 - 6);
    expect(countOf(p.inv, 'arrow')).toBe(3);
    expect(a.json.some((m) => m.t === 'shot' && m.id === id)).toBe(true);
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 1300)).toBe('COOLDOWN'); // 1초 간격
    cow.x = p.pos.x + 30;
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 3000)).toBe('TOO_FAR');
    expect(countOf(p.inv, 'arrow')).toBe(3); // 못 맞히면 화살도 안 쓴다
  });
});
