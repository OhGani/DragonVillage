/**
 * 액체(물·용암) 시뮬레이션 — 마인크래프트 규칙의 단순화.
 *
 * - 원천(단계 0)은 영구. 흐르는 액체(1..7)는 항상 더 센 이웃(단계가 작은)이나 위쪽 액체에 의지한다.
 *   의지할 곳이 없어지면 한 단계씩 약해져 결국 사라진다 → 원천을 없애면 말라붙는다.
 * - 아래가 비어 있으면 아래로 먼저 흐른다(떨어진 물은 다시 최대 세기). 아래가 단단하거나 같은 액체면 옆으로 퍼진다.
 * - 물: 7칸, 0.25초마다. 용암: 3칸(단계 2씩), 1.5초마다.
 * - 무한 물: 흐르는 물 옆에 원천이 2개 이상이고 아래가 단단하면 원천이 된다.
 * - 물이 용암 원천을 만나면 흑요석, 그 외 물·용암이 만나면 조약돌.
 * - 플레이어가 놓은 액체(방향 1..4)는 **놓은 방향으로만** 옆으로 흐른다(아들 6차). 아래로는 똑같이 떨어지고,
 *   떨어진 뒤에도 같은 방향을 유지한다. 자연 연못(방향 0)은 사방으로 퍼진다.
 *
 * 결정론적: 난수 없음, 같은 순서(좌표 키 오름차순)로 처리. 클라(M0~M1)와 서버(M2~)가 같은 코드를 돈다.
 * 틱은 20Hz 기준.
 */
import type { ChunkCoord } from '../chunk/world';
import { VoxelWorld, chunkKey } from '../chunk/world';
import { AIR_ID, type BlockDef, type BlockRegistry, FLUID_DIR_VEC, type FluidKind } from '../rules/blocks';

export interface FluidRules {
  /** 옆으로 퍼질 수 있는 최대 단계 */
  maxLevel: number;
  /** 한 칸 옆으로 갈 때 약해지는 양 */
  step: number;
  /** 몇 틱마다 움직이는지 (20Hz) */
  interval: number;
}

export const FLUID_RULES: Record<FluidKind, FluidRules> = {
  water: { maxLevel: 7, step: 1, interval: 5 },
  lava: { maxLevel: 6, step: 2, interval: 30 },
};

/** 한 틱에 처리하는 최대 칸 수 — 폰 프레임 보호 */
const MAX_PER_TICK = 2048;

const SIDES: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
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
    }
  }

  /** 마지막 호출 뒤 블록이 바뀐 청크 좌표를 꺼내고 비운다 (저장 표시용) */
  takeChanged(): ChunkCoord[] {
    const out = [...this.changed.values()];
    this.changed.clear();
    return out;
  }

  private sameKind(id: number, kind: FluidKind): BlockDef | null {
    const d = this.registry.get(id);
    return d.fluid === kind ? d : null;
  }

  /** 이 칸으로 level 세기의 액체가 들어갈 수 있나 */
  private canFlowInto(id: number, kind: FluidKind, level: number): boolean {
    const d = this.registry.get(id);
    if (d.solid) return false;
    if (!d.fluid) return true; // 공기·횃불 같은 것
    if (d.fluid !== kind) return true; // 다른 액체 → 반응
    return d.fluidLevel > level; // 같은 액체는 더 세게 만들 수 있을 때만
  }

  private flowInto(x: number, y: number, z: number, kind: FluidKind, source: number, level: number, dir: number, targetId: number): void {
    const t = this.registry.get(targetId);
    if (t.fluid && t.fluid !== kind) {
      // 물 + 용암 원천 = 흑요석, 그 외 = 조약돌
      const result = kind === 'water' && t.fluidLevel === 0 ? this.obsidian : this.cobble;
      this.set(x, y, z, result);
      this.touchNeighbors(x, y, z);
      return;
    }
    this.set(x, y, z, this.registry.fluidVariant(source, level, dir));
    this.schedule(x, y, z);
    this.touchNeighbors(x, y, z);
  }

  private process(x: number, y: number, z: number): void {
    const world = this.world;
    const id = world.getBlock(x, y, z);
    const def = this.registry.get(id);
    if (!def.fluid) return;
    const kind = def.fluid;
    const rules = FLUID_RULES[kind];
    const source = def.fluidSource;
    const dir = def.fluidDir;
    const [fdx, fdz] = FLUID_DIR_VEC[dir];
    let level = def.fluidLevel;

    // 1) 흐르는 액체: 세기 다시 계산 — 의지할 곳(위, 또는 더 센 이웃)이 없으면 약해진다
    if (level > 0) {
      const above = this.sameKind(world.getBlock(x, y + 1, z), kind);
      let next: number;
      if (dir === 0) {
        let minSide = Infinity;
        let sources = 0;
        for (const [dx, dz] of SIDES) {
          const nd = this.sameKind(world.getBlock(x + dx, y, z + dz), kind);
          if (!nd) continue;
          if (nd.fluidLevel < minSide) minSide = nd.fluidLevel;
          if (nd.fluidLevel === 0) sources++;
        }
        next = above ? rules.step : minSide + rules.step;
        if (kind === 'water' && sources >= 2) {
          const belowId = world.getBlock(x, y - 1, z);
          const belowFluid = this.sameKind(belowId, kind);
          if (this.registry.isSolid(belowId) || (belowFluid && belowFluid.fluidLevel === 0) || y === 0) next = 0; // 무한 물
        }
      } else {
        // 방향 액체는 뒤(상류) 한 칸만 본다
        const upstream = this.sameKind(world.getBlock(x - fdx, y, z - fdz), kind);
        next = above ? rules.step : (upstream ? upstream.fluidLevel : Infinity) + rules.step;
      }
      if (next > rules.maxLevel) {
        this.set(x, y, z, AIR_ID);
        this.touchNeighbors(x, y, z);
        return;
      }
      if (next !== level) {
        this.set(x, y, z, this.registry.fluidVariant(source, next, dir));
        level = next;
        this.schedule(x, y, z);
        this.touchNeighbors(x, y, z);
      }
    }

    // 2) 퍼지기: 아래로 먼저 (방향은 유지)
    let sideways: boolean;
    if (y > 0) {
      const belowId = world.getBlock(x, y - 1, z);
      if (this.canFlowInto(belowId, kind, rules.step)) this.flowInto(x, y - 1, z, kind, source, rules.step, dir, belowId);
      const belowDef = this.registry.get(world.getBlock(x, y - 1, z));
      sideways = belowDef.solid || belowDef.fluid === kind;
    } else sideways = true;

    if (sideways && level + rules.step <= rules.maxLevel) {
      const nextLevel = level + rules.step;
      const targets: readonly (readonly [number, number])[] = dir === 0 ? SIDES : [[fdx, fdz]];
      for (const [dx, dz] of targets) {
        const nx = x + dx,
          nz = z + dz;
        if (!world.inBounds(nx, y, nz)) continue;
        const nid = world.getBlock(nx, y, nz);
        if (this.canFlowInto(nid, kind, nextLevel)) this.flowInto(nx, y, nz, kind, source, nextLevel, dir, nid);
      }
    }
  }
}
