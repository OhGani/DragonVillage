import basicSsl from '@vitejs/plugin-basic-ssl';
import { fileURLToPath } from 'node:url';
import { type PluginOption, defineConfig } from 'vite';

// 저장소 루트 — textures/ 와 data/ 를 dev 서버가 읽을 수 있어야 한다
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(() => {
  const https = process.env.DV_HTTPS === '1';
  const plugins: PluginOption[] = [];
  if (https) plugins.push(basicSsl());
  return {
    plugins,
    server: {
      host: true,
      port: 5173,
      fs: { allow: [repoRoot] },
    },
    preview: { host: true, port: 4173 },
    worker: { format: 'es' as const },
    build: { target: 'es2022', sourcemap: true, chunkSizeWarningLimit: 900 },
  };
});
