# 드래곤 크래프트 (Dragon Craft)

아빠와 초5 아들이 함께 만드는 웹 복셀 드래곤 원정 게임. 우리 마을 이름은 **드래곤 빌리지** (저장소 `DragonVillage`).
설계 문서 + **M0 코드**(청크·메싱·렌더·조작). 지금은 싱글, 저장 없음, 마인크래프트처럼 블록을 부수고 쌓는 것까지.

## 바로 해보기

`main` 에 push 하면 GitHub Actions 가 빌드해서 **https://ohgani.github.io/DragonVillage/** 에 올린다 (2~3분). 폰·PC 어디서든 이 주소로 접속하면 된다. 개발 PC 가 IDC 에 있어 LAN 접속이 안 되므로 폰 테스트는 이 주소를 쓴다.

**폰 전체화면**: 안드로이드(크롬·삼성 인터넷)는 오른쪽 위 "전체화면" 버튼. 아이폰 사파리는 전체화면 API 가 없어서 공유 → **홈 화면에 추가**로 열어야 전체화면이 된다(매니페스트 포함, 아이콘은 `tools/gen-icons.mjs`).

## 실행

Node 20 이상. pnpm 은 corepack 으로.

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

- PC: 터미널에 뜨는 `http://localhost:5173`
- 폰: 같은 와이파이에서 `http://<PC IP>:5173` (터미널의 Network 주소). HTTPS 가 필요하면 `pnpm dev:https`(자체 서명 인증서, 폰에서 경고 한 번 통과)

| 명령 | 내용 |
|---|---|
| `pnpm dev` | 개발 서버 (`--host`, 폰 접속 가능) |
| `pnpm test` | vitest 전체 (청크·물리·메싱·데이터 검증) |
| `pnpm typecheck` / `pnpm lint` | TypeScript strict / ESLint (`Math.random` 금지 규칙 포함) |
| `pnpm exec vitest bench --run` | 메싱 속도 벤치 |
| `pnpm textures` | 임시 16×16 텍스처 생성 (있는 파일은 건너뜀, `--force` 로 덮어쓰기) |
| `pnpm build` / `pnpm preview` | 프로덕션 빌드 / 미리보기 |

## 조작

- **폰**: 왼쪽 아래 고정 스틱 → 이동, 그 밖의 곳 드래그 → 시점, 짧게 탭 → 놓기, 꾹 → 부수기, ▲ 점프, ▼ 웅크리기(토글), 핫바 탭으로 블록 선택(9 물·0 용암), `i` 로 FPS 표시
- **PC**: WASD 이동, 마우스 시점, Space 점프, Shift 웅크리기, Ctrl 달리기, 좌클릭 꾹 부수기, 우클릭 놓기, 1~9·휠 블록 선택, F3 정보, ESC 일시정지
- **게임패드**: 왼스틱 이동, 오른스틱 시점, A 점프, B 웅크리기, RT 부수기, LT 놓기, LB/RB 슬롯

## 구조

```
packages/shared/   순수 TS — chunk(Chunk·VoxelWorld), physics(AABB 스윕·레이캐스트), rules(blocks.json zod 검증), math(시드 PRNG)
packages/client/   Vite + Three.js — mesh(greedy+AO), workers(메싱 풀), render(머티리얼·청크·하늘·외곽선·손), input(터치·키보드·게임패드), player, game, ui, world(테스트 월드)
packages/server/   M2 에서 시작. 빈 껍데기
data/              게임 데이터 JSON — 아들 편집 영역
textures/          16×16 PNG — 아들 편집 영역 (textures/README.md)
docs/              설계·구조·로드맵·결정 기록·플레이테스트 로그
models/            드래곤 복셀 모델 생성기 + 뷰어
```

## 문서

| 파일 | 내용 |
|---|---|
| `CLAUDE.md` | Claude Code 지침 — 스택, 절대 규칙, 작업 방식, 지금 상태 |
| `docs/DESIGN.md` | 게임 설계 v0.4 |
| `docs/ARCHITECTURE.md` | 기술 구조, 패키지, DB 스키마 |
| `docs/ROADMAP.md` | M0–M9, M0 체크리스트(진행 상황) |
| `docs/DECISIONS.md` | 확정된 결정과 이유 (ADR) |
| `docs/PLAYTEST-LOG.md` | 플레이테스트 기록 + M0 실기기 측정표 |
| `docs/PROTOCOL.md`, `FAMILY-SYSTEM.md`, `XP-SYSTEM.md`, `BOSSES.md`, `CONTENT.md`, `DRAGON-SKILLS.md` | 시스템별 설계 |
| `docs/QUESTIONS-FOR-SON.md` | 아들에게 받을 답 |

## 한 문장 요약

마인크래프트 세계에서 15분 원정을 다녀와 재료를 모아 드래곤을 얻고, 친구들과 영구 마을을 키우는 게임. 폰 우선, 최대 6명, 부모가 정한 시간 규칙 안에서, 할 일을 하면 한 판 더.
