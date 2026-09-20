import {
  type BlockRegistry,
  type BodySize,
  type MoveResult,
  type Vec3,
  type VoxelWorld,
  hasGroundBelow,
  moveBody,
  tryStepUp,
} from '@dragon-village/shared';
import type * as THREE from 'three';
import type { InputState } from '../input/InputState';

export const PLAYER_SIZE: BodySize = { w: 0.6, h: 1.8 };
const EYE_STAND = 1.62;
const EYE_SNEAK = 1.27;
const WALK = 4.317;
const SPRINT = 5.612;
const SNEAK = 1.31;
const SWIM = 2.2;
const GRAVITY = 32;
const TERMINAL = 78;
const JUMP_V = 9.0; // ≈ 1.27 블록
/** 드래곤 탑승 (M6-4): 나는 속도·오르내리는 속도 (블록/초) */
const RIDE_SPEED = 9;
const RIDE_CLIMB = 6;
const STEP = 1 / 60;
/** 앞으로 걸을 때 자동으로 올라가는 턱 높이 (블록). 웅크리기에선 끔 */
const AUTO_STEP = 1.0;
/**
 * 물속에서 둑에 닿았을 때 올라서는 높이. 수면(물 블록 윗면)보다 한 칸 높은 강변·밭 물길 가장자리를
 * 헤엄치며 밀면 올라선다 — 아니면 물길·강에 빠졌을 때 나올 길이 없다 (아빠 피드백 2026-09-13)
 */
const WATER_STEP = 1.3;
/** 턱을 오른 뒤 카메라가 따라 올라오는 속도 (1/초) */
const STEP_CAM_SMOOTH = 14;
const MAX_PITCH = (89.5 * Math.PI) / 180;

