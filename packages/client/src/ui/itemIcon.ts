import type { BlockRegistry } from '@dragon-village/shared';
import { renderBlockIcon } from './icons';

export interface IconSource {
  images: Map<string, ImageData>;
}

const cache = new Map<string, HTMLCanvasElement>();

/** 아이템 이름에서 안정된 색 (블록 아닌 아이템 아이콘 배경) */
function hue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

/**
 * 아이템 아이콘. 블록이면 등각 블록 그림, 아니면 색 칩 + 이름 두 글자 (아들이 아이템 그림을 그리면 여기서 바꾼다).
 * 물약은 병 모양 색 칩. 같은 (id, size) 는 캐시.
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
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const potion = id === 'water_bottle' || id.startsWith('potion.') || id.startsWith('splash_potion.') || id.startsWith('lingering_potion.');
    const h = potion ? 280 : hue(id);
    ctx.fillStyle = `hsl(${h} 45% 38%)`;
    const r = size * 0.18;
    ctx.beginPath();
    if (potion) {
      // 병: 목 + 둥근 몸
      ctx.roundRect(size * 0.38, size * 0.08, size * 0.24, size * 0.22, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(size * 0.2, size * 0.28, size * 0.6, size * 0.64, r);
    } else ctx.roundRect(size * 0.12, size * 0.12, size * 0.76, size * 0.76, r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(1, size / 20);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(size * 0.34)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = Array.from(name.replace(/\s/g, '')).slice(0, 2).join('');
    ctx.fillText(label, size / 2, size * (potion ? 0.6 : 0.5));
  }
  cache.set(key, canvas);
  return cloneCanvas(canvas);
}

function cloneCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  c.getContext('2d')!.drawImage(src, 0, 0);
  return c;
}
