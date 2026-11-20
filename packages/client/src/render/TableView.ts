/**
 * 식탁 위 음식 (아빠 2026-11-06): 식탁 윗면에 액자 넷(2×2) — 마인크래프트 아이템 액자처럼 밝은 나무 테두리 + 주황빛 가죽 바닥.
 * 음식은 입체로 (아빠 2026-11-20 "식탁에 음식을 올리는데 입체적으로"): 아이콘의 픽셀 하나하나를 두께 있는 상자로 세운 모형(손에 든 아이템 #96 과 같은 방식)을
 * 액자 위에 세우고, 늘 나(카메라) 쪽으로 돈다 — 어느 의자에서 봐도 옆모습(얇은 선)이 아니라 그림이 보인다.
 * 그릇 (2026-11-20 "그릇에 음식을 담을 수 있게"): 자리 값이 `bowl`(빈 그릇)·`bowl:<음식>`(담긴 것)이면 나무 그릇 모형, 담긴 음식은 작게 그릇에 꽂힌다.
 * 서버가 보내는 'table'(하나 바뀜)·'tables'(들어올 때 전부)로 채운다. 세계가 바뀌면 clear
 */
import { dishOf } from '@dragon-village/shared';
import * as THREE from 'three';
import { iconVoxels } from './Hand';
import { type Voxel, buildVoxelGeometry } from './voxelGeometry';

/** 액자 윗면 16×16 픽셀 그림: 테두리 2칸 밝은 나무, 안은 주황빛 가죽 (칸마다 살짝 얼룩) */
function frameCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d')!;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const edge = x < 2 || y < 2 || x > 13 || y > 13;
      const inner = x === 2 || y === 2 || x === 13 || y === 13; // 테두리 안쪽 그늘 줄
      const n = Math.floor(rnd() * 3) * 8;
      g.fillStyle = edge ? `rgb(${226 - n},${208 - n},${160 - n})` : inner ? `rgb(${120 - n},${58 - n},${34 - n})` : `rgb(${172 - n},${86 - n},${52 - n})`;
      g.fillRect(x, y, 1, 1);
    }
  return c;
}
let frameMats: THREE.Material[] | null = null;
/** 액자 상자의 재질 (옆면은 테두리 색, 윗면은 그림). BoxGeometry 면 순서 +x −x +y −y +z −z */
function frameMaterials(): THREE.Material[] {
  if (frameMats) return frameMats;
  const tex = new THREE.CanvasTexture(frameCanvas());
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  const side = new THREE.MeshBasicMaterial({ color: 0xc9b383 });
  const top = new THREE.MeshBasicMaterial({ map: tex });
  frameMats = [side, side, top, side, side, side];
  return frameMats;
}
const FRAME = 0.44;
const FRAME_T = 1 / 32;
const FRAME_GEOM = new THREE.BoxGeometry(FRAME, FRAME_T, FRAME);
/** 2×2 자리 (칸 가운데에서) */
const SPOTS: readonly [number, number][] = [
  [-0.24, -0.24],
  [0.24, -0.24],
  [-0.24, 0.24],
  [0.24, 0.24],
];

/** 모닥불 (#290): 쌓은 통나무 윗면 높이, 음식 네 자리는 모서리 쪽(가운데는 불꽃) */
const CAMPFIRE_TOP = 8 / 16;
const FIRE_SPOTS: readonly [number, number][] = [
  [-0.3, -0.3],
  [0.3, -0.3],
  [-0.3, 0.3],
  [0.3, 0.3],
];

/** 음식 모형: 아이콘 한 픽셀 크기(16픽셀 = 0.34칸)·두께(픽셀 두 겹) · 그릇에 담긴 것은 이만큼 작게 */
const FOOD_PIXEL = 0.34 / 16;
const FOOD_DEPTH = 2;
const IN_BOWL_SCALE = 0.72;
/** 면 밝기 (+X −X +Y −Y +Z −Z) — 앞뒤(±Z)가 그림, 옆·위는 조금 어둡게 */
const FOOD_SHADES = [0.72, 0.72, 0.9, 0.5, 1.0, 0.92];

/** 나무 그릇 (마인크래프트 그릇 색): 바닥 6×6, 벽 10×10 고리 높이 4 (한 칸 = 1/32 블록) */
const BOWL_VOXEL = 1 / 32;
function bowlVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const wood = ['#8a5a2b', '#7a4e24', '#94642f'];
  const rim = '#a8763c';
  for (let y = 0; y < 4; y++)
    for (let z = 0; z < 10; z++)
      for (let x = 0; x < 10; x++) {
        const edge = x === 0 || z === 0 || x === 9 || z === 9;
        const corner = (x === 0 || x === 9) && (z === 0 || z === 9);
        if (y === 0) {
          if (x >= 2 && x <= 7 && z >= 2 && z <= 7) out.push({ x, y, z, c: wood[(x + z) % 3]! }); // 굽
          continue;
        }
        if (y === 1 && x >= 1 && x <= 8 && z >= 1 && z <= 8 && !((x === 1 || x === 8) && (z === 1 || z === 8))) {
          out.push({ x, y, z, c: wood[(x * 3 + z) % 3]! }); // 바닥 (속은 어두운 나무)
          continue;
        }
        if (edge && !corner) out.push({ x, y, z, c: y === 3 ? rim : wood[(x + z + y) % 3]! }); // 벽, 테두리는 밝게
      }
  return out;
}

/** 지오메트리를 가로 가운데·바닥 y 0 에 맞춘다 */
function settle(geom: THREE.BufferGeometry): THREE.BufferGeometry {
  geom.computeBoundingBox();
  const b = geom.boundingBox!;
  geom.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
  return geom;
}

