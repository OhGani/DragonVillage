/**
 * 폭죽 (#211, 아빠 2026-10-21 마인크래프트 폭죽 그림): 로켓이 쉭 올라갔다가 꼭대기에서 색색 불꽃으로 터진다.
 * 연출용 — 서버는 어디서(x,y,z)·어떤 씨앗(seed)으로 터지는지만 모두에게 알린다. 흔들림은 씨앗 xorshift (규칙 2 와 통일).
 */
import * as THREE from 'three';

/** 불꽃 색 (주색, 반짝이): 빨강·파랑·노랑·초록·보라 — 씨앗으로 고른다 */
const PALETTE: readonly [number, number][] = [
  [0xff3b30, 0xffd0c8],
  [0x4da3ff, 0xd6ecff],
  [0xffd60a, 0xfff6c0],
  [0x5ce65c, 0xd8ffd8],
  [0xc45cff, 0xf0d8ff],
];
const ROCKET_SPEED = 12;
const ROCKET_LIFE = 1.3;
const BURST_N = 180;
const BURST_LIFE = 1.7;
const GRAVITY = 2.6;

function rng(seed: number): () => number {
  let s = (seed | 0) || 0x9e3779b9;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

interface Rocket {
  mesh: THREE.Mesh;
  vy: number;
  life: number;
  seed: number;
  trail: Burst;
}
interface Burst {
  points: THREE.Points;
  pos: Float32Array;
  vel: Float32Array;
  age: number;
  life: number;
  gravity: number;
}

const ROCKET_GEOM = new THREE.BoxGeometry(0.1, 0.3, 0.1);
const ROCKET_MAT = new THREE.MeshBasicMaterial({ color: 0xffffff });

export class FireworkView {
  private readonly group = new THREE.Group();
  private readonly rockets: Rocket[] = [];
  private readonly bursts: Burst[] = [];
  /** 터질 때 소리 (Game 이 준다) */
  onPop: (() => void) | null = null;

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  /** 로켓 발사: (x,y,z) 에서 위로 */
  launch(x: number, y: number, z: number, seed: number): void {
    const mesh = new THREE.Mesh(ROCKET_GEOM, ROCKET_MAT);
    mesh.position.set(x, y, z);
    this.group.add(mesh);
    const r = rng(seed);
    const life = ROCKET_LIFE + r() * 0.5;
    const trail = this.makeBurst(x, y, z, 0xffc866, 0, 60, 0, 0.5, 1.2, seed, 0.08); // 꼬리 불똥은 로켓이 가며 하나씩 켠다 (작게)
    this.rockets.push({ mesh, vy: ROCKET_SPEED, life, seed, trail });
  }

  /** 점 n 개짜리 불꽃 한 덩이. speed 0 이면 제자리(꼬리용) */
  private makeBurst(x: number, y: number, z: number, color: number, speed: number, n: number, spread: number, life: number, gravity: number, seed = 1, size = 0.2): Burst {
    const r = rng(seed);
    const pos = new Float32Array(n * 3);
    const vel = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // 공 표면에 고르게
      const u = r() * 2 - 1,
        a = r() * Math.PI * 2,
        k = Math.sqrt(1 - u * u);
      const s = speed * (0.6 + r() * 0.4 + spread * r());
      pos[i * 3] = x;
      pos[i * 3 + 1] = speed === 0 ? -999 : y; // 꼬리용(제자리)은 쓰기 전까지 땅 밑에 숨긴다
      pos[i * 3 + 2] = z;
      vel[i * 3] = k * Math.cos(a) * s;
      vel[i * 3 + 1] = u * s;
      vel[i * 3 + 2] = k * Math.sin(a) * s;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 1, depthWrite: false, sizeAttenuation: true });
    const points = new THREE.Points(geom, mat);
    points.frustumCulled = false;
    this.group.add(points);
    const b: Burst = { points, pos, vel, age: 0, life, gravity };
    this.bursts.push(b);
    return b;
  }

  private explode(r: Rocket): void {
    const [main, spark] = PALETTE[Math.abs(r.seed) % PALETTE.length]!;
    const { x, y, z } = r.mesh.position;
    this.makeBurst(x, y, z, main, 7.5, BURST_N, 0.3, BURST_LIFE, GRAVITY, r.seed, 0.22);
    this.makeBurst(x, y, z, spark, 5.5, Math.floor(BURST_N / 3), 0.5, BURST_LIFE * 0.8, GRAVITY, r.seed ^ 0x55aa, 0.14);
    this.onPop?.();
  }

  update(dt: number): void {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i]!;
      r.mesh.position.y += r.vy * dt;
      r.vy = Math.max(3, r.vy - 2.5 * dt);
      r.life -= dt;
      // 꼬리: 로켓 자리에 불똥 하나를 남긴다(제자리 점을 순서대로 로켓 위치로)
      const t = r.trail;
      const k = Math.floor((1 - r.life / (ROCKET_LIFE + 0.5)) * (t.pos.length / 3)) % (t.pos.length / 3);
      t.pos[k * 3] = r.mesh.position.x + (Math.sin(r.life * 40) * 0.05);
      t.pos[k * 3 + 1] = r.mesh.position.y - 0.3;
      t.pos[k * 3 + 2] = r.mesh.position.z;
      (t.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      t.age = 0; // 로켓이 사는 동안 꼬리는 안 사라진다
      if (r.life <= 0) {
        this.group.remove(r.mesh);
        this.explode(r);
        this.rockets.splice(i, 1);
      }
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      b.age += dt;
      const n = b.pos.length / 3;
      for (let k = 0; k < n; k++) {
        b.vel[k * 3 + 1] -= b.gravity * dt;
        const damp = 1 - 0.9 * dt;
        b.vel[k * 3] *= damp;
        b.vel[k * 3 + 1] *= damp;
        b.vel[k * 3 + 2] *= damp;
        b.pos[k * 3] += b.vel[k * 3]! * dt;
        b.pos[k * 3 + 1] += b.vel[k * 3 + 1]! * dt;
        b.pos[k * 3 + 2] += b.vel[k * 3 + 2]! * dt;
      }
      (b.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      const mat = b.points.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, 1 - b.age / b.life);
      if (b.age >= b.life) {
        this.group.remove(b.points);
        b.points.geometry.dispose();
        mat.dispose();
        this.bursts.splice(i, 1);
      }
    }
  }
}
