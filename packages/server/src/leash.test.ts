import { BLOCKS, RECIPES } from '@dragon-village/shared/data';
import { ANIMAL_ID_BASE, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, LEAD, LEASH_POST_R, LEASH_SNAP, VILLAGE_GEN_VERSION, canLeash, countOf, give } from '@dragon-village/shared';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 90_000_000;
const G = GROUND_Y + 1;

function setup(storage = new Storage(':memory:')) {
  const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
  const json: { t: string; [k: string]: unknown }[] = [];
  const ra = room.join('a'.repeat(32), '아빠', 0, (d) => {
    if (typeof d === 'string') json.push(JSON.parse(d));
  })!;
  const p = room.players.get(ra.idx)!;
  const moveTo = (x: number, z: number, now: number) => room.onMove(ra.idx, { x, y: G, z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, now);
  // 광장 한가운데로 소 한 마리를 데려다 놓는다 (평평한 조약돌 바닥)
  const cow = [...room.animals.animals.values()].find((a) => a.kind === 'cow')!;
  cow.x = 64.5;
  cow.z = 60.5;
  cow.y = G;
  cow.target = null;
  moveTo(64.5, 62.5, T0);
  const slotOf = (item: string) => p.inv.findIndex((s) => s?.item === item);
  const run = (from: number, ms: number) => {
    for (let t = from; t <= from + ms; t += 100) room.animals.tick(t);
  };
  const dist = (x: number, z: number) => Math.hypot(cow.x - x, cow.z - z);
  return { storage, room, ra, p, cow, json, moveTo, slotOf, run, dist, id: ANIMAL_ID_BASE + cow.id };
}

describe('끈 (#297, 아빠 2026-11-13)', () => {
  it('실 4 + 슬라임 볼 1 → 끈 2. 주민·보트·수레는 못 맨다', () => {
    const r = RECIPES.require('lead');
    expect(r.in).toEqual({ string: 4, slime_ball: 1 });
    expect(r.out).toEqual({ lead: 2 });
    expect(['cow', 'pig', 'sheep', 'chicken', 'dog', 'horse', 'cat', 'camel'].every((k) => canLeash(k as never))).toBe(true);
    expect(['villager', 'boat', 'minecart', 'zombie'].some((k) => canLeash(k as never))).toBe(false);
  });

  it('끈을 들고 동물을 탭하면 매여서 따라온다. 빈손으로 탭하면 풀리고 끈이 돌아온다', () => {
    const { room, ra, p, cow, json, moveTo, slotOf, run, dist, id } = setup();
    expect(room.useMob(ra.idx, id, slotOf('lead'), T0)).not.toBeNull(); // 끈이 없다 → 평소처럼 (먹이가 아니에요)
    give(p.inv, LEAD, 2);
    expect(room.useMob(ra.idx, id, slotOf('lead'), T0 + 100)).toBeNull();
    expect(countOf(p.inv, LEAD)).toBe(1);
    expect(room.animals.leashes()).toEqual([{ id, by: ra.idx, post: null }]);
    expect(json.filter((m) => m.t === 'leash').at(-1)!.list).toEqual([{ id, by: ra.idx, post: null }]);
    // 가까이 있으면 서 있다
    const x0 = cow.x,
      z0 = cow.z;
    run(T0 + 200, 3000);
    expect([cow.x, cow.z]).toEqual([x0, z0]);
    // 8칸 걸어가면 따라온다 (끈 길이 안쪽까지)
    moveTo(64.5, 70.5, T0 + 4000);
    run(T0 + 4000, 6000);
    expect(dist(64.5, 70.5)).toBeLessThan(3.2);
    expect(room.animals.leashes().length).toBe(1);
    // 빈손으로 탭 → 풀린다, 끈은 가방으로
    expect(room.useMob(ra.idx, id, undefined, T0 + 11_000)).toBeNull();
    expect(room.animals.leashes()).toEqual([]);
    expect(countOf(p.inv, LEAD)).toBe(2);
  });

  it('너무 멀어지면 끈이 풀리고 끈은 가방으로 돌아온다', () => {
    const { room, ra, p, moveTo, slotOf, run, id, json } = setup();
    give(p.inv, LEAD, 1);
    expect(room.useMob(ra.idx, id, slotOf('lead'), T0)).toBeNull();
    expect(countOf(p.inv, LEAD)).toBe(0);
    moveTo(64.5 + LEASH_SNAP + 12, 62.5, T0 + 500); // 순간이동하듯 멀리
    run(T0 + 500, 1000);
    expect(room.animals.leashes()).toEqual([]);
    expect(countOf(p.inv, LEAD)).toBe(1);
    expect(json.some((m) => m.t === 'error' && m.code === 'LEASH_SNAP')).toBe(true);
  });

  it('끌고 있을 때 울타리를 탭하면 거기 묶인다: 둘레 안에서만 돌아다니고, 서버를 다시 켜도 묶여 있고, 울타리를 부수면 풀려 끈이 돌아온다', () => {
    const storage = new Storage(':memory:');
    const { room, ra, p, cow, slotOf, run, dist, id } = setup(storage);
    give(p.inv, LEAD, 1);
    give(p.inv, 'oak_fence', 1);
    expect(room.tieLeash(ra.idx, 63, G, 61)).toBe('NOT_FENCE');
    room.onBlockChange(ra.idx, { seq: 1, x: 63, y: G, z: 61, id: 'oak_fence' }, T0);
    expect(room.tieLeash(ra.idx, 63, G, 61)).toBe('NO_LEASH'); // 끌고 있는 동물이 없다
    expect(room.useMob(ra.idx, id, slotOf('lead'), T0 + 100)).toBeNull();
    expect(room.tieLeash(ra.idx, 63, G, 61)).toBeNull();
    expect(room.animals.leashes()).toEqual([{ id, by: null, post: [63, G, 61] }]);
    expect(countOf(p.inv, LEAD)).toBe(0);
    // 2분 동안 산책해도 끈 길이 밖으로 안 나간다
    let far = 0;
    for (let t = T0 + 200; t < T0 + 120_000; t += 100) {
      room.animals.tick(t);
      far = Math.max(far, dist(63.5, 61.5));
    }
    expect(far).toBeLessThanOrEqual(LEASH_POST_R + 0.5);
    // 저장 → 다시 켜기
    room.animals.save();
    const again = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    expect(again.animals.leashes()).toEqual([{ id, by: null, post: [63, G, 61] }]);
    // 울타리를 부수면 풀리고 끈은 부순 사람에게
    room.onBlockChange(ra.idx, { seq: 2, x: 63, y: G, z: 61, id: 'air' }, T0 + 130_000);
    expect(BLOCKS.get(room.world.getBlock(63, G, 61)).id).toBe('air');
    expect(room.animals.leashes()).toEqual([]);
    expect(countOf(p.inv, LEAD)).toBe(1);
    void cow;
    void run;
  });

  it('끌던 사람이 나가면 동물은 풀리고 끈은 그 사람 가방에 남는다. 남이 끄는 동물은 못 푼다', () => {
    const storage = new Storage(':memory:');
    const { room, ra, p, slotOf, id } = setup(storage);
    const rb = room.join('b'.repeat(32), '아들', 1, () => {})!;
    room.onMove(rb.idx, { x: 64.5, y: G, z: 62.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    give(p.inv, LEAD, 1);
    expect(room.useMob(ra.idx, id, slotOf('lead'), T0)).toBeNull();
    expect(room.useMob(rb.idx, id, undefined, T0 + 100)).toBe('LEASH_OTHER');
    room.leave(ra.idx);
    expect(room.animals.leashes()).toEqual([]);
    const back = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    expect(countOf(room.players.get(back.idx)!.inv, LEAD)).toBe(1);
  });
});
