/** 렌더 레이어 */
export const LAYER_NONE = 0; // air — 면 없음
export const LAYER_OPAQUE = 1; // 불투명
export const LAYER_CUTOUT = 2; // 나뭇잎·유리 — 알파 0.5 컷아웃, 불투명 패스에 같이 그림
export const LAYER_TRANSLUCENT = 3; // 물·얼음 — 반투명 패스

/** 워커가 블록 번호로 바로 찾는 메싱용 정보 (레지스트리 + 텍스처 레이어를 평탄화) */
export interface MeshBlockInfo {
  layer: number;
  /** 이웃 면을 가리는가 */
  opaque: boolean;
  /** AO 그림자를 드리우는가 */
  castAO: boolean;
  /** 같은 블록끼리 붙은 면을 지우는가 (유리·물·나뭇잎) */
  sameCull: boolean;
  /** 면별 텍스처 레이어: +X -X +Y -Y +Z -Z */
  tex: [number, number, number, number, number, number];
  /** 액체 종류: 0 아님, 1 물, 2 용암. 액체는 greedy 대신 높이가 있는 전용 패스로 그린다 */
  fluidKind: number;
  /** 액체 윗면 높이 0..1 (원천 8/9, 흐를수록 낮아짐). 액체 아니면 0 */
  fluidHeight: number;
  /** 얇은 판(문): [얇은 축 0=x 2=z, 어느 쪽 가장자리 0=작은 쪽 1=큰 쪽]. greedy 대신 전용 패스로 3/16 두께 상자를 그린다. 아니면 null */
  panel: readonly [number, number] | null;
}

export interface MeshBuffers {
  positions: Float32Array; // xyz
  uvs: Float32Array; // uv (블록 단위, 반복)
  /** [텍스처 레이어, AO 0..3, 면 0..5, 빛 (스카이 << 4 | 블록)] */
  meta: Uint8Array;
  indices: Uint32Array;
  vertexCount: number;
  indexCount: number;
}

export interface MeshResult {
  opaque: MeshBuffers | null;
  translucent: MeshBuffers | null;
}

/** 워커 메시지 */
export type MesherRequest =
  | { type: 'init'; blockInfo: MeshBlockInfo[] }
  | { type: 'mesh'; jobId: number; cx: number; cy: number; cz: number; padded: Uint16Array; light: Uint8Array };

export type MesherResponse = {
  type: 'mesh';
  jobId: number;
  cx: number;
  cy: number;
  cz: number;
  result: MeshResult;
  ms: number;
};
