import type { BlockRegistry } from '@dragon-village/shared';
import { LAYER_CUTOUT, LAYER_NONE, LAYER_OPAQUE, LAYER_TRANSLUCENT, type MeshBlockInfo } from './meshTypes';

const TRANSLUCENT_IDS = new Set(['water', 'water_deep', 'ice']);

/**
 * 블록 레지스트리 + 텍스처 레이어 표 → 워커용 평탄 배열 (인덱스 = 블록 번호).
 * 없는 텍스처는 'missing' 레이어(0)로.
 */
export function buildMeshBlockInfo(registry: BlockRegistry, textureIndex: ReadonlyMap<string, number>): MeshBlockInfo[] {
  const missing = textureIndex.get('missing') ?? 0;
  const layerOf = (name: string): number => textureIndex.get(name) ?? missing;

  return registry.defs.map((d): MeshBlockInfo => {
    if (d.id === 'air' || !d.textures) {
      return { layer: LAYER_NONE, opaque: false, castAO: false, sameCull: false, tex: [0, 0, 0, 0, 0, 0] };
    }
    const translucent = TRANSLUCENT_IDS.has(d.id);
    // 용암은 solid=false 지만 마인크래프트처럼 불투명하게 그린다
    const opaque = (d.solid && !d.transparent) || d.id === 'lava';
    const layer = translucent ? LAYER_TRANSLUCENT : opaque ? LAYER_OPAQUE : LAYER_CUTOUT;
    const [top, side, bottom] = d.textures;
    const s = layerOf(side);
    return {
      layer,
      opaque,
      castAO: opaque || d.id === 'leaves',
      sameCull: d.transparent,
      tex: [s, s, layerOf(top), layerOf(bottom), s, s],
    };
  });
}
