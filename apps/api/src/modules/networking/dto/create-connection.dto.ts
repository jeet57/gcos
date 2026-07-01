import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

const CONNECTION_TYPES = ['engineer', 'recruiter', 'hiring_manager', 'founder', 'other'] as const;
const CONNECTION_STATUSES = ['sent', 'connected', 'chatting', 'coffee_chat_done', 'referral'] as const;

export class CreateConnectionDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  roleTitle?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsIn(CONNECTION_TYPES)
  connectionType?: (typeof CONNECTION_TYPES)[number];

  @IsOptional()
  @IsIn(CONNECTION_STATUSES)
  status?: (typeof CONNECTION_STATUSES)[number];

  @IsOptional()
  @IsDateString()
  connectedDate?: string;

  @IsOptional()
  @IsBoolean()
  isAtTargetCompany?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
