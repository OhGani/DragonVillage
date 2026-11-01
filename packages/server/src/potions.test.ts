/** 물약 효과 (#245): 마시기·던지기·틱 — 서버가 진실 */
import { countOf, DEFAULT_VILLAGE_SEED, FLAG_GROUND, HP_MAX, VILLAGE_GEN_VERSION, decodeServerBinary, type ServerBinary, give } from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 1_000_000;

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
  const a = inbox(),
    b = inbox();
  const ia = room.join('a'.repeat(32), '아빠', 0, a.send)!.idx;
  const ib = room.join('b'.repeat(32), '아들', 1, b.send)!.idx;
  a.clear();
  b.clear();
  return { room, a, b, ia, ib };
}

/** 가방에 넣고 그 칸 번호 */
function slotOf(room: VillageRoom, idx: number, item: string, n = 1): number {
  const p = room.players.get(idx)!;
  give(p.inv, item, n);
  return p.inv.findIndex((s) => s?.item === item);
}

const effectsOf = (box: ReturnType<typeof inbox>) => box.json.filter((m) => m.t === 'effects').at(-1)?.list as { id: string; level: number; leftMs: number }[] | undefined;
const hpMsgs = (box: ReturnType<typeof inbox>) => box.json.filter((m) => m.t === 'health') as unknown as { hp: number; cause: string }[];

