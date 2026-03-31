-- =============================================
-- Verify and Fix RLS Policies
-- =============================================

-- 1. Check ALL policies on profiles table (including schema)
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- 2. Check if there are any restrictive policies blocking access
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
  AND cmd = 'SELECT';

-- 3. Drop ALL existing SELECT policies and recreate properly
-- This ensures we start fresh without conflicts
DO $$
BEGIN
  -- Drop all SELECT policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "authenticated_users_can_view_shared_squad_profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;

  RAISE NOTICE 'Dropped existing SELECT policies';
END $$;

-- 4. Create a single comprehensive SELECT policy
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Allow viewing own profile
    auth.uid() = id
    OR
    -- Allow viewing public profiles
    is_public_profile = true
    OR
    -- Allow viewing profiles of users who share a squad
    EXISTS (
      SELECT 1
      FROM public.squad_members viewer_membership
      JOIN public.squad_members target_membership
        ON viewer_membership.squad_id = target_membership.squad_id
      WHERE viewer_membership.user_id = auth.uid()
        AND target_membership.user_id = profiles.id
    )
  );

COMMENT ON POLICY "profiles_select_policy" ON public.profiles
IS 'Allows users to view their own profile, public profiles, and profiles of users who share a squad';

-- 5. Verify the policy was created
SELECT
  policyname,
  cmd,
  permissive,
  'Policy created successfully' as status
FROM pg_policies
WHERE tablename = 'profiles'
  AND policyname = 'profiles_select_policy';
