# Claude Code 첫 프롬프트 (M0 착수)

아래를 그대로 붙여 넣는다.

---

이 저장소는 아빠(나)와 초5 아들이 함께 만드는 웹 복셀 드래곤 원정 게임이다. 먼저 `CLAUDE.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`를 읽어라. 설계 결정은 이미 끝났으니 다시 열지 말고, 궁금한 점이 있으면 `DECISIONS.md`의 이유를 먼저 확인해라.

지금 할 일은 **M0 (기술 검증과 조작 실험, 2주)** 이다. `docs/ROADMAP.md`의 "M0 작업 분해" 섹션을 따라 진행한다.

M0의 목표는 두 가지뿐이다: (1) 프레임이 나오는가 — PC 60fps, 중급 폰 30fps 이상, (2) 조작이 되는가 — 아들이 폰과 PC 양쪽에서 설명 없이 5분 안에 블록을 부수고 쌓는다. 지형 생성, 조명 flood fill, 서버, 저장, 메뉴 UI, 사운드, 드래곤은 M0에서 하지 않는다.

시작 순서:

1. pnpm workspaces 골격을 만들어라: `packages/shared`, `packages/client`, `packages/server`(빈 껍데기). TypeScript strict, ESLint, vitest. `data/blocks.json`을 zod로 검증해 로드하는 `shared/rules` 모듈부터. 검증 실패 메시지는 한국어로.
2. `shared/chunk`에 16×16×16 청크(Uint16Array + 팔레트)를 만들고 테스트를 붙여라.
3. `client/workers/mesher.worker.ts`에 greedy meshing을 구현하라. 단일 블록 → 6면, 2×2×2 꽉 찬 큐브 → 6면(병합 확인), 이웃 청크 경계 처리 — 이 세 케이스를 vitest로 먼저 쓰고 통과시켜라.
4. Three.js 씬에 하드코딩 테스트 월드(8×8×4 청크 평지 + 계단 + 기둥)를 `DataArrayTexture`(NearestFilter)로 렌더하라. 텍스처는 `textures/`에 임시 16×16 PNG 8종을 생성해 넣어라(돌·흙·잔디·원목·판자·유리·모래·자갈). FPS·드로우콜·메싱 ms 오버레이를 폰에서도 보이게.
5. 조작: 공통 `InputState` → 터치(왼쪽 반 엄지 위치에 스틱 생성, 오른쪽 드래그 시점, 탭=놓기, 홀드=부수기 게이지), 키보드+Pointer Lock, 1인칭 카메라, AABB 0.6×1.8×0.6 스윕 충돌과 중력, Amanatides–Woo 레이캐스트 5블록, 조준 블록 외곽선, 슬롯 바.
6. Vite 개발 서버를 `--host`와 mkcert HTTPS로 띄워 폰에서 접속할 수 있게 하라. 폰 테스트 없이 M0는 끝나지 않는다.

작업 단위마다 작은 커밋. 각 단계 끝에 무엇을 확인해야 하는지 나에게 알려라. 첫 번째로 1번(저장소 골격)을 진행해라.
