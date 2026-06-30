import { defineConfig } from 'vitest/config';

/**
 * Vitest config for apps/api unit tests (TAD: "Vitest (unit + component)").
 * First introduced in M08 for AuthService unit tests; reused by every
 * subsequent module's *.service.spec.ts.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
