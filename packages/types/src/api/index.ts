/**
 * API response type barrel.
 *
 * M05 adds dashboard.types.ts, academy.types.ts, and jobs.types.ts.
 * Shapes here are populated further as each backend module is
 * implemented (M09–M15). This file is kept as the single import
 * surface so downstream milestones only ever add exports here,
 * never change how consumers import from '@gcos/types'.
 */
export * from './common.types.js';
export * from './dashboard.types.js';
export * from './academy.types.js';
export * from './jobs.types.js';
export * from './auth.types.js';
export * from './study.types.js';
export * from './portfolio.types.js';
export * from './german.types.js';
export * from './interview.types.js';
export * from './networking.types.js';
