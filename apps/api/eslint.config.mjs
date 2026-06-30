import { baseConfig } from '@gcos/config/eslint';

// Node globals needed for main.ts / guards / interceptors (process.env, console.log).
const nodeGlobals = ['process', 'console', 'Buffer', '__dirname', '__filename'].reduce(
  (acc, name) => ({ ...acc, [name]: 'readonly' }),
  {},
);

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: {
      // NestJS constructor injection commonly has params used only via
      // decorator metadata — handled by tsconfig's relaxed unused-param
      // setting (see apps/api/tsconfig.json). Keep ESLint strict here.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // NestJS DI needs the real (non-type-only) import for constructor
      // parameters — emitDecoratorMetadata reads the runtime reference to
      // build the providers graph. ESLint can't see that usage statically,
      // so it would otherwise force `import type`, which silently breaks
      // injection. Off for this package only.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
