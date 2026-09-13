/**
 * 조명 — 마인크래프트식 스카이라이트·블록라이트 0~15 flood fill.
 *
 * - 스카이라이트: 세계 맨 위에서 15 로 시작. 공기(lightFilter 0)를 **아래로** 지날 때는 15 그대로,
 *   옆·위로 퍼질 때와 물·나뭇잎(lightFilter 1)을 지날 때는 한 칸마다 max(1, lightFilter) 씩 줄어든다.
 *   불투명 블록(lightFilter 15)은 막는다. 그래서 동굴 안은 0, 나무 그늘은 13~14, 물속은 한 칸마다 1씩 어두워진다.
 * - 블록라이트: lightEmit 이 있는 블록(횃불 14, 발광석·용암 15)에서 시작해 한 칸마다 max(1, lightFilter) 씩 줄어든다.
 * - 두 채널을 한 바이트에 담는다: 위 4비트 스카이, 아래 4비트 블록. 세계 전체를 평면 배열 하나로(블록당 1바이트,
 *   테스트 월드 128×64×128 = 1MB). 청크마다 따로 두는 것보다 flood fill 이 단순하고 빠르다.
 * - 블록이 바뀌면 markChanged → flush: 빛을 걷어내는 BFS(removal) 뒤 가장자리에서 다시 채운다(propagation).
 *   결과는 처음부터 다시 계산한 것과 항상 같다(테스트로 강제). 난수 없음 → 결정론.
 *
 * 순수 TS. 메싱 워커는 buildPaddedLight 로 받은 18³ 조각에서 꼭짓점 빛을 뽑는다.
 */
import { CHUNK_SIZE } from '../chunk/chunk';
import { type ChunkCoord, PADDED_VOLUME, type VoxelWorld, chunkKey } from '../chunk/world';
import type { BlockRegistry } from '../rules/blocks';

export const MAX_LIGHT = 15;
/** 세계 밖(또는 빛 정보가 없을 때)의 값: 하늘 15, 블록 0 */
export const OUTSIDE_LIGHT = 0xf0;

export function packLight(sky: number, block: number): number {
  return (sky << 4) | block;
}
export function skyOf(packed: number): number {
  return packed >> 4;
}
export function blockOf(packed: number): number {
  return packed & 15;
}

const SKY = 0;
const BLOCK = 1;
type Channel = typeof SKY | typeof BLOCK;

/** 이웃 방향 번호. 아래(3)만 특별 취급(스카이라이트 15 유지) */
const DIR_DOWN = 3;

export interface LightStats {
  /** 마지막 computeAll 에 걸린 ms */
  initialMs: number;
  /** 마지막 flush 에 걸린 ms */
  lastFlushMs: number;
  /** 마지막 flush 에서 값이 바뀐 칸 수 */
  lastFlushCells: number;
}

/** 메싱용 빛 조각 공급자 (ChunkRenderer 가 이 인터페이스만 본다) */
export interface PaddedLightSource {
  buildPaddedLight(cx: number, cy: number, cz: number, out?: Uint8Array): Uint8Array;
}

const now = (): number => performance.now();

export class LightEngine implements PaddedLightSource {
  /** 칸마다 (스카이 << 4) | 블록 */
  readonly light: Uint8Array;
  /** 칸마다 (lightEmit << 4) | lightFilter — 블록 표에서 옮겨 둔 것. flush 때 세계와 비교해 바뀐 칸을 찾는다 */
  private readonly cells: Uint8Array;
  /** 블록 번호 → (lightEmit << 4) | lightFilter */
  private readonly table: Uint8Array;
  private readonly sx: number;
  private readonly sy: number;
  private readonly sz: number;
  private readonly strideY: number;

