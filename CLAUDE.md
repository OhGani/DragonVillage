# CLAUDE.md — 드래곤 크래프트 (Dragon Craft)

아빠(개발)와 초5 아들(기획)이 함께 만드는 **웹 기반 복셀 드래곤 수집 게임**. 게임 이름 **드래곤 크래프트**, 우리 마을 이름 **드래곤 빌리지** (아들, 2026-09-13). 저장소는 `OhGani/DragonVillage`.
마인크래프트 세계관을 배경으로, 15분짜리 원정에서 재료를 모아 드래곤을 얻고,
영구 마을을 친구들과 함께 키운다. 부모가 정한 게임 시간 규칙 안에서 돌아간다.

이 파일은 Claude Code가 이 저장소에서 작업할 때 항상 읽는 지침이다.
자세한 내용은 `docs/`에 있다. **설계 결정을 다시 열지 말고 `docs/DECISIONS.md`를 따른다.**

## 문서 지도

| 파일 | 내용 |
|---|---|
| `docs/DESIGN.md` | 게임 설계 전체 — 원칙, 구조, 범위, 성장, 조작 |
| `docs/ARCHITECTURE.md` | 기술 구조 — 청크, 메싱, 지형, 물리, 서버, 저장 |
| `docs/PROTOCOL.md` | 클라이언트–서버 WebSocket 프로토콜 |
| `docs/FAMILY-SYSTEM.md` | 부모·아이 계정, 할 일, 시간 규칙, 주간 정산 |
| `docs/XP-SYSTEM.md` | 마인크래프트식 경험치·레벨 — 획득, 부화 레벨 소모, 죽음 드롭 |
| `docs/BOSSES.md` | 보스 7군과 마을 방어전 — 아들 설계, 버전 배치 |
| `docs/CONTENT.md` | 세계 디테일 — 마을 풍경·광물·제작 사슬·원정지 디테일·탈것, 버전 배치 (아들 3차) |
| `docs/DRAGON-SKILLS.md` | 드래곤 고유 스킬 52개 — 12개 유형으로 환원, 빔 시스템, 아군 피해 없음 규칙 |
| `docs/ROADMAP.md` | M0–M9 마일스톤과 완료 기준, M0 작업 분해 |
| `docs/DECISIONS.md` | 확정된 결정과 이유 (ADR) |
| `docs/QUESTIONS-FOR-SON.md` | 아들에게 받아야 할 기획 답변 (미확정 항목) |
| `data/*.json` | 게임 데이터 — 아들이 직접 편집하는 파일들 |
| `models/` | 드래곤 복셀 모델 생성기 + JSON 3종 + 뷰어. 게임의 드래곤 엔티티 메시는 이 복셀을 그대로 쓴다 |

## 역할

- **아빠**: 개발 전부(클라이언트·서버·인프라), 25년 모바일/서비스 개발 경력, iOS·API·DB 전문. Three.js/브라우저 게임 루프는 새로 배우는 영역.
- **아들(초5)**: 기획·아트·QA. 코드는 안 쓴다. `data/*.json` 값 수정, 16×16 픽셀 텍스처, 드래곤·재료·원정지 설계, 채팅 문구, 플레이테스트.
- **Claude Code**: 아빠의 페어 프로그래머. 아들이 만질 파일은 항상 단순하고 편집 친화적으로 유지한다.

## 기술 스택 (확정 — 바꾸지 않는다)

- **언어**: TypeScript strict, 전 패키지 공통
- **클라이언트**: Vite + Three.js (WebGL2), Web Worker 메싱, PWA
- **서버**: Node.js 20+ + `ws` + `better-sqlite3`, 단일 프로세스, pm2
- **공유 코드**: `packages/shared` — 청크·지형 생성·프로토콜 타입·검증 로직을 클라·서버가 같이 쓴다
- **패키지 관리**: pnpm workspaces
- **테스트**: vitest (특히 지형 결정론, 메싱, 프로토콜 인코딩, 시간 정산)
- **노이즈**: `simplex-noise` + 시드 기반 PRNG (`Math.random` 금지)

```
packages/
  shared/   # world, chunk, worldgen, protocol, rules (순수 TS, DOM·Node API 의존 없음)
  client/   # Vite, Three.js, workers, UI
  server/   # ws, sqlite, family system, expedition/timer logic
data/       # 게임 데이터 JSON (아들 편집 영역) — 빌드 시 shared에서 로드
docs/
```

## 절대 규칙

