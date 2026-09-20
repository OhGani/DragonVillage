// 검증용 임시 게임 서버 (라이브 5173 과 분리): 포트 5175, 데이터는 저장소 루트의 .test-data/ (git 제외), 기본 마을 482913.
// 빌드된 클라(packages/client/dist)를 같이 서빙한다. .claude/launch.json 의 `server-test` 가 이 파일을 띄운다.
// 라이브 서버에 사람이 있어 재시작을 못 할 때, 여기서 새 서버 코드를 브라우저로 확인한다 (2026-09-20).
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const data = path.join(root, '.test-data');
fs.mkdirSync(data, { recursive: true });
const tsx = path.join(root, 'packages', 'server', 'node_modules', 'tsx', 'dist', 'cli.mjs');
const r = spawnSync(process.execPath, [tsx, 'src/index.ts'], {
  cwd: path.join(root, 'packages', 'server'),
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT ?? '5175', DV_DATA_DIR: data, DV_DEFAULT_CODE: '482913' },
});
process.exit(r.status ?? 1);
