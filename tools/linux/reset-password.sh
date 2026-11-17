#!/usr/bin/env bash
# 부모 페이지(/family) 비밀번호 다시 정하기 (2026-11-17). 비밀번호는 해시로만 저장돼서 꺼내 볼 수 없다 — 잊으면 이것으로 새로.
# 맥에서 (-t 가 있어야 비밀번호를 물어볼 수 있다):
#   ssh -t -i ~/oracle-key/ssh-key-2026-11-05.key ubuntu@168.110.0.197 'bash ~/dragon-village/tools/linux/reset-password.sh'
# 이메일을 알면 뒤에 붙여도 된다: … reset-password.sh dad@example.com
set -euo pipefail
cd "$HOME/dragon-village/packages/server"
run() { node node_modules/tsx/dist/cli.mjs src/resetPassword.ts "$@"; }

echo "부모 계정 이메일:"
run list
EMAIL="${1:-}"
if [ -z "$EMAIL" ]; then read -r -p "비밀번호를 바꿀 이메일: " EMAIL; fi
read -r -s -p "새 비밀번호 (6자 이상, 화면에 안 보여요): " PW1; echo
read -r -s -p "한 번 더: " PW2; echo
if [ "$PW1" != "$PW2" ]; then echo "❌ 두 번 친 비밀번호가 달라요. 다시 해 주세요"; exit 1; fi
DV_NEW_PASSWORD="$PW1" run set "$EMAIL"