1. **서버가 세계의 진실.** 블록·마을·자원·도감·시간 잔량의 원본은 서버. 클라는 낙관적 표시 후 서버 응답으로 정정.
2. **지형 생성은 결정론적.** 같은 시드 → 클라·서버 동일 결과. `Math.random`, `Date.now()` 사용 금지(지형·규칙 코드에서). 테스트로 강제.
3. **자유 입력 채팅 없음.** 이모지·정해진 문구만. 예외 없음.
4. **할 일 보상은 시간만.** 아이템·자원·드래곤·경험치를 할 일과 연결하는 코드는 쓰지 않는다.
5. **기본 시간은 서버 로직이 절대 깎지 않는다.** 부모의 수동 조정만 가능.
6. **친구는 계정 없이 코드로 입장.** 계정은 가족 연결 전용.
7. **아들이 편집하는 JSON은 단순하게.** 중첩 최소, 한국어 `name` 필드, 설명은 `_comment`. 스키마 검증 실패 시 친절한 한국어 에러.
8. **폰 우선.** 아들의 주 기기는 폰. 모든 UI·조작은 폰에서 먼저 확인. PC는 키보드+마우스 지원.
9. **마인크래프트 용어 사용 가능.** 가족·친구끼리만 쓰는 비공개 프로젝트다. 공개 배포는 계획에 없다.
10. **UI 문자열은 한국어.** 초5가 읽는다 — 짧고 쉬운 말.

## 작업 방식

- 마일스톤 단위로 진행. 현재: **M1 (월드의 뼈대)** — 1 저장·2 조명·3 마을 터 생성기 구현 완료(2026-09-13), 남은 것은 4단계 마무리(아들 플레이테스트: 집 짓기 → 폰 끄기 → 다음 날 켜기). `docs/ROADMAP.md` M1 분해 참고. M0 는 아들 폰 피드백으로 실질 통과(정식 5분 관찰과 fps 수치는 `PLAYTEST-LOG.md` 에 채우는 중).
- 각 마일스톤은 "아들이 손에 쥐고 해볼 수 있는 빌드"로 끝난다. 완료 기준을 만족하기 전에 다음으로 가지 않는다.
- 2주마다 플레이테스트. 아들의 피드백은 `docs/PLAYTEST-LOG.md`에 날짜별로 기록(파일 없으면 생성).
- 성능 목표: PC 60fps, 중급 폰(아이폰 12 / 갤럭시 A5x급) 30fps 이상. 청크 재메싱 프레임당 상한 2.
- 커밋은 작게. 메시지는 한국어 또는 영어 자유.
- 새 결정이 생기면 `docs/DECISIONS.md`에 한 줄 추가.

## 지금 상태 (2026-09-12)

