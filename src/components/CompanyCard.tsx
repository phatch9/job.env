import { Company } from '@/lib/types';

interface CompanyCardProps {
    company: Company;
    applicationCount?: number;
    onEdit?: (company: Company) => void;
    onDelete?: (id: string) => void;
}

export default function CompanyCard({
    company,
    applicationCount = 0,
    onEdit,
    onDelete,
}: CompanyCardProps) {
    return (
        <div className="company-card glass-card">
            <div className="card-header">
                <div>
                    <h3 className="card-title">{company.name}</h3>
                    {company.location && (
                        <p className="card-location">
                            <span>📍</span> {company.location}
                        </p>
                    )}
                </div>
                <div className="card-actions">
                    {onEdit && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onEdit(company)}
                            title="Edit company"
                        >
                            ✏️
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onDelete(company.id)}
                            title="Delete company"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            {company.description && (
                <p className="card-description">{company.description}</p>
            )}

            <div className="card-footer">
                {company.website && (
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                    >
                        🌐 Visit Website
                    </a>
                )}
                <span className="badge badge-secondary">
                    {applicationCount} {applicationCount === 1 ? 'Application' : 'Applications'}
                </span>
            </div>

            <style>{`
        .company-card {
          padding: var(--spacing-lg);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
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

        .company-card:hover .card-actions {
          opacity: 1;
        }

        .card-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--glass-border);
        }

        .card-link {
          font-size: 0.875rem;
          color: var(--accent-secondary);
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: color var(--transition-fast);
        }

        .card-link:hover {
          color: var(--accent-primary);
        }
      `}</style>
        </div>
    );
}
