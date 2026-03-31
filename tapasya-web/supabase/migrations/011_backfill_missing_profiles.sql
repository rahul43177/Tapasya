-- =============================================
-- Migration: 011_backfill_missing_profiles.sql
-- Purpose: Create profiles for any existing users who don't have one
-- =============================================

-- Create profiles for any users that don't have them
INSERT INTO public.profiles (id, full_name, username, created_at, updated_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
  COALESCE(u.raw_user_meta_data->>'username', SPLIT_PART(u.email, '@', 1)) as username,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Log how many profiles were created
DO $$
DECLARE
  row_count INT;
BEGIN
  GET DIAGNOSTICS row_count = ROW_COUNT;
  RAISE NOTICE 'Created % missing profile(s)', row_count;
END $$;

-- Verify all users now have profiles
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT p.id) as users_with_profiles,
  CASE
    WHEN COUNT(DISTINCT u.id) = COUNT(DISTINCT p.id) THEN '✅ All users have profiles'
    ELSE '⚠️ Some users still missing profiles'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