  private readonly pending = new Set<number>();
  private readonly changedChunks = new Map<number, ChunkCoord>();
  private tracking = false;
  private changedCells = 0;
  /** 레벨별 대기열(15..1). propagate 가 높은 레벨부터 비운다. 한 채널씩만 쓴다 */
  private readonly buckets: number[][] = Array.from({ length: MAX_LIGHT + 1 }, () => []);

  readonly stats: LightStats = { initialMs: 0, lastFlushMs: 0, lastFlushCells: 0 };

  constructor(
    private readonly world: VoxelWorld,
    registry: BlockRegistry,
  ) {
    this.sx = world.sizeX;
    this.sy = world.sizeY;
    this.sz = world.sizeZ;
    this.strideY = this.sx * this.sz;
    const n = this.sx * this.sy * this.sz;
    this.light = new Uint8Array(n);
    this.cells = new Uint8Array(n);
    this.table = new Uint8Array(registry.count);
    for (const d of registry.defs) this.table[d.num] = (Math.min(MAX_LIGHT, d.lightEmit) << 4) | Math.min(MAX_LIGHT, d.lightFilter);
  }

  index(x: number, y: number, z: number): number {
    return y * this.strideY + z * this.sx + x;
  }

  /** (스카이 << 4) | 블록. 세계 밖은 OUTSIDE_LIGHT */
  get(x: number, y: number, z: number): number {
    if (!this.world.inBounds(x, y, z)) return OUTSIDE_LIGHT;
    return this.light[this.index(x, y, z)];
  }
  skyAt(x: number, y: number, z: number): number {
    return skyOf(this.get(x, y, z));
  }
  blockAt(x: number, y: number, z: number): number {
    return blockOf(this.get(x, y, z));
  }

  // ---------------------------------------------------------------- 처음부터 계산

  /** 세계 전체를 처음부터 계산한다. 접속·지형 생성 뒤 한 번 */
  computeAll(): void {
    const t0 = now();
    this.light.fill(0);
    this.fillCells();
    this.tracking = false;
    this.pending.clear();

    const { sx, sy, sz, cells, light, buckets } = this;
    // 스카이: 맨 윗줄 위에 가상의 15 하늘이 있다고 보고 내려보낸다
    const top = (sy - 1) * this.strideY;
    for (let z = 0; z < sz; z++)
      for (let x = 0; x < sx; x++) {
        const i = top + z * sx + x;
        const v = this.fromSkyAbove(cells[i] & 15);
        if (v > 0) {
          light[i] = v << 4;
          buckets[v].push(i);
        }
      }
    this.propagate(SKY);

    // 블록: 빛을 내는 블록 전부
    for (let i = 0; i < cells.length; i++) {
      const e = cells[i] >> 4;
      if (e === 0) continue;
      light[i] = (light[i] & 0xf0) | e;
      buckets[e].push(i);
    }
    this.propagate(BLOCK);
    this.stats.initialMs = now() - t0;
  }

  /** 세계 맨 윗줄 칸이 가상의 하늘(15)에서 받는 값 */
  private fromSkyAbove(filter: number): number {
    return filter === 0 ? MAX_LIGHT : MAX_LIGHT - Math.max(1, filter);
  }

