/**
 * 마을 룸 — 서버가 진실인 세계 하나 (규칙 1).
 *
 * - 시드로 지형을 만들고 저장된 청크를 덮어쓴다 (클라와 같은 순서, 같은 공용 코드).
 * - 블록 변경은 검증(도달·속도·부술 수 있나·누가 서 있나) 뒤 적용하고 같은 세계 사람 모두에게 알린다.
 * - 액체 시뮬레이션(shared/fluid)은 여기서만 돈다. 한 틱의 변경을 BlockBatch 로 묶어 보낸다.
 * - 20Hz 틱: 액체 → 묶음 전송 → 위치 브로드캐스트. 바뀐 청크는 30초마다·마지막 퇴장·종료 시 저장.
 * - **원정(M3)**: 룸 안에 임시 서브 월드(`Expedition`) 하나. 플레이어는 `world` 로 어느 세계에 있는지 구분한다.
 *   시작 → 시드로 섬 생성 → 참가자 이동(worldEnter) → 1Hz 타이머 → 포탈 귀환(정산, 창고에 더함) → 시간이 다 되면 강제 귀환(절반) → 유예 뒤 폐기.
 */
import {
  AIR_ID,
  FLUID_FULL,
  BY_SERVER,
  type BlockChangeReqMsg,
  type BlockRegistry,
  type ChunkCoord,
  type ExpeditionEnterInfo,
  type ExpeditionRegistry,
  type ExpeditionStateInfo,
  type ExpeditionResultItem,
  EMOTE_PER_SEC,
  FLAG_GROUND,
  FluidSim,
  type InvDropMsg,
  type InvMoveMsg,
  type Inventory,
  MAX_PLAYERS,
  PHASE_NUM,
  type PhraseRegistry,
  type PotionRegistry,
  type RecipeRegistry,
  type StarterKit,
  BUCKET,
  countOf,
  craft,
  dropOf,
  emptyInventory,
  facingFromYaw,
  give,
  isPotionItem,
  itemForPlacing,
  move,
  potionFromItemId,
  potionItemId,
  take,
  takeFromSlot,
  type PlayerInfo,
  type PlayerMoveMsg,
  type PlayerStateEntry,
  REJECT,
  VILLAGE_GEN_VERSION,
  type VillageInfo,
  type VoxelWorld,
  bodyOverlapsBlock,
  chunkKey,
  decodeChunk,
  encodeChunk,
  encodeBlockBatch,
  encodeBlockChangeRejected,
  encodeBlockChanged,
  encodeChunkData,
  encodeEmote,
  encodeExpeditionTimer,
  encodeXpGained,
  canBreakWith,
  toolOf,
  type DragonInfo,
  type NestDragonInfo,
  type GiftDef,
  type GiftNotice,
  type NestSlotInfo,
  RIDE_RANGE,
  type RidingInfo,
  SADDLE_ITEM,
  feedItems,
  growAtOf,
  perchOf,
  perchYaw,
  GROUND_Y,
  NEST,
  OLD_NEST_SITES,
  dragonOfEgg,
  hatchCost,
  isNestBuiltAt,
  nestBlocks,
  nestBlocksAt,
  nestContains,
  nestSlotPos,
  spendLevels,
  encodeXpState,
  miningXp,
  XP_SOURCE,
  encodeInvSlots,
  encodePlayersState,
  generateVillage,
} from '@dragon-village/shared';
import { DRAGONS, EXPEDITIONS, GIFTS, PHRASES, POTIONS, RECIPES, STARTER_KIT, TOOLS, XP } from '@dragon-village/shared/data';
import { randomInt } from 'node:crypto';
import { Expedition } from './expedition';
import type { DragonRow, Storage } from './storage';

/** 플레이어 몸 크기 (클라 Player.ts 와 같아야 한다) */
export const PLAYER_SIZE = { w: 0.6, h: 1.8 };
const EYE = 1.62;
/** 조준 거리 5칸 + 여유 (블록 중심까지) */
export const REACH = 6.5;
/** 초당 블록 변경 상한 */
export const RATE_PER_SEC = 12;
/** 액체 틱 간격 (20Hz) */
export const TICK_MS = 50;
/** 저장 주기 */
export const FLUSH_MS = 30_000;
/** 드래곤 성장 확인 간격 (M6-3) */
export const GROWTH_CHECK_MS = 5_000;

export type Send = (data: Uint8Array | string) => void;
export type WorldKind = 'village' | 'expedition';

export interface RoomPlayer {
  idx: number;
  token: string;
  nick: string;
  color: number;
  pos: PlayerMoveMsg;
  send: Send;
  /** 서버가 이 연결을 끊고 싶을 때 (같은 계정이 다시 들어옴 등) */
  kick?: (why: string) => void;
  /** 최근 1초 블록 변경 시각들 */
  recent: number[];
  /** 지금 어느 세계에 있나 */
  world: WorldKind;
  /** 가방 (M4, 서버가 진실) */
  inv: Inventory;
  /** 원정 중 가방에 들어온 것 (정산·늦은 귀환 절반) */
  gained: Map<string, number>;
  /** 양조기 연료 남은 횟수 */
  brewFuel: number;
  lastEmote: number;
  /** 경험치 총량 (M6-1, 서버가 진실) */
  xp: number;
  /** 타고 있는 드래곤 (M6-4). 접속 동안만 — 끊기면 둥지로 돌아간다 */
  riding: RidingInfo | null;
}

export interface JoinResult {
  idx: number;
  spawn: PlayerInfo;
  players: PlayerInfo[];
  expedition: ExpeditionStateInfo | null;
  inventory: Inventory;
  /** 내 경험치 총량 */
  xp: number;
  /** 내 드래곤 (M6-2) */
  dragons: DragonInfo[];
  /** 둥지 자리 (모두) */
  nest: NestSlotInfo[];
  /** 둥지의 드래곤 (모두, M6-3) */
  nestDragons: NestDragonInfo[];
  /** 이번 입장에 받은 선물 (#79) */
  gifts: GiftNotice[];
}

export interface RoomOptions {
  expeditions?: ExpeditionRegistry;
  recipes?: RecipeRegistry;
  potions?: PotionRegistry;
  phrases?: PhraseRegistry;
  /** 처음 들어오는 사람에게 주는 것 (null 이면 안 줌) */
  starterKit?: StarterKit | null;
  /** 모두에게 한 번씩 주는 선물 (#79). 시험 룸은 [] 로 끈다 */
  gifts?: readonly GiftDef[];
  /** 원정 시드 (테스트에서 고정) */
  seedFn?: () => number;
}

/** 제작대·화로·양조기를 이 거리(칸) 안에서 찾는다 */
export const STATION_REACH = 5;

export class VillageRoom {
  readonly world: VoxelWorld;
  readonly spawn: { x: number; y: number; z: number; yaw: number };
  readonly players = new Map<number, RoomPlayer>();
  private readonly fluids: FluidSim;
  /** 생성 지형과 달라진 청크 (입장 시 보내 줄 것) */
  private readonly modified = new Map<number, ChunkCoord>();
  /** 마지막 저장 뒤 바뀐 청크 */
  private readonly dirty = new Map<number, ChunkCoord>();
  private batch: { x: number; y: number; z: number; id: string }[] = [];
  private fluidAcc = 0;
  private lastTick = 0;
  private lastFlush = 0;
  private lastGrowthCheck = 0;
  /** 진행 중(또는 유예 중)인 원정 */
  expedition: Expedition | null = null;
  private expeditionDisposeAt = 0;
  private lastTimerAt = 0;
  private readonly expeditions: ExpeditionRegistry;
  private readonly recipes: RecipeRegistry;
  private readonly potions: PotionRegistry;
  private readonly phrases: PhraseRegistry;
  private readonly starterKit: StarterKit | null;
  private readonly gifts: readonly GiftDef[];
  private readonly seedFn: () => number;
  /** 통계 */
  stats = { blockChanges: 0, rejected: 0, flushes: 0, chunksSaved: 0, expeditions: 0 };

