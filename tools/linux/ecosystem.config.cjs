// 드래곤 크래프트 게임 서버 — pm2 설정 (Oracle Cloud 우분투, 2026-11-05 이전).
// 켜기:  pm2 start tools/linux/ecosystem.config.cjs   다시 켜기: pm2 restart dragoncraft   로그: pm2 logs dragoncraft
// pm2 는 끌 때 SIGINT 를 보낸다 → 서버가 저장하고 running.lock 을 지운다 (#153 죽음 감지가 "죽음"으로 안 센다).
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const server = path.join(root, 'packages', 'server');

module.exports = {
  apps: [
    {
      name: 'dragoncraft',
      cwd: server,
      script: path.join(server, 'node_modules', 'tsx', 'dist', 'cli.mjs'),
      args: 'src/index.ts',
      interpreter: 'node',
      env: {
        PORT: '5173',
        DV_DEFAULT_CODE: '482913',
        // 시간 제한 스위치 (결정 #73). 켤 때는 아래 줄의 // 를 지우고 pm2 restart dragoncraft --update-env
        // DV_ENFORCE_TIME: '1',
      },
      kill_timeout: 8000, // 저장할 시간을 준다
      restart_delay: 3000,
      max_restarts: 50,
      time: true, // 로그 줄마다 시각
    },
  ],
};
