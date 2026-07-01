import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkedinPostDto {
  @IsDateString()
  publishedDate!: string;

  @IsString()
  topic!: string;

  @IsOptional()
  @IsUrl()
  postUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
