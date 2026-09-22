/**
 * 서버 연결 (WebSocket). PROTOCOL.md / shared/protocol.
 *
 * 순서: connect() → hello(토큰) → join()/create() → welcome → ChunkData… → ready (join 이 여기서 resolve)
 * 그 뒤 attach(events) 로 게임이 메시지를 받는다. attach 전에 온 게임 메시지는 잠시 모아 두고 넘겨준다.
 */
import {
  type ApprovalItem,
  type DragonInfo,
  type GiftNotice,
  type NestDragonInfo,
  type NestSlotInfo,
  type RidingInfo,
  type TodayCard,
  type XpGainedMsg,
  type XpStateMsg,
  type BlockBatchMsg,
  type BlockChangeReqMsg,
  type BlockChangeRejectedMsg,
  type BlockChangedMsg,
  type ChunkDataMsg,
  type ClientJson,
  type ExpeditionEnterInfo,
  type ExpeditionResultItem,
  type ExpeditionStateInfo,
  type ExpeditionTimerMsg,
  type EmoteMsg,
  type InvSlotsMsg,
  type Inventory,
  MSG,
  encodeEmote,
  encodeInvDrop,
  encodeInvMove,
  PROTOCOL_VERSION,
  type PlayerInfo,
  type PlayerMoveMsg,
  type PlayerStateEntry,
  type ServerBinary,
  type ServerJson,
  type VillageInfo,
  decodeServerBinary,
  encodeBlockChangeReq,
  encodePing,
  encodePlayerMove,
} from '@dragon-village/shared';

const TOKEN_KEY = 'dv.token';
const PING_MS = 5000;

export interface Welcome {
  playerIdx: number;
  village: VillageInfo;
  spawn: PlayerInfo;
  players: PlayerInfo[];
  /** welcome 과 ready 사이에 받은 저장 청크 */
  chunks: ChunkDataMsg[];
  /** 진행 중인 원정 (마을 포탈 카드용) */
  expedition: ExpeditionStateInfo | null;
  /** 가방 37칸 (M4) */
  inventory: Inventory;
  /** 이 이름에 PIN 이 없다 → 정하기 창 (M5) */
  needPin: boolean;
  /** 연결된 가족 코드 (아이). 없으면 null */
  family: string | null;
  /** 아이의 오늘 카드 (M5-3). 아이가 아니면 null */
  today: TodayCard | null;
  /** 부모로 연결된 가족 코드 (게임 안 승인 카드). 아니면 null */
  parentOf: string | null;
  /** 부모 플레이어: 지금 승인 기다리는 것들 */
  pending: ApprovalItem[];
  /** 내 경험치 총량 (M6-1) */
  xp: number;
  /** 내 드래곤 (M6-2) */
  dragons: DragonInfo[];
  /** 둥지 자리 (모두) */
  nest: NestSlotInfo[];
  /** 둥지의 드래곤 (모두, M6-3) */
  nestDragons: NestDragonInfo[];
  /** 이번에 받은 선물 (#79) */
  gifts: GiftNotice[];
}

/** 세계 전환 (worldEnter … ChunkData … ready 를 하나로 모은 것) */
export interface WorldEnter {
  kind: 'village' | 'expedition';
  expedition: ExpeditionEnterInfo | null;
  spawn: PlayerInfo;
  players: PlayerInfo[];
  chunks: ChunkDataMsg[];
}

export interface ExpeditionResult {
  expedition: string;
  name: string;
  items: ExpeditionResultItem[];
  late: boolean;
  keepRatio: number;
  elapsedSec: number;
}

