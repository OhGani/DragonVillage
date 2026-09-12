# 기술 구조

## 패키지 구성 (pnpm workspaces)

```
packages/shared/    순수 TypeScript. DOM·Node API 의존 없음. 클라·서버 공용.
  chunk/            Chunk 자료구조, 팔레트, 직렬화(팔레트 + RLE)
  worldgen/         시드 PRNG, simplex 래퍼, 마을 터 생성기, 원정지 생성기 N종, 보물 구조물 배치
  physics/          AABB 스윕, Amanatides–Woo 레이캐스트
  protocol/         메시지 타입, 인코더/디코더, 상수
  rules/            data/*.json 로더 + 스키마 검증(zod), 원정 출발 조건, 시간 정산, 경험치 레벨 공식(xp.ts) 순수 함수
packages/client/    Vite + Three.js
  render/           ChunkMesh, DataArrayTexture 로더, 프러스텀 컬링, 청크 관리자
  workers/          mesher.worker.ts (greedy meshing + 조명 flood fill)
  input/            touch.ts, keyboard.ts, gamepad.ts → 공통 InputState
  net/              WebSocket 클라이언트, 낙관적 적용·롤백, 보간
  ui/               로비, HUD, 가방, 도감, 정산, 가족(아이 화면)
  pwa/              manifest, service worker
packages/server/    Node 20+
  ws/               연결·세션·마을 룸
  world/            마을 인스턴스, 원정 인스턴스(임시), 블록 변경 검증
  expedition/       타이머, 낮밤, 귀환·정산
  family/           계정, 할 일, 시간 차감 틱, 주간 정산 크론, 웹 푸시
  db/               better-sqlite3 스키마·마이그레이션·백업
  http/             정적 파일(클라 빌드), /family 페이지, REST(로그인·할 일)
data/               게임 데이터 JSON (아들 편집 영역)
textures/           16×16 PNG (아들 편집 영역) → 빌드 시 DataArrayTexture로 패킹
```

## 월드

- 청크 **16×16×16**, 4,096블록. 블록 ID `Uint16`. 청크별 팔레트(실제 등장 블록만 인덱싱).
- **마을** 128×128×128 = 8×8×8 청크. 영구. 서버 SQLite에 diff 저장.
- **원정지** 256×256×128 = 16×16×8 청크. 시드 + 원정 중 diff만 서버 메모리. 종료 시 폐기. 저장 안 함.
- 렌더 거리: PC 8청크, 폰 5청크. 프레임 저하 시 자동 축소.
- 두 월드는 동일 청크·메싱·물리 코드. 다른 것은 생성기와 수명.

## 지형 생성 (shared/worldgen)

- `simplex-noise` + 시드 PRNG(예: `alea` 또는 자체 xorshift). **`Math.random` 금지.** 클라·서버 결과가 비트 단위로 같아야 한다 → vitest에 스냅샷 테스트.
- 마을 터: 평평한 초원 + 강 하나 + 포탈 자리. 시드는 마을 생성 시 결정.
- 원정지 생성기(종류별 함수, 아들 답변 후 확정):
  - 초원 섬: 원형 마스크 × 높이맵, 나무, 동물
  - 사막: 저주파 사구, 선인장, 피라미드형 보물
  - 동굴: 3D 노이즈 임계값, 광맥 밀도 높음
  - 설원: 높이맵 + 얼음 호수
  - 네더(가칭): 용암 바다, 요새, 화염 재료 몹
  - 엔드(가칭): 최종 원정지, 드래곤의 숨결
- 각 생성기는 **보물 구조물**을 시드 기반으로 N개 배치(`expeditions.json`의 `treasures`).
- 낮→밤: 원정 경과 시간 → 스카이라이트 배율 하나로 표현.

## 메싱 (client/workers)

- **Greedy meshing**. 불투명 인접 면 제거. 청크당 머티리얼 1개, 드로우콜 1개.
- Web Worker N개(`hardwareConcurrency - 1`). 입력: 청크 + 이웃 6면 데이터. 출력: 정점 `ArrayBuffer`(transfer). 메인 스레드는 `BufferGeometry`에 꽂기만.
- 재메싱: 변경 청크 + 경계면이면 이웃 청크. **프레임당 상한 2**, 플레이어 거리 우선 큐.
- 텍스처: `DataArrayTexture`(WebGL2), `NearestFilter`, 16×16 레이어. 아틀라스 밉맵 블리딩 회피.
- 정점 속성: position, uv, layer index, light(스카이·블록 니블), AO.

