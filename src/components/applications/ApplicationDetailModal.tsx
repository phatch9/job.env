import { Application } from '@/lib/types';
import Modal from '@/components/Modal';
import ApplicationTimeline from './ApplicationTimeline';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '@/lib/constants';
import { scoreToLetterGrade } from '@/lib/evaluation';
import { format } from 'date-fns';

interface ApplicationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application;
    onEdit: () => void;
}

export default function ApplicationDetailModal({ isOpen, onClose, application, onEdit }: ApplicationDetailModalProps) {
    if (!application) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${application.position} at ${application.company?.name}`}
        >
            <div className="detail-container">
                <div className="detail-header glass-card">
                    <div className="header-content">
                        <div className="status-badge" style={{ backgroundColor: STATUS_COLORS[application.status] }}>
                            {STATUS_ICONS[application.status]} {STATUS_LABELS[application.status]}
                        </div>
                        <div className="meta-info">
                            {application.location && <span>📍 {application.location}</span>}
                            {application.salary && <span>💰 ${application.salary.toLocaleString()}</span>}
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(); onClose(); }}>
                        Edit Application
                    </button>
                </div>

                <div className="detail-grid">
                    <div className="main-section">
                        {/* Evaluation Section */}
                        {application.fit_score !== null && application.fit_score !== undefined && (
                            <div className="section-card glass-card">
                                <h3 className="section-title">🎯 AI Evaluation</h3>
                                <div className="evaluation-header">
                                    <span
                                        className={`fit-grade-badge grade-${application.fit_grade?.toLowerCase() || scoreToLetterGrade(application.fit_score).toLowerCase()}`}
                                    >
                                        {application.fit_grade || scoreToLetterGrade(application.fit_score)}
                                    </span>
                                    <div className="fit-score-display">
                                        <span className="score-value">{application.fit_score.toFixed(2)}</span>
                                        <span className="score-label">/ 5.0</span>
                                    </div>
                                    {application.recommend_apply ? (
                                        <span className="recommend-badge recommended">✨ Recommended to Apply</span>
                                    ) : (
                                        <span className="recommend-badge not-recommended">⚠️ Below Threshold</span>
                                    )}
                                </div>
                                {application.evaluation && (
                                    <div className="evaluation-details">
                                        <p className="evaluation-summary">{application.evaluation.summary}</p>
                                        {application.evaluation.strengths && application.evaluation.strengths.length > 0 && (
                                            <div className="evaluation-list">
                                                <h4>Strengths</h4>
                                                <ul>
                                                    {application.evaluation.strengths.map((s, i) => (
                                                        <li key={i}>{s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {application.evaluation.concerns && application.evaluation.concerns.length > 0 && (
                                            <div className="evaluation-list concerns">
                                                <h4>Concerns</h4>
                                                <ul>
                                                    {application.evaluation.concerns.map((c, i) => (
                                                        <li key={i}>{c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* JD Snapshot Section */}
                        {application.jd_snapshot && (
                            <div className="section-card glass-card">
                                <div className="section-header">
                                    <h3 className="section-title">📄 Job Description Snapshot</h3>
                                    {application.jd_fetched_at && (
                                        <span className="timestamp">
                                            Fetched {format(new Date(application.jd_fetched_at), 'MMM dd, yyyy HH:mm')}
                                        </span>
                                    )}
                                </div>
                                <div className="jd-content">
                                    <pre className="jd-text">{application.jd_snapshot}</pre>
                                </div>
                            </div>
                        )}

                        {/* Tailored CV Download */}
                        {application.tailored_cv_pdf_url && (
                            <div className="section-card glass-card">
                                <h3 className="section-title">📄 Tailored CV</h3>
                                <a
                                    href={application.tailored_cv_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    Download Tailored CV
                                </a>
                                {application.tailored_cv_generated_at && (
                                    <span className="timestamp">
                                        Generated {format(new Date(application.tailored_cv_generated_at), 'MMM dd, yyyy HH:mm')}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="timeline-section">
                        <ApplicationTimeline application={application} />
                    </div>
                </div>
            </div>

            <style>{`
                .detail-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-md);
                }

                .header-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .meta-info {
                    display: flex;
                    gap: var(--spacing-md);
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    color: white;
                    align-self: flex-start;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: var(--spacing-lg);
                }

                @media (max-width: 900px) {
                    .detail-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .main-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .section-card {
                    padding: var(--spacing-lg);
                }

                .section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-md);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }

                .timestamp {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }

                .evaluation-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--spacing-md);
                }

                .fit-grade-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;
                    height: 3rem;
                    border-radius: var(--radius-lg);
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: white;
                }

                .fit-grade-badge.grade-a {
                    background-color: var(--accent-success);
                }

                .fit-grade-badge.grade-b {
                    background-color: var(--accent-secondary);
                }

                .fit-grade-badge.grade-c {
                    background-color: var(--accent-warning);
                }

                .fit-grade-badge.grade-d,
                .fit-grade-badge.grade-e {
                    background-color: var(--accent-error);
                }

                .fit-grade-badge.grade-f {
                    background-color: var(--text-tertiary);
                }

                .fit-score-display {
                    display: flex;
                    align-items: baseline;
                    gap: var(--spacing-xs);
                }

                .score-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .score-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .recommend-badge {
                    font-size: 0.875rem;
                    font-weight: 500;
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius-md);
                }

                .recommend-badge.recommended {
                    color: var(--accent-success);
                    background-color: rgba(0, 255, 100, 0.1);
                }

                .recommend-badge.not-recommended {
                    color: var(--accent-warning);
                    background-color: rgba(255, 200, 0, 0.1);
                }

                .evaluation-details {
                    margin-top: var(--spacing-md);
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--glass-border);
                }

                .evaluation-summary {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: var(--spacing-md);
                }

                .evaluation-list {
                    margin-top: var(--spacing-md);
                }

                .evaluation-list h4 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }

                .evaluation-list ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .evaluation-list li {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    padding-left: var(--spacing-md);
                    position: relative;
                    margin-bottom: var(--spacing-xs);
                }

                .evaluation-list li::before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: var(--accent-primary);
                }

                .evaluation-list.concerns li::before {
                    color: var(--accent-warning);
                }

                .jd-content {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .jd-text {
                    font-family: inherit;
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: var(--text-secondary);
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin: 0;
                }
            `}</style>
        </Modal>
    );
}
