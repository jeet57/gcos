/**
 * Re-exports Prisma-generated model types so apps/web can reference the
 * exact same shapes as apps/api without depending on @prisma/client
 * directly (TAD Section 13.4). This file has no runtime behaviour — it is
 * a pure type re-export.
 *
 * NOTE: this import path assumes apps/web has `@prisma/client` resolvable
 * via the workspace (it is a dependency of apps/api, and pnpm's workspace
 * node_modules layout makes generated client types resolvable from
 * sibling packages that declare @gcos/types as a dependency). If a type
 * error appears here after `pnpm install`, run `pnpm --filter @gcos/api
 * prisma:generate` first so the client exists on disk before this file
 * type-checks.
 */
export type {
  User,
  StudyDomain,
  SkillTopic,
  AcademyModule,
  AcademyLesson,
  PlanMonth,
  PlanWeek,
  GermanUnit,
  VisaDocument,
  PortfolioProject,
  ProjectMilestone,
  StudySession,
  UserLessonProgress,
  TopicCompletion,
  WeekTaskCompletion,
  QuizQuestion,
  QuizAttempt,
  GermanSession,
  VocabularyEntry,
  AiToolSession,
  Company,
  JobApplication,
  InterviewLog,
  TakeHomeAssignment,
  InterviewQuestion,
  MockInterviewLog,
  NetworkConnection,
  CoffeeChat,
  LinkedinPost,
  ReadinessScore,
  WeeklyReview,
  MonthlyCheckpoint,
  Certification,
  ResumeVersion,
} from '@prisma/client';
