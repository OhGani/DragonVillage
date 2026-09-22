import {
  BY_SERVER,
  DEFAULT_VILLAGE_SEED,
  FLAG_GROUND,
  GROUND_Y,
  MSG,
  REJECT,
  VILLAGE_GEN_VERSION,
  countOf,
  decodeServerBinary,
  type ServerBinary,
} from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { RATE_PER_SEC, TICK_MS, VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };

/** 받은 메시지를 모아 두는 가짜 연결 */
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

/** 둥지(M6-2, #76)가 서버 시작 때 광장 남쪽 집터 청크 2개(x 48~79, z 80~95)를 바꾼다 — 바뀐 청크 수 기대값에 더한다 */
const NEST_CHUNKS = 2;

function makeRoom(storage: Storage | null = null) {
  return new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: [] });
}
/** M4: 블록이 유한하므로 시험 전에 손에 쥐어 준다 */
function kit(room: VillageRoom, idx: number) {
  for (const item of ['stone', 'glowstone', 'planks', 'water_bucket', 'bucket']) room.giveItems(idx, item, 64);
}

describe('VillageRoom 입장·퇴장', () => {
  it('스폰은 광장, 둘째 사람에게 첫째가 보이고 첫째는 playerJoined 를 받는다', () => {
    const room = makeRoom();
    const a = inbox(),
      b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 3, a.send)!;
    expect(ra.idx).toBe(0);
    expect(ra.spawn).toMatchObject({ x: 64.5, y: GROUND_Y + 1, z: 64.5, nick: '아빠', color: 3 });
    expect(ra.players).toEqual([]);
    const rb = room.join('b'.repeat(32), '아들', 5, b.send)!;
    expect(rb.idx).toBe(1);
    expect(rb.players.map((p) => p.nick)).toEqual(['아빠']);
    expect(a.json.find((m) => m.t === 'playerJoined')).toMatchObject({ player: { idx: 1, nick: '아들' } });
    room.leave(1);
    expect(a.json.find((m) => m.t === 'playerLeft')).toMatchObject({ idx: 1 });
    expect(room.playerCount).toBe(1);
  });

  it('6명까지, 같은 토큰이 다시 오면 예전 연결을 끊는다', () => {
    const room = makeRoom();
    for (let i = 0; i < 6; i++) expect(room.join(String(i).repeat(32), `p${i}`, 0, () => {})).not.toBeNull();
    expect(room.join('z'.repeat(32), 'z', 0, () => {})).toBeNull();
    const re = inbox();
    const r = room.join('0'.repeat(32), 'p0 다시', 0, re.send);
    expect(r).not.toBeNull();
    expect(room.playerCount).toBe(6);
  });

  it('같은 토큰이 다시 들어오면 예전 연결은 kick 콜백으로 끊긴다', () => {
    const room = makeRoom();
    let kicked = '';
    room.join('a'.repeat(32), '아빠', 0, () => {}, (why) => (kicked = why));
    const second = room.join('a'.repeat(32), '아빠(폰)', 0, () => {});
    expect(second?.idx).toBe(0);
    expect(kicked).toContain('같은 계정');
    expect(room.playerCount).toBe(1);
  });
});

