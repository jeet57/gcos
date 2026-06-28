/**
 * Academy lesson completion status.
 * Mirrors user_lesson_progress.status CHECK constraint (M03).
 */
export enum LessonStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Academy content tiers — controls MVP / V2 / V3 visibility.
 * Mirrors academy_lessons.tier CHECK constraint (M03).
 */
export enum ContentTier {
  MVP = 'MVP',
  V2 = 'V2',
  V3 = 'V3',
}

/**
 * Academy lesson content types.
 * Mirrors academy_lessons.content_type CHECK constraint (M03).
 */
export enum LessonContentType {
  LESSON = 'lesson',
  EXERCISE = 'exercise',
  QUIZ = 'quiz',
  INTERVIEW_QA = 'interview_qa',
  REVISION_SHEET = 'revision_sheet',
}
