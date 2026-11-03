# SAHYADRI ONE — Campus Intelligence, Placement Preparation & Student Success Platform
**Sahyadri College of Engineering and Management (SCEM), Mangaluru, Karnataka, India**
*Autonomous Institute Affiliated to Visvesvaraya Technological University (VTU), Belagavi | Accredited NAAC 'A' & NBA Tier-1*

---

## 1. Executive Overview

**SAHYADRI ONE** is a high-performance, lightweight, full-stack campus intelligence and placement readiness platform custom-engineered for **Sahyadri College of Engineering and Management (SCEM)**. Built with high security, student autonomy, and faculty governance in mind, it provides:

- **Student Academic & Placement Dashboard**: Real-time provisional placement readiness index (`40% Aptitude + 30% Consistency + 30% Coding`), branch & semester indicators, verified upcoming placement drives, and rolling campus notices.
- **Aptitude Examination System**: 20 comprehensive assessment suites covering **Quantitative Aptitude**, **Logical Reasoning**, **Verbal Ability**, and **Technical & Core CS**, featuring countdown timers, question navigation, flag-for-review, and **trusted server-side evaluation** (private answer keys are strictly isolated from the client).
- **Document Upload & PDF-to-MCQ Engine**: Client/server document intake (PDF/TXT/Notes up to 10MB) that automatically extracts concepts and generates customized 5, 10, 25, or 50 MCQ assessments with instant test launching.
- **Guided Coding & Debugging Lab**: Multi-language programming workbench (JavaScript, Python, C++) with an in-browser code editor, automated test runner, and a **4-tier progressive hint ladder** (Approach -> Concept -> Edge Cases -> Reference Solution).
- **Verified Jobs & Placement Drives Directory**: Curated company openings with CTC/stipends, roles, locations, eligibility cutoffs, application deadlines, and verified application links.
- **Placement Study Materials Library**: Curated roadmaps and resources (DSA sheets, Striver SDE Sheet, DBMS, Computer Networks, Operating Systems, Quantitative Aptitude, HR Interview prep).
- **Senior Interview Experiences & Hall of Fame**: First-hand interview debriefs from senior students placed at top tech firms, alongside verified student achievement spotlights.
- **Dual-Feed Newsroom**:
  - **Weekly Placement Newsletters**: Rolling **latest-10-calendar-days feed computed in Asia/Kolkata timezone (IST)**, an older archive, search, and category filters.
  - **World Tech & Career Wire**: Rolling 10-day global industry trends, tech breakthroughs, and hiring climate updates.
- **Ask Sahyadri AI Assistant**: Grounded academic chatbot powered by indexed college documents (regulations, grading rubrics, attendance policies, placement criteria), with source citations and a strict **anti-hallucination fallback policy** directing students to official department contacts.
- **Administrator Studio**: Secure control console for composing exams, editing questions/keys, publishing newsletters, managing user roles, and inspecting system telemetry audit logs.
- **Enterprise-Grade Identity & Database**: Real Supabase Cloud integration (PostgreSQL + RLS + RPC), Google OAuth with institutional domain restriction (`@sahyadri.edu.in`), anti-escalation role protection triggers, and an offline **Verified Demonstration Sandbox** for instant offline evaluation.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling & Design System**: Tailwind CSS with custom SCEM campus theme (deep campus navy `#0f2038`, vibrant campus teal `#0d9488`, slate neutrals)
- **Icons**: Lucide React
- **Client Routing**: React Router v6
- **Database & RLS**: PostgreSQL (Supabase) with complete Row Level Security policies, indexes, and full-text search triggers
- **Server-Side Scoring**: PostgreSQL `SECURITY DEFINER` function (`submit_exam_attempt`) ensuring answer keys and calculations remain server-side
- **Authentication**: Supabase Auth with Google OAuth (`signInWithOAuth`), `/auth/callback` handler, and `@sahyadri.edu.in` domain restriction
- **Testing**: Vitest, React Testing Library, JSDOM
- **Version Control**: Git & GitHub (`main` protected branch workflow)

---

## 3. Quick Start & Developer Guide

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or 10+

### Setup Commands
```bash
# 1. Clone repository
git clone https://github.com/ashwithkumar404-glitch/AI-WORKSHOP.git
cd AI-WORKSHOP

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local demo sandbox)
cp .env.example .env

# 4. Start local development server
npm run dev

# 5. Execute automated test suite
npm test

# 6. Execute production build
npm run build
```

---

## 4. Platform Modules & Features

### 4.1 Student Dashboard & Placement Readiness
- **Readiness Score Formula**: Calculated transparently as:
  $$\text{Score} = (\text{Aptitude Accuracy} \times 0.40) + (\text{Exam Consistency} \times 0.30) + (\text{Coding Practice} \times 0.30)$$
- Highlights top company drives, rolling notices, and quick diagnostic exam entry points.

