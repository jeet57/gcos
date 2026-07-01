import { ApiProperty } from '@nestjs/swagger';

import { ScoreBreakdownDto } from '../../readiness-score/dto/score-breakdown.dto';
import { TodayCardDto } from './today-card.dto';

class TargetActualDto {
  @ApiProperty()
  actual!: number;

  @ApiProperty()
  target!: number;
}

class WeeklyProgressDto {
  @ApiProperty({ type: TargetActualDto })
  studyHours!: TargetActualDto;

  @ApiProperty({ type: TargetActualDto })
  applicationsSent!: TargetActualDto;

  @ApiProperty({ type: TargetActualDto })
  germanMinutes!: TargetActualDto;
}

class StreakSummaryDto {
  @ApiProperty()
  studyDays!: number;

  @ApiProperty()
  germanDays!: number;

  @ApiProperty()
  applicationDays!: number;
}

class AlertDto {
  @ApiProperty({ enum: ['follow_up_overdue'] })
  type!: 'follow_up_overdue';

  @ApiProperty()
  applicationId!: string;

  @ApiProperty()
  company!: string;

  @ApiProperty()
  daysOverdue!: number;
}

/**
 * Composite response for GET /api/v1/dashboard (M10). Mirrors
 * DashboardResponse from @gcos/types — see that file for the
 * forward-compat note on `alerts` (computed inline here until M16
 * introduces a dedicated AlertsService).
 */
export class DashboardResponseDto {
  @ApiProperty({ type: ScoreBreakdownDto })
  score!: ScoreBreakdownDto;

  @ApiProperty({ type: TodayCardDto })
  todayCard!: TodayCardDto;

  @ApiProperty({ type: WeeklyProgressDto })
  weeklyProgress!: WeeklyProgressDto;

  @ApiProperty({ type: StreakSummaryDto })
  streaks!: StreakSummaryDto;

  @ApiProperty({ type: [AlertDto] })
  alerts!: AlertDto[];
}
