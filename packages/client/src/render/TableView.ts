/**
 * 식탁 위 음식 (아빠 2026-11-06): 식탁 윗면에 액자 넷(2×2) — 마인크래프트 아이템 액자처럼 밝은 나무 테두리 + 주황빛 가죽 바닥,
 * 그 위에 올린 음식의 그림을 납작하게 눕혀 그린다(아빠가 보낸 그림).
 * 서버가 보내는 'table'(하나 바뀜)·'tables'(들어올 때 전부)로 채운다. 세계가 바뀌면 clear
 */
import * as THREE from 'three';

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
const ICON_GEOM = new THREE.PlaneGeometry(0.34, 0.34);
/** 2×2 자리 (칸 가운데에서) */
const SPOTS: readonly [number, number][] = [
  [-0.24, -0.24],
  [0.24, -0.24],
  [-0.24, 0.24],
  [0.24, 0.24],
];

export class TableView {
  private readonly group = new THREE.Group();
  private readonly tables = new Map<string, THREE.Group>();
  private readonly textures = new Map<string, THREE.Texture>();
  private readonly items = new Map<string, (string | null)[]>();

  constructor(
    scene: THREE.Scene,
    private readonly iconOf: (id: string) => HTMLCanvasElement | null,
  ) {
    scene.add(this.group);
  }

  private texture(id: string): THREE.Texture | null {
    const hit = this.textures.get(id);
    if (hit) return hit;
    const c = this.iconOf(id);
    if (!c) return null;
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    this.textures.set(id, t);
    return t;
  }

  /** 식탁 하나 (items 는 4칸, 빈 칸 null) */
  set(x: number, y: number, z: number, items: readonly (string | null)[]): void {
    const key = `${x},${y},${z}`;
    const old = this.tables.get(key);
    if (old) {
      this.group.remove(old);
      old.traverse((o) => {
        if (o instanceof THREE.Mesh && o.geometry === ICON_GEOM) (o.material as THREE.Material).dispose(); // 액자 재질은 함께 쓴다
      });
      this.tables.delete(key);
    }
    this.items.delete(key);
    if (items.every((i) => !i)) return;
    this.items.set(key, [...items]);
    const g = new THREE.Group();
    g.position.set(x + 0.5, y + 1, z + 0.5);
    items.forEach((id, i) => {
      if (!id) return;
      const [ox, oz] = SPOTS[i]!;
      const frame = new THREE.Mesh(FRAME_GEOM, frameMaterials());
      frame.position.set(ox, FRAME_T / 2 + 0.002, oz);
      g.add(frame);
      const tex = this.texture(id);
      if (!tex) return;
      const icon = new THREE.Mesh(ICON_GEOM, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }));
      icon.rotation.x = -Math.PI / 2; // 액자 위에 납작하게 눕힌다 (그림 위쪽이 북쪽)
      icon.position.set(ox, FRAME_T + 0.006, oz);
      g.add(icon);
    });
    this.group.add(g);
    this.tables.set(key, g);
  }

  /** 들어올 때 전부 바꾼다 */
  setAll(list: readonly { x: number; y: number; z: number; items: readonly (string | null)[] }[]): void {
    this.clear();
    for (const t of list) this.set(t.x, t.y, t.z, t.items);
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
