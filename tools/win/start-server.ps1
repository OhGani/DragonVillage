# 드래곤 크래프트 게임 서버(packages/server, 포트 5173)를 창 없이 띄운다.
# 작업 스케줄러 작업 `DragonCraftServer` 가 로그온 시 + 5분마다 이 파일을 부른다(start-server-hidden.vbs 경유).
# 5173 이 이미 열려 있으면 아무것도 하지 않는다(중복 실행 방지). 로그: %LOCALAPPDATA%\Temp\dragon-village-server.log
$ErrorActionPreference = 'Stop'

$port = 5173
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$serverDir = Join-Path $root 'packages\server'
$log = Join-Path $env:LOCALAPPDATA 'Temp\dragon-village-server.log'

if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { exit 0 }

# node.exe 찾기: DV_NODE 환경 변수 → PATH → 이 PC 의 포터블 Node(Claude 앱 샌드박스 안)
$node = $env:DV_NODE
if (-not $node) {
  $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($cmd) { $node = $cmd.Source }
}
if (-not $node -or -not (Test-Path $node)) {
  $node = 'C:\Users\smile-user\AppData\Local\Packages\claude_pzs8sxrjxfjjc\LocalCache\Local\nodejs\node-v22.23.2-win-x64\node.exe'
}
$tsx = Join-Path $serverDir 'node_modules\tsx\dist\cli.mjs'
if (-not (Test-Path $node)) { Add-Content $log "[$(Get-Date -Format s)] start-server: node.exe not found ($node)"; exit 1 }
if (-not (Test-Path $tsx)) { Add-Content $log "[$(Get-Date -Format s)] start-server: tsx not found ($tsx) - run pnpm install"; exit 1 }

$env:PORT = "$port"
$env:DV_DEFAULT_CODE = '482913'
Add-Content $log "[$(Get-Date -Format s)] start-server: launching $node $tsx src/index.ts"
# cmd 를 거쳐 >> 로 이어 쓴다(Start-Process 의 리다이렉트는 파일을 덮어쓴다). 창은 숨김.
$args = "/c `"`"$node`" `"$tsx`" src/index.ts >> `"$log`" 2>&1`""
Start-Process -FilePath 'cmd.exe' -ArgumentList $args -WorkingDirectory $serverDir -WindowStyle Hidden
