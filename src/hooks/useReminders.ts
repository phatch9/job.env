import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Reminder, ReminderFormData } from '@/lib/types';
import { useAuth } from './useAuth.tsx';
import { remindersApi } from '@/lib/api/reminders';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export function useReminders() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Query for reminders
    const {
        data: reminders = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['reminders', user?.id],
        queryFn: async () => {
            logger.debug('Fetching reminders for user:', user?.id);
            return remindersApi.getAll();
        },
        enabled: !!user,
    });

    // Real-time subscription
    useEffect(() => {
        if (!user) return;

        logger.debug('Setting up real-time subscription for reminders');
        const channel = supabase
            .channel('reminders_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reminders',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    logger.info('Reminders table changed, invalidating cache', payload);
                    queryClient.invalidateQueries({ queryKey: ['reminders', user.id] });
                }
            )
            .subscribe();

        return () => {
            logger.debug('Cleaning up reminders subscription');
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: ReminderFormData) => {
            if (!user) throw new Error('User not authenticated');
            return remindersApi.create(data, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
            logger.info('Reminder created successfully');
        },
        onError: (err) => logger.error('Failed to create reminder', err),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ReminderFormData> }) => 
            remindersApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
        },
        onError: (err) => logger.error('Failed to update reminder', err),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => remindersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
            logger.info('Reminder deleted');
        },
        onError: (err) => logger.error('Failed to delete reminder', err),
    });

    return {
        reminders,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
        createReminder: createMutation.mutateAsync,
        updateReminder: (id: string, data: Partial<ReminderFormData>) => 
            updateMutation.mutateAsync({ id, data }),
        toggleComplete: (id: string, completed: boolean) => 
            updateMutation.mutateAsync({ id, data: { completed } }),
        deleteReminder: deleteMutation.mutateAsync,
        refetch,
    };
}
