import { mulberry32 } from '@dragon-village/shared';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

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

/** 12개 모서리를 가는 사각기둥으로 — 화면 크기와 무관하게 보이는 외곽선 */
function makeOutlineGeometry(size: number, t: number): THREE.BufferGeometry {
  const h = size / 2;
  const parts: THREE.BufferGeometry[] = [];
  const edge = (sx: number, sy: number, sz: number, x: number, y: number, z: number) => {
    const g = new THREE.BoxGeometry(sx, sy, sz);
    g.translate(x, y, z);
    parts.push(g);
  };
  const L = size + t;
  for (const a of [-h, h])
    for (const b of [-h, h]) {
      edge(L, t, t, 0, a, b); // x 방향 모서리 4개
      edge(t, L, t, a, 0, b); // y 방향
      edge(t, t, L, a, b, 0); // z 방향
    }
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

  constructor(scene: THREE.Scene) {
    this.outline = new THREE.Mesh(
      makeOutlineGeometry(1.004, OUTLINE_THICKNESS),
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
    this.crack = new THREE.Mesh(new THREE.BoxGeometry(1.002, 1.002, 1.002), this.crackMat);
    this.crack.renderOrder = 4;
    this.crack.visible = false;
    scene.add(this.crack);
  }

  setTarget(x: number, y: number, z: number): void {
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
    this.outline.geometry.dispose();
    (this.outline.material as THREE.Material).dispose();
    this.crack.geometry.dispose();
    this.crackMat.dispose();
    for (const t of this.crackTextures) t.dispose();
  }
}
