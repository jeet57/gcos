import { IsIn, IsOptional, IsString } from 'class-validator';

const STATUSES = ['not_tried', 'practiced', 'confident'] as const;

export class UpdateQuestionDto {
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @IsOptional()
  @IsString()
  myAnswer?: string;
}
