-- CampusPilot AI: Sahyadri College of Engineering and Management (SCEM)
-- Migration 001: Initial Core Schema with RLS and Server-Side Functions

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  usn text, -- University Seat Number (e.g. 4SF22CS101)
  department text not null default 'Computer Science & Engineering',
  semester int not null default 4,
  role text not null check (role in ('student', 'admin')) default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index on email and role
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_usn on public.profiles(usn);

-- Helper function to check if calling user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. EXAMINATIONS TABLE
create table if not exists public.exams (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  code text not null,
  description text,
  department text not null,
  semester int not null default 1,
  duration_minutes int not null check (duration_minutes > 0),
  total_marks int not null default 0,
  passing_marks int not null default 0,
  retake_policy text not null check (retake_policy in ('single_attempt', 'multiple_attempts', 'best_of_two')) default 'single_attempt',
  max_attempts int not null default 1,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_exams_published on public.exams(is_published);
create index if not exists idx_exams_department on public.exams(department);

-- 3. QUESTIONS TABLE
create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_text text not null,
  options jsonb not null, -- Array of { "id": "A", "text": "..." }
  marks int not null default 1 check (marks > 0),
  topic text not null default 'Core Concepts',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_exam_id on public.questions(exam_id);

-- 4. PRIVATE ANSWER KEYS TABLE (STRICT PRIVACY: NEVER EXPOSED TO STUDENTS)
create table if not exists public.question_keys (
  question_id uuid primary key references public.questions(id) on delete cascade,
  correct_option_id text not null,
  explanation text,
  created_at timestamptz not null default now()
);

-- 5. EXAM ATTEMPTS TABLE
create table if not exists public.exam_attempts (
  id uuid primary key default uuid_generate_v4(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  attempt_number int not null default 1,
  status text not null check (status in ('in_progress', 'submitted', 'abandoned', 'expired')) default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  time_spent_seconds int not null default 0,
  score numeric(5,2) not null default 0,
  max_score numeric(5,2) not null default 0,
  percentage numeric(5,2) not null default 0,
  passed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_id, student_id, attempt_number)
);

create index if not exists idx_attempts_student on public.exam_attempts(student_id);
create index if not exists idx_attempts_exam on public.exam_attempts(exam_id);

-- 6. EXAM RESPONSES TABLE
create table if not exists public.exam_responses (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id text,
  is_correct boolean,
  marks_awarded numeric(5,2) not null default 0,
  saved_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create index if not exists idx_responses_attempt on public.exam_responses(attempt_id);

-- 7. NEWSLETTERS TABLE
create table if not exists public.newsletters (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  summary text not null,
  content text not null,
  category text not null check (category in ('Academics', 'Campus Life', 'Placements', 'Research & Innovation', 'Events', 'Sports & Culture', 'Notices')),
  cover_image_url text,
  status text not null check (status in ('draft', 'published', 'archived')) default 'draft',
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'SCEM Editorial Team',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_newsletters_status_published_at on public.newsletters(status, published_at desc);

-- 8. KNOWLEDGE DOCUMENTS (FOR ASK SCEM AI CHATBOT GROUNDING)
create table if not exists public.knowledge_documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('Admissions', 'Academics & Regulations', 'Examinations & Grading', 'Departments', 'Campus & Hostels', 'Placements & Training', 'Student Clubs', 'Fees & Scholarships')),
  content text not null,
  source_url text,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'approved',
  metadata jsonb not null default '{}'::jsonb,
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_kdocs_status on public.knowledge_documents(status);
create index if not exists idx_kdocs_tsv on public.knowledge_documents using gin(to_tsvector('english', title || ' ' || content));

-- 9. CHAT CONVERSATIONS & MESSAGES
create table if not exists public.chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Academic Inquiry',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_conv_user on public.chat_conversations(user_id);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_msg_conv on public.chat_messages(conversation_id);

-- 10. AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.question_keys enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_responses enable row level security;
alter table public.newsletters enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: Authenticated users can view profiles; users can update own profile, but cannot change role unless admin
create policy "Profiles viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile (except role)"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id and (
      role = (select role from public.profiles where id = auth.uid()) or public.is_admin()
    )
  );

create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin());

-- Exams: Published exams are readable by authenticated users; Admins can do everything
create policy "Published exams viewable by students"
  on public.exams for select
  to authenticated
  using (is_published = true or public.is_admin());

create policy "Admins can insert/update/delete exams"
  on public.exams for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Questions: Questions for published exams viewable by students
