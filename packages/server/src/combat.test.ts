import { ANIMAL_ID_BASE, DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, HP_MAX, VILLAGE_GEN_VERSION, countOf, decodeServerBinary, give, type ServerBinary, GUARD_MAX_MS, meleeBonus, knockbackFactor, rollDrops, HIT_REACH, MOB_STATE } from '@dragon-village/shared';
import { BLOCKS, EXPEDITIONS, MOBS } from '@dragon-village/shared/data';
import { Expedition } from './expedition';
import { describe, expect, it } from 'vitest';
import { MobSystem } from './mobs';
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
    // 🛡️ 막기 (#118): 누르는 동안 근접 피해 전부 막음, 15초 지나면 저절로 풀려 절반, 방패 없으면 못 켠다
    p.hp = HP_MAX;
    a.clear();
    expect(room.guard(ra.idx, true, T0 + 7000)).toBeNull();
    expect(a.json.filter((m) => m.t === 'guard')).toEqual([{ t: 'guard', idx: ra.idx, on: true }]); // 모두에게 (#144)
    expect(room.guard(ra.idx, true, T0 + 7500)).toBeNull(); // 5초마다 다시 보내는 건 조용히 (시간은 연장된다)
    expect(a.json.filter((m) => m.t === 'guard')).toHaveLength(1);
    p.guardUntil = T0 + 7000 + GUARD_MAX_MS; // 아래 '15초 지나면 풀림' 검사를 위해 연장은 되돌린다
    room.hurt(p, 6, 'zombie', T0 + 8000);
    expect(p.hp).toBe(HP_MAX);
    room.hurt(p, 5, 'vindicator', T0 + 8500);
    expect(p.hp).toBe(HP_MAX - 5); // 도끼는 막아도 뚫는다
    room.hurt(p, 6, 'zombie', T0 + 7000 + GUARD_MAX_MS + 1);
    expect(p.hp).toBe(HP_MAX - 5 - 3); // 시간이 지나 풀림 → 절반
    expect(room.guard(ra.idx, false, T0 + 30_000)).toBeNull();
    expect(a.json.filter((m) => m.t === 'guard').at(-1)).toEqual({ t: 'guard', idx: ra.idx, on: false });
    p.equip = { helmet: null, chestplate: null, leggings: null, boots: null, shield: null };
    expect(room.guard(ra.idx, true, T0 + 31_000)).toBe('NO_SHIELD');
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
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 1000, 1000)).toBeNull(); // 가득 당김 (#119)
    expect(cow.hp).toBe(hp0 - 6);
    expect(countOf(p.inv, 'arrow')).toBe(3);
    expect(a.json.some((m) => m.t === 'shot' && m.id === id)).toBe(true);
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 1100)).toBe('COOLDOWN'); // 0.3초 간격
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 2000, 0)).toBeNull(); // 안 당기고 탭 → 약한 화살 2
    expect(cow.hp).toBe(hp0 - 6 - 2);
    expect(countOf(p.inv, 'arrow')).toBe(2);
    cow.x = p.pos.x + 30;
    expect(room.shoot(ra.idx, id, bowSlot, T0 + 3000)).toBe('TOO_FAR');
    expect(countOf(p.inv, 'arrow')).toBe(2); // 못 맞히면 화살도 안 쓴다
  });

  it('스켈레톤·약탈자는 6칸에서 화살을 쏜다: 피해와 함께 arrow(몹 → 사람) 가 모두에게 간다, 좀비는 안 간다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    sys.spawnKind('skeleton', 64.5, GROUND_Y + 1, 59.5); // 5칸 앞
    sys.spawnKind('zombie', 64.5, GROUND_Y + 1, 65.8); // 붙어 있음
    for (let t = T0; t < T0 + 5000; t += 100) sys.tick(t);
    expect(hurt).toContain('skeleton');
    expect(hurt).toContain('zombie');
    const arrows = json.filter((m) => m.t === 'arrow') as unknown as { from: { z: number }; to: { z: number } }[];
    expect(arrows.length).toBeGreaterThanOrEqual(1);
    expect(arrows.length).toBe(hurt.filter((c) => c === 'skeleton').length); // 화살 하나 = 스켈레톤 공격 하나
    expect(arrows[0]!.from.z).toBeLessThan(arrows[0]!.to.z); // 몹에서 사람 쪽으로
  });

  it('고양이 (2026-11-06): 따라온 고양이 곁에선 크리퍼가 안 터지고 달아난다(하악!). 고양이는 몹을 물지 않는다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    sys.addCompanion({ id: 40_001, kind: 'cat', owner: 0, name: null, x: 65.5, y: GROUND_Y + 1, z: 64.5 });
    const creeper = sys.spawnKind('creeper', 64.5, GROUND_Y + 1, 61.5);
    for (let t = T0; t < T0 + 6000; t += 100) sys.tick(t);
    expect(hurt).not.toContain('creeper');
    expect(sys.mobs.has(creeper.id)).toBe(true);
    expect(creeper.hp).toBe(MOBS.get('creeper').hp); // 고양이는 안 문다
    expect(Math.hypot(creeper.x - 64.5, creeper.z - 64.5)).toBeGreaterThan(4);
    expect(json.some((m) => m.t === 'mob' && m.ev === 'hiss')).toBe(true);
    // 고양이가 없으면 터진다
    sys.removeCompanionsOf(0);
    for (let t = T0 + 6000; t < T0 + 20_000 && sys.mobs.has(creeper.id); t += 100) sys.tick(t);
    expect(hurt).toContain('creeper');
  });

  it('인챈트 효과 (#231): 강타 검은 좀비에 +4, 약탈은 드롭이 더, 밀치기는 더 멀리', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const rewards: { item: string; count: number }[][] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: () => {}, broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: (_i, drops) => rewards.push(drops), bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const z1 = sys.spawnKind('zombie', 64.5, GROUND_Y + 1, 62.5);
    const held = 'iron_sword.ench.smite.2';
    expect(sys.hit(me, z1.id, 7, T0, HIT_REACH, { bonus: (k) => meleeBonus(held, k), knock: knockbackFactor('iron_sword.ench.knockback.2'), looting: 0 })).toBeNull();
    expect(z1.hp).toBe(20 - 11); // 7 + 강타 II 4
    expect(z1.z).toBeLessThan(62.5 - 1.2); // 0.7 × 2.6 만큼 밀렸다
    const z2 = sys.spawnKind('zombie', 64.5, GROUND_Y + 1, 62.5);
    sys.hit(me, z2.id, 100, T0 + 1000, HIT_REACH, { looting: 3 });
    const z3 = sys.spawnKind('zombie', 64.5, GROUND_Y + 1, 62.5);
    sys.hit(me, z3.id, 100, T0 + 2000);
    expect(rewards.length).toBe(2);
    const sum = (d: { count: number }[]) => d.reduce((n, x) => n + x.count, 0);
    expect(sum(rewards[0]!)).toBeGreaterThanOrEqual(sum(rollDrops(MOBS.get('zombie'), 5, z2.id)));
    expect(rollDrops(MOBS.get('zombie'), 5, 77, 3).reduce((n, x) => n + x.count, 0)).toBeGreaterThanOrEqual(rollDrops(MOBS.get('zombie'), 5, 77).reduce((n, x) => n + x.count, 0));
  });

  it('엔더맨 (#222, 아들 14차 2번): 쳐다보면 화나고(stare), 화나면 3초마다 사람 옆으로 순간이동(teleport), 안 보면 가만히', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    // 사람은 64.5,64.5 에서 -z 를 본다 (yaw 0) → 10칸 앞(z 54.5)의 엔더맨을 쳐다본다
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6, yaw: 0, pitch: 0 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const em = sys.spawnKind('enderman', 64.5, GROUND_Y + 1, 54.5);
    me.yaw = Math.PI; // 등지고 있으면 아무 일 없다
    for (let t = T0; t < T0 + 2000; t += 100) sys.tick(t);
    expect(json.some((m) => m.t === 'mob' && m.ev === 'stare')).toBe(false);
    expect(em.z).toBeCloseTo(54.5, 3);
    me.yaw = 0; // 쳐다본다
    for (let t = T0 + 2000; t < T0 + 9000; t += 100) sys.tick(t);
    expect(json.some((m) => m.t === 'mob' && m.ev === 'stare')).toBe(true);
    expect(json.some((m) => m.t === 'mob' && m.ev === 'teleport')).toBe(true);
    expect(Math.hypot(em.x - me.x, em.z - me.z)).toBeLessThan(5); // 옆으로 왔다
    expect(hurt).toContain('enderman');
  });

  it('눈 골렘 (#223, 아들 14차 5번): 설원에 시작부터 셋, 먼저 안 덤비고 때리면 눈덩이(arrow snow) — 피해 없이 knock 만', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const knocks: { idx: number; x: number; z: number }[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, spawns: [{ kind: 'snow_golem' as const, x: 64.5, y: GROUND_Y + 1, z: 61.5 }] };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), knock: (idx, x, z) => knocks.push({ idx, x, z }), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    expect(sys.countOf('snow_golem')).toBe(1);
    const golem = [...sys.mobs.values()][0]!;
    for (let t = T0; t < T0 + 3000; t += 100) sys.tick(t);
    expect(knocks.length).toBe(0); // 먼저 안 덤빈다
    expect(sys.hit(me, golem.id, 1, T0 + 3000)).toBeNull();
    for (let t = T0 + 3100; t < T0 + 8000; t += 100) sys.tick(t);
    expect(knocks.length).toBeGreaterThanOrEqual(1);
    expect(knocks[0]!.z).toBeGreaterThan(0); // 골렘에서 사람 쪽(+z)으로 밀린다
    expect(hurt).toEqual([]); // 하트는 안 닳는다
    expect(json.filter((m) => m.t === 'arrow' && m.snow === true).length).toBe(knocks.length);
    expect(MOBS.get('snow_golem').drops.map((d) => d.item)).toEqual(['snowball']);
  });

  it('네더 (v1.1-3, #161): 좀비 피글린은 때리기 전엔 안 덤비고 맞으면 20초 화난다, 가스트는 떠서 14칸에서 쏜다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const pig = sys.spawnKind('zombified_piglin', 64.5, GROUND_Y + 1, 65.8); // 붙어 있음
    for (let t = T0; t < T0 + 5000; t += 100) sys.tick(t);
    expect(hurt).toEqual([]); // 중립: 가만히
    expect(sys.hit(me, pig.id, 1, T0 + 5000)).toBeNull();
    for (let t = T0 + 5100; t < T0 + 10000; t += 100) sys.tick(t);
    expect(hurt.filter((c) => c === 'zombified_piglin').length).toBeGreaterThanOrEqual(2); // 맞으니 문다
    const n = hurt.length;
    for (let t = T0 + 10000; t < T0 + 40000; t += 100) sys.tick(t); // 20초 지나면 다시 가만히
    const after = hurt.length - n;
    expect(after).toBeLessThan(25); // 30초 내내 물었으면 25번
    // 가스트: 땅 12칸 앞에 넣으면 사람 위 6칸으로 떠올라 14칸 안에서 쏜다 (arrow 연출)
    const ghast = sys.spawnKind('ghast', 64.5, GROUND_Y + 1, 52.5);
    const before = json.filter((m) => m.t === 'arrow').length;
    for (let t = T0 + 40000; t < T0 + 50000; t += 100) sys.tick(t);
    expect(ghast.y).toBeGreaterThan(GROUND_Y + 4);
    expect(hurt).toContain('ghast');
    expect(json.filter((m) => m.t === 'arrow').length).toBeGreaterThan(before);
  });

  it('엔드 (v1.1-4, #162): 엔더 드래곤은 bosses.json 대로 hp 200·경험치 500·알 드롭, 떠서 내려꽂히며 물고, 엔더맨을 부른다', () => {
    expect(MOBS.get('ender_dragon')).toMatchObject({ name: '엔더 드래곤', hp: 300, damage: 7, xp: 500 }); // 더 세게 (#224)
    expect(MOBS.get('ender_dragon').drops.map((d) => d.item)).toEqual(['dragon_egg', 'dragon_breath']);
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: { x: 64, y: GROUND_Y + 1, z: 58 }, boss: 'ender_dragon' as const, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const d = sys.boss!;
    expect(d.kind).toBe('ender_dragon');
    expect(sys.bossAwake).toBe(false); // 24칸 안에 오면 깬다 (여기선 9칸 → 첫 틱에)
    expect(d.y).toBeCloseTo(GROUND_Y + 1 + 7, 0); // 자리 위 7칸에 떠 있다
    let maxY = 0,
      minY = 99;
    for (let t = T0; t < T0 + 20000; t += 100) {
      sys.tick(t);
      if (t === T0) expect(sys.bossAwake).toBe(true);
      maxY = Math.max(maxY, d.y);
      minY = Math.min(minY, d.y);
    }
    expect(maxY - minY).toBeGreaterThan(4); // 오르내린다
    expect(hurt.filter((c) => c === 'ender_dragon').length).toBeGreaterThanOrEqual(2); // 내려올 때 문다
    expect(sys.minions.size).toBeGreaterThan(0);
    expect([...sys.mobs.values()].some((m) => m.kind === 'enderman')).toBe(true);
  });

  it('좀비 주민 (#244, 아들 7차): 좀비는 사람보다 가까운 주민을 물어 좀비 주민으로 만들고, 황금 사과를 먹이면 45초 서서 떨다 주민으로 돌아온다(에메랄드 1 + 경험치 10)', () => {
    const room = makeRoom(new Storage(':memory:'));
    const json: { t: string; [k: string]: unknown }[] = [];
    const hurt: string[] = [];
    const rewards: { idx: number; drops: { item: string; count: number }[]; xp: number }[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 48.5, eyeY: GROUND_Y + 1 + 1.6 }; // 17칸 떨어져 본다 (#248 뒤 주민이 빨리 좀비가 돼 13칸이면 12초 안에 사람 가까이 온다)
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, spawns: [{ kind: 'villager' as const, x: 64.5, y: GROUND_Y + 1, z: 66.5 }] };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: (idx, drops, xp) => rewards.push({ idx, drops, xp }), bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const v = [...sys.mobs.values()].find((m) => m.kind === 'villager')!;
    expect(v.home).toBeTruthy();
    const vid = v.id;
    sys.spawnKind('zombie', 64.5, GROUND_Y + 1, 65.8); // 주민 옆에
    for (let t = T0; t < T0 + 12_000; t += 100) sys.tick(t); // #248 뒤 4씩 다섯 번이면 12초 안에 끝난다 (15초까지 돌리면 그새 좀비 둘이 사람까지 온다)
    expect(hurt).toEqual([]); // 사람은 멀어서 안 물렸다
    expect(json.filter((m) => m.t === 'mob' && m.ev === 'hit' && m.id === vid).length).toBeGreaterThanOrEqual(5); // 4씩 다섯 번 (#248)
    expect(json.find((m) => m.t === 'mob' && m.ev === 'zombify')).toMatchObject({ id: vid, mob: 'zombie_villager' });
    expect(json.find((m) => m.t === 'error' && m.code === 'VILLAGER_ZOMBIFIED')).toBeTruthy();
    const zv = sys.mobs.get(vid)!;
    expect(zv.kind).toBe('zombie_villager');
    expect(zv.hp).toBe(20);
    expect(zv.home).toBeTruthy(); // 집은 기억한다
    // 황금 사과: 멀면 안 되고, 가까이서 먹이면 cure 상태
    expect(sys.cure(me, 9999, T0 + 15_000)).toBe('NO_MOB');
    expect(sys.cure(me, vid, T0 + 15_000)).toBe('TOO_FAR');
    const zombie = [...sys.mobs.values()].find((m) => m.kind === 'zombie')!;
    expect(sys.cure(me, zombie.id, T0 + 15_000)).toBe('NOT_ZOMBIE_VILLAGER');
    me.z = zv.z - 1.2;
    expect(sys.cure(me, vid, T0 + 15_000)).toBeNull();
    expect(sys.cure(me, vid, T0 + 15_100)).toBe('ALREADY_CURING');
    expect(json.find((m) => m.t === 'mob' && m.ev === 'cure')).toMatchObject({ id: vid });
    sys.mobs.delete(zombie.id); // 좀비는 치웠다고 치고
    hurt.length = 0;
    for (let t = T0 + 15_100; t < T0 + 59_000; t += 100) sys.tick(t);
    expect(hurt).toEqual([]); // 돌아오는 동안 안 문다
    expect(zv.state).toBe(MOB_STATE.cure);
    expect(zv.kind).toBe('zombie_villager');
    for (let t = T0 + 59_000; t < T0 + 62_000; t += 100) sys.tick(t);
    expect(zv.kind).toBe('villager');
    expect(zv.cureAt).toBeUndefined();
    expect(json.find((m) => m.t === 'mob' && m.ev === 'cured')).toMatchObject({ id: vid, mob: 'villager' });
    expect(rewards).toEqual([{ idx: 0, drops: [{ item: 'emerald', count: 1 }], xp: 10 }]);
    expect(sys.hit(me, vid, 5, T0 + 62_000)).toBe('VILLAGER'); // 다시 못 때린다
  });
});

