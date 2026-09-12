import {
  AIR_ID,
  type BlockRegistry,
  type ChunkCoord,
  type RayHit,
  type VoxelWorld,
  bodyOverlapsBlock,
  raycastVoxels,
} from '@dragon-village/shared';
import type { InputState } from '../input/InputState';
import { PLAYER_SIZE, type Player } from '../player/Player';

export const REACH = 5;
const BREAK_COOLDOWN = 0.3; // 마인크래프트: 부순 뒤 5틱 대기
const PLACE_REPEAT = 0.25; // 우클릭 유지 시 반복 간격

export interface InteractionEvents {
  onBlocksChanged(dirty: readonly ChunkCoord[]): void;
  onSwing(): void;
  onPlaced?(x: number, y: number, z: number, id: number): void;
  onBroken?(x: number, y: number, z: number, id: number): void;
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

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    private readonly player: Player,
    private readonly events: InteractionEvents,
  ) {}

  private readonly getBlock = (x: number, y: number, z: number) => this.world.getBlock(x, y, z);
  private readonly targetable = (id: number) => this.registry.isSolid(id);

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
      if (def.hardness === null) {
        this.progress = 0; // 부술 수 없음 (기반암·물)
      } else if (this.cooldown <= 0) {
        this.progress += def.hardness <= 0 ? 1 : dt / def.hardness;
        if (this.progress >= 1) {
          const res = this.world.setBlock(t.x, t.y, t.z, AIR_ID);
          if (res.changed) {
            this.events.onBlocksChanged(res.dirty);
            this.events.onBroken?.(t.x, t.y, t.z, t.id);
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
    if (!t || this.selectedBlock <= 0) return;
    const x = t.x + t.nx,
      y = t.y + t.ny,
      z = t.z + t.nz;
    if (!this.world.inBounds(x, y, z)) return;
    const cur = this.world.getBlock(x, y, z);
    if (this.registry.isSolid(cur)) return; // air·물만 덮어쓴다
    const def = this.registry.get(this.selectedBlock);
    if (def.solid && bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, x, y, z)) return; // 내 몸 안에는 못 놓는다
    const res = this.world.setBlock(x, y, z, this.selectedBlock);
    if (res.changed) {
      this.events.onBlocksChanged(res.dirty);
      this.events.onPlaced?.(x, y, z, this.selectedBlock);
      this.events.onSwing();
    }
  }
}
