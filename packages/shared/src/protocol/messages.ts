/**
 * 클라이언트–서버 메시지 (M2 범위). PROTOCOL.md 의 초안을 구현한 것.
 *
 * - 게임 메시지는 바이너리: 첫 바이트 = 종류, 이하 리틀 엔디언.
 * - 로비 메시지는 JSON 텍스트.
 * - 블록은 숫자 번호가 아니라 **문자열 id** 로 보낸다 (결정 #39 — 아들이 blocks.json 순서를 바꿔도 안전).
 * - 청크는 diff 목록 대신 `serialize.ts` 의 청크 blob 통째로 (저장 형식과 같다, 결정 #60).
 * - M3 원정: 세계 전환·정산은 드물어서 JSON(worldEnter·expeditionResult·expeditionState), 1Hz 타이머만 바이너리(ExpeditionTimer).
 */
import type { DragonInfo, NestDragonInfo, NestSlotInfo } from '../rules/dragons';
import type { TodayCard } from '../rules/family';
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
  /** S→C 가방 칸 바뀜 (M4) */
  InvSlots: 0x14,
  /** C→S 가방 칸 옮기기 */
  InvMove: 0x15,
  /** C→S 버리기 (사라짐) */
  InvDrop: 0x16,
  /** S→C 입장 시 저장된 청크 (blob) */
  ChunkData: 0x20,
  /** S→C 원정 중 1Hz: 경과·전체 초, 낮/저녁/밤 */
  ExpeditionTimer: 0x30,
  /** 양방향 채팅: 이모지·문구 번호만 (규칙 3). C→S 는 idx 무시 */
  Emote: 0x40,
  /** 경험치를 얻었다 (M6-1) S→C */
  XpGained: 0x52,
  /** 경험치 총량 정정 S→C */
  XpState: 0x53,
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
  /** 가방에 그 아이템(또는 양동이)이 없다 (M4) */
  NO_ITEM: 9,
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
  '가방에 그게 없어요',
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
  /** 손에 든 핫바 칸(0..9). 서버가 곡괭이 등급을 확인한다(곡괭이 규칙). 없으면 생략(255) */
  slot?: number;
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
/** 원정 시각 (1Hz). phase 0 낮, 1 저녁, 2 밤 (shared/rules/expeditions phaseAt) */
/** 경험치를 얻었다 (M6-1): 양·출처(XP_SOURCE)·자리(구슬 연출). 클라는 총량에 더한다 */
export interface XpGainedMsg {
  amount: number;
  source: number;
  x: number;
  y: number;
  z: number;
}
/** 경험치 총량 정정 (귀환 뒤 등) */
export interface XpStateMsg {
  total: number;
}
export function encodeXpGained(m: XpGainedMsg): Uint8Array {
  return new ByteWriter(16).u8(MSG.XpGained).u16(Math.min(65535, Math.max(0, Math.floor(m.amount)))).u8(m.source & 0xff).f32(m.x).f32(m.y).f32(m.z).finish();
}
export function encodeXpState(m: XpStateMsg): Uint8Array {
  return new ByteWriter(5).u8(MSG.XpState).u32(Math.max(0, Math.floor(m.total)) >>> 0).finish();
}

