/**
 * 마을 룸 — 서버가 진실인 세계 하나 (규칙 1).
 *
 * - 시드로 지형을 만들고 저장된 청크를 덮어쓴다 (클라와 같은 순서, 같은 공용 코드).
 * - 블록 변경은 검증(도달·속도·부술 수 있나·누가 서 있나) 뒤 적용하고 모두에게 알린다.
 * - 액체 시뮬레이션(shared/fluid)은 여기서만 돈다. 한 틱의 변경을 BlockBatch 로 묶어 보낸다.
 * - 20Hz 틱: 액체 → 묶음 전송 → 위치 브로드캐스트. 바뀐 청크는 30초마다·마지막 퇴장·종료 시 저장.
 */
import {
  AIR_ID,
  FLUID_FULL,
  BY_SERVER,
  type BlockChangeReqMsg,
  type BlockRegistry,
  type ChunkCoord,
  FLAG_GROUND,
  FluidSim,
  MAX_PLAYERS,
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
  encodePlayersState,
  generateVillage,
} from '@dragon-village/shared';
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
}

export interface JoinResult {
  idx: number;
  spawn: PlayerInfo;
  players: PlayerInfo[];
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
  /** 통계 */
  stats = { blockChanges: 0, rejected: 0, flushes: 0, chunksSaved: 0 };

  constructor(
    readonly info: VillageInfo,
    private readonly registry: BlockRegistry,
    private readonly storage: Storage | null,
    private readonly log: (msg: string) => void = () => {},
  ) {
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
    let unknown = new Set<string>();
    for (const r of rows) {
      if (!this.world.chunkInBounds(r.cx, r.cy, r.cz)) continue;
      const chunk = this.world.getOrCreateChunk(r.cx, r.cy, r.cz);
      const res = decodeChunk(r.blob, this.registry, chunk);
      for (const id of res.unknownIds) unknown.add(id);
      this.modified.set(chunkKey(r.cx, r.cy, r.cz), { cx: r.cx, cy: r.cy, cz: r.cz });
    }
    if (rows.length) this.log(`마을 ${this.info.code}: 저장 청크 ${rows.length}개 불러옴${unknown.size ? ` (모르는 블록 ${[...unknown].join(', ')} → 공기)` : ''}`);
    unknown = new Set();
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

  /**
   * 입장. 저장된 위치가 있으면 거기, 없으면 광장. 꽉 찼으면 null.
   * 같은 토큰이 이미 들어와 있으면(다른 탭·재접속) 예전 연결을 끊는다.
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
    const player: RoomPlayer = { idx, token, nick, color, pos, send, kick, recent: [] };
    const others = [...this.players.values()].map((p) => this.toInfo(p));
    this.players.set(idx, player);
    const me = this.toInfo(player);
    this.broadcastJson({ t: 'playerJoined', player: me }, idx);
    this.savePlayer(player);
    this.log(`마을 ${this.info.code}: ${nick}(#${idx}) 입장, ${this.players.size}명`);
    return { idx, spawn: me, players: others };
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
    this.savePlayer(p);
    this.broadcastJson({ t: 'playerLeft', idx });
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
    // 세계 밖으로는 못 나간다 (클라도 막지만 서버가 한 번 더)
    p.pos.x = Math.max(0, Math.min(this.world.sizeX, m.x));
    p.pos.y = Math.max(-32, Math.min(this.world.sizeY + 32, m.y));
    p.pos.z = Math.max(0, Math.min(this.world.sizeZ, m.z));
    p.pos.yaw = m.yaw;
    p.pos.pitch = m.pitch;
    p.pos.flags = m.flags & 0xff;
  }

  /** 검증만 (테스트용). 거절 사유 번호 또는 null */
  validate(p: RoomPlayer, req: BlockChangeReqMsg, now: number): number | null {
    const { x, y, z } = req;
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z) || !this.world.inBounds(x, y, z)) return REJECT.INVALID;
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
    const cur = this.registry.get(this.world.getBlock(x, y, z));
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
    if (def.solid) for (const other of this.players.values()) if (bodyOverlapsBlock(other.pos, PLAYER_SIZE, x, y, z)) return REJECT.OCCUPIED;
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
    const num = this.registry.numOf(req.id);
    const res = this.world.setBlock(req.x, req.y, req.z, num);
    if (!res.changed) {
      // 이미 그 블록이면 확정만 알려 준다 (클라 낙관 적용과 같은 값)
      p.send(encodeBlockChanged({ x: req.x, y: req.y, z: req.z, id: req.id, by: idx }));
      return;
    }
    this.stats.blockChanges++;
    this.markDirtyBlock(req.x, req.y, req.z);
    this.fluids.touch(req.x, req.y, req.z);
    this.broadcast(encodeBlockChanged({ x: req.x, y: req.y, z: req.z, id: req.id, by: idx }));
  }

  private markDirtyBlock(x: number, y: number, z: number): void {
    const c = { cx: x >> 4, cy: y >> 4, cz: z >> 4 };
    const key = chunkKey(c.cx, c.cy, c.cz);
    this.dirty.set(key, c);
    this.modified.set(key, c);
  }

  /** 20Hz 로 불러 준다 (더 드물게 불려도 dt 만큼 따라간다, 최대 4틱) */
  tick(now: number): void {
    if (this.lastTick === 0) this.lastTick = now;
    this.fluidAcc += Math.min(TICK_MS * 4, now - this.lastTick);
    this.lastTick = now;
    while (this.fluidAcc >= TICK_MS) {
      this.fluids.tick();
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
      for (let i = 0; i < blocks.length; i += 2000) this.broadcast(encodeBlockBatch({ blocks: blocks.slice(i, i + 2000) }));
    }
    if (this.players.size > 0) {
      const list: PlayerStateEntry[] = [];
      for (const p of this.players.values()) list.push({ idx: p.idx, ...p.pos });
      this.broadcast(encodePlayersState(list));
    }
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
    for (const p of this.players.values()) this.savePlayer(p, now);
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

  broadcast(bytes: Uint8Array, exceptIdx = -1): void {
    for (const p of this.players.values()) {
      if (p.idx === exceptIdx) continue;
      try {
        p.send(bytes);
      } catch {
        /* 끊긴 연결은 세션이 정리한다 */
      }
    }
  }

  broadcastJson(obj: unknown, exceptIdx = -1): void {
    const s = JSON.stringify(obj);
    for (const p of this.players.values()) {
      if (p.idx === exceptIdx) continue;
      try {
        p.send(s);
      } catch {
        /* 끊긴 연결은 세션이 정리한다 */
      }
    }
  }
}

export { BY_SERVER };
