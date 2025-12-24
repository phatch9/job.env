import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import AuthForm from './components/AuthForm';
import Layout from './app/layout';
import DashboardPage from './app/page';
import KanbanPage from './app/kanban/page';
import ApplicationsPage from './app/applications/page';
import CompaniesPage from './app/companies/page';

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <AuthForm />;
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
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