export interface NetEvents {
  onChunk(m: ChunkDataMsg): void;
  onBlockChanged(m: BlockChangedMsg): void;
  onBlockBatch(m: BlockBatchMsg): void;
  onRejected(m: BlockChangeRejectedMsg): void;
  onPlayers(list: PlayerStateEntry[]): void;
  onPlayerJoined(p: PlayerInfo): void;
  onPlayerLeft(idx: number): void;
  /** 서버가 보낸 오류 (연결은 살아 있을 수도) */
  onError(code: string, message: string): void;
  onClose(reason: string): void;
  /** 세계 전환 (M3): 마을 ↔ 원정 */
  onWorldEnter(w: WorldEnter): void;
  onExpeditionResult(r: ExpeditionResult): void;
  onExpeditionState(s: ExpeditionStateInfo | null): void;
  onTimer(m: ExpeditionTimerMsg): void;
  /** 가방 칸 바뀜 (M4) */
  onInvSlots(m: InvSlotsMsg): void;
  onEmote(m: EmoteMsg): void;
  /** 오늘 카드 갱신 (M5-3, 아이) */
  onToday(card: TodayCard): void;
  /** 아이가 승인 필요한 할 일을 체크했다 (M5-3, 부모 플레이어) */
  onApprovalAsk(ask: ApprovalAsk): void;
  /** 승인 기다리는 목록이 바뀌었다 (부모 플레이어) */
  onPending(items: ApprovalItem[]): void;
  /** 오늘은 여기까지 (M5-4, 제한이 켜져 있을 때). 곧 연결이 닫힌다 */
  onTimeUp(reason: string, message: string): void;
  /** 경험치를 얻었다 (M6-1) */
  onXpGained(m: XpGainedMsg): void;
  /** 경험치 총량 정정 */
  onXpState(m: XpStateMsg): void;
  /** 내 드래곤 목록 (M6-2) */
  onDragons(list: DragonInfo[]): void;
  /** 둥지 자리·드래곤 (M6-2·3) */
  onNest(slots: NestSlotInfo[], dragons: NestDragonInfo[]): void;
  /** 상자 속 (#84) */
  onChest(x: number, y: number, z: number, slots: Inventory): void;
  /** 누가 드래곤을 탔다/내렸다 (M6-4, 나 포함) */
  onMount(idx: number, riding: RidingInfo): void;
  /** 누가 빔을 쐈다 (M6-5) */
  onBeam(m: { idx: number; dragon: string; color: string; power: number; from: { x: number; y: number; z: number }; dir: { x: number; y: number; z: number }; range: number }): void;
  /** 내 기력 (M6-5). readyAt·now 는 서버 시각 */
  onStamina(m: { value: number; max: number; readyAt: number; now: number }): void;
  onDismount(idx: number): void;
}

export type ApprovalAsk = ApprovalItem;

export class NetError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'NetError';
  }
}

