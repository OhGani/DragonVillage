import { mulberry32 } from '@dragon-village/shared';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { boxEdges, outlineEdges, partBoxes, type Seg } from './partOutline';

/** 16분의 1 단위 상자들로 적은 모양 (울타리·울타리문, #295). key 가 같으면 같은 모양 */
export interface BoxShape {
  key: string;
  boxes: readonly (readonly number[])[];
}

const STAGES = 10;
const OUTLINE_THICKNESS = 0.02; // 블록 대비 두께 — 폰 고해상도에서도 보이게 (WebGL 선 굵기는 1px 고정)

/** 깨지는 금 텍스처 10단계 — 시드 PRNG 로 캔버스에 그린다 */
function makeCrackTextures(): THREE.CanvasTexture[] {
  const rnd = mulberry32(0xc7ac);
  // 중심에서 뻗는 랜덤 워크로 픽셀 순서를 만들고, 단계마다 앞부분만 보여준다
  const order: [number, number][] = [];
  const seen = new Set<number>();
  const push = (x: number, y: number) => {
    x = Math.max(0, Math.min(15, x));
    y = Math.max(0, Math.min(15, y));
    const k = y * 16 + x;
    if (seen.has(k)) return;
    seen.add(k);
    order.push([x, y]);
  };
  for (let branch = 0; branch < 14; branch++) {
    let x = 6 + Math.floor(rnd() * 4),
      y = 6 + Math.floor(rnd() * 4);
    const dx = rnd() < 0.5 ? -1 : 1,
      dy = rnd() < 0.5 ? -1 : 1;
    for (let i = 0; i < 12; i++) {
      push(x, y);
      if (rnd() < 0.55) x += dx;
      else y += dy;
      if (rnd() < 0.15) push(x + (rnd() < 0.5 ? 1 : -1), y);
    }
  }
  const total = order.length;
  const out: THREE.CanvasTexture[] = [];
  for (let s = 0; s < STAGES; s++) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 16, 16);
    const count = Math.floor((total * (s + 1)) / STAGES);
    for (let i = 0; i < count; i++) {
      const [x, y] = order[i];
      const a = 0.55 + 0.35 * (i / total);
      ctx.fillStyle = `rgba(15,15,15,${a.toFixed(2)})`;
      ctx.fillRect(x, y, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    out.push(tex);
  }
  return out;
}

/** 칸 가운데를 원점으로, 바깥으로 아주 조금 부풀린 좌표 (면과 겹쳐 깜빡이지 않게) */
const OUTLINE_SCALE = 1.004;
const CRACK_PAD = 0.001;

/**
 * 모양(조각 마스크, #293)의 모서리를 가는 사각기둥으로 — 화면 크기와 무관하게 보이는 외곽선.
 * 보통 블록은 모서리 12개, 반 블록은 반 칸 상자, 계단은 ㄴ자
 */
function makeOutlineGeometry(edges: readonly Seg[], t: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const [x0, y0, z0, x1, y1, z1] of edges) {
    const g = new THREE.BoxGeometry((x1 - x0) * OUTLINE_SCALE + t, (y1 - y0) * OUTLINE_SCALE + t, (z1 - z0) * OUTLINE_SCALE + t);
    g.translate(((x0 + x1) / 2 - 0.5) * OUTLINE_SCALE, ((y0 + y1) / 2 - 0.5) * OUTLINE_SCALE, ((z0 + z1) / 2 - 0.5) * OUTLINE_SCALE);
    parts.push(g);
  }
  const merged = mergeGeometries(parts, false);
  for (const p of parts) p.dispose();
  return merged!;
}

/** 금을 입힐 상자들 (모양대로). 상자마다 금 그림이 한 장씩 */
function makeCrackGeometry(boxes: readonly Seg[]): THREE.BufferGeometry {
  const parts = boxes.map(([x0, y0, z0, x1, y1, z1]) => {
    const g = new THREE.BoxGeometry(x1 - x0 + CRACK_PAD * 2, y1 - y0 + CRACK_PAD * 2, z1 - z0 + CRACK_PAD * 2);
    g.translate((x0 + x1) / 2 - 0.5, (y0 + y1) / 2 - 0.5, (z0 + z1) / 2 - 0.5);
    return g;
  });
  if (parts.length === 1) return parts[0]!;
  const merged = mergeGeometries(parts, false);
  for (const p of parts) p.dispose();
  return merged!;
}

