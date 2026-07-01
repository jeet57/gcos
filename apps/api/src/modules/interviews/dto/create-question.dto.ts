import { IsIn, IsOptional, IsString } from 'class-validator';

const CATEGORIES = ['javascript','typescript','react','nodejs','nestjs','postgresql','docker','system_design','ai_tooling','behavioural'] as const;
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export class CreateQuestionDto {
  @IsString()
  question!: string;

  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @IsOptional()
  @IsIn(DIFFICULTIES)
  difficulty?: (typeof DIFFICULTIES)[number];

  @IsOptional()
  @IsString()
  source?: string;
}
