-- Allow authenticated users to view profile data for people who share a squad.
-- This fixes squad member lists and squad leaderboards where membership rows exist
-- but joined profile data is hidden by profile RLS.

DROP POLICY IF EXISTS "authenticated_users_can_view_shared_squad_profiles" ON public.profiles;

CREATE POLICY "authenticated_users_can_view_shared_squad_profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.squad_members viewer_membership
      JOIN public.squad_members target_membership
        ON viewer_membership.squad_id = target_membership.squad_id
      WHERE viewer_membership.user_id = auth.uid()
        AND target_membership.user_id = profiles.id
    )
  );
