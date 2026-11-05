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
  h = (h ^ (h >>> 13)) >>> 0; // 마지막 XOR 가 음수가 되던 버그(절반이 0 아래로 가서 첫 색만 나왔다) 고침 (#177)
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

// ---------------------------------------------------------------- 고릴라 (#253, 아들 참고 그림 2026-11-05)
/**
 * 흰 털에 하늘빛 얼룩, 푸른 얼굴·주둥이·귀, 빨간 눈, 흰 송곳니, 손발은 푸르고 끝에 흰 털이 삐죽.
 * 긴 앞팔로 몸을 받치고(어깨가 높고 엉덩이가 낮다) 머리는 가슴 앞에 낮게 내민다. 복셀로는 키 28·길이 35 — MobView 가 1.4배(키 약 2.2m, 사람 1.8m 보다 크다)로, 거대 고릴라는 2.8배로 그린다.
 * 다리 순서는 동물과 같다: 앞왼(팔)·앞오른(팔)·뒤왼·뒤오른.
 */
export function gorillaParts(): AnimalParts {
  const WHITE = 0xe9eef1,
    SPECK = 0xbfe4ee,
    BLUE = 0x5b85a6,
    DEEP = 0x3d6382,
    RED = 0x8e1c1c,
    MOUTH = 0x1d2832;
  const furC: ColorFn = (x, y, z) => fur(x, y, z, ((x * 7 + y * 13 + z * 5) >>> 0) % 9 === 0 ? SPECK : WHITE, 0.07);
  const blue: ColorFn = soft(BLUE, 0.1);
  /** 손발: 아래 rows 칸은 푸르고, 그 위 한 줄은 흰 털이 들쭉날쭉 내려온다 */
  const paw =
    (rows: number): ColorFn =>
    (x, y, z) => {
      if (y < rows - 1) return blue(x, y, z);
      if (y === rows - 1) return ((x + z) & 1) === 0 ? furC(x, y, z) : blue(x, y, z);
      return furC(x, y, z);
    };
  // 몸: 높은 가슴(어깨) + 낮은 엉덩이 — 비스듬히 이어진다. 앞뒤로 길게 (아빠 "앞뒤로 너무 짧다")
  const body = new Builder()
    .box(-8, 7, 15, 27, -9, 2, furC) // 가슴·어깨 16×13×12
    .box(-7, 6, 11, 22, 3, 16, furC) // 엉덩이 14×12×14
    .box(-6, 5, 22, 25, 3, 9, furC) // 등이 가슴에서 엉덩이로 비스듬히
    .box(-5, 4, 15, 17, -10, -9, furC); // 목 아래 가슴 털
  // 팔: 6×6×19, 어깨(y 19)에 축. 몸 바깥쪽에 붙는다
  const arm = (x0: number): Part => {
    const b = new Builder().box(x0, x0 + 5, 0, 18, -8, -3, paw(4));
    return part(b, [x0 + 3, 19, -5.5]);
  };
  // 뒷다리: 6×6×12, 엉덩이 뒤쪽
  const leg = (x0: number): Part => {
    const b = new Builder().box(x0, x0 + 5, 0, 11, 10, 15, paw(3));
    return part(b, [x0 + 3, 12, 12.5]);
  };
  const legs = [arm(-11), arm(6), leg(-7), leg(2)];
  // 머리 10×10×8: 흰 털 바탕, 얼굴은 푸르게, 눈썹 자리에 푸른 무늬, 빨간 눈과 흰자
  const h = new Builder().box(-5, 4, 16, 25, -15, -8, furC);
  h.box(-4, 3, 16, 23, -15, -15, blue); // 얼굴 판
  h.box(-5, 4, 24, 25, -15, -15, furC); // 이마 위는 흰 털
  h.dot(-3, 24, -15, DEEP).dot(-2, 23, -15, DEEP).dot(1, 23, -15, DEEP).dot(2, 24, -15, DEEP); // 눈썹 무늬
  h.dot(-4, 21, -15, 0xffffff).dot(-3, 21, -15, RED).dot(2, 21, -15, RED).dot(3, 21, -15, 0xffffff); // 눈
  h.box(-3, 2, 16, 19, -18, -16, soft(BLUE, 0.06)); // 주둥이 6×4×3
  h.box(-2, 1, 19, 19, -18, -18, soft(DEEP, 0.05)); // 콧등
  h.dot(-2, 18, -18, MOUTH).dot(1, 18, -18, MOUTH); // 콧구멍
  h.box(-3, 2, 16, 16, -18, -16, solid(MOUTH)); // 입
  h.box(-3, 2, 14, 15, -17, -15, soft(BLUE, 0.06)); // 아래턱
  h.box(-3, -3, 15, 16, -18, -18, solid(0xffffff)).box(2, 2, 15, 16, -18, -18, solid(0xffffff)); // 송곳니
  h.box(-6, -6, 20, 22, -12, -10, blue).box(5, 5, 20, 22, -12, -10, blue); // 둥근 귀
  return { body: body.out, head: part(h, [0, 20, -8]), legs, tail: null, wings: [], babyHead: 1 };
}

