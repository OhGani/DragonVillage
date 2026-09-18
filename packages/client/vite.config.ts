import basicSsl from '@vitejs/plugin-basic-ssl';
import { fileURLToPath } from 'node:url';
import { type PluginOption, defineConfig } from 'vite';

// 저장소 루트 — textures/ 와 data/ 를 dev 서버가 읽을 수 있어야 한다
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

// 개발: Vite 5174, 게임 서버(packages/server)는 5173. /ws 와 /health 를 서버로 넘긴다.
// 배포: 서버가 dist 를 직접 내주므로 프록시가 필요 없다 (결정 #60).
const GAME_SERVER = process.env.DV_SERVER ?? 'http://localhost:5173';

export default defineConfig(() => {
  const https = process.env.DV_HTTPS === '1';
  const plugins: PluginOption[] = [];
  if (https) plugins.push(basicSsl());
  return {
    // GitHub Pages 는 /DragonVillage/ 하위에 배포된다 (CI 가 VITE_BASE 를 준다). 로컬·서버 배포는 /
    base: process.env.VITE_BASE ?? '/',
    plugins,
    server: {
      host: true,
      port: 5174,
      fs: { allow: [repoRoot] },
      proxy: {
        '/ws': { target: GAME_SERVER.replace(/^http/, 'ws'), ws: true },
        '/health': { target: GAME_SERVER },
      },
    },
    preview: { host: true, port: 4173 },
    worker: { format: 'es' as const },
    build: { target: 'es2022', sourcemap: true, chunkSizeWarningLimit: 900 },
  };
});
