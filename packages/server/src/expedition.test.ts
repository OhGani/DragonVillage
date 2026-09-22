import { DEFAULT_VILLAGE_SEED, GROUND_Y, MSG, PHASE_NUM, REJECT, SEA_Y, VILLAGE_GEN_VERSION, decodeServerBinary, type ServerBinary } from '@dragon-village/shared';
import { BLOCKS, EXPEDITIONS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { TICK_MS, VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const ISLAND = EXPEDITIONS.require('grass_island');

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

const T0 = 1_000_000;

describe('원정 시작·합류', () => {
  it('출발한 사람은 worldEnter(시드·시작 시각)를 받고, 마을 사람은 playerLeft + expeditionState 를 받는다', () => {
    const { room, a, b, ia } = setup();
    expect(room.startExpedition(ia, 'grass_island', T0)).toBeNull();
    const enter = a.json.find((m) => m.t === 'worldEnter')!;
    expect(enter).toMatchObject({ kind: 'expedition', chunkCount: 0, players: [] });
    const info = enter.expedition as { id: string; seed: number; startedAt: number; durationSec: number; genVersion: number };
    expect(info).toMatchObject({ id: 'grass_island', seed: 777, startedAt: T0, durationSec: ISLAND.durationSec });
    expect(info.genVersion).toBeGreaterThan(0);
    expect((enter.spawn as { x: number; z: number }).x).toBe(128.5);
    expect(a.json.at(-1)).toMatchObject({ t: 'ready' });
    expect(b.json.find((m) => m.t === 'playerLeft')).toMatchObject({ idx: ia });
    expect(b.json.find((m) => m.t === 'expeditionState')).toMatchObject({ expedition: { id: 'grass_island', players: 1 } });
    expect(room.expedition!.members.has(ia)).toBe(true);
    expect(room.players.get(ia)!.world).toBe('expedition');
  });

  it('둘째 사람이 같은 원정지로 출발하면 같은 섬(같은 시드)에 합류하고 서로 보인다', () => {
    const { room, a, b, ia, ib } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    a.clear();
    expect(room.startExpedition(ib, 'grass_island', T0 + 5000)).toBeNull();
    const enter = b.json.find((m) => m.t === 'worldEnter')!;
    expect((enter.expedition as { seed: number }).seed).toBe(777);
    expect((enter.players as { idx: number }[]).map((p) => p.idx)).toEqual([ia]);
    expect(a.json.find((m) => m.t === 'playerJoined')).toMatchObject({ player: { idx: ib } });
    expect(room.expedition!.members.size).toBe(2);
    // 이미 원정 중인 사람은 다시 출발 못 한다
    expect(room.startExpedition(ia, 'grass_island', T0 + 6000)).toBe('ALREADY_OUT');
    // 없는 원정지·아직 없는 생성기
    const { room: r2, ia: i2 } = setup();
    expect(r2.startExpedition(i2, 'moon', T0)).toBe('BAD_EXPEDITION');
    expect(r2.startExpedition(i2, 'cave', T0)).toBe('NOT_YET');
  });

  it('입장 welcome 에 진행 중인 원정이 실려 온다', () => {
    const { room, ia } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    const c = inbox();
    const rc = room.join('c'.repeat(32), '친구', 2, c.send)!;
    expect(rc.expedition).toMatchObject({ id: 'grass_island', players: 1 });
    expect(rc.players.map((p) => p.idx)).not.toContain(ia); // 마을에 없는 사람은 목록에 없다
  });
});

describe('원정 중 블록·위치·타이머', () => {
  it('원정에서 부순 블록은 원정 사람에게만 알리고 드롭을 센다. 마을 사람은 못 본다', () => {
    const { room, a, b, ia } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    a.clear();
    b.clear();
    const e = room.expedition!;
    // 스폰 앞 조약돌 단 (포탈 단은 y = 스폰 y - 1)
    const sp = e.spawn;
    const x = Math.floor(sp.x),
      y = Math.floor(sp.y) - 1,
      z = Math.floor(sp.z);
    expect(BLOCKS.get(e.world.getBlock(x, y, z)).id).toBe('cobblestone');
    room.onBlockChange(ia, { seq: 1, x, y, z, id: 'air' }, T0 + 100);
    expect(a.bin.find((m) => m.type === MSG.BlockChanged)).toMatchObject({ msg: { x, y, z, id: 'air', by: ia } });
    expect(b.bin.find((m) => m.type === MSG.BlockChanged)).toBeUndefined();
    expect(e.world.getBlock(x, y, z)).toBe(0);
    expect(room.modifiedCount).toBe(4); // 마을 세계는 그대로 (시작 때 지은 둥지 청크 2 + 창고·깃대 청크 2, M6-2·M6-6)
    expect(room.gainedOf(ia)).toEqual([{ id: 'cobblestone', count: 1 }]);
    expect(room.players.get(ia)!.inv[0]).toEqual({ item: 'cobblestone', count: 1 });
    expect(a.bin.find((m) => m.type === MSG.InvSlots)).toMatchObject({ msg: { slots: [{ slot: 0, item: 'cobblestone', count: 1 }] } });
    expect(e.modifiedCount).toBe(1);
    // 발광석은 블록 1개 + 가루 0~3개 덤
    const g = { x: 124, y, z: 125 }; // 단 모서리 발광석
    expect(BLOCKS.get(e.world.getBlock(g.x, g.y, g.z)).id).toBe('glowstone');
    room.onMove(ia, { x: g.x + 0.5, y: sp.y, z: g.z + 1.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ia, { seq: 2, ...g, id: 'air' }, T0 + 200);
    expect(room.gainedOf(ia).find((t) => t.id === 'glowstone')).toEqual({ id: 'glowstone', count: 1 });
    const dust = room.gainedOf(ia).find((t) => t.id === 'glowstone_dust');
    expect(dust?.count ?? 0).toBeLessThanOrEqual(3);
  });

  it('위치는 각 세계끼리만 브로드캐스트, 1초마다 ExpeditionTimer, 낮→저녁→밤', () => {
    const { room, a, b, ia } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    a.clear();
    b.clear();
    let now = T0;
    for (let i = 0; i < 25; i++) room.tick((now += TICK_MS)); // 1.25초
    const states = a.bin.filter((m) => m.type === MSG.PlayersState);
    expect(states.length).toBeGreaterThan(20);
    for (const s of states) expect((s.msg as { idx: number }[]).map((p) => p.idx)).toEqual([ia]);
    const bStates = b.bin.filter((m) => m.type === MSG.PlayersState);
    for (const s of bStates) expect((s.msg as { idx: number }[]).map((p) => p.idx)).not.toContain(ia);
    const timers = a.bin.filter((m) => m.type === MSG.ExpeditionTimer);
    expect(timers.length).toBeGreaterThanOrEqual(1);
    expect(timers.length).toBeLessThanOrEqual(2);
    expect(timers[0]).toMatchObject({ msg: { durationSec: ISLAND.durationSec, phase: PHASE_NUM.day } });
    expect(b.bin.filter((m) => m.type === MSG.ExpeditionTimer)).toHaveLength(0);
    // 저녁·밤
    a.clear();
    room.tick(T0 + (ISLAND.nightStartsAt - 30) * 1000);
    expect(a.bin.find((m) => m.type === MSG.ExpeditionTimer)).toMatchObject({ msg: { phase: PHASE_NUM.evening } });
    a.clear();
    room.tick(T0 + (ISLAND.nightStartsAt + 10) * 1000);
    expect(a.bin.find((m) => m.type === MSG.ExpeditionTimer)).toMatchObject({ msg: { phase: PHASE_NUM.night, elapsedSec: ISLAND.nightStartsAt + 10 } });
  });

  it('원정 세계 밖 좌표·마을 좌표계 혼동 없이 도달 거리를 재고, 섬 경계로 위치를 자른다', () => {
    const { room, ia } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    room.onMove(ia, { x: 999, y: 50, z: -5, yaw: 0, pitch: 0, flags: 0 });
    const p = room.players.get(ia)!;
    expect(p.pos.x).toBe(256);
    expect(p.pos.z).toBe(0);
    expect(room.validate(p, { seq: 1, x: 128, y: SEA_Y, z: 128, id: 'air' }, T0)).toBe(REJECT.TOO_FAR);
  });
});

describe('귀환·정산·종료', () => {
  it('포탈 밖에서는 못 돌아가고, 포탈 안에서 돌아가면 정산(전부) + 창고 + 마을 worldEnter', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, createdAt: 1 });
    const { room, a, b, ia } = setup(storage);
    room.startExpedition(ia, 'grass_island', T0);
    const e = room.expedition!;
    const sp = e.spawn;
    const y = Math.floor(sp.y) - 1;
    room.onBlockChange(ia, { seq: 1, x: Math.floor(sp.x), y, z: Math.floor(sp.z), id: 'air' }, T0 + 100);
    room.onBlockChange(ia, { seq: 2, x: Math.floor(sp.x) + 1, y, z: Math.floor(sp.z), id: 'air' }, T0 + 200);
    a.clear();
    b.clear();
    expect(room.returnHome(ia, T0 + 60_000)).toBe('NOT_IN_PORTAL');
    // 포탈 안으로 걸어 들어간다
    room.onMove(ia, { x: e.portal.x, y: e.portal.y + 1, z: e.portal.z + 0.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.returnHome(ia, T0 + 60_000)).toBeNull();
    const result = a.json.find((m) => m.t === 'expeditionResult')!;
    expect(result).toMatchObject({ expedition: 'grass_island', late: false, keepRatio: 1, elapsedSec: 60, items: [{ id: 'cobblestone', count: 2 }] });
    const enter = a.json.find((m) => m.t === 'worldEnter')!;
    expect(enter).toMatchObject({ kind: 'village', expedition: null });
    expect((enter.spawn as { x: number }).x).toBe(64.5);
    expect((enter.players as { idx: number }[]).map((p) => p.idx)).toEqual([1]);
    expect(a.json.findIndex((m) => m.t === 'ready')).toBeGreaterThan(a.json.findIndex((m) => m.t === 'worldEnter'));
    expect(a.json.find((m) => m.t === 'expeditionState')).toMatchObject({ expedition: null });
    expect(b.json.find((m) => m.t === 'playerJoined')).toMatchObject({ player: { idx: ia } });
    expect(b.json.find((m) => m.t === 'expeditionState')).toMatchObject({ expedition: null }); // 모두 돌아오면 원정 종료 → 다음 출발은 새 섬
    expect(room.expedition!.ended).toBe(true);
    expect(room.players.get(ia)!.inv[0]).toEqual({ item: 'cobblestone', count: 2 }); // 가방에 (창고가 아니라, #66)
    expect(storage.getInventory('a'.repeat(32))![0]).toEqual({ item: 'cobblestone', count: 2 });
    expect(room.players.get(ia)!.world).toBe('village');
    expect(room.expedition!.members.size).toBe(0);
    expect(room.returnHome(ia, T0 + 61_000)).toBe('NOT_OUT');
  });

  it('시간이 다 되면 안에 있는 사람은 절반만 들고 강제 귀환, 유예 뒤 원정 폐기 → 새 원정은 새 시드', () => {
    let seed = 100;
    const room = new VillageRoom({ ...INFO }, BLOCKS, null, () => {}, { seedFn: () => seed++, starterKit: null, gifts: [] });
    const a = inbox();
    const ia = room.join('a'.repeat(32), '아빠', 0, a.send)!.idx;
    room.startExpedition(ia, 'grass_island', T0);
    const e = room.expedition!;
    const sp = e.spawn;
    const y = Math.floor(sp.y) - 1;
    for (let i = 0; i < 3; i++) room.onBlockChange(ia, { seq: i, x: Math.floor(sp.x) - 1 + i, y, z: Math.floor(sp.z), id: 'air' }, T0 + 100 * i);
    a.clear();
    const end = T0 + ISLAND.durationSec * 1000;
    room.tick(end - 1000);
    expect(a.json.find((m) => m.t === 'expeditionResult')).toBeUndefined();
    room.tick(end + 10);
    const result = a.json.find((m) => m.t === 'expeditionResult')!;
    expect(result).toMatchObject({ late: true, keepRatio: 0.5, items: [{ id: 'cobblestone', count: 2 }] }); // 3 × 0.5 올림 = 2
    expect(room.players.get(ia)!.inv[0]).toEqual({ item: 'cobblestone', count: 2 }); // 1개는 잃었다
    expect(room.players.get(ia)!.world).toBe('village');
    expect(e.ended).toBe(true);
    // 유예 동안 원정 세계는 남아 있다가(늦은 정산 전송용) 비면 폐기된다
    expect(room.expedition).toBe(e);
    room.tick(end + EXPEDITIONS.rules.returnGraceSec * 1000 + 100);
    expect(room.expedition).toBeNull();
    // 새 원정은 새 시드
    expect(room.startExpedition(ia, 'grass_island', end + 70_000)).toBeNull();
    expect(room.expedition!.seed).toBe(101);
    expect(room.expedition!.ended).toBe(false);
  });

  it('원정 중에 연결이 끊기면 모은 것의 절반만 남고 마을 스폰 위치로 저장된다', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, createdAt: 1 });
    const { room, ia, b } = setup(storage);
    room.startExpedition(ia, 'grass_island', T0);
    b.clear();
    room.leave(ia);
    expect(room.expedition!.members.size).toBe(0);
    expect(b.json.find((m) => m.t === 'expeditionState')).toMatchObject({ expedition: null });
    expect(storage.getPlayer('a'.repeat(32))).toMatchObject({ x: 64.5, y: GROUND_Y + 1 });
  });
});

