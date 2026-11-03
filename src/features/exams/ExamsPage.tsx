import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { dbRepository } from '@/lib/storage';
import { Exam, ExamAttempt, ExamCategory } from '@/lib/dbTypes';
import { ExamCard } from './ExamCard';
import { ActiveExamRunner } from './ActiveExamRunner';
import { ExamResultView } from './ExamResultView';
import { MyPerformanceSection } from './MyPerformanceSection';
import { PdfToMcqGeneratorModal } from './PdfToMcqGeneratorModal';
import { CustomDrillLauncherModal } from './CustomDrillLauncherModal';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  FileUp,
  BrainCircuit,
  Layers
} from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'take-exam' | 'my-performance'>('take-exam');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);

  // Active state handlers
  const [runningExamId, setRunningExamId] = useState<string | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);
  const [viewingResultId, setViewingResultId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const handleDbChange = () => loadData();
    window.addEventListener('campuspilot_db_change', handleDbChange);
    return () => window.removeEventListener('campuspilot_db_change', handleDbChange);
  }, [user?.id]);

  const loadData = () => {
    const pubExams = dbRepository.getExams(); // Published only
    const myAttempts = dbRepository.getAttempts();
    setExams(pubExams);
    setAttempts(myAttempts);
  };

  const handleStartExam = (examId: string) => {
    try {
      const attempt = dbRepository.createAttempt(examId);
      setActiveAttempt(attempt);
      setRunningExamId(examId);
      setViewingResultId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not initialize exam attempt.');
    }
  };

  const handleExamFinished = (attemptId: string) => {
    setRunningExamId(null);
    setActiveAttempt(null);
    setViewingResultId(attemptId);
    loadData();
  };

  const handleExitActiveExam = () => {
    setRunningExamId(null);
    setActiveAttempt(null);
    loadData();
  };

  const categories = [
    { id: 'all', label: 'All Assessments' },
    { id: 'Quantitative Aptitude', label: 'Quantitative' },
    { id: 'Logical Reasoning', label: 'Logical' },
    { id: 'Verbal Ability', label: 'Verbal' },
    { id: 'Technical & Core CS', label: 'Technical & CS' },
    { id: 'Company Specific Mock', label: 'Custom & Mocks' },
  ];

  const filteredExams = exams.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'all' || 
      e.category === selectedCategory ||
      (!e.category && selectedCategory === 'Technical & Core CS');

    return matchesSearch && matchesCategory;
  });

  // If currently running an exam
  if (runningExamId && activeAttempt) {
    const currentExam = exams.find(e => e.id === runningExamId);
    if (currentExam) {
      return (
        <ActiveExamRunner
          exam={currentExam}
          attempt={activeAttempt}
          onFinished={handleExamFinished}
          onExit={handleExitActiveExam}
        />
      );
    }
  }

  // If viewing a completed attempt report
  if (viewingResultId) {
    return (
      <ExamResultView
        attemptId={viewingResultId}
        onBack={() => setViewingResultId(null)}
        onRetake={() => {
          const att = dbRepository.getAttemptById(viewingResultId);
          if (att) handleStartExam(att.exam_id);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Aptitude & Placement Examination Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Aptitude Assessments & Evaluation
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Practice ~20 structured company aptitude evaluations, time-bounded technical mock exams, or synthesize custom questions from syllabus PDFs.
          </p>
        </div>

        {/* Tab & Generator Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsDrillModalOpen(true)}
            className="text-xs"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Custom Drill (5, 10, 25, 50 MCQs)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfModalOpen(true)}
            className="text-xs border-slate-600 text-white hover:bg-slate-800"
          >
            <FileUp className="w-4 h-4 mr-1.5" />
            PDF-to-MCQ
          </Button>

          <div className="bg-campus-navy-900/90 p-1.5 rounded-2xl border border-campus-navy-700 flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('take-exam')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'take-exam'
                  ? 'bg-campus-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Exams ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab('my-performance')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-performance'
                  ? 'bg-campus-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              Transcripts ({attempts.filter(a => a.status === 'submitted').length})
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Tab Content */}
      {activeTab === 'take-exam' ? (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-campus-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assessments by topic or code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {filteredExams.length} published assessments • Anti-cheat server-side validated scoring
            </span>
          </div>

          {filteredExams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching examinations found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try searching for another topic or reset the category filters. You can also generate an exam instantly from any PDF using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  attempts={attempts}
                  onStart={handleStartExam}
                  onViewResults={(attId) => setViewingResultId(attId)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <MyPerformanceSection
          attempts={attempts}
          onInspectAttempt={(attId) => setViewingResultId(attId)}
        />
      )}

      {/* PDF to MCQ Modal */}
      <PdfToMcqGeneratorModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onExamCreated={(newExamId) => {
          loadData();
          handleStartExam(newExamId);
        }}
      />

      {/* Quick Custom Drill Modal */}
      <CustomDrillLauncherModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
        onExamCreated={(newExamId) => {
          loadData();
          handleStartExam(newExamId);
        }}
      />
    </div>
  );
};
