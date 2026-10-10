import { ANIMAL_FLAG, ANIMAL_ID_BASE, BABY_MS, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, EGG_EVERY_MS, HERD_SPREAD, INITIAL_ANIMALS, MSG, RESPAWN_BATCH, RESPAWN_EVERY_MS, VILLAGE_GEN_VERSION, WOOL_REGROW_MS, countOf, decodeServerBinary, give, isAnimalSpot, type ServerBinary } from '@dragon-village/shared';
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
    // 돌아가는 중: 양을 다 지우면 10분 뒤 둘, 20분 뒤 넷 (목표 5, #129)
    const a = inbox();
    const ra = again.join('a'.repeat(32), '아빠', 0, a.send)!;
    again.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    for (const s of [...again.animals.animals.values()]) if (s.kind === 'sheep') again.animals.animals.delete(s.id);
    expect(again.animals.wildCountOf('sheep')).toBe(0);
    for (let t = T0; t <= T0 + RESPAWN_EVERY_MS + 1000; t += 200) again.tick(t);
    expect(again.animals.wildCountOf('sheep')).toBe(RESPAWN_BATCH);
    for (let t = T0 + RESPAWN_EVERY_MS + 1000; t <= T0 + 2 * RESPAWN_EVERY_MS + 2000; t += 200) again.tick(t);
    expect(again.animals.wildCountOf('sheep')).toBe(Math.min(INITIAL_ANIMALS.sheep!, 2 * RESPAWN_BATCH));
  });

  it('펫 원정 동행 (#145): 출발하면 가까운 내 펫이 같이 가고(마을 목록에서 빠짐, 원정 사람들에게 companions), 돌아오면 옆에 온다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 44.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const dogs = [...room.animals.animals.values()].filter((d) => d.kind === 'dog');
    const near = dogs[0]!,
      far = dogs[1]!,
      sitting = dogs[2]!;
    for (const d of [near, far, sitting]) d.owner = p.token;
    near.x = p.pos.x + 2;
    near.z = p.pos.z;
    far.x = p.pos.x + 60;
    far.z = p.pos.z;
    sitting.x = p.pos.x - 2;
    sitting.z = p.pos.z;
    sitting.sitting = true;
    a.clear();
    expect(room.startExpedition(ra.idx, 'grass_island', T0)).toBeNull();
    expect(near.away).toBe(true);
    expect(far.away).toBe(false); // 멀리 있던 건 안 따라온다
    expect(sitting.away).toBe(false); // 앉아 있으면 집 지킨다
    const comp = a.json.filter((m) => m.t === 'companions').at(-1) as unknown as { list: { id: number; owner: number }[] };
    expect(comp.list).toEqual([{ id: ANIMAL_ID_BASE + near.id, kind: expect.any(Number), name: null, owner: ra.idx }]);
    expect(room.animals.entries(T0).some((m) => m.id === ANIMAL_ID_BASE + near.id)).toBe(false); // 마을에선 안 보인다
    room.animals.tick(T0 + 1000);
    // 원정에서는 서버가 몹 목록에 실어 따라다니게 하고, 주인 옆에 온 좀비를 문다 (#147)
    const sys = room.mobSys!;
    expect(sys.companions.size).toBe(1);
    expect(sys.entries().some((m) => m.id === ANIMAL_ID_BASE + near.id)).toBe(true);
    sys.spawnKind('zombie', p.pos.x + 2.5, p.pos.y, p.pos.z);
    const zombie = [...sys.mobs.values()].find((m) => m.kind === 'zombie')!;
    for (let t = T0 + 100; t <= T0 + 4000; t += 100) room.tick(t);
    expect(zombie.hp).toBeLessThan(20); // 펫이 물었다
    const pet = sys.companions.get(ANIMAL_ID_BASE + near.id)!;
    expect(Math.hypot(pet.x - p.pos.x, pet.z - p.pos.z)).toBeLessThan(6); // 주인 곁에 있다
    // 돌아오면 (늦은 귀환으로 포탈 조건 생략) 주인 옆에
    expect(room.returnHome(ra.idx, T0 + 5000, true)).toBeNull();
    expect(sys.companions.size).toBe(0); // 원정 목록에서도 빠진다
    expect(near.away).toBe(false);
    expect(Math.hypot(near.x - p.pos.x, near.z - p.pos.z)).toBeLessThan(3);
    expect(room.animals.entries(T0 + 5000).some((m) => m.id === ANIMAL_ID_BASE + near.id)).toBe(true);
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

  it('양털 깎기: 가위를 들고 양을 탭 → 양털 1~3, 깎인 표시, 5분 뒤 다시. 닭은 6분마다 달걀을 품고 빈손 탭으로 받는다 (#108)', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    give(p.inv, 'shears', 1);
    const shears = p.inv.findIndex((s) => s?.item === 'shears');
    const sheep = [...room.animals.animals.values()].find((an) => an.kind === 'sheep')!;
    sheep.x = p.pos.x + 1.5;
    sheep.z = p.pos.z;
    sheep.y = p.pos.y;
    const sid = ANIMAL_ID_BASE + sheep.id;
    expect(room.useMob(ra.idx, sid, shears, T0 + 1000)).toBeNull();
    const wool = countOf(p.inv, 'wool');
    expect(wool).toBeGreaterThanOrEqual(1);
    expect(wool).toBeLessThanOrEqual(3);
    expect(room.useMob(ra.idx, sid, shears, T0 + 2000)).toBe('NO_WOOL');
    room.tick(T0 + 2500);
    const st = a.bin.filter((m) => m.type === MSG.MobsState).at(-1)!.msg as { id: number; state: number }[];
    expect((st.find((e) => e.id === sid)!.state & ANIMAL_FLAG.sheared) !== 0).toBe(true);
    sheep.x = p.pos.x + 1.5;
    sheep.z = p.pos.z;
    expect(room.useMob(ra.idx, sid, shears, T0 + WOOL_REGROW_MS + 3000)).toBeNull();
    // 우유 (#163): 빈 양동이를 들고 어른 소를 탭 → 양동이 1 → 우유 양동이 1. 아기 소는 안 나온다
    give(p.inv, 'bucket', 2);
    const bucketSlot = p.inv.findIndex((s) => s?.item === 'bucket');
    const cow = [...room.animals.animals.values()].find((an) => an.kind === 'cow' && an.adultAt === null)!;
    cow.x = p.pos.x + 1.5;
    cow.z = p.pos.z;
    cow.y = p.pos.y;
    const cid = ANIMAL_ID_BASE + cow.id;
    expect(room.useMob(ra.idx, cid, bucketSlot, T0 + 4000)).toBeNull();
    expect(countOf(p.inv, 'milk_bucket')).toBe(1);
    expect(countOf(p.inv, 'bucket')).toBe(1);
    const calf = [...room.animals.animals.values()].find((an) => an.kind === 'cow' && an.adultAt !== null);
    if (calf) {
      calf.x = p.pos.x + 1.5;
      calf.z = p.pos.z;
      calf.y = p.pos.y;
      expect(room.useMob(ra.idx, ANIMAL_ID_BASE + calf.id, p.inv.findIndex((s) => s?.item === 'bucket'), T0 + 5000)).toBe('NO_MILK');
    }
    // 달걀
    const hen = [...room.animals.animals.values()].find((an) => an.kind === 'chicken')!;
    hen.x = p.pos.x + 1.5;
    hen.z = p.pos.z;
    hen.y = p.pos.y;
    hen.lastEggAt = T0;
    hen.eggs = 0;
    const hid = ANIMAL_ID_BASE + hen.id;
    expect(room.useMob(ra.idx, hid, undefined, T0 + 3000)).toBe('NO_EGG');
    for (let t = T0 + 3000; t <= T0 + EGG_EVERY_MS + 4000; t += 1000) {
      room.tick(t);
      hen.x = p.pos.x + 1.5;
      hen.z = p.pos.z;
      hen.y = p.pos.y;
    }
    expect(hen.eggs).toBe(1);
    expect(room.useMob(ra.idx, hid, undefined, T0 + EGG_EVERY_MS + 5000)).toBeNull();
    expect(countOf(p.inv, 'egg')).toBe(1);
    expect(hen.eggs).toBe(0);
    // 저장 → 다시 켜도 깎인 시각·달걀 유지
    room.flush(T0 + EGG_EVERY_MS + 6000);
    const again = makeRoom(storage);
    expect(again.animals.animals.get(sheep.id)!.woolAt).toBe(sheep.woolAt);
  });

  it('말 (#166): 안장을 들고 탭 → 내 말, 빈손 탭 → 탄다(목록에서 빠짐, 원정엔 안 따라감), 내리면 그 자리에 선다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const horse = [...room.animals.animals.values()].find((an) => an.kind === 'horse' && an.adultAt === null)!;
    expect(horse).toBeDefined();
    horse.x = p.pos.x + 1.5;
    horse.z = p.pos.z;
    horse.y = p.pos.y;
    const hid = ANIMAL_ID_BASE + horse.id;
    expect(room.useMob(ra.idx, hid, undefined, T0 + 500)).toBe('NOT_FOOD'); // 남의(야생) 말은 빈손으로 못 탄다
    give(p.inv, 'saddle', 1);
    const saddle = p.inv.findIndex((s) => s?.item === 'saddle');
    expect(room.useMob(ra.idx, hid, saddle, T0 + 1000)).toBeNull();
    expect(horse.owner).toBe(p.token);
    expect(countOf(p.inv, 'saddle')).toBe(0);
    expect(room.useMob(ra.idx, hid, undefined, T0 + 2000)).toBeNull(); // 탄다
    expect(p.riding).toEqual({ id: hid, dragon: 'horse' });
    expect(room.animals.entries(T0 + 2000).some((e) => e.id === hid)).toBe(false); // 타는 동안 목록에서 빠진다
    expect(a.json.some((m) => m.t === 'mount')).toBe(true);
    expect(room.skill(ra.idx, 'beam', T0 + 2500)).toBe('NOT_RIDING'); // 말은 빔이 없다
    expect(room.animals.takeAlong(p.token, p.pos.x, p.pos.z, 24).some((c) => c.kindName === 'horse')).toBe(false);
    room.onMove(ra.idx, { x: 70.5, y: GROUND_Y + 1, z: 70.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 3000);
    expect(room.dismount(ra.idx)).toBeNull();
    expect(p.riding).toBeNull();
    expect(horse.ridden).toBeNull();
    expect([horse.x, horse.z]).toEqual([70.5, 70.5]); // 내린 자리에 선다
    expect(room.animals.entries(T0 + 3000).some((e) => e.id === hid)).toBe(true);
  });

  it('펫 이름 (#109): 주인만, 목록의 이름만. pets 는 받는 사람마다 mine 이 다르고 저장된다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    const dog = [...room.animals.animals.values()].find((an) => an.kind === 'dog')!;
    const id = ANIMAL_ID_BASE + dog.id;
    expect(room.nameMob(ra.idx, id, '초코')).toBe('NOT_MINE'); // 아직 야생
    dog.owner = 'a'.repeat(32);
    dog.dirty = true;
    expect(room.nameMob(rb.idx, id, '초코')).toBe('NOT_MINE');
    expect(room.nameMob(ra.idx, id, '멍멍이123')).toBe('BAD_NAME');
    a.clear();
    b.clear();
    expect(room.nameMob(ra.idx, id, '초코')).toBeNull();
    const pa = a.json.find((m) => m.t === 'pets')!.list as { id: number; name: string | null; mine: boolean }[];
    const pb = b.json.find((m) => m.t === 'pets')!.list as { id: number; name: string | null; mine: boolean }[];
    expect(pa.find((p) => p.id === id)).toEqual({ id, name: '초코', mine: true });
    expect(pb.find((p) => p.id === id)).toEqual({ id, name: '초코', mine: false });
    room.flush(T0);
    const again = makeRoom(storage);
    expect(again.animals.animals.get(dog.id)!.name).toBe('초코');
    const c = inbox();
    again.join('a'.repeat(32), '아빠', 0, c.send);
    expect((c.json.find((m) => m.t === 'pets')!.list as { name: string | null }[]).some((p) => p.name === '초코')).toBe(true);
  });
});
