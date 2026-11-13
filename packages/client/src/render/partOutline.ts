/**
 * 조준 외곽선의 모양 (#293, 아빠 2026-11-13 "조준 외곽선도 계단·반 블록 모양에 맞춰 줘").
 * 블록의 조각 마스크(shared/rules/stairs.ts — 한 칸을 반 칸 조각 여덟으로, 비트 sx + sz·2 + sy·4)에서
 * 겉모양의 모서리 선분과, 금(부수는 중)을 입힐 상자들을 뽑는다. Three.js 없이 순수 계산 — Highlight.ts 가 그린다.
 */

/** [x0, y0, z0, x1, y1, z1] — 칸 안 좌표 0..1 */
export type Seg = readonly [number, number, number, number, number, number];

/**
 * n×n×n 격자로 적은 모양의 겉 모서리. 격자선(축 a 방향, 나머지 두 축의 격자점)마다 둘레 네 칸을 본다:
 * 하나·셋이 차 있으면 모서리(볼록·오목), 둘이 대각선이면 모서리, 둘이 나란하거나(평평한 면) 넷·영이면 아니다.
 * 한 줄로 이어진 조각들은 긴 선분 하나로 합친다. 좌표는 칸 안 0..1
 */
export function gridEdges(n: number, filled: (x: number, y: number, z: number) => boolean): Seg[] {
  const out: Seg[] = [];
  const s = [0, 0, 0];
  const at = (): boolean => s[0]! >= 0 && s[0]! < n && s[1]! >= 0 && s[1]! < n && s[2]! >= 0 && s[2]! < n && filled(s[0]!, s[1]!, s[2]!);
  for (let a = 0; a < 3; a++) {
    const b = (a + 1) % 3,
      c = (a + 2) % 3;
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= n; j++) {
        let start = -1;
        for (let k = 0; k <= n; k++) {
          let on = false;
          if (k < n) {
            s[a] = k;
            const q = (di: number, dj: number): boolean => {
              s[b] = i + di;
              s[c] = j + dj;
              return at();
            };
            const q00 = q(-1, -1),
              q10 = q(0, -1),
              q01 = q(-1, 0),
              q11 = q(0, 0);
            const cnt = (q00 ? 1 : 0) + (q10 ? 1 : 0) + (q01 ? 1 : 0) + (q11 ? 1 : 0);
            on = cnt === 1 || cnt === 3 || (cnt === 2 && q00 === q11);
          }
          if (on && start < 0) start = k;
          if (!on && start >= 0) {
            const p0 = [0, 0, 0],
              p1 = [0, 0, 0];
            p0[b] = p1[b] = i / n;
            p0[c] = p1[c] = j / n;
            p0[a] = start / n;
            p1[a] = k / n;
            out.push([p0[0]!, p0[1]!, p0[2]!, p1[0]!, p1[1]!, p1[2]!]);
            start = -1;
          }
        }
      }
  }
  return out;
}

/** 조각 마스크(계단·반 블록, 2×2×2)의 겉 모서리 */
export function outlineEdges(mask: number): Seg[] {
  return gridEdges(2, (x, y, z) => ((mask >> (x + z * 2 + y * 4)) & 1) === 1);
}

/** 16분의 1 단위 상자들(울타리·울타리문, #295)의 겉 모서리 — 16³ 격자에 칠해 놓고 뽑는다 */
export function boxEdges(boxes: readonly (readonly number[])[]): Seg[] {
  const g = new Uint8Array(16 * 16 * 16);
  for (const [x0, y0, z0, x1, y1, z1] of boxes) for (let y = y0!; y < y1!; y++) for (let z = z0!; z < z1!; z++) for (let x = x0!; x < x1!; x++) g[x + z * 16 + y * 256] = 1;
  return gridEdges(16, (x, y, z) => g[x + z * 16 + y * 256] === 1);
}

/** 금을 입힐 상자들: 층(아래·위 반)마다 넷이 다 찼으면 한 장, 아니면 찬 조각마다. 둘 다 꽉 찼으면 한 칸 하나 */
export function partBoxes(mask: number): Seg[] {
  if ((mask & 255) === 255) return [[0, 0, 0, 1, 1, 1]];
  const out: Seg[] = [];
  for (let sy = 0; sy < 2; sy++) {
    const layer = (mask >> (sy * 4)) & 15;
    if (layer === 15) {
      out.push([0, sy / 2, 0, 1, sy / 2 + 0.5, 1]);
      continue;
    }
    for (let sz = 0; sz < 2; sz++) for (let sx = 0; sx < 2; sx++) if ((layer >> (sx + sz * 2)) & 1) out.push([sx / 2, sy / 2, sz / 2, sx / 2 + 0.5, sy / 2 + 0.5, sz / 2 + 0.5]);
  }
  return out;
}
