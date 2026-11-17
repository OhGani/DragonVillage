/**
 * 날씨 그림 (2026-11-17): 비 줄기·눈송이·번개.
 * - 빗방울은 카메라 둘레 RADIUS 칸 안의 기둥마다 떨어지다가 그 기둥의 가장 높은 블록에 닿으면 다시 위에서 시작한다.
 *   지붕 밑·동굴 속에는 안 내린다 (기둥 꼭대기가 시작 높이보다 높으면 숨긴다).
 * - 한 장짜리 사각형을 GPU 인스턴스로 그린다. 비는 세로로 긴 줄(카메라 쪽으로만 돈다), 눈은 둥근 점.
 * - 번개는 위에서 아래로 꺾인 굵은 줄, 0.4초 동안 깜빡인다.
 * 연출용 — 규칙과 무관. 흔들림은 시드 xorshift.
 */
import * as THREE from 'three';
import type { WeatherFall, WeatherKind } from '@dragon-village/shared';

let rs = 0x6d2b79f5;
function rnd(): number {
  rs ^= rs << 13;
  rs ^= rs >>> 17;
  rs ^= rs << 5;
  return (rs >>> 0) / 4294967296;
}

/** 카메라 둘레 이만큼 (칸) 안에 내린다 */
const RADIUS = 14;
/** 카메라 위 이만큼에서 떨어지기 시작 */
const TOP = 16;
/** 기둥 꼭대기 기억은 이만큼마다 새로 (블록이 바뀌어도 곧 맞춰진다) */
const COLUMN_TTL_MS = 1500;

/** 기둥 (x, z) 의 가장 높은 단단한 블록·액체 윗면 높이. 없으면 -Infinity */
export type ColumnTop = (x: number, z: number) => number;

interface Drop {
  x: number;
  y: number;
  z: number;
  speed: number;
  /** 눈이 옆으로 흔들리는 박자 */
  phase: number;
}

const VERT = /* glsl */ `
  in vec3 aOffset;
  uniform vec3 uRight;
  uniform vec3 uUp;
  uniform vec2 uSize;
  out vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = aOffset + uRight * position.x * uSize.x + uUp * position.y * uSize.y;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uSnow;
  in vec2 vUv;
  out vec4 fragColor;
  void main() {
    float a;
    if (uSnow > 0.5) {
      vec2 d = vUv - 0.5;
      float r = length(d);
      if (r > 0.5) discard;
      a = 1.0 - smoothstep(0.3, 0.5, r);
    } else {
      a = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y)); // 줄 끝은 흐리게
    }
    fragColor = vec4(uColor, a * uAlpha);
  }
`;

