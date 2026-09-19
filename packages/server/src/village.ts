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
  FLAG_GROUND,
  FluidSim,
  MAX_PLAYERS,
  PHASE_NUM,
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
  encodeExpeditionTimer,
  encodePlayersState,
  generateVillage,
} from '@dragon-village/shared';
import { EXPEDITIONS } from '@dragon-village/shared/data';
import { randomInt } from 'node:crypto';
import { Expedition } from './expedition';
import type { Storage } from './storage';

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
}

export interface JoinResult {
  idx: number;
  spawn: PlayerInfo;
  players: PlayerInfo[];
  expedition: ExpeditionStateInfo | null;
}

export interface RoomOptions {
  expeditions?: ExpeditionRegistry;
  /** 원정 시드 (테스트에서 고정) */
  seedFn?: () => number;
}

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
  /** 진행 중(또는 유예 중)인 원정 */
  expedition: Expedition | null = null;
  private expeditionDisposeAt = 0;
  private lastTimerAt = 0;
  private readonly expeditions: ExpeditionRegistry;
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
    this.seedFn = opts.seedFn ?? (() => randomInt(1, 2 ** 31 - 1));
    const gen = generateVillage(registry, info.seed);
    this.world = gen.world;
    this.spawn = gen.spawn;
    this.fluids = new FluidSim(this.world, registry);
    this.fluids.onBlockSet = (x, y, z) => this.batch.push({ x, y, z, id: registry.get(this.world.getBlock(x, y, z)).id });
    this.load();
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
    return { idx: p.idx, nick: p.nick, color: p.color, x: p.pos.x, y: p.pos.y, z: p.pos.z, yaw: p.pos.yaw, pitch: p.pos.pitch };
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
    const player: RoomPlayer = { idx, token, nick, color, pos, send, kick, recent: [], world: 'village' };
    const others = this.playersIn('village').map((p) => this.toInfo(p));
    this.players.set(idx, player);
    const me = this.toInfo(player);
    this.broadcastJson({ t: 'playerJoined', player: me }, idx, 'village');
    this.savePlayer(player);
    this.log(`마을 ${this.info.code}: ${nick}(#${idx}) 입장, ${this.players.size}명`);
    return { idx, spawn: me, players: others, expedition: this.expeditionState() };
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
      this.expedition.settle(idx, true, 0); // 나가면 모은 것은 버려진다 (M3)
      this.endIfEmpty(Date.now());
      this.broadcastJson({ t: 'expeditionState', expedition: this.expeditionState() }, -1, 'village');
    }
    // 마을 저장 위치는 항상 마을 좌표 (원정 중에 나갔으면 광장)
    if (p.world === 'expedition') p.pos = { x: this.spawn.x, y: this.spawn.y, z: this.spawn.z, yaw: this.spawn.yaw, pitch: 0, flags: FLAG_GROUND };
    this.savePlayer(p);
    this.broadcastJson({ t: 'playerLeft', idx }, -1, p.world);
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
    if (def.num === AIR_ID) {
      // 부수기: 자연 원천과 고인 액체(얕은 웅덩이 포함)는 양동이처럼 떠낼 수 있고, 자연 흐름은 못 건드린다(원천을 없애면 마른다). hardness 없는 블록(기반암)은 못 부순다
      if (cur.num === AIR_ID) return REJECT.INVALID;
      if (cur.fluid) return cur.fluidLevel === 0 || cur.fluidVolume > 0 ? null : REJECT.INVALID;
      if (cur.hardness === null) return REJECT.UNBREAKABLE;
      return null;
    }
    // 놓기: 액체는 플레이어가 놓는 고인 액체 8/8 만(자연 원천·흐름은 못 놓는다), 그 외 내부 블록 불가, 자리는 공기·액체만, 누가 서 있으면 안 됨
    if (def.fluid ? def.fluidVolume !== FLUID_FULL : def.internal) return REJECT.INVALID;
    if (cur.solid) return REJECT.OCCUPIED;
    if (def.solid) for (const other of this.playersIn(p.world)) if (bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, y, z)) return REJECT.OCCUPIED;
    return null;
  }

  onBlockChange(idx: number, req: BlockChangeReqMsg, now = Date.now()): void {
    const p = this.players.get(idx);
    if (!p) return;
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
    if (p.world === 'expedition' && this.expedition) {
      this.expedition.markModified(req.x, req.y, req.z);
      this.expedition.fluids.touch(req.x, req.y, req.z);
      if (num === AIR_ID) this.expedition.onBroken(idx, prev, req.x, req.y, req.z);
    } else {
      this.markDirtyBlock(req.x, req.y, req.z);
      this.fluids.touch(req.x, req.y, req.z);
    }
    this.broadcast(encodeBlockChanged({ x: req.x, y: req.y, z: req.z, id: req.id, by: idx }), -1, p.world);
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
    const items = e.settle(idx, late, keepRatio);
    this.storage?.addItems(this.info.code, items);
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
    this.savePlayer(p, now);
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
    for (const p of this.players.values()) if (p.world === 'village') this.savePlayer(p, now);
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
    });
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
