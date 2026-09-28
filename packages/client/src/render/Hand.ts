import { PADDED_VOLUME, paddedIndex } from '@dragon-village/shared';
import * as THREE from 'three';
import { greedyMesh } from '../mesh/greedyMesher';
import type { MeshBlockInfo } from '../mesh/meshTypes';
import type { ChunkMaterials } from './ChunkMaterial';
import { buffersToGeometry } from './geometry';
import { type Voxel, buildVoxelGeometry } from './voxelGeometry';

const SWING_TIME = 0.24;
/** 화면 기준 위치(NDC, -1..1). 화면 비율이 달라도 항상 오른쪽 아래 모서리 → 가운데 핫바와 안 겹친다 */
const HAND_NDC_X = 0.85;
const HAND_NDC_Y = -0.7;
const HAND_Z = -1.25;
const HAND_SCALE = 0.34;
const HAND_TILT = 0.3; // 윗면이 보이도록 살짝 기울임
const HAND_TURN = 0.6;

/** 아이템(블록 아닌 것) 한 픽셀 크기 — 16픽셀이 0.9칸. 도구는 마인크래프트처럼 손보다 크게 보인다 */
const ITEM_PIXEL = 0.9 / 16;
const ITEM_SHADES = [0.78, 0.7, 1.0, 0.5, 0.86, 0.94];

/** 아이콘 캔버스(정사각, 16 또는 그 배수)를 16×16 격자로 읽어 픽셀마다 상자 하나. y 는 위가 15 */
function iconVoxels(icon: HTMLCanvasElement): Voxel[] {
  const ctx = icon.getContext('2d');
  if (!ctx) return [];
  const w = icon.width,
    h = icon.height;
  const data = ctx.getImageData(0, 0, w, h).data;
  const out: Voxel[] = [];
  for (let py = 0; py < 16; py++)
    for (let px = 0; px < 16; px++) {
      // 격자 칸 가운데 픽셀을 본다 (dpr 배 캔버스여도 16 칸으로)
      const sx = Math.min(w - 1, Math.floor(((px + 0.5) * w) / 16)),
        sy = Math.min(h - 1, Math.floor(((py + 0.5) * h) / 16));
      const i = (sy * w + sx) * 4;
      if (data[i + 3]! < 128) continue;
      out.push({ x: px, y: 15 - py, z: 0, c: `#${((data[i]! << 16) | (data[i + 1]! << 8) | data[i + 2]!).toString(16).padStart(6, '0')}` });
    }
  return out;
}

/** 1인칭 손에 든 블록·아이템. 별도 씬에 그려서 벽에 파묻히지 않는다. 블록은 진짜 상자, 도구·안장 같은 아이템은 픽셀을 세운 입체 모형(#96). */
export class HandView {
  readonly scene = new THREE.Scene();
  private readonly anchor = new THREE.Group();
  private readonly pivot = new THREE.Group();
  private mesh: THREE.Mesh | null = null;
  private swingT = 1;
  /** 활 당김 0~1 (#119): 손이 뒤로 당겨진다 */
  private draw = 0;
  private currentBlock = -1;
  private currentItem: string | null = null;

  constructor(
    private readonly materials: ChunkMaterials,
    private readonly blockInfo: readonly MeshBlockInfo[],
  ) {
    this.scene.add(this.anchor);
    this.anchor.add(this.pivot);
    this.pivot.position.set(0, 0, HAND_Z);
    this.pivot.rotation.set(HAND_TILT, HAND_TURN, 0);
  }

  private clearMesh(): void {
    if (!this.mesh) return;
    this.pivot.remove(this.mesh);
    this.mesh.geometry.dispose();
    if (this.currentItem) (this.mesh.material as THREE.Material).dispose();
    this.mesh = null;
  }

