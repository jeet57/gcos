import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  germanWord!: string;

  @IsString()
  englishMeaning!: string;

  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @IsOptional()
  @IsUUID()
  germanSessionId?: string;
}
