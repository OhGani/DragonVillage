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
