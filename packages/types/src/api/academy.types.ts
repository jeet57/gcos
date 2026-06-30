/**
 * Academy module API shapes.
 * Added in M05 (Shared Packages) — populated by AcademyService in M11–M12.
 *
 * These are client-facing DTOs, distinct from the raw Prisma model types
 * re-exported in `prisma.ts`: they flatten relations and join in
 * per-user progress, which the Prisma models don't carry on their own.
 * Mirrors academy_modules / academy_lessons / user_lesson_progress /
 * quiz_attempts tables (PRD v2 §7.1) and PRD v2 §1.4 Academy dimension.
 */
import type { ContentTier, LessonContentType, LessonStatus } from '../enums';

export interface AcademyModuleDto {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  colorHex: string;
  sortOrder: number;
  totalLessons: number;
  estimatedHours: number | null;
  /** Lessons with status === 'completed' for the current user. */
  completedLessons: number;
}

export interface AcademyLessonDto {
  id: number;
  moduleId: number;
  lessonCode: string;
  title: string;
  contentType: LessonContentType;
  durationMinutes: number;
  tier: ContentTier;
  sortOrder: number;
  prerequisites: string[];
  tags: string[];
  /** Joined from user_lesson_progress for the current user; null = not started. */
  progressStatus: LessonStatus | null;
}

/**
 * Full lesson detail, including markdown body — used by the Lesson Viewer
 * screen only (not the list view, to keep list payloads small).
 */
export interface AcademyLessonDetailDto extends AcademyLessonDto {
  contentMd: string;
  personalNotes: string | null;
}

export interface QuizAttemptDto {
  id: string;
  lessonId: number;
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
}
