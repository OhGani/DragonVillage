#!/usr/bin/env bash
# 드래곤 크래프트 서버를 Oracle Cloud 우분투 24.04 (ARM, A1) 에 처음 설치한다. 여러 번 돌려도 된다.
#
# 쓰는 법 (서버에 ssh 로 들어가서 한 줄):
#   curl -fsSL https://raw.githubusercontent.com/OhGani/DragonVillage/main/tools/linux/setup.sh | bash
#
# 하는 일: Node 22 + pnpm + pm2 설치 → 저장소 받기 → 의존성·클라 빌드 → 우분투 방화벽에 5173 열기 → pm2 로 켜고 부팅 때 자동 시작.
# Oracle 콘솔의 "보안 목록"(클라우드 쪽 방화벽)은 따로 열어야 한다 — docs/MIGRATION-ORACLE.md 1단계.
set -euo pipefail

REPO="https://github.com/OhGani/DragonVillage.git"
DIR="$HOME/dragon-village"
PORT=5173
PNPM_VERSION="10.17.1"

say() { printf '\n== %s\n' "$*"; }

say "1. 시스템 패키지"
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y git curl ca-certificates sqlite3 iptables-persistent netfilter-persistent

say "2. Node 22"
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v

say "3. pnpm ${PNPM_VERSION} + pm2"
sudo corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate
command -v pm2 >/dev/null || sudo npm install -g pm2
pnpm -v
pm2 -v

say "4. 저장소 받기 (${DIR})"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" pull --ff-only
else
  git clone "$REPO" "$DIR"
fi
cd "$DIR"

say "5. 의존성·클라 빌드"
pnpm install --frozen-lockfile
pnpm build
mkdir -p packages/server/data

say "6. 우분투 방화벽에 ${PORT} 열기 (Oracle 우분투 이미지는 기본으로 22 말고 다 막는다)"
if ! sudo iptables -C INPUT -p tcp --dport "$PORT" -m state --state NEW -j ACCEPT 2>/dev/null; then
  n=$(sudo iptables -L INPUT --line-numbers | awk '/REJECT/ {print $1; exit}')
  if [ -n "$n" ]; then
    sudo iptables -I INPUT "$n" -p tcp --dport "$PORT" -m state --state NEW -j ACCEPT
  else
    sudo iptables -A INPUT -p tcp --dport "$PORT" -m state --state NEW -j ACCEPT
  fi
  sudo netfilter-persistent save
fi

say "7. pm2 로 켜기 + 부팅 때 자동 시작"
pm2 startOrReload tools/linux/ecosystem.config.cjs
pm2 save
sudo env PATH="$PATH" "$(command -v pm2)" startup systemd -u "$USER" --hp "$HOME" >/dev/null
sleep 8
curl -fsS "http://127.0.0.1:${PORT}/health" && echo
say "끝. 바깥에서: http://$(curl -fsS https://ifconfig.me 2>/dev/null || echo '<공인 IP>'):${PORT}"
