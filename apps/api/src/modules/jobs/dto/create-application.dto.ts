import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

const APPLICATION_SOURCES = ['linkedin', 'company_site', 'xing', 'referral', 'recruiter', 'other'] as const;

/**
 * Create an application. Company is resolved by lookup-or-create:
 * pass `companyId` if the company already exists (e.g. selected from
 * autocomplete), or `companyName` (+ optional city/country) to create
 * a new one — JobsService reuses an existing company by exact name
 * match before creating (M13 plan note).
 */
export class CreateApplicationDto {
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyCity?: string;

  @IsOptional()
  @IsString()
  companyCountry?: string;

  @IsString()
  roleTitle!: string;

  @IsOptional()
  @IsString()
  jobUrl?: string;

  @IsOptional()
  @IsIn(APPLICATION_SOURCES)
  source?: (typeof APPLICATION_SOURCES)[number];

  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsBoolean()
  visaSponsorshipConfirmed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryOffered?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
