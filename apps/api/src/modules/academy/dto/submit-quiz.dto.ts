import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, ValidateNested } from 'class-validator';

class QuizAnswerDto {
  @IsInt()
  questionId!: number;

  @IsIn(['A', 'B', 'C', 'D'])
  selectedOption!: 'A' | 'B' | 'C' | 'D';
}

export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];
}
