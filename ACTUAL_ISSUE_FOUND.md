# ACTUAL ISSUE FOUND: RLS Policy Missing!

## Summary of Diagnostic Results

After running the diagnostic queries, we discovered the **REAL problem**:

### ✅ What's Working
- All 3 squad members have profile records
- Profile creation trigger is installed
- No missing profiles in the database

### ❌ What's Broken

1. **RLS Policy is Missing** (CRITICAL)
   - Only 2 policies exist on profiles table:
     - "Users can view own profile"
     - "Users can update own profile"
   - The squad visibility policy is **NOT applied**
   - This means users can ONLY see their own profile, not squad members' profiles
   - **This is why the other 2 members are invisible!**

2. **NULL values in profile fields** (Contributing factor)
   - `rmishra.don@gmail.com` → `username: null`
   - `tapasyatest@gmail.com` → `full_name: null`, `username: null`
   - Even if RLS allowed access, these would show as "Anonymous"

---

## Why This Happened

The migration `012_fix_profile_visibility_rls.sql` appeared to run successfully, but:
- There might have been a conflicting policy with the same name
- The `DROP POLICY IF EXISTS` might have succeeded, but `CREATE POLICY` failed silently
- Or there's a restrictive policy blocking the permissive one

---

## The Fix

Run these 2 new migrations in order:

### Migration 013: Fix RLS Policy (CRITICAL)
**File**: `013_verify_and_fix_rls.sql`

This will:
1. Drop ALL existing SELECT policies on profiles
2. Create a single comprehensive policy that allows:
   - Viewing own profile
   - Viewing public profiles
   - Viewing squad members' profiles
3. Verify the policy was created successfully

**Run this first!**

---

### Migration 014: Fix NULL Profile Fields
**File**: `014_fix_null_profile_fields.sql`

This will:
1. Set `full_name` to user's email if NULL
2. Set `username` to email prefix if NULL
3. Show verification results

**Run this second.**

---

## Steps to Apply the Fix

### 1. Run Migration 013 (RLS Policy Fix)
Copy and paste `013_verify_and_fix_rls.sql` into Supabase SQL Editor and run it.

**Expected output**: Should show "Policy created successfully"

### 2. Run Migration 014 (Fix NULL values)
Copy and paste `014_fix_null_profile_fields.sql` into Supabase SQL Editor and run it.

**Expected output**: Should show all profiles with "✅ Fixed" status

### 3. Verify the Fix
Run this query to confirm:

```sql
-- Check policies exist
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
```

You should now see **3 policies**:
- `profiles_select_policy` (new - this allows squad visibility)
- `Users can update own profile`

### 4. Test in the App
1. Refresh your squad page
2. All 3 members should now be visible with names and photos
3. No more "Anonymous" members

---

## Why This Will Work

**Before**: Users could only see their own profile due to restrictive RLS
**After**: Users can see profiles of anyone in their squad

The policy uses OR logic, so if ANY condition is true, access is granted:
1. ✅ Own profile (you = you)
2. ✅ Public profiles (for leaderboard)
3. ✅ **Squad member profiles (share a squad) ← This was missing!**

---

## Verification Queries

After running both migrations, run these to verify:

```sql
-- 1. Check all policies
SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'profiles';

-- 2. Check squad members visibility
SELECT
  sm.user_id,
  sm.role,
  u.email,
  p.full_name,
  p.username,
  CASE
    WHEN p.full_name IS NULL OR p.username IS NULL THEN '❌ Has NULLs'
    ELSE '✅ Complete'
  END as profile_status
FROM squad_members sm
JOIN auth.users u ON sm.user_id = u.id
JOIN profiles p ON sm.user_id = p.id
WHERE sm.squad_id = 'b1b41662-052a-47c3-a4ba-dc909e0dbe74'
ORDER BY sm.role DESC;
```

---

## Next Steps

1. ✅ Run migration 013 (fix RLS policy)
2. ✅ Run migration 014 (fix NULL values)
3. ✅ Verify with queries above
4. ✅ Refresh squad page in browser
5. ✅ Confirm all 3 members are visible

The fix should take less than 1 minute to apply!
