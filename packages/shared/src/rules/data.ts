/**
 * 실제 data/*.json 을 읽어 검증한 결과.
 * 번들러(Vite/vitest)가 JSON 을 그대로 import 한다.
 */
import blocksJson from '../../../../data/blocks.json';
import buildingsJson from '../../../../data/buildings.json';
import mobsJson from '../../../../data/mobs.json';
import dragonsJson from '../../../../data/dragons.json';
import expeditionsJson from '../../../../data/expeditions.json';
import familyRulesJson from '../../../../data/family-rules.json';
import phrasesJson from '../../../../data/phrases.json';
import potionsJson from '../../../../data/potions.json';
import recipesJson from '../../../../data/recipes.json';
import redstoneJson from '../../../../data/redstone.json';
import giftsJson from '../../../../data/gifts.json';
import starterKitJson from '../../../../data/starter-kit.json';
import toolsJson from '../../../../data/tools.json';
import xpJson from '../../../../data/xp.json';
import { parseBlocks } from './blocks';
import { parseBuildings } from './buildings';
import { parseMobs } from './mobs';
import { eggItem, eggRecipes, parseDragons } from './dragons';
import { parseExpeditions } from './expeditions';
import { parseFamilyRules } from './family';
import { buildItemNames } from './items';
import { parsePhrases } from './phrases';
import { RecipeRegistry, parseRecipes } from './recipes';
import { parsePotions } from './potions';
import { parseRedstone } from './redstone';
import { parseGifts } from './gifts';
import { parseStarterKit } from './starterKit';
import { parseTools } from './tools';
import { parseXp } from './xp';

export const BLOCKS = parseBlocks(blocksJson);
/** 마을 건물 (M6-6) — 비용은 공유 창고에서 */
export const BUILDINGS = parseBuildings(buildingsJson);
export const POTIONS = parsePotions(potionsJson);
export const REDSTONE = parseRedstone(redstoneJson);
export const EXPEDITIONS = parseExpeditions(expeditionsJson);
/** 드래곤 16종 (M6-2, 아들 설계) */
export const DRAGONS = parseDragons(dragonsJson);
/** 레시피 + 드래곤 알 레시피 16개(제작대) */
export const RECIPES = new RecipeRegistry([...parseRecipes(recipesJson).defs, ...eggRecipes(DRAGONS)]);
export const PHRASES = parsePhrases(phrasesJson);
/** 가족 시간 규칙 (M5, 아들 값: 평일 20·주말 30·보너스 5) */
export const FAMILY_RULES = parseFamilyRules(familyRulesJson);
/** 곡괭이 등급 (아들 2026-09-20) */
export const TOOLS = parseTools(toolsJson);
/** 경험치 규칙 (M6-1, 마인크래프트 값 + 우리 것) */
export const XP = parseXp(xpJson);
/** 원정 밤의 몹 — 좀비·크리퍼 (M7-2). 드롭·이름은 mobs.json, 경험치는 xp.json */
export const MOBS = parseMobs(mobsJson, XP.mobs);
/** 처음 들어올 때 한 번 받는 것 (#67) */
export const STARTER_KIT = parseStarterKit(starterKitJson);
/** 아빠가 모두에게 한 번씩 주는 선물 (#79) */
export const GIFTS = parseGifts(giftsJson);
/** 아이템 id → 한국어 이름 (블록 아닌 것). 블록은 BLOCKS 에서 */
export const ITEM_NAMES = buildItemNames({ recipes: recipesJson, dragons: dragonsJson, potions: potionsJson });
for (const d of DRAGONS.list) ITEM_NAMES.set(eggItem(d.id), `${d.name} 알`);
