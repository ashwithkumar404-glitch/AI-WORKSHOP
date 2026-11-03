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

export interface Exam {
  id: string;
  title: string;
  code: string;
  description: string;
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

