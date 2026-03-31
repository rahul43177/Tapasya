-- =============================================
-- Migration: 012_fix_profile_visibility_rls.sql
-- Purpose: Update RLS policy to allow viewing own profile, public profiles, AND squad member profiles
-- =============================================

-- Drop and recreate with better OR logic
DROP POLICY IF EXISTS "authenticated_users_can_view_shared_squad_profiles" ON public.profiles;

CREATE POLICY "authenticated_users_can_view_shared_squad_profiles"
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
    -- Allow viewing profiles of squad members (share at least one squad)
    EXISTS (
      SELECT 1
      FROM public.squad_members viewer_membership
      JOIN public.squad_members target_membership
        ON viewer_membership.squad_id = target_membership.squad_id
      WHERE viewer_membership.user_id = auth.uid()
        AND target_membership.user_id = profiles.id
    )
  );

COMMENT ON POLICY "authenticated_users_can_view_shared_squad_profiles" ON public.profiles
IS 'Allows users to view their own profile, public profiles, and profiles of users who share a squad';

SELECT 'Profile visibility RLS policy updated successfully' as status;