  /** 세계의 블록 표를 cells 로 옮긴다 (청크 단위로 빠르게) */
  private fillCells(): void {
    const { cells, table } = this;
    cells.fill(0);
    this.world.forEachChunk((c) => {
      const bx = c.cx << 4,
        by = c.cy << 4,
        bz = c.cz << 4;
      const { data, palette } = c;
      let di = 0;
      for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          let i = this.index(bx, by + y, bz + z);
          for (let x = 0; x < CHUNK_SIZE; x++, i++, di++) cells[i] = table[palette[data[di]]];
        }
      }
    });
  }

  // ---------------------------------------------------------------- 블록 변경

  /** 이 칸의 블록이 바뀌었다. 실제 계산은 flush 에서 (한 프레임에 여러 칸을 묶어서) */
  markChanged(x: number, y: number, z: number): void {
    if (!this.world.inBounds(x, y, z)) return;
    this.pending.add(this.index(x, y, z));
  }

  get pendingCount(): number {
    return this.pending.size;
  }

  /**
   * 쌓인 변경을 반영하고, 빛이 바뀐 청크(이웃 포함) 좌표를 돌려준다 → 재메싱.
   * 빛을 내거나 막는 정도가 그대로인 변경(잔디→흙)은 계산하지 않는다.
   */
  flush(): ChunkCoord[] {
    if (this.pending.size === 0) return [];
    const t0 = now();
    const { cells, table, light, buckets } = this;

    const changed: number[] = [];
    const next: number[] = [];
    for (const i of this.pending) {
      const x = i % this.sx;
      const t = (i - x) / this.sx;
      const z = t % this.sz;
      const y = (t - z) / this.sz;
      const np = table[this.world.getBlock(x, y, z)] ?? 0;
      if (np === cells[i]) continue;
      changed.push(i);
      next.push(np);
    }
    this.pending.clear();
    if (changed.length === 0) {
      this.stats.lastFlushMs = now() - t0;
      this.stats.lastFlushCells = 0;
      return [];
    }

    this.tracking = true;
    this.changedChunks.clear();
    this.changedCells = 0;

    // 1) 더 막게 됐거나 빛이 줄었으면 먼저 걷어낸다 (아직 옛 블록 정보 기준)
    const skyRemove: number[] = [];
    const blockRemove: number[] = [];
    for (let k = 0; k < changed.length; k++) {
      const i = changed[k];
      const old = cells[i],
        np = next[k];
      const filterUp = (np & 15) > (old & 15);
      if (filterUp) skyRemove.push(i);
      if (filterUp || np >> 4 < old >> 4) blockRemove.push(i);
    }
    const skySeeds = this.remove(SKY, skyRemove);
    const blockSeeds = this.remove(BLOCK, blockRemove);

    // 2) 새 블록 정보 반영
    for (let k = 0; k < changed.length; k++) cells[changed[k]] = next[k];

    // 3) 다시 채우기. 씨앗 = 걷어낸 가장자리 + 바뀐 칸과 그 이웃(지금 값으로) + 새 발광 + 맨 윗줄 하늘
    const seed = (ch: Channel, i: number) => {
      const v = ch === SKY ? light[i] >> 4 : light[i] & 15;
      if (v > 0) buckets[v].push(i);
    };
    const seedAround = (ch: Channel, i: number, x: number, y: number, z: number) => {
      seed(ch, i);
      if (x > 0) seed(ch, i - 1);
      if (x < this.sx - 1) seed(ch, i + 1);
      if (z > 0) seed(ch, i - this.sx);
      if (z < this.sz - 1) seed(ch, i + this.sx);
      if (y > 0) seed(ch, i - this.strideY);
      if (y < this.sy - 1) seed(ch, i + this.strideY);
    };

    for (const i of skySeeds) seed(SKY, i);
    for (let k = 0; k < changed.length; k++) {
      const i = changed[k];
      const x = i % this.sx;
      const t = (i - x) / this.sx;
      const z = t % this.sz;
      const y = (t - z) / this.sz;
      if (y === this.sy - 1) {
        const v = this.fromSkyAbove(next[k] & 15);
        if (v > light[i] >> 4) {
          light[i] = (light[i] & 0x0f) | (v << 4);
          this.mark(x, y, z);
        }
      }
      seedAround(SKY, i, x, y, z);
    }
    this.propagate(SKY);

    for (const i of blockSeeds) seed(BLOCK, i);
    for (let k = 0; k < changed.length; k++) {
      const i = changed[k];
      const x = i % this.sx;
      const t = (i - x) / this.sx;
      const z = t % this.sz;
      const y = (t - z) / this.sz;
      const e = next[k] >> 4;
      if (e > (light[i] & 15)) {
        light[i] = (light[i] & 0xf0) | e;
        this.mark(x, y, z);
      }
      seedAround(BLOCK, i, x, y, z);
    }
    this.propagate(BLOCK);

    this.tracking = false;
    this.stats.lastFlushMs = now() - t0;
    this.stats.lastFlushCells = this.changedCells;
    return [...this.changedChunks.values()];
  }

  // ---------------------------------------------------------------- BFS

  /**
   * 걷어내기: 씨앗 칸의 빛을 0 으로 하고, 그 빛에 의지하던(더 어두운) 이웃을 따라가며 지운다.
   * 지운 영역의 가장자리(같거나 더 밝은 칸)와, 지운 칸 중 스스로 빛을 내는 칸을 다시 채울 씨앗으로 돌려준다.
   */
  private remove(ch: Channel, seeds: readonly number[]): number[] {
    const reseed: number[] = [];
    if (seeds.length === 0) return reseed;
    const { light, cells, sx, sy, sz, strideY } = this;
    const queue: number[] = []; // [i, L, i, L, ...]
    const get = (i: number) => (ch === SKY ? light[i] >> 4 : light[i] & 15);
    const zero = (i: number) => {
      light[i] = ch === SKY ? light[i] & 0x0f : light[i] & 0xf0;
    };
    const emitters: number[] = [];

    for (const i of seeds) {
      const L = get(i);
      if (L === 0) continue; // 지울 게 없다 (이웃은 flush 가 따로 씨앗으로 넣는다)
      zero(i);
      queue.push(i, L);
      const x = i % sx;
      const t = (i - x) / sx;
      const z = t % sz;
      this.mark(x, (t - z) / sz, z);
    }

    const visit = (n: number, L: number, dir: number, x: number, y: number, z: number) => {
      const nl = get(n);
      if (nl === 0) return;
      if (nl < L || (ch === SKY && dir === DIR_DOWN && L === MAX_LIGHT && nl === MAX_LIGHT)) {
        zero(n);
        this.mark(x, y, z);
        queue.push(n, nl);
        if (ch === BLOCK && cells[n] >> 4 > 0) emitters.push(n);
      } else reseed.push(n);
    };

    while (queue.length) {
      const L = queue.pop() as number;
      const i = queue.pop() as number;
      const x = i % sx;
      const t = (i - x) / sx;
      const z = t % sz;
      const y = (t - z) / sz;
      if (x > 0) visit(i - 1, L, 0, x - 1, y, z);
      if (x < sx - 1) visit(i + 1, L, 1, x + 1, y, z);
      if (y < sy - 1) visit(i + strideY, L, 2, x, y + 1, z);
      if (y > 0) visit(i - strideY, L, DIR_DOWN, x, y - 1, z);
      if (z > 0) visit(i - sx, L, 4, x, y, z - 1);
      if (z < sz - 1) visit(i + sx, L, 5, x, y, z + 1);
    }

    // 지워진 발광 블록은 자기 빛으로 되살린다 (걷어내기가 끝난 뒤에 — 도중에 하면 다시 지워질 수 있다)
    for (const n of emitters) {
      const e = cells[n] >> 4;
      if (e > (light[n] & 15)) light[n] = (light[n] & 0xf0) | e;
      reseed.push(n);
    }
    return reseed;
  }

  /** 채우기: 대기열의 칸에서 이웃으로 퍼진다. 높은 레벨부터 처리하므로 칸마다 한 번만 값이 정해진다 */
  private propagate(ch: Channel): void {
    const { light, cells, sx, sy, sz, strideY, buckets } = this;
    const get = (i: number) => (ch === SKY ? light[i] >> 4 : light[i] & 15);

    for (let lvl = MAX_LIGHT; lvl >= 1; lvl--) {
      const bucket = buckets[lvl];
      while (bucket.length) {
        const i = bucket.pop() as number;
        if (get(i) !== lvl) continue; // 이미 더 밝아졌거나 지워졌다
        const x = i % sx;
        const t = (i - x) / sx;
        const z = t % sz;
        const y = (t - z) / sz;

        // 이웃 하나에 빛을 넘긴다. 아래로 가는 스카이라이트 15 는 공기에서 15 그대로
        const spread = (n: number, dir: number, nx: number, ny: number, nz: number) => {
          const f = cells[n] & 15;
          let nl: number;
          if (ch === SKY && dir === DIR_DOWN && lvl === MAX_LIGHT && f === 0) nl = MAX_LIGHT;
          else nl = lvl - (f > 1 ? f : 1);
          if (nl <= 0 || nl <= get(n)) return;
          light[n] = ch === SKY ? (light[n] & 0x0f) | (nl << 4) : (light[n] & 0xf0) | nl;
          if (this.tracking) this.mark(nx, ny, nz);
          buckets[nl].push(n);
        };
        if (x > 0) spread(i - 1, 0, x - 1, y, z);
        if (x < sx - 1) spread(i + 1, 1, x + 1, y, z);
        if (y < sy - 1) spread(i + strideY, 2, x, y + 1, z);
        if (y > 0) spread(i - strideY, DIR_DOWN, x, y - 1, z);
        if (z > 0) spread(i - sx, 4, x, y, z - 1);
        if (z < sz - 1) spread(i + sx, 5, x, y, z + 1);
      }
    }
  }

  /** 값이 바뀐 칸의 청크(경계면이면 이웃 청크까지)를 기록한다 */
  private mark(x: number, y: number, z: number): void {
    if (!this.tracking) return;
    this.changedCells++;
    const cx = x >> 4,
      cy = y >> 4,
      cz = z >> 4;
    const lx = x & 15,
      ly = y & 15,
      lz = z & 15;
    const x0 = lx === 0 ? -1 : 0,
      x1 = lx === 15 ? 1 : 0;
    const y0 = ly === 0 ? -1 : 0,
      y1 = ly === 15 ? 1 : 0;
    const z0 = lz === 0 ? -1 : 0,
      z1 = lz === 15 ? 1 : 0;
    for (let ox = x0; ox <= x1; ox++)
      for (let oy = y0; oy <= y1; oy++)
        for (let oz = z0; oz <= z1; oz++) {
          const ncx = cx + ox,
            ncy = cy + oy,
            ncz = cz + oz;
          if (!this.world.chunkInBounds(ncx, ncy, ncz)) continue;
          const key = chunkKey(ncx, ncy, ncz);
          if (!this.changedChunks.has(key)) this.changedChunks.set(key, { cx: ncx, cy: ncy, cz: ncz });
        }
  }

  // ---------------------------------------------------------------- 메싱 입력

  /** 청크 + 이웃 1칸 = 18³ 빛 조각 (paddedIndex 순서). 세계 밖은 하늘 15 */
  buildPaddedLight(cx: number, cy: number, cz: number, out?: Uint8Array): Uint8Array {
    const arr = out ?? new Uint8Array(PADDED_VOLUME);
    const { sx, sy, sz, light } = this;
    const bx = cx << 4,
      by = cy << 4,
      bz = cz << 4;
    let i = 0;
    for (let y = -1; y <= CHUNK_SIZE; y++) {
      const wy = by + y;
      const yIn = wy >= 0 && wy < sy;
      for (let z = -1; z <= CHUNK_SIZE; z++) {
        const wz = bz + z;
        const zIn = yIn && wz >= 0 && wz < sz;
        const row = wy * this.strideY + wz * sx;
        for (let x = -1; x <= CHUNK_SIZE; x++, i++) {
          const wx = bx + x;
          arr[i] = zIn && wx >= 0 && wx < sx ? light[row + wx] : OUTSIDE_LIGHT;
        }
      }
    }
    return arr;
  }
}
