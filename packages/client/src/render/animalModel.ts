/**
 * 마을 동물 복셀 모델 (M8-1 2차, 아빠 2026-09-24 "동물 입체적으로 이쁘게").
 * 마인크래프트 비율 그대로(1 픽셀 = 1 복셀 = 1.8/32 m): 소 몸 12×10×18·다리 12, 돼지 몸 10×8×16·다리 6, 양 털 몸·다리 12,
 * 닭 몸 6×6×8·부리·턱볏·날개, 늑대 몸·갈기·주둥이·꼬리. 머리·다리·꼬리·날개는 따로 그려서 MobView 가 움직인다(걷기·풀 뜯기·꼬리 흔들기·날개 퍼덕).
 * 색 변종(마인크래프트 열대·온대·한대, 양털 여섯 색)은 동물 id 로 결정론 — 모두에게 같은 소가 보인다.
 * 앞이 −z, 바닥 y 0, x 는 가운데 0 (복셀 x 는 정수 칸, 짝수 너비면 −w/2..w/2−1).
 * **모든 부위의 복셀과 pivot 은 같은 몸 좌표로 적는다** — pivotMesh 가 pivot 을 빼서 축을 원점으로 옮긴다 (꼬리를 축 기준으로 적었다가 공중에 뜬 적 있음).
 */
import type { Voxel } from './voxelGeometry';

export interface Part {
  v: Voxel[];
  /** 회전 축 (복셀 단위) */
  pivot: [number, number, number];
}
export interface AnimalParts {
  body: Voxel[];
  head: Part;
  /** 앞왼·앞오른·뒤왼·뒤오른 (닭은 둘) */
  legs: Part[];
  tail: Part | null;
  /** 왼·오른 (닭만) */
  wings: Part[];
  /** 아기일 때 머리 배율 (마인크래프트 아기는 머리가 크다) */
  babyHead: number;
}

function css(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}
function scaleColor(base: number, k: number): number {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (c(base >> 16) << 16) | (c((base >> 8) & 255) << 8) | c(base & 255);
}
/** 털 얼룩: 칸마다 살짝 다른 밝기 + 위가 밝고 아래가 어두운 결 */
function fur(x: number, y: number, z: number, base: number, amp = 0.12): number {
  const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
  const k = 1 - amp / 2 + (((h >>> 0) % 100) / 100) * amp;
  return scaleColor(base, k * (0.9 + 0.006 * y));
}
type ColorFn = (x: number, y: number, z: number) => number;
const solid =
  (c: number): ColorFn =>
  () =>
    c;
const soft =
  (c: number, amp = 0.12): ColorFn =>
  (x, y, z) =>
    fur(x, y, z, c, amp);

/** id 로 뽑는 변종 (0~1) — 클라마다 같아야 하니 시드 없이 id 만 */
export function animalVariant(id: number): number {
  let h = (id * 2654435761) >>> 0;
  h ^= h >>> 15;
  h = (h * 2246822519) >>> 0;
  h ^= h >>> 13;
  return (h % 10000) / 10000;
}

/** 복셀 쌓기 — 같은 자리는 나중 색이 덮는다 (겹친 상자·얼굴 무늬) */
class Builder {
  private readonly cells = new Map<string, Voxel>();
  get out(): Voxel[] {
    return [...this.cells.values()];
  }
  box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: ColorFn): this {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) this.cells.set(`${x},${y},${z}`, { x, y, z, c: css(color(x, y, z)) });
    return this;
  }
  dot(x: number, y: number, z: number, color: number): this {
    this.cells.set(`${x},${y},${z}`, { x, y, z, c: css(color) });
    return this;
  }
}
function part(b: Builder, pivot: [number, number, number]): Part {
  return { v: b.out, pivot };
}
/** 다리 넷: 너비 w, 높이 h, 몸 바깥쪽 x 끝 sx(왼쪽은 −sx..−sx+w−1), 앞 z0·뒤 z1 (각 w 길이) */
function fourLegs(w: number, h: number, sx: number, z0: number, z1: number, color: ColorFn, top?: { rows: number; color: ColorFn }): Part[] {
  const spots: [number, number][] = [
    [-sx, z0],
    [sx - w, z0],
    [-sx, z1],
    [sx - w, z1],
  ];
  return spots.map(([lx, lz]) => {
    const b = new Builder();
    b.box(lx, lx + w - 1, 0, h - 1, lz, lz + w - 1, (x, y, z) => (top && y >= h - top.rows ? top.color(x, y, z) : color(x, y, z)));
    return part(b, [lx + w / 2, h, lz + w / 2]);
  });
}

