/**
 * 주민 대화 (#172): data/villager-talk.json — 정해진 말만(규칙 3). 주민 이름은 번호로 결정론, 대화는 상황(when)에 맞는 것 중 번호·분으로 고른다.
 * 서버는 모른다(클라에서만) — 대답에 action: feed 가 있으면 클라가 useMob 을 보낸다.
 */
import { z } from 'zod';

const Reply = z
  .object({
    text: z.string().min(1, '대답이 비어 있어요').max(40, '대답은 40글자까지'),
    answer: z.string().min(1, '주민 answer 가 비어 있어요').max(120, 'answer 는 120글자까지'),
    action: z.enum(['feed']).optional(),
  })
  .loose();
const Talk = z
  .object({
    id: z.string().min(1),
    when: z.string().min(1).optional(),
    say: z.string().min(1, 'say 가 비어 있어요').max(120, 'say 는 120글자까지'),
    replies: z.array(Reply).min(1, '대답이 하나는 있어야 해요').max(3, '대답은 3개까지 (폰 화면)'),
  })
  .loose();
const Raw = z.object({ _comment: z.string().optional(), names: z.array(z.string().min(1).max(6, '이름은 6글자까지')).min(1, '이름이 하나는 있어야 해요'), talks: z.array(Talk).min(1, '대화가 하나는 있어야 해요') }).loose();

export interface TalkReply {
  readonly text: string;
  readonly answer: string;
  readonly action: 'feed' | null;
}
export interface TalkDef {
  readonly id: string;
  readonly when: string;
  readonly say: string;
  readonly replies: readonly TalkReply[];
}

/** 대화를 고를 때 보는 것 (클라가 채운다) */
export interface TalkContext {
  /** 손에 든 아이템 id (없으면 null) */
  holding: string | null;
  hasDragon: boolean;
  level: number;
  /** 이 주민에게 이번 접속에서 처음 말 거나 */
  firstTalk: boolean;
  /** 주민 이름 (대장장이처럼 이름으로 고르는 대화, #173) */
  name?: string | null;
}

/** when 조건이 맞나 */
export function talkMatches(when: string, ctx: TalkContext): boolean {
  if (when === 'any') return true;
  if (when === 'firstTalk') return ctx.firstTalk;
  if (when === 'hasDragon') return ctx.hasDragon;
  if (when === 'noDragon') return !ctx.hasDragon;
  if (when.startsWith('holding:')) return ctx.holding === when.slice(8);
  if (when.startsWith('name:')) return (ctx.name ?? null) === when.slice(5);
  const lv = /^level>=(\d+)$/.exec(when);
  if (lv) return ctx.level >= Number(lv[1]);
  return false;
}

export class VillagerTalk {
  constructor(
    readonly names: readonly string[],
    readonly talks: readonly TalkDef[],
  ) {}

  /** 주민 번호로 이름 — 모두에게 같은 이름 */
  nameOf(mobId: number): string {
    return this.names[((mobId * 2654435761) >>> 0) % this.names.length]!;
  }

  /**
   * 상황에 맞는 대화 하나. 특별한 조건(firstTalk·holding·hasDragon·level)이 맞는 게 있으면 그중에서, 없으면 any 중에서.
   * salt(주민 번호 + 분)로 돌아가며 고른다 — 같은 주민도 분마다 다른 말
   */
  pick(ctx: TalkContext, salt: number): TalkDef {
    const ok = this.talks.filter((t) => talkMatches(t.when, ctx));
    // 손에 든 것·처음 인사는 꼭 그 말부터. 나머지(레벨·드래곤·아무 때나)는 맞는 것끼리 돌아가며
    const tiers: ((w: string) => boolean)[] = [(w) => w.startsWith('holding:'), (w) => w === 'firstTalk', (w) => w.startsWith('name:'), () => true];
    for (const tier of tiers) {
      const pool = ok.filter((t) => tier(t.when));
      if (pool.length > 0) return pool[((salt * 2246822519) >>> 0) % pool.length]!;
    }
    return this.talks[((salt * 2246822519) >>> 0) % this.talks.length]!;
  }
}

export function parseVillagerTalk(raw: unknown, fileName = 'data/villager-talk.json'): VillagerTalk {
  const result = Raw.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(전체)'}: ${i.message}`);
    throw new Error(`${fileName} 에 문제가 있어요:\n${lines.join('\n')}`);
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const t of result.data.talks) {
    if (seen.has(t.id)) problems.push(`대화 '${t.id}' 가 두 번 있어요`);
    seen.add(t.id);
    const w = t.when ?? 'any';
    if (!(w === 'any' || w === 'firstTalk' || w === 'hasDragon' || w === 'noDragon' || w.startsWith('holding:') || w.startsWith('name:') || /^level>=\d+$/.test(w))) problems.push(`대화 '${t.id}' 의 when '${w}' 는 모르는 조건이에요 (any / firstTalk / hasDragon / noDragon / holding:아이템 / name:이름 / level>=숫자)`);
  }
  if (problems.length) throw new Error(`${fileName} 에 문제가 있어요:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  return new VillagerTalk(
    result.data.names,
    result.data.talks.map((t) => ({ id: t.id, when: t.when ?? 'any', say: t.say, replies: t.replies.map((r) => ({ text: r.text, answer: r.answer, action: r.action ?? null })) })),
  );
}
