import * as THREE from 'three';

/**
 * 포탈 문틀 안의 보라색 막 (M3). 블록이 아니라 그림만 — 서버 세계와 어긋나지 않고 지형 버전도 안 바뀐다.
 * 문틀은 동서로 서 있고(z = portal.z), 안쪽 2×3 칸을 채운다.
 */
export class PortalView {
  private readonly mesh: THREE.Mesh;
  private readonly material: THREE.MeshBasicMaterial;

  constructor(
    private readonly scene: THREE.Scene,
    portal: { x: number; y: number; z: number },
    color = 0x8a3ffc,
  ) {
    this.material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), this.material);
    this.mesh.position.set(portal.x, portal.y + 2.5, portal.z + 0.5);
    this.mesh.renderOrder = 5;
    scene.add(this.mesh);
  }

  update(t: number): void {
    this.material.opacity = 0.45 + 0.15 * Math.sin(t * 2.2);
    const h = 0.72 + 0.03 * Math.sin(t * 0.9);
    this.material.color.setHSL(h, 0.85, 0.6);
  }

  dispose(): void {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
