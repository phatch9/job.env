import { useApplications } from '@/hooks/useApplications';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';

export default function DashboardPage() {
  const { applications, loading } = useApplications();

  const stats = {
    total: applications.length,
    wishlist: applications.filter((app) => app.status === 'wishlist').length,
    applied: applications.filter((app) => app.status === 'applied').length,
    interview: applications.filter((app) => app.status === 'interview').length,
    offer: applications.filter((app) => app.status === 'offer').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">
            Track your job application progress
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Wishlist</p>
            <p className="stat-value">{stats.wishlist}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <p className="stat-label">Applied</p>
            <p className="stat-value">{stats.applied}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <p className="stat-label">Interviews</p>
            <p className="stat-value">{stats.interview}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <p className="stat-label">Offers</p>
            <p className="stat-value">{stats.offer}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <p className="stat-label">Rejected</p>
            <p className="stat-value">{stats.rejected}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <UpcomingReminders />
      </div>

      {applications.length === 0 && (
        <div className="empty-state glass-card">
          <div className="empty-icon">🚀</div>
          <h2>Get Started</h2>
          <p className="text-secondary">
            Start tracking your job applications by adding your first company and application
          </p>
          <div className="quick-actions">
            <a href="/companies" className="btn btn-primary">
              Add Company
            </a>
            <a href="/applications" className="btn btn-secondary">
              Add Application
            </a>
          </div>
        </div>
      )}

      <style>{`
        .page-container {
          min-height: 100vh;
          padding: var(--spacing-xl);
        }

        .page-header {
          margin-bottom: var(--spacing-xl);
        }

        .page-header h1 {
          margin-bottom: var(--spacing-xs);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-xl);
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          max-width: 500px;
          margin: var(--spacing-2xl) auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state .btn {
          margin-top: var(--spacing-lg);
        }

        .quick-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
          justify-content: center;
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
      `}</style>
    </div>
  );
}
