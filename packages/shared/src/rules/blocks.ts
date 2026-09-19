/**
 * data/blocks.json 검증·로드.
 * 아들이 편집하는 파일이므로 실패 메시지는 짧고 쉬운 한국어로 낸다.
 */
import { z } from 'zod';

export const AIR_ID = 0;

const NAME_RE = /^[a-z0-9_]+$/;
const TextureName = z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요');

const RawBlock = z.object({
  id: z.string().regex(NAME_RE, '영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: iron_ore)'),
  name: z.string().min(1, '한국어 이름이 비어 있어요'),
  solid: z.boolean().optional(),
  transparent: z.boolean().optional(),
  hardness: z.number().min(0, '0 이상이어야 해요').optional(),
  tool: z.string().nullable().optional(),
  toolTier: z.number().int().min(0).max(4, '0~4 사이여야 해요').optional(),
  drops: z.string().nullable().optional(),
  dropCount: z
    .tuple([z.number().int().min(0, '0 이상이어야 해요'), z.number().int().min(0, '0 이상이어야 해요')])
    .optional(),
  bonusDrops: z.string().nullable().optional(),
  bonusCount: z
    .tuple([z.number().int().min(0, '0 이상이어야 해요'), z.number().int().min(0, '0 이상이어야 해요')])
    .optional(),
  lightEmit: z.number().int().min(0, '0~15 사이여야 해요').max(15, '0~15 사이여야 해요').optional(),
  lightFilter: z.number().int().min(0, '0~15 사이여야 해요').max(15, '0~15 사이여야 해요').optional(),
  damage: z.number().min(0, '0 이상이어야 해요').optional(),
  texture: TextureName.optional(),
  textureTop: TextureName.optional(),
  textureSide: TextureName.optional(),
  textureBottom: TextureName.optional(),
  shape: z.string().optional(),
  release: z.string().optional(),
  dyeable: z.boolean().optional(),
  variants: z.array(z.string()).optional(),
  fluid: z.enum(['water', 'lava']).optional(),
});

export type FluidKind = 'water' | 'lava';
/** 흐르는 액체 단계 수 (원천 0 + 1..7) */
export const MAX_FLUID_LEVEL = 7;
/**
 * 플레이어가 놓은 액체(고인 물·고인 용암)의 양 단위. 양동이 하나 = 8 (한 칸 가득).
 * 고인 액체는 양이 보존된다 — 사방으로 퍼지되 퍼질수록 낮아지고, 양만큼만 퍼진다 (아빠 결정 #65).
 * 자연 액체(강·연못, 양 0)는 마인크래프트 규칙(원천 무한 + 흐름 1..7, 결정 #47).
 */
export const FLUID_FULL = 8;

const BlocksFile = z.object({
  _comment: z.string().optional(),
  blocks: z.array(RawBlock).min(1, '블록이 하나도 없어요'),
});

type RawBlock = z.infer<typeof RawBlock>;

const FIELD_KO: Record<string, string> = {
  id: 'id(영문 이름)',
  name: 'name(한국어 이름)',
  solid: 'solid(밟을 수 있는지)',
  transparent: 'transparent(투명한지)',
  hardness: 'hardness(부수는 데 걸리는 초)',
  tool: 'tool(필요한 도구)',
  toolTier: 'toolTier(도구 등급)',
  drops: 'drops(떨어지는 아이템)',
  dropCount: 'dropCount(떨어지는 개수 [최소, 최대])',
  bonusDrops: 'bonusDrops(덤으로 떨어지는 아이템)',
  bonusCount: 'bonusCount(덤 개수 [최소, 최대])',
  lightEmit: 'lightEmit(빛 세기)',
  lightFilter: 'lightFilter(빛을 얼마나 막는지)',
  damage: 'damage(닿으면 받는 피해)',
  texture: 'texture(그림 파일 이름)',
  textureTop: 'textureTop(윗면 그림)',
  textureSide: 'textureSide(옆면 그림)',
  textureBottom: 'textureBottom(아랫면 그림)',
  shape: 'shape(특수 모양)',
  release: 'release(버전)',
  variants: 'variants(종류 목록)',
  fluid: 'fluid(액체 종류)',
};

