# SAHYADRI ONE — Comprehensive Technical Audit & Defect Root-Cause Report
**Platform:** SAHYADRI ONE — Campus Intelligence & Placement Success Platform  
**Institution:** Sahyadri College of Engineering & Management (SCEM), Mangaluru, Karnataka, India  
**Audit Timestamp:** November 3, 2026 (Local: 22:45 IST)  
**Git Branch:** `feature/google-auth-database`  
**Starting Commit:** `cbb8fee`  

---

## 1. Executive Summary & Baseline Status

Prior to modifying code, the repository was audited end-to-end. All existing test suites were executed:
- **Baseline Test Results:** `npm test` (`vitest run`) passed 5/5 test suites (36 tests total, 100% pass rate in 54.61s).
- **Baseline Build:** `npm run build` compiled with zero TypeScript errors.
- **Git State:** On branch `feature/google-auth-database`, clean tracking with `origin/feature/google-auth-database`, with minor uncommitted whitespace in 3 files.

Despite passing the basic test suite, rigorous inspection of the application code identified **five critical defects** that directly impact student experience and evaluation rubrics.

---

## 2. Root-Cause Analysis of Reported Defects

### Defect 1: MCQ Review Screens Do Not Communicate Right vs. Wrong or Explanations
- **Affected File:** `src/features/exams/ExamResultView.tsx` & `src/lib/storage.ts`
- **Root Cause Identified:**
  1. In `ExamResultView.tsx` (lines 230-260), when rendering submitted options for each question:
     - The code only checked `isSelected ? (isCorrect ? 'border-emerald-400' : 'border-rose-400') : 'border-slate-200'`.
     - When a student chose an incorrect answer (e.g. choosing "5 km West" or "13 km North-East" instead of "5 km East"), the chosen option turned red, but **the correct option was left unhighlighted and indistinguishable from other wrong options**.
     - There was **zero display of the correct answer string**, no explicit `Status: CORRECT` or `Status: INCORRECT` badge, and no indicator for unanswered questions.
     - **Explanations were completely omitted**: The `explanation` field stored in `question_keys` was never retrieved or rendered.
  2. In `src/lib/storage.ts` (lines 249-256), `getQuestionKey()` threw an uncaught error: `"Access Denied: Private answer keys cannot be inspected by students"`. This defensive check rightly protected keys *during* the exam, but lacked an authorized post-submission review method allowing a student to view the keys and explanations for their own completed attempt.

### Defect 2: Coding Solutions Fail Valid Tests & Evaluation Is Unreliable
- **Affected File:** `src/features/coding/CodingLabPage.tsx`
- **Root Cause Identified:**
  - In `handleRunCode` (line 76), the evaluation logic was hardcoded as:
    ```typescript
    const passed = userCode.includes('return') && !userCode.includes('throw') && idx !== 2;
    ```
  - **`idx !== 2` was literally hardcoded into the condition**, ensuring test case #2 ALWAYS failed, regardless of how correct the student's solution was.
  - The code runner never executed JavaScript code in an isolated runtime, never compared actual function output against expected output, and provided arbitrary hints even when logic was correct.

### Defect 3: College Chatbot Rejects Greetings and Ordinary Queries
- **Affected File:** `src/features/assistant/aiProvider.ts`
- **Root Cause Identified:**
  - In `retrieveGroundedKnowledge()`, common greeting terms ("hello", "hi", "good", "morning", "who", "what") either scored 0 or were stripped by `STOP_WORDS`.
  - When `retrieved.length === 0` (lines 113-128), `askScemAssistant()` immediately aborted with a blunt institutional rejection message: *"I could not find verified information regarding this specific inquiry in the approved Sahyadri College of Engineering & Management (SCEM) knowledge repository..."*
  - The chatbot lacked an intent classifier to recognize greetings, system identity inquiries, and general placement preparation questions prior to knowledge document retrieval.

### Defect 4: Dashboard Data Classification (Real vs. Demo Data)
- **Affected File:** `src/features/dashboard/StudentDashboard.tsx`
- **Root Cause Identified:**
  - When an authenticated student logs in for the first time with 0 attempts and 0 coding submissions, the dashboard defaulted to showing hardcoded fallback indicators and 0% readiness without clarifying whether the data was authenticated, verified, or demo data.
  - Missing explicit labels distinguishing:
    1. Verified institutional data (USN, department, semester)
    2. Authenticated student-generated records (completed exams, solved problems)
    3. Demonstration / sample sandbox data

### Defect 5 & 6: Polished Sahyadri Institutional Branding
- **Affected File:** `src/features/auth/LoginPage.tsx`
- **Audit Findings:** The existing login page, while functional, lacked institutional design depth (college crest/crest accent, campus intelligence imagery, clear USN assistance, and clean visual distinction).

---

## 3. Prioritized Implementation Plan

1. **Phase 1: Fix MCQ Answer Validation, Key Delivery, and Review Interface**
   - Implement `getAttemptReviewData(attemptId)` in `storage.ts` to securely provide the correct answer key and explanations *only* for submitted attempts owned by the user.
   - Overhaul `ExamResultView.tsx` to display:
     - Question Number, Topic, Question text
     - Student's Selected Answer vs. Correct Answer
     - Explicit Status Badge (`CORRECT`, `INCORRECT`, `UNANSWERED`)
     - Marks Earned vs. Maximum Marks (e.g. `Score: 3/3` or `Score: 0/3`)
     - Verified step-by-step Explanation
     - Unanswered & Flagged indicator
     - Summary counters: Total Score, Percentage, Correct, Incorrect, Unanswered.
   - Verify the "Direction Sense" question (Rahul walks 12 km North -> 5 km East).

2. **Phase 2: Repair the Coding Lab with Real In-Browser Execution**
   - Remove the fake `idx !== 2` condition.
   - Build a safe, sandboxed in-browser JavaScript evaluation engine that executes student code with timeout guards (e.g., 2000ms), captures output, and validates against expected outputs.
   - Implement structured test results: `Accepted`, `Wrong Answer`, `Runtime Error`, `Syntax Error`, `Time Limit Exceeded`.
   - Implement 5-Level progressive hint sequence:
     - Level 1: Observation
     - Level 2: Diagnostic & Error Analysis
     - Level 3: Algorithmic Concept
     - Level 4: Guided Correction & Edge Cases
     - Level 5: Reference Implementation & Explanation.

3. **Phase 3: Upgrade Ask Sahyadri AI with Natural Conversation & Verified Knowledge**
   - Add a conversational greeting & intent pre-processor handling "Hello", "Hi", "Good morning", "Who are you?", "What can you help me with?", "Thank you", "Goodbye".
   - Provide grounded placement guidance distinguishing official college regulations from general career preparation.
   - Expand institutional knowledge base with verified facts from `https://www.sahyadri.edu.in/` (Milestones, Placements, Departments, Incubation, Sports, Contacts).

4. **Phase 4 & 5: Student Account Security & Data Model**
   - Ensure USN and role cannot be altered by student sessions.
   - Provide clear data classification badges across the dashboard.

5. **Phase 6 & 8: Data-Driven Dashboard & Sahyadri-Branded UI**
   - Refine `LoginPage.tsx` with high-contrast institutional branding, USN helper tooltips, and seamless Google sign-in.
   - Update `StudentDashboard.tsx` to handle zero-attempt empty states gracefully with "Not enough data yet" guidance.

6. **Phase 16: Verification & Automated Regression Tests**
   - Write automated unit tests for MCQ review correctness, Direction Sense scoring, coding execution, and chatbot greetings.
   - Run production build and ensure zero errors.

