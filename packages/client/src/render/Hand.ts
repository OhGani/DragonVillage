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
/**
 * 활 자세 (#184, 아들 2026-10-17 마인크래프트 활 쏘는 화면): 쉴 때(rot/pos) → 다 당겼을 때(drawRot/drawPos) 사이를 당긴 만큼 섞는다.
 * pull 은 손(피벗) 전체가 가운데로 끌려오는 양 [dx, dy, rx, dz]. 화살은 활 가운데(시위)에서 조준점 쪽으로 뻗고, 당길수록 뒤로 빠진다.
 * 값은 패널에서 맞춘 것 — dev 콘솔 __dv.hand.tune 으로 바로 바꿔 볼 수 있다
 */
export const BOW_TUNE = {
  rot: [0.15, -0.5, 0.75],
  drawRot: [0.05, -0.15, 0.95],
  pos: [-0.4, 0.35, 0.1],
  drawPos: [-0.15, 0.45, -0.1],
  scale: 1.1,
  drawScale: 1.0,
  pull: [0.35, 0.12, 0.1, -0.12],
  /** 화살 (피벗 기준, 회전 순서 YZX): 그림 대각선을 조준점 쪽으로 돌리고 화면 안쪽으로 눕힌다 */
  arrowRot: [0, -0.8, 2.13],
  arrowPos: [-0.25, 0.42, -0.05],
  arrowDrawPos: [-0.5, 0.5, -0.35],
};
/** 왼손 방패 자세 (#198): 쉴 때 rot/pos, 막을 때 guardRot/guardPos, pull = 막을 때 손(피벗)이 [dx, dy, dz, rx] 만큼 가운데로 */
export const SHIELD_TUNE = {
  rot: [0.1, 0.7, -0.1],
  guardRot: [0.05, 0.35, 0],
  pos: [0.2, 0.12, 0],
  guardPos: [0.05, 0.1, -0.05],
  scale: 1.0,
  guardScale: 1.3,
  pull: [0.4, 0.2, -0.1, -0.1],
};
/** 쇠뇌 자세 (#194, 아들 2026-10-19 마인크래프트 쇠뇌 화면): 가로로 눕혀 앞을 겨눈다. 장전(당김)하면 가운데 아래로 내려와 화살이 위에 얹힌다 */
export const CROSSBOW_TUNE = {
  rot: [0.2, -0.6, 0.6],
  drawRot: [-1.0, 0, 0.78],
  pos: [-0.35, 0.3, 0.1],
  drawPos: [-0.5, -0.02, -0.1],
  scale: 1.2,
  drawScale: 1.6,
  pull: [0.3, 0.05, 0.05, -0.05],
  arrowRot: [0.1, 1.35, -0.78],
  arrowPos: [-0.4, 0.35, -0.05],
  arrowDrawPos: [-0.5, 0.08, -0.15],
};

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
  /** 활에 먹인 화살 (#184): 당길수록 뒤로 빠진다 */
  private arrow: THREE.Mesh | null = null;
  private bow = false;
  /** 활 자세 값 (#184) — 개발 콘솔에서 바로 고쳐 볼 수 있다. 쇠뇌는 CROSSBOW_TUNE (#194) */
  tune = BOW_TUNE;
  private swingT = 1;
  /** 활 당김 0~1 (#119): 손이 뒤로 당겨진다 */
  private draw = 0;
  private currentBlock = -1;
  private currentItem: string | null = null;
  /** 왼손 방패 (#198, 아들 2026-10-19 "방패는 왼손, 무기는 오른쪽"): 끼고 있으면 화면 왼쪽 아래에, 막으면 가운데로 올라온다 */
  private readonly offPivot = new THREE.Group();
  private shield: THREE.Mesh | null = null;
  private guard = 0;
  private guardTarget = 0;
  /** 방패 자세 값 (#198) — 개발 콘솔 __dv.hand.shieldTune */
  shieldTune = SHIELD_TUNE;

  constructor(
    private readonly materials: ChunkMaterials,
    private readonly blockInfo: readonly MeshBlockInfo[],
  ) {
    this.scene.add(this.anchor);
    this.anchor.add(this.pivot);
    this.pivot.position.set(0, 0, HAND_Z);
    this.pivot.rotation.set(HAND_TILT, HAND_TURN, 0);
    this.anchor.add(this.offPivot);
    this.offPivot.position.set(0, 0, HAND_Z);
    this.offPivot.rotation.set(HAND_TILT, -HAND_TURN, 0);
  }

  /** 왼손 방패 (#198): 끼면 보이고 벗으면 사라진다. icon 은 방패 그림 */
  setShield(icon: HTMLCanvasElement | null): void {
    if ((icon === null) === (this.shield === null)) return;
    if (this.shield) {
      this.offPivot.remove(this.shield);
      this.shield.geometry.dispose();
      (this.shield.material as THREE.Material).dispose();
      this.shield = null;
    }
    if (!icon) return;
    this.shield = this.iconMesh(icon);
    if (this.shield) this.offPivot.add(this.shield);
  }

  /** 막는 중이면 방패가 가운데로 올라온다 (#198) */
  setGuard(on: boolean): void {
    this.guardTarget = on ? 1 : 0;
  }

  private clearMesh(): void {
    if (this.arrow) {
      this.pivot.remove(this.arrow);
      this.arrow.geometry.dispose();
      (this.arrow.material as THREE.Material).dispose();
      this.arrow = null;
    }
    this.bow = false;
    if (!this.mesh) return;
    this.pivot.remove(this.mesh);
    this.mesh.geometry.dispose();
    if (this.currentItem) (this.mesh.material as THREE.Material).dispose();
    this.mesh = null;
  }

  /** 아이콘 → 픽셀 입체 모형 */
  private iconMesh(icon: HTMLCanvasElement): THREE.Mesh | null {
    const voxels = iconVoxels(icon);
    if (voxels.length === 0) return null;
    const geom = buildVoxelGeometry(voxels, ITEM_PIXEL, ITEM_SHADES);
    geom.translate(-8 * ITEM_PIXEL, -8 * ITEM_PIXEL, -0.5 * ITEM_PIXEL);
    const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ vertexColors: true }));
    mesh.frustumCulled = false;
    return mesh;
  }

  /**
   * 블록이 아닌 아이템: 아이콘(16×16 픽셀 그림)의 픽셀 하나하나를 상자로 세운 입체 모형 (마인크래프트 손 아이템처럼, 아빠 2026-09-24).
   * 도구(곡괭이·도끼)는 손잡이가 오른쪽 아래, 머리가 왼쪽 위로 비스듬히. icon 이 없으면 빈손
   */
  setItem(id: string | null, icon: HTMLCanvasElement | null, arrowIcon: HTMLCanvasElement | null = null): void {
    if (id === this.currentItem && this.currentBlock <= 0) return;
    this.clearMesh();
    this.currentBlock = 0;
    this.currentItem = id;
    if (!id || !icon) return;
    this.mesh = this.iconMesh(icon);
    if (!this.mesh) return;
    const bow = /^(bow|crossbow)(#|$)/.test(id); // 당기는 단계 그림은 'bow#1' 처럼 온다 (#184)
    if (bow) {
      this.tune = /^crossbow/.test(id) ? CROSSBOW_TUNE : BOW_TUNE;
      // 활 (#184, 아들 2026-10-17 마인크래프트 화면): 오른쪽에 비스듬히 세워 들고, 당기면 update 가 가운데로 끌어온다
      this.bow = true;
      if (arrowIcon) {
        this.arrow = this.iconMesh(arrowIcon);
        if (this.arrow) {
          this.arrow.visible = false;
          this.pivot.add(this.arrow);
        }
      }
      this.pivot.add(this.mesh);
      return;
    }
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
    this.updateShield(dt, camera, walkCycle, walkStrength);

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
    if (this.bow) {
      // 활 당기기 (#184): 활이 화면 가운데 쪽으로 오면서 세워지고, 화살이 시위에 먹힌 채 뒤로 빠진다
      const d = this.draw;
      const t = this.tune;
      const mix = (a: readonly number[], b: readonly number[], k: number): number => a[k]! + (b[k]! - a[k]!) * d;
      dx -= d * t.pull[0]!;
      dy += d * t.pull[1]!;
      rx += d * t.pull[2]!;
      if (this.mesh) {
        this.mesh.rotation.set(mix(t.rot, t.drawRot, 0), mix(t.rot, t.drawRot, 1), mix(t.rot, t.drawRot, 2));
        this.mesh.position.set(mix(t.pos, t.drawPos, 0), mix(t.pos, t.drawPos, 1), mix(t.pos, t.drawPos, 2));
        this.mesh.scale.setScalar(t.scale + (t.drawScale - t.scale) * d);
      }
      if (this.arrow) {
        this.arrow.visible = d > 0;
        this.arrow.rotation.order = 'YZX';
        this.arrow.rotation.set(t.arrowRot[0]!, t.arrowRot[1]!, t.arrowRot[2]!);
        this.arrow.scale.setScalar(t.scale);
        this.arrow.position.set(mix(t.arrowPos, t.arrowDrawPos, 0), mix(t.arrowPos, t.arrowDrawPos, 1), mix(t.arrowPos, t.arrowDrawPos, 2));
      }
      this.pivot.position.set(baseX + dx, baseY + dy, HAND_Z + d * t.pull[3]!);
      this.pivot.rotation.x = HAND_TILT + rx;
      return;
    }
    // 활 당기기: 손을 안쪽·위로 조금 당기고 살짝 기울인다
    dx -= this.draw * 0.08;
    dy += this.draw * 0.05;
    rx += this.draw * 0.35;
    this.pivot.position.set(baseX + dx, baseY + dy, HAND_Z + this.draw * 0.12);
    this.pivot.rotation.x = HAND_TILT + rx;
  }

  /** 왼손 방패 자리 (#198): 오른손과 대칭인 왼쪽 아래. 막으면 가운데·위로 올라와 화면을 가린다 */
  private updateShield(dt: number, camera: THREE.PerspectiveCamera, walkCycle: number, walkStrength: number): void {
    if (!this.shield) return;
    this.guard += (this.guardTarget - this.guard) * Math.min(1, 14 * dt);
    const g = this.guard;
    const t = this.shieldTune;
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * -HAND_Z;
    const halfW = halfH * camera.aspect;
    const baseX = -HAND_NDC_X * halfW;
    const baseY = HAND_NDC_Y * halfH;
    const dx = Math.sin(walkCycle) * 0.02 * walkStrength + g * t.pull[0]!;
    const dy = -Math.abs(Math.cos(walkCycle)) * 0.025 * walkStrength + g * t.pull[1]!;
    this.offPivot.position.set(baseX + dx, baseY + dy, HAND_Z + g * t.pull[2]!);
    this.offPivot.rotation.x = HAND_TILT + g * t.pull[3]!;
    const mix = (k: number) => t.rot[k]! + (t.guardRot[k]! - t.rot[k]!) * g;
    this.shield.rotation.set(mix(0), mix(1), mix(2));
    this.shield.position.set(t.pos[0]! + (t.guardPos[0]! - t.pos[0]!) * g, t.pos[1]! + (t.guardPos[1]! - t.pos[1]!) * g, t.pos[2]! + (t.guardPos[2]! - t.pos[2]!) * g);
    this.shield.scale.setScalar(t.scale + (t.guardScale - t.scale) * g);
  }

  render(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
    if (!this.mesh && !this.shield) return;
    renderer.clearDepth();
    renderer.render(this.scene, camera);
  }

  dispose(): void {
    this.clearMesh();
  }
}
