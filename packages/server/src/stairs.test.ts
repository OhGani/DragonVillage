import { BLOCKS } from '@dragon-village/shared/data';
import { DEFAULT_VILLAGE_SEED, FLAG_GROUND, GROUND_Y, VILLAGE_GEN_VERSION, countOf, give } from '@dragon-village/shared';
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
});
