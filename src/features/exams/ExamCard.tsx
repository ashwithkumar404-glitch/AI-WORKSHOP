import React from 'react';
import { Exam, ExamAttempt } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Clock, Award, FileQuestion, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
  attempts: ExamAttempt[];
  onStart: (examId: string) => void;
  onViewResults: (attemptId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  attempts,
  onStart,
  onViewResults,
}) => {
  const myAttempts = attempts.filter(a => a.exam_id === exam.id);
  const activeAttempt = myAttempts.find(a => a.status === 'in_progress');
  const submittedAttempts = myAttempts.filter(a => a.status === 'submitted');
  const latestSubmitted = submittedAttempts[submittedAttempts.length - 1];

  const canAttempt = !latestSubmitted || (
    exam.retake_policy !== 'single_attempt' &&
    myAttempts.length < exam.max_attempts
  );

  return (
    <Card hoverEffect className="flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-200">
              {exam.code}
            </span>
            <span className="text-xs text-slate-500 font-medium">Sem {exam.semester}</span>
          </div>

          <Badge variant={exam.retake_policy === 'single_attempt' ? 'neutral' : 'teal'} size="sm">
            {exam.retake_policy === 'single_attempt' ? 'Single Attempt' : 'Multiple Allowed'}
          </Badge>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug">{exam.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {exam.description || 'Autonomous departmental evaluation for undergraduate curriculum.'}
          </p>
        </div>

        {/* Exam Metadata Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-campus-teal-600" />
              {exam.duration_minutes}m
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total</span>
            <span className="font-bold text-slate-800 block mt-0.5">{exam.total_marks} Marks</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passing</span>
            <span className="font-bold text-slate-800 block mt-0.5">{exam.passing_marks} Marks</span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {latestSubmitted ? (
          <div>
            <Badge variant={latestSubmitted.passed ? 'success' : 'danger'} size="sm">
              Score: {latestSubmitted.score} / {latestSubmitted.max_score} ({latestSubmitted.percentage}%)
            </Badge>
            <button
              onClick={() => onViewResults(latestSubmitted.id)}
              className="block text-[11px] font-semibold text-campus-teal-700 hover:underline mt-1"
            >
              View Report
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-500 font-medium">Ready to start</span>
        )}

        <div>
          {activeAttempt ? (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onStart(exam.id)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Resume Attempt
            </Button>
          ) : canAttempt ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStart(exam.id)}
            >
              {latestSubmitted ? 'Retake Exam' : 'Start Exam'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled
              title="Attempt limit reached under retake policy"
            >
              Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
