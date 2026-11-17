import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, VILLAGE_GEN_VERSION, give, hasWaterNear, type MobKind } from '@dragon-village/shared';
import { BLOCKS, MOBS, WEATHER } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { MobSystem, type MobTarget } from './mobs';
import { Storage } from './storage';
import { VillageRoom } from './village';
import { SLEEP_CLEARS_MS, WeatherClock } from './weather';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 97_000_000;
const makeRoom = () => new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
const inbox = () => {
  const json: { t: string; [k: string]: unknown }[] = [];
  return { json, send: (d: Uint8Array | string) => (typeof d === 'string' ? json.push(JSON.parse(d)) : 0) };
};

describe('날씨 (2026-11-17, 나무위키 마인크래프트/날씨)', () => {
  it('들어오면 지금 날씨를 조용히 받고, 바뀌면 마을 사람 모두에게 알린다', () => {
    const room = makeRoom();
    const a = inbox();
    room.join('a'.repeat(32), '아빠', 0, a.send);
    expect(a.json.find((m) => m.t === 'weather')).toMatchObject({ kind: 'clear', fall: 'rain', quiet: true });
    expect(room.setWeather('thunder', 5, 'village', T0)).toBe(true);
    expect(a.json.at(-1)).toEqual({ t: 'weather', kind: 'thunder', fall: 'rain' });
    expect(room.weatherNow()?.kind).toBe('thunder');
  });

  it('시계: 때가 되면 맑음 ↔ 비, 번개는 뇌우일 때만 everySeconds 간격으로. 사막(dry)은 비를 안 맞아도 번개는 친다', () => {
    const w = new WeatherClock(WEATHER, WEATHER.expedition, 'rain', 3, T0);
    expect(w.kind).toBe('clear');
    expect(w.step(w.until - 1)).toBe(false);
    expect(w.step(w.until)).toBe(true);
    expect(w.kind).not.toBe('clear');
    w.set('rain', 60_000, T0);
    expect(w.raining).toBe(true);
    expect(w.boltDue(T0 + 999_999)).toBe(false);
    w.set('thunder', 600_000, T0);
    expect(w.boltDue(T0)).toBe(false);
    expect(w.boltDue(T0 + WEATHER.lightning.everyMs[1])).toBe(true);
    const dry = new WeatherClock(WEATHER, WEATHER.expedition, 'dry', 3, T0);
    dry.set('thunder', 600_000, T0);
    expect(dry.raining).toBe(false);
    expect(dry.storming).toBe(true);
  });

  it('비가 오면 물에서 먼 밭의 작물도 자란다 (하늘이 트여 있을 때만)', () => {
    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    const isWater = (x: number, y: number, z: number) => room.world.inBounds(x, y, z) && BLOCKS.get(room.world.getBlock(x, y, z)).fluid === 'water';
    const openSky = (x: number, z: number) => {
      for (let y = GROUND_Y + 1; y < room.world.sizeY; y++) if (room.world.getBlock(x, y, z) !== 0) return false;
      return true;
    };
    let gx = -1,
      gz = -1;
    for (let z = 96; z < 150 && gx < 0; z++)
      for (let x = 40; x < 200 && gx < 0; x++)
        if (BLOCKS.get(room.world.getBlock(x, GROUND_Y, z)).id === 'grass' && !hasWaterNear(isWater, x, GROUND_Y, z) && openSky(x, z)) { // 나무 밑은 비를 못 맞는다
          gx = x;
          gz = z;
        }
    room.world.setBlock(gx, GROUND_Y, gz, BLOCKS.numOf('farmland'));
    room.onMove(ra.idx, { x: gx + 0.5, y: GROUND_Y + 1, z: gz + 2.5, yaw: 0, pitch: 0, flags: FLAG_GROUND });
    give(p.inv, 'wheat_seeds', 1);
    room.onBlockChange(ra.idx, { seq: 1, x: gx, y: GROUND_Y + 1, z: gz, id: 'wheat_young' }, 1000);
    expect(BLOCKS.get(room.world.getBlock(gx, GROUND_Y + 1, gz)).id).toBe('wheat_young');
    room.checkCrops(1000 + 3 * 60_000);
    expect(BLOCKS.get(room.world.getBlock(gx, GROUND_Y + 1, gz)).id).toBe('wheat_young'); // 맑음: 마른 밭은 그대로
    room.setWeather('rain', 30, 'village', 1000);
    room.world.setBlock(gx, GROUND_Y + 6, gz, BLOCKS.numOf('stone')); // 지붕이 있으면 비를 못 맞는다
    room.checkCrops(1000 + 3 * 60_000 + 500);
    expect(BLOCKS.get(room.world.getBlock(gx, GROUND_Y + 1, gz)).id).toBe('wheat_young');
    room.world.setBlock(gx, GROUND_Y + 6, gz, 0);
    room.checkCrops(1000 + 3 * 60_000 + 1000);
    expect(BLOCKS.get(room.world.getBlock(gx, GROUND_Y + 1, gz)).id).not.toBe('wheat_young');
  });

  it('비 오는 중에 마을 사람이 모두 누우면 3초 뒤 갠다', () => {
    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    room.setWeather('rain', 30, 'village', T0);
    p.sleeping = { x: p.pos.x, y: p.pos.y, z: p.pos.z, facing: 0 };
    room.tick(T0 + 100);
    room.tick(T0 + 100 + SLEEP_CLEARS_MS + 50);
    expect(room.weatherNow()?.kind).toBe('clear');
    expect(a.json.find((m) => m.t === 'weather' && m.slept)).toMatchObject({ kind: 'clear' });
  });

  it('번개: 크리퍼 → 충전된 크리퍼, 주민 → 마녀, 좀비는 다친다. 뇌우엔 낮에도 밤처럼 몹이 나온다', () => {
    let storm = false;
    const json: { t: string; [k: string]: unknown }[] = [];
    const room = makeRoom();
    const players: MobTarget[] = [];
    const sys = new MobSystem(
      { world: room.world, seed: 1, nightStartsAt: 600, nightMobs: ['zombie'], den: null, ended: false, elapsedSec: () => 10, stormy: () => storm },
      BLOCKS,
      MOBS,
      { players: () => players, hurt: () => {}, broadcast: () => {}, json: (o) => json.push(o as { t: string }), reward: () => {}, bossWake: () => {}, bossDefeated: () => {} },
      { autoSpawn: false },
    );
    expect(sys.isNight(T0)).toBe(false);
    storm = true;
    expect(sys.isNight(T0)).toBe(true);
    const y = GROUND_Y + 1;
    const c = sys.spawnKind('creeper', 64, y, 64);
    const v = sys.spawnKind('villager' as MobKind, 65, y, 64);
    const z = sys.spawnKind('zombie', 64, y, 65);
    const far = sys.spawnKind('creeper', 90, y, 90);
    expect(sys.strike({ x: 64.5, y, z: 64.5 }, WEATHER.lightning.radius, WEATHER.lightning.damage, T0)).toBe(3);
    expect(c.kind).toBe('charged_creeper');
    expect(v.kind).toBe('witch');
    expect(z.hp).toBe(MOBS.get('zombie').hp - WEATHER.lightning.damage);
    expect(far.kind).toBe('creeper');
    expect(json.filter((m) => m.ev === 'struck').map((m) => m.mob)).toEqual(['charged_creeper', 'witch']);
  });
});
