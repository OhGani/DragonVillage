/**
 * 원정 몹 그리기 (M7-2·M7-3): 서버 MobsState(20Hz)를 부드럽게 따라가는 좀비·크리퍼·거미 복셀 인형.
 * 좀비는 플레이어 인형 생성기에 초록 피부·낡은 옷 팔레트, 팔은 앞으로. 크리퍼는 머리 8 + 몸 4×12 + 다리 넷.
 * 거미(M7-3)는 머리(붉은 눈 여덟)·가슴·큰 배 + 다리 여덟(따로 메시, 걷는 대로 흔든다). 넓고 낮다(mobSize).
 * 맞으면 붉게 깜빡, 크리퍼가 부풀 때 하얘지며 커진다, 죽거나 터지면 조각이 흩어진다.
 * 머리 위 체력 바(빨강, 숫자)와 맞을 때 떠오르는 피해 숫자 — 맞았다는 게 한눈에 보이게 (#94).
 */
import { MOB_KIND_OF, MOB_STATE, type MobEntry, mobSize } from '@dragon-village/shared';
import { MOBS } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { PLAYER_SHADES, type SkinPalette, VOXEL, playerVoxels } from './playerModel';
import { type Voxel, buildVoxelGeometry } from './voxelGeometry';

const ZOMBIE: SkinPalette = { shirt: 0x2f6a7a, skin: 0x5d8b4a, hair: 0x2c3e2b, pants: 0x3a3560, shoes: 0x25211f };
const CREEPER_GREEN = 0x4caf50;
const SPIDER_DARK = 0x2a2320;

function css(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0');
}

/** 크리퍼 복셀: 머리 8×8×8 (앞면에 검은 얼굴), 몸 4×12×4, 다리 4개 4×6×4. 앞이 −z */
function creeperVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  const mottle = (x: number, y: number, z: number) => {
    const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    const k = 0.85 + ((h >>> 0) % 100) / 100 * 0.3;
    const r = Math.min(255, Math.round(0x4c * k)),
      g = Math.min(255, Math.round(0xaf * k)),
      b = Math.min(255, Math.round(0x50 * k));
    return (r << 16) | (g << 8) | b;
  };
  // 다리 넷 (앞 두 개, 뒤 두 개)
  for (const [lx, lz] of [
    [-4, -4],
    [0, -4],
    [-4, 1],
    [0, 1],
  ] as [number, number][])
    add(lx, lx + 3, 0, 5, lz, lz + 3, mottle);
  // 몸통 4×12×4 (x -2..1, z -2..1)
  add(-2, 1, 6, 17, -2, 1, mottle);
  // 머리 8×8×8 (x -4..3, z -4..3), 앞면 z=-4 에 얼굴
  const FACE = ['        ', '        ', ' xx  xx ', ' xx  xx ', '   xx   ', '  xxxx  ', '  x  x  ', '  x  x  '];
  add(-4, 3, 18, 25, -4, 3, (x, y, z) => {
    if (z === -4 && FACE[25 - y]![x + 4] === 'x') return 0x101410;
    return mottle(x, y, z);
  });
  return out;
}

/** 거미 몸통 복셀: 머리 8×8×6 (앞면 z=-11 에 붉은 눈 여덟), 가슴 6×6×6, 배 10×8×12. 앞이 −z, 바닥 y 0 은 다리 끝 */
function spiderBodyVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const mottle = (x: number, y: number, z: number, base: number) => {
    const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    const k = 0.85 + (((h >>> 0) % 100) / 100) * 0.3;
    const r = Math.min(255, Math.round(((base >> 16) & 255) * k)),
      g = Math.min(255, Math.round(((base >> 8) & 255) * k)),
      b = Math.min(255, Math.round((base & 255) * k));
    return (r << 16) | (g << 8) | b;
  };
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  // 배 (뒤, 크다)
  add(-5, 4, 5, 12, 1, 12, (x, y, z) => mottle(x, y, z, 0x3a2f2a));
  // 가슴
  add(-3, 2, 6, 11, -5, 0, (x, y, z) => mottle(x, y, z, SPIDER_DARK));
  // 머리 + 눈
  const EYES = ['        ', ' r    r ', 'r r  r r', ' r    r ', '  r  r  ', '        ', '        ', '        '];
  add(-4, 3, 5, 12, -11, -6, (x, y, z) => {
    if (z === -11 && EYES[12 - y]![x + 4] === 'r') return 0xd02020;
    return mottle(x, y, z, SPIDER_DARK);
  });
  return out;
}

/** 거미 다리 하나: 가로 14×2×2 막대 (x 0..13), 몸에 붙는 쪽이 x 0 */
function spiderLegVoxels(): Voxel[] {
  const out: Voxel[] = [];
  for (let x = 0; x < 14; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) out.push({ x, y, z, c: css(x > 9 ? 0x1a1614 : 0x241e1b) });
  return out;
}

