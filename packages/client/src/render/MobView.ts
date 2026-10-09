/**
 * 원정 몹 그리기 (M7-2·M7-3): 서버 MobsState(20Hz)를 부드럽게 따라가는 좀비·크리퍼·거미 복셀 인형.
 * 좀비는 플레이어 인형 생성기에 초록 피부·낡은 옷 팔레트, 팔은 앞으로. 크리퍼는 머리 8 + 몸 4×12 + 다리 넷.
 * 거미(M7-3)는 머리(붉은 눈 여덟)·가슴·큰 배 + 다리 여덟(따로 메시, 걷는 대로 흔든다). 넓고 낮다(mobSize).
 * 맞으면 붉게 깜빡, 크리퍼가 부풀 때 하얘지며 커진다, 죽거나 터지면 조각이 흩어진다.
 * 머리 위 체력 바(빨강, 숫자)와 맞을 때 떠오르는 피해 숫자 — 맞았다는 게 한눈에 보이게 (#94).
 * 거미 왕(M7-4)은 같은 거미 복셀을 2.2배로, 자줏빛 몸에 금 왕관. 잠들었을 땐 낮게 웅크리고, 소환할 땐 몸을 든다.
 * 동물(M8-1)은 `animalModel.ts` — 마인크래프트 비율·색 변종, 머리·다리·꼬리·날개를 따로 움직인다(걷기·풀 뜯기·꼬리·날개). 아기는 머리가 크다.
 */
import { ANIMAL_FLAG, MOB_KIND_OF, MOB_STATE, type MobEntry, mobSize, ANIMAL_ID_BASE } from '@dragon-village/shared';
import { MOBS } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { PLAYER_SHADES, type SkinPalette, VOXEL, playerVoxels } from './playerModel';
import { type Part, animalParts, animalVariant, collarVoxels } from './animalModel';
import { type Voxel, buildVoxelGeometry } from './voxelGeometry';
import { nameSprite } from '../net/RemotePlayers';

const ZOMBIE: SkinPalette = { shirt: 0x2f6a7a, skin: 0x5d8b4a, hair: 0x2c3e2b, pants: 0x3a3560, shoes: 0x25211f };
/** 우민 (M7-5): 잿빛 피부. 변명자는 짙은 남색 옷, 약탈자는 갈색 가죽, 소환사는 검은 로브 */
const HUMANOID: Partial<Record<string, SkinPalette>> = {
  zombie: ZOMBIE,
  vindicator: { shirt: 0x2f3f52, skin: 0x9aa3a9, hair: 0x2a2a2a, pants: 0x1e2a36, shoes: 0x1a1a1a },
  pillager: { shirt: 0x5a4632, skin: 0x9aa3a9, hair: 0x2a2a2a, pants: 0x3a2f24, shoes: 0x1a1a1a },
  evoker: { shirt: 0x1c1c22, skin: 0x9aa3a9, hair: 0x111111, pants: 0x1c1c22, shoes: 0x111111 },
  skeleton: { shirt: 0xdcdcdc, skin: 0xd8d8d8, hair: 0xbdbdbd, pants: 0xcfcfcf, shoes: 0x9e9e9e },
  // 사막 (v1.1-1): 허스크는 모래색 좀비, 엔더맨은 새까맣고 보랏빛 눈 — 몸을 1.5배 키운다
  husk: { shirt: 0x7a6b45, skin: 0xa89a62, hair: 0x5e5233, pants: 0x6a5c3c, shoes: 0x3f3624 },
  enderman: { shirt: 0x141414, skin: 0x161616, hair: 0x101010, pants: 0x141414, shoes: 0x0e0e0e, eyes: 0xd36cff },
  // 설원 (v1.1-2): 스트레이는 푸르스름한 스켈레톤에 눈 덮인 머리
  stray: { shirt: 0xb9c6cf, skin: 0xc8d3da, hair: 0xeef4f8, pants: 0xaab8c2, shoes: 0x8a98a2 },
  // 네더 (v1.1-3): 좀비 피글린은 분홍 살에 썩은 초록, 위더 스켈레톤은 새까맣고 키가 크다(1.3배)
  zombified_piglin: { shirt: 0x6b8a4a, skin: 0xf0a8a0, hair: 0xd98080, pants: 0x4a3b7a, shoes: 0x3a2a2a },
  wither_skeleton: { shirt: 0x262626, skin: 0x2b2b2b, hair: 0x1c1c1c, pants: 0x222222, shoes: 0x171717, eyes: 0x8a8a8a },
};