describe('VillageRoom 블록 변경 검증', () => {
  const setup = () => {
    const room = makeRoom();
    const a = inbox(),
      b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    kit(room, ra.idx);
    // 아들은 멀리(동쪽 밭 근처)
    room.onMove(rb.idx, { x: 100.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: FLAG_GROUND });
    a.clear();
    b.clear();
    return { room, a, b, ia: ra.idx, ib: rb.idx };
  };
  const changed = (box: ReturnType<typeof inbox>) => box.bin.filter((m) => m.type === MSG.BlockChanged).map((m) => m.msg);
  const rejected = (box: ReturnType<typeof inbox>) => box.bin.filter((m) => m.type === MSG.BlockChangeRejected).map((m) => m.msg);

  it('바로 앞에 놓기 → 둘 다 BlockChanged, 세계에 반영', () => {
    const { room, a, b, ia } = setup();
    room.onBlockChange(ia, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'glowstone' }, 1000);
    expect(changed(a)).toEqual([{ x: 66, y: GROUND_Y + 1, z: 64, id: 'glowstone', by: ia }]);
    expect(changed(b)).toHaveLength(1);
    expect(BLOCKS.get(room.world.getBlock(66, GROUND_Y + 1, 64)).id).toBe('glowstone');
  });

  it('너무 멀면 거절(TOO_FAR), 세계는 그대로', () => {
    const { room, a, ia } = setup();
    room.onBlockChange(ia, { seq: 2, x: 80, y: GROUND_Y + 1, z: 64, id: 'stone' }, 1000);
    expect(rejected(a)).toEqual([{ seq: 2, reason: REJECT.TOO_FAR }]);
    expect(room.world.getBlock(80, GROUND_Y + 1, 64)).toBe(0);
  });

  it('기반암은 못 부순다(UNBREAKABLE), 잔디는 부순다', () => {
    const { room, a, ia } = setup();
    room.onMove(ia, { x: 64.5, y: 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 }); // 땅속으로 순간이동(검증은 거리만 본다)
    room.onBlockChange(ia, { seq: 3, x: 64, y: 0, z: 65, id: 'air' }, 1000);
    expect(rejected(a)).toEqual([{ seq: 3, reason: REJECT.UNBREAKABLE }]);
    room.onMove(ia, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ia, { seq: 4, x: 66, y: GROUND_Y, z: 66, id: 'air' }, 1100);
    expect(changed(a).some((m) => m.id === 'air' && m.x === 66)).toBe(true);
    expect(room.world.getBlock(66, GROUND_Y, 66)).toBe(0);
  });

  it('공기를 부수기·모르는 블록·흐르는 물 단계 놓기는 INVALID', () => {
    const { room, a, ia } = setup();
    room.onBlockChange(ia, { seq: 5, x: 66, y: GROUND_Y + 3, z: 64, id: 'air' }, 1000);
    room.onBlockChange(ia, { seq: 6, x: 66, y: GROUND_Y + 1, z: 64, id: 'no_such_block' }, 1000);
    room.onBlockChange(ia, { seq: 7, x: 66, y: GROUND_Y + 1, z: 64, id: 'water~3' }, 1000);
    expect(rejected(a).map((r) => r.reason)).toEqual([REJECT.INVALID, REJECT.INVALID, REJECT.INVALID]);
    // 자연 원천(무한)도 못 놓는다 — 플레이어는 고인 액체 8/8 만 (결정 #65)
    room.onBlockChange(ia, { seq: 8, x: 66, y: GROUND_Y + 1, z: 64, id: 'water' }, 1000);
    expect(rejected(a).at(-1)).toMatchObject({ seq: 8, reason: REJECT.INVALID });
    room.onBlockChange(ia, { seq: 9, x: 66, y: GROUND_Y + 1, z: 64, id: 'water%8' }, 1000);
    expect(changed(a).at(-1)).toMatchObject({ id: 'water%8' });
    // 얕은 웅덩이(고인 3/8)는 닦아낼 수 있고, 자연 흐름(water~3)은 못 건드린다
    room.onBlockChange(ia, { seq: 10, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, 1000);
    expect(changed(a).at(-1)).toMatchObject({ id: 'air' });
    room.world.setBlock(66, GROUND_Y + 1, 64, BLOCKS.fluidFinite(BLOCKS.numOf('water'), 3));
    room.onBlockChange(ia, { seq: 11, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, 1000);
    expect(changed(a).at(-1)).toMatchObject({ id: 'air' });
    room.world.setBlock(66, GROUND_Y + 1, 64, BLOCKS.fluidVariant(BLOCKS.numOf('water'), 3));
    room.onBlockChange(ia, { seq: 12, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, 1000);
    expect(rejected(a).at(-1)).toMatchObject({ seq: 12, reason: REJECT.INVALID });
  });

  it('누가 서 있는 칸에는 못 놓는다(OCCUPIED), 이미 블록이 있는 칸도', () => {
    const { room, a, b, ia, ib } = setup();
    // 아들을 아빠 옆으로
    room.onMove(ib, { x: 66.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ia, { seq: 9, x: 66, y: GROUND_Y + 1, z: 64, id: 'stone' }, 1000);
    expect(rejected(a)).toEqual([{ seq: 9, reason: REJECT.OCCUPIED }]);
    room.onBlockChange(ia, { seq: 10, x: 64, y: GROUND_Y, z: 66, id: 'stone' }, 1000); // 잔디 위에 덮어쓰기
    expect(rejected(a).at(-1)).toEqual({ seq: 10, reason: REJECT.OCCUPIED });
    expect(b.bin.filter((m) => m.type === MSG.BlockChanged)).toHaveLength(0);
  });

  it('횃불·유리는 놓고 캐면 그대로 돌아오고, 횃불 자리에는 덮어 놓을 수 없다 (#70)', () => {
    const { room, a, ia } = setup();
    room.giveItems(ia, 'torch', 2);
    room.giveItems(ia, 'glass', 2);
    const p = room.players.get(ia)!;
    const at = { x: 66, y: GROUND_Y + 1, z: 64 };
    room.onBlockChange(ia, { seq: 1, ...at, id: 'torch' }, 1000);
    expect(countOf(p.inv, 'torch')).toBe(1);
    // 횃불 위에 돌 덮기 → OCCUPIED (횃불이 사라지면 안 되니까)
    room.onBlockChange(ia, { seq: 2, ...at, id: 'stone' }, 1000);
    expect(rejected(a).at(-1)).toEqual({ seq: 2, reason: REJECT.OCCUPIED });
    expect(BLOCKS.get(room.world.getBlock(at.x, at.y, at.z)).id).toBe('torch');
    // 캐면 횃불이 돌아온다
    room.onBlockChange(ia, { seq: 3, ...at, id: 'air' }, 1000);
    expect(countOf(p.inv, 'torch')).toBe(2);
    // 유리도 마인크래프트와 달리 돌아온다
    room.onBlockChange(ia, { seq: 4, ...at, id: 'glass' }, 1000);
    room.onBlockChange(ia, { seq: 5, ...at, id: 'air' }, 1000);
    expect(countOf(p.inv, 'glass')).toBe(2);
    expect(BLOCKS.require('glass').drops).toBe('glass');
    expect(BLOCKS.require('ice').drops).toBe('ice');
    expect(BLOCKS.require('bookshelf').drops).toBe('bookshelf');
  });

  it('문: 놓으면 두 칸, 탭하면 열리고 닫히고, 부수면 하나로 돌아온다 (#71)', () => {
    const { room, a, ia } = setup();
    room.giveItems(ia, 'oak_door', 1);
    const p = room.players.get(ia)!;
    const x = 66,
      y = GROUND_Y + 1,
      z = 64;
    // 핫바의 문 자체를 놓으면 서버가 보던 방향(yaw 0 = 북) 변형으로 바꾼다
    room.onBlockChange(ia, { seq: 1, x, y, z, id: 'oak_door' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(x, y, z)).id).toBe('oak_door@n');
    expect(BLOCKS.get(room.world.getBlock(x, y + 1, z)).id).toBe('oak_door@n^');
    expect(countOf(p.inv, 'oak_door')).toBe(0);
    expect(changed(a).map((m) => m.id).sort()).toEqual(['oak_door@n', 'oak_door@n^']);
    // 열기: 윗칸을 탭해도 둘 다 열린다. 가방 그대로
    room.onBlockChange(ia, { seq: 2, x, y: y + 1, z, id: 'oak_door@n^>' }, 1200);
    expect(BLOCKS.get(room.world.getBlock(x, y, z)).id).toBe('oak_door@n>');
    expect(BLOCKS.get(room.world.getBlock(x, y + 1, z)).id).toBe('oak_door@n^>');
    expect(BLOCKS.get(room.world.getBlock(x, y, z)).solid).toBe(false);
    expect(countOf(p.inv, 'oak_door')).toBe(0);
    // 닫기
    room.onBlockChange(ia, { seq: 3, x, y, z, id: 'oak_door@n' }, 1400);
    expect(BLOCKS.get(room.world.getBlock(x, y + 1, z)).id).toBe('oak_door@n^');
    expect(rejected(a)).toEqual([]);
    // 방향이 다른 변형으로 바꾸는 건 거절
    room.onBlockChange(ia, { seq: 4, x, y, z, id: 'oak_door@e' }, 1600);
    expect(rejected(a).at(-1)).toMatchObject({ seq: 4 });
    // 부수기(윗칸) → 둘 다 사라지고 문 하나
    room.onBlockChange(ia, { seq: 5, x, y: y + 1, z, id: 'air' }, 1800);
    expect(room.world.getBlock(x, y, z)).toBe(0);
    expect(room.world.getBlock(x, y + 1, z)).toBe(0);
    expect(countOf(p.inv, 'oak_door')).toBe(1);
    // 위가 막혀 있으면 못 놓는다
    room.onBlockChange(ia, { seq: 6, x, y: y + 1, z, id: 'stone' }, 2000);
    room.onBlockChange(ia, { seq: 7, x, y, z, id: 'oak_door@n' }, 2200);
    expect(rejected(a).at(-1)).toEqual({ seq: 7, reason: REJECT.OCCUPIED });
    expect(countOf(p.inv, 'oak_door')).toBe(1);
  });

  it('초당 상한을 넘으면 RATE', () => {
    const { room, a, ia } = setup();
    for (let i = 0; i < RATE_PER_SEC + 2; i++) room.onBlockChange(ia, { seq: 100 + i, x: 62 + (i % 5), y: GROUND_Y + 2 + Math.floor(i / 5), z: 62, id: 'stone' }, 1000 + i * 10);
    expect(changed(a)).toHaveLength(RATE_PER_SEC);
    expect(rejected(a).map((r) => r.reason)).toEqual([REJECT.RATE, REJECT.RATE]);
    // 1초 지나면 다시 된다
    room.onBlockChange(ia, { seq: 200, x: 62, y: GROUND_Y + 6, z: 62, id: 'stone' }, 2500);
    expect(changed(a)).toHaveLength(RATE_PER_SEC + 1);
  });
});

describe('VillageRoom 액체 틱과 저장', () => {
  it('물을 놓고 틱을 돌리면 서버가 BlockBatch 로 퍼짐을 보낸다', () => {
    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    kit(room, ra.idx);
    a.clear();
    room.onBlockChange(ra.idx, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'water%8' }, 1000);
    let now = 1000;
    for (let i = 0; i < 12; i++) room.tick((now += TICK_MS));
    const batches = a.bin.filter((m) => m.type === MSG.BlockBatch).map((m) => m.msg as { blocks: { id: string }[] });
    expect(batches.length).toBeGreaterThan(0);
    const ids = batches.flatMap((b) => b.blocks.map((x) => x.id));
    expect(ids.some((id) => id.startsWith('water%'))).toBe(true);
    // 위치 브로드캐스트도 매 틱
    expect(a.bin.filter((m) => m.type === MSG.PlayersState).length).toBeGreaterThanOrEqual(12);
    expect(BY_SERVER).toBe(255);
  });

  it('flush → 저장소에 바뀐 청크, 새 룸이 그것을 불러오고 입장자에게 ChunkData 로 보낸다', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, createdAt: 1 });
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: [] });
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 2, a.send)!;
    kit(room, ra.idx);
    room.onMove(ra.idx, { x: 70.5, y: GROUND_Y + 1, z: 70.5, yaw: 1, pitch: 0.2, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 1, x: 72, y: GROUND_Y + 1, z: 70, id: 'planks' }, 1000);
    room.flush(2000);
    expect(storage.countChunks(INFO.code)).toBe(1 + NEST_CHUNKS);

    const room2 = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { gifts: [] });
    expect(BLOCKS.get(room2.world.getBlock(72, GROUND_Y + 1, 70)).id).toBe('planks');
    expect(room2.modifiedCount).toBe(1 + NEST_CHUNKS);
    const b = inbox();
    const rb = room2.join('a'.repeat(32), '아빠', 2, b.send)!;
    expect(rb.spawn).toMatchObject({ x: 70.5, z: 70.5, yaw: 1 }); // 저장된 자리
    expect(room2.sendModifiedChunks(b.send)).toBe(1 + NEST_CHUNKS);
    const chunks = b.bin.filter((m) => m.type === MSG.ChunkData).map((m) => m.msg as { cx: number; cy: number; cz: number });
    expect(chunks).toContainEqual(expect.objectContaining({ cx: 4, cy: 2, cz: 4 })); // 판자 놓은 청크
    expect(chunks).toContainEqual(expect.objectContaining({ cx: 3, cy: 2, cz: 5 })); // 둥지 청크
  });

  it('지형 버전이 다르면 저장 청크를 버린다', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, genVersion: VILLAGE_GEN_VERSION + 1, createdAt: 1 });
    storage.saveChunks(INFO.code, [{ cx: 0, cy: 0, cz: 0, blob: new Uint8Array([1, 0, 0, 0, 0]) }]);
    const room = new VillageRoom({ ...INFO, genVersion: VILLAGE_GEN_VERSION + 1 }, BLOCKS, storage, () => {}, { gifts: [] });
    expect(room.modifiedCount).toBe(NEST_CHUNKS); // 저장은 버렸고 둥지만 새로 지었다
    expect(storage.countChunks(INFO.code)).toBe(0);
    expect(room.info.genVersion).toBe(VILLAGE_GEN_VERSION);
  });
});

