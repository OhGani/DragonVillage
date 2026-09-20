/**
 * 둥지의 드래곤들 (M6-3): 서버가 정한 자리(perch)에 복셀 드래곤을 세우고, 숨쉬기·살짝 둘러보기·콩콩 뛰기 idle 을 돌린다.
 * 위치·단계(아기/어른)·주인은 서버가 진실(nest 메시지). 여기서는 그리기만.
 * 복셀 한 칸 = 1/16 블록 — 아기 약 1.4×0.9×1.8 블록, 어른 약 2.4×1.4×2.7 블록(2배, 결정 #77).
 */
import type { NestDragonInfo } from '@dragon-village/shared';
import * as THREE from 'three';
import { nameSprite } from '../net/RemotePlayers';
import { type DragonStage, dragonVoxels } from './dragonModels';
import { buildVoxelGeometry } from './voxelGeometry';

export const VOXEL_SCALE = 1 / 16;

interface Entry {
  info: NestDragonInfo;
  group: THREE.Group;
  mesh: THREE.Mesh;
  label: THREE.Sprite;
  phase: number;
  height: number;
}

const geomCache = new Map<string, THREE.BufferGeometry>();
function geometryFor(dragon: string, stage: DragonStage): THREE.BufferGeometry {
  const key = `${dragon}/${stage}`;
  let g = geomCache.get(key);
  if (!g) {
    g = buildVoxelGeometry(dragonVoxels(dragon, stage), VOXEL_SCALE);
    geomCache.set(key, g);
  }
  return g;
}

const material = new THREE.MeshBasicMaterial({ vertexColors: true });

export class NestDragons {
  readonly group = new THREE.Group();
  private readonly entries = new Map<number, Entry>();
  private t = 0;

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get visible(): boolean {
    return this.group.visible;
  }
  set visible(v: boolean) {
    this.group.visible = v;
  }

  get count(): number {
    return this.entries.size;
  }

  /** 서버 목록과 맞춘다: 새로 온 것은 만들고, 없어진 것은 지우고, 단계·자리가 바뀐 것은 다시 만든다 */
  sync(list: readonly NestDragonInfo[]): void {
    const seen = new Set<number>();
    for (const info of list) {
      seen.add(info.id);
      const cur = this.entries.get(info.id);
      if (cur && cur.info.stage === info.stage && cur.info.perch.x === info.perch.x && cur.info.perch.z === info.perch.z && cur.info.owner === info.owner) {
        cur.info = info;
        continue;
      }
      if (cur) this.dispose(cur);
      this.entries.set(info.id, this.make(info));
    }
    for (const [id, e] of this.entries) if (!seen.has(id)) {
        this.dispose(e);
        this.entries.delete(id);
      }
  }

  private make(info: NestDragonInfo): Entry {
    const geom = geometryFor(info.dragon, info.stage);
    const mesh = new THREE.Mesh(geom, material);
    const height = geom.boundingBox ? geom.boundingBox.max.y : 1;
    const group = new THREE.Group();
    group.add(mesh);
    // 이름표는 주인 닉만 — 드래곤 종류는 모양·색으로 보이고, 긴 글자는 옆 드래곤과 겹친다 (패널 검증 2026-09-20)
    const label = nameSprite(info.owner, info.mine ? 'rgba(40,120,40,0.55)' : 'rgba(0,0,0,0.45)', 0.28);
    label.position.y = height + 0.25;
    group.add(label);
    group.position.set(info.perch.x + 0.5, info.perch.y, info.perch.z + 0.5);
    group.rotation.y = info.yaw;
    this.group.add(group);
    return { info, group, mesh, label, phase: (info.id * 1.7) % (Math.PI * 2), height };
  }

  private dispose(e: Entry): void {
    this.group.remove(e.group);
    (e.label.material as THREE.SpriteMaterial).map?.dispose();
    e.label.material.dispose();
  }

  /** 프레임마다: 숨쉬기(세로 2~3%), 가끔 콩콩, 천천히 둘러보기 */
  update(dt: number): void {
    if (!this.group.visible || this.entries.size === 0) return;
    this.t += dt;
    for (const e of this.entries.values()) {
      const t = this.t + e.phase;
      const breath = 1 + 0.025 * Math.sin(t * 1.6);
      e.mesh.scale.set(1, breath, 1);
      const hop = Math.max(0, Math.sin(t * 0.9)) ** 8; // 대부분 0, 가끔 살짝
      e.group.position.y = e.info.perch.y + hop * (e.info.stage === 'adult' ? 0.12 : 0.08);
      e.group.rotation.y = e.info.yaw + 0.18 * Math.sin(t * 0.35);
    }
  }
}
