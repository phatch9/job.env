import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Company, CompanyFormData } from '@/lib/types';
import { useAuth } from './useAuth.tsx';

export function useCompanies() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCompanies([]);
            setLoading(false);
            return;
        }

        fetchCompanies();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('companies_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'companies',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchCompanies();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const fetchCompanies = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .order('name');

            if (error) throw error;
            setCompanies(data || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCompany = async (formData: CompanyFormData) => {
        if (!user) throw new Error('User not authenticated');

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticCompany: Company = {
            id: tempId,
            user_id: user.id,
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setCompanies((prev) => [...prev, optimisticCompany].sort((a, b) => a.name.localeCompare(b.name)));

        try {
            const { data, error } = await supabase
                .from('companies')
                .insert([{ ...formData, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic update with real data
            setCompanies((prev) =>
                prev.map((c) => (c.id === tempId ? data : c)).sort((a, b) => a.name.localeCompare(b.name))
            );
        } catch (error) {
            // Rollback optimistic update
            setCompanies((prev) => prev.filter((c) => c.id !== tempId));
            throw error;
        }
    };

    const updateCompany = async (id: string, formData: CompanyFormData) => {
        const oldCompanies = [...companies];

        // Optimistic update
        setCompanies((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...formData, updated_at: new Date().toISOString() } : c))
                .sort((a, b) => a.name.localeCompare(b.name))
        );

        try {
            const { error } = await supabase.from('companies').update(formData).eq('id', id);

            if (error) throw error;
        } catch (error) {
            // Rollback optimistic update
            setCompanies(oldCompanies);
            throw error;
        }
    };

    const deleteCompany = async (id: string) => {
        const oldCompanies = [...companies];

        // Optimistic update
        setCompanies((prev) => prev.filter((c) => c.id !== id));

        try {
            const { error } = await supabase.from('companies').delete().eq('id', id);

            if (error) throw error;
        } catch (error) {
            // Rollback optimistic update
            setCompanies(oldCompanies);
            throw error;
        }
    };

    return {
        companies,
        loading,
        createCompany,
        updateCompany,
        deleteCompany,
    };
}
