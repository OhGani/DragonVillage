#!/usr/bin/env bash
# 새 코드 반영: git pull → 의존성 → 클라 빌드 → 서버 다시 켜기.
# 접속자가 있으면 기다린다(최대 6시간, 30초마다 확인) — 놀던 아이가 튕기지 않게. 바로 하려면: update.sh --now
#   ssh ubuntu@<서버> 'bash ~/dragon-village/tools/linux/update.sh'
set -euo pipefail
cd "$HOME/dragon-village"
PORT=5173

git pull --ff-only
pnpm install --frozen-lockfile
pnpm build   # 클라는 여기서 바로 바뀐다 (서버가 dist 를 그대로 서빙)

if [ "${1:-}" != "--now" ]; then
  for _ in $(seq 1 720); do
    players=$(curl -fsS "http://127.0.0.1:${PORT}/health" | sed -n 's/.*"players":\([0-9]*\).*/\1/p')
    [ "${players:-0}" = "0" ] && break
    echo "접속 ${players}명 — 30초 뒤 다시 봐요"
    sleep 30
  done
fi
pm2 startOrReload tools/linux/ecosystem.config.cjs --update-env   # 설정(ecosystem)을 바꿨어도 반영된다
pm2 save
sleep 8
curl -fsS "http://127.0.0.1:${PORT}/health" && echo
