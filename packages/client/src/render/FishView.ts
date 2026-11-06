/**
 * 낚시 찌·낚싯줄 (2026-11-06). 서버가 cast 를 주면 찌가 손에서 물(x,y,z 칸)로 포물선을 그리며 날아가 수면에 뜬다.
 * 출렁이며 떠 있다가 bite 면 쑥 가라앉아 떨고(지금 탭!), miss 면 다시 뜬다. 줄은 손 쪽에서 찌까지 늘어진 선.
 */
import * as THREE from 'three';

const FLY_SEC = 0.35;
/** 낚아 올린 것이 손까지 날아오는 시간 (2026-11-06, 아빠 "찌에 매달려 파닥거리며 날아오는 연출") */
const LAND_SEC = 0.8;

export class FishView {
  private readonly bobber = new THREE.Group();
  private readonly line: THREE.Line;
  private readonly linePos = new Float32Array(3 * 12);
  private at: THREE.Vector3 | null = null;
  private from = new THREE.Vector3();
  private flyT = 0;
  private biting = false;
  private biteT = 0;
  /** 낚아 올리는 중인 것들: 찌 자리에서 손으로 포물선, 파닥파닥 */
  private readonly landing: { obj: THREE.Object3D; from: THREE.Vector3; t: number; tail: THREE.Object3D | null }[] = [];

  constructor(private readonly scene: THREE.Scene) {
    const red = new THREE.MeshBasicMaterial({ color: 0xd8342c });
    const white = new THREE.MeshBasicMaterial({ color: 0xf2f2f2 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), red);
    top.position.y = 0.05;
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), white);
    bottom.position.y = -0.05;
    const stick = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), red);
    stick.position.y = 0.14;
    this.bobber.add(top, bottom, stick);
    this.bobber.visible = false;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.linePos, 3));
    this.line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0.8 }));
    this.line.frustumCulled = false;
    this.line.visible = false;
    scene.add(this.bobber, this.line);
  }

  get active(): boolean {
    return this.at !== null;
  }

  /** 찌가 떠 있거나 낚아 올리는 중 — 이때만 update 를 부른다 */
  get busy(): boolean {
    return this.at !== null || this.landing.length > 0;
  }

  /** 낚았다: obj(연어 입체 또는 아이템 그림)가 from(찌 자리)에서 손으로 파닥거리며 날아온다 */
  landCatch(obj: THREE.Object3D, from: THREE.Vector3): void {
    obj.position.copy(from);
    this.scene.add(obj);
    this.landing.push({ obj, from: from.clone(), t: 0, tail: (obj.userData.tail as THREE.Object3D | undefined) ?? null });
  }

  /** 찌 던지기: 물 칸 (x,y,z) 의 수면으로. hand = 지금 손 자리 */
  cast(x: number, y: number, z: number, hand: THREE.Vector3): void {
    this.at = new THREE.Vector3(x + 0.5, y + 0.92, z + 0.5);
    this.from.copy(hand);
    this.flyT = 0;
    this.biting = false;
    this.bobber.visible = true;
    this.line.visible = true;
  }

  bite(): void {
    this.biting = true;
    this.biteT = 0;
  }

  unbite(): void {
    this.biting = false;
  }

  clear(): void {
    this.at = null;
    this.biting = false;
    this.bobber.visible = false;
    this.line.visible = false;
  }

  /** 찌 자리 (물보라용). 없으면 null */
  get spot(): THREE.Vector3 | null {
    return this.at;
  }

  update(dt: number, now: number, hand: THREE.Vector3): void {
    for (let i = this.landing.length - 1; i >= 0; i--) {
      const l = this.landing[i]!;
      l.t += dt / LAND_SEC;
      const k = Math.min(1, l.t);
      const e = 1 - (1 - k) * (1 - k); // 처음엔 빠르게 튀어 오르고 손 앞에서 느려진다
      l.obj.position.lerpVectors(l.from, hand, e);
      l.obj.position.y += Math.sin(k * Math.PI) * 1.4;
      l.obj.rotation.set(0, now * 0.004, Math.sin(now * 0.04) * 0.7); // 파닥파닥 (몸을 뒤틀며 돈다)
      if (l.tail) l.tail.rotation.y = Math.sin(now * 0.05) * 0.9;
      l.obj.scale.setScalar(k > 0.85 ? Math.max(0.05, (1 - k) / 0.15) : 1); // 손에 닿으면 쏙
      if (l.t >= 1) {
        this.scene.remove(l.obj);
        this.landing.splice(i, 1);
      }
    }
    if (!this.at) return;
    this.flyT = Math.min(FLY_SEC, this.flyT + dt);
    const k = this.flyT / FLY_SEC;
    const p = this.bobber.position;
    if (k < 1) {
      p.lerpVectors(this.from, this.at, k);
      p.y += Math.sin(k * Math.PI) * 1.6; // 포물선
    } else {
      p.copy(this.at);
      if (this.biting) {
        this.biteT += dt;
        p.y -= 0.28 + Math.sin(this.biteT * 40) * 0.05; // 쑥 가라앉아 떤다
      } else p.y += Math.sin(now * 0.004) * 0.04; // 출렁출렁
    }
    // 줄: 손 → 찌, 가운데가 처진다 (던지는 중엔 팽팽)
    const sag = k < 1 ? 0 : Math.min(0.8, hand.distanceTo(p) * 0.06);
    const n = this.linePos.length / 3;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      this.linePos[i * 3] = hand.x + (p.x - hand.x) * t;
      this.linePos[i * 3 + 1] = hand.y + (p.y + 0.1 - hand.y) * t - Math.sin(t * Math.PI) * sag;
      this.linePos[i * 3 + 2] = hand.z + (p.z - hand.z) * t;
    }
    (this.line.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  dispose(): void {
    this.scene.remove(this.bobber, this.line);
  }
}
