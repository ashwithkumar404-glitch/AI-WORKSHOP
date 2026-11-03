import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { JobOpportunity } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  Search, 
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

export const JobManager: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<'Drive' | 'Internship' | 'Full-time'>('Drive');
  const [location, setLocation] = useState('Bengaluru / Mangaluru');
  const [ctc, setCtc] = useState('8.5 - 12.0 LPA');
  const [eligibility, setEligibility] = useState('B.E (CSE/ISE/ECE) >= 7.0 CGPA, No Active Backlogs');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [applyUrl, setApplyUrl] = useState('https://careers.sahyadri.edu.in');
  const [description, setDescription] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setJobs(dbRepository.getJobs());
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !applyUrl.trim()) return;

    const newJob: JobOpportunity = {
      id: `job-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      type,
      location,
      work_mode: 'Hybrid',
      required_skills: ['Problem Solving', 'Data Structures', 'Communication'],
      ctc_or_stipend: ctc,
      eligibility,
      deadline,
      apply_url: applyUrl.trim(),
      description: description.trim() || `${company} campus recruitment drive for ${role}.`,
      is_verified: isVerified,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbRepository.saveJob(newJob);
    loadJobs();
    setIsModalOpen(false);

    // Reset
    setCompany('');
    setRole('');
    setDescription('');
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      dbRepository.deleteJob(id);
      loadJobs();
    }
  };

  const handleToggleVerified = (job: JobOpportunity) => {
    const updated = { ...job, is_verified: !job.is_verified };
    dbRepository.saveJob(updated);
    loadJobs();
  };

  const filtered = jobs.filter(j => 
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-campus-teal-600" />
            Placement Drives & Job Postings Manager
          </h2>
          <p className="text-xs text-slate-500">
            Publish, verify, and maintain official campus recruitment drives and verified external opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter companies or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
          <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Job Drive
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Company & Role</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Compensation</th>
                <th className="pb-3">Deadline</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <span className="font-bold text-slate-900 block">{job.company}</span>
                    <span className="text-slate-600 text-[11px]">{job.role} • {job.location}</span>
                  </td>
                  <td className="py-3.5">
                    <Badge variant="teal" size="sm">{job.type}</Badge>
                  </td>
                  <td className="py-3.5 font-semibold text-slate-800">
                    {job.ctc_or_stipend}
                  </td>
                  <td className="py-3.5 text-slate-600 font-mono text-[11px]">
                    {job.deadline}
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => handleToggleVerified(job)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        job.is_verified 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle institutional verification badge"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {job.is_verified ? 'Verified Drive' : 'Unverified'}
                    </button>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Open external apply link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Campus Recruitment Drive"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google India, Infosys"
              required
            />
            <Input
              label="Role Title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Associate Software Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Drive">On-Campus Drive</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-Time Direct</option>
              </select>
            </div>
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru / Hybrid"
              required
            />
            <Input
              label="CTC or Stipend"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              placeholder="e.g. 10.5 LPA or ₹35,000/mo"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Eligibility Criteria"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. B.E CSE/ISE >= 7.0 CGPA"
              required
            />
            <Input
              label="Application Deadline (YYYY-MM-DD)"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>

          <Input
            label="Verified Application URL"
            value={applyUrl}
            onChange={(e) => setApplyUrl(e.target.value)}
            placeholder="https://..."
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description / Instructions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Instructions for students regarding rounds, resume submission, and registration..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_verified"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="rounded text-campus-teal-600 focus:ring-campus-teal-500"
            />
            <label htmlFor="is_verified" className="text-xs font-semibold text-slate-700">
              Mark as SCEM Verified Campus Drive
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
