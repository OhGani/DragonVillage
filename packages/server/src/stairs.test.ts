import { BLOCKS, MOBS } from '@dragon-village/shared/data';
import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, VILLAGE_GEN_VERSION, countOf, give } from '@dragon-village/shared';
import { MobSystem } from './mobs';
import { describe, expect, it } from 'vitest';
import { Storage } from './storage';
import { VillageRoom } from './village';

const INFO = { code: '123456', name: '테스트 마을', seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION };

describe('계단 (#291, 아빠 2026-11-13)', () => {
  it('어느 쪽을 보든·뒤집혔든 계단 아이템 하나로 놓이고, 부수면 계단 하나가 돌아온다. 가방에 없으면 못 놓는다', () => {
    const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const ra = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, 1000);
    const idAt = (x: number) => BLOCKS.get(room.world.getBlock(x, GROUND_Y + 1, 64)).id;
    // 가방에 없으면 거절
    room.onBlockChange(ra.idx, { seq: 1, x: 63, y: GROUND_Y + 1, z: 64, id: 'oak_stairs@e^' }, 1000);
    expect(idAt(63)).toBe('air');
    give(p.inv, 'oak_stairs', 3);
    const ids = ['oak_stairs', 'oak_stairs@e^', 'oak_stairs@w'];
    ids.forEach((id, i) => room.onBlockChange(ra.idx, { seq: 2 + i, x: 63 + i, y: GROUND_Y + 1, z: 64, id }, 1100 + i * 300));
    expect([idAt(63), idAt(64), idAt(65)]).toEqual(ids);
    expect(countOf(p.inv, 'oak_stairs')).toBe(0);
    // 부수면 변형이 아니라 계단 아이템으로
    ids.forEach((_, i) => room.onBlockChange(ra.idx, { seq: 10 + i, x: 63 + i, y: GROUND_Y + 1, z: 64, id: 'air' }, 5000 + i * 3000));
    expect([idAt(63), idAt(64), idAt(65)]).toEqual(['air', 'air', 'air']);
    expect(countOf(p.inv, 'oak_stairs')).toBe(3);
    expect(p.inv.some((s) => s?.item.includes('@'))).toBe(false);
  });

  it('반 블록 (#292): 아래·위 반으로 놓이고, 같은 반 블록을 하나 더 얹으면 한 칸으로 합쳐진다. 부수면 둘이 돌아온다', () => {
    const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const ra = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    const p = room.players.get(ra.idx)!;
    room.onMove(ra.idx, { x: 64.5, y: GROUND_Y + 1, z: 66.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, 1000);
    const y = GROUND_Y + 1;
    const idAt = (x: number) => BLOCKS.get(room.world.getBlock(x, y, 64)).id;
    give(p.inv, 'oak_slab', 4);
    give(p.inv, 'cobblestone_slab', 1);
    let seq = 1,
      now = 1000;
    const put = (x: number, id: string) => room.onBlockChange(ra.idx, { seq: seq++, x, y, z: 64, id }, (now += 400));
    // 빈 자리에 합친 한 칸을 한 번에 놓을 수는 없다
    put(63, 'oak_slab@2');
    expect(idAt(63)).toBe('air');
    put(63, 'oak_slab');
    put(64, 'oak_slab@^');
    expect([idAt(63), idAt(64)]).toEqual(['oak_slab', 'oak_slab@^']);
    expect(countOf(p.inv, 'oak_slab')).toBe(2);
    // 다른 반 블록으로는 못 합친다, 보통 블록으로 덮을 수도 없다
    put(63, 'cobblestone_slab@2');
    give(p.inv, 'stone', 1);
    put(63, 'stone');
    expect(idAt(63)).toBe('oak_slab');
    expect(countOf(p.inv, 'cobblestone_slab')).toBe(1);
    // 같은 반 블록 하나를 더 → 한 칸 (아래 반에도, 위 반에도)
    put(63, 'oak_slab@2');
    put(64, 'oak_slab@2');
    expect([idAt(63), idAt(64)]).toEqual(['oak_slab@2', 'oak_slab@2']);
    expect(countOf(p.inv, 'oak_slab')).toBe(0);
    // 이미 한 칸이면 더 못 얹는다
    give(p.inv, 'oak_slab', 1);
    put(63, 'oak_slab@2');
    expect(countOf(p.inv, 'oak_slab')).toBe(1);
    // 부수면 둘씩
    now += 5000;
    put(63, 'air');
    now += 5000;
    put(64, 'air');
    expect([idAt(63), idAt(64)]).toEqual(['air', 'air']);
    expect(countOf(p.inv, 'oak_slab')).toBe(5);
  });

  it('몹·동물도 반 칸 높이를 따라 걷는다 (#294): 반 블록 위는 반 칸, 계단은 낮은 쪽 반 칸·높은 쪽 한 칸. 좀비가 계단을 반 칸씩 올라온다', () => {
    const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const w = room.world;
    const G = GROUND_Y + 1;
    const OAK = BLOCKS.numOf('oak_stairs'); // 북쪽(−z)이 높다
    const SLAB = BLOCKS.numOf('oak_slab');
    w.setBlock(60, G, 60, SLAB);
    w.setBlock(61, G, 60, BLOCKS.slabVariant(SLAB, 1));
    w.setBlock(62, G, 60, OAK);
    const me = { idx: 0, x: 64.5, y: G + 2, z: 55.5, eyeY: G + 2 + 1.6 };
    const arena = { world: w, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: () => {}, broadcast: () => {}, json: () => {}, reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    for (const ground of [sys.groundAt, room.animals.groundAt]) {
      expect(ground(59.5, 60.5, G)).toBe(G); // 맨땅
      expect(ground(60.5, 60.5, G)).toBe(G + 0.5); // 아래 반
      expect(ground(61.5, 60.5, G)).toBe(G + 1); // 위 반의 윗면
      expect(ground(62.5, 60.75, G)).toBe(G + 0.5); // 계단 낮은 쪽(남)
      expect(ground(62.5, 60.25, G)).toBe(G + 1); // 계단 높은 쪽(북)
    }
    // 계단 두 단 + 그 위 단: (64, G, 60) 계단, (64, G, 59) 돌 + (64, G+1, 59) 계단, z ≤ 58 은 두 칸 높이 돌 — 사람은 그 위에
    const STONE = BLOCKS.numOf('stone');
    for (let x = 63; x <= 65; x++) {
      w.setBlock(x, G, 60, OAK);
      w.setBlock(x, G, 59, STONE);
      w.setBlock(x, G + 1, 59, OAK);
      for (let z = 54; z <= 58; z++) for (const y of [G, G + 1]) w.setBlock(x, y, z, STONE);
    }
    const z = sys.spawnKind('zombie', 64.5, G, 63.5);
    const heights = new Set<number>();
    for (let t = 1000; t < 1000 + 8000; t += 50) {
      sys.tick(t);
      heights.add(z.y);
    }
    expect([...heights].sort((a, b) => a - b)).toEqual([G, G + 0.5, G + 1, G + 1.5, G + 2]);
    expect(z.z).toBeLessThan(58.5); // 다 올라와 사람 쪽으로
  });

  it('울타리·울타리문 (#295): 문은 탭으로 열고 닫는다(가방과 무관). 닫힌 울타리는 몹·동물이 못 넘고, 문을 열면 지나온다', () => {
    const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const ra = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    const p = room.players.get(ra.idx)!;
    const w = room.world;
    const G = GROUND_Y + 1;
    room.onMove(ra.idx, { x: 64.5, y: G, z: 63.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, 1000);
    const idAt = (x: number, z: number) => BLOCKS.get(w.getBlock(x, G, z)).id;
    give(p.inv, 'oak_fence', 2);
    give(p.inv, 'oak_fence_gate', 1);
    let seq = 1,
      now = 1000;
    const put = (x: number, z: number, id: string) => room.onBlockChange(ra.idx, { seq: seq++, x, y: G, z, id }, (now += 400));
    // 열린 문은 못 놓는다. 닫힌 문(동쪽을 보고)과 울타리를 놓는다
    put(64, 60, 'oak_fence_gate@n>');
    expect(idAt(64, 60)).toBe('air');
    put(64, 60, 'oak_fence_gate');
    put(63, 60, 'oak_fence');
    put(65, 60, 'oak_fence');
    expect([idAt(63, 60), idAt(64, 60), idAt(65, 60)]).toEqual(['oak_fence', 'oak_fence_gate', 'oak_fence']);
    expect([countOf(p.inv, 'oak_fence'), countOf(p.inv, 'oak_fence_gate')]).toEqual([0, 0]);
    // 열고 닫기: 아이템은 그대로
    put(64, 60, 'oak_fence_gate@n>');
    expect(idAt(64, 60)).toBe('oak_fence_gate@n>');
    put(64, 60, 'oak_fence_gate@e'); // 방향을 바꾸는 요청은 열고 닫기가 아니다 → 자리가 차 있어 거절
    expect(idAt(64, 60)).toBe('oak_fence_gate@n>');
    put(64, 60, 'oak_fence_gate');
    expect(idAt(64, 60)).toBe('oak_fence_gate');
    expect(countOf(p.inv, 'oak_fence_gate')).toBe(0);
    // 열린 문 칸에 서 있으면 못 닫는다
    put(64, 60, 'oak_fence_gate@n>');
    room.onMove(ra.idx, { x: 64.5, y: G, z: 60.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, (now += 100));
    put(64, 60, 'oak_fence_gate');
    expect(idAt(64, 60)).toBe('oak_fence_gate@n>');
    room.onMove(ra.idx, { x: 64.5, y: G, z: 63.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, (now += 100));
    put(64, 60, 'oak_fence_gate');
    // 땅 높이: 울타리·닫힌 문은 한 칸 반 → 한 칸까지만 오르는 몹·동물은 못 올라선다
    for (const ground of [room.animals.groundAt]) {
      expect(ground(63.5, 60.5, G)).toBe(G + 1.5);
      expect(ground(64.5, 60.5, G)).toBe(G + 1.5);
    }
    // 좀비: 울타리 줄(x 58~70, 가운데 문) 남쪽에서 북쪽의 사람에게. 닫혀 있으면 못 오고, 열면 지나온다
    for (let x = 58; x <= 70; x++) if (x !== 64) w.setBlock(x, G, 60, BLOCKS.numOf('oak_fence'));
    const me = { idx: 0, x: 64.5, y: G, z: 56.5, eyeY: G + 1.6 };
    const arena = { world: w, seed: 5, nightStartsAt: 0, nightMobs: [], den: null, ended: false, elapsedSec: () => 0 };
    const sys = new MobSystem(arena, BLOCKS, MOBS, { players: () => [me], hurt: () => {}, broadcast: () => {}, json: () => {}, reward: () => {}, bossWake: () => {}, bossDefeated: () => {} }, { autoSpawn: false, aggroRange: 24, goal: null, quiet: true });
    const z = sys.spawnKind('zombie', 64.5, G, 63.5);
    for (let t = 1000; t < 7000; t += 50) sys.tick(t);
    expect(z.z).toBeGreaterThan(61);
    expect(z.y).toBe(G);
    w.setBlock(64, G, 60, BLOCKS.gateVariant(BLOCKS.numOf('oak_fence_gate'), 0, true));
    for (let t = 7000; t < 13000; t += 50) sys.tick(t);
    expect(z.z).toBeLessThan(60);
    // 부수면 열려 있든 닫혀 있든 문 하나
    now += 5000;
    room.onMove(ra.idx, { x: 64.5, y: G, z: 62.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, now);
    put(64, 60, 'air');
    expect(countOf(p.inv, 'oak_fence_gate')).toBe(1);
  });

  it('다락문 (#296): 바닥·천장 쪽으로 놓이고 탭으로 열고 닫는다(가방과 무관). 닫힌 판 위에는 동물이 ¼칸 높이로 선다', () => {
    const room = new VillageRoom({ ...INFO }, BLOCKS, new Storage(':memory:'), () => {}, { seedFn: () => 5, starterKit: null, gifts: [] });
    const ra = room.join('a'.repeat(32), '아빠', 0, () => {})!;
    const p = room.players.get(ra.idx)!;
    const G = GROUND_Y + 1;
    room.onMove(ra.idx, { x: 64.5, y: G, z: 63.5, yaw: 0, pitch: 0, flags: FLAG_GROUND }, 1000);
    const idAt = (x: number) => BLOCKS.get(room.world.getBlock(x, G, 60)).id;
    give(p.inv, 'oak_trapdoor', 2);
    let seq = 1,
      now = 1000;
    const put = (x: number, id: string) => room.onBlockChange(ra.idx, { seq: seq++, x, y: G, z: 60, id }, (now += 400));
    put(63, 'oak_trapdoor@n>'); // 열린 것은 못 놓는다
    expect(idAt(63)).toBe('air');
    put(63, 'oak_trapdoor');
    put(65, 'oak_trapdoor@e^');
    expect([idAt(63), idAt(65)]).toEqual(['oak_trapdoor', 'oak_trapdoor@e^']);
    expect(countOf(p.inv, 'oak_trapdoor')).toBe(0);
    expect(room.animals.groundAt(63.5, 60.5, G)).toBe(G + 0.25);
    expect(room.animals.groundAt(65.5, 60.5, G)).toBe(G + 1);
    // 열고 닫기
    put(63, 'oak_trapdoor@n>');
    expect(idAt(63)).toBe('oak_trapdoor@n>');
    expect(room.animals.groundAt(63.5, 60.5, G)).toBe(G); // 열리면 그냥 땅
    put(63, 'oak_trapdoor@n^>'); // 위아래를 바꾸는 요청은 열고 닫기가 아니다
    expect(idAt(63)).toBe('oak_trapdoor@n>');
    put(63, 'oak_trapdoor');
    expect(idAt(63)).toBe('oak_trapdoor');
    expect(countOf(p.inv, 'oak_trapdoor')).toBe(0);
    // 부수면 열려 있어도 다락문 하나
    put(65, 'oak_trapdoor@e^>');
    now += 5000;
    put(65, 'air');
    expect(countOf(p.inv, 'oak_trapdoor')).toBe(1);
  });
});
