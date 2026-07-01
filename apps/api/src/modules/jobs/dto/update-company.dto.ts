import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsBoolean()
  hasSponsoredVisa?: boolean;

  @IsOptional()
  @IsString()
  visaEvidence?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  watchlist?: boolean;
}
