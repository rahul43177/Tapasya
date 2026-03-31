-- Add initial_hours column to skills table
ALTER TABLE public.skills
ADD COLUMN initial_hours DECIMAL DEFAULT 0 NOT NULL;

-- Add index for performance on leaderboard queries
CREATE INDEX idx_skills_initial_hours ON public.skills(initial_hours);

-- Create view for global leaderboard with total hours
CREATE OR REPLACE VIEW public.global_leaderboard_with_initial AS
SELECT
  p.id,
  p.full_name,
  p.username,
  p.avatar_url,
  p.total_hours as app_recorded_hours,
  p.total_sessions,
  p.current_global_streak,
  p.longest_streak,
  p.is_public_profile,
  COALESCE(
    p.total_hours + (
      SELECT SUM(s.initial_hours)
      FROM public.skills s
      WHERE s.user_id = p.id AND s.is_active = true
    ),
    p.total_hours
  ) as total_hours_with_initial
FROM public.profiles p
WHERE p.is_public_profile = true;

-- Grant access to authenticated users
GRANT SELECT ON public.global_leaderboard_with_initial TO authenticated;

COMMENT ON COLUMN public.skills.initial_hours IS 'Hours user already spent on this skill before using Tapasya (locked after creation)';
COMMENT ON VIEW public.global_leaderboard_with_initial IS 'Global leaderboard view with both app-recorded and total hours (including initial)';
