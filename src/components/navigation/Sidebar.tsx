import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Newspaper, 
  Bot, 
  ShieldCheck, 
  Briefcase,
  BookOpen,
  Code2,
  Globe2,
  MessageSquare,
  LogOut,
  Building2
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
      label: 'Aptitude Exams',
      icon: GraduationCap,
      badge: '20+ Tests',
      adminOnly: false,
    },
    {
      to: '/coding',
      label: 'Coding Lab',
      icon: Code2,
      badge: 'DSA',
      adminOnly: false,
    },
    {
      to: '/study',
      label: 'Study Materials',
      icon: BookOpen,
      badge: 'Cheatsheets',
      adminOnly: false,
    },
    {
      to: '/jobs',
      label: 'Jobs & Drives',
      icon: Briefcase,
      badge: 'Verified',
      adminOnly: false,
    },
    {
      to: '/news',
      label: 'World & Tech News',
      icon: Globe2,
      badge: '10-Day Wire',
      adminOnly: false,
    },
    {
      to: '/interviews',
      label: 'Senior Debriefs',
      icon: MessageSquare,
      badge: null,
      adminOnly: false,
    },
    {
      to: '/newsletter',
      label: 'Campus Newsletter',
      icon: Newspaper,
      badge: 'Rolling',
      adminOnly: false,
    },
    {
      to: '/assistant',
      label: 'Ask Sahyadri AI',
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
    <aside className="hidden md:flex flex-col w-64 bg-campus-navy-950 border-r border-campus-navy-800 text-slate-200 select-none">
      {/* Brand & Institution Info */}
      <div className="p-5 border-b border-campus-navy-800/80 bg-campus-navy-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-teal-400 to-campus-teal-600 flex items-center justify-center text-white shadow-md font-black text-lg">
            S1
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
              Sahyadri <span className="text-campus-teal-400 text-xs px-1.5 py-0.5 rounded bg-campus-teal-950 border border-campus-teal-500/40">ONE</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Campus & Placement Portal
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-campus-navy-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-campus-teal-400" />
            SCEM Autonomous
          </span>
          <span className="bg-campus-navy-900 text-campus-teal-300 font-semibold px-2 py-0.5 rounded text-[10px]">
            NAAC 'A' | NBA
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Campus Workspace
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
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-campus-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-campus-navy-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-campus-navy-900 text-campus-teal-300 border border-campus-teal-500/20 group-hover:border-campus-teal-400/40">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* User Session Footer */}
      <div className="p-3 border-t border-campus-navy-800/80 bg-campus-navy-950">
        <div className="flex items-center justify-between p-2 rounded-xl bg-campus-navy-900/60">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 text-left truncate flex-1 hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-campus-navy-800 text-campus-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-lg object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'U'
              )}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {user?.full_name}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {user?.usn || user?.role}
              </span>
            </div>
          </button>

          <button
            onClick={logout}
            title="Sign out of portal"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-campus-navy-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
