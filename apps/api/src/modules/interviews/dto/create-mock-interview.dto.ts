import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const FORMATS = ['phone','video','technical','system_design','take_home','final','hr'] as const;

export class CreateMockInterviewDto {
  @IsDateString()
  mockDate!: string;

  @IsOptional()
  @IsIn(FORMATS)
  format?: (typeof FORMATS)[number];

  @IsOptional()
  @IsString()
  partnerName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionsAsked?: string[];

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  selfRating?: number;
}
