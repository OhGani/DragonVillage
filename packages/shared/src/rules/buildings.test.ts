import { describe, expect, it } from 'vitest';
import { BUILDING_SITES, PREBUILT, buildingBlocks, flagBlocks, flagContains, isBuildingBuiltAt, missingCost, siteContains, villageLevel } from './buildings';
import { BLOCKS, BUILDINGS } from './data';
import { NEST } from './dragons';

describe('마을 건물 (M6-6)', () => {
  it('buildings.json 이 읽히고, 먼저 지어야 하는 건물이 다 있다', () => {
    expect(BUILDINGS.find('storage')).toMatchObject({ name: '창고', cost: { planks: 24, cobblestone: 16 } });
    expect(BUILDINGS.find('dragon_nest_2')?.requires).toBe('dragon_nest_1');
    expect(BUILDINGS.list.length).toBeGreaterThanOrEqual(8);
    for (const id of PREBUILT) expect(BUILDINGS.find(id)).toBeDefined();
  });

  it('자리들이 서로·둥지·집터·길과 겹치지 않고, 자리 크기가 JSON 의 footprint 와 같다', () => {
    const rects = BUILDING_SITES.map((s) => ({ id: s.id, x0: s.x0, z0: s.z0, x1: s.x0 + s.size[0] - 1, z1: s.z0 + s.size[1] - 1 }));
    rects.push({ id: 'nest', x0: NEST.x0, z0: NEST.z0, x1: NEST.x0 + NEST.size - 1, z1: NEST.z0 + NEST.size - 1 });
    rects.push({ id: 'house', x0: 74, z0: 42, x1: 80, z1: 48 });
    for (const a of rects)
      for (const b of rects) {
        if (a.id === b.id) continue;
        const apart = a.x1 + 1 < b.x0 || b.x1 + 1 < a.x0 || a.z1 + 1 < b.z0 || b.z1 + 1 < a.z0; // 한 칸은 띄운다
        expect(apart, `${a.id} 와 ${b.id} 가 겹쳐요`).toBe(true);
      }
    for (const s of BUILDING_SITES) {
      const def = BUILDINGS.find(s.id)!;
      expect([s.size[0], s.size[1], s.size[2]]).toEqual([def.footprint[0], def.footprint[1], def.footprint[2]]);
      const onRoad = (s.x0 <= 65 && s.x0 + s.size[0] - 1 >= 63) || (s.z0 <= 65 && s.z0 + s.size[1] - 1 >= 63);
      expect(onRoad, `${s.id} 가 길(x 64·z 64) 위에 있어요`).toBe(false);
    }
  });

  it('구조물은 아는 블록으로만 만들고, 지어지면 isBuildingBuiltAt 이 알아본다. 창고엔 문구멍이 있다', () => {
    for (const s of BUILDING_SITES) {
      const blocks = buildingBlocks(s.id, 40);
      expect(blocks.length).toBeGreaterThan(20);
      for (const b of blocks) expect(BLOCKS.find(b.id), `${s.id}: 모르는 블록 ${b.id}`).toBeDefined();
      const world = new Map(blocks.map((b) => [`${b.x},${b.y},${b.z}`, b.id]));
      const idAt = (x: number, y: number, z: number) => world.get(`${x},${y},${z}`) ?? 'air';
      expect(isBuildingBuiltAt(idAt, s.id, 40), s.id).toBe(true);
      expect(isBuildingBuiltAt(() => 'air', s.id, 40)).toBe(false);
      for (const b of blocks) expect(siteContains(s, 40, b.x, b.y, b.z), `${s.id} 블록이 자리 밖`).toBe(true);
    }
    const st = BUILDING_SITES.find((s) => s.id === 'storage')!;
    const door = buildingBlocks('storage', 40).filter((b) => b.x === st.x0 && b.z === st.z0 + 2 && (b.y === 41 || b.y === 42));
    expect(door.map((b) => b.id)).toEqual(['air', 'air']); // 광장 쪽(서쪽) 벽 가운데 아래 두 칸
  });

  it('마을 레벨 = 1 + 건물 + 도감/10, 깃발은 레벨만큼(최대 6)', () => {
    expect(villageLevel(0, 0)).toBe(1);
    expect(villageLevel(2, 25)).toBe(5);
    const f = flagBlocks(40, 3);
    expect(f.filter((b) => b.id === 'wool')).toHaveLength(3);
    expect(f.filter((b) => b.id === 'log')).toHaveLength(7);
    expect(flagBlocks(40, 99).filter((b) => b.id === 'wool')).toHaveLength(6);
    for (const b of f) expect(flagContains(40, b.x, b.y, b.z)).toBe(true);
    expect(flagContains(40, 66, 40, 52)).toBe(false); // 바닥은 아니다
  });

  it('창고 재고로 비용을 낼 수 있는지 — 모자란 것만 돌려준다', () => {
    const stock = new Map([
      ['planks', 30],
      ['cobblestone', 10],
    ]);
    expect(missingCost(stock, { planks: 24, cobblestone: 16 })).toEqual({ cobblestone: 6 });
    expect(missingCost(stock, { planks: 24 })).toEqual({});
    expect(missingCost(new Map(), { coal: 3 })).toEqual({ coal: 3 });
  });
});
