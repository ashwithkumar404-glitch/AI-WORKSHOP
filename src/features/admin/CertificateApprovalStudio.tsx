import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { StudentAchievement } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

export const CertificateApprovalStudio: React.FC = () => {
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Review modal state
  const [reviewingAch, setReviewingAch] = useState<StudentAchievement | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    // Admin receives all records
    setAchievements(dbRepository.getAchievements());
  };

  const handleOpenReview = (ach: StudentAchievement) => {
    setReviewingAch(ach);
    setReviewRemarks(ach.faculty_remarks || '');
  };

  const handleDecision = (status: 'approved' | 'rejected') => {
    if (!reviewingAch) return;

    dbRepository.updateAchievementStatus(
      reviewingAch.id, 
      status, 
      reviewRemarks.trim() || (status === 'approved' ? 'Verified by Faculty' : 'Rejected after institutional inspection.')
    );

    loadAchievements();
    setReviewingAch(null);
  };

  const filtered = achievements.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch = 
      a.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = achievements.filter(a => a.status === 'pending').length;
  const approvedCount = achievements.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-campus-teal-600" />
            Student Event Participation & Certificate Approval Studio
          </h2>
          <p className="text-xs text-slate-500">
            Verify external hackathons, certifications, paper publications, and awards for institutional placement records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            {pendingCount} Pending Review
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {approvedCount} Verified
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-campus-navy-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or achievement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No submissions found</p>
            <p className="text-xs text-slate-500 mt-1">Student event entries matching your filter will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Student & Achievement</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Organizer / Event</th>
                  <th className="pb-3">Event Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ach) => (
                  <tr key={ach.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2">
                      <span className="font-bold text-slate-900 block">{ach.title}</span>
                      <span className="text-slate-600 text-[11px] font-medium">Submitted by: {ach.student_name}</span>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="teal" size="sm">{ach.category}</Badge>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700">
                      {ach.organizer}
                    </td>
                    <td className="py-3.5 text-slate-600 text-[11px]">
                      {ach.event_date}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        ach.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ach.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ach.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {ach.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {ach.status === 'pending' && <Clock className="w-3 h-3" />}
                        {ach.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {ach.proof_url && (
                          <a
                            href={ach.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Inspect Proof / Certificate URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReview(ach)}
                          className="text-xs py-1 px-2.5"
                        >
                          Review
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review & Decision Modal */}
      {reviewingAch && (
        <Modal
          isOpen={true}
          onClose={() => setReviewingAch(null)}
          title="Review Student Achievement & Proof"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{reviewingAch.title}</span>
                <Badge variant="teal" size="sm">{reviewingAch.category}</Badge>
              </div>
              <p className="text-slate-600">Student: <span className="font-semibold text-slate-800">{reviewingAch.student_name}</span></p>
              <p className="text-slate-600">Organizer: {reviewingAch.organizer} • Date: {reviewingAch.event_date}</p>
              <p className="text-slate-700 pt-1 leading-relaxed">{reviewingAch.description}</p>
              
              {reviewingAch.proof_url && (
                <div className="pt-2">
                  <a
                    href={reviewingAch.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-campus-teal-700 hover:text-campus-teal-800 font-bold"
                  >
                    <span>Inspect Attached Certificate / Project Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Remarks / Verification Notes
              </label>
              <textarea
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                rows={3}
                placeholder="e.g. Certificate verified via AWS Credential Check. Approved for placement hall of fame."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-campus-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setReviewingAch(null)}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => handleDecision('rejected')}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => handleDecision('approved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve & Certify
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

