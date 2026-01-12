import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import AuthForm from './components/AuthForm';
import Layout from './app/layout';
import DashboardPage from './app/page';
import KanbanPage from './app/kanban/page';
import ApplicationsPage from './app/applications/page';
import CompaniesPage from './app/companies/page';
import LandingPage from './app/landing/page';
import AuthCallbackPage from './app/auth/callback/page';

function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/login" element={<AuthForm defaultIsSignUp={false} />} />
                <Route path="/auth/register" element={<AuthForm defaultIsSignUp={true} />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
