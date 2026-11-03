# CampusPilot AI — Academic Operations Platform
**Sahyadri College of Engineering and Management (SCEM), Mangaluru, Karnataka, India**
*Autonomous Institute Affiliated to Visvesvaraya Technological University (VTU), Belagavi | Accredited NAAC 'A' & NBA Tier-1*

---

## 1. Executive Overview

**CampusPilot AI** is a production-minded, full-stack academic operations platform custom-engineered for **Sahyadri College of Engineering and Management (SCEM)**. Built with high security, student autonomy, and faculty governance in mind, it provides:

- **Student Academic Dashboard**: Real-time performance metrics, upcoming Continuous Internal Evaluation (CIE) schedules, verified announcements, and quick access tools.
- **Online MCQ Examinations Module**: Timed online assessments with autosaving, question navigation, review screen, client duration warning, and **trusted server-side evaluation** (private answer keys are strictly isolated from the client).
- **Student Performance Tracking ("My Performance")**: Longitudinal score progression charts, topic-level mastery breakdowns, and historical attempt transcripts.
- **Weekly College Newsletter Feed**: Publication workflow with a rolling **latest-10-calendar-days feed computed in Asia/Kolkata timezone (IST)**, an older archive, search, and category filters.
- **Ask SCEM AI Assistant**: Grounded academic chatbot powered by indexed college documents (regulations, grading rubrics, attendance policies, hostel rules), with citations and a strict **anti-hallucination fallback policy** directing students to official department contacts if an inquiry cannot be verified.
- **Administrator Studio**: Secure control console for composing exams, editing questions/keys, publishing newsletters, ingesting/approving knowledge documents, managing user roles, and inspecting system telemetry audit logs.
- **Dual-Mode Persistence Architecture**: Ready for live **Supabase Cloud (PostgreSQL + RLS + RPC)** while featuring an offline **Verified Demonstration Sandbox** so the entire system works immediately even before connecting cloud credentials.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling & Design System**: Tailwind CSS with custom SCEM campus theme (deep campus navy `#0f2038`, vibrant campus teal `#0d9488`, slate neutrals)
- **Icons**: Lucide React
- **Client Routing**: React Router v6
- **Database & RLS**: PostgreSQL (Supabase) with complete Row Level Security policies, indexes, and full-text search triggers
- **Server-Side Scoring**: PostgreSQL `SECURITY DEFINER` function (`submit_exam_attempt`) ensuring answer keys and calculations remain server-side
- **Knowledge Retrieval**: Full-text keyword & category matching with anti-adversarial prompt injection screening
- **Testing**: Vitest, React Testing Library, JSDOM, Playwright E2E
- **Version Control**: Git

---

## 3. Database Architecture & Migrations

All database schemas, constraints, foreign keys, RLS policies, and server-side functions are version-controlled in:
```
supabase/migrations/20261103000000_init_schema.sql
```

### Core Tables & Security Matrix

| Table Name | Primary Purpose | Row Level Security (RLS) Policy |
| :--- | :--- | :--- |
| `profiles` | Institutional user profiles (USN, branch, sem, role) | All authenticated can view; users can update own name/USN; **role can only be modified by Admins**. |
| `exams` | Course assessments (code, duration, pass marks) | Students view published only (`is_published = true`); Admins manage all. |
| `questions` | MCQ items (options A-D, marks, topic) | Viewable only for published exams. |
| `question_keys` | **Private answer keys & explanations** | **STRICT PRIVACY**: Invisible to students via API; readable only by Admins and the secure server scoring function. |
| `exam_attempts` | Student test sessions, scores, passing status | Students view/start own attempts only; Admins view all. |
| `exam_responses` | Selected options and verified marks per question | Students view/save for own in-progress attempt; marks computed on submission. |
| `newsletters` | Weekly notices and articles | Published visible to all; drafts visible only to Admins. |
| `knowledge_documents`| Grounding reference text for Ask SCEM AI | Approved visible to all; pending/rejected visible only to Admins. |
| `audit_logs` | Security events, submissions, role changes | Admins view all; automated logging on all security events. |

---

## 4. Exam Security & Scoring Model

CampusPilot AI eliminates client-side cheating and score tampering:
1. **Isolated Answer Keys**: Correct options and explanations reside in `question_keys`, which is inaccessible to students.
2. **Server-Side Function (`submit_exam_attempt`)**:
   - Validates that the caller's `auth.uid()` matches `attempt.student_id`.
   - Validates that the attempt status is `in_progress`.
   - Enforces duration limit using server timestamps (with a 90-second network latency buffer).
   - Retrieves private keys on the server and scores each question.
   - Idempotent: duplicate submissions return the existing score without modifying or re-evaluating.
   - Records an immutable security audit event in `audit_logs`.

---

## 5. Weekly Newsletter Rolling 10-Day Feed

The student newsletter feed displays publications within the **latest 10 calendar days in Asia/Kolkata timezone (IST)**:
- **Rolling Calculation**: Covers `today` (Day 1) plus the previous 9 calendar days in IST (`[today - 9 days, today]`).
- **Archive Distinction**: Older publications automatically move to the **Archive**, accessible via the tab switcher.
- **Editorial Studio**: Administrators can compose drafts, preview formatting, set tags, and publish or unpublish with immediate feed synchronization.

