import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in UI boundary:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary-container">
          <div className="glass-card error-card">
            <h2>Something went wrong</h2>
            <p className="text-secondary">We've logged the error and are looking into it.</p>
            <button 
              className="btn-primary" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              Reload Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="error-details">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <style>{`
            .error-boundary-container {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 2rem;
            }
            .error-card {
              max-width: 500px;
              width: 100%;
              padding: 2rem;
              text-align: center;
            }
            .error-details {
              margin-top: 1.5rem;
              padding: 1rem;
              background: rgba(0,0,0,0.3);
              border-radius: 8px;
              font-size: 0.8rem;
              text-align: left;
              color: var(--accent-error);
              white-space: pre-wrap;
              overflow-x: auto;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
