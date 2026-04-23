import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Reminder, ReminderFormData } from '@/lib/types';
import { useAuth } from './useAuth.tsx';
import { remindersApi } from '@/lib/api/reminders';

export function useReminders() {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReminders = useCallback(async () => {
        if (!user) {
            setReminders([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await remindersApi.getAll();
            setReminders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchReminders();

        const channel = supabase
            .channel('reminders_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reminders',
                    filter: `user_id=eq.${user?.id}`,
                },
                () => {
                    fetchReminders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchReminders]);

    const createReminder = async (data: ReminderFormData) => {
        if (!user) throw new Error('User not authenticated');
        const newReminder = await remindersApi.create(data, user.id);
        // fetchReminders() will be triggered by real-time subscription, 
        // but we can also update locally for immediate feedback if desired.
        return newReminder;
    };

    const updateReminder = async (id: string, data: Partial<ReminderFormData>) => {
        const updated = await remindersApi.update(id, data);
        return updated;
    };

    const toggleComplete = async (id: string, completed: boolean) => {
        return updateReminder(id, { completed });
    };

    const deleteReminder = async (id: string) => {
        await remindersApi.delete(id);
    };

    return {
        reminders,
        loading,
        error,
        createReminder,
        updateReminder,
        toggleComplete,
        deleteReminder,
        refetch: fetchReminders,
    };
}
