import { IsEnum, IsOptional } from 'class-validator';
import { PipelineStage } from '@gcos/types';

import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ListApplicationsQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PipelineStage)
  stage?: PipelineStage;
}