/** 데이터 파일 문제. message 전체가 아들이 읽을 수 있는 한국어다. */
export class DataError extends Error {
  constructor(
    readonly file: string,
    readonly problems: string[],
  ) {
    super(`${file} 파일에 고칠 곳이 ${problems.length}개 있어요:\n` + problems.map((p) => `  - ${p}`).join('\n'));
    this.name = 'DataError';
  }
}

export interface BlockDef {
  /** 숫자 번호. 청크 데이터에 들어가는 값. air = 0 */
  readonly num: number;
  readonly id: string;
  readonly name: string;
  readonly solid: boolean;
  readonly transparent: boolean;
  /** 맨손으로 부수는 데 걸리는 초. null = 부술 수 없음 */
  readonly hardness: number | null;
  readonly tool: string | null;
  readonly toolTier: number;
  /** 부수면 나오는 아이템 id. null = 아무것도 안 나옴 */
  readonly drops: string | null;
  /** 떨어지는 개수 [최소, 최대]. 기본 [1, 1]. 범위면 서버가 시드 PRNG 로 뽑는다 */
  readonly dropCount: readonly [number, number];
  /** 덤으로 같이 떨어지는 아이템 (발광석 → 가루). null = 없음 */
  readonly bonusDrops: string | null;
  /** 덤 개수 [최소, 최대]. 0 이 뽑히면 덤 없음 (발광석 가루 0~3) */
  readonly bonusCount: readonly [number, number];
  readonly lightEmit: number;
  /**
   * 빛을 얼마나 막는지 0~15. 0 = 공기처럼 그대로 통과, 15 = 완전히 막음(불투명 블록).
   * 물·나뭇잎·얼음은 1(한 칸마다 조금씩 어두워짐). JSON 에 없으면 자동으로 정한다.
   */
  readonly lightFilter: number;
  readonly damage: number;
  /** [윗면, 옆면, 아랫면] 텍스처 이름. air 는 null */
  readonly textures: readonly [top: string, side: string, bottom: string] | null;
  readonly shape: string | null;
  readonly release: string;
  /** 액체 종류. null = 액체 아님 */
  readonly fluid: FluidKind | null;
  /**
   * 액체 단계 = 얕은 정도. 0 = 한 칸 가득(원천 또는 고인 8/8), 1..7 = 얕아짐 (렌더 높이 = (8 - level)/9).
   * 자연 액체는 원천에서 떨어진 거리, 고인 액체는 8 - 양. 액체 아니면 0
   */
  readonly fluidLevel: number;
  /** 같은 액체 원천의 블록 번호. 액체 아니면 -1 */
  readonly fluidSource: number;
  /** 고인 액체의 양 1..8 (플레이어가 놓은 것, 보존됨). 0 = 자연 액체(무한 원천·흐름). 액체 아니면 0 */
  readonly fluidVolume: number;
  /** 코드가 만든 내부 블록(흐르는·고인 액체 단계). 핫바·도감에 안 보임 */
  readonly internal: boolean;
}

export class BlockRegistry {
  private readonly byId = new Map<string, BlockDef>();
  /** 원천 번호 → [단계] 자연 흐름 블록 번호 */
  private readonly fluidLevels = new Map<number, number[]>();
  /** 원천 번호 → [양] 고인 액체 블록 번호 */
  private readonly fluidVolumes = new Map<number, number[]>();

  constructor(readonly defs: readonly BlockDef[]) {
    for (const d of defs) {
      this.byId.set(d.id, d);
      if (d.fluid) {
        if (d.fluidVolume > 0) {
          let arr = this.fluidVolumes.get(d.fluidSource);
          if (!arr) this.fluidVolumes.set(d.fluidSource, (arr = []));
          arr[d.fluidVolume] = d.num;
        } else {
          let arr = this.fluidLevels.get(d.fluidSource);
          if (!arr) this.fluidLevels.set(d.fluidSource, (arr = []));
          arr[d.fluidLevel] = d.num;
        }
      }
    }
  }

  isFluid(num: number): boolean {
    return this.get(num).fluid !== null;
  }

  /** 자연 액체: 원천 번호 + 단계 → 블록 번호. 단계 0 은 원천 자신 */
  fluidVariant(source: number, level: number): number {
    const arr = this.fluidLevels.get(source);
    if (!arr) throw new Error(`액체가 아닌 블록 번호: ${source}`);
    return arr[Math.max(0, Math.min(MAX_FLUID_LEVEL, level))] ?? source;
  }

