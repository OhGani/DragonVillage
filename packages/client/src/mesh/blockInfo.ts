import { DOOR_DIR, type BlockRegistry } from '@dragon-village/shared';
import { LAYER_CUTOUT, LAYER_NONE, LAYER_OPAQUE, LAYER_TRANSLUCENT, type MeshBlockInfo } from './meshTypes';

/**
 * 블록 레지스트리 + 텍스처 레이어 표 → 워커용 평탄 배열 (인덱스 = 블록 번호).
 * 없는 텍스처는 'missing' 레이어(0)로.
 */
export function buildMeshBlockInfo(registry: BlockRegistry, textureIndex: ReadonlyMap<string, number>): MeshBlockInfo[] {
  const missing = textureIndex.get('missing') ?? 0;
  const layerOf = (name: string): number => textureIndex.get(name) ?? missing;

  return registry.defs.map((d): MeshBlockInfo => {
    if (d.id === 'air' || !d.textures) {
      return { layer: LAYER_NONE, opaque: false, castAO: false, sameCull: false, tex: [0, 0, 0, 0, 0, 0], fluidKind: 0, fluidHeight: 0, panel: null };
    }
    const translucent = d.fluid === 'water' || d.id === 'ice';
    // 용암은 solid=false 지만 마인크래프트처럼 불투명하게 그린다
    const opaque = (d.solid && !d.transparent) || d.fluid === 'lava';
    const layer = translucent ? LAYER_TRANSLUCENT : opaque ? LAYER_OPAQUE : LAYER_CUTOUT;
    const [top, side, bottom] = d.textures;
    const s = layerOf(side);
    // 문(#71): 닫힌 문은 놓은 사람 쪽 가장자리에, 열린 문은 왼쪽(경첩) 가장자리에 붙은 얇은 판
    let panel: MeshBlockInfo['panel'] = null;
    if (d.door) {
      const [fx, fz] = DOOR_DIR[d.door.facing]!;
      if (!d.door.open) panel = [fx !== 0 ? 0 : 2, fx < 0 || fz < 0 ? 1 : 0];
      else {
        const lx = fz,
          lz = -fx; // 왼쪽 = 위 × 앞
        panel = [lx !== 0 ? 0 : 2, lx < 0 || lz < 0 ? 0 : 1];
      }
    }
    return {
      panel,
      layer,
      opaque,
      castAO: (opaque && !d.fluid) || d.id === 'leaves',
      sameCull: d.transparent,
      tex: [s, s, layerOf(top), layerOf(bottom), s, s],
      fluidKind: d.fluid === 'water' ? 1 : d.fluid === 'lava' ? 2 : 0,
      fluidHeight: d.fluid ? (8 - d.fluidLevel) / 9 : 0,
    };
  });
}
