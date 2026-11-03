import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Newspaper, 
  Bot, 
  ShieldCheck, 
  User, 
  LogOut,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface SidebarProps {
  onProfileClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onProfileClick }) => {
  const { user, role, logout } = useAuth();

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      to: '/exams',
      label: 'Examinations',
      icon: GraduationCap,
      badge: 'MCQ',
      adminOnly: false,
    },
    {
      to: '/newsletter',
      label: 'SCEM Newsletter',
      icon: Newspaper,
      badge: '10-Day Feed',
      adminOnly: false,
    },
    {
      to: '/assistant',
      label: 'Ask SCEM AI',
      icon: Bot,
      badge: 'Grounded',
      adminOnly: false,
    },
    {
      to: '/admin',
      label: 'Administrator Studio',
      icon: ShieldCheck,
      badge: 'Admin',
      adminOnly: true,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-campus-navy-900 border-r border-campus-navy-800 text-slate-200 select-none">
      {/* Brand & Institution Info */}
      <div className="p-5 border-b border-campus-navy-800/80 bg-campus-navy-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-teal-400 to-campus-teal-600 flex items-center justify-center text-white shadow-md font-extrabold text-lg">
            CP
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
              CampusPilot <span className="text-campus-teal-400 text-xs px-1.5 py-0.5 rounded bg-campus-teal-950 border border-campus-teal-500/40">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Sahyadri College (SCEM)
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-campus-navy-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-campus-teal-400" />
            VTU Autonomous
          </span>
          <span className="bg-campus-navy-800/90 text-campus-teal-300 font-semibold px-2 py-0.5 rounded text-[10px]">
            NAAC 'A' | NBA
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Academic Workspace
        </div>
        {navLinks
          .filter(link => !link.adminOnly || role === 'admin')
          .map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-campus-teal-600/90 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-campus-navy-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-campus-teal-400 transition-colors" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-campus-navy-800 text-campus-teal-300 border border-campus-navy-700">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-campus-navy-800/80 bg-campus-navy-950/40">
        <div className="p-2.5 rounded-xl bg-campus-navy-800/60 border border-campus-navy-750 flex items-center justify-between">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2.5 text-left flex-1 min-w-0 mr-2 group"
            title="View Profile Details"
          >
            <div className="w-8 h-8 rounded-full bg-campus-teal-500/20 border border-campus-teal-500/40 flex items-center justify-center text-campus-teal-300 font-bold text-xs shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'U'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate group-hover:text-campus-teal-300 transition-colors">
                {user?.full_name || 'Guest User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate uppercase">
                {user?.usn || user?.role || 'Student'}
              </p>
            </div>
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-campus-navy-700/60 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
