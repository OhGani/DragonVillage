# 서버 이전: IDC PC → Oracle Cloud 도쿄 A1 (2026-11-05)

| | 지금 | 새 서버 |
|---|---|---|
| 자리 | IDC PC (Windows) | Oracle Cloud Japan East (Tokyo), 인스턴스 `free-a1-ubuntu` |
| 주소 | http://115.68.221.179:5173 | http://168.110.0.197:5173 |
| OS | Windows, 작업 스케줄러 `DragonCraftServer` | Ubuntu 24.04 ARM (aarch64), pm2 |
| 데이터 | `packages/server/data/dragoncraft.sqlite` | 같은 파일을 그대로 옮긴다 |

코드는 바꿀 게 없다. better-sqlite3 13 은 리눅스 ARM 바이너리를 패키지에 들고 있어서 컴파일도 필요 없다.
옮긴 뒤 며칠은 IDC 서버를 꺼 두기만 하고(지우지 않고), 문제가 없으면 해지한다.

---

## 1. Oracle 콘솔 (아빠)

1. **5173 포트 열기** — 인스턴스 `free-a1-ubuntu` → 네트워킹 탭 → 서브넷 이름 클릭 → 보안 탭(보안 목록) → 기본 보안 목록 → **수신 규칙 추가**
   - 소스 CIDR `0.0.0.0/0`, IP 프로토콜 `TCP`, 대상 포트 범위 `5173`, 설명 `dragon craft`
2. **종량제 전환 + 예산 알림** (회수 방지) — 결제 및 비용 관리 → 업그레이드 및 결제 관리 → 종량제로 업그레이드. 그다음 예산 → 예산 생성(월 1,000원, 알림 메일).
   - 종량제가 아니면 7일 동안 거의 놀면 VM 이 회수될 수 있다. 무료 한도(A1 4코어·24GB) 안이면 청구는 0원.

## 2. 새 서버에 설치 (ssh)

인스턴스를 만들 때 받은 **SSH 개인 키**(`ssh-key-….key`)가 필요하다. 아빠 PC 의 Windows 터미널에서:

```
ssh -i "C:\경로\ssh-key-2026-11-05.key" ubuntu@168.110.0.197
```

들어가서 한 줄:

```
curl -fsSL https://raw.githubusercontent.com/OhGani/DragonVillage/main/tools/linux/setup.sh | bash
```

Node 22·pnpm·pm2 설치 → 저장소 받기 → 빌드 → 우분투 방화벽 5173 열기 → pm2 로 켜기·부팅 자동 시작까지 한다(5~10분).
끝나면 바깥에서 http://168.110.0.197:5173/health 가 `{"ok":true,...}` 를 보여야 한다. 이때는 **빈 새 마을**이다 — 들어가서 놀지 말 것(옮길 때 덮어쓴다).

## 3. 옮기는 날 (접속자 0 일 때, 10분)

IDC PC 에서 (Claude 가 할 수 있음):

1. 라이브 서버 끄기 + 다시 켜지지 않게 작업 스케줄러 끄기
   ```
   Disable-ScheduledTask -TaskName DragonCraftServer
   ```
   그다음 5173 프로세스 종료(서버가 SIGINT 를 못 받으니 `running.lock` 도 지운다).
2. 데이터 뽑기: `node tools/dev/export-db.mjs` → 저장소 맨 위 `dragoncraft-export.sqlite` (검사 결과 `ok`·계정 수 확인)
3. 새 서버로 보내기:
   ```
   scp -i "<키>" dragoncraft-export.sqlite ubuntu@168.110.0.197:~/
   ```

새 서버에서 (ssh):

```
pm2 stop dragoncraft
cd ~/dragon-village/packages/server/data
rm -f dragoncraft.sqlite-wal dragoncraft.sqlite-shm
mv ~/dragoncraft-export.sqlite dragoncraft.sqlite
pm2 start dragoncraft
curl -s localhost:5173/health
```

## 4. 주소 바꾸기

- 아들 폰·아빠 폰: http://168.110.0.197:5173 로 들어가 **홈 화면에 다시 추가**. 주소가 바뀌면 브라우저에 저장된 로그인이 없으니 **닉네임 + PIN 4자리로 이어하기**(가방·드래곤 그대로). 부모 페이지는 http://168.110.0.197:5173/family
- 저장소: GitHub Pages 안내 페이지(`.github/workflows/pages.yml` `VITE_SERVER_URL`), `CLAUDE.md` 배포 줄, `docs/ROADMAP.md` 호스팅 줄의 IP — Claude 가 바꾼다.

## 5. 그 뒤

- **코드 반영**: 새 서버에서 `bash ~/dragon-village/tools/linux/update.sh` (git pull → 빌드 → 접속자 0 이면 다시 켜기, `--now` 면 바로). 서버 로그 `pm2 logs dragoncraft`, 상태 `pm2 status`.
- **시간 제한 켜기**: `tools/linux/ecosystem.config.cjs` 의 `DV_ENFORCE_TIME` 줄 주석을 풀고 `bash ~/dragon-village/tools/linux/update.sh` (설정도 다시 읽는다).
- **시간대**: VM 시계는 UTC 라 pm2 설정에 `TZ: 'Asia/Seoul'` 을 넣었다 — 로그·백업 파일 날짜가 한국 시간. 할 일·게임 시간 계산은 원래 서울 고정이라 상관없다.
- **백업**: 서버가 매일 `data/backup-YYYY-MM-DD.sqlite`(7개)·매주 `data/backup-weekly`(8개)를 만든다. 같은 VM 안이라 VM 이 사라지면 같이 사라지니, 가끔 `scp` 로 아빠 PC 에 받아 둔다(나중에 Oracle 오브젝트 스토리지 자동 복사).
- **되돌리기**: 새 서버에 문제가 있으면 IDC 에서 `Enable-ScheduledTask -TaskName DragonCraftServer` — 5분 안에 옛 서버가 다시 뜬다(옮긴 뒤 새 서버에서 생긴 진행은 빠진다).
- **IDC 해지 전에**: 개발(Claude Code)도 이 PC 에서 하고 있으니, 아빠 PC 에 Node 22 + pnpm + 저장소를 준비하고 옮긴다.
