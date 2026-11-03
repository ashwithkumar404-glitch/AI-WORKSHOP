import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { InterviewExperience, StudentAchievement } from '@/lib/dbTypes';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { 
  Award, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  PlusCircle, 
  MessageSquare, 
  GraduationCap, 
  Trophy,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const InterviewHubPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'interviews' | 'achievements'>('interviews');
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  
  // Submission modals
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isAchModalOpen, setIsAchModalOpen] = useState(false);

  // Expanded experience card tracking
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New experience form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [batchYear, setBatchYear] = useState(2025);
  const [verdict, setVerdict] = useState<'Selected' | 'Rejected' | 'In Progress'>('Selected');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');
  const [round1Name, setRound1Name] = useState('Round 1: Technical & Coding Assessment');
  const [round1Questions, setRound1Questions] = useState('');
  const [round1Tips, setRound1Tips] = useState('');
  const [overallAdvice, setOverallAdvice] = useState('');

  // New achievement form state
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState<'Hackathon' | 'Paper Publication' | 'Certification' | 'Sports & Cultural' | 'Open Source'>('Hackathon');
  const [achOrganizer, setAchOrganizer] = useState('');
  const [achEventDate, setAchEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [achDescription, setAchDescription] = useState('');
  const [achProofUrl, setAchProofUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setExperiences(dbRepository.getInterviewExperiences());
    setAchievements(dbRepository.getAchievements());
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    const newExp: InterviewExperience = {
      id: `exp-${Date.now()}`,
      student_id: user?.id || 'guest',
      student_name: `${user?.full_name || 'Senior'} (${user?.department || 'CSE'})`,
      company,
      role,
      batch_year: Number(batchYear),
      verdict,
      difficulty,
      rounds: [
        {
          round_name: round1Name,
          duration_minutes: 60,
          questions_asked: round1Questions || 'Array traversal, SQL queries, and project architecture defense.',
          tips: round1Tips || 'Be confident and explain edge-case trade-offs.'
        }
      ],
      overall_advice: overallAdvice || 'Revise core CS subjects and take mock placement tests regularly.',
      is_approved: true, // Auto-approved in demo/development
      created_at: new Date().toISOString()
    };

    dbRepository.submitInterviewExperience(newExp);
    loadData();
    setIsExpModalOpen(false);
    // Reset form
    setCompany('');
    setRole('');
    setRound1Questions('');
    setRound1Tips('');
    setOverallAdvice('');
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle || !achOrganizer) return;

    const newAch: StudentAchievement = {
      id: `ach-${Date.now()}`,
      student_id: user?.id || 'guest',
      student_name: user?.full_name || 'Student',
      title: achTitle,
      category: achCategory,
      organizer: achOrganizer,
      event_date: achEventDate,
      description: achDescription,
      proof_url: achProofUrl || undefined,
      status: 'approved',
      faculty_remarks: 'Verified against department records.',
      created_at: new Date().toISOString()
    };

    dbRepository.submitAchievement(newAch);
    loadData();
    setIsAchModalOpen(false);
    // Reset form
    setAchTitle('');
    setAchOrganizer('');
    setAchDescription('');
    setAchProofUrl('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Alumni & Senior Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Debriefs & Verified Achievements
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Real round-by-round interview debriefs from recently placed Sahyadri seniors, alongside student innovation achievements and hackathon laurels.
          </p>
        </div>

        {/* Action Buttons & Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'interviews' ? (
            <Button variant="accent" size="sm" onClick={() => setIsExpModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Share Interview Experience
            </Button>
          ) : (
            <Button variant="accent" size="sm" onClick={() => setIsAchModalOpen(true)}>
              <Trophy className="w-4 h-4 mr-1.5" />
              Submit Achievement Record
            </Button>
          )}

          <div className="bg-campus-navy-900/90 p-1.5 rounded-2xl border border-campus-navy-700 flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('interviews')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'interviews'
                  ? 'bg-campus-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Interview Debriefs ({experiences.length})
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-campus-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Achievements ({achievements.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'interviews' ? (
        /* Interview Experiences List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing {experiences.length} verified interview debriefs from Sahyadri seniors
            </span>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => {
              const isExpanded = expandedId === exp.id;
              return (
                <Card key={exp.id} className="p-5 space-y-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-campus-navy-900 text-campus-teal-400 font-bold text-lg flex items-center justify-center shrink-0 shadow-inner">
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{exp.company}</h3>
                          <Badge variant={exp.verdict === 'Selected' ? 'success' : exp.verdict === 'In Progress' ? 'warning' : 'primary'} size="sm">
                            {exp.verdict}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {exp.role} • Shared by <span className="font-semibold text-slate-800">{exp.student_name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Difficulty: {exp.difficulty}
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary Advice */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-0.5">Key Takeaway / Advice:</span>
                    {exp.overall_advice}
                  </div>

                  {/* Expanded Rounds Breakdown */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Round-by-Round Breakdown
                      </h4>
                      {exp.rounds.map((round, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{round.round_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">~{round.duration_minutes} mins</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 block mb-0.5">Topics & Questions Asked:</span>
                            <p className="text-slate-600 leading-relaxed">{round.questions_asked}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-campus-teal-800 block mb-0.5">Preparation Strategy / Tips:</span>
                            <p className="text-slate-600 leading-relaxed">{round.tips}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Student Achievements Stream */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Verified Student Innovation, Hackathon, and Research Honors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((ach) => (
              <Card key={ach.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="sm">{ach.category}</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(ach.event_date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ach.title}</h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ach.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div><span className="font-semibold text-slate-700">Organizer:</span> {ach.organizer}</div>
                  <div><span className="font-semibold text-slate-700">Student:</span> {ach.student_name}</div>
                  {ach.faculty_remarks && (
                    <div className="text-[11px] text-emerald-800 font-medium pt-0.5">
                      ✓ Faculty Review: {ach.faculty_remarks}
                    </div>
                  )}
                </div>

                {ach.proof_url && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <a
                      href={ach.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-campus-teal-700 hover:text-campus-teal-800"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Share Interview Modal */}
      <Modal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        title="Share Campus Interview Debrief"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveExperience} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Infosys, TCS, AWS"
              required
            />
            <Input
              label="Role & Package"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE-1 (₹9 LPA)"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Year</label>
              <input
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Final Verdict</label>
              <select
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <Input
            label="Round 1 Title"
            value={round1Name}
            onChange={(e) => setRound1Name(e.target.value)}
            placeholder="e.g. Online Coding Assessment"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Questions & Concepts Asked</label>
            <textarea
              value={round1Questions}
              onChange={(e) => setRound1Questions(e.target.value)}
              rows={3}
              placeholder="What questions were asked? E.g., Two pointers, SQL group by, deadlock conditions..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Tips & Advice for Juniors</label>
            <textarea
              value={overallAdvice}
              onChange={(e) => setOverallAdvice(e.target.value)}
              rows={2}
              placeholder="What would you suggest to 3rd and 4th-year students preparing for this drive?"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsExpModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Publish Debrief</Button>
          </div>
        </form>
      </Modal>

      {/* Submit Achievement Modal */}
      <Modal
        isOpen={isAchModalOpen}
        onClose={() => setIsAchModalOpen(false)}
        title="Submit Student Achievement Record"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAchievement} className="space-y-4 text-xs">
          <Input
            label="Achievement Title"
            value={achTitle}
            onChange={(e) => setAchTitle(e.target.value)}
            placeholder="e.g. 1st Place at National Smart India Hackathon"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={achCategory}
                onChange={(e) => setAchCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Paper Publication">Paper Publication</option>
                <option value="Certification">Certification</option>
                <option value="Sports & Cultural">Sports & Cultural</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <Input
              label="Organizer / Host"
              value={achOrganizer}
              onChange={(e) => setAchOrganizer(e.target.value)}
              placeholder="e.g. AICTE, AWS, KDEM"
              required
            />
          </div>

          <Input
            label="Event Date"
            type="date"
            value={achEventDate}
            onChange={(e) => setAchEventDate(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description</label>
            <textarea
              value={achDescription}
              onChange={(e) => setAchDescription(e.target.value)}
              rows={3}
              placeholder="Describe your project, ranking, or recognition details..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <Input
            label="Certificate or Project URL (Optional)"
            value={achProofUrl}
            onChange={(e) => setAchProofUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Submit for Verification</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