export class TableView {
  private readonly group = new THREE.Group();
  private readonly tables = new Map<string, THREE.Group>();
  /** 음식 모형 (아이템 id → 지오메트리, 없으면 null = 그림 없음). 식탁끼리 같이 쓰고 버리지 않는다 */
  private readonly models = new Map<string, THREE.BufferGeometry | null>();
  private bowlGeom: THREE.BufferGeometry | null = null;
  private readonly voxelMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  private readonly items = new Map<string, (string | null)[]>();
  /** 카메라 쪽으로 돌리는 음식 메시들 (세계 좌표 x·z 와 함께) */
  private readonly foods = new Set<{ mesh: THREE.Mesh; x: number; z: number }>();
  private readonly byTable = new Map<string, { mesh: THREE.Mesh; x: number; z: number }[]>();

  constructor(
    scene: THREE.Scene,
    private readonly iconOf: (id: string) => HTMLCanvasElement | null,
  ) {
    scene.add(this.group);
  }

  /** 아이콘 → 두께 있는 픽셀 입체 모형 (세워 놓은 모양: 그림이 +Z 를 본다, 바닥 y 0) */
  private model(id: string): THREE.BufferGeometry | null {
    if (this.models.has(id)) return this.models.get(id)!;
    const c = this.iconOf(id);
    const flat = c ? iconVoxels(c) : [];
    let geom: THREE.BufferGeometry | null = null;
    if (flat.length) {
      const voxels: Voxel[] = [];
      for (const v of flat) for (let d = 0; d < FOOD_DEPTH; d++) voxels.push({ ...v, z: d });
      geom = settle(buildVoxelGeometry(voxels, FOOD_PIXEL, FOOD_SHADES));
    }
    this.models.set(id, geom);
    return geom;
  }

  private bowl(): THREE.BufferGeometry {
    return (this.bowlGeom ??= settle(buildVoxelGeometry(bowlVoxels(), BOWL_VOXEL)));
  }

  /** 식탁 하나 (items 는 4칸, 빈 칸 null). fire = 모닥불 (#290): 통나무 높이(8/16)에 액자 없이 음식만 */
  set(x: number, y: number, z: number, items: readonly (string | null)[], fire = false): void {
    const key = `${x},${y},${z}`;
    const old = this.tables.get(key);
    if (old) {
      this.group.remove(old); // 지오메트리·재질은 함께 쓰는 것뿐이라 버리지 않는다
      this.tables.delete(key);
    }
    for (const f of this.byTable.get(key) ?? []) this.foods.delete(f);
    this.byTable.delete(key);
    this.items.delete(key);
    if (items.every((i) => !i)) return;
    this.items.set(key, [...items]);
    const g = new THREE.Group();
    g.position.set(x + 0.5, fire ? y + CAMPFIRE_TOP - FRAME_T : y + 1, z + 0.5);
    items.forEach((slot, i) => {
      if (!slot) return;
      const [ox, oz] = fire ? FIRE_SPOTS[i]! : SPOTS[i]!;
      const base = fire ? FRAME_T : FRAME_T + 0.002;
      if (!fire) {
        const frame = new THREE.Mesh(FRAME_GEOM, frameMaterials());
        frame.position.set(ox, FRAME_T / 2 + 0.002, oz);
        g.add(frame);
      }
      const yaw = Math.atan2(ox, oz); // 식탁 바깥쪽(자리 방향)을 본다 — 그림 앞면 +Z 가 그쪽
      const dish = dishOf(slot);
      if (dish.bowl) {
        const bowl = new THREE.Mesh(this.bowl(), this.voxelMat);
        bowl.position.set(ox, base, oz);
        bowl.rotation.y = yaw;
        g.add(bowl);
      }
      const geom = dish.food ? this.model(dish.food) : null;
      if (!geom) return;
      const food = new THREE.Mesh(geom, this.voxelMat);
      if (dish.bowl) {
        food.scale.setScalar(IN_BOWL_SCALE);
        food.position.set(ox, base + BOWL_VOXEL * 1.5, oz); // 그릇 바닥에 꽂힌다 — 위쪽 반이 그릇 밖으로
      } else food.position.set(ox, base, oz);
      food.rotation.y = yaw;
      food.rotation.order = 'YXZ';
      if (fire) food.rotation.x = -0.35; // 모닥불 위에선 불 쪽으로 살짝 기대 놓는다
      g.add(food);
      const f = { mesh: food, x: x + 0.5 + ox, z: z + 0.5 + oz };
      this.foods.add(f);
      let list = this.byTable.get(key);
      if (!list) this.byTable.set(key, (list = []));
      list.push(f);
    });
    this.group.add(g);
    this.tables.set(key, g);
  }

  /** 매 프레임: 음식 그림 앞면(+Z)이 카메라를 보게 가로로만 돌린다 */
  face(cam: { x: number; z: number }): void {
    for (const f of this.foods) f.mesh.rotation.y = Math.atan2(cam.x - f.x, cam.z - f.z);
  }

  /** 들어올 때 전부 바꾼다 */
  setAll(list: readonly { x: number; y: number; z: number; items: readonly (string | null)[]; fire?: boolean }[]): void {
    this.clear();
    for (const t of list) this.set(t.x, t.y, t.z, t.items, t.fire === true);
  }

  /** 그 자리 음식 (식탁 창에서 쓴다) */
  itemsAt(x: number, y: number, z: number): (string | null)[] {
    return [...(this.items.get(`${x},${y},${z}`) ?? [null, null, null, null])];
  }

  clear(): void {
    for (const key of [...this.tables.keys()]) {
      const [x, y, z] = key.split(',').map(Number) as [number, number, number];
      this.set(x, y, z, [null, null, null, null]);
    }
  }
}
