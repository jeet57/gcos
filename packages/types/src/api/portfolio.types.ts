/**
 * Portfolio module API shapes.
 * Mirrors portfolio_projects / project_milestones tables (PRD v2 §7.2,
 * TAD §7). Lightweight module — both projects are seeded in M04, not
 * user-created; only their fields and milestone statuses are mutable.
 */

export interface ProjectMilestoneDto {
  id: number;
  name: string;
  description: string | null;
  category: string;
  status: string;
  plannedDate: string | null;
  completedDate: string | null;
  deliverableUrl: string | null;
}

export interface PortfolioProjectDto {
  id: number;
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  overallStatus: string;
  aiToolsUsed: string[];
  /** Percentage of milestones with status === 'completed'. */
  completionPct: number;
}

export interface PortfolioProjectDetailDto extends PortfolioProjectDto {
  milestones: ProjectMilestoneDto[];
}
