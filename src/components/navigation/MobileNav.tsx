import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Newspaper, 
  Bot, 
  ShieldCheck, 
  X,
  LogOut,
  Building2 
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onProfileClick }) => {
  const { user, role, logout } = useAuth();

  if (!isOpen) return null;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { to: '/exams', label: 'Examinations (MCQ)', icon: GraduationCap, adminOnly: false },
    { to: '/newsletter', label: 'SCEM Newsletter (10-Day Feed)', icon: Newspaper, adminOnly: false },
    { to: '/assistant', label: 'Ask SCEM AI Assistant', icon: Bot, adminOnly: false },
    { to: '/admin', label: 'Administrator Studio', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 w-72 bg-campus-navy-950 text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-campus-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-campus-teal-600 flex items-center justify-center font-bold text-white text-sm">
              CP
            </div>
            <div>
              <h2 className="font-bold text-sm">CampusPilot AI</h2>
              <p className="text-[10px] text-campus-teal-400">SCEM Mangaluru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks
            .filter(link => !link.adminOnly || role === 'admin')
            .map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-campus-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-campus-navy-850'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-campus-teal-400" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
        </nav>

        <div className="p-4 border-t border-campus-navy-800 bg-campus-navy-900">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                onClose();
                onProfileClick();
              }}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-campus-teal-700 flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate max-w-[130px]">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 uppercase">{user?.role}</p>
              </div>
            </button>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

