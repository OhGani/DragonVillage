/**
 * 끈 (#297): 매인 동물과 끄는 사람(또는 묶인 울타리) 사이에 늘어진 줄을 그린다. 울타리에는 매듭 하나.
 * 줄은 가는 상자 토막을 이어 붙인 것 — WebGL 선은 1픽셀 고정이라 폰에서 안 보인다(조준 외곽선과 같은 이유).
 * 서버가 leash 목록을 줄 때마다 set, 프레임마다 update 로 양 끝을 따라간다.
 */
import * as THREE from 'three';

export interface LeashEntry {
  id: number;
  /** 끄는 사람 번호 (울타리에 묶였으면 null) */
  by: number | null;
  /** 묶인 울타리 칸 */
  post: [number, number, number] | null;
}

const SEGMENTS = 8;
const MAX_LEASHES = 24;
const THICK = 0.045;
/** 울타리의 매듭 높이 (칸 바닥에서) */
const KNOT_Y = 0.72;

type Pos = { x: number; y: number; z: number };

export class LeashView {
  private readonly rope: THREE.InstancedMesh;
  private readonly knots: THREE.InstancedMesh;
  private list: LeashEntry[] = [];
  private readonly dummy = new THREE.Object3D();
  private readonly a = new THREE.Vector3();
  private readonly b = new THREE.Vector3();
  private readonly p0 = new THREE.Vector3();
  private readonly p1 = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    // z 방향 길이 1 인 토막 — 길이는 scale.z 로
    this.rope = new THREE.InstancedMesh(new THREE.BoxGeometry(THICK, THICK, 1), new THREE.MeshBasicMaterial({ color: 0x8a5a2b }), MAX_LEASHES * SEGMENTS);
    this.knots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.16, 0.34), new THREE.MeshBasicMaterial({ color: 0x6f4520 }), MAX_LEASHES);
    for (const m of [this.rope, this.knots]) {
      m.count = 0;
      m.frustumCulled = false;
      scene.add(m);
    }
  }

  set(list: LeashEntry[]): void {
    this.list = list.slice(0, MAX_LEASHES);
    if (this.list.length === 0) {
      this.rope.count = 0;
      this.knots.count = 0;
    }
  }

  get active(): boolean {
    return this.list.length > 0;
  }

  /** animalAt = 동물 몸 가운데, holderAt = 끄는 사람의 손 자리. 못 찾으면(아직 안 보임) 그 줄은 건너뛴다 */
  update(animalAt: (id: number) => Pos | null, holderAt: (idx: number) => Pos | null): void {
    let seg = 0,
      knot = 0;
    const d = this.dummy;
    for (const l of this.list) {
      const from = animalAt(l.id);
      if (!from) continue;
      let to: Pos | null;
      if (l.post) {
        to = { x: l.post[0] + 0.5, y: l.post[1] + KNOT_Y, z: l.post[2] + 0.5 };
        d.position.set(to.x, to.y, to.z);
        d.rotation.set(0, 0, 0);
        d.scale.set(1, 1, 1);
        d.updateMatrix();
        this.knots.setMatrixAt(knot++, d.matrix);
      } else to = l.by !== null ? holderAt(l.by) : null;
      if (!to) continue;
      this.a.set(from.x, from.y + 0.15, from.z);
      this.b.set(to.x, to.y, to.z);
      const sag = Math.min(0.7, this.a.distanceTo(this.b) * 0.12);
      this.p0.copy(this.a);
      for (let i = 1; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS;
        this.p1.lerpVectors(this.a, this.b, t);
        this.p1.y -= sag * 4 * t * (1 - t);
        const len = this.p0.distanceTo(this.p1);
        d.position.copy(this.p0).add(this.p1).multiplyScalar(0.5);
        d.scale.set(1, 1, Math.max(0.001, len));
        d.lookAt(this.p1);
        d.updateMatrix();
        this.rope.setMatrixAt(seg++, d.matrix);
        this.p0.copy(this.p1);
      }
    }
    this.rope.count = seg;
    this.knots.count = knot;
    this.rope.instanceMatrix.needsUpdate = true;
    this.knots.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    for (const m of [this.rope, this.knots]) {
      m.removeFromParent();
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  }
}
