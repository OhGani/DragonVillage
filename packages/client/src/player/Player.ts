import {
  type BlockRegistry,
  BOAT_LAND_SPEED,
  CAMEL_DASH_COOLDOWN_MS,
  CAMEL_DASH_MS,
  CAMEL_DASH_SPEED,
  CAMEL_SEAT_Y,
  CAMEL_SPEED,
  CAMEL_STEP,
  CAMEL_WALK,
  BOAT_SEAT_Y,
  BOAT_SPEED,
  type BodySize,
  hasGroundBelow,
  HORSE_SEAT_Y,
  type MountKind,
  moveBody,
  type MoveResult,
  PIG_SEAT_Y,
  PIG_SLOW,
  PIG_SPEED,
  RIDE_SEAT_Y,
  tryStepUp,
  type Vec3,
  type VoxelWorld, CART_SEAT_Y, advanceCart, type CartState, pushOutOf, type SepBody, FINE_RES, fineSolidQuery, type SolidQuery } from '@dragon-village/shared';
import type * as THREE from 'three';
import type { InputState } from '../input/InputState';

export const PLAYER_SIZE: BodySize = { w: 0.6, h: 1.8 };
const EYE_STAND = 1.62;
const EYE_SNEAK = 1.27;
/** 침대에 누웠을 때 눈 높이 (#204): 베개 위 */
const EYE_SLEEP = 0.3;
const WALK = 4.317;
const SPRINT = 5.612;
const SNEAK = 1.31;
const SWIM = 2.2;
const GRAVITY = 32;
const TERMINAL = 78;
const JUMP_V = 9.0; // ≈ 1.27 블록
/** 느린 낙하 물약 (#245): 이보다 빨리는 안 떨어진다 (블록/초) */
const SLOW_FALL_V = 3.0;
/** 드래곤 탑승 (M6-4): 나는 속도·오르내리는 속도 (블록/초) */
const RIDE_SPEED = 9;
/** 말 (#166) — 말마다 다르다 (#219): 기본값 */
const HORSE_SPEED = 9.5;
/** 허스크에 맞으면 (#218): 이만큼(초) 동안 걸음이 SLOW_MUL 배 */
export const HUSK_SLOW_SEC = 4;
const SLOW_MUL = 0.55;
const RIDE_CLIMB = 6;
/** 날 때 시선 위아래를 따라가는 정도: 이 각도(라디안)까지는 수평, 그 뒤로 서서히 (#97) */
const RIDE_PITCH_DEAD = 0.15;
const RIDE_PITCH_FULL = 0.75;
const STEP = 1 / 60;
/** 앞으로 걸을 때 자동으로 올라가는 턱 높이 (블록). 웅크리기에선 끔 */
const AUTO_STEP = 1.0;
/**
 * 물속에서 둑에 닿았을 때 올라서는 높이. 수면(물 블록 윗면)보다 한 칸 높은 강변·밭 물길 가장자리를
 * 헤엄치며 밀면 올라선다 — 아니면 물길·강에 빠졌을 때 나올 길이 없다 (아빠 피드백 2026-09-13)
 */
const WATER_STEP = 1.3;
/**
 * 드래곤 타고 날 때 턱 넘기 (아빠 2026-11-05 "드래곤 타고 있으면 턱에 걸려서 움직이지 않는다" → "툭 한번 튀는 느낌").
 * 몸 상자가 드래곤 등 높이만큼 아래로 길어서(#178) 땅에 붙어 날면 한 칸 턱에 걸린다.
 * 순간이동으로 올리지 않고, 가는 쪽 FLY_LOOK 초 앞에 FLY_STEP 칸 이하로 넘을 수 있는 턱이 있으면 미리 FLY_CLIMB_V 로 날아오른다.
 * 두 칸 넘는 벽은 ▲ 로
 */
