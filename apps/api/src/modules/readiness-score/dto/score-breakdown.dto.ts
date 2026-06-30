import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger-decorated mirror of ScoreBreakdown from @gcos/types (M05).
 * Kept as a separate class (rather than importing the interface
 * directly into the controller return type) so SwaggerModule's
 * DocumentBuilder can introspect field-level docs — interfaces have no
 * runtime representation for it to read.
 */
export class ScoreBreakdownDto {
  @ApiProperty({ minimum: 0, maximum: 100, description: 'Weighted overall readiness score.' })
  overall!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Study Sessions dimension (15%).' })
  study!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Academy Progress dimension (20%).' })
  academy!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Application Volume dimension (20%).' })
  application!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Portfolio Completion dimension (15%).' })
  portfolio!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'German Language dimension (15%).' })
  german!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Interview Readiness dimension (10%).' })
  interview!: number;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'AI Tooling Fluency dimension (5%).' })
  aiTooling!: number;

  @ApiProperty({ description: "Delta vs yesterday's recorded snapshot; 0 if none exists." })
  trend!: number;

  @ApiProperty({ description: 'ISO date this score was calculated for.' })
  recordedDate!: string;
}
