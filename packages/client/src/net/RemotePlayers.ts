/**
 * 다른 플레이어 표시: 색 있는 복셀 인형(머리·몸·팔·다리) + 머리 위 이름.
 * 서버 위치(20Hz)를 받아 부드럽게 따라간다 (지수 보간, 약 100ms 지연).
 */
import { FLAG_SNEAK, type PlayerInfo, type PlayerStateEntry } from '@dragon-village/shared';
import * as THREE from 'three';
import { colorHex } from './colors';

interface Figure {
  info: PlayerInfo;
  group: THREE.Group;
  body: THREE.Group;
  label: THREE.Sprite;
  target: { x: number; y: number; z: number; yaw: number; pitch: number; flags: number };
  cur: { x: number; y: number; z: number; yaw: number };
  head: THREE.Mesh;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  walk: number;
  lastMove: number;
  bubble: { sprite: THREE.Sprite; until: number } | null;
}

const SKIN = 0xe8b89a;
const PANTS_DARKEN = 0.55;

function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const geom = new THREE.BoxGeometry(w, h, d);
  // 면마다 조금 다른 밝기 (조명 없는 씬에서 입체감)
  const colors = new Float32Array(geom.attributes.position.count * 3);
  const c = new THREE.Color(color);
  const shade = [0.75, 0.75, 1.0, 0.5, 0.85, 0.85]; // +X -X +Y -Y +Z -Z (BoxGeometry 면 순서)
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
      const i = (f * 4 + v) * 3;
      colors[i] = c.r * shade[f];
      colors[i + 1] = c.g * shade[f];
      colors[i + 2] = c.b * shade[f];
    }
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ vertexColors: true }));
}

function nameSprite(text: string, bg = 'rgba(0,0,0,0.45)'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = 'bold 40px system-ui, sans-serif';
  const w = Math.ceil(ctx.measureText(text).width) + 32;
  canvas.width = w;
  canvas.height = 56;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, 56);
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 16, 30);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  const scale = 0.55;
  sprite.scale.set((w / 56) * scale, scale, 1);
  return sprite;
}

export class RemotePlayers {
  readonly group = new THREE.Group();
  private readonly figures = new Map<number, Figure>();

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.figures.size;
  }

  upsert(info: PlayerInfo): void {
    this.remove(info.idx);
    const color = colorHex(info.color);
    const pants = new THREE.Color(color).multiplyScalar(PANTS_DARKEN).getHex();
    const group = new THREE.Group();
    const body = new THREE.Group();
    const torso = box(0.5, 0.7, 0.28, color);
    torso.position.y = 0.75 + 0.35;
    const head = box(0.48, 0.48, 0.48, SKIN);
    head.position.y = 1.45 + 0.24;
    const legL = box(0.22, 0.75, 0.24, pants);
    legL.position.set(-0.13, 0.375, 0);
    const legR = box(0.22, 0.75, 0.24, pants);
    legR.position.set(0.13, 0.375, 0);
    const armL = box(0.18, 0.66, 0.2, color);
    armL.position.set(-0.36, 0.78 + 0.33, 0);
    const armR = box(0.18, 0.66, 0.2, color);
    armR.position.set(0.36, 0.78 + 0.33, 0);
    // 눈
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x222233 });
    for (const sx of [-0.11, 0.11]) {
      const eye = new THREE.Mesh(eyeGeom, eyeMat);
      eye.position.set(sx, 0.06, -0.245);
      head.add(eye);
    }
    body.add(torso, head, legL, legR, armL, armR);
    group.add(body);
    const label = nameSprite(info.nick);
    label.position.y = 2.25;
    group.add(label);
    group.position.set(info.x, info.y, info.z);
    body.rotation.y = info.yaw;
    this.group.add(group);
    this.figures.set(info.idx, {
      info,
      group,
      body,
      label,
      head,
      legL,
      legR,
      armL,
      armR,
      target: { x: info.x, y: info.y, z: info.z, yaw: info.yaw, pitch: info.pitch, flags: 0 },
      cur: { x: info.x, y: info.y, z: info.z, yaw: info.yaw },
      walk: 0,
      lastMove: 0,
      bubble: null,
    });
  }

  /** 머리 위 말풍선 (채팅, 3초) */
  say(idx: number, text: string, seconds = 3): void {
    const f = this.figures.get(idx);
    if (!f) return;
    this.clearBubble(f);
    const sprite = nameSprite(text, 'rgba(255,255,255,0.92)');
    (sprite.material as THREE.SpriteMaterial).color.setHex(0x222233);
    sprite.position.y = 2.75;
    f.group.add(sprite);
    f.bubble = { sprite, until: performance.now() + seconds * 1000 };
  }

  private clearBubble(f: Figure): void {
    if (!f.bubble) return;
    f.group.remove(f.bubble.sprite);
    f.bubble.sprite.material.map?.dispose();
    f.bubble.sprite.material.dispose();
    f.bubble = null;
  }

  remove(idx: number): void {
    const f = this.figures.get(idx);
    if (!f) return;
    this.clearBubble(f);
    this.group.remove(f.group);
    f.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      if (o instanceof THREE.Sprite) {
        o.material.map?.dispose();
        o.material.dispose();
      }
    });
    this.figures.delete(idx);
  }

  /** 지금 보이는 사람들의 번호 (세계 전환 때 전부 지우기용) */
  indices(): number[] {
    return [...this.figures.keys()];
  }

  nickOf(idx: number): string | undefined {
    return this.figures.get(idx)?.info.nick;
  }

  /** 서버 위치 묶음. 내 번호는 건너뛴다 */
  setState(list: readonly PlayerStateEntry[], myIdx: number): void {
    for (const s of list) {
      if (s.idx === myIdx) continue;
      const f = this.figures.get(s.idx);
      if (!f) continue;
      f.target.x = s.x;
      f.target.y = s.y;
      f.target.z = s.z;
      f.target.yaw = s.yaw;
      f.target.pitch = s.pitch;
      f.target.flags = s.flags;
    }
  }

  update(dt: number): void {
    const k = 1 - Math.exp(-dt * 14); // 약 70ms 시간 상수
    for (const f of this.figures.values()) {
      const c = f.cur,
        t = f.target;
      const dx = t.x - c.x,
        dz = t.z - c.z;
      c.x += dx * k;
      c.y += (t.y - c.y) * k;
      c.z += dz * k;
      let dyaw = t.yaw - c.yaw;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      c.yaw += dyaw * k;
      f.group.position.set(c.x, c.y, c.z);
      f.body.rotation.y = c.yaw;
      f.head.rotation.x = -t.pitch * 0.6;
      const speed = Math.hypot(dx, dz) * 14;
      if (speed > 0.3) f.walk += dt * Math.min(12, speed * 2.2);
      const swing = speed > 0.3 ? Math.sin(f.walk) * 0.7 : 0;
      f.legL.rotation.x = swing;
      f.legR.rotation.x = -swing;
      f.armL.rotation.x = -swing;
      f.armR.rotation.x = swing;
      const sneak = (t.flags & FLAG_SNEAK) !== 0;
      f.body.scale.y = sneak ? 0.85 : 1;
      f.label.position.y = sneak ? 2.0 : 2.25;
      if (f.bubble && performance.now() > f.bubble.until) this.clearBubble(f);
    }
  }

  dispose(): void {
    for (const idx of [...this.figures.keys()]) this.remove(idx);
  }
}
