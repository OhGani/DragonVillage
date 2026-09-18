/**
 * data/redstone.json 검증·로드 (마인크래프트 레드스톤 부품, 아빠 9차 디테일, 결정 #62).
 * 지금은 기획 데이터 — 부품 목록과 버전 배치만 검증한다. 신호 시뮬은 v1.1(단순 켜고 끄기)·v2(회로)에서.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const NAME_RE = /^[a-z0-9_]+$/;
export const REDSTONE_CATEGORIES = ['power', 'wire', 'input', 'machine'] as const;
export type RedstoneCategory = (typeof REDSTONE_CATEGORIES)[number];
export const REDSTONE_CATEGORY_KO: Record<RedstoneCategory, string> = {
  power: '전원',
  wire: '전송·제어',
  input: '입력·감지',
  machine: '기계',
};

const RawPart = z.object({
  id: z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: sticky_piston)'),
  name: z.string().min(1, '한국어 이름이 비어 있어요'),
  category: z.enum(REDSTONE_CATEGORIES),
  signal: z.number().int().min(0, '0~15 사이여야 해요').max(15, '0~15 사이여야 해요').optional(),
  does: z.string().min(1, '뭘 하는지 한 줄 적어 주세요'),
  variants: z.array(z.string()).optional(),
  release: z.string().optional(),
  _note: z.string().optional(),
});

const RedstoneFile = z.object({
  _comment: z.string().optional(),
  rules: z.object({
    maxSignal: z.number().int().min(1),
    wireLossPerBlock: z.number().int().min(0),
    tickMs: z.number().positive(),
    _note: z.string().optional(),
  }),
  parts: z.array(RawPart).min(1, '부품이 하나도 없어요'),
  sonWishlist: z
    .object({
      _comment: z.string().optional(),
      list: z.array(
        z.object({
          rank: z.number().int().min(1),
          name: z.string().min(1),
          parts: z.array(z.string()).min(1, '부품을 하나는 적어 주세요'),
          version: z.string().min(1),
          _note: z.string().optional(),
        }),
      ),
    })
    .optional(),
});

/** 아들이 레드스톤으로 만들고 싶은 것 (우선순위 순, 아들 9차) */
export interface RedstoneWish {
  readonly rank: number;
  readonly name: string;
  readonly parts: readonly string[];
  readonly version: string;
}

const FIELD_KO: Record<string, string> = {
  id: 'id(영문 이름)',
  name: 'name(한국어 이름)',
  category: 'category(power/wire/input/machine)',
  signal: 'signal(신호 세기)',
  does: 'does(하는 일)',
  variants: 'variants(종류 목록)',
  release: 'release(버전)',
};

export interface RedstonePart {
  readonly id: string;
  readonly name: string;
  readonly category: RedstoneCategory;
  /** 내보내는 신호 세기. null = 신호를 안 낸다 */
  readonly signal: number | null;
  readonly does: string;
  readonly variants: readonly string[];
  /** 없으면 v1.1 — 레드스톤은 v1 에 없다 */
  readonly release: string;
}

export interface RedstoneRules {
  readonly maxSignal: number;
  readonly wireLossPerBlock: number;
  readonly tickMs: number;
}

export class RedstoneRegistry {
  private readonly byId = new Map<string, RedstonePart>();
  constructor(
    readonly parts: readonly RedstonePart[],
    readonly rules: RedstoneRules,
    readonly wishlist: readonly RedstoneWish[] = [],
  ) {
    for (const p of parts) this.byId.set(p.id, p);
  }
  get count(): number {
    return this.parts.length;
  }
  find(id: string): RedstonePart | undefined {
    return this.byId.get(id);
  }
  require(id: string): RedstonePart {
    const p = this.byId.get(id);
    if (!p) throw new Error(`레드스톤 부품 '${id}' 을(를) data/redstone.json 에서 찾을 수 없어요`);
    return p;
  }
  byCategory(category: RedstoneCategory): RedstonePart[] {
    return this.parts.filter((p) => p.category === category);
  }
  byRelease(release: string): RedstonePart[] {
    return this.parts.filter((p) => p.release === release);
  }
}

function describePath(path: PropertyKey[], raw: unknown): string {
  if (path[0] === 'parts' && typeof path[1] === 'number') {
    const idx = path[1];
    const parts = (raw as { parts?: unknown[] } | null)?.parts;
    const entry = Array.isArray(parts) ? (parts[idx] as { id?: unknown } | undefined) : undefined;
    const id = entry && typeof entry.id === 'string' ? entry.id : '?';
    const field = path[2];
    const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
    return `${idx + 1}번째 부품(id: ${id})${fieldKo ? `의 ${fieldKo}` : ''}`;
  }
  return path.map(String).join('.');
}

export function parseRedstone(raw: unknown, fileName = 'data/redstone.json'): RedstoneRegistry {
  const result = RedstoneFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${describePath(issue.path, raw)}: ${koreanizeMessage(issue.message)}`,
    );
    throw new DataError(fileName, problems);
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const parts: RedstonePart[] = result.data.parts.map((p, i) => {
    if (seen.has(p.id)) problems.push(`${i + 1}번째 부품: id '${p.id}' 가 두 번 나와요. 하나는 이름을 바꿔 주세요`);
    seen.add(p.id);
    if (p.release === 'v1') problems.push(`${i + 1}번째 부품(id: ${p.id}): 레드스톤은 v1 에 없어요 (v1.1 이나 v2)`);
    if (p.signal !== undefined && p.signal > result.data.rules.maxSignal) {
      problems.push(`${i + 1}번째 부품(id: ${p.id})의 signal: maxSignal(${result.data.rules.maxSignal})보다 클 수 없어요`);
    }
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      signal: p.signal ?? null,
      does: p.does,
      variants: p.variants ?? [],
      release: p.release ?? 'v1.1',
    };
  });
  const wishlist: RedstoneWish[] = (result.data.sonWishlist?.list ?? []).map((w) => {
    for (const id of w.parts) {
      if (!seen.has(id)) problems.push(`만들고 싶은 것 '${w.name}': 부품 '${id}' 가 parts 에 없어요`);
    }
    return { rank: w.rank, name: w.name, parts: w.parts, version: w.version };
  });
  if (problems.length) throw new DataError(fileName, problems);
  const { maxSignal, wireLossPerBlock, tickMs } = result.data.rules;
  return new RedstoneRegistry(parts, { maxSignal, wireLossPerBlock, tickMs }, wishlist);
}
