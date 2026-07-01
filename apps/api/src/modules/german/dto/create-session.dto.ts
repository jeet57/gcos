import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const SESSION_TYPES = ['duolingo', 'dw_course', 'italki', 'speaking_practice', 'reading', 'writing', 'watching'] as const;

export class CreateGermanSessionDto {
  @IsIn(SESSION_TYPES)
  sessionType!: (typeof SESSION_TYPES)[number];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dwUnitId?: number;

  @IsOptional()
  @IsString()
  resourceName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  vocabularyCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
