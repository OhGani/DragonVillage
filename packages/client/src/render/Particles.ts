/**
 * 블록 부스러기 (아빠 2026-09-24 "캐는 화면"): 캘 때 조각이 톡톡 튀고, 부서지면 와르르 흩어진다. 색은 블록 아이콘의 평균색.
 * 연출용 — 규칙과 무관, 서버는 모른다. 흔들림은 시드 xorshift(규칙 2 의 Math.random 금지는 지형·규칙 코드용이지만 여기서도 통일).
 */
import * as THREE from 'three';

interface Part {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  born: number;
  life: number;
}

const GEOM = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const SMALL = new THREE.BoxGeometry(0.06, 0.06, 0.06);
let rs = 0x2545f491;
function rnd(): number {
  rs ^= rs << 13;
  rs ^= rs >>> 17;
  rs ^= rs << 5;
  return (rs >>> 0) / 4294967296;
}

/** 캔버스 그림의 평균색 (투명 픽셀 제외). 못 읽으면 회색 */
export function canvasAverageColor(canvas: HTMLCanvasElement | null): number {
  if (!canvas) return 0x9e9e9e;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0x9e9e9e;
  const { width: w, height: h } = canvas;
  const d = ctx.getImageData(0, 0, w, h).data;
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3]! < 128) continue;
    r += d[i]!;
    g += d[i + 1]!;
    b += d[i + 2]!;
    n++;
  }
  if (n === 0) return 0x9e9e9e;
  return (Math.round(r / n) << 16) | (Math.round(g / n) << 8) | Math.round(b / n);
}

export class Particles {
  private readonly group = new THREE.Group();
  private readonly parts: Part[] = [];
  private readonly materials = new Map<number, THREE.MeshBasicMaterial>();

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  private material(color: number): THREE.MeshBasicMaterial {
    let m = this.materials.get(color);
    if (!m) {
      m = new THREE.MeshBasicMaterial({ color });
      this.materials.set(color, m);
    }
    return m;
  }

  private add(geom: THREE.BufferGeometry, color: number, x: number, y: number, z: number, vel: THREE.Vector3, life: number, now: number): void {
    const mesh = new THREE.Mesh(geom, this.material(color));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rnd() * 3, rnd() * 3, 0);
    this.group.add(mesh);
    this.parts.push({ mesh, vel, born: now, life });
    if (this.parts.length > 400) this.drop(0);
  }

  /** 블록이 부서졌다: 블록 안 여기저기서 조각이 튄다 */
  burst(bx: number, by: number, bz: number, color: number, n = 16, now = performance.now()): void {
    for (let i = 0; i < n; i++) {
      const x = bx + 0.15 + rnd() * 0.7,
        y = by + 0.15 + rnd() * 0.7,
        z = bz + 0.15 + rnd() * 0.7;
      const v = new THREE.Vector3((x - bx - 0.5) * 4 + (rnd() - 0.5) * 1.5, 2 + rnd() * 2.5, (z - bz - 0.5) * 4 + (rnd() - 0.5) * 1.5);
      this.add(GEOM, color, x, y, z, v, 0.7 + rnd() * 0.4, now);
    }
  }

  /** 캐는 중: 보는 면에서 작은 조각 하나가 톡 튄다. face = 0..5 (+X -X +Y -Y +Z -Z) */
  crumb(bx: number, by: number, bz: number, face: number, color: number, now = performance.now()): void {
    const n = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ][face] ?? [0, 1, 0];
    const cx = bx + 0.5 + n[0]! * 0.52 + (n[0] ? 0 : (rnd() - 0.5) * 0.8),
      cy = by + 0.5 + n[1]! * 0.52 + (n[1] ? 0 : (rnd() - 0.5) * 0.8),
      cz = bz + 0.5 + n[2]! * 0.52 + (n[2] ? 0 : (rnd() - 0.5) * 0.8);
    const v = new THREE.Vector3(n[0]! * 1.2 + (rnd() - 0.5), 1.5 + rnd() + n[1]! * 1.2, n[2]! * 1.2 + (rnd() - 0.5));
    this.add(SMALL, color, cx, cy, cz, v, 0.45 + rnd() * 0.2, now);
  }

  private drop(i: number): void {
    const p = this.parts[i]!;
    this.group.remove(p.mesh);
    this.parts.splice(i, 1);
  }

  update(dt: number, now = performance.now()): void {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]!;
      const age = (now - p.born) / 1000;
      if (age > p.life) {
        this.drop(i);
        continue;
      }
      p.vel.y -= 12 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += dt * 4;
      const s = age > p.life - 0.2 ? Math.max(0.1, (p.life - age) / 0.2) : 1;
      p.mesh.scale.setScalar(s);
    }
  }

  get count(): number {
    return this.parts.length;
  }
}
