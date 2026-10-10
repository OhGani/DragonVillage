/**
 * 마을 건물·공유 창고·마을 레벨 (M6-6, docs/DESIGN.md 성장 축 "마을 건물"). 순수 함수 — 서버가 진실, 클라는 표시.
 *
 * - `data/buildings.json` 의 비용(cost)은 **공유 창고**에서 빠진다. 창고 건물 자체는 처음부터 서 있다(둥지처럼).
 * - 건물은 광장 둘레 정해진 자리(`BUILDING_SITES`)에 실제 블록 구조물로 선다. 서버가 켜질 때 지어진 것을 다시 확인한다.
 * - 마을 건물 자리는 자동 보호 — 아무도 부수거나 덮지 못한다 (DESIGN 6절).
 * - 마을 레벨 = 1 + 지은 건물 수(둥지 포함) + 도감(처음 손에 넣은 블록 종류) ÷ 10. 광장 깃대에 레벨만큼 깃발이 걸린다.
 * - 포탈 단계(M7-3): `portal_2` 는 북쪽 포탈 자리 그 자체(7×7 단). 지으면 `expeditions.json unlockedBy: portal_2` 원정지(동굴)가 열린다. 1단계는 처음부터.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const BuildingFile = z
  .object({
    _comment: z.string().optional(),
    buildings: z.array(
      z
        .object({
          id: z.string().regex(/^[a-z0-9_]+$/, '건물 id 는 영문 소문자·숫자·밑줄(_)만'),
          name: z.string().min(1, '이름이 비었어요'),
          level: z.number().int().min(1, '1 이상이어야 해요'),
          cost: z.record(z.string().regex(/^[a-z0-9_.]+$/, '아이템 이름은 영문 소문자·숫자·밑줄(_)만'), z.number().int().min(1, '1 이상이어야 해요')),
          footprint: z.tuple([z.number().int().min(1), z.number().int().min(1), z.number().int().min(1)]),
          unlocks: z.array(z.string()).optional(),
          requires: z.string().optional(),
        })
        .loose(),
    ),
  })
  .loose();

export interface BuildingDef {
  readonly id: string;
  readonly name: string;
  /** 필요한 마을 레벨 */
  readonly level: number;
  readonly cost: Readonly<Record<string, number>>;
  readonly footprint: readonly [number, number, number];
  readonly unlocks: readonly string[];
  /** 먼저 지어야 하는 건물 */
  readonly requires: string | null;
}

export class BuildingRegistry {
  private readonly byId = new Map<string, BuildingDef>();
  constructor(readonly list: readonly BuildingDef[]) {
    for (const b of list) this.byId.set(b.id, b);
  }
  find(id: string): BuildingDef | undefined {
    return this.byId.get(id);
  }
}

export function parseBuildings(raw: unknown, fileName = 'data/buildings.json'): BuildingRegistry {
  const result = BuildingFile.safeParse(raw);
  if (!result.success) throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const seen = new Set<string>();
  const problems: string[] = [];
  const list = result.data.buildings.map((b): BuildingDef => {
    if (seen.has(b.id)) problems.push(`건물 '${b.id}' 가 두 번 나와요`);
    seen.add(b.id);
    return { id: b.id, name: b.name, level: b.level, cost: b.cost, footprint: b.footprint, unlocks: b.unlocks ?? [], requires: b.requires ?? null };
  });
  for (const b of list) if (b.requires && !seen.has(b.requires)) problems.push(`건물 '${b.id}' 가 없는 건물 '${b.requires}' 을 먼저 지어야 한다고 해요`);
  if (problems.length) throw new DataError(fileName, problems);
  return new BuildingRegistry(list);
}

// ---------------------------------------------------------------- 자리

export interface Site {
  readonly id: string;
  readonly x0: number;
  readonly z0: number;
  /** 가로·세로(x·z)·높이 */
  readonly size: readonly [number, number, number];
}

/** 처음부터 서 있는 건물 (비용 없음). 둥지는 dragons.ts 가 따로 관리한다 */
export const PREBUILT: readonly string[] = ['storage'];