/** 캔버스 스프라이트 (체력 바·피해 숫자). 그리기는 draw 가 맡는다 */
function canvasSprite(w: number, h: number, scaleW: number, scaleH: number): { sprite: THREE.Sprite; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  sprite.scale.set(scaleW, scaleH, 1);
  return { sprite, ctx, tex };
}

function drawHpBar(ctx: CanvasRenderingContext2D, tex: THREE.CanvasTexture, hp: number, max: number): void {
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 6, w, h - 12);
  const ratio = Math.max(0, Math.min(1, hp / Math.max(1, max)));
  ctx.fillStyle = ratio > 0.5 ? '#e53935' : ratio > 0.25 ? '#fb8c00' : '#ffd600';
  ctx.fillRect(3, 9, (w - 6) * ratio, h - 18);
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.lineWidth = 3;
  ctx.strokeText(`${hp} / ${max}`, w / 2, h / 2);
  ctx.fillText(`${hp} / ${max}`, w / 2, h / 2);
  tex.needsUpdate = true;
}

function partMesh(voxels: readonly Voxel[], material: THREE.Material): THREE.Mesh {
  const geom = buildVoxelGeometry(voxels, VOXEL, PLAYER_SHADES);
  geom.translate(VOXEL / 2, 0, VOXEL / 2);
  return new THREE.Mesh(geom, material);
}

interface Figure {
  group: THREE.Group;
  body: THREE.Group;
  material: THREE.MeshBasicMaterial;
  kind: number;
  cur: { x: number; y: number; z: number; yaw: number };
  target: { x: number; y: number; z: number; yaw: number };
  state: number;
  hp: number;
  flashUntil: number;
  fuseT: number;
  armL: THREE.Mesh | null;
  armR: THREE.Mesh | null;
  legL: THREE.Mesh | null;
  legR: THREE.Mesh | null;
  /** 거미 다리 여덟 (왼 넷, 오른 넷) */
  spiderLegs: THREE.Mesh[];
  walk: number;
  /** 머리 위 체력 바 */
  bar: { sprite: THREE.Sprite; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture };
  maxHp: number;
  shownHp: number;
}

/** 떠오르는 피해 숫자 */
interface Pop {
  sprite: THREE.Sprite;
  born: number;
}

interface Burst {
  group: THREE.Group;
  born: number;
  parts: { m: THREE.Mesh; v: THREE.Vector3 }[];
}

const BURST_GEOM = new THREE.BoxGeometry(0.16, 0.16, 0.16);

