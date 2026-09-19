import * as THREE from 'three';
import { FOG_COLOR, SKY_COLOR } from './ChunkMaterial';

/** 하늘 돔 — 그라데이션 + 해. 카메라를 따라다닌다. */
export class Sky {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene) {
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uZenith: { value: new THREE.Color(0x4f7fe8) },
        uHorizon: { value: SKY_COLOR.clone() },
        uFog: { value: FOG_COLOR.clone() },
        uVoid: { value: new THREE.Color(0x2b3a5c) },
        uSunDir: { value: new THREE.Vector3(0.45, 0.72, 0.3).normalize() },
      },
      vertexShader: /* glsl */ `
        out vec3 vDir;
        void main() {
          vDir = position;
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww; // 항상 가장 멀리
        }
      `,
      fragmentShader: /* glsl */ `
        out vec4 fragColor;
        uniform vec3 uZenith, uHorizon, uFog, uVoid, uSunDir;
        in vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 col = mix(uFog, uHorizon, smoothstep(0.0, 0.12, d.y));
          col = mix(col, uZenith, smoothstep(0.1, 0.6, d.y));
          if (d.y < 0.0) col = mix(uFog, uVoid, smoothstep(0.0, -0.35, d.y));
          float s = dot(d, uSunDir);
          if (s > 0.9988) col = vec3(1.0, 0.98, 0.92);
          else if (s > 0.995) col = mix(col, vec3(1.0, 0.96, 0.85), 0.35);
          fragColor = vec4(col, 1.0);
        }
      `,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), this.material);
    this.mesh.scale.setScalar(400);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -100;
    scene.add(this.mesh);
  }

  update(cameraPos: THREE.Vector3): void {
    this.mesh.position.copy(cameraPos);
  }

  /** 낮 1 → 밤 0.22 (원정 낮밤, M3). 색을 어둡게 하고 밤에는 살짝 푸르게 */
  setBrightness(v: number): void {
    const u = this.material.uniforms;
    const night = 1 - v;
    (u.uZenith.value as THREE.Color).setHex(0x4f7fe8).multiplyScalar(v).lerp(new THREE.Color(0x0a1230), night * 0.6);
    (u.uHorizon.value as THREE.Color).copy(SKY_COLOR).multiplyScalar(v).lerp(new THREE.Color(0x141c3a), night * 0.6);
    (u.uFog.value as THREE.Color).copy(FOG_COLOR).multiplyScalar(Math.max(0.35, v));
    (u.uVoid.value as THREE.Color).setHex(0x2b3a5c).multiplyScalar(v);
    this.material.uniforms.uSunDir.value.set(0.45, 0.72 * (0.3 + 0.7 * v) - 0.2 * night, 0.3).normalize();
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
