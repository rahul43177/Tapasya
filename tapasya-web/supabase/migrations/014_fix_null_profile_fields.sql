-- =============================================
-- Fix NULL values in profile fields
-- =============================================

-- Update profiles where full_name is NULL
UPDATE public.profiles
SET full_name = COALESCE(
  (SELECT email FROM auth.users WHERE id = profiles.id),
  'User'
)
WHERE full_name IS NULL;

-- Update profiles where username is NULL
UPDATE public.profiles
SET username = COALESCE(
  (SELECT SPLIT_PART(email, '@', 1) FROM auth.users WHERE id = profiles.id),
  'user_' || SUBSTRING(id::text, 1, 8)
)
WHERE username IS NULL;

-- Verify the fixes
SELECT
  p.id,
  u.email,
  p.full_name,
  p.username,
  CASE
    WHEN p.full_name IS NULL OR p.username IS NULL THEN '❌ Still has NULLs'
    ELSE '✅ Fixed'
  END as status
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;
