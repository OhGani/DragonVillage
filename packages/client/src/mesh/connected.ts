/**
 * 이어지는 그림 (아빠 2026-11-09 "유리를 여러 개 쌓으면 유리끼리 맞닿은 쪽은 경계선을 안 보이게, 하나의 유리처럼"):
 * 같은 블록이 면 옆에 붙어 있으면 그 쪽 테두리를 지운 그림을 쓴다 — 마인크래프트 옵티파인의 '연결된 텍스처'.
 *
 * 면마다 둘레 여덟 칸(상하좌우 + 대각선)을 보고 8비트를 만든다 (면의 U·V 축 기준):
 *   0 u−  1 u+  2 v−  3 v+  4 (u−,v−)  5 (u+,v−)  6 (u+,v+)  7 (u−,v+)
 * 대각선은 양옆 두 변이 다 이어졌을 때만 뜻이 있어서(모서리 점 하나) canonConnect 로 정리하면 47가지가 남는다.
 * 그림은 로드할 때 기본 그림에서 만들어 아틀라스에 `이름@번호` 로 넣는다(textures.ts), 메셔는 번호 표(MeshBlockInfo.connect)로 레이어를 고른다.
 */

/** 이어지는 그림을 쓰는 블록 id */
export const CONNECTED_BLOCKS: ReadonlySet<string> = new Set(['glass']);

/** 8비트 이웃 → 그림이 달라지는 47가지 중 하나. 변이 안 이어진 쪽의 대각선 비트는 지운다 */
export function canonConnect(m: number): number {
  const e = m & 15;
  let c = 0;
  if (e & 1 && e & 4 && m & 16) c |= 16;
  if (e & 2 && e & 4 && m & 32) c |= 32;
  if (e & 2 && e & 8 && m & 64) c |= 64;
  if (e & 1 && e & 8 && m & 128) c |= 128;
  return e | c;
}

/** canonConnect 가 내는 값 전부 (47개, 0 = 혼자) */
export function connectedKeys(): number[] {
  const s = new Set<number>();
  for (let m = 0; m < 256; m++) s.add(canonConnect(m));
  return [...s].sort((a, b) => a - b);
}

/** 아틀라스 이름. 0(혼자)은 기본 그림 그대로 */
export function connectedName(tex: string, canon: number): string {
  return canon === 0 ? tex : `${tex}@${canon}`;
}

/**
 * 기본 그림(size×size RGBA, PNG 방향 — 0행이 위 = v+ 쪽, 0열이 u− 쪽)에서 이어진 쪽 테두리 한 줄을 안쪽 픽셀로 덮는다.
 * 모서리 픽셀은 양옆 변과 대각선이 다 이어졌을 때만 지운다(아니면 옆 유리의 테두리와 이어지는 선이 끊긴다)
 */
export function connectedImage(src: Uint8ClampedArray, size: number, canon: number): Uint8ClampedArray<ArrayBuffer> {
  const out = new Uint8ClampedArray(new ArrayBuffer(src.length));
  out.set(src);
  const L = (canon & 1) !== 0,
    R = (canon & 2) !== 0,
    B = (canon & 4) !== 0,
    T = (canon & 8) !== 0;
  const last = size - 1;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const onL = x === 0,
        onR = x === last,
        onT = y === 0,
        onB = y === last;
      if (!(onL || onR || onT || onB)) continue;
      let erase: boolean;
      if ((onL || onR) && (onT || onB)) {
        // 모서리: 대각선 비트 4 (u−,v−)=왼쪽 아래, 5 (u+,v−)=오른쪽 아래, 6 (u+,v+)=오른쪽 위, 7 (u−,v+)=왼쪽 위
        const bit = onL && onB ? 16 : onR && onB ? 32 : onR && onT ? 64 : 128;
        erase = (canon & bit) !== 0;
      } else erase = onL ? L : onR ? R : onT ? T : B;
      if (!erase) continue;
      const sx = onL ? 1 : onR ? last - 1 : x,
        sy = onT ? 1 : onB ? last - 1 : y;
      const di = (y * size + x) * 4,
        si = (sy * size + sx) * 4;
      out[di] = src[si]!;
      out[di + 1] = src[si + 1]!;
      out[di + 2] = src[si + 2]!;
      out[di + 3] = src[si + 3]!;
    }
  return out;
}

/** 블록 하나의 이웃 8비트(0..255) → 아틀라스 레이어 표. 변형 그림이 하나라도 없으면 null */
export function connectTable(tex: string, layerOf: (name: string) => number | undefined): number[] | null {
  const table: number[] = [];
  for (let m = 0; m < 256; m++) {
    const l = layerOf(connectedName(tex, canonConnect(m)));
    if (l === undefined) return null;
    table.push(l);
  }
  return table;
}
