/**
 * 연결 하나. hello(토큰) → join/create(로비) → 룸 안.
 * JSON(텍스트)은 로비, 바이너리는 게임 메시지 (PROTOCOL.md).
 */
import {
  type ClientJson,
  MSG,
  PLAYER_COLOR_COUNT,
  PROTOCOL_VERSION,
  type ServerJson,
  VILLAGE_CODE_RE,
  decodeClientBinary,
  encodePong,
  sanitizeNick,
} from '@dragon-village/shared';
import { randomBytes } from 'node:crypto';
import type { WebSocket } from 'ws';
import type { RoomManager } from './rooms';
import type { VillageRoom } from './village';

const TOKEN_RE = /^[a-f0-9]{32}$/;
/** 제작·양조 거절 이유 */
const CRAFT_ERROR_KO: Record<string, string> = {
  BAD_RECIPE: '그런 레시피는 없어요',
  NOT_YET: '대장간은 아직 준비 중이에요',
  NO_STATION: '제작대(화로·양조기) 가까이에서 만들 수 있어요',
  MISSING: '재료가 모자라요',
  BAD_BOTTLES: '병 칸에는 물병이나 물약을 한 개씩 놓아요',
  NO_INGREDIENT: '재료 칸이 비었어요',
  NO_EFFECT: '그 재료로는 아무것도 안 돼요',
  NO_FUEL: '블레이즈 가루가 있어야 양조기가 돌아가요',
};
/** 원정 시작 거절 이유 (초5가 읽을 말) */
const START_ERROR_KO: Record<string, string> = {
  ALREADY_OUT: '이미 원정 중이에요',
  OTHER_EXPEDITION: '다른 원정이 진행 중이에요. 끝나면 출발할 수 있어요',
  ENDING: '원정이 끝나는 중이에요. 잠깐 뒤에 다시',
  BAD_EXPEDITION: '그런 원정지는 없어요',
  NOT_YET: '이 원정지는 아직 준비 중이에요',
};
/** 잘못된 마을 코드 시도: 연결당 이 횟수를 넘으면 끊는다 */
const MAX_BAD_CODES = 5;

export class Session {
  token: string | null = null;
  room: VillageRoom | null = null;
  idx = -1;
  private badCodes = 0;
  private closed = false;

  constructor(
    private readonly ws: WebSocket,
    private readonly rooms: RoomManager,
    private readonly log: (msg: string) => void,
    readonly remote: string,
  ) {
    ws.on('message', (data, isBinary) => this.onMessage(data as Buffer | Buffer[], isBinary));
    ws.on('close', () => this.onClose());
    ws.on('error', () => this.onClose());
  }

  readonly send = (data: Uint8Array | string): void => {
    if (this.ws.readyState !== this.ws.OPEN) return;
    this.ws.send(data, { binary: typeof data !== 'string' });
  };

  private sendJson(obj: ServerJson): void {
    this.send(JSON.stringify(obj));
  }

  private error(code: string, message: string, close = false): void {
    this.sendJson({ t: 'error', code, message });
    if (close) this.ws.close(4000, code);
  }

