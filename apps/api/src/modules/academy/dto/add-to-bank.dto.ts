import { IsInt, IsString } from 'class-validator';

export class AddToBankDto {
  @IsInt()
  lessonId!: number;

  @IsString()
  question!: string;
}