describe('물약 마시기 (#245)', () => {
  it('치유: 바로 하트가 차고 빈 유리병이 돌아온다. 빈손·물병·다른 아이템은 거절', () => {
    const { room, a, ia } = setup();
    const p = room.players.get(ia)!;
    room.hurt(p, 10, 'zombie', T0);
    expect(p.hp).toBe(10);
    expect(room.drink(ia, 0, T0)).toBe('NOT_POTION');
    const bread = slotOf(room, ia, 'bread');
    expect(room.drink(ia, bread, T0)).toBe('NOT_POTION');
    const slot = slotOf(room, ia, 'potion.healing', 2);
    a.clear();
    expect(room.drink(ia, slot, T0 + 100)).toBeNull();
    expect(p.hp).toBe(14); // I = 4
    expect(countOf(p.inv, 'potion.healing')).toBe(1);
    expect(countOf(p.inv, 'glass_bottle')).toBe(1);
    expect(hpMsgs(a).at(-1)).toMatchObject({ hp: 14, cause: 'potion' });
    const strong = slotOf(room, ia, 'potion.healing.strong');
    expect(room.drink(ia, strong, T0 + 200)).toBeNull();
    expect(p.hp).toBe(HP_MAX); // II = 8, 20 을 넘지 않는다
    const water = slotOf(room, ia, 'water_bottle');
    expect(room.drink(ia, water, T0 + 300)).toBeNull(); // 물맛
    expect(a.json.find((m) => m.t === 'error' && m.code === 'PLAIN_WATER')).toBeTruthy();
  });

  it('신속: 효과 목록이 오고 3분(레드스톤 8분) 뒤 틱에서 떨어진다. 고통은 마시면 내가 아프다', () => {
    const { room, a, ia } = setup();
    const p = room.players.get(ia)!;
    expect(room.drink(ia, slotOf(room, ia, 'potion.speed'), T0)).toBeNull();
    expect(effectsOf(a)).toEqual([{ id: 'speed', level: 1, leftMs: 180_000 }]);
    expect(room.drink(ia, slotOf(room, ia, 'potion.leaping.long'), T0 + 1000)).toBeNull();
    expect(effectsOf(a)).toEqual([{ id: 'speed', level: 1, leftMs: 179_000 }, { id: 'jump_boost', level: 1, leftMs: 480_000 }]);
    room.tick(T0 + 180_500);
    expect(effectsOf(a)).toEqual([{ id: 'jump_boost', level: 1, leftMs: 300_500 }]);
    room.tick(T0 + 500_000);
    expect(effectsOf(a)).toEqual([]);
    expect(p.effects).toEqual([]);
    expect(room.drink(ia, slotOf(room, ia, 'potion.harming'), T0 + 500_100)).toBeNull();
    expect(p.hp).toBe(HP_MAX - 6);
    expect(hpMsgs(a).at(-1)).toMatchObject({ hp: 14, cause: 'potion' });
  });

  it('재생은 2.5초마다 1, 독은 1.25초마다 1 — 독으론 죽지 않는다(체력 1에서 멈춤). 죽으면 효과가 사라진다', () => {
    const { room, a, ia } = setup();
    const p = room.players.get(ia)!;
    room.hurt(p, 10, 'zombie', T0);
    expect(room.drink(ia, slotOf(room, ia, 'potion.regeneration'), T0)).toBeNull();
    room.tick(T0 + 2000);
    expect(p.hp).toBe(10);
    room.tick(T0 + 2600);
    expect(p.hp).toBe(11); // 재생
    room.tick(T0 + 2900);
    expect(p.hp).toBe(11);
    const { room: r2, a: a2, ia: i2 } = setup();
    const q = r2.players.get(i2)!;
    expect(r2.drink(i2, slotOf(r2, i2, 'potion.poison'), T0)).toBeNull();
    for (let t = T0; t <= T0 + 24_000; t += 250) r2.tick(t);
    expect(q.hp).toBe(1); // 20 → 1 (1.25초 × 19)
    expect(hpMsgs(a2).filter((m) => m.cause === 'poison').length).toBe(19);
    for (let t = T0 + 24_250; t <= T0 + 60_000; t += 250) r2.tick(t);
    expect(hpMsgs(a2).every((m) => m.hp >= 1)).toBe(true); // 독으론 0 이 안 된다 (1 에서 멈춰 저절로 1 차면 다시 1 깎인다)
    expect(effectsOf(a2)).toEqual([]); // 45초 지나 떨어졌다
    expect(q.hp).toBeGreaterThan(5); // 그 뒤로 저절로 찬다
    expect(r2.drink(i2, slotOf(r2, i2, 'potion.speed'), T0 + 61_000)).toBeNull();
    r2.hurt(q, 50, 'zombie', T0 + 61_100);
    expect(q.hp).toBe(HP_MAX); // 다시 일어남
    expect(q.effects).toEqual([]);
    expect(effectsOf(a2)).toEqual([]);
    void a;
  });

  it('화염 저항은 블레이즈·가스트 불덩이를 통째로 막고, 거북 장군은 맞는 피해를 40% 로, 힘은 손 공격 +3', () => {
    const { room, a, ia } = setup();
    const p = room.players.get(ia)!;
    expect(room.drink(ia, slotOf(room, ia, 'potion.fire_resistance'), T0)).toBeNull();
    room.hurt(p, 5, 'blaze', T0 + 100);
    expect(p.hp).toBe(HP_MAX);
    expect(hpMsgs(a).at(-1)).toMatchObject({ cause: 'fireproof' });
    room.hurt(p, 5, 'zombie', T0 + 200);
    expect(p.hp).toBe(HP_MAX - 5); // 좀비는 그대로
    expect(room.drink(ia, slotOf(room, ia, 'potion.turtle_master'), T0 + 300)).toBeNull();
    room.hurt(p, 10, 'zombie', T0 + 400);
    expect(p.hp).toBe(HP_MAX - 5 - 4);
    // 힘: 원정에서 좀비를 맨손으로 — 1 + 3
    const storage = new Storage(':memory:');
    const { room: r2, ia: i2 } = setup(storage);
    expect(r2.startExpedition(i2, 'grass_island', T0)).toBeNull();
    r2.tick(T0 + 200);
    const q = r2.players.get(i2)!;
    const z = r2.mobSys!.spawnKind('zombie', q.pos.x + 1.5, q.pos.y, q.pos.z);
    expect(r2.drink(i2, slotOf(r2, i2, 'potion.strength'), T0 + 300)).toBeNull();
    expect(r2.hitMob(i2, z.id, undefined, T0 + 400)).toBeNull();
    expect(z.hp).toBe(20 - 4);
  });

  it('투명화: 몹이 나를 못 찾는다. 같은 세계 모두에게 playerFx', () => {
    const storage = new Storage(':memory:');
    const { room, a, ia } = setup(storage);
    expect(room.startExpedition(ia, 'grass_island', T0)).toBeNull();
    room.tick(T0 + 200);
    const p = room.players.get(ia)!;
    room.mobSys!.spawnKind('zombie', p.pos.x + 1, p.pos.y, p.pos.z);
    expect(room.drink(ia, slotOf(room, ia, 'potion.invisibility'), T0 + 300)).toBeNull();
    expect(a.json.find((m) => m.t === 'playerFx')).toEqual({ t: 'playerFx', idx: ia, invisible: true });
    a.clear();
    for (let t = T0 + 300; t <= T0 + 8000; t += 100) room.tick(t);
    expect(hpMsgs(a).filter((m) => m.cause === 'zombie')).toEqual([]);
    expect(p.hp).toBe(HP_MAX);
    room.tick(T0 + 300 + 180_001);
    expect(a.json.find((m) => m.t === 'playerFx')).toEqual({ t: 'playerFx', idx: ia, invisible: false });
    for (let t = T0 + 180_400; t <= T0 + 186_000; t += 100) room.tick(t);
    expect(p.hp).toBeLessThan(HP_MAX); // 다시 보인다
  });
});

