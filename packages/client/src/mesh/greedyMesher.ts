/**
 * Greedy meshing + 정점 AO. 순수 함수 — 워커와 테스트가 같이 쓴다.
 *
 * 입력: 18×18×18 패딩 블록 번호 배열(paddedIndex 순서), 블록 정보 표.
 * 출력: 불투명(컷아웃 포함)·반투명 두 버퍼.
 *
 * 면 번호: 0 +X, 1 -X, 2 +Y, 3 -Y, 4 +Z, 5 -Z
 */
import { CHUNK_SIZE, paddedIndex } from '@dragon-village/shared';
import { LAYER_NONE, LAYER_TRANSLUCENT, type MeshBlockInfo, type MeshBuffers, type MeshResult } from './meshTypes';

const N = CHUNK_SIZE;

/** 면별 텍스처 u(오른쪽)·v(위) 방향. 밖에서 볼 때 그림이 똑바로 서도록 */
const FACE_U: readonly (readonly [number, number, number])[] = [
  [0, 0, -1], // +X 에서 보면 오른쪽이 -Z
  [0, 0, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
  [-1, 0, 0],
];
const FACE_V: readonly (readonly [number, number, number])[] = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 0],
];

class GeomBuilder {
  positions: Float32Array;
  uvs: Float32Array;
  meta: Uint8Array;
  indices: Uint32Array;
  vc = 0;
  ic = 0;

  constructor(quads = 512) {
    this.positions = new Float32Array(quads * 4 * 3);
    this.uvs = new Float32Array(quads * 4 * 2);
    this.meta = new Uint8Array(quads * 4 * 4);
    this.indices = new Uint32Array(quads * 6);
  }

  private ensure(): void {
    if ((this.vc + 4) * 3 <= this.positions.length) return;
    const grow = <T extends Float32Array | Uint8Array | Uint32Array>(arr: T): T => {
      const next = new (arr.constructor as new (n: number) => T)(arr.length * 2);
      next.set(arr);
      return next;
    };
    this.positions = grow(this.positions);
    this.uvs = grow(this.uvs);
    this.meta = grow(this.meta);
    this.indices = grow(this.indices);
  }

  /**
   * 사각형 하나. corners 는 [x,y,z,u,v,ao] × 4, 이미 바깥에서 볼 때 반시계 순서.
   */
  quad(corners: number[][], layer: number, face: number): void {
    this.ensure();
    const base = this.vc;
    for (let i = 0; i < 4; i++) {
      const c = corners[i];
      const p = (base + i) * 3;
      this.positions[p] = c[0];
      this.positions[p + 1] = c[1];
      this.positions[p + 2] = c[2];
      const t = (base + i) * 2;
      this.uvs[t] = c[3];
      this.uvs[t + 1] = c[4];
      const m = (base + i) * 4;
      this.meta[m] = layer;
      this.meta[m + 1] = c[5];
      this.meta[m + 2] = face;
      this.meta[m + 3] = 0;
    }
    // AO 이방성 보정: 대각선이 더 어두운 쪽 꼭짓점을 지나게
    const flip = corners[0][5] + corners[2][5] > corners[1][5] + corners[3][5];
    const i = this.ic;
    if (!flip) {
      this.indices[i] = base;
      this.indices[i + 1] = base + 1;
      this.indices[i + 2] = base + 2;
      this.indices[i + 3] = base;
      this.indices[i + 4] = base + 2;
      this.indices[i + 5] = base + 3;
    } else {
      this.indices[i] = base + 1;
      this.indices[i + 1] = base + 2;
      this.indices[i + 2] = base + 3;
      this.indices[i + 3] = base + 1;
      this.indices[i + 4] = base + 3;
      this.indices[i + 5] = base;
    }
    this.vc += 4;
    this.ic += 6;
  }

  build(): MeshBuffers | null {
    if (this.vc === 0) return null;
    return {
      positions: this.positions.slice(0, this.vc * 3),
      uvs: this.uvs.slice(0, this.vc * 2),
      meta: this.meta.slice(0, this.vc * 4),
      indices: this.indices.slice(0, this.ic),
      vertexCount: this.vc,
      indexCount: this.ic,
    };
  }
}

