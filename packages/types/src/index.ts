/**
 * @gcos/types — shared TypeScript types for GCOS
 *
 * Imported identically from apps/web and apps/api:
 *   import { PipelineStage, ApiResponse } from '@gcos/types';
 *
 * M01 scope: enums + the generic ApiResponse envelope only.
 * Prisma-derived model types are added in M03 (prisma.ts).
 * Full DTO shapes are added per-module from M09 onward.
 */
export * from './enums';
export * from './api';
export * from './prisma';