describe('몹끼리 겹치지 않게 (아빠 2026-11-05)', () => {
  it('한 점에 몰아 넣은 좀비 넷이 사람에게 다가가면서 서로 떨어지고, 그래도 때린다', () => {
    const room = makeRoom(new Storage(':memory:'));
    const hurt: string[] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: () => {}, reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const zs = [0, 1, 2, 3].map((i) => sys.spawnKind('zombie', 64.5 + i * 0.01, GROUND_Y + 1, 58.5));
    for (let t = T0; t < T0 + 6000; t += 100) sys.tick(t);
    for (let i = 0; i < zs.length; i++)
      for (let j = i + 1; j < zs.length; j++) expect(Math.hypot(zs[i]!.x - zs[j]!.x, zs[i]!.z - zs[j]!.z)).toBeGreaterThan(0.55); // 몸 폭 0.6
    expect(hurt.filter((c) => c === 'zombie').length).toBeGreaterThan(0);
  });
});

describe('원정 사냥 동물 (2026-11-05)', () => {
  const setup = (wildAnimals: Record<string, number> = {}, safe: { x: number; y: number; z: number } | null = null) => {
    const room = makeRoom(new Storage(':memory:'));
    const hurt: string[] = [];
    const rewards: { item: string; count: number }[][] = [];
    const me = { idx: 0, x: 64.5, y: GROUND_Y + 1, z: 64.5, eyeY: GROUND_Y + 1 + 1.6 };
    const arena = { world: room.world, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, wildAnimals, safe };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: (_i, _a, cause) => hurt.push(cause), broadcast: () => {}, json: () => {}, reward: (_i, drops) => rewards.push(drops), bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 40, goal: null, quiet: true });
    return { sys, me, hurt, rewards };
  };

  it('wildAnimals 대로 땅 위에 무리로 풀리고, 사람 시작 자리 16칸 안엔 없고, 밤 몹 상한에 안 센다', () => {
    const { sys } = setup({ gazelle: 6, bison: 3 }, { x: 64.5, y: GROUND_Y + 1, z: 64.5 });
    expect(sys.countOf('gazelle')).toBe(6);
    expect(sys.countOf('bison')).toBe(3);
    for (const m of sys.mobs.values()) {
      expect(Math.hypot(m.x - 64.5, m.z - 64.5)).toBeGreaterThanOrEqual(15);
      expect(sys.groundAt(m.x, m.z, m.y)).toBe(m.y); // 땅에 서 있다 (공중·땅속 아님)
    }
    expect(sys.regularCount).toBe(0);
    const again = setup({ gazelle: 6, bison: 3 }, { x: 64.5, y: GROUND_Y + 1, z: 64.5 }).sys; // 같은 시드면 같은 자리
    expect([...again.mobs.values()].map((m) => `${m.kind}${m.x.toFixed(2)},${m.z.toFixed(2)}`)).toEqual([...sys.mobs.values()].map((m) => `${m.kind}${m.x.toFixed(2)},${m.z.toFixed(2)}`));
  });

  it('가젤은 안 덤비고, 때리면 무리째 맞은 쪽 반대로 달아난다. 잡으면 양고기', () => {
    const { sys, me, hurt, rewards } = setup();
    const g = sys.spawnKind('gazelle', 64.5, GROUND_Y + 1, 62.5);
    const friend = sys.spawnKind('gazelle', 66.5, GROUND_Y + 1, 61.5);
    const behind = sys.spawnKind('gazelle', 64.5, GROUND_Y + 1, 67.5); // 사람 뒤쪽(무리 반대편) — 사람을 가로질러 뛰면 안 된다
    for (let t = T0; t < T0 + 2000; t += 100) sys.tick(t);
    expect(hurt).toEqual([]);
    g.x = 64.5;
    g.z = 62.5;
    const f0 = Math.hypot(friend.x - me.x, friend.z - me.z);
    expect(sys.hit(me, g.id, 2, T0 + 2000)).toBeNull();
    for (let t = T0 + 2100; t < T0 + 4000; t += 100) sys.tick(t);
    expect(Math.hypot(g.x - me.x, g.z - me.z)).toBeGreaterThan(6);
    expect(g.z).toBeLessThan(62.5); // 사람(z 64.5)에게서 멀어지는 쪽(-z)
    expect(Math.hypot(friend.x - me.x, friend.z - me.z)).toBeGreaterThan(f0 + 3); // 무리도 같이
    expect(behind.z).toBeGreaterThan(67.5); // 뒤쪽 가젤은 뒤로(+z) 달아난다
    for (let i = 0; i < 10 && sys.mobs.has(g.id); i++) {
      g.x = 64.5;
      g.z = 62.5;
      sys.hit(me, g.id, 4, T0 + 5000 + i * 1000);
    }
    expect(sys.mobs.has(g.id)).toBe(false);
    expect(rewards.flat().some((d) => d.item === 'mutton')).toBe(true);
  });

  it('들소는 7칸 안에 오면 먼저 들이받고, 멀리 있으면 안 온다', () => {
    const near = setup();
    near.sys.spawnKind('bison', 64.5, GROUND_Y + 1, 58.5); // 6칸
    for (let t = T0; t < T0 + 5000; t += 100) near.sys.tick(t);
    expect(near.hurt).toContain('bison');
    const far = setup();
    const b = far.sys.spawnKind('bison', 64.5, GROUND_Y + 1, 49.5); // 15칸
    for (let t = T0; t < T0 + 5000; t += 100) far.sys.tick(t);
    expect(far.hurt).toEqual([]);
    expect(Math.hypot(b.x - 64.5, b.z - 64.5)).toBeGreaterThan(7);
  });

  it('잡혀서 줄면 20초마다 사람에게서 28~44칸 떨어진 곳에 무리로 다시 채운다 (정한 수까지만)', () => {
    const { sys, me } = setup({ gazelle: 6 }, { x: 64.5, y: GROUND_Y + 1, z: 64.5 });
    expect(sys.countOf('gazelle')).toBe(6);
    for (let t = T0; t < T0 + 50_000; t += 1000) sys.tick(t);
    expect(sys.countOf('gazelle')).toBe(6); // 모자라지 않으면 안 늘어난다
    for (const [id, m] of [...sys.mobs]) if (m.kind === 'gazelle') sys.mobs.delete(id); // 다 잡혔다
    const before = new Set(sys.mobs.keys());
    for (let t = T0 + 50_000; t < T0 + 71_000; t += 1000) sys.tick(t); // 20초 한 번
    const back = [...sys.mobs.values()].filter((m) => m.kind === 'gazelle' && !before.has(m.id));
    expect(back.length).toBeGreaterThanOrEqual(3);
    expect(back.length).toBeLessThanOrEqual(4); // 한 번에 한 무리
    for (const m of back) {
      const d = Math.hypot(m.home!.x - me.x, m.home!.z - me.z);
      expect(d).toBeGreaterThanOrEqual(27);
      expect(d).toBeLessThanOrEqual(46);
    }
    for (let t = T0 + 71_000; t < T0 + 200_000; t += 1000) sys.tick(t);
    expect(sys.countOf('gazelle')).toBe(6); // 결국 정한 수만큼, 그 이상은 아니다
  });

  it('곰은 멀리서 맞으면(활) 때린 사람을 쫓아온다', () => {
    const { sys, me, hurt } = setup();
    const bear = sys.spawnKind('grizzly', 64.5, GROUND_Y + 1, 48.5); // 16칸 — 그냥은 안 온다
    expect(sys.hit(me, bear.id, 2, T0, 24)).toBeNull();
    for (let t = T0 + 100; t < T0 + 9000; t += 100) sys.tick(t);
    expect(hurt).toContain('grizzly');
  });
});