- 설계 v0.4 완료. **M0 코드 구현 완료(2026-09-12)**: pnpm workspaces, `shared`(청크·월드·물리·액체 시뮬·blocks.json 검증), `client`(greedy meshing 워커, Three.js 렌더, 터치·키보드·게임패드 조작, HUD), `server` 빈 껍데기. 테스트 50개·벤치 1개.
- **배포·테스트 경로**: `main` 에 push → GitHub Actions 가 빌드해 `gh-pages` 로 배포 → https://ohgani.github.io/DragonVillage/ (2~3분). 아빠 개발 PC 가 IDC 에 있어 LAN 접속이 안 되므로 폰·PC 테스트는 이 주소로 한다. 로컬 `pnpm dev` 는 개발 중 확인용.
- 2026-09-13 피드백 반영: 한 칸 턱 자동 오르기(`tryStepUp`), 물·용암 흐름(`shared/fluid`, 마인크래프트 규칙, 결정 #47), 핫바 10칸(9 물·0 용암, 들고 있으면 양동이처럼 원천 떠냄), 시작 화면 '게임 방법' 창, 손 블록 화면 모서리 고정, 전체화면 켜기/끄기 토글 + 웹 앱 매니페스트(아이폰은 홈 화면 추가로 전체화면).
- M0 남은 것: 폰 실기기(아이폰·갤럭시) fps 측정, 아들 5분 플레이테스트 → `docs/PLAYTEST-LOG.md`. 아빠 피드백은 받는 대로 반영 중.
- 개발 콘솔에서 `window.__dv` 로 월드·플레이어·청크 상태를 볼 수 있다 (dev 빌드만). `__dv.tick(dt)` 는 rAF 없이 한 프레임을 돌린다(자동 테스트용).
- 아들 1차 기획 답변 반영 완료: 드래곤 16종·재료·티어(`data/dragons.json`), 원정지 6곳(`data/expeditions.json`), 레시피(`data/recipes.json`), 채팅 문구(`data/phrases.json`), 시간 규칙(`data/family-rules.json`). 상세는 `docs/QUESTIONS-FOR-SON.md`.
- 경험치 시스템 도입 확정(마인크래프트 방식, `docs/XP-SYSTEM.md`, `data/xp.json`).
- 보스·마을 방어전 설계 반영(`docs/BOSSES.md`, `data/bosses.json`). v1은 거미 왕·우민 방어전·엔더 드래곤만. `release` 필드가 v1이 아닌 것은 만들지 않는다.
- 아들 5차 답변(2026-09-13) 반영: 게임·마을 이름, 보스 드롭 전부(`bosses.json`), 네 왕은 한 번에·고대성 방 4개, 방어전 예고는 종·패배 시 철 골렘 잡혀감·주민 피해, 엔딩은 다른 차원 포탈, 드래곤 사망은 둥지 회복 확정, **시간 규칙 평일 20/주말 30**(원정 13분 충돌 해소, `family-rules.json`). 남은 질문은 `docs/QUESTIONS-FOR-SON.md` 맨 아래.
- 아들 6차 디테일(2026-09-13) 반영: **놓은 방향으로만 흐르는 물·용암(구현, 결정 #52)**, 철 골렘 규칙·피글린/요새·해피 가스트·주민 거래·인벤토리 화면 스펙(`CONTENT.md` 6차, `mobs.json`·`village.json`·`recipes.json station: inventory`). 버전 배치 결정 #53.
- 아들 7차 디테일(2026-09-13) 반영: **폰 스틱 왼쪽 아래 고정 + 좌우 회전 감도 ↑(구현, 결정 #54)**, 농사·동물·주민 규칙(`recipes.json` 설탕·황금 사과/당근, `mobs.json` breedWith/followsWhenHolding/horse, `village.json npcs.villager`, `blocks.json leaves.shearDrops`). `CONTENT.md` 7차, 결정 #55.
- **M1-1 저장 완료(2026-09-13)**: `shared/chunk/serialize`(문자열 팔레트+RLE), `client/save`(IndexedDB `dragoncraft`, 바뀐 청크만·위치 저장, 탭 닫힘 시 즉시). 지형 버전 `TEST_WORLD_GEN_VERSION` 이 바뀌면 저장 폐기. '처음 세계로 되돌리기'는 게임 방법 창. 결정 #56.
- **M1-2 조명 완료(2026-09-13)**: `shared/light/lightEngine`(스카이·블록 0~15 flood fill, 세계 전체 평면 배열, 증분 갱신 = 전체 재계산 테스트), 워커가 18³ 빛 조각에서 꼭짓점 빛을 뽑아 `meta.w` 로, 셰이더 밝기 곡선 + 따뜻한 블록라이트. `blocks.json` 에 `lightFilter` 추가(나뭇잎·얼음 1). 핫바 8번 발광석. 결정 #57.
- **M1-3 마을 터 생성기 완료(2026-09-13)**: `shared/worldgen/village.ts`(128³, 광장 40, 북쪽 포탈 자리·강, 동서 큰 밭, 남쪽 집 뼈대, 참나무 둘레·언덕, 땅속 광물·동굴). 하드코딩 테스트 월드 삭제, 저장 키 `village`/`VILLAGE_GEN_VERSION`(생성기를 고치면 올릴 것 — 지문 테스트가 알려 준다). `farmland` 블록. 나침반(결정 #58). 결정 #59.
- 아빠 결정 대기 → `docs/DESIGN.md` 10절 (이모지 13→12, 방어전 패배 시 주민 처리).
- 드래곤 고유 스킬 16종 전부 접수·반영(`docs/DRAGON-SKILLS.md`, `dragons.json` skills). v1은 기본 공격 + 빔 + signature 스킬 1개만.
- 아들 그림 3장(나무·대지·철) 접수 → `models/`에 복셀 모델 3종 생성. 나머지 13종은 같은 생성기에 파라미터만 추가.
- 아들 3차 '디테일' 반영(`docs/CONTENT.md`, `data/village.json`, blocks·recipes·expeditions 확장). v1에 추가된 것은 블록·레시피·동물·장식만. 인챈트·탈것·거래·구조물 생성기는 v1.1/v2.
- 아들 4차 디테일 반영(`CONTENT.md` 하단, `data/mobs.json` 신규 — 몹 보상표·오징어·폐광 스포너·염료·방패·수레/보트).
- 이름 확정(2026-09-13): 게임 **드래곤 크래프트(Dragon Craft)**, 마을 **드래곤 빌리지**. 패키지 스코프 `@dragon-village/*` 와 로컬 폴더명 `dragon-village` 는 그대로 둔다(바꿀 이유 없음).
