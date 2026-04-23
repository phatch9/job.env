import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';

export default function DashboardPage() {
  const { applications, loading } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/applications?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = {
    total: applications.length,
    wishlist: applications.filter((app) => app.status === 'wishlist').length,
    applied: applications.filter((app) => app.status === 'applied').length,
    interview: applications.filter((app) => app.status === 'interview').length,
    offer: applications.filter((app) => app.status === 'offer').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
  };

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

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
      <div className="dashboard-layout">
        {/* Main Content */}
        <div className="main-col">
          <div className="dashboard-header">
            <div className="welcome-text">
              <h1>Good evening</h1>
              <p className="text-secondary">Here's what's happening with your job search today.</p>
            </div>
            
            <form className="quick-search glass" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Quick search applications..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Stats Overview */}
          <div className="stats-strip">
            <div className="stat-item glass-card">
              <span className="stat-label">Total</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item glass-card">
              <span className="stat-label">Interviews</span>
              <span className="stat-value text-accent-secondary">{stats.interview}</span>
            </div>
            <div className="stat-item glass-card">
              <span className="stat-label">Offers</span>
              <span className="stat-value text-accent-success">{stats.offer}</span>
            </div>
          </div>

          {/* Pipeline Funnel */}
          <div className="section-row">
            <div className="glass-card funnel-card">
              <h3>Pipeline Funnel</h3>
              <div className="funnel-container">
                <div className="funnel-stage" style={{ width: '100%', opacity: 1 }}>
                  <div className="stage-bar wishlist" style={{ width: `${(stats.wishlist / stats.total) * 100 || 0}%` }}></div>
                  <span className="stage-label">Wishlist <b>{stats.wishlist}</b></span>
                </div>
                <div className="funnel-stage" style={{ width: '90%', opacity: 0.9 }}>
                  <div className="stage-bar applied" style={{ width: `${(stats.applied / stats.total) * 100 || 0}%` }}></div>
                  <span className="stage-label">Applied <b>{stats.applied}</b></span>
                </div>
                <div className="funnel-stage" style={{ width: '80%', opacity: 0.8 }}>
                  <div className="stage-bar interview" style={{ width: `${(stats.interview / stats.total) * 100 || 0}%` }}></div>
                  <span className="stage-label">Interview <b>{stats.interview}</b></span>
                </div>
                <div className="funnel-stage" style={{ width: '70%', opacity: 0.7 }}>
                  <div className="stage-bar offer" style={{ width: `${(stats.offer / stats.total) * 100 || 0}%` }}></div>
                  <span className="stage-label">Offer <b>{stats.offer}</b></span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-row">
            <div className="glass-card activity-card">
              <div className="card-header-wide">
                <h3>Recent Applications</h3>
                <a href="/applications" className="text-sm link-hover">View all</a>
              </div>
              <div className="recent-list">
                {recentApplications.length === 0 ? (
                  <p className="text-secondary text-center py-lg">No applications yet.</p>
                ) : (
                  recentApplications.map(app => (
                    <div key={app.id} className="recent-item">
                      <div className="recent-info">
                        <strong>{app.position}</strong>
                        <span className="text-xs text-secondary">{app.company?.name}</span>
                      </div>
                      <div className="recent-status">
                         <span className="badge" style={{ backgroundColor: STATUS_COLORS[app.status], color: 'white' }}>
                           {STATUS_LABELS[app.status]}
                         </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-col">
          <UpcomingReminders />
          
          <div className="glass-card motivation-card">
             <div className="quote-icon">"</div>
             <p className="quote-text">The only way to do great work is to love what you do.</p>
             <span className="quote-author">— Steve Jobs</span>
          </div>
        </div>
      </div>

      <style>{`
        .page-container {
          padding: var(--spacing-xl);
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: var(--spacing-xl);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          gap: var(--spacing-lg);
        }

        .quick-search {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 300px;
        }

        .quick-search input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
        }

        .stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg);
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
        }

        .text-accent-secondary { color: var(--accent-secondary); }
        .text-accent-success { color: var(--accent-success); }

        .section-row {
          margin-bottom: var(--spacing-xl);
        }

        .funnel-card, .activity-card {
          padding: var(--spacing-xl);
        }

        .funnel-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
          align-items: center;
        }

        .funnel-stage {
          position: relative;
          height: 45px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-md);
          border: 1px solid var(--glass-border);
        }

        .stage-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          opacity: 0.3;
          transition: width 1s ease-out;
        }

        .stage-bar.wishlist { background: var(--text-tertiary); }
        .stage-bar.applied { background: var(--accent-secondary); }
        .stage-bar.interview { background: var(--accent-primary); }
        .stage-bar.offer { background: var(--accent-success); }

        .stage-label {
          position: relative;
          z-index: 1;
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .card-header-wide {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: var(--spacing-lg);
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          transition: background 0.2s;
        }

        .recent-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .recent-info {
          display: flex;
          flex-direction: column;
        }

        .link-hover:hover {
          text-decoration: underline;
          color: var(--accent-primary);
        }

        .sidebar-col {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .motivation-card {
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05));
        }

        .quote-icon {
          font-size: 3rem;
          font-family: serif;
          color: var(--accent-primary);
          line-height: 1;
          margin-bottom: -1rem;
          opacity: 0.5;
        }

        .quote-text {
          font-style: italic;
          font-size: 1.1rem;
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
        }

        .quote-author {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: var(--spacing-md);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
