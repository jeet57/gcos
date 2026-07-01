/**
 * Job pipeline API shapes.
 * Added in M05 (Shared Packages) — populated by JobsService in M09-M10.
 *
 * Client-facing DTOs mirroring the `companies` / `job_applications` tables.
 * Flattened to camelCase plain objects (no Prisma Decimal/Date instances)
 * since these cross the network boundary as JSON.
 */
import type { PipelineStage, RejectionReason } from '../enums/index.js';

export interface CompanyDto {
  id: string;
  name: string;
  city: string;
  country: string;
  sizeBucket: string | null;
  sector: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  careersUrl: string | null;
  hasSponsoredVisa: boolean;
  employeeCount: number | null;
  watchlist: boolean;
}

export interface JobApplicationDto {
  id: string;
  company: CompanyDto;
  roleTitle: string;
  jobUrl: string | null;
  appliedDate: string;
  stage: PipelineStage;
  followUpDate: string | null;
  salaryOffered: number | null;
  salaryNegotiated: number | null;
  visaSponsorshipConfirmed: boolean;
  rejectionReason: RejectionReason | null;
  rejectionNotes: string | null;
  notes: string | null;
  updatedAt: string;
}
