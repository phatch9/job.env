import { supabase } from '../supabase';
import { Application, ApplicationFormData } from '../types';

export const applicationsApi = {
    async getAll() {
        // We could also filter by user_id here if RLS is not sufficient, 
        // but typically Supabase RLS handles it.
        const { data, error } = await supabase
            .from('applications')
            .select('*, company:companies(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Application[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('applications')
            .select('*, company:companies(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Application;
    },

    async create(application: ApplicationFormData, userId: string) {
        const { data, error } = await supabase
            .from('applications')
            .insert([{ ...application, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data as Application;
    },

    async update(id: string, updates: Partial<ApplicationFormData>) {
        const { data, error } = await supabase
            .from('applications')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Application;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