describe('물약 던지기 (#245)', () => {
  it('나쁜 물약(고통·독·감속)은 떨어진 자리 4칸 안 몹에게만 — 사람은 안 아프다. 병은 안 돌아온다', () => {
    const storage = new Storage(':memory:');
    const { room, a, ia } = setup(storage);
    expect(room.startExpedition(ia, 'grass_island', T0)).toBeNull();
    room.tick(T0 + 200);
    const p = room.players.get(ia)!;
    const sys = room.mobSys!;
    const near = sys.spawnKind('zombie', p.pos.x + 2, p.pos.y, p.pos.z);
    const far = sys.spawnKind('zombie', p.pos.x + 9, p.pos.y, p.pos.z);
    expect(room.throwPotion(ia, 0, { x: 0, y: -1, z: 0 }, T0 + 300)).toBe('NOT_SPLASH');
    expect(room.throwPotion(ia, slotOf(room, ia, 'potion.harming'), { x: 0, y: -1, z: 0 }, T0 + 300)).toBe('NOT_SPLASH'); // 마시는 건 못 던진다
    const slot = slotOf(room, ia, 'splash_potion.harming');
    a.clear();
    expect(room.throwPotion(ia, slot, { x: 0, y: -1, z: 0 }, T0 + 300)).toBeNull(); // 발밑에
    expect(countOf(p.inv, 'splash_potion.harming')).toBe(0);
    expect(countOf(p.inv, 'glass_bottle')).toBe(0);
    expect(near.hp).toBe(20 - 6);
    expect(far.hp).toBe(20);
    expect(p.hp).toBe(HP_MAX);
    const sp = a.json.find((m) => m.t === 'splash') as unknown as { hits: number; potion: string; to: { x: number; y: number; z: number } };
    expect(sp).toMatchObject({ idx: ia, potion: 'harming', hits: 1 });
    expect(Math.abs(sp.to.x - p.pos.x)).toBeLessThan(0.01);
    expect(sp.to.y).toBeLessThan(p.pos.y + 1.7);
    expect(room.throwPotion(ia, slotOf(room, ia, 'splash_potion.poison'), { x: 0, y: -1, z: 0 }, T0 + 400)).toBeNull();
    expect(near.poisonUntil).toBe(T0 + 400 + 45_000);
    expect(far.poisonUntil).toBeUndefined();
    sys.mobs.delete(far.id);
    p.pos.x -= 30; // 멀리 떨어져 보면
    const hp0 = near.hp;
    for (let t = T0 + 400; t <= T0 + 5000; t += 100) room.tick(t);
    expect(near.hp).toBe(hp0 - 3); // 1.25초마다 1 (1650·2900·4150)
    // 잔류형 (#246): 바로 퍼지지 않고 바닥에 구름 — 1초마다 안의 몹에게 걸고 맞은 만큼 줄어든다
    p.pos.x += 30;
    near.x = p.pos.x + 1; // 그동안 돌아다닌 좀비를 옆에
    near.y = p.pos.y;
    near.z = p.pos.z;
    a.clear();
    expect(room.throwPotion(ia, slotOf(room, ia, 'lingering_potion.slowness'), { x: 0, y: -1, z: 0 }, T0 + 6000)).toBeNull();
    expect(near.slowUntil).toBeUndefined(); // 던진 순간엔 아직
    expect(a.json.find((m) => m.t === 'splash')).toMatchObject({ form: 'lingering', hits: 0 });
    const cloud = a.json.find((m) => m.t === 'cloud') as unknown as { id: number; potion: string; radius: number; leftMs: number; y: number };
    expect(cloud).toMatchObject({ potion: 'slowness', radius: 3, leftMs: 30_000 });
    expect(cloud.y).toBeLessThanOrEqual(p.pos.y + 0.01); // 바닥 위
    room.tick(T0 + 6000);
    expect(near.slowUntil).toBe(T0 + 6000 + 23_000); // 1분 30초의 1/4
    expect((a.json.filter((m) => m.t === 'cloud').at(-1) as unknown as { radius: number }).radius).toBe(2.5); // 하나 맞아 반 칸 줄었다
    p.pos.x -= 30; // 다시 멀리
    for (let t = T0 + 6250; t <= T0 + 37_000; t += 250) room.tick(t);
    expect(a.json.find((m) => m.t === 'cloudGone')).toEqual({ t: 'cloudGone', id: cloud.id }); // 맞을 때마다 줄다 늦어도 30초면 사라진다
    expect(room.clouds.size).toBe(0);
  });

  it('좋은 잔류형(치유)은 구름 안의 사람에게 1초마다 반씩(2) — 구름은 맞은 만큼 줄어 곧 사라진다', () => {
    const { room, a, b, ia, ib } = setup();
    const p = room.players.get(ia)!,
      q = room.players.get(ib)!;
    q.pos = { ...p.pos, x: p.pos.x + 1.5 };
    room.hurt(p, 10, 'zombie', T0);
    room.hurt(q, 10, 'zombie', T0);
    a.clear();
    b.clear();
    expect(room.throwPotion(ia, slotOf(room, ia, 'lingering_potion.healing'), { x: 0, y: -1, z: 0 }, T0 + 100)).toBeNull();
    expect(p.hp).toBe(10); // 던진 순간엔 아직
    expect(b.json.find((m) => m.t === 'cloud')).toMatchObject({ potion: 'healing', radius: 3 }); // 친구에게도 구름이 보인다
    room.tick(T0 + 100);
    expect(p.hp).toBe(12);
    expect(q.hp).toBe(12);
    expect(hpMsgs(b).at(-1)).toMatchObject({ hp: 12, cause: 'potion' });
    room.tick(T0 + 600);
    expect(p.hp).toBe(12); // 1초 안엔 다시 안 건다
    room.tick(T0 + 1100);
    expect(p.hp).toBe(14);
    expect((a.json.filter((m) => m.t === 'cloud').at(-1) as unknown as { radius: number }).radius).toBeCloseTo(1 - 1 / 30, 1); // 둘씩 두 번 맞아 2칸 줄었다
    for (let t = T0 + 1100; t <= T0 + 3000; t += 250) room.tick(t);
    expect(a.json.find((m) => m.t === 'cloudGone')).toBeTruthy();
    expect(p.hp).toBe(16); // 세 번째도 걸리고 사라졌다 (반지름 0 아래). 3초 뒤부턴 저절로 찬다
    expect(room.clouds.size).toBe(0);
  });

  it('좋은 물약(치유·신속)은 4칸 안 사람들(나 포함)에게 — 몹에겐 아무것도', () => {
    const { room, a, b, ia, ib } = setup();
    const p = room.players.get(ia)!,
      q = room.players.get(ib)!;
    q.pos = { ...p.pos, x: p.pos.x + 2 };
    room.hurt(p, 10, 'zombie', T0);
    room.hurt(q, 10, 'zombie', T0);
    a.clear();
    b.clear();
    expect(room.throwPotion(ia, slotOf(room, ia, 'splash_potion.healing'), { x: 0, y: -1, z: 0 }, T0 + 100)).toBeNull();
    expect(p.hp).toBe(14);
    expect(q.hp).toBe(14);
    expect(hpMsgs(b).at(-1)).toMatchObject({ hp: 14, cause: 'potion' });
    expect(a.json.find((m) => m.t === 'splash')).toMatchObject({ hits: 2 });
    expect(b.json.find((m) => m.t === 'splash')).toMatchObject({ idx: ia, hits: 2 });
    expect(room.throwPotion(ia, slotOf(room, ia, 'splash_potion.speed'), { x: 0, y: -1, z: 0 }, T0 + 200)).toBeNull();
    expect(effectsOf(b)).toEqual([{ id: 'speed', level: 1, leftMs: 180_000 }]);
    expect(effectsOf(a)).toEqual([{ id: 'speed', level: 1, leftMs: 180_000 }]);
    void FLAG_GROUND;
  });
});
