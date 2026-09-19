/**
 * 실제 data/*.json 을 읽어 검증한 결과.
 * 번들러(Vite/vitest)가 JSON 을 그대로 import 한다.
 */
import blocksJson from '../../../../data/blocks.json';
import expeditionsJson from '../../../../data/expeditions.json';
import potionsJson from '../../../../data/potions.json';
import redstoneJson from '../../../../data/redstone.json';
import { parseBlocks } from './blocks';
import { parseExpeditions } from './expeditions';
import { parsePotions } from './potions';
import { parseRedstone } from './redstone';

export const BLOCKS = parseBlocks(blocksJson);
export const POTIONS = parsePotions(potionsJson);
export const REDSTONE = parseRedstone(redstoneJson);
export const EXPEDITIONS = parseExpeditions(expeditionsJson);