  /** 고인 액체(플레이어가 놓은 것): 원천 번호 + 양 1..8 → 블록 번호. 양 0 이하는 air */
  fluidFinite(source: number, volume: number): number {
    if (volume <= 0) return AIR_ID;
    const arr = this.fluidVolumes.get(source);
    if (!arr) throw new Error(`액체가 아닌 블록 번호: ${source}`);
    return arr[Math.min(FLUID_FULL, volume)] ?? source;
  }

  get count(): number {
    return this.defs.length;
  }

  /** 숫자 번호로 찾기. 모르는 번호는 air 취급 */
  get(num: number): BlockDef {
    return this.defs[num] ?? this.defs[AIR_ID];
  }

  find(id: string): BlockDef | undefined {
    return this.byId.get(id);
  }

  require(id: string): BlockDef {
    const d = this.byId.get(id);
    if (!d) throw new Error(`블록 '${id}' 을(를) data/blocks.json 에서 찾을 수 없어요`);
    return d;
  }

  numOf(id: string): number {
    return this.require(id).num;
  }

  isSolid(num: number): boolean {
    return this.get(num).solid;
  }

  /** 불투명 = 뒤에 있는 면을 가린다 */
  isOpaque(num: number): boolean {
    const d = this.get(num);
    return d.solid && !d.transparent;
  }

  /** v1 에 들어가는 블록만 (release 없음 또는 'v1'), 내부 블록 제외 */
  v1(): BlockDef[] {
    return this.defs.filter((d) => d.release === 'v1' && !d.internal);
  }
}

/** lightFilter 기본값: 불투명 15, 용암 15(빛을 내니 상관없음), 물 1, 그 외(공기·유리·횃불) 0 */
function defaultLightFilter(isAir: boolean, solid: boolean, transparent: boolean, fluid: FluidKind | null): number {
  if (isAir) return 0;
  if (fluid === 'lava') return 15;
  if (fluid === 'water') return 1;
  if (solid && !transparent) return 15;
  return 0;
}

function describePath(path: PropertyKey[], raw: unknown): string {
  // path 예: ['blocks', 3, 'hardness']
  if (path[0] !== 'blocks' || typeof path[1] !== 'number') return path.map(String).join('.');
  const idx = path[1];
  const blocks = (raw as { blocks?: unknown[] } | null)?.blocks;
  const entry = Array.isArray(blocks) ? (blocks[idx] as { id?: unknown } | undefined) : undefined;
  const id = entry && typeof entry.id === 'string' ? entry.id : '?';
  const field = path[2];
  const fieldKo = typeof field === 'string' ? (FIELD_KO[field] ?? field) : '';
  return `${idx + 1}번째 블록(id: ${id})${fieldKo ? `의 ${fieldKo}` : ''}`;
}

export function koreanizeMessage(msg: string): string {
  if (/expected number/i.test(msg)) return '숫자여야 해요';
  if (/expected string/i.test(msg)) return '글자(따옴표 안)여야 해요';
  if (/expected boolean/i.test(msg)) return 'true 또는 false 여야 해요';
  if (/expected array/i.test(msg)) return '목록([ ... ])이어야 해요';
  if (/expected object/i.test(msg)) return '{ ... } 모양이어야 해요';
  if (/expected int|integer/i.test(msg)) return '정수(소수점 없는 수)여야 해요';
  if (/invalid option|invalid enum|expected one of/i.test(msg)) return `쓸 수 있는 값이 아니에요 (${msg.replace(/^Invalid option: /, '')})`;
  if (/invalid input/i.test(msg)) return '값이 이상해요';
  return msg;
}

/**
 * blocks.json 내용(파싱된 객체)을 검증해 레지스트리로 만든다.
 * 실패하면 DataError (한국어) 를 던진다.
 */
