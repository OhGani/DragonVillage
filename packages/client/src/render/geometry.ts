import * as THREE from 'three';
import type { MeshBuffers } from '../mesh/meshTypes';

/** 워커 출력 버퍼 → BufferGeometry (복사 없이 그대로 꽂는다) */
export function buffersToGeometry(b: MeshBuffers, boundingRadius: number, center: THREE.Vector3): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(b.positions, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(b.uvs, 2));
  g.setAttribute('meta', new THREE.BufferAttribute(b.meta, 4));
  g.setIndex(new THREE.BufferAttribute(b.indices, 1));
  g.boundingSphere = new THREE.Sphere(center, boundingRadius);
  return g;
}