describe('경험치 (M6-1)', () => {
  it('광석을 캐면 xp.json 값만큼 XpGained, 총량은 저장된다. 돌은 0', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.giveItems(ra.idx, 'iron_pickaxe', 1); // 칸 0 — 다이아 광석은 철 곡괭이부터
    a.clear();
    room.world.setBlock(66, GROUND_Y + 1, 64, BLOCKS.numOf('diamond_ore'));
    room.world.setBlock(66, GROUND_Y + 1, 65, BLOCKS.numOf('stone'));
    room.onBlockChange(ra.idx, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'air', slot: 0 }, 1000);
    const got = a.bin.find((m) => m.type === MSG.XpGained)!;
    expect(got).toBeDefined();
    const amount = (got.msg as { amount: number }).amount;
    expect(amount).toBeGreaterThanOrEqual(3);
    expect(amount).toBeLessThanOrEqual(7);
    expect(got.msg).toMatchObject({ source: 0, x: 66.5, y: GROUND_Y + 1.5, z: 64.5 });
    expect(room.xpOf(ra.idx)).toBe(amount);
    expect(storage.getPlayer('a'.repeat(32))!.xpTotal).toBe(amount);
    a.clear();
    room.onBlockChange(ra.idx, { seq: 2, x: 66, y: GROUND_Y + 1, z: 65, id: 'air', slot: 0 }, 1200);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toBeUndefined();
    // 다시 들어오면 총량이 welcome 에 실려 온다
    room.leave(ra.idx);
    const b = inbox();
    const rb = room.join('a'.repeat(32), '아빠', 0, b.send)!;
    expect(rb.xp).toBe(amount);
  });
});

