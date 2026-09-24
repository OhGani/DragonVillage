import { ANIMAL_FLAG, ANIMAL_ID_BASE, BABY_MS, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, HERD_SPREAD, INITIAL_ANIMALS, MSG, RESPAWN_BATCH, RESPAWN_EVERY_MS, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, isAnimalSpot, type ServerBinary } from '@dragon-village/shared';
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

describe('마을 동물 (M8-1)', () => {
  it('처음 켜면 숲 잔디 위에 종류별로 풀리고, 저장돼서 다시 켜도 같은 동물이 있다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const total = Object.values(INITIAL_ANIMALS).reduce((a, b) => a + b, 0);
    expect(room.animals.animals.size).toBe(total);
    for (const a of room.animals.animals.values()) {
      expect(isAnimalSpot(a.x, a.z)).toBe(true);
      expect(BLOCKS.get(room.world.getBlock(Math.floor(a.x), Math.floor(a.y) - 1, Math.floor(a.z))).id).toBe('grass');
      expect(a.adultAt).toBeNull();
    }
    expect(storage.listAnimals('123456')).toHaveLength(total);
    const again = makeRoom(storage);
    expect([...again.animals.animals.keys()]).toEqual([...room.animals.animals.keys()]);
  });

  it('무리로 선다: 같은 종류는 첫 마리 곁(HERD_SPREAD)에 모여 있고 집이 같다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const cows = [...room.animals.animals.values()].filter((a) => a.kind === 'cow');
    expect(cows.length).toBe(INITIAL_ANIMALS.cow);
    const near = cows.filter((c) => Math.hypot(c.x - cows[0]!.x, c.z - cows[0]!.z) <= HERD_SPREAD + 0.01 && c.homeX === cows[0]!.homeX);
    expect(near.length).toBeGreaterThanOrEqual(2); // 곁에 못 서면 따로 서기도 하니 최소 둘
  });

  it('사냥으로 줄면 서버를 켤 때 채우고, 돌아가는 중에도 10분마다 둘씩 돌아온다 (길들인 강아지는 세지 않는다) (#106)', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const total = Object.values(INITIAL_ANIMALS).reduce((a, b) => a + b, 0);
    // 소 전부·돼지 하나를 없앤 것처럼 지우고, 강아지 하나는 길들인 것으로
    for (const a of [...room.animals.animals.values()]) if (a.kind === 'cow' || (a.kind === 'pig' && a.id % 2 === 0)) (room.animals.animals.delete(a.id), storage.deleteAnimal(a.id));
    const dog = [...room.animals.animals.values()].find((a) => a.kind === 'dog')!;
    dog.owner = 'b'.repeat(32);
    dog.dirty = true;
    room.flush(T0);
    const again = makeRoom(storage);
    expect(again.animals.wildCountOf('cow')).toBe(INITIAL_ANIMALS.cow);
    expect(again.animals.wildCountOf('pig')).toBe(INITIAL_ANIMALS.pig);
    expect(again.animals.wildCountOf('dog')).toBe(INITIAL_ANIMALS.dog); // 길들인 것 빼고 목표만큼
    expect(again.animals.animals.size).toBe(total + 1);
    // 돌아가는 중: 양을 다 지우면 10분 뒤 둘, 20분 뒤 셋
    const a = inbox();
    const ra = again.join('a'.repeat(32), '아빠', 0, a.send)!;
    again.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    for (const s of [...again.animals.animals.values()]) if (s.kind === 'sheep') again.animals.animals.delete(s.id);
    expect(again.animals.wildCountOf('sheep')).toBe(0);
    for (let t = T0; t <= T0 + RESPAWN_EVERY_MS + 1000; t += 200) again.tick(t);
    expect(again.animals.wildCountOf('sheep')).toBe(RESPAWN_BATCH);
    for (let t = T0 + RESPAWN_EVERY_MS + 1000; t <= T0 + 2 * RESPAWN_EVERY_MS + 2000; t += 200) again.tick(t);
    expect(again.animals.wildCountOf('sheep')).toBe(INITIAL_ANIMALS.sheep);
  });

  it('산책은 집 24칸 안에서, 마을 사람에게 MobsState 로 간다(id 는 100000 부터, 방어전 몹과 한 목록)', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    for (let t = T0; t < T0 + 120_000; t += 200) room.tick(t);
    for (const an of room.animals.animals.values()) expect(Math.hypot(an.x - an.homeX, an.z - an.homeZ)).toBeLessThanOrEqual(25);
    const moved = [...room.animals.animals.values()].filter((an) => Math.hypot(an.x - an.homeX, an.z - an.homeZ) > 0.5);
    expect(moved.length).toBeGreaterThan(0);
    const states = a.bin.filter((m) => m.type === MSG.MobsState);
    expect(states.length).toBeGreaterThan(0);
    const last = states.at(-1)!.msg as { id: number; kind: number }[];
    expect(last.length).toBe(room.animals.animals.size);
    expect(Math.min(...last.map((e) => e.id))).toBeGreaterThanOrEqual(ANIMAL_ID_BASE);
  });

  it('밀을 들면 소가 따라오고, 먹이면 사랑(♥) → 둘이 가까우면 아기 → 20분 뒤 어른. 아기에게 먹이면 빨리 자란다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    const cows = [...room.animals.animals.values()].filter((x) => x.kind === 'cow');
    const [c1, c2] = cows;
    // 소 둘을 광장 사람 옆에 (평지)
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    c1!.x = 70.5;
    c1!.z = 66.5;
    c1!.y = GROUND_Y + 1;
    c1!.homeX = 70.5;
    c1!.homeZ = 66.5;
    c2!.x = 60.5;
    c2!.z = 70.5;
    c2!.y = GROUND_Y + 1;
    c2!.homeX = 60.5;
    c2!.homeZ = 70.5;
    room.giveItems(ra.idx, 'wheat', 5);
    room.setHeld(ra.idx, 'wheat');
    const d0 = Math.hypot(c1!.x - p.pos.x, c1!.z - p.pos.z);
    for (let t = T0; t < T0 + 3000; t += 200) room.tick(t);
    expect(Math.hypot(c1!.x - p.pos.x, c1!.z - p.pos.z)).toBeLessThan(d0 - 1); // 따라온다
    // 먹이기 (보조 탭): 가까이서
    c1!.x = p.pos.x + 1.5;
    c1!.z = p.pos.z;
    c2!.x = p.pos.x - 1.5;
    c2!.z = p.pos.z;
    const slot = p.inv.findIndex((s) => s?.item === 'wheat');
    a.clear();
    expect(room.useMob(ra.idx, ANIMAL_ID_BASE + c1!.id, slot, T0 + 3000)).toBeNull();
    expect(room.useMob(ra.idx, ANIMAL_ID_BASE + c2!.id, slot, T0 + 3100)).toBeNull();
    expect(countOf(p.inv, 'wheat')).toBe(3);
    expect(a.json.filter((m) => m.t === 'mob' && m.ev === 'love').length).toBeGreaterThanOrEqual(2);
    const before = room.animals.countOf('cow');
    room.tick(T0 + 3400);
    expect(room.animals.countOf('cow')).toBe(before + 1);
    const baby = [...room.animals.animals.values()].find((x) => x.kind === 'cow' && x.adultAt !== null)!;
    expect(baby).toBeDefined();
    expect(baby.adultAt).toBe(T0 + 3400 + BABY_MS);
        room.tick(T0 + 3600);
    const st2 = a.bin.filter((m) => m.type === MSG.MobsState).at(-1)!.msg as { id: number; state: number }[];
    const babyEntry = st2.find((e) => e.id === ANIMAL_ID_BASE + baby.id)!;
    expect(babyEntry.state & ANIMAL_FLAG.baby).toBeTruthy();
    // 아기에게 먹이면 2분 빨라진다
    baby.x = p.pos.x + 1;
    baby.z = p.pos.z;
    baby.y = p.pos.y;
    expect(room.useMob(ra.idx, ANIMAL_ID_BASE + baby.id, slot, T0 + 4000)).toBeNull();
    expect(baby.adultAt).toBe(T0 + 3400 + BABY_MS - 120_000);
    // 시간이 지나면 어른
    room.tick(T0 + 3400 + BABY_MS);
    expect(baby.adultAt).toBeNull();
    expect(a.json.some((m) => m.t === 'mob' && m.ev === 'grow')).toBe(true);
  });

  it('강아지: 뼈로 길들이기(확률, 결정론) → 주인을 따라오고, 빈손 탭으로 앉고, 아무도 못 때린다. 소는 때리면 죽고 가죽·고기가 온다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const dog = [...room.animals.animals.values()].find((x) => x.kind === 'dog')!;
    dog.x = p.pos.x + 1.5;
    dog.z = p.pos.z;
    dog.y = p.pos.y;
    room.giveItems(ra.idx, 'bone', 20);
    const slot = p.inv.findIndex((s) => s?.item === 'bone');
    let tries = 0;
    while (dog.owner === null && tries < 20) {
      expect(room.useMob(ra.idx, ANIMAL_ID_BASE + dog.id, slot, T0 + 100 * tries)).toBeNull();
      tries++;
    }
    expect(dog.owner).toBe('a'.repeat(32));
    expect(tries).toBeLessThan(20);
    expect(countOf(p.inv, 'bone')).toBe(20 - tries);
    expect(a.json.some((m) => m.t === 'mob' && m.ev === 'tame')).toBe(true);
    expect(dog.hp).toBe(20);
    // 따라온다: 주인이 남쪽 길로 10칸 가면 다가온다 (길은 평지)
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 78.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 5000);
    dog.x = 64.5;
    dog.z = 68.5;
    dog.y = GROUND_Y + 1;
    for (let t = T0 + 5000; t < T0 + 12_000; t += 200) room.tick(t);
    expect(Math.hypot(dog.x - 64.5, dog.z - 78.5)).toBeLessThan(4);
    // 멀리(동쪽 밭 길) 가면 순간이동
    room.onMove(ra.idx, { x: 100.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 12_000);
    room.tick(T0 + 12_300);
    expect(Math.hypot(dog.x - 100.5, dog.z - 64.5)).toBeLessThan(3);
    // 빈손 탭 → 앉기, 다시 → 일어나기
    const empty = p.inv.findIndex((s) => s === null);
    expect(room.useMob(ra.idx, ANIMAL_ID_BASE + dog.id, empty, T0 + 12_400)).toBeNull();
    expect(dog.sitting).toBe(true);
    expect(room.useMob(ra.idx, ANIMAL_ID_BASE + dog.id, empty, T0 + 12_500)).toBeNull();
    expect(dog.sitting).toBe(false);
    // 길들인 동물은 못 때린다
    expect(room.hitMob(ra.idx, ANIMAL_ID_BASE + dog.id, undefined, T0 + 13_000)).toBe('PET');
    // 소는 때리면 죽는다 (맨손 1 × 10)
    const cow = [...room.animals.animals.values()].find((x) => x.kind === 'cow')!;
    cow.x = p.pos.x + 1.5;
    cow.z = p.pos.z;
    cow.y = p.pos.y;
    const xp0 = room.xpOf(ra.idx);
    let t = T0 + 20_000;
    for (let i = 0; i < 10; i++, t += 500) {
      cow.x = p.pos.x + 1.5;
      cow.z = p.pos.z;
      expect(room.hitMob(ra.idx, ANIMAL_ID_BASE + cow.id, undefined, t)).toBeNull();
    }
    expect(room.animals.animals.has(cow.id)).toBe(false);
    expect(storage.listAnimals('123456').some((r) => r.id === cow.id)).toBe(false);
    expect(countOf(p.inv, 'beef')).toBeGreaterThanOrEqual(1);
    expect(room.xpOf(ra.idx)).toBe(xp0 + 1);
    // 저장 → 다시 켜도 강아지 주인·자리 유지
    room.flush(t);
    const again = makeRoom(storage);
    const dog2 = again.animals.animals.get(dog.id)!;
    expect(dog2.owner).toBe('a'.repeat(32));
    expect(Math.hypot(dog2.x - dog.x, dog2.z - dog.z)).toBeLessThan(0.01);
  });
});
