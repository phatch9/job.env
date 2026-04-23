import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { ThemeToggle } from './ThemeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownStyles,
    DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import { PersonIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function NavBar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth/login');
    };

    if (!user) return null;

    return (
        <>
            <DropdownStyles />
            <nav className="navbar glass-card">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <Link to="/">
                            <h1>job.env</h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-links hidden-mobile">
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/applications"
                            className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                        >
                            Applications
                        </Link>
                        <Link
                            to="/companies"
                            className={`nav-link ${isActive('/companies') ? 'active' : ''}`}
                        >
                            Companies
                        </Link>
                        <Link
                            to="/documents"
                            className={`nav-link ${isActive('/documents') ? 'active' : ''}`}
                        >
                            Documents
                        </Link>
                    </div>

                    <div className="navbar-actions">
                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="btn btn-ghost btn-icon" aria-label="User menu">
                                    <PersonIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-xs text-secondary pointer-events-none">
                                    {user.email}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Trigger - Simplified for now */}
                        <div className="visible-mobile" style={{ marginLeft: 'var(--spacing-sm)' }}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="btn btn-ghost btn-icon">
                                        <HamburgerMenuIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/applications')}>Applications</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/companies')}>Companies</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/documents')}>Documents</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <style>{`
                    .navbar {
                        position: sticky;
                        top: var(--spacing-md);
                        margin: 0 var(--spacing-md) var(--spacing-xl);
                        padding: 0.75rem var(--spacing-lg);
                        z-index: var(--z-sticky);
                    }

                    .navbar-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .navbar-logo h1 {
                        font-size: 1.5rem;
                        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0;
                    }

                    .navbar-links {
                        display: flex;
                        gap: var(--spacing-lg);
                    }

                    .nav-link {
                        color: var(--text-secondary);
                        font-weight: 500;
                        font-size: 0.9rem;
                        transition: color var(--transition-fast);
                        position: relative;
                    }

                    .nav-link:hover {
                        color: var(--text-primary);
                    }

                    .nav-link.active {
                        color: var(--text-primary);
                    }

                    .nav-link.active::after {
                        content: '';
                        position: absolute;
                        bottom: -4px;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background: var(--accent-primary);
                        border-radius: 2px;
                    }

                    .navbar-actions {
                        display: flex;
                        align-items: center;
                        gap: var(--spacing-sm);
                    }

                    .btn-icon {
                        padding: var(--spacing-sm);
                        border-radius: 50%;
                    }

                    .hidden-mobile {
                        display: flex;
                    }

                    .visible-mobile {
                        display: none;
                    }

                    @media (max-width: 768px) {
                        .hidden-mobile {
                            display: none;
                        }
                        .visible-mobile {
                            display: block;
                        }
                    }
                `}</style>
            </nav>
        </>
    );
}
