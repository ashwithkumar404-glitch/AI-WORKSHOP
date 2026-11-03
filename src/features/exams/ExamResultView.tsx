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
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers
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

  // Retrieve authorized answer keys for this completed attempt
  let reviewKeys: Record<string, { correct_option_id: string; explanation?: string }> = {};
  try {
    reviewKeys = dbRepository.getAttemptReviewKeys(attemptId);
  } catch (e) {
    console.warn('Could not load review keys:', e);
  }

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

  // Calculate detailed accuracy metrics
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Topic-level performance calculation based on actual question metadata and server-verified marks
  const topicStats: Record<string, { total: number; correct: number; marksObtained: number; marksTotal: number }> = {};
  
  for (const q of questions) {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0, marksObtained: 0, marksTotal: 0 };
    }
    const resp = responseMap.get(q.id);
    const keyInfo = reviewKeys[q.id];
    const correctOptId = keyInfo?.correct_option_id;
    const selectedOptId = resp?.selected_option_id;

    const isAnswered = Boolean(selectedOptId && selectedOptId.trim() !== '');
    const isCorrect = Boolean(isAnswered && correctOptId && selectedOptId === correctOptId);

    topicStats[q.topic].total += 1;
    topicStats[q.topic].marksTotal += q.marks;

    if (!isAnswered) {
      unansweredCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
      topicStats[q.topic].correct += 1;
      topicStats[q.topic].marksObtained += q.marks;
    } else {
      incorrectCount += 1;
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
            <span className="text-slate-400 block">Accuracy Breakdown</span>
            <span className="font-semibold text-white mt-0.5 block">
              <span className="text-emerald-400 font-bold">{correctCount} Correct</span> • <span className="text-rose-400 font-bold">{incorrectCount} Incorrect</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Unanswered</span>
            <span className="font-semibold text-white mt-0.5 block">{unansweredCount} Questions Skipped</span>
          </div>
          <div>
            <span className="text-slate-400 block">Scoring Engine</span>
            <span className="font-semibold text-campus-teal-300 mt-0.5 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Server Keys
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

      {/* Question Review (Detailed Responses with Clear Right/Wrong Status) */}
      <Card>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-campus-teal-600" />
              Detailed Attempt Inspection & Question Review
            </h3>
            <p className="text-xs text-slate-500">
              Inspect your submitted answer alongside the verified correct answer, mark attribution, and official explanation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {correctCount} Correct
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold">
              {incorrectCount} Incorrect
            </span>
            {unansweredCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                {unansweredCount} Unanswered
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const resp = responseMap.get(q.id);
            const keyInfo = reviewKeys[q.id];
            const correctOptId = keyInfo?.correct_option_id;
            const explanation = keyInfo?.explanation;

            const selected = resp?.selected_option_id;
            const isAnswered = Boolean(selected && selected.trim() !== '');
            const isCorrect = Boolean(isAnswered && correctOptId && selected === correctOptId);
            const marksAwarded = isCorrect ? q.marks : 0;

            const selectedOption = q.options.find(o => o.id === selected);
            const correctOption = q.options.find(o => o.id === correctOptId);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isAnswered
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-amber-200 bg-amber-50/20'
                }`}
              >
                {/* Question Header & Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                      Question {idx + 1}
                    </span>
                    <Badge variant="neutral" size="sm">{q.topic}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Explicit Status Badge */}
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        CORRECT
                      </span>
                    ) : isAnswered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        INCORRECT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        UNANSWERED
                      </span>
                    )}

                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                      isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      Score: {marksAwarded} / {q.marks}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-900 mb-4 leading-relaxed">
                  {q.question_text}
                </p>

                {/* Clear Answer Comparison Callout */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    !isAnswered
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      Your Submitted Answer
                    </span>
                    <span className="font-bold text-xs">
                      {isAnswered && selectedOption ? (
                        <>
                          <span className="underline mr-1">{selectedOption.id}.</span> {selectedOption.text}
                        </>
                      ) : (
                        <span className="italic text-slate-500">Not Attempted (Skipped)</span>
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                      Verified Correct Answer
                    </span>
                    <span className="font-bold text-xs">
                      {correctOption ? (
                        <>
                          <span className="underline mr-1">{correctOption.id}.</span> {correctOption.text}
                        </>
                      ) : (
                        <span>Option {correctOptId || '—'}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Options List with Highlighted Correct and Chosen States */}
                <div className="space-y-2 text-xs">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt.id;
                    const isThisCorrect = correctOptId === opt.id;

                    let optionStyle = 'border-slate-200 bg-white text-slate-700';
                    let badgeStyle = 'bg-slate-100 text-slate-700';

                    if (isThisCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold shadow-xs';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-semibold';
                      badgeStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            {opt.id}
                          </span>
                          <span className="text-xs leading-snug">{opt.text}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isSelected && (
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                            }`}>
                              Your Choice
                            </span>
                          )}
                          {isThisCorrect && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-Step Concise Explanation Box */}
                {explanation && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-campus-teal-800">
                      <Sparkles className="w-3.5 h-3.5 text-campus-teal-600" />
                      <span>Verified Solution & Explanation</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-5">
                      {explanation}
                    </p>
                  </div>
                )}
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