/**
 * 광장(가운데 64,64 · 반지름 14) 둘레의 건물 자리. 둥지(남쪽 60~66·81~87)·포탈(북)·아빠 집터(북동 74~80·42~48)·길(x 64·z 64)을 피한다.
 * 이 자리에 지을 수 있는 건물은 여기 적힌 것만 — 마을마다 같은 곳에 서서 친구가 와도 헷갈리지 않는다.
 */
export const BUILDING_SITES: readonly Site[] = [
  { id: 'storage', x0: 76, z0: 58, size: [5, 5, 4] }, // 광장 동쪽, 길(z 64) 북쪽
  { id: 'forge', x0: 47, z0: 58, size: [5, 5, 4] }, // 광장 서쪽, 길 북쪽
  { id: 'farm', x0: 47, z0: 72, size: [7, 7, 2] }, // 남서
  { id: 'lighthouse', x0: 76, z0: 72, size: [3, 3, 12] }, // 남동, 창고 남쪽 — 북동 집터(74~80·42~48)는 아빠·아들이 직접 짓는 곳이라 비워 둔다 (#99)
  { id: 'brewing_stand', x0: 50, z0: 48, size: [3, 3, 3] }, // 북서 (강은 z 40 아래)
  { id: 'portal_2', x0: 61, z0: 41, size: [7, 7, 5] }, // 북쪽 포탈 단(worldgen/village PORTAL_PAD) 그 자리 — 길의 북쪽 끝
  // 포탈 3·4·5단계도 같은 단 위에 표식을 더한다 (#167): 3 = 모서리 기둥 꼭대기 금, 4 = 네 변 가운데 흑요석 기둥 + 발광석, 5 = 그 꼭대기 다이아
  { id: 'portal_3', x0: 61, z0: 41, size: [7, 7, 5] },
  { id: 'portal_4', x0: 61, z0: 41, size: [7, 7, 5] },
  { id: 'portal_5', x0: 61, z0: 41, size: [7, 7, 5] },
  // 둥지는 겹쳐 자란다: 7×7 둥지 바깥에 11×11 고리(큰 둥지), 그 바깥에 15×15 고리(드래곤 성)
  // 주민 집 세 채 (#168, 아들 13차 6번 "지금 건물 바깥 둘레"): 광장 남서쪽, 농장 남쪽에 한 줄. 서버가 처음부터 세운다(비용 없음, 마을 레벨엔 안 센다)
  { id: 'villager_house_1', x0: 44, z0: 80, size: [5, 5, 4] },
  { id: 'villager_house_2', x0: 44, z0: 88, size: [5, 5, 4] },
  { id: 'villager_house_3', x0: 44, z0: 96, size: [5, 5, 4] },
  { id: 'dragon_nest_2', x0: 58, z0: 79, size: [11, 11, 8] },
  { id: 'dragon_nest_3', x0: 56, z0: 77, size: [15, 15, 12] },
];

/**
 * 자리를 옮긴 건물의 옛 자리 (#99). 서버가 켜질 때 옛 자리에 그 건물이 서 있으면 지우고(바닥은 잔디) 새 자리에 다시 세운다.
 * 옮길 때마다 여기에 한 줄 더한다 — 이미 지어 둔 마을이 깨지지 않게.
 */
export const OLD_SITES: readonly Site[] = [{ id: 'lighthouse', x0: 76, z0: 50, size: [3, 3, 12] }];

/** 옛 자리를 비우는 블록 목록: 바닥은 잔디, 위는 공기 */
export function clearSiteBlocks(s: Site, groundY: number): Placed[] {
  return box(s, groundY, (_dx, _dz, dy) => (dy === 0 ? 'grass' : 'air'));
}

/** 주민 집 (#168): 서버가 처음부터 세우고, 건물 수(마을 레벨)엔 안 센다 */
export const VILLAGER_HOUSES: readonly string[] = ['villager_house_1', 'villager_house_2', 'villager_house_3'];
/** 주민이 서는 곳: 집 문 앞(동쪽) */
export function villagerSpot(i: number): { x: number; z: number } {
  const s = siteOf(VILLAGER_HOUSES[i % VILLAGER_HOUSES.length]!)!;
  return { x: s.x0 + s.size[0] + 1.5, z: s.z0 + 2.5 };
}