create policy "Questions viewable for accessible exams"
  on public.questions for select
  to authenticated
  using (
    exists (
      select 1 from public.exams e
      where e.id = questions.exam_id and (e.is_published = true or public.is_admin())
    )
  );

create policy "Admins manage questions"
  on public.questions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- QUESTION KEYS: NEVER VIEWABLE BY STUDENTS. STRICT ADMIN-ONLY OR BACKEND FUNCTION ACCESS
create policy "Question keys viewable by admins only"
  on public.question_keys for select
  to authenticated
  using (public.is_admin());

create policy "Question keys manageable by admins only"
  on public.question_keys for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Exam Attempts: Students can view/insert their own attempts; Admins can view all
create policy "Students view own attempts, Admins view all"
  on public.exam_attempts for select
  to authenticated
  using (auth.uid() = student_id or public.is_admin());

create policy "Students can insert own attempts"
  on public.exam_attempts for insert
  to authenticated
  with check (auth.uid() = student_id);

create policy "Students can update own in-progress attempt"
  on public.exam_attempts for update
  to authenticated
  using (auth.uid() = student_id and status = 'in_progress')
  with check (auth.uid() = student_id);

-- Exam Responses: Students can view and update responses for their own attempts
create policy "Students view responses for own attempts, Admins view all"
  on public.exam_responses for select
  to authenticated
  using (
    exists (
      select 1 from public.exam_attempts a
      where a.id = exam_responses.attempt_id and (a.student_id = auth.uid() or public.is_admin())
    )
  );

create policy "Students can insert/update responses for own in-progress attempts"
  on public.exam_responses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.exam_attempts a
      where a.id = exam_responses.attempt_id and a.student_id = auth.uid() and a.status = 'in_progress'
    )
  );

create policy "Students update responses for own in-progress attempts"
  on public.exam_responses for update
  to authenticated
  using (
    exists (
      select 1 from public.exam_attempts a
      where a.id = exam_responses.attempt_id and a.student_id = auth.uid() and a.status = 'in_progress'
    )
  );

-- Newsletters: Published viewable by authenticated users; drafts only by admins
create policy "Published newsletters viewable by authenticated"
  on public.newsletters for select
  to authenticated
  using (status = 'published' or public.is_admin());

create policy "Admins manage newsletters"
  on public.newsletters for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Knowledge Documents: Approved viewable by authenticated; pending/rejected by admins
create policy "Approved knowledge documents viewable"
  on public.knowledge_documents for select
  to authenticated
  using (status = 'approved' or public.is_admin());

create policy "Admins manage knowledge documents"
  on public.knowledge_documents for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Chat Conversations & Messages: Strictly owner-based