describe('곡괭이 등급 (아들 2026-09-20)', () => {
  it('맨손·나무 곡괭이로 석탄 광석은 TOOL 거절, 돌 곡괭이면 캔다. 돌은 맨손 ok', () => {
    const { room, a, ia } = (() => {
      const room = makeRoom();
      const a = inbox();
      const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
      room.giveItems(ra.idx, 'wooden_pickaxe', 1); // 칸 0
      room.giveItems(ra.idx, 'stone_pickaxe', 1); // 칸 1
      a.clear();
      return { room, a, ia: ra.idx };
    })();
    room.world.setBlock(66, GROUND_Y + 1, 64, BLOCKS.numOf('coal_ore'));
    room.world.setBlock(66, GROUND_Y + 1, 65, BLOCKS.numOf('stone'));
    room.onBlockChange(ia, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, 1000); // 맨손
    expect(a.bin.filter((m) => m.type === MSG.BlockChangeRejected).map((m) => m.msg)).toEqual([{ seq: 1, reason: REJECT.TOOL }]);
    room.onBlockChange(ia, { seq: 2, x: 66, y: GROUND_Y + 1, z: 64, id: 'air', slot: 0 }, 1100); // 나무
    expect(a.bin.filter((m) => m.type === MSG.BlockChangeRejected).at(-1)!.msg).toEqual({ seq: 2, reason: REJECT.TOOL });
    room.onBlockChange(ia, { seq: 3, x: 66, y: GROUND_Y + 1, z: 65, id: 'air' }, 1200); // 돌은 맨손 ok
    expect(room.world.getBlock(66, GROUND_Y + 1, 65)).toBe(0);
    room.onBlockChange(ia, { seq: 4, x: 66, y: GROUND_Y + 1, z: 64, id: 'air', slot: 1 }, 1300); // 돌 곡괭이
    expect(room.world.getBlock(66, GROUND_Y + 1, 64)).toBe(0);
    expect(countOf(room.players.get(ia)!.inv, 'coal')).toBe(1);
  });
});

