import { ANIMAL_ID_BASE, CAMEL_CACTUS_HEAL, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, PHANTOM_INSOMNIA_MS, PHANTOM_MAX, VILLAGE_GEN_VERSION, give } from '@dragon-village/shared';
import { BLOCKS, MOBS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { MobSystem, type MobTarget } from './mobs';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 96_000_000;
const makeRoom = (storage: Storage) => new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
const inbox = () => {
  const json: { t: string; [k: string]: unknown }[] = [];
  return { json, send: (d: Uint8Array | string) => (typeof d === 'string' ? json.push(JSON.parse(d)) : 0) };
};
const quietHooks = (players: () => MobTarget[], hurt: string[] = [], json: { t: string; [k: string]: unknown }[] = []) => ({ players, hurt: (_i: number, _a: number, c: string) => hurt.push(c), knock: () => {}, broadcast: () => {}, json: (o: object) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} });

describe('낙타 (아빠가 보낸 그림·나무위키 2026-11-07)', () => {
  it('안장 → 내 낙타, 빈손 탭 → 탄다. 친구는 뒤에 타고(한 명만), 앞 사람이 내리면 같이 내린다. 선인장은 다친 낙타를 치료', () => {
    const room = makeRoom(new Storage(':memory:'));
    const a = inbox(),
      b = inbox(),
      c = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    const rc = room.join('c'.repeat(32), '친구', 2, c.send)!;
    const p = room.players.get(ra.idx)!;
    for (const [r, dx] of [[ra, 0], [rb, 1], [rc, 2]] as const) room.onMove(r.idx, { x: 64.5 + dx, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const camel = [...room.animals.animals.values()].find((an) => an.kind === 'camel' && an.adultAt === null)!;
    expect(camel).toBeDefined();
    Object.assign(camel, { x: 66, y: p.pos.y, z: 64.5 });
    const cid = ANIMAL_ID_BASE + camel.id;
    // 선인장 치료
    camel.hp = 10;
    give(p.inv, 'cactus', 1);
    expect(room.useMob(ra.idx, cid, p.inv.findIndex((s) => s?.item === 'cactus'), T0 + 500)).toBeNull();
    expect(camel.hp).toBe(10 + CAMEL_CACTUS_HEAL);
    give(p.inv, 'saddle', 1);
    expect(room.useMob(ra.idx, cid, p.inv.findIndex((s) => s?.item === 'saddle'), T0 + 1000)).toBeNull();
    expect(room.useMob(ra.idx, cid, undefined, T0 + 2000)).toBeNull();
    expect(p.riding).toEqual({ id: cid, dragon: 'camel' });
    expect(room.rideBehind(rb.idx, ra.idx)).toBeNull();
    expect(room.players.get(rb.idx)!.riding).toEqual({ id: cid, dragon: 'camel', back: true });
    expect(room.rideBehind(rc.idx, ra.idx)).toBe('OCCUPIED'); // 둘까지
    expect(room.rideBehind(rc.idx, rb.idx)).toBe('NO_CAMEL'); // 뒷사람 뒤엔 못 탄다
    // 근접 몹은 낙타 위 사람에게 안 닿는다, 화살은 닿는다
    const hpBefore = p.hp;
    room.hurt(p, 4, 'zombie', T0 + 2500);
    expect(p.hp).toBe(hpBefore);
    room.hurt(p, 4, 'skeleton', T0 + 2600);
    expect(p.hp).toBeLessThan(hpBefore);
    // 뒷사람이 내려도 낙타는 그대로
    expect(room.dismount(rb.idx)).toBeNull();
    expect(camel.ridden).toBe(ra.idx);
    expect(room.rideBehind(rb.idx, ra.idx)).toBeNull();
    // 앞사람이 내리면 둘 다
    b.json.length = 0;
    expect(room.dismount(ra.idx)).toBeNull();
    expect(room.players.get(rb.idx)!.riding).toBeNull();
    expect(b.json.some((m) => m.t === 'dismount' && m.idx === rb.idx)).toBe(true);
    expect(camel.ridden).toBeNull();
  });
});

describe('북극곰 (2026-11-07)', () => {
  it('설원엔 엄마 + 아기 한 쌍. 멀리 있으면 안 덤비고, 아기 곰 5칸 안에 들어가면 엄마가 덤빈다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const hurt: string[] = [];
    const me: MobTarget = { idx: 0, x: 20.5, y: GROUND_Y + 1, z: 20.5, eyeY: GROUND_Y + 2.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, wildAnimals: { polar_bear: 2 }, safe: { x: 64, y: GROUND_Y + 1, z: 64 } };
    const sys = new MobSystem(arena, BLOCKS, MOBS, quietHooks(() => [me], hurt), { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const bears = [...sys.mobs.values()].filter((m) => m.kind === 'polar_bear');
    const cubs = [...sys.mobs.values()].filter((m) => m.kind === 'polar_bear_cub');
    expect(bears).toHaveLength(2);
    expect(cubs).toHaveLength(2);
    const bear = bears[0]!;
    const cub = cubs.reduce((b, c) => (Math.hypot(c.x - bear.x, c.z - bear.z) < Math.hypot(b.x - bear.x, b.z - bear.z) ? c : b));
    expect(Math.hypot(cub.x - bear.x, cub.z - bear.z)).toBeLessThan(5); // 엄마 곁
    // 곰 8칸 옆(아기에게선 멀리) — 안 덤빈다
    Object.assign(me, { x: bear.x + 8, z: bear.z + 8, y: bear.y, eyeY: bear.y + 1.6 });
    for (let t = T0; t < T0 + 3000; t += 100) sys.tick(t);
    expect(bear.huntIdx).toBeUndefined();
    // 아기 곁으로
    Object.assign(me, { x: cub.x + 2, z: cub.z, y: cub.y, eyeY: cub.y + 1.6 });
    for (let t = T0 + 3000; t < T0 + 9000; t += 100) sys.tick(t);
    expect(hurt).toContain('polar_bear');
  });
});

describe('팬텀 (2026-11-07)', () => {
  it('팬텀이 오는 원정지의 밤, 오래 안 잔 사람 머리 위가 트였으면 하늘에서 온다 (최대 4), 잤으면 안 온다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const me: MobTarget = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 40.5, eyeY: GROUND_Y + 2.6, insomnia: false };
    for (let y = GROUND_Y + 3; y < room.world.sizeY; y++) room.world.setBlock(64, y, 40, 0);
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: ['zombie'], phantoms: true, den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, quietHooks(() => [me], [], json), { autoSpawn: true, aggroRange: 24, goal: null, quiet: true });
    for (let t = T0; t < T0 + 5 * 60_000; t += 1000) sys.tick(t);
    expect(sys.countOf('phantom')).toBe(0); // 잤다
    me.insomnia = true;
    for (let t = T0 + 5 * 60_000; t < T0 + 15 * 60_000; t += 1000) sys.tick(t);
    const n = sys.countOf('phantom');
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(PHANTOM_MAX);
    expect(json.some((m) => m.t === 'mob' && m.ev === 'screech')).toBe(true);
    expect(PHANTOM_INSOMNIA_MS).toBe(60 * 60_000); // 위키 "현실 시간으로 1시간"
  });
});

describe('공격적 몹 (아빠가 보낸 나무위키 목록 2026-11-07)', () => {
  const setup = (extra: Record<string, unknown> = {}) => {
    const room = makeRoom(new Storage(':memory:'));
    const w = room.world;
    for (let x = 50; x <= 80; x++) for (let z = 50; z <= 80; z++) for (let y = GROUND_Y + 1; y <= GROUND_Y + 6; y++) w.setBlock(x, y, z, 0); // 트인 마당
    const hurt: string[] = [];
    const json: { t: string; [k: string]: unknown }[] = [];
    const knocks: string[] = [];
    const blocks: string[] = [];
    const me: MobTarget = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 70.5, eyeY: GROUND_Y + 2.6, yaw: Math.PI, pitch: 0 }; // 남쪽(+z)을 본다
    const arena = { world: w, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, ...extra };
    const hooks = { ...quietHooks(() => [me], hurt, json), knock: (_i: number, _x: number, _z: number, _n: number, why?: string) => knocks.push(why ?? ''), setBlock: (x: number, y: number, z: number, id: string) => blocks.push(`${x},${y},${z}:${id}`) };
    const sys = new MobSystem(arena, BLOCKS, MOBS, hooks, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    return { room, w, sys, me, hurt, json, knocks, blocks };
  };

  it('크리킹: 밤이면 삐걱이 심장 곁에 나오고, 쳐다보면 멈추고, 때려도 안 죽고, 심장을 부수면 사라진다', () => {
    const heart = { x: 64, y: GROUND_Y + 2, z: 60 };
    const t = setup({ hearts: [heart] });
    t.w.setBlock(heart.x, heart.y, heart.z, BLOCKS.numOf('creaking_heart'));
    t.sys.tick(T0);
    const c = [...t.sys.mobs.values()].find((m) => m.kind === 'creaking')!;
    expect(c).toBeDefined();
    expect(Math.hypot(c.x - heart.x, c.z - heart.z)).toBeLessThan(7);
    // 쳐다보면 꼼짝 못 한다
    const dx = c.x - t.me.x,
      dz = c.z - t.me.z;
    t.me.yaw = Math.atan2(-dx, -dz);
    const at = { x: c.x, z: c.z };
    for (let n = T0 + 100; n < T0 + 3000; n += 100) t.sys.tick(n);
    expect([c.x, c.z]).toEqual([at.x, at.z]);
    // 등을 돌리면 다가온다
    t.me.yaw += Math.PI;
    for (let n = T0 + 3000; n < T0 + 6000; n += 100) t.sys.tick(n);
    expect(Math.hypot(c.x - t.me.x, c.z - t.me.z)).toBeLessThan(Math.hypot(at.x - t.me.x, at.z - t.me.z));
    // 때려도 안 죽는다
    const hp = c.hp;
    Object.assign(t.me, { x: c.x, z: c.z + 1.5 });
    t.sys.hit({ ...t.me, eyeY: c.y + 1.6 }, c.id, 50, T0 + 7000, 4);
    expect(c.hp).toBe(hp);
    // 심장을 부수면 사라진다
    t.w.setBlock(heart.x, heart.y, heart.z, 0);
    t.sys.heartBroken(heart.x, heart.y, heart.z);
    expect(t.sys.countOf('creaking')).toBe(0);
  });

  it('좀벌레: 맞으면 둘레 벌레 먹은 돌에서 친구가 나온다 (블록은 공기로 — 모두에게 알림)', () => {
    const t = setup();
    for (const [x, z] of [[60, 66], [61, 66], [62, 66], [63, 66]]) t.w.setBlock(x, GROUND_Y + 1, z, BLOCKS.numOf('infested_stone'));
    t.sys.silverfishFrom(62, GROUND_Y + 1, 68);
    const s = [...t.sys.mobs.values()].find((m) => m.kind === 'silverfish')!;
    Object.assign(t.me, { x: s.x, z: s.z + 1.2 });
    t.sys.hit({ ...t.me, eyeY: s.y + 1.6 }, s.id, 2, T0, 4);
    expect(t.sys.countOf('silverfish')).toBe(1 + 3); // SILVERFISH_CALL
    expect(t.blocks).toHaveLength(3);
    expect(t.blocks.every((b) => b.endsWith(':air'))).toBe(true);
  });

  it('셜커: 꼼짝 않고 탄을 쏘면 붕 뜨고, 껍데기를 닫고 있으면 단단하다', () => {
    const t = setup();
    const sh = t.sys.spawnKind('shulker', 64.5, GROUND_Y + 1, 62.5);
    // 사람이 사거리 밖이면 껍데기를 닫고 있다 — 그때 맞으면 1/5
    t.me.z = 79.5;
    t.sys.tick(T0);
    t.sys.hit({ ...t.me, x: 64.5, z: 64.2 }, sh.id, 10, T0 + 10, 4);
    expect(sh.hp).toBe(30 - 2);
    t.me.z = 70.5; // 사거리 안으로 → 뚜껑을 열고 쏜다
    for (let n = T0 + 100; n < T0 + 8000; n += 100) t.sys.tick(n);
    expect([sh.x, sh.z]).toEqual([64.5, 62.5]); // 안 움직인다
    expect(t.knocks).toContain('shulker');
  });

  it('벡스는 1분 뒤 사라지고, 마그마 큐브는 잡으면 작은 셋으로', () => {
    const t = setup();
    t.sys.spawnKind('vex', 64.5, GROUND_Y + 2, 60.5);
    for (let n = T0; n < T0 + 61_000; n += 500) t.sys.tick(n);
    expect(t.sys.countOf('vex')).toBe(0);
    const mc = t.sys.spawnKind('magma_cube', 64.5, GROUND_Y + 1, 69.2);
    t.sys.hit(t.me, mc.id, 99, T0 + 62_000, 4);
    expect(t.sys.countOf('small_magma_cube')).toBe(3);
  });
});

describe('아빠 2026-11-07: 놓은 블록은 그대로 돌려받기 · 원정 곳곳의 몹', () => {
  it('내가 놓은 돌은 부수면 돌 그대로, 처음부터 있던 돌은 조약돌 (마인크래프트)', () => {
    const room = makeRoom(new Storage(':memory:'));
    const a = inbox();
    const ia = room.join('a'.repeat(32), '아빠', 0, a.send)!.idx;
    const p = room.players.get(ia)!;
    room.giveItems(ia, 'stone', 4);
    room.onMove(ia, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const count = (id: string) => p.inv.reduce((n, s) => n + (s?.item === id ? s.count : 0), 0);
    room.onBlockChange(ia, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'stone' }, T0 + 100);
    expect(count('stone')).toBe(3);
    room.onBlockChange(ia, { seq: 2, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, T0 + 1000);
    expect(count('stone')).toBe(4); // 돌 그대로
    expect(count('cobblestone')).toBe(0);
    // 처음부터 있던 돌 (땅속)
    room.world.setBlock(65, GROUND_Y, 64, BLOCKS.numOf('stone'));
    room.onBlockChange(ia, { seq: 3, x: 65, y: GROUND_Y, z: 64, id: 'air' }, T0 + 2000);
    expect(count('cobblestone')).toBe(1);
  });

  it('원정을 시작하면 그곳 밤 몹이 곳곳에 (시작 자리 28칸 밖) 처음부터 서 있다 — 밤 몹 수엔 안 센다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const a = inbox();
    const ia = room.join('a'.repeat(32), '아빠', 0, a.send)!.idx;
    expect(room.startExpedition(ia, 'grass_island', T0)).toBeNull();
    room.tick(T0 + 100);
    const sys = room.mobSys!;
    const sp = room.expedition!.spawn;
    const roam = [...sys.mobs.values()].filter((m) => m.roam);
    expect(roam.length).toBe(10);
    for (const m of roam) {
      expect(['zombie', 'creeper', 'enderman', 'baby_zombie', 'charged_creeper']).toContain(m.kind);
      expect(Math.hypot(m.x - sp.x, m.z - sp.z)).toBeGreaterThanOrEqual(28);
    }
    expect(sys.regularCount).toBe(0);
  });
});
