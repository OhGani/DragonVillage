import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, VILLAGE_GEN_VERSION, give, hasWaterNear, type MobKind } from '@dragon-village/shared';
import { BLOCKS, MOBS, WEATHER } from '@dragon-village/shared/data';
import { describe, expect, it } from 'vitest';
import { MobSystem, type MobTarget } from './mobs';
import { Storage } from './storage';
import { VillageRoom } from './village';
import { SLEEP_CLEARS_MS, WeatherClock } from './weather';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };
const T0 = 97_000_000;
const makeRoom = (weatherRoll: (() => number) | null = null) => new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [], weatherRoll });
const inbox = () => {
  const json: { t: string; [k: string]: unknown }[] = [];
  return { json, send: (d: Uint8Array | string) => (typeof d === 'string' ? json.push(JSON.parse(d)) : 0) };
};

describe('날씨 (2026-11-17, 나무위키 마인크래프트/날씨)', () => {
  it('들어오면 지금 날씨를 받고(비·뇌우면 알림), 바뀌면 마을 사람 모두에게 알린다', () => {
    let k = 0;
    const room = makeRoom(() => ++k * 7919);
    const a = inbox();
    room.join('a'.repeat(32), '아빠', 0, a.send);
    const first = a.json.find((m) => m.t === 'weather')!;
    expect(first).toMatchObject({ kind: room.weatherNow()!.kind, fall: 'rain' });
    expect(first.quiet === true).toBe(first.kind === 'clear'); // 비·뇌우로 뽑혔으면 알림도
    expect(room.setWeather('thunder', 5, 'village', T0)).toBe(true);
    expect(a.json.at(-1)).toEqual({ t: 'weather', kind: 'thunder', fall: 'rain' });
    expect(room.weatherNow()?.kind).toBe('thunder');
  });

  it('아무도 없는 마을에 처음 들어오면 날씨를 새로 뽑고(맑음·비·뇌우 다 나온다), 친구가 뒤따라 들어올 땐 안 바뀐다', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const w = new WeatherClock(WEATHER, WEATHER.village, 'rain', 1, T0);
      expect(w.reroll(i * 7919, T0)).toBe(true);
      seen.add(w.kind);
      expect(w.until - T0).toBeGreaterThanOrEqual(w.kind === 'clear' ? WEATHER.village.clearMs[0] : WEATHER.village.rainMs[0]);
    }
    expect([...seen].sort()).toEqual(['clear', 'rain', 'thunder']);
    const room = makeRoom(() => 12345);
    const a = inbox(),
      b = inbox();
    room.join('a'.repeat(32), '아빠', 0, a.send);
    room.setWeather('thunder', 7, 'village', Date.now());
    room.join('b'.repeat(32), '아들', 1, b.send);
    expect(room.weatherNow()?.kind).toBe('thunder');
    expect(b.json.find((m) => m.t === 'weather')).toMatchObject({ kind: 'thunder', quiet: true });
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

describe('눈 층·피뢰침 (2026-11-17)', () => {
  const findOpenGrass = (room: VillageRoom) => {
    for (let z = 96; z < 160; z++)
      for (let x = 90; x < 200; x++) {
        if (BLOCKS.get(room.world.getBlock(x, GROUND_Y, z)).id !== 'grass') continue;
        let open = true;
        for (let y = GROUND_Y + 1; y < room.world.sizeY && open; y++) if (room.world.getBlock(x, y, z) !== 0) open = false;
        if (open) return { x, z };
      }
    throw new Error('no grass');
  };
  type Inner = { villageWeather: WeatherClock | null; lightning(world: 'village', w: WeatherClock, now: number): void };

  it('눈이 오면 사람 둘레 하늘이 트인 꽉 찬 블록 위에 눈 층이 쌓이고, 그 칸에 블록을 놓으면 덮어쓴다', () => {
    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    const g = findOpenGrass(room);
    room.onMove(ra.idx, { x: g.x + 0.5, y: GROUND_Y + 1, z: g.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    const w = new WeatherClock(WEATHER, WEATHER.village, 'snow', 7, T0);
    w.set('rain', 600_000, T0);
    (room as unknown as Inner).villageWeather = w; // 시험: 마을에 눈
    for (let t = 0; t <= 60_000; t += 250) room.tick(T0 + t);
    const layers: { x: number; y: number; z: number }[] = [];
    const SNOW = BLOCKS.numOf('snow_layer');
    for (let z = g.z - 26; z <= g.z + 26; z++)
      for (let x = g.x - 26; x <= g.x + 26; x++)
        for (let y = 0; y < room.world.sizeY; y++) if (room.world.inBounds(x, y, z) && room.world.getBlock(x, y, z) === SNOW) layers.push({ x, y, z });
    expect(layers.length).toBeGreaterThan(80); // 1초에 4칸 × 60초 (같은 칸·안 되는 칸 빼고)
    for (const l of layers) {
      const below = BLOCKS.get(room.world.getBlock(l.x, l.y - 1, l.z));
      expect(BLOCKS.isOpaque(below.num) || below.id.endsWith('leaves')).toBe(true);
    }
    // 눈 층 칸에 돌을 놓으면 덮어쓴다
    const l = layers.find((q) => Math.hypot(q.x - g.x, q.z - g.z) < 5 && Math.hypot(q.x - g.x, q.z - g.z) > 1.5) ?? layers[0]!;
    room.onMove(ra.idx, { x: l.x + 2.5, y: l.y, z: l.z + 0.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0 + 61_000);
    give(p.inv, 'stone', 1);
    room.onBlockChange(ra.idx, { seq: 1, x: l.x, y: l.y, z: l.z, id: 'stone', slot: p.inv.findIndex((s) => s?.item === 'stone') }, T0 + 61_000);
    expect(BLOCKS.get(room.world.getBlock(l.x, l.y, l.z)).id).toBe('stone');
  });

  it('피뢰침이 rodRange 안에 있으면 번개가 모두 그리로 가고, 곁에 선 사람은 안 다친다', () => {
    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    const p = room.players.get(ra.idx)!;
    const g = findOpenGrass(room);
    room.onMove(ra.idx, { x: g.x + 0.5, y: GROUND_Y + 1, z: g.z + 1.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    give(p.inv, 'lightning_rod', 1);
    room.onBlockChange(ra.idx, { seq: 1, x: g.x, y: GROUND_Y + 1, z: g.z, id: 'lightning_rod', slot: p.inv.findIndex((s) => s?.item === 'lightning_rod') }, T0);
    expect(BLOCKS.get(room.world.getBlock(g.x, GROUND_Y + 1, g.z)).id).toBe('lightning_rod');
    const inner = room as unknown as Inner;
    room.setWeather('thunder', 10, 'village', T0);
    const hp = p.hp;
    for (let i = 0; i < 30; i++) inner.lightning('village', inner.villageWeather!, T0 + i * 1000);
    const bolts = a.json.filter((m) => m.t === 'lightning');
    expect(bolts).toHaveLength(30);
    for (const b of bolts) expect(b).toMatchObject({ x: g.x + 0.5, y: GROUND_Y + 2, z: g.z + 0.5, rod: true });
    expect(p.hp).toBe(hp);
    // 피뢰침 위를 막으면 번개를 못 끈다
    room.world.setBlock(g.x, GROUND_Y + 5, g.z, BLOCKS.numOf('stone'));
    a.json.length = 0;
    for (let i = 0; i < 10; i++) inner.lightning('village', inner.villageWeather!, T0 + 40_000 + i * 1000);
    expect(a.json.filter((m) => m.t === 'lightning' && m.rod)).toHaveLength(0);
  });
});

describe('마을 눈·원정 시작 날씨 (2026-11-18)', () => {
  it('마을 비는 snowChance 만큼 눈으로 오고, 맑아지면 쌓인 눈이 녹는다', () => {
    const seen = new Set<string>();
    for (let s = 1; s <= 60; s++) {
      const w = new WeatherClock(WEATHER, WEATHER.village, 'rain', s, T0);
      w.step(w.until);
      if (w.kind !== 'clear') seen.add(w.fall);
    }
    expect([...seen].sort()).toEqual(['rain', 'snow']);
    const exp = new WeatherClock(WEATHER, WEATHER.expedition, 'rain', 3, T0);
    for (let i = 0; i < 30; i++) exp.step(exp.until);
    expect(exp.fall).toBe('rain'); // 원정지는 snowChance 가 없다
    const none = new WeatherClock(WEATHER, WEATHER.village, 'none', 3, T0);
    none.set('rain', 60_000, T0, 'snow');
    expect(none.fall).toBe('none'); // 날씨 없는 곳은 눈도 없다

    const room = makeRoom();
    const a = inbox();
    const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
    room.onMove(ra.idx, { x: 120.5, y: GROUND_Y + 1, z: 120.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, T0);
    expect(room.setWeather('rain', 5, 'village', T0, true)).toBe(true);
    expect(a.json.at(-1)).toEqual({ t: 'weather', kind: 'rain', fall: 'snow' });
    const SNOW = BLOCKS.numOf('snow_layer');
    const count = () => {
      let n = 0;
      for (let z = 90; z <= 150; z++) for (let x = 90; x <= 150; x++) for (let y = GROUND_Y; y < GROUND_Y + 30; y++) if (room.world.getBlock(x, y, z) === SNOW) n++;
      return n;
    };
    for (let t = 0; t <= 30_000; t += 250) room.tick(T0 + t);
    const piled = count();
    expect(piled).toBeGreaterThan(40);
    room.setWeather('clear', 30, 'village', T0 + 30_000);
    for (let t = 30_000; t <= 30_000 + 2_000; t += 250) room.tick(T0 + t);
    expect(count()).toBeLessThan(piled); // 녹기 시작
    for (let t = 32_000; t <= 32_000 + Math.ceil(piled / WEATHER.snow.meltPerSecond + 3) * 1000; t += 250) room.tick(T0 + t);
    expect(count()).toBe(0);
  });

  it('원정은 시작할 때 날씨를 뽑고, 도착한 사람은 비·뇌우면 알림까지 받는다', () => {
    // 원정 시작 날씨 뽑기 자체는 시계로 (섬 생성이 느려서 방은 둘만)
    const rolled = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const w = new WeatherClock(WEATHER, WEATHER.expedition, 'rain', 1, T0);
      w.reroll(i * 104729, T0);
      rolled.add(w.kind);
    }
    expect([...rolled].sort()).toEqual(['clear', 'rain', 'thunder']);
    const kinds = new Set<string>();
    for (const roll of [11, 4242]) {
      const room = makeRoom(() => roll);
      const a = inbox();
      const ra = room.join('a'.repeat(32), '아빠', 0, a.send)!;
      expect(room.startExpedition(ra.idx, 'grass_island', T0)).toBeNull();
      const w = room.weatherNow('expedition')!;
      expect(w.place).toBe('초원 섬');
      kinds.add(w.kind);
      const msg = a.json.filter((m) => m.t === 'weather').at(-1)!;
      expect(msg).toMatchObject({ kind: w.kind, fall: 'rain' });
      expect(msg.quiet === true).toBe(w.kind === 'clear');
    }
    expect(kinds.size).toBeGreaterThan(0);
    // 시험 룸 기본(weatherRoll 없음)은 맑음으로 시작 — 다른 시험이 날씨 운에 갈리지 않게
    const plain = makeRoom();
    const pa = inbox();
    const pr = plain.join('p'.repeat(32), '아빠', 0, pa.send)!;
    plain.startExpedition(pr.idx, 'grass_island', T0);
    expect(plain.weatherNow('expedition')?.kind).toBe('clear');
  });
});
