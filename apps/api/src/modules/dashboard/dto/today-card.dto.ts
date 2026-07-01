import { ApiProperty } from '@nestjs/swagger';

class AcademyTodayDto {
  @ApiProperty()
  lessonCode!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  moduleSlug!: string;

  @ApiProperty()
  estimatedMinutes!: number;
}

class StudyTodayDto {
  @ApiProperty()
  domainName!: string;

  @ApiProperty()
  targetMinutes!: number;
}

class ApplicationTargetDto {
  @ApiProperty()
  count!: number;
}

/** Mirrors TodayCard from @gcos/types (PRD v2 §8.5 Morning Check-In). */
export class TodayCardDto {
  @ApiProperty({ type: AcademyTodayDto, nullable: true })
  academyLesson!: AcademyTodayDto | null;

  @ApiProperty({ type: StudyTodayDto, nullable: true })
  studyTask!: StudyTodayDto | null;

  @ApiProperty({ type: ApplicationTargetDto, nullable: true })
  applicationTarget!: ApplicationTargetDto | null;
}
