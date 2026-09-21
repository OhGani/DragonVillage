/**
 * Greedy meshing + 정점 AO + 정점 빛(부드러운 조명). 순수 함수 — 워커와 테스트가 같이 쓴다.
 *
 * 입력: 18×18×18 패딩 블록 번호 배열(paddedIndex 순서), 블록 정보 표, (선택) 같은 모양의 빛 배열.
 * 출력: 불투명(컷아웃 포함)·반투명 두 버퍼. meta = [텍스처, AO, 면, 빛(스카이<<4|블록)].
 *
 * 꼭짓점 빛 = 그 꼭짓점에 닿는 바깥쪽 4칸(면 앞 칸 + 옆 2칸 + 모서리 칸)의 평균. 불투명 칸은 빼고 센다.
 * 빛 배열이 없으면(손에 든 블록) 하늘 15·블록 0.
 *
 * 면 번호: 0 +X, 1 -X, 2 +Y, 3 -Y, 4 +Z, 5 -Z
 */
import { CHUNK_SIZE, DOOR_DIR, OUTSIDE_LIGHT, paddedIndex } from '@dragon-village/shared';
import { LAYER_NONE, LAYER_TRANSLUCENT, type MeshBlockInfo, type MeshBuffers, type MeshResult } from './meshTypes';

