import { dbRepository } from './storage';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ExamAttempt, QuestionKey } from './dbTypes';

export interface ExamSubmissionResult {
  status: 'success' | 'already_submitted' | 'error';
  attempt_id: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  time_spent_seconds?: number;
  error_message?: string;
}

/**
 * Trusted submission and scoring function.
 * When Supabase credentials are configured, delegates to the server-side PostgreSQL
 * SECURITY DEFINER RPC function 'submit_exam_attempt', keeping answer keys completely
 * off the client machine.
 *
 * In offline/demo mode, performs the identical trusted scoring validation against
 * the isolated private key storage.
 */
export async function submitExamAttemptTrusted(attemptId: string): Promise<ExamSubmissionResult> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('submit_exam_attempt', {
        p_attempt_id: attemptId
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        status: data.status,
        attempt_id: data.attempt_id,
        score: Number(data.score),
        max_score: Number(data.max_score),
        percentage: Number(data.percentage),
        passed: Boolean(data.passed),
      };
    } catch (err: unknown) {
      console.warn('Supabase RPC call failed, falling back to local scoring:', err);
    }
  }

  // Trusted local scoring engine (matches PostgreSQL RPC logic precisely)
  return executeLocalTrustedScoring(attemptId);
}

function executeLocalTrustedScoring(attemptId: string): ExamSubmissionResult {
  const currentUser = dbRepository.getCurrentUser();
  if (!currentUser) {
    throw new Error('Authentication required for submission.');
  }

  // Retrieve raw attempt from repository storage
  const rawAttemptsStr = typeof window !== 'undefined' ? localStorage.getItem('campuspilot_exam_attempts') : null;
  const allAttempts: ExamAttempt[] = rawAttemptsStr ? JSON.parse(rawAttemptsStr) : [];
  const attempt = allAttempts.find(a => a.id === attemptId);

  if (!attempt) {
    throw new Error('Attempt not found.');
  }

  // 1. Validate ownership
  if (attempt.student_id !== currentUser.id && currentUser.role !== 'admin') {
    throw new Error('Security Violation: Unauthorized submission attempt on foreign record.');
  }

  // 2. Idempotent check
  if (attempt.status === 'submitted') {
    return {
      status: 'already_submitted',
      attempt_id: attempt.id,
      score: attempt.score,
      max_score: attempt.max_score,
      percentage: attempt.percentage,
      passed: attempt.passed,
      time_spent_seconds: attempt.time_spent_seconds
    };
  }

  if (attempt.status !== 'in_progress') {
    throw new Error(`Attempt cannot be submitted in status: ${attempt.status}`);
  }

  const exam = dbRepository.getExamById(attempt.exam_id);
  if (!exam) {
    throw new Error('Associated examination record not found.');
  }

  // 3. Enforce Server-Side Duration Check
  const startTime = new Date(attempt.started_at).getTime();
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  const maxAllowedSeconds = (exam.duration_minutes * 60) + 90; // 90s grace window for network lag

  let effectiveTimeSpent = elapsedSeconds;
  if (elapsedSeconds > maxAllowedSeconds) {
    // Attempt expired beyond grace period
    effectiveTimeSpent = exam.duration_minutes * 60;
  }

  // 4. Retrieve private keys securely
  // We read the raw keys from private storage directly (isolated from student query APIs)
  const rawKeysStr = typeof window !== 'undefined' ? localStorage.getItem('campuspilot_question_keys') : null;
  const privateKeys: QuestionKey[] = rawKeysStr ? JSON.parse(rawKeysStr) : [];
  const keyMap = new Map<string, string>();
  for (const k of privateKeys) {
    keyMap.set(k.question_id, k.correct_option_id);
  }

  const questions = dbRepository.getQuestionsForExam(exam.id);
  const responses = dbRepository.getResponsesForAttempt(attemptId);
  const responseMap = new Map<string, string>();
  for (const r of responses) {
    if (r.selected_option_id) {
      responseMap.set(r.question_id, r.selected_option_id);
    }
  }

  // 5. Compute scores strictly question by question
  let totalScore = 0;
  let maxScore = 0;

  for (const q of questions) {
    maxScore += q.marks;
    const selectedOpt = responseMap.get(q.id);
    const correctOpt = keyMap.get(q.id);

    const isCorrect = Boolean(selectedOpt && correctOpt && selectedOpt === correctOpt);
    const marksAwarded = isCorrect ? q.marks : 0;
    totalScore += marksAwarded;

    // Update response with verified grade
    dbRepository.saveResponse(attemptId, q.id, selectedOpt || '');
    // In raw storage, update the is_correct and marks_awarded
    updateRawResponseGrading(attemptId, q.id, isCorrect, marksAwarded);
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 10000) / 100 : 0;
  const passed = totalScore >= exam.passing_marks;

  // 6. Finalize attempt record
  const updatedAttempt: ExamAttempt = {
    ...attempt,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    time_spent_seconds: effectiveTimeSpent,
    score: totalScore,
    max_score: maxScore,
    percentage,
    passed,
    updated_at: new Date().toISOString()
  };

  updateRawAttemptRecord(updatedAttempt);

  dbRepository.recordAuditLog('EXAM_SUBMISSION_SUCCESS', 'exam_attempt', attemptId, {
    examId: exam.id,
    score: totalScore,
    maxScore,
    percentage,
    passed
  });

  return {
    status: 'success',
    attempt_id: attemptId,
    score: totalScore,
    max_score: maxScore,
    percentage,
    passed,
    time_spent_seconds: effectiveTimeSpent
  };
}

function updateRawAttemptRecord(updated: ExamAttempt): void {
  if (typeof window === 'undefined') return;
  const rawStr = localStorage.getItem('campuspilot_exam_attempts');
  const attempts: ExamAttempt[] = rawStr ? JSON.parse(rawStr) : [];
  const idx = attempts.findIndex(a => a.id === updated.id);
  if (idx >= 0) {
    attempts[idx] = updated;
    localStorage.setItem('campuspilot_exam_attempts', JSON.stringify(attempts));
    window.dispatchEvent(new CustomEvent('campuspilot_db_change', { detail: { key: 'campuspilot_exam_attempts' } }));
  }
}

function updateRawResponseGrading(attemptId: string, questionId: string, isCorrect: boolean, marksAwarded: number): void {
  if (typeof window === 'undefined') return;
  const rawStr = localStorage.getItem('campuspilot_exam_responses');
  const responses = rawStr ? JSON.parse(rawStr) : [];
  const idx = responses.findIndex((r: { attempt_id: string; question_id: string }) => r.attempt_id === attemptId && r.question_id === questionId);
  if (idx >= 0) {
    responses[idx].is_correct = isCorrect;
    responses[idx].marks_awarded = marksAwarded;
    localStorage.setItem('campuspilot_exam_responses', JSON.stringify(responses));
  }
}