---

## 6. Ask SCEM AI — Grounded Assistant & Anti-Hallucination Guard

The Ask SCEM assistant helps students navigate college rules without inventing policies:
- **Approved Knowledge Index**: Answers are synthesized from verified SCEM documents covering Attendance (85% VTU rule), Autonomous SGPA/CGPA Grading, Placements (Dream tier guidelines), Hostel Timings, and Technical Clubs (Team Challengers, NAIN, SCAIR).
- **Citations Display**: Every verified answer links to the source document title, category, and official URL.
- **Anti-Hallucination Fallback**: If an inquiry cannot be matched with high confidence, the bot explicitly reports that verified records are unavailable and provides official department contacts:
  - Examinations: `exam@sahyadri.edu.in`
  - Academics: `academics@sahyadri.edu.in`
  - Placements: `placements@sahyadri.edu.in`
- **Adversarial Guard**: Inquiries containing prompt injection keywords (e.g., "ignore previous instructions", "reveal answer keys") are blocked.

---

## 7. Getting Started & Installation

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.16.0`)
- npm `v9+` or `v11+`

### Installation Commands

```bash
# 1. Clone repository or open workspace directory
cd "AI Workshop"

# 2. Install dependencies
npm install

# 3. Create local environment file (optional; demo mode works out of the box)
cp .env.example .env

# 4. Start development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## 8. Demo Personas (Instant Login)

When running in local demo mode, you can log in instantly with one click:
- **Student Persona**: `Aditi Rao` (`student@sahyadri.edu.in`) — 4th Semester CSE, USN `4SF22CS014`.
- **Administrator Persona**: `Dr. Rajesh Kamath` (`admin@sahyadri.edu.in`) — Dean Academics & Examinations, Faculty ID `SCEM-FAC-042`.

Use the persona switcher in the top banner or on the login screen to toggle roles and test security barriers.

---

## 9. Connecting to Supabase Cloud

To connect a live Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **API** and copy:
   - `Project URL`
   - `anon / public` key
3. Update `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Run the migration script in Supabase **SQL Editor**:
   - Open `supabase/migrations/20261103000000_init_schema.sql` and run it.
5. **Provisioning the First Administrator**:
   In the Supabase SQL Editor, run:
   ```sql
   -- Upgrade an enrolled user to Administrator
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@sahyadri.edu.in';
   ```

---

## 10. Automated Test Results

The automated test suite runs Vitest and verifies authentication, RLS permissions, server-side scoring, Asia/Kolkata date calculations, and AI grounding.

### Run Tests:
```bash
npm test
```

### Actual Executed Test Results:
```text
 ✓ src/test/newsletterDate.test.ts (7 tests)
   • correctly calculates IST date parts from UTC timestamp
   • correctly handles day-rollover across UTC and IST
   • defines rolling 10-calendar-day window as today + previous 9 calendar days
   • validates articles published within rolling 10 calendar days
   • identifies older articles that belong in the archive (> 10 calendar days ago)
   • formats dates in Indian Standard Time format
   • computes relative calendar descriptions

 ✓ src/test/permissions.test.ts (5 tests)
   • prevents students from changing their role to admin
   • hides unpublished draft exams from ordinary students
   • hides unpublished newsletter drafts from students
   • prohibits non-admin users from creating or saving exams
   • prohibits non-admin users from publishing newsletters

 ✓ src/test/aiAssistant.test.ts (6 tests)
   • retrieves relevant approved knowledge documents for attendance inquiry
   • returns grounded answer with exact citations when verified records exist
   • triggers safe official department fallback when no verified sources exist
   • detects and neutralizes prompt injection / override attempts
   • safely handles adversarial input queries in the assistant
   • does not crash when external AI API endpoint is absent (safe fallback)

 ✓ src/test/examsScoring.test.ts (7 tests)
   • prohibits ordinary students from inspecting private answer keys
   • allows administrators to inspect answer keys in Admin Studio
   • creates an exam attempt and records responses securely
   • executes server-side scoring accurately and updates status to submitted
   • handles duplicate final submissions idempotently
   • rejects attempt submission by another student (ownership violation)
   • enforces single attempt retake policy

Test Files:  4 passed (4)
Tests:       25 passed (25)
Duration:    1.05s
```

### Run Production Build:
```bash
npm run build
```
Outcome: `✓ built in 44.42s` (Zero errors, type-safe).

---

## 11. Security Audit Checklist

- [x] **No Secret Key Exposure**: Client code references only `VITE_SUPABASE_ANON_KEY`. Privileged keys (`service_role`, LLM API keys) remain on the server.
- [x] **Private Answer Keys**: Isolated in `question_keys` table with strict RLS prohibiting student read access.
- [x] **Role Self-Elevation Guard**: PostgreSQL trigger & RLS check enforce that students cannot modify the `role` column on `profiles`.
- [x] **Server-Side Scoring**: Computed via `submit_exam_attempt` with duration checks, retake limits, and idempotent deduplication.
- [x] **Adversarial AI Defense**: Input sanitization prevents prompt injections and override commands in student questions or uploaded knowledge documents.
- [x] **Timezone Conformance**: All date calculations, rolling windows, and displayed timestamps adhere to `Asia/Kolkata` (IST: UTC+5:30).
