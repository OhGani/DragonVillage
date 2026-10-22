import {
  AIR_ID,
  type BlockDef,
  type BlockRegistry,
  BOAT,
  bodyOverlapsBlock,
  BONE_MEAL,
  breakSeconds,
  BUCKET,
  canPlantUpward,
  type ChunkCoord,
  DOOR_DIR,
  doorHinge,
  facingOf,
  FLUID_FULL,
  hasWaterNear,
  hoeOf,
  needToolText,
  raycastVoxels,
  type RayHit,
  shovelOf,
  TILLABLE,
  toolOf,
  type VoxelWorld,
} from '@dragon-village/shared';
import { TOOLS } from '@dragon-village/shared/data';
import type { InputState } from '../input/InputState';
import { PLAYER_SIZE, type Player } from '../player/Player';

export /** 손을 뗀 뒤 부수기 진행이 남는 시간 (초) — 탭 휘두르기로 톡톡 쳐서 캐기 (#141) */
const BREAK_GRACE = 0.8;
const REACH = 5;
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
  /** 뼛가루를 그 자리 작물에 (#193) */
  onBoneMeal?(x: number, y: number, z: number): void;
  /** TNT 에 불 (#195) */
  onIgnite?(x: number, y: number, z: number): void;
  /** 상자를 탭했다 (#84) — 놓기 대신 연다 */
  onOpenChest?(x: number, y: number, z: number): void;
  /** 침대를 빈손으로 탭 → 눕기 (#204) */
  onSleepBed?(x: number, y: number, z: number): void;
  /** 보트를 들고 물을 탭 → 띄우기 (#209) */
  onPlaceBoat?(x: number, y: number, z: number): void;
  /** 폭죽을 들고 탭 → 그 자리에서 발사 (#211). 블록을 겨눴으면 그 위, 아니면 내 발 앞 */
  onFirework?(x: number, y: number, z: number): void;
}

/** 조준·부수기·놓기. 서버가 생기면(M2) setBlock 이 요청으로 바뀌고 나머지는 그대로. */
/** 꽃·풀을 심을 수 있는 바닥 (#180) */
export const PLANT_GROUND = new Set(['grass', 'dirt', 'farmland']);

