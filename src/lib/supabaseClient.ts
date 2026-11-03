import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    !supabaseUrl.includes('example.supabase.co') &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseAnonKey.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const getSupabaseConfigStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: configured ? (supabaseUrl as string).replace(/^(https?:\/\/[^.]+).*/, '$1.supabase.co') : 'Not Configured (Demo Mode Active)',
    mode: configured ? 'Live Supabase Cloud' : 'Local Verified Demonstration Mode',
  };
};