/** 서버 주소: VITE_SERVER_URL(http[s]://host[:port]) 이 있으면 그것, 없으면 지금 페이지와 같은 곳 */
export function defaultServerUrl(): string {
  const env = (import.meta.env.VITE_SERVER_URL as string | undefined)?.trim();
  if (env) return env.replace(/^http/, 'ws').replace(/\/+$/, '') + '/ws';
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${location.host}/ws`;
}

export class NetClient {
  private ws: WebSocket | null = null;
  private events: NetEvents | null = null;
  private readonly backlog: ServerBinary[] = [];
  private readonly jsonBacklog: ServerJson[] = [];
  private pendingWelcome: Welcome | null = null;
  private pendingWorld: WorldEnter | null = null;
  private joinResolve: ((w: Welcome) => void) | null = null;
  private joinReject: ((e: Error) => void) | null = null;
  private resumeResolve: ((token: string) => void) | null = null;
  private pinResolve: (() => void) | null = null;
  private linkResolve: ((code: string) => void) | null = null;
  private helloResolve: (() => void) | null = null;
  private pingTimer: number | null = null;
  private pingSent = 0;
  /** 왕복 시간 ms (최근) */
  rtt = 0;
  token: string | null = null;
  closed = false;
  closeReason = '';
  /** 주소에 ?fresh 가 있으면 저장된 계정 대신 이 탭만의 새 계정 */
  private readonly freshTab = new URLSearchParams(location.search).has('fresh');

  constructor(readonly url: string = defaultServerUrl()) {}

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /** 연결하고 hello 까지 마친다 */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let ws: WebSocket;
      try {
        ws = new WebSocket(this.url);
      } catch (e) {
        reject(new NetError('BAD_URL', `서버 주소가 이상해요: ${(e as Error).message}`));
        return;
      }
      ws.binaryType = 'arraybuffer';
      this.ws = ws;
      let opened = false;
      ws.onopen = () => {
        opened = true;
        let token: string | null = null;
        try {
          // ?fresh 가 붙어 있으면 이 탭만의 새 계정으로 (한 브라우저에서 두 명을 시험할 때)
          token = this.freshTab ? sessionStorage.getItem(TOKEN_KEY) : localStorage.getItem(TOKEN_KEY);
        } catch {
          /* 저장 불가 브라우저 */
        }
        this.helloResolve = resolve;
        this.sendJson({ t: 'hello', token, protocol: PROTOCOL_VERSION });
      };
      ws.onerror = () => {
        if (!opened) reject(new NetError('CONNECT', '서버에 연결할 수 없어요'));
      };
      ws.onclose = (ev) => {
        this.closed = true;
        this.closeReason = ev.reason || (ev.code === 1006 ? '연결이 끊어졐어요' : `닫힘 (${ev.code})`);
        if (this.pingTimer) window.clearInterval(this.pingTimer);
        if (!opened) reject(new NetError('CONNECT', '서버에 연결할 수 없어요'));
        this.joinReject?.(new NetError('CLOSED', this.closeReason));
        this.joinReject = null;
        this.events?.onClose(this.closeReason);
      };
      ws.onmessage = (ev) => {
        if (typeof ev.data === 'string') this.onJson(JSON.parse(ev.data) as ServerJson);
        else this.onBinary(decodeServerBinary(new Uint8Array(ev.data as ArrayBuffer)));
      };
    });
  }

  join(nick: string, color: number, code: string): Promise<Welcome> {
    return this.enter({ t: 'join', nick, color, code });
  }
  create(nick: string, color: number, name: string): Promise<Welcome> {
    return this.enter({ t: 'create', nick, color, name });
  }

  /** 다른 기기에서 이어하기: 이름 + PIN → 그 계정 토큰을 받아 저장한다 (그 뒤 join 을 다시) */
  resume(nick: string, pin: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.resumeResolve = resolve;
      this.joinReject = reject;
      this.sendJson({ t: 'resume', nick, pin });
    });
  }
  /** 가족 연결: 부모 화면의 가족 코드 + 내 PIN (마을에 들어간 뒤) */
  linkFamily(code: string, pin: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.linkResolve = resolve;
      this.joinReject = reject;
      this.sendJson({ t: 'linkFamily', code, pin });
    });
  }
  /** PIN 정하기 (마을에 들어간 뒤) */
  setPin(pin: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pinResolve = resolve;
      this.joinReject = reject;
      this.sendJson({ t: 'setPin', pin });
    });
  }

  private enter(msg: ClientJson): Promise<Welcome> {
    return new Promise((resolve, reject) => {
      this.joinResolve = resolve;
      this.joinReject = reject;
      this.sendJson(msg);
    });
  }

  /** 게임이 준비되면 이벤트를 받기 시작한다. 그동안 모아 둔 메시지를 순서대로 넘긴다 */
  attach(events: NetEvents): void {
    this.events = events;
    for (const j of this.jsonBacklog) this.dispatchJson(j);
    this.jsonBacklog.length = 0;
    for (const b of this.backlog) this.dispatchBinary(b);
    this.backlog.length = 0;
    this.pingTimer = window.setInterval(() => {
      if (!this.connected) return;
      this.pingSent = performance.now();
      this.send(encodePing({ clientMs: Math.floor(this.pingSent) >>> 0 }));
    }, PING_MS);
  }

  sendMove(m: PlayerMoveMsg): void {
    this.send(encodePlayerMove(m));
  }
  sendBlockChange(m: BlockChangeReqMsg): void {
    this.send(encodeBlockChangeReq(m));
  }
  /** 마을 포탈에서: 원정 시작 또는 진행 중인 원정에 합류 */
  sendStartExpedition(expedition: string): void {
    this.sendJson({ t: 'startExpedition', expedition });
  }
  /** 원정 포탈 안에서: 마을로 (정산) */
  sendReturnHome(): void {
    this.sendJson({ t: 'returnHome' });
  }
  sendInvMove(from: number, to: number, count: number): void {
    this.send(encodeInvMove({ from, to, count }));
  }
  sendInvDrop(slot: number, count: number): void {
    this.send(encodeInvDrop({ slot, count }));
  }
  /** 둥지에 알 놓기 (M6-2) */
  sendPlaceEgg(slot: number, item: string): void {
    this.sendJson({ t: 'placeEgg', slot, item });
  }
  /** 알 부화 (M6-2) */
  sendHatch(id: number): void {
    this.sendJson({ t: 'hatch', id });
  }
  /** 먹이 주기 (M6-3) */
  sendFeed(id: number, item: string): void {
    this.sendJson({ t: 'feed', id, item });
  }
  /** 상자 열기 (#84) */
  sendOpenChest(x: number, y: number, z: number): void {
    this.sendJson({ t: 'openChest', x, y, z });
  }
  /** 상자 ↔ 가방 옮기기 (#84) */
  sendChestMove(x: number, y: number, z: number, from: number, to: number, count: number): void {
    this.sendJson({ t: 'chestMove', x, y, z, from, to, count });
  }
  /** 드래곤 타기 (M6-4) */
  sendRide(id: number): void {
    this.sendJson({ t: 'ride', id });
  }
  /** 타고 있는 드래곤의 스킬 (M6-5) */
  sendSkill(id: string): void {
    this.sendJson({ t: 'skill', id });
  }
  sendDismount(): void {
    this.sendJson({ t: 'dismount' });
  }
  /** 오늘 카드의 할 일 체크 (M5-3) */
  sendCheckTodo(id: number): void {
    this.sendJson({ t: 'checkTodo', id });
  }
  /** 게임 안 승인·거절 (M5-3, 부모 플레이어) */
  sendApproveTodo(id: number, date: string, ok: boolean): void {
    this.sendJson({ t: 'approveTodo', id, date, ok });
  }
  sendCraft(recipe: string): void {
    this.sendJson({ t: 'craft', recipe });
  }
  sendBrew(bottles: number[], ingredient: number): void {
    this.sendJson({ t: 'brew', bottles, ingredient });
  }
  sendEmote(kind: number, id: number): void {
    this.send(encodeEmote({ idx: 0, kind, id }));
  }

  private send(bytes: Uint8Array): void {
    if (this.connected) this.ws!.send(bytes);
  }
  private sendJson(obj: ClientJson): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj));
  }

  private onJson(msg: ServerJson): void {
    switch (msg.t) {
      case 'hello':
        this.token = msg.token;
        try {
          (this.freshTab ? sessionStorage : localStorage).setItem(TOKEN_KEY, msg.token);
        } catch {
          /* 무시 */
        }
        this.helloResolve?.();
        this.helloResolve = null;
        return;
      case 'welcome':
        this.pendingWelcome = {
          playerIdx: msg.playerIdx,
          village: msg.village,
          spawn: msg.spawn,
          players: msg.players,
          chunks: [],
          expedition: msg.expedition ?? null,
          inventory: (msg.inventory ?? new Array(37).fill(null)) as Inventory,
          needPin: msg.needPin === true,
          family: msg.family ?? null,
          today: msg.today ?? null,
          parentOf: msg.parentOf ?? null,
          pending: msg.pending ?? [],
          xp: msg.xp ?? 0,
          dragons: msg.dragons ?? [],
          nest: msg.nest ?? [],
          nestDragons: msg.nestDragons ?? [],
          gifts: msg.gifts ?? [],
        };
        return;
      case 'familyLinked':
        this.linkResolve?.(msg.code);
        this.linkResolve = null;
        this.joinReject = null;
        return;
      case 'resumed':
        this.token = msg.token;
        try {
          (this.freshTab ? sessionStorage : localStorage).setItem(TOKEN_KEY, msg.token);
        } catch {
          /* 무시 */
        }
        this.resumeResolve?.(msg.token);
        this.resumeResolve = null;
        this.joinReject = null;
        return;
      case 'pinSet':
        this.pinResolve?.();
        this.pinResolve = null;
        this.joinReject = null;
        return;
      case 'worldEnter':
        this.pendingWorld = { kind: msg.kind, expedition: msg.expedition, spawn: msg.spawn, players: msg.players, chunks: [] };
        return;
      case 'ready': {
        if (this.pendingWorld) {
          const w = this.pendingWorld;
          this.pendingWorld = null;
          if (this.events) this.events.onWorldEnter(w);
          else this.jsonBacklog.push({ t: 'worldEnter', kind: w.kind, expedition: w.expedition, spawn: w.spawn, players: w.players, chunkCount: w.chunks.length });
          return;
        }
        const w = this.pendingWelcome;
        this.pendingWelcome = null;
        if (w && this.joinResolve) this.joinResolve(w);
        this.joinResolve = null;
        this.joinReject = null;
        return;
      }
      case 'error':
        if (this.joinReject) {
          this.joinReject(new NetError(msg.code, msg.message));
          this.joinReject = null;
          this.joinResolve = null;
          return;
        }
        if (this.events) this.events.onError(msg.code, msg.message);
        else this.jsonBacklog.push(msg);
        return;
      default:
        if (this.events) this.dispatchJson(msg);
        else this.jsonBacklog.push(msg);
    }
  }

  private dispatchJson(msg: ServerJson): void {
    const ev = this.events!;
    if (msg.t === 'playerJoined') ev.onPlayerJoined(msg.player);
    else if (msg.t === 'playerLeft') ev.onPlayerLeft(msg.idx);
    else if (msg.t === 'error') ev.onError(msg.code, msg.message);
    else if (msg.t === 'expeditionResult') ev.onExpeditionResult({ expedition: msg.expedition, name: msg.name, items: msg.items, late: msg.late, keepRatio: msg.keepRatio, elapsedSec: msg.elapsedSec });
    else if (msg.t === 'expeditionState') ev.onExpeditionState(msg.expedition);
    else if (msg.t === 'today') ev.onToday(msg.card);
    else if (msg.t === 'approvalAsk') ev.onApprovalAsk({ id: msg.id, date: msg.date, child: msg.child, title: msg.title });
    else if (msg.t === 'pending') ev.onPending(msg.items);
    else if (msg.t === 'timeUp') ev.onTimeUp(msg.reason, msg.message);
    else if (msg.t === 'dragons') ev.onDragons(msg.list);
    else if (msg.t === 'nest') ev.onNest(msg.slots, msg.dragons ?? []);
    else if (msg.t === 'chest') ev.onChest(msg.x, msg.y, msg.z, msg.slots);
    else if (msg.t === 'mount') ev.onMount(msg.idx, msg.riding);
    else if (msg.t === 'beam') ev.onBeam(msg);
    else if (msg.t === 'stamina') ev.onStamina(msg);
    else if (msg.t === 'dismount') ev.onDismount(msg.idx);
    else if (msg.t === 'worldEnter') ev.onWorldEnter({ kind: msg.kind, expedition: msg.expedition, spawn: msg.spawn, players: msg.players, chunks: [] });
  }

  private onBinary(m: ServerBinary | null): void {
    if (!m) return;
    if (m.type === MSG.Pong) {
      this.rtt = Math.round(performance.now() - this.pingSent);
      return;
    }
    // welcome/worldEnter 와 ready 사이의 청크는 거기에 모아 둔다
    if (m.type === MSG.ChunkData && this.pendingWorld) {
      this.pendingWorld.chunks.push(m.msg);
      return;
    }
    if (m.type === MSG.ChunkData && this.pendingWelcome) {
      this.pendingWelcome.chunks.push(m.msg);
      return;
    }
    if (this.events) this.dispatchBinary(m);
    else this.backlog.push(m);
  }

  private dispatchBinary(m: ServerBinary): void {
    const ev = this.events!;
    switch (m.type) {
      case MSG.ChunkData:
        ev.onChunk(m.msg);
        break;
      case MSG.BlockChanged:
        ev.onBlockChanged(m.msg);
        break;
      case MSG.BlockBatch:
        ev.onBlockBatch(m.msg);
        break;
      case MSG.BlockChangeRejected:
        ev.onRejected(m.msg);
        break;
      case MSG.PlayersState:
        ev.onPlayers(m.msg);
        break;
      case MSG.ExpeditionTimer:
        ev.onTimer(m.msg);
        break;
      case MSG.InvSlots:
        ev.onInvSlots(m.msg);
        break;
      case MSG.Emote:
        ev.onEmote(m.msg);
        break;
      case MSG.XpGained:
        ev.onXpGained(m.msg);
        break;
      case MSG.XpState:
        ev.onXpState(m.msg);
        break;
    }
  }

  close(): void {
    if (this.pingTimer) window.clearInterval(this.pingTimer);
    this.ws?.close(1000, 'bye');
  }
}
