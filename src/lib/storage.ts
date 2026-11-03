import { 
  UserProfile, 
  Exam, 
  Question, 
  QuestionKey, 
  ExamAttempt, 
  ExamResponse, 
  Newsletter, 
  KnowledgeDocument,
  AuditLog,
  JobOpportunity,
  StudyMaterial,
  CodingProblem,
  CodingSubmission,
  WorldNewsArticle,
  InterviewExperience,
  StudentAchievement
} from './dbTypes';
import {
  INITIAL_STUDENT_USER,
  INITIAL_ADMIN_USER,
  INITIAL_EXAMS,
  INITIAL_QUESTIONS,
  INITIAL_QUESTION_KEYS,
  INITIAL_ATTEMPTS,
  INITIAL_RESPONSES,
  INITIAL_NEWSLETTERS,
  INITIAL_KNOWLEDGE_DOCS,
  VERIFIED_JOB_OPPORTUNITIES,
  VERIFIED_STUDY_MATERIALS,
  CODING_LAB_PROBLEMS,
  WORLD_TECH_NEWS,
  VERIFIED_INTERVIEW_EXPERIENCES,
  VERIFIED_STUDENT_ACHIEVEMENTS
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'campuspilot_current_user',
  PROFILES: 'campuspilot_profiles',
  EXAMS: 'campuspilot_exams',
  QUESTIONS: 'campuspilot_questions',
  QUESTION_KEYS: 'campuspilot_question_keys',
  ATTEMPTS: 'campuspilot_exam_attempts',
  RESPONSES: 'campuspilot_exam_responses',
  NEWSLETTERS: 'campuspilot_newsletters',
  KNOWLEDGE_DOCS: 'campuspilot_knowledge_docs',
  AUDIT_LOGS: 'campuspilot_audit_logs',
  JOBS: 'sahyadri_jobs',
  STUDY_MATERIALS: 'sahyadri_study_materials',
  CODING_PROBLEMS: 'sahyadri_coding_problems',
  CODING_SUBMISSIONS: 'sahyadri_coding_submissions',
  WORLD_NEWS: 'sahyadri_world_news',
  INTERVIEW_EXPERIENCES: 'sahyadri_interview_experiences',
  STUDENT_ACHIEVEMENTS: 'sahyadri_achievements',
  IS_INITIALIZED: 'sahyadri_one_v2',
};

class LocalRepository {
  constructor() {
    this.initSeedData();
  }

