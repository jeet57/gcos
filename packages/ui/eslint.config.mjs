import { baseConfig } from '@gcos/config/eslint';

// DOM globals needed for shadcn/ui primitives (HTMLDivElement, HTMLButtonElement, etc.)
// Scoped to this package only — apps/api and other non-browser packages don't need them.
const domGlobals = [
  'HTMLElement',
  'HTMLDivElement',
  'HTMLButtonElement',
  'HTMLInputElement',
  'HTMLParagraphElement',
  'HTMLHeadingElement',
  'HTMLTableElement',
  'HTMLTableSectionElement',
  'HTMLTableRowElement',
  'HTMLTableCellElement',
  'HTMLTableCaptionElement',
].reduce((acc, name) => ({ ...acc, [name]: 'readonly' }), {});

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: domGlobals,
    },
  },
];