export function greedyMesh(padded: Uint16Array, info: readonly MeshBlockInfo[]): MeshResult {
  const opaque = new GeomBuilder();
  const trans = new GeomBuilder();
  const maskF = new Int32Array(N * N);
  const maskB = new Int32Array(N * N);
  const p = [0, 0, 0];
  const q = [0, 0, 0];

  const cast = (x: number, y: number, z: number): boolean => {
    const bi = info[padded[paddedIndex(x, y, z)]];
    return bi !== undefined && bi.castAO;
  };

  /** 블록 p 의 면(축 d, 방향 s)에서 꼭짓점 (su, sv) 의 AO 0..3 */
  const aoAt = (d: number, s: number, u: number, su: number, v: number, sv: number): number => {
    q[0] = p[0];
    q[1] = p[1];
    q[2] = p[2];
    q[d] += s;
    const qu = q[u],
      qv = q[v];
    q[u] = qu + su;
    const side1 = cast(q[0], q[1], q[2]) ? 1 : 0;
    q[u] = qu;
    q[v] = qv + sv;
    const side2 = cast(q[0], q[1], q[2]) ? 1 : 0;
    q[u] = qu + su;
    const corner = cast(q[0], q[1], q[2]) ? 1 : 0;
    if (side1 && side2) return 0;
    return 3 - (side1 + side2 + corner);
  };

  const visible = (a: MeshBlockInfo, aId: number, bId: number): boolean => {
    const b = info[bId];
    if (!b) return true;
    if (b.opaque) return false;
    if (aId === bId && a.sameCull) return false;
    if (a.layer === LAYER_TRANSLUCENT && b.layer === LAYER_TRANSLUCENT) return false;
    return true;
  };

  const emit = (mask: Int32Array, d: number, u: number, v: number, face: number, plane: number, front: boolean): void => {
    const U = FACE_U[face],
      V = FACE_V[face];
    for (let a = 0; a < N; a++) {
      for (let b = 0; b < N; ) {
        const k = mask[a * N + b];
        if (k === 0) {
          b++;
          continue;
        }
        let w = 1;
        while (b + w < N && mask[a * N + b + w] === k) w++;
        let h = 1;
        outer: for (; a + h < N; h++) for (let t = 0; t < w; t++) if (mask[(a + h) * N + b + t] !== k) break outer;

        const id = k >>> 8;
        const ao = k & 0xff;
        const bi = info[id];
        const layer = bi.tex[face];

        // 네 꼭짓점: c0 (-,-) c1 (+u,-) c2 (+u,+v) c3 (-,+v)
        const corners: number[][] = [];
        for (let ci = 0; ci < 4; ci++) {
          const su = ci === 1 || ci === 2 ? 1 : 0;
          const sv = ci === 2 || ci === 3 ? 1 : 0;
          const c = [0, 0, 0];
          c[d] = plane;
          c[u] = a + su * h;
          c[v] = b + sv * w;
          const uu = c[0] * U[0] + c[1] * U[1] + c[2] * U[2];
          const vv = c[0] * V[0] + c[1] * V[1] + c[2] * V[2];
          corners.push([c[0], c[1], c[2], uu, vv, (ao >> (ci * 2)) & 3]);
        }
        // cross(e_u, e_v) = +e_d 이므로 앞면(+d)은 c0..c3 그대로, 뒷면은 뒤집는다
        const ordered = front ? corners : [corners[0], corners[3], corners[2], corners[1]];
        (bi.layer === LAYER_TRANSLUCENT ? trans : opaque).quad(ordered, layer, face);

        for (let da = 0; da < h; da++) for (let t = 0; t < w; t++) mask[(a + da) * N + b + t] = 0;
        b += w;
      }
    }
  };

  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3,
      v = (d + 2) % 3;
    const faceF = d * 2,
      faceB = d * 2 + 1;
    for (let i = 0; i < N; i++) {
      let n = 0;
      for (let a = 0; a < N; a++) {
        for (let b = 0; b < N; b++, n++) {
          p[d] = i;
          p[u] = a;
          p[v] = b;
          const id = padded[paddedIndex(p[0], p[1], p[2])];
          const bi = info[id];
          let kf = 0,
            kb = 0;
          if (bi !== undefined && bi.layer !== LAYER_NONE) {
            p[d] = i + 1;
            const idF = padded[paddedIndex(p[0], p[1], p[2])];
            p[d] = i;
            if (visible(bi, id, idF)) {
              const ao = aoAt(d, 1, u, -1, v, -1) | (aoAt(d, 1, u, 1, v, -1) << 2) | (aoAt(d, 1, u, 1, v, 1) << 4) | (aoAt(d, 1, u, -1, v, 1) << 6);
              kf = (id << 8) | ao;
            }
            p[d] = i - 1;
            const idB = padded[paddedIndex(p[0], p[1], p[2])];
            p[d] = i;
            if (visible(bi, id, idB)) {
              const ao = aoAt(d, -1, u, -1, v, -1) | (aoAt(d, -1, u, 1, v, -1) << 2) | (aoAt(d, -1, u, 1, v, 1) << 4) | (aoAt(d, -1, u, -1, v, 1) << 6);
              kb = (id << 8) | ao;
            }
          }
          maskF[n] = kf;
          maskB[n] = kb;
        }
      }
      emit(maskF, d, u, v, faceF, i + 1, true);
      emit(maskB, d, u, v, faceB, i, false);
    }
  }

  return { opaque: opaque.build(), translucent: trans.build() };
}

/** 워커로 넘길 transfer 목록 */
export function transferables(r: MeshResult): ArrayBuffer[] {
  const out: ArrayBuffer[] = [];
  for (const b of [r.opaque, r.translucent]) {
    if (!b) continue;
    out.push(b.positions.buffer as ArrayBuffer, b.uvs.buffer as ArrayBuffer, b.meta.buffer as ArrayBuffer, b.indices.buffer as ArrayBuffer);
  }
  return out;
}
