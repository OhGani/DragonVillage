/**
 * 액체(물·용암) 시뮬레이션. 두 종류가 한 세계에 같이 산다.
 *
 * **자연 액체**(강·연못·용암 바다, 지형 생성기가 놓음) — 마인크래프트 규칙(결정 #47):
 * - 원천(단계 0)은 영구·무한. 흐르는 액체(1..7)는 항상 더 센 이웃(단계가 작은)이나 위쪽 액체에 의지한다.
 *   의지할 곳이 없어지면 한 단계씩 약해져 결국 사라진다 → 원천을 없애면 말라붙는다.
 * - 아래가 비어 있으면 아래로 먼저(떨어진 물은 다시 최대 세기). 아래가 단단하거나 같은 액체면 사방으로 퍼진다.
 * - 물: 7칸, 0.25초마다. 용암: 3칸(단계 2씩), 1.5초마다.
 * - 무한 물: 흐르는 물 옆에 원천이 2개 이상이고 아래가 단단하면 원천이 된다.
 *
 * **고인 액체**(플레이어가 놓은 것, `fluidVolume` 1..8) — 양이 보존된다(아빠 결정 #65, 아들 6차 #52 대체):
 * - 양동이 하나 = 8. 아래가 비었으면 아래로 먼저 내려간다(아래 칸이 덜 찼으면 찰 만큼만).
 * - 옆으로는 사방으로 퍼지되, 자기보다 2 이상 낮은 이웃에게만 차이의 절반을 준다 → 퍼질수록 낮아지고 이웃끼리 높이가 같아지면 멈춘다.
 *   양 1 인 칸은 더 못 퍼진다(0 으로 갈라질 수 없다). 결과: 물 한 양동이 = 8칸의 얇은 웅덩이. 위로는 절대 안 찬다.
 * - 이웃을 보는 순서를 틱마다 돌려 한쪽으로 치우치지 않게 한다.
 * - 자연 액체 칸으로는 못 들어간다(자연 물은 무한이라 이미 가득). 자연 흐름은 얕은 고인 물을 덮어쓸 수 있다(강이 웅덩이를 삼킨다).
 *
 * 물·용암이 만나면: 물이 용암 원천(또는 가득한 고인 용암)을 만나면 흑요석, 그 외 = 조약돌. 들어가려던 액체는 그 자리에 안 생긴다.
 *
 * 결정론적: 난수 없음, 같은 순서(좌표 키 오름차순)로 처리. 서버(M2~)가 돈다. 틱은 20Hz 기준.
 */
import type { ChunkCoord } from '../chunk/world';
import { VoxelWorld, chunkKey } from '../chunk/world';
import { AIR_ID, type BlockDef, type BlockRegistry, FLUID_FULL, type FluidKind } from '../rules/blocks';

export interface FluidRules {
  /** 자연 흐름이 옆으로 퍼질 수 있는 최대 단계 */
  maxLevel: number;
  /** 자연 흐름이 한 칸 옆으로 갈 때 약해지는 양 */
  step: number;
  /** 몇 틱마다 움직이는지 (20Hz) */
  interval: number;
}

export const FLUID_RULES: Record<FluidKind, FluidRules> = {
  water: { maxLevel: 7, step: 1, interval: 5 },
  lava: { maxLevel: 6, step: 2, interval: 30 },
};

/** 한 틱에 처리하는 최대 칸 수 — 프레임 보호 */
const MAX_PER_TICK = 2048;

const SIDES: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function posKey(x: number, y: number, z: number): number {
  return (x * 4096 + y) * 4096 + z;
}