// ---------------------------------------------------------------- 워든 (#254, 아빠 참고 그림 2026-11-05 — 마인크래프트 워든)
/**
 * 키 50칸(약 2.8m): 다리 13 · 몸 21 · 머리 16. 검푸른 몸, 눈 없는 큰 머리, 머리 양옆 빛나는 하늘빛 뿔,
 * 가슴엔 빛나는 갈비뼈와 그 안의 영혼, 팔다리엔 누런 뼈 무늬. 팔은 길어 무릎까지 온다.
 * 다리 순서는 고릴라와 같다(앞왼 = 왼팔·앞오른 = 오른팔·뒤왼 = 왼다리·뒤오른 = 오른다리) — 같은 걸음·내리치기 움직임을 쓴다.
 */
export function wardenParts(): AnimalParts {
  const DARK = 0x0f2c33,
    DEEP = 0x0a1f25,
    GLOW = 0x3df0ff,
    TEAL = 0x1a9fb0,
    BONE = 0xc8b47c,
    MOUTH = 0x061114;
  const skin: ColorFn = (x, y, z) => fur(x, y, z, ((x * 5 + y * 11 + z * 3) >>> 0) % 13 === 0 ? DEEP : DARK, 0.1);
  /** 뼈 무늬: 이 칸이면 누렇게 */
  const bony =
    (test: (x: number, y: number, z: number) => boolean): ColorFn =>
    (x, y, z) =>
      test(x, y, z) ? fur(x, y, z, BONE, 0.08) : skin(x, y, z);
  // 몸 18×21×11 — 아래쪽 옆구리에 뼈 무늬, 앞에 갈비뼈 + 영혼
  const body = new Builder().box(-9, 8, 13, 33, -5, 5, bony((x, y, z) => y <= 17 && (x === -9 || x === 8 || z === 5) && ((x + y + z) & 3) !== 0));
  for (let y = 21; y <= 31; y += 2)
    for (let x = -6; x <= 5; x++) if (x !== -1 && x !== 0) body.dot(x, y, -5, TEAL); // 갈비뼈 줄 (가운데는 비었다)
  body.box(-2, 1, 23, 29, -5, -5, solid(GLOW)); // 가슴 속 영혼
  body.dot(-3, 26, -5, GLOW).dot(2, 26, -5, GLOW);
  // 팔 8×28×8: 어깨(y 32)에 축, 아래팔에 뼈 무늬, 손등에 빛 점
  const arm = (x0: number): Part => {
    const b = new Builder().box(x0, x0 + 7, 6, 33, -4, 3, bony((x, y, z) => y >= 9 && y <= 16 && (z === -4 || ((x + y) & 1) === 0)));
    b.dot(x0 + 3, 8, -4, GLOW).dot(x0 + 4, 8, -4, GLOW);
    return part(b, [x0 + 4, 32, -0.5]);
  };
  // 다리 6×13×6: 엉덩이(y 13)에 축, 정강이 앞에 뼈 무늬
  const leg = (x0: number): Part => {
    const b = new Builder().box(x0, x0 + 5, 0, 12, -3, 2, bony((_x, y, z) => y >= 3 && y <= 9 && z === -3));
    return part(b, [x0 + 3, 13, -0.5]);
  };
  const legs = [arm(-17), arm(9), leg(-7), leg(1)];
  // 머리 16×16×10: 눈은 없고, 입은 어두운 가로 틈, 볼에 빛 점. 양옆 위로 빛나는 뿔 (두 마디로 휘어 올라간다)
  const h = new Builder().box(-8, 7, 34, 49, -6, 3, skin);
  h.box(-5, 4, 37, 38, -6, -6, solid(MOUTH)); // 입
  h.box(-4, 3, 39, 39, -6, -6, soft(DEEP, 0.05)); // 윗입술 그늘
  h.dot(-7, 41, -6, GLOW).dot(-6, 42, -6, TEAL).dot(6, 41, -6, GLOW).dot(5, 42, -6, TEAL); // 볼의 빛
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -11 : 8; // 첫 마디: 머리 바로 옆
    h.box(x0, x0 + 2, 42, 47, -2, 0, (x, y) => (y >= 45 ? solid(GLOW)(x, y, 0) : solid(TEAL)(x, y, 0)));
    const x1 = side < 0 ? -13 : 11; // 둘째 마디: 바깥 위로
    h.box(x1, x1 + 1, 47, 52, -2, 0, solid(GLOW));
    h.dot(side < 0 ? -14 : 13, 52, -1, GLOW);
  }
  return { body: body.out, head: part(h, [0, 34, -1]), legs, tail: null, wings: [], babyHead: 1 };
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
    case 'boat':
      return boat();
    case 'minecart':
      return minecart();
    default:
      return dog(variant);
  }
}