## 조명

- 스카이라이트·블록라이트 0–15, flood fill, 워커에서 계산. 청크당 2KB.
- 정점별 AO(인접 3블록 규칙). 체감 대비 구현비가 가장 싼 부분.

## 물리 (shared/physics)

- 플레이어 AABB 0.6×1.8×0.6. 축 분리 스윕, 겹치는 복셀만 검사. 물리 엔진 없음.
- 레이캐스트: Amanatides–Woo. 도달 거리 5블록. 서버도 같은 함수로 검증.
- 서버는 위치를 속도 상한으로만 검사(순간이동 방지). 클라 예측 + 20Hz 전송, 타 플레이어 100ms 보간.

## 서버

- 단일 Node 프로세스, `ws`. 마을 = 룸. 원정 = 룸 안의 임시 서브 월드.
- 블록 변경 흐름: 클라 요청 → 검증(거리, 보호 구역, 초당 상한, 도구 티어) → 적용 → 브로드캐스트 → 로그.
- 정산·자원·도감·드래곤 획득·시간 차감은 서버만 계산.
- 시간 차감 틱: 1분마다 접속 중인 아이 프로필 `used_min += 1`. 5분 무입력 시 자동 로그아웃.
- 주간 정산: 월요일 00:00 Asia/Seoul 크론(프로세스 내 스케줄러 + 시작 시 미처리 주 보정).
- pm2 재시작, 메시지 크기·빈도 상한, 마을 코드 IP당 분당 시도 제한.

## 저장 (SQLite, better-sqlite3)

```sql
villages(code PK, name, seed, level, created_at)
chunk_diffs(village, cx, cy, cz, blob, PK(village,cx,cy,cz))   -- 팔레트+RLE
storage(village, item, count)
codex(village, entry, found_at)
players(token PK, village, nick, color, cosmetics, xp_total INTEGER DEFAULT 0, family_child NULL, family_parent NULL)  -- 레벨은 xp_total에서 파생
xp_orbs(id PK, world_kind, world_id, x, y, z, amount, expires_at)                              -- 죽음 드롭, 원정 종료 시 정리
player_dragons(token, dragon_id, obtained_at)                  -- 드래곤은 개인 소유
player_inventory(token, item, count)

-- 가족 연결 (FAMILY-SYSTEM.md)
families(id PK, created_at)
parents(id PK, family, email UNIQUE, pw_hash, player_token)
children(id PK, family, nick, pin_hash, player_token)
todos(id PK, child, title, repeat_rule, needs_approval, active)
todo_logs(todo, date, status, checked_at, approved_by, approved_at, PK(todo,date))
time_rules(child, weekday, base_min, blocked_ranges_json, PK(child,weekday))
time_ledger(child, date, base, bonus_cap, bonus_earned, used_min, manual_adj, reason, PK(child,date))
weekly_settlements(child, week_start, rate, bonus_cap, PK(child,week_start))
block_log(ts, village, token, x, y, z, from_id, to_id)          -- 동기화 디버깅용, 주기 정리
```

- 마을 하나 보통 수백 KB. 변경 시 30초마다, 원정 정산 시, 마지막 플레이어 퇴장 시 flush.
- 백업: 하루 1회 파일 복사(`sqlite3 .backup`).

## 클라이언트 UI

- 로비: 링크 → (게스트) 닉네임·색 → 마을 코드 / (가족) PIN 로그인 → 할 일 카드 → 마을.
- HUD: 십자선, 슬롯 바, 원정 타이머(상단 중앙), 남은 게임 시간(아이만), 채팅 이모지 바, 부모 승인 카드(부모만).
- 가방·도감·정산·건설 메뉴: 폰 세로/가로 모두. 큰 터치 타깃(≥44px).
- 브라우저 함정: `touch-action: none`, `100dvh`, 전체화면 API, 가로 모드 안내, 더블탭 확대 방지.

## 성능 목표

- PC 60fps / 중급 폰 30fps 이상, 원정지 렌더 거리 5청크 기준.
- 청크 메싱 1개 < 4ms(워커), 초기 원정지 진입 < 3초(폰).
- 위치 패킷 ~24B × 6명 × 20Hz ≈ 3KB/s.
