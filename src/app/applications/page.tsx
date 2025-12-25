import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { Application, ApplicationStatus } from '@/lib/types';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '@/lib/constants';
import { format } from 'date-fns';
import ApplicationForm from '@/components/ApplicationForm';

export default function ApplicationsPage() {
    const { applications, deleteApplication, loading } = useApplications();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | undefined>();
    const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleEdit = (application: Application) => {
        setEditingApplication(application);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteApplication(id);
            } catch (error) {
                console.error('Failed to delete application:', error);
                alert('Failed to delete application');
            }
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingApplication(undefined);
    };

    // Filter and search applications
    const filteredApplications = applications.filter((app) => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesSearch =
            searchQuery === '' ||
            app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.company?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    <div className="spinner" />
                    <p className="text-secondary">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Applications</h1>
                    <p className="text-secondary">
                        View and manage all your job applications
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                    <span>➕</span>
                    <span>Add Application</span>
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-icon">📝</div>
                    <h2>No Applications Yet</h2>
                    <p className="text-secondary">
                        Start tracking your job applications by adding your first one
                    </p>
                    <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                        Add Your First Application
                    </button>
                </div>
            ) : (
                <>
                    <div className="filters-bar glass-card">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by position or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="status-filters">
                            <button
                                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All ({applications.length})
                            </button>
                            {Object.entries(STATUS_LABELS).map(([status, label]) => {
                                const count = applications.filter((app) => app.status === status).length;
                                return (
                                    <button
                                        key={status}
                                        className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                                        onClick={() => setFilterStatus(status as ApplicationStatus)}
                                    >
                                        {STATUS_ICONS[status as ApplicationStatus]} {label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                        <div className="no-results glass-card">
                            <p className="text-secondary">No applications match your filters</p>
                        </div>
                    ) : (
                        <div className="applications-table glass-card">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Location</th>
                                        <th>Salary</th>
                                        <th>Applied</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id}>
                                            <td className="position-cell">
                                                <strong>{app.position}</strong>
                                                {app.job_url && (
                                                    <a
                                                        href={app.job_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="job-link"
                                                    >
                                                        🔗
                                                    </a>
                                                )}
                                            </td>
                                            <td>{app.company?.name || 'Unknown'}</td>
                                            <td>
                                                <span
                                                    className="status-badge"
                                                    style={{ backgroundColor: STATUS_COLORS[app.status] }}
                                                >
                                                    {STATUS_ICONS[app.status]} {STATUS_LABELS[app.status]}
                                                </span>
                                            </td>
                                            <td>{app.location || '-'}</td>
                                            <td>{app.salary ? `$${app.salary.toLocaleString()}` : '-'}</td>
                                            <td>
                                                {app.applied_date
                                                    ? format(new Date(app.applied_date), 'MMM dd, yyyy')
                                                    : '-'}
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleEdit(app)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleDelete(app.id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <ApplicationForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                application={editingApplication}
            />

            <style>{`
        .page-container {
          min-height: 100vh;
          padding: var(--spacing-xl);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
        }

        .page-header h1 {
          margin-bottom: var(--spacing-xs);
        }

        .page-header .btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .filters-bar {
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .search-box {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all var(--transition-base);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .status-filters {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          border-color: transparent;
        }

        .applications-table {
          padding: 0;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: var(--glass-bg);
          border-bottom: 2px solid var(--glass-border);
        }

        th {
          padding: var(--spacing-md) var(--spacing-lg);
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--glass-border);
          color: var(--text-secondary);
        }

        tbody tr {
          transition: background-color var(--transition-fast);
        }

        tbody tr:hover {
          background: var(--glass-bg);
        }

        .position-cell {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .position-cell strong {
          color: var(--text-primary);
        }

        .job-link {
          font-size: 0.875rem;
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }

        .job-link:hover {
          opacity: 1;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .actions-cell {
          display: flex;
          gap: var(--spacing-xs);
        }

        .empty-state,
        .no-results {
          text-align: center;
          padding: var(--spacing-2xl);
          max-width: 500px;
          margin: var(--spacing-2xl) auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state h2 {
          margin-bottom: var(--spacing-md);
        }

        .empty-state .btn {
          margin-top: var(--spacing-lg);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: var(--spacing-lg);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .page-header .btn {
            width: 100%;
          }

          .search-box {
            max-width: 100%;
          }

          .applications-table {
            font-size: 0.875rem;
          }

          th,
          td {
            padding: var(--spacing-sm) var(--spacing-md);
          }
        }
      `}</style>
        </div>
    );
}