  private onMessage(data: Buffer | Buffer[], isBinary: boolean): void {
    try {
      if (isBinary) {
        const buf = Array.isArray(data) ? Buffer.concat(data) : data;
        this.onBinary(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
      } else {
        const text = Array.isArray(data) ? Buffer.concat(data).toString('utf8') : data.toString('utf8');
        if (text.length > 4096) return this.error('TOO_BIG', '메시지가 너무 커요', true);
        this.onJson(JSON.parse(text) as ClientJson);
      }
    } catch (e) {
      this.log(`세션 ${this.remote}: 메시지 처리 오류 ${(e as Error).message}`);
      this.error('BAD_MESSAGE', '알 수 없는 메시지예요', true);
    }
  }

  private onJson(msg: ClientJson): void {
    switch (msg.t) {
      case 'hello': {
        if (msg.protocol !== PROTOCOL_VERSION) return this.error('VERSION', '게임 버전이 달라요. 새로고침해 주세요.', true);
        this.token = typeof msg.token === 'string' && TOKEN_RE.test(msg.token) ? msg.token : randomBytes(16).toString('hex');
        this.sendJson({ t: 'hello', token: this.token, protocol: PROTOCOL_VERSION });
        return;
      }
      case 'join':
      case 'create': {
        if (!this.token) return this.error('NO_HELLO', '먼저 인사(hello)를 해야 해요', true);
        if (this.room) return this.error('ALREADY_IN', '이미 마을에 있어요');
        const nick = sanitizeNick(msg.nick);
        if (!nick) return this.error('BAD_NICK', '이름을 1~8글자로 적어 주세요');
        const color = Number.isInteger(msg.color) && msg.color >= 0 && msg.color < PLAYER_COLOR_COUNT ? msg.color : 0;
        let room: VillageRoom | null;
        if (msg.t === 'join') {
          if (typeof msg.code !== 'string' || !VILLAGE_CODE_RE.test(msg.code)) return this.error('BAD_CODE', '마을 코드는 숫자 6자리예요');
          room = this.rooms.get(msg.code);
          if (!room) {
            this.badCodes++;
            return this.error('BAD_CODE', '그런 마을이 없어요. 코드를 다시 확인해 주세요.', this.badCodes >= MAX_BAD_CODES);
          }
        } else {
          const name = sanitizeNick(msg.name) ?? `${nick}의 마을`;
          room = this.rooms.create(name);
        }
        const result = room.join(this.token, nick, color, this.send, (why) => {
          // 룸이 나를 내보냈다 (같은 계정이 다른 곳에서 들어옴 등): 룸 참조를 끊고 연결을 닫는다
          this.room = null;
          this.idx = -1;
          this.sendJson({ t: 'error', code: 'KICKED', message: why });
          this.ws.close(4001, 'KICKED');
        });
        if (!result) return this.error('VILLAGE_FULL', '마을이 꽉 찼어요 (6명까지)');
        this.room = room;
        this.idx = result.idx;
        this.sendJson({ t: 'welcome', playerIdx: result.idx, village: room.info, spawn: result.spawn, players: result.players, chunkCount: room.modifiedCount, expedition: result.expedition, inventory: result.inventory });
        room.sendModifiedChunks(this.send);
        this.sendJson({ t: 'ready' });
        return;
      }
      case 'startExpedition': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.expedition !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.startExpedition(this.idx, msg.expedition);
        if (err) return this.error(err, START_ERROR_KO[err] ?? '지금은 출발할 수 없어요');
        return;
      }
      case 'craft': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.recipe !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.craft(this.idx, msg.recipe);
        if (err) return this.error(err, CRAFT_ERROR_KO[err] ?? '지금은 만들 수 없어요');
        return;
      }
      case 'brew': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Array.isArray(msg.bottles) || !msg.bottles.every((b) => Number.isInteger(b)) || !Number.isInteger(msg.ingredient)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.brew(this.idx, msg.bottles, msg.ingredient);
        if (err) return this.error(err, CRAFT_ERROR_KO[err] ?? '지금은 양조할 수 없어요');
        return;
      }
      case 'returnHome': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        const err = this.room.returnHome(this.idx);
        if (err) return this.error(err, err === 'NOT_IN_PORTAL' ? '포탈 안에 서야 돌아갈 수 있어요' : '지금은 돌아갈 수 없어요');
        return;
      }
      default:
        return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
    }
  }

  private onBinary(bytes: Uint8Array): void {
    const d = decodeClientBinary(bytes);
    if (!d) return;
    if (d.type === MSG.Ping) {
      this.send(encodePong(d.msg));
      return;
    }
    if (!this.room) return;
    if (d.type === MSG.PlayerMove) this.room.onMove(this.idx, d.msg);
    else if (d.type === MSG.BlockChangeReq) this.room.onBlockChange(this.idx, d.msg);
    else if (d.type === MSG.InvMove) this.room.onInvMove(this.idx, d.msg);
    else if (d.type === MSG.InvDrop) this.room.onInvDrop(this.idx, d.msg);
    else if (d.type === MSG.Emote) this.room.onEmote(this.idx, d.msg.kind, d.msg.id);
  }

  private onClose(): void {
    if (this.closed) return;
    this.closed = true;
    if (this.room) {
      const room = this.room;
      const idx = this.idx;
      this.room = null;
      this.idx = -1;
      room.leave(idx);
    }
  }
}
