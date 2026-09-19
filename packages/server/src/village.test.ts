import {
  BY_SERVER,
  DEFAULT_VILLAGE_SEED,
  FLAG_GROUND,
  GROUND_Y,
  MSG,
  REJECT,
  VILLAGE_GEN_VERSION,
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

function makeRoom(storage: Storage | null = null) {
  return new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null });
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
    const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { starterKit: null });
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 2, a.send)!;
    kit(room, ra.idx);
    room.onMove(ra.idx, { x: 70.5, y: GROUND_Y + 1, z: 70.5, yaw: 1, pitch: 0.2, flags: 0 });
    room.onBlockChange(ra.idx, { seq: 1, x: 72, y: GROUND_Y + 1, z: 70, id: 'planks' }, 1000);
    room.flush(2000);
    expect(storage.countChunks(INFO.code)).toBe(1);

    const room2 = new VillageRoom({ ...INFO }, BLOCKS, storage);
    expect(BLOCKS.get(room2.world.getBlock(72, GROUND_Y + 1, 70)).id).toBe('planks');
    expect(room2.modifiedCount).toBe(1);
    const b = inbox();
    const rb = room2.join('a'.repeat(32), '아빠', 2, b.send)!;
    expect(rb.spawn).toMatchObject({ x: 70.5, z: 70.5, yaw: 1 }); // 저장된 자리
    expect(room2.sendModifiedChunks(b.send)).toBe(1);
    expect(b.bin.find((m) => m.type === MSG.ChunkData)?.msg).toMatchObject({ cx: 4, cy: 2, cz: 4 });
  });

  it('지형 버전이 다르면 저장 청크를 버린다', () => {
    const storage = new Storage(':memory:');
    storage.createVillage({ ...INFO, genVersion: VILLAGE_GEN_VERSION + 1, createdAt: 1 });
    storage.saveChunks(INFO.code, [{ cx: 0, cy: 0, cz: 0, blob: new Uint8Array([1, 0, 0, 0, 0]) }]);
    const room = new VillageRoom({ ...INFO, genVersion: VILLAGE_GEN_VERSION + 1 }, BLOCKS, storage);
    expect(room.modifiedCount).toBe(0);
    expect(storage.countChunks(INFO.code)).toBe(0);
    expect(room.info.genVersion).toBe(VILLAGE_GEN_VERSION);
  });
});
