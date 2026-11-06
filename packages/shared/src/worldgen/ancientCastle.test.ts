import { describe, expect, it } from 'vitest';
import bossesJson from '../../../../data/bosses.json';
import { BLOCKS, EXPEDITIONS, MOBS } from '../rules/data';
import { KING_KINDS } from '../rules/mobs';
import { CASTLE_BOUNDS, CASTLE_KINDS, ROOM_DEPTHS, ROOM_MOBS_PER_KIND, WALL_H, generateAncientCastle } from './ancientCastle';
import { generateExpedition, hasGenerator } from './expedition';
import { fingerprint } from './fingerprint';
import { portalContains } from './island';

const SEED = 777;
/** 생성기를 바꾸면 갱신. (chunks 수, 지문) */
const SNAPSHOT = '1001:14728e74:3335998';

const gen = generateAncientCastle(BLOCKS, SEED, 3);
const { world, spawn, layout } = gen;
const id = (x: number, y: number, z: number) => BLOCKS.get(world.getBlock(x, y, z)).id;

/** 걷기 */
function reachable(from: { x: number; y: number; z: number }, limit = 900_000): Set<string> {
  const open = (x: number, y: number, z: number) => {
    const d = BLOCKS.get(world.getBlock(x, y, z));
    return !d.solid && !d.fluid;
  };
  const seen = new Set<string>();
  const q: [number, number, number][] = [[Math.floor(from.x), Math.floor(from.y), Math.floor(from.z)]];
  seen.add(q[0]!.join(','));
  while (q.length && seen.size < limit) {
    const [x, y, z] = q.pop()!;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as [number, number][])
      for (const dy of [0, 1, -1]) {
        const nx = x + dx,
          ny = y + dy,
          nz = z + dz;
        if (!world.inBounds(nx, ny, nz) || ny < 1) continue;
        if (!open(nx, ny, nz) || !open(nx, ny + 1, nz)) continue;
        if (!BLOCKS.get(world.getBlock(nx, ny - 1, nz)).solid) continue;
        if (dy === 1 && !open(x, y + 2, z)) continue;
        const k = `${nx},${ny},${nz}`;
        if (seen.has(k)) continue;
        seen.add(k);
        q.push([nx, ny, nz]);
      }
  }
  return seen;
}

describe('generateAncientCastle 결정론', () => {
  it('같은 시드 → 같은 성, 다른 시드 → 다른 성', () => {
    const again = generateAncientCastle(BLOCKS, SEED, 3);
    expect(fingerprint(again.world, BLOCKS)).toBe(fingerprint(world, BLOCKS));
    expect(again.layout).toEqual(layout);
    const other = generateAncientCastle(BLOCKS, SEED + 1, 3);
    expect(fingerprint(other.world, BLOCKS)).not.toBe(fingerprint(world, BLOCKS));
  });

  it('스냅샷 (바꿨으면 CASTLE_GEN_VERSION 도 올릴 것)', () => {
    expect(`${world.chunkCount}:${fingerprint(world, BLOCKS)}`).toBe(SNAPSHOT);
  });
});

