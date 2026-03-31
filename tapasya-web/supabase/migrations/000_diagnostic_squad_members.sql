-- =============================================
-- DIAGNOSTIC QUERIES FOR SQUAD MEMBER VISIBILITY ISSUE
-- Run these in Supabase SQL Editor to diagnose the problem
-- =============================================

-- 1. Check which users in squads have profiles
SELECT
  sm.squad_id,
  s.name as squad_name,
  sm.user_id,
  sm.role,
  u.email,
  p.id as profile_id,
  p.full_name,
  p.username,
  CASE
    WHEN p.id IS NULL THEN '❌ MISSING PROFILE'
    ELSE '✅ HAS PROFILE'
  END as status
FROM squad_members sm
JOIN auth.users u ON sm.user_id = u.id
JOIN squads s ON sm.squad_id = s.id
LEFT JOIN profiles p ON sm.user_id = p.id
ORDER BY s.name, sm.role DESC, sm.joined_at;

-- 2. Check if profile creation trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%profile%' OR trigger_name LIKE '%user%';

-- 3. List all RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 4. Count users with and without profiles
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT p.id) as users_with_profiles,
  COUNT(DISTINCT u.id) - COUNT(DISTINCT p.id) as missing_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- 5. List all users missing profiles (if any)
SELECT
  u.id,
  u.email,
  u.created_at,
  'Missing profile' as issue
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
