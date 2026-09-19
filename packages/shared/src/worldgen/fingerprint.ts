/**
 * 세계 전체의 지문 (스냅샷 테스트·디버그용).
 * 블록 **문자열 id** 를 해시하므로 아들이 blocks.json 순서를 바꿔도 같다.
 * 생성기를 고치면 값이 바뀐다 → 의도한 변경이면 테스트의 SNAPSHOT 을 갱신하고 GEN_VERSION 을 올린다.
 */
import type { VoxelWorld } from '../chunk/world';
import { AIR_ID, type BlockRegistry } from '../rules/blocks';

export function fingerprint(world: VoxelWorld, registry: BlockRegistry): string {
  const idHash = new Uint32Array(registry.count);
  for (const d of registry.defs) {
    let h = 0x811c9dc5;
    for (let i = 0; i < d.id.length; i++) h = Math.imul(h ^ d.id.charCodeAt(i), 0x01000193);
    idHash[d.num] = h >>> 0;
  }
  let h = 0x811c9dc5;
  let blocks = 0;
  const coords: string[] = [];
  world.forEachChunk((c) => {
    coords.push(`${c.cx},${c.cy},${c.cz}`);
  });
  coords.sort();
  for (const key of coords) {
    const [cx, cy, cz] = key.split(',').map(Number);
    const c = world.getChunk(cx, cy, cz)!;
    h = Math.imul(h ^ (cx * 73 + cy * 131 + cz * 197), 0x01000193);
    const ids = c.toBlockIds();
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] !== AIR_ID) blocks++;
      h = Math.imul(h ^ idHash[ids[i]], 0x01000193);
    }
  }
  return `${(h >>> 0).toString(16)}:${blocks}`;
}
