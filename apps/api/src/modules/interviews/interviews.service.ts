import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  InterviewLogDto,
  InterviewQuestionDto,
  InterviewStatsDto,
  MockInterviewLogDto,
} from '@gcos/types';
import type {
  InterviewFormat as PrismaInterviewFormat,
  InterviewOutcome as PrismaInterviewOutcome,
  QuestionCategory as PrismaQuestionCategory,
  QuestionDifficulty as PrismaQuestionDifficulty,
  QuestionStatus as PrismaQuestionStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateInterviewLogDto } from './dto/create-interview-log.dto';
import type { CreateMockInterviewDto } from './dto/create-mock-interview.dto';
import type { CreateQuestionDto } from './dto/create-question.dto';
import type { ListQuestionsQueryDto } from './dto/list-questions-query.dto';
import type { UpdateQuestionDto } from './dto/update-question.dto';

/**
 * Interview prep module (M15) — question bank CRUD with practice
 * status tracking, interview round logging (attached to applications),
 * and mock interview logging. ReadinessScore's interviewScore dimension
 * uses question confident% — no direct recalculate call here because
 * that calculation already queries the table fresh each time; updating
 * question status is enough to change the next score snapshot.
 */
@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Question bank ───────────────────────────────────────────────────

  async createQuestion(userId: string, dto: CreateQuestionDto): Promise<InterviewQuestionDto> {
    const q = await this.prisma.interviewQuestion.create({
      data: {
        userId,
        question: dto.question,
        category: dto.category as PrismaQuestionCategory,
        difficulty: (dto.difficulty as PrismaQuestionDifficulty | undefined) ?? null,
        source: dto.source ?? null,
      },
    });
    return this.toQuestionDto(q);
  }

  async listQuestions(userId: string, query: ListQuestionsQueryDto): Promise<InterviewQuestionDto[]> {
    const questions = await this.prisma.interviewQuestion.findMany({
      where: {
        userId,
        ...(query.category !== undefined && { category: query.category as PrismaQuestionCategory }),
        ...(query.status !== undefined && { status: query.status as PrismaQuestionStatus }),
      },
      orderBy: { createdAt: 'asc' },
      skip: ((query.page ?? 1) - 1) * (query.perPage ?? 20),
      take: query.perPage ?? 20,
    });
    return questions.map((q) => this.toQuestionDto(q));
  }

  async updateQuestion(userId: string, id: string, dto: UpdateQuestionDto): Promise<InterviewQuestionDto> {
    const existing = await this.prisma.interviewQuestion.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Interview question not found');

    const q = await this.prisma.interviewQuestion.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status as PrismaQuestionStatus }),
        ...(dto.myAnswer !== undefined && { myAnswer: dto.myAnswer }),
        ...((dto.status === 'practiced' || dto.status === 'confident') && { lastPracticed: new Date() }),
      },
    });
    return this.toQuestionDto(q);
  }

  async getStats(userId: string): Promise<InterviewStatsDto> {
    const questions = await this.prisma.interviewQuestion.findMany({
      where: { userId },
      select: { status: true, category: true },
    });

    const byCategory: Record<string, number> = {};
    let confidentCount = 0;
    let practicedCount = 0;
    let notTriedCount = 0;

    for (const q of questions as { status: string; category: string }[]) {
      byCategory[q.category] = (byCategory[q.category] ?? 0) + 1;
      if (q.status === 'confident') confidentCount++;
      else if (q.status === 'practiced') practicedCount++;
      else notTriedCount++;
    }

    return {
      totalQuestions: questions.length,
      confidentCount,
      practicedCount,
      notTriedCount,
      byCategory,
    };
  }

  // ── Interview logs ──────────────────────────────────────────────────

  async createInterviewLog(dto: CreateInterviewLogDto): Promise<InterviewLogDto> {
    const log = await this.prisma.interviewLog.create({
      data: {
        applicationId: dto.applicationId,
        interviewDate: new Date(dto.interviewDate),
        roundNumber: dto.roundNumber ?? 1,
        format: (dto.format as PrismaInterviewFormat | undefined) ?? null,
        interviewerName: dto.interviewerName ?? null,
        interviewerRole: dto.interviewerRole ?? null,
        durationMinutes: dto.durationMinutes ?? null,
        questionsAsked: dto.questionsAsked ?? [],
        myAnswersNotes: dto.myAnswersNotes ?? null,
        outcome: (dto.outcome as PrismaInterviewOutcome | undefined) ?? null,
        feedbackReceived: dto.feedbackReceived ?? null,
        myRating: dto.myRating ?? null,
      },
    });
    return this.toLogDto(log);
  }

  async listInterviewLogs(applicationId: string): Promise<InterviewLogDto[]> {
    const logs = await this.prisma.interviewLog.findMany({
      where: { applicationId },
      orderBy: { interviewDate: 'asc' },
    });
    return logs.map((l) => this.toLogDto(l));
  }

  // ── Mock interviews ─────────────────────────────────────────────────

  async createMockInterview(userId: string, dto: CreateMockInterviewDto): Promise<MockInterviewLogDto> {
    const mock = await this.prisma.mockInterviewLog.create({
      data: {
        userId,
        mockDate: new Date(dto.mockDate),
        format: (dto.format as PrismaInterviewFormat | undefined) ?? null,
        partnerName: dto.partnerName ?? null,
        questionsAsked: dto.questionsAsked ?? [],
        feedback: dto.feedback ?? null,
        selfRating: dto.selfRating ?? null,
      },
    });
    return this.toMockDto(mock);
  }

  async listMockInterviews(userId: string): Promise<MockInterviewLogDto[]> {
    const mocks = await this.prisma.mockInterviewLog.findMany({
      where: { userId },
      orderBy: { mockDate: 'desc' },
    });
    return mocks.map((m) => this.toMockDto(m));
  }

  // ── Mappers ─────────────────────────────────────────────────────────

  private toQuestionDto(q: {
    id: string; question: string; category: string; difficulty: string | null;
    status: string; myAnswer: string | null; source: string | null;
    sourceLessonId: number | null; lastPracticed: Date | null; createdAt: Date;
  }): InterviewQuestionDto {
    return {
      id: q.id, question: q.question, category: q.category, difficulty: q.difficulty,
      status: q.status, myAnswer: q.myAnswer, source: q.source,
      sourceLessonId: q.sourceLessonId,
      lastPracticed: q.lastPracticed ? q.lastPracticed.toISOString().slice(0, 10) : null,
      createdAt: q.createdAt.toISOString(),
    };
  }

  private toLogDto(l: {
    id: string; applicationId: string; interviewDate: Date; roundNumber: number;
    format: string | null; interviewerName: string | null; interviewerRole: string | null;
    durationMinutes: number | null; questionsAsked: string[]; myAnswersNotes: string | null;
    outcome: string | null; feedbackReceived: string | null; myRating: number | null;
  }): InterviewLogDto {
    return {
      id: l.id, applicationId: l.applicationId,
      interviewDate: l.interviewDate.toISOString().slice(0, 10),
      roundNumber: l.roundNumber, format: l.format,
      interviewerName: l.interviewerName, interviewerRole: l.interviewerRole,
      durationMinutes: l.durationMinutes, questionsAsked: l.questionsAsked,
      myAnswersNotes: l.myAnswersNotes, outcome: l.outcome,
      feedbackReceived: l.feedbackReceived, myRating: l.myRating,
    };
  }

  private toMockDto(m: {
    id: string; mockDate: Date; format: string | null; partnerName: string | null;
    questionsAsked: string[]; feedback: string | null; selfRating: number | null;
  }): MockInterviewLogDto {
    return {
      id: m.id, mockDate: m.mockDate.toISOString().slice(0, 10),
      format: m.format, partnerName: m.partnerName,
      questionsAsked: m.questionsAsked, feedback: m.feedback, selfRating: m.selfRating,
    };
  }
}