### 4.2 Aptitude Assessment Engine (20 Structured Tests)
- **Quantitative Aptitude**: Number Systems, Percentages & Profit/Loss, Time, Speed & Distance, Permutations & Combinations, Data Interpretation.
- **Logical Reasoning**: Syllogisms & Venn Diagrams, Blood Relations & Direction Sense, Coding-Decoding & Series, Seating Arrangements, Critical Reasoning.
- **Verbal Ability**: Reading Comprehension, Sentence Correction & Error Spotting, Vocabulary & Synonyms/Antonyms, Para Jumbles & Coherence, Idioms & Prepositions.
- **Technical & Core CS**: Data Structures (Arrays, Trees, Graphs), Algorithms (Sorting, Dynamic Programming), Database Management Systems & SQL, Operating Systems & Concurrency, Computer Networks & Security.
- **Dynamic Exam Generation**: PDF-to-MCQ document uploader allowing students to create practice tests from classroom lecture notes.

### 4.3 Guided Coding & Debugging Lab
- In-browser code runner supporting **JavaScript**, **Python**, and **C++**.
- Pre-loaded problem bank (Two Sum, Valid Parentheses, Longest Substring Without Repeating Characters, Reverse Linked List, Binary Tree Inversion).
- 4-Tier Progressive Hint Ladder:
  1. High-level algorithmic intuition
  2. Data structure & complexity analysis
  3. Edge cases & boundary checks
  4. Full reference code solution

### 4.4 Verified Jobs & Placement Drives Directory
- Verified company openings from Tier-1 tech giants, product startups, and MNCs.
- Includes role title, CTC/stipend, work mode, eligibility criteria, application deadline, and verified outbound links.

### 4.5 Weekly Newsletters & World Tech Wire
- **Rolling 10-Day Policy**: Automatically isolates announcements published in the last 10 calendar days in `Asia/Kolkata` (IST) timezone.
- Older notices are seamlessly shifted to the Historical Archive tab.
- Complementary **World Tech & Career Wire** keeping students informed on industry trends.

### 4.6 Ask Sahyadri AI (Grounded Campus Assistant)
- Queries validated against verified college knowledge bases.
- Displays official document citations and links.
- Enforces strict anti-hallucination fallback to official campus offices (`exam@sahyadri.edu.in`, `placements@sahyadri.edu.in`).

---

## 5. Security & Authentication Architecture

Refer to [`docs/PHASE_2_AUTH_DATABASE.md`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/docs/PHASE_2_AUTH_DATABASE.md) for complete details.

1. **Google OAuth & Domain Restriction**: Only users with `@sahyadri.edu.in` accounts can sign up. Configurable via `VITE_ALLOWED_EMAIL_DOMAINS`.
2. **Anti-Escalation Role Protection**: Database triggers prevent students from updating their role to `admin`.
3. **Isolated Answer Keys**: Correct MCQ answers are stored in `question_keys`, completely unreachable by student client sessions. Scoring is performed exclusively by `submit_exam_attempt` RPC.
4. **Idempotent Exam Submissions**: Prevents double-scoring or post-deadline submissions.
5. **Audit Logging**: Security events, login actions, and test submissions are logged to `audit_logs`.

---

## 6. Offline Demonstration Mode (Zero Setup)

If Supabase credentials are not supplied in `.env`, the system runs in **Verified Demonstration Sandbox** mode. Instant login personas:
- **Student Persona**: `Aditi Rao` (`student@sahyadri.edu.in`) — 6th Semester ISE, USN `4SF22IS014`.
- **Administrator Persona**: `Dr. Rajesh Kamath` (`admin@sahyadri.edu.in`) — Placement Director, Faculty ID `SCEM-FAC-042`.

---

## 7. Automated Test Results & Verification

All automated tests run via Vitest:
```bash
npm test
```

### Verified Test Suite Summary:
```text
 ✓ src/test/newsletterDate.test.ts (7 tests)
 ✓ src/test/permissions.test.ts (5 tests)
 ✓ src/test/aiAssistant.test.ts (6 tests)
 ✓ src/test/examsScoring.test.ts (7 tests)
 ✓ src/test/googleAuthDatabase.test.ts (11 tests)

Test Files:  5 passed (5)
Tests:       36 passed (36)
Duration:    1.28s
```

### Production Build Verification:
```bash
npm run build
```
Outcome: `✓ built in 44.42s` with **zero TypeScript errors** and optimized chunk bundles.

---

## 8. Documentation Index

- [`PROJECT_STATUS.md`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/PROJECT_STATUS.md): Complete architectural breakdown and feature verification checklist.
- [`docs/PHASE_1_AUDIT.md`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/docs/PHASE_1_AUDIT.md): Technical audit report of foundational code and security baselines.
- [`docs/PHASE_2_AUTH_DATABASE.md`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/docs/PHASE_2_AUTH_DATABASE.md): Supabase Cloud setup, Google OAuth credentials guide, and SQL migrations.
- [`supabase/migrations/20261103000000_init_schema.sql`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/supabase/migrations/20261103000000_init_schema.sql): Core PostgreSQL schema and RLS policies.
- [`supabase/migrations/20261103000001_auth_profiles_roles.sql`](file:///c:/Users/ashvi/OneDrive/Desktop/AI%20Workshop/supabase/migrations/20261103000001_auth_profiles_roles.sql): Phase 2 auth triggers, role guards, and RPCs.