  constructor(
    readonly info: VillageInfo,
    private readonly registry: BlockRegistry,
    private readonly storage: Storage | null,
    private readonly log: (msg: string) => void = () => {},
    opts: RoomOptions = {},
  ) {
    this.expeditions = opts.expeditions ?? EXPEDITIONS;
    this.recipes = opts.recipes ?? RECIPES;
    this.potions = opts.potions ?? POTIONS;
    this.phrases = opts.phrases ?? PHRASES;
    this.starterKit = opts.starterKit === undefined ? STARTER_KIT : opts.starterKit;
    this.gifts = opts.gifts ?? GIFTS;
    this.seedFn = opts.seedFn ?? (() => randomInt(1, 2 ** 31 - 1));
    const gen = generateVillage(registry, info.seed);
    this.world = gen.world;
    this.spawn = gen.spawn;
    this.fluids = new FluidSim(this.world, registry);
    this.fluids.onBlockSet = (x, y, z) => this.batch.push({ x, y, z, id: registry.get(this.world.getBlock(x, y, z)).id });
    const pristine = this.snapshotOldNestSites(); // 저장을 덮기 전, 생성 지형 그대로
    this.load();
    this.ensureNest(pristine);
  }

  /** 옛 둥지 자리들의 생성 지형 (되돌릴 때 쓴다) */
  private snapshotOldNestSites(): Map<string, number[]> {
    const out = new Map<string, number[]>();
    for (const s of OLD_NEST_SITES) out.set(`${s.x0},${s.z0}`, nestBlocksAt(GROUND_Y, s.x0, s.z0).map((b) => this.world.getBlock(b.x, b.y, b.z)));
    return out;
  }

  // ---------------------------------------------------------------- 둥지·드래곤 (M6-2)

  /** 둥지 1단계가 없으면 블록으로 짓는다 (생성기를 안 바꾸고 바뀐 청크로 — 저장을 지키기 위해, 결정 #76). 저장된 알도 다시 세운다 */
  private ensureNest(pristine: Map<string, number[]>): void {
    const idAt = (x: number, y: number, z: number) => this.registry.get(this.world.getBlock(x, y, z)).id;
    // 옛 자리에 둥지가 남아 있으면 생성 지형으로 되돌린다 (아빠 집과 겹쳤던 자리, 2026-09-20)
    for (const s of OLD_NEST_SITES) {
      if (!isNestBuiltAt(idAt, GROUND_Y, s.x0, s.z0)) continue;
      const orig = pristine.get(`${s.x0},${s.z0}`) ?? [];
      const coords = nestBlocksAt(GROUND_Y, s.x0, s.z0);
      let n = 0;
      coords.forEach((b, i) => {
        const num = orig[i];
        if (num !== undefined && this.world.setBlock(b.x, b.y, b.z, num).changed) {
          this.markDirtyBlock(b.x, b.y, b.z);
          n++;
        }
      });
      this.log(`마을 ${this.info.code}: 옛 둥지 자리(x ${s.x0}~${s.x0 + 6}, z ${s.z0}~${s.z0 + 6})를 원래 땅으로 되돌렸어요 (${n}칸)`);
    }
    const blocks = nestBlocks(GROUND_Y);
    const has = isNestBuiltAt(idAt, GROUND_Y, NEST.x0, NEST.z0);
    if (!has) {
      for (const b of blocks) {
        const res = this.world.setBlock(b.x, b.y, b.z, this.registry.numOf(b.id));
        if (res.changed) this.markDirtyBlock(b.x, b.y, b.z);
      }
      this.log(`마을 ${this.info.code}: 드래곤 둥지를 지었어요 — 광장 남쪽 집터 (${blocks.length}칸)`);
    }
    const egg = this.registry.numOf('dragon_egg');
    for (const row of this.storage?.listNestEggs(this.info.code) ?? []) {
      const pos = nestSlotPos(GROUND_Y, row.slot ?? -1);
      if (pos && this.world.getBlock(pos.x, pos.y, pos.z) !== egg) {
        this.world.setBlock(pos.x, pos.y, pos.z, egg);
        this.markDirtyBlock(pos.x, pos.y, pos.z);
      }
    }
  }

  /** 둥지 자리 상태 (받는 사람 기준 mine) */
  nestSlots(forToken: string | null): NestSlotInfo[] {
    if (!this.storage) return [];
    return this.storage.listNestEggs(this.info.code).map((r) => ({ slot: r.slot ?? -1, dragon: r.dragon, owner: this.ownerNick(r.token), mine: r.token === forToken, id: r.id }));
  }

  private ownerNick(token: string): string {
    for (const p of this.players.values()) if (p.token === token) return p.nick;
    return this.storage?.getPlayer(token)?.nick ?? '?';
  }

  /** 내 드래곤 목록 */
  myDragons(token: string): DragonInfo[] {
    if (!this.storage) return [];
    return this.storage.listDragonsByToken(this.info.code, token).map((r) => ({
      id: r.id,
      dragon: r.dragon,
      stage: r.stage,
      slot: r.slot,
      hatchedAt: r.hatchedAt,
      fed: r.fed,
      growAt: r.stage === 'baby' && r.hatchedAt !== null ? growAtOf(DRAGONS.rules, r.hatchedAt, r.fed) : null,
    }));
  }

  /** 지금 누가 타고 있는 드래곤 id 들 — 둥지에서 빠진다 */
  private riddenIds(): Set<number> {
    const s = new Set<number>();
    for (const p of this.players.values()) if (p.riding) s.add(p.riding.id);
    return s;
  }

  /** 둥지의 드래곤들 (부화한 것 모두, id 순으로 자리 배정 — 누가 타고 나간 것은 빠지되 자리는 그대로). 받는 사람 기준 mine */
  nestDragons(forToken: string | null): NestDragonInfo[] {
    if (!this.storage) return [];
    const ridden = this.riddenIds();
    return this.storage.listHatched(this.info.code).flatMap((r, i) => {
      if (ridden.has(r.id)) return [];
      const perch = perchOf(i);
      return {
        id: r.id,
        dragon: r.dragon,
        owner: this.ownerNick(r.token),
        mine: r.token === forToken,
        stage: r.stage === 'adult' ? 'adult' : 'baby',
        perch: { x: perch.x, y: GROUND_Y + 1, z: perch.z },
        yaw: perchYaw(r.id),
        fed: r.fed,
        growAt: r.stage === 'baby' && r.hatchedAt !== null ? growAtOf(DRAGONS.rules, r.hatchedAt, r.fed) : null,
      };
    });
  }

  private broadcastNest(): void {
    for (const p of this.playersIn('village')) this.sendJson(p, { t: 'nest', slots: this.nestSlots(p.token), dragons: this.nestDragons(p.token) });
  }

