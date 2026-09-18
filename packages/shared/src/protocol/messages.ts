/**
 * 클라이언트–서버 메시지 (M2 범위). PROTOCOL.md 의 초안을 구현한 것.
 *
 * - 게임 메시지는 바이너리: 첫 바이트 = 종류, 이하 리틀 엔디언.
 * - 로비 메시지는 JSON 텍스트.
 * - 블록은 숫자 번호가 아니라 **문자열 id** 로 보낸다 (결정 #39 — 아들이 blocks.json 순서를 바꿔도 안전).
 * - 청크는 diff 목록 대신 `serialize.ts` 의 청크 blob 통째로 (저장 형식과 같다, 결정 #60).
 */
import { ByteReader, ByteWriter } from './bytes';

export const PROTOCOL_VERSION = 1;

/** 바이너리 메시지 종류 (첫 바이트) */
export const MSG = {
  /** C→S 20Hz */
  PlayerMove: 0x01,
  /** S→C 20Hz */
  PlayersState: 0x02,
  /** C→S 블록 놓기·부수기 요청 */
  BlockChangeReq: 0x10,
  /** S→C 확정된 블록 변경 (누가) */
  BlockChanged: 0x11,
  /** S→C 요청 거절 → 클라는 되돌린다 */
  BlockChangeRejected: 0x12,
  /** S→C 서버가 바꾼 블록 묶음 (액체 흐름 등) */
  BlockBatch: 0x13,
  /** S→C 입장 시 저장된 청크 (blob) */
  ChunkData: 0x20,
  Ping: 0x7f,
  Pong: 0x7e,
} as const;

/** 플레이어 상태 플래그 */
export const FLAG_SNEAK = 1;
export const FLAG_SPRINT = 2;
export const FLAG_GROUND = 4;
export const FLAG_WATER = 8;

/** 서버(액체 흐름 등)가 바꾼 블록의 byIdx */
export const BY_SERVER = 255;

/** BlockChangeRejected.reason */
export const REJECT = {
  TOO_FAR: 0,
  PROTECTED: 1,
  RATE: 2,
  TOOL: 3,
  ENDED: 4,
  NO_PERMISSION: 5,
  INVALID: 6,
  OCCUPIED: 7,
  UNBREAKABLE: 8,
} as const;
/** 초5가 읽을 거절 이유 */
export const REJECT_KO: readonly string[] = [
  '너무 멀어요',
  '보호된 곳이에요',
  '너무 빨라요. 조금만 천천히',
  '더 좋은 도구가 필요해요',
  '원정이 끝났어요',
  '권한이 없어요',
  '놓을 수 없는 블록이에요',
  '누가 서 있어요',
  '부술 수 없는 블록이에요',
];

export interface PlayerMoveMsg {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  flags: number;
}
export interface PlayerStateEntry extends PlayerMoveMsg {
  idx: number;
}
export interface BlockChangeReqMsg {
  seq: number;
  x: number;
  y: number;
  z: number;
  /** 블록 문자열 id. 'air' = 부수기 */
  id: string;
}
export interface BlockChangedMsg {
  x: number;
  y: number;
  z: number;
  id: string;
  /** 바꾼 플레이어 번호. BY_SERVER 면 서버 */
  by: number;
}
export interface BlockBatchMsg {
  blocks: { x: number; y: number; z: number; id: string }[];
}
export interface BlockChangeRejectedMsg {
  seq: number;
  reason: number;
}
export interface ChunkDataMsg {
  cx: number;
  cy: number;
  cz: number;
  /** encodeChunk 결과 */
  bytes: Uint8Array;
}
export interface PingMsg {
  clientMs: number;
}

// ---------------------------------------------------------------- 인코딩

export function encodePlayerMove(m: PlayerMoveMsg): Uint8Array {
  return new ByteWriter(24).u8(MSG.PlayerMove).f32(m.x).f32(m.y).f32(m.z).f32(m.yaw).f32(m.pitch).u8(m.flags).finish();
}
export function encodePlayersState(list: readonly PlayerStateEntry[]): Uint8Array {
  const w = new ByteWriter(2 + list.length * 22).u8(MSG.PlayersState).u8(list.length);
  for (const p of list) w.u8(p.idx).f32(p.x).f32(p.y).f32(p.z).f32(p.yaw).f32(p.pitch).u8(p.flags);
  return w.finish();
}
export function encodeBlockChangeReq(m: BlockChangeReqMsg): Uint8Array {
  return new ByteWriter(32).u8(MSG.BlockChangeReq).u16(m.seq).i32(m.x).i32(m.y).i32(m.z).str(m.id).finish();
}
export function encodeBlockChanged(m: BlockChangedMsg): Uint8Array {
  return new ByteWriter(32).u8(MSG.BlockChanged).i32(m.x).i32(m.y).i32(m.z).str(m.id).u8(m.by).finish();
}
export function encodeBlockBatch(m: BlockBatchMsg): Uint8Array {
  if (m.blocks.length > 0xffff) throw new RangeError('한 묶음에 블록이 너무 많아요');
  const w = new ByteWriter(3 + m.blocks.length * 20).u8(MSG.BlockBatch).u16(m.blocks.length);
  for (const b of m.blocks) w.i32(b.x).i32(b.y).i32(b.z).str(b.id);
  return w.finish();
}
export function encodeBlockChangeRejected(m: BlockChangeRejectedMsg): Uint8Array {
  return new ByteWriter(4).u8(MSG.BlockChangeRejected).u16(m.seq).u8(m.reason).finish();
}
export function encodeChunkData(m: ChunkDataMsg): Uint8Array {
  return new ByteWriter(17 + m.bytes.length).u8(MSG.ChunkData).i32(m.cx).i32(m.cy).i32(m.cz).bytes(m.bytes).finish();
}
export function encodePing(m: PingMsg): Uint8Array {
  return new ByteWriter(5).u8(MSG.Ping).u32(m.clientMs).finish();
}
export function encodePong(m: PingMsg): Uint8Array {
  return new ByteWriter(5).u8(MSG.Pong).u32(m.clientMs).finish();
}

