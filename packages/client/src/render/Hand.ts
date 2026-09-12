import { PADDED_VOLUME, paddedIndex } from '@dragon-village/shared';
import * as THREE from 'three';
import { greedyMesh } from '../mesh/greedyMesher';
import type { MeshBlockInfo } from '../mesh/meshTypes';
import type { ChunkMaterials } from './ChunkMaterial';
import { buffersToGeometry } from './geometry';

const SWING_TIME = 0.24;
/** 화면 기준 위치(NDC, -1..1). 화면 비율이 달라도 항상 오른쪽 아래 모서리 → 가운데 핫바와 안 겹친다 */
const HAND_NDC_X = 0.85;
const HAND_NDC_Y = -0.7;
const HAND_Z = -1.25;
const HAND_SCALE = 0.34;
const HAND_TILT = 0.3; // 윗면이 보이도록 살짝 기울임
const HAND_TURN = 0.6;

/** 1인칭 손에 든 블록. 별도 씬에 그려서 벽에 파묻히지 않는다. */
export class HandView {
  readonly scene = new THREE.Scene();
  private readonly anchor = new THREE.Group();
  private readonly pivot = new THREE.Group();
  private mesh: THREE.Mesh | null = null;
  private swingT = 1;
  private currentBlock = -1;

  constructor(
    private readonly materials: ChunkMaterials,
    private readonly blockInfo: readonly MeshBlockInfo[],
  ) {
    this.scene.add(this.anchor);
    this.anchor.add(this.pivot);
    this.pivot.position.set(0, 0, HAND_Z);
    this.pivot.rotation.set(HAND_TILT, HAND_TURN, 0);
  }

  setBlock(num: number): void {
    if (num === this.currentBlock) return;
    this.currentBlock = num;
    if (this.mesh) {
      this.pivot.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh = null;
    }
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
    this.pivot.position.set(baseX + dx, baseY + dy, HAND_Z);
    this.pivot.rotation.x = HAND_TILT + rx;
  }

  render(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
    if (!this.mesh) return;
    renderer.clearDepth();
    renderer.render(this.scene, camera);
  }

  dispose(): void {
    if (this.mesh) this.mesh.geometry.dispose();
  }
}
