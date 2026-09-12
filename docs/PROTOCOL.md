# 클라이언트–서버 프로토콜 (초안)

WebSocket. 게임 메시지는 **바이너리**(첫 1바이트 = 타입, 이하 페이로드, little-endian). 로비·가족 기능은 **JSON 텍스트 프레임**(타입 0x00 접두 없이 문자열로 시작하면 JSON으로 처리).

인코더/디코더는 `packages/shared/protocol`에 두고 클라·서버가 같은 코드를 쓴다. 모든 메시지에 vitest 라운드트립 테스트.

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
{ "t": "guestJoin", "nick": "…", "color": 3, "villageCode": "482913" }
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
