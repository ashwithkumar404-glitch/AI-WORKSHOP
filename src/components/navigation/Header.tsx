import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Menu, Bell, Search, Sparkles, User } from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

interface HeaderProps {
  onToggleMobileNav: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, onProfileClick }) => {
  const { user, role } = useAuth();
  const todayFormatted = formatInIST(new Date(), false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-campus-teal-700 bg-campus-teal-50 px-2.5 py-0.5 rounded-full border border-campus-teal-200/60 hidden sm:inline-block">
                Sahyadri ONE • Campus Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                • {todayFormatted}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {role === 'admin' ? 'Administrator Operations Console' : `Welcome, ${user?.full_name?.split(' ')[0] || 'Student'}`}
            </h2>
          </div>
        </div>

        {/* Right: Quick actions & Profile avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-campus-navy-800 text-campus-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-lg object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'U'
              )}
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs font-bold text-slate-800 leading-tight">
                {user?.full_name}
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {user?.role} {user?.semester ? `• Sem ${user.semester}` : ''}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

