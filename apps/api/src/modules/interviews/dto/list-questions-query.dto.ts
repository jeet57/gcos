import { IsIn, IsOptional } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto';

const CATEGORIES = ['javascript','typescript','react','nodejs','nestjs','postgresql','docker','system_design','ai_tooling','behavioural'] as const;
const STATUSES = ['not_tried', 'practiced', 'confident'] as const;

export class ListQuestionsQueryDto extends PaginationDto {
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];
}