describe('둥지·알·부화 (M6-2)', () => {
  it('둥지가 지어져 있고, 알을 놓으면 알 블록이 서며, 레벨이 있어야 부화한다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox(),
      b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    // 둥지 구조물(광장 남쪽 집터): 모서리 원목, 안 건초, 위 발광석. 생성기의 집 뼈대(판자 벽·지붕)는 사라진다
    expect(BLOCKS.get(room.world.getBlock(60, GROUND_Y, 81)).id).toBe('log');
    expect(BLOCKS.get(room.world.getBlock(63, GROUND_Y, 84)).id).toBe('hay_bale');
    expect(BLOCKS.get(room.world.getBlock(60, GROUND_Y + 4, 81)).id).toBe('glowstone');
    expect(room.world.getBlock(61, GROUND_Y + 1, 82)).toBe(0); // 집 벽 자리
    expect(room.world.getBlock(63, GROUND_Y + 5, 84)).toBe(0); // 집 지붕 자리
    expect(ra.nest).toEqual([]);
    expect(ra.dragons).toEqual([]);
    room.giveItems(ra.idx, 'dragon_egg.wood', 1);
    // 둥지 밖에서는 못 놓는다
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.wood', 1000)).toBe('NOT_AT_NEST');
    room.onMove(ra.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.placeEgg(ra.idx, 9, 'dragon_egg.wood', 1000)).toBe('BAD_SLOT');
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.fire', 1000)).toBe('NO_EGG');
    a.clear();
    b.clear();
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.wood', 1000)).toBeNull();
    expect(BLOCKS.get(room.world.getBlock(61, GROUND_Y + 1, 82)).id).toBe('dragon_egg');
    expect(countOf(room.players.get(ra.idx)!.inv, 'dragon_egg.wood')).toBe(0);
    expect(b.bin.find((m) => m.type === MSG.BlockChanged)).toMatchObject({ msg: { id: 'dragon_egg', x: 61, z: 82 } });
    expect(a.json.find((m) => m.t === 'dragons')).toMatchObject({ list: [{ dragon: 'wood', stage: 'egg', slot: 0 }] });
    expect(b.json.find((m) => m.t === 'nest')).toMatchObject({ slots: [{ slot: 0, dragon: 'wood', owner: '아빠', mine: false }] });
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.wood', 1000)).toBe('NO_EGG'); // 가방에 더 없음
    room.giveItems(ra.idx, 'dragon_egg.wood', 1);
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.wood', 1000)).toBe('SLOT_TAKEN');
    const eggId = room.myDragons('a'.repeat(32))[0]!.id;
    // 남의 알은 못 부화, 레벨 0 이면 모자람 (나무 = 레벨 1)
    room.onMove(rb.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.hatch(rb.idx, eggId)).toBe('NO_EGG');
    expect(room.hatch(ra.idx, eggId)).toBe('NEED_LEVEL:1:0');
    room.giveXp(ra.idx, 20); // 레벨 2 (7 + 9 = 16)
    a.clear();
    expect(room.hatch(ra.idx, eggId, 2000)).toBeNull();
    expect(room.world.getBlock(61, GROUND_Y + 1, 82)).toBe(0);
    expect(room.myDragons('a'.repeat(32))).toMatchObject([{ dragon: 'wood', stage: 'baby', slot: null, hatchedAt: 2000 }]);
    // 레벨 2 에서 1 내면 레벨 1 총량(7) + 부화 경험치 티어1 × 5 = 12
    expect(room.xpOf(ra.idx)).toBe(7 + 5);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toMatchObject({ msg: { amount: 5, source: 4 } });
    expect(room.nestSlots('a'.repeat(32))).toEqual([]);
    // 다시 켜도 둥지·드래곤이 남는다
    const room2 = makeRoom(storage);
    expect(room2.myDragons('a'.repeat(32))).toHaveLength(1);
    expect(BLOCKS.get(room2.world.getBlock(60, GROUND_Y, 81)).id).toBe('log');
  });

  it('옛 둥지 자리(북동쪽 74~80/42~48)에 둥지가 남아 있으면 켜질 때 원래 땅으로 되돌린다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const before = [room.world.getBlock(74, GROUND_Y, 42), room.world.getBlock(77, GROUND_Y, 45), room.world.getBlock(74, GROUND_Y + 4, 42)];
    // 옛 둥지의 표식 세 블록을 플레이어가 놓은 것처럼 (원목·건초·발광석)
    for (const item of ['log', 'hay_bale', 'glowstone']) room.giveItems(ra.idx, item, 4);
    room.onMove(ra.idx, { x: 76.5, y: GROUND_Y + 1, z: 44.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 1, x: 74, y: GROUND_Y + 4, z: 42, id: 'glowstone' }, 1000);
    room.onBlockChange(ra.idx, { seq: 2, x: 74, y: GROUND_Y, z: 42, id: 'air' }, 1000);
    room.onBlockChange(ra.idx, { seq: 3, x: 74, y: GROUND_Y, z: 42, id: 'log' }, 1000);
    room.onBlockChange(ra.idx, { seq: 4, x: 77, y: GROUND_Y, z: 45, id: 'air' }, 1000);
    room.onBlockChange(ra.idx, { seq: 5, x: 77, y: GROUND_Y, z: 45, id: 'hay_bale' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(74, GROUND_Y, 42)).id).toBe('log');
    expect(BLOCKS.get(room.world.getBlock(77, GROUND_Y, 45)).id).toBe('hay_bale');
    room.flush(2000);
    const room2 = makeRoom(storage);
    expect([room2.world.getBlock(74, GROUND_Y, 42), room2.world.getBlock(77, GROUND_Y, 45), room2.world.getBlock(74, GROUND_Y + 4, 42)]).toEqual(before);
    expect(BLOCKS.get(room2.world.getBlock(60, GROUND_Y, 81)).id).toBe('log'); // 새 자리 둥지는 그대로
  });
});

