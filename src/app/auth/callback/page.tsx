import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // If user is already authenticated (handled by AuthProvider), redirect to dashboard
        if (user) {
            navigate('/dashboard');
            return;
        }

        const handleAuthCallback = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error handling auth callback:', error);
                navigate('/auth/login?error=auth_callback_error');
            } else {
                // Successful session exchange, AuthProvider will react to onAuthStateChange
                // and user will be set, triggering the redirect above or re-render
                navigate('/dashboard');
            }
        };

        handleAuthCallback();
    }, [navigate, user]);

    return (
        <div className="page-container flex-center">
            <div className="loading-state">
                <div className="spinner" />
                <p className="text-secondary mt-4">Completing sign in...</p>
            </div>
            <style>{`
                .flex-center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
            `}</style>
        </div>
    );
}