describe('원정 경험치 (M6-1)', () => {
  it('보물 상자를 부수면 5, 늦지 않게 돌아오면 10 + XpState', () => {
    const { room, a, ia } = setup();
    room.startExpedition(ia, 'grass_island', T0);
    const e = room.expedition!;
    const t = e.treasures[0]!;
    expect(e.isTreasure(t.x, t.y, t.z)).toBe(true);
    expect(BLOCKS.get(e.world.getBlock(t.x, t.y, t.z)).id).toBe('chest');
    room.onMove(ia, { x: t.x + 0.5, y: t.y, z: t.z + 1.5, yaw: 0, pitch: 0, flags: 0 });
    a.clear();
    room.onBlockChange(ia, { seq: 1, ...t, id: 'air' }, T0 + 100);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toMatchObject({ msg: { amount: 5, source: 2 } });
    expect(room.xpOf(ia)).toBe(5);
    // 상자 속 물건 (M6-4 임시): 가죽 2 — 안장 재료
    expect(room.players.get(ia)!.inv.find((s) => s?.item === 'leather')?.count).toBe(2);
    // 귀환
    room.onMove(ia, { x: e.portal.x, y: e.portal.y + 1, z: e.portal.z + 0.5, yaw: 0, pitch: 0, flags: 0 });
    a.clear();
    expect(room.returnHome(ia, T0 + 60_000)).toBeNull();
    const gains = a.bin.filter((m) => m.type === MSG.XpGained).map((m) => (m.msg as { amount: number; source: number }));
    expect(gains).toEqual([{ amount: 10, source: 1, x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) }]);
    expect(a.bin.find((m) => m.type === MSG.XpState)).toMatchObject({ msg: { total: 15 } });
    expect(room.xpOf(ia)).toBe(15);
  });
});
