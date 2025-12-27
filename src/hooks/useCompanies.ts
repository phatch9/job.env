import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Company, CompanyFormData } from '@/lib/types';
import { useAuth } from './useAuth.tsx';

export function useCompanies() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch companies
    const fetchCompanies = async () => {
        if (!user) {
            setCompanies([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .order('name', { ascending: true });

            if (error) throw error;
            setCompanies(data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('companies_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'companies',
                    filter: `user_id=eq.${user?.id}`,
                },
                () => {
                    fetchCompanies();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Create company
    const createCompany = async (data: CompanyFormData) => {
        if (!user) throw new Error('User not authenticated');

        const { data: newCompany, error } = await supabase
            .from('companies')
            .insert([
                {
                    ...data,
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // Optimistic update
        setCompanies((prev) => [...prev, newCompany].sort((a, b) => a.name.localeCompare(b.name)));
        return newCompany;
    };

    // Update company
    const updateCompany = async (id: string, data: Partial<CompanyFormData>) => {
        const { data: updatedCompany, error } = await supabase
            .from('companies')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Optimistic update
        setCompanies((prev) =>
            prev.map((company) => (company.id === id ? updatedCompany : company))
                .sort((a, b) => a.name.localeCompare(b.name))
        );
        return updatedCompany;
    };

    // Delete company
    const deleteCompany = async (id: string) => {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Optimistic update
        setCompanies((prev) => prev.filter((company) => company.id !== id));
    };

    return {
        companies,
        loading,
        error,
        createCompany,
        updateCompany,
        deleteCompany,
        refetch: fetchCompanies,
    };
}