describe('드래곤 성장·먹이 (M6-3)', () => {
  it('부화하면 둥지 자리에 서고, 먹이로 시간이 줄고, 시간이 되면 어른 + 성장 경험치(티어×3), 접속 안 한 주인은 저장소에', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox(),
      b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    expect(ra.nestDragons).toEqual([]);
    room.giveItems(ra.idx, 'dragon_egg.iron', 1);
    room.giveItems(ra.idx, 'iron_ingot', 3);
    room.giveItems(ra.idx, 'log', 1);
    room.onMove(ra.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    room.onMove(rb.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.placeEgg(ra.idx, 1, 'dragon_egg.iron', 1000)).toBeNull();
    const id = room.myDragons('a'.repeat(32))[0]!.id;
    room.giveXp(ra.idx, 100); // 철(티어 3) 부화 레벨 확보
    a.clear();
    b.clear();
    const T0 = 10_000_000;
    expect(room.hatch(ra.idx, id, T0)).toBeNull();
    // 둥지의 드래곤: 가운데 자리, 아기, 60분 뒤 어른
    const nd = room.nestDragons('b'.repeat(32));
    expect(nd).toMatchObject([{ id, dragon: 'iron', owner: '아빠', mine: false, stage: 'baby', perch: { x: 63, y: GROUND_Y + 1, z: 84 }, fed: 0, growAt: T0 + 60 * 60_000 }]);
    expect(b.json.find((m) => m.t === 'nest')).toMatchObject({ dragons: [{ id, stage: 'baby' }] });
    expect(room.myDragons('a'.repeat(32))[0]).toMatchObject({ stage: 'baby', fed: 0, growAt: T0 + 60 * 60_000 });
    // 먹이: 남의 것·다른 재료·둥지 밖은 거절
    expect(room.feed(rb.idx, id, 'iron_ingot', T0)).toBe('NO_DRAGON');
    expect(room.feed(ra.idx, id, 'log', T0)).toBe('NOT_FOOD');
    expect(room.feed(ra.idx, id, 'diamond', T0)).toBe('NOT_FOOD');
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.feed(ra.idx, id, 'iron_ingot', T0)).toBe('NOT_AT_NEST');
    room.onMove(ra.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room.feed(ra.idx, id, 'iron_ingot', T0 + 1000)).toBeNull();
    expect(countOf(room.players.get(ra.idx)!.inv, 'iron_ingot')).toBe(2);
    expect(room.myDragons('a'.repeat(32))[0]).toMatchObject({ stage: 'baby', fed: 1, growAt: T0 + 50 * 60_000 });
    // 49분 뒤엔 아직 아기, 50분 뒤 어른
    room.checkGrowth(T0 + 49 * 60_000);
    expect(room.myDragons('a'.repeat(32))[0]!.stage).toBe('baby');
    const xpBefore = room.xpOf(ra.idx);
    a.clear();
    b.clear();
    room.checkGrowth(T0 + 50 * 60_000 + 1);
    expect(room.myDragons('a'.repeat(32))[0]).toMatchObject({ stage: 'adult', growAt: null });
    expect(room.xpOf(ra.idx)).toBe(xpBefore + 9);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toMatchObject({ msg: { amount: 9, source: 5 } });
    expect(b.json.find((m) => m.t === 'nest')).toMatchObject({ dragons: [{ id, stage: 'adult' }] });
    expect(room.feed(ra.idx, id, 'iron_ingot', T0)).toBe('NOT_BABY');
    expect(room.feed(ra.idx, 9999, 'iron_ingot', T0)).toBe('NO_DRAGON');

    // 둘째 드래곤: 먹이를 많이 주면 바로 어른. 주인이 나가 있으면 경험치는 저장소로
    room.giveItems(ra.idx, 'dragon_egg.wood', 1);
    room.giveItems(ra.idx, 'log', 6);
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.wood', T0)).toBeNull();
    const id2 = room.myDragons('a'.repeat(32)).find((d) => d.stage === 'egg')!.id;
    expect(room.hatch(ra.idx, id2, T0)).toBeNull();
    expect(room.nestDragons('a'.repeat(32)).map((d) => d.perch)).toEqual([
      { x: 63, y: GROUND_Y + 1, z: 84 },
      { x: 63, y: GROUND_Y + 1, z: 82 },
    ]);
    for (let i = 0; i < 5; i++) expect(room.feed(ra.idx, id2, 'log', T0 + 1)).toBeNull();
    expect(room.myDragons('a'.repeat(32)).find((d) => d.id === id2)).toMatchObject({ stage: 'baby', fed: 5 });
    const xp2 = room.xpOf(ra.idx);
    room.leave(ra.idx);
    // 주인 없음 → 6번째 먹이는 못 주니 시간으로 자란다
    room.checkGrowth(T0 + 10 * 60_000 + 1);
    const saved = storage.getPlayer('a'.repeat(32))!;
    expect(saved.xpTotal).toBe(xp2 + 3);
    expect(storage.getDragon(id2)!.stage).toBe('adult');
    expect(b.json.filter((m) => m.t === 'nest').at(-1)).toMatchObject({ dragons: [{ id, stage: 'adult' }, { id: id2, stage: 'adult' }] });
  });
});