  /**
   * 블록이 아닌 아이템: 아이콘(16×16 픽셀 그림)의 픽셀 하나하나를 상자로 세운 입체 모형 (마인크래프트 손 아이템처럼, 아빠 2026-09-24).
   * 도구(곡괭이·도끼)는 손잡이가 오른쪽 아래, 머리가 왼쪽 위로 비스듬히. icon 이 없으면 빈손
   */
  setItem(id: string | null, icon: HTMLCanvasElement | null): void {
    if (id === this.currentItem && this.currentBlock <= 0) return;
    this.clearMesh();
    this.currentBlock = 0;
    this.currentItem = id;
    if (!id || !icon) return;
    const voxels = iconVoxels(icon);
    if (voxels.length === 0) return;
    const geom = buildVoxelGeometry(voxels, ITEM_PIXEL, ITEM_SHADES);
    geom.translate(-8 * ITEM_PIXEL, -8 * ITEM_PIXEL, -0.5 * ITEM_PIXEL);
    this.mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ vertexColors: true }));
    const sword = /_sword$/.test(id);
    const tool = !sword && (/_(pickaxe|axe|shovel|hoe)$/.test(id) || id === 'shears' || id === 'flint_and_steel');
    if (sword) {
      // 검은 칼날이 위를 보게 (피벗 앞기울기를 상쇄), 오른쪽에 세워 든다 — 패널에서 맞춘 값 (2026-09-24)
      this.mesh.rotation.set(-0.3, -0.6, 0.35);
      this.mesh.position.set(-0.55, 0.3, 0.1);
      this.mesh.scale.setScalar(1.3);
    } else if (tool) {
      // 손잡이를 오른쪽 아래로 눕혀 잡은 느낌: 그림을 시계 방향으로 눕히고 카메라 쪽으로 살짝 돌린다
      // 값은 패널에서 참고 화면(마인크래프트 도끼)과 맞춰 본 것 (2026-09-24): 머리가 화면 오른쪽 아래 1/4 에, 손잡이는 오른쪽 아래로 빠진다
      this.mesh.rotation.set(0.25, -0.45, 2.35);
      this.mesh.position.set(-0.45, 0.4, 0.12);
      this.mesh.scale.setScalar(1.5);
    } else {
      this.mesh.rotation.set(0, -HAND_TURN * 0.7, 0.15);
      this.mesh.position.set(-0.05, 0.05, 0);
    }
    this.mesh.frustumCulled = false;
    this.pivot.add(this.mesh);
  }

  setBlock(num: number): void {
    if (num === this.currentBlock && !this.currentItem) return;
    this.clearMesh();
    this.currentItem = null;
    this.currentBlock = num;
    if (num <= 0) return;
    const padded = new Uint16Array(PADDED_VOLUME);
    padded[paddedIndex(0, 0, 0)] = num;
    const r = greedyMesh(padded, this.blockInfo);
    const buf = r.opaque ?? r.translucent;
    if (!buf) return;
    const geom = buffersToGeometry(buf, 1, new THREE.Vector3(0.5, 0.5, 0.5));
    geom.translate(-0.5, -0.5, -0.5);
    this.mesh = new THREE.Mesh(geom, r.opaque ? this.materials.hand : this.materials.translucent);
    this.mesh.scale.setScalar(HAND_SCALE);
    this.mesh.frustumCulled = false;
    this.pivot.add(this.mesh);
  }

  setDraw(v: number): void {
    this.draw = Math.max(0, Math.min(1, v));
  }

  swing(): void {
    if (this.swingT >= 1 || this.swingT > 0.5) this.swingT = 0;
  }

  update(dt: number, camera: THREE.PerspectiveCamera, walkCycle: number, walkStrength: number): void {
    this.anchor.position.copy(camera.position);
    this.anchor.quaternion.copy(camera.quaternion);

    // 화면 모서리 고정: HAND_Z 거리에서 보이는 반폭·반높이 × NDC
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * -HAND_Z;
    const halfW = halfH * camera.aspect;
    const baseX = HAND_NDC_X * halfW;
    const baseY = HAND_NDC_Y * halfH;

    let dx = 0,
      dy = 0,
      rx = 0;
    // 걷기 흔들림
    dx += Math.sin(walkCycle) * 0.02 * walkStrength;
    dy += -Math.abs(Math.cos(walkCycle)) * 0.025 * walkStrength;
    // 휘두르기
    if (this.swingT < 1) {
      this.swingT = Math.min(1, this.swingT + dt / SWING_TIME);
      const s = Math.sin(this.swingT * Math.PI);
      dy -= s * 0.28;
      dx -= s * 0.12;
      rx -= s * 1.1;
    }
    // 활 당기기: 손을 안쪽·위로 조금 당기고 살짝 기울인다
    dx -= this.draw * 0.08;
    dy += this.draw * 0.05;
    rx += this.draw * 0.35;
    this.pivot.position.set(baseX + dx, baseY + dy, HAND_Z + this.draw * 0.12);
    this.pivot.rotation.x = HAND_TILT + rx;
  }

  render(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
    if (!this.mesh) return;
    renderer.clearDepth();
    renderer.render(this.scene, camera);
  }

  dispose(): void {
    this.clearMesh();
  }
}
