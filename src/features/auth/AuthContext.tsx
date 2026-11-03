import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    email: string;
    fullName: string;
    usn: string;
    department: string;
    semester: number;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  switchDemoRole: (targetRole: 'student' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isDemo = !isSupabaseConfigured();
  const [user, setUser] = useState<UserProfile | null>(() => {
    return isDemo ? dbRepository.getCurrentUser() : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isDemo) {
      const currentUser = dbRepository.getCurrentUser();
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
    } else if (supabase) {
      // Supabase live session listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isDemo]);

  const fetchSupabaseProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUser(data as UserProfile);
      }
    } catch (err) {
      console.error('Failed to fetch profile from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    if (!email) return { success: false, error: 'Email is required.' };

    if (!isDemo && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        await fetchSupabaseProfile(data.user.id);
        return { success: true };
      }
    }

    // Demo/Local login mode
    const profiles = dbRepository.getProfiles();
    const matched = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      dbRepository.setCurrentUser(matched);
      setUser(matched);
      return { success: true };
    }

    // If new email in demo mode, create as student
    const newStudent: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      department: 'Computer Science & Engineering',
      semester: 4,
      role: 'student', // Security: strictly student!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbRepository.updateProfile(newStudent);
    dbRepository.setCurrentUser(newStudent);
    setUser(newStudent);
    return { success: true };
  };

  const signUp = async (params: {
    email: string;
    fullName: string;
    usn: string;
    department: string;
    semester: number;
    password?: string;
  }) => {
    if (!params.email || !params.fullName) {
      return { success: false, error: 'Name and email are required.' };
    }

    if (!isDemo && supabase && params.password) {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            usn: params.usn,
            department: params.department,
            semester: params.semester,
            role: 'student' // Strictly student
          }
        }
      });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        return { success: true };
      }
    }

    // Demo mode signup
    const newStudent: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: params.email,
      full_name: params.fullName,
      usn: params.usn,
      department: params.department,
      semester: params.semester,
      role: 'student', // Enforce student role
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const profiles = dbRepository.getProfiles();
    profiles.push(newStudent);
    localStorage.setItem('campuspilot_profiles', JSON.stringify(profiles));
    dbRepository.setCurrentUser(newStudent);
    setUser(newStudent);
    return { success: true };
  };

  const logout = async () => {
    if (!isDemo && supabase) {
      await supabase.auth.signOut();
    }
    dbRepository.setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    
    // Security check: non-admin cannot elevate role
    const sanitizedRole = user.role !== 'admin' ? user.role : (updated.role || user.role);

    const merged: UserProfile = {
      ...user,
      ...updated,
      role: sanitizedRole,
      updated_at: new Date().toISOString(),
    };

    if (!isDemo && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: merged.full_name,
          usn: merged.usn,
          department: merged.department,
          semester: merged.semester,
        })
        .eq('id', user.id);
    }

    dbRepository.updateProfile(merged);
    setUser(merged);
  };

  const switchDemoRole = (targetRole: 'student' | 'admin') => {
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
        login,
        signUp,
        logout,
        updateProfile,
        switchDemoRole,
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