const CREEPER_GREEN = 0x4caf50;
const SPIDER_DARK = 0x2a2320;
const ANIMAL_NAMES = new Set(['cow', 'pig', 'sheep', 'chicken', 'dog']);
const KING_DARK = 0x3a2344;
const KING_BELLY = 0x4a2a4e;
const GOLD = 0xffd54f;

function css(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0');
}

/** 가스트 복셀 (v1.1-3): 하얀 상자 16×16×16(앞면에 감은 눈·입) + 아래로 늘어진 촉수 아홉. MobView 에서 4.4배로 키운다. 앞이 −z */
function ghastVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  const pale = (x: number, y: number, z: number) => {
    const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    const k = 0.9 + (((h >>> 0) % 100) / 100) * 0.1;
    const v = Math.min(255, Math.round(0xe2 * k));
    return (v << 16) | (v << 8) | Math.min(255, v + 6);
  };
  const FACE = ['                ', '                ', '                ', '                ', '    xx    xx    ', '     xx  xx     ', '                ', '                ', '                ', '     xxxxxx     ', '    xx    xx    ', '                ', '                ', '                ', '                ', '                '];
  add(-8, 7, 9, 24, -8, 7, (x, y, z) => (z === -8 && FACE[24 - y]![x + 8] === 'x' ? 0x202020 : pale(x, y, z)));
  for (let i = 0; i < 9; i++) {
    const tx = -6 + (i % 3) * 5,
      tz = -6 + Math.floor(i / 3) * 5;
    const len = 5 + ((i * 7) % 4);
    add(tx, tx + 1, 9 - len, 8, tz, tz + 1, pale);
  }
  return out;
}

/** 블레이즈 복셀 (v1.1-3): 어두운 노란 머리 8×8×8(얼굴은 밝은 눈) + 둘레를 도는 불 막대 8개(2×6×2) 두 층. 앞이 −z */
function blazeVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  add(-4, 3, 18, 25, -4, 3, (x, y, z) => (z === -4 && y === 22 && (x === -3 || x === -2 || x === 1 || x === 2) ? 0xfff2a0 : 0x5a4210));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rx = Math.round(Math.cos(a) * 5),
      rz = Math.round(Math.sin(a) * 5);
    const y0 = i % 2 === 0 ? 10 : 4;
    add(rx - 1, rx, y0, y0 + 5, rz - 1, rz, (_x, y) => (y % 3 === 0 ? 0xffd54f : 0xf2a21a));
  }
  return out;
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

