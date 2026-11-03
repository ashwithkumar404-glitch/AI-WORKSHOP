export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  usn?: string;
  department: string;
  semester: number;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type RetakePolicy = 'single_attempt' | 'multiple_attempts' | 'best_of_two';

export type ExamCategory = 
  | 'Quantitative Aptitude'
  | 'Logical Reasoning'
  | 'Verbal Ability'
  | 'Technical & Core CS'
  | 'Company Specific Mock';

export interface Exam {
  id: string;
  title: string;
  code: string;
  description: string;
  category?: ExamCategory;
  department: string;
  semester: number;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  retake_policy: RetakePolicy;
  max_attempts: number;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  options: QuestionOption[];
  marks: number;
  topic: string;
  order_index: number;
  created_at: string;
}

export interface QuestionKey {
  question_id: string;
  correct_option_id: string;
  explanation?: string;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'abandoned' | 'expired';

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  attempt_number: number;
  status: AttemptStatus;
  started_at: string;
  submitted_at?: string;
  time_spent_seconds: number;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  created_at: string;
  updated_at: string;
  // joined fields
  exam?: Exam;
}

export interface ExamResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id?: string;
  is_correct?: boolean;
  marks_awarded: number;
  saved_at: string;
}

export type NewsletterCategory = 
  | 'Academics' 
  | 'Campus Life' 
  | 'Placements' 
  | 'Research & Innovation' 
  | 'Events' 
  | 'Sports & Culture' 
  | 'Notices';

export type NewsletterStatus = 'draft' | 'published' | 'archived';

export interface Newsletter {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: NewsletterCategory;
  cover_image_url?: string;
  status: NewsletterStatus;
  published_at?: string;
  author_id?: string;
  author_name: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type KnowledgeCategory = 
  | 'Admissions' 
  | 'Academics & Regulations' 
  | 'Examinations & Grading' 
  | 'Departments' 
  | 'Campus & Hostels' 
  | 'Placements & Training' 
  | 'Student Clubs' 
  | 'Fees & Scholarships';

export type KnowledgeStatus = 'pending' | 'approved' | 'rejected';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  source_url?: string;
  status: KnowledgeStatus;
  metadata?: Record<string, unknown>;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{
    title: string;
    url?: string;
    snippet: string;
  }>;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// ==========================================
// SAHYADRI ONE — PLACEMENT & CAMPUS MODULES
// ==========================================

export interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  type: 'Full-time' | 'Internship' | 'Drive';
  description: string;
  required_skills: string[];
  eligibility: string;
  location: string;
  work_mode: 'On-site' | 'Remote' | 'Hybrid';
  ctc_or_stipend: string;
  deadline: string;
  apply_url: string;
  status: 'active' | 'expired' | 'archived';
  is_verified: boolean;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 
    | 'Quantitative Aptitude' 
    | 'Logical Reasoning' 
    | 'Verbal Ability' 
    | 'DSA & Algorithms' 
    | 'Core CS & Placement' 
    | 'Interview Preparation' 
    | 'Web & Software Engineering';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'PDF Notes' | 'Video Tutorial' | 'Interactive Problem Set' | 'Cheat Sheet';
  description: string;
  source_name: string;
  source_url: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  input_format: string;
  output_format: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starter_code: Record<string, string>;
  test_cases: Array<{ input: string; expected_output: string; is_hidden?: boolean }>;
  hints: string[];
  editorial: string;
  solution_code: Record<string, string>;
}

export interface CodingSubmission {
  id: string;
  problem_id: string;
  student_id: string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'compilation_error' | 'runtime_error';
  passed_cases: number;
  total_cases: number;
  hints_used: number;
  runtime_ms: number;
  created_at: string;
}

export interface WorldNewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Tech & AI' | 'Hiring Trends' | 'Higher Education' | 'Science & Space' | 'Global Affairs';
  source_name: string;
  source_url: string;
  published_at: string;
  image_url?: string;
  tags: string[];
}

export interface InterviewExperience {
  id: string;
  student_id: string;
  student_name: string;
  company: string;
  role: string;
  batch_year: number;
  verdict: 'Selected' | 'Rejected' | 'In Progress';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  rounds: Array<{ round_name: string; duration_minutes: number; questions_asked: string; tips: string }>;
  overall_advice: string;
  is_approved: boolean;
  created_at: string;
}

export interface StudentAchievement {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  category: 'Hackathon' | 'Paper Publication' | 'Certification' | 'Sports & Cultural' | 'Open Source';
  organizer: string;
  event_date: string;
  description: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  faculty_remarks?: string;
  created_at: string;
}