/** 조준 블록 외곽선 + 부수기 금 */
export class BlockHighlight {
  private readonly outline: THREE.Mesh;
  private readonly crack: THREE.Mesh;
  private readonly crackMat: THREE.MeshBasicMaterial;
  private readonly crackTextures: THREE.CanvasTexture[];
  private stage = -1;
  /** 모양(조각 마스크)별 외곽선·금 상자 — 처음 볼 때 만들어 둔다 (#293). 255 = 보통 블록 */
  private readonly shapes = new Map<string, { outline: THREE.BufferGeometry; crack: THREE.BufferGeometry }>();
  private shapeKey = 'm255';

  private shapeOf(mask: number, box?: BoxShape): { outline: THREE.BufferGeometry; crack: THREE.BufferGeometry } {
    const key = box ? box.key : `m${mask}`;
    let s = this.shapes.get(key);
    if (!s) {
      const edges = box ? boxEdges(box.boxes) : outlineEdges(mask);
      const boxes: Seg[] = box ? box.boxes.map((b) => [b[0]! / 16, b[1]! / 16, b[2]! / 16, b[3]! / 16, b[4]! / 16, b[5]! / 16] as const) : partBoxes(mask);
      this.shapes.set(key, (s = { outline: makeOutlineGeometry(edges, OUTLINE_THICKNESS), crack: makeCrackGeometry(boxes) }));
    }
    return s;
  }

  constructor(scene: THREE.Scene) {
    this.outline = new THREE.Mesh(
      this.shapeOf(255).outline,
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false }),
    );
    this.outline.renderOrder = 5;
    this.outline.visible = false;
    scene.add(this.outline);

    this.crackTextures = makeCrackTextures();
    this.crackMat = new THREE.MeshBasicMaterial({
      map: this.crackTextures[0],
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    this.crack = new THREE.Mesh(this.shapeOf(255).crack, this.crackMat);
    this.crack.renderOrder = 4;
    this.crack.visible = false;
    scene.add(this.crack);
  }

  /** mask = 그 블록의 조각 마스크 (계단·반 블록은 모양대로, #293). 안 주면 보통 블록. box 를 주면 그 상자들 모양으로 (울타리 #295) */
  setTarget(x: number, y: number, z: number, mask = 255, box?: BoxShape): void {
    mask &= 255;
    if (mask === 0) mask = 255;
    const key = box ? box.key : `m${mask}`;
    if (key !== this.shapeKey) {
      this.shapeKey = key;
      const s = this.shapeOf(mask, box);
      this.outline.geometry = s.outline;
      this.crack.geometry = s.crack;
    }
    this.outline.visible = true;
    this.outline.position.set(x + 0.5, y + 0.5, z + 0.5);
    this.crack.position.copy(this.outline.position);
  }

  clearTarget(): void {
    this.outline.visible = false;
    this.crack.visible = false;
  }

  /** 0 = 없음, 0..1 진행 */
  setProgress(p: number): void {
    if (p <= 0 || !this.outline.visible) {
      this.crack.visible = false;
      this.stage = -1;
      return;
    }
    const stage = Math.min(STAGES - 1, Math.floor(p * STAGES));
    if (stage !== this.stage) {
      this.stage = stage;
      this.crackMat.map = this.crackTextures[stage];
      this.crackMat.needsUpdate = true;
    }
    this.crack.visible = true;
  }

  dispose(): void {
    for (const s of this.shapes.values()) {
      s.outline.dispose();
      s.crack.dispose();
    }
    this.shapes.clear();
    (this.outline.material as THREE.Material).dispose();
    this.crackMat.dispose();
    for (const t of this.crackTextures) t.dispose();
  }
}
