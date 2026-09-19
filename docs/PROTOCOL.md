# 클라이언트–서버 프로토콜

WebSocket. 게임 메시지는 **바이너리**(첫 1바이트 = 타입, 이하 페이로드, little-endian). 로비·가족 기능은 **JSON 텍스트 프레임**.

인코더/디코더는 `packages/shared/src/protocol`에 두고 클라·서버가 같은 코드를 쓴다. 모든 메시지에 vitest 라운드트립 테스트.

**구현 상태(2026-09-18, M2)**: `messages.ts` 에 M2 범위 구현 — PlayerMove·PlayersState·BlockChangeReq/Changed/Rejected·**BlockBatch(0x13, 서버 액체 흐름 묶음)**·ChunkData·Ping/Pong 과 JSON hello/join/create/welcome/ready/playerJoined/playerLeft/error. 아래 표와 다른 점: **블록은 숫자 대신 문자열 id**(결정 #39, `u8 len + UTF-8`), **ChunkData(0x20)는 diff 목록 대신 `serialize.ts` 청크 blob 통째**(결정 #60), yaw/pitch 는 f32. **M3(2026-09-19)**: 원정은 세계 전환·정산이 드물어 JSON 으로 — C→S `startExpedition{expedition}`·`returnHome`, S→C `worldEnter{kind, expedition{seed,startedAt,…}, spawn, players, chunkCount}` → ChunkData… → `ready`, `expeditionResult{items, late, keepRatio}`, `expeditionState`(마을 사람에게, welcome 에도 실림). 바이너리는 1Hz `ExpeditionTimer 0x30 (u16 elapsedSec, u16 durationSec, u8 phase 0낮/1저녁/2밤)` 만. 아래 표의 0x21·0x22·0x31·0x32 는 쓰지 않는다. **M4(2026-09-19)**: 가방 — welcome 에 `inventory`(37칸), S→C `InvSlots 0x14`(u8 n, 반복 u8 slot·str item·u8 count), C→S `InvMove 0x15`(u8 from,to,count)·`InvDrop 0x16`(u8 slot,count), JSON `craft{recipe}`·`brew{bottles[],ingredient}`. 채팅 `Emote 0x40`(u8 idx, u8 kind 0 이모지/1 문구, u8 id) 양방향. 거절 사유 9 `NO_ITEM`. **M5-1(2026-09-19)**: 계정 = 닉네임 + PIN(#63). C→S `setPin{pin}`(마을 안에서), `resume{nick,pin}`(hello 뒤·join 전) → S→C `resumed{token}`(클라가 토큰을 바꿔 저장하고 다시 join), welcome `needPin`. 오류 `NICK_TAKEN`·`BAD_PIN`·`NO_PIN`·`PIN_LOCKED`. **문(2026-09-19, #71)**: 놓기·열고 닫기·부수기 모두 기존 `BlockChangeReq` — 놓기는 `oak_door`(서버가 보는 방향 변형으로 바꿈) 또는 `oak_door@n`, 열고 닫기는 조준한 반쪽의 열림만 뒤집힌 변형 id(`oak_door@n^>`), 서버는 다른 반쪽도 바꿔 `BlockChanged` 두 개를 보낸다. **M5-2(2026-09-19)**: 가족 — C→S `linkFamily{code,pin}`(마을 안에서, 가족 코드 6자리 + 내 PIN) → S→C `familyLinked{code}`, welcome `family`(연결된 가족 코드 또는 null). 부모 쪽은 WebSocket 이 아니라 같은 포트의 HTTP `/family`(정적 HTML) + `/api/family/me|signup|login|logout|unlink`(JSON, 쿠키 `dv_parent` HttpOnly 30일). 오류 `NO_FAMILY`(코드 없음)·`BAD_PIN`·`PIN_LOCKED`. 경험치·할 일·시간 메시지(0x50~0x61)는 M5-3·M5-4·M6 에서.

## 바이너리 메시지

| 타입 | 이름 | 방향 | 페이로드 | 빈도 |
|---|---|---|---|---|
| 0x01 | PlayerMove | C→S | f32 x,y,z, i8 yaw, i8 pitch, u8 flags(점프·비행·탑승) | 20Hz |
| 0x02 | PlayersState | S→C | u8 count, 반복{ u8 playerIdx, f32 x,y,z, i8 yaw, i8 pitch, u8 flags } | 20Hz |
| 0x10 | BlockChangeReq | C→S | u16 seq, i32 x, i32 y, i32 z, u16 blockId | 이벤트 |
| 0x11 | BlockChanged | S→C | i32 x,y,z, u16 blockId, u8 byPlayerIdx | 이벤트 |
| 0x12 | BlockChangeRejected | S→C | u16 seq, u8 reason | 이벤트 |
| 0x20 | ChunkDiff | S→C | i32 cx,cy,cz, u16 n, 반복{ u16 localIdx, u16 blockId } | 입장·원정 진입 시 |
| 0x21 | WorldEnter | S→C | u8 worldKind(0 마을,1 원정), u32 seed, u8 expeditionTypeId, u32 endsAtServerMs | 전환 시 |
| 0x22 | WorldLeave | S→C | u8 reason | 전환 시 |
| 0x30 | ExpeditionTimer | S→C | u32 serverNowMs, u32 endsAtMs, u8 phase(낮/저녁/밤) | 1Hz |
| 0x31 | ExpeditionStartReq | C→S | u8 expeditionTypeId | 이벤트 |
| 0x32 | ExpeditionResult | S→C | JSON 길이 u16 + JSON(전리품, 도감 신규, 드래곤 획득) | 정산 시 |
| 0x40 | Emote | C→S / S→C | u8 playerIdx(S→C만), u8 phraseId | 이벤트 |
| 0x50 | TimeLeft | S→C | u16 remainingMin, u8 warnLevel | 1/분, 아이만 |
| 0x51 | ForceReturn | S→C | u8 reason(시간 종료/차단 시간대/부모 강제) | 이벤트 |
| 0x52 | XpGained | S→C | u16 amount, u8 sourceKind, f32 x,y,z (구슬 연출 시작 위치) | 이벤트 |
| 0x53 | XpState | S→C | u32 total, u8 level, f32 progress | 접속·정정 시 |
| 0x54 | HatchReq | C→S | u8 dragonId | 이벤트 |
| 0x55 | HatchResult | S→C | u8 dragonId, u8 ok, u8 reason(레벨 부족/재료 부족/둥지 가득) | 이벤트 |
| 0x56 | XpOrbSpawn / 0x57 XpOrbRemove | S→C | u32 orbId, f32 x,y,z, u16 amount / u32 orbId | 죽음·회수 |
| 0x60 | ApprovalPrompt | S→C | JSON(todoLogId, childNick, title) | 부모 HUD |
| 0x61 | ApprovalAnswer | C→S | u32 todoLogId, u8 approved | 부모 HUD |
| 0x7F | Ping/Pong | 양방향 | u32 clientMs | 5초 |

### BlockChangeRejected.reason
0 거리 초과 · 1 보호 구역 · 2 속도 상한 · 3 도구 티어 부족 · 4 원정 종료 · 5 권한 없음

### 낙관적 적용 규칙
클라는 `BlockChangeReq`를 보내며 즉시 로컬 적용하고 `seq`→원래 블록을 기억한다. `BlockChanged`(자기 것)로 확정, `BlockChangeRejected`로 롤백. 5초 내 응답 없으면 롤백 + "서버와 다시 맞추기" 안내.

## JSON 메시지 (로비·가족)

```jsonc
// C→S
{ "t": "hello", "token": "…", "clientVersion": "0.1.0" }
{ "t": "guestJoin", "nick": "…", "color": 3, "villageCode": "482913" }          // M2 구현: join. 이름이 이미 있으면 error NICK_TAKEN
{ "t": "setPin", "pin": "1234" }                                                // M5: 첫 입장 뒤 PIN 정하기 (#63)
{ "t": "resume", "nick": "…", "pin": "1234" }                                   // M5: 다른 기기에서 이어하기 → 서버가 그 플레이어의 토큰을 내려 준다
{ "t": "childLogin", "familyCode": "…", "pin": "1234" }
{ "t": "parentLogin", "email": "…", "password": "…" }
{ "t": "createVillage", "name": "…", "seed": 12345 }
{ "t": "todoCheck", "todoId": 7 }
{ "t": "resync" }                      // 전체 청크 diff 다시 받기

// S→C
{ "t": "welcome", "playerIdx": 2, "village": { "code": "…", "name": "…", "seed": 1, "level": 3 }, "players": [ … ], "role": "guest|child|parent" }
{ "t": "todayCard", "remainingMin": 20, "bonusCap": 10, "bonusEarned": 0, "todos": [ { "id": 7, "title": "수학 숙제", "status": "pending|checked|approved|rejected", "needsApproval": true } ], "blockedUntil": null }
{ "t": "error", "code": "BAD_CODE|BLOCKED_HOURS|NO_TIME|VILLAGE_FULL|…", "message": "16시에 열려요" }
{ "t": "villageMeta", "level": 4, "buildings": [ … ], "storage": { "cobblestone": 120 } }
{ "t": "codexUpdate", "entries": [ … ] }
{ "t": "dragonObtained", "dragonId": "fire", "by": "playerIdx" }
```

## 연결 수명

1. `hello`(토큰 없으면 서버가 발급 → `localStorage`) → 2. 역할별 로그인/입장 → 3. `welcome` + 마을 `ChunkDiff` 전체 → 4. 게임 루프.
재접속 시 같은 토큰 → 같은 플레이어·위치·가방·원정 상태 복원(원정 타이머 안이면).

## 부하 추산

- 위치: 24B × 20Hz × 6명 ≈ 2.9KB/s 다운.
- 마을 입장 diff: 활발한 마을도 수십 KB.
- 원정 입장: 시드만. 원정 중 변경분은 이벤트로 전달.
