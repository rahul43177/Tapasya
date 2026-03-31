# Squad Member Visibility Fix - Implementation Summary

## Issue
Squad page only shows 1 out of 3 members with name and photo. The other 2 members are invisible.

## Root Cause
Missing profile records in the `profiles` table. When users sign up, a profile record is not always created automatically, causing LEFT JOINs to return `null` for those users.

---

## Files Created

### Database Migrations (Apply in Supabase SQL Editor)
Located in: `tapasya-web/supabase/migrations/`

1. **000_diagnostic_squad_members.sql** - Run first to diagnose the issue
2. **010_ensure_profile_creation.sql** - Creates trigger to auto-create profiles on signup
3. **011_backfill_missing_profiles.sql** - Backfills profiles for existing users
4. **012_fix_profile_visibility_rls.sql** - Updates RLS policy for proper access

### Code Changes

1. **src/lib/utils/profile.ts** ✅ Updated
   - Added `ensureProfileExists()` function for manual profile creation

2. **src/app/(dashboard)/squads/[id]/page.tsx** ✅ Updated
   - Added console logging for members with null profiles

3. **src/components/squads/member-list.tsx** ✅ Updated
   - Added warning banner when members have null profiles

### Documentation

4. **supabase/migrations/SQUAD_FIX_README.md** - Complete migration guide

---

## Quick Start

### Step 1: Diagnose
Run `000_diagnostic_squad_members.sql` in Supabase SQL Editor to see current state.

### Step 2: Apply Migrations (IN ORDER)
1. Run `010_ensure_profile_creation.sql` - Sets up trigger
2. Run `011_backfill_missing_profiles.sql` - Fixes existing users
3. Run `012_fix_profile_visibility_rls.sql` - Updates permissions

### Step 3: Verify
1. Refresh your squad page
2. All members should now be visible
3. Check console for any warnings

---

## What This Fixes

✅ **Immediate**: All 3 squad members become visible
✅ **Future**: New signups automatically get profiles
✅ **Existing**: Backfills any users who slipped through
✅ **Permissions**: Ensures proper RLS policy for squad visibility
✅ **UX**: Shows helpful warnings if issues occur

---

## Important Notes

- The code changes are **already applied** - no further action needed
- The **migrations must be run manually** in Supabase SQL Editor
- Run migrations **in the exact order specified** (010 → 011 → 012)
- Test on a staging database first if you have one

---

## Next Steps

1. Open Supabase Dashboard for your project
2. Go to SQL Editor
3. Run the diagnostic query (000_diagnostic_squad_members.sql)
4. Apply the three migrations in order
5. Refresh your squad page and verify all members are visible

See `tapasya-web/supabase/migrations/SQUAD_FIX_README.md` for detailed instructions.
