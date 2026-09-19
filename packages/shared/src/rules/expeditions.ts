/**
 * data/expeditions.json 검증·로드 + 원정 시간 규칙 (M3).
 * 아들이 편집하는 파일이므로 실패 메시지는 짧고 쉬운 한국어로 낸다.
 * 낮·저녁·밤 단계와 스카이라이트 배율은 순수 함수 — 클라(하늘·안개)와 서버(위험도, M7)가 같은 값을 쓴다.
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';

const NAME_RE = /^[a-z0-9_]+$/;

const RawExpedition = z
  .object({
    id: z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: grass_island)'),
    name: z.string().min(1, '한국어 이름이 비어 있어요'),
    generator: z.string().min(1, '어떤 생성기를 쓰는지 적어 주세요 (island, cave, desert …)'),
    durationSec: z.number().int().positive('0보다 커야 해요 (초)'),
    nightStartsAt: z.number().int().min(0, '0 이상이어야 해요 (0 = 항상 어두움)'),
    treasures: z.number().int().min(0, '0 이상이어야 해요'),
    unlockedBy: z.string().min(1),
    danger: z.number().int().min(0, '0 이상이어야 해요').max(10, '0~10 사이여야 해요'),
    materials: z.array(z.string()),
    release: z.string().optional(),
  })
  .loose(); // 아들 디테일(sonDetails 등)은 그대로 통과

const ExpeditionsFile = z
  .object({
    _comment: z.string().optional(),
    returnGraceSec: z.number().int().min(0, '0 이상이어야 해요'),
    failedReturnKeepRatio: z.number().min(0, '0~1 사이여야 해요').max(1, '0~1 사이여야 해요'),
    minStartMarginMin: z.number().min(0, '0 이상이어야 해요'),
    expeditions: z.array(RawExpedition).min(1, '원정지가 하나도 없어요'),
  })
  .loose();

const FIELD_KO: Record<string, string> = {
  id: 'id(영문 이름)',
  name: 'name(한국어 이름)',
  generator: 'generator(지형 생성기)',
  durationSec: 'durationSec(원정 시간, 초)',
  nightStartsAt: 'nightStartsAt(밤 시작, 초)',
  treasures: 'treasures(보물 상자 수)',
  unlockedBy: 'unlockedBy(여는 포탈 단계)',
  danger: 'danger(위험도)',
  materials: 'materials(나오는 재료)',
  release: 'release(버전)',
};

export interface ExpeditionDef {
  readonly id: string;
  readonly name: string;
  readonly generator: string;
  readonly durationSec: number;
  /** 밤이 시작되는 초. 0 = 처음부터 어두움(동굴·네더·엔드) */
  readonly nightStartsAt: number;
  readonly treasures: number;
  readonly unlockedBy: string;
  readonly danger: number;
  readonly materials: readonly string[];
  readonly release: string;
}

export interface ExpeditionRules {
  /** 원정이 끝난 뒤 세계를 몇 초 더 두나(늦은 귀환·정산 전송) */
  readonly returnGraceSec: number;
  /** 늦게(또는 못) 돌아오면 가져오는 비율 */
  readonly failedReturnKeepRatio: number;
  /** 원정 시간 + 이 여유(분)가 남아야 출발할 수 있다 (M5 시간 규칙) */
  readonly minStartMarginMin: number;
}

export type ExpeditionPhase = 'day' | 'evening' | 'night';
export const PHASE_KO: Record<ExpeditionPhase, string> = { day: '낮', evening: '저녁', night: '밤' };

/** 저녁 = 밤 시작 전 이만큼 */
export const EVENING_SEC = 90;
/** 밤이 깊어져 가장 어두워지기까지 */
export const NIGHT_FADE_SEC = 60;
/** 한밤 스카이라이트 배율 (0 이면 아무것도 안 보인다) */
export const NIGHT_SKY = 0.22;

export class ExpeditionRegistry {
  private readonly byId = new Map<string, ExpeditionDef>();
  constructor(
    readonly defs: readonly ExpeditionDef[],
    readonly rules: ExpeditionRules,
  ) {
    for (const d of defs) this.byId.set(d.id, d);
  }
  get count(): number {
    return this.defs.length;
  }
  find(id: string): ExpeditionDef | undefined {
    return this.byId.get(id);
  }
  require(id: string): ExpeditionDef {
    const d = this.byId.get(id);
    if (!d) throw new Error(`원정지 '${id}' 을(를) data/expeditions.json 에서 찾을 수 없어요`);
    return d;
  }
  /** v1 에 들어가는 원정지 (release 없음 또는 'v1'), 파일 순서 = 해제 순서 */
  v1(): ExpeditionDef[] {
    return this.defs.filter((d) => d.release === 'v1');
  }
}

