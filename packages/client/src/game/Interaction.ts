import {
  AIR_ID,
  FLUID_FULL,
  type BlockDef,
  type BlockRegistry,
  type ChunkCoord,
  type RayHit,
  type VoxelWorld,
  bodyOverlapsBlock,
  breakSeconds,
  doorHinge,
  facingOf,
  needToolText,
  toolOf,
  raycastVoxels,
} from '@dragon-village/shared';
import { TOOLS } from '@dragon-village/shared/data';
import type { InputState } from '../input/InputState';
import { PLAYER_SIZE, type Player } from '../player/Player';

export const REACH = 5;
const BREAK_COOLDOWN = 0.3; // 마인크래프트: 부순 뒤 5틱 대기
const PLACE_REPEAT = 0.25; // 우클릭 유지 시 반복 간격

export interface InteractionEvents {
  onBlocksChanged(dirty: readonly ChunkCoord[]): void;
  onSwing(): void;
  /** 놓았다: id 새 블록, prev 그 자리에 있던 블록 (서버가 거절하면 되돌릴 때 쓴다) */
  onPlaced?(x: number, y: number, z: number, id: number, prev: number): void;
  /** 부쐈다: prev 가 부서진 블록 */
  onBroken?(x: number, y: number, z: number, prev: number): void;
  /** 못 캐는 이유 등 짧은 안내 (토스트) */
  onHint?(text: string): void;
  /** 상자를 탭했다 (#84) — 놓기 대신 연다 */
  onOpenChest?(x: number, y: number, z: number): void;
}