// ---------------------------------------------------------------- 말 (#166)
/** 말 털색 다섯 가지 (아들 2026-10-17 "검정색 갈색 흰색 회색 얼룩말") — 번호로 결정론, 20% 씩 */
export const HORSE_COATS = ['black', 'brown', 'white', 'gray', 'zebra'] as const;
export type HorseCoat = (typeof HORSE_COATS)[number];
export function horseCoat(variant: number): HorseCoat {
  return HORSE_COATS[Math.min(4, Math.floor(variant * 5))]!;
}
function horse(variant: number): AnimalParts {
  const kind = horseCoat(variant);
  // 털·갈기(꼬리)·주둥이·발굽 — 마인크래프트 말처럼 갈기와 발굽은 몸보다 어둡고(흰말은 회색), 주둥이는 살짝 다르다
  const coat = { black: 0x25211e, brown: 0x6b4a2b, white: 0xeeebe4, gray: 0x8d8d8d, zebra: 0xf0efe9 }[kind];
  const mane = { black: 0x0f0d0c, brown: 0x2a1a10, white: 0xbdbab2, gray: 0x3a3a3a, zebra: 0x1a1a1a }[kind];
  const muzzle = { black: 0x3a3634, brown: 0x8a6a4a, white: 0xd6d3cc, gray: 0x6e6e6e, zebra: 0x2a2a2a }[kind];
  const hoof = kind === 'white' ? 0x7a7772 : 0x2a2622;
  const stripe = 0x1a1a1a;
  // 얼룩말: 몸·머리는 앞뒤(z) 로 두 칸씩 검은 줄, 다리는 위아래(y) 로 줄
  const f: ColorFn = kind === 'zebra' ? (x, y, z) => fur(x, y, z, Math.floor((z + 40 + (y >> 2)) / 2) % 2 === 0 ? stripe : coat, 0.05) : soft(coat, 0.1);
  const legF: ColorFn = (x, y, z) => (y === 0 ? hoof : kind === 'zebra' ? (Math.floor(y / 2) % 2 === 0 ? stripe : coat) : fur(x, y, z, coat, 0.1));
  const body = new Builder().box(-5, 4, 11, 20, -10, 11, f); // 몸 10×10×22
  body.box(-2, 1, 19, 28, -14, -9, f); // 목 (앞으로 올라간다)
  body.box(-1, 0, 25, 30, -14, -9, soft(mane, 0.12)); // 갈기
  const legs = fourLegs(4, 11, 5, -8, 7, legF); // 다리 4×11, 맨 아래 한 칸은 발굽
  const h = new Builder().box(-3, 2, 24, 31, -21, -13, f); // 머리 6×8×8
  h.box(-2, 1, 24, 27, -23, -21, soft(muzzle, 0.06)); // 주둥이
  h.dot(-3, 29, -17, 0x1a1a1a).dot(2, 29, -17, 0x1a1a1a); // 눈 (양옆)
  if (kind === 'black') h.dot(-3, 29, -17, 0x3a3a3a).dot(2, 29, -17, 0x3a3a3a); // 검은 말은 눈이 묻히니 살짝 밝게
  h.box(-3, -2, 31, 33, -16, -15, f).box(1, 2, 31, 33, -16, -15, f); // 귀
  const tail = new Builder().box(-1, 0, 10, 19, 11, 12, soft(mane, 0.12)); // 꼬리
  return { body: body.out, head: part(h, [0, 27, -13]), legs, tail: part(tail, [0, 19, 11]), wings: [], babyHead: 1.4 };
}

