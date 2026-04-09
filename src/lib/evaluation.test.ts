import { describe, it, expect } from 'vitest';
import {
    computeWeightedScore,
    deriveEvaluationFields,
    RECOMMENDED_APPLY_MIN_SCORE,
    RUBRIC_DIMENSIONS,
    scoreToLetterGrade,
    isValidJobEvaluation,
    type EvaluationDimensionResult,
} from './evaluation';

function allDimensions(score: number, rationale = 'x'): EvaluationDimensionResult[] {
    return RUBRIC_DIMENSIONS.map((d) => ({
        dimension_id: d.id,
        score,
        rationale,
    }));
}

describe('computeWeightedScore', () => {
    it('returns the score when all dimensions are equal', () => {
        expect(computeWeightedScore(allDimensions(4))).toBe(4);
        expect(computeWeightedScore(allDimensions(5))).toBe(5);
    });

    it('weights dimensions correctly', () => {
        const dims = RUBRIC_DIMENSIONS.map((d) => ({
            dimension_id: d.id,
            score: d.id === 'cv_alignment' ? 5 : 3,
            rationale: '',
        }));
        expect(computeWeightedScore(dims)).toBe(3.2);
    });

    it('throws on wrong count or unknown id', () => {
        expect(() => computeWeightedScore(allDimensions(4).slice(0, 3))).toThrow();
        expect(() =>
            computeWeightedScore([
                ...allDimensions(4).slice(0, 9),
                { dimension_id: 'nope', score: 4, rationale: '' },
            ])
        ).toThrow();
    });
});

describe('deriveEvaluationFields', () => {
    it('sets recommend_apply from threshold', () => {
        const high = deriveEvaluationFields(allDimensions(4));
        expect(high.recommend_apply).toBe(true);
        expect(high.fit_grade).toBe('B');

        const low = deriveEvaluationFields(allDimensions(3.99));
        expect(low.fit_score).toBe(3.99);
        expect(low.recommend_apply).toBe(false);
        expect(low.fit_grade).toBe('C');
    });

    it('uses RECOMMENDED_APPLY_MIN_SCORE boundary', () => {
        const exact = deriveEvaluationFields(allDimensions(RECOMMENDED_APPLY_MIN_SCORE));
        expect(exact.recommend_apply).toBe(true);
    });
});

describe('scoreToLetterGrade', () => {
    it('maps bands A–F', () => {
        expect(scoreToLetterGrade(4.9)).toBe('A');
        expect(scoreToLetterGrade(4.5)).toBe('A');
        expect(scoreToLetterGrade(4.49)).toBe('B');
        expect(scoreToLetterGrade(4)).toBe('B');
        expect(scoreToLetterGrade(3.5)).toBe('C');
        expect(scoreToLetterGrade(2.5)).toBe('D');
        expect(scoreToLetterGrade(1.5)).toBe('E');
        expect(scoreToLetterGrade(0.5)).toBe('F');
    });
});

describe('isValidJobEvaluation', () => {
    it('accepts a well-formed payload', () => {
        const payload = {
            rubric_version: '2026.1',
            summary: 'Strong fit.',
            evaluated_at: new Date().toISOString(),
            dimensions: allDimensions(4),
        };
        expect(isValidJobEvaluation(payload)).toBe(true);
    });

    it('rejects invalid payloads', () => {
        expect(isValidJobEvaluation(null)).toBe(false);
        expect(isValidJobEvaluation({})).toBe(false);
    });
});
