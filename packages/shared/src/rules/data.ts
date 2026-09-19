/**
 * 실제 data/*.json 을 읽어 검증한 결과.
 * 번들러(Vite/vitest)가 JSON 을 그대로 import 한다.
 */
import blocksJson from '../../../../data/blocks.json';
import dragonsJson from '../../../../data/dragons.json';
import expeditionsJson from '../../../../data/expeditions.json';
import phrasesJson from '../../../../data/phrases.json';
import potionsJson from '../../../../data/potions.json';
import recipesJson from '../../../../data/recipes.json';
import redstoneJson from '../../../../data/redstone.json';
import { parseBlocks } from './blocks';
import { parseExpeditions } from './expeditions';
import { buildItemNames } from './items';
import { parsePhrases } from './phrases';
import { parseRecipes } from './recipes';
import { parsePotions } from './potions';
import { parseRedstone } from './redstone';

export const BLOCKS = parseBlocks(blocksJson);
export const POTIONS = parsePotions(potionsJson);
export const REDSTONE = parseRedstone(redstoneJson);
export const EXPEDITIONS = parseExpeditions(expeditionsJson);
export const RECIPES = parseRecipes(recipesJson);
export const PHRASES = parsePhrases(phrasesJson);
/** 아이템 id → 한국어 이름 (블록 아닌 것). 블록은 BLOCKS 에서 */
export const ITEM_NAMES = buildItemNames({ recipes: recipesJson, dragons: dragonsJson, potions: potionsJson });
