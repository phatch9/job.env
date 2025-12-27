import { Application } from '@/lib/types';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '@/lib/constants';
import { format } from 'date-fns';

interface ApplicationCardProps {
    application: Application;
    onEdit?: (application: Application) => void;
    onDelete?: (id: string) => void;
}

export default function ApplicationCard({
    application,
    onEdit,
    onDelete,
}: ApplicationCardProps) {
    const statusColor = STATUS_COLORS[application.status];

    return (
        <div className="application-card glass-card">
            <div className="card-status-bar" style={{ backgroundColor: statusColor }} />

            <div className="card-header">
                <div>
                    <h3 className="card-title">{application.position}</h3>
                    <p className="card-company">
                        {application.company?.name || 'Unknown Company'}
                    </p>
                </div>
                <div className="card-actions">
                    {onEdit && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onEdit(application)}
                            title="Edit application"
                        >
                            ✏️
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onDelete(application.id)}
                            title="Delete application"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <div className="card-body">
                {application.location && (
                    <div className="card-info">
                        <span className="info-icon">📍</span>
                        <span className="text-sm">{application.location}</span>
                    </div>
                )}

                {application.salary && (
                    <div className="card-info">
                        <span className="info-icon">💰</span>
                        <span className="text-sm">
                            ${application.salary.toLocaleString()}
                        </span>
                    </div>
                )}

                {application.applied_date && (
                    <div className="card-info">
                        <span className="info-icon">📅</span>
                        <span className="text-sm text-tertiary">
                            Applied {format(new Date(application.applied_date), 'MMM dd, yyyy')}
                        </span>
                    </div>
                )}

                {application.job_url && (
                    <a
                        href={application.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                    >
                        View Job Posting →
                    </a>
                )}
            </div>

            <div className="card-footer">
                <span
                    className="badge"
                    style={{ backgroundColor: statusColor }}
                >
                    {STATUS_ICONS[application.status]} {STATUS_LABELS[application.status]}
                </span>
            </div>

            <style>{`
        .application-card {
          position: relative;
          padding: var(--spacing-lg);
          cursor: pointer;
          overflow: hidden;
          min-height: 180px;
          display: flex;
          flex-direction: column;
        }

        .card-status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
          padding-top: var(--spacing-xs);
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .card-company {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .card-actions {
          display: flex;
          gap: var(--spacing-xs);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .application-card:hover .card-actions {
          opacity: 1;
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .card-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .info-icon {
          font-size: 0.875rem;
        }

        .card-link {
          font-size: 0.875rem;
          color: var(--accent-secondary);
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: color var(--transition-fast);
        }

        .card-link:hover {
          color: var(--accent-primary);
        }

        .card-footer {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--glass-border);
        }
      `}</style>
        </div>
    );
}
