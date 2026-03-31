# Fix for Squad Member Visibility Issue

## Problem
Squad page only shows 1 member's name and photo out of 3 total members. The other 2 members are invisible (no name, no photo displayed).

## Root Cause
Users who signed up are missing profile records in the `profiles` table. When the squad page queries `squad_members` with a LEFT JOIN to `profiles`, it returns `null` for members without profiles, making them invisible in the UI.

## Solution Overview
1. Create a trigger to automatically create profiles for new users
2. Backfill missing profiles for existing users
3. Update RLS policy to ensure proper visibility
4. Add better error handling in the UI

---

## Step 1: Run Diagnostics

Before applying fixes, run the diagnostic queries to understand the current state:

1. Open Supabase Dashboard → SQL Editor
2. Run the queries in `000_diagnostic_squad_members.sql`
3. Note how many users are missing profiles

**Expected output**: You should see which squad members don't have profile records.

---

## Step 2: Apply Migrations (IN ORDER)

Run these migrations in your Supabase SQL Editor **in this exact order**:

### Migration 010: Create Profile Creation Trigger
```bash
# File: 010_ensure_profile_creation.sql
```

**What it does**: Automatically creates a profile whenever a new user signs up.

**Run this migration first** - it ensures future signups won't have this issue.

---

### Migration 011: Backfill Missing Profiles
```bash
# File: 011_backfill_missing_profiles.sql
```

**What it does**: Creates profiles for all existing users who don't have one.

**Run this second** - it fixes the current problem by creating missing profiles.

---

### Migration 012: Fix RLS Policy
```bash
# File: 012_fix_profile_visibility_rls.sql
```

**What it does**: Updates the RLS policy to allow viewing:
- Own profile (always)
- Public profiles (for global leaderboard)
- Squad member profiles (for squad features)

**Run this third** - it ensures proper access permissions.

---

## Step 3: Verify the Fix

### In Supabase SQL Editor:
Run this query to verify all users now have profiles:

```sql
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT p.id) as users_with_profiles,
  CASE
    WHEN COUNT(DISTINCT u.id) = COUNT(DISTINCT p.id) THEN '✅ All users have profiles'
    ELSE '⚠️ Some users still missing profiles'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
```

### In the Application:
1. Navigate to your squad page
2. All 3 members should now be visible with names and photos
3. Check browser console - you should see a log if any members still have null profiles
4. If any members are still missing, the UI will show a warning message

---

## Step 4: Code Changes (Already Applied)

The following code improvements have been added:

### 1. Enhanced Error Logging
**File**: `src/app/(dashboard)/squads/[id]/page.tsx`

- Logs members with null profiles to the console for debugging

### 2. User-Friendly Warning
**File**: `src/components/squads/member-list.tsx`

- Shows a warning banner when members have null profiles
- Explains why some members might not be visible

### 3. Utility Function
**File**: `src/lib/utils/profile.ts`

- Added `ensureProfileExists()` function
- Can manually create profiles for edge cases

---

## Testing Checklist

After applying the migrations:

- [ ] All squad members are visible with names and photos
- [ ] Member list shows correct roles (owner vs member)
- [ ] Weekly leaderboard includes all members
- [ ] Activity feed shows activities from all members
- [ ] No console errors or warnings
- [ ] New user signup creates profile automatically

---

## Edge Case: Manual Profile Creation

If a user is still missing a profile after running the migrations, you can use this utility:

```typescript
import { ensureProfileExists } from '@/lib/utils/profile'

// In a server action or API route:
const result = await ensureProfileExists(userId, userEmail)
if (result.success) {
  console.log('Profile created or already exists')
}
```

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

### Remove Trigger:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

### Remove Profiles Created by Backfill:
**⚠️ WARNING**: Only do this if the backfill created incorrect data!
```sql
-- This is DESTRUCTIVE - only run if absolutely necessary
DELETE FROM public.profiles
WHERE created_at >= '2024-03-29'  -- Adjust date to when you ran backfill
  AND id IN (
    SELECT u.id FROM auth.users u
    WHERE u.email NOT LIKE '%@%'  -- Adjust condition as needed
  );
```

### Revert RLS Policy:
```sql
-- Revert to original policy
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
```

---

## Success Criteria

✅ All squad members visible with names and photos
✅ New users automatically get profiles on signup
✅ Existing users without profiles get them backfilled
✅ RLS policy allows squad members to view each other
✅ Helpful error messages when profiles are missing
✅ No more "Anonymous" members in squads

---

## Questions?

If you encounter issues:
1. Check the browser console for error messages
2. Run the diagnostic queries again to see current state
3. Verify all migrations ran successfully (check Supabase logs)
4. Look for any constraint violations (username UNIQUE, etc.)