const FLY_STEP = 1.3;
const FLY_LOOK = 0.35;
const FLY_CLIMB_V = 7;
/** 턱이 안 보여도 이만큼(초)은 오르기를 이어 간다 — 걸치는 순간 끊기지 않게 */
const FLY_CLIMB_HOLD = 0.05;
/** 다 넘은 뒤 오르던 속도를 거두는 빠르기 (1/초). 보통 날기는 8 */
const FLY_BRAKE = 30;
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
  /** 침대에 누움 (#204): 안 움직이고 눈이 낮다. Game 이 서버 응답으로 켜고 끈다 */
  sleeping = false;
  /** 🛡️ 막는 중 (#118): 걸음이 guardSlow 배 */
  guarding = false;
  guardSlow = 0.5;
  /** 허스크 모래 (#218): 남은 느려짐 시간(초). Game 이 health 메시지로 켠다 */
  slowLeft = 0;
  /** 물약 (#245): 걷기·점프 배율(신속·감속·도약), 느린 낙하. Game 이 effects 메시지로 넣는다. 탈것엔 안 먹힌다 */
  speedMul = 1;
  jumpMul = 1;
  slowFalling = false;
  /** 타고 있는 말의 달리기(칸/초)·점프 배율 (#219 말마다 다르다). Game 이 mount 때 넣는다 */
  horseSpeed = HORSE_SPEED;
  horseJump = 1.15;
  sprinting = false;
  inWater = false;
  /** 드래곤을 타고 있다 (M6-4): 중력 없음, 점프 = 상승, 웅크리기 = 하강. 충돌은 사람 몸 그대로 */
  riding = false;
  /** 수레 (#237): 타는 동안 철도 위 위치·방향·속도. 탈 때 Game 이 null 로 되돌린다 */
  cart: CartState | null = null;
  /** 말을 타고 있다 (#166): 날지 않고 땅에서 빨리 달린다, 점프는 조금 높게 */
  /** 타고 있는 동물 종류 (#166 말, #185 돼지). 드래곤은 null (riding 만 true) */
  mountKind: MountKind | null = null;
  /** 당근 낚싯대를 들었나 (#185): 돼지가 빨라진다 */
  carrotStick = false;
  /** 낙타 돌진 (2026-11-07): 남은 돌진 시간·다시 돌진할 때까지 (초) */
  camelDashLeft = 0;
  camelCooldown = 0;
  /** 낙타 뒷자리 (2026-11-07): 주면 내 몸은 이 자리를 따라간다(둘러보기만) */
  carriedBy: (() => { x: number; y: number; z: number } | null) | null = null;
  eyeHeight = EYE_STAND;
  /** 걷기 주기 (라디안) — 손·카메라 흔들림용 */
  walkCycle = 0;
  horizontalSpeed = 0;
  /**
   * 겹치지 않게 (아빠 2026-11-05 "몹, 캐릭터는 서로 겹치지 않게"): 근처 몹·동물·다른 사람 몸. Game 이 매 프레임 넣는다.
   * fixed(몹·동물 — 서버가 움직인다)는 내가 다 비키고, 다른 사람과는 반씩. 탈것을 타거나 누웠을 땐 안 본다
   */
  obstacles: readonly SepBody[] = [];
  /** 드래곤 턱 넘기: 남은 오르기 시간(초) */
  private flyClimbT = 0;
  private flyBraking = false;
  private readonly probePos: Vec3 = { x: 0, y: 0, z: 0 };
  private readonly probeVel: Vec3 = { x: 0, y: 0, z: 0 };
  private readonly probeOut: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
  private readonly pushVel: Vec3 = { x: 0, y: 0, z: 0 };
  private readonly pushOut: MoveResult = { onGround: false, hitX: false, hitY: false, hitZ: false, hitCeiling: false };
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
    this.fineSolid = fineSolidQuery(registry, (x, y, z) => world.getBlock(x, y, z));
  }

  private readonly isSolid = (x: number, y: number, z: number): boolean => this.registry.isSolid(this.world.getBlock(x, y, z));
  /** 반 칸 눈금 충돌 (#291): 계단의 반 칸 턱까지 본다. moveBody·tryStepUp·hasGroundBelow 에 FINE_RES 와 같이 넘긴다 */
  private readonly fineSolid: SolidQuery;

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

  /** 보트 (#209): 발 자리 둘레에서 가장 높은 물 칸의 수면 높이. 물이 없으면 null */
  private waterSurface(pos: Vec3): number | null {
    const by = Math.floor(pos.y + 0.05);
    for (const dy of [0, -1, 1]) {
      const y = by + dy;
      if (this.isWaterAt(pos.x, y + 0.5, pos.z)) {
        // 그 위도 물이면(깊은 곳 한가운데) 더 위 칸의 수면
        return this.isWaterAt(pos.x, y + 1.5, pos.z) ? y + 1 + 0.9 : y + 0.9;
      }
    }
    return null;
  }

  /** 드래곤 턱 넘기: 지금 속도로 FLY_LOOK 초 가면 막히고, FLY_STEP 칸 올라가면 더 갈 수 있나 (몸 상자는 탈것까지 늘린 것) */
  private ledgeAhead(pos: Vec3, size: BodySize, vx: number, vz: number): boolean {
    const sp = Math.hypot(vx, vz);
    if (sp < 0.5) return false;
    const look = Math.max(FLY_LOOK, 0.4 / sp); // 느릴 때도 0.4칸 앞은 본다
    const p = this.probePos,
      v = this.probeVel;
    p.x = pos.x;
    p.y = pos.y;
    p.z = pos.z;
    v.x = vx;
    v.y = 0;
    v.z = vz;
    moveBody(this.fineSolid, p, size, v, look, this.probeOut, FINE_RES);
    if (!this.probeOut.hitX && !this.probeOut.hitZ) return false;
    return tryStepUp(this.fineSolid, { x: pos.x, y: pos.y, z: pos.z }, p, size, vx, vz, look, FLY_STEP, false, FINE_RES) !== null;
  }

  /** 탈것에 앉은 높이 (#178): 타고 있으면 몸 상자가 이만큼 아래로 길어져 탈것이 땅속에 안 들어간다 */
  get seatY(): number {
    return this.riding ? (this.mountKind === 'camel' ? CAMEL_SEAT_Y : this.mountKind === 'horse' ? HORSE_SEAT_Y : this.mountKind === 'pig' ? PIG_SEAT_Y : this.mountKind === 'boat' ? BOAT_SEAT_Y : this.mountKind === 'minecart' ? CART_SEAT_Y : RIDE_SEAT_Y) : 0;
  }

  /** 발 아래 seat 만큼 중 땅에 안 박힌 길이 — 탈것 자리가 땅에 걸쳐 있으면(낮은 천장 아래서 탔을 때 등) 그만큼만 상자를 늘려 안 끼인다 */
  private freeSeat(pos: Vec3, seat: number): number {
    const hw = PLAYER_SIZE.w / 2;
    const x0 = Math.floor(pos.x - hw + 0.001),
      x1 = Math.floor(pos.x + hw - 0.001);
    const z0 = Math.floor(pos.z - hw + 0.001),
      z1 = Math.floor(pos.z + hw - 0.001);
    const y0 = Math.floor(pos.y - seat + 0.001),
      y1 = Math.floor(pos.y - 0.001);
    for (let y = y1; y >= y0; y--)
      for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) if (this.isSolid(x, y, z)) return Math.max(0, Math.min(seat, pos.y - (y + 1)));
    return seat;
  }

  /** 탈것에 올라탄 직후 (#178): 발을 탈것 등 높이만큼 올린다. 천장(나뭇잎 등)이 낮으면 닿기 직전까지만 — 그만큼 탈것이 땅에 살짝 묻혀 보인다 */
  liftForMount(): void {
    const seat = this.seatY;
    if (seat <= 0) return;
    const hw = PLAYER_SIZE.w / 2;
    const top = this.pos.y + PLAYER_SIZE.h;
    const x0 = Math.floor(this.pos.x - hw + 0.001),
      x1 = Math.floor(this.pos.x + hw - 0.001);
    const z0 = Math.floor(this.pos.z - hw + 0.001),
      z1 = Math.floor(this.pos.z + hw - 0.001);
    const y0 = Math.floor(top + 0.001),
      y1 = Math.floor(top + seat - 0.001);
    let lift = seat;
    outer: for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        for (let z = z0; z <= z1; z++)
          if (this.isSolid(x, y, z)) {
            lift = Math.max(0, Math.min(seat, y - top - 0.002));
            break outer;
          }
    this.pos.y += lift;
    this.vel.y = 0;
  }

  /** 수레 (#237): 철도를 따라서만 간다. 보는 쪽으로 밀면 빨라지고 반대로 밀면 느려지다 되돌아간다. 철도 밖이면 선다 */
  private stepCart(input: InputState, h: number): void {
    const pos = this.pos;
    const railAt = (bx: number, by: number, bz: number) => (this.world.inBounds(bx, by, bz) ? (this.registry.get(this.world.getBlock(bx, by, bz)).rail?.dir ?? null) : null);
    if (!this.cart) this.cart = { x: pos.x, y: Math.floor(pos.y - CART_SEAT_Y + 0.01), z: pos.z, heading: null, speed: 0 };
    const sy = Math.sin(this.yaw),
      cy = Math.cos(this.yaw);
    advanceCart(this.cart, h, railAt, { x: -sy * input.moveZ, z: -cy * input.moveZ });
    pos.x = this.cart.x;
    pos.z = this.cart.z;
    pos.y = this.cart.y + CART_SEAT_Y;
    this.vel.x = this.vel.y = this.vel.z = 0;
    this.onGround = true;
    this.horizontalSpeed = this.cart.speed;
  }

  get lookDir(): Vec3 {
    const cp = Math.cos(this.pitch);
    return { x: -cp * Math.sin(this.yaw), y: Math.sin(this.pitch), z: -cp * Math.cos(this.yaw) };
  }

  update(input: InputState, dt: number): void {
    if (this.slowLeft > 0) this.slowLeft = Math.max(0, this.slowLeft - dt); // 허스크 (#218)
    if (this.sleeping) {
      // 누워 있는 동안은 둘러보기만 (#204)
      this.applyLook(input.lookDX, input.lookDY);
      this.vel.x = this.vel.y = this.vel.z = 0;
      this.onGround = true;
      this.horizontalSpeed = 0;
      this.eyeHeight += (EYE_SLEEP - this.eyeHeight) * Math.min(1, 22 * dt);
      this.accumulator = 0;
      return;
    }
    this.applyLook(input.lookDX, input.lookDY);
    if (this.carriedBy) {
      // 낙타 뒷자리: 앞 사람의 낙타를 따라간다
      const at = this.carriedBy();
      if (at) {
        this.pos.x = at.x;
        this.pos.y = at.y;
        this.pos.z = at.z;
      }
      this.vel.x = this.vel.y = this.vel.z = 0;
      this.onGround = true;
      this.horizontalSpeed = 0;
      this.accumulator = 0;
      return;
    }
    this.accumulator = Math.min(this.accumulator + dt, STEP * 8);
    while (this.accumulator >= STEP) {
      this.step(input, STEP);
      this.accumulator -= STEP;
    }
  }

  private step(input: InputState, h: number): void {
    const pos = this.pos,
      vel = this.vel;
    if (this.mountKind === 'minecart') {
      this.stepCart(input, h);
      return;
    }
    this.inWater = this.isWaterAt(pos.x, pos.y + 0.2, pos.z) || this.isWaterAt(pos.x, pos.y + this.eyeHeight - 0.1, pos.z);
    this.sneaking = input.sneak && !this.inWater && !this.riding;
    this.guarding = input.guard && !this.riding;
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
    const flying = this.riding && this.mountKind === null;
    // 낙타 (2026-11-07): 돌진 중이면 보는 쪽으로 곧장, 돌진 뒤 쉬는 동안은 걷기만
    const camel = this.mountKind === 'camel';
    if (camel) {
      if (this.camelDashLeft > 0) {
        this.camelDashLeft = Math.max(0, this.camelDashLeft - h);
        wx = -sy;
        wz = -cy;
      }
      if (this.camelCooldown > 0) this.camelCooldown = Math.max(0, this.camelCooldown - h);
    }
    const boatSurface = this.mountKind === 'boat' ? this.waterSurface(pos) : null;
    const speed = (camel ? (this.camelDashLeft > 0 ? CAMEL_DASH_SPEED : this.camelCooldown > 0 ? CAMEL_WALK : CAMEL_SPEED) : this.mountKind === 'boat' ? (boatSurface !== null ? BOAT_SPEED : BOAT_LAND_SPEED) : this.mountKind === 'horse' ? this.horseSpeed : this.mountKind === 'pig' ? (this.carrotStick ? PIG_SPEED : PIG_SLOW) : this.riding ? RIDE_SPEED : (this.inWater ? SWIM : this.sneaking ? SNEAK : this.sprinting ? SPRINT : WALK) * this.speedMul) * (this.guarding ? this.guardSlow : 1) * (this.slowLeft > 0 ? SLOW_MUL : 1); // 물약 배율은 걸을 때만 (#245)
    const accel = flying ? 8 : this.mountKind === 'boat' ? 4 : this.inWater ? 6 : this.onGround ? (this.mountKind !== null ? 10 : 18) : 3.5;
    const k = camel && this.camelDashLeft > 0 ? 1 : Math.min(1, accel * h);
    // 날 때 앞·뒤로 밀면 보는 쪽(위아래)으로 난다 (#97). 살짝 내려보는 건 수평으로 치고, 많이 기울일수록 가파르게
    let pitchT = 0;
    if (flying && input.moveZ !== 0) {
      pitchT = Math.max(0, Math.min(1, (Math.abs(this.pitch) - RIDE_PITCH_DEAD) / (RIDE_PITCH_FULL - RIDE_PITCH_DEAD))) * Math.sign(this.pitch);
    }
    const flat = 1 - Math.abs(pitchT) * 0.6; // 가파르게 오르내릴 땐 앞으로는 조금 덜
    vel.x += (wx * speed * flat - vel.x) * k;
    vel.z += (wz * speed * flat - vel.z) * k;

    // 수직
    if (flying) {
      // 날기: 시선 위아래 × 앞으로 밀기 + ▲ 위로 / ▼ 아래로. 아무것도 없으면 멈춤 (중력 없음)
      const look = pitchT * Math.sign(input.moveZ) * RIDE_SPEED * 0.8;
      const target = look + (input.jump ? RIDE_CLIMB : input.sneak ? -RIDE_CLIMB : 0);
      // 턱을 넘고 나면 오르던 힘을 빨리 거둔다 (안 그러면 한 칸 턱에 두 칸 넘게 붕 뜬다)
      const brake = this.flyClimbT <= 0 && this.flyBraking && vel.y > target;
      vel.y += (target - vel.y) * Math.min(1, (brake ? FLY_BRAKE : 8) * h);
      if (!brake) this.flyBraking = false;
      if (this.flyClimbT > 0) {
        vel.y = Math.max(vel.y, FLY_CLIMB_V); // 앞에 턱 — 부드럽게 날아오른다
        this.flyClimbT -= h;
        this.flyBraking = true;
      }
    } else if (this.mountKind === 'boat') {
      // 보트 (#209): 물 위에 뜬다 — 발을 수면에 맞추고 중력 없음. 물이 없으면 떨어진다(땅에선 느릿느릿)
      if (boatSurface !== null) {
        const target = (boatSurface + BOAT_SEAT_Y - pos.y) * 8; // 보트 바닥이 수면에 뜨고 내 발은 그 위 좌석
        vel.y += (Math.max(-6, Math.min(6, target)) - vel.y) * Math.min(1, 10 * h);
      } else {
        vel.y -= GRAVITY * h;
        if (vel.y < -TERMINAL) vel.y = -TERMINAL;
      }
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
      if (this.slowFalling && !this.mountKind && vel.y < -SLOW_FALL_V) vel.y = -SLOW_FALL_V; // 느린 낙하 물약 (#245): 깃털처럼
      if (camel) {
        // 낙타는 점프 대신 앞으로 돌진 (약 10칸, 살짝 뛰어오르며). 그 뒤 쉬는 동안은 못 한다
        if (input.jump && this.onGround && this.camelCooldown <= 0) {
          this.camelDashLeft = CAMEL_DASH_MS / 1000;
          this.camelCooldown = (CAMEL_DASH_MS + CAMEL_DASH_COOLDOWN_MS) / 1000;
          vel.y = 3.5;
          this.onGround = false;
        }
      } else if (input.jump && this.onGround && this.mountKind !== 'pig') {
        // 말은 조금 높게 (#166), 돼지는 못 뛴다 (#185)
        vel.y = this.mountKind === 'horse' ? JUMP_V * this.horseJump : this.mountKind ? JUMP_V : JUMP_V * this.jumpMul; // 말마다 다르다 (#219), 도약 물약 (#245)
        this.onGround = false;
      }
    }

    const wasGround = this.onGround;
    // 탈것 (#178): 몸 상자를 탈것 등 높이만큼 아래로 늘려서 움직인다 — 말·드래곤이 바닥 밑으로 안 들어간다. 자리가 땅에 박혀 있으면 이번 걸음은 보통 몸으로
    let seat = this.seatY;
    if (seat > 0) seat = this.freeSeat(pos, seat);
    const size: BodySize = seat > 0.01 ? { w: PLAYER_SIZE.w, h: PLAYER_SIZE.h + seat } : PLAYER_SIZE;
    if (seat <= 0.01) seat = 0;
    pos.y -= seat;
    const px = pos.x,
      py = pos.y,
      pz = pos.z;
    const vx0 = vel.x,
      vz0 = vel.z;
    moveBody(this.fineSolid, pos, size, vel, h, this.moveOut, FINE_RES);
    this.onGround = this.moveOut.onGround;

    // 한 칸 턱 자동 오르기 (앞으로 걷다 막혔을 때). 물속에서는 바닥을 딛지 않아도(헤엄) 둑을 밀면 올라선다
    if (!flying && !this.sneaking && (wasGround || this.inWater) && (this.moveOut.hitX || this.moveOut.hitZ)) {
      const r = tryStepUp(this.fineSolid, { x: px, y: py, z: pz }, pos, size, vx0, vz0, h, this.inWater ? WATER_STEP : camel ? CAMEL_STEP : AUTO_STEP, true, FINE_RES); // 낙타는 1.5칸 턱도 넘는다
      if (r) {
        vel.x = r.vx;
        vel.z = r.vz;
        vel.y = 0;
        this.onGround = true;
        this.stepCamOffset -= r.dy;
      }
    }
    // 드래곤으로 날 때: 가는 쪽 조금 앞에 넘을 수 있는 턱이 있으면 다음 걸음부터 날아오른다 (순간이동 없이)
    if (flying && (vx0 !== 0 || vz0 !== 0) && this.ledgeAhead(pos, size, vx0, vz0)) this.flyClimbT = FLY_CLIMB_HOLD;
    if (seat === 0 && !this.riding && this.obstacles.length) {
      // 몸끼리 밀어내기: 벽은 그대로 막히게 moveBody 로 옮긴다 (몹에 밀려 벽 속으로 안 들어간다)
      const p = pushOutOf({ x: pos.x, y: pos.y, z: pos.z, r: PLAYER_SIZE.w / 2, h: PLAYER_SIZE.h }, this.obstacles, (o) => (o.fixed ? 1 : 0.5));
      if (p.dx !== 0 || p.dz !== 0) {
        this.pushVel.x = p.dx / h;
        this.pushVel.y = 0;
        this.pushVel.z = p.dz / h;
        moveBody(this.fineSolid, pos, PLAYER_SIZE, this.pushVel, h, this.pushOut, FINE_RES);
      }
    }
    pos.y += seat; // 탈것 상자 → 다시 내 발 높이 (#178)
    this.stepCamOffset += (0 - this.stepCamOffset) * Math.min(1, STEP_CAM_SMOOTH * h);
    if (Math.abs(this.stepCamOffset) < 0.002) this.stepCamOffset = 0;

    // 웅크리면 모서리에서 안 떨어진다
    if (this.sneaking && wasGround && !hasGroundBelow(this.fineSolid, pos, PLAYER_SIZE, 0.05, FINE_RES)) {
      const nx = pos.x;
      pos.x = px; // 1) x 만 되돌려 본다
      if (!hasGroundBelow(this.fineSolid, pos, PLAYER_SIZE, 0.05, FINE_RES)) {
        pos.x = nx;
        pos.z = pz; // 2) z 만 되돌려 본다
        if (!hasGroundBelow(this.fineSolid, pos, PLAYER_SIZE, 0.05, FINE_RES)) pos.x = px; // 3) 둘 다
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