// ---------------------------------------------------------------- 디코딩

export type ClientBinary =
  | { type: typeof MSG.PlayerMove; msg: PlayerMoveMsg }
  | { type: typeof MSG.BlockChangeReq; msg: BlockChangeReqMsg }
  | { type: typeof MSG.Ping; msg: PingMsg };

export type ServerBinary =
  | { type: typeof MSG.PlayersState; msg: PlayerStateEntry[] }
  | { type: typeof MSG.BlockChanged; msg: BlockChangedMsg }
  | { type: typeof MSG.BlockChangeRejected; msg: BlockChangeRejectedMsg }
  | { type: typeof MSG.BlockBatch; msg: BlockBatchMsg }
  | { type: typeof MSG.ChunkData; msg: ChunkDataMsg }
  | { type: typeof MSG.Pong; msg: PingMsg };

/** 서버가 받은 바이너리. 모르는 종류면 null */
export function decodeClientBinary(bytes: Uint8Array): ClientBinary | null {
  if (bytes.length === 0) return null;
  const r = new ByteReader(bytes);
  const type = r.u8();
  switch (type) {
    case MSG.PlayerMove:
      return { type, msg: { x: r.f32(), y: r.f32(), z: r.f32(), yaw: r.f32(), pitch: r.f32(), flags: r.u8() } };
    case MSG.BlockChangeReq:
      return { type, msg: { seq: r.u16(), x: r.i32(), y: r.i32(), z: r.i32(), id: r.str() } };
    case MSG.Ping:
      return { type, msg: { clientMs: r.u32() } };
    default:
      return null;
  }
}

/** 클라가 받은 바이너리. 모르는 종류면 null */
export function decodeServerBinary(bytes: Uint8Array): ServerBinary | null {
  if (bytes.length === 0) return null;
  const r = new ByteReader(bytes);
  const type = r.u8();
  switch (type) {
    case MSG.PlayersState: {
      const n = r.u8();
      const list: PlayerStateEntry[] = [];
      for (let i = 0; i < n; i++) list.push({ idx: r.u8(), x: r.f32(), y: r.f32(), z: r.f32(), yaw: r.f32(), pitch: r.f32(), flags: r.u8() });
      return { type, msg: list };
    }
    case MSG.BlockChanged:
      return { type, msg: { x: r.i32(), y: r.i32(), z: r.i32(), id: r.str(), by: r.u8() } };
    case MSG.BlockChangeRejected:
      return { type, msg: { seq: r.u16(), reason: r.u8() } };
    case MSG.BlockBatch: {
      const n = r.u16();
      const blocks: BlockBatchMsg['blocks'] = [];
      for (let i = 0; i < n; i++) blocks.push({ x: r.i32(), y: r.i32(), z: r.i32(), id: r.str() });
      return { type, msg: { blocks } };
    }
    case MSG.ChunkData:
      return { type, msg: { cx: r.i32(), cy: r.i32(), cz: r.i32(), bytes: r.bytes() } };
    case MSG.Pong:
      return { type, msg: { clientMs: r.u32() } };
    default:
      return null;
  }
}

// ---------------------------------------------------------------- JSON (로비)

export interface PlayerInfo {
  idx: number;
  nick: string;
  color: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}
export interface VillageInfo {
  code: string;
  name: string;
  seed: number;
  genVersion: number;
}

export type ClientJson =
  | { t: 'hello'; token: string | null; protocol: number }
  | { t: 'join'; nick: string; color: number; code: string }
  | { t: 'create'; nick: string; color: number; name: string };

export type ServerJson =
  | { t: 'hello'; token: string; protocol: number }
  | { t: 'welcome'; playerIdx: number; village: VillageInfo; spawn: PlayerInfo; players: PlayerInfo[]; chunkCount: number }
  /** 저장된 청크를 다 보냈다 — 이제 놀 수 있다 */
  | { t: 'ready' }
  | { t: 'playerJoined'; player: PlayerInfo }
  | { t: 'playerLeft'; idx: number }
  | { t: 'error'; code: string; message: string };

/** 닉네임 정리: 앞뒤 공백 제거, 제어문자 제거, 1~8글자. 비어 있으면 null */
export function sanitizeNick(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = Array.from(raw.replace(/\p{Cc}/gu, '').trim()).slice(0, 8).join('');
  return s.length > 0 ? s : null;
}

/** 마을 코드: 숫자 6자리 */
export const VILLAGE_CODE_RE = /^\d{6}$/;
/** 플레이어 색 번호 0..15 (양털 16색) */
export const PLAYER_COLOR_COUNT = 16;
/** 마을 최대 인원 (DESIGN 6절) */
export const MAX_PLAYERS = 6;
