import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const allowedDomainsRaw = import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS || '';
const enableDemoModeRaw = import.meta.env.VITE_ENABLE_DEMO_MODE;

/**
 * Checks whether Supabase is configured with valid credentials.
 * Rejects default placeholders and incomplete keys.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    !supabaseUrl.includes('example.supabase.co') &&
    supabaseKey !== 'your-anon-key' &&
    supabaseKey !== 'your-supabase-anon-key-here' &&
    supabaseKey !== 'your-supabase-publishable-key-here' &&
    supabaseKey.length > 20
  );
};

/**
 * Determines whether demo/mock mode is active.
 * If Supabase is configured, demo mode is disabled unless explicitly forced via VITE_ENABLE_DEMO_MODE=true.
 */
export const isDemoModeActive = (): boolean => {
  if (enableDemoModeRaw === 'true') return true;
  if (enableDemoModeRaw === 'false') return false;
  return !isSupabaseConfigured();
};

/**
 * Single instance of Supabase Client initialized if configured.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

/**
 * Validates whether an email domain is permitted under institutional policy.
 * Default institutional policy is 'sahyadri.edu.in' unless overridden.
 * If explicitly set to "*", all valid domains are accepted.
 */
export const isEmailDomainAllowed = (email: string, overrideAllowedDomains?: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return false;

  const rawConfig = overrideAllowedDomains ?? allowedDomainsRaw;
  const activeDomains = rawConfig && rawConfig.trim() !== '' ? rawConfig : 'sahyadri.edu.in';
  if (activeDomains.trim() === '*') return true;

  const domain = parts[1].toLowerCase().trim();
  const allowedList = activeDomains
    .split(',')
    .map((d: string) => d.trim().toLowerCase())
    .filter(Boolean);

  return allowedList.includes(domain);
};

/**
 * Returns formatted allowed domains for UI hints and validation error messages.
 */
export const getAllowedDomainsList = (): string[] => {
  const activeDomains = allowedDomainsRaw && allowedDomainsRaw.trim() !== '' ? allowedDomainsRaw : 'sahyadri.edu.in';
  if (activeDomains.trim() === '*') {
    return [];
  }
  return activeDomains.split(',').map((d: string) => d.trim().toLowerCase()).filter(Boolean);
};

export interface DatabaseConnectionStatus {
  ok: boolean;
  isConfigured: boolean;
  message: string;
  latencyMs?: number;
  url: string;
  mode: 'Live Supabase Cloud' | 'Local Offline Sandbox (Demo)';
}

/**
 * Performs a live connectivity check to Supabase database.
 * If unconfigured or offline, reports clear status without throwing exceptions.
 */
export const checkDatabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  const configured = isSupabaseConfigured();

  if (!configured || !supabase) {
    return {
      ok: false,
      isConfigured: false,
      message: 'Supabase credentials not configured in environment (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Local offline sandbox active.',
      url: 'Not Configured',
      mode: 'Local Offline Sandbox (Demo)',
    };
  }

  const startTime = Date.now();
  try {
    // Attempt a lightweight read on knowledge documents (publicly readable approved docs)
    const { error, count } = await supabase
      .from('knowledge_documents')
      .select('*', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        ok: false,
        isConfigured: true,
        message: `Database error: ${error.message} (Code: ${error.code})`,
        latencyMs,
        url: supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.supabase.co'),
        mode: 'Live Supabase Cloud',
      };
    }

    return {
      ok: true,
      isConfigured: true,
      message: `Successfully connected to Supabase PostgreSQL (${latencyMs}ms)`,
      latencyMs,
      url: supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.supabase.co'),
      mode: 'Live Supabase Cloud',
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    return {
      ok: false,
      isConfigured: true,
      message: err instanceof Error ? err.message : 'Network failure connecting to Supabase',
      latencyMs,
      url: supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.supabase.co'),
      mode: 'Live Supabase Cloud',
    };
  }
};

export const getSupabaseConfigStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: configured
      ? supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.supabase.co')
      : 'Not Configured (Demo Mode Active)',
    mode: configured ? 'Live Supabase Cloud' : 'Local Offline Sandbox (Demo)',
  };
};