/**
 * 자리 고르기 (#168): 발자국 + 둘레 한 칸을 groundY 높이로 — 위는 비우고(나무·풀), 아래 빈 곳은 흙으로 메우고, 땅 윗면은 잔디.
 * 발자국 안은 건물 블록이 덮으니 둘레만 잔디를 깐다. idAt 으로 지금 세계를 본다
 */
export function levelSiteBlocks(s: Site, groundY: number, idAt: (x: number, y: number, z: number) => string): Placed[] {
  const out: Placed[] = [];
  const solid = (id: string) => id !== 'air' && id !== 'water' && id !== 'lava' && !id.startsWith('water') && !id.startsWith('lava');
  for (let z = s.z0 - 1; z <= s.z0 + s.size[1]; z++)
    for (let x = s.x0 - 1; x <= s.x0 + s.size[0]; x++) {
      const inside = x >= s.x0 && x < s.x0 + s.size[0] && z >= s.z0 && z < s.z0 + s.size[1];
      for (let y = groundY + 1; y <= groundY + 8; y++) if (solid(idAt(x, y, z))) out.push({ x, y, z, id: 'air' });
      for (let y = groundY - 4; y < groundY; y++) if (!solid(idAt(x, y, z))) out.push({ x, y, z, id: 'dirt' });
      if (!inside && idAt(x, groundY, z) !== 'grass') out.push({ x, y: groundY, z, id: 'grass' });
    }
  return out;
}

/** 둥지 식구 — 자리가 서로 겹치는 게 정상 (고리로 자란다) */
export const NEST_FAMILY: readonly string[] = ['dragon_nest_1', 'dragon_nest_2', 'dragon_nest_3'];

export function siteOf(id: string): Site | undefined {
  return BUILDING_SITES.find((s) => s.id === id);
}

/** 이 칸이 자리 안(바닥 포함, 높이만큼)인가 */
export function siteContains(s: Site, groundY: number, x: number, y: number, z: number): boolean {
  return x >= s.x0 && x < s.x0 + s.size[0] && z >= s.z0 && z < s.z0 + s.size[1] && y >= groundY && y <= groundY + s.size[2];
}

/** 자리 가운데 (창을 열 수 있는 거리를 잴 때) */
export function siteCenter(s: Site): { x: number; z: number } {
  return { x: s.x0 + s.size[0] / 2, z: s.z0 + s.size[1] / 2 };
}

/** 창고를 열 수 있는 거리 (자리 가운데에서) */
export const STORAGE_REACH = 7;

// ---------------------------------------------------------------- 구조물

export interface Placed {
  x: number;
  y: number;
  z: number;
  id: string;
}

/** 자리 하나에 상자 채우기: fn(dx, dz, dy) → 블록 id 또는 null(건드리지 않음). dy 0 = 바닥 */
function box(s: Site, groundY: number, fn: (dx: number, dz: number, dy: number) => string | null): Placed[] {
  const out: Placed[] = [];
  for (let dy = 0; dy <= s.size[2]; dy++)
    for (let dz = 0; dz < s.size[1]; dz++)
      for (let dx = 0; dx < s.size[0]; dx++) {
        const id = fn(dx, dz, dy);
        if (id !== null) out.push({ x: s.x0 + dx, y: groundY + dy, z: s.z0 + dz, id });
      }
  return out;
}

/**
 * 건물 블록 목록 (서버가 짓는다). 광장 쪽(가운데 64,64)을 바라보는 벽 한가운데에 문구멍을 낸다.
 * 알 수 없는 건물이면 빈 목록. 포탈 3·4·5단계는 같은 단 위에 표식만 더한다 (#167).
 */
