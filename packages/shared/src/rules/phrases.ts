/**
 * data/phrases.json 검증·로드 — 채팅은 여기 있는 이모지·문구만 (규칙 3, 자유 입력 없음).
 * Emote 메시지는 종류(0 이모지 / 1 문구) + 번호만 보낸다. 번호는 파일 순서(이모지) 또는 id(문구).
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

export const EMOTE_EMOJI = 0;
export const EMOTE_PHRASE = 1;
/** 초당 보낼 수 있는 수 */
export const EMOTE_PER_SEC = 1;

const PhrasesFile = z
  .object({
    _comment: z.string().optional(),
    emojis: z.array(z.string().min(1, '빈 이모지가 있어요').max(8, '이모지는 하나씩 적어 주세요')).min(1, '이모지가 하나도 없어요').max(32, '이모지는 32개까지'),
    phrases: z
      .array(
        z.object({
          id: z.number().int().min(1, '번호는 1부터').max(255, '번호는 255까지'),
          text: z.string().min(1, '빈 문구가 있어요').max(20, '문구는 20글자까지'),
        }),
      )
      .min(1, '문구가 하나도 없어요')
      .max(64, '문구는 64개까지'),
  })
  .loose();

export interface Phrase {
  readonly id: number;
  readonly text: string;
}

export class PhraseRegistry {
  private readonly byId = new Map<number, Phrase>();
  constructor(
    readonly emojis: readonly string[],
    readonly phrases: readonly Phrase[],
  ) {
    for (const p of phrases) this.byId.set(p.id, p);
  }
  emoji(index: number): string | undefined {
    return this.emojis[index];
  }
  phrase(id: number): Phrase | undefined {
    return this.byId.get(id);
  }
  /** 보낼 수 있는 것인가 (서버 검증) */
  valid(kind: number, id: number): boolean {
    if (kind === EMOTE_EMOJI) return Number.isInteger(id) && id >= 0 && id < this.emojis.length;
    if (kind === EMOTE_PHRASE) return this.byId.has(id);
    return false;
  }
  /** 화면에 보일 글자 */
  text(kind: number, id: number): string {
    if (kind === EMOTE_EMOJI) return this.emojis[id] ?? '';
    return this.byId.get(id)?.text ?? '';
  }
}

export function parsePhrases(raw: unknown, fileName = 'data/phrases.json'): PhraseRegistry {
  const result = PhrasesFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.map(String).join('.')}: ${koreanizeMessage(issue.message)}`);
    throw new DataError(fileName, problems);
  }
  const problems: string[] = [];
  const seen = new Set<number>();
  for (const p of result.data.phrases) {
    if (seen.has(p.id)) problems.push(`문구 번호 ${p.id} 가 두 번 나와요`);
    seen.add(p.id);
  }
  if (problems.length) throw new DataError(fileName, problems);
  return new PhraseRegistry(result.data.emojis, result.data.phrases);
}
