# Contributing to CampusPilot AI

Thank you for contributing to the **CampusPilot AI** academic operations platform for **Sahyadri College of Engineering and Management (SCEM)**.

This repository is maintained by a collaborative engineering team. To ensure seamless parallel development across all five modules, follow this collaboration guide.

---

## 1. Branch Strategy & Assigned Workstreams

The `main` branch is our production-ready, protected branch. **Direct pushes to `main` are strictly forbidden.** All work must be conducted on dedicated feature branches and submitted via Pull Requests.

### Designated Feature Branches for the 5-Developer Team:

| Developer / Track | Assigned Module | Standard Branch Name |
| :--- | :--- | :--- |
| **Developer 1** | Student Academic Dashboard & Metrics | `feature/dashboard` |
| **Developer 2** | Online MCQ Examinations & Server Scoring | `feature/exams` |
| **Developer 3** | Weekly Newsletter & 10-Day Rolling Feed | `feature/newsletters` |
| **Developer 4** | Ask SCEM AI Grounded Knowledge Assistant | `feature/ai-chat` |
| **Developer 5** | Administrator Studio & Role Security (RLS) | `feature/admin-security` |

For bug fixes and maintenance:
- `bugfix/<issue-description>` (e.g., `bugfix/timer-sync-lag`)
- `chore/<task-description>` (e.g., `chore/update-dependencies`)

---

## 2. Team Workflow: From Clone to Merge

### Step 1: Create your branch from updated `main`
```bash
git checkout main
git pull origin main
git checkout -b feature/<your-feature-name>
```

### Step 2: Make focused, modular changes
- Keep commits cohesive and single-purpose.
- Do not modify files outside your assigned feature scope unless coordinating with the team.

### Step 3: Follow Conventional Commits
Use standard commit message prefixes:
- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation updates
- `test:` Adding or modifying unit/e2e tests
- `refactor:` Code refactoring without changing behavior
- `chore:` Maintenance, package updates, or configuration

*Example:* `feat: add topic-level mastery progress bar in exams module`

### Step 4: Rebase on latest `main` before submitting PR
Before submitting your changes, pull the latest updates from `main` to prevent merge conflicts:
```bash
git fetch origin
git rebase origin/main
```

If conflicts arise:
1. Open the conflicted files and resolve the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
2. Run tests to verify the resolution (`npm test`).
3. Stage resolved files: `git add <file>`.
4. Continue the rebase: `git rebase --continue`.
5. Never force-push (`--force`) to shared branches.

---

## 3. Quality & Security Gates

Before pushing your branch or requesting PR review, you **MUST** run and pass:

```bash
# 1. Run full unit test suite (must pass 100%)
npm test

# 2. Run TypeScript check and production bundle build
npm run build
```

### Security Rules:
1. **NEVER COMMIT SECRETS**: Do not commit `.env`, API keys, Supabase service-role keys, private AI keys, or student personal data.
2. **Environment Variables**: If your feature introduces a new environment variable, document it with dummy values in `.env.example`.
3. **Database & RLS**: All database changes must be versioned in `supabase/migrations/` with appropriate Row Level Security policies. Answer keys must remain server-side.

---

## 4. Pull Request Requirements

1. Push your branch to GitHub:
   ```bash
   git push -u origin feature/<your-branch-name>
   ```
2. Open a Pull Request targeting `main` using the repository's Pull Request template.
3. PR title should reflect the primary change: `[Dashboard] feat: integrate real-time CIE alerts`.
4. At least **one peer review approval** is required before merging.
5. All automated checks and tests must pass.