export function buildingBlocks(id: string, groundY: number): Placed[] {
  const s = siteOf(id);
  if (!s) return [];
  const [w, d, h] = s.size;
  const edge = (dx: number, dz: number) => dx === 0 || dz === 0 || dx === w - 1 || dz === d - 1;
  const corner = (dx: number, dz: number) => (dx === 0 || dx === w - 1) && (dz === 0 || dz === d - 1);
  const c = siteCenter(s);
  const towardX = Math.abs(c.x - 64) >= Math.abs(c.z - 64);
  const door = (dx: number, dz: number) => (towardX ? dx === (c.x < 64 ? w - 1 : 0) && dz === (d - 1) >> 1 : dz === (c.z < 64 ? d - 1 : 0) && dx === (w - 1) >> 1);
  switch (id) {
    case 'storage':
      return box(s, groundY, (dx, dz, dy) => {
        if (dy === 0) return 'cobblestone';
        if (dy === h) return 'planks'; // 지붕
        if (corner(dx, dz)) return 'log';
        if (edge(dx, dz)) return door(dx, dz) && dy <= 2 ? 'air' : dy === 2 && (dx + dz) % 2 === 0 ? 'glass' : 'planks';
        return dy === 1 && (dx === 2 || dz === 2) ? 'hay_bale' : 'air'; // 안에는 건초 더미
      });
    case 'forge':
      return box(s, groundY, (dx, dz, dy) => {
        if (dy === 0) return 'cobblestone';
        if (dy === h) return edge(dx, dz) ? 'cobblestone' : 'air'; // 가운데가 뚫린 지붕 — 굴뚝 느낌
        if (corner(dx, dz)) return 'cobblestone';
        if (edge(dx, dz)) return door(dx, dz) && dy <= 2 ? 'air' : 'cobblestone';
        if (dy === 1 && dx === 2 && dz === 2) return 'furnace';
        if (dy === 1 && dx === 1 && dz === 2) return 'crafting_table';
        return 'air';
      });
    case 'farm':
      return box(s, groundY, (dx, dz, dy) => {
        if (dy === 0) return edge(dx, dz) ? 'planks' : dx === 3 && dz === 3 ? 'water' : 'farmland';
        if (dy === 1) return corner(dx, dz) ? 'torch' : 'air';
        return null;
      });
    case 'lighthouse':
      return box(s, groundY, (dx, dz, dy) => {
        const mid = dx === 1 && dz === 1;
        if (dy === 0) return 'cobblestone';
        if (dy >= h - 2) return mid ? (dy === h ? 'glowstone' : 'air') : dy === h ? 'cobblestone' : 'glass'; // 꼭대기 유리 방 + 빛
        return mid ? 'air' : 'cobblestone';
      });
    case 'brewing_stand':
      return box(s, groundY, (dx, dz, dy) => {
        if (dy === 0) return 'cobblestone';
        if (dy === h) return corner(dx, dz) ? 'air' : 'planks'; // 작은 지붕
        if (corner(dx, dz)) return 'log';
        if (dy === 1 && dx === 1 && dz === 1) return 'brewing_stand';
        return 'air';
      });
    case 'dragon_nest_2':
    case 'dragon_nest_3': {
      // 고리: 바깥 두 줄만 채우고 안쪽(작은 둥지)은 건드리지 않는다(null). 모서리에 기둥 + 발광석, 고리 바닥은 돌·조약돌
      const ring = (dx: number, dz: number) => dx < 2 || dz < 2 || dx >= w - 2 || dz >= d - 2;
      const pillar = (dx: number, dz: number) => (dx === 0 || dx === w - 1) && (dz === 0 || dz === d - 1);
      const midPillar = (dx: number, dz: number) => id === 'dragon_nest_3' && ((dx === 0 || dx === w - 1) && dz === (d - 1) >> 1 || (dz === 0 || dz === d - 1) && dx === (w - 1) >> 1);
      const floor = id === 'dragon_nest_3' ? 'stone' : 'cobblestone';
      const top = id === 'dragon_nest_3' ? 6 : 4;
      return box(s, groundY, (dx, dz, dy) => {
        if (!ring(dx, dz)) return null;
        if (dy === 0) return floor;
        if (pillar(dx, dz) || midPillar(dx, dz)) return dy < top ? 'log' : dy === top ? 'glowstone' : null;
        if (dy === 1 && (dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1) && (dx + dz) % 3 === 0) return 'hay_bale'; // 바깥 테두리에 건초
        return dy <= 1 ? 'air' : null; // 고리 위 한 칸만 비워 두고 위는 그대로
      });
    }
    case 'portal_2':
      // 포탈 단 테두리를 돌로 바꾸고 네 모서리에 흑요석 기둥 + 발광석. 문틀·단 안쪽은 건드리지 않는다(null)
      return box(s, groundY, (dx, dz, dy) => {
        if (corner(dx, dz)) return dy === 0 || dy === 3 ? 'glowstone' : dy <= 2 ? 'obsidian' : null;
        if (dy === 0 && edge(dx, dz)) return 'stone';
        return null;
      });
    case 'villager_house_1':
    case 'villager_house_2':
    case 'villager_house_3':
      // 주민 집 (#168): 조약돌 바닥, 통나무 기둥, 판자 벽에 유리창, 광장 쪽(동쪽) 문, 안엔 책장·천장 발광석
      return box(s, groundY, (dx, dz, dy) => {
        if (dy === 0) return 'cobblestone';
        if (dy === h) return 'planks';
        if (corner(dx, dz)) return 'log';
        if (edge(dx, dz)) return door(dx, dz) && dy <= 2 ? 'air' : dy === 2 && (dx === 2 || dz === 2) ? 'glass' : 'planks';
        if (dy === h - 1 && dx === 2 && dz === 2) return 'glowstone';
        if (dy === 1 && dx === 1 && dz === 1) return 'bookshelf';
        return 'air';
      });
    case 'portal_3':
      // 모서리 기둥 꼭대기에 금 블록 (#167)
      return box(s, groundY, (dx, dz, dy) => (corner(dx, dz) && dy === 4 ? 'gold_block' : null));
    case 'portal_4': {
      // 네 변 가운데에도 흑요석 기둥 + 발광석 — 기둥 여덟 (문틀 양끝 바깥 칸)
      const mid = (dx: number, dz: number) => edge(dx, dz) && !corner(dx, dz) && (dx === (w - 1) >> 1 || dz === (d - 1) >> 1);
      return box(s, groundY, (dx, dz, dy) => (mid(dx, dz) ? (dy === 3 ? 'glowstone' : dy >= 1 && dy <= 2 ? 'obsidian' : null) : null));
    }
    case 'portal_5': {
      // 변 가운데 기둥 꼭대기에 다이아몬드 블록
      const mid = (dx: number, dz: number) => edge(dx, dz) && !corner(dx, dz) && (dx === (w - 1) >> 1 || dz === (d - 1) >> 1);
      return box(s, groundY, (dx, dz, dy) => (mid(dx, dz) && dy === 4 ? 'diamond_block' : null));
    }
    default:
      return [];
  }
}

