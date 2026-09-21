/**
 * data/gifts.json — 아빠가 모두에게 한 번씩 주는 선물 (결정 #79).
 * 서버가 입장할 때 아직 안 받은 선물을 가방에 넣고 `gifts_given` 에 적는다. 같은 id 는 한 사람당 한 번.
 * 시작 키트(`starterKit.ts`)와 다른 점: 키트는 "처음 온 사람만", 선물은 "이미 놀던 사람 포함 모두".
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import { STACK } from './inventory';

const GiftFile = z
  .object({
    _comment: z.string().optional(),
    gifts: z.array(
      z
        .object({
          id: z.string().regex(/^[a-z0-9_]+$/, '선물 id 는 영문 소문자·숫자·밑줄(_)만'),
          name: z.string().min(1, '이름이 비었어요'),
          message: z.string().min(1, '메시지가 비었어요').optional(),
          items: z.record(z.string().regex(/^[a-z0-9_.]+$/, '아이템 이름은 영문 소문자·숫자·밑줄(_)만'), z.number().int().min(1, '1 이상이어야 해요')),
        })
        .loose(),
    ),
  })
  .loose();

export interface GiftDef {
  readonly id: string;
  readonly name: string;
  /** 받은 사람 화면에 뜨는 말 */
  readonly message: string;
  readonly items: Readonly<Record<string, number>>;
}

/** 서버 → 클라: 이번에 받은 선물 (welcome) */
export interface GiftNotice {
  id: string;
  name: string;
  message: string;
}

export function parseGifts(raw: unknown, fileName = 'data/gifts.json'): GiftDef[] {
  const result = GiftFile.safeParse(raw);
  if (!result.success) {
    throw new DataError(fileName, result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const list: GiftDef[] = result.data.gifts.map((g) => {
    if (seen.has(g.id)) problems.push(`선물 '${g.id}' 가 두 번 나와요`);
    seen.add(g.id);
    let slots = 0;
    for (const n of Object.values(g.items)) slots += Math.ceil(n / STACK);
    if (slots > 9) problems.push(`선물 '${g.id}'(${g.name})가 너무 커요 — 가방 ${slots}칸이 필요해요 (9칸까지)`);
    if (Object.keys(g.items).length === 0) problems.push(`선물 '${g.id}'(${g.name})에 아이템이 없어요`);
    return { id: g.id, name: g.name, message: g.message ?? `선물이 왔어요: ${g.name}`, items: g.items };
  });
  if (problems.length) throw new DataError(fileName, problems);
  return list;
}