  private initSeedData(): void {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
    if (!initialized) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([INITIAL_STUDENT_USER, INITIAL_ADMIN_USER]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENT_USER));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.QUESTION_KEYS, JSON.stringify(INITIAL_QUESTION_KEYS));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
    localStorage.setItem(STORAGE_KEYS.NEWSLETTERS, JSON.stringify(INITIAL_NEWSLETTERS));
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_DOCS, JSON.stringify(INITIAL_KNOWLEDGE_DOCS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(VERIFIED_JOB_OPPORTUNITIES));
    localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(VERIFIED_STUDY_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.CODING_PROBLEMS, JSON.stringify(CODING_LAB_PROBLEMS));
    localStorage.setItem(STORAGE_KEYS.CODING_SUBMISSIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WORLD_NEWS, JSON.stringify(WORLD_TECH_NEWS));
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_EXPERIENCES, JSON.stringify(VERIFIED_INTERVIEW_EXPERIENCES));
    localStorage.setItem(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, JSON.stringify(VERIFIED_STUDENT_ACHIEVEMENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
    this.notifyChange('all');
  }

  private getItems<T>(key: string, defaultVal: T[] = []): T[] {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setItems<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
    this.notifyChange(key);
  }

  private notifyChange(key: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('campuspilot_db_change', { detail: { key } }));
    }
  }

  // Current session user
  public getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return INITIAL_STUDENT_USER;
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : INITIAL_STUDENT_USER;
  }

  public setCurrentUser(user: UserProfile | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyChange(STORAGE_KEYS.CURRENT_USER);
  }

  // Switch between demo profiles safely
  public switchRole(role: 'student' | 'admin'): UserProfile {
    const user = role === 'admin' ? INITIAL_ADMIN_USER : INITIAL_STUDENT_USER;
    this.setCurrentUser(user);
    return user;
  }

  // Profiles
  public getProfiles(): UserProfile[] {
    return this.getItems<UserProfile>(STORAGE_KEYS.PROFILES);
  }

  public updateProfile(updated: UserProfile): void {
    const currentUser = this.getCurrentUser();
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === updated.id);
    if (index === -1) {
      // New profile creation - strictly student unless created by admin
      const safeRole = currentUser?.role === 'admin' ? (updated.role || 'student') : 'student';
      profiles.push({
        ...updated,
        role: safeRole,
        created_at: updated.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      this.setItems(STORAGE_KEYS.PROFILES, profiles);
      return;
    }

    // Security check: non-admin cannot change their own role!
    if (currentUser?.role !== 'admin' && updated.role !== profiles[index].role) {
      throw new Error('Unauthorized: Students cannot alter user roles.');
    }

    profiles[index] = { ...updated, updated_at: new Date().toISOString() };
    this.setItems(STORAGE_KEYS.PROFILES, profiles);

    if (currentUser?.id === updated.id) {
      this.setCurrentUser(profiles[index]);
    }
  }

  // Exams: Enforce published check for non-admin
  public getExams(): Exam[] {
    const currentUser = this.getCurrentUser();
    const exams = this.getItems<Exam>(STORAGE_KEYS.EXAMS);
    if (currentUser?.role === 'admin') {
      return exams;
    }
    return exams.filter(e => e.is_published);
  }

  public getExamById(id: string): Exam | undefined {
    return this.getExams().find(e => e.id === id);
  }

  public saveExam(exam: Exam): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can modify examinations.');
    }
    const exams = this.getItems<Exam>(STORAGE_KEYS.EXAMS);
    const index = exams.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      exams[index] = { ...exam, updated_at: new Date().toISOString() };
    } else {
      exams.push({ ...exam, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItems(STORAGE_KEYS.EXAMS, exams);
  }

  public deleteExam(examId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can delete examinations.');
    }
    const exams = this.getItems<Exam>(STORAGE_KEYS.EXAMS).filter(e => e.id !== examId);
    this.setItems(STORAGE_KEYS.EXAMS, exams);
  }

  // Questions: Kept strictly separated from Question Keys for students
  public getQuestionsForExam(examId: string): Question[] {
    const questions = this.getItems<Question>(STORAGE_KEYS.QUESTIONS).filter(q => q.exam_id === examId);
    return questions.sort((a, b) => a.order_index - b.order_index);
  }

  public saveQuestion(question: Question, correctOptionId: string, explanation?: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can edit exam questions.');
    }

    const questions = this.getItems<Question>(STORAGE_KEYS.QUESTIONS);
    const qIndex = questions.findIndex(q => q.id === question.id);
    if (qIndex >= 0) {
      questions[qIndex] = question;
    } else {
      questions.push(question);
    }
    this.setItems(STORAGE_KEYS.QUESTIONS, questions);

    // Save private key
    const keys = this.getItems<QuestionKey>(STORAGE_KEYS.QUESTION_KEYS);
    const kIndex = keys.findIndex(k => k.question_id === question.id);
    const keyData: QuestionKey = { question_id: question.id, correct_option_id: correctOptionId, explanation };
    if (kIndex >= 0) {
      keys[kIndex] = keyData;
    } else {
      keys.push(keyData);
    }
    this.setItems(STORAGE_KEYS.QUESTION_KEYS, keys);
  }

  // Private Question Keys: STRICT ADMIN OR SERVER SCORING ONLY
  public getQuestionKey(questionId: string): QuestionKey | undefined {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Access Denied: Private answer keys cannot be inspected by students.');
    }
    const keys = this.getItems<QuestionKey>(STORAGE_KEYS.QUESTION_KEYS);
    return keys.find(k => k.question_id === questionId);
  }

  // Attempts: RLS ensures students only view their own
  public getAttempts(): ExamAttempt[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];
    const attempts = this.getItems<ExamAttempt>(STORAGE_KEYS.ATTEMPTS);
    const exams = this.getItems<Exam>(STORAGE_KEYS.EXAMS);

    const populated = attempts.map(att => ({
      ...att,
      exam: exams.find(e => e.id === att.exam_id)
    }));

    if (currentUser.role === 'admin') {
      return populated;
    }
    return populated.filter(att => att.student_id === currentUser.id);
  }

  public getAttemptById(attemptId: string): ExamAttempt | undefined {
    return this.getAttempts().find(a => a.id === attemptId);
  }

  public createAttempt(examId: string): ExamAttempt {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Authentication required.');

    const exam = this.getExamById(examId);
    if (!exam) throw new Error('Exam not found or unpublished.');

    // Check existing attempts for retake policy
    const existing = this.getAttempts().filter(a => a.exam_id === examId && a.student_id === currentUser.id);
    
    // Check if an in-progress attempt is already active
    const active = existing.find(a => a.status === 'in_progress');
    if (active) {
      return active; // Resume active attempt idempotently
    }

    if (exam.retake_policy === 'single_attempt' && existing.length >= 1) {
      throw new Error('Retake Policy Restriction: Only a single attempt is permitted for this exam.');
    }
    if (existing.length >= exam.max_attempts) {
      throw new Error(`Maximum attempts reached (${exam.max_attempts}).`);
    }

    const newAttempt: ExamAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      exam_id: examId,
      student_id: currentUser.id,
      attempt_number: existing.length + 1,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      time_spent_seconds: 0,
      score: 0,
      max_score: exam.total_marks,
      percentage: 0,
      passed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exam
    };

    const attempts = this.getItems<ExamAttempt>(STORAGE_KEYS.ATTEMPTS);
    attempts.push(newAttempt);
    this.setItems(STORAGE_KEYS.ATTEMPTS, attempts);

    this.recordAuditLog('EXAM_ATTEMPT_START', 'exam_attempt', newAttempt.id, { examId, attemptNumber: newAttempt.attempt_number });
    return newAttempt;
  }

  // Responses
  public getResponsesForAttempt(attemptId: string): ExamResponse[] {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt) return [];
    const responses = this.getItems<ExamResponse>(STORAGE_KEYS.RESPONSES);
    return responses.filter(r => r.attempt_id === attemptId);
  }

  public saveResponse(attemptId: string, questionId: string, selectedOptionId: string): void {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt) throw new Error('Attempt not found.');
    if (attempt.status !== 'in_progress') throw new Error('Cannot modify submitted or expired exam.');

    const responses = this.getItems<ExamResponse>(STORAGE_KEYS.RESPONSES);
    const existingIndex = responses.findIndex(r => r.attempt_id === attemptId && r.question_id === questionId);

    const respData: ExamResponse = {
      id: existingIndex >= 0 ? responses[existingIndex].id : `resp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
      marks_awarded: 0, // Computed securely on server submission only!
      saved_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      responses[existingIndex] = respData;
    } else {
      responses.push(respData);
    }
    this.setItems(STORAGE_KEYS.RESPONSES, responses);
  }

  // Newsletters
  public getNewsletters(): Newsletter[] {
    const currentUser = this.getCurrentUser();
    const newsletters = this.getItems<Newsletter>(STORAGE_KEYS.NEWSLETTERS);
    if (currentUser?.role === 'admin') {
      return newsletters;
    }
    return newsletters.filter(n => n.status === 'published' || n.status === 'archived');
  }

  public saveNewsletter(newsletter: Newsletter): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can create or publish newsletters.');
    }
    const newsletters = this.getItems<Newsletter>(STORAGE_KEYS.NEWSLETTERS);
    const index = newsletters.findIndex(n => n.id === newsletter.id);
    if (index >= 0) {
      newsletters[index] = { ...newsletter, updated_at: new Date().toISOString() };
    } else {
      newsletters.push({ ...newsletter, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItems(STORAGE_KEYS.NEWSLETTERS, newsletters);
    this.recordAuditLog('NEWSLETTER_SAVE', 'newsletter', newsletter.id, { title: newsletter.title, status: newsletter.status });
  }

  public deleteNewsletter(id: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can delete newsletters.');
    }
    const newsletters = this.getItems<Newsletter>(STORAGE_KEYS.NEWSLETTERS).filter(n => n.id !== id);
    this.setItems(STORAGE_KEYS.NEWSLETTERS, newsletters);
  }

  // Knowledge Documents
  public getKnowledgeDocs(): KnowledgeDocument[] {
    const currentUser = this.getCurrentUser();
    const docs = this.getItems<KnowledgeDocument>(STORAGE_KEYS.KNOWLEDGE_DOCS);
    if (currentUser?.role === 'admin') {
      return docs;
    }
    return docs.filter(d => d.status === 'approved');
  }

  public saveKnowledgeDoc(doc: KnowledgeDocument): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can manage knowledge documents.');
    }
    const docs = this.getItems<KnowledgeDocument>(STORAGE_KEYS.KNOWLEDGE_DOCS);
    const index = docs.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      docs[index] = { ...doc, updated_at: new Date().toISOString() };
    } else {
      docs.push({ ...doc, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItems(STORAGE_KEYS.KNOWLEDGE_DOCS, docs);
  }

  public deleteKnowledgeDoc(id: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can delete knowledge documents.');
    }
    const docs = this.getItems<KnowledgeDocument>(STORAGE_KEYS.KNOWLEDGE_DOCS).filter(d => d.id !== id);
    this.setItems(STORAGE_KEYS.KNOWLEDGE_DOCS, docs);
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') return [];
    return this.getItems<AuditLog>(STORAGE_KEYS.AUDIT_LOGS).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public recordAuditLog(action: string, entity_type: string, entity_id?: string, details: Record<string, unknown> = {}): void {
    const currentUser = this.getCurrentUser();
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: currentUser?.id,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    const logs = this.getItems<AuditLog>(STORAGE_KEYS.AUDIT_LOGS);
    logs.unshift(log);
    if (logs.length > 500) logs.pop();
    this.setItems(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- SAHYADRI ONE: JOBS & CAREER OPPORTUNITIES ---
  public getJobs(): JobOpportunity[] {
    return this.getItems<JobOpportunity>(STORAGE_KEYS.JOBS, VERIFIED_JOB_OPPORTUNITIES);
  }

  public saveJob(job: JobOpportunity): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can publish or update job opportunities.');
    }
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = { ...job, updated_at: new Date().toISOString() };
    } else {
      jobs.unshift({ ...job, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItems(STORAGE_KEYS.JOBS, jobs);
  }

  public deleteJob(jobId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can remove job listings.');
    }
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this.setItems(STORAGE_KEYS.JOBS, jobs);
  }

  // --- SAHYADRI ONE: STUDY MATERIALS REPOSITORY ---
  public getStudyMaterials(): StudyMaterial[] {
    return this.getItems<StudyMaterial>(STORAGE_KEYS.STUDY_MATERIALS, VERIFIED_STUDY_MATERIALS);
  }

  public saveStudyMaterial(material: StudyMaterial): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can add or edit study materials.');
    }
    const materials = this.getStudyMaterials();
    const index = materials.findIndex(m => m.id === material.id);
    if (index >= 0) {
      materials[index] = material;
    } else {
      materials.unshift(material);
    }
    this.setItems(STORAGE_KEYS.STUDY_MATERIALS, materials);
  }

  public deleteStudyMaterial(id: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can delete study materials.');
    }
    const materials = this.getStudyMaterials().filter(m => m.id !== id);
    this.setItems(STORAGE_KEYS.STUDY_MATERIALS, materials);
  }

  // --- SAHYADRI ONE: GUIDED CODING LAB ---
  public getCodingProblems(): CodingProblem[] {
    return this.getItems<CodingProblem>(STORAGE_KEYS.CODING_PROBLEMS, CODING_LAB_PROBLEMS);
  }

  public getCodingProblemBySlug(slug: string): CodingProblem | undefined {
    return this.getCodingProblems().find(p => p.slug === slug || p.id === slug);
  }

  public getCodingSubmissions(studentId?: string): CodingSubmission[] {
    const submissions = this.getItems<CodingSubmission>(STORAGE_KEYS.CODING_SUBMISSIONS, []);
    if (!studentId) return submissions;
    return submissions.filter(s => s.student_id === studentId);
  }

  public saveCodingSubmission(sub: CodingSubmission): void {
    const submissions = this.getItems<CodingSubmission>(STORAGE_KEYS.CODING_SUBMISSIONS, []);
    submissions.unshift(sub);
    this.setItems(STORAGE_KEYS.CODING_SUBMISSIONS, submissions);
  }

  // --- SAHYADRI ONE: WORLD & TECH NEWSPAPER ---
  public getWorldNews(): WorldNewsArticle[] {
    return this.getItems<WorldNewsArticle>(STORAGE_KEYS.WORLD_NEWS, WORLD_TECH_NEWS);
  }

  // --- SAHYADRI ONE: INTERVIEW EXPERIENCES ---
  public getInterviewExperiences(): InterviewExperience[] {
    const currentUser = this.getCurrentUser();
    const experiences = this.getItems<InterviewExperience>(STORAGE_KEYS.INTERVIEW_EXPERIENCES, VERIFIED_INTERVIEW_EXPERIENCES);
    if (currentUser?.role === 'admin') return experiences;
    return experiences.filter(e => e.is_approved);
  }

  public submitInterviewExperience(exp: InterviewExperience): void {
    const experiences = this.getItems<InterviewExperience>(STORAGE_KEYS.INTERVIEW_EXPERIENCES, VERIFIED_INTERVIEW_EXPERIENCES);
    experiences.unshift(exp);
    this.setItems(STORAGE_KEYS.INTERVIEW_EXPERIENCES, experiences);
  }

  // --- SAHYADRI ONE: STUDENT ACHIEVEMENTS ---
  public getAchievements(): StudentAchievement[] {
    const currentUser = this.getCurrentUser();
    const achievements = this.getItems<StudentAchievement>(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, VERIFIED_STUDENT_ACHIEVEMENTS);
    if (currentUser?.role === 'admin') return achievements;
    return achievements.filter(a => a.status === 'approved' || a.student_id === currentUser?.id);
  }

  public submitAchievement(ach: StudentAchievement): void {
    const achievements = this.getItems<StudentAchievement>(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, VERIFIED_STUDENT_ACHIEVEMENTS);
    achievements.unshift(ach);
    this.setItems(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, achievements);
  }

  public updateAchievementStatus(id: string, status: 'approved' | 'rejected', remarks?: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Forbidden: Only administrators can review student achievements.');
    }
    const achievements = this.getItems<StudentAchievement>(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, VERIFIED_STUDENT_ACHIEVEMENTS);
    const index = achievements.findIndex(a => a.id === id);
    if (index >= 0) {
      achievements[index].status = status;
      if (remarks) achievements[index].faculty_remarks = remarks;
      this.setItems(STORAGE_KEYS.STUDENT_ACHIEVEMENTS, achievements);
    }
  }

  // --- PDF-TO-MCQ / CUSTOM EXAM GENERATOR INGESTION ---
  public addGeneratedExam(exam: Exam, questions: Question[], keys: QuestionKey[]): void {
    const exams = this.getItems<Exam>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    exams.unshift(exam);
    this.setItems(STORAGE_KEYS.EXAMS, exams);

    const allQuestions = this.getItems<Question>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    this.setItems(STORAGE_KEYS.QUESTIONS, [...questions, ...allQuestions]);

    const allKeys = this.getItems<QuestionKey>(STORAGE_KEYS.QUESTION_KEYS, INITIAL_QUESTION_KEYS);
    this.setItems(STORAGE_KEYS.QUESTION_KEYS, [...keys, ...allKeys]);
  }
}

export const dbRepository = new LocalRepository();

