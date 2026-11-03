import React, { useState } from 'react';
import { ExamAttempt, Exam } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { PerformanceCharts } from './PerformanceCharts';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ChevronRight, 
  BarChart3,
  Search
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

interface MyPerformanceSectionProps {
  attempts: ExamAttempt[];
  onInspectAttempt: (attemptId: string) => void;
}

export const MyPerformanceSection: React.FC<MyPerformanceSectionProps> = ({
  attempts,
  onInspectAttempt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const completedAttempts = attempts
    .filter(a => a.status === 'submitted')
    .sort((a, b) => new Date(b.submitted_at || b.created_at).getTime() - new Date(a.submitted_at || a.created_at).getTime());

  const filtered = completedAttempts.filter(att => {
    const title = att.exam?.title || '';
    const code = att.exam?.code || '';
    const q = searchTerm.toLowerCase();
    return title.toLowerCase().includes(q) || code.toLowerCase().includes(q);
  });

  // Calculate real performance metrics
  const totalScoreObtained = completedAttempts.reduce((sum, a) => sum + Number(a.score), 0);
  const totalMaxScore = completedAttempts.reduce((sum, a) => sum + Number(a.max_score), 0);
  const overallAvgPercent = totalMaxScore > 0 ? Math.round((totalScoreObtained / totalMaxScore) * 100) : 0;
  const passedCount = completedAttempts.filter(a => a.passed).length;

  return (
    <div className="space-y-6">
      {/* High-level performance stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-campus-navy-50 text-campus-navy-800 flex items-center justify-center shrink-0 border border-campus-navy-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Evaluations Completed</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{completedAttempts.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Autonomous CIE records</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-campus-teal-50 text-campus-teal-700 flex items-center justify-center shrink-0 border border-campus-teal-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Cumulative Average</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{overallAvgPercent}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{totalScoreObtained} of {totalMaxScore} marks earned</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Clearance Rate</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {completedAttempts.length > 0 ? Math.round((passedCount / completedAttempts.length) * 100) : 0}%
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{passedCount} tests passed</p>
          </div>
        </Card>
      </div>

      {/* Topic-Level Performance Analytics & Personalized Skill-Gap Analysis */}
      <SkillGapAnalysis attempts={completedAttempts} />

      {/* Longitudinal Performance Trend Chart */}
      <Card>
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-campus-teal-600" />
            Academic Progression Over Time
          </h3>
          <p className="text-xs text-slate-500">
            Trendline constructed from verified examination attempt records in the database.
          </p>
        </div>

        <PerformanceCharts attempts={completedAttempts} />
      </Card>

      {/* Attempt History Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Attempt Records & Transcripts</h3>
            <p className="text-xs text-slate-500">Inspect full question responses, marks awarded, and topic mastery.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject or code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No attempts match your query.</p>
            <p className="text-xs text-slate-500 mt-1">Take published exams to build your evaluated academic transcript.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Subject / Code</th>
                  <th className="pb-3">Attempt #</th>
                  <th className="pb-3">Completed On</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Score & Percentage</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2">
                      <span className="font-bold text-slate-900 block">{att.exam?.title || 'Assessment'}</span>
                      <span className="font-mono text-[11px] text-slate-500">{att.exam?.code || '—'}</span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-600">
                      Attempt {att.attempt_number}
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {formatInIST(att.submitted_at || att.created_at)}
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900">
                        {att.score} / {att.max_score}
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Badge variant={att.passed ? 'success' : 'danger'} size="sm">
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onInspectAttempt(att.id)}
                        className="text-xs py-1 px-2.5"
                      >
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

