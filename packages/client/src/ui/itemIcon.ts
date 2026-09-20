import type { BlockRegistry } from '@dragon-village/shared';
import { DRAGONS } from '@dragon-village/shared/data';
import { dragonOfEgg } from '@dragon-village/shared';
import { renderBlockIcon } from './icons';

export interface IconSource {
  images: Map<string, ImageData>;
}

const cache = new Map<string, HTMLCanvasElement>();

/** 아이템 이름에서 안정된 색 (모양이 없는 아이템의 칩 색) */
function hue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** 재료 색 (도구·주괴) */
const MATERIAL_COLOR: Record<string, string> = {
  wooden: '#a0703a',
  stone: '#8a8a8a',
  iron: '#d8d8d8',
  golden: '#f2c94c',
  gold: '#f2c94c',
  diamond: '#5fd8e8',
  netherite: '#4a3f4a',
};

function materialOf(id: string): string {
  for (const k of Object.keys(MATERIAL_COLOR)) if (id.startsWith(k + '_') || id === k) return MATERIAL_COLOR[k];
  return '#b0b0b0';
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  // roundRect 가 없는 브라우저도 있어서 직접 그린다
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** 블록 아닌 아이템을 종류별로 그린다 (아들이 그림을 그려 주면 텍스처로 바꾼다). s = 한 변 */
function drawItem(ctx: CanvasRenderingContext2D, id: string, name: string, s: number): void {
  const u = s / 16; // 16칸 격자
  ctx.lineWidth = Math.max(1, u * 0.8);
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  const potion = id === 'water_bottle' || id === 'glass_bottle' || id.startsWith('potion.') || id.startsWith('splash_potion.') || id.startsWith('lingering_potion.');
  const isTool = /_(pickaxe|axe|sword|shovel|hoe)$/.test(id);
  const isBucket = id === 'bucket' || id.endsWith('_bucket');
  const isDust = id.endsWith('_dust') || id === 'redstone' || id === 'sugar' || id === 'gunpowder' || id === 'glowstone_dust';
  const isIngot = id.endsWith('_ingot') || id === 'netherite' || id === 'gold_nugget';
  const isStick = id === 'stick' || id === 'blaze_rod' || id === 'breeze_rod' || id === 'bone';
  const isString = id === 'string';

  const egg = dragonOfEgg(id);
  if (egg) {
    // 드래곤 알: 드래곤 색 타원 + 점, 아래 어둡게
    const color = DRAGONS.find(egg)?.color ?? '#9a9a9a';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(8 * u, 9 * u, 4.6 * u, 6 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(8 * u, 12 * u, 4 * u, 2.6 * u, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (const [x, y] of [
      [6.2, 6.5],
      [9.5, 8],
      [7, 10.5],
    ]) ctx.fillRect(x * u, y * u, u, u);
    return;
  }
  if (potion) {
    // 병: 코르크 + 목 + 둥근 몸, 안에 액체
    const liquid = id === 'glass_bottle' ? null : id === 'water_bottle' ? '#3d7be6' : id.includes('healing') ? '#e64a4a' : id.includes('speed') ? '#7fd3ff' : id.includes('awkward') ? '#6b6ba8' : '#a24ae6';
    ctx.fillStyle = 'rgba(200,225,255,0.55)';
    rrect(ctx, 4 * u, 6 * u, 8 * u, 9 * u, 3 * u);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(6.5 * u, 2 * u, 3 * u, 4.5 * u);
    ctx.strokeRect(6.5 * u, 2 * u, 3 * u, 4.5 * u);
    ctx.fillStyle = '#b07a3a';
    ctx.fillRect(6 * u, 1 * u, 4 * u, 1.6 * u);
    if (liquid) {
      ctx.fillStyle = liquid;
      rrect(ctx, 5 * u, 9 * u, 6 * u, 5 * u, 2.4 * u);
      ctx.fill();
    }
    return;
  }
  if (isBucket) {
    // 마인크래프트 양동이 픽셀 그림(아빠가 보낸 그림, 2026-09-19): 어두운 테두리, 위 손잡이, 왼쪽 밝은 면, 안에 액체
    const liquid = id === 'water_bucket' ? ['#2f5fd6', '#4d86ff'] : id === 'lava_bucket' ? ['#e0561a', '#ffa030'] : id === 'milk_bucket' ? ['#e8e8e8', '#ffffff'] : null;
    const px = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * u, y * u, w * u, h * u);
    };
    const EDGE = '#2a2a2a';
    const DARK = '#5c5c5c';
    const MID = '#9a9a9a';
    const LIGHT = '#d9d9d9';
    // 손잡이
    px(6, 1, 4, 1, EDGE);
    px(5, 2, 1, 1, EDGE);
    px(10, 2, 1, 1, EDGE);
    px(4, 3, 1, 1, EDGE);
    px(11, 3, 1, 1, EDGE);
    // 테 (윗면 타원)
    px(3, 4, 10, 1, EDGE);
    px(2, 5, 12, 1, EDGE);
    px(3, 5, 10, 1, liquid ? liquid[0] : DARK);
    px(4, 5, 4, 1, liquid ? liquid[1] : MID);
    // 몸통: 위가 넓고 아래로 좁아진다
    px(2, 6, 12, 4, EDGE);
    px(3, 6, 10, 4, MID);
    px(3, 6, 2, 4, LIGHT);
    px(11, 6, 1, 4, DARK);
    px(3, 10, 10, 3, EDGE);
    px(4, 10, 8, 3, MID);
    px(4, 10, 2, 3, LIGHT);
    px(10, 10, 1, 3, DARK);
    px(4, 13, 8, 1, EDGE);
    px(5, 13, 6, 1, DARK);
    px(5, 14, 6, 1, EDGE);
    return;
  }
  if (isTool) {
    const head = materialOf(id);
    // 손잡이 (대각선)
    ctx.strokeStyle = '#8a5a2b';
    ctx.lineWidth = 2 * u;
    ctx.beginPath();
    ctx.moveTo(3 * u, 13 * u);
    ctx.lineTo(10.5 * u, 5.5 * u);
    ctx.stroke();
    ctx.fillStyle = head;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = Math.max(1, u * 0.8);
    if (id.endsWith('pickaxe')) {
      ctx.beginPath();
      ctx.moveTo(6 * u, 2.5 * u);
      ctx.quadraticCurveTo(11 * u, 1.5 * u, 14 * u, 6 * u);
      ctx.lineTo(12 * u, 7.5 * u);
      ctx.quadraticCurveTo(10.5 * u, 4.5 * u, 7 * u, 4.5 * u);
      ctx.closePath();
    } else if (id.endsWith('axe')) {
      ctx.beginPath();
      ctx.moveTo(9 * u, 2 * u);
      ctx.lineTo(14 * u, 4 * u);
      ctx.lineTo(13 * u, 8 * u);
      ctx.lineTo(9.5 * u, 6.5 * u);
      ctx.closePath();
    } else if (id.endsWith('sword')) {
      ctx.beginPath();
      ctx.moveTo(9 * u, 7 * u);
      ctx.lineTo(13.5 * u, 2.5 * u);
      ctx.lineTo(15 * u, 4 * u);
      ctx.lineTo(10.5 * u, 8.5 * u);
      ctx.closePath();
    } else if (id.endsWith('shovel')) {
      rrect(ctx, 9.5 * u, 1.5 * u, 5 * u, 6 * u, 2 * u);
    } else {
      // hoe
      ctx.beginPath();
      ctx.moveTo(9 * u, 3 * u);
      ctx.lineTo(14.5 * u, 3 * u);
      ctx.lineTo(14.5 * u, 5.5 * u);
      ctx.lineTo(11 * u, 5.5 * u);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (isDust) {
    const c = id === 'glowstone_dust' ? '#ffd75e' : id === 'redstone' ? '#e03030' : id === 'sugar' ? '#f4f4f4' : id === 'gunpowder' ? '#666' : '#c8c8c8';
    ctx.fillStyle = c;
    const dots: [number, number, number][] = [
      [8, 11, 4.5],
      [5, 12.5, 3],
      [11.5, 12.5, 3],
      [7, 8, 2],
      [10.5, 8.5, 1.6],
      [8.5, 5.5, 1.2],
    ];
    for (const [x, y, r] of dots) {
      ctx.beginPath();
      ctx.arc(x * u, y * u, r * u, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (isIngot) {
    ctx.fillStyle = materialOf(id.replace('_ingot', '').replace('gold_nugget', 'gold'));
    ctx.beginPath();
    ctx.moveTo(2 * u, 11 * u);
    ctx.lineTo(5 * u, 6 * u);
    ctx.lineTo(14 * u, 6 * u);
    ctx.lineTo(11 * u, 11 * u);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(2 * u, 11 * u, 9 * u, 2 * u);
    return;
  }
  if (isStick) {
    ctx.strokeStyle = id === 'blaze_rod' ? '#ffb02e' : id === 'bone' ? '#eee' : id === 'breeze_rod' ? '#9fd7ff' : '#8a5a2b';
    ctx.lineWidth = 2.2 * u;
    ctx.beginPath();
    ctx.moveTo(4 * u, 12.5 * u);
    ctx.lineTo(12 * u, 3.5 * u);
    ctx.stroke();
    return;
  }
  if (isString) {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1.4 * u;
    ctx.beginPath();
    ctx.moveTo(3 * u, 4 * u);
    ctx.bezierCurveTo(12 * u, 2 * u, 2 * u, 12 * u, 13 * u, 12 * u);
    ctx.stroke();
    return;
  }
  // 기본: 색 칩 + 이름 두 글자
  ctx.fillStyle = `hsl(${hue(id)} 45% 38%)`;
  rrect(ctx, 2 * u, 2 * u, 12 * u, 12 * u, 3 * u);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(s * 0.34)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(Array.from(name.replace(/\s/g, '')).slice(0, 2).join(''), s / 2, s / 2);
}

/**
 * 아이템 아이콘. 블록이면 등각 블록 그림, 아니면 종류별 간단한 그림(병·양동이·도구·가루·주괴·막대·실), 그 외 색 칩 + 이름.
 * 같은 (id, size) 는 캐시. 화면 배율만큼 크게 그리고 CSS 로 size 에 맞춘다.
 */
export function itemIcon(id: string, size: number, registry: BlockRegistry, atlas: IconSource, name: string): HTMLCanvasElement {
  const key = `${id}@${size}`;
  const hit = cache.get(key);
  if (hit) return cloneCanvas(hit);
  const def = registry.find(id);
  let canvas: HTMLCanvasElement;
  if (def && def.textures) {
    const missing = atlas.images.get('missing')!;
    canvas = renderBlockIcon(atlas.images.get(def.textures[0]) ?? missing, atlas.images.get(def.textures[1]) ?? missing, size);
  } else {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = Math.round(size * dpr);
    canvas.style.width = canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d')!;
    drawItem(ctx, id, name, size * dpr);
  }
  cache.set(key, canvas);
  return cloneCanvas(canvas);
}

/** 복사본. 그림 픽셀은 dpr 배지만 화면 크기(css)는 size 로 — 안 그러면 고해상도 화면에서 2배로 커진다 */
function cloneCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  c.style.width = src.style.width;
  c.style.height = src.style.height;
  c.getContext('2d')!.drawImage(src, 0, 0);
  return c;
}
