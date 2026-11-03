import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { ExamManager } from './ExamManager';
import { NewsletterStudio } from './NewsletterStudio';
import { KnowledgeBaseManager } from './KnowledgeBaseManager';
import { UserRoleManager } from './UserRoleManager';
import { SystemHealth } from './SystemHealth';
import { 
  GraduationCap, 
  Newspaper, 
  BookOpen, 
  Users, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'exams' | 'newsletters' | 'knowledge' | 'roles' | 'health'>('exams');

  const tabs = [
    { id: 'exams', label: 'Examinations', icon: GraduationCap },
    { id: 'newsletters', label: 'Newsletter Studio', icon: Newspaper },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'roles', label: 'User Roles', icon: Users },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Admin Studio Header */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-navy-800 text-campus-teal-400 border border-campus-teal-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-campus-teal-400" />
              Administrative Operations Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SCEM Administrator Studio
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Institutional management suite for examination curricula, verified weekly publications, AI grounding documents, and security roles.
          </p>
        </div>

        <div className="p-3 bg-campus-navy-900/90 rounded-2xl border border-campus-navy-800 text-xs space-y-1">
          <p className="text-slate-400">Authenticated Administrator:</p>
          <p className="font-bold text-white text-sm">{user?.full_name}</p>
          <p className="text-[11px] text-campus-teal-300">{user?.department || 'Administration'}</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
                isActive
                  ? 'bg-campus-navy-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-campus-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'exams' && <ExamManager />}
        {activeTab === 'newsletters' && <NewsletterStudio />}
        {activeTab === 'knowledge' && <KnowledgeBaseManager />}
        {activeTab === 'roles' && <UserRoleManager />}
        {activeTab === 'health' && <SystemHealth />}
      </div>
    </div>
  );
};