/** 지어져 있나 — 자리의 표식 두 칸으로 판단 (서버가 켜질 때). site 를 주면 그 자리(옛 자리 검사)로 */
export function isBuildingBuiltAt(idAt: (x: number, y: number, z: number) => string, id: string, groundY: number, site?: Site): boolean {
  const s = site ?? siteOf(id);
  if (!s) return false;
  switch (id) {
    case 'storage':
      return idAt(s.x0, groundY + 1, s.z0) === 'log' && idAt(s.x0 + 2, groundY + s.size[2], s.z0 + 2) === 'planks';
    case 'forge':
      return idAt(s.x0 + 2, groundY + 1, s.z0 + 2) === 'furnace' && idAt(s.x0, groundY + 1, s.z0) === 'cobblestone';
    case 'farm':
      return idAt(s.x0 + 3, groundY, s.z0 + 3) === 'water' && idAt(s.x0, groundY, s.z0) === 'planks';
    case 'lighthouse':
      return idAt(s.x0 + 1, groundY + s.size[2], s.z0 + 1) === 'glowstone';
    case 'brewing_stand':
      return idAt(s.x0 + 1, groundY + 1, s.z0 + 1) === 'brewing_stand' && idAt(s.x0, groundY + 1, s.z0) === 'log';
    case 'dragon_nest_2':
      return idAt(s.x0, groundY + 4, s.z0) === 'glowstone' && idAt(s.x0, groundY, s.z0) === 'cobblestone';
    case 'dragon_nest_3':
      return idAt(s.x0, groundY + 6, s.z0) === 'glowstone' && idAt(s.x0, groundY, s.z0) === 'stone';
    case 'portal_2':
      return idAt(s.x0, groundY + 1, s.z0) === 'obsidian' && idAt(s.x0, groundY + 3, s.z0) === 'glowstone';
    case 'villager_house_1':
    case 'villager_house_2':
    case 'villager_house_3':
      return idAt(s.x0, groundY + 1, s.z0) === 'log' && idAt(s.x0 + 2, groundY + 3, s.z0 + 2) === 'glowstone';
    case 'portal_3':
      return idAt(s.x0, groundY + 4, s.z0) === 'gold_block';
    case 'portal_4':
      return idAt(s.x0 + 3, groundY + 1, s.z0) === 'obsidian' && idAt(s.x0 + 3, groundY + 3, s.z0) === 'glowstone';
    case 'portal_5':
      return idAt(s.x0 + 3, groundY + 4, s.z0) === 'diamond_block';
    default:
      return false;
  }
}

