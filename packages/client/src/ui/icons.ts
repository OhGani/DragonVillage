/** 핫바용 등각 블록 아이콘 — 윗면 + 왼쪽(어둡게) + 오른쪽(더 어둡게) */
const texCache = new WeakMap<ImageData, HTMLCanvasElement>();

function texCanvas(img: ImageData): HTMLCanvasElement {
  let c = texCache.get(img);
  if (!c) {
    c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d')!.putImageData(img, 0, 0);
    texCache.set(img, c);
  }
  return c;
}

/**
 * 계단 아이콘 (#291): 등각 계단 — 왼쪽 뒤가 높고 오른쪽 앞이 낮다 (마인크래프트 가방의 계단처럼).
 * 점 (X 오른쪽 아래, Z 왼쪽 아래, Y 위; 0~16) → 화면 (16 + X − Z, (X + Z)/2 + 16 − Y) × k
 */
export function renderStairIcon(top: ImageData, side: ImageData, size = 40): HTMLCanvasElement {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.round(size * dpr);
  canvas.style.width = canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const k = (size * dpr) / 32;
  const T = texCanvas(top),
    S = texCanvas(side);
  /** 지금 변환에서 그림의 (sx, sy, w, h) 조각을 제자리에 그리고 alpha 만큼 어둡게 */
  const part = (img: HTMLCanvasElement, sx: number, sy: number, w: number, h: number, alpha: number) => {
    ctx.drawImage(img, sx, sy, w, h, sx, sy, w, h);
    if (alpha <= 0) return;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(sx, sy, w, h);
    ctx.globalCompositeOperation = 'source-over';
  };
  /** 높이 Y 의 윗면: 그림 (u, v) = (X, Z) */
  const topAt = (Y: number) => ctx.setTransform(k, 0.5 * k, -k, 0.5 * k, 16 * k, (16 - Y) * k);
  /** X = c 평면의 오른쪽 면: 그림 (u, v) = (16 − Z, 16 − Y) */
  const rightAt = (c: number) => ctx.setTransform(k, -0.5 * k, 0, k, c * k, (0.5 * c + 8) * k);
  // 아래 디딤판 (Y 8, X 8~16) → 위 디딤판 (Y 16, X 0~8)
  topAt(8);
  part(T, 8, 0, 8, 16, 0);
  topAt(16);
  part(T, 0, 0, 8, 16, 0);
  // 챌판 (X 8, Y 8~16) 과 아래 단의 앞면 (X 16, Y 0~8)
  rightAt(8);
  part(S, 0, 0, 16, 8, 0.42);
  rightAt(16);
  part(S, 0, 8, 16, 8, 0.42);
  // 왼쪽 면 (Z 16): ㄴ자 — 아래 단 전부 + 위 단의 뒤쪽 반
  ctx.setTransform(k, 0.5 * k, 0, k, 0, 8 * k);
  part(S, 0, 8, 16, 8, 0.22);
  part(S, 0, 0, 8, 8, 0.22);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}

/**
 * 상자들로 된 모양의 아이콘 (#295 울타리·울타리문): 16분의 1 단위 상자를 등각으로, 먼 것부터 그린다.
 * 점 (X, Y, Z) → 화면 (16 + X − Z, (X + Z)/2 + 16 − Y) × k. 상자마다 윗면·왼쪽(+Z)·오른쪽(+X) 면
 */
export function renderBoxesIcon(boxes: readonly (readonly number[])[], top: ImageData, side: ImageData, size = 40): HTMLCanvasElement {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.round(size * dpr);
  canvas.style.width = canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const k = (size * dpr) / 32;
  const T = texCanvas(top),
    S = texCanvas(side);
  const part = (img: HTMLCanvasElement, sx: number, sy: number, w: number, h: number, alpha: number) => {
    ctx.drawImage(img, sx, sy, w, h, sx, sy, w, h);
    if (alpha <= 0) return;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(sx, sy, w, h);
  };
  const sorted = [...boxes].sort((a, b) => a[0]! + a[1]! + a[2]! + a[3]! + a[4]! + a[5]! - (b[0]! + b[1]! + b[2]! + b[3]! + b[4]! + b[5]!));
  for (const [x0, y0, z0, x1, y1, z1] of sorted as [number, number, number, number, number, number][]) {
    // 윗면: 그림 (u, v) = (X, Z)
    ctx.setTransform(k, 0.5 * k, -k, 0.5 * k, 16 * k, (16 - y1) * k);
    part(T, x0, z0, x1 - x0, z1 - z0, 0);
    // 왼쪽 면 (Z = z1): (u, v) = (X, 16 − Y)
    ctx.setTransform(k, 0.5 * k, 0, k, (16 - z1) * k, 0.5 * z1 * k);
    part(S, x0, 16 - y1, x1 - x0, y1 - y0, 0.22);
    // 오른쪽 면 (X = x1): (u, v) = (16 − Z, 16 − Y)
    ctx.setTransform(k, -0.5 * k, 0, k, x1 * k, (0.5 * x1 + 8) * k);
    part(S, 16 - z1, 16 - y1, z1 - z0, y1 - y0, 0.42);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}

/** 반 블록 아이콘 (#292): 등각 블록의 아래 반 — 윗면은 반 칸 높이에 */
export function renderSlabIcon(top: ImageData, side: ImageData, size = 40): HTMLCanvasElement {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.round(size * dpr);
  canvas.style.width = canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const k = (size * dpr) / 32;
  const T = texCanvas(top),
    S = texCanvas(side);
  const shadeLower = (alpha: number) => {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 8, 16, 8);
    ctx.globalCompositeOperation = 'source-over';
  };
  // 윗면 (반 칸 높이 = 화면에서 8칸 아래)
  ctx.setTransform(k, 0.5 * k, -k, 0.5 * k, 16 * k, 8 * k);
  ctx.drawImage(T, 0, 0, 16, 16);
  // 왼쪽·오른쪽 면의 아래 반
  ctx.setTransform(k, 0.5 * k, 0, k, 0, 8 * k);
  ctx.drawImage(S, 0, 8, 16, 8, 0, 8, 16, 8);
  shadeLower(0.22);
  ctx.setTransform(k, -0.5 * k, 0, k, 16 * k, 16 * k);
  ctx.drawImage(S, 0, 8, 16, 8, 0, 8, 16, 8);
  shadeLower(0.42);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}

export function renderBlockIcon(top: ImageData, side: ImageData, size = 40): HTMLCanvasElement {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.round(size * dpr);
  canvas.style.width = canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const k = (size * dpr) / 32; // 텍스처 1픽셀 → k 픽셀 (전체 32k × 32k)
  const T = texCanvas(top),
    S = texCanvas(side);

  const shade = (alpha: number) => {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 0, 16, 16);
    ctx.globalCompositeOperation = 'source-over';
  };

  // 윗면 (마름모)
  ctx.setTransform(k, 0.5 * k, -k, 0.5 * k, 16 * k, 0);
  ctx.drawImage(T, 0, 0, 16, 16);
  // 왼쪽 면
  ctx.setTransform(k, 0.5 * k, 0, k, 0, 8 * k);
  ctx.drawImage(S, 0, 0, 16, 16);
  shade(0.22);
  // 오른쪽 면
  ctx.setTransform(k, -0.5 * k, 0, k, 16 * k, 16 * k);
  ctx.drawImage(S, 0, 0, 16, 16);
  shade(0.42);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}
