/**
 * 마을 건물·공유 창고·마을 레벨 (M6-6, docs/DESIGN.md 성장 축 "마을 건물"). 순수 함수 — 서버가 진실, 클라는 표시.
 *
 * - `data/buildings.json` 의 비용(cost)은 **공유 창고**에서 빠진다. 창고 건물 자체는 처음부터 서 있다(둥지처럼).
 * - 건물은 광장 둘레 정해진 자리(`BUILDING_SITES`)에 실제 블록 구조물로 선다. 서버가 켜질 때 지어진 것을 다시 확인한다.
 * - 마을 건물 자리는 자동 보호 — 아무도 부수거나 덮지 못한다 (DESIGN 6절).
 * - 마을 레벨 = 1 + 지은 건물 수(둥지 포함) + 도감(처음 손에 넣은 블록 종류) ÷ 10. 광장 깃대에 레벨만큼 깃발이 걸린다.
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
  { id: 'lighthouse', x0: 76, z0: 50, size: [3, 3, 12] }, // 북동, 집터 남쪽
  { id: 'brewing_stand', x0: 50, z0: 48, size: [3, 3, 3] }, // 북서 (강은 z 40 아래)
  // 둥지는 겹쳐 자란다: 7×7 둥지 바깥에 11×11 고리(큰 둥지), 그 바깥에 15×15 고리(드래곤 성)
  { id: 'dragon_nest_2', x0: 58, z0: 79, size: [11, 11, 8] },
  { id: 'dragon_nest_3', x0: 56, z0: 77, size: [15, 15, 12] },
];

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
 * 알 수 없는 건물이면 빈 목록 — 둥지 2·3단계·양조기·포탈 확장은 아직 구조물이 없다.
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
    default:
      return [];
  }
}

/** 지어져 있나 — 자리의 표식 두 칸으로 판단 (서버가 켜질 때) */
export function isBuildingBuiltAt(idAt: (x: number, y: number, z: number) => string, id: string, groundY: number): boolean {
  const s = siteOf(id);
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
    default:
      return false;
  }
}

// ---------------------------------------------------------------- 마을 레벨·깃발

/** 도감 몇 종류마다 레벨 1 */
export const CODEX_PER_LEVEL = 10;

export function villageLevel(builtCount: number, codexCount: number): number {
  return 1 + Math.max(0, builtCount) + Math.floor(Math.max(0, codexCount) / CODEX_PER_LEVEL);
}

/** 광장 북쪽 길가의 깃대: 통나무 기둥 + 레벨만큼 양털 깃발(위에서부터, 최대 6) */
export const FLAG_POLE = { x: 66, z: 52, height: 7 } as const;

export function flagBlocks(groundY: number, level: number): Placed[] {
  const out: Placed[] = [];
  for (let i = 1; i <= FLAG_POLE.height; i++) out.push({ x: FLAG_POLE.x, y: groundY + i, z: FLAG_POLE.z, id: 'log' });
  const flags = Math.max(0, Math.min(6, level));
  for (let i = 0; i < 6; i++) out.push({ x: FLAG_POLE.x + 1, y: groundY + FLAG_POLE.height - i, z: FLAG_POLE.z, id: i < flags ? 'wool' : 'air' });
  return out;
}

export function flagContains(groundY: number, x: number, y: number, z: number): boolean {
  return z === FLAG_POLE.z && (x === FLAG_POLE.x || x === FLAG_POLE.x + 1) && y > groundY && y <= groundY + FLAG_POLE.height;
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
