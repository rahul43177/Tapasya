/**
 * Achievement System Utilities
 * Phase 5: Gamification - Badge & Achievement System
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

export interface AchievementCheckResult {
  achievement: Achievement
  unlocked: boolean
  progress?: number
  skillId?: string
}

/**
 * Check if user unlocked any new achievements after session completion
 * Returns array of newly unlocked achievements
 */
export async function checkAchievementsAfterSession(
  supabase: SupabaseClient<Database>,
  userId: string,
  skillId: string,
  sessionData: {
    duration: number
    startTime: string
    skillTotalHours: number
    skillTotalSessions: number
    globalTotalHours: number
    globalStreak: number
    skillStreak: number
  }
): Promise<Achievement[]> {
  const newlyUnlocked: Achievement[] = []

  try {
    // 1. Fetch all active achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError)
      return []
    }

    if (!allAchievements || allAchievements.length === 0) {
      return []
    }

    // 2. Fetch user's already-unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, skill_id')
      .eq('user_id', userId)

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError)
      return []
    }

    // Create a set of unlocked achievement keys for quick lookup
    const unlockedSet = new Set(
      userAchievements?.map(ua =>
        `${ua.achievement_id}${ua.skill_id ? `-${ua.skill_id}` : ''}`
      ) ?? []
    )

    // 3. Check each achievement
    for (const achievement of allAchievements) {
      const key = `${achievement.id}${achievement.trigger_skill_specific ? `-${skillId}` : ''}`

      // Skip if already unlocked
      if (unlockedSet.has(key)) continue

      let shouldUnlock = false
      const targetSkillId: string | null = achievement.trigger_skill_specific ? skillId : null

      // Check trigger conditions
      switch (achievement.trigger_type) {
        case 'skill_hours':
          if (achievement.trigger_skill_specific) {
            shouldUnlock = sessionData.skillTotalHours >= achievement.trigger_value
          }
          break

        case 'total_hours':
          shouldUnlock = sessionData.globalTotalHours >= achievement.trigger_value
          break

        case 'session_count':
          if (achievement.trigger_skill_specific) {
            shouldUnlock = sessionData.skillTotalSessions >= achievement.trigger_value
          }
          break

        case 'streak_days':
          shouldUnlock = sessionData.globalStreak >= achievement.trigger_value
          break

        case 'time_of_day':
          const sessionHour = new Date(sessionData.startTime).getHours()
          if (achievement.slug === 'early_bird') {
            shouldUnlock = sessionHour < 6
          } else if (achievement.slug === 'night_owl') {
            shouldUnlock = sessionHour >= 22
          }
          break

        case 'consistency':
          // Consistency achievements will be checked separately via a scheduled job
          // or when viewing the achievements page
          break
      }

      if (shouldUnlock) {
        // Insert into user_achievements
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            skill_id: targetSkillId,
            progress: achievement.trigger_value,
          })

        if (!insertError) {
          newlyUnlocked.push(achievement)
        } else {
          console.error('Error inserting user achievement:', insertError)
        }
      }
    }

    return newlyUnlocked
  } catch (error) {
    console.error('Error in checkAchievementsAfterSession:', error)
    return []
  }
}

/**
 * Get user's achievement statistics
 */
export async function getUserAchievementStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{
  totalUnlocked: number
  totalAvailable: number
  byCategory: Record<string, number>
  recentUnlocks: (UserAchievement & { achievements: Achievement | null })[]
}> {
  try {
    const [achievementsRes, userAchievementsRes] = await Promise.all([
      supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true),
      supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false }),
    ])

    const totalAvailable = achievementsRes.data?.length ?? 0
    const totalUnlocked = userAchievementsRes.data?.length ?? 0

    const byCategory: Record<string, number> = {}
    userAchievementsRes.data?.forEach(ua => {
      const achievement = ua.achievements as Achievement | null
      if (achievement) {
        const category = achievement.category ?? 'unknown'
        byCategory[category] = (byCategory[category] ?? 0) + 1
      }
    })

    return {
      totalUnlocked,
      totalAvailable,
      byCategory,
      recentUnlocks: (userAchievementsRes.data?.slice(0, 10) ?? []) as (UserAchievement & { achievements: Achievement | null })[],
    }
  } catch (error) {
    console.error('Error in getUserAchievementStats:', error)
    return {
      totalUnlocked: 0,
      totalAvailable: 0,
      byCategory: {},
      recentUnlocks: [],
    }
  }
}

/**
 * Get achievement progress (for locked badges)
 * This is a placeholder that returns mock data
 * Full implementation would fetch user's current stats and compare to achievement.trigger_value
 */
export async function getAchievementProgress(
  _supabase: SupabaseClient<Database>,
  _userId: string,
  _achievementId: string,
  _skillId?: string
): Promise<{ current: number; required: number; percentage: number }> {
  // TODO: Implement full progress tracking
  // Would need to:
  // 1. Fetch the achievement definition
  // 2. Based on trigger_type, query user's current stats
  // 3. Calculate progress percentage

  return { current: 0, required: 0, percentage: 0 }
}

/**
 * Get all achievements with unlock status for a user
 */
export async function getAchievementsWithStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
  category?: string
): Promise<{
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  skillId?: string
}[]> {
  try {
    // Fetch all achievements
    let query = supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: allAchievements, error: achievementsError } = await query

    if (achievementsError || !allAchievements) {
      console.error('Error fetching achievements:', achievementsError)
      return []
    }

    // Fetch user's unlocked achievements
    const { data: userAchievements, error: userError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)

    if (userError) {
      console.error('Error fetching user achievements:', userError)
      return []
    }

    // Map achievements to include unlock status
    return allAchievements.map(achievement => {
      const unlocked = userAchievements?.some(ua =>
        ua.achievement_id === achievement.id &&
        (!achievement.trigger_skill_specific || ua.skill_id !== null)
      ) ?? false

      const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id)

      return {
        achievement,
        unlocked,
        unlockedAt: userAchievement?.unlocked_at ?? undefined,
        skillId: userAchievement?.skill_id ?? undefined,
      }
    })
  } catch (error) {
    console.error('Error in getAchievementsWithStatus:', error)
    return []
  }
}
