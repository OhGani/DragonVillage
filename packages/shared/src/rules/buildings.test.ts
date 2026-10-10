import { describe, expect, it } from 'vitest';
import { BUILDING_SITES, NEST_FAMILY, PREBUILT, buildingBlocks, flagBlocks, flagContains, isBuildingBuiltAt, missingCost, siteContains, villageLevel, PORTAL_BASE, expeditionUnlocked,
  VILLAGER_HOUSES,
  villagerSpot,
  levelSiteBlocks,
} from './buildings';
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
    const nestFamily = (id: string) => id === 'nest' || NEST_FAMILY.includes(id);
    const portalFamily = (id: string) => id.startsWith('portal_'); // 포탈 단계는 같은 단 위에 겹쳐 자란다 (#167)
    for (const id of VILLAGER_HOUSES) expect(BUILDING_SITES.some((s) => s.id === id)).toBe(true); // 주민 집 (#168)
    for (const a of rects)
      for (const b of rects) {
        if (a.id === b.id || (nestFamily(a.id) && nestFamily(b.id)) || (portalFamily(a.id) && portalFamily(b.id))) continue; // 둥지는 고리로, 포탈은 단 위에 겹쳐 자란다
        const apart = a.x1 + 1 < b.x0 || b.x1 + 1 < a.x0 || a.z1 + 1 < b.z0 || b.z1 + 1 < a.z0; // 한 칸은 띄운다
        expect(apart, `${a.id} 와 ${b.id} 가 겹쳐요`).toBe(true);
      }
    for (const s of BUILDING_SITES) {
      const def = BUILDINGS.find(s.id)!;
      expect([s.size[0], s.size[1], s.size[2]]).toEqual([def.footprint[0], def.footprint[1], def.footprint[2]]);
      const onRoad = (s.x0 <= 65 && s.x0 + s.size[0] - 1 >= 63) || (s.z0 <= 65 && s.z0 + s.size[1] - 1 >= 63);
      if (!NEST_FAMILY.includes(s.id) && !s.id.startsWith('portal_')) expect(onRoad, `${s.id} 가 길(x 64·z 64) 위에 있어요`).toBe(false); // 둥지·포탈은 길의 양 끝
    }
  });

  it('구조물은 아는 블록으로만 만들고, 지어지면 isBuildingBuiltAt 이 알아본다. 창고엔 문구멍이 있다', () => {
    for (const s of BUILDING_SITES) {
      const blocks = buildingBlocks(s.id, 40);
      expect(blocks.length).toBeGreaterThan(s.id === 'portal_3' || s.id === 'portal_4' || s.id === 'portal_5' ? 3 : 20); // 포탈 3·4·5단계는 표식만 (#167)
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
    // 큰 둥지 고리는 작은 둥지(60~66·81~87) 안을 건드리지 않고, 새 알 자리 위는 비어 있다
    const ring = buildingBlocks('dragon_nest_2', 40);
    expect(ring.some((b) => b.x >= 60 && b.x <= 66 && b.z >= 81 && b.z <= 87)).toBe(false);
    for (const [x, z] of [[61, 80], [65, 80], [59, 84], [67, 84]]) expect(ring.find((b) => b.x === x && b.y === 41 && b.z === z)?.id ?? 'air').toBe('air');
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
    // 이긴 횟수 금 블록 (#128): 왼쪽 기둥에 아래부터, 최대 7, 나머지는 공기로 지운다
    expect(flagBlocks(40, 3).filter((b) => b.id === 'gold_block')).toHaveLength(0);
    const w3 = flagBlocks(40, 3, 'win', 3);
    expect(w3.filter((b) => b.id === 'gold_block' && b.x === 65)).toHaveLength(3);
    expect(w3.filter((b) => b.id === 'air' && b.x === 65)).toHaveLength(4);
    expect(w3.filter((b) => b.id === 'gold_block' && b.x === 67)).toHaveLength(1); // 맨 위 금 깃발
    expect(flagBlocks(40, 3, 'win', 50).filter((b) => b.id === 'gold_block' && b.x === 65)).toHaveLength(7);
  });

  it('원정지 열림: 1단계는 처음부터, 그 외는 포탈 건물을 지어야 (M7-3)', () => {
    expect(expeditionUnlocked('portal_1', [])).toBe(true);
    expect(expeditionUnlocked('portal_2', [])).toBe(false);
    expect(expeditionUnlocked('portal_2', ['storage', 'portal_2'])).toBe(true);
    expect(PORTAL_BASE).toBe('portal_1');
    expect(BUILDINGS.find('portal_2')!.footprint).toEqual([7, 7, 5]);
  });

  it('주민 집 (#168): 남서쪽 세 채, 문 앞 자리, 자리 고르기는 위를 비우고 아래를 메운다', () => {
    for (const id of VILLAGER_HOUSES) {
      const blocks = buildingBlocks(id, 40);
      expect(blocks.length).toBeGreaterThan(20);
      const placed = new Map(blocks.map((b) => [`${b.x},${b.y},${b.z}`, b.id]));
      expect(isBuildingBuiltAt((x, y, z) => placed.get(`${x},${y},${z}`) ?? 'air', id, 40)).toBe(true);
      expect(blocks.some((b) => b.id === 'glowstone')).toBe(true);
    }
    const spot = villagerSpot(0);
    expect(spot.x).toBeGreaterThan(48); // 집(44~48) 동쪽 문 앞
    // 고르기: 집터 위에 나무(통나무)가 서 있고 한 구석이 꺼져 있으면 → 통나무는 공기, 꺼진 곳은 흙, 둘레는 잔디
    const s = BUILDING_SITES.find((b) => b.id === 'villager_house_1')!;
    const idAt = (x: number, y: number, z: number) => (x === s.x0 + 1 && z === s.z0 + 1 && y >= 41 && y <= 45 ? 'log' : x === s.x0 && z === s.z0 && y >= 38 ? 'air' : x === s.x0 - 1 && z === s.z0 && y === 40 ? 'dirt' : y <= 40 ? 'grass' : 'air');
    const lv = levelSiteBlocks(s, 40, idAt);
    expect(lv.filter((b) => b.id === 'air' && b.x === s.x0 + 1 && b.z === s.z0 + 1)).toHaveLength(5);
    expect(lv.filter((b) => b.id === 'dirt' && b.x === s.x0 && b.z === s.z0)).toHaveLength(2); // 38·39
    expect(lv.some((b) => b.id === 'grass' && b.x === s.x0 - 1)).toBe(true);
  });

  it('포탈 3·4·5단계 (#167): 같은 단 위에 단계마다 다른 표식을 세우고, 앞 단계를 먼저 지어야 한다', () => {
    const pad = BUILDING_SITES.find((s) => s.id === 'portal_2')!;
    for (const [id, prev] of [
      ['portal_3', 'portal_2'],
      ['portal_4', 'portal_3'],
      ['portal_5', 'portal_4'],
    ] as const) {
      const s = BUILDING_SITES.find((x) => x.id === id)!;
      expect([s.x0, s.z0, s.size]).toEqual([pad.x0, pad.z0, pad.size]);
      expect(BUILDINGS.find(id)!.requires).toBe(prev);
      const blocks = buildingBlocks(id, 40);
      expect(blocks.length).toBeGreaterThan(0);
      const placed = new Map(blocks.map((b) => [`${b.x},${b.y},${b.z}`, b.id]));
      const idAt = (x: number, y: number, z: number) => placed.get(`${x},${y},${z}`) ?? 'air';
      expect(isBuildingBuiltAt(idAt, id, 40)).toBe(true);
      // 문틀 안쪽(단 가운데)은 건드리지 않는다
      expect(blocks.some((b) => b.x >= pad.x0 + 2 && b.x <= pad.x0 + 4 && b.z >= pad.z0 + 2 && b.z <= pad.z0 + 4)).toBe(false);
    }
    // 단계끼리 같은 칸을 다르게 쓰지 않는다 (앞 단계 표식을 덮지 않게)
    const keys = (id: string) => new Set(buildingBlocks(id, 40).map((b) => `${b.x},${b.y},${b.z}`));
    const k2 = keys('portal_2'),
      k3 = keys('portal_3'),
      k4 = keys('portal_4'),
      k5 = keys('portal_5');
    for (const k of k3) expect(k2.has(k)).toBe(false);
    for (const k of k4) expect(k2.has(k) || k3.has(k)).toBe(false);
    for (const k of k5) expect(k2.has(k) || k3.has(k) || k4.has(k)).toBe(false);
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
