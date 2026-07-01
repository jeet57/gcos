/**
 * @gcos/types — shared TypeScript types for GCOS
 *
 * Imported identically from apps/web and apps/api:
 *   import { PipelineStage, ApiResponse } from '@gcos/types';
 *
 * M01 scope: enums + the generic ApiResponse envelope only.
 * M05 scope: DashboardResponse/ScoreBreakdown/TodayCard, AcademyModule/
 * AcademyLesson/QuizAttempt, and JobApplication/Company DTO shapes added.
 * Full route-by-route DTOs are filled in per-module from M09 onward.
 */
export * from './enums/index.js';
export * from './api/index.js';
export * from './prisma.js';
