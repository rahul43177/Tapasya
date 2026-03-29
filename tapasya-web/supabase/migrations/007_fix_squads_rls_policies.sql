-- Fix Squad RLS Policies
-- Issue: SELECT policy too restrictive for invite code checks
-- Issue: INSERT policy might be blocking creation due to auth issues

-- ============================================================================
-- FIX 1: Update SELECT policy to allow authenticated users to check invite codes
-- ============================================================================

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "squads_select_policy" ON public.squads;
DROP POLICY IF EXISTS "Users can view public squads or their own squads" ON public.squads;

-- Create new policy that allows authenticated users to check invite codes
CREATE POLICY "squads_select_allow_authenticated"
  ON public.squads
  FOR SELECT
  USING (
    -- Allow if public
    is_public = true
    -- Allow if user created it
    OR created_by = auth.uid()
    -- Allow authenticated users to check invite codes (for uniqueness/joining)
    OR auth.role() = 'authenticated'
  );

-- ============================================================================
-- FIX 2: Ensure INSERT policy allows authenticated users to create squads
-- ============================================================================

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "squads_insert_policy" ON public.squads;
DROP POLICY IF EXISTS "Users can create squads" ON public.squads;

-- Create INSERT policy that validates created_by matches auth.uid()
CREATE POLICY "authenticated_users_can_create_squads"
  ON public.squads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure the user creating the squad is set as created_by
    created_by = auth.uid()
  );

-- ============================================================================
-- Verify policies are in place
-- ============================================================================

-- You can verify the policies with:
-- SELECT schemaname, tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'squads'
-- ORDER BY cmd, policyname;
