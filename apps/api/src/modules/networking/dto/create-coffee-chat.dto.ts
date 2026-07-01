import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCoffeeChatDto {
  @IsDateString()
  chatDate!: string;

  @IsOptional()
  @IsString()
  keyInsights?: string;

  @IsOptional()
  @IsString()
  followUpNotes?: string;
}
