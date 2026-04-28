import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-url'));

if (!isConfigured) {
    logger.warn('Supabase is not properly configured. Please check your .env file.');
} else {
    logger.info('Supabase initialized successfully.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);

export const checkSupabaseConnection = async () => {
    try {
        const { error } = await supabase.from('health_check').select('id').limit(1);
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
             throw error;
        }
        return true;
    } catch (err) {
        logger.error('Supabase connection check failed', err);
        return false;
    }
};
