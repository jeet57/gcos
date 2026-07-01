import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WeekTaskStatus } from '@gcos/types';

export class UpdateWeekDto {
  @IsEnum(WeekTaskStatus)
  status!: WeekTaskStatus;

  @IsOptional()
  @IsString()
  completionNotes?: string;

  @IsOptional()
  @IsString()
  deliverableUrl?: string;
}
