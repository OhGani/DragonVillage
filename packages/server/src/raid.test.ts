import { BY_SERVER, FLAG_GROUND, FLAG_POLE, GROUND_Y, MOB_STATE, RAID_CAPTURE_SEC, RAID_WARNING_SEC, RAID_WAVE_REST_SEC, VILLAGE_GEN_VERSION, DEFAULT_VILLAGE_SEED, decodeServerBinary, type ServerBinary } from '@dragon-village/shared';
import { BLOCKS, RAIDS } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { RAID_GOAL } from './raid';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 70_000_000;

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

function setup(storage = new Storage(':memory:')) {
  const room = new VillageRoom({ ...INFO }, BLOCKS, storage, () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
  const a = inbox(),
    b = inbox();
  const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
  const rb = room.join('b'.repeat(32), '아들', 1, b.send)!;
  const atFlag = (idx: number, now: number) => room.onMove(idx, { x: FLAG_POLE.x + 1.5, y: GROUND_Y + 1, z: FLAG_POLE.z + 2.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, now);
  return { room, storage, a, b, ra, rb, atFlag };
}

/** 빔으로 살아 있는 우민을 전부 잡는다 (세기 5 = 20 씩). 북쪽 둔치를 향해 서 있다고 치고 몹 위치마다 바로 위에서 내려 쏜다 */
function killAll(room: VillageRoom, idx: number, t: number): number {
  const sys = room.raid!.mobs;
  let shots = 0;
  for (let i = 0; i < 200 && sys.mobs.size > 0; i++) {
    const m = [...sys.mobs.values()][0]!;
    sys.beam({ x: m.x, y: m.y + 6, z: m.z }, { x: 0, y: -1, z: 0 }, 24, 5, idx, t + i * 100);
    shots++;
  }
  return shots;
}

describe('마을 방어전 (M7-5)', () => {
  it('깃대 옆에서만 시작, 종 → 45초 뒤 첫 파도가 북쪽 둔치에 나오고 깃대로 걸어온다', () => {
    const { room, a, b, ra, rb, atFlag } = setup();
    expect(room.startRaid(ra.idx, T0)).toBe('NOT_AT_FLAG');
    atFlag(ra.idx, T0);
    a.clear();
    b.clear();
    expect(room.startRaid(ra.idx, T0)).toBeNull();
    expect(room.startRaid(rb.idx, T0)).toBe('RAID_RUNNING');
    expect(b.json.find((m) => m.t === 'error' && m.code === 'RAID_BELL')).toBeDefined();
    room.tick(T0 + 1000);
    expect(b.json.find((m) => m.t === 'raid')).toMatchObject({ raid: { phase: 'warning', wave: 0, waves: 3 } });
    room.tick(T0 + RAID_WARNING_SEC * 1000 + 100);
    const sys = room.raid!.mobs;
    expect(room.raid!.phase).toBe('wave');
    expect(sys.mobs.size).toBe(6); // 변명자 4 + 약탈자 2 (2명, #128)
    for (const m of sys.mobs.values()) {
      expect(['vindicator', 'pillager']).toContain(m.kind);
      expect(m.z).toBeLessThan(40); // 북쪽 둔치
      expect(BLOCKS.get(room.world.getBlock(Math.floor(m.x), Math.floor(m.y) - 1, Math.floor(m.z))).solid).toBe(true);
    }
    // 사람들이 멀리(광장 남쪽) 있으면 우민은 깃대로 걸어온다
    for (const r of [ra, rb]) room.onMove(r.idx, { x: 64.5, y: GROUND_Y + 1, z: 78.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 46_000);
    const before = Math.min(...[...sys.mobs.values()].map((m) => Math.hypot(m.x - RAID_GOAL.x, m.z - RAID_GOAL.z)));
    for (let t = T0 + 46_000; t < T0 + 52_000; t += 100) room.tick(t);
    const after = Math.min(...[...sys.mobs.values()].map((m) => Math.hypot(m.x - RAID_GOAL.x, m.z - RAID_GOAL.z)));
    expect(after).toBeLessThan(before - 5);
    expect(a.bin.some((m) => m.type === 0x60)).toBe(true); // MobsState 가 마을 사람들에게
  });

  it('파도 셋을 다 막으면 승리: 모두 경험치 50, 소환사 전리품은 창고, 깃대 맨 위는 금 깃발, 기록이 남고 주 2회 제한', () => {
    const { room, storage, a, ra, rb, atFlag } = setup();
    atFlag(ra.idx, T0);
    expect(room.startRaid(ra.idx, T0)).toBeNull();
    let t = T0 + RAID_WARNING_SEC * 1000 + 100;
    room.tick(t);
    const xa = room.xpOf(ra.idx),
      xb = room.xpOf(rb.idx);
    for (let wave = 1; wave <= RAIDS.waves; wave++) {
      expect(room.raid!.wave).toBe(wave);
      if (wave === RAIDS.waves) expect(room.raid!.mobs.boss?.kind).toBe('evoker');
      killAll(room, ra.idx, t);
      t += 25_000;
      room.tick(t); // 다 잡음 → 8초 쉬고 다음 파도
      if (wave < RAIDS.waves) {
        expect(room.raid!.phase).toBe('wave');
        t += RAID_WAVE_REST_SEC * 1000 + 200;
        room.tick(t);
      }
    }
    expect(room.raid).toBeNull();
    expect(a.json.find((m) => m.t === 'raid' && m.raid && (m.raid as { phase: string }).phase === 'won')).toBeDefined();
    expect(a.json.find((m) => m.t === 'error' && m.code === 'RAID_WON')).toBeDefined();
    expect(room.xpOf(ra.idx)).toBeGreaterThanOrEqual(xa + RAIDS.xpEach + 100); // 승리 50 + 소환사 100 (+ 우민)
    expect(room.xpOf(rb.idx)).toBeGreaterThanOrEqual(xb + RAIDS.xpEach + 100);
    const stock = new Map(storage.getStorage('123456').map((r) => [r.item, r.count]));
    expect(stock.get('totem_of_undying')).toBe(10);
    expect(BLOCKS.get(room.world.getBlock(FLAG_POLE.x + 1, GROUND_Y + FLAG_POLE.height, FLAG_POLE.z)).id).toBe('gold_block');
    expect(storage.lastRaid('123456')).toMatchObject({ won: true, wave: 3 });
    // 두 번째도 되고, 세 번째는 주 2회 제한
    atFlag(ra.idx, t);
    expect(room.startRaid(ra.idx, t)).toBeNull();
    room.raid!.mobs.clear();
    (room.raid as unknown as { finish(won: boolean, now: number): void }).finish(false, t + 1000);
    room.tick(t + 1100);
    expect(room.raid).toBeNull();
    expect(room.startRaid(ra.idx, t + 2000)).toBe('WEEK_CAP');
    expect(BLOCKS.get(room.world.getBlock(FLAG_POLE.x + 1, GROUND_Y + FLAG_POLE.height, FLAG_POLE.z)).id).toBe('obsidian'); // 마지막이 패배라 검은 깃발
  });

  it('우민이 깃대를 잡고 사람이 없으면 15초 뒤 패배, 사람이 오면 점령이 풀린다', () => {
    const { room, a, ra, rb, atFlag } = setup();
    atFlag(ra.idx, T0);
    expect(room.startRaid(ra.idx, T0)).toBeNull();
    let t = T0 + RAID_WARNING_SEC * 1000 + 100;
    room.tick(t);
    const sys = room.raid!.mobs;
    // 사람들은 멀리, 우민 하나를 깃대 옆에
    for (const r of [ra, rb]) room.onMove(r.idx, { x: 64.5, y: GROUND_Y + 1, z: 110.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, t);
    const m = [...sys.mobs.values()][0]!;
    const hold = () => {
      m.x = RAID_GOAL.x;
      m.z = RAID_GOAL.z;
      m.y = RAID_GOAL.y;
    };
    for (let i = 0; i < 80; i++) {
      hold();
      room.tick((t += 100)); // 8초
    }
    expect(room.raid!.capture).toBeGreaterThanOrEqual(7);
    expect(a.json.find((mm) => mm.t === 'error' && mm.code === 'RAID_FLAG')).toBeDefined();
    // 아빠가 깃대 근처(4칸, 우민 도끼는 안 닿는 거리)로 달려오면 점령이 풀린다
    room.onMove(ra.idx, { x: RAID_GOAL.x + 4, y: GROUND_Y + 1, z: RAID_GOAL.z, yaw: 0, pitch: 0, flags: FLAG_GROUND }, t);
    for (let i = 0; i < 40; i++) {
      hold();
      room.tick((t += 100));
    }
    expect(room.raid!.capture).toBeLessThan(7);
    // 다시 떠나면 끝까지 쌓여 패배
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 110.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, t);
    for (let i = 0; i < (RAID_CAPTURE_SEC + 2) * 10 && room.raid; i++) {
      hold();
      room.tick((t += 100));
    }
    expect(room.raid).toBeNull();
    expect(a.json.find((mm) => mm.t === 'error' && mm.code === 'RAID_LOST')).toBeDefined();
    expect(BLOCKS.get(room.world.getBlock(FLAG_POLE.x + 1, GROUND_Y + FLAG_POLE.height, FLAG_POLE.z)).id).toBe('obsidian');
    expect(BY_SERVER).toBeDefined();
    expect(MOB_STATE.walk).toBe(0);
  });
});
