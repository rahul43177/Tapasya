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
