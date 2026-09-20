// 검증용 Vite (5176): /ws·/health 를 임시 서버 5175 로 넘긴다. dev 빌드라 window.__dv 로 자동 검증할 수 있다.
// .claude/launch.json 의 `dev-test` 가 이 파일을 띄운다. 먼저 `server-test` 를 띄워 둘 것.
const { spawnSync } = require('child_process');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const r = spawnSync(process.execPath, [path.join(root, 'packages', 'client', 'node_modules', 'vite', 'bin', 'vite.js'), path.join(root, 'packages', 'client'), '--port', '5176', '--strictPort'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, DV_SERVER: 'http://localhost:5175' },
});
process.exit(r.status ?? 1);
