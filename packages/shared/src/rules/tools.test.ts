import { describe, expect, it } from 'vitest';
import toolsJson from '../../../../data/tools.json';
import { BLOCKS, ITEM_NAMES, RECIPES, TOOLS } from './data';
import { axeOf, breakSeconds, canBreakWith, needToolText, parseTools, pickaxeOf, toolOf } from './tools';

const B = (id: string) => BLOCKS.require(id);
const P = (id: string) => pickaxeOf(TOOLS, id);

describe('곡괭이 등급 (아들 2026-09-20)', () => {
  it('tools.json: 6종, 등급·속도', () => {
    expect([...TOOLS.pickaxes.keys()]).toEqual(['wooden_pickaxe', 'stone_pickaxe', 'iron_pickaxe', 'golden_pickaxe', 'diamond_pickaxe', 'netherite_pickaxe']);
    expect(P('stone_pickaxe')!.speed).toBe(P('wooden_pickaxe')!.speed * 2);
    expect(P('iron_pickaxe')!.speed).toBe(P('stone_pickaxe')!.speed * 2.5);
    expect(P('golden_pickaxe')!.speed).toBeLessThan(P('iron_pickaxe')!.speed);
    expect(P('golden_pickaxe')!.durability).toBeLessThan(P('wooden_pickaxe')!.durability);
    expect(P('diamond_pickaxe')!.speed).toBe(P('iron_pickaxe')!.speed * 2.5);
    expect(P('netherite_pickaxe')!.speed).toBe(P('diamond_pickaxe')!.speed * 2);
    expect(TOOLS.enchantSpeedPerLevel).toBe(1.5);
    expect(pickaxeOf(TOOLS, 'planks')).toBeNull();
    expect(pickaxeOf(TOOLS, null)).toBeNull();
  });

  it('돌 캐는 시간: 맨손 1.5초, 나무 1.0, 돌 0.5, 철 0.2, 다이아 0.08, 네더라이트 0.04', () => {
    const stone = B('stone');
    expect(breakSeconds(stone, null)).toBe(1.5);
    expect(breakSeconds(stone, P('wooden_pickaxe'))).toBeCloseTo(1.0);
    expect(breakSeconds(stone, P('stone_pickaxe'))).toBeCloseTo(0.5);
    expect(breakSeconds(stone, P('iron_pickaxe'))).toBeCloseTo(0.2);
    expect(breakSeconds(stone, P('golden_pickaxe'))).toBeGreaterThan(0.2);
    expect(breakSeconds(stone, P('diamond_pickaxe'))).toBeCloseTo(0.08);
    expect(breakSeconds(stone, P('netherite_pickaxe'))).toBeCloseTo(0.04);
    // 인챈트 1단계 → 1.5배 빠름
    expect(breakSeconds(stone, P('iron_pickaxe'), 1.5, 1, TOOLS)).toBeCloseTo(0.2 / 1.5);
  });

  it('광석 등급: 맨손·나무는 광석 못 캠, 돌은 석탄·철만, 철·금은 전부, 흑요석은 다이아 이상', () => {
    expect(canBreakWith(B('coal_ore'), null)).toBe(false);
    expect(canBreakWith(B('coal_ore'), P('wooden_pickaxe'))).toBe(false);
    expect(canBreakWith(B('coal_ore'), P('stone_pickaxe'))).toBe(true);
    expect(canBreakWith(B('iron_ore'), P('stone_pickaxe'))).toBe(true);
    expect(canBreakWith(B('gold_ore'), P('stone_pickaxe'))).toBe(false);
    expect(canBreakWith(B('diamond_ore'), P('iron_pickaxe'))).toBe(true);
    expect(canBreakWith(B('ancient_debris'), P('iron_pickaxe'))).toBe(true);
    expect(canBreakWith(B('diamond_ore'), P('golden_pickaxe'))).toBe(true);
    expect(canBreakWith(B('obsidian'), P('iron_pickaxe'))).toBe(false);
    expect(canBreakWith(B('obsidian'), P('diamond_pickaxe'))).toBe(true);
    // 흑요석: 다이아 = 나무로 돌 캐는 속도(1.0초), 네더라이트 = 돌로 돌 캐는 속도(0.5초)
    expect(breakSeconds(B('obsidian'), P('diamond_pickaxe'))).toBeCloseTo(1.0);
    expect(breakSeconds(B('obsidian'), P('netherite_pickaxe'))).toBeCloseTo(0.5);
    expect(breakSeconds(B('obsidian'), null)).toBeNull();
    expect(breakSeconds(B('coal_ore'), null)).toBeNull();
    // 곡괭이가 필요 없는 블록(흙)은 곡괭이를 들어도 그대로
    expect(breakSeconds(B('dirt'), P('diamond_pickaxe'))).toBe(B('dirt').hardness);
    expect(breakSeconds(B('bedrock'), P('netherite_pickaxe'))).toBeNull();
    expect(needToolText(B('coal_ore'))).toBe('돌 곡괭이가 있어야 캘 수 있어요');
    expect(needToolText(B('gold_ore'))).toBe('철 곡괭이가 있어야 캘 수 있어요');
    expect(needToolText(B('obsidian'))).toMatch(/다이아몬드/);
  });

  it('같은 id 가 두 번이면 한국어로 알려준다', () => {
    const raw = JSON.parse(JSON.stringify(toolsJson)) as { pickaxes: { id: string }[] };
    raw.pickaxes.push({ ...raw.pickaxes[0]! });
    expect(() => parseTools(raw)).toThrow(/두 번/);
  });
});