describe('generateAncientCastle 배치 (아들 보스 설계, 2026-11-06)', () => {
  it('방 넷이 남 → 북 한 줄 (입구·초반·중간·최종), 석재 벽돌 벽, 성문 위 첫 번째 왕들의 머리 넷', () => {
    expect(world.sizeX).toBe(CASTLE_BOUNDS.sizeCX * 16);
    expect(layout.rooms.map((r) => r.name)).toEqual(['입구', '초반 방', '중간 방', '최종 방']);
    layout.rooms.forEach((r, i) => {
      expect(r.z1 - r.z0 + 1).toBe(ROOM_DEPTHS[i]);
      if (i > 0) expect(r.z1).toBeLessThan(layout.rooms[i - 1]!.z0); // 북쪽으로
      expect(['stone_bricks', 'mossy_stone_bricks', 'cracked_stone_bricks']).toContain(id(r.x0 - 1, r.y + 2, r.z0 + 3)); // 서쪽 벽
      expect(id(128, r.y, r.z0 + 3)).toBe('air');
    });
    const zS = layout.rooms[0]!.z1 + 1;
    const top = layout.rooms[0]!.y + WALL_H + 1;
    const faces = [-8, -4, 0, 4].map((dx) => id(128 + dx + 1, top + 1, zS + 1));
    expect(faces).toEqual(['quartz_block', 'lime_wool', 'black_wool', 'green_wool']); // 머리 가운데 줄 (스켈레톤·크리퍼·엔더맨·좀비)
    const p = layout.portal;
    for (let x = p.x - 2; x <= p.x + 1; x++) expect(id(x, p.y, p.z)).toBe('obsidian');
    expect(portalContains(p, p.x, p.y + 1, p.z + 0.5)).toBe(true);
  });

  it('방 몹은 bosses.json mobsPerKind (2·8·14·30) × 종족 넷, rank 는 0~1. 최종 방에 네 왕·금 왕좌, 상자 셋. 성문에서 왕까지 걸어서', () => {
    const raw = bossesJson as unknown as { finalBosses: { id: string; battle?: { rooms: { mobsPerKind: number }[] } }[] };
    const rooms = raw.finalBosses.find((b) => b.id === 'four_kings')!.battle!.rooms;
    expect(rooms.map((r) => r.mobsPerKind)).toEqual([...ROOM_MOBS_PER_KIND]);
    for (let ri = 0; ri < 4; ri++)
      for (const k of CASTLE_KINDS) expect(layout.mobs.filter((m) => m.room === ri && m.group === k)).toHaveLength(ROOM_MOBS_PER_KIND[ri]!);
    // 왕의 부하 변종이 섞여 있다 (스트레이·충전된 크리퍼·엔더마이트·허스크 …)
    for (const v of ['stray', 'wither_skeleton', 'charged_creeper', 'endermite', 'husk', 'drowned']) expect(layout.mobs.some((m) => m.kind === v), v).toBe(true);
    for (const m of layout.mobs) {
      expect(m.rank).toBeGreaterThan(0);
      expect(m.rank).toBeLessThan(1);
      const r = layout.rooms[m.room]!;
      expect(m.x >= r.x0 && m.x <= r.x1 && m.z >= r.z0 && m.z <= r.z1).toBe(true);
      expect(id(m.x, m.y, m.z)).toBe('air');
    }
    // 한 명이면 1/4 쯤만 남는다
    const solo = layout.mobs.filter((m) => m.rank < 0.25).length;
    expect(solo).toBeGreaterThan(layout.mobs.length * 0.15);
    expect(solo).toBeLessThan(layout.mobs.length * 0.35);
    expect(layout.kings.map((k) => k.kind)).toEqual([...KING_KINDS]);
    for (const k of KING_KINDS) expect(MOBS.get(k).hp).toBe(600);
    expect(id(layout.throne.x, layout.throne.y, layout.throne.z - 2)).toBe('gold_block');
    expect(layout.treasures).toHaveLength(3);
    for (const c of layout.treasures) expect(id(c.x, c.y, c.z)).toBe('chest');
    const seen = reachable(spawn);
    for (const k of layout.kings) expect(seen.has(`${k.x},${k.y},${k.z}`)).toBe(true);
  });

  it('expeditions.json 의 고대성: 이제 v1, 생성기·포탈 6단계, 방 몹은 rank 를 달고, 네 왕은 kings 로', () => {
    const def = EXPEDITIONS.require('ancient_castle');
    expect(def.release).toBe('v1');
    expect(hasGenerator(def.generator)).toBe(true);
    expect(def.unlockedBy).toBe('portal_6');
    expect(def.durationSec).toBe(900);
    const g = generateExpedition(def, BLOCKS, SEED);
    expect(g.den).toBeNull();
    expect(g.kings?.map((k) => k.kind)).toEqual([...KING_KINDS]);
    expect(g.spawns.length).toBe(layout.mobs.length);
    expect(g.spawns.every((s) => typeof s.rank === 'number')).toBe(true);
  });
});