// ---------------------------------------------------------------- 소
function cow(variant: number): AnimalParts {
  // 온대(갈색+흰 얼룩) · 한대(짙은 갈색 털북숭이, 큰 뿔) · 열대(모래빛, 흰 배)
  const kind = variant < 0.34 ? 'temperate' : variant < 0.67 ? 'cold' : 'warm';
  const coat = kind === 'temperate' ? 0x4a3320 : kind === 'cold' ? 0x3b2a1e : 0xb08a5c;
  const patch = kind === 'temperate' ? 0xeeeeee : kind === 'cold' ? 0x5a4432 : 0xe6d7bf;
  const hide: ColorFn = (x, y, z) => {
    if (kind === 'warm') return y <= 13 ? fur(x, y, z, patch, 0.06) : fur(x, y, z, coat);
    if (kind === 'cold') return fur(x, y, z, ((x * 5 + y * 3 + z * 7) >>> 0) % 9 < 2 ? patch : coat, 0.16);
    return ((x * 7 + y * 3 + z * 5) >>> 0) % 11 < 3 ? fur(x, y, z, patch, 0.06) : fur(x, y, z, coat);
  };
  const body = new Builder()
    .box(-6, 5, 12, 21, -9, 8, hide) // 몸 12×10×18
    .box(-2, 1, 11, 11, 2, 7, soft(0xe8b9a9, 0.06)); // 젖
  const legs = fourLegs(4, 12, 6, -7, 4, soft(kind === 'warm' ? 0x8a6a45 : 0x3a2818));
  // 머리 8×8×6 (+주둥이 밝게, 눈, 코, 뿔)
  const h = new Builder().box(-4, 3, 16, 23, -15, -10, hide);
  const muzzle = kind === 'cold' ? 0x6e5541 : 0xd8b7a0;
  h.box(-4, 3, 16, 18, -15, -15, soft(muzzle, 0.05)); // 주둥이
  h.dot(-2, 17, -15, 0x5a3a2c).dot(1, 17, -15, 0x5a3a2c); // 코
  if (kind === 'cold') {
    h.box(-4, 3, 21, 23, -15, -14, soft(0x8a6a4a, 0.14)); // 앞머리 털(눈을 덮는다)
  } else {
    h.dot(-3, 21, -15, 0xffffff).dot(-2, 21, -15, 0x1a1a1a).dot(1, 21, -15, 0x1a1a1a).dot(2, 21, -15, 0xffffff); // 눈
    if (kind === 'temperate') h.box(-1, 0, 19, 23, -15, -15, soft(0xeeeeee, 0.04)); // 흰 줄무늬
  }
  const hornLen = kind === 'cold' ? 3 : 2;
  h.box(-5 - (kind === 'cold' ? 1 : 0), -5, 22, 21 + hornLen, -12, -11, solid(0xd0d0d0)).box(4, 4 + (kind === 'cold' ? 1 : 0), 22, 21 + hornLen, -12, -11, solid(0xd0d0d0)); // 뿔
  const tail = new Builder().box(-1, 0, 15, 21, 9, 9, soft(coat, 0.08)).dot(-1, 15, 9, 0x2a1e14).dot(0, 15, 9, 0x2a1e14); // 꼬리(몸 뒤 위에서 아래로), 끝은 검은 털
  return { body: body.out, head: part(h, [0, 19, -10]), legs, tail: part(tail, [0, 22, 9]), wings: [], babyHead: 1.5 };
}

