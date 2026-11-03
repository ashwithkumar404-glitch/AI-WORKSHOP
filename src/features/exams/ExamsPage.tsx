import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { dbRepository } from '@/lib/storage';
import { Exam, ExamAttempt } from '@/lib/dbTypes';
import { ExamCard } from './ExamCard';
import { ActiveExamRunner } from './ActiveExamRunner';
import { ExamResultView } from './ExamResultView';
import { MyPerformanceSection } from './MyPerformanceSection';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { GraduationCap, Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'take-exam' | 'my-performance'>('take-exam');

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
      <div className="bg-campus-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              VTU Autonomous Examination System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Examinations & Evaluation Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Take scheduled Continuous Internal Evaluation (CIE) multiple-choice assessments and inspect server-graded transcripts.
          </p>
        </div>

        {/* Tab Switcher on the same page */}
        <div className="bg-campus-navy-950/80 p-1.5 rounded-2xl border border-campus-navy-750 flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('take-exam')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'take-exam'
                ? 'bg-campus-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Take an Exam ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('my-performance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-performance'
                ? 'bg-campus-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            My Performance ({attempts.filter(a => a.status === 'submitted').length})
          </button>
        </div>
      </div>

      {/* Prominent Tab Content */}
      {activeTab === 'take-exam' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Available Published Examinations</h2>
              <p className="text-xs text-slate-500">Select an assessment to initiate timed evaluation.</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Passing threshold: Typically 40% - 50%
            </span>
          </div>

          {exams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No active examinations published</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                All departmental assessments are currently concluded or unpublished. Check the academic newsletter for the next CIE schedule.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
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
    </div>
  );
};