export class WeatherView {
  private readonly drops: Drop[] = [];
  private readonly offsets: Float32Array;
  private readonly attr: THREE.InstancedBufferAttribute;
  private readonly geom: THREE.InstancedBufferGeometry;
  private readonly material: THREE.ShaderMaterial;
  private readonly mesh: THREE.Mesh;
  private readonly columns = new Map<number, { top: number; at: number }>();
  private kind: WeatherKind = 'clear';
  private fall: WeatherFall = 'none';
  /** 0 → 1 로 천천히 (비가 시작·그칠 때) */
  private amount = 0;
  private readonly bolts: { mesh: THREE.Group; born: number }[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    private readonly max: number,
  ) {
    this.offsets = new Float32Array(max * 3);
    const base = new THREE.PlaneGeometry(1, 1);
    this.geom = new THREE.InstancedBufferGeometry();
    this.geom.index = base.index;
    this.geom.setAttribute('position', base.getAttribute('position'));
    this.geom.setAttribute('uv', base.getAttribute('uv'));
    this.attr = new THREE.InstancedBufferAttribute(this.offsets, 3);
    this.attr.setUsage(THREE.DynamicDrawUsage);
    this.geom.setAttribute('aOffset', this.attr);
    this.geom.instanceCount = 0;
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uRight: { value: new THREE.Vector3(1, 0, 0) },
        uUp: { value: new THREE.Vector3(0, 1, 0) },
        uSize: { value: new THREE.Vector2(0.05, 0.8) },
        uColor: { value: new THREE.Color(0x9cb8e0) },
        uAlpha: { value: 0.55 },
        uSnow: { value: 0 },
      },
    });
    this.mesh = new THREE.Mesh(this.geom, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    this.mesh.visible = false;
    scene.add(this.mesh);
    for (let i = 0; i < max; i++) this.drops.push({ x: 0, y: -1e4, z: 0, speed: 0, phase: rnd() * Math.PI * 2 });
  }

  /** 날씨가 바뀌었다 (서버 weather). quiet 면 바로 그 양으로 (들어올 때) */
  set(kind: WeatherKind, fall: WeatherFall, quiet = false): void {
    const wasSnow = this.fall === 'snow';
    this.kind = kind;
    this.fall = fall;
    if (quiet) this.amount = this.target();
    const snow = fall === 'snow';
    if (snow !== wasSnow) for (const d of this.drops) d.y = -1e4; // 비 ↔ 눈: 처음부터 다시
    const u = this.material.uniforms;
    u.uSnow!.value = snow ? 1 : 0;
    (u.uSize!.value as THREE.Vector2).set(snow ? 0.13 : 0.05, snow ? 0.13 : 0.8);
    (u.uColor!.value as THREE.Color).setHex(snow ? 0xffffff : 0x9cb8e0);
  }

  /** 지금 내리는 양 0~1 (소리·안개가 따라간다) */
  get level(): number {
    return this.fall === 'rain' || this.fall === 'snow' ? this.amount : 0;
  }

  private target(): number {
    if (this.kind === 'clear' || (this.fall !== 'rain' && this.fall !== 'snow')) return 0;
    return this.kind === 'thunder' ? 1 : 0.75;
  }

  /** 블록이 바뀌었다 — 그 기둥 꼭대기를 다시 잰다 */
  columnChanged(x: number, z: number): void {
    this.columns.delete(colKey(x, z));
  }
  /** 세계가 바뀌었다 (마을 ↔ 원정) */
  reset(): void {
    this.columns.clear();
    for (const d of this.drops) d.y = -1e4;
    for (const b of this.bolts) this.scene.remove(b.mesh);
    this.bolts.length = 0;
  }

  private topOf(x: number, z: number, top: ColumnTop, now: number): number {
    const k = colKey(x, z);
    const c = this.columns.get(k);
    if (c && now - c.at < COLUMN_TTL_MS) return c.top;
    const t = top(x, z);
    this.columns.set(k, { top: t, at: now });
    if (this.columns.size > 4000) this.columns.clear();
    return t;
  }

  /** 매 프레임. light = 하늘 밝기(밤엔 어둡게) */
  update(dt: number, camera: THREE.Camera, top: ColumnTop, light: number, now: number): void {
    this.updateBolts(now);
    const want = this.target();
    this.amount += Math.sign(want - this.amount) * Math.min(Math.abs(want - this.amount), dt * 0.35);
    const n = Math.floor(this.max * this.amount);
    this.mesh.visible = n > 0;
    this.geom.instanceCount = n;
    if (n === 0) return;
    const snow = this.fall === 'snow';
    const cx = camera.position.x,
      cy = camera.position.y,
      cz = camera.position.z;
    // 비는 세로 그대로 카메라 쪽으로만 돈다, 눈은 화면을 바로 본다
    const u = this.material.uniforms;
    const e = camera.matrixWorld.elements;
    const right = u.uRight!.value as THREE.Vector3;
    const up = u.uUp!.value as THREE.Vector3;
    if (snow) {
      right.set(e[0]!, e[1]!, e[2]!).normalize();
      up.set(e[4]!, e[5]!, e[6]!).normalize();
    } else {
      right.set(e[0]!, 0, e[2]!);
      if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
      right.normalize();
      up.set(0, 1, 0);
    }
    u.uAlpha!.value = (snow ? 0.9 : 0.5) * (0.35 + 0.65 * Math.min(1, light));
    const tilt = this.kind === 'thunder' ? 1.2 : 0.4; // 뇌우엔 비가 비스듬히
    for (let i = 0; i < n; i++) {
      const d = this.drops[i]!;
      // 카메라에서 멀어지면 반대편으로 (둥글게 감싼다)
      if (d.x - cx > RADIUS) d.x -= RADIUS * 2;
      else if (cx - d.x > RADIUS) d.x += RADIUS * 2;
      if (d.z - cz > RADIUS) d.z -= RADIUS * 2;
      else if (cz - d.z > RADIUS) d.z += RADIUS * 2;
      const floor = this.topOf(Math.floor(d.x), Math.floor(d.z), top, now);
      if (d.y < floor || d.y < cy - TOP || d.y > cy + TOP + 4) {
        // 다시 위에서. 기둥이 막혔으면(지붕 밑) 숨긴다
        d.x = cx + (rnd() * 2 - 1) * RADIUS;
        d.z = cz + (rnd() * 2 - 1) * RADIUS;
        d.y = cy + TOP * (0.3 + rnd() * 0.7);
        d.speed = snow ? 1.2 + rnd() * 0.8 : 14 + rnd() * 6;
        const f2 = this.topOf(Math.floor(d.x), Math.floor(d.z), top, now);
        if (f2 >= d.y) d.y = -1e4;
      } else {
        d.y -= d.speed * dt;
        if (snow) {
          d.phase += dt * 1.7;
          d.x += Math.sin(d.phase) * 0.4 * dt;
          d.z += Math.cos(d.phase * 0.8) * 0.3 * dt;
        } else d.x += tilt * dt;
      }
      const near = (d.x - cx) ** 2 + (d.z - cz) ** 2 < 2.25 && Math.abs(d.y - cy) < 2; // 눈앞 바로 앞 방울은 크게 번져 보여서 숨긴다
      this.offsets[i * 3] = d.x;
      this.offsets[i * 3 + 1] = near ? -1e4 : d.y;
      this.offsets[i * 3 + 2] = d.z;
    }
    this.attr.needsUpdate = true;
  }

  /** 번개 (서버 lightning): (x, y, z) 바닥까지 꺾인 줄 */
  bolt(x: number, y: number, z: number, now: number): void {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: 0xeef4ff, transparent: true, opacity: 1, depthWrite: false });
    const glow = new THREE.MeshBasicMaterial({ color: 0x9fb8ff, transparent: true, opacity: 0.35, depthWrite: false });
    let px = x,
      py = y + 70,
      pz = z;
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const nx = i === steps ? x : x + (rnd() * 2 - 1) * 2.2 * (1 - t * 0.6),
        ny = y + 70 * (1 - t),
        nz = i === steps ? z : z + (rnd() * 2 - 1) * 2.2 * (1 - t * 0.6);
      for (const [m, w] of [
        [mat, 0.22],
        [glow, 0.7],
      ] as const) {
        const len = Math.hypot(nx - px, ny - py, nz - pz);
        const seg = new THREE.Mesh(new THREE.BoxGeometry(w, len, w), m);
        seg.position.set((px + nx) / 2, (py + ny) / 2, (pz + nz) / 2);
        seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(nx - px, ny - py, nz - pz).normalize());
        g.add(seg);
      }
      px = nx;
      py = ny;
      pz = nz;
    }
    g.renderOrder = 6;
    this.scene.add(g);
    this.bolts.push({ mesh: g, born: now });
  }

  private updateBolts(now: number): void {
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i]!;
      const age = now - b.born;
      if (age > 450) {
        this.scene.remove(b.mesh);
        b.mesh.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            (o.material as THREE.Material).dispose();
          }
        });
        this.bolts.splice(i, 1);
        continue;
      }
      b.mesh.visible = !(age > 120 && age < 200) && !(age > 300 && age < 340); // 깜빡깜빡
    }
  }

  dispose(): void {
    this.reset();
    this.scene.remove(this.mesh);
    this.geom.dispose();
    this.material.dispose();
  }
}

function colKey(x: number, z: number): number {
  return ((x + 4096) << 13) | (z + 4096);
}