const N = CHUNK_SIZE;
/** 문 판 두께 (마인크래프트 3/16) */
export const PANEL_THICKNESS = 3 / 16;
/** 횃불 막대 (결정 #82): 굵기 2/16, 길이 10/16. 텍스처는 7~9열·아래 10줄에 그려 둔다 */
export const TORCH_HALF = 1 / 16;
export const TORCH_LEN = 10 / 16;
/** 벽 횃불이 벽 반대쪽으로 기우는 각 */
const TORCH_TILT = (25 * Math.PI) / 180;
/** 막대가 그려진 텍스처 칸의 왼쪽 (7/16 ~ 9/16) */
const TORCH_TEX_U = 7 / 16;
/** 벽에서 이만큼 안쪽에 막대 가운데를 둔다 */
const TORCH_WALL_OFF = 7 / 16;
/** 벽 횃불이 붙는 높이 */
const TORCH_WALL_Y = 3 / 16;

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
const FACE_NORMAL: readonly (readonly [number, number, number])[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
/** 액체 옆면: [면, dx, dz] */
const FLUID_SIDES: readonly (readonly [number, number, number])[] = [
  [0, 1, 0],
  [1, -1, 0],
  [4, 0, 1],
  [5, 0, -1],
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
   * 사각형 하나. corners 는 [x,y,z,u,v,ao,빛] × 4, 이미 바깥에서 볼 때 반시계 순서.
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
      this.meta[m + 3] = c[6] ?? OUTSIDE_LIGHT;
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

export function greedyMesh(padded: Uint16Array, info: readonly MeshBlockInfo[], light?: Uint8Array): MeshResult {
  const opaque = new GeomBuilder();
  const trans = new GeomBuilder();
  const maskF = new Int32Array(N * N);
  const maskB = new Int32Array(N * N);
  /** 면마다 네 꼭짓점 빛(8비트 × 4) — 병합 키의 두 번째 절반 */
  const maskFL = new Int32Array(N * N);
  const maskBL = new Int32Array(N * N);
  const p = [0, 0, 0];
  const q = [0, 0, 0];

  /** cornerAt 가 마지막으로 계산한 꼭짓점 빛 (스카이<<4 | 블록) */
  let cornerLight = OUTSIDE_LIGHT;

  /**
   * 블록 p 의 면(축 d, 방향 s)에서 꼭짓점 (su, sv) 의 AO 0..3 을 돌려주고, 같은 4칸으로 빛 평균을 cornerLight 에 둔다.
   * 4칸 = 면 앞 칸(adj), 옆 칸 둘(side1, side2), 모서리 칸(corner).
   */
  const cornerAt = (d: number, s: number, u: number, su: number, v: number, sv: number): number => {
    q[0] = p[0];
    q[1] = p[1];
    q[2] = p[2];
    q[d] += s;
    const adjIdx = paddedIndex(q[0], q[1], q[2]);
    const qu = q[u],
      qv = q[v];
    q[u] = qu + su;
    const i1 = paddedIndex(q[0], q[1], q[2]);
    q[u] = qu;
    q[v] = qv + sv;
    const i2 = paddedIndex(q[0], q[1], q[2]);
    q[u] = qu + su;
    const i3 = paddedIndex(q[0], q[1], q[2]);
    const b1 = info[padded[i1]],
      b2 = info[padded[i2]],
      b3 = info[padded[i3]];
    const c1 = b1 !== undefined && b1.castAO,
      c2 = b2 !== undefined && b2.castAO,
      c3 = b3 !== undefined && b3.castAO;

    if (light) {
      const la = light[adjIdx];
      let sky = la >> 4,
        blk = la & 15,
        n = 1;
      const o1 = b1 !== undefined && b1.opaque,
        o2 = b2 !== undefined && b2.opaque;
      if (!o1) {
        const l = light[i1];
        sky += l >> 4;
        blk += l & 15;
        n++;
      }
      if (!o2) {
        const l = light[i2];
        sky += l >> 4;
        blk += l & 15;
        n++;
      }
      // 옆 두 칸이 다 막혀 있으면 모서리 칸의 빛은 이 꼭짓점에 못 닿는다
      if (!(o1 && o2) && !(b3 !== undefined && b3.opaque)) {
        const l = light[i3];
        sky += l >> 4;
        blk += l & 15;
        n++;
      }
      cornerLight = (Math.round(sky / n) << 4) | Math.round(blk / n);
    } else cornerLight = OUTSIDE_LIGHT;

    if (c1 && c2) return 0;
    return 3 - ((c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0));
  };

  /** 액체 칸은 자기 칸의 빛을 그대로 쓴다 */
  const lightOfCell = (x: number, y: number, z: number): number => (light ? light[paddedIndex(x, y, z)] : OUTSIDE_LIGHT);

  const visible = (a: MeshBlockInfo, aId: number, bId: number): boolean => {
    const b = info[bId];
    if (!b) return true;
    if (b.opaque) return false;
    if (aId === bId && a.sameCull) return false;
    if (a.layer === LAYER_TRANSLUCENT && b.layer === LAYER_TRANSLUCENT && b.fluidKind === 0) return false;
    return true;
  };

  /**
   * 상자(mn~mx)의 face 쪽 면 하나. 꼭짓점 순서는 법선 방향으로 자동 정리, 텍스처 좌표는 세계 좌표를 면에 투영.
   * 액체(높이가 다른 상자)와 얇은 판(문)이 같이 쓴다.
   */
  const boxFace = (builder: GeomBuilder, face: number, mn: readonly number[], mx: readonly number[], layer: number, lt: number) => {
    const [x0, y0, z0] = mn as [number, number, number];
    const [x1, y1, z1] = mx as [number, number, number];
    let c: number[][];
    switch (face) {
      case 0:
        c = [
          [x1, y0, z0],
          [x1, y0, z1],
          [x1, y1, z1],
          [x1, y1, z0],
        ];
        break;
      case 1:
        c = [
          [x0, y0, z0],
          [x0, y0, z1],
          [x0, y1, z1],
          [x0, y1, z0],
        ];
        break;
      case 2:
        c = [
          [x0, y1, z0],
          [x1, y1, z0],
          [x1, y1, z1],
          [x0, y1, z1],
        ];
        break;
      case 3:
        c = [
          [x0, y0, z0],
          [x1, y0, z0],
          [x1, y0, z1],
          [x0, y0, z1],
        ];
        break;
      case 4:
        c = [
          [x0, y0, z1],
          [x1, y0, z1],
          [x1, y1, z1],
          [x0, y1, z1],
        ];
        break;
      default:
        c = [
          [x0, y0, z0],
          [x1, y0, z0],
          [x1, y1, z0],
          [x0, y1, z0],
        ];
    }
    // 법선과 맞게 반시계 순서로
    const n = FACE_NORMAL[face];
    const e1 = [c[1][0] - c[0][0], c[1][1] - c[0][1], c[1][2] - c[0][2]];
    const e3 = [c[3][0] - c[0][0], c[3][1] - c[0][1], c[3][2] - c[0][2]];
    const cross = [e1[1] * e3[2] - e1[2] * e3[1], e1[2] * e3[0] - e1[0] * e3[2], e1[0] * e3[1] - e1[1] * e3[0]];
    if (cross[0] * n[0] + cross[1] * n[1] + cross[2] * n[2] < 0) c = [c[0], c[3], c[2], c[1]];
    const U = FACE_U[face],
      V = FACE_V[face];
    const corners = c.map((p) => [p[0], p[1], p[2], p[0] * U[0] + p[1] * U[1] + p[2] * U[2], p[0] * V[0] + p[1] * V[1] + p[2] * V[2], 3, lt]);
    builder.quad(corners, layer, face);
  };
  /** 액체 사각형 하나: face 의 평면에 h0..h1 높이(옆면) 또는 h1 높이(윗면) */
  const fluidQuad = (builder: GeomBuilder, face: number, x: number, y: number, z: number, h0: number, h1: number, layer: number) =>
    boxFace(builder, face, [x, y + h0, z], [x + 1, y + h1, z + 1], layer, lightOfCell(x, y, z));

  /** 얇은 판(문) 전용 패스: 3/16 두께 상자 여섯 면을 낱개로. 가림 계산 없음(문 몇 개뿐) */
  const emitPanels = () => {
    for (let y = 0; y < N; y++)
      for (let z = 0; z < N; z++)
        for (let x = 0; x < N; x++) {
          const bi = info[padded[paddedIndex(x, y, z)]];
          if (bi === undefined || bi.panel === null) continue;
          const [axis, side] = bi.panel;
          const mn = [x, y, z],
            mx = [x + 1, y + 1, z + 1];
          if (side === 0) mx[axis] = mn[axis] + PANEL_THICKNESS;
          else mn[axis] = mx[axis] - PANEL_THICKNESS;
          const lt = lightOfCell(x, y, z);
          for (let f = 0; f < 6; f++) boxFace(opaque, f, mn, mx, bi.tex[f], lt);
        }
  };

  /**
   * 횃불 전용 패스 (#82): 바닥은 곧은 막대, 벽은 벽에 붙여 기울인 막대.
   * 기울어진 면은 축과 나란하지 않아 UV 를 직접 준다 — 막대 굵기를 텍스처 7~9열에 맞춘다.
   */
  const emitTorches = () => {
    for (let y = 0; y < N; y++)
      for (let z = 0; z < N; z++)
        for (let x = 0; x < N; x++) {
          const bi = info[padded[paddedIndex(x, y, z)]];
          if (bi === undefined || bi.torch === null) continue;
          const lt = lightOfCell(x, y, z);
          const layer = bi.tex[0];
          if (bi.torch < 0) {
            // 바닥: 축에 나란한 상자라 boxFace 로 충분 (UV 는 세계 좌표 투영 = 텍스처의 막대 자리와 그대로 맞는다)
            const mn = [x + 0.5 - TORCH_HALF, y, z + 0.5 - TORCH_HALF];
            const mx = [x + 0.5 + TORCH_HALF, y + TORCH_LEN, z + 0.5 + TORCH_HALF];
            for (let f = 0; f < 6; f++) boxFace(opaque, f, mn, mx, layer, lt);
            continue;
          }
          // 벽: 붙은 벽 쪽 n, 막대는 그 반대쪽으로 기운다
          const [nx, nz] = DOOR_DIR[bi.torch]!;
          const sn = Math.sin(TORCH_TILT),
            cs = Math.cos(TORCH_TILT);
          const up = [-nx * sn, cs, -nz * sn];
          const side = [nz, 0, -nx];
          const fwd = [nx * cs, sn, nz * cs];
          const px = x + 0.5 + nx * TORCH_WALL_OFF,
            py = y + TORCH_WALL_Y,
            pz = z + 0.5 + nz * TORCH_WALL_OFF;
          const P = (u: number, v: number, w: number): number[] => [px + side[0] * u + up[0] * v + fwd[0] * w, py + side[1] * u + up[1] * v + fwd[1] * w, pz + side[2] * u + up[2] * v + fwd[2] * w];
          const tu = (a: number) => TORCH_TEX_U + (a + TORCH_HALF); // −1/16..1/16 → 7/16..9/16
          const h = TORCH_HALF,
            L = TORCH_LEN;
          const quadOut = (pts: [number, number, number][], uvs: [number, number][], out: number[]) => {
            let c = pts.map((q, i) => {
              const p = P(q[0], q[1], q[2]);
              return [p[0], p[1], p[2], uvs[i]![0], uvs[i]![1]];
            });
            const e1 = [c[1]![0] - c[0]![0], c[1]![1] - c[0]![1], c[1]![2] - c[0]![2]];
            const e3 = [c[3]![0] - c[0]![0], c[3]![1] - c[0]![1], c[3]![2] - c[0]![2]];
            const cr = [e1[1]! * e3[2]! - e1[2]! * e3[1]!, e1[2]! * e3[0]! - e1[0]! * e3[2]!, e1[0]! * e3[1]! - e1[1]! * e3[0]!];
            if (cr[0]! * out[0]! + cr[1]! * out[1]! + cr[2]! * out[2]! < 0) c = [c[0]!, c[3]!, c[2]!, c[1]!];
            const ax = Math.abs(out[0]!) >= Math.abs(out[1]!) && Math.abs(out[0]!) >= Math.abs(out[2]!) ? 0 : Math.abs(out[1]!) >= Math.abs(out[2]!) ? 1 : 2;
            const face = ax === 0 ? (out[0]! > 0 ? 0 : 1) : ax === 1 ? (out[1]! > 0 ? 2 : 3) : out[2]! > 0 ? 4 : 5;
            opaque.quad(
              c.map((p) => [p[0]!, p[1]!, p[2]!, p[3]!, p[4]!, 3, lt]),
              layer,
              face,
            );
          };
          // ±side 면: 가로 UV 는 w, 세로는 막대 길이
          quadOut([[h, 0, -h], [h, 0, h], [h, L, h], [h, L, -h]], [[tu(-h), 0], [tu(h), 0], [tu(h), L], [tu(-h), L]], side);
          quadOut([[-h, 0, -h], [-h, 0, h], [-h, L, h], [-h, L, -h]], [[tu(-h), 0], [tu(h), 0], [tu(h), L], [tu(-h), L]], [-side[0]!, -side[1]!, -side[2]!]);
          // ±fwd 면: 가로 UV 는 u
          quadOut([[-h, 0, h], [h, 0, h], [h, L, h], [-h, L, h]], [[tu(-h), 0], [tu(h), 0], [tu(h), L], [tu(-h), L]], fwd);
          quadOut([[-h, 0, -h], [h, 0, -h], [h, L, -h], [-h, L, -h]], [[tu(-h), 0], [tu(h), 0], [tu(h), L], [tu(-h), L]], [-fwd[0]!, -fwd[1]!, -fwd[2]!]);
          // 끝 면 (불꽃 쪽·바닥 쪽)
          quadOut([[-h, L, -h], [h, L, -h], [h, L, h], [-h, L, h]], [[tu(-h), tu(-h)], [tu(h), tu(-h)], [tu(h), tu(h)], [tu(-h), tu(h)]], up);
          quadOut([[-h, 0, -h], [h, 0, -h], [h, 0, h], [-h, 0, h]], [[tu(-h), tu(-h)], [tu(h), tu(-h)], [tu(h), tu(h)], [tu(-h), tu(h)]], [-up[0]!, -up[1]!, -up[2]!]);
        }
  };

  /** 액체 전용 패스: 블록마다 높이가 다르므로 greedy 없이 낱개로 */
  const emitFluids = () => {
    for (let y = 0; y < N; y++)
      for (let z = 0; z < N; z++)
        for (let x = 0; x < N; x++) {
          const bi = info[padded[paddedIndex(x, y, z)]];
          if (bi === undefined || bi.fluidKind === 0) continue;
          const h = bi.fluidHeight,
            kind = bi.fluidKind;
          const builder = bi.layer === LAYER_TRANSLUCENT ? trans : opaque;
          const nb = (dx: number, dy: number, dz: number) => info[padded[paddedIndex(x + dx, y + dy, z + dz)]];
          const up = nb(0, 1, 0);
          if (up === undefined || up.fluidKind !== kind) fluidQuad(builder, 2, x, y, z, 0, h, bi.tex[2]);
          const dn = nb(0, -1, 0);
          if (dn === undefined || !(dn.opaque || dn.fluidKind === kind)) fluidQuad(builder, 3, x, y, z, 0, h, bi.tex[3]);
          for (const [face, dx, dz] of FLUID_SIDES) {
            const nbr = nb(dx, 0, dz);
            let from = 0;
            if (nbr !== undefined) {
              if (nbr.opaque) continue;
              if (nbr.fluidKind === kind) {
                if (nbr.fluidHeight >= h - 1e-6) continue; // 이웃이 더 높거나 같으면 가려진다
                from = nbr.fluidHeight; // 이웃 위로 드러난 부분만
              }
            }
            fluidQuad(builder, face, x, y, z, from, h, bi.tex[face]);
          }
        }
  };

  const emit = (mask: Int32Array, maskL: Int32Array, d: number, u: number, v: number, face: number, plane: number, front: boolean): void => {
    const U = FACE_U[face],
      V = FACE_V[face];
    for (let a = 0; a < N; a++) {
      for (let b = 0; b < N; ) {
        const k = mask[a * N + b];
        if (k === 0) {
          b++;
          continue;
        }
        const kl = maskL[a * N + b];
        let w = 1;
        while (b + w < N && mask[a * N + b + w] === k && maskL[a * N + b + w] === kl) w++;
        let h = 1;
        outer: for (; a + h < N; h++)
          for (let t = 0; t < w; t++) {
            const m = (a + h) * N + b + t;
            if (mask[m] !== k || maskL[m] !== kl) break outer;
          }

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
          corners.push([c[0], c[1], c[2], uu, vv, (ao >> (ci * 2)) & 3, (kl >>> (ci * 8)) & 0xff]);
        }
        // cross(e_u, e_v) = +e_d 이므로 앞면(+d)은 c0..c3 그대로, 뒷면은 뒤집는다
        const ordered = front ? corners : [corners[0], corners[3], corners[2], corners[1]];
        (bi.layer === LAYER_TRANSLUCENT ? trans : opaque).quad(ordered, layer, face);

        for (let da = 0; da < h; da++)
          for (let t = 0; t < w; t++) {
            const m = (a + da) * N + b + t;
            mask[m] = 0;
            maskL[m] = 0;
          }
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
            kb = 0,
            kfl = 0,
            kbl = 0;
          if (bi !== undefined && bi.layer !== LAYER_NONE && bi.fluidKind === 0 && bi.panel === null && bi.torch === null) {
            p[d] = i + 1;
            const idF = padded[paddedIndex(p[0], p[1], p[2])];
            p[d] = i;
            if (visible(bi, id, idF)) {
              // 꼭짓점 순서 c0 (-,-) c1 (+u,-) c2 (+u,+v) c3 (-,+v) — emit 과 같아야 한다
              const a0 = cornerAt(d, 1, u, -1, v, -1),
                l0 = cornerLight;
              const a1 = cornerAt(d, 1, u, 1, v, -1),
                l1 = cornerLight;
              const a2 = cornerAt(d, 1, u, 1, v, 1),
                l2 = cornerLight;
              const a3 = cornerAt(d, 1, u, -1, v, 1),
                l3 = cornerLight;
              kf = (id << 8) | a0 | (a1 << 2) | (a2 << 4) | (a3 << 6);
              kfl = l0 | (l1 << 8) | (l2 << 16) | (l3 << 24);
            }
            p[d] = i - 1;
            const idB = padded[paddedIndex(p[0], p[1], p[2])];
            p[d] = i;
            if (visible(bi, id, idB)) {
              const a0 = cornerAt(d, -1, u, -1, v, -1),
                l0 = cornerLight;
              const a1 = cornerAt(d, -1, u, 1, v, -1),
                l1 = cornerLight;
              const a2 = cornerAt(d, -1, u, 1, v, 1),
                l2 = cornerLight;
              const a3 = cornerAt(d, -1, u, -1, v, 1),
                l3 = cornerLight;
              kb = (id << 8) | a0 | (a1 << 2) | (a2 << 4) | (a3 << 6);
              kbl = l0 | (l1 << 8) | (l2 << 16) | (l3 << 24);
            }
          }
          maskF[n] = kf;
          maskB[n] = kb;
          maskFL[n] = kfl;
          maskBL[n] = kbl;
        }
      }
      emit(maskF, maskFL, d, u, v, faceF, i + 1, true);
      emit(maskB, maskBL, d, u, v, faceB, i, false);
    }
  }
  emitFluids();
  emitPanels();
  emitTorches();

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
