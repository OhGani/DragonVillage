/**
 * 다른 플레이어 표시: 복셀 인형(머리·몸·팔·다리) + 머리 위 이름.
 * 서버 위치(20Hz)를 받아 부드럽게 따라간다 (지수 보간, 약 100ms 지연).
 * 인형 생김새는 `render/playerModel.ts` — 얼굴·머리카락·손·신발이 있고 색 16가지마다 다른 사람이다 (#86).
 */
import { FLAG_RIDING, FLAG_SNEAK, type PlayerInfo, type PlayerStateEntry, RIDE_SEAT_Y, type RidingInfo } from '@dragon-village/shared';
import { dragonMesh } from '../render/DragonMesh';
import { PART_AT, PLAYER_SHADES, VOXEL, paletteFor, playerVoxels } from '../render/playerModel';
import { type Voxel, buildVoxelGeometry } from '../render/voxelGeometry';
import * as THREE from 'three';

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
  /** 타고 있는 드래곤 (M6-4) */
  mount: THREE.Mesh | null;
}

/** 인형 키 (복셀 32칸 = 몸 판정과 같은 1.8). 이름표·말풍선 높이의 기준 */
const FIGURE_H = 32 * VOXEL;

/**
 * 부위 복셀 → 메시. buildVoxelGeometry 는 드래곤(홀수 폭, x 대칭)에 맞춰 반 칸 옮기므로,
 * 짝수 폭인 사람 부위는 그만큼 되돌려야 가운데가 맞는다.
 */
function partMesh(voxels: readonly Voxel[]): THREE.Mesh {
  const geom = buildVoxelGeometry(voxels, VOXEL, PLAYER_SHADES);
  geom.translate(VOXEL / 2, 0, VOXEL / 2);
  return new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ vertexColors: true }));
}

export function nameSprite(text: string, bg = 'rgba(0,0,0,0.45)', scale = 0.55): THREE.Sprite {
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
    const v = playerVoxels(paletteFor(info.color));
    const group = new THREE.Group();
    const body = new THREE.Group();
    // 팔·다리는 붙이는 자리가 곧 회전축(어깨·엉덩이)이라 걸을 때 제대로 흔들린다
    const at = (m: THREE.Mesh, spot: readonly [number, number]): THREE.Mesh => {
      m.position.set(spot[0] * VOXEL, spot[1] * VOXEL, 0);
      return m;
    };
    const torso = at(partMesh(v.torso), PART_AT.torso);
    const head = at(partMesh(v.head), PART_AT.head);
    const legL = at(partMesh(v.leg), PART_AT.legL);
    const legR = at(partMesh(v.leg), PART_AT.legR);
    const armL = at(partMesh(v.arm), PART_AT.armL);
    const armR = at(partMesh(v.arm), PART_AT.armR);
    body.add(torso, head, legL, legR, armL, armR);
    group.add(body);
    const label = nameSprite(info.nick);
    label.position.y = FIGURE_H + 0.3;
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
      mount: null,
    });
    if (info.riding) this.setMount(info.idx, info.riding);
  }

  /** 드래곤 타기/내리기 (M6-4): 인형 발 아래에 어른 드래곤을 붙인다 */
  setMount(idx: number, riding: RidingInfo | null): void {
    const f = this.figures.get(idx);
    if (!f) return;
    if (f.mount) {
      f.body.remove(f.mount);
      f.mount = null;
    }
    if (riding) {
      const m = dragonMesh(riding.dragon, 'adult');
      m.position.y = -RIDE_SEAT_Y;
      m.rotation.y = Math.PI;
      f.body.add(m);
      f.mount = m;
    }
  }

  /** 머리 위 말풍선 (채팅, 3초) */
  say(idx: number, text: string, seconds = 3): void {
    const f = this.figures.get(idx);
    if (!f) return;
    this.clearBubble(f);
    const sprite = nameSprite(text, 'rgba(255,255,255,0.92)');
    (sprite.material as THREE.SpriteMaterial).color.setHex(0x222233);
    sprite.position.y = FIGURE_H + 0.8;
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
    this.setMount(idx, null); // 공유 지오메트리는 dispose 하지 않는다
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
      const riding = (t.flags & FLAG_RIDING) !== 0;
      const swing = speed > 0.3 && !riding ? Math.sin(f.walk) * 0.55 : 0; // 어깨·엉덩이가 축이라 전보다 작게
      f.legL.rotation.x = swing;
      f.legR.rotation.x = -swing;
      f.armL.rotation.x = -swing;
      f.armR.rotation.x = swing;
      const sneak = (t.flags & FLAG_SNEAK) !== 0;
      f.body.scale.y = sneak ? 0.85 : 1;
      f.label.position.y = (sneak ? FIGURE_H * 0.85 : FIGURE_H) + 0.3;
      if (f.bubble && performance.now() > f.bubble.until) this.clearBubble(f);
    }
  }

  dispose(): void {
    for (const idx of [...this.figures.keys()]) this.remove(idx);
  }
}
