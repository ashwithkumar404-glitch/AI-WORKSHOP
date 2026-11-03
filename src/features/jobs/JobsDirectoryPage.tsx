import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { JobOpportunity } from '@/lib/dbTypes';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles,
  Filter,
  DollarSign
} from 'lucide-react';

export const JobsDirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setJobs(dbRepository.getJobs());
  };

  const types = [
    { id: 'all', label: 'All Openings' },
    { id: 'Full-time', label: 'Full-Time Roles' },
    { id: 'Internship', label: 'Internships' },
    { id: 'Drive', label: 'Campus Drives' },
  ];

  const filtered = jobs.filter((j) => {
    const matchesSearch = 
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.required_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || j.type === selectedType;
    const matchesWorkMode = selectedWorkMode === 'all' || j.work_mode === selectedWorkMode;

    return matchesSearch && matchesType && matchesWorkMode;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Verified Career Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verified Jobs & Campus Placement Drives
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Discover verified campus drive slots, dream-tier opportunities, and off-campus internships reviewed by the SCEM Career Guidance Cell.
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Opportunity Types */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === t.id
                    ? 'bg-campus-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or skill..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
        </div>

        {/* Work Mode Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Work Mode:</span>
          {['all', 'On-site', 'Hybrid', 'Remote'].map((wm) => (
            <button
              key={wm}
              onClick={() => setSelectedWorkMode(wm)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                selectedWorkMode === wm
                  ? 'bg-campus-navy-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {wm.toUpperCase()}
            </button>
          ))}
          <span className="ml-auto text-slate-400 font-mono text-[11px]">
            {filtered.length} Opportunities Listed
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No career opportunities match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or reset filters to browse all verified opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <Card key={job.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                      {job.logo_url ? (
                        <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-campus-teal-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{job.role}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-semibold text-campus-teal-700">{job.company}</span>
                        {job.is_verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge variant={job.type === 'Drive' ? 'teal' : job.type === 'Internship' ? 'primary' : 'neutral'} size="sm">
                    {job.type}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Key Metrics / Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-campus-teal-600 shrink-0" />
                    <span className="truncate">{job.ctc_or_stipend}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{job.location} ({job.work_mode})</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-800">Eligibility:</span>
                    <span className="truncate">{job.eligibility}</span>
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>

                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-campus-navy-800 hover:bg-campus-navy-900 px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
