/**
 * Job application rejection reason taxonomy.
 * Mirrors job_applications.rejection_reason values (M03 / PRD v2 Section 05).
 */
export enum RejectionReason {
  NO_VISA_SPONSORSHIP = 'NO_VISA_SPONSORSHIP',
  EU_ONLY = 'EU_ONLY',
  FRONTEND_ONLY = 'FRONTEND_ONLY',
  NO_PORTFOLIO = 'NO_PORTFOLIO',
  SALARY_MISMATCH = 'SALARY_MISMATCH',
  LANGUAGE_REQUIRED = 'LANGUAGE_REQUIRED',
  OVERQUALIFIED = 'OVERQUALIFIED',
  UNDERQUALIFIED = 'UNDERQUALIFIED',
  BETTER_CANDIDATE = 'BETTER_CANDIDATE',
  ROLE_FILLED = 'ROLE_FILLED',
  GHOSTED = 'GHOSTED',
  OTHER = 'OTHER',
}

export const REJECTION_REASON_LABELS: Record<RejectionReason, string> = {
  [RejectionReason.NO_VISA_SPONSORSHIP]: 'No Visa Sponsorship',
  [RejectionReason.EU_ONLY]: 'EU Candidates Only',
  [RejectionReason.FRONTEND_ONLY]: 'Frontend-Only Profile',
  [RejectionReason.NO_PORTFOLIO]: 'No Portfolio Evidence',
  [RejectionReason.SALARY_MISMATCH]: 'Salary Mismatch',
  [RejectionReason.LANGUAGE_REQUIRED]: 'German Language Required',
  [RejectionReason.OVERQUALIFIED]: 'Overqualified',
  [RejectionReason.UNDERQUALIFIED]: 'Underqualified',
  [RejectionReason.BETTER_CANDIDATE]: 'Better Candidate Selected',
  [RejectionReason.ROLE_FILLED]: 'Role Filled',
  [RejectionReason.GHOSTED]: 'Ghosted — No Response',
  [RejectionReason.OTHER]: 'Other',
};
