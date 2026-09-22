/**
 * 다른 플레이어 표시: 복셀 인형(머리·몸·팔·다리) + 머리 위 이름.
 * 서버 위치(20Hz)를 받아 부드럽게 따라간다 (지수 보간, 약 100ms 지연).
 * 인형 생김새는 `render/playerModel.ts` — 얼굴·머리카락·손·신발이 있고 색 16가지마다 다른 사람이다 (#86).
 */
import { FLAG_RIDING, FLAG_SNEAK, type PlayerInfo, type PlayerStateEntry, RIDE_SEAT_Y, type RidingInfo, blockOf, skyOf } from '@dragon-village/shared';
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
  /** 여섯 부위가 같이 쓰는 재질. 주변 빛을 여기 색으로 준다 (#86) */
  material: THREE.MeshBasicMaterial;
  /** 지금 밝기 (빛이 뚝뚝 끊기지 않게 부드럽게 따라간다) */
  lum: number;
}

/** 동굴에서도 아주 조금은 보이게 (블록 셰이더와 같은 값) */
const MIN_LUM = 0.05;
/** 횃불빛이 스카이라이트보다 셀 때 섞는 따뜻한 색 (블록 셰이더와 같다) */
const WARM = new THREE.Color(1.0, 0.86, 0.68);
/** 계산에 돌려 쓰는 색 (프레임마다 새로 만들지 않게) */
const TINT = new THREE.Color();

/** 칸 하나의 빛 → 밝기·색. 블록 셰이더(ChunkMaterial)와 같은 곡선이라 사람과 세계가 따로 놀지 않는다 */
function lightColor(packed: number, skyLight: number, out: THREE.Color): number {
  const sky = (skyOf(packed) / 15) * skyLight;
  const blk = blockOf(packed) / 15;
  const lum = MIN_LUM + (1 - MIN_LUM) * Math.pow(Math.max(sky, blk), 1.5);
  out.set(0xffffff).lerp(WARM, Math.max(0, Math.min(1, blk - sky)));
  return lum;
}

/** 인형 키 (복셀 32칸 = 몸 판정과 같은 1.8). 이름표·말풍선 높이의 기준 */
const FIGURE_H = 32 * VOXEL;

/**
 * 부위 복셀 → 메시. buildVoxelGeometry 는 드래곤(홀수 폭, x 대칭)에 맞춰 반 칸 옮기므로,
 * 짝수 폭인 사람 부위는 그만큼 되돌려야 가운데가 맞는다.
 */
function partMesh(voxels: readonly Voxel[], material: THREE.Material): THREE.Mesh {
  const geom = buildVoxelGeometry(voxels, VOXEL, PLAYER_SHADES);
  geom.translate(VOXEL / 2, 0, VOXEL / 2);
  return new THREE.Mesh(geom, material);
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
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const group = new THREE.Group();
    const body = new THREE.Group();
    // 팔·다리는 붙이는 자리가 곧 회전축(어깨·엉덩이)이라 걸을 때 제대로 흔들린다
    const at = (m: THREE.Mesh, spot: readonly [number, number]): THREE.Mesh => {
      m.position.set(spot[0] * VOXEL, spot[1] * VOXEL, 0);
      return m;
    };
    const torso = at(partMesh(v.torso, material), PART_AT.torso);
    const head = at(partMesh(v.head, material), PART_AT.head);
    const legL = at(partMesh(v.leg, material), PART_AT.legL);
    const legR = at(partMesh(v.leg, material), PART_AT.legR);
    const armL = at(partMesh(v.arm, material), PART_AT.armL);
    const armR = at(partMesh(v.arm, material), PART_AT.armR);
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
      material,
      lum: 1,
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
      m.material = f.material; // 탄 드래곤도 같은 빛을 받는다
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
    f.material.dispose(); // 여섯 부위가 같이 쓰는 재질은 여기서 한 번만
    f.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
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

  /**
   * light 를 주면 인형이 서 있는 칸의 빛을 받아 밝아지고 어두워진다 (#86).
   * 동굴에서는 어둡고 횃불 옆에서는 따뜻해진다 — 블록과 같은 곡선을 쓴다. 안 주면 늘 밝다
   */
  update(dt: number, light?: { get(x: number, y: number, z: number): number }, skyLight = 1): void {
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
      if (light) {
        // 가슴 높이 칸의 빛. 한 칸 넘어갈 때 뚝 끊기지 않게 부드럽게 따라간다
        const lum = lightColor(light.get(Math.floor(c.x), Math.floor(c.y + 1), Math.floor(c.z)), skyLight, TINT);
        f.lum += (lum - f.lum) * k;
        f.material.color.copy(TINT).multiplyScalar(f.lum);
      }
      if (f.bubble && performance.now() > f.bubble.until) this.clearBubble(f);
    }
  }

  dispose(): void {
    for (const idx of [...this.figures.keys()]) this.remove(idx);
  }
}
