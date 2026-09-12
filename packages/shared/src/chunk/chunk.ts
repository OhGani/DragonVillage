import { AIR_ID } from '../rules/blocks';

export const CHUNK_BITS = 4;
export const CHUNK_SIZE = 1 << CHUNK_BITS; // 16
export const CHUNK_AREA = CHUNK_SIZE * CHUNK_SIZE; // 256
export const CHUNK_VOLUME = CHUNK_AREA * CHUNK_SIZE; // 4096

/** 청크 안 좌표(0..15) → 배열 인덱스. y 가 가장 바깥, x 가 가장 안쪽 */
export function localIndex(x: number, y: number, z: number): number {
  return (y << (CHUNK_BITS * 2)) | (z << CHUNK_BITS) | x;
}

function assertLocal(x: number, y: number, z: number): void {
  if ((x | y | z) < 0 || x >= CHUNK_SIZE || y >= CHUNK_SIZE || z >= CHUNK_SIZE) {
    throw new RangeError(`청크 밖 좌표: (${x}, ${y}, ${z})`);
  }
}

/**
 * 16×16×16 청크. 블록 데이터는 팔레트 인덱스(Uint16), 팔레트는 전역 블록 번호.
 * 팔레트 0번은 항상 air.
 */
export class Chunk {
  readonly data = new Uint16Array(CHUNK_VOLUME);
  readonly palette: number[] = [AIR_ID];
  private readonly lookup = new Map<number, number>([[AIR_ID, 0]]);
  /** air 가 아닌 블록 수. 0이면 메싱·렌더 생략 */
  nonAir = 0;
  /** set 이 실제로 값을 바꿀 때마다 +1. 재메싱 판단용 */
  version = 0;

  constructor(
    readonly cx: number,
    readonly cy: number,
    readonly cz: number,
  ) {}

  get(x: number, y: number, z: number): number {
    assertLocal(x, y, z);
    return this.palette[this.data[localIndex(x, y, z)]];
  }

  /** 값이 바뀌었으면 true */
  set(x: number, y: number, z: number, id: number): boolean {
    assertLocal(x, y, z);
    const i = localIndex(x, y, z);
    const prev = this.palette[this.data[i]];
    if (prev === id) return false;
    let pi = this.lookup.get(id);
    if (pi === undefined) {
      pi = this.palette.length;
      this.palette.push(id);
      this.lookup.set(id, pi);
    }
    this.data[i] = pi;
    if (prev === AIR_ID) this.nonAir++;
    else if (id === AIR_ID) this.nonAir--;
    this.version++;
    return true;
  }

  isEmpty(): boolean {
    return this.nonAir === 0;
  }

  fill(id: number): void {
    for (let y = 0; y < CHUNK_SIZE; y++)
      for (let z = 0; z < CHUNK_SIZE; z++) for (let x = 0; x < CHUNK_SIZE; x++) this.set(x, y, z, id);
  }

  /** 쓰이지 않는 팔레트 항목 제거 (직렬화 전에 호출). air 는 항상 0번 유지 */
  compactPalette(): void {
    const used = new Uint8Array(this.palette.length);
    for (let i = 0; i < CHUNK_VOLUME; i++) used[this.data[i]] = 1;
    used[0] = 1;
    const remap = new Uint16Array(this.palette.length);
    const next: number[] = [];
    for (let pi = 0; pi < this.palette.length; pi++) {
      if (!used[pi]) continue;
      remap[pi] = next.length;
      next.push(this.palette[pi]);
    }
    for (let i = 0; i < CHUNK_VOLUME; i++) this.data[i] = remap[this.data[i]];
    this.palette.length = 0;
    this.palette.push(...next);
    this.lookup.clear();
    next.forEach((id, pi) => this.lookup.set(id, pi));
  }
}