/** 말 메시 하나 (탈것 표시용, #166): 모든 부위를 합쳐 한 덩어리로. 앞이 −z, 바닥 y 0 */
export function horseVoxels(variant: number): Voxel[] {
  return animalVoxels('horse', variant);
}

/** 동물 한 마리를 한 덩어리 복셀로 (탈것 표시용 #166·#185) */
export function animalVoxels(kind: string, variant: number): Voxel[] {
  const p = animalParts(kind, variant);
  return [...p.body, ...p.head.v, ...p.legs.flatMap((l) => l.v), ...(p.tail ? p.tail.v : []), ...p.wings.flatMap((w) => w.v)];
}

/** 길들인 강아지 목줄: 목(z −8) 둘레의 빨간 고리 + 금색 이름표 */
export function collarVoxels(): Voxel[] {
  const out: Voxel[] = [];
  for (let x = -3; x <= 2; x++) for (let y = 10; y <= 15; y++) if (x === -3 || x === 2 || y === 10 || y === 15) out.push({ x, y, z: -8, c: '#e53935' });
  out.push({ x: -1, y: 9, z: -8, c: '#ffd54f' }, { x: 0, y: 9, z: -8, c: '#ffd54f' }); // 이름표
  return out;
}

// ---------------------------------------------------------------- 수레 (#237)
/** 마인크래프트 광산 수레: 쇠 상자(바닥 + 네 벽, 위는 뚫림) + 바퀴 넷. 한 칸 크기, 앞이 −z */
function minecart(): AnimalParts {
  const iron = solid(0x6e6e74),
    dark = solid(0x3c3c40),
    light = solid(0x9a9aa2),
    wheel = solid(0x222224);
  const b = new Builder();
  b.box(-7, 6, 2, 2, -8, 7, iron); // 바닥 14×1×16
  b.box(-7, -7, 3, 8, -8, 7, iron).box(6, 6, 3, 8, -8, 7, iron); // 긴 벽
  b.box(-7, 6, 3, 8, -8, -8, iron).box(-7, 6, 3, 8, 7, 7, iron); // 앞뒤 벽
  b.box(-7, 6, 8, 8, -8, 7, light).box(-6, 5, 8, 8, -7, 6, dark); // 위 테두리 밝게, 안쪽 어둡게
  b.box(-7, -7, 2, 8, -8, -8, dark).box(6, 6, 2, 8, -8, -8, dark).box(-7, -7, 2, 8, 7, 7, dark).box(6, 6, 2, 8, 7, 7, dark); // 모서리 기둥
  for (const z of [-5, 4]) b.box(-7, -6, 0, 1, z, z + 1, wheel).box(5, 6, 0, 1, z, z + 1, wheel); // 바퀴
  return { body: b.out, head: part(new Builder(), [0, 0, 0]), legs: [], tail: null, wings: [], babyHead: 1 };
}

