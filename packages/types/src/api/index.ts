/**
 * API response type barrel.
 *
 * NOTE (M01 scope): only `common.types.ts` exists at this milestone.
 * dashboard.types.ts, academy.types.ts, jobs.types.ts and the rest are
 * added in M05 (Shared Packages) and populated further as each backend
 * module is implemented (M09–M15). This file is kept as the single
 * import surface so downstream milestones only ever add exports here,
 * never change how consumers import from '@gcos/types'.
 */
export * from './common.types';
