import { createClient } from '@/lib/supabase/client'

/**
 * Recalculates and updates profile.total_hours based on all active skills.
 * Total hours = sum of (skill.total_hours + skill.initial_hours) across all active skills.
 *
 * Call this after any skill operation that might affect totals (archive, delete, edit initial hours).
 */
export async function recalculateProfileTotalHours(userId: string): Promise<void> {
  const supabase = createClient()

  const { data: allSkills } = await supabase
    .from('skills')
    .select('total_hours, initial_hours')
    .eq('user_id', userId)
    .eq('is_active', true)

  const recalculatedTotalHours = (allSkills || []).reduce(
    (sum, skill) => sum + (skill.total_hours + skill.initial_hours),
    0
  )

  await supabase
    .from('profiles')
    .update({ total_hours: recalculatedTotalHours })
    .eq('id', userId)
}

/**
 * Creates a profile for a user if one doesn't exist.
 * Useful for backfilling or handling edge cases where profile creation failed.
 */
export async function ensureProfileExists(userId: string, email: string) {
  const supabase = createClient()

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (existingProfile) {
    console.log('Profile already exists for user:', userId)
    return { success: true, existed: true }
  }

  // Create profile
  const username = email.split('@')[0]
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: email,
      username: username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Failed to create profile:', error)
    return { success: false, error }
  }

  console.log('✅ Created profile for user:', userId)
  return { success: true, existed: false }
}