export class MobView {
  private readonly group = new THREE.Group();
  private readonly figures = new Map<number, Figure>();
  private readonly bursts: Burst[] = [];
  private readonly pops: Pop[] = [];

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.figures.size;
  }

  private make(m: MobEntry): Figure {
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const group = new THREE.Group();
    const body = new THREE.Group();
    let armL: THREE.Mesh | null = null,
      armR: THREE.Mesh | null = null,
      legL: THREE.Mesh | null = null,
      legR: THREE.Mesh | null = null;
    const spiderLegs: THREE.Mesh[] = [];
    if (MOB_KIND_OF[m.kind] === 'zombie') {
      const v = playerVoxels(ZOMBIE);
      const at = (mesh: THREE.Mesh, spot: readonly [number, number]) => {
        mesh.position.set(spot[0] * VOXEL, spot[1] * VOXEL, 0);
        return mesh;
      };
      const torso = at(partMesh(v.torso, material), [0, 12]);
      const head = at(partMesh(v.head, material), [0, 24]);
      legL = at(partMesh(v.leg, material), [-2, 12]);
      legR = at(partMesh(v.leg, material), [2, 12]);
      armL = at(partMesh(v.arm, material), [-6, 24]);
      armR = at(partMesh(v.arm, material), [6, 24]);
      armL.rotation.x = armR.rotation.x = -Math.PI / 2 + 0.15; // 좀비 팔은 앞으로
      body.add(torso, head, legL, legR, armL, armR);
    } else if (MOB_KIND_OF[m.kind] === 'spider') {
      body.add(partMesh(spiderBodyVoxels(), material));
      const legGeom = buildVoxelGeometry(spiderLegVoxels(), VOXEL, PLAYER_SHADES);
      legGeom.translate(0, -VOXEL, -VOXEL); // 붙는 쪽 끝이 원점
      for (let i = 0; i < 8; i++) {
        const right = i >= 4;
        const k = i % 4;
        const leg = new THREE.Mesh(legGeom, material);
        leg.position.set((right ? 3 : -3) * VOXEL, 9 * VOXEL, (-4 + k * 3) * VOXEL);
        // 바깥으로 뻗고(y) 아래로 처진다(z). 앞다리는 앞으로, 뒷다리는 뒤로
        leg.rotation.set(0, (right ? 0 : Math.PI) + (right ? 1 : -1) * (0.55 - k * 0.37), right ? -0.75 : 0.75);
        leg.userData.baseY = leg.rotation.y;
        spiderLegs.push(leg);
        body.add(leg);
      }
    } else {
      body.add(partMesh(creeperVoxels(), material));
    }
    group.add(body);
    // 체력 바: 머리 위, 몸과 따로(돌지도 커지지도 않는다)
    const kindName = MOB_KIND_OF[m.kind] ?? 'zombie';
    const maxHp = MOBS.get(kindName).hp;
    const bar = canvasSprite(128, 28, 1.1, 0.24);
    bar.sprite.position.set(0, mobSize(m.kind).h + 0.35, 0);
    drawHpBar(bar.ctx, bar.tex, m.hp, maxHp);
    group.add(bar.sprite);
    this.group.add(group);
    return { group, body, material, kind: m.kind, cur: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, target: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, state: m.state, hp: m.hp, flashUntil: 0, fuseT: 0, armL, armR, legL, legR, spiderLegs, walk: 0, bar, maxHp, shownHp: m.hp };
  }

  /** 서버 상태 묶음 (20Hz). 목록에 없는 몹은 지운다 */
  setState(list: readonly MobEntry[]): void {
    const seen = new Set<number>();
    for (const m of list) {
      seen.add(m.id);
      let f = this.figures.get(m.id);
      if (!f) {
        f = this.make(m);
        f.group.position.set(m.x, m.y, m.z);
        this.figures.set(m.id, f);
      }
      f.target = { x: m.x, y: m.y, z: m.z, yaw: m.yaw };
      f.state = m.state;
      f.hp = m.hp;
      if (f.shownHp !== m.hp) {
        f.shownHp = m.hp;
        drawHpBar(f.bar.ctx, f.bar.tex, m.hp, f.maxHp);
      }
    }
    for (const id of [...this.figures.keys()]) if (!seen.has(id)) this.remove(id);
  }

  /** 서버 mob 이벤트. hit 이면 dmg 만큼 피해 숫자가 떠오른다 */
  event(ev: string, id: number, x: number, y: number, z: number, now = performance.now(), dmg?: number): void {
    const f = this.figures.get(id);
    if (ev === 'hit') {
      if (f) {
        f.flashUntil = now + 160;
        // 서버 자리로 바로 당긴다 (밀려난 게 보이게)
        f.target = { ...f.target, x, y, z };
        if (f.hp > 0 && dmg) {
          f.hp = Math.max(0, f.hp - dmg);
          f.shownHp = f.hp;
          drawHpBar(f.bar.ctx, f.bar.tex, f.hp, f.maxHp);
        }
      }
      if (dmg) this.pop(x, y + mobSize(f?.kind ?? 0).h + 0.7, z, dmg, now);
    } else if (ev === 'die' || ev === 'explode') {
      const color = ev === 'explode' ? 0xffd27a : !f ? 0xffffff : f.kind === 0 ? 0x5d8b4a : f.kind === 2 ? SPIDER_DARK : CREEPER_GREEN;
      this.burst(x, y + mobSize(f?.kind ?? 0).h * 0.5, z, color, ev === 'explode' ? 28 : 12, now);
      this.remove(id);
    }
  }

  /** 떠오르는 피해 숫자 "-N" */
  private pop(x: number, y: number, z: number, dmg: number, now: number): void {
    const c = canvasSprite(96, 48, 0.9, 0.45);
    c.ctx.font = 'bold 34px system-ui, sans-serif';
    c.ctx.textAlign = 'center';
    c.ctx.textBaseline = 'middle';
    c.ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    c.ctx.lineWidth = 6;
    c.ctx.fillStyle = '#ffeb3b';
    c.ctx.strokeText(`-${dmg}`, 48, 26);
    c.ctx.fillText(`-${dmg}`, 48, 26);
    c.tex.needsUpdate = true;
    c.sprite.position.set(x, y, z);
    this.group.add(c.sprite);
    this.pops.push({ sprite: c.sprite, born: now });
  }

  private burst(x: number, y: number, z: number, color: number, n: number, now: number): void {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const parts: { m: THREE.Mesh; v: THREE.Vector3 }[] = [];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(BURST_GEOM, mat);
      const a = (i / n) * Math.PI * 2,
        b = ((i * 7) % n) / n - 0.5;
      const v = new THREE.Vector3(Math.cos(a) * (2 + b), 2.5 + b * 2, Math.sin(a) * (2 + b));
      m.position.set(x, y, z);
      parts.push({ m, v });
      group.add(m);
    }
    this.group.add(group);
    this.bursts.push({ group, born: now, parts });
  }

  remove(id: number): void {
    const f = this.figures.get(id);
    if (!f) return;
    this.group.remove(f.group);
    f.material.dispose();
    f.bar.tex.dispose();
    f.bar.sprite.material.dispose();
    f.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.figures.delete(id);
  }

  clear(): void {
    for (const id of [...this.figures.keys()]) this.remove(id);
    for (const b of this.bursts) this.group.remove(b.group);
    this.bursts.length = 0;
    for (const p of this.pops) this.group.remove(p.sprite);
    this.pops.length = 0;
  }

  /** 조준선이 닿는 몹 (가장 가까운 것). 눈에서 maxDist 안 */
  aim(eye: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, maxDist: number): number | null {
    let best: number | null = null;
    let bestT = maxDist;
    for (const [id, f] of this.figures) {
      const c = f.cur;
      const size = mobSize(f.kind);
      const hw = size.w / 2;
      const min = [c.x - hw, c.y, c.z - hw],
        max = [c.x + hw, c.y + size.h, c.z + hw];
      const o = [eye.x, eye.y, eye.z],
        d = [dir.x, dir.y, dir.z];
      let t0 = 0,
        t1 = bestT;
      let ok = true;
      for (let i = 0; i < 3 && ok; i++) {
        if (Math.abs(d[i]!) < 1e-9) {
          if (o[i]! < min[i]! || o[i]! > max[i]!) ok = false;
          continue;
        }
        let a = (min[i]! - o[i]!) / d[i]!,
          b = (max[i]! - o[i]!) / d[i]!;
        if (a > b) [a, b] = [b, a];
        t0 = Math.max(t0, a);
        t1 = Math.min(t1, b);
        if (t0 > t1) ok = false;
      }
      if (ok && t0 < bestT) {
        bestT = t0;
        best = id;
      }
    }
    return best;
  }

  update(dt: number, now = performance.now()): void {
    const k = 1 - Math.exp(-dt * 12);
    for (const f of this.figures.values()) {
      const c = f.cur,
        t = f.target;
      const dx = t.x - c.x,
        dz = t.z - c.z;
      c.x += dx * k;
      c.y += (t.y - c.y) * k;
      c.z += dz * k;
      let dy = t.yaw - c.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      c.yaw += dy * k;
      f.group.position.set(c.x, c.y, c.z);
      f.body.rotation.y = c.yaw;
      const speed = Math.hypot(dx, dz) * 12;
      if (speed > 0.3) f.walk += dt * Math.min(10, speed * 2);
      const swing = speed > 0.3 ? Math.sin(f.walk) * 0.5 : 0;
      if (f.legL && f.legR) {
        f.legL.rotation.x = swing;
        f.legR.rotation.x = -swing;
      }
      f.spiderLegs.forEach((leg, i) => {
        const base = leg.userData.baseY as number;
        leg.rotation.y = base + (i % 2 === 0 ? swing : -swing) * 0.5;
      });
      // 크리퍼 부풀기: 하얘지며 커진다
      if (f.state === MOB_STATE.fuse) {
        f.fuseT += dt;
        const s = 1 + 0.25 * Math.min(1, f.fuseT / 1.5) + 0.06 * Math.sin(f.fuseT * 30);
        f.body.scale.set(s, s, s);
        f.material.color.setRGB(1 + f.fuseT, 1 + f.fuseT, 1 + f.fuseT);
      } else {
        f.fuseT = 0;
        f.body.scale.set(1, 1, 1);
        f.material.color.setRGB(1, 1, 1);
      }
      if (now < f.flashUntil) f.material.color.setRGB(2.2, 0.6, 0.6);
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      const age = (now - b.born) / 1000;
      if (age > 0.9) {
        this.group.remove(b.group);
        this.bursts.splice(i, 1);
        continue;
      }
      for (const p of b.parts) {
        p.m.position.addScaledVector(p.v, dt);
        p.v.y -= 9.8 * dt;
      }
      (b.parts[0]!.m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - age / 0.9);
    }
    for (let i = this.pops.length - 1; i >= 0; i--) {
      const p = this.pops[i]!;
      const age = (now - p.born) / 1000;
      if (age > 0.8) {
        this.group.remove(p.sprite);
        (p.sprite.material as THREE.SpriteMaterial).map?.dispose();
        p.sprite.material.dispose();
        this.pops.splice(i, 1);
        continue;
      }
      p.sprite.position.y += dt * 0.9;
      (p.sprite.material as THREE.SpriteMaterial).opacity = age < 0.5 ? 1 : 1 - (age - 0.5) / 0.3;
    }
  }
}
