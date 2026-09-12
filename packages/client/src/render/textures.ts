import * as THREE from 'three';

export const TEX_SIZE = 16;

export interface TextureAtlas {
  texture: THREE.DataArrayTexture;
  /** 텍스처 이름 → 레이어 번호. 'missing' 은 항상 0 */
  index: Map<string, number>;
  /** 아이콘 그리기용 원본 픽셀 */
  images: Map<string, ImageData>;
}

// 저장소 루트 textures/*.png 전부. 아들이 파일을 넣으면 자동으로 포함된다.
const files = import.meta.glob('../../../../textures/*.png', { eager: true, query: '?url', import: 'default' }) as Record<
  string,
  string
>;

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.png$/, '');
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`그림을 못 읽었어요: ${url}`));
    img.src = url;
  });
}

function missingImage(): ImageData {
  const d = new ImageData(TEX_SIZE, TEX_SIZE);
  for (let y = 0; y < TEX_SIZE; y++)
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const dark = ((x >> 3) + (y >> 3)) & 1;
      d.data[i] = dark ? 0 : 248;
      d.data[i + 1] = 0;
      d.data[i + 2] = dark ? 0 : 248;
      d.data[i + 3] = 255;
    }
  return d;
}

/** textures/*.png → DataArrayTexture (NearestFilter, 밉맵) */
export async function loadTextureAtlas(): Promise<TextureAtlas> {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D 캔버스를 만들 수 없어요');
  ctx.imageSmoothingEnabled = false;

  const entries = Object.entries(files)
    .map(([path, url]) => ({ name: nameOf(path), url }))
    .filter((e) => e.name !== 'missing')
    .sort((a, b) => a.name.localeCompare(b.name));

  const images = new Map<string, ImageData>();
  images.set('missing', missingImage());

  const loaded = await Promise.all(
    entries.map(async (e) => {
      try {
        const img = await loadImage(e.url);
        if (img.width !== TEX_SIZE || img.height !== TEX_SIZE) {
          console.warn(`textures/${e.name}.png 는 ${img.width}×${img.height} 예요. 16×16 으로 줄여서 써요.`);
        }
        ctx.clearRect(0, 0, TEX_SIZE, TEX_SIZE);
        ctx.drawImage(img, 0, 0, TEX_SIZE, TEX_SIZE);
        return { name: e.name, data: ctx.getImageData(0, 0, TEX_SIZE, TEX_SIZE) };
      } catch (err) {
        console.warn(err);
        return null;
      }
    }),
  );
  for (const l of loaded) if (l) images.set(l.name, l.data);

  const names = ['missing', ...[...images.keys()].filter((n) => n !== 'missing')];
  const depth = names.length;
  const data = new Uint8Array(TEX_SIZE * TEX_SIZE * 4 * depth);
  const index = new Map<string, number>();
  const rowBytes = TEX_SIZE * 4;
  names.forEach((name, layer) => {
    index.set(name, layer);
    const src = images.get(name)!.data;
    const base = layer * TEX_SIZE * rowBytes;
    // PNG 는 위→아래, GL 텍스처는 아래→위(v=0 이 아래). 줄을 뒤집어 넣어 그림이 똑바로 서게 한다
    for (let row = 0; row < TEX_SIZE; row++) {
      data.set(src.subarray(row * rowBytes, (row + 1) * rowBytes), base + (TEX_SIZE - 1 - row) * rowBytes);
    }
  });

  const texture = new THREE.DataArrayTexture(data, TEX_SIZE, TEX_SIZE, depth);
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace; // 마인크래프트처럼 색 관리 없이 그대로
  texture.needsUpdate = true;

  return { texture, index, images };
}