// ---------------------------------------------------------------- 돼지
function pig(variant: number): AnimalParts {
  const kind = variant < 0.6 ? 'temperate' : variant < 0.8 ? 'cold' : 'warm';
  const skin = kind === 'temperate' ? 0xf0a3a8 : kind === 'cold' ? 0xe9e2d6 : 0xc48a7a;
  const nose = kind === 'cold' ? 0xe4a5a8 : kind === 'warm' ? 0xa86a5e : 0xd97a80;
  const hide: ColorFn = (x, y, z) => (kind === 'warm' && ((x * 3 + y * 7 + z * 5) >>> 0) % 13 < 2 ? fur(x, y, z, 0x8a5a48, 0.1) : fur(x, y, z, skin, 0.08));
  const body = new Builder().box(-5, 4, 6, 13, -8, 7, hide); // 몸 10×8×16
  const legs = fourLegs(4, 6, 5, -6, 3, hide);
  const h = new Builder().box(-4, 3, 8, 15, -16, -9, hide); // 머리 8×8×8
  h.box(-2, 1, 9, 11, -17, -17, soft(nose, 0.04)); // 코 4×3 (한 칸 튀어나옴)
  h.dot(-2, 10, -17, scaleColor(nose, 0.7)).dot(1, 10, -17, scaleColor(nose, 0.7)); // 콧구멍
  h.dot(-4, 13, -16, 0xffffff).dot(-3, 13, -16, 0x1a1a1a).dot(2, 13, -16, 0x1a1a1a).dot(3, 13, -16, 0xffffff); // 눈
  h.box(-4, -4, 16, 16, -13, -12, hide).box(3, 3, 16, 16, -13, -12, hide); // 귀 살짝 (머리 위 한 칸)
  const tail = new Builder().box(0, 0, 11, 13, 8, 8, soft(skin, 0.05)).dot(0, 11, 9, scaleColor(skin, 0.9)); // 꼬랑지 (몸 뒤 z 8, 끝이 살짝 말림)
  return { body: body.out, head: part(h, [0, 12, -9]), legs, tail: part(tail, [0, 14, 8]), wings: [], babyHead: 1.5 };
}

// ---------------------------------------------------------------- 양
function sheep(variant: number, sheared = false): AnimalParts {
  // 흰 55 · 연회색 15 · 회색 10 · 검정 10 · 갈색 7 · 분홍 3 (마인크래프트 자연 색 여섯)
  const wool = variant < 0.55 ? 0xf2f2f2 : variant < 0.7 ? 0xc9c9c9 : variant < 0.8 ? 0x8a8a8a : variant < 0.9 ? 0x2f2f2f : variant < 0.97 ? 0x6b4a2b : 0xf0a0c0;
  const dark = wool === 0x2f2f2f;
  const skin = dark ? 0x6e6459 : 0xd9c8b0;
  const w: ColorFn = soft(wool, dark ? 0.2 : 0.1);
  const sk: ColorFn = soft(skin, 0.06);
  // 깎인 양(M8-1 3차): 털 없이 살색 몸 8×6×16, 머리 털도 없다
  const body = sheared ? new Builder().box(-4, 3, 11, 16, -8, 7, sk) : new Builder().box(-5, 4, 10, 17, -9, 8, w); // 털 몸 10×8×18
  const legs = sheared ? fourLegs(4, 11, 5, -7, 4, sk) : fourLegs(4, 10, 5, -7, 4, sk, { rows: 2, color: w }); // 다리 위 두 칸은 털
  const h = new Builder().box(-3, 2, 12, 17, -15, -10, sk); // 머리 6×6×6
  if (!sheared) h.box(-3, 2, 15, 18, -13, -10, w); // 머리 털
  h.box(-3, 2, 12, 13, -15, -15, soft(scaleColor(skin, 0.85), 0.04)); // 코
  h.dot(-2, 15, -15, 0x1a1a1a).dot(1, 15, -15, 0x1a1a1a); // 눈
  h.dot(-3, 15, -15, dark ? 0xd0d0d0 : 0xffffff).dot(2, 15, -15, dark ? 0xd0d0d0 : 0xffffff);
  const tail = new Builder().box(-1, 0, 15, 17, sheared ? 8 : 9, sheared ? 8 : 9, sheared ? sk : w); // 몽당 꼬리
  return { body: body.out, head: part(h, [0, 15, -10]), legs, tail: part(tail, [0, 18, 9]), wings: [], babyHead: 1.5 };
}

