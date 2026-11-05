import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/src/**/*.test.ts'],
    environment: 'node',
    // 지형 생성·마을 룸 테스트가 무거워 worker thread 가 RPC 에 답을 못 하면 "[vitest-worker]: Timeout calling onTaskUpdate" 가
    // Unhandled Error 로 잡혀 테스트는 다 통과해도 종료 코드가 1 이 된다 (GitHub Actions 가 2026-10-31 부터 계속 실패한 원인).
    // 자식 프로세스(forks)는 이 경로가 없다. 느린 CI 러너를 생각해 테스트 하나 제한도 20초로
    pool: 'forks',
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
