import { IsArray, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

const PROJECT_STATUSES = ['not_started', 'in_progress', 'feature_complete', 'deployed', 'case_study_done'] as const;

export class UpdateProjectDto {
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @IsOptional()
  @IsIn(PROJECT_STATUSES)
  overallStatus?: (typeof PROJECT_STATUSES)[number];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aiToolsUsed?: string[];
}