describe('드래곤 탑승 (M6-4)', () => {
  it('어른 + 안장 + 가까이에서만 탄다. 타면 둥지에서 빠지고 모두에게 mount, 내리거나 나가면 돌아온다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox(),
      b = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
    room.giveItems(ra.idx, 'dragon_egg.iron', 1);
    room.giveItems(ra.idx, 'dragon_egg.wood', 1);
    room.onMove(ra.idx, { x: 63.5, y: GROUND_Y + 1, z: 84.5, yaw: 0, pitch: 0, flags: 0 });
    const T0 = 20_000_000;
    expect(room.placeEgg(ra.idx, 0, 'dragon_egg.iron', T0)).toBeNull();
    expect(room.placeEgg(ra.idx, 1, 'dragon_egg.wood', T0)).toBeNull();
    room.giveXp(ra.idx, 200);
    const [ironId, woodId] = room.myDragons('a'.repeat(32)).map((d) => d.id) as [number, number];
    expect(room.hatch(ra.idx, ironId, T0)).toBeNull();
    room.checkGrowth(T0 + 61 * 60_000); // 철은 어른
    expect(room.hatch(ra.idx, woodId, T0 + 61 * 60_000)).toBeNull(); // 나무는 아기
    expect(room.ride(ra.idx, ironId)).toBe('NO_SADDLE');
    room.giveItems(ra.idx, 'saddle', 1);
    expect(room.ride(ra.idx, woodId)).toBe('NOT_ADULT');
    expect(room.ride(rb.idx, ironId)).toBe('NO_DRAGON');
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 }); // 광장
    expect(room.ride(ra.idx, ironId)).toBe('TOO_FAR');
    room.onMove(ra.idx, { x: 63.5, y: GROUND_Y + 1, z: 80.5, yaw: 0, pitch: 0, flags: 0 }); // 둥지 입구 (자리 63,84 에서 4칸)
    a.clear();
    b.clear();
    expect(room.ride(ra.idx, ironId)).toBeNull();
    expect(room.ride(ra.idx, ironId)).toBe('ALREADY_RIDING');
    const mountMsg = { t: 'mount', idx: ra.idx, riding: { id: ironId, dragon: 'iron' } };
    expect(a.json.find((m) => m.t === 'mount')).toEqual(mountMsg);
    expect(b.json.find((m) => m.t === 'mount')).toEqual(mountMsg);
    // 둥지에서는 빠지되 나무 아기의 자리는 그대로(둘째 자리)
    const nest = room.nestDragons('b'.repeat(32));
    expect(nest.map((d) => d.id)).toEqual([woodId]);
    expect(nest[0]!.perch).toEqual({ x: 63, y: GROUND_Y + 1, z: 82 });
    expect(b.json.find((m) => m.t === 'nest')).toMatchObject({ dragons: [{ id: woodId }] });
    // 새로 들어온 사람은 players 에서 타고 있는 걸 본다
    const c = inbox();
    const rc = room.join('c'.repeat(32), '친구', 2, c.send)!;
    expect(rc.players.find((p) => p.idx === ra.idx)?.riding).toEqual({ id: ironId, dragon: 'iron' });
    expect(rc.nestDragons.map((d) => d.id)).toEqual([woodId]);
    // 내리기
    a.clear();
    expect(room.dismount(ra.idx)).toBeNull();
    expect(room.dismount(ra.idx)).toBe('NOT_RIDING');
    expect(a.json.find((m) => m.t === 'dismount')).toEqual({ t: 'dismount', idx: ra.idx });
    expect(room.nestDragons('b'.repeat(32)).map((d) => d.id)).toEqual([ironId, woodId]);
    // 타고 있다가 나가면 드래곤은 둥지로
    expect(room.ride(ra.idx, ironId)).toBeNull();
    b.clear();
    room.leave(ra.idx);
    expect(room.nestDragons('b'.repeat(32)).map((d) => d.id)).toEqual([ironId, woodId]);
    expect(b.json.filter((m) => m.t === 'nest').at(-1)).toMatchObject({ dragons: [{ id: ironId }, { id: woodId }] });
  });
});

describe('아빠 선물 (#79)', () => {
  const GIFT = [{ id: 'axe_test', name: '철 도끼', message: '아빠가 철 도끼를 줬어요!', items: { iron_axe: 1 } }];

  it('이미 놀던 사람도 다음 입장에 한 번 받고, 두 번째 입장에는 안 받는다', () => {
    const storage = new Storage(':memory:');
    // 1) 선물 없이 한 번 놀고 나간다 (가방 저장이 생긴다)
    const before = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: [] });
    const r0 = before.join('a'.repeat(32), '아빠', 0, () => {})!;
    expect(r0.gifts).toEqual([]);
    expect(countOf(before.players.get(r0.idx)!.inv, 'iron_axe')).toBe(0);
    before.leave(r0.idx);

    // 2) 선물을 넣고 다시 들어오면 받는다
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: GIFT });
    const a = inbox();
    const r1 = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    expect(r1.gifts).toEqual([{ id: 'axe_test', name: '철 도끼', message: '아빠가 철 도끼를 줬어요!' }]);
    expect(countOf(room.players.get(r1.idx)!.inv, 'iron_axe')).toBe(1);
    expect(r1.inventory.some((s) => s?.item === 'iron_axe')).toBe(true);
    room.leave(r1.idx);

    // 3) 또 들어와도 다시 주지 않는다 (가방에 그대로 1개)
    const r2 = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    expect(r2.gifts).toEqual([]);
    expect(countOf(room.players.get(r2.idx)!.inv, 'iron_axe')).toBe(1);

    // 4) 다른 사람은 자기 차례에 받는다
    const r3 = room.join('b'.repeat(32), '아들', 1, () => {})!;
    expect(r3.gifts.map((g) => g.id)).toEqual(['axe_test']);
    expect(countOf(room.players.get(r3.idx)!.inv, 'iron_axe')).toBe(1);
  });

  it('선물은 나가기 전에도 저장되어, 서버가 죽어도 두 번 받지 않는다', () => {
    const storage = new Storage(':memory:');
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: GIFT });
    room.join('a'.repeat(32), '아빠', 0, () => {});
    expect(storage.giftsGiven('a'.repeat(32))).toEqual(new Set(['axe_test']));
    expect(storage.getInventory('a'.repeat(32))!.some((s) => s?.item === 'iron_axe')).toBe(true);
    const room2 = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null, gifts: GIFT });
    expect(room2.join('a'.repeat(32), '아빠', 0, () => {})!.gifts).toEqual([]);
  });
});