describe('원정지마다 사냥 동물이 실제 지형에 다 풀린다 (2026-11-05)', () => {
  for (const def of EXPEDITIONS.defs.filter((d) => Object.keys(d.wildAnimals).length > 0))
    for (const seed of [1234, 777, 42]) {
    it(`${def.name} (시드 ${seed}): ${Object.entries(def.wildAnimals).map(([k, n]) => `${k} ${n}`).join(', ')}`, () => {
      const exp = new Expedition(def, seed, BLOCKS, T0);
      const arena = { world: exp.world, seed, nightStartsAt: def.nightStartsAt, nightMobs: [], den: null, ended: false, elapsedSec: () => 0, wildAnimals: def.wildAnimals, safe: exp.spawn };
      const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [], hurt: () => {}, broadcast: () => {}, json: () => {}, reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 40, goal: null, quiet: true });
      for (const [kind, n] of Object.entries(def.wildAnimals)) expect(sys.countOf(kind as never)).toBe(n);
      // 시작 자리에서 보이는 거리에 (아빠 2026-11-05 "초원섬에서 동물 안 보임" — 섬 전체에 흩어 30~90칸 밖이었다)
      for (const m of sys.mobs.values()) {
        const d = Math.hypot(m.x - exp.spawn.x, m.z - exp.spawn.z);
        expect(d).toBeGreaterThanOrEqual(14);
        expect(d).toBeLessThanOrEqual(MOBS.get(m.kind).swim ? 90 : 60); // 물고기(연어)는 섬 둘레 바다에
      }
    });
    }
});
