/**
 * 원정 세계 하나 (M3). 마을 룸 안의 임시 서브 월드 — 시드로 생성, 저장하지 않고, 끝나면 버린다 (DESIGN 3절).
 *
 * - 타이머: 시작 시각 + durationSec. 낮·저녁·밤은 shared/rules/expeditions 의 순수 함수.
 * - 전리품(M4): 원정 중 가방에 들어온 것은 룸이 플레이어별로 센다(RoomPlayer.gained). 늦게 돌아오면 그중 절반을 잃는다.
 * - 액체 시뮬은 마을과 같은 코드(FluidSim). 바뀐 청크는 늦게 합류한 사람에게 ChunkData 로.
 */
import {
  type BlockRegistry,
  type ChunkCoord,
  type ExpeditionDef,
  FluidSim,
  ISLAND_GEN_VERSION,
  type VoxelWorld,
  chunkKey,
  generateIsland,
  phaseAt,
  portalContains,
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
  batch: { x: number; y: number; z: number; id: string }[] = [];
  /** 시간이 다 됐다 (강제 귀환 시작) */
  ended = false;
  /** 생성 ms */
  readonly genMs: number;
  /** 보물 오두막 상자 자리 (열면 = 부수면 경험치, M6-1) */
  readonly treasures: readonly { x: number; y: number; z: number }[];
  private readonly treasureKeys: Set<string>;

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
    this.treasures = gen.layout.treasures;
    this.treasureKeys = new Set(gen.layout.treasures.map((t) => `${t.x},${t.y},${t.z}`));
    this.genVersion = ISLAND_GEN_VERSION;
    this.genMs = gen.ms;
    this.endsAt = startedAt + def.durationSec * 1000;
    this.fluids = new FluidSim(this.world, registry);
    this.fluids.onBlockSet = (x, y, z) => this.batch.push({ x, y, z, id: registry.get(this.world.getBlock(x, y, z)).id });
  }

  isTreasure(x: number, y: number, z: number): boolean {
    return this.treasureKeys.has(`${x},${y},${z}`);
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
    return portalContains(this.portal, x, y, z);
  }
}
