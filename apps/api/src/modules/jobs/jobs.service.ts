import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { JobApplicationDto } from '@gcos/types';
import type {
  ApplicationSource,
  PipelineStage as PrismaPipelineStage,
  RejectionReasonCode as PrismaRejectionReasonCode,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { startOfWeek, startOfNextWeek } from '../../common/utils/plan-date.util';
import { CompaniesService } from './companies.service';
import type { CreateApplicationDto } from './dto/create-application.dto';
import type { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import type { UpdateApplicationDto } from './dto/update-application.dto';

/** Stages still considered "active" for the overdue-follow-up check (mirrors DashboardService, M10). */
const ACTIVE_FOLLOWUP_STAGES: PrismaPipelineStage[] = [
  'applied',
  'screening',
  'tech_interview',
  'take_home',
  'final_interview',
];

/**
 * Job Pipeline module (M13) — application CRUD with stage transitions
 * and rejection-reason logging, plus company lookup/create. Company
 * resolution and stats live here too; the kanban UI (M21) is the
 * primary consumer.
 */
@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(userId: string, dto: CreateApplicationDto): Promise<JobApplicationDto> {
    let companyId = dto.companyId;
    if (!companyId) {
      if (!dto.companyName) {
        throw new BadRequestException('Either companyId or companyName is required');
      }
      const company = await this.companiesService.findOrCreateByName(
        dto.companyName,
        dto.companyCity,
        dto.companyCountry,
      );
      companyId = company.id;
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        userId,
        companyId,
        roleTitle: dto.roleTitle,
        jobUrl: dto.jobUrl ?? null,
        source: (dto.source as ApplicationSource | undefined) ?? null,
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : new Date(),
        stage: 'applied',
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
        visaSponsorshipConfirmed: dto.visaSponsorshipConfirmed ?? false,
        salaryOffered: dto.salaryOffered ?? null,
        notes: dto.notes ?? null,
      },
      include: { company: true },
    });

    return this.toDto(application);
  }

  async list(userId: string, query: ListApplicationsQueryDto): Promise<JobApplicationDto[]> {
    const applications = await this.prisma.jobApplication.findMany({
      where: {
        userId,
        ...(query.stage ? { stage: query.stage as PrismaPipelineStage } : {}),
      },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      skip: ((query.page ?? 1) - 1) * (query.perPage ?? 20),
      take: query.perPage ?? 20,
    });
    return applications.map((a) => this.toDto(a));
  }

  async findOne(userId: string, id: string): Promise<JobApplicationDto> {
    const application = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
      include: { company: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    return this.toDto(application);
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto): Promise<JobApplicationDto> {
    const existing = await this.prisma.jobApplication.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Application not found');

    if (dto.stage === 'rejected' && !dto.rejectionReason) {
      throw new BadRequestException('rejectionReason is required when moving an application to rejected');
    }

    const application = await this.prisma.jobApplication.update({
      where: { id },
      data: {
        ...(dto.stage !== undefined && { stage: dto.stage as PrismaPipelineStage }),
        ...(dto.rejectionReason !== undefined && {
          rejectionReason: dto.rejectionReason as unknown as PrismaRejectionReasonCode,
        }),
        ...(dto.rejectionNotes !== undefined && { rejectionNotes: dto.rejectionNotes }),
        ...(dto.followUpDate !== undefined && { followUpDate: new Date(dto.followUpDate) }),
        ...(dto.salaryOffered !== undefined && { salaryOffered: dto.salaryOffered }),
        ...(dto.salaryNegotiated !== undefined && { salaryNegotiated: dto.salaryNegotiated }),
        ...(dto.visaSponsorshipConfirmed !== undefined && {
          visaSponsorshipConfirmed: dto.visaSponsorshipConfirmed,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: { company: true },
    });

    return this.toDto(application);
  }

  async getStats(userId: string) {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = startOfNextWeek(now);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [byStage, thisWeekCount, overdueCount] = await Promise.all([
      this.prisma.jobApplication.groupBy({ by: ['stage'], where: { userId }, _count: { _all: true } }),
      this.prisma.jobApplication.count({ where: { userId, appliedDate: { gte: weekStart, lt: weekEnd } } }),
      this.prisma.jobApplication.count({
        where: {
          userId,
          stage: { in: ACTIVE_FOLLOWUP_STAGES },
          followUpDate: { lt: today, not: null },
        },
      }),
    ]);

    const totalByStage: Record<string, number> = {};
    for (const row of byStage as { stage: string; _count: { _all: number } }[]) {
      totalByStage[row.stage] = row._count._all;
    }

    return { totalByStage, thisWeekCount, overdueFollowUpsCount: overdueCount };
  }

  private toDto(application: {
    id: string;
    roleTitle: string;
    jobUrl: string | null;
    appliedDate: Date;
    stage: string;
    followUpDate: Date | null;
    salaryOffered: number | null;
    salaryNegotiated: number | null;
    visaSponsorshipConfirmed: boolean;
    rejectionReason: string | null;
    rejectionNotes: string | null;
    notes: string | null;
    updatedAt: Date;
    company: {
      id: string;
      name: string;
      city: string;
      country: string;
      sizeBucket: string | null;
      sector: string | null;
      websiteUrl: string | null;
      linkedinUrl: string | null;
      careersUrl: string | null;
      hasSponsoredVisa: boolean;
      employeeCount: number | null;
      watchlist: boolean;
    };
  }): JobApplicationDto {
    return {
      id: application.id,
      company: {
        id: application.company.id,
        name: application.company.name,
        city: application.company.city,
        country: application.company.country,
        sizeBucket: application.company.sizeBucket,
        sector: application.company.sector,
        websiteUrl: application.company.websiteUrl,
        linkedinUrl: application.company.linkedinUrl,
        careersUrl: application.company.careersUrl,
        hasSponsoredVisa: application.company.hasSponsoredVisa,
        employeeCount: application.company.employeeCount,
        watchlist: application.company.watchlist,
      },
      roleTitle: application.roleTitle,
      jobUrl: application.jobUrl,
      appliedDate: application.appliedDate.toISOString().slice(0, 10),
      stage: application.stage as JobApplicationDto['stage'],
      followUpDate: application.followUpDate ? application.followUpDate.toISOString().slice(0, 10) : null,
      salaryOffered: application.salaryOffered,
      salaryNegotiated: application.salaryNegotiated,
      visaSponsorshipConfirmed: application.visaSponsorshipConfirmed,
      rejectionReason: application.rejectionReason as JobApplicationDto['rejectionReason'],
      rejectionNotes: application.rejectionNotes,
      notes: application.notes,
      updatedAt: application.updatedAt.toISOString(),
    };
  }
}
