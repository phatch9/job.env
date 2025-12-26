import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/kanban', label: 'Kanban', icon: '📋' },
    { path: '/applications', label: 'Applications', icon: '📝' },
    { path: '/companies', label: 'Companies', icon: '🏢' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-layout">
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <h1 className="logo">Apply.come</h1>
          <p className="text-xs text-tertiary">{user?.email}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={signOut} className="btn btn-ghost" style={{ width: '100%' }}>
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(220, 25%, 10%) 0%, hsl(280, 30%, 15%) 100%);
        }

        .sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg);
          border-right: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .sidebar-header {
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--glass-border);
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-xs);
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-base);
          font-weight: 500;
        }

        .nav-item:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          box-shadow: var(--shadow-md);
        }

        .nav-icon {
          font-size: 1.25rem;
        }

        .nav-label {
          font-size: 0.875rem;
        }

        .sidebar-footer {
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .app-layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            height: auto;
            position: static;
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
          }

          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
          }

          .nav-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
