import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  AcademyLessonDetailDto,
  AcademyLessonDto,
  AcademyModuleDto,
  AcademyProgressDto,
  ModuleDetailDto,
  QuizAttemptDto,
  QuizQuestionDto,
  QuizSubmitResultDto,
} from '@gcos/types';
import type { LessonStatus as PrismaLessonStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import type { AddToBankDto } from './dto/add-to-bank.dto';
import type { SubmitQuizDto } from './dto/submit-quiz.dto';

const COMPLETED: PrismaLessonStatus = 'completed' as PrismaLessonStatus;

/**
 * Academy module (M12): modules/lessons listing with per-user progress
 * overlay, lesson content + completion, personal notes, the quiz
 * engine (scored server-side, answers stripped from the GET response),
 * and progress aggregation. Lesson completion and quiz submission both
 * trigger a readiness-score recalculation (PRD v2 §1.4 academy
 * dimension).
 */
@Injectable()
export class AcademyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
  ) {}

  async listModules(userId: string): Promise<AcademyModuleDto[]> {
    const modules = await this.prisma.academyModule.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { lessons: { select: { id: true } } },
    });

    const progress = await this.prisma.userLessonProgress.findMany({
      where: { userId, status: COMPLETED },
      select: { lessonId: true },
    });
    const completedLessonIds = new Set(progress.map((p: { lessonId: number }) => p.lessonId));

    return modules.map((m) => this.toModuleDto(m, completedLessonIds));
  }

  async getModule(userId: string, slug: string): Promise<ModuleDetailDto> {
    const module = await this.prisma.academyModule.findUnique({
      where: { slug },
      include: { lessons: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!module) throw new NotFoundException('Academy module not found');

    const progress = await this.prisma.userLessonProgress.findMany({
      where: { userId, lessonId: { in: module.lessons.map((l: { id: number }) => l.id) } },
    });
    const statusMap = new Map(progress.map((p: { lessonId: number; status: PrismaLessonStatus }) => [p.lessonId, p.status]));
    const completedLessonIds = new Set(
      progress.filter((p: { status: PrismaLessonStatus }) => p.status === COMPLETED).map((p: { lessonId: number }) => p.lessonId),
    );

    return {
      ...this.toModuleDto(module, completedLessonIds),
      lessons: module.lessons.map((lesson) => this.toLessonDto(lesson, statusMap.get(lesson.id) ?? null)),
    };
  }

  async getLesson(userId: string, lessonCode: string): Promise<AcademyLessonDetailDto> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const progress = await this.prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
    });

    return {
      ...this.toLessonDto(lesson, progress?.status ?? null),
      contentMd: lesson.contentMd,
      personalNotes: progress?.personalNotes ?? null,
    };
  }

  async completeLesson(userId: string, lessonCode: string): Promise<{ status: 'completed' }> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    await this.prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: { status: COMPLETED, completedAt: new Date() },
      create: { userId, lessonId: lesson.id, status: COMPLETED, startedAt: new Date(), completedAt: new Date() },
    });

    await this.readinessScoreService.calculate(userId);

    return { status: 'completed' };
  }

  async updateNotes(userId: string, lessonCode: string, personalNotes: string): Promise<{ personalNotes: string }> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const progress = await this.prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: { personalNotes },
      create: { userId, lessonId: lesson.id, personalNotes },
    });

    return { personalNotes: progress.personalNotes ?? '' };
  }

  /** Quiz questions with correct_option and explanation stripped — never expose answers. */
  async getQuiz(lessonCode: string): Promise<QuizQuestionDto[]> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const questions = await this.prisma.quizQuestion.findMany({
      where: { lessonId: lesson.id },
      orderBy: { sortOrder: 'asc' },
    });

    return questions.map((q) => ({
      id: q.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
    }));
  }

  async submitQuiz(userId: string, lessonCode: string, dto: SubmitQuizDto): Promise<QuizSubmitResultDto> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const questions = await this.prisma.quizQuestion.findMany({ where: { lessonId: lesson.id } });
    if (questions.length === 0) throw new BadRequestException('This lesson has no quiz questions');

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const results = dto.answers.map((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) throw new BadRequestException(`Unknown question id ${answer.questionId}`);
      return {
        questionId: answer.questionId,
        correct: (question.correctOption as string) === answer.selectedOption,
        correctOption: question.correctOption as 'A' | 'B' | 'C' | 'D',
        explanation: question.explanation,
      };
    });

    const correctCount = results.filter((r) => r.correct).length;
    const totalQuestions = questions.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    await this.prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: lesson.id,
        scorePct,
        correctCount,
        totalQuestions,
        answers: dto.answers as unknown as object,
      },
    });

    await this.readinessScoreService.calculate(userId);

    return { scorePct, correctCount, totalQuestions, results };
  }

  async getQuizHistory(userId: string, lessonCode: string): Promise<QuizAttemptDto[]> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { lessonCode } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, lessonId: lesson.id },
      orderBy: { completedAt: 'desc' },
    });

    return attempts.map((a) => ({
      id: a.id,
      lessonId: a.lessonId,
      scorePct: a.scorePct,
      correctCount: a.correctCount,
      totalQuestions: a.totalQuestions,
      completedAt: a.completedAt.toISOString(),
    }));
  }

  async addToQuestionBank(userId: string, dto: AddToBankDto): Promise<{ id: string }> {
    const lesson = await this.prisma.academyLesson.findUnique({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const created = await this.prisma.interviewQuestion.create({
      data: {
        userId,
        question: dto.question,
        category: 'behavioural',
        sourceLessonId: lesson.id,
        source: `academy:${lesson.lessonCode}`,
      },
    });

    return { id: created.id };
  }

  async getProgress(userId: string): Promise<AcademyProgressDto> {
    const [totalLessons, totalModules, lessonsCompleted, modules, quizAttempts] = await Promise.all([
      this.prisma.academyLesson.count(),
      this.prisma.academyModule.count(),
      this.prisma.userLessonProgress.count({ where: { userId, status: COMPLETED } }),
      this.prisma.academyModule.findMany({ include: { lessons: { select: { id: true } } } }),
      this.prisma.quizAttempt.findMany({ where: { userId }, select: { scorePct: true } }),
    ]);

    const completedIds = new Set(
      (
        await this.prisma.userLessonProgress.findMany({
          where: { userId, status: COMPLETED },
          select: { lessonId: true },
        })
      ).map((p: { lessonId: number }) => p.lessonId),
    );

    const modulesCompleted = modules.filter(
      (m: { lessons: { id: number }[] }) =>
        m.lessons.length > 0 && m.lessons.every((l: { id: number }) => completedIds.has(l.id)),
    ).length;

    const quizAverageScorePct =
      quizAttempts.length === 0
        ? 0
        : Math.round(
            quizAttempts.reduce((sum: number, q: { scorePct: number }) => sum + q.scorePct, 0) / quizAttempts.length,
          );

    return { lessonsCompleted, totalLessons, modulesCompleted, totalModules, quizAverageScorePct };
  }

  /** Next uncompleted MVP-tier lesson, ordered by module then lesson sort order. */
  async getNextLesson(userId: string): Promise<AcademyLessonDto | null> {
    const completed = await this.prisma.userLessonProgress.findMany({
      where: { userId, status: COMPLETED },
      select: { lessonId: true },
    });
    const excludeIds = completed.map((p: { lessonId: number }) => p.lessonId);

    const lesson = await this.prisma.academyLesson.findFirst({
      where: {
        tier: 'MVP' as never,
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      },
      orderBy: [{ module: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });

    return lesson ? this.toLessonDto(lesson, null) : null;
  }

  private toModuleDto(
    module: {
      id: number;
      slug: string;
      title: string;
      description: string;
      icon: string;
      colorHex: string;
      sortOrder: number;
      totalLessons: number;
      estimatedHours: unknown;
      lessons: { id: number }[];
    },
    completedLessonIds: Set<number>,
  ): AcademyModuleDto {
    return {
      id: module.id,
      slug: module.slug,
      title: module.title,
      description: module.description,
      icon: module.icon,
      colorHex: module.colorHex,
      sortOrder: module.sortOrder,
      totalLessons: module.totalLessons,
      estimatedHours: module.estimatedHours === null ? null : Number(module.estimatedHours),
      completedLessons: module.lessons.filter((l) => completedLessonIds.has(l.id)).length,
    };
  }

  private toLessonDto(
    lesson: {
      id: number;
      moduleId: number;
      lessonCode: string;
      title: string;
      contentType: string;
      durationMinutes: number;
      tier: string;
      sortOrder: number;
      prerequisites: string[];
      tags: string[];
    },
    status: PrismaLessonStatus | null,
  ): AcademyLessonDto {
    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      lessonCode: lesson.lessonCode,
      title: lesson.title,
      contentType: lesson.contentType as AcademyLessonDto['contentType'],
      durationMinutes: lesson.durationMinutes,
      tier: lesson.tier as AcademyLessonDto['tier'],
      sortOrder: lesson.sortOrder,
      prerequisites: lesson.prerequisites,
      tags: lesson.tags,
      progressStatus: status as AcademyLessonDto['progressStatus'],
    };
  }
}
