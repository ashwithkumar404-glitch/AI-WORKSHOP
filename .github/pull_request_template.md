## Pull Request Description

### Summary of Changes
<!-- Provide a clear, concise overview of what was implemented or fixed. -->

### Assigned Module / Track
- [ ] Student Academic Dashboard (`feature/dashboard`)
- [ ] Online MCQ Examinations & Scoring (`feature/exams`)
- [ ] Weekly Newsletter & Rolling Feed (`feature/newsletters`)
- [ ] Ask SCEM AI Grounded Assistant (`feature/ai-chat`)
- [ ] Administrator Studio & RLS Security (`feature/admin-security`)
- [ ] Other / Bugfix / Chore

---

## Pre-Merge Verification Checklist

- [ ] **Tests Passed**: Ran `npm test` locally with 100% success (all test suites passed).
- [ ] **Build Verified**: Ran `npm run build` and production bundle built with zero TypeScript errors.
- [ ] **No Secrets Exposed**: Confirmed that `.env`, actual API keys, database credentials, or tokens are NOT committed.
- [ ] **Documentation Updated**: Updated `README.md` or `.env.example` if new dependencies or variables were added.
- [ ] **Database & Migrations**: Checked that new tables/columns include Row Level Security (RLS) policies in `supabase/migrations/`.
- [ ] **Branch Up-to-Date**: Rebased cleanly on the latest `origin/main`.

---

## Testing & Verification Steps
<!-- List specific steps the reviewer can follow to test this feature locally. -->
1. Run `npm run dev`
2. Navigate to `...`
3. Verify that `...`

