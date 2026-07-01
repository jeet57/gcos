import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  GermanSessionDto,
  GermanStatsDto,
  GermanUnitDto,
  VocabularyEntryDto,
} from '@gcos/types';
import type { GermanSessionType as PrismaGermanSessionType, LessonStatus as PrismaLessonStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import { startOfWeek, startOfNextWeek } from '../../common/utils/plan-date.util';
import type { CreateGermanSessionDto } from './dto/create-session.dto';
import type { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import type { UpdateGermanUnitDto } from './dto/update-unit.dto';

/**
 * German language tracker (M15) — session logging, DW-unit progress,
 * vocabulary entries, and stats. Sessions feed the germanScore
 * dimension in ReadinessScoreService so the dashboard reflects
 * updated progress immediately after each session is logged.
 */
@Injectable()
export class GermanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
  ) {}

  async createSession(userId: string, dto: CreateGermanSessionDto): Promise<GermanSessionDto> {
    const session = await this.prisma.germanSession.create({
      data: {
        userId,
        sessionType: dto.sessionType as PrismaGermanSessionType,
        durationMinutes: dto.durationMinutes,
        sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : new Date(),
        dwUnitId: dto.dwUnitId ?? null,
        resourceName: dto.resourceName ?? null,
        vocabularyCount: dto.vocabularyCount ?? null,
        notes: dto.notes ?? null,
      },
    });

    await this.readinessScoreService.calculate(userId);

    return this.toSessionDto(session);
  }

  async listSessions(userId: string): Promise<GermanSessionDto[]> {
    const sessions = await this.prisma.germanSession.findMany({
      where: { userId },
      orderBy: { sessionDate: 'desc' },
      take: 50,
    });
    return sessions.map((s) => this.toSessionDto(s));
  }

  async listUnits(): Promise<GermanUnitDto[]> {
    const units = await this.prisma.germanUnit.findMany({
      orderBy: [{ level: 'asc' }, { unitNumber: 'asc' }],
    });
    return units.map((u) => this.toUnitDto(u));
  }

  async updateUnit(id: number, dto: UpdateGermanUnitDto): Promise<GermanUnitDto> {
    const existing = await this.prisma.germanUnit.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('German unit not found');

    const unit = await this.prisma.germanUnit.update({
      where: { id },
      data: {
        status: dto.status as PrismaLessonStatus,
        completedDate: dto.status === 'completed' ? new Date() : null,
      },
    });
    return this.toUnitDto(unit);
  }

  async addVocabulary(userId: string, dto: CreateVocabularyDto): Promise<VocabularyEntryDto> {
    const entry = await this.prisma.vocabularyEntry.create({
      data: {
        userId,
        germanWord: dto.germanWord,
        englishMeaning: dto.englishMeaning,
        exampleSentence: dto.exampleSentence ?? null,
        germanSessionId: dto.germanSessionId ?? null,
      },
    });
    return this.toVocabDto(entry);
  }

  async listVocabulary(userId: string): Promise<VocabularyEntryDto[]> {
    const entries = await this.prisma.vocabularyEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return entries.map((e) => this.toVocabDto(e));
  }

  async getStats(userId: string): Promise<GermanStatsDto> {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = startOfNextWeek(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [weeklySessions, monthlySessions, allDates, vocabCount, unitsCompleted] = await Promise.all([
      this.prisma.germanSession.findMany({
        where: { userId, sessionDate: { gte: weekStart, lt: weekEnd } },
        select: { durationMinutes: true },
      }),
      this.prisma.germanSession.findMany({
        where: { userId, sessionDate: { gte: monthStart, lt: monthEnd } },
        select: { durationMinutes: true },
      }),
      this.prisma.germanSession.findMany({
        where: { userId },
        select: { sessionDate: true },
        distinct: ['sessionDate'],
      }),
      this.prisma.vocabularyEntry.count({ where: { userId } }),
      this.prisma.germanUnit.count({ where: { status: 'completed' as PrismaLessonStatus } }),
    ]);

    return {
      weeklyMinutes: weeklySessions.reduce((s: number, r: { durationMinutes: number }) => s + r.durationMinutes, 0),
      monthlyMinutes: monthlySessions.reduce((s: number, r: { durationMinutes: number }) => s + r.durationMinutes, 0),
      currentStreakDays: this.calcStreak(allDates.map((d: { sessionDate: Date }) => d.sessionDate), now),
      totalVocabularyLearned: vocabCount,
      unitsCompleted,
    };
  }

  private calcStreak(dates: Date[], now: Date): number {
    const keys = new Set(dates.map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`));
    const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!keys.has(key(cursor))) {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
      if (!keys.has(key(cursor))) return 0;
    }
    let streak = 0;
    while (keys.has(key(cursor))) {
      streak++;
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
    }
    return streak;
  }

  private toSessionDto(s: {
    id: string; sessionType: string; durationMinutes: number; sessionDate: Date;
    dwUnitId: number | null; resourceName: string | null; vocabularyCount: number | null; notes: string | null;
  }): GermanSessionDto {
    return {
      id: s.id, sessionType: s.sessionType, durationMinutes: s.durationMinutes,
      sessionDate: s.sessionDate.toISOString().slice(0, 10),
      dwUnitId: s.dwUnitId, resourceName: s.resourceName,
      vocabularyCount: s.vocabularyCount, notes: s.notes,
    };
  }

  private toUnitDto(u: {
    id: number; level: string; unitNumber: number; title: string;
    targetMonth: number; status: string; completedDate: Date | null;
  }): GermanUnitDto {
    return {
      id: u.id, level: u.level, unitNumber: u.unitNumber, title: u.title,
      targetMonth: u.targetMonth, status: u.status,
      completedDate: u.completedDate ? u.completedDate.toISOString().slice(0, 10) : null,
    };
  }

  private toVocabDto(e: {
    id: string; germanWord: string; englishMeaning: string;
    exampleSentence: string | null; germanSessionId: string | null; createdAt: Date;
  }): VocabularyEntryDto {
    return {
      id: e.id, germanWord: e.germanWord, englishMeaning: e.englishMeaning,
      exampleSentence: e.exampleSentence, germanSessionId: e.germanSessionId,
      createdAt: e.createdAt.toISOString(),
    };
  }
}
