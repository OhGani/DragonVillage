/**
 * 청크 직렬화 — 저장(IndexedDB, M1)과 서버 전송(M2)이 같이 쓴다.
 *
 * 팔레트는 **문자열 블록 id**(결정 #39). 아들이 blocks.json 순서를 바꿔도 저장이 깨지지 않는다.
 * 모르는 id(블록이 삭제됨)는 air 로 읽고 이름을 돌려준다.
 *
 * 형식 v1 (리틀 엔디언):
 *   u8  형식 버전 (1)
 *   u16 팔레트 수 P          P × [u8 길이][ASCII id]
 *   u16 런 수 R              R × [u16 길이][u16 팔레트 번호]   (합 = 4096, localIndex 순서)
 */
import { AIR_ID, type BlockRegistry } from '../rules/blocks';
import { CHUNK_VOLUME, type Chunk } from './chunk';

export const CHUNK_FORMAT_VERSION = 1;

export interface DecodeResult {
  /** 레지스트리에 없어서 air 로 바뀐 블록 id 들 */
  unknownIds: string[];
}

export function encodeChunk(chunk: Chunk, registry: BlockRegistry): Uint8Array {
  const ids = chunk.toBlockIds();

  // 팔레트: 등장 순서, air 는 항상 0
  const paletteNums: number[] = [AIR_ID];
  const indexOf = new Map<number, number>([[AIR_ID, 0]]);
  const local = new Uint16Array(CHUNK_VOLUME);
  for (let i = 0; i < CHUNK_VOLUME; i++) {
    const id = ids[i];
    let pi = indexOf.get(id);
    if (pi === undefined) {
      pi = paletteNums.length;
      paletteNums.push(id);
      indexOf.set(id, pi);
    }
    local[i] = pi;
  }
  const names = paletteNums.map((n) => registry.get(n).id);

  // RLE
  const runs: number[] = []; // [len, pi, len, pi, ...]
  let i = 0;
  while (i < CHUNK_VOLUME) {
    const pi = local[i];
    let len = 1;
    while (i + len < CHUNK_VOLUME && local[i + len] === pi && len < 0xffff) len++;
    runs.push(len, pi);
    i += len;
  }

  let size = 1 + 2 + 2 + runs.length * 2;
  for (const n of names) size += 1 + n.length;
  const out = new Uint8Array(size);
  let o = 0;
  out[o++] = CHUNK_FORMAT_VERSION;
  out[o++] = names.length & 0xff;
  out[o++] = names.length >> 8;
  for (const n of names) {
    if (n.length > 255) throw new Error(`블록 id 가 너무 길어요: ${n}`);
    out[o++] = n.length;
    for (let c = 0; c < n.length; c++) {
      const code = n.charCodeAt(c);
      if (code > 127) throw new Error(`블록 id 는 영문·숫자·기호만: ${n}`);
      out[o++] = code;
    }
  }
  const runCount = runs.length / 2;
  out[o++] = runCount & 0xff;
  out[o++] = runCount >> 8;
  for (const v of runs) {
    out[o++] = v & 0xff;
    out[o++] = v >> 8;
  }
  return out;
}

export function decodeChunk(bytes: Uint8Array, registry: BlockRegistry, into: Chunk): DecodeResult {
  let o = 0;
  const version = bytes[o++];
  if (version !== CHUNK_FORMAT_VERSION) throw new Error(`모르는 청크 저장 형식: ${version}`);
  const paletteCount = bytes[o] | (bytes[o + 1] << 8);
  o += 2;
  const nums: number[] = [];
  const unknownIds: string[] = [];
  for (let p = 0; p < paletteCount; p++) {
    const len = bytes[o++];
    let name = '';
    for (let c = 0; c < len; c++) name += String.fromCharCode(bytes[o++]);
    const def = registry.find(name);
    if (def) nums.push(def.num);
    else {
      nums.push(AIR_ID);
      unknownIds.push(name);
    }
  }
  const runCount = bytes[o] | (bytes[o + 1] << 8);
  o += 2;
  const ids = new Uint16Array(CHUNK_VOLUME);
  let i = 0;
  for (let r = 0; r < runCount; r++) {
    const len = bytes[o] | (bytes[o + 1] << 8);
    const pi = bytes[o + 2] | (bytes[o + 3] << 8);
    o += 4;
    if (pi >= nums.length) throw new Error(`팔레트 번호가 범위를 벗어났어요: ${pi}`);
    const num = nums[pi];
    if (i + len > CHUNK_VOLUME) throw new Error('청크 데이터가 4096 을 넘어요');
    ids.fill(num, i, i + len);
    i += len;
  }
  if (i !== CHUNK_VOLUME) throw new Error(`청크 데이터가 ${i}개 — 4096 이어야 해요`);
  into.loadBlockIds(ids);
  return { unknownIds };
}
