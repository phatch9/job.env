import { JobEvaluation, RUBRIC_DIMENSIONS } from '@/lib/evaluation';

interface EvaluationRadarChartProps {
    evaluation: JobEvaluation;
    size?: number;
}

export default function EvaluationRadarChart({ evaluation, size = 300 }: EvaluationRadarChartProps) {
    const dimensions = evaluation.dimensions;
    const count = RUBRIC_DIMENSIONS.length;
    const center = size / 2;
    const radius = (size / 2) - 40;
    const angleStep = (2 * Math.PI) / count;

    // Calculate points for each dimension
    const getPoint = (index: number, score: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (score / 5) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Generate polygon points
    const polygonPoints = dimensions.map((d, i) => {
        const point = getPoint(i, d.score);
        return `${point.x},${point.y}`;
    }).join(' ');

    // Generate grid circles (for scores 1-5)
    const gridCircles = [1, 2, 3, 4, 5].map(score => {
        const r = (score / 5) * radius;
        return (
            <circle
                key={score}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="1"
                strokeDasharray={score === 5 ? undefined : "4,4"}
            />
        );
    });

    // Generate axis lines and labels
    const axes = RUBRIC_DIMENSIONS.map((dim, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const endX = center + radius * Math.cos(angle);
        const endY = center + radius * Math.sin(angle);
        const labelR = radius + 25;
        const labelX = center + labelR * Math.cos(angle);
        const labelY = center + labelR * Math.sin(angle);

        // Shorten labels for display
        const shortLabels: Record<string, string> = {
            'cv_alignment': 'CV Fit',
            'salary_compensation': 'Compensation',
            'strategic_fit': 'Strategic Fit',
            'role_scope': 'Role Match',
            'tech_stack': 'Tech Stack',
            'career_growth': 'Growth',
            'leadership_impact': 'Impact',
            'company_stage': 'Culture Fit',
            'location_work_mode': 'Location',
            'risk_dealbreakers': 'Risk Level',
        };

        return (
            <g key={dim.id}>
                <line
                    x1={center}
                    y1={center}
                    x2={endX}
                    y2={endY}
                    stroke="var(--glass-border)"
                    strokeWidth="1"
                />
                <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="var(--text-secondary)"
                    style={{ fontWeight: 500 }}
                >
                    {shortLabels[dim.id] || dim.label}
                </text>
                {/* Score label on the polygon edge */}
                <text
                    x={endX}
                    y={endY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="var(--text-tertiary)"
                    dy={-8}
                >
                    {dimensions[i]?.score}
                </text>
            </g>
        );
    });

    return (
        <div className="radar-chart-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid circles */}
                {gridCircles}

                {/* Axes and labels */}
                {axes}

                {/* Data polygon */}
                <polygon
                    points={polygonPoints}
                    fill="var(--accent-primary)"
                    fillOpacity="0.3"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                />

                {/* Data points */}
                {dimensions.map((d, i) => {
                    const point = getPoint(i, d.score);
                    return (
                        <circle
                            key={d.dimension_id}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="var(--accent-secondary)"
                            stroke="var(--bg-primary)"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Center point */}
                <circle
                    cx={center}
                    cy={center}
                    r="3"
                    fill="var(--text-tertiary)"
                />
            </svg>

            {/* Score legend */}
            <div className="radar-legend">
                {dimensions.map((d) => (
                    <div key={d.dimension_id} className="legend-item">
                        <span className="legend-score">{d.score}</span>
                        <span className="legend-label">
                            {RUBRIC_DIMENSIONS.find(r => r.id === d.dimension_id)?.label || d.dimension_id}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                .radar-chart-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-lg);
                }

                .radar-legend {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-sm) var(--spacing-md);
                    width: 100%;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    font-size: 0.75rem;
                }

                .legend-score {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: var(--radius-sm);
                    background-color: var(--glass-bg);
                    color: var(--text-primary);
                    font-weight: 600;
                    font-size: 0.75rem;
                }

                .legend-label {
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
}
