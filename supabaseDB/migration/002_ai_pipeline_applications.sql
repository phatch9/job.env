-- ============================================================================
-- AI JOB PIPELINE — application row extensions
-- Single source of truth for JD snapshot, structured evaluation, tailored CV
-- Run after core_tables.sql (and position_column.sql if used).
-- ============================================================================

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS jd_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS jd_fetched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS jd_content_hash TEXT,

  ADD COLUMN IF NOT EXISTS evaluation JSONB,
  ADD COLUMN IF NOT EXISTS fit_score NUMERIC(4, 3),
  ADD COLUMN IF NOT EXISTS fit_grade TEXT,
  ADD COLUMN IF NOT EXISTS evaluation_rubric_version TEXT,
  ADD COLUMN IF NOT EXISTS profile_context_version TEXT,

  ADD COLUMN IF NOT EXISTS tailored_cv_pdf_path TEXT,
  ADD COLUMN IF NOT EXISTS tailored_cv_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS tailored_cv_generated_at TIMESTAMPTZ,

  ADD COLUMN IF NOT EXISTS recommend_apply BOOLEAN;

COMMENT ON COLUMN applications.jd_snapshot IS 'Fetched job description text (or markdown) used for evaluation';
COMMENT ON COLUMN applications.jd_fetched_at IS 'When jd_snapshot was captured';
COMMENT ON COLUMN applications.jd_content_hash IS 'Optional SHA-256 of canonical JD text for integrity / dedup';

COMMENT ON COLUMN applications.evaluation IS 'Full structured evaluation JSON (dimensions, summary, metadata)';
COMMENT ON COLUMN applications.fit_score IS 'Weighted 1–5 score; recommend_apply uses threshold in app logic (default 4.0)';
COMMENT ON COLUMN applications.fit_grade IS 'Letter grade A–F derived from fit_score';
COMMENT ON COLUMN applications.evaluation_rubric_version IS 'Rubric version string, e.g. 2026.1';
COMMENT ON COLUMN applications.profile_context_version IS 'Profile / onboarding pack version used for this evaluation';

COMMENT ON COLUMN applications.tailored_cv_pdf_path IS 'Storage bucket object path for ATS PDF';
COMMENT ON COLUMN applications.tailored_cv_pdf_url IS 'Public or signed URL when available';
COMMENT ON COLUMN applications.tailored_cv_generated_at IS 'When tailored CV PDF was generated';

COMMENT ON COLUMN applications.recommend_apply IS 'True if system recommends applying (e.g. fit_score >= 4.0)';

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_fit_grade_check;

ALTER TABLE applications
  ADD CONSTRAINT applications_fit_grade_check
  CHECK (fit_grade IS NULL OR fit_grade IN ('A', 'B', 'C', 'D', 'E', 'F'));

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_fit_score_check;

ALTER TABLE applications
  ADD CONSTRAINT applications_fit_score_check
  CHECK (fit_score IS NULL OR (fit_score >= 1 AND fit_score <= 5));

CREATE INDEX IF NOT EXISTS idx_applications_user_fit_score
  ON applications (user_id, fit_score DESC NULLS LAST)
  WHERE fit_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_applications_user_recommend_apply
  ON applications (user_id, recommend_apply)
  WHERE recommend_apply IS NOT NULL;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'AI pipeline columns on applications applied at %', NOW();
END $$;
