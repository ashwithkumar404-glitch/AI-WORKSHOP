import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import {
  supabase,
  isSupabaseConfigured,
  isDemoModeActive,
  isEmailDomainAllowed,
  getAllowedDomainsList,
  checkDatabaseConnection,
  DatabaseConnectionStatus,
} from '@/lib/supabaseClient';

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  dbStatus: DatabaseConnectionStatus | null;
  allowedDomains: string[];
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    email: string;
    fullName: string;
    usn?: string;
    department?: string;
    semester?: number;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  handleOAuthCallback: () => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (targetRole: 'student' | 'admin') => void;
  refreshConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isDemo = isDemoModeActive();
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Only pre-load mock user if demo mode is active
    return isDemo ? dbRepository.getCurrentUser() : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DatabaseConnectionStatus | null>(null);

  // Check database connectivity on mount
  useEffect(() => {
    let isMounted = true;
    checkDatabaseConnection().then((status) => {
      if (isMounted) setDbStatus(status);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshConnection = async () => {
    const status = await checkDatabaseConnection();
    setDbStatus(status);
  };

  // Helper to sync or create profile from Supabase Auth User
  const syncSupabaseProfile = async (authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  }): Promise<UserProfile | null> => {
    if (!supabase) return null;

    try {
      // 1. Attempt to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data && !error) {
        return data as UserProfile;
      }

      // 2. If profile doesn't exist yet, create safely with role = 'student'
      const fallbackName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'Student';

      const fallbackAvatar =
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        undefined;

      const newProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: fallbackName,
        role: 'student', // Zero privilege escalation
        avatar_url: fallbackAvatar,
        department: authUser.user_metadata?.department || 'Computer Science & Engineering',
        semester: authUser.user_metadata?.semester || 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .single();

      if (!insertError && inserted) {
        return inserted as UserProfile;
      }

      // If RLS blocked insert or trigger race occurred, re-query once
      const { data: refetched } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      return (refetched as UserProfile) || newProfile;
    } catch (err) {
      console.error('Error synchronizing Supabase profile:', err);
      return null;
    }
  };

  // Session management effect
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      // Live Supabase Auth
      let active = true;

      client.auth.getSession().then(async ({ data: { session } }) => {
        if (!active) return;
        if (session?.user) {
          // Domain verification check
          if (session.user.email && !isEmailDomainAllowed(session.user.email)) {
            await client.auth.signOut();
            setUser(null);
            setIsLoading(false);
            return;
          }

          const profile = await syncSupabaseProfile(session.user);
          if (active && profile) {
            setUser(profile);
            dbRepository.setCurrentUser(profile);
          }
        }
        if (active) setIsLoading(false);
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          if (!active) return;

          if (event === 'SIGNED_OUT' || !session?.user) {
            setUser(null);
            dbRepository.setCurrentUser(null);
            setIsLoading(false);
          } else if (session?.user) {
            if (session.user.email && !isEmailDomainAllowed(session.user.email)) {
              await client.auth.signOut();
              setUser(null);
              setIsLoading(false);
              return;
            }

            const profile = await syncSupabaseProfile(session.user);
            if (active && profile) {
              setUser(profile);
              dbRepository.setCurrentUser(profile);
            }
            setIsLoading(false);
          }
        }
      );

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } else {
      // Local Offline Sandbox Mode
      const currentUser = isDemo ? dbRepository.getCurrentUser() : null;
      setUser(currentUser);
      setIsLoading(false);

      const handleDbChange = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.key === 'campuspilot_current_user' || detail?.key === 'all') {
          setUser(dbRepository.getCurrentUser());
        }
      };

      window.addEventListener('campuspilot_db_change', handleDbChange);
      return () => window.removeEventListener('campuspilot_db_change', handleDbChange);
    }
  }, [isDemo]);

  // Google OAuth Initiator
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      if (isDemo) {
        return {
          success: false,
          error: 'Supabase is not configured. Google OAuth requires live VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. Please use demo sandbox personas below or configure .env.',
        };
      }
      return {
        success: false,
        error: 'Supabase credentials missing. Google OAuth cannot be initialized.',
      };
    }

    try {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to initialize Google sign-in.',
      };
    }
  };

  // Google OAuth Callback Resolver
  const handleOAuthCallback = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        return { success: false, error: error.message };
      }

      if (!session?.user) {
        return { success: false, error: 'No authenticated user session found after callback.' };
      }

      const email = session.user.email || '';
      if (!isEmailDomainAllowed(email)) {
        await supabase.auth.signOut();
        setUser(null);
        const allowed = getAllowedDomainsList();
        return {
          success: false,
          error: `Institutional access restricted. Only Google accounts ending in @${allowed.join(' or @')} are permitted.`,
        };
      }

      const profile = await syncSupabaseProfile(session.user);
      if (!profile) {
        return { success: false, error: 'Failed to retrieve or initialize student profile.' };
      }

      setUser(profile);
      dbRepository.setCurrentUser(profile);
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error resolving OAuth callback session.',
      };
    }
  };

  // Email/Password Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email) return { success: false, error: 'Email is required.' };

    // Validate email domain if restricted
    if (!isEmailDomainAllowed(email)) {
      const allowed = getAllowedDomainsList();
      return {
        success: false,
        error: `Institutional access restricted. Email must belong to @${allowed.join(' or @')}.`,
      };
    }

    if (isSupabaseConfigured() && supabase) {
      if (!password) {
        return { success: false, error: 'Password is required for email login.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      if (data.user) {
        const profile = await syncSupabaseProfile(data.user);
        if (profile) {
          setUser(profile);
          dbRepository.setCurrentUser(profile);
        }
        return { success: true };
      }
    }

    // Demo / Offline Sandbox fallback (only if demo mode active)
    if (isDemo) {
      const profiles = dbRepository.getProfiles();
      const matched = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        dbRepository.setCurrentUser(matched);
        setUser(matched);
        return { success: true };
      }

      // If unfamiliar email in demo mode, create as a student
      const newStudent: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        department: 'Computer Science & Engineering',
        semester: 4,
        role: 'student', // Security: strictly student
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dbRepository.updateProfile(newStudent);
      dbRepository.setCurrentUser(newStudent);
      setUser(newStudent);
      return { success: true };
    }

    return {
      success: false,
      error: 'Authentication failed. Please check your credentials or sign in with Google.',
    };
  };

  // Self-Registration
  const signUp = async (params: {
    email: string;
    fullName: string;
    usn?: string;
    department?: string;
    semester?: number;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!params.email || !params.fullName) {
      return { success: false, error: 'Name and email are required.' };
    }

    // Validate institutional email domain
    if (!isEmailDomainAllowed(params.email)) {
      const allowed = getAllowedDomainsList();
      return {
        success: false,
        error: `Institutional access restricted. Email must belong to @${allowed.join(' or @')}.`,
      };
    }

    if (isSupabaseConfigured() && supabase && params.password) {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            usn: params.usn || null,
            department: params.department || 'Computer Science & Engineering',
            semester: params.semester || 4,
            role: 'student', // Zero privilege escalation
          },
        },
      });

      if (error) return { success: false, error: error.message };

      if (data.user) {
        const profile = await syncSupabaseProfile(data.user);
        if (profile) {
          setUser(profile);
          dbRepository.setCurrentUser(profile);
        }
        return { success: true };
      }
    }

    // Offline demo mode registration
    if (isDemo) {
      const newStudent: UserProfile = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        email: params.email,
        full_name: params.fullName,
        usn: params.usn || undefined,
        department: params.department || 'Computer Science & Engineering',
        semester: params.semester || 4,
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profiles = dbRepository.getProfiles();
      profiles.push(newStudent);
      localStorage.setItem('campuspilot_profiles', JSON.stringify(profiles));
      dbRepository.setCurrentUser(newStudent);
      setUser(newStudent);
      return { success: true };
    }

    return {
      success: false,
      error: 'Registration requires live Supabase connectivity or development demo mode.',
    };
  };

  // Logout
  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase sign out error:', err);
      }
    }
    dbRepository.setCurrentUser(null);
    setUser(null);
  };

  // Profile Update (with strict role preservation)
  const updateProfile = async (updated: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated' };

    // Security check: non-admin cannot elevate role
    const sanitizedRole = user.role !== 'admin' ? user.role : (updated.role || user.role);

    const merged: UserProfile = {
      ...user,
      ...updated,
      role: sanitizedRole,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: merged.full_name,
          usn: merged.usn,
          department: merged.department,
          semester: merged.semester,
          avatar_url: merged.avatar_url,
          updated_at: merged.updated_at,
          // role is intentionally excluded from client update payload to respect database security
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    dbRepository.updateProfile(merged);
    setUser(merged);
    return { success: true };
  };

  // Demo Persona Switcher (Development sandbox only)
  const switchDemoRole = (targetRole: 'student' | 'admin') => {
    if (!isDemo) {
      console.warn('Persona switching is disabled when live Supabase is configured.');
      return;
    }
    const switched = dbRepository.switchRole(targetRole);
    setUser(switched);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: Boolean(user),
        isLoading,
        isDemoMode: isDemo,
        dbStatus,
        allowedDomains: getAllowedDomainsList(),
        signInWithGoogle,
        login,
        signUp,
        logout,
        updateProfile,
        handleOAuthCallback,
        switchDemoRole,
        refreshConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