// ---------------------------------------------------------------- 보트 (#209)
/** 마인크래프트 참나무 보트: 바닥 판 + 낮은 옆판, 앞뒤가 조금 좁다. 앞이 −z. 노는 탄 사람 팔 대신 생략 */
function boat(): AnimalParts {
  const plank = solid(0xb8945f),
    dark = solid(0x8f6f3f),
    light = solid(0xd1ad73);
  const b = new Builder();
  b.box(-6, 5, 0, 1, -12, 11, dark); // 바닥 12×2×24
  b.box(-7, -6, 1, 5, -10, 9, plank).box(6, 7, 1, 5, -10, 9, plank); // 옆판
  b.box(-5, 4, 1, 5, -13, -12, light).box(-5, 4, 1, 5, 12, 13, light); // 뱃머리·고물
  b.box(-6, -5, 1, 4, -12, -11, plank).box(5, 6, 1, 4, -12, -11, plank).box(-6, -5, 1, 4, 11, 12, plank).box(5, 6, 1, 4, 11, 12, plank); // 모서리
  b.box(-6, 5, 1, 2, -4, -3, light).box(-6, 5, 1, 2, 4, 5, light); // 가로 좌석 판 둘
  return { body: b.out, head: part(new Builder(), [0, 0, 0]), legs: [], tail: null, wings: [], babyHead: 1 };
}

// ---------------------------------------------------------------- 원정 사냥 동물 (2026-11-05, Alex's Mobs 참고 1차)
/**
 * 가젤·라쿤·길달리기새·꼬리감는원숭이·방울뱀·들소·말코손바닥사슴·회색곰. 마을 동물과 같은 좌표 규칙(앞 −z, 바닥 y 0, 1 복셀 = 1.8/32 m).
 * 키는 MOB_SIZES 와 맞춘다. 머리·다리·꼬리·날개는 축이 있는 부위라 MobView 가 걷기·들이받기·꼬리 흔들기를 한다.
 */
export const WILD_MODEL_KINDS = ['gazelle', 'raccoon', 'roadrunner', 'capuchin', 'rattlesnake', 'bison', 'moose', 'grizzly'] as const;

function gazelle(): AnimalParts {
  const tan = 0xc49a5c,
    belly = 0xf0e6d2,
    stripe = 0x5a3a22;
  const hide: ColorFn = (x, y, z) => (y <= 13 ? fur(x, y, z, belly, 0.05) : y === 15 ? fur(x, y, z, stripe, 0.08) : fur(x, y, z, tan, 0.1));
  const body = new Builder().box(-4, 3, 12, 18, -7, 6, hide); // 몸 8×7×14, 옆구리 짙은 줄
  const legs = fourLegs(2, 12, 4, -6, 4, (x, y, z) => (y <= 1 ? 0x2a2018 : fur(x, y, z, 0xb08850, 0.08)));
  const h = new Builder().box(-2, 1, 17, 21, -9, -7, hide); // 목
  h.box(-2, 1, 20, 24, -13, -8, soft(tan, 0.08)); // 머리
  h.box(-1, 0, 20, 23, -13, -13, soft(belly, 0.04)); // 얼굴 흰 줄
  h.dot(-1, 20, -13, 0x2a2018).dot(0, 20, -13, 0x2a2018); // 코
  h.dot(-2, 23, -12, 0x1a1a1a).dot(1, 23, -12, 0x1a1a1a); // 눈
  h.box(-3, -3, 23, 24, -9, -9, soft(tan, 0.08)).box(2, 2, 23, 24, -9, -9, soft(tan, 0.08)); // 귀
  const horn = solid(0x3a2a1a);
  h.box(-2, -2, 25, 28, -10, -10, horn).box(-2, -2, 28, 29, -9, -8, horn).box(1, 1, 25, 28, -10, -10, horn).box(1, 1, 28, 29, -9, -8, horn); // 뒤로 휜 긴 뿔
  const tail = new Builder().box(-1, 0, 15, 17, 7, 7, soft(stripe, 0.06));
  return { body: body.out, head: part(h, [0, 19, -7]), legs, tail: part(tail, [0, 18, 7]), wings: [], babyHead: 1.4 };
}

