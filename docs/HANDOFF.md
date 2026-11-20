# 다른 PC 에서 이어 하기 (2026-11-19 기록)

아빠 맥(`khlee-Macbook-Pro-3`)에서 하던 작업을 다른 PC 에서 그대로 이어 하기 위한 메모. Claude Code 는 새 PC 에서 이 파일과 `CLAUDE.md` 를 먼저 읽는다.

## 1. 지금 어디까지 왔나

- **코드**: 전부 GitHub `OhGani/DragonVillage` 의 `main` 에 있다. 기록한 마지막 작업은 #315 (결투 주민의 직업 무기). 정확한 마지막 커밋은 `git log -1`.
- **라이브**: Oracle 서버 http://168.110.0.197:5173 — 2026-11-19 08:48 에 #312 까지 반영. #313~#315 는 푸시 뒤 `update.sh` 를 돌려야 올라간다. 서버에 무엇이 올라갔는지는 서버에서 `cd ~/dragon-village && git log -1`.
- **시간 제한**: 켜져 있다 (#298, 평일·주말 모두 밤 11시에 닫힘, 부모 플레이어도 아이와 같은 분량).
- 이 맥에서는 Claude Code 가 git worktree(`.claude/worktrees/git-update-256e3a`, 브랜치 `claude/git-update-256e3a`)에서 작업하고 `git push origin HEAD:main` 으로 올렸다. 새 PC 는 `main` 에서 바로 하면 된다.

### 최근 작업 (#306 ~ #312, 2026-11-14 ~ 11-19)

| # | 내용 | 주요 파일 |
|---|---|---|
| 306 | 탈것을 탄 몹 — 거미 기수·닭 기수·파괴수 기수·스켈레톤 기마병 | `shared/rules/mobs.ts JOCKEYS`, `client/render/MobView.ts makeJockey` |
| 307 | 날씨 — 맑음·비·눈·뇌우, 번개, 마을·원정 따로 | `data/weather.json`, `shared/rules/weather.ts`, `server/src/weather.ts`, `client/render/WeatherView.ts` |
| 308 | 아무도 없는 마을에 처음 들어오면 날씨 랜덤 | `weather.json village.joinWeights` |
| 309 | 눈 층(`snow_layer`)·피뢰침(`lightning_rod`, 철 주괴 3) | `blocks.json shape layer/rod`, `VillageRoom.tickSnow/nearestRod` |
| 310 | 부모 비밀번호 다시 정하는 명령 | `tools/linux/reset-password.sh`, `server/src/resetPassword.ts` |
| 311 | 마을 비의 30% 는 눈(그치면 녹음), 원정도 시작할 때 날씨 뽑기, 부모 페이지 🌨️ 눈 버튼 | `snowChance`, `VillageRoom.tickMelt`, `RoomOptions.weatherRoll` |
| 312 | 부모 페이지 폰 로그인 — 👁 비밀번호 보기, 자동 대문자 끔, 앞뒤 공백 봐줌 | `server/static/family.html`, `FamilyService.login` |
| 313 | 날씨 10분마다 (마을·원정) | `data/weather.json` |
| 314 | 마을 주민과 결투 — 대화 시트 ⚔️, 이기면 에메랄드 1, 둘 다 안 죽음 | `shared/rules/animals.ts DUEL_*`, `server/src/animals.ts startDuel`, `client/ui/talk.ts` |
| 315 | 결투 주민이 직업 무기를 들고 휘두름 (농부 괭이·무기장이 검…) | `data/trades.json duelWeapon/duelDamage`, `client/render/MobView.ts setWeapon` |

자세한 이유는 `docs/DECISIONS.md` 의 같은 번호 줄.

## 2. 새 PC 준비

```bash
git clone https://github.com/OhGani/DragonVillage.git dragon-village
cd dragon-village
```

- **Node 22** 가 필요하다 (better-sqlite3 13). Node 20 이면 서버·서버 테스트가 SIGSEGV 로 죽는다. nvm 이면 `nvm install 22 && nvm alias default 22`.
  - 기본이 20 인 채로 두면 `.claude/launch.json` 의 `server-test`·`dev-test` 가 20 으로 떠서 죽는다. 이 맥에서는 시험할 때만 `runtimeExecutable` 을 Node 22 경로로 잠깐 바꿨다가 `git checkout .claude/launch.json` 으로 되돌렸다 — 기본을 22 로 해 두면 필요 없다.
- pnpm 은 `corepack pnpm` (`corepack enable` 한 번). 설치: `corepack pnpm install`.
- 맥에서 네이티브 빌드가 실패하면 `npm_config_python=/usr/bin/python3 corepack pnpm install` (맥 기본 python3 3.7 은 node-gyp 가 못 쓴다).
- **검증 순서**(푸시 전): `corepack pnpm -r typecheck` → `corepack pnpm lint` → `corepack pnpm test`(781개) → `corepack pnpm --filter @dragon-village/client build`.
- 브라우저 시험: `.claude/launch.json` 의 `server-test`(5175, 데이터 `.test-data/`) + `dev-test`(5176, 콘솔 `window.__dv`). 켜기 전에 `.test-data/running.lock` 이 남아 있으면 지운다. 라이브 데이터는 건드리지 않는다.
- **윈도우 PC** (2026-11-20 준비): `winget install OpenJS.NodeJS.22`. `corepack enable` 은 관리자 권한이 없으면 EPERM 이라 그냥 `corepack pnpm …` 으로 친다. better-sqlite3 는 VS 2022 Build Tools 로 빌드된다. 열린 sqlite 파일은 못 지우니 테스트는 `storage.close()` 뒤에 `rmSync`.
- **prettier 를 파일에 그대로 돌리지 말 것** — 저장소에 prettier 설정이 없어서 기본값으로 파일 전체를 다시 쓴다 (2026-11-17 `village.ts` 가 통째로 바뀐 적 있음).

## 3. 서버 (Oracle Cloud)

- **SSH 키**는 저장소에 없다. 아빠 맥의 `~/oracle-key/ssh-key-2026-11-05.key` 를 새 PC 의 같은 자리로 복사하고 `chmod 600`. 절대 커밋하지 않는다.
- 코드 반영 (푸시한 뒤):

```bash
ssh -i ~/oracle-key/ssh-key-2026-11-05.key ubuntu@168.110.0.197 'bash ~/dragon-village/tools/linux/update.sh'
```

  - 접속자가 있으면 기다렸다가 다시 켠다. 바로 하려면 끝에 `--now` (부모 페이지 10분 로그인 잠김도 이걸로 풀린다).
- 부모 페이지 비밀번호를 잊었을 때 (`-t` 꼭):

```bash
ssh -t -i ~/oracle-key/ssh-key-2026-11-05.key ubuntu@168.110.0.197 'bash ~/dragon-village/tools/linux/reset-password.sh'
```

- 상태: http://168.110.0.197:5173/health · 로그: 서버에서 `pm2 logs dragoncraft`.
  - 부모 계정 이메일 목록을 먼저 보여 준다. 이메일은 목록 그대로(도메인까지) 친다 — 2026-11-18 에 도메인을 잘못 쳐서 안 바뀐 적이 있다. 비밀번호는 영문 입력으로.
- 부모 페이지: http://168.110.0.197:5173/family — 부모 계정은 아빠 것(네이버 메일, 게임 닉네임 오가니)과 시험용 `test-dad@dragon.local` 둘. 이메일 주소는 이 공개 저장소에 적지 않는다.
- 서버를 손으로 죽여 다시 켤 땐 `packages/server/data/running.lock` 을 먼저 지운다 (아니면 "죽음"으로 기록).

## 4. 아빠가 아직 확인 안 한 것

- [ ] 부모 페이지에 폰으로 로그인 (#312 — 👁 로 친 글자 확인)
- [ ] 🛠 카드 날씨 버튼: 🌧️ 비 → 비·빗소리·잿빛 하늘 / ⛈️ 뇌우 → 번개·천둥 / 🌨️ 눈 → 마을에 눈 층이 쌓이고 ☀️ 맑게 → 녹음
- [ ] 피뢰침을 놓고 ⛈️ 뇌우 → 번개가 피뢰침에 떨어지고 "⚡ 피뢰침이 번개를 받았어요!"
- [ ] 설원 원정에서 눈 층이 쌓임, 원정이 비·뇌우로 시작할 때 도착 알림
- [ ] 원정 밤에 탈것을 탄 몹, 방어전 둘째 파도부터 파괴수 기수 (#306)
- [ ] 마을 주민 탭 → ⚔️ 결투하기 → 이기면 에메랄드, 지면 하트 2칸에서 멈춤 (#314)

## 5. 다음에 할 만한 것

- 아들에게 물어볼 것은 `docs/QUESTIONS-FOR-SON.md` 맨 아래 **18차 (날씨)**.
- 임시 그림을 아들 그림으로 바꾸기: 사다리·끈·다락문·모닥불·피뢰침 (`textures/`).
- 피뢰침 재료를 구리로 하려면 구리 광석·구리 주괴부터 (지금 게임엔 구리가 없다).
- 시험용 부모 계정 `test-dad@dragon.local` 은 지워도 된다 (지우는 명령은 아직 없다).