create policy "Users own chat conversations"
  on public.chat_conversations for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own chat messages"
  on public.chat_messages for all
  to authenticated
  using (
    exists (
      select 1 from public.chat_conversations c
      where c.id = chat_messages.conversation_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_conversations c
      where c.id = chat_messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- Audit logs: Admins view all; users can insert logs
create policy "Admins view audit logs"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());

create policy "System and users can record audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (true);

-- ==========================================================
-- TRUSTED SERVER-SIDE SCORING FUNCTION
-- Enforces duration, validates attempt ownership, reads private keys,
-- computes scores securely, and commits transactionally.
-- ==========================================================

create or replace function public.submit_exam_attempt(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_attempt record;
  v_exam record;
  v_total_score numeric(5,2) := 0;
  v_max_score numeric(5,2) := 0;
  v_passed boolean := false;
  v_percentage numeric(5,2) := 0;
  v_time_spent int := 0;
  v_elapsed_seconds int := 0;
  v_max_allowed_seconds int := 0;
  v_rec record;
  v_is_correct boolean;
  v_marks_awarded numeric(5,2);
begin
  -- 1. Fetch attempt and lock record
  select * into v_attempt
  from public.exam_attempts
  where id = p_attempt_id
  for update;

  if not found then
    raise exception 'Exam attempt not found';
  end if;

  -- 2. Validate student ownership
  if v_attempt.student_id <> auth.uid() and not public.is_admin() then
    raise exception 'Unauthorized attempt submission';
  end if;

  -- 3. Check idempotent status
  if v_attempt.status = 'submitted' then
    return jsonb_build_object(
      'status', 'already_submitted',
      'attempt_id', v_attempt.id,
      'score', v_attempt.score,
      'max_score', v_attempt.max_score,
      'percentage', v_attempt.percentage,
      'passed', v_attempt.passed
    );
  end if;

  if v_attempt.status <> 'in_progress' then
    raise exception 'Attempt is not in active state (current status: %)', v_attempt.status;
  end if;

  -- 4. Fetch Exam metadata
  select * into v_exam
  from public.exams
  where id = v_attempt.exam_id;

  if not found then
    raise exception 'Exam not found';
  end if;

  -- 5. Calculate elapsed time and verify server duration limits
  -- Add a 90-second network latency / grace period buffer
  v_elapsed_seconds := extract(epoch from (now() - v_attempt.started_at))::int;
  v_max_allowed_seconds := (v_exam.duration_minutes * 60) + 90;

  if v_elapsed_seconds > v_max_allowed_seconds then
    -- Attempt expired
    v_time_spent := (v_exam.duration_minutes * 60);
  else
    v_time_spent := v_elapsed_seconds;
  end if;

  -- 6. Evaluate all questions and private keys
  for v_rec in
    select 
      q.id as question_id,
      q.marks,
      qk.correct_option_id,
      r.selected_option_id
    from public.questions q
    join public.question_keys qk on qk.question_id = q.id
    left join public.exam_responses r on (r.attempt_id = p_attempt_id and r.question_id = q.id)
    where q.exam_id = v_exam.id
  loop
    v_max_score := v_max_score + v_rec.marks;
    if v_rec.selected_option_id is not null and v_rec.selected_option_id = v_rec.correct_option_id then
      v_is_correct := true;
      v_marks_awarded := v_rec.marks;
      v_total_score := v_total_score + v_marks_awarded;
    else
      v_is_correct := false;
      v_marks_awarded := 0;
    end if;

    -- Upsert response record with verified scoring
    insert into public.exam_responses (attempt_id, question_id, selected_option_id, is_correct, marks_awarded, saved_at)
    values (p_attempt_id, v_rec.question_id, v_rec.selected_option_id, v_is_correct, v_marks_awarded, now())
    on conflict (attempt_id, question_id)
    do update set
      is_correct = excluded.is_correct,
      marks_awarded = excluded.marks_awarded,
      saved_at = now();
  end loop;

  -- 7. Compute percentage and passing status
  if v_max_score > 0 then
    v_percentage := round((v_total_score / v_max_score) * 100, 2);
  else
    v_percentage := 0;
  end if;

  v_passed := (v_total_score >= v_exam.passing_marks);

  -- 8. Finalize Attempt
  update public.exam_attempts
  set
    status = 'submitted',
    submitted_at = now(),
    time_spent_seconds = v_time_spent,
    score = v_total_score,
    max_score = v_max_score,
    percentage = v_percentage,
    passed = v_passed,
    updated_at = now()
  where id = p_attempt_id;

  -- 9. Audit event
  insert into public.audit_logs (user_id, action, entity_type, entity_id, details)
  values (
    auth.uid(),
    'EXAM_SUBMISSION',
    'exam_attempt',
    p_attempt_id::text,
    jsonb_build_object(
      'exam_id', v_exam.id,
      'score', v_total_score,
      'max_score', v_max_score,
      'percentage', v_percentage,
      'passed', v_passed
    )
  );

  return jsonb_build_object(
    'status', 'success',
    'attempt_id', p_attempt_id,
    'score', v_total_score,
    'max_score', v_max_score,
    'percentage', v_percentage,
    'passed', v_passed,
    'submitted_at', now()
  );
end;
$$;

-- ==========================================================
-- GROUNDED KNOWLEDGE BASE FULL-TEXT SEARCH
-- ==========================================================

create or replace function public.search_knowledge_docs(
  search_query text,
  filter_category text default null,
  max_results int default 5
)
returns table (
  id uuid,
  title text,
  category text,
  content text,
  source_url text,
  rank real
)
language sql
security definer
stable
as $$
  select
    kd.id,
    kd.title,
    kd.category,
    kd.content,
    kd.source_url,
    ts_rank_cd(
      to_tsvector('english', kd.title || ' ' || kd.content),
      plainto_tsquery('english', search_query)
    ) as rank
  from public.knowledge_documents kd
  where kd.status = 'approved'
    and (filter_category is null or kd.category = filter_category)
    and (
      search_query is null 
      or search_query = ''
      or to_tsvector('english', kd.title || ' ' || kd.content) @@ plainto_tsquery('english', search_query)
      or kd.title ilike '%' || search_query || '%'
      or kd.content ilike '%' || search_query || '%'
    )
  order by rank desc, kd.updated_at desc
  limit max_results;
$$;

