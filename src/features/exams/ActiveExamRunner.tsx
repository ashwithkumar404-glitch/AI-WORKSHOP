import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Exam, Question, ExamAttempt, ExamResponse } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { submitExamAttemptTrusted } from '@/lib/examScoring';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  RotateCcw,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ActiveExamRunnerProps {
  exam: Exam;
  attempt: ExamAttempt;
  onFinished: (attemptId: string) => void;
  onExit: () => void;
}

export const ActiveExamRunner: React.FC<ActiveExamRunnerProps> = ({
  exam,
  attempt,
  onFinished,
  onExit,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const elapsed = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000);
    const total = exam.duration_minutes * 60;
    return Math.max(0, total - elapsed);
  });
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions and existing saved responses
  useEffect(() => {
    const qList = dbRepository.getQuestionsForExam(exam.id);
    setQuestions(qList);

    const savedResp = dbRepository.getResponsesForAttempt(attempt.id);
    const mapping: Record<string, string> = {};
    for (const r of savedResp) {
      if (r.selected_option_id) {
        mapping[r.question_id] = r.selected_option_id;
      }
    }
    setSelectedAnswers(mapping);
  }, [exam.id, attempt.id]);

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await submitExamAttemptTrusted(attempt.id);
      if (res.status === 'success' || res.status === 'already_submitted') {
        onFinished(attempt.id);
      } else {
        setErrorMessage(res.error_message || 'Submission error');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt.id, onFinished]);

  // Countdown Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleFinalSubmit]);

  // Save selection with autosave
  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // Persist immediately to prevent loss on page refresh
    try {
      dbRepository.saveResponse(attempt.id, questionId, optionId);
    } catch (e) {
      console.error('Failed to autosave option:', e);
    }
  };

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isTimeCritical = secondsRemaining <= 300; // Under 5 mins

  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner: Exam Title & Countdown Timer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-200">
              {exam.code}
            </span>
            <span className="text-xs font-semibold text-slate-500">Continuous Internal Evaluation</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1 truncate max-w-md sm:max-w-lg">
            {exam.title}
          </h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              isTimeCritical
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-campus-navy-900 text-campus-teal-400 border-campus-navy-800 shadow-inner'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-campus-teal-400'}`} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsReviewOpen(true)}
            className="shadow-sm"
          >
            Review & Submit
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Question Navigation Bubbles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wide">
            Question Navigation ({answeredCount} of {questions.length} answered)
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-campus-teal-600"></span>
              Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white"></span>
              Unanswered
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'ring-2 ring-campus-navy-800 ring-offset-2'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-campus-teal-600 text-white shadow-sm hover:bg-campus-teal-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Box */}
      {currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="md">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="neutral" size="sm">
                Topic: {currentQ.topic}
              </Badge>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQ.question_text}
          </div>

          {/* MCQ Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;

              return (
                <label
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-campus-teal-50/60 border-campus-teal-500 ring-1 ring-campus-teal-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => handleSelectOption(currentQ.id, opt.id)}
                    className="mt-1 h-4 w-4 text-campus-teal-600 border-slate-300 focus:ring-campus-teal-500"
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-campus-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="text-slate-800 font-medium">{opt.text}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => setIsReviewOpen(true)}
                >
                  Review All Answers
                  <Send className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">Loading assessment questions...</p>
        </div>
      )}

      {/* Review Screen Modal */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Assessment Summary & Review"
        maxWidth="2xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Questions</span>
              <span className="text-xl font-bold text-slate-900">{questions.length}</span>
            </div>
            <div className="p-3 bg-campus-teal-50 rounded-xl border border-campus-teal-200">
              <span className="text-xs text-campus-teal-800 block">Answered</span>
              <span className="text-xl font-bold text-campus-teal-700">{answeredCount}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 block">Unanswered</span>
              <span className="text-xl font-bold text-amber-700">{unansweredCount}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-3 max-h-60 overflow-y-auto divide-y divide-slate-100">
            {questions.map((q, idx) => {
              const ans = selectedAnswers[q.id];
              return (
                <div key={q.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Q{idx + 1}.</span>
                    <span className="text-slate-600 truncate max-w-xs">{q.question_text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ans ? (
                      <span className="font-bold text-campus-teal-700 bg-campus-teal-50 px-2 py-0.5 rounded border border-campus-teal-200">
                        Option {ans}
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                        Not Answered
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsReviewOpen(false);
                      }}
                      className="text-campus-navy-800 hover:underline font-medium text-[11px]"
                    >
                      Jump
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-campus-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>Server-Side Security Enforced:</strong> Correct answers are never sent to the browser. Your submission will be evaluated securely on the server upon confirmation.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsReviewOpen(false)}>
              Back to Test
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setIsReviewOpen(false);
                setIsConfirmOpen(true);
              }}
            >
              Proceed to Final Submission
            </Button>
          </div>
        </div>
      </Modal>

      {/* Final Submission Confirmation Dialog */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Final Submission"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Are you sure you want to finalize your submission for <strong>{exam.title}</strong>?
          </p>

          {unansweredCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You still have <strong>{unansweredCount} unanswered questions</strong>.</span>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Once submitted, your attempt is closed and cannot be altered. Scores will be computed and recorded in your permanent academic performance log.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
            >
              Confirm & Finalize
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

