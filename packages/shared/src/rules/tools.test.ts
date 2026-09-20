import { describe, expect, it } from 'vitest';
import toolsJson from '../../../../data/tools.json';
import { BLOCKS, TOOLS } from './data';
import { breakSeconds, canBreakWith, needToolText, parseTools, pickaxeOf } from './tools';

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