  /**
   * 먹이 주기 (M6-3): 내 아기 드래곤에게 만들 때 쓴 재료 1개 → 성장 10분 단축. 둥지 안에서.
   * 오류: NOT_AT_NEST·NO_DRAGON·NOT_BABY·NOT_FOOD·NO_ITEM
   */
  feed(idx: number, id: number, item: string, now = Date.now()): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NOT_IN_VILLAGE';
    if (!this.storage) return 'NO_STORAGE';
    if (p.world !== 'village' || !nestContains(GROUND_Y, p.pos.x, p.pos.y, p.pos.z)) return 'NOT_AT_NEST';
    const row = this.storage.getDragon(id);
    if (!row || row.village !== this.info.code || row.token !== p.token || row.stage === 'egg') return 'NO_DRAGON';
    if (row.stage !== 'baby') return 'NOT_BABY';
    const def = DRAGONS.require(row.dragon);
    if (!feedItems(def).includes(item)) return 'NOT_FOOD';
    if (countOf(p.inv, item) < 1) return 'NO_ITEM';
    const changed = new Set<number>();
    take(p.inv, item, 1, changed);
    this.sendInv(p, changed);
    this.storage.saveInventory(p.token, this.info.code, p.inv, now);
    const fed = row.fed + 1;
    this.storage.feedDragon(id, fed);
    this.log(`마을 ${this.info.code}: ${p.nick} ${def.name}에게 ${item} 먹임 (${fed}개)`);
    if (row.hatchedAt !== null && growAtOf(DRAGONS.rules, row.hatchedAt, fed) <= now) this.grow({ ...row, fed }, now);
    else {
      this.sendJson(p, { t: 'dragons', list: this.myDragons(p.token) });
      this.broadcastNest();
    }
    return null;
  }

  /**
   * 타기 (M6-4): 내 어른 드래곤, 가방에 안장, 마을에서 드래곤 자리 RIDE_RANGE 안. 같은 세계 모두에게 mount, 둥지에서 빠진다.
   * 오류: ALREADY_RIDING·NO_DRAGON·NOT_ADULT·NO_SADDLE·TOO_FAR
   */
  ride(idx: number, id: number): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NOT_IN_VILLAGE';
    if (!this.storage) return 'NO_STORAGE';
    if (p.riding) return 'ALREADY_RIDING';
    const row = this.storage.getDragon(id);
    if (!row || row.village !== this.info.code || row.token !== p.token || row.stage === 'egg') return 'NO_DRAGON';
    if (row.stage !== 'adult') return 'NOT_ADULT';
    if (countOf(p.inv, SADDLE_ITEM) < 1) return 'NO_SADDLE';
    if (p.world !== 'village') return 'TOO_FAR';
    const i = this.storage.listHatched(this.info.code).findIndex((r) => r.id === id);
    const perch = perchOf(Math.max(0, i));
    if (Math.hypot(p.pos.x - (perch.x + 0.5), p.pos.z - (perch.z + 0.5)) > RIDE_RANGE) return 'TOO_FAR';
    p.riding = { id, dragon: row.dragon };
    this.broadcastJson({ t: 'mount', idx, riding: p.riding }, -1, p.world);
    this.broadcastNest();
    this.log(`마을 ${this.info.code}: ${p.nick} ${DRAGONS.require(row.dragon).name} 탑승`);
    return null;
  }

  /** 내리기 (M6-4): 드래곤은 둥지 자리로 돌아간다 */
  dismount(idx: number): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NOT_IN_VILLAGE';
    if (!p.riding) return 'NOT_RIDING';
    p.riding = null;
    this.broadcastJson({ t: 'dismount', idx }, -1, p.world);
    this.broadcastNest();
    return null;
  }

  /** 아기 → 어른. 주인에게 성장 경험치(티어 × dragonGrownPerTier) — 접속 안 했으면 저장소에 바로 더한다 */
  private grow(row: DragonRow, now: number): void {
    if (!this.storage) return;
    const def = DRAGONS.require(row.dragon);
    this.storage.growDragon(row.id);
    const amount = def.tier * XP.ours.dragonGrownPerTier;
    const owner = [...this.players.values()].find((p) => p.token === row.token);
    if (owner) {
      const i = this.storage.listHatched(this.info.code).findIndex((r) => r.id === row.id);
      const perch = perchOf(Math.max(0, i));
      this.addXp(owner, amount, XP_SOURCE.grow, perch.x + 0.5, GROUND_Y + 2, perch.z + 0.5, now);
      this.sendJson(owner, { t: 'dragons', list: this.myDragons(owner.token) });
    } else this.storage.addXpOffline(row.token, amount);
    this.broadcastNest();
    this.log(`마을 ${this.info.code}: ${this.ownerNick(row.token)}의 ${def.name} 어른이 됨 (+${amount} 경험치${owner ? '' : ', 나중에 받음'})`);
  }

  /** 5초마다: 다 자란 아기가 있으면 어른으로 */
  private tickGrowth(now: number): void {
    if (!this.storage) return;
    if (now - this.lastGrowthCheck < GROWTH_CHECK_MS) return;
    this.lastGrowthCheck = now;
    for (const r of this.storage.listHatched(this.info.code)) {
      if (r.stage !== 'baby' || r.hatchedAt === null) continue;
      if (growAtOf(DRAGONS.rules, r.hatchedAt, r.fed) <= now) this.grow(r, now);
    }
  }

  /** 시험용: 성장 확인을 지금 바로 */
  checkGrowth(now: number): void {
    this.lastGrowthCheck = 0;
    this.tickGrowth(now);
  }

  /** 알 놓기: 둥지 안에 서서, 가방의 알을 빈 자리에. 오류 코드 또는 null */
  placeEgg(idx: number, slot: number, item: string, now = Date.now()): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NOT_IN_VILLAGE';
    if (!this.storage) return 'NO_STORAGE';
    if (p.world !== 'village' || !nestContains(GROUND_Y, p.pos.x, p.pos.y, p.pos.z)) return 'NOT_AT_NEST';
    const dragonId = dragonOfEgg(item);
    if (!dragonId || !DRAGONS.find(dragonId) || countOf(p.inv, item) < 1) return 'NO_EGG';
    const pos = nestSlotPos(GROUND_Y, slot);
    if (!pos) return 'BAD_SLOT';
    if (this.storage.listNestEggs(this.info.code).some((r) => r.slot === slot)) return 'SLOT_TAKEN';
    const changed = new Set<number>();
    take(p.inv, item, 1, changed);
    this.sendInv(p, changed);
    this.storage.saveInventory(p.token, this.info.code, p.inv, now);
    this.storage.insertDragon(this.info.code, p.token, dragonId, slot, now);
    const num = this.registry.numOf('dragon_egg');
    if (this.world.setBlock(pos.x, pos.y, pos.z, num).changed) {
      this.markDirtyBlock(pos.x, pos.y, pos.z);
      this.broadcast(encodeBlockChanged({ x: pos.x, y: pos.y, z: pos.z, id: 'dragon_egg', by: idx }), -1, 'village');
    }
    this.sendJson(p, { t: 'dragons', list: this.myDragons(p.token) });
    this.broadcastNest();
    this.log(`마을 ${this.info.code}: ${p.nick} 둥지 ${slot}번에 ${dragonId} 알`);
    return null;
  }

  /**
   * 부화: 내 알, 둥지 안에서, 레벨을 낸다(티어별 hatchLevelCostByTier). 모자라면 'NEED_LEVEL:필요:지금'.
   * 성공하면 알 블록이 사라지고 아기 드래곤 + 부화 경험치(티어 × dragonHatchedPerTier)
   */
  hatch(idx: number, id: number, now = Date.now()): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NOT_IN_VILLAGE';
    if (!this.storage) return 'NO_STORAGE';
    if (p.world !== 'village' || !nestContains(GROUND_Y, p.pos.x, p.pos.y, p.pos.z)) return 'NOT_AT_NEST';
    const row = this.storage.getDragon(id);
    if (!row || row.village !== this.info.code || row.token !== p.token || row.stage !== 'egg') return 'NO_EGG';
    const def = DRAGONS.require(row.dragon);
    const cost = hatchCost(XP, def.tier);
    const spent = spendLevels(p.xp, cost);
    if (!spent.ok) return `NEED_LEVEL:${cost}:${spent.level}`;
    p.xp = spent.total;
    p.send(encodeXpState({ total: p.xp }));
    this.storage.hatchDragon(id, now);
    const pos = nestSlotPos(GROUND_Y, row.slot ?? -1);
    if (pos && this.world.setBlock(pos.x, pos.y, pos.z, AIR_ID).changed) {
      this.markDirtyBlock(pos.x, pos.y, pos.z);
      this.broadcast(encodeBlockChanged({ x: pos.x, y: pos.y, z: pos.z, id: 'air', by: idx }), -1, 'village');
    }
    this.addXp(p, def.tier * XP.ours.dragonHatchedPerTier, XP_SOURCE.hatch, pos ? pos.x + 0.5 : p.pos.x, pos ? pos.y + 0.5 : p.pos.y + 1, pos ? pos.z + 0.5 : p.pos.z, now);
    this.sendJson(p, { t: 'dragons', list: this.myDragons(p.token) });
    this.broadcastNest();
    this.log(`마을 ${this.info.code}: ${p.nick} ${def.name} 부화 (레벨 ${cost} 씀)`);
    return null;
  }

  /** 시험용: 경험치 주기 */
  giveXp(idx: number, amount: number): void {
    const p = this.players.get(idx);
    if (p) this.addXp(p, amount, XP_SOURCE.mining, p.pos.x, p.pos.y, p.pos.z);
  }

  /** 저장된 청크를 덮어쓴다. 생성기 버전이 다르면 저장을 버린다 */
  private load(): void {
    if (!this.storage) return;
    if (this.info.genVersion !== VILLAGE_GEN_VERSION) {
      this.storage.clearChunks(this.info.code);
      this.log(`마을 ${this.info.code}: 지형 버전이 바뀌어(${this.info.genVersion} → ${VILLAGE_GEN_VERSION}) 저장을 버렸어요`);
      this.info.genVersion = VILLAGE_GEN_VERSION;
      return;
    }
    const rows = this.storage.loadChunks(this.info.code);
    const unknown = new Set<string>();
    for (const r of rows) {
      if (!this.world.chunkInBounds(r.cx, r.cy, r.cz)) continue;
      const chunk = this.world.getOrCreateChunk(r.cx, r.cy, r.cz);
      const res = decodeChunk(r.blob, this.registry, chunk);
      for (const id of res.unknownIds) unknown.add(id);
      this.modified.set(chunkKey(r.cx, r.cy, r.cz), { cx: r.cx, cy: r.cy, cz: r.cz });
    }
    if (rows.length) this.log(`마을 ${this.info.code}: 저장 청크 ${rows.length}개 불러옴${unknown.size ? ` (모르는 블록 ${[...unknown].join(', ')} → 공기)` : ''}`);
  }

  get playerCount(): number {
    return this.players.size;
  }

  /** 입장 시 보낼 청크 수 */
  get modifiedCount(): number {
    return this.modified.size;
  }

  private toInfo(p: RoomPlayer): PlayerInfo {
    return { idx: p.idx, nick: p.nick, color: p.color, x: p.pos.x, y: p.pos.y, z: p.pos.z, yaw: p.pos.yaw, pitch: p.pos.pitch, riding: p.riding };
  }

  private freeIdx(): number {
    for (let i = 0; i < MAX_PLAYERS; i++) if (!this.players.has(i)) return i;
    return -1;
  }

  /** 그 플레이어가 지금 있는 세계 */
  private worldOf(p: RoomPlayer): VoxelWorld {
    return p.world === 'expedition' && this.expedition ? this.expedition.world : this.world;
  }

  private playersIn(world: WorldKind): RoomPlayer[] {
    return [...this.players.values()].filter((p) => p.world === world);
  }

  /**
   * 입장. 저장된 위치가 있으면 거기, 없으면 광장. 꽉 찼으면 null.
   * 같은 토큰이 이미 들어와 있으면(다른 탭·재접속) 예전 연결을 끊는다. 입장은 항상 마을.
   */
  join(token: string, nick: string, color: number, send: Send, kick?: (why: string) => void): JoinResult | null {
    for (const p of [...this.players.values()]) if (p.token === token) this.leave(p.idx, '같은 계정이 다른 곳에서 들어왔어요');
    const idx = this.freeIdx();
    if (idx < 0) return null;
    const saved = this.storage?.getPlayer(token);
    let pos: PlayerMoveMsg = { x: this.spawn.x, y: this.spawn.y, z: this.spawn.z, yaw: this.spawn.yaw, pitch: 0, flags: FLAG_GROUND };
    if (saved && saved.village === this.info.code && this.world.inBounds(Math.floor(saved.x), Math.floor(Math.max(0, Math.min(this.world.sizeY - 2, saved.y))), Math.floor(saved.z))) {
      pos = { x: saved.x, y: saved.y, z: saved.z, yaw: saved.yaw, pitch: saved.pitch, flags: 0 };
    }
    const savedInv = this.storage?.getInventory(token) ?? null;
    const inv = savedInv ?? emptyInventory();
    // 처음 온 사람(가방 저장이 없음)에게 시작 키트 (#67). 저장소가 없는 시험 룸도 준다
    if (savedInv === null && this.starterKit) for (const [item, n] of Object.entries(this.starterKit)) give(inv, item, n);
    // 아빠 선물 (#79): 아직 안 받은 것만, 한 사람당 한 번. 저장소가 있어야 기억한다
    const gifts: GiftNotice[] = [];
    if (this.storage) {
      const already = this.storage.giftsGiven(token);
      for (const g of this.gifts) {
        if (already.has(g.id)) continue;
        for (const [item, n] of Object.entries(g.items)) give(inv, item, n);
        this.storage.markGiftGiven(token, g.id);
        gifts.push({ id: g.id, name: g.name, message: g.message });
      }
    }
    const player: RoomPlayer = { idx, token, nick, color, pos, send, kick, recent: [], world: 'village', inv, gained: new Map(), brewFuel: 0, lastEmote: 0, xp: saved?.xpTotal ?? 0, riding: null };
    const others = this.playersIn('village').map((p) => this.toInfo(p));
    this.players.set(idx, player);
    const me = this.toInfo(player);
    this.broadcastJson({ t: 'playerJoined', player: me }, idx, 'village');
    this.savePlayer(player);
    if (savedInv === null || gifts.length) this.storage?.saveInventory(token, this.info.code, inv); // 키트·선물은 한 번만 — 바로 저장해 둔다
    this.log(`마을 ${this.info.code}: ${nick}(#${idx}) 입장${savedInv === null ? ' (처음, 시작 키트)' : ''}${gifts.length ? ` (선물 ${gifts.map((g) => g.name).join('·')})` : ''}, ${this.players.size}명`);
    return { idx, spawn: me, players: others, expedition: this.expeditionState(), inventory: inv, xp: player.xp, dragons: this.myDragons(token), nest: this.nestSlots(token), nestDragons: this.nestDragons(token), gifts };
  }

  /** 입장 직후: 생성 지형과 다른 청크를 전부 보낸다 */
  sendModifiedChunks(send: Send): number {
    let n = 0;
    for (const c of this.modified.values()) {
      const chunk = this.world.getChunk(c.cx, c.cy, c.cz);
      if (!chunk) continue;
      send(encodeChunkData({ cx: c.cx, cy: c.cy, cz: c.cz, bytes: this.encode(chunk) }));
      n++;
    }
    return n;
  }

  leave(idx: number, why = ''): void {
    const p = this.players.get(idx);
    if (!p) return;
    this.players.delete(idx);
    if (p.world === 'expedition' && this.expedition) {
      this.expedition.members.delete(idx);
      // 원정 중에 끊기면 모은 것의 절반만 (늦은 귀환과 같은 규칙)
      this.loseGained(p, this.expeditions.rules.failedReturnKeepRatio);
      this.endIfEmpty(Date.now());
      this.broadcastJson({ t: 'expeditionState', expedition: this.expeditionState() }, -1, 'village');
    }
    // 마을 저장 위치는 항상 마을 좌표 (원정 중에 나갔으면 광장)
    if (p.world === 'expedition') p.pos = { x: this.spawn.x, y: this.spawn.y, z: this.spawn.z, yaw: this.spawn.yaw, pitch: 0, flags: FLAG_GROUND };
    this.savePlayer(p);
    this.storage?.saveInventory(p.token, this.info.code, p.inv);
    this.broadcastJson({ t: 'playerLeft', idx }, -1, p.world);
    if (p.riding) {
      p.riding = null; // 타고 있던 드래곤은 둥지로 (M6-4)
      this.broadcastNest();
    }
    this.log(`마을 ${this.info.code}: ${p.nick}(#${idx}) 퇴장${why ? ` (${why})` : ''}, ${this.players.size}명`);
    // 서버가 내보낸 경우: 그 연결은 더 이상 이 룸의 누구도 아니다 → 세션에 알리고 끊는다
    if (why) {
      try {
        p.kick?.(why);
      } catch {
        /* 이미 끊긴 연결 */
      }
    }
    if (this.players.size === 0) this.flush(Date.now());
  }

  onMove(idx: number, m: PlayerMoveMsg): void {
    const p = this.players.get(idx);
    if (!p) return;
    if (!Number.isFinite(m.x) || !Number.isFinite(m.y) || !Number.isFinite(m.z)) return;
    const w = this.worldOf(p);
    // 세계 밖으로는 못 나간다 (클라도 막지만 서버가 한 번 더)
    p.pos.x = Math.max(0, Math.min(w.sizeX, m.x));
    p.pos.y = Math.max(-32, Math.min(w.sizeY + 32, m.y));
    p.pos.z = Math.max(0, Math.min(w.sizeZ, m.z));
    p.pos.yaw = m.yaw;
    p.pos.pitch = m.pitch;
    p.pos.flags = m.flags & 0xff;
  }

  /** 검증만 (테스트용). 거절 사유 번호 또는 null */
  validate(p: RoomPlayer, req: BlockChangeReqMsg, now: number): number | null {
    const { x, y, z } = req;
    const world = this.worldOf(p);
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z) || !world.inBounds(x, y, z)) return REJECT.INVALID;
    if (p.world === 'expedition' && (!this.expedition || this.expedition.ended)) return REJECT.ENDED;
    // 속도: 최근 1초에 RATE_PER_SEC 번
    while (p.recent.length && now - p.recent[0] > 1000) p.recent.shift();
    if (p.recent.length >= RATE_PER_SEC) return REJECT.RATE;
    // 도달 거리: 눈에서 블록 중심까지
    const dx = x + 0.5 - p.pos.x,
      dy = y + 0.5 - (p.pos.y + EYE),
      dz = z + 0.5 - p.pos.z;
    if (dx * dx + dy * dy + dz * dz > REACH * REACH) return REJECT.TOO_FAR;

    const def = this.registry.find(req.id);
    if (!def) return REJECT.INVALID;
    const cur = this.registry.get(world.getBlock(x, y, z));
    // 문 열고 닫기 (#71): 같은 문·같은 방향·같은 반쪽에서 열림만 뒤집는 요청. 가방과 무관, 아무나 가능
    if (def.door && cur.door && def.door.base === cur.door.base && def.door.facing === cur.door.facing && def.door.upper === cur.door.upper && def.door.open !== cur.door.open) {
      if (def.door.open) return null;
      const ly = def.door.upper ? y - 1 : y; // 닫을 때는 문 두 칸에 누가 서 있으면 안 된다
      for (const other of this.playersIn(p.world)) if (bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, ly, z) || bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, ly + 1, z)) return REJECT.OCCUPIED;
      return null;
    }
    if (def.num === AIR_ID) {
      // 부수기: 자연 원천과 고인 액체(얕은 웅덩이 포함)는 양동이처럼 떠낼 수 있고, 자연 흐름은 못 건드린다(원천을 없애면 마른다). hardness 없는 블록(기반암)은 못 부순다
      if (cur.num === AIR_ID) return REJECT.INVALID;
      if (cur.fluid) {
        if (cur.fluidLevel !== 0 && cur.fluidVolume === 0) return REJECT.INVALID;
        // 가득한 칸을 떠내려면 빈 양동이 (얕은 웅덩이 닦기는 그냥)
        if (cur.fluidLevel === 0 && countOf(p.inv, BUCKET) < 1) return REJECT.NO_ITEM;
        return null;
      }
      if (cur.hardness === null) return REJECT.UNBREAKABLE;
      // 곡괭이 등급 (아들 2026-09-20): 손에 든 칸의 곡괭이로 이 블록을 캘 수 있나. 맨손은 toolTier 0 만
      const held = req.slot !== undefined && req.slot >= 0 && req.slot < p.inv.length ? (p.inv[req.slot]?.item ?? null) : null;
      if (!canBreakWith(cur, toolOf(TOOLS, held))) return REJECT.TOOL;
      return null;
    }
    // 놓기: 액체는 플레이어가 놓는 고인 액체 8/8 만(자연 원천·흐름은 못 놓는다), 그 외 내부 블록 불가, 자리는 공기·액체만, 누가 서 있으면 안 됨
    if (def.fluid ? def.fluidVolume !== FLUID_FULL : def.internal && !def.door && !def.torch) return REJECT.INVALID; // 벽 횃불 변형은 놓을 수 있다 (#82)
    if (def.door && (def.door.upper || def.door.open)) return REJECT.INVALID; // 문은 아래·닫힘 변형만 놓는다(윗칸은 서버가 채운다)
    // 가방에 그 아이템(액체면 찬 양동이)이 있어야 한다 (M4, #66)
    const item = itemForPlacing(def.id, this.registry);
    if (!item || countOf(p.inv, item) < 1) return REJECT.NO_ITEM;
    if (cur.num !== AIR_ID && !cur.fluid) return REJECT.OCCUPIED; // 횃불·꽃 같은 비고체 블록도 덮어쓰지 않는다(아이템이 사라지니까)
    if (def.solid) for (const other of this.playersIn(p.world)) if (bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, y, z)) return REJECT.OCCUPIED;
    if (def.door) {
      // 문은 두 칸: 윗칸도 공기여야 하고 누가 서 있으면 안 된다
      if (!world.inBounds(x, y + 1, z) || world.getBlock(x, y + 1, z) !== AIR_ID) return REJECT.OCCUPIED;
      for (const other of this.playersIn(p.world)) if (bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, y + 1, z)) return REJECT.OCCUPIED;
    }
    return null;
  }

  onBlockChange(idx: number, req: BlockChangeReqMsg, now = Date.now()): void {
    const p = this.players.get(idx);
    if (!p) return;
    // 핫바의 문 자체(JSON id)를 놓는 요청은 보던 방향의 아래·닫힘 변형으로 바꾼다
    const rawDef = this.registry.find(req.id);
    if (rawDef && rawDef.shape === 'door' && !rawDef.door && this.registry.isDoor(rawDef.num)) {
      req = { ...req, id: this.registry.get(this.registry.doorVariant(rawDef.num, facingFromYaw(p.pos.yaw), false, false)).id };
    }
    const reason = this.validate(p, req, now);
    if (reason !== null) {
      this.stats.rejected++;
      p.send(encodeBlockChangeRejected({ seq: req.seq, reason }));
      return;
    }
    p.recent.push(now);
    const world = this.worldOf(p);
    const num = this.registry.numOf(req.id);
    const prev = this.registry.get(world.getBlock(req.x, req.y, req.z));
    const res = world.setBlock(req.x, req.y, req.z, num);
    if (!res.changed) {
      // 이미 그 블록이면 확정만 알려 준다 (클라 낙관 적용과 같은 값)
      p.send(encodeBlockChanged({ x: req.x, y: req.y, z: req.z, id: req.id, by: idx }));
      return;
    }
    this.stats.blockChanges++;
    const touched = (x: number, y: number, z: number) => {
      if (p.world === 'expedition' && this.expedition) {
        this.expedition.markModified(x, y, z);
        this.expedition.fluids.touch(x, y, z);
      } else {
        this.markDirtyBlock(x, y, z);
        this.fluids.touch(x, y, z);
      }
    };
    touched(req.x, req.y, req.z);
    // 문은 두 칸이 함께 움직인다 (#71): 놓으면 윗칸도, 부수면 다른 반쪽도, 열고 닫으면 둘 다
    const def = this.registry.get(num);
    const doorHalf = def.door ?? prev.door;
    if (doorHalf) {
      const oy = doorHalf.upper ? req.y - 1 : req.y + 1;
      const other = def.door ? this.registry.doorVariant(def.door.base, def.door.facing, !def.door.upper, def.door.open) : AIR_ID;
      if (world.inBounds(req.x, oy, req.z) && world.setBlock(req.x, oy, req.z, other).changed) {
        touched(req.x, oy, req.z);
        this.broadcast(encodeBlockChanged({ x: req.x, y: oy, z: req.z, id: this.registry.get(other).id, by: idx }), -1, p.world);
      }
    }
    const isToggle = def.door !== null && prev.door !== null;
    // 가방 (M4): 놓으면 나가고, 부수면 들어온다. 문 열고 닫기는 가방과 무관
    const changed = new Set<number>();
    if (isToggle) {
      // 아무것도 안 함
    } else if (num === AIR_ID) {
      const seed = p.world === 'expedition' && this.expedition ? this.expedition.seed : this.info.seed;
      const drop = dropOf(prev.door ? this.registry.get(prev.door.base) : prev, req.x, req.y, req.z, seed);
      if (drop) {
        if (drop.needsBucket) take(p.inv, BUCKET, 1, changed);
        this.giveTo(p, drop.item, drop.count, changed);
        if (drop.bonus) this.giveTo(p, drop.bonus.item, drop.bonus.count, changed);
      }
      // 경험치 (M6-1): 광석은 xp.json 값(자리·시드 결정론), 원정 보물 상자는 열기 = 부수기
      const mined = miningXp(XP, prev.id, req.x, req.y, req.z, seed);
      if (mined > 0) this.addXp(p, mined, XP_SOURCE.mining, req.x + 0.5, req.y + 0.5, req.z + 0.5);
      if (prev.id === 'chest' && p.world === 'expedition' && this.expedition?.isTreasure(req.x, req.y, req.z)) {
        this.addXp(p, XP.ours.treasureChestOpen, XP_SOURCE.treasure, req.x + 0.5, req.y + 0.5, req.z + 0.5);
        // 상자 속 물건 (M6-4 임시: 가죽 — expeditions.json treasureChestGives)
        for (const [item, n] of Object.entries(this.expeditions.rules.treasureChestGives)) this.giveTo(p, item, n, changed);
      }
    } else {
      const item = itemForPlacing(req.id, this.registry);
      if (item) {
        take(p.inv, item, 1, changed);
        if (item !== req.id) give(p.inv, BUCKET, 1, changed); // 양동이를 부으면 빈 양동이가 남는다
      }
    }
    this.sendInv(p, changed);
    this.broadcast(encodeBlockChanged({ x: req.x, y: req.y, z: req.z, id: req.id, by: idx }), -1, p.world);
  }

  // ---------------------------------------------------------------- 가방·제작·양조·채팅 (M4)

  /** 바뀐 칸을 그 사람에게 보낸다 */
  private sendInv(p: RoomPlayer, changed: Set<number>): void {
    if (changed.size === 0) return;
    const slots = [...changed]
      .sort((a, b) => a - b)
      .map((slot) => {
        const s = p.inv[slot];
        return { slot, item: s ? s.item : '', count: s ? s.count : 0 };
      });
    for (let i = 0; i < slots.length; i += 200) p.send(encodeInvSlots({ slots: slots.slice(i, i + 200) }));
  }

  /** 가방에 넣는다. 원정 중이면 모은 것으로 센다. 가득 차면 안내 */
  private giveTo(p: RoomPlayer, item: string, count: number, changed: Set<number>): number {
    const left = give(p.inv, item, count, changed);
    const got = count - left;
    if (got > 0 && p.world === 'expedition') p.gained.set(item, (p.gained.get(item) ?? 0) + got);
    if (left > 0) this.sendJson(p, { t: 'error', code: 'BAG_FULL', message: '가방이 가득 찼어요' });
    return left;
  }

  /** 시험·시작 키트: 서버가 직접 준다 */
  giveItems(idx: number, item: string, count: number): boolean {
    const p = this.players.get(idx);
    if (!p) return false;
    const changed = new Set<number>();
    const left = give(p.inv, item, count, changed);
    this.sendInv(p, changed);
    return left === 0;
  }

  /** 원정에서 모은 것 (테스트·정산) */
  gainedOf(idx: number): ExpeditionResultItem[] {
    const p = this.players.get(idx);
    if (!p) return [];
    return [...p.gained.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, count }));
  }

  /** 늦게 돌아오면 모은 것 중 keepRatio 만큼만 남긴다(올림). 남긴 목록을 돌려준다 */
  private loseGained(p: RoomPlayer, keepRatio: number): ExpeditionResultItem[] {
    const changed = new Set<number>();
    const kept: ExpeditionResultItem[] = [];
    for (const [id, count] of [...p.gained.entries()].sort((a, b) => b[1] - a[1])) {
      const keep = Math.ceil(count * keepRatio);
      const lose = Math.min(count - keep, countOf(p.inv, id));
      if (lose > 0) take(p.inv, id, lose, changed);
      if (keep > 0) kept.push({ id, count: keep });
    }
    p.gained.clear();
    this.sendInv(p, changed);
    return kept;
  }

  /** 플레이어 5칸 안에 그 블록이 있나 (제작대·화로·양조기) */
  private nearBlock(p: RoomPlayer, blockId: string): boolean {
    const def = this.registry.find(blockId);
    if (!def) return false;
    const w = this.worldOf(p);
    const cx = Math.floor(p.pos.x),
      cy = Math.floor(p.pos.y + 1),
      cz = Math.floor(p.pos.z);
    for (let y = cy - STATION_REACH; y <= cy + STATION_REACH; y++)
      for (let z = cz - STATION_REACH; z <= cz + STATION_REACH; z++)
        for (let x = cx - STATION_REACH; x <= cx + STATION_REACH; x++) if (w.inBounds(x, y, z) && w.getBlock(x, y, z) === def.num) return true;
    return false;
  }

  /** 제작. 성공 null, 아니면 에러 코드 */
  craft(idx: number, recipeId: string): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NO_PLAYER';
    const r = this.recipes.find(recipeId);
    if (!r || r.release !== 'v1') return 'BAD_RECIPE';
    if (r.station === 'world' || r.station === 'brewing') return 'BAD_RECIPE';
    if (r.station === 'forge' || r.station === 'anvil') return 'NOT_YET';
    if (r.station !== 'inventory' && !this.nearBlock(p, r.station)) return 'NO_STATION';
    const changed = new Set<number>();
    const res = craft(p.inv, r, changed);
    if (!res.ok) return 'MISSING';
    this.sendInv(p, changed);
    if (res.lost) this.sendJson(p, { t: 'error', code: 'BAG_FULL', message: '가방이 가득 차서 일부가 사라졌어요' });
    if (p.world === 'expedition') for (const [item, n] of Object.entries(r.out)) p.gained.set(item, (p.gained.get(item) ?? 0) + n);
    return null;
  }

  /** 양조. bottles = 병이 든 칸 번호들(1~3), ingredient = 재료 칸. 성공 null, 아니면 에러 코드 */
  brew(idx: number, bottles: number[], ingredientSlot: number): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NO_PLAYER';
    if (!this.nearBlock(p, 'brewing_stand')) return 'NO_STATION';
    const rules = this.potions.stand;
    if (!Array.isArray(bottles) || bottles.length < 1 || bottles.length > rules.bottles) return 'BAD_BOTTLES';
    if (new Set(bottles).size !== bottles.length || bottles.includes(ingredientSlot)) return 'BAD_BOTTLES';
    const ing = p.inv[ingredientSlot];
    if (!ing) return 'NO_INGREDIENT';
    const results: { slot: number; item: string }[] = [];
    for (const slot of bottles) {
      const s = p.inv[slot];
      if (!s || s.count !== 1 || !isPotionItem(s.item)) return 'BAD_BOTTLES';
      const next = this.potions.brew(potionFromItemId(s.item)!, ing.item);
      if (next) results.push({ slot, item: potionItemId(next) });
    }
    if (results.length === 0) return 'NO_EFFECT';
    if (p.brewFuel <= 0) {
      if (countOf(p.inv, rules.fuel) < 1) return 'NO_FUEL';
      const ch = new Set<number>();
      take(p.inv, rules.fuel, 1, ch);
      p.brewFuel = rules.brewsPerFuel;
      this.sendInv(p, ch);
    }
    p.brewFuel--;
    const changed = new Set<number>();
    takeFromSlot(p.inv, ingredientSlot, 1, changed);
    for (const r of results) {
      p.inv[r.slot] = { item: r.item, count: 1 };
      changed.add(r.slot);
    }
    this.sendInv(p, changed);
    return null;
  }

  onInvMove(idx: number, m: InvMoveMsg): void {
    const p = this.players.get(idx);
    if (!p) return;
    const changed = new Set<number>();
    if (move(p.inv, m.from, m.to, m.count, changed)) this.sendInv(p, changed);
    else this.sendInv(p, new Set([m.from, m.to].filter((i) => i >= 0 && i < p.inv.length))); // 클라가 어긋났으면 바로잡는다
  }

  /** 버리기 = 사라짐 (아이템 엔티티 없음, #66) */
  onInvDrop(idx: number, m: InvDropMsg): void {
    const p = this.players.get(idx);
    if (!p) return;
    const changed = new Set<number>();
    if (takeFromSlot(p.inv, m.slot, m.count, changed)) this.sendInv(p, changed);
  }

  /** 채팅: 정해진 이모지·문구만, 초당 1개, 같은 세계 사람 전부(나 포함) */
  onEmote(idx: number, kind: number, id: number, now = Date.now()): boolean {
    const p = this.players.get(idx);
    if (!p) return false;
    if (!this.phrases.valid(kind, id)) return false;
    if (now - p.lastEmote < 1000 / EMOTE_PER_SEC) return false;
    p.lastEmote = now;
    this.broadcast(encodeEmote({ idx, kind, id }), -1, p.world);
    return true;
  }

  private markDirtyBlock(x: number, y: number, z: number): void {
    const c = { cx: x >> 4, cy: y >> 4, cz: z >> 4 };
    const key = chunkKey(c.cx, c.cy, c.cz);
    this.dirty.set(key, c);
    this.modified.set(key, c);
  }

  // ---------------------------------------------------------------- 원정 (M3)

  expeditionState(now = Date.now()): ExpeditionStateInfo | null {
    const e = this.expedition;
    if (!e || e.ended) return null;
    return { id: e.def.id, name: e.def.name, players: e.members.size, remainingSec: Math.ceil(e.remainingSec(now)) };
  }

  /**
   * 원정 시작(진행 중이면 합류). 마을에 있는 사람만. 원정지 id 가 없거나 v1 이 아니면 거절(에러 코드 반환).
   * 성공하면 null.
   */
  startExpedition(idx: number, expeditionId: string, now = Date.now()): string | null {
    const p = this.players.get(idx);
    if (!p) return 'NO_PLAYER';
    if (p.world !== 'village') return 'ALREADY_OUT';
    let e = this.expedition;
    if (e && (e.ended || e.def.id !== expeditionId)) {
      if (e.members.size > 0 && !e.ended) return 'OTHER_EXPEDITION';
      if (!e.ended) this.disposeExpedition();
      e = this.expedition;
    }
    if (!e || e.ended) {
      if (e?.ended) {
        // 유예 중 새 원정 시작: 남은 사람이 없을 때만 (있으면 곧 강제 귀환됨)
        if (e.members.size > 0) return 'ENDING';
        this.disposeExpedition();
      }
      const def = this.expeditions.find(expeditionId);
      if (!def || def.release !== 'v1') return 'BAD_EXPEDITION';
      if (def.generator !== 'island') return 'NOT_YET';
      e = new Expedition(def, this.seedFn(), this.registry, now);
      this.expedition = e;
      this.stats.expeditions++;
      this.lastTimerAt = 0;
      this.log(`마을 ${this.info.code}: 원정 "${def.name}" 시작 (시드 ${e.seed}, 섬 생성 ${e.genMs.toFixed(0)}ms), ${p.nick} 출발`);
    }
    this.moveToExpedition(p, e, now);
    return null;
  }

  private moveToExpedition(p: RoomPlayer, e: Expedition, now: number): void {
    this.broadcastJson({ t: 'playerLeft', idx: p.idx }, p.idx, 'village');
    p.world = 'expedition';
    p.pos = { x: e.spawn.x, y: e.spawn.y, z: e.spawn.z, yaw: e.spawn.yaw, pitch: 0, flags: FLAG_GROUND };
    p.recent = [];
    const others = this.playersIn('expedition').filter((o) => o.idx !== p.idx).map((o) => this.toInfo(o));
    e.members.add(p.idx);
    const me = this.toInfo(p);
    this.broadcastJson({ t: 'playerJoined', player: me }, p.idx, 'expedition');
    const info: ExpeditionEnterInfo = {
      id: e.def.id,
      name: e.def.name,
      seed: e.seed,
      genVersion: e.genVersion,
      durationSec: e.def.durationSec,
      nightStartsAt: e.def.nightStartsAt,
      startedAt: e.startedAt,
      serverNow: now,
      treasures: e.def.treasures,
    };
    this.sendJson(p, { t: 'worldEnter', kind: 'expedition', expedition: info, spawn: me, players: others, chunkCount: e.modifiedCount });
    for (const c of e.modifiedChunks()) {
      const chunk = e.world.getChunk(c.cx, c.cy, c.cz);
      if (chunk) p.send(encodeChunkData({ cx: c.cx, cy: c.cy, cz: c.cz, bytes: this.encode(chunk) }));
    }
    this.sendJson(p, { t: 'ready' });
    this.broadcastJson({ t: 'expeditionState', expedition: this.expeditionState(now) }, -1, 'village');
  }

  /**
   * 마을로 돌아가기(정산). 포탈 안에 서 있어야 한다(late 강제 귀환은 예외). 성공하면 null, 아니면 에러 코드.
   */
  returnHome(idx: number, now = Date.now(), late = false): string | null {
    const p = this.players.get(idx);
    const e = this.expedition;
    if (!p || !e || p.world !== 'expedition') return 'NOT_OUT';
    if (!late && !e.inPortal(p.pos.x, p.pos.y, p.pos.z)) return 'NOT_IN_PORTAL';
    const keepRatio = this.expeditions.rules.failedReturnKeepRatio;
    const items = late ? this.loseGained(p, keepRatio) : this.gainedOf(idx);
    p.gained.clear();
    e.members.delete(idx);
    this.broadcastJson({ t: 'playerLeft', idx }, idx, 'expedition');
    if (!late) this.endIfEmpty(now);
    this.broadcastJson({ t: 'expeditionState', expedition: this.expeditionState(now) }, -1, 'village');
    this.sendJson(p, {
      t: 'expeditionResult',
      expedition: e.def.id,
      name: e.def.name,
      items,
      late,
      keepRatio: late ? keepRatio : 1,
      elapsedSec: Math.floor(e.elapsedSec(now)),
    });
    p.world = 'village';
    p.pos = { x: this.spawn.x, y: this.spawn.y, z: this.spawn.z, yaw: this.spawn.yaw, pitch: 0, flags: FLAG_GROUND };
    p.recent = [];
    const me = this.toInfo(p);
    const others = this.playersIn('village').filter((o) => o.idx !== idx).map((o) => this.toInfo(o));
    this.broadcastJson({ t: 'playerJoined', player: me }, idx, 'village');
    this.sendJson(p, { t: 'worldEnter', kind: 'village', expedition: null, spawn: me, players: others, chunkCount: this.modifiedCount });
    this.sendModifiedChunks(p.send);
    this.sendJson(p, { t: 'ready' });
    this.sendJson(p, { t: 'expeditionState', expedition: this.expeditionState(now) });
    // 원정 귀환 성공 경험치 (M6-1): 늦지 않게 돌아오면. 세계가 바뀐 뒤에 보내 마을 스폰 자리에 구슬이 뜬다
    if (!late) this.addXp(p, XP.ours.expeditionReturn, XP_SOURCE.expeditionReturn, p.pos.x, p.pos.y + 1, p.pos.z, now);
    p.send(encodeXpState({ total: p.xp }));
    this.savePlayer(p, now);
    this.storage?.saveInventory(p.token, this.info.code, p.inv, now);
    this.log(`마을 ${this.info.code}: ${p.nick} 귀환${late ? '(늦음)' : ''} — ${items.map((i) => `${i.id}×${i.count}`).join(', ') || '빈손'}`);
    return null;
  }

  /** 안에 아무도 없으면 원정을 끝낸다 (다음 출발은 새 섬·새 타이머). 유예 뒤 폐기 */
  private endIfEmpty(now: number): void {
    const e = this.expedition;
    if (!e || e.ended || e.members.size > 0) return;
    e.ended = true;
    this.expeditionDisposeAt = now + this.expeditions.rules.returnGraceSec * 1000;
    this.log(`마을 ${this.info.code}: 원정 "${e.def.name}" 모두 돌아옴 → 종료`);
  }

  private disposeExpedition(): void {
    if (!this.expedition) return;
    this.log(`마을 ${this.info.code}: 원정 "${this.expedition.def.name}" 폐기`);
    this.expedition = null;
    this.expeditionDisposeAt = 0;
  }

  private tickExpedition(now: number): void {
    const e = this.expedition;
    if (!e) return;
    // 액체 틱은 tick() 이 마을과 같은 누적기로 돌린다. 여기서는 결과만 보낸다
    if (e.batch.length) {
      const last = new Map<string, { x: number; y: number; z: number; id: string }>();
      for (const b of e.batch) last.set(`${b.x},${b.y},${b.z}`, b);
      const blocks = [...last.values()];
      e.batch = [];
      for (let i = 0; i < blocks.length; i += 2000) this.broadcast(encodeBlockBatch({ blocks: blocks.slice(i, i + 2000) }), -1, 'expedition');
    }
    for (const c of e.fluids.takeChanged()) e.markModifiedChunk(c);
    // 위치
    const inside = this.playersIn('expedition');
    if (inside.length) {
      const list: PlayerStateEntry[] = inside.map((p) => ({ idx: p.idx, ...p.pos }));
      this.broadcast(encodePlayersState(list), -1, 'expedition');
    }
    // 1Hz 타이머
    if (!e.ended && now - this.lastTimerAt >= 1000) {
      this.lastTimerAt = now;
      const elapsed = Math.min(65535, Math.floor(e.elapsedSec(now)));
      this.broadcast(encodeExpeditionTimer({ elapsedSec: elapsed, durationSec: e.def.durationSec, phase: PHASE_NUM[e.phase(now)] }), -1, 'expedition');
    }
    // 시간 종료 → 안에 있는 사람 전부 강제 귀환(절반)
    if (!e.ended && now >= e.endsAt) {
      e.ended = true;
      this.expeditionDisposeAt = now + this.expeditions.rules.returnGraceSec * 1000;
      this.log(`마을 ${this.info.code}: 원정 "${e.def.name}" 시간 종료, ${e.members.size}명 강제 귀환`);
      for (const idx of [...e.members]) this.returnHome(idx, now, true);
      this.broadcastJson({ t: 'expeditionState', expedition: null }, -1, 'village');
    }
    if (e.ended && e.members.size === 0 && now >= this.expeditionDisposeAt) this.disposeExpedition();
  }

  // ---------------------------------------------------------------- 틱·저장

  /** 20Hz 로 불러 준다 (더 드물게 불려도 dt 만큼 따라간다, 최대 4틱) */
  tick(now: number): void {
    if (this.lastTick === 0) this.lastTick = now;
    this.fluidAcc += Math.min(TICK_MS * 4, now - this.lastTick);
    this.lastTick = now;
    while (this.fluidAcc >= TICK_MS) {
      this.fluids.tick();
      this.expedition?.fluids.tick();
      this.fluidAcc -= TICK_MS;
    }
    for (const c of this.fluids.takeChanged()) {
      const key = chunkKey(c.cx, c.cy, c.cz);
      this.dirty.set(key, c);
      this.modified.set(key, c);
    }
    if (this.batch.length) {
      // 같은 칸이 한 틱에 여러 번 바뀌면 마지막 값만
      const last = new Map<string, { x: number; y: number; z: number; id: string }>();
      for (const b of this.batch) last.set(`${b.x},${b.y},${b.z}`, b);
      const blocks = [...last.values()];
      this.batch = [];
      for (let i = 0; i < blocks.length; i += 2000) this.broadcast(encodeBlockBatch({ blocks: blocks.slice(i, i + 2000) }), -1, 'village');
    }
    const inVillage = this.playersIn('village');
    if (inVillage.length > 0) {
      const list: PlayerStateEntry[] = inVillage.map((p) => ({ idx: p.idx, ...p.pos }));
      this.broadcast(encodePlayersState(list), -1, 'village');
    }
    this.tickExpedition(now);
    this.tickGrowth(now);
    if (this.lastFlush === 0) this.lastFlush = now;
    if (now - this.lastFlush >= FLUSH_MS) this.flush(now);
  }

  /** 바뀐 청크·플레이어 위치 저장 */
  flush(now: number): void {
    this.lastFlush = now;
    if (!this.storage) {
      this.dirty.clear();
      return;
    }
    if (this.dirty.size) {
      const rows = [];
      for (const c of this.dirty.values()) {
        const chunk = this.world.getChunk(c.cx, c.cy, c.cz);
        if (chunk) rows.push({ cx: c.cx, cy: c.cy, cz: c.cz, blob: this.encode(chunk) });
      }
      this.storage.saveChunks(this.info.code, rows, now);
      this.stats.flushes++;
      this.stats.chunksSaved += rows.length;
      this.dirty.clear();
    }
    for (const p of this.players.values()) {
      if (p.world === 'village') this.savePlayer(p, now);
      this.storage.saveInventory(p.token, this.info.code, p.inv, now);
    }
  }

  private encode(chunk: NonNullable<ReturnType<VoxelWorld['getChunk']>>): Uint8Array {
    chunk.compactPalette();
    return encodeChunk(chunk, this.registry);
  }

  private savePlayer(p: RoomPlayer, now = Date.now()): void {
    this.storage?.savePlayer({
      token: p.token,
      village: this.info.code,
      nick: p.nick,
      color: p.color,
      x: p.pos.x,
      y: p.pos.y,
      z: p.pos.z,
      yaw: p.pos.yaw,
      pitch: p.pos.pitch,
      lastSeen: now,
      xpTotal: p.xp,
    });
  }

  /** 경험치 주기 (M6-1): 총량에 더하고 XpGained(양·자리)를 보낸다. 저장은 바로 */
  private addXp(p: RoomPlayer, amount: number, source: number, x: number, y: number, z: number, now = Date.now()): void {
    const n = Math.floor(amount);
    if (n <= 0) return;
    p.xp += n;
    p.send(encodeXpGained({ amount: n, source, x, y, z }));
    this.savePlayer(p, now);
  }

  /** 시험용 */
  xpOf(idx: number): number {
    return this.players.get(idx)?.xp ?? 0;
  }

  private sendJson(p: RoomPlayer, obj: unknown): void {
    try {
      p.send(JSON.stringify(obj));
    } catch {
      /* 끊긴 연결은 세션이 정리한다 */
    }
  }

  /** 같은 세계 사람들에게 (world 를 안 주면 전부) */
  broadcast(bytes: Uint8Array, exceptIdx = -1, world?: WorldKind): void {
    for (const p of this.players.values()) {
      if (p.idx === exceptIdx || (world && p.world !== world)) continue;
      try {
        p.send(bytes);
      } catch {
        /* 끊긴 연결은 세션이 정리한다 */
      }
    }
  }

  broadcastJson(obj: unknown, exceptIdx = -1, world?: WorldKind): void {
    const s = JSON.stringify(obj);
    for (const p of this.players.values()) {
      if (p.idx === exceptIdx || (world && p.world !== world)) continue;
      try {
        p.send(s);
      } catch {
        /* 끊긴 연결은 세션이 정리한다 */
      }
    }
  }
}

export { BY_SERVER };
