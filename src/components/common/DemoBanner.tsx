import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Info, UserCheck, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, role, switchDemoRole } = useAuth();

  if (!isDemoMode) return null;

  return (
    <div className="bg-campus-navy-950 text-slate-200 px-4 py-2 border-b border-campus-teal-500/30 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-campus-teal-500"></span>
          </span>
          <span className="font-semibold text-campus-teal-400 tracking-wide uppercase text-[10px] bg-campus-teal-950/80 px-2 py-0.5 rounded border border-campus-teal-700/50">
            Local Verified Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-300">
            Database & RLS active in offline sandbox. Fictional SCEM demo seed data loaded.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Active Persona:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-campus-navy-900 border border-slate-700">
            <button
              onClick={() => switchDemoRole('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                role === 'student'
                  ? 'bg-campus-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Student (Aditi)
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                role === 'admin'
                  ? 'bg-campus-navy-700 text-white shadow-sm border border-campus-navy-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin (Dr. Kamath)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
