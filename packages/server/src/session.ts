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
import { EXPEDITIONS, FAMILY_RULES } from '@dragon-village/shared/data';
import { randomBytes } from 'node:crypto';
import type { WebSocket } from 'ws';
import { PIN_RE, type AccountService } from './accounts';
import type { FamilyService } from './family';
import type { RoomManager } from './rooms';
import type { VillageRoom } from './village';

const TOKEN_RE = /^[a-f0-9]{32}$/;
/** 가족 연결 거절 이유 */
const LINK_ERROR_KO: Record<string, string> = {
  NO_FAMILY: '그 가족 코드는 없어요. 부모 화면의 6자리를 다시 봐 주세요',
  ALREADY_LINKED: '이미 다른 가족에 연결돼 있어요',
  IS_PARENT: '이 이름은 부모로 연결돼 있어요. 아이는 자기 이름으로 들어가서 연결해요',
};
/** 둥지·부화 거절 이유 (M6-2) */
const NEST_ERROR_KO: Record<string, string> = {
  NOT_AT_NEST: '둥지 안에 서서 해요 (광장 남쪽 길 끝)',
  NO_EGG: '그 알이 가방에 없어요',
  BAD_SLOT: '그런 자리는 없어요',
  SLOT_TAKEN: '그 자리엔 이미 알이 있어요',
  NO_DRAGON: '그건 내 드래곤이 아니에요',
  NOT_BABY: '이미 어른이에요',
  NOT_FOOD: '그건 이 드래곤 먹이가 아니에요 (만들 때 쓴 재료를 줘요)',
  NO_ITEM: '그 먹이가 가방에 없어요',
  NOT_ADULT: '아기는 아직 못 타요 — 어른이 되면 탈 수 있어요',
  NO_SADDLE: '안장이 있어야 탈 수 있어요 (제작대: 가죽 5 + 철 2. 가죽은 원정 보물 상자에서)',
  TOO_FAR: '드래곤 가까이 가서 타요',
  ALREADY_RIDING: '이미 타고 있어요',
  NOT_RIDING: '타고 있지 않아요',
  UNKNOWN_SKILL: '그런 스킬은 없어요',
  NOT_AT_STORAGE: '창고 건물 옆에서 해요 (광장 동쪽)',
  UNKNOWN_BUILDING: '그런 건물은 없어요',
  NO_SITE: '그 건물은 아직 지을 자리가 없어요 (다음 단계)',
  ALREADY_BUILT: '이미 지어졌어요',
  NEED_LEVEL: '마을 레벨이 더 필요해요',
  NEED_BUILDING: '먼저 지어야 하는 건물이 있어요',
  NOT_ENOUGH: '창고에 재료가 모자라요',
  COOLDOWN: '아직 식지 않았어요 — 잠깐 뒤에',
  NO_STAMINA: '기력이 모자라요 — 조금 쉬면 차요',
  NO_CHEST: '거기엔 상자가 없어요',
  NO_STORAGE: '이 서버는 드래곤을 저장할 수 없어요',
};
/** 할 일 체크 거절 이유 (M5-3) */
const TODO_ERROR_KO: Record<string, string> = {
  NOT_CHILD: '가족에 연결된 아이만 할 일을 체크해요',
  NO_TODO: '그 할 일이 없어요',
  NOT_TODAY: '오늘 할 일이 아니에요',
  ALREADY: '이미 체크했어요',
};
/** 이어하기 거절 이유 */
const RESUME_ERROR_KO: Record<string, string> = {
  NO_SUCH_NICK: '그 이름은 없어요',
  NO_PIN: '그 이름은 아직 PIN 이 없어서 이어할 수 없어요. 처음 쓴 기기에서 PIN 을 정해 주세요',
  BAD_PIN: 'PIN 이 틀렸어요',
  PIN_LOCKED: '여러 번 틀려서 잠겼어요. 10분 뒤에 다시',
};
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
  nick: string | null = null;
  room: VillageRoom | null = null;
  idx = -1;
  private badCodes = 0;
  private closed = false;
  /** 아이: 접속 중 1분마다 쓴 시간 누적 (M5-3) */
  private usageTimer: NodeJS.Timeout | null = null;
  private familyListener: ((m: ServerJson) => void) | null = null;
  /** 마지막으로 뭔가 한 시각 (움직임·블록·가방·채팅). 5분 무입력 자동 로그아웃용 (M5-4) */
  private lastActive = Date.now();
  private lastMove: { x: number; y: number; z: number; yaw: number } | null = null;
  private ending = false;

  constructor(
    private readonly ws: WebSocket,
    private readonly rooms: RoomManager,
    private readonly log: (msg: string) => void,
    readonly remote: string,
    private readonly accounts: AccountService | null = null,
    private readonly family: FamilyService | null = null,
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
        // 이름은 서버 전체에서 하나 (#63): 다른 사람 것이면 PIN 으로 이어하거나 다른 이름을 써야 한다
        let needPin = false;
        if (this.accounts) {
          const claim = this.accounts.claim(this.token, nick);
          if (!claim.ok) return this.error('NICK_TAKEN', '이 이름은 이미 있어요. 네 것이면 PIN 을 넣어 이어하고, 아니면 다른 이름을 써 주세요');
          needPin = claim.needPin;
        }
        // 시간 제한 (M5-4, DV_ENFORCE_TIME=1 일 때만): 차단 시간대·오늘 게임 없음·시간 다 씀이면 들여보내지 않는다
        const block = this.family?.timeBlock(nick) ?? null;
        if (block) return this.error(block.reason === 'noPlay' ? 'NO_PLAY_TODAY' : block.reason === 'blocked' ? 'BLOCKED_HOURS' : 'TIME_UP', block.message, true);
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
        this.nick = nick;
        this.sendJson({
          t: 'welcome',
          playerIdx: result.idx,
          village: room.info,
          spawn: result.spawn,
          players: result.players,
          chunkCount: room.modifiedCount,
          expedition: result.expedition,
          inventory: result.inventory,
          xp: result.xp,
          dragons: result.dragons,
          nest: result.nest,
          nestDragons: result.nestDragons,
          gifts: result.gifts,
          storage: result.storage,
          village_state: result.village,
          needPin,
          family: this.family?.familyOfNick(nick) ?? null,
          today: this.family?.todayCard(nick) ?? null,
          parentOf: this.family?.parentFamilyOfNick(nick) ?? null,
          pending: (() => {
            const fid = this.family?.parentFamilyIdOfNick(nick) ?? null;
            return fid === null ? [] : this.family!.pendingItems(fid);
          })(),
        });
        room.sendModifiedChunks(this.send);
        this.sendJson({ t: 'ready' });
        if (this.family) {
          // 승인·카드 갱신을 실시간으로 받는다. 아이면 1분마다 쓴 시간을 누적한다 (제한은 M5-4 에서, 지금은 표시만)
          this.familyListener = (m) => {
            this.sendJson(m);
            if (m.t === 'timeUp') this.endByTime();
          };
          this.family.attach(nick, this.familyListener);
          if (this.family.todayCard(nick)) {
            this.lastActive = Date.now();
            this.usageTimer = setInterval(() => {
              if (!this.family || this.ending) return;
              const now = Date.now();
              const card = this.family.addUsage(nick, 60, now);
              if (card) this.sendJson({ t: 'today', card });
              // 제한이 켜져 있으면: 시간 다 씀·차단 진입·오늘 게임 없음 → 내보낸다. 5분 무입력도
              const block = this.family.timeBlock(nick, now);
              if (block) {
                this.sendJson({ t: 'timeUp', reason: block.reason, message: block.message });
                this.endByTime();
              } else if (this.family.enforceTime && now - this.lastActive >= FAMILY_RULES.idleLogoutMinutes * 60_000) {
                this.sendJson({ t: 'timeUp', reason: 'idle', message: this.family.timeUpText('idle', nick, now) });
                this.endByTime();
              }
            }, 60_000);
          }
        }
        return;
      }
      case 'startExpedition': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.expedition !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        // 시간 제한 (M5-4): 아이는 남은 시간·차단까지 남은 분이 원정 길이 + 여유보다 커야 출발 — 시간은 항상 마을에서 끝난다
        if (this.family && this.nick) {
          const def = EXPEDITIONS.find(msg.expedition);
          const check = this.family.expeditionCheck(this.nick, def?.durationSec ?? 600);
          if (!check.ok) return this.error('NOT_ENOUGH_TIME', check.message);
        }
        const err = this.room.startExpedition(this.idx, msg.expedition);
        if (err) return this.error(err, START_ERROR_KO[err] ?? '지금은 출발할 수 없어요');
        return;
      }
      case 'setPin': {
        if (!this.token || !this.accounts) return this.error('NO_HELLO', '먼저 마을에 들어가야 해요');
        if (typeof msg.pin !== 'string' || !PIN_RE.test(msg.pin)) return this.error('BAD_PIN', 'PIN 은 숫자 4자리예요');
        if (!this.accounts.setPin(this.token, msg.pin)) return this.error('NO_ACCOUNT', '먼저 이름으로 마을에 들어가야 해요');
        this.sendJson({ t: 'pinSet' });
        return;
      }
      case 'resume': {
        if (!this.token) return this.error('NO_HELLO', '먼저 인사(hello)를 해야 해요', true);
        if (this.room) return this.error('ALREADY_IN', '이미 마을에 있어요');
        if (!this.accounts) return this.error('NO_ACCOUNT', '이 서버는 이어하기를 지원하지 않아요');
        const nick = sanitizeNick(msg.nick);
        if (!nick || typeof msg.pin !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const r = this.accounts.resume(nick, msg.pin);
        if (!r.ok) return this.error(r.reason, RESUME_ERROR_KO[r.reason]);
        this.token = r.token;
        this.log(`세션 ${this.remote}: '${nick}' 이어하기 성공`);
        this.sendJson({ t: 'resumed', token: r.token });
        return;
      }
      case 'linkFamily': {
        if (!this.room || !this.nick) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!this.family) return this.error('NO_FAMILY_SERVICE', '이 서버는 가족 연결을 지원하지 않아요');
        if (typeof msg.code !== 'string' || typeof msg.pin !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const r = this.family.linkChild(msg.code, this.nick, msg.pin);
        if (!r.ok) return this.error(r.reason, LINK_ERROR_KO[r.reason] ?? RESUME_ERROR_KO[r.reason] ?? '연결할 수 없어요');
        this.log(`세션 ${this.remote}: '${this.nick}' 가족 ${r.familyCode} 연결`);
        this.sendJson({ t: 'familyLinked', code: r.familyCode });
        return;
      }
      case 'checkTodo': {
        if (!this.room || !this.nick) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!this.family || !Number.isInteger(msg.id)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const r = this.family.checkTodo(this.nick, msg.id);
        if (!r.ok) return this.error(r.reason, TODO_ERROR_KO[r.reason] ?? '지금은 체크할 수 없어요');
        this.sendJson({ t: 'today', card: r.card });
        return;
      }
      case 'approveTodo': {
        if (!this.room || !this.nick) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!this.family || !Number.isInteger(msg.id) || typeof msg.date !== 'string' || typeof msg.ok !== 'boolean') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const fam = this.family.parentFamilyIdOfNick(this.nick);
        if (fam === null) return this.error('NOT_PARENT', '부모로 연결된 플레이어만 승인할 수 있어요');
        if (!this.family.decideTodo(fam, msg.id, msg.date, msg.ok)) return this.error('NO_TODO', '그 할 일을 찾을 수 없어요');
        this.log(`세션 ${this.remote}: '${this.nick}' 할 일 ${msg.id} ${msg.ok ? '승인' : '거절'}`);
        return;
      }
      case 'placeEgg': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.slot) || typeof msg.item !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.placeEgg(this.idx, msg.slot, msg.item);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 놓을 수 없어요');
        return;
      }
      case 'hatch': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.id)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.hatch(this.idx, msg.id);
        if (err?.startsWith('NEED_LEVEL:')) {
          const [, need, have] = err.split(':');
          return this.error('NEED_LEVEL', `레벨 ${need}이 있어야 부화해요 (지금 레벨 ${have}). 원정에서 광석을 캐고 보물을 열면 올라요`);
        }
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 부화할 수 없어요');
        this.log(`세션 ${this.remote}: '${this.nick}' 부화`);
        return;
      }
      case 'openChest': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.x) || !Number.isInteger(msg.y) || !Number.isInteger(msg.z)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.openChest(this.idx, msg.x, msg.y, msg.z);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 열 수 없어요');
        return;
      }
      case 'chestMove': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.x) || !Number.isInteger(msg.y) || !Number.isInteger(msg.z) || !Number.isInteger(msg.from) || !Number.isInteger(msg.to) || !Number.isInteger(msg.count)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.chestMove(this.idx, msg.x, msg.y, msg.z, msg.from, msg.to, msg.count);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 옮길 수 없어요');
        return;
      }
      case 'ride': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.id)) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.ride(this.idx, msg.id);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 탈 수 없어요');
        return;
      }
      case 'dismount': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        const err = this.room.dismount(this.idx);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 내릴 수 없어요');
        return;
      }
      case 'openStorage': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        const err = this.room.openStorage(this.idx);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 열 수 없어요');
        return;
      }
      case 'storageMove': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.item !== 'string' || !Number.isInteger(msg.count) || (msg.dir !== 'in' && msg.dir !== 'out')) return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.storageMove(this.idx, msg.item, msg.count, msg.dir);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 옮길 수 없어요');
        return;
      }
      case 'build': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.id !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.build(this.idx, msg.id);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 지을 수 없어요');
        this.log(`세션 ${this.remote}: '${this.nick}' 건물 ${msg.id}`);
        return;
      }
      case 'skill': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (typeof msg.id !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.skill(this.idx, msg.id);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 쏠 수 없어요');
        return;
      }
      case 'feed': {
        if (!this.room) return this.error('NOT_IN_VILLAGE', '먼저 마을에 들어가야 해요');
        if (!Number.isInteger(msg.id) || typeof msg.item !== 'string') return this.error('BAD_MESSAGE', '알 수 없는 메시지예요');
        const err = this.room.feed(this.idx, msg.id, msg.item);
        if (err) return this.error(err, NEST_ERROR_KO[err] ?? '지금은 먹일 수 없어요');
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
    if (this.ending) return; // 오늘은 여기까지 — 확인 누를 때까지 화면만 남고 더 못 논다
    // 활동 감지 (5분 무입력 자동 로그아웃): 자리만 지키는 PlayerMove 는 활동이 아니다
    if (d.type === MSG.PlayerMove) {
      const m = d.msg;
      const lm = this.lastMove;
      if (!lm || Math.abs(lm.x - m.x) > 0.01 || Math.abs(lm.y - m.y) > 0.01 || Math.abs(lm.z - m.z) > 0.01 || Math.abs(lm.yaw - m.yaw) > 0.01) this.lastActive = Date.now();
      this.lastMove = { x: m.x, y: m.y, z: m.z, yaw: m.yaw };
    } else this.lastActive = Date.now();
    if (d.type === MSG.PlayerMove) this.room.onMove(this.idx, d.msg);
    else if (d.type === MSG.BlockChangeReq) this.room.onBlockChange(this.idx, d.msg);
    else if (d.type === MSG.InvMove) this.room.onInvMove(this.idx, d.msg);
    else if (d.type === MSG.InvDrop) this.room.onInvDrop(this.idx, d.msg);
    else if (d.type === MSG.Emote) this.room.onEmote(this.idx, d.msg.kind, d.msg.id);
  }

