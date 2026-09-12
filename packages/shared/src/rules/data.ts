/**
 * 실제 data/*.json 을 읽어 검증한 결과.
 * 번들러(Vite/vitest)가 JSON 을 그대로 import 한다.
 */
import blocksJson from '../../../../data/blocks.json';
import { parseBlocks } from './blocks';

export const BLOCKS = parseBlocks(blocksJson);