/** 거미 몸통 복셀: 머리 8×8×6 (앞면 z=-11 에 붉은 눈 여덟), 가슴 6×6×6, 배 10×8×12. 앞이 −z, 바닥 y 0 은 다리 끝. king 이면 자줏빛 + 금 왕관 */
function spiderBodyVoxels(king = false): Voxel[] {
  const dark = king ? KING_DARK : SPIDER_DARK;
  const belly = king ? KING_BELLY : 0x3a2f2a;
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
  add(-5, 4, 5, 12, 1, 12, (x, y, z) => mottle(x, y, z, belly));
  // 가슴
  add(-3, 2, 6, 11, -5, 0, (x, y, z) => mottle(x, y, z, dark));
  // 머리 + 눈
  const EYES = ['        ', ' r    r ', 'r r  r r', ' r    r ', '  r  r  ', '        ', '        ', '        '];
  add(-4, 3, 5, 12, -11, -6, (x, y, z) => {
    if (z === -11 && EYES[12 - y]![x + 4] === 'r') return king ? 0xff3030 : 0xd02020;
    return mottle(x, y, z, dark);
  });
  if (king) {
    // 왕관 — 아들 그림(13차, 2026-10-07, #127): 금 테(13) + 앞쪽 뿔 셋(왼·가운데 2칸, 오른쪽이 제일 높다 3칸),
    // 보석 여섯: 위에 초록·하늘·초록, 아래 파랑·빨강·파랑 (앞면에만)
    const GEM: Record<string, number> = { g: 0x43d13a, c: 0x29e3ff, b: 0x1e3cff, r: 0xe53935 };
    const FRONT_GEMS: Record<number, Record<number, string>> = { 13: { [-4]: 'b', 0: 'r', 3: 'b' }, 14: { [-3]: 'g', 0: 'c' }, 15: { 3: 'g' } };
    const gemAt = (x: number, y: number, z: number) => (z === -11 ? FRONT_GEMS[y]?.[x] : undefined);
    for (let z = -11; z <= -6; z++)
      for (let x = -4; x <= 3; x++) {
        const edge = z === -11 || z === -6 || x === -4 || x === 3;
        if (!edge) continue;
        const g = gemAt(x, 13, z);
        out.push({ x, y: 13, z, c: css(g ? GEM[g]! : GOLD) });
      }
    const SPIKES: readonly (readonly [number, number, number])[] = [
      [-4, -3, 15],
      [-1, 0, 15],
      [2, 3, 16],
    ]; // x0, x1, 꼭대기 y
    for (const [x0, x1, top] of SPIKES)
      for (let x = x0; x <= x1; x++)
        for (let y = 14; y <= top; y++)
          for (let z = -11; z <= -10; z++) {
            const g = gemAt(x, y, z);
            out.push({ x, y, z, c: css(g ? GEM[g]! : GOLD) });
          }
  }
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
/** 회전 축이 있는 부위 (동물 머리·다리·꼬리·날개): 축이 메시 원점, 메시는 축 자리에 놓인다 */
function pivotMesh(p: Part, material: THREE.Material): THREE.Mesh {
  const geom = buildVoxelGeometry(p.v, VOXEL, PLAYER_SHADES);
  geom.translate((0.5 - p.pivot[0]) * VOXEL, -p.pivot[1] * VOXEL, (0.5 - p.pivot[2]) * VOXEL);
  const mesh = new THREE.Mesh(geom, material);
  mesh.position.set(p.pivot[0] * VOXEL, p.pivot[1] * VOXEL, p.pivot[2] * VOXEL);
  return mesh;
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
  /** 몸 크기 배율 (거미 왕 2.2) */
  baseScale: number;
  /** 소환 연출 남은 시간 */
  summonT: number;
  /** 동물인가 (M8-1) */
  animal: boolean;
  collar: THREE.Mesh | null;
  /** 깎인 양으로 그렸나 — 바뀌면 인형을 다시 만든다 */
  sheared: boolean;
  /** 펫 이름표 (#109) */
  nameLabel: { sprite: THREE.Sprite; text: string } | null;
  /** 동물 부위 (앞왼·앞오른·뒤왼·뒤오른 다리 / 닭은 둘) */
  legs: THREE.Mesh[];
  head: THREE.Mesh | null;
  tail: THREE.Mesh | null;
  wings: THREE.Mesh[];
  babyHead: number;
  id: number;
  /** 사랑 하트 다음 시각 */
  nextHeart: number;
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
/** 화살 막대 (M8-2): 앞(−z → lookAt 방향)으로 긴 상자 */
const SHOT_GEOM = new THREE.BoxGeometry(0.06, 0.06, 0.7);
const SHOT_MAT = new THREE.MeshBasicMaterial({ color: 0xd9c8a0 });

export class MobView {
  private readonly group = new THREE.Group();
  private readonly figures = new Map<number, Figure>();
  private readonly bursts: Burst[] = [];
  private readonly pops: Pop[] = [];
  /** 날아가는 화살 (M8-2): 0.25초 동안 from → to */
  private readonly shots: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; born: number }[] = [];

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.figures.size;
  }

  /** 펫 이름 (#109): id → 이름. 이름표는 setState 에서 붙인다 */
  private readonly petNames = new Map<number, string>();
  setPetNames(list: readonly { id: number; name: string | null }[]): void {
    this.petNames.clear();
    for (const p of list) if (p.name) this.petNames.set(p.id, p.name);
    for (const [id, f] of this.figures) this.applyName(id, f);
  }
  private applyName(id: number, f: Figure): void {
    const name = this.petNames.get(id) ?? null;
    if (f.nameLabel && f.nameLabel.text === name) return;
    if (f.nameLabel) {
      f.group.remove(f.nameLabel.sprite);
      (f.nameLabel.sprite.material as THREE.SpriteMaterial).map?.dispose();
      f.nameLabel.sprite.material.dispose();
      f.nameLabel = null;
    }
    if (!name) return;
    const sprite = nameSprite(`🐾 ${name}`, 'rgba(60,30,10,0.55)', 0.4);
    sprite.position.set(0, mobSize(f.kind).h + 0.55, 0);
    f.group.add(sprite);
    f.nameLabel = { sprite, text: name };
  }

  /** 몹의 지금 자리 (가슴 높이). 없으면 null */
  positionOf(id: number): { x: number; y: number; z: number } | null {
    const f = this.figures.get(id);
    return f ? { x: f.cur.x, y: f.cur.y + mobSize(f.kind).h * 0.5 * (f.state & ANIMAL_FLAG.baby ? 0.5 : 1), z: f.cur.z } : null;
  }

  /** 화살 연출 (M8-2): 눈에서 몹까지 가느다란 막대가 날아간다 */
  shot(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }): void {
    const mesh = new THREE.Mesh(SHOT_GEOM, SHOT_MAT);
    const f = new THREE.Vector3(from.x, from.y, from.z),
      t = new THREE.Vector3(to.x, to.y, to.z);
    mesh.position.copy(f);
    mesh.lookAt(t);
    this.group.add(mesh);
    this.shots.push({ mesh, from: f, to: t, born: -1 });
  }

  /** 조준 안내용: 그 몹의 종류·상태 */
  figureOf(id: number): { kind: number; state: number } | undefined {
    const f = this.figures.get(id);
    return f ? { kind: f.kind, state: f.state } : undefined;
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
    const legs: THREE.Mesh[] = [];
    const wings: THREE.Mesh[] = [];
    let head: THREE.Mesh | null = null,
      tail: THREE.Mesh | null = null;
    let babyHead = 1;
    const kindName = MOB_KIND_OF[m.kind] ?? 'zombie';
    const pal = HUMANOID[kindName];
    if (pal) {
      const v = playerVoxels(pal);
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
      if (kindName === 'zombie' || kindName === 'husk' || kindName === 'zombified_piglin') armL.rotation.x = armR.rotation.x = -Math.PI / 2 + 0.15; // 좀비 팔은 앞으로
      else if (kindName === 'evoker') armL.rotation.x = armR.rotation.x = -Math.PI / 2 + 0.6; // 소환사는 손을 든다
      body.add(torso, head, legL, legR, armL, armR);
    } else if (MOB_KIND_OF[m.kind] === 'spider' || MOB_KIND_OF[m.kind] === 'spider_king') {
      body.add(partMesh(spiderBodyVoxels(MOB_KIND_OF[m.kind] === 'spider_king'), material));
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
    } else if (ANIMAL_NAMES.has(kindName)) {
      const parts = animalParts(kindName, animalVariant(m.id), { sheared: (m.state & ANIMAL_FLAG.sheared) !== 0 });
      body.add(partMesh(parts.body, material));
      head = pivotMesh(parts.head, material);
      body.add(head);
      for (const l of parts.legs) {
        const mesh = pivotMesh(l, material);
        legs.push(mesh);
        body.add(mesh);
      }
      if (parts.tail) {
        tail = pivotMesh(parts.tail, material);
        body.add(tail);
      }
      for (const w of parts.wings) {
        const mesh = pivotMesh(w, material);
        wings.push(mesh);
        body.add(mesh);
      }
      babyHead = parts.babyHead;
    } else if (kindName === 'ghast') {
      body.add(partMesh(ghastVoxels(), material));
    } else if (kindName === 'blaze') {
      body.add(partMesh(blazeVoxels(), material));
    } else {
      body.add(partMesh(creeperVoxels(), material));
    }
    group.add(body);
    // 체력 바: 머리 위, 몸과 따로(돌지도 커지지도 않는다)
    const maxHp = MOBS.get(kindName).hp;
    const king = MOB_KIND_OF[m.kind] === 'spider_king';
    const baseScale = king ? 2.2 : 1;
    body.scale.setScalar(baseScale);
    if (kindName === 'enderman') body.scale.set(0.8, 1.5, 0.8); // 키 3칸, 홀쭉하게
    else if (kindName === 'wither_skeleton') body.scale.set(1.1, 1.3, 1.1);
    else if (kindName === 'ghast') body.scale.setScalar(4.4); // 네 칸짜리 상자
    const bar = canvasSprite(128, 28, king ? 2.2 : 1.1, king ? 0.4 : 0.24);
    bar.sprite.position.set(0, mobSize(m.kind).h + (king ? 0.7 : 0.35), 0);
    drawHpBar(bar.ctx, bar.tex, m.hp, maxHp);
    group.add(bar.sprite);
    this.group.add(group);
    return { group, body, material, kind: m.kind, cur: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, target: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, state: m.state, hp: m.hp, flashUntil: 0, fuseT: 0, armL, armR, legL, legR, spiderLegs, walk: 0, bar, maxHp, shownHp: m.hp, baseScale, summonT: 0, animal: ANIMAL_NAMES.has(kindName), collar: null, nextHeart: 0, legs, head, tail, wings, babyHead, id: m.id, sheared: (m.state & ANIMAL_FLAG.sheared) !== 0, nameLabel: null };
  }

  /** 서버 상태 묶음 (20Hz). 목록에 없는 몹은 지운다 */
  setState(list: readonly MobEntry[]): void {
    const seen = new Set<number>();
    for (const m of list) {
      seen.add(m.id);
      let f = this.figures.get(m.id);
      if (f && f.animal && f.sheared !== ((m.state & ANIMAL_FLAG.sheared) !== 0)) {
        // 털이 깎였다/다시 자랐다 → 인형을 새로 (자리는 그대로)
        const keep = f.cur;
        this.remove(m.id);
        f = this.make(m);
        f.cur = { ...keep };
        f.group.position.set(keep.x, keep.y, keep.z);
        this.figures.set(m.id, f);
      }
      if (!f) {
        f = this.make(m);
        f.group.position.set(m.x, m.y, m.z);
        this.figures.set(m.id, f);
      }
      if (f.animal && (this.petNames.has(m.id) || f.nameLabel)) this.applyName(m.id, f);
      f.target = { x: m.x, y: m.y, z: m.z, yaw: m.yaw };
      f.state = m.state;
      f.hp = m.hp;
      if (f.shownHp !== m.hp) {
        f.shownHp = m.hp;
        drawHpBar(f.bar.ctx, f.bar.tex, m.hp, f.maxHp);
      }
      if (f.animal) {
        f.bar.sprite.visible = m.hp < f.maxHp; // 동물은 다쳤을 때만 체력 바
        const tamed = (m.state & ANIMAL_FLAG.tamed) !== 0;
        if (tamed && !f.collar) {
          f.collar = partMesh(collarVoxels(), new THREE.MeshBasicMaterial({ vertexColors: true }));
          f.body.add(f.collar);
        }
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
    } else if (ev === 'wake' && f) {
      f.flashUntil = now + 400;
    } else if (ev === 'love' || ev === 'tame' || ev === 'eat' || ev === 'grow' || ev === 'sit' || ev === 'shear' || ev === 'egg') {
      if (ev === 'eat') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '냠', '#ffffff', now);
      else if (ev === 'love') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '♥', '#ff5c8a', now);
      else if (ev === 'tame') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '♥♥', '#ff5c8a', now);
      else if (ev === 'grow') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '어른!', '#ffeb3b', now);
      else if (ev === 'shear') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '✂️', '#ffffff', now);
      else if (ev === 'egg') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '🥚', '#ffffff', now);
    } else if (ev === 'summon' && f) {
      f.summonT = 0.8;
      this.burst(x, y + 0.6, z, 0xb388ff, 16, now);
    } else if (ev === 'die' || ev === 'explode') {
      const color = ev === 'explode' ? 0xffd27a : !f ? 0xffffff : f.kind === 0 ? 0x5d8b4a : f.kind === 2 ? SPIDER_DARK : f.kind === 3 ? GOLD : f.kind >= 4 ? 0x9aa3a9 : CREEPER_GREEN;
      this.burst(x, y + mobSize(f?.kind ?? 0).h * 0.5, z, color, ev === 'explode' ? 28 : f?.kind === 3 ? 40 : 12, now);
      this.remove(id);
    }
  }

  /** 동물 부위 움직임: 다리는 대각선 짝으로, 머리는 걷는 박자·서 있으면 가끔 풀 뜯기, 강아지 꼬리는 길들이면 세워 흔들고, 닭은 걸을 때 날개 퍼덕 */
  private animateAnimal(f: Figure, moving: boolean, swing: number, now: number): void {
    const kindName = MOB_KIND_OF[f.kind] ?? 'cow';
    const t = now / 1000 + (f.id % 97) * 0.37; // 마리마다 박자가 다르게
    const sitting = (f.state & ANIMAL_FLAG.sitting) !== 0;
    const baby = (f.state & ANIMAL_FLAG.baby) !== 0;
    const tamed = (f.state & ANIMAL_FLAG.tamed) !== 0;
    f.legs.forEach((leg, i) => {
      let a = i === 0 || i === 3 ? swing : -swing;
      if (sitting && i >= 2) a = -1.35; // 앉으면 뒷다리를 앞으로 접는다
      leg.rotation.x = a;
    });
    if (f.head) {
      let nod = moving ? Math.sin(f.walk * 2) * 0.06 : 0;
      if (!moving && !sitting && kindName !== 'dog') {
        const ph = t % 7; // 7초마다 1.8초 풀 뜯기
        if (ph < 1.8) nod -= (kindName === 'chicken' ? 0.5 : 0.75) * Math.sin((ph / 1.8) * Math.PI);
      }
      f.head.rotation.x = nod;
      f.head.scale.setScalar(baby ? f.babyHead : 1);
    }
    if (f.tail) {
      if (kindName === 'dog') {
        f.tail.rotation.x = sitting ? -0.35 : tamed ? -2.2 : -0.9; // 길들이면 꼬리를 세운다
        f.tail.rotation.z = tamed || moving ? Math.sin(t * 9) * 0.45 : 0;
      } else {
        f.tail.rotation.x = 0.15;
        f.tail.rotation.z = Math.sin(t * 2.2) * 0.25; // 파리 쫓기
      }
    }
    f.wings.forEach((w, i) => {
      w.rotation.z = (i === 0 ? -1 : 1) * (moving ? Math.abs(Math.sin(f.walk * 3)) * 0.9 : 0);
    });
    f.body.position.y = sitting ? -0.14 : 0;
  }

  /** 떠오르는 글자 (사랑 ♥·냠·어른!) */
  private popText(x: number, y: number, z: number, text: string, color: string, now: number): void {
    const c = canvasSprite(96, 48, 0.9, 0.45);
    c.ctx.font = 'bold 30px system-ui, sans-serif';
    c.ctx.textAlign = 'center';
    c.ctx.textBaseline = 'middle';
    c.ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    c.ctx.lineWidth = 6;
    c.ctx.fillStyle = color;
    c.ctx.strokeText(text, 48, 26);
    c.ctx.fillText(text, 48, 26);
    c.tex.needsUpdate = true;
    c.sprite.position.set(x, y, z);
    this.group.add(c.sprite);
    this.pops.push({ sprite: c.sprite, born: now });
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
  /**
   * 조준하지 않아도 앞쪽 원뿔(시선과 각도 cos ≥ minCos) 안, reach 안에서 가장 가까운 몹 (#141 — 검을 들고 탭하면 휘두르기).
   * hostileOnly 면 동물(ANIMAL_ID_BASE 이상)은 뺀다 — 동물은 노려서 탭해야 먹이·길들이기와 안 헷갈린다
   */
  nearestInCone(eye: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, reach: number, minCos: number, hostileOnly: boolean): number | null {
    let best: number | null = null;
    let bestD = reach;
    for (const [id, f] of this.figures) {
      if (hostileOnly && id >= ANIMAL_ID_BASE) continue;
      const c = f.cur;
      const size = mobSize(f.kind);
      const dx = c.x - eye.x,
        dy = c.y + size.h * 0.5 - eye.y,
        dz = c.z - eye.z;
      const d = Math.hypot(dx, dy, dz);
      if (d <= 1e-6 || d - size.w * 0.5 > bestD) continue;
      const cos = (dx * dir.x + dy * dir.y + dz * dir.z) / d;
      if (cos < minCos) continue;
      bestD = Math.max(0, d - size.w * 0.5);
      best = id;
    }
    return best;
  }

  /** 인형 하나의 목표 자리를 직접 옮긴다 — 원정에 따라온 펫처럼 서버 목록에 없이 클라가 움직이는 것 (#145) */
  moveFigure(id: number, x: number, y: number, z: number, yaw: number): void {
    const f = this.figures.get(id);
    if (f) f.target = { x, y, z, yaw };
  }

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
      if (f.animal) this.animateAnimal(f, speed > 0.3, swing, now);
      // 크리퍼 부풀기: 하얘지며 커진다
      if (f.state === MOB_STATE.fuse) {
        f.fuseT += dt;
        const s = 1 + 0.25 * Math.min(1, f.fuseT / 1.5) + 0.06 * Math.sin(f.fuseT * 30);
        f.body.scale.set(s, s, s);
        f.material.color.setRGB(1 + f.fuseT, 1 + f.fuseT, 1 + f.fuseT);
      } else {
        f.fuseT = 0;
        let s = f.baseScale;
        if (f.state === MOB_STATE.sleep) s *= 0.85; // 잠든 보스는 웅크린다
        if (f.animal) {
          if (f.state & ANIMAL_FLAG.baby) s *= 0.5; // 아기
          if (f.state & ANIMAL_FLAG.love && now >= f.nextHeart) {
            f.nextHeart = now + 900;
            this.popText(c.x, c.y + mobSize(f.kind).h * s + 0.4, c.z, '♥', '#ff5c8a', now);
          }
        }
        if (f.summonT > 0) {
          f.summonT = Math.max(0, f.summonT - dt);
          s *= 1 + 0.12 * Math.sin((f.summonT / 0.8) * Math.PI); // 소환: 몸을 한 번 든다
        }
        f.body.scale.set(s, s, s);
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
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i]!;
      if (s.born < 0) s.born = now;
      const k = (now - s.born) / 250;
      if (k >= 1) {
        this.group.remove(s.mesh);
        this.shots.splice(i, 1);
        continue;
      }
      s.mesh.position.lerpVectors(s.from, s.to, k);
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
