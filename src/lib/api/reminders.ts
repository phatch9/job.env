import { supabase } from '../supabase';
import { Reminder, ReminderFormData } from '../types';

export const remindersApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('reminders')
            .select(`
                *,
                application:applications(
                    position,
                    company:companies(name)
                )
            `)
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data as Reminder[];
    },

    async getUpcoming(limit = 5) {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('reminders')
            .select(`
                *,
                application:applications(
                    position,
                    company:companies(name)
                )
            `)
            .gte('due_date', now)
            .eq('completed', false)
            .order('due_date', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data as Reminder[];
    },

    async create(reminder: ReminderFormData, userId: string) {
        const { data, error } = await supabase
            .from('reminders')
            .insert([{ ...reminder, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data as Reminder;
    },

    async update(id: string, updates: Partial<ReminderFormData>) {
        const { data, error } = await supabase
            .from('reminders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Reminder;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async toggleComplete(id: string, completed: boolean) {
        return this.update(id, { completed });
    }
};
