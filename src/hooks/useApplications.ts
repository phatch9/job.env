import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Application, ApplicationFormData, ApplicationStatus } from '@/lib/types';
import { useAuth } from './useAuth.tsx';

export function useApplications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch applications
    const fetchApplications = async () => {
        if (!user) {
            setApplications([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('applications')
                .select(`
          *,
          company:companies(*)
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

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
    }, [user]);

    // Create application
    const createApplication = async (data: ApplicationFormData) => {
        if (!user) throw new Error('User not authenticated');

        const { data: newApp, error } = await supabase
            .from('applications')
            .insert([
                {
                    ...data,
                    user_id: user.id,
                },
            ])
            .select(`
        *,
        company:companies(*)
      `)
            .single();

        if (error) throw error;

        // Optimistic update
        setApplications((prev) => [newApp, ...prev]);
        return newApp;
    };

    // Update application
    const updateApplication = async (id: string, data: Partial<ApplicationFormData>) => {
        const { data: updatedApp, error } = await supabase
            .from('applications')
            .update(data)
            .eq('id', id)
            .select(`
        *,
        company:companies(*)
      `)
            .single();

        if (error) throw error;

        // Optimistic update
        setApplications((prev) =>
            prev.map((app) => (app.id === id ? updatedApp : app))
        );
        return updatedApp;
    };

    // Update application status
    const updateStatus = async (id: string, status: ApplicationStatus) => {
        const updateData: any = { status };

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
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id);

        if (error) throw error;

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
