/**
 * 세계에 떨어진 경험치 구슬 (M7-1). 서버가 알려 준 자리에 초록 빛 구슬을 띄우고, 되찾으면 지운다.
 * 조명 없는 씬이라 더하기 블렌딩으로 빛나 보이게. 살짝 떠서 돌고 오르내린다.
 */
import type { OrbInfo } from '@dragon-village/shared';
import * as THREE from 'three';

const GEOM = new THREE.OctahedronGeometry(0.16, 0);
const CORE = new THREE.MeshBasicMaterial({ color: 0xdfffb0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
const GLOW = new THREE.MeshBasicMaterial({ color: 0x7fff00, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });

export class OrbView {
  private readonly group = new THREE.Group();
  private readonly orbs = new Map<number, { group: THREE.Group; info: OrbInfo; phase: number }>();
  private t = 0;

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.orbs.size;
  }

  /** 서버 목록과 맞춘다 (세계에 들어갈 때·떨어질 때) */
  set(list: readonly OrbInfo[]): void {
    const seen = new Set<number>();
    for (const o of list) {
      seen.add(o.id);
      if (!this.orbs.has(o.id)) this.add(o);
    }
    for (const id of [...this.orbs.keys()]) if (!seen.has(id)) this.remove(id);
  }

  add(o: OrbInfo): void {
    if (this.orbs.has(o.id)) return;
    const g = new THREE.Group();
    const core = new THREE.Mesh(GEOM, CORE);
    const glow = new THREE.Mesh(GEOM, GLOW);
    glow.scale.setScalar(1.8 + Math.min(1.5, o.amount / 40)); // 큰 구슬은 더 빛난다
    g.add(glow, core);
    g.position.set(o.x, o.y + 0.3, o.z);
    this.group.add(g);
    this.orbs.set(o.id, { group: g, info: o, phase: (o.id * 0.7) % (Math.PI * 2) });
  }

  remove(id: number): void {
    const e = this.orbs.get(id);
    if (!e) return;
    this.group.remove(e.group);
    this.orbs.delete(id);
  }

  clear(): void {
    for (const id of [...this.orbs.keys()]) this.remove(id);
  }

  update(dt: number): void {
    this.t += dt;
    for (const e of this.orbs.values()) {
      e.group.rotation.y = this.t * 2 + e.phase;
      e.group.position.y = e.info.y + 0.3 + 0.08 * Math.sin(this.t * 3 + e.phase);
    }
  }
}