export function parseBlocks(raw: unknown, fileName = 'data/blocks.json'): BlockRegistry {
  const result = BlocksFile.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${describePath(issue.path, raw)}: ${koreanizeMessage(issue.message)}`,
    );
    throw new DataError(fileName, problems);
  }

  const problems: string[] = [];
  const list = result.data.blocks;

  const seen = new Set<string>();
  list.forEach((b, i) => {
    if (seen.has(b.id)) problems.push(`${i + 1}번째 블록: id '${b.id}' 가 두 번 나와요. 하나는 이름을 바꿔 주세요`);
    seen.add(b.id);
  });
  if (!seen.has('air')) problems.push(`'air'(공기) 블록이 꼭 있어야 해요`);

  // air 를 0번으로 고정, 나머지는 파일 순서
  const ordered: RawBlock[] = [...list.filter((b) => b.id === 'air'), ...list.filter((b) => b.id !== 'air')];

  const defs: BlockDef[] = ordered.map((b, num) => {
    const isAir = b.id === 'air';
    const solid = b.solid ?? !isAir;
    const transparent = b.transparent ?? isAir;

    let textures: BlockDef['textures'] = null;
    if (!isAir) {
      const top = b.textureTop ?? b.texture;
      const side = b.textureSide ?? b.texture;
      const bottom = b.textureBottom ?? b.textureTop ?? b.texture;
      if (!top || !side || !bottom) {
        problems.push(
          `블록 '${b.id}'(${b.name}): 그림이 없어요. texture 하나를 쓰거나 textureTop·textureSide·textureBottom 을 모두 적어 주세요`,
        );
        textures = ['missing', 'missing', 'missing'];
      } else {
        textures = [top, side, bottom];
      }
    }

    if (b.dropCount && b.dropCount[0] > b.dropCount[1]) problems.push(`블록 '${b.id}'(${b.name}): dropCount 는 [최소, 최대] 순서예요`);
    if (b.bonusCount && b.bonusCount[0] > b.bonusCount[1]) problems.push(`블록 '${b.id}'(${b.name}): bonusCount 는 [최소, 최대] 순서예요`);
    if (b.bonusCount && !b.bonusDrops) problems.push(`블록 '${b.id}'(${b.name}): bonusCount 를 적으면 bonusDrops(덤 아이템)도 적어야 해요`);
    if (b.fluid && solid) problems.push(`블록 '${b.id}'(${b.name}): 액체(fluid)는 solid 가 false 여야 해요`);

    return {
      num,
      id: b.id,
      name: b.name,
      solid,
      transparent,
      hardness: b.hardness ?? null,
      tool: b.tool ?? null,
      toolTier: b.toolTier ?? 0,
      drops: b.drops === undefined ? b.id : b.drops,
      dropCount: b.dropCount ?? [1, 1],
      bonusDrops: b.bonusDrops ?? null,
      bonusCount: b.bonusCount ?? [1, 1],
      lightEmit: b.lightEmit ?? 0,
      lightFilter: b.lightFilter ?? defaultLightFilter(isAir, solid, transparent, b.fluid ?? null),
      damage: b.damage ?? 0,
      textures,
      shape: b.shape ?? null,
      release: b.release ?? 'v1',
      fluid: b.fluid ?? null,
      fluidLevel: 0,
      fluidSource: b.fluid ? num : -1,
      fluidVolume: 0,
      internal: false,
    };
  });

  // 액체마다 내부 블록을 만든다 (아들 JSON 은 원천 하나만 적는다):
  //  - 자연 흐름 1..7 `water~3` (강·연못 원천에서 퍼진 것, 마인크래프트 규칙)
  //  - 고인 액체 양 1..8 `water%5` (플레이어가 놓은 것, 양이 보존되며 사방으로 퍼져 낮아진다)
  for (const src of [...defs]) {
    if (!src.fluid) continue;
    for (let level = 1; level <= MAX_FLUID_LEVEL; level++) {
      defs.push({
        ...src,
        num: defs.length,
        id: `${src.id}~${level}`,
        name: `${src.name}(흐름 ${level})`,
        hardness: null,
        drops: null,
        bonusDrops: null,
        fluidLevel: level,
        fluidSource: src.num,
        fluidVolume: 0,
        internal: true,
      });
    }
    for (let volume = 1; volume <= FLUID_FULL; volume++) {
      defs.push({
        ...src,
        num: defs.length,
        id: `${src.id}%${volume}`,
        name: `${src.name}(고인 ${volume}/${FLUID_FULL})`,
        hardness: null,
        drops: null,
        fluidLevel: FLUID_FULL - volume,
        fluidSource: src.num,
        fluidVolume: volume,
        internal: true,
      });
    }
  }

  if (defs.length > 65535) problems.push(`블록이 너무 많아요 (최대 65535개)`);
  if (problems.length) throw new DataError(fileName, problems);

  return new BlockRegistry(defs);
}