describe('상자 (#84)', () => {
  const json = (box: ReturnType<typeof inbox>) => box.json.filter((m) => m.t === 'chest').at(-1) as { x: number; y: number; z: number; slots: (null | { item: string; count: number })[] } | undefined;

  it('탭하면 열리고, 넣은 것은 서버가 기억하고, 부수면 내 가방으로 돌아온다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.giveItems(ra.idx, 'chest', 2);
    room.giveItems(ra.idx, 'coal', 10);
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 1, x: 66, y: GROUND_Y + 1, z: 64, id: 'chest' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(66, GROUND_Y + 1, 64)).id).toBe('chest');

    a.clear();
    expect(room.openChest(ra.idx, 66, GROUND_Y + 1, 64, 1000)).toBeNull();
    const opened = json(a)!;
    expect(opened).toMatchObject({ x: 66, y: GROUND_Y + 1, z: 64 });
    expect(opened.slots).toHaveLength(27); // 혼자 있는 상자는 27칸

    // 가방의 석탄(칸 번호 27 + 가방칸)을 상자 0번 칸으로
    const coalSlot = room.players.get(ra.idx)!.inv.findIndex((s) => s?.item === 'coal');
    a.clear();
    expect(room.chestMove(ra.idx, 66, GROUND_Y + 1, 64, 27 + coalSlot, 0, 10, 1000)).toBeNull();
    expect(json(a)!.slots[0]).toEqual({ item: 'coal', count: 10 });
    expect(countOf(room.players.get(ra.idx)!.inv, 'coal')).toBe(0);

    // 서버를 껐다 켜도 그대로 (바뀐 칸을 저장한 뒤 새 룸으로)
    room.flush(1500);
    const room2 = makeRoom(storage);
    const b = inbox();
    const rb = room2.join('a'.repeat(32), '아빠', 0, b.send)!;
    room2.onMove(rb.idx, { x: 64.5, y: GROUND_Y + 1, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    expect(room2.openChest(rb.idx, 66, GROUND_Y + 1, 64, 2000)).toBeNull();
    expect(json(b)!.slots[0]).toEqual({ item: 'coal', count: 10 });

    // 부수면 안에 있던 것이 내 가방으로 (상자 아이템도 같이)
    room2.onBlockChange(rb.idx, { seq: 2, x: 66, y: GROUND_Y + 1, z: 64, id: 'air' }, 2000);
    expect(countOf(room2.players.get(rb.idx)!.inv, 'coal')).toBe(10);
    expect(countOf(room2.players.get(rb.idx)!.inv, 'chest')).toBe(2);
    expect(room2.openChest(rb.idx, 66, GROUND_Y + 1, 64, 2000)).toBe('NO_CHEST');
  });

  it('상자 옆에 상자를 놓으면 큰 상자 54칸, 위가 막혀 있거나 이미 큰 상자면 안 합쳐진다', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.giveItems(ra.idx, 'chest', 8);
    room.giveItems(ra.idx, 'stone', 8);
    const y = GROUND_Y + 1;
    room.onMove(ra.idx, { x: 64.5, y, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    // 1) 두 개를 나란히 → 큰 상자
    room.onBlockChange(ra.idx, { seq: 1, x: 66, y, z: 64, id: 'chest' }, 1000);
    room.onBlockChange(ra.idx, { seq: 2, x: 67, y, z: 64, id: 'chest' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(66, y, 64)).id).toBe('chest@e'); // 동(+x)쪽 짝
    expect(BLOCKS.get(room.world.getBlock(67, y, 64)).id).toBe('chest@w');
    a.clear();
    expect(room.openChest(ra.idx, 67, y, 64, 1000)).toBeNull();
    const big = json(a)!;
    expect(big.slots).toHaveLength(54);
    expect(big).toMatchObject({ x: 66, z: 64 }); // 대표 칸은 x 가 작은 쪽

    // 2) 세 번째는 안 합쳐진다 (최대 2개)
    room.onBlockChange(ra.idx, { seq: 3, x: 68, y, z: 64, id: 'chest' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(68, y, 64)).id).toBe('chest');
    expect(BLOCKS.get(room.world.getBlock(67, y, 64)).id).toBe('chest@w'); // 그대로

    // 3) 위가 막힌 상자와는 안 합쳐진다
    room.onMove(ra.idx, { x: 70.5, y, z: 64.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 4, x: 71, y, z: 64, id: 'chest' }, 1000);
    room.onBlockChange(ra.idx, { seq: 5, x: 71, y: y + 1, z: 64, id: 'stone' }, 1000);
    room.onBlockChange(ra.idx, { seq: 6, x: 72, y, z: 64, id: 'chest' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(71, y, 64)).id).toBe('chest');
    expect(BLOCKS.get(room.world.getBlock(72, y, 64)).id).toBe('chest');

    // 4) 큰 상자 한쪽을 부수면 남은 쪽은 다시 혼자 상자
    room.onMove(ra.idx, { x: 66.5, y, z: 65.5, yaw: 0, pitch: 0, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 7, x: 66, y, z: 64, id: 'air' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(67, y, 64)).id).toBe('chest');
    a.clear();
    expect(room.openChest(ra.idx, 67, y, 64, 1000)).toBeNull();
    expect(json(a)!.slots).toHaveLength(27);
  });

  it('원정 보물 상자는 열면 안에 물건이 들어 있다 (부수지 않아도)', () => {
    const storage = new Storage(':memory:');
    const room = makeRoom(storage);
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    expect(room.startExpedition(ra.idx, 'grass_island', 1000)).toBeNull();
    const t = room.expedition!.treasures[0]!;
    room.onMove(ra.idx, { x: t.x + 0.5, y: t.y, z: t.z + 1.5, yaw: 0, pitch: 0, flags: 0 });
    a.clear();
    expect(room.openChest(ra.idx, t.x, t.y, t.z, 2000)).toBeNull();
    const slots = json(a)!.slots.filter(Boolean);
    expect(slots).toEqual([{ item: 'leather', count: 2 }]);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toMatchObject({ msg: { amount: 5, source: 2 } });
    // 두 번 열어도 또 생기지는 않는다
    a.clear();
    expect(room.openChest(ra.idx, t.x, t.y, t.z, 2000)).toBeNull();
    expect(json(a)!.slots.filter(Boolean)).toHaveLength(1);
    expect(a.bin.find((m) => m.type === MSG.XpGained)).toBeUndefined();
  });
});