function raccoon(): AnimalParts {
  const gray = 0x7d7d7d,
    dark = 0x2a2a2a;
  const body = new Builder().box(-3, 2, 4, 9, -5, 4, soft(gray, 0.14));
  const legs = fourLegs(2, 4, 3, -4, 2, soft(0x3a3a3a, 0.08));
  const h = new Builder().box(-3, 2, 6, 11, -10, -6, soft(gray, 0.1));
  h.box(-3, 2, 8, 9, -10, -10, solid(dark)); // 검은 가면
  h.dot(-2, 9, -10, 0xffffff).dot(1, 9, -10, 0xffffff).dot(-2, 8, -10, 0x101010).dot(1, 8, -10, 0x101010); // 눈 (가면 속)
  h.box(-3, 2, 10, 10, -10, -10, soft(0xe8e8e8, 0.04)); // 흰 눈썹
  h.box(-1, 0, 6, 7, -11, -11, soft(0xe8e8e8, 0.04)).dot(-1, 7, -12, 0x101010).dot(0, 7, -12, 0x101010); // 흰 주둥이 + 코
  h.box(-3, -2, 12, 12, -8, -8, soft(gray, 0.1)).box(1, 2, 12, 12, -8, -8, soft(gray, 0.1)); // 귀
  const tail = new Builder().box(-1, 0, 5, 7, 5, 12, (x, y, z) => (z % 2 === 0 ? fur(x, y, z, dark, 0.06) : fur(x, y, z, 0xa0a0a0, 0.06))); // 줄무늬 꼬리
  return { body: body.out, head: part(h, [0, 8, -5]), legs, tail: part(tail, [0, 7, 5]), wings: [], babyHead: 1.4 };
}

function roadrunner(): AnimalParts {
  const streak: ColorFn = (x, y, z) => (((x * 5 + y * 7 + z * 3) >>> 0) % 5 === 0 ? 0xe8e0d0 : fur(x, y, z, 0x6b5a45, 0.16)); // 갈색에 흰 점무늬
  const body = new Builder().box(-2, 1, 6, 10, -4, 3, streak);
  body.box(-2, 1, 6, 7, -4, -1, soft(0xe0d8c8, 0.05)); // 흰 가슴
  const legC = solid(0x7a8a9a); // 푸르스름한 다리
  const legs = [-2, 1].map((lx) => part(new Builder().box(lx, lx, 0, 5, 0, 0, legC).box(lx - 1, lx + 1, 0, 0, -2, 1, legC), [lx + 0.5, 6, 0.5]));
  const h = new Builder().box(-2, 1, 10, 14, -7, -4, streak);
  h.box(-1, 0, 15, 17, -5, -2, soft(0x2a2018, 0.08)); // 볏
  h.box(-1, 0, 11, 11, -11, -8, solid(0x3a3a3a)); // 긴 부리
  h.dot(-2, 13, -7, 0xffffff).dot(1, 13, -7, 0xffffff).dot(-2, 12, -6, 0x3a7ad0).dot(1, 12, -6, 0xe07a30); // 눈과 파랑·주황 맨살
  const tail = new Builder().box(-1, 0, 8, 10, 4, 12, soft(0x3a2e22, 0.1)); // 길고 곧은 꼬리
  const wings = [-3, 2].map((wx) => part(new Builder().box(wx, wx, 7, 9, -2, 2, streak), [wx + 0.5, 9, 0]));
  return { body: body.out, head: part(h, [0, 10, -4]), legs, tail: part(tail, [0, 10, 4]), wings, babyHead: 1.3 };
}

