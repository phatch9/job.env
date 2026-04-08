/**
 * Structured job evaluation for the AI pipeline.
 * All entrypoints (slash commands, batch, future UI) should persist the same shape in `applications.evaluation`
 * and keep derived columns (fit_score, fit_grade, recommend_apply) in sync via deriveEvaluationFields().
 */

export const EVALUATION_RUBRIC_VERSION = '2026.1';

/** Weighted mean ≥ this ⇒ recommend applying (stored as recommend_apply). */
export const RECOMMENDED_APPLY_MIN_SCORE = 4;

export type FitGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface RubricDimension {
    id: string;
    label: string;
    weight: number;
}

/** Ten weighted criteria (weights sum to 1). Adjust labels in a new rubric version, not ad hoc in prompts. */
export const RUBRIC_DIMENSIONS: readonly RubricDimension[] = [
    { id: 'cv_alignment', label: 'CV & experience alignment', weight: 0.1 },
    { id: 'salary_compensation', label: 'Salary & compensation fit', weight: 0.1 },
    { id: 'strategic_fit', label: 'Strategic career fit', weight: 0.1 },
    { id: 'role_scope', label: 'Role scope & seniority match', weight: 0.1 },
    { id: 'tech_stack', label: 'Tech / AI stack fit', weight: 0.1 },
    { id: 'career_growth', label: 'Growth & learning opportunity', weight: 0.1 },
    { id: 'leadership_impact', label: 'Leadership & impact scope', weight: 0.1 },
    { id: 'company_stage', label: 'Company stage & culture fit', weight: 0.1 },
    { id: 'location_work_mode', label: 'Location & work mode fit', weight: 0.1 },
    { id: 'risk_dealbreakers', label: 'Risks & dealbreakers (5 = no material concerns)', weight: 0.1 },
] as const;

export type RubricDimensionId = (typeof RUBRIC_DIMENSIONS)[number]['id'];

export interface EvaluationDimensionResult {
    dimension_id: string;
    /** 1–5, higher is better for all dimensions (including risk_dealbreakers). */
    score: number;
    rationale: string;
}

export interface JobEvaluation {
    rubric_version: string;
    profile_context_version?: string;
    dimensions: EvaluationDimensionResult[];
    /** Weighted 1–5; optional if omitted and derived from dimensions. */
    weighted_score?: number;
    summary: string;
    strengths?: string[];
    concerns?: string[];
    /** ISO 8601 timestamp when the model produced this evaluation. */
    evaluated_at: string;
    /** Optional provenance for debugging. */
    model?: string;
}

export interface ApplicationPipelineFields {
    jd_snapshot?: string | null;
    jd_fetched_at?: string | null;
    jd_content_hash?: string | null;

    evaluation?: JobEvaluation | null;
    fit_score?: number | null;
    fit_grade?: FitGrade | null;
    evaluation_rubric_version?: string | null;
    profile_context_version?: string | null;

    tailored_cv_pdf_path?: string | null;
    tailored_cv_pdf_url?: string | null;
    tailored_cv_generated_at?: string | null;

    recommend_apply?: boolean | null;
}

const RUBRIC_IDS = new Set(RUBRIC_DIMENSIONS.map((d) => d.id));
const WEIGHT_BY_ID = Object.fromEntries(RUBRIC_DIMENSIONS.map((d) => [d.id, d.weight])) as Record<
    string,
    number
>;

export function scoreToLetterGrade(score: number): FitGrade {
    if (score >= 4.5) return 'A';
    if (score >= 4) return 'B';
    if (score >= 3) return 'C';
    if (score >= 2) return 'D';
    if (score >= 1) return 'E';
    return 'F';
}

export function computeWeightedScore(dimensions: EvaluationDimensionResult[]): number {
    if (dimensions.length !== RUBRIC_DIMENSIONS.length) {
        throw new Error(
            `Expected ${RUBRIC_DIMENSIONS.length} dimension scores, got ${dimensions.length}`
        );
    }

    const seen = new Set<string>();
    let sum = 0;
    for (const row of dimensions) {
        if (!RUBRIC_IDS.has(row.dimension_id)) {
            throw new Error(`Unknown dimension_id: ${row.dimension_id}`);
        }
        if (seen.has(row.dimension_id)) {
            throw new Error(`Duplicate dimension_id: ${row.dimension_id}`);
        }
        seen.add(row.dimension_id);
        if (row.score < 1 || row.score > 5) {
            throw new Error(`Score out of range [1,5] for ${row.dimension_id}: ${row.score}`);
        }
        sum += row.score * WEIGHT_BY_ID[row.dimension_id]!;
    }

    if (seen.size !== RUBRIC_DIMENSIONS.length) {
        throw new Error('Missing one or more rubric dimensions');
    }

    return Math.round(sum * 1000) / 1000;
}

export interface DerivedEvaluationFields {
    fit_score: number;
    fit_grade: FitGrade;
    recommend_apply: boolean;
    evaluation_rubric_version: string;
}

/**
 * Computes DB-facing fields from dimension rows. Does not mutate the evaluation object.
 */
export function deriveEvaluationFields(
    dimensions: EvaluationDimensionResult[],
    rubricVersion: string = EVALUATION_RUBRIC_VERSION
): DerivedEvaluationFields {
    const fit_score = computeWeightedScore(dimensions);
    return {
        fit_score,
        fit_grade: scoreToLetterGrade(fit_score),
        recommend_apply: fit_score >= RECOMMENDED_APPLY_MIN_SCORE,
        evaluation_rubric_version: rubricVersion,
    };
}

/**
 * Returns a JobEvaluation with weighted_score filled from dimensions if missing.
 */
export function normalizeJobEvaluation(evaluation: JobEvaluation): JobEvaluation {
    const weighted = evaluation.weighted_score ?? computeWeightedScore(evaluation.dimensions);
    return {
        ...evaluation,
        weighted_score: weighted,
    };
}

/**
 * Lightweight runtime check for agents / CLI before insert.
 */
export function isValidJobEvaluation(value: unknown): value is JobEvaluation {
    if (!value || typeof value !== 'object') return false;
    const o = value as Record<string, unknown>;
    if (typeof o.rubric_version !== 'string' || typeof o.summary !== 'string') return false;
    if (typeof o.evaluated_at !== 'string') return false;
    if (!Array.isArray(o.dimensions)) return false;
    for (const row of o.dimensions) {
        if (!row || typeof row !== 'object') return false;
        const r = row as Record<string, unknown>;
        if (typeof r.dimension_id !== 'string' || typeof r.rationale !== 'string') return false;
        if (typeof r.score !== 'number' || Number.isNaN(r.score)) return false;
    }
    try {
        computeWeightedScore(o.dimensions as EvaluationDimensionResult[]);
    } catch {
        return false;
    }
    return true;
}
