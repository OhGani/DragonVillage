/**
 * 이름 금칙어 (M9-4, #152): data/banned-words.json 의 말이 닉네임·마을 이름에 들어 있으면 거절한다.
 * 비교는 소문자로, 띄어쓰기·기호·숫자를 뺀 뒤 "포함"으로 본다 (초5 친구들이 띄어 쓰거나 기호를 끼워 피하는 걸 막는다).
 */
import { z } from 'zod';

const Raw = z.object({ _comment: z.string().optional(), words: z.array(z.string()) }).loose();

/** 비교용으로 다듬는다: 소문자, 글자(한글·영문)만 남긴다 */
export function foldName(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}]/gu, '');
}

export class BannedWords {
  readonly words: readonly string[];
  constructor(words: readonly string[]) {
    this.words = [...new Set(words.map(foldName).filter((w) => w.length > 0))];
  }
  get count(): number {
    return this.words.length;
  }
  /** 이 이름에 금칙어가 들어 있나 → 걸린 말, 없으면 null */
  find(name: string): string | null {
    const f = foldName(name);
    if (!f) return null;
    for (const w of this.words) if (f.includes(w)) return w;
    return null;
  }
}

export function parseBannedWords(raw: unknown, fileName = 'data/banned-words.json'): BannedWords {
  const result = Raw.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(전체)'}: ${i.message}`);
    throw new Error(`${fileName} 에 문제가 있어요:\n${lines.join('\n')}`);
  }
  return new BannedWords(result.data.words);
}
