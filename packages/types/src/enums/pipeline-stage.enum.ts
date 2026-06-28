/**
 * Job application pipeline stages.
 * Mirrors the CHECK constraint on job_applications.stage in the Prisma schema (M03).
 */
export enum PipelineStage {
  SAVED = 'saved',
  APPLIED = 'applied',
  SCREENING = 'screening',
  TECH_INTERVIEW = 'tech_interview',
  TAKE_HOME = 'take_home',
  FINAL_INTERVIEW = 'final_interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  [PipelineStage.SAVED]: 'Saved',
  [PipelineStage.APPLIED]: 'Applied',
  [PipelineStage.SCREENING]: 'Screening',
  [PipelineStage.TECH_INTERVIEW]: 'Technical Interview',
  [PipelineStage.TAKE_HOME]: 'Take-Home',
  [PipelineStage.FINAL_INTERVIEW]: 'Final Interview',
  [PipelineStage.OFFER]: 'Offer',
  [PipelineStage.REJECTED]: 'Rejected',
};
