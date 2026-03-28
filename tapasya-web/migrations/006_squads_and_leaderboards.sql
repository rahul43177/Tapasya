-- =============================================
-- Phase 6: Social Features - Squads & Leaderboards
-- Migration: 006_squads_and_leaderboards.sql
-- =============================================

-- =============================================
-- 1. CREATE SQUADS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  focus_skill_name TEXT,
  max_members INTEGER DEFAULT 5 CHECK (max_members > 0 AND max_members <= 50),
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on invite_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_squads_invite_code ON public.squads(invite_code);
CREATE INDEX IF NOT EXISTS idx_squads_created_by ON public.squads(created_by);

-- Enable RLS
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. CREATE SQUAD_MEMBERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_squad_members_squad_id ON public.squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_user_id ON public.squad_members(user_id);

-- Enable RLS
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CREATE UPDATED_AT TRIGGER FOR SQUADS
-- =============================================

-- Create or replace the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for squads table
DROP TRIGGER IF EXISTS set_updated_at ON public.squads;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.squads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 4. RLS POLICIES FOR SQUADS TABLE
-- =============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view squads they are members of" ON public.squads;
DROP POLICY IF EXISTS "Users can view public squads" ON public.squads;
DROP POLICY IF EXISTS "Users can create squads" ON public.squads;
DROP POLICY IF EXISTS "Squad owners can update their squads" ON public.squads;
DROP POLICY IF EXISTS "Squad owners can delete their squads" ON public.squads;

-- SELECT: Users can view squads they are members of OR public squads
CREATE POLICY "Users can view squads they are members of"
  ON public.squads
  FOR SELECT
  USING (
    is_public = true OR
    id IN (
      SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
    )
  );

-- INSERT: Any authenticated user can create a squad
CREATE POLICY "Users can create squads"
  ON public.squads
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- UPDATE: Only squad owners can update
CREATE POLICY "Squad owners can update their squads"
  ON public.squads
  FOR UPDATE
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT squad_id FROM public.squad_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- DELETE: Only squad owners can delete
CREATE POLICY "Squad owners can delete their squads"
  ON public.squads
  FOR DELETE
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT squad_id FROM public.squad_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- =============================================
-- 5. RLS POLICIES FOR SQUAD_MEMBERS TABLE
-- =============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view members of squads they belong to" ON public.squad_members;
DROP POLICY IF EXISTS "Users can view members of public squads" ON public.squad_members;
DROP POLICY IF EXISTS "Users can join squads" ON public.squad_members;
DROP POLICY IF EXISTS "Users can leave squads" ON public.squad_members;
DROP POLICY IF EXISTS "Squad owners can remove members" ON public.squad_members;
DROP POLICY IF EXISTS "Squad owners can update member roles" ON public.squad_members;

-- SELECT: Users can view members of squads they belong to OR public squads
CREATE POLICY "Users can view members of squads they belong to"
  ON public.squad_members
  FOR SELECT
  USING (
    squad_id IN (
      SELECT id FROM public.squads WHERE is_public = true
    ) OR
    squad_id IN (
      SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
    )
  );

-- INSERT: Users can join squads (via invite code validation in app logic)
CREATE POLICY "Users can join squads"
  ON public.squad_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can leave squads, or owners can remove members
CREATE POLICY "Users can leave squads or owners can remove"
  ON public.squad_members
  FOR DELETE
  USING (
    user_id = auth.uid() OR
    squad_id IN (
      SELECT squad_id FROM public.squad_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- UPDATE: Squad owners can update member roles
CREATE POLICY "Squad owners can update member roles"
  ON public.squad_members
  FOR UPDATE
  USING (
    squad_id IN (
      SELECT squad_id FROM public.squad_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- =============================================
-- 6. HELPER FUNCTION: CHECK SQUAD CAPACITY
-- =============================================

-- Function to check if a squad has reached max capacity
CREATE OR REPLACE FUNCTION public.check_squad_capacity(squad_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  SELECT COUNT(*), s.max_members INTO current_count, max_count
  FROM public.squad_members sm
  JOIN public.squads s ON s.id = sm.squad_id
  WHERE sm.squad_id = squad_uuid
  GROUP BY s.max_members;

  IF current_count IS NULL THEN
    RETURN TRUE; -- Squad has no members yet
  END IF;

  RETURN current_count < max_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. OPTIONAL: ADD is_public_profile TO PROFILES
-- (For Global Leaderboard feature)
-- =============================================

-- Add column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'is_public_profile'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_public_profile BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- =============================================
-- 8. CREATE VIEWS FOR LEADERBOARDS
-- =============================================

-- Weekly leaderboard view (current week Monday-Sunday)
CREATE OR REPLACE VIEW public.weekly_squad_leaderboard AS
SELECT
  sm.squad_id,
  sm.user_id,
  p.full_name,
  p.username,
  p.avatar_url,
  p.current_global_streak,
  COALESCE(SUM(fs.duration) / 3600.0, 0) as weekly_hours,
  COUNT(fs.id) as weekly_sessions
FROM public.squad_members sm
JOIN public.profiles p ON p.id = sm.user_id
LEFT JOIN public.focus_sessions fs ON fs.user_id = sm.user_id
  AND fs.start_time >= date_trunc('week', NOW())
  AND fs.start_time < date_trunc('week', NOW()) + INTERVAL '1 week'
GROUP BY sm.squad_id, sm.user_id, p.full_name, p.username, p.avatar_url, p.current_global_streak;

-- Global leaderboard view (top users by total hours)
CREATE OR REPLACE VIEW public.global_leaderboard AS
SELECT
  id,
  full_name,
  username,
  avatar_url,
  total_hours,
  total_sessions,
  current_global_streak,
  longest_streak
FROM public.profiles
WHERE is_public_profile = true
ORDER BY total_hours DESC
LIMIT 100;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Verify tables were created
SELECT 'Migration complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('squads', 'squad_members')
ORDER BY table_name;