function capuchin(): AnimalParts {
  const brown = 0x5a3d28,
    cream = 0xe8d0b0;
  const body = new Builder().box(-2, 1, 6, 11, -3, 2, soft(brown, 0.12));
  body.box(-2, 1, 7, 10, -3, -3, soft(cream, 0.06)); // 가슴
  const legs = fourLegs(2, 6, 3, -3, 1, soft(0x3a2818, 0.08));
  const h = new Builder().box(-3, 2, 11, 16, -6, -2, soft(brown, 0.1));
  h.box(-2, 1, 11, 14, -6, -6, soft(cream, 0.05)); // 얼굴
  h.box(-3, 2, 16, 16, -6, -2, solid(0x2a1a10)); // 검은 정수리 털
  h.dot(-1, 13, -7, 0x1a1a1a).dot(0, 13, -7, 0x1a1a1a); // 눈
  h.dot(-1, 11, -7, 0x8a5a48).dot(0, 11, -7, 0x8a5a48); // 입
  h.box(-4, -4, 13, 14, -4, -4, soft(cream, 0.05)).box(3, 3, 13, 14, -4, -4, soft(cream, 0.05)); // 귀
  const tail = new Builder().box(-1, -1, 8, 8, 3, 9, soft(brown, 0.1)).box(-1, -1, 9, 13, 9, 9, soft(brown, 0.1)).box(-1, -1, 13, 13, 7, 8, soft(brown, 0.1)); // 말아 올린 긴 꼬리
  return { body: body.out, head: part(h, [0, 12, -2]), legs, tail: part(tail, [-0.5, 9, 3]), wings: [], babyHead: 1.3 };
}

function rattlesnake(): AnimalParts {
  const skin: ColorFn = (x, y, z) => (((z + 40) % 5 === 0 || (z + 40) % 5 === 1) && y === 2 ? fur(x, y, z, 0x6a4a2a, 0.08) : fur(x, y, z, 0xb89a6a, 0.1)); // 등 마름모 무늬
  const body = new Builder();
  for (let z = -10; z <= 12; z++) {
    const x0 = Math.round(Math.sin(z * 0.35) * 2);
    body.box(x0 - 1, x0, 0, 2, z, z, skin); // S 자로 구불구불
  }
  const h = new Builder().box(-2, 1, 0, 3, -14, -11, skin);
  h.dot(-2, 2, -13, 0xd8c040).dot(1, 2, -13, 0xd8c040); // 노란 눈
  h.dot(-1, 1, -15, 0xd03030).dot(0, 1, -16, 0xd03030); // 혀
  const tx = Math.round(Math.sin(13 * 0.35) * 2);
  const tail = new Builder().box(tx - 1, tx, 1, 3, 13, 16, (_x, _y, z) => (z % 2 === 0 ? 0xd8c8a0 : 0x8a7a5a)); // 방울
  return { body: body.out, head: part(h, [0, 1, -11]), legs: [], tail: part(tail, [tx - 0.5, 2, 13]), wings: [], babyHead: 1 };
}

function bison(): AnimalParts {
  const shag: ColorFn = (x, y, z) => fur(x, y, z, ((x * 3 + y * 5 + z * 7) >>> 0) % 7 < 2 ? 0x6a4a30 : 0x3a2418, 0.2);
  const coat = soft(0x5e4030, 0.14);
  const body = new Builder().box(-7, 6, 14, 30, -10, 1, shag); // 털북숭이 앞몸·혹
  body.box(-6, 5, 14, 25, 2, 12, coat); // 뒷몸
  const legs = fourLegs(4, 14, 6, -8, 8, soft(0x2e2016, 0.1), { rows: 4, color: shag });
  const h = new Builder().box(-4, 3, 13, 23, -16, -11, shag); // 낮게 내민 머리
  h.box(-2, 1, 10, 13, -15, -12, solid(0x2a1a10)); // 턱수염
  h.dot(-2, 15, -17, 0x1a1a1a).dot(1, 15, -17, 0x1a1a1a); // 코
  h.box(-4, 3, 13, 16, -17, -17, soft(0x3a2a20, 0.06));
  h.dot(-4, 20, -17, 0x1a1a1a).dot(3, 20, -17, 0x1a1a1a); // 눈
  const horn = solid(0xd8d0c0);
  h.box(-6, -5, 20, 21, -13, -12, horn).box(-6, -6, 22, 23, -13, -13, horn).box(4, 5, 20, 21, -13, -12, horn).box(5, 5, 22, 23, -13, -13, horn); // 짧게 위로 휜 뿔
  const tail = new Builder().box(-1, 0, 16, 22, 13, 13, coat).box(-1, 0, 14, 15, 13, 13, solid(0x2a1a10));
  return { body: body.out, head: part(h, [0, 20, -11]), legs, tail: part(tail, [0, 23, 13]), wings: [], babyHead: 1.4 };
}