/** timeUp 뒤 클라가 "확인"을 안 눌러도 이만큼 지나면 서버가 닫는다 */
  private static readonly TIME_UP_GRACE_MS = 60_000;

  /**
   * 오늘은 여기까지: timeUp 을 보내면 클라는 안내 창을 띄우고 "확인"을 누르면 스스로 나간다(아빠 2026-09-20: 갑자기 튕기지 않게).
   * 그동안 게임 메시지는 무시하고(더 못 논다), 확인을 안 누르면 60초 뒤 서버가 닫는다
   */
  private endByTime(): void {
    if (this.ending) return;
    this.ending = true;
    if (this.usageTimer) clearInterval(this.usageTimer);
    this.usageTimer = null;
    setTimeout(() => this.ws.close(4002, 'TIME_UP'), Session.TIME_UP_GRACE_MS);
  }

  private onClose(): void {
    if (this.closed) return;
    this.closed = true;
    if (this.usageTimer) clearInterval(this.usageTimer);
    this.usageTimer = null;
    if (this.family && this.nick && this.familyListener) this.family.detach(this.nick, this.familyListener);
    this.familyListener = null;
    if (this.room) {
      const room = this.room;
      const idx = this.idx;
      this.room = null;
      this.idx = -1;
      room.leave(idx);
    }
  }
}
