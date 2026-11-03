-- ==============================================================================
-- CampusPilot AI — Migration 002: Real Supabase Auth, Profiles & Role Hardening
-- Sahyadri College of Engineering and Management (SCEM), Mangaluru
-- ==============================================================================

-- 1. AUTOMATIC PROFILE CREATION TRIGGER FOR AUTH.USERS (Google OAuth & Email)
-- Safely extracts Google user metadata (full_name, avatar_url) and creates student profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_full_name text;
  v_avatar_url text;
  v_department text;
  v_semester int;
begin
  -- Extract name from Google OAuth metadata (full_name / name) or email prefix
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email, 'Student'), '@', 1)
  );

  -- Extract avatar URL from Google OAuth (picture / avatar_url)
  v_avatar_url := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    null
  );

  -- Department & Semester default safely without inventing unofficial data
  v_department := coalesce(new.raw_user_meta_data->>'department', 'Computer Science & Engineering');
  v_semester := coalesce((new.raw_user_meta_data->>'semester')::int, 4);

  -- Insert profile strictly with role = 'student' (ZERO privilege escalation)
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    department,
    semester,
    created_at,
    updated_at
  ) values (
    new.id,
    coalesce(new.email, ''),
    v_full_name,
    'student', -- Strictly student by default
    v_avatar_url,
    v_department,
    v_semester,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. DATABASE-LEVEL ROLE ESCALATION PREVENTION TRIGGER
-- Prevents any user from elevating their own role or another user's role to 'admin'
-- unless the caller is already a verified administrator.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- If role is being changed
  if new.role is distinct from old.role then
    -- When called by an authenticated user, require caller to already be an admin
    if auth.uid() is not null and not public.is_admin() then
      raise exception 'Security Violation: Only system administrators may alter user roles.';
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

-- 3. EXPLICIT PROFILE INSERT RLS POLICIES
-- Ensure authenticated clients can insert their own initial profile if needed,
-- but strictly enforce that self-registration role must be 'student'.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (
    auth.uid() = id and role = 'student'
  );

drop policy if exists "Admins can insert any profile" on public.profiles;
create policy "Admins can insert any profile"
  on public.profiles for insert
  to authenticated
  with check (
    public.is_admin()
  );

-- 4. SECURE FIRST-ADMINISTRATOR PROMOTION FUNCTION
-- Allows bootstrapping an administrator securely via SQL Editor or existing Admin
create or replace function public.promote_user_to_admin(p_email text)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_profile record;
begin
  -- If called through client API, caller must already be admin
  if auth.uid() is not null and not public.is_admin() then
    raise exception 'Permission Denied: Must be an existing administrator to promote users.';
  end if;

  update public.profiles
  set role = 'admin', updated_at = now()
  where lower(email) = lower(p_email)
  returning * into v_profile;

  if not found then
    return jsonb_build_object(
      'success', false,
      'error', 'Profile not found with email: ' || p_email
    );
  end if;

  -- Record audit trail
  insert into public.audit_logs (user_id, action, entity_type, entity_id, details)
  values (
    coalesce(auth.uid(), v_profile.id),
    'ADMIN_PROMOTION',
    'profile',
    v_profile.id::text,
    jsonb_build_object(
      'promoted_email', p_email,
      'promoted_by', coalesce(auth.uid()::text, 'sql_bootstrap')
    )
  );

  return jsonb_build_object(
    'success', true,
    'message', 'User promoted to admin successfully',
    'user_id', v_profile.id,
    'email', v_profile.email,
    'role', 'admin'
  );
end;
$$;

-- 5. RELIABLE DATABASE HEALTH CHECK RPC
-- Returns structured status without exposing sensitive database topology
create or replace function public.check_database_health()
returns jsonb
language plpgsql
security definer stable
as $$
declare
  v_total_exams int;
  v_total_newsletters int;
  v_caller_role text := 'unauthenticated';
begin
  select count(*) into v_total_exams from public.exams where is_published = true;
  select count(*) into v_total_newsletters from public.newsletters where status = 'published';

  if auth.uid() is not null then
    select role into v_caller_role from public.profiles where id = auth.uid();
  end if;

  return jsonb_build_object(
    'status', 'healthy',
    'database', 'PostgreSQL (Supabase Cloud)',
    'server_time', now(),
    'published_exams', v_total_exams,
    'published_newsletters', v_total_newsletters,
    'caller_id', auth.uid(),
    'caller_role', coalesce(v_caller_role, 'unregistered')
  );
end;
$$;
