// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/node_modules/**', '**/dist/**', 'models/**', 'tools/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 지형·규칙 코드에서 Math.random 금지 (결정 #4). 클라이언트 연출 코드도 시드 PRNG를 쓴다.
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Math.random 금지 — shared/math/prng 의 시드 PRNG를 쓰세요.' },
      ],
    },
  },
);
