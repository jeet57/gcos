import { baseConfig } from '@gcos/config/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    rules: {
      // NestJS constructor injection commonly has params used only via
      // decorator metadata — handled by tsconfig's relaxed unused-param
      // setting (see apps/api/tsconfig.json). Keep ESLint strict here.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
