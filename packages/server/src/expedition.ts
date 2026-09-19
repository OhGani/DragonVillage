/**
 * 원정 세계 하나 (M3). 마을 룸 안의 임시 서브 월드 — 시드로 생성, 저장하지 않고, 끝나면 버린다 (DESIGN 3절).
 *
 * - 타이머: 시작 시각 + durationSec. 낮·저녁·밤은 shared/rules/expeditions 의 순수 함수.
 * - 정산(M3, 가방은 M4): 플레이어가 부순 블록의 드롭을 여기서 센다. 귀환하면 그 목록이 정산이고 마을 창고에 더해진다.
 *   늦게(강제) 돌아오면 keepRatio 만큼만.
 * - 액체 시뮬은 마을과 같은 코드(FluidSim). 바뀐 청크는 늦게 합류한 사람에게 ChunkData 로.
 */
import {
  type BlockDef,
  type BlockRegistry,
  type ChunkCoord,
  type ExpeditionDef,
  type ExpeditionResultItem,
  FluidSim,
  ISLAND_GEN_VERSION,
  type VoxelWorld,
  chunkKey,
  generateIsland,
  hash3,
  phaseAt,
  remainingSec,
} from '@dragon-village/shared';

export interface Spawn {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export class Expedition {
  readonly world: VoxelWorld;
  readonly spawn: Spawn;
  readonly genVersion: number;
  readonly endsAt: number;
  /** 도착 포탈 문틀 아래 가운데 (귀환 판정) */
  readonly portal: { x: number; y: number; z: number };
  readonly fluids: FluidSim;
  /** 원정 안에 있는 플레이어 번호 */
  readonly members = new Set<number>();
  /** 생성 지형과 달라진 청크 (합류자에게 보낼 것) */
  private readonly modified = new Map<number, ChunkCoord>();
  /** 플레이어별 모은 것 */
  private readonly tally = new Map<number, Map<string, number>>();
  batch: { x: number; y: number; z: number; id: string }[] = [];
  /** 시간이 다 됐다 (강제 귀환 시작) */
  ended = false;
  /** 생성 ms */
  readonly genMs: number;

  constructor(
    readonly def: ExpeditionDef,
    readonly seed: number,
    registry: BlockRegistry,
    readonly startedAt: number,
  ) {
    if (def.generator !== 'island') throw new Error(`원정지 생성기 '${def.generator}' 는 아직 없어요 (M3 는 초원 섬만)`);
    const gen = generateIsland(registry, seed, def.treasures);
    this.world = gen.world;
    this.spawn = gen.spawn;
    this.portal = gen.layout.portal;
    this.genVersion = ISLAND_GEN_VERSION;
    this.genMs = gen.ms;
    this.endsAt = startedAt + def.durationSec * 1000;
    this.fluids = new FluidSim(this.world, registry);
    this.fluids.onBlockSet = (x, y, z) => this.batch.push({ x, y, z, id: registry.get(this.world.getBlock(x, y, z)).id });
  }

  elapsedSec(now: number): number {
    return Math.max(0, (now - this.startedAt) / 1000);
  }
  remainingSec(now: number): number {
    return remainingSec(this.def, this.elapsedSec(now));
  }
  phase(now: number) {
    return phaseAt(this.def, this.elapsedSec(now));
  }
  get modifiedCount(): number {
    return this.modified.size;
  }
  modifiedChunks(): ChunkCoord[] {
    return [...this.modified.values()];
  }
  markModified(x: number, y: number, z: number): void {
    const c = { cx: x >> 4, cy: y >> 4, cz: z >> 4 };
    this.modified.set(chunkKey(c.cx, c.cy, c.cz), c);
  }
  markModifiedChunk(c: ChunkCoord): void {
    this.modified.set(chunkKey(c.cx, c.cy, c.cz), c);
  }

  /** 포탈 문틀 안(4×5 흑요석 틀의 가운데 2×3 공기)에 서 있나 — 귀환 판정 */
  inPortal(x: number, y: number, z: number): boolean {
    const p = this.portal;
    return x >= p.x - 1 && x < p.x + 1 && z >= p.z - 0.6 && z <= p.z + 1.6 && y >= p.y + 0.5 && y <= p.y + 4;
  }

  /** 부순 블록의 드롭을 센다. dropCount 범위는 자리·시드로 결정론적으로 뽑는다 */
  onBroken(idx: number, def: BlockDef, x: number, y: number, z: number): void {
    if (!def.drops || def.fluid) return;
    const [lo, hi] = def.dropCount;
    const n = hi > lo ? lo + Math.floor(hash3(x, y, z, this.seed) * (hi - lo + 1)) : lo;
    if (n <= 0) return;
    let bag = this.tally.get(idx);
    if (!bag) this.tally.set(idx, (bag = new Map()));
    bag.set(def.drops, (bag.get(def.drops) ?? 0) + n);
  }

  /** 모은 것 (정산). late 면 keepRatio 만큼(올림 — 1개는 1개) */
  settle(idx: number, late: boolean, keepRatio: number): ExpeditionResultItem[] {
    const bag = this.tally.get(idx);
    this.tally.delete(idx);
    if (!bag) return [];
    const ratio = late ? keepRatio : 1;
    const out: ExpeditionResultItem[] = [];
    for (const [id, count] of [...bag.entries()].sort((a, b) => b[1] - a[1])) {
      const kept = Math.ceil(count * ratio);
      if (kept > 0) out.push({ id, count: kept });
    }
    return out;
  }

  /** 시험·디버그: 지금까지 센 것 */
  tallyOf(idx: number): ExpeditionResultItem[] {
    const bag = this.tally.get(idx);
    return bag ? [...bag.entries()].map(([id, count]) => ({ id, count })) : [];
  }
}