function moose(): AnimalParts {
  const coat = soft(0x4a3424, 0.14);
  const body = new Builder().box(-5, 4, 18, 29, -9, 8, coat);
  body.box(-4, 3, 30, 31, -9, -3, coat); // 어깨 혹
  const legs = fourLegs(3, 18, 5, -7, 5, (x, y, z) => (y <= 8 ? fur(x, y, z, 0x9a8a78, 0.08) : fur(x, y, z, 0x3a2a1e, 0.1))); // 긴 다리, 아래는 밝게
  const h = new Builder().box(-2, 1, 24, 30, -12, -9, coat); // 목
  h.box(-3, 2, 27, 32, -19, -11, coat); // 긴 머리
  h.box(-3, 2, 25, 28, -20, -16, soft(0x5a4434, 0.1)); // 늘어진 주둥이
  h.dot(-2, 26, -21, 0x1a1a1a).dot(1, 26, -21, 0x1a1a1a); // 콧구멍
  h.dot(-3, 31, -15, 0x1a1a1a).dot(2, 31, -15, 0x1a1a1a); // 눈
  h.box(-1, 0, 22, 25, -14, -13, coat); // 턱 밑 수염
  const antler = soft(0xc8b08a, 0.08);
  h.box(-4, -3, 33, 33, -12, -11, antler).box(2, 3, 33, 33, -12, -11, antler); // 뿔 밑동
  h.box(-11, -4, 34, 35, -13, -9, antler).box(3, 10, 34, 35, -13, -9, antler); // 넓적한 손바닥 뿔
  for (const x of [-11, -9, -7, 6, 8, 10]) h.dot(x, 36, -11, 0xc8b08a); // 뿔 끝 가지
  const tail = new Builder().box(-1, 0, 26, 28, 9, 9, coat);
  return { body: body.out, head: part(h, [0, 28, -11]), legs, tail: part(tail, [0, 29, 9]), wings: [], babyHead: 1.4 };
}

function grizzly(): AnimalParts {
  const coat = soft(0x6b4a2e, 0.18);
  const body = new Builder().box(-7, 6, 9, 22, -10, 10, coat);
  body.box(-6, 5, 23, 24, -9, -3, coat); // 어깨 혹
  const legs = fourLegs(4, 9, 7, -9, 6, soft(0x4f3520, 0.12));
  const h = new Builder().box(-5, 4, 13, 21, -18, -10, coat);
  h.box(-2, 1, 13, 16, -21, -19, soft(0x9a7a5a, 0.08)); // 주둥이
  h.dot(-1, 16, -22, 0x1a1a1a).dot(0, 16, -22, 0x1a1a1a); // 코
  h.dot(-3, 19, -19, 0x1a1a1a).dot(2, 19, -19, 0x1a1a1a); // 눈
  h.box(-5, -3, 22, 23, -13, -12, coat).box(2, 4, 22, 23, -13, -12, coat); // 둥근 귀
  const tail = new Builder().box(-1, 0, 18, 19, 11, 11, coat);
  return { body: body.out, head: part(h, [0, 17, -10]), legs, tail: part(tail, [0, 19, 11]), wings: [], babyHead: 1.4 };
}

/** 원정 사냥 동물 부위 (모르는 종류면 null) */
export function wildParts(kind: string): AnimalParts | null {
  switch (kind) {
    case 'gazelle':
      return gazelle();
    case 'raccoon':
      return raccoon();
    case 'roadrunner':
      return roadrunner();
    case 'capuchin':
      return capuchin();
    case 'rattlesnake':
      return rattlesnake();
    case 'bison':
      return bison();
    case 'moose':
      return moose();
    case 'grizzly':
      return grizzly();
    default:
      return null;
  }
}
