import { IsIn, IsOptional, IsUrl } from 'class-validator';

const MILESTONE_STATUSES = ['not_started', 'in_progress', 'completed', 'blocked'] as const;

export class UpdateMilestoneDto {
  @IsOptional()
  @IsIn(MILESTONE_STATUSES)
  status?: (typeof MILESTONE_STATUSES)[number];

  @IsOptional()
  @IsUrl()
  deliverableUrl?: string;
}
