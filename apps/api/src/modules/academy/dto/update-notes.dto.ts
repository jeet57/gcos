import { IsString } from 'class-validator';

export class UpdateNotesDto {
  @IsString()
  personalNotes!: string;
}
