/**
 * 드래곤 빔 연출 (M6-5). 서버가 확정한 빔(누가·어디서·어느 방향·색·세기)을 1.5초 동안 그린다.
 * 조명 없는 씬이라 더하기 블렌딩으로 빛나 보이게 한다. 안쪽 하얀 심 + 바깥 색 빛 두 겹.
 * 0.15초 동안 사거리까지 뻗고, 끝 0.4초는 옅어지며 사라진다. 세기(1~5)가 두께와 밝기를 정한다.
 */
import { BEAM_DURATION_MS, BEAM_RANGE } from '@dragon-village/shared';
import * as THREE from 'three';

interface Beam {
  group: THREE.Group;
  core: THREE.Mesh;
  glow: THREE.Mesh;
  born: number;
  range: number;
}

const GROW_MS = 150;
const FADE_MS = 400;
/** 원통 지오메트리는 공유 (반지름 1, 길이 1 — 스케일로 맞춘다). y 축 방향이라 z 로 돌려 쓴다 */
const UNIT = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
UNIT.rotateX(Math.PI / 2);
UNIT.translate(0, 0, 0.5); // 시작점이 원점, +z 로 뻗는다

export class BeamView {
  private readonly group = new THREE.Group();
  private readonly beams: Beam[] = [];

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.beams.length;
  }

  /** from 에서 dir 방향으로 range 칸. color '#rrggbb', power 1~5 */
  fire(from: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, color: string, power: number, range = BEAM_RANGE, now = performance.now()): void {
    const p = Math.max(1, Math.min(5, power));
    const radius = 0.12 + 0.07 * p;
    const col = new THREE.Color(color);
    const core = new THREE.Mesh(UNIT, new THREE.MeshBasicMaterial({ color: col.clone().lerp(new THREE.Color(0xffffff), 0.4), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    const glow = new THREE.Mesh(UNIT, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35 + 0.08 * p, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    core.scale.set(radius * 0.45, radius * 0.45, 0.01);
    glow.scale.set(radius, radius, 0.01);
    const group = new THREE.Group();
    group.add(glow, core);
    group.position.set(from.x, from.y, from.z);
    const len = Math.hypot(dir.x, dir.y, dir.z) || 1;
    group.lookAt(from.x + dir.x / len, from.y + dir.y / len, from.z + dir.z / len); // +z 가 dir 을 보게
    this.group.add(group);
    this.beams.push({ group, core, glow, born: now, range });
  }

  update(now = performance.now()): void {
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i]!;
      const age = now - b.born;
      if (age >= BEAM_DURATION_MS) {
        this.group.remove(b.group);
        (b.core.material as THREE.Material).dispose();
        (b.glow.material as THREE.Material).dispose();
        this.beams.splice(i, 1);
        continue;
      }
      const len = b.range * Math.min(1, age / GROW_MS);
      b.core.scale.z = len;
      b.glow.scale.z = len;
      const fade = age > BEAM_DURATION_MS - FADE_MS ? (BEAM_DURATION_MS - age) / FADE_MS : 1;
      const pulse = 1 + 0.12 * Math.sin(age * 0.03);
      (b.core.material as THREE.MeshBasicMaterial).opacity = 0.95 * fade;
      (b.glow.material as THREE.MeshBasicMaterial).opacity = (0.35 + 0.08 * (b.glow.scale.x - 0.12) / 0.07) * fade * pulse;
    }
  }

  dispose(): void {
    for (const b of this.beams) {
      this.group.remove(b.group);
      (b.core.material as THREE.Material).dispose();
      (b.glow.material as THREE.Material).dispose();
    }
    this.beams.length = 0;
  }
}