/** 1인칭 플레이어: 위치·속도·시점·물리. 카메라는 이 상태를 읽기만 한다. */
export class Player {
  readonly pos: Vec3;
  readonly vel: Vec3 = { x: 0, y: 0, z: 0 };
  yaw = 0;
  pitch = 0;
  onGround = false;
  sneaking = false;
  sprinting = false;
  inWater = false;
  /** 드래곤을 타고 있다 (M6-4): 중력 없음, 점프 = 상승, 웅크리기 = 하강. 충돌은 사람 몸 그대로 */
  riding = false;
  eyeHeight = EYE_STAND;
  /** 걷기 주기 (라디안) — 손·카메라 흔들림용 */
  walkCycle = 0;
  horizontalSpeed = 0;
  /** 자동 턱 오르기 뒤 카메라 보정(음수 → 0 으로 수렴). 몸은 바로 올라가고 눈은 부드럽게 따라온다 */
  private stepCamOffset = 0;
  private accumulator = 0;
  private readonly moveOut: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
  private readonly spawn: Vec3;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    spawn: Vec3,
    yaw = 0,
  ) {
    this.pos = { ...spawn };
    this.spawn = { ...spawn };
    this.yaw = yaw;
  }

  private readonly isSolid = (x: number, y: number, z: number): boolean => this.registry.isSolid(this.world.getBlock(x, y, z));

  /** 물·용암 등 액체 안인지 */
  private isWaterAt(x: number, y: number, z: number): boolean {
    return this.registry.get(this.world.getBlock(Math.floor(x), Math.floor(y), Math.floor(z))).fluid !== null;
  }

  respawn(): void {
    this.pos.x = this.spawn.x;
    this.pos.y = this.spawn.y;
    this.pos.z = this.spawn.z;
    this.vel.x = this.vel.y = this.vel.z = 0;
  }

  applyLook(dx: number, dy: number): void {
    this.yaw -= dx;
    this.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this.pitch - dy));
    // yaw 를 -π..π 로
    if (this.yaw > Math.PI) this.yaw -= Math.PI * 2;
    else if (this.yaw < -Math.PI) this.yaw += Math.PI * 2;
  }

  get eye(): Vec3 {
    return { x: this.pos.x, y: this.pos.y + this.eyeHeight, z: this.pos.z };
  }

  get lookDir(): Vec3 {
    const cp = Math.cos(this.pitch);
    return { x: -cp * Math.sin(this.yaw), y: Math.sin(this.pitch), z: -cp * Math.cos(this.yaw) };
  }

  update(input: InputState, dt: number): void {
    this.applyLook(input.lookDX, input.lookDY);
    this.accumulator = Math.min(this.accumulator + dt, STEP * 8);
    while (this.accumulator >= STEP) {
      this.step(input, STEP);
      this.accumulator -= STEP;
    }
  }

  private step(input: InputState, h: number): void {
    const pos = this.pos,
      vel = this.vel;
    this.inWater = this.isWaterAt(pos.x, pos.y + 0.2, pos.z) || this.isWaterAt(pos.x, pos.y + this.eyeHeight - 0.1, pos.z);
    this.sneaking = input.sneak && !this.inWater && !this.riding;
    this.sprinting = input.sprint && input.moveZ > 0.5 && !this.sneaking;

    // 원하는 수평 속도
    const sy = Math.sin(this.yaw),
      cy = Math.cos(this.yaw);
    let wx = cy * input.moveX - sy * input.moveZ;
    let wz = -sy * input.moveX - cy * input.moveZ;
    const wl = Math.hypot(wx, wz);
    if (wl > 1) {
      wx /= wl;
      wz /= wl;
    }
    const speed = this.riding ? RIDE_SPEED : this.inWater ? SWIM : this.sneaking ? SNEAK : this.sprinting ? SPRINT : WALK;
    const accel = this.riding ? 8 : this.inWater ? 6 : this.onGround ? 18 : 3.5;
    const k = Math.min(1, accel * h);
    vel.x += (wx * speed - vel.x) * k;
    vel.z += (wz * speed - vel.z) * k;

    // 수직
    if (this.riding) {
      // 날기: ▲ 위로, ▼ 아래로, 아니면 멈춤 (중력 없음)
      const target = input.jump ? RIDE_CLIMB : input.sneak ? -RIDE_CLIMB : 0;
      vel.y += (target - vel.y) * Math.min(1, 8 * h);
    } else if (this.inWater) {
      // 얕은 물(발 위 한 칸이 물이 아님)에서 바닥을 딛고 있으면 진짜 점프 — 밭 물길에서 뛰어나올 수 있다
      if (input.jump && this.onGround && !this.isWaterAt(pos.x, pos.y + 1.0, pos.z)) {
        vel.y = JUMP_V;
        this.onGround = false;
      } else {
        // 물속에서 벽(둑)을 밀고 있으면 점프를 안 눌러도 떠오른다 → 수면에서 둑 오르기로 이어진다 (초5가 강에 빠져도 앞으로만 밀면 나온다)
        const pushingWall = (this.moveOut.hitX || this.moveOut.hitZ) && (input.moveX !== 0 || input.moveZ !== 0);
        const target = input.jump || pushingWall ? 4.0 : -2.2;
        vel.y += (target - vel.y) * Math.min(1, 6 * h);
      }
    } else {
      vel.y -= GRAVITY * h;
      if (vel.y < -TERMINAL) vel.y = -TERMINAL;
      if (input.jump && this.onGround) {
        vel.y = JUMP_V;
        this.onGround = false;
      }
    }

    const wasGround = this.onGround;
    const px = pos.x,
      py = pos.y,
      pz = pos.z;
    const vx0 = vel.x,
      vz0 = vel.z;
    moveBody(this.isSolid, pos, PLAYER_SIZE, vel, h, this.moveOut);
    this.onGround = this.moveOut.onGround;

    // 한 칸 턱 자동 오르기 (앞으로 걷다 막혔을 때). 물속에서는 바닥을 딛지 않아도(헤엄) 둑을 밀면 올라선다
    if (!this.riding && !this.sneaking && (wasGround || this.inWater) && (this.moveOut.hitX || this.moveOut.hitZ)) {
      const r = tryStepUp(this.isSolid, { x: px, y: py, z: pz }, pos, PLAYER_SIZE, vx0, vz0, h, this.inWater ? WATER_STEP : AUTO_STEP);
      if (r) {
        vel.x = r.vx;
        vel.z = r.vz;
        vel.y = 0;
        this.onGround = true;
        this.stepCamOffset -= r.dy;
      }
    }
    this.stepCamOffset += (0 - this.stepCamOffset) * Math.min(1, STEP_CAM_SMOOTH * h);
    if (Math.abs(this.stepCamOffset) < 0.002) this.stepCamOffset = 0;

    // 웅크리면 모서리에서 안 떨어진다
    if (this.sneaking && wasGround && !hasGroundBelow(this.isSolid, pos, PLAYER_SIZE)) {
      const nx = pos.x;
      pos.x = px; // 1) x 만 되돌려 본다
      if (!hasGroundBelow(this.isSolid, pos, PLAYER_SIZE)) {
        pos.x = nx;
        pos.z = pz; // 2) z 만 되돌려 본다
        if (!hasGroundBelow(this.isSolid, pos, PLAYER_SIZE)) pos.x = px; // 3) 둘 다
      }
      vel.x = vel.z = 0;
      this.onGround = true;
    }

    // 월드 가장자리 = 보이지 않는 벽
    const hw = PLAYER_SIZE.w / 2 + 0.001;
    if (pos.x < hw) {
      pos.x = hw;
      vel.x = 0;
    } else if (pos.x > this.world.sizeX - hw) {
      pos.x = this.world.sizeX - hw;
      vel.x = 0;
    }
    if (pos.z < hw) {
      pos.z = hw;
      vel.z = 0;
    } else if (pos.z > this.world.sizeZ - hw) {
      pos.z = this.world.sizeZ - hw;
      vel.z = 0;
    }
    if (pos.y < -24) this.respawn();

    const targetEye = this.sneaking ? EYE_SNEAK : EYE_STAND;
    this.eyeHeight += (targetEye - this.eyeHeight) * Math.min(1, 22 * h);

    const hs = Math.hypot(vel.x, vel.z);
    this.horizontalSpeed = hs;
    if (this.onGround && hs > 0.4) this.walkCycle += hs * h * 1.9;
  }

  /** 카메라에 위치·회전 적용 (+ 걷기 흔들림) */
  applyToCamera(camera: THREE.PerspectiveCamera, bobStrength: number): void {
    const e = this.eye;
    const walking = this.onGround && this.horizontalSpeed > 0.4 ? Math.min(1, this.horizontalSpeed / WALK) : 0;
    const bob = walking * bobStrength;
    camera.position.set(e.x, e.y + this.stepCamOffset - Math.abs(Math.cos(this.walkCycle)) * 0.045 * bob, e.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(this.pitch, this.yaw, Math.sin(this.walkCycle) * 0.006 * bob);
  }
}
