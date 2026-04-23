import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth.tsx';

interface AuthFormProps {
    defaultIsSignUp?: boolean;
}

export default function AuthForm({ defaultIsSignUp = false }: AuthFormProps) {
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>job.env</h1>
                    <p className="text-secondary">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="form-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>

            <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          background: linear-gradient(135deg, hsl(220, 25%, 10%) 0%, hsl(280, 30%, 15%) 100%);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: var(--spacing-2xl);
          animation: slideUp var(--transition-slow);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .auth-header h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-sm);
        }

        .auth-form {
          margin-bottom: var(--spacing-lg);
        }

        .auth-footer {
          text-align: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }

        .auth-footer .btn {
          width: 100%;
        }
      `}</style>
        </div>
    );
}
