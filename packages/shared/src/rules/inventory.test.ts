import { describe, expect, it } from 'vitest';
import { INV_SLOTS, STACK, countOf, emptyInventory, give, hasAll, isValidInventory, missing, move, take, takeFromSlot, fits, normalizeStacks, stackOf } from './inventory';

describe('가방', () => {
  it('넣기: 같은 아이템 칸부터 채우고, 빈 칸, 넘치면 남는다', () => {
    const inv = emptyInventory();
    expect(inv.length).toBe(INV_SLOTS);
    const ch = new Set<number>();
    expect(give(inv, 'dirt', 70, ch)).toBe(0);
    expect(inv[0]).toEqual({ item: 'dirt', count: 64 });
    expect(inv[1]).toEqual({ item: 'dirt', count: 6 });
    expect([...ch]).toEqual([0, 1]);
    give(inv, 'stone', 3);
    expect(inv[2]).toEqual({ item: 'stone', count: 3 });
    give(inv, 'dirt', 10); // 1번 칸에 합쳐진다
    expect(inv[1]!.count).toBe(16);
    expect(countOf(inv, 'dirt')).toBe(80);
    // 가득 채우기
    const full = emptyInventory();
    expect(give(full, 'cobblestone', STACK * INV_SLOTS + 5)).toBe(5);
  });

  it('빼기: 뒤 칸부터, 모자라면 아무것도 안 뺀다', () => {
    const inv = emptyInventory();
    give(inv, 'dirt', 70);
    expect(take(inv, 'dirt', 100)).toBe(false);
    expect(countOf(inv, 'dirt')).toBe(70);
    expect(take(inv, 'dirt', 10)).toBe(true); // 1번 칸(6) 비우고 0번에서 4
    expect(inv[1]).toBeNull();
    expect(inv[0]!.count).toBe(60);
    expect(takeFromSlot(inv, 0, 60)).toBe(true);
    expect(inv[0]).toBeNull();
    expect(takeFromSlot(inv, 0, 1)).toBe(false);
  });

  it('옮기기: 이동·합치기·맞바꾸기·나누기', () => {
    const inv = emptyInventory();
    give(inv, 'dirt', 10);
    give(inv, 'stone', 5);
    expect(move(inv, 0, 12, 4)).toBe(true); // 나누기
    expect(inv[0]).toEqual({ item: 'dirt', count: 6 });
    expect(inv[12]).toEqual({ item: 'dirt', count: 4 });
    expect(move(inv, 12, 0, 4)).toBe(true); // 합치기
    expect(inv[0]!.count).toBe(10);
    expect(inv[12]).toBeNull();
    expect(move(inv, 0, 1, 10)).toBe(true); // 맞바꾸기 (전부일 때만)
    expect(inv[0]).toEqual({ item: 'stone', count: 5 });
    expect(inv[1]).toEqual({ item: 'dirt', count: 10 });
    expect(move(inv, 0, 1, 2)).toBe(false); // 다른 아이템에 일부만은 안 됨
    expect(move(inv, 0, 0, 1)).toBe(false);
    expect(move(inv, 0, 99, 1)).toBe(false);
    expect(move(inv, 5, 6, 1)).toBe(false); // 빈 칸에서
  });

  it('재료 확인', () => {
    const inv = emptyInventory();
    give(inv, 'planks', 5);
    expect(hasAll(inv, { planks: 4 })).toBe(true);
    expect(hasAll(inv, { planks: 6 })).toBe(false);
    expect(missing(inv, { planks: 6, stick: 2 })).toEqual({ planks: 1, stick: 2 });
  });

  it('저장·전송 검증', () => {
    const inv = emptyInventory();
    give(inv, 'potion.speed', 1);
    expect(isValidInventory(inv)).toBe(true);
    expect(isValidInventory([...inv, null])).toBe(false);
    const bad = emptyInventory();
    bad[0] = { item: 'Dirt!', count: 1 };
    expect(isValidInventory(bad)).toBe(false);
    bad[0] = { item: 'dirt', count: 65 };
    expect(isValidInventory(bad)).toBe(false);
  });
});

describe('양동이 겹침 (#135, 마인크래프트와 같게)', () => {
  it('빈 양동이는 16개, 찬 양동이는 한 칸에 하나, 나머지는 64', () => {
    expect(stackOf('bucket')).toBe(16);
    expect(stackOf('water_bucket')).toBe(1);
    expect(stackOf('lava_bucket')).toBe(1);
    expect(stackOf('milk_bucket')).toBe(1);
    expect(stackOf('dirt')).toBe(64);
    const inv = emptyInventory();
    expect(give(inv, 'bucket', 17)).toBe(0);
    expect(inv[0]).toEqual({ item: 'bucket', count: 16 });
    expect(inv[1]).toEqual({ item: 'bucket', count: 1 });
    expect(give(inv, 'water_bucket', 3)).toBe(0);
    expect(inv.slice(2, 5)).toEqual([{ item: 'water_bucket', count: 1 }, { item: 'water_bucket', count: 1 }, { item: 'water_bucket', count: 1 }]);
    expect(move(inv, 3, 2, 1)).toBe(false); // 물 양동이끼리는 안 합쳐진다
    // 가방이 거의 차면 물 양동이는 빈 칸이 있어야 들어간다
    for (let i = 5; i < inv.length; i++) inv[i] = { item: 'dirt', count: 64 };
    expect(fits(inv, [{ item: 'water_bucket', count: 1 }])).toBe(false);
    expect(fits(inv, [{ item: 'bucket', count: 1 }])).toBe(true); // 16 → 17 은 둘째 칸(1개)에
  });

  it('옛 저장본: 한 칸에 물 양동이 3개면 빈 칸으로 나눈다, 빈 칸이 없으면 그대로', () => {
    const inv = emptyInventory();
    inv[0] = { item: 'water_bucket', count: 3 };
    normalizeStacks(inv);
    expect(inv[0]).toEqual({ item: 'water_bucket', count: 1 });
    expect(inv[1]).toEqual({ item: 'water_bucket', count: 1 });
    expect(inv[2]).toEqual({ item: 'water_bucket', count: 1 });
    const full = emptyInventory().map(() => ({ item: 'dirt', count: 64 }));
    full[0] = { item: 'lava_bucket', count: 2 };
    normalizeStacks(full);
    expect(full[0]).toEqual({ item: 'lava_bucket', count: 2 }); // 잃지 않는다
  });
});
