import { describe, it, expect, beforeEach } from 'vitest';
import { dbRepository } from '@/lib/storage';
import { submitExamAttemptTrusted } from '@/lib/examScoring';
import { INITIAL_STUDENT_USER, INITIAL_ADMIN_USER } from '@/lib/mockData';

describe('Examination Engine & Server-Side Scoring Security', () => {
  beforeEach(() => {
    dbRepository.resetToDefaults();
  });

  it('prohibits ordinary students from inspecting private answer keys', () => {
    // Current user is student
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);

    // Attempting to retrieve private key must throw authorization error
    expect(() => {
      dbRepository.getQuestionKey('q-daa-1');
    }).toThrow(/Access Denied/);
  });

  it('allows administrators to inspect answer keys in Admin Studio', () => {
    dbRepository.setCurrentUser(INITIAL_ADMIN_USER);
    const key = dbRepository.getQuestionKey('q-daa-1');
    expect(key).toBeDefined();
    expect(key?.correct_option_id).toBe('B');
  });

  it('creates an exam attempt and records responses securely', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const examId = 'exam-dbms-402'; // Has 4 questions, total 12 marks
    const attempt = dbRepository.createAttempt(examId);

    expect(attempt).toBeDefined();
    expect(attempt.status).toBe('in_progress');
    expect(attempt.student_id).toBe(INITIAL_STUDENT_USER.id);

    // Answer 3 questions correctly and 1 incorrectly
    // q-dbms-1 correct: B
    // q-dbms-2 correct: D
    // q-dbms-3 correct: A
    // q-dbms-4 correct: B (we select C -> incorrect)
    dbRepository.saveResponse(attempt.id, 'q-dbms-1', 'B');
    dbRepository.saveResponse(attempt.id, 'q-dbms-2', 'D');
    dbRepository.saveResponse(attempt.id, 'q-dbms-3', 'A');
    dbRepository.saveResponse(attempt.id, 'q-dbms-4', 'C'); // incorrect

    const saved = dbRepository.getResponsesForAttempt(attempt.id);
    expect(saved.length).toBe(4);
  });

  it('executes server-side scoring accurately and updates status to submitted', async () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const examId = 'exam-dbms-402';
    const attempt = dbRepository.createAttempt(examId);

    // Questions in dbms-402 have 3 marks each (total 12 marks)
    // 3 correct (9 marks), 1 wrong (0 marks)
    dbRepository.saveResponse(attempt.id, 'q-dbms-1', 'B'); // correct (3)
    dbRepository.saveResponse(attempt.id, 'q-dbms-2', 'D'); // correct (3)
    dbRepository.saveResponse(attempt.id, 'q-dbms-3', 'A'); // correct (3)
    dbRepository.saveResponse(attempt.id, 'q-dbms-4', 'C'); // wrong (0)

    const result = await submitExamAttemptTrusted(attempt.id);

    expect(result.status).toBe('success');
    expect(result.score).toBe(9);
    expect(result.max_score).toBe(12);
    expect(result.percentage).toBe(75);
    expect(result.passed).toBe(true); // passing mark is 6

    // Verify stored attempt in db
    const finalAttempt = dbRepository.getAttemptById(attempt.id);
    expect(finalAttempt?.status).toBe('submitted');
    expect(finalAttempt?.score).toBe(9);
  });

  it('handles duplicate final submissions idempotently', async () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const examId = 'exam-dbms-402';
    const attempt = dbRepository.createAttempt(examId);

    dbRepository.saveResponse(attempt.id, 'q-dbms-1', 'B');
    dbRepository.saveResponse(attempt.id, 'q-dbms-2', 'D');

    // First submission
    const res1 = await submitExamAttemptTrusted(attempt.id);
    expect(res1.status).toBe('success');

    // Second submission of the same attempt must be idempotent
    const res2 = await submitExamAttemptTrusted(attempt.id);
    expect(res2.status).toBe('already_submitted');
    expect(res2.score).toBe(res1.score);
  });

  it('rejects attempt submission by another student (ownership violation)', async () => {
    // Student 1 starts attempt
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const attempt = dbRepository.createAttempt('exam-dbms-402');

    // Switch session to another student
    const student2 = {
      ...INITIAL_STUDENT_USER,
      id: 'student-2-attacker',
      email: 'attacker@sahyadri.edu.in',
    };
    dbRepository.setCurrentUser(student2);

    // Student 2 tries to submit Student 1's attempt
    await expect(submitExamAttemptTrusted(attempt.id)).rejects.toThrow(/Security Violation|Unauthorized/);
  });

  it('enforces single attempt retake policy', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    // DAA-401 is single_attempt only
    const existing = dbRepository.getAttempts().filter(a => a.exam_id === 'exam-daa-401');
    expect(existing.length).toBeGreaterThanOrEqual(1);

    // Attempting to create a second attempt must fail
    expect(() => {
      dbRepository.createAttempt('exam-daa-401');
    }).toThrow(/Retake Policy Restriction/);
  });

  it('correctly validates the Direction Sense question (Rahul walks 12 km North -> 5 km East)', async () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const examId = 'exam-logic-205'; // Logical Reasoning Assessment 5 (Direction Sense)
    const attempt = dbRepository.createAttempt(examId);

    // Question q-dir-1: Rahul walks 12 km North, turns right and walks 5 km. Then turns right and walks 12 km.
    // Correct option is 'A' (5 km East)
    const questions = dbRepository.getQuestionsForExam(examId);
    const dirQuestion = questions.find(q => q.id === 'q-dir-1');
    expect(dirQuestion).toBeDefined();
    expect(dirQuestion?.question_text).toContain('12 km North');

    // Student selects option 'A' (5 km East)
    dbRepository.saveResponse(attempt.id, 'q-dir-1', 'A');

    const result = await submitExamAttemptTrusted(attempt.id);
    expect(result.status).toBe('success');
    expect(result.score).toBeGreaterThanOrEqual(3);

    // Retrieve authorized review keys post-submission
    const reviewKeys = dbRepository.getAttemptReviewKeys(attempt.id);
    expect(reviewKeys['q-dir-1']).toBeDefined();
    expect(reviewKeys['q-dir-1'].correct_option_id).toBe('A');
    expect(reviewKeys['q-dir-1'].explanation).toContain('5 km directly East');

    // Verify stored response has is_correct = true and marks_awarded = 3
    const responses = dbRepository.getResponsesForAttempt(attempt.id);
    const dirResponse = responses.find(r => r.question_id === 'q-dir-1');
    expect(dirResponse?.is_correct).toBe(true);
    expect(dirResponse?.marks_awarded).toBe(3);
  });

  it('scores incorrect and unanswered questions as 0 marks with verified explanations on review', async () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const examId = 'exam-logic-205';
    const attempt = dbRepository.createAttempt(examId);

    // Student selects WRONG option 'C' (13 km North-East) for q-dir-1
    dbRepository.saveResponse(attempt.id, 'q-dir-1', 'C');
    // Leaves other questions unanswered

    const result = await submitExamAttemptTrusted(attempt.id);
    expect(result.status).toBe('success');

    const responses = dbRepository.getResponsesForAttempt(attempt.id);
    const dirResponse = responses.find(r => r.question_id === 'q-dir-1');
    expect(dirResponse?.is_correct).toBe(false);
    expect(dirResponse?.marks_awarded).toBe(0);

    // Post-submission review is available to the owner
    const reviewKeys = dbRepository.getAttemptReviewKeys(attempt.id);
    expect(reviewKeys['q-dir-1'].correct_option_id).toBe('A');
    expect(reviewKeys['q-dir-1'].explanation).toBeDefined();
  });
});