/** 경과 초 → 낮/저녁/밤 */
export function phaseAt(def: Pick<ExpeditionDef, 'nightStartsAt'>, elapsedSec: number): ExpeditionPhase {
  if (def.nightStartsAt <= 0) return 'night';
  if (elapsedSec >= def.nightStartsAt) return 'night';
  if (elapsedSec >= def.nightStartsAt - EVENING_SEC) return 'evening';
  return 'day';
}

/**
 * 경과 초 → 스카이라이트 배율 0.22~1. 낮 1, 저녁 동안 0.6 까지, 밤 시작 뒤 NIGHT_FADE_SEC 동안 0.22 까지.
 * 항상 어두운 원정지(nightStartsAt 0)는 0.22 고정. 셰이더 uSkyLight 와 안개에 그대로 곱한다.
 */
export function skyLightAt(def: Pick<ExpeditionDef, 'nightStartsAt'>, elapsedSec: number): number {
  const n = def.nightStartsAt;
  if (n <= 0) return NIGHT_SKY;
  if (elapsedSec <= n - EVENING_SEC) return 1;
  if (elapsedSec < n) {
    const t = (elapsedSec - (n - EVENING_SEC)) / EVENING_SEC;
    return 1 - 0.4 * t;
  }
  const t = Math.min(1, (elapsedSec - n) / NIGHT_FADE_SEC);
  return 0.6 - (0.6 - NIGHT_SKY) * t;
}

/** 남은 초 (0 아래로 안 내려감) */
export function remainingSec(def: Pick<ExpeditionDef, 'durationSec'>, elapsedSec: number): number {
  return Math.max(0, def.durationSec - elapsedSec);
}

function describePath(path: PropertyKey[], raw: unknown): string {
  if (path[0] === 'expeditions' && typeof path[1] === 'number') {
    const idx = path[1];
    const list = (raw as { expeditions?: unknown[] } | null)?.expeditions;
    const entry = Array.isArray(list) ? (list[idx] as { id?: unknown } | undefined) : undefined;
    const id = entry && typeof entry.id === 'string' ? entry.id : '?';
    const field = path[2];
    const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
    return `${idx + 1}번째 원정지(id: ${id})${fieldKo ? `의 ${fieldKo}` : ''}`;
  }
  return path.map(String).join('.');
}

export function parseExpeditions(raw: unknown, fileName = 'data/expeditions.json'): ExpeditionRegistry {
  const result = ExpeditionsFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${describePath(issue.path, raw)}: ${koreanizeMessage(issue.message)}`,
    );
    throw new DataError(fileName, problems);
  }
  const problems: string[] = [];
  const seen = new Set<string>();
  const defs: ExpeditionDef[] = result.data.expeditions.map((e, i) => {
    const where = `${i + 1}번째 원정지(id: ${e.id})`;
    if (seen.has(e.id)) problems.push(`${where}: id 가 두 번 나와요. 하나는 이름을 바꿔 주세요`);
    seen.add(e.id);
    if (e.nightStartsAt > e.durationSec) problems.push(`${where}: 밤 시작(${e.nightStartsAt}초)이 원정 시간(${e.durationSec}초)보다 늦어요`);
    if (e.nightStartsAt > 0 && e.nightStartsAt < EVENING_SEC) problems.push(`${where}: 밤 시작은 0(항상 어두움) 또는 ${EVENING_SEC}초 이상이어야 해요 (저녁 시간이 필요해요)`);
    return {
      id: e.id,
      name: e.name,
      generator: e.generator,
      durationSec: e.durationSec,
      nightStartsAt: e.nightStartsAt,
      treasures: e.treasures,
      unlockedBy: e.unlockedBy,
      danger: e.danger,
      materials: e.materials,
      release: e.release ?? 'v1',
    };
  });
  if (problems.length) throw new DataError(fileName, problems);
  const { returnGraceSec, failedReturnKeepRatio, minStartMarginMin } = result.data;
  return new ExpeditionRegistry(defs, { returnGraceSec, failedReturnKeepRatio, minStartMarginMin });
}
