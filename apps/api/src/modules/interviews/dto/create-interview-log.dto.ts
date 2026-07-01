import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

const FORMATS = ['phone','video','technical','system_design','take_home','final','hr'] as const;
const OUTCOMES = ['passed', 'failed', 'waiting', 'cancelled'] as const;

export class CreateInterviewLogDto {
  @IsUUID()
  applicationId!: string;

  @IsDateString()
  interviewDate!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roundNumber?: number;

  @IsOptional()
  @IsIn(FORMATS)
  format?: (typeof FORMATS)[number];

  @IsOptional()
  @IsString()
  interviewerName?: string;

  @IsOptional()
  @IsString()
  interviewerRole?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionsAsked?: string[];

  @IsOptional()
  @IsString()
  myAnswersNotes?: string;

  @IsOptional()
  @IsIn(OUTCOMES)
  outcome?: (typeof OUTCOMES)[number];

  @IsOptional()
  @IsString()
  feedbackReceived?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  myRating?: number;
}