export class Interaction {
  target: RayHit | null = null;
  /** 0..1 부수기 진행 */
  progress = 0;
  /** 몹을 조준하고 있으면 true — 그 프레임엔 블록을 안 부순다 (M7-2) */
  suppressPrimary = false;
  /** 몹을 조준 중이면 놓기도 막는다 (동물 먹이 주기, M8-1) */
  suppressSecondary = false;
  private breakingKey = -1;
  /** 탭 휘두르기(#141): 이 시간 동안은 꾹 누른 것으로 친다 */
  private burst = 0;
  /** 손을 뗀 뒤 이만큼은 부수기 진행이 남는다 — 톡톡 쳐서 캐기 */
  private graceLeft = 0;
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
  /** 침대 (#188): 보는 방향으로 발·머리 두 칸. 머리 칸은 비어 있어야 하고 누가 서 있으면 안 된다 */
  private placeBed(x: number, y: number, z: number, base: BlockDef, cur: number): void {
    const look = this.player.lookDir;
    const facing = facingOf(look.x, look.z);
    const [dx, dz] = DOOR_DIR[facing]!;
    const hx = x + dx,
      hz = z + dz;
    if (!this.world.inBounds(hx, y, hz) || this.world.getBlock(hx, y, hz) !== AIR_ID) {
      this.events.onHint?.('🛏️ 침대는 두 칸이에요 — 앞 칸도 비어 있어야 해요');
      return;
    }
    if (bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, x, y, z) || bodyOverlapsBlock(this.player.pos, PLAYER_SIZE, hx, y, hz)) return;
    const foot = this.registry.bedVariant(base.num, facing, false);
    const head = this.registry.bedVariant(base.num, facing, true);
    const r1 = this.world.setBlock(x, y, z, foot);
    const r2 = this.world.setBlock(hx, y, hz, head);
    if (r1.changed || r2.changed) {
      this.events.onBlocksChanged([...r1.dirty, ...r2.dirty]);
      this.events.onPlaced?.(x, y, z, foot, cur);
      this.events.onSwing();
    }
  }

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

  /** 공기가 아닌 블록은 전부 조준한다(횃불·꽃처럼 몸이 통과되는 것도 캘 수 있게). 액체는 양동이(빈 것·물·용암)를 들고 있을 때만 */
  private readonly targetable = (id: number) => id !== AIR_ID && (this.bucketMode || !this.registry.isFluid(id));

  /** 빈 양동이를 들면 물·용암을 떠내고(꾹), 물·용암 양동이를 들면 붓는다(탭). 아들 2026-10-06 "양동이로 용암이나 물 푸기" (#125) */
  /** 검·도끼·곡괭이로 한 번 휘두르기 (#141): sec 동안 꾹 누른 것처럼 캔다. 같은 블록을 톡톡 치면 진행이 이어진다 */
  /** 마지막으로 '못 뜬다' 안내를 한 칸 (같은 칸엔 한 번만) */
  private hintKey = -1;

  swingBurst(sec: number): void {
    this.burst = Math.max(this.burst, sec);
  }

  get bucketMode(): boolean {
    if (this.heldItem === BUCKET || this.heldItem === BOAT) return true; // 보트도 물을 겨냥해야 한다 (#209)
    return this.selectedBlock > 0 && this.registry.get(this.selectedBlock).fluid !== null;
  }

  update(input: InputState, dt: number): void {
    const eye = this.player.eye;
    const dir = this.player.lookDir;
    this.target = raycastVoxels(this.getBlock, this.targetable, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, REACH);

    this.cooldown = Math.max(0, this.cooldown - dt);

    // ---- 부수기 (꾹, 또는 탭 휘두르기 #141) ----
    this.burst = Math.max(0, this.burst - dt);
    if (this.suppressPrimary) {
      this.breakingKey = -1;
      this.progress = 0;
      this.burst = 0;
    }
    if ((input.primary || this.burst > 0) && this.target && !this.suppressPrimary) {
      const t = this.target;
      const key = ((t.x * 1024 + t.y) * 1024 + t.z) | 0;
      if (key !== this.breakingKey) {
        this.breakingKey = key;
        this.progress = 0;
      }
      this.graceLeft = BREAK_GRACE;
      this.swingTimer -= dt;
      if (this.swingTimer <= 0) {
        this.events.onSwing();
        this.swingTimer = 0.25;
      }
      const def = this.registry.get(t.id);
      if (def.fluid) {
        // 양동이처럼 바로 떠낸다: 자연 원천(무한) 또는 고인 액체(얕은 웅덩이도 닦아낸다). 자연 흐름은 원천이 사라지면 저절로 마른다
        this.progress = 0;
        // 가득한 칸은 빈 양동이를 들고 있어야 뜬다(물·용암 양동이를 들고는 붓기만). 얕은 웅덩이는 그냥 닦인다
        const canScoop = def.fluidLevel === 0 ? this.heldItem === BUCKET : def.fluidVolume > 0 && this.heldItem !== BOAT;
        if (!canScoop && this.hintKey !== key && this.heldItem !== BOAT) {
          // 왜 안 떠지는지 알려 준다 (아빠 2026-10-10 "용암이 양동이로 안 떠짐"): 흐르는 것은 원천이 아니고, 원천은 빈 양동이라야
          this.hintKey = key;
          const name = def.fluid === 'lava' ? '용암' : '물';
          this.events.onHint?.(def.fluidLevel !== 0 ? `흐르는 ${name}은 못 떠요 — 고인 원천(평평한 곳)을 겨냥해요` : `빈 양동이를 들고 꾹 누르면 ${name}을 떠요`);
        }
        if (this.cooldown <= 0 && canScoop) {
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
    } else if (this.graceLeft > 0 && this.progress > 0) {
      // 손을 뗐지만 잠깐은 진행을 남긴다 — 톡톡 치면 이어서 캐진다 (#141)
      this.graceLeft -= dt;
      this.swingTimer = 0;
    } else {
      this.progress = 0;
      this.breakingKey = -1;
      this.swingTimer = 0;
    }

    // ---- 놓기 (탭 / 우클릭, 유지 시 반복) ----
    if (this.suppressSecondary) {
      this.placeTimer = 0;
    } else if (input.secondaryTap) {
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
    // 폭죽 (#211): 들고 탭하면 겨눈 블록 위(없으면 내 앞)에서 쏜다
    if (this.heldItem === 'firework') {
      if (t) this.events.onFirework?.(t.x + 0.5 + t.nx * 0.5, t.y + 0.5 + t.ny * 0.6, t.z + 0.5 + t.nz * 0.5);
      else this.events.onFirework?.(this.player.pos.x + this.player.lookDir.x * 2.5, this.player.pos.y + 0.2, this.player.pos.z + this.player.lookDir.z * 2.5);
      this.events.onSwing();
      return;
    }
    // 보트 (#209): 보트를 들고 물을 탭하면 띄운다. 물이 아니면 안내
    if (t && this.heldItem === BOAT) {
      if (this.registry.get(t.id).fluid === 'water') this.events.onPlaceBoat?.(t.x, t.y, t.z);
      else this.events.onHint?.('🛶 보트는 물 위에 띄워요 — 강이나 연못을 탭해요');
      return;
    }
    // 괭이로 밭 갈기 (#193·#199): 괭이를 들고 흙·잔디 윗면을 탭 → 농지. 마인크래프트처럼 어디든 갈린다(물은 자랄 때 본다)
    if (t && t.ny > 0 && hoeOf(TOOLS, this.heldItem) && TILLABLE.has(this.registry.get(t.id).id)) {
      const farm = this.registry.numOf('farmland');
      const r = this.world.setBlock(t.x, t.y, t.z, farm);
      if (r.changed) {
        this.events.onBlocksChanged(r.dirty);
        this.events.onPlaced?.(t.x, t.y, t.z, farm, t.id);
        this.events.onSwing();
      }
      return;
    }
    // 라이터 (#195): 들고 TNT 를 탭 → 4초 뒤 폭발
    if (t && this.heldItem === 'flint_and_steel') {
      if (this.registry.get(t.id).id === 'tnt') {
        this.events.onIgnite?.(t.x, t.y, t.z);
        this.events.onSwing();
      } else this.events.onHint?.('🔥 라이터는 TNT 에 불을 붙여요');
      return;
    }
    // 뼛가루 (#193): 들고 작물 싹·묘목을 탭 → 서버가 바로 키운다
    if (t && this.heldItem === BONE_MEAL) {
      const d = this.registry.get(t.id);
      if (d.grows && !d.growsWhenOpen) {
        this.events.onBoneMeal?.(t.x, t.y, t.z);
        this.events.onSwing();
      } else this.events.onHint?.('🦴 뼛가루는 자라는 것(싹·묘목)에 써요');
      return;
    }
    // 삽으로 잔디 다듬기 (#191): 삽을 들고 잔디 윗면을 탭 → 캐지 않고 잔디 길이 된다
    if (t && t.ny > 0 && shovelOf(TOOLS, this.heldItem) && this.registry.get(t.id).id === 'grass') {
      const path = this.registry.numOf('grass_path');
      const r = this.world.setBlock(t.x, t.y, t.z, path);
      if (r.changed) {
        this.events.onBlocksChanged(r.dirty);
        this.events.onPlaced?.(t.x, t.y, t.z, path, t.id);
        this.events.onSwing();
      }
      return;
    }
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
    // 침대를 빈손으로 탭하면 눕는다 (#204). 뭔가 들고 있으면 평소처럼 놓는다
    if (tdef.bed && this.selectedBlock <= 0 && !this.heldItem) {
      this.events.onSleepBed?.(t.x, t.y, t.z);
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
    if (def.shape === 'bed' && this.registry.isBed(def.num)) {
      this.placeBed(x, y, z, def, cur);
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
    // 씨앗 (#199): 농지에 물이 4칸 안에 없으면 심기는 되지만 안 자란다 — 미리 알려 준다
    if (def.seed && !def.plantOn) {
      const isWater = (wx: number, wy: number, wz: number) => this.world.inBounds(wx, wy, wz) && this.registry.get(this.world.getBlock(wx, wy, wz)).fluid === 'water';
      if (!hasWaterNear(isWater, x, y - 1, z)) this.events.onHint?.('💧 물이 4칸 안에 없으면 안 자라요 — 옆에 물을 한 칸 부어요');
    }
    // 꽃·풀 (#180): 잔디·흙·농지 위에만
    if (def.shape === 'cross') {
      const below = this.world.inBounds(x, y - 1, z) ? this.registry.get(this.world.getBlock(x, y - 1, z)).id : '';
      if (def.growsUp) {
        // 사탕수수 (#213): 물 바로 옆 잔디·흙·모래, 또는 사탕수수 위
        const idOf = (wx: number, wy: number, wz: number) => (this.world.inBounds(wx, wy, wz) ? this.registry.get(this.world.getBlock(wx, wy, wz)).id : '');
        const isWater = (wx: number, wy: number, wz: number) => this.world.inBounds(wx, wy, wz) && this.registry.get(this.world.getBlock(wx, wy, wz)).fluid === 'water';
        if (!canPlantUpward(def.id, idOf, isWater, x, y, z)) {
          this.events.onHint?.(`🎋 ${def.name}는 물 바로 옆 잔디·흙·모래 위에 심어요`);
          return;
        }
      } else if (def.plantOn ? below !== def.plantOn : !PLANT_GROUND.has(below)) {
        // 네더 사마귀는 영혼 모래 위에만 (#206)
        this.events.onHint?.(def.plantOn ? `🔥 ${def.name}은(는) ${this.registry.find(def.plantOn)?.name ?? def.plantOn} 위에만 심을 수 있어요` : `🌼 ${def.name}은(는) 잔디나 흙 위에만 심을 수 있어요`);
        return;
      }
    }
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