export class FluidSim {
  private readonly pending = new Map<number, number>();
  private readonly dirty = new Map<number, ChunkCoord>();
  /** 블록이 실제로 바뀐 청크 (저장용 — dirty 는 이웃 재메싱까지 포함해 더 넓다) */
  private readonly changed = new Map<number, ChunkCoord>();
  private tickCount = 0;
  private readonly obsidian: number;
  private readonly cobble: number;
  /** 블록이 실제로 바뀔 때마다 (조명 갱신용) */
  onBlockSet: ((x: number, y: number, z: number) => void) | null = null;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
  ) {
    const pick = (...ids: string[]): number => {
      for (const id of ids) {
        const d = registry.find(id);
        if (d) return d.num;
      }
      return AIR_ID;
    };
    this.obsidian = pick('obsidian', 'cobblestone', 'stone');
    this.cobble = pick('cobblestone', 'stone');
  }

  get pendingCount(): number {
    return this.pending.size;
  }

  get ticks(): number {
    return this.tickCount;
  }

  /** 블록이 바뀐 자리: 그 칸과 이웃 6칸을 다시 살핀다 */
  touch(x: number, y: number, z: number): void {
    this.schedule(x, y, z);
    this.touchNeighbors(x, y, z);
  }

  private touchNeighbors(x: number, y: number, z: number): void {
    this.schedule(x + 1, y, z);
    this.schedule(x - 1, y, z);
    this.schedule(x, y + 1, z);
    this.schedule(x, y - 1, z);
    this.schedule(x, y, z + 1);
    this.schedule(x, y, z - 1);
  }

  private schedule(x: number, y: number, z: number): void {
    if (!this.world.inBounds(x, y, z)) return;
    const def = this.registry.get(this.world.getBlock(x, y, z));
    if (!def.fluid) return; // 액체가 아닌 칸은 스스로 할 일이 없다
    const due = this.tickCount + FLUID_RULES[def.fluid].interval;
    const key = posKey(x, y, z);
    const prev = this.pending.get(key);
    if (prev === undefined || due < prev) this.pending.set(key, due);
  }

  /** 한 틱. 바뀐 청크 좌표를 돌려준다 (재메싱용) */
  tick(): ChunkCoord[] {
    this.tickCount++;
    const due: number[] = [];
    for (const [key, when] of this.pending) if (when <= this.tickCount) due.push(key);
    due.sort((a, b) => a - b);
    const n = Math.min(due.length, MAX_PER_TICK);
    for (let i = 0; i < n; i++) {
      const key = due[i];
      this.pending.delete(key);
      const z = key % 4096;
      const y = Math.floor(key / 4096) % 4096;
      const x = Math.floor(key / (4096 * 4096));
      this.process(x, y, z);
    }
    const out = [...this.dirty.values()];
    this.dirty.clear();
    return out;
  }

  private set(x: number, y: number, z: number, id: number): void {
    const res = this.world.setBlock(x, y, z, id);
    for (const c of res.dirty) this.dirty.set(chunkKey(c.cx, c.cy, c.cz), c);
    if (res.changed) {
      const cx = x >> 4,
        cy = y >> 4,
        cz = z >> 4;
      this.changed.set(chunkKey(cx, cy, cz), { cx, cy, cz });
      this.onBlockSet?.(x, y, z);
    }
  }

  /** 마지막 호출 뒤 블록이 바뀐 청크 좌표를 꺼내고 비운다 (저장 표시용) */
  takeChanged(): ChunkCoord[] {
    const out = [...this.changed.values()];
    this.changed.clear();
    return out;
  }

  /** 자연 흐름이 이 칸으로 level 세기로 들어갈 수 있나 */
  private canFlowInto(id: number, kind: FluidKind, level: number): boolean {
    const d = this.registry.get(id);
    if (d.solid) return false;
    if (!d.fluid) return true; // 공기·횃불 같은 것
    if (d.fluid !== kind) return true; // 다른 액체 → 반응
    return d.fluidLevel > level; // 같은 액체(자연·고인 모두)는 더 세게(깊게) 만들 수 있을 때만
  }

  /** 물·용암 반응. 반응이 일어났으면 true */
  private react(x: number, y: number, z: number, kind: FluidKind, target: BlockDef): boolean {
    if (!target.fluid || target.fluid === kind) return false;
    // 물 + 용암 원천(또는 가득한 고인 용암) = 흑요석, 그 외 = 조약돌
    const result = kind === 'water' && target.fluidLevel === 0 ? this.obsidian : this.cobble;
    this.set(x, y, z, result);
    this.touchNeighbors(x, y, z);
    return true;
  }

  private flowInto(x: number, y: number, z: number, kind: FluidKind, source: number, level: number, targetId: number): void {
    if (this.react(x, y, z, kind, this.registry.get(targetId))) return;
    this.set(x, y, z, this.registry.fluidVariant(source, level));
    this.schedule(x, y, z);
    this.touchNeighbors(x, y, z);
  }

  private process(x: number, y: number, z: number): void {
    const def = this.registry.get(this.world.getBlock(x, y, z));
    if (!def.fluid) return;
    if (def.fluidVolume > 0) this.processFinite(x, y, z, def);
    else this.processNatural(x, y, z, def);
  }

  // ---------------------------------------------------------------- 자연 액체 (마인크래프트 규칙)

  private processNatural(x: number, y: number, z: number, def: BlockDef): void {
    const world = this.world;
    const kind = def.fluid!;
    const rules = FLUID_RULES[kind];
    const source = def.fluidSource;
    let level = def.fluidLevel;

    // 1) 흐르는 액체: 세기 다시 계산 — 의지할 곳(위, 또는 더 센 이웃)이 없으면 약해진다
    if (level > 0) {
      const above = this.natural(world.getBlock(x, y + 1, z), kind);
      let minSide = Infinity;
      let sources = 0;
      for (const [dx, dz] of SIDES) {
        const nd = this.natural(world.getBlock(x + dx, y, z + dz), kind);
        if (!nd) continue;
        if (nd.fluidLevel < minSide) minSide = nd.fluidLevel;
        if (nd.fluidLevel === 0) sources++;
      }
      let next = above ? rules.step : minSide + rules.step;
      if (kind === 'water' && sources >= 2) {
        const belowId = world.getBlock(x, y - 1, z);
        const belowFluid = this.natural(belowId, kind);
        if (this.registry.isSolid(belowId) || (belowFluid && belowFluid.fluidLevel === 0) || y === 0) next = 0; // 무한 물
      }
      if (next > rules.maxLevel) {
        this.set(x, y, z, AIR_ID);
        this.touchNeighbors(x, y, z);
        return;
      }
      if (next !== level) {
        this.set(x, y, z, this.registry.fluidVariant(source, next));
        level = next;
        this.schedule(x, y, z);
        this.touchNeighbors(x, y, z);
      }
    }

    // 2) 퍼지기: 아래로 먼저
    let sideways: boolean;
    if (y > 0) {
      const belowId = world.getBlock(x, y - 1, z);
      if (this.canFlowInto(belowId, kind, rules.step)) this.flowInto(x, y - 1, z, kind, source, rules.step, belowId);
      const belowDef = this.registry.get(world.getBlock(x, y - 1, z));
      sideways = belowDef.solid || belowDef.fluid === kind;
    } else sideways = true;

    if (sideways && level + rules.step <= rules.maxLevel) {
      const nextLevel = level + rules.step;
      for (const [dx, dz] of SIDES) {
        const nx = x + dx,
          nz = z + dz;
        if (!world.inBounds(nx, y, nz)) continue;
        const nid = world.getBlock(nx, y, nz);
        if (this.canFlowInto(nid, kind, nextLevel)) this.flowInto(nx, y, nz, kind, source, nextLevel, nid);
      }
    }
  }

  /** 같은 종류의 **자연** 액체(고인 것 제외)면 정의를 돌려준다 */
  private natural(id: number, kind: FluidKind): BlockDef | null {
    const d = this.registry.get(id);
    return d.fluid === kind && d.fluidVolume === 0 ? d : null;
  }

  // ---------------------------------------------------------------- 고인 액체 (양 보존)

  /** 고인 액체가 이 칸에 얼마나 더 들어갈 수 있나 (0 = 못 들어감) */
  private finiteRoom(id: number, kind: FluidKind): number {
    const d = this.registry.get(id);
    if (d.solid) return 0;
    if (!d.fluid) return FLUID_FULL; // 공기·횃불
    if (d.fluid !== kind) return -1; // 다른 액체 → 반응
    return d.fluidVolume > 0 ? FLUID_FULL - d.fluidVolume : 0; // 자연 액체는 이미 가득
  }

  private setFinite(x: number, y: number, z: number, source: number, volume: number): void {
    this.set(x, y, z, this.registry.fluidFinite(source, volume));
    if (volume > 0) this.schedule(x, y, z);
    this.touchNeighbors(x, y, z);
  }

  private processFinite(x: number, y: number, z: number, def: BlockDef): void {
    const world = this.world;
    const kind = def.fluid!;
    const source = def.fluidSource;
    let v = def.fluidVolume;

    // 1) 아래로 먼저 — 아래 칸이 찰 만큼만
    if (y > 0) {
      const belowId = world.getBlock(x, y - 1, z);
      const room = this.finiteRoom(belowId, kind);
      if (room < 0) {
        // 다른 액체와 반응: 이 액체는 아래 칸으로 사라지고 그 자리에 돌이 생긴다
        this.react(x, y - 1, z, kind, this.registry.get(belowId));
        this.setFinite(x, y, z, source, 0);
        return;
      }
      if (room > 0) {
        const move = Math.min(v, room);
        const belowVol = this.registry.get(belowId).fluid === kind ? this.registry.get(belowId).fluidVolume : 0;
        this.setFinite(x, y - 1, z, source, belowVol + move);
        v -= move;
        this.setFinite(x, y, z, source, v);
        if (v === 0) return;
      }
    }

    // 2) 옆으로 — 2 이상 낮은 이웃에게 차이의 절반. 이웃 순서는 틱마다 돌린다
    if (v < 2) return;
    const start = this.tickCount & 3;
    for (let i = 0; i < 4 && v >= 2; i++) {
      const [dx, dz] = SIDES[(start + i) & 3];
      const nx = x + dx,
        nz = z + dz;
      if (!world.inBounds(nx, y, nz)) continue;
      const nid = world.getBlock(nx, y, nz);
      const room = this.finiteRoom(nid, kind);
      if (room < 0) {
        this.react(nx, y, nz, kind, this.registry.get(nid)); // 물은 소모되지 않는다(마인크래프트와 같음)
        continue;
      }
      if (room === 0) continue;
      const nd = this.registry.get(nid);
      const nv = nd.fluid === kind ? nd.fluidVolume : 0;
      const diff = v - nv;
      if (diff < 2) continue;
      const give = Math.min(diff >> 1, room);
      this.setFinite(nx, y, nz, source, nv + give);
      v -= give;
    }
    if (v !== def.fluidVolume) this.setFinite(x, y, z, source, v);
  }
}
