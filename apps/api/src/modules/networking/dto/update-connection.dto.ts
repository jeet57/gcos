import { IsBoolean, IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

const CONNECTION_STATUSES = ['sent', 'connected', 'chatting', 'coffee_chat_done', 'referral'] as const;

export class UpdateConnectionDto {
  @IsOptional()
  @IsIn(CONNECTION_STATUSES)
  status?: (typeof CONNECTION_STATUSES)[number];

  @IsOptional()
  @IsDateString()
  lastInteraction?: string;

  @IsOptional()
  @IsBoolean()
  isAtTargetCompany?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
