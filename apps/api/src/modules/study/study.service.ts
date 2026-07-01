import { Injectable, NotFoundException } from '@nestjs/common';
import type { WeekTaskStatus as PrismaWeekTaskStatus } from '@prisma/client';
import type { DomainProgressDto, PlanMonthDto, StudySessionDto, WeekTaskStatus } from '@gcos/types';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import { startOfWeek, startOfNextWeek } from '../../common/utils/plan-date.util';
import type { CreateSessionDto } from './dto/create-session.dto';
import type { ListSessionsQueryDto } from './dto/list-sessions-query.dto';
import type { UpdateWeekDto } from './dto/update-week.dto';
import type { UpdateTopicDto } from './dto/update-topic.dto';

/**
 * Study module (M11): session logging, per-domain progress, and the
 * 12-month plan view with per-user week/topic completion overlay.
 * Mutations trigger a readiness-score recalculation so the dashboard
 * (M10) reflects fresh data on next load (PRD v2 §1.4 study dimension).
 */
@Injectable()
export class StudyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto): Promise<StudySessionDto> {
    const session = await this.prisma.studySession.create({
      data: {
        userId,
        domainId: dto.domainId,
        topicId: dto.topicId ?? null,
        date: dto.date ? new Date(dto.date) : new Date(),
        durationMinutes: dto.durationMinutes,
        resourceType: dto.resourceType ?? null,
        resourceName: dto.resourceName ?? null,
        resourceUrl: dto.resourceUrl ?? null,
        notes: dto.notes ?? null,
      },
    });

    await this.readinessScoreService.calculate(userId);

    return this.toSessionDto(session);
  }

  async listSessions(userId: string, query: ListSessionsQueryDto): Promise<StudySessionDto[]> {
    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        ...(query.domainId !== undefined && { domainId: query.domainId }),
        ...((query.from || query.to) && {
          date: {
            ...(query.from && { gte: new Date(query.from) }),
            ...(query.to && { lte: new Date(query.to) }),
          },
        }),
      },
      orderBy: { date: 'desc' },
      skip: ((query.page ?? 1) - 1) * (query.perPage ?? 20),
      take: query.perPage ?? 20,
    });

    return sessions.map((s) => this.toSessionDto(s));
  }

  /** All 11 domains with this user's weekly logged minutes and average topic completion. */
  async getDomainProgress(userId: string): Promise<DomainProgressDto[]> {
    const weekStart = startOfWeek(new Date());
    const weekEnd = startOfNextWeek(new Date());

    const domains = await this.prisma.studyDomain.findMany({
      orderBy: { priority: 'asc' },
      include: {
        skillTopics: {
          include: { topicCompletions: { where: { userId }, select: { completionPct: true } } },
        },
      },
    });

    const weeklyMinutesByDomain = await this.prisma.studySession.groupBy({
      by: ['domainId'],
      where: { userId, date: { gte: weekStart, lt: weekEnd } },
      _sum: { durationMinutes: true },
    });
    const minutesMap = new Map<number, number>(
      weeklyMinutesByDomain.map((row: { domainId: number; _sum: { durationMinutes: number | null } }) => [
        row.domainId,
        row._sum.durationMinutes ?? 0,
      ]),
    );

    return domains.map((domain) => {
      const topicPcts = domain.skillTopics.map(
        (t: { topicCompletions: { completionPct: number }[] }) => t.topicCompletions[0]?.completionPct ?? 0,
      );
      const completionPct =
        topicPcts.length === 0 ? 0 : Math.round(topicPcts.reduce((a: number, b: number) => a + b, 0) / topicPcts.length);

      return {
        id: domain.id,
        slug: domain.slug,
        name: domain.name,
        colorHex: domain.colorHex,
        priority: domain.priority,
        weeklyMinutesActual: minutesMap.get(domain.id) ?? 0,
        completionPct,
      };
    });
  }

  /** All 12 plan months with their weeks and this user's per-week completion state. */
  async getPlan(userId: string): Promise<PlanMonthDto[]> {
    const months = await this.prisma.planMonth.findMany({
      orderBy: { monthNumber: 'asc' },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: { taskCompletions: { where: { userId } } },
        },
      },
    });

    return months.map((month) => ({
      id: month.id,
      monthNumber: month.monthNumber,
      theme: month.theme,
      phaseName: month.phaseName,
      hoursPerWeek: Number(month.hoursPerWeek),
      germanTarget: month.germanTarget,
      milestoneDescription: month.milestoneDescription,
      weeks: month.weeks.map((week) => ({
        id: week.id,
        weekNumber: week.weekNumber,
        tasksSummary: week.tasksSummary,
        deliverable: week.deliverable,
        germanFocus: week.germanFocus,
        domainIds: week.domainIds,
        status: (week.taskCompletions[0]?.status ?? 'not_started') as PlanMonthDto['weeks'][number]['status'],
        deliverableUrl: week.taskCompletions[0]?.deliverableUrl ?? null,
      })),
    }));
  }

  async updateWeek(userId: string, weekId: number, dto: UpdateWeekDto): Promise<{ status: WeekTaskStatus }> {
    const week = await this.prisma.planWeek.findUnique({ where: { id: weekId } });
    if (!week) throw new NotFoundException('Plan week not found');

    const status = dto.status as unknown as PrismaWeekTaskStatus;

    const completion = await this.prisma.weekTaskCompletion.upsert({
      where: { userId_weekId: { userId, weekId } },
      update: {
        status,
        completionNotes: dto.completionNotes ?? null,
        deliverableUrl: dto.deliverableUrl ?? null,
        completedAt: status === 'completed' ? new Date() : null,
      },
      create: {
        userId,
        weekId,
        status,
        completionNotes: dto.completionNotes ?? null,
        deliverableUrl: dto.deliverableUrl ?? null,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });

    if (status === 'completed') {
      await this.readinessScoreService.calculate(userId);
    }

    return { status: completion.status as unknown as WeekTaskStatus };
  }

  async updateTopic(userId: string, topicId: number, dto: UpdateTopicDto): Promise<{ completionPct: number }> {
    const topic = await this.prisma.skillTopic.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Skill topic not found');

    const status = dto.completionPct >= 100 ? 'completed' : dto.completionPct > 0 ? 'in_progress' : 'not_started';

    const completion = await this.prisma.topicCompletion.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        completionPct: dto.completionPct,
        status,
        completedAt: dto.completionPct >= 100 ? new Date() : null,
      },
      create: {
        userId,
        topicId,
        completionPct: dto.completionPct,
        status,
        startedAt: new Date(),
        completedAt: dto.completionPct >= 100 ? new Date() : null,
      },
    });

    return { completionPct: completion.completionPct };
  }

  private toSessionDto(session: {
    id: string;
    domainId: number;
    topicId: number | null;
    date: Date;
    durationMinutes: number;
    resourceType: string | null;
    resourceName: string | null;
    notes: string | null;
  }): StudySessionDto {
    return {
      id: session.id,
      domainId: session.domainId,
      topicId: session.topicId,
      date: session.date.toISOString().slice(0, 10),
      durationMinutes: session.durationMinutes,
      resourceType: session.resourceType,
      resourceName: session.resourceName,
      notes: session.notes,
    };
  }
}
