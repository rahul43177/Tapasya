import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import BadgeCard from '@/components/achievements/badge-card'
import Link from 'next/link'

export default async function AchievementsSection() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch achievements and user unlocks
  const [achievementsRes, userAchievementsRes] = await Promise.all([
    supabase.from('achievements').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', user.id),
  ])

  const allAchievements = achievementsRes.data ?? []
  const userAchievements = userAchievementsRes.data ?? []

  const unlockedMap = new Map(
    userAchievements.map(ua => [ua.achievement_id, ua])
  )

  // Only show first 12 achievements (2 rows of 6) on profile page
  const displayAchievements = allAchievements.slice(0, 12)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-newsreader text-2xl italic font-bold text-on-surface">Achievements</h2>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            {userAchievements.length} of {allAchievements.length} unlocked
          </p>
        </div>
        <Link
          href="/achievements"
          className="text-sm font-sans text-brand-copper hover:text-primary-container transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Achievement grid (first 12) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayAchievements.map(achievement => {
          const userAchievement = unlockedMap.get(achievement.id)
          return (
            <BadgeCard
              key={achievement.id}
              achievement={achievement}
              unlocked={!!userAchievement}
              unlockedAt={userAchievement?.unlocked_at}
            />
          )
        })}
      </div>
    </div>
  )
}
