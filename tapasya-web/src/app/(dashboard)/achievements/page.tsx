import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import AchievementStats from '@/components/achievements/achievement-stats'
import AchievementFilter from '@/components/achievements/achievement-filter'
import BadgeCard from '@/components/achievements/badge-card'
import type { Database } from '@/lib/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'] & {
  achievements: Achievement | null
}

interface AchievementsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function AchievementsPage({ searchParams }: AchievementsPageProps) {
  const params = await searchParams
  const selectedCategory = params.category || 'all'

  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch all data
  const [achievementsRes, userAchievementsRes] = await Promise.all([
    supabase.from('achievements').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', user.id),
  ])

  const allAchievements = achievementsRes.data ?? []
  const userAchievements = (userAchievementsRes.data ?? []) as UserAchievement[]

  const unlockedMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua]))

  // Filter by category
  const filteredAchievements = selectedCategory === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.category === selectedCategory)

  // Group achievements by category for "all" view
  const categories = ['milestone', 'streak', 'consistency', 'mastery', 'special']

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Your</p>
        <h1 className="font-newsreader text-3xl sm:text-4xl italic font-bold text-on-surface mt-1">Achievements</h1>
      </div>

      {/* Stats Summary */}
      <AchievementStats
        totalUnlocked={userAchievements.length}
        totalAvailable={allAchievements.length}
        userAchievements={userAchievements}
      />

      {/* Category Filter */}
      <AchievementFilter selectedCategory={selectedCategory} />

      {/* Badge Grid */}
      {selectedCategory === 'all' ? (
        // Show achievements grouped by category
        <div className="space-y-8">
          {categories.map(category => {
            const categoryAchievements = allAchievements.filter(a => a.category === category)
            if (categoryAchievements.length === 0) return null

            return (
              <div key={category}>
                <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-4">
                  {category}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categoryAchievements.map(achievement => {
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
          })}
        </div>
      ) : (
        // Show filtered achievements
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAchievements.map(achievement => {
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
      )}

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <p className="font-newsreader text-xl italic text-on-surface-variant">
            No achievements in this category yet
          </p>
        </div>
      )}
    </div>
  )
}
