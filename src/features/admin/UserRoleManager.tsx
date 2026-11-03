import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  Search, 
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw
} from 'lucide-react';

export const UserRoleManager: React.FC = () => {
  const { user: currentAdmin, isDemoMode } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setProfiles(data as UserProfile[]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch profiles from Supabase, using storage repository', err);
      }
    }

    setProfiles(dbRepository.getProfiles());
    setIsLoading(false);
  };

  const handleRoleChange = async (targetUser: UserProfile, newRole: UserRole) => {
    if (targetUser.id === currentAdmin?.id && newRole !== 'admin') {
      alert('Security Protection: You cannot revoke your own administrator credentials.');
      return;
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', targetUser.id);

        if (error) {
          setErrorMsg(`Database error: ${error.message}`);
          return;
        }
      }

      dbRepository.updateProfile({ ...targetUser, role: newRole });
      await loadProfiles();
      setFeedbackMsg(`Role for ${targetUser.full_name} updated to ${newRole.toUpperCase()}.`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Role update failed');
    }
  };

  const filtered = profiles.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.usn && p.usn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Institutional Role & Privilege Management</h2>
          <p className="text-xs text-slate-500">
            Enforce institutional access policies. Students cannot self-elevate permissions; promotions are enforced via PostgreSQL RLS & triggers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProfiles}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-campus-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Enrolled Users ({profiles.length})</h3>
            {!isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[10px] text-campus-teal-700 bg-campus-teal-50 px-2 py-0.5 rounded border border-campus-teal-200">
                <Database className="w-3 h-3" />
                Live Supabase Profiles
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or USN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">User Profile</th>
                <th className="pb-3">USN / Faculty ID</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Current Role</th>
                <th className="pb-3 text-right pr-2">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isAdmin = p.role === 'admin';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2">
                      <span className="font-bold text-slate-900 block">{p.full_name}</span>
                      <span className="text-[11px] text-slate-500">{p.email}</span>
                    </td>
                    <td className="py-3 font-mono font-medium text-slate-700">
                      {p.usn || '—'}
                    </td>
                    <td className="py-3 text-slate-600">
                      {p.department}
                    </td>
                    <td className="py-3">
                      <Badge variant={isAdmin ? 'primary' : 'teal'} size="sm">
                        {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        {p.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p, e.target.value as UserRole)}
                        disabled={p.id === currentAdmin?.id}
                        className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-campus-teal-500 focus:outline-none disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