/** 조준·부수기·놓기. 서버가 생기면(M2) setBlock 이 요청으로 바뀌고 나머지는 그대로. */
export class Interaction {
  target: RayHit | null = null;
  /** 0..1 부수기 진행 */
  progress = 0;
  private breakingKey = -1;
  private cooldown = 0;
  private placeTimer = 0;
  private swingTimer = 0;
  /** 현재 손에 든 블록 번호 (없으면 0) */
  selectedBlock = 0;
  /** 현재 손에 든 아이템 id (곡괭이 등급·속도용). 빈손이면 null */
  heldItem: string | null = null;
  private hintTimer = 0;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    private readonly player: Player,
    private readonly events: InteractionEvents,
  ) {}

  private readonly getBlock = (x: number, y: number, z: number) => this.world.getBlock(x, y, z);
  /** 문 놓기(#71): 아래 칸 + 윗칸을 내가 보는 방향으로. 윗칸이 비어 있어야 한다 */
  private placeDoor(x: number, y: number, z: number, base: BlockDef, cur: number): void {
    if (!this.world.inBounds(x, y + 1, z) || this.world.getBlock(x, y + 1, z) !== AIR_ID) return;
    if (bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, x, y, z) || bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, x, y + 1, z)) return;
    const look = this.player.lookDir;
    const facing = facingOf(look.x, look.z);
    // 경첩은 벽 쪽에 (결정 #83). 옆에 있는 다른 문은 벽으로 치지 않는다
    const isWall = (bx: number, by: number, bz: number) => {
      if (!this.world.inBounds(bx, by, bz)) return false;
      const d = this.registry.get(this.world.getBlock(bx, by, bz));
      return d.solid && d.door === null;
    };
    const hinge = doorHinge(isWall, x, y, z, facing);
    const lower = this.registry.doorVariant(base.num, facing, false, false, hinge);
    const upper = this.registry.doorVariant(base.num, facing, true, false, hinge);
    const r1 = this.world.setBlock(x, y, z, lower);
    const r2 = this.world.setBlock(x, y + 1, z, upper);
    if (r1.changed || r2.changed) {
      this.events.onBlocksChanged([...r1.dirty, ...r2.dirty]);
      this.events.onPlaced?.(x, y, z, lower, cur);
      this.events.onSwing();
    }
  }

  /** 문 열고 닫기(#71): 두 반쪽을 같이 뒤집고, 조준한 칸만 서버에 알린다(서버가 다른 반쪽도 바꿔 준다) */
  private toggleDoor(t: RayHit, def: BlockDef): void {
    const d = def.door!;
    const ly = d.upper ? t.y - 1 : t.y;
    // 닫을 때 문 칸에 내가 서 있으면 안 된다
    if (d.open && (bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, t.x, ly, t.z) || bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, t.x, ly + 1, t.z))) return;
    const lower = this.registry.doorVariant(d.base, d.facing, false, !d.open, d.hinge);
    const upper = this.registry.doorVariant(d.base, d.facing, true, !d.open, d.hinge);
    const r1 = this.world.setBlock(t.x, ly, t.z, lower);
    const r2 = this.world.setBlock(t.x, ly + 1, t.z, upper);
    if (r1.changed || r2.changed) {
      this.events.onBlocksChanged([...r1.dirty, ...r2.dirty]);
      this.events.onPlaced?.(t.x, t.y, t.z, d.upper ? upper : lower, t.id);
      this.events.onSwing();
    }
  }

  /** 공기가 아닌 블록은 전부 조준한다(횃불·꽃처럼 몸이 통과되는 것도 캘 수 있게). 액체는 물·용암을 들고 있을 때만(양동이처럼) */
  private readonly targetable = (id: number) => id !== AIR_ID && (this.bucketMode || !this.registry.isFluid(id));

  get bucketMode(): boolean {
    return this.selectedBlock > 0 && this.registry.get(this.selectedBlock).fluid !== null;
  }

  update(input: InputState, dt: number): void {
    const eye = this.player.eye;
    const dir = this.player.lookDir;
    this.target = raycastVoxels(this.getBlock, this.targetable, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, REACH);

    this.cooldown = Math.max(0, this.cooldown - dt);

    // ---- 부수기 (꾹) ----
    if (input.primary && this.target) {
      const t = this.target;
      const key = ((t.x * 1024 + t.y) * 1024 + t.z) | 0;
      if (key !== this.breakingKey) {
        this.breakingKey = key;
        this.progress = 0;
      }
      this.swingTimer -= dt;
      if (this.swingTimer <= 0) {
        this.events.onSwing();
        this.swingTimer = 0.25;
      }
      const def = this.registry.get(t.id);
      if (def.fluid) {
        // 양동이처럼 바로 떠낸다: 자연 원천(무한) 또는 고인 액체(얕은 웅덩이도 닦아낸다). 자연 흐름은 원천이 사라지면 저절로 마른다
        this.progress = 0;
        if (this.cooldown <= 0 && (def.fluidLevel === 0 || def.fluidVolume > 0)) {
          const res = this.world.setBlock(t.x, t.y, t.z, AIR_ID);
          if (res.changed) {
            this.events.onBlocksChanged(res.dirty);
            this.events.onBroken?.(t.x, t.y, t.z, t.id);
          }
          this.breakingKey = -1;
          this.cooldown = BREAK_COOLDOWN;
        }
      } else if (def.hardness === null) {
        this.progress = 0; // 부술 수 없음 (기반암)
      } else if (this.cooldown <= 0) {
        // 곡괭이 등급·속도 (아들 2026-09-20): 곡괭이가 필요한 블록은 든 곡괭이로 시간이 달라지고, 등급이 낮으면 못 캔다
        const secs = breakSeconds(def, toolOf(TOOLS, this.heldItem));
        if (secs === null) {
          this.progress = 0;
          this.hintTimer -= dt;
          if (this.hintTimer <= 0) {
            this.events.onHint?.(needToolText(def));
            this.hintTimer = 2;
          }
          return;
        }
        this.progress += secs <= 0 ? 1 : dt / secs;
        if (this.progress >= 1) {
          const res = this.world.setBlock(t.x, t.y, t.z, AIR_ID);
          if (res.changed) {
            this.events.onBlocksChanged(res.dirty);
            this.events.onBroken?.(t.x, t.y, t.z, t.id);
            if (def.door) {
              // 문은 두 칸: 다른 반쪽도 같이 (서버도 같이 지운다, #71)
              const r2 = this.world.setBlock(t.x, def.door.upper ? t.y - 1 : t.y + 1, t.z, AIR_ID);
              if (r2.changed) this.events.onBlocksChanged(r2.dirty);
            }
          }
          this.progress = 0;
          this.breakingKey = -1;
          this.cooldown = BREAK_COOLDOWN;
        }
      }
    } else {
      this.progress = 0;
      this.breakingKey = -1;
      this.swingTimer = 0;
    }

    // ---- 놓기 (탭 / 우클릭, 유지 시 반복) ----
    if (input.secondaryTap) {
      this.place();
      this.placeTimer = PLACE_REPEAT;
    } else if (input.secondaryHold) {
      this.placeTimer -= dt;
      if (this.placeTimer <= 0) {
        this.place();
        this.placeTimer = PLACE_REPEAT;
      }
    } else {
      this.placeTimer = 0;
    }
  }

  private place(): void {
    const t = this.target;
    if (!t) return;
    // 문을 탭하면 놓는 대신 열고 닫는다 (빈손도 됨, #71)
    const tdef = this.registry.get(t.id);
    if (tdef.door) {
      this.toggleDoor(t, tdef);
      return;
    }
    // 상자를 탭하면 놓는 대신 연다 (빈손도 됨, #84)
    if (tdef.chest) {
      this.events.onOpenChest?.(t.x, t.y, t.z);
      this.events.onSwing();
      return;
    }
    if (this.selectedBlock <= 0) return;
    const x = t.x + t.nx,
      y = t.y + t.ny,
      z = t.z + t.nz;
    if (!this.world.inBounds(x, y, z)) return;
    const cur = this.world.getBlock(x, y, z);
    if (cur !== AIR_ID && !this.registry.isFluid(cur)) return; // 공기·액체 자리에만 놓는다 (횃불 위에 덮어쓰지 않게)
    const def = this.registry.get(this.selectedBlock);
    if (def.shape === 'door' && this.registry.isDoor(def.num)) {
      this.placeDoor(x, y, z, def, cur);
      return;
    }
    // 횃불(#82): 블록 옆면을 탭하면 그 벽에 붙이고, 윗면이면 바닥에 세운다. 천장에는 못 붙인다
    if (def.torch) {
      if (t.ny < 0) return;
      const wall = t.ny > 0 ? -1 : facingOf(-t.nx, -t.nz);
      const num = wall < 0 ? def.num : this.registry.torchVariant(def.num, wall);
      const r = this.world.setBlock(x, y, z, num);
      if (r.changed) {
        this.events.onBlocksChanged(r.dirty);
        this.events.onPlaced?.(x, y, z, num, cur);
        this.events.onSwing();
      }
      return;
    }
    if (def.solid && bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, x, y, z)) return; // 내 몸 안에는 못 놓는다
    // 물·용암은 양동이 하나만큼(8/8)의 고인 액체로 놓는다 — 사방으로 퍼지되 양만큼만 (결정 #65)
    const blockNum = def.fluid ? this.registry.fluidFinite(def.fluidSource, FLUID_FULL) : this.selectedBlock;
    const res = this.world.setBlock(x, y, z, blockNum);
    if (res.changed) {
      this.events.onBlocksChanged(res.dirty);
      this.events.onPlaced?.(x, y, z, blockNum, cur);
      this.events.onSwing();
    }
  }

}
