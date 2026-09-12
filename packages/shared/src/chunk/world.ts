import { AIR_ID } from '../rules/blocks';
import { CHUNK_BITS, CHUNK_SIZE, Chunk } from './chunk';

export interface ChunkCoord {
  cx: number;
  cy: number;
  cz: number;
}

/** 청크 단위 월드 크기. 마을 8×8×8, 원정지 16×16×8, M0 테스트 8×8×4 */
export interface WorldBounds {
  sizeCX: number;
  sizeCY: number;
  sizeCZ: number;
}

const KEY_OFFSET = 512;
/** 청크 좌표 → Map 키 (-512..511 범위) */
export function chunkKey(cx: number, cy: number, cz: number): number {
  return (cx + KEY_OFFSET) | ((cy + KEY_OFFSET) << 10) | ((cz + KEY_OFFSET) << 20);
}

/** 메싱 입력: 청크 + 사방 1칸 여백 = 18×18×18 */
export const PADDED = CHUNK_SIZE + 2;
export const PADDED_VOLUME = PADDED * PADDED * PADDED;
/** 로컬 좌표 -1..16 → 패딩 배열 인덱스 */
export function paddedIndex(x: number, y: number, z: number): number {
  return ((y + 1) * PADDED + (z + 1)) * PADDED + (x + 1);
}

export interface SetBlockResult {
  changed: boolean;
  /** 다시 메싱해야 하는 청크들 (자기 자신 + 경계면이면 이웃) */
  dirty: ChunkCoord[];
}

/**
 * 청크 모음. 서버(진실)와 클라(복제)가 같은 클래스를 쓴다.
 * 범위 밖은 air 로 읽히고, 쓰기는 무시된다.
 */
export class VoxelWorld {
  private readonly chunks = new Map<number, Chunk>();

  constructor(readonly bounds: WorldBounds) {}

  get sizeX(): number {
    return this.bounds.sizeCX * CHUNK_SIZE;
  }
  get sizeY(): number {
    return this.bounds.sizeCY * CHUNK_SIZE;
  }
  get sizeZ(): number {
    return this.bounds.sizeCZ * CHUNK_SIZE;
  }

  inBounds(x: number, y: number, z: number): boolean {
    return x >= 0 && y >= 0 && z >= 0 && x < this.sizeX && y < this.sizeY && z < this.sizeZ;
  }

  chunkInBounds(cx: number, cy: number, cz: number): boolean {
    return cx >= 0 && cy >= 0 && cz >= 0 && cx < this.bounds.sizeCX && cy < this.bounds.sizeCY && cz < this.bounds.sizeCZ;
  }

  getChunk(cx: number, cy: number, cz: number): Chunk | undefined {
    return this.chunks.get(chunkKey(cx, cy, cz));
  }

  getOrCreateChunk(cx: number, cy: number, cz: number): Chunk {
    if (!this.chunkInBounds(cx, cy, cz)) throw new RangeError(`월드 밖 청크: (${cx}, ${cy}, ${cz})`);
    const key = chunkKey(cx, cy, cz);
    let c = this.chunks.get(key);
    if (!c) {
      c = new Chunk(cx, cy, cz);
      this.chunks.set(key, c);
    }
    return c;
  }

  forEachChunk(cb: (c: Chunk) => void): void {
    for (const c of this.chunks.values()) cb(c);
  }

  get chunkCount(): number {
    return this.chunks.size;
  }

  getBlock(x: number, y: number, z: number): number {
    if (!this.inBounds(x, y, z)) return AIR_ID;
    const c = this.chunks.get(chunkKey(x >> CHUNK_BITS, y >> CHUNK_BITS, z >> CHUNK_BITS));
    if (!c) return AIR_ID;
    return c.get(x & 15, y & 15, z & 15);
  }

  setBlock(x: number, y: number, z: number, id: number): SetBlockResult {
    if (!this.inBounds(x, y, z)) return { changed: false, dirty: [] };
    const cx = x >> CHUNK_BITS,
      cy = y >> CHUNK_BITS,
      cz = z >> CHUNK_BITS;
    const lx = x & 15,
      ly = y & 15,
      lz = z & 15;
    const existing = this.getChunk(cx, cy, cz);
    if (!existing && id === AIR_ID) return { changed: false, dirty: [] };
    const chunk = existing ?? this.getOrCreateChunk(cx, cy, cz);
    const changed = chunk.set(lx, ly, lz, id);
    if (!changed) return { changed: false, dirty: [] };

    // 경계 블록이면 이웃도 다시 메싱 (면 가림 + AO 는 대각선 이웃까지 영향)
    const dx = lx === 0 ? [0, -1] : lx === 15 ? [0, 1] : [0];
    const dy = ly === 0 ? [0, -1] : ly === 15 ? [0, 1] : [0];
    const dz = lz === 0 ? [0, -1] : lz === 15 ? [0, 1] : [0];
    const dirty: ChunkCoord[] = [];
    for (const ox of dx)
      for (const oy of dy)
        for (const oz of dz) {
          const ncx = cx + ox,
            ncy = cy + oy,
            ncz = cz + oz;
          if (this.chunkInBounds(ncx, ncy, ncz)) dirty.push({ cx: ncx, cy: ncy, cz: ncz });
        }
    return { changed: true, dirty };
  }

  /**
   * 청크와 이웃 1칸을 포함한 18³ 블록 번호 배열을 만든다 (메싱 워커 입력).
   * out 을 주면 재사용.
   */
  buildPadded(cx: number, cy: number, cz: number, out?: Uint16Array): Uint16Array {
    const arr = out ?? new Uint16Array(PADDED_VOLUME);
    const bx = cx << CHUNK_BITS,
      by = cy << CHUNK_BITS,
      bz = cz << CHUNK_BITS;
    const center = this.getChunk(cx, cy, cz);
    let i = 0;
    for (let y = -1; y <= CHUNK_SIZE; y++) {
      for (let z = -1; z <= CHUNK_SIZE; z++) {
        for (let x = -1; x <= CHUNK_SIZE; x++) {
          const inside = (x | y | z) >= 0 && x < CHUNK_SIZE && y < CHUNK_SIZE && z < CHUNK_SIZE;
          arr[i++] = inside
            ? center
              ? center.palette[center.data[(y << 8) | (z << 4) | x]]
              : AIR_ID
            : this.getBlock(bx + x, by + y, bz + z);
        }
      }
    }
    return arr;
  }
}
