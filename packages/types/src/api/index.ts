/**
 * API response type barrel.
 *
 * M05 adds dashboard.types.ts, academy.types.ts, and jobs.types.ts.
 * Shapes here are populated further as each backend module is
 * implemented (M09–M15). This file is kept as the single import
 * surface so downstream milestones only ever add exports here,
 * never change how consumers import from '@gcos/types'.
 */
export * from './common.types';
export * from './dashboard.types';
export * from './academy.types';
export * from './jobs.types';