describe('도끼 (아빠 2026-09-21, #80)', () => {
  const A = (id: string) => axeOf(TOOLS, id);

  it('도끼 6종과 속도 배율 — 금 12 · 네더라이트 9 · 다이아 8 · 철 6 · 돌 4 · 나무 2', () => {
    expect([...TOOLS.axes.keys()]).toEqual(['wooden_axe', 'stone_axe', 'iron_axe', 'golden_axe', 'diamond_axe', 'netherite_axe']);
    expect([...TOOLS.axes.values()].map((a) => a.speed)).toEqual([2, 4, 6, 12, 8, 9]);
    for (const a of TOOLS.axes.values()) expect(a.kind).toBe('axe');
    expect(axeOf(TOOLS, 'iron_pickaxe')).toBeNull();
    expect(toolOf(TOOLS, 'iron_axe')?.kind).toBe('axe');
    expect(toolOf(TOOLS, 'iron_pickaxe')?.kind).toBe('pickaxe');
    expect(toolOf(TOOLS, 'planks')).toBeNull();
  });

  it('나무 블록은 도끼로 빨라지고, 맨손·곡괭이로는 그대로다. 등급 제한은 없다', () => {
    const log = B('log'); // hardness 2
    expect(log.tool).toBe('axe');
    expect(breakSeconds(log, null)).toBe(2);
    expect(breakSeconds(log, pickaxeOf(TOOLS, 'netherite_pickaxe'))).toBe(2); // 곡괭이로는 안 빨라진다
    expect(breakSeconds(log, A('wooden_axe'))).toBeCloseTo(1);
    expect(breakSeconds(log, A('iron_axe'))).toBeCloseTo(2 / 6);
    expect(breakSeconds(log, A('golden_axe'))).toBeCloseTo(2 / 12);
    expect(canBreakWith(log, null)).toBe(true); // 맨손으로도 캔다
    expect(canBreakWith(B('planks'), A('wooden_axe'))).toBe(true);
    // 문·상자·제작대도 도끼
    for (const id of ['planks', 'oak_door', 'chest', 'crafting_table', 'bookshelf', 'pumpkin']) expect(B(id).tool, id).toBe('axe');
  });

  it('도끼로는 광석을 못 캔다 (곡괭이 등급 그대로)', () => {
    expect(canBreakWith(B('coal_ore'), A('netherite_axe'))).toBe(false);
    expect(canBreakWith(B('stone'), A('iron_axe'))).toBe(true); // 돌은 맨손도 되니 도끼도 된다
    expect(breakSeconds(B('stone'), A('iron_axe'))).toBe(1.5); // 빨라지지는 않는다
    expect(needToolText(B('coal_ore'))).toContain('곡괭이');
  });

  it('도끼 레시피 6개 — 재료 3 + 막대기 2, 네더라이트는 다이아몬드 도끼 + 네더라이트', () => {
    expect(RECIPES.require('wooden_axe')).toMatchObject({ station: 'crafting_table', in: { planks: 3, stick: 2 }, out: { wooden_axe: 1 } });
    expect(RECIPES.require('stone_axe')).toMatchObject({ in: { cobblestone: 3, stick: 2 } });
    expect(RECIPES.require('iron_axe')).toMatchObject({ in: { iron_ingot: 3, stick: 2 } });
    expect(RECIPES.require('golden_axe')).toMatchObject({ in: { gold_ingot: 3, stick: 2 } });
    expect(RECIPES.require('diamond_axe')).toMatchObject({ in: { diamond: 3, stick: 2 } });
    expect(RECIPES.require('netherite_axe')).toMatchObject({ in: { diamond_axe: 1, netherite: 1 } });
    // 도끼마다 tools.json 에 속도가 있어야 한다
    for (const id of TOOLS.axes.keys()) expect(RECIPES.find(id), id).toBeTruthy();
    for (const id of TOOLS.axes.keys()) expect(ITEM_NAMES.get(id), id).toContain('도끼');
  });

  it('없는 종류의 도구는 한국어로 알려준다', () => {
    expect(() => parseTools({ enchantSpeedPerLevel: 1.5, pickaxes: [{ id: 'a', name: 'ㄱ', tier: 0, speed: 1, durability: 1 }], axes: [{ id: 'a', name: 'ㄴ', tier: 0, speed: 1, durability: 1 }] })).toThrow(/두 번/);
  });
});