// ---------------------------------------------------------------- 닭
function chicken(variant: number): AnimalParts {
  const kind = variant < 0.5 ? 'temperate' : variant < 0.75 ? 'cold' : 'warm';
  const feather = kind === 'temperate' ? 0xf6f6f6 : kind === 'cold' ? 0xbfc9d2 : 0x9a6a3c;
  const f: ColorFn = soft(feather, 0.08);
  const tailC = kind === 'warm' ? 0x4a3320 : kind === 'cold' ? 0x8a97a3 : 0xdedede;
  const body = new Builder().box(-3, 2, 5, 10, -4, 3, f); // 몸 6×6×8
  body.box(-2, 1, 9, 11, 4, 5, soft(tailC, 0.1)).box(-1, 0, 11, 12, 5, 6, soft(tailC, 0.1)); // 꼬리 깃
  const legColor = solid(0xe6a23c);
  const legs = [-2, 1].map((lx) => {
    const b = new Builder().box(lx, lx, 0, 4, 0, 0, legColor).box(lx - 1, lx + 1, 0, 0, -2, 0, legColor); // 다리 + 발
    return part(b, [lx + 0.5, 5, 0.5]);
  });
  const h = new Builder().box(-2, 1, 9, 14, -7, -5, f); // 머리 4×6×3
  h.box(-2, 1, 10, 11, -9, -8, solid(0xe6a23c)); // 부리 4×2×2
  h.box(-1, 0, 8, 9, -9, -8, solid(0xe53935)); // 턱볏
  h.dot(-2, 13, -7, 0x1a1a1a).dot(1, 13, -7, 0x1a1a1a); // 눈
  if (kind !== 'cold') h.box(-1, 0, 15, 15, -6, -5, solid(0xe53935)); // 작은 볏
  const wings = [-4, 3].map((wx) => {
    const b = new Builder().box(wx, wx, 7, 10, -3, 2, f);
    return part(b, [wx + 0.5, 10, 0]);
  });
  return { body: body.out, head: part(h, [0, 9, -4]), legs, tail: null, wings, babyHead: 1.4 };
}

// ---------------------------------------------------------------- 강아지(늑대)
function dog(variant: number): AnimalParts {
  const coat = variant < 0.7 ? 0xc8c8c8 : 0x8b6a4a;
  const f: ColorFn = soft(coat, 0.14);
  const body = new Builder().box(-3, 2, 8, 13, -3, 6, f); // 몸 6×6×10
  body.box(-4, 3, 8, 14, -7, -1, soft(scaleColor(coat, 0.93), 0.16)); // 갈기 8×7×7
  body.box(-2, 1, 11, 14, -8, -8, f); // 목 (머리와 갈기 사이 — 목줄이 여기 걸린다)
  const legs = fourLegs(2, 8, 3, -5, 4, f);
  const h = new Builder().box(-3, 2, 10, 15, -12, -9, f); // 머리 6×6×4
  h.box(-1, 1, 10, 12, -16, -13, soft(scaleColor(coat, 0.96), 0.06)); // 주둥이 3×3×4
  h.dot(-1, 12, -16, 0x1a1a1a).dot(0, 12, -16, 0x1a1a1a).dot(1, 12, -16, 0x1a1a1a); // 코
  h.dot(-3, 14, -12, 0xffffff).dot(-2, 14, -12, 0x1a1a1a).dot(1, 14, -12, 0x1a1a1a).dot(2, 14, -12, 0xffffff); // 눈
  h.box(-3, -2, 16, 17, -11, -11, f).box(1, 2, 16, 17, -11, -11, f); // 귀 2×2×1
  h.dot(-2, 16, -11, scaleColor(coat, 0.7)).dot(1, 16, -11, scaleColor(coat, 0.7)); // 귓속
  const tail = new Builder().box(-1, 0, 6, 13, 7, 8, f).dot(-1, 6, 7, scaleColor(coat, 0.85)).dot(0, 6, 8, scaleColor(coat, 0.85)); // 꼬리 2×8×2 — 몸 뒤(z 7) 위(y 14)에서 아래로 늘어진 기본, 축은 몸 뒤 위 모서리
  return { body: body.out, head: part(h, [0, 13, -9]), legs, tail: part(tail, [0, 14, 7]), wings: [], babyHead: 1.5 };
}

