import React from 'react';
import { Exam, ExamAttempt, Question, ExamResponse } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  RotateCcw, 
  ArrowLeft,
  BookOpen,
  ShieldCheck 
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

interface ExamResultViewProps {
  attemptId: string;
  onBack: () => void;
  onRetake?: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  attemptId,
  onBack,
  onRetake,
}) => {
  const attempt = dbRepository.getAttemptById(attemptId);
  const exam = attempt ? dbRepository.getExamById(attempt.exam_id) : undefined;
  const questions = exam ? dbRepository.getQuestionsForExam(exam.id) : [];
  const responses = dbRepository.getResponsesForAttempt(attemptId);

  if (!attempt || !exam) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Attempt record not found.</p>
        <Button variant="outline" size="sm" onClick={onBack} className="mt-4">
          Return to Examinations
        </Button>
      </div>
    );
  }

  const responseMap = new Map<string, ExamResponse>();
  for (const r of responses) {
    responseMap.set(r.question_id, r);
  }

  // Topic-level performance calculation based on actual question metadata and server-verified marks
  const topicStats: Record<string, { total: number; correct: number; marksObtained: number; marksTotal: number }> = {};
  for (const q of questions) {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0, marksObtained: 0, marksTotal: 0 };
    }
    const resp = responseMap.get(q.id);
    topicStats[q.topic].total += 1;
    topicStats[q.topic].marksTotal += q.marks;
    if (resp?.is_correct) {
      topicStats[q.topic].correct += 1;
      topicStats[q.topic].marksObtained += resp.marks_awarded;
    }
  }

  const minutesSpent = Math.floor(attempt.time_spent_seconds / 60);
  const secondsSpent = attempt.time_spent_seconds % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment Portal
        </button>
        <span className="text-xs text-slate-500 font-mono">Attempt ID: {attempt.id.substring(0, 12)}...</span>
      </div>

      {/* Main Scorecard Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl border ${
          attempt.passed
            ? 'bg-gradient-to-br from-emerald-900 via-campus-teal-900 to-campus-navy-950 border-emerald-500/30'
            : 'bg-gradient-to-br from-rose-950 via-slate-900 to-campus-navy-950 border-rose-500/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={attempt.passed ? 'success' : 'danger'} size="md">
                {attempt.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {attempt.passed ? 'EXAMINATION CLEARED' : 'NEEDS IMPROVEMENT'}
              </Badge>
              <span className="text-xs text-slate-300">
                Passing Benchmark: {exam.passing_marks} / {exam.total_marks} Marks
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{exam.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Completed on {formatInIST(attempt.submitted_at || attempt.created_at)}
            </p>
          </div>

          {/* Big Score Callout */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center shrink-0 min-w-[160px]">
            <span className="text-xs uppercase tracking-wider text-slate-300 block font-semibold">Final Score</span>
            <div className="text-3xl sm:text-4xl font-black mt-1 text-white">
              {attempt.score} <span className="text-base text-slate-400 font-normal">/ {attempt.max_score}</span>
            </div>
            <span className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${
              attempt.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {attempt.percentage}% Aggregate
            </span>
          </div>
        </div>

        {/* Detailed Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block">Time Utilized</span>
            <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-campus-teal-400" />
              {minutesSpent}m {secondsSpent}s of {exam.duration_minutes}m
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Total Questions</span>
            <span className="font-semibold text-white mt-0.5 block">{questions.length} Questions</span>
          </div>
          <div>
            <span className="text-slate-400 block">Retake Policy</span>
            <span className="font-semibold text-white mt-0.5 block capitalize">
              {exam.retake_policy.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Scoring Engine</span>
            <span className="font-semibold text-campus-teal-300 mt-0.5 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Server Logic
            </span>
          </div>
        </div>
      </div>

      {/* Topic-Level Performance Breakdown */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-campus-teal-600" />
          Topic Mastery & Metadata Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Calculated exclusively from evaluated question categories and marks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(topicStats).map(([topic, stats]) => {
            const topicPercent = stats.marksTotal > 0 ? Math.round((stats.marksObtained / stats.marksTotal) * 100) : 0;
            return (
              <div key={topic} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{topic}</span>
                  <span className="text-slate-600">{stats.marksObtained} / {stats.marksTotal} Marks ({topicPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      topicPercent >= 75 ? 'bg-emerald-500' : topicPercent >= 50 ? 'bg-campus-teal-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${topicPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {stats.correct} of {stats.total} questions answered correctly
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Question Review (Detailed Responses) */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-campus-teal-600" />
          Attempt Inspection
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Review your submitted options alongside verified scoring feedback.
        </p>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const resp = responseMap.get(q.id);
            const isCorrect = resp?.is_correct;
            const selected = resp?.selected_option_id;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : selected
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-slate-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-700">Q{idx + 1}.</span>
                    <Badge variant="neutral" size="sm">{q.topic}</Badge>
                  </div>
                  <Badge variant={isCorrect ? 'success' : selected ? 'danger' : 'neutral'} size="sm">
                    {isCorrect ? `+${resp?.marks_awarded || q.marks} Marks` : `0 / ${q.marks} Marks`}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-3">
                  {q.question_text}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                          isSelected
                            ? isCorrect
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-rose-400 bg-rose-50 text-rose-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span className="ml-auto text-[10px] uppercase font-bold tracking-wider">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Footer navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" size="md" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Assessments
        </Button>

        {exam.retake_policy !== 'single_attempt' && onRetake && (
          <Button variant="accent" size="md" onClick={onRetake}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Retake Assessment
          </Button>
        )}
      </div>
    </div>
  );
};
