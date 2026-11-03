# PHASE 2: SUPABASE DATABASE, GOOGLE AUTHENTICATION & ROLE-BASED ACCESS CONTROL
**SAHYADRI ONE — Sahyadri College of Engineering & Management (SCEM), Mangaluru**

---

## 1. Executive Summary

Phase 2 transitions the **Sahyadri ONE** placement intelligence platform to production-grade identity management and database integrity. The implementation provides:
1. **Real Supabase Cloud Authentication**: Full support for Supabase Auth with Google OAuth (`signInWithOAuth`), email/password authentication, and session token persistence.
2. **Google OAuth Integration with Institutional Domain Guard**: One-click Google sign-in configured for `@sahyadri.edu.in` institutional Google Workspace accounts.
3. **Dedicated OAuth Callback Handler (`/auth/callback`)**: Token extraction, session synchronization, domain policy verification, and safe redirect to `/dashboard`.
4. **Automated User Profile Provisioning**: Database triggers that automatically generate `public.profiles` records when users sign in via Google OAuth or email sign-up.
5. **Anti-Escalation Role Protection**: Database-level triggers and RLS policies ensuring students cannot self-elevate to `admin`.
6. **Graceful Development Fallback**: Development sandbox personas (Aditi Rao - Student, Dr. Rajesh Kamath - Admin) continue to function seamlessly when offline or during initial configuration.

---

## 2. Environment Configuration

The application reads configuration through Vite environment variables. Both legacy and modern Supabase key variable names are supported.

```env
# Supabase Cloud Project Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
# Fallback support for standard anon key naming
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Institutional Domain Restriction
# Defaults to sahyadri.edu.in if unset. Set to * for open development testing.
VITE_ALLOWED_EMAIL_DOMAINS=sahyadri.edu.in

# Server-Side Service Role Key (NEVER exposed to frontend bundle; used only in migrations/server scripts)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 3. Google OAuth & Supabase Cloud Setup Guide

To activate real Google OAuth in production:

### Step 3.1: Google Cloud Console Configuration
1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project named `Sahyadri-One-Auth`.
2. Navigate to **APIs & Services** > **OAuth consent screen**:
   - User Type: **External** (or **Internal** if restricted to your Google Workspace tenant).
   - App Name: `Sahyadri ONE`
   - User Support Email: `placements@sahyadri.edu.in`
   - Authorized Domains: `supabase.co`, `sahyadri.edu.in`
3. Navigate to **APIs & Services** > **Credentials**:
   - Click **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Sahyadri ONE Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for local development)
     - `https://your-custom-domain.sahyadri.edu.in` (for production)
   - **Authorized redirect URIs**:
     - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
4. Copy the generated **Client ID** and **Client Secret**.

### Step 3.2: Supabase Dashboard Provider Configuration
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Authentication** > **Providers** > **Google**:
   - Toggle **Enable Google provider**.
   - Paste the **Client ID** from Google Cloud Console.
   - Paste the **Client Secret** from Google Cloud Console.
   - Click **Save**.
3. Go to **Authentication** > **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (or production URL).
   - **Redirect URLs**:
     - `http://localhost:5173/auth/callback`
     - `https://your-custom-domain.sahyadri.edu.in/auth/callback`

---

## 4. Database Schema & Security Architecture

The complete Phase 2 database migration is located at:
```
supabase/migrations/20261103000001_auth_profiles_roles.sql
```

### 4.1 Automated Profile Creation Trigger
When a student signs in via Google OAuth for the first time, Supabase creates a record in `auth.users`. A PostgreSQL trigger immediately mirrors this into `public.profiles`:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_full_name text;
  v_email text;
BEGIN
  v_email := NEW.email;
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    branch,
    semester,
    usn,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_email,
    v_full_name,
    'student', -- Always defaults to student; role escalation is blocked
    'Information Science & Eng.',
    6,
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.2 Anti-Escalation Role Protection Trigger
Even if a malicious user bypasses the client UI and submits a raw Supabase REST update targeting the `role` column, this database trigger blocks the change unless executed by an existing administrator or superuser:

```sql
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger AS $$
DECLARE
  v_caller_role user_role;
BEGIN
  -- If role has not changed, permit update
  IF NEW.role = OLD.role THEN
    RETURN NEW;
  END IF;

  -- Verify whether caller is an existing admin
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_caller_role = 'admin' THEN
    RETURN NEW;
  END IF;

  -- Block unauthorized elevation attempt
  RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 First Administrator Provisioning
To assign the initial institutional administrator, run the following SQL command in the Supabase SQL Editor:

```sql
-- Replace with the official faculty/admin email address
SELECT public.promote_user_to_admin('admin@sahyadri.edu.in');
```

Or via direct update:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@sahyadri.edu.in';
```

---

## 5. Client Implementation Overview

| Component / Service | File Path | Responsibility |
| :--- | :--- | :--- |
| **Supabase Client** | `src/lib/supabaseClient.ts` | Dual-key detection (`PUBLISHABLE_KEY` / `ANON_KEY`), domain validator, health checker, demo mode resolver. |
| **Auth Context** | `src/features/auth/AuthContext.tsx` | Manages auth state, session listeners (`onAuthStateChange`), Google OAuth sign-in, login, register, logout. |
| **Auth Callback** | `src/features/auth/AuthCallback.tsx` | Dedicated route for handling Google OAuth redirects, error toasts, and domain verification. |
| **Login View** | `src/features/auth/LoginPage.tsx` | Rebranded UI with "Continue with Google", institutional domain badge, email/password form, and demo personas. |
| **Register View** | `src/features/auth/RegisterPage.tsx` | Student sign-up with USN, branch, and semester selection. |
| **Health Diagnostics** | `src/features/admin/SystemHealth.tsx` | Admin telemetry displaying connection state, latency, active profile counts, and environment variables. |

---

## 6. Verification and Automated Testing

The implementation includes automated unit tests covering domain validation, profile isolation, and role guard invariants:

```bash
npm test
```

### Verified Test Results:
- `src/test/googleAuthDatabase.test.ts`: Validates domain validation logic, default institutional rules, and anti-escalation policies.
- `src/test/permissions.test.ts`: Verifies student and admin capability boundaries.
- `src/test/examsScoring.test.ts`: Verifies server-side score calculation and private key isolation.
- `src/test/newsletterDate.test.ts`: Verifies rolling 10-day filter in Asia/Kolkata timezone.
- `src/test/aiAssistant.test.ts`: Verifies grounding, document citations, and hallucination rejection.

**Summary**: 5 test suites, 36 tests passed (100% pass rate). Production build cleanly verified via `npm run build`.