export function animalParts(kind: string, variant: number, opts: { sheared?: boolean } = {}): AnimalParts {
  switch (kind) {
    case 'cow':
      return cow(variant);
    case 'pig':
      return pig(variant);
    case 'sheep':
      return sheep(variant, opts.sheared === true);
    case 'chicken':
      return chicken(variant);
    case 'horse':
      return horse(variant);
    default:
      return dog(variant);
  }
}

// ---------------------------------------------------------------- 말 (#166)
function horse(variant: number): AnimalParts {
  // 갈색 · 검정 · 흰색 · 밤색 · 회색
  const coat = variant < 0.3 ? 0x6b4a2b : variant < 0.5 ? 0x2a2420 : variant < 0.65 ? 0xe8e4dc : variant < 0.85 ? 0x8a3f22 : 0x8d8d8d;
  const mane = variant < 0.5 ? 0x1c1612 : variant < 0.65 ? 0xcfcac0 : 0x2a1a10;
  const f: ColorFn = soft(coat, 0.1);
  const body = new Builder().box(-5, 4, 11, 20, -10, 11, f); // 몸 10×10×22
  body.box(-2, 1, 19, 28, -14, -9, f); // 목 (앞으로 올라간다)
  body.box(-1, 0, 25, 30, -14, -9, soft(mane, 0.12)); // 갈기
  const legs = fourLegs(4, 11, 5, -8, 7, f); // 다리 4×11
  const h = new Builder().box(-3, 2, 24, 31, -21, -13, f); // 머리 6×8×8
  h.box(-2, 1, 24, 27, -23, -21, soft(scaleColor(coat, 0.9), 0.06)); // 주둥이
  h.dot(-3, 29, -17, 0x1a1a1a).dot(2, 29, -17, 0x1a1a1a); // 눈 (양옆)
  h.box(-3, -2, 31, 33, -16, -15, f).box(1, 2, 31, 33, -16, -15, f); // 귀
  const tail = new Builder().box(-1, 0, 10, 19, 11, 12, soft(mane, 0.12)); // 꼬리
  return { body: body.out, head: part(h, [0, 27, -13]), legs, tail: part(tail, [0, 19, 11]), wings: [], babyHead: 1.4 };
}

/** 말 메시 하나 (탈것 표시용, #166): 모든 부위를 합쳐 한 덩어리로. 앞이 −z, 바닥 y 0 */
export function horseVoxels(variant: number): Voxel[] {
  const p = horse(variant);
  return [...p.body, ...p.head.v, ...p.legs.flatMap((l) => l.v), ...(p.tail ? p.tail.v : [])];
}

/** 길들인 강아지 목줄: 목(z −8) 둘레의 빨간 고리 + 금색 이름표 */
export function collarVoxels(): Voxel[] {
  const out: Voxel[] = [];
  for (let x = -3; x <= 2; x++) for (let y = 10; y <= 15; y++) if (x === -3 || x === 2 || y === 10 || y === 15) out.push({ x, y, z: -8, c: '#e53935' });
  out.push({ x: -1, y: 9, z: -8, c: '#ffd54f' }, { x: 0, y: 9, z: -8, c: '#ffd54f' }); // 이름표
  return out;
}
