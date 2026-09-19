/**
 * data/starter-kit.json — 처음 들어올 때 한 번 받는 시작 키트 (M4, 결정 #67).
 * 가방이 저장되어 있지 않은 플레이어(처음)에게만 준다. 가방을 다 비워도 다시 주지 않는다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { INV_SLOTS, STACK } from './inventory';

const KitFile = z
  .object({
    _comment: z.string().optional(),
    items: z.record(z.string().regex(/^[a-z0-9_.]+$/, '아이템 이름은 영문 소문자·숫자·밑줄(_)만'), z.number().int().min(1, '1 이상이어야 해요')),
  })
  .loose();

export type StarterKit = Readonly<Record<string, number>>;

export function parseStarterKit(raw: unknown, fileName = 'data/starter-kit.json'): StarterKit {
  const result = KitFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const items = result.data.items;
  let slots = 0;
  for (const n of Object.values(items)) slots += Math.ceil(n / STACK);
  if (slots > INV_SLOTS) throw new DataError(fileName, [`시작 키트가 가방(${INV_SLOTS}칸)보다 커요 (${slots}칸 필요)`]);
  return items;
}
