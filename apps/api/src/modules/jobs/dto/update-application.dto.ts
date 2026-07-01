import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PipelineStage, RejectionReason } from '@gcos/types';

/**
 * PATCH /jobs/:id. `rejectionReason` is required when `stage` is being
 * set to `rejected` (M13 plan AC) — enforced with @ValidateIf rather
 * than a separate confirm-rejection endpoint, since every other field
 * here is optional partial-update.
 */
export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(PipelineStage)
  stage?: PipelineStage;

  @ValidateIf((dto: UpdateApplicationDto) => dto.stage === PipelineStage.REJECTED)
  @IsEnum(RejectionReason)
  rejectionReason?: RejectionReason;

  @IsOptional()
  @IsString()
  rejectionNotes?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryOffered?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryNegotiated?: number;

  @IsOptional()
  @IsBoolean()
  visaSponsorshipConfirmed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