export interface ExpeditionTimerMsg {
  elapsedSec: number;
  durationSec: number;
  phase: number;
}
export const PHASE_NUM = { day: 0, evening: 1, night: 2 } as const;
/** 가방 칸 하나 (M4). count 0 = 빈 칸 */
export interface InvSlotEntry {
  slot: number;
  item: string;
  count: number;
}
export interface InvSlotsMsg {
  slots: InvSlotEntry[];
}
export interface InvMoveMsg {
  from: number;
  to: number;
  count: number;
}
export interface InvDropMsg {
  slot: number;
  count: number;
}
/** 채팅. kind 0 이모지(번호 = 파일 순서) / 1 문구(id). idx 는 서버가 채운다 */
export interface EmoteMsg {
  idx: number;
  kind: number;
  id: number;
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
  return new ByteWriter(32).u8(MSG.BlockChangeReq).u16(m.seq).i32(m.x).i32(m.y).i32(m.z).str(m.id).u8(m.slot ?? 255).finish();
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
export function encodeInvSlots(m: InvSlotsMsg): Uint8Array {
  const w = new ByteWriter(2 + m.slots.length * 20).u8(MSG.InvSlots).u8(m.slots.length);
  for (const e of m.slots) w.u8(e.slot).str(e.count > 0 ? e.item : '').u8(e.count);
  return w.finish();
}
export function encodeInvMove(m: InvMoveMsg): Uint8Array {
  return new ByteWriter(4).u8(MSG.InvMove).u8(m.from).u8(m.to).u8(m.count).finish();
}
export function encodeInvDrop(m: InvDropMsg): Uint8Array {
  return new ByteWriter(3).u8(MSG.InvDrop).u8(m.slot).u8(m.count).finish();
}
export function encodeEmote(m: EmoteMsg): Uint8Array {
  return new ByteWriter(4).u8(MSG.Emote).u8(m.idx).u8(m.kind).u8(m.id).finish();
}
export function encodeExpeditionTimer(m: ExpeditionTimerMsg): Uint8Array {
  return new ByteWriter(6).u8(MSG.ExpeditionTimer).u16(m.elapsedSec).u16(m.durationSec).u8(m.phase).finish();
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
  | { type: typeof MSG.InvMove; msg: InvMoveMsg }
  | { type: typeof MSG.InvDrop; msg: InvDropMsg }
  | { type: typeof MSG.Emote; msg: EmoteMsg }
  | { type: typeof MSG.Ping; msg: PingMsg };

export type ServerBinary =
  | { type: typeof MSG.PlayersState; msg: PlayerStateEntry[] }
  | { type: typeof MSG.BlockChanged; msg: BlockChangedMsg }
  | { type: typeof MSG.BlockChangeRejected; msg: BlockChangeRejectedMsg }
  | { type: typeof MSG.BlockBatch; msg: BlockBatchMsg }
  | { type: typeof MSG.ChunkData; msg: ChunkDataMsg }
  | { type: typeof MSG.ExpeditionTimer; msg: ExpeditionTimerMsg }
  | { type: typeof MSG.XpGained; msg: XpGainedMsg }
  | { type: typeof MSG.XpState; msg: XpStateMsg }
  | { type: typeof MSG.InvSlots; msg: InvSlotsMsg }
  | { type: typeof MSG.Emote; msg: EmoteMsg }
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
      return {
        type,
        msg: (() => {
          const m: BlockChangeReqMsg = { seq: r.u16(), x: r.i32(), y: r.i32(), z: r.i32(), id: r.str() };
          const slot = r.remaining > 0 ? r.u8() : 255;
          if (slot !== 255) m.slot = slot;
          return m;
        })(),
      };
    case MSG.InvMove:
      return { type, msg: { from: r.u8(), to: r.u8(), count: r.u8() } };
    case MSG.InvDrop:
      return { type, msg: { slot: r.u8(), count: r.u8() } };
    case MSG.Emote:
      return { type, msg: { idx: r.u8(), kind: r.u8(), id: r.u8() } };
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
    case MSG.ExpeditionTimer:
      return { type, msg: { elapsedSec: r.u16(), durationSec: r.u16(), phase: r.u8() } };
    case MSG.XpGained:
      return { type, msg: { amount: r.u16(), source: r.u8(), x: r.f32(), y: r.f32(), z: r.f32() } };
    case MSG.XpState:
      return { type, msg: { total: r.u32() } };
    case MSG.InvSlots: {
      const n = r.u8();
      const slots: InvSlotEntry[] = [];
      for (let i = 0; i < n; i++) slots.push({ slot: r.u8(), item: r.str(), count: r.u8() });
      return { type, msg: { slots } };
    }
    case MSG.Emote:
      return { type, msg: { idx: r.u8(), kind: r.u8(), id: r.u8() } };
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

/** 진행 중인 원정 요약 (마을에 있는 사람이 "따라가기" 카드를 보이려면) */
export interface ExpeditionStateInfo {
  id: string;
  name: string;
  players: number;
  remainingSec: number;
}
/** 원정 세계에 들어갈 때 — 클라는 시드로 같은 섬을 만든다 */
export interface ExpeditionEnterInfo {
  id: string;
  name: string;
  seed: number;
  genVersion: number;
  durationSec: number;
  nightStartsAt: number;
  /** 서버 시각 기준 시작·지금 (ms). 클라는 둘의 차로 경과를 맞춘다 */
  startedAt: number;
  serverNow: number;
  treasures: number;
}
export interface ExpeditionResultItem {
  id: string;
  count: number;
}

/** 승인 기다리는 할 일 하나 (부모 플레이어 화면) */
export interface ApprovalItem {
  id: number;
  date: string;
  child: string;
  title: string;
}

/** 승인 기다리는 할 일 하나 (부모 플레이어 화면) */
export interface ApprovalItem {
  id: number;
  date: string;
  child: string;
  title: string;
}

export type ClientJson =
  | { t: 'hello'; token: string | null; protocol: number }
  | { t: 'join'; nick: string; color: number; code: string }
  | { t: 'create'; nick: string; color: number; name: string }
  /** 마을 포탈에서: 원정 시작(또는 진행 중인 원정에 합류) */
  | { t: 'startExpedition'; expedition: string }
  /** 원정 포탈 안에서: 마을로 돌아가기 (정산) */
  | { t: 'returnHome' }
  /** 제작 (M4): 가방·제작대·화로 레시피 id */
  | { t: 'craft'; recipe: string }
  /** 양조 (M4): 병 칸 번호들(1~3) + 재료 칸 */
  | { t: 'brew'; bottles: number[]; ingredient: number }
  /** PIN 정하기·바꾸기 (M5, #63). 마을에 들어간 뒤 */
  | { t: 'setPin'; pin: string }
  /** 다른 기기에서 이어하기: 이름 + PIN → 그 계정 토큰 (hello 뒤, join 전) */
  | { t: 'resume'; nick: string; pin: string }
  /** 가족 연결 (M5-2): 부모 화면의 가족 코드 + 내 PIN. 마을에 들어간 뒤 */
  | { t: 'linkFamily'; code: string; pin: string }
  /** 오늘 카드의 할 일 체크 (M5-3, 아이) */
  | { t: 'checkTodo'; id: number }
  /** 게임 안 승인·거절 (M5-3, 부모 플레이어) */
  | { t: 'approveTodo'; id: number; date: string; ok: boolean }
  /** 둥지 자리에 알 놓기 (M6-2): 둥지 안에 서서, 가방의 알 아이템 */
  | { t: 'placeEgg'; slot: number; item: string }
  /** 알 부화 (M6-2): 내 알 행 id. 레벨을 낸다 */
  | { t: 'hatch'; id: number }
  /** 먹이 주기 (M6-3): 내 아기 드래곤에게 만들 때 쓴 재료 1개 */
  | { t: 'feed'; id: number; item: string };

export type ServerJson =
  | { t: 'hello'; token: string; protocol: number }
  | {
      t: 'welcome';
      playerIdx: number;
      village: VillageInfo;
      spawn: PlayerInfo;
      players: PlayerInfo[];
      chunkCount: number;
      expedition?: ExpeditionStateInfo | null;
      /** 가방 37칸 (M4). null = 빈 칸 */
      inventory?: ({ item: string; count: number } | null)[];
      /** 이 이름에 아직 PIN 이 없다 → 클라가 PIN 정하기 창을 띄운다 (M5) */
      needPin?: boolean;
      /** 연결된 가족 코드 (아이). 없으면 null */
      family?: string | null;
      /** 아이의 오늘 카드 (M5-3). 아이가 아니면 null */
      today?: TodayCard | null;
      /** 이 플레이어가 부모로 연결된 가족 코드 (게임 안 승인 카드를 받는다). 아니면 null */
      parentOf?: string | null;
      /** 부모 플레이어: 지금 승인 기다리는 것들 (M5-3) */
      pending?: ApprovalItem[];
      /** 내 경험치 총량 (M6-1). 레벨·바는 클라가 공식으로 계산 */
      xp?: number;
      /** 내 드래곤(알 포함) (M6-2) */
      dragons?: DragonInfo[];
      /** 둥지 자리 상태 (모두) */
      nest?: NestSlotInfo[];
      /** 둥지의 드래곤들 (모두, M6-3) */
      nestDragons?: NestDragonInfo[];
    }
  | { t: 'familyLinked'; code: string }
  /** 오늘 카드가 바뀌었다 (체크·승인·1분 경과·할 일 편집) */
  | { t: 'today'; card: TodayCard }
  /** 부모 플레이어에게: 아이가 승인 필요한 할 일을 체크했다 (바로 카드로) */
  | { t: 'approvalAsk'; id: number; date: string; child: string; title: string }
  /** 부모 플레이어에게: 승인 기다리는 목록이 바뀌었다 (체크·승인·거절·삭제) */
  | { t: 'pending'; items: ApprovalItem[] }
  /** 아이에게: 오늘은 여기까지 (시간 다 씀·차단 시간대·오늘 게임 없음·5분 무입력). 이어서 연결이 닫힌다 (M5-4, 제한이 켜져 있을 때만) */
  | { t: 'timeUp'; reason: 'noPlay' | 'blocked' | 'over' | 'idle'; message: string }
  /** 내 드래곤 목록이 바뀌었다 (알 놓기·부화) */
  | { t: 'dragons'; list: DragonInfo[] }
  /** 둥지 자리가 바뀌었다 (마을 사람 모두) */
  | { t: 'nest'; slots: NestSlotInfo[]; dragons: NestDragonInfo[] }
  /** resume 성공: 이 토큰을 저장하고 다시 join 하면 그 계정으로 들어간다 */
  | { t: 'resumed'; token: string }
  | { t: 'pinSet' }
  /** 저장된 청크를 다 보냈다 — 이제 놀 수 있다 (welcome·worldEnter 뒤 ChunkData 들 다음에) */
  | { t: 'ready' }
  /** 세계 전환: 마을 ↔ 원정. 이어서 그 세계의 바뀐 청크(ChunkData)와 ready 가 온다 */
  | { t: 'worldEnter'; kind: 'village' | 'expedition'; expedition: ExpeditionEnterInfo | null; spawn: PlayerInfo; players: PlayerInfo[]; chunkCount: number }
  /** 귀환 정산 (worldEnter village 직전) */
  | { t: 'expeditionResult'; expedition: string; name: string; items: ExpeditionResultItem[]; late: boolean; keepRatio: number; elapsedSec: number }
  /** 마을에 있는 사람들에게: 원정이 시작·변경·끝났다 */
  | { t: 'expeditionState'; expedition: ExpeditionStateInfo | null }
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
