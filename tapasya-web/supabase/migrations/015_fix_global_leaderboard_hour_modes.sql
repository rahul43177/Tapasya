-- Fix global leaderboard hour modes and backfill profile totals.
-- - App-recorded hours should exclude initial_hours
-- - Total hours should include initial_hours exactly once
-- - Profile totals should stay aligned with active skills

WITH active_skill_totals AS (
  SELECT
    s.user_id,
    COALESCE(SUM(s.total_hours + s.initial_hours), 0) AS total_hours_with_initial
  FROM public.skills s
  WHERE s.is_active = true
  GROUP BY s.user_id
)
UPDATE public.profiles p
SET total_hours = COALESCE(ast.total_hours_with_initial, 0)
FROM active_skill_totals ast
WHERE p.id = ast.user_id;

UPDATE public.profiles p
SET total_hours = 0
WHERE NOT EXISTS (
  SELECT 1
  FROM public.skills s
  WHERE s.user_id = p.id
    AND s.is_active = true
);

CREATE OR REPLACE VIEW public.global_leaderboard_with_initial AS
WITH active_skill_totals AS (
  SELECT
    s.user_id,
    COALESCE(SUM(s.total_hours), 0) AS app_recorded_hours,
    COALESCE(SUM(s.total_hours + s.initial_hours), 0) AS total_hours_with_initial
  FROM public.skills s
  WHERE s.is_active = true
  GROUP BY s.user_id
)
SELECT
  p.id,
  p.full_name,
  p.username,
  p.avatar_url,
  COALESCE(ast.app_recorded_hours, 0) AS app_recorded_hours,
  p.total_sessions,
  p.current_global_streak,
  p.longest_streak,
  p.is_public_profile,
  COALESCE(ast.total_hours_with_initial, 0) AS total_hours_with_initial
FROM public.profiles p
LEFT JOIN active_skill_totals ast ON ast.user_id = p.id
WHERE p.is_public_profile = true;

GRANT SELECT ON public.global_leaderboard_with_initial TO authenticated;
