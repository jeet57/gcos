import { Injectable, NotFoundException } from '@nestjs/common';
import type { PortfolioProjectDetailDto, PortfolioProjectDto } from '@gcos/types';
import type { MilestoneStatus as PrismaMilestoneStatus, ProjectStatus as PrismaProjectStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import type { UpdateMilestoneDto } from './dto/update-milestone.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

const COMPLETED: PrismaMilestoneStatus = 'completed' as PrismaMilestoneStatus;

/**
 * Portfolio module (M14) — lightweight by design: the 2 projects are
 * seeded in M04, not user-created. Only project fields and milestone
 * statuses are mutable here. Milestone completion feeds the readiness
 * score's portfolio dimension (PRD v2 §1.4), so updates trigger a
 * recalculation the same way Study and Academy do.
 */
@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
  ) {}

  async list(userId: string): Promise<PortfolioProjectDto[]> {
    const projects = await this.prisma.portfolioProject.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      include: { milestones: { select: { status: true } } },
    });
    return projects.map((p) => this.toListDto(p));
  }

  async findOne(userId: string, id: number): Promise<PortfolioProjectDetailDto> {
    const project = await this.prisma.portfolioProject.findFirst({
      where: { id, userId },
      include: { milestones: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!project) throw new NotFoundException('Portfolio project not found');

    return {
      ...this.toListDto(project),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        category: m.category,
        status: m.status,
        plannedDate: m.plannedDate ? m.plannedDate.toISOString().slice(0, 10) : null,
        completedDate: m.completedDate ? m.completedDate.toISOString().slice(0, 10) : null,
        deliverableUrl: m.deliverableUrl,
      })),
    };
  }

  async updateProject(userId: string, id: number, dto: UpdateProjectDto): Promise<PortfolioProjectDto> {
    const existing = await this.prisma.portfolioProject.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Portfolio project not found');

    const project = await this.prisma.portfolioProject.update({
      where: { id },
      data: {
        ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
        ...(dto.liveUrl !== undefined && { liveUrl: dto.liveUrl }),
        ...(dto.overallStatus !== undefined && {
          overallStatus: dto.overallStatus as PrismaProjectStatus,
        }),
        ...(dto.aiToolsUsed !== undefined && { aiToolsUsed: dto.aiToolsUsed }),
      },
      include: { milestones: { select: { status: true } } },
    });

    return this.toListDto(project);
  }

  async updateMilestone(
    userId: string,
    projectId: number,
    milestoneId: number,
    dto: UpdateMilestoneDto,
  ): Promise<PortfolioProjectDetailDto['milestones'][number]> {
    const project = await this.prisma.portfolioProject.findFirst({ where: { id: projectId, userId } });
    if (!project) throw new NotFoundException('Portfolio project not found');

    const milestone = await this.prisma.projectMilestone.findFirst({ where: { id: milestoneId, projectId } });
    if (!milestone) throw new NotFoundException('Milestone not found');

    const updated = await this.prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        ...(dto.status !== undefined && { status: dto.status as PrismaMilestoneStatus }),
        ...(dto.deliverableUrl !== undefined && { deliverableUrl: dto.deliverableUrl }),
        ...(dto.status === COMPLETED && { completedDate: new Date() }),
      },
    });

    await this.readinessScoreService.calculate(userId);

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      category: updated.category,
      status: updated.status,
      plannedDate: updated.plannedDate ? updated.plannedDate.toISOString().slice(0, 10) : null,
      completedDate: updated.completedDate ? updated.completedDate.toISOString().slice(0, 10) : null,
      deliverableUrl: updated.deliverableUrl,
    };
  }

  private toListDto(project: {
    id: number;
    slug: string;
    name: string;
    description: string;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    overallStatus: string;
    aiToolsUsed: string[];
    milestones: { status: string }[];
  }): PortfolioProjectDto {
    const completionPct =
      project.milestones.length === 0
        ? 0
        : Math.round(
            (project.milestones.filter((m) => m.status === COMPLETED).length / project.milestones.length) * 100,
          );

    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      description: project.description,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      overallStatus: project.overallStatus,
      aiToolsUsed: project.aiToolsUsed,
      completionPct,
    };
  }
}
