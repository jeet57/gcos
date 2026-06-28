-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('saved', 'applied', 'screening', 'tech_interview', 'take_home', 'final_interview', 'offer', 'rejected');

-- CreateEnum
CREATE TYPE "RejectionReasonCode" AS ENUM ('NO_VISA_SPONSORSHIP', 'EU_ONLY', 'FRONTEND_ONLY', 'NO_PORTFOLIO', 'SALARY_MISMATCH', 'LANGUAGE_REQUIRED', 'OVERQUALIFIED', 'UNDERQUALIFIED', 'BETTER_CANDIDATE', 'ROLE_FILLED', 'GHOSTED', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationSource" AS ENUM ('linkedin', 'company_site', 'xing', 'referral', 'recruiter', 'other');

-- CreateEnum
CREATE TYPE "CompanySizeBucket" AS ENUM ('startup', 'mid', 'enterprise', 'consulting');

-- CreateEnum
CREATE TYPE "LessonContentType" AS ENUM ('lesson', 'exercise', 'quiz', 'interview_qa', 'revision_sheet');

-- CreateEnum
CREATE TYPE "ContentTier" AS ENUM ('MVP', 'V2', 'V3');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "WeekTaskStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "TopicImportance" AS ENUM ('critical', 'high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "QuizOption" AS ENUM ('a', 'b', 'c', 'd');

-- CreateEnum
CREATE TYPE "GermanLevel" AS ENUM ('A1', 'A2');

-- CreateEnum
CREATE TYPE "GermanSessionType" AS ENUM ('duolingo', 'dw_course', 'italki', 'speaking_practice', 'reading', 'writing', 'watching');

-- CreateEnum
CREATE TYPE "AiTool" AS ENUM ('claude_code', 'cursor', 'mcp', 'openai_api', 'vercel_ai_sdk', 'other');

-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('engineer', 'recruiter', 'hiring_manager', 'founder', 'other');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('sent', 'connected', 'chatting', 'coffee_chat_done', 'referral');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('not_started', 'in_progress', 'feature_complete', 'deployed', 'case_study_done');

-- CreateEnum
CREATE TYPE "MilestoneCategory" AS ENUM ('backend', 'frontend', 'testing', 'deployment', 'documentation', 'performance');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');

-- CreateEnum
CREATE TYPE "InterviewFormat" AS ENUM ('phone', 'video', 'technical', 'system_design', 'take_home', 'final', 'hr');

-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('passed', 'failed', 'waiting', 'cancelled');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('javascript', 'typescript', 'react', 'nodejs', 'nestjs', 'postgresql', 'docker', 'system_design', 'ai_tooling', 'behavioural', 'german');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('not_tried', 'practiced', 'confident');

-- CreateEnum
CREATE TYPE "VisaDocumentCategory" AS ENUM ('education', 'identity', 'employment', 'financial', 'other');

-- CreateEnum
CREATE TYPE "VisaDocumentStatus" AS ENUM ('not_started', 'gathering', 'in_progress', 'ready', 'submitted');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refresh_token_hash" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Jitendra Mishra',
    "avatar_url" TEXT,
    "target_country" TEXT NOT NULL DEFAULT 'Germany',
    "target_role" TEXT NOT NULL DEFAULT 'Senior Full-Stack Engineer',
    "plan_start_date" DATE NOT NULL,
    "target_end_date" DATE NOT NULL,
    "weekly_study_target_hours" DECIMAL(4,1) NOT NULL DEFAULT 17.5,
    "weekly_application_target" INTEGER NOT NULL DEFAULT 20,
    "weekly_german_minutes_target" INTEGER NOT NULL DEFAULT 210,
    "weekly_ai_sessions_target" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_domains" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL,
    "primary_month" INTEGER NOT NULL,
    "color_hex" TEXT NOT NULL,
    "icon" TEXT,
    "academy_module_id" INTEGER,

    CONSTRAINT "study_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_topics" (
    "id" SERIAL NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_skip" BOOLEAN NOT NULL DEFAULT false,
    "importance" "TopicImportance",
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skill_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_modules" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "estimated_hours" DECIMAL(4,1),

    CONSTRAINT "academy_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_lessons" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "lesson_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_type" "LessonContentType" NOT NULL,
    "content_md" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "tier" "ContentTier" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "prerequisites" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "academy_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_months" (
    "id" SERIAL NOT NULL,
    "month_number" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "phase_name" TEXT NOT NULL,
    "primary_domain_id" INTEGER,
    "hours_per_week" DECIMAL(4,1) NOT NULL,
    "german_target" TEXT NOT NULL,
    "milestone_description" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "plan_months_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_weeks" (
    "id" SERIAL NOT NULL,
    "month_id" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL,
    "tasks_summary" TEXT NOT NULL,
    "deliverable" TEXT NOT NULL,
    "domain_ids" INTEGER[],
    "german_focus" TEXT NOT NULL,

    CONSTRAINT "plan_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "german_units" (
    "id" SERIAL NOT NULL,
    "level" "GermanLevel" NOT NULL,
    "unit_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "target_month" INTEGER NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'not_started',
    "completed_date" DATE,

    CONSTRAINT "german_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_documents" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "document_name" TEXT NOT NULL,
    "description" TEXT,
    "category" "VisaDocumentCategory" NOT NULL,
    "is_required_for_blue_card" BOOLEAN NOT NULL DEFAULT true,
    "status" "VisaDocumentStatus" NOT NULL DEFAULT 'not_started',
    "notes" TEXT,
    "due_date" DATE,
    "completed_date" DATE,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "visa_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_projects" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tech_stack" TEXT[],
    "github_url" TEXT,
    "live_url" TEXT,
    "planned_start" DATE,
    "planned_end" DATE,
    "actual_start" DATE,
    "actual_end" DATE,
    "overall_status" "ProjectStatus" NOT NULL DEFAULT 'not_started',
    "lighthouse_lcp" DECIMAL(5,2),
    "lighthouse_fcp" DECIMAL(5,2),
    "lighthouse_cls" DECIMAL(5,3),
    "test_coverage_pct" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "ai_tools_used" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "portfolio_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "MilestoneCategory" NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'not_started',
    "planned_date" DATE,
    "completed_date" DATE,
    "deliverable_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "topic_id" INTEGER,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_minutes" INTEGER NOT NULL,
    "resource_type" TEXT,
    "resource_name" TEXT,
    "resource_url" TEXT,
    "topics_covered" TEXT,
    "notes" TEXT,
    "energy_level" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lesson_progress" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "time_spent_min" INTEGER NOT NULL DEFAULT 0,
    "personal_notes" TEXT,

    CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_completions" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "completion_pct" INTEGER NOT NULL DEFAULT 0,
    "status" "LessonStatus" NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "topic_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_task_completions" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "week_id" INTEGER NOT NULL,
    "status" "WeekTaskStatus" NOT NULL DEFAULT 'not_started',
    "completion_notes" TEXT,
    "deliverable_url" TEXT,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "week_task_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_option" "QuizOption" NOT NULL,
    "explanation" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "score_pct" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "correct_count" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "german_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_type" "GermanSessionType" NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "dw_unit_id" INTEGER,
    "resource_name" TEXT,
    "vocabulary_count" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "german_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tool_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tool" "AiTool" NOT NULL,
    "task_description" TEXT NOT NULL,
    "duration_minutes" INTEGER,
    "outcome" TEXT,
    "prompt_saved" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_tool_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "german_word" TEXT NOT NULL,
    "english_meaning" TEXT NOT NULL,
    "example_sentence" TEXT,
    "german_session_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Germany',
    "size_bucket" "CompanySizeBucket",
    "sector" TEXT,
    "website_url" TEXT,
    "linkedin_url" TEXT,
    "careers_url" TEXT,
    "has_sponsored_visa" BOOLEAN NOT NULL DEFAULT false,
    "visa_evidence" TEXT,
    "employee_count" INTEGER,
    "notes" TEXT,
    "watchlist" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "role_title" TEXT NOT NULL,
    "job_url" TEXT,
    "source" "ApplicationSource",
    "applied_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stage" "PipelineStage" NOT NULL DEFAULT 'saved',
    "follow_up_date" DATE,
    "salary_offered" INTEGER,
    "salary_negotiated" INTEGER,
    "visa_sponsorship_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "rejection_reason" "RejectionReasonCode",
    "rejection_notes" TEXT,
    "cover_letter_version" TEXT,
    "notes" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_logs" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "interview_date" DATE NOT NULL,
    "round_number" INTEGER NOT NULL DEFAULT 1,
    "format" "InterviewFormat",
    "interviewer_name" TEXT,
    "interviewer_role" TEXT,
    "duration_minutes" INTEGER,
    "questions_asked" TEXT[],
    "my_answers_notes" TEXT,
    "outcome" "InterviewOutcome",
    "feedback_received" TEXT,
    "my_rating" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "take_home_assignments" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "received_date" DATE NOT NULL,
    "due_date" DATE,
    "spec_summary" TEXT NOT NULL,
    "submitted_url" TEXT,
    "outcome" "InterviewOutcome",
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "take_home_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "difficulty" "QuestionDifficulty",
    "status" "QuestionStatus" NOT NULL DEFAULT 'not_tried',
    "my_answer" TEXT,
    "source" TEXT,
    "source_lesson_id" INTEGER,
    "last_practiced" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_interview_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "mock_date" DATE NOT NULL,
    "format" "InterviewFormat",
    "partner_name" TEXT,
    "questions_asked" TEXT[],
    "feedback" TEXT,
    "self_rating" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_interview_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_connections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "company_id" UUID,
    "role_title" TEXT,
    "city" TEXT,
    "linkedin_url" TEXT,
    "connection_type" "ConnectionType",
    "status" "ConnectionStatus" NOT NULL DEFAULT 'sent',
    "connected_date" DATE,
    "last_interaction" DATE,
    "notes" TEXT,
    "is_at_target_company" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "network_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coffee_chats" (
    "id" UUID NOT NULL,
    "connection_id" UUID NOT NULL,
    "chat_date" DATE NOT NULL,
    "key_insights" TEXT,
    "follow_up_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coffee_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "published_date" DATE NOT NULL,
    "topic" TEXT NOT NULL,
    "post_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readiness_scores" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "recorded_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overall_score" INTEGER NOT NULL,
    "study_score" INTEGER NOT NULL,
    "application_score" INTEGER NOT NULL,
    "portfolio_score" INTEGER NOT NULL,
    "german_score" INTEGER NOT NULL,
    "domain_score" INTEGER NOT NULL,
    "interview_score" INTEGER NOT NULL,
    "academy_score" INTEGER,
    "ai_tooling_score" INTEGER,

    CONSTRAINT "readiness_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_reviews" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "week_start_date" DATE NOT NULL,
    "q1_technical" TEXT,
    "q2_code" TEXT,
    "q3_visible_work" TEXT,
    "q4_applications" TEXT,
    "q5_german" TEXT,
    "study_hours_actual" DECIMAL(5,1),
    "applications_sent_actual" INTEGER,
    "german_minutes_actual" INTEGER,
    "readiness_score_snapshot" INTEGER,
    "went_well" TEXT,
    "didnt_go_well" TEXT,
    "next_week_focus" TEXT,
    "overall_rating" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_checkpoints" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "month_number" INTEGER NOT NULL,
    "go_no_go_verdict" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "date_earned" DATE,
    "expiry_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "version_label" TEXT NOT NULL,
    "what_changed" TEXT,
    "file_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "study_domains_slug_key" ON "study_domains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "academy_modules_slug_key" ON "academy_modules"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "academy_lessons_lesson_code_key" ON "academy_lessons"("lesson_code");

-- CreateIndex
CREATE UNIQUE INDEX "plan_months_month_number_key" ON "plan_months"("month_number");

-- CreateIndex
CREATE UNIQUE INDEX "plan_weeks_month_id_week_number_key" ON "plan_weeks"("month_id", "week_number");

-- CreateIndex
CREATE UNIQUE INDEX "german_units_level_unit_number_key" ON "german_units"("level", "unit_number");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_projects_slug_key" ON "portfolio_projects"("slug");

-- CreateIndex
CREATE INDEX "idx_study_user_date" ON "study_sessions"("user_id", "date" DESC);

-- CreateIndex
CREATE INDEX "idx_study_domain" ON "study_sessions"("user_id", "domain_id");

-- CreateIndex
CREATE INDEX "idx_lesson_progress" ON "user_lesson_progress"("user_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_lesson_progress_user_id_lesson_id_key" ON "user_lesson_progress"("user_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "topic_completions_user_id_topic_id_key" ON "topic_completions"("user_id", "topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "week_task_completions_user_id_week_id_key" ON "week_task_completions"("user_id", "week_id");

-- CreateIndex
CREATE INDEX "idx_german_date" ON "german_sessions"("user_id", "session_date" DESC);

-- CreateIndex
CREATE INDEX "idx_apps_stage" ON "job_applications"("user_id", "stage");

-- CreateIndex
CREATE INDEX "idx_apps_followup" ON "job_applications"("user_id", "follow_up_date");

-- CreateIndex
CREATE INDEX "idx_connections_type" ON "network_connections"("user_id", "connection_type");

-- CreateIndex
CREATE INDEX "idx_score_date" ON "readiness_scores"("user_id", "recorded_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "readiness_scores_user_id_recorded_date_key" ON "readiness_scores"("user_id", "recorded_date");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_reviews_week_start_date_key" ON "weekly_reviews"("week_start_date");

-- AddForeignKey
ALTER TABLE "study_domains" ADD CONSTRAINT "study_domains_academy_module_id_fkey" FOREIGN KEY ("academy_module_id") REFERENCES "academy_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_topics" ADD CONSTRAINT "skill_topics_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "study_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "academy_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_months" ADD CONSTRAINT "plan_months_primary_domain_id_fkey" FOREIGN KEY ("primary_domain_id") REFERENCES "study_domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_weeks" ADD CONSTRAINT "plan_weeks_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "plan_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visa_documents" ADD CONSTRAINT "visa_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "portfolio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "study_domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "skill_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "academy_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_completions" ADD CONSTRAINT "topic_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_completions" ADD CONSTRAINT "topic_completions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "skill_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_task_completions" ADD CONSTRAINT "week_task_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_task_completions" ADD CONSTRAINT "week_task_completions_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "plan_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "academy_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "academy_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "german_sessions" ADD CONSTRAINT "german_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "german_sessions" ADD CONSTRAINT "german_sessions_dw_unit_id_fkey" FOREIGN KEY ("dw_unit_id") REFERENCES "german_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tool_sessions" ADD CONSTRAINT "ai_tool_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_entries" ADD CONSTRAINT "vocabulary_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_entries" ADD CONSTRAINT "vocabulary_entries_german_session_id_fkey" FOREIGN KEY ("german_session_id") REFERENCES "german_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_logs" ADD CONSTRAINT "interview_logs_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "take_home_assignments" ADD CONSTRAINT "take_home_assignments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_source_lesson_id_fkey" FOREIGN KEY ("source_lesson_id") REFERENCES "academy_lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_interview_logs" ADD CONSTRAINT "mock_interview_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_connections" ADD CONSTRAINT "network_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_connections" ADD CONSTRAINT "network_connections_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chats" ADD CONSTRAINT "coffee_chats_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "network_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_scores" ADD CONSTRAINT "readiness_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_checkpoints" ADD CONSTRAINT "monthly_checkpoints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