// ---------------------------------------------------------------- 포탈 단계

/** 처음부터 열려 있는 포탈 단계 (buildings.json portal_1 — 마을 생성 시 기본 제공) */
export const PORTAL_BASE = 'portal_1';

/** 이 원정지(unlockedBy = 포탈 건물 id)에 갈 수 있나 */
export function expeditionUnlocked(unlockedBy: string, built: readonly string[]): boolean {
  return unlockedBy === PORTAL_BASE || built.includes(unlockedBy);
}

// ---------------------------------------------------------------- 마을 레벨·깃발

/** 도감 몇 종류마다 레벨 1 */
export const CODEX_PER_LEVEL = 10;

export function villageLevel(builtCount: number, codexCount: number): number {
  return 1 + Math.max(0, builtCount) + Math.floor(Math.max(0, codexCount) / CODEX_PER_LEVEL);
}

/** 광장 북쪽 길가의 깃대: 통나무 기둥 + 레벨만큼 양털 깃발(위에서부터, 최대 6) */
export const FLAG_POLE = { x: 66, z: 52, height: 7 } as const;

/** 마지막 방어전 결과 표시 (M7-5): 승리 = 금 깃발, 패배 = 검은 깃발(흑요석). 맨 위 깃발 한 칸이 바뀐다 */
export type FlagMark = 'win' | 'loss' | null;

/** 깃대 왼쪽(x−1)에 쌓이는 이긴 횟수 금 블록 최대 (아들 13차, #128) */
export const FLAG_WINS_MAX = FLAG_POLE.height;

/**
 * 깃대 블록들: 가운데 원목 기둥, 오른쪽(x+1) 레벨 깃발(최대 6, 맨 위는 마지막 방어전 결과 금/흑요석),
 * 왼쪽(x−1) 방어전 **이긴 횟수**만큼 금 블록(최대 FLAG_WINS_MAX, 아들 13차 답 2026-10-07 "이긴 횟수 표시")
 */
export function flagBlocks(groundY: number, level: number, mark: FlagMark = null, wins = 0): Placed[] {
  const out: Placed[] = [];
  for (let i = 1; i <= FLAG_POLE.height; i++) out.push({ x: FLAG_POLE.x, y: groundY + i, z: FLAG_POLE.z, id: 'log' });
  const gold = Math.max(0, Math.min(FLAG_WINS_MAX, Math.floor(wins)));
  for (let i = 1; i <= FLAG_POLE.height; i++) out.push({ x: FLAG_POLE.x - 1, y: groundY + i, z: FLAG_POLE.z, id: i <= gold ? 'gold_block' : 'air' });
  const flags = Math.max(0, Math.min(6, level));
  for (let i = 0; i < 6; i++) {
    let id = i < flags ? 'wool' : 'air';
    if (i === 0 && mark === 'win') id = 'gold_block';
    else if (i === 0 && mark === 'loss') id = 'obsidian';
    out.push({ x: FLAG_POLE.x + 1, y: groundY + FLAG_POLE.height - i, z: FLAG_POLE.z, id });
  }
  return out;
}

export function flagContains(groundY: number, x: number, y: number, z: number): boolean {
  return z === FLAG_POLE.z && x >= FLAG_POLE.x - 1 && x <= FLAG_POLE.x + 1 && y > groundY && y <= groundY + FLAG_POLE.height;
}

/** 창고 재고로 이 비용을 낼 수 있나. 모자란 것을 돌려준다 (비어 있으면 낼 수 있다) */
export function missingCost(stock: ReadonlyMap<string, number>, cost: Readonly<Record<string, number>>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [item, n] of Object.entries(cost)) {
    const have = stock.get(item) ?? 0;
    if (have < n) out[item] = n - have;
  }
  return out;
}
