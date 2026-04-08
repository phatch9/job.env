import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Application,
    ApplicationFormData,
    ApplicationStatus,
    ApplicationUpdatePayload,
} from '@/lib/types';
import { useAuth } from './useAuth.tsx';
import { applicationsApi } from '@/lib/api/applications';

export function useApplications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch applications
    const fetchApplications = useCallback(async () => {
        if (!user) {
            setApplications([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await applicationsApi.getAll();
            setApplications(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchApplications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('applications_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'applications',
                    filter: `user_id=eq.${user?.id}`,
                },
                () => {
                    fetchApplications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchApplications]);

    // Create application
    const createApplication = async (data: ApplicationFormData) => {
        if (!user) throw new Error('User not authenticated');

        const newApp = await applicationsApi.create(data, user.id);

        // Optimistic update
        setApplications((prev) => [newApp, ...prev]);
        return newApp;
    };

    // Update application
    const updateApplication = async (id: string, data: ApplicationUpdatePayload) => {
        const updatedApp = await applicationsApi.update(id, data);

        // Optimistic update
        setApplications((prev) =>
            prev.map((app) => (app.id === id ? updatedApp : app))
        );
        return updatedApp;
    };

    // Update application status
    const updateStatus = async (id: string, status: ApplicationStatus) => {
        const updateData: Partial<ApplicationFormData> & { status: ApplicationStatus } = { status };

        // Set date fields based on status
        const now = new Date().toISOString();
        switch (status) {
            case 'applied':
                updateData.applied_date = now;
                break;
            case 'interview':
                updateData.interview_date = now;
                break;
            case 'offer':
                updateData.offer_date = now;
                break;
            case 'rejected':
                updateData.rejected_date = now;
                break;
        }

        return updateApplication(id, updateData);
    };

    // Delete application
    const deleteApplication = async (id: string) => {
        await applicationsApi.delete(id);

        // Optimistic update
        setApplications((prev) => prev.filter((app) => app.id !== id));
    };

    return {
        applications,
        loading,
        error,
        createApplication,
        updateApplication,
        updateStatus,
        deleteApplication,
        refetch: fetchApplications,
    };
}
