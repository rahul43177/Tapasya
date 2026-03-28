import type { Database } from '@/lib/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'] & {
  achievements: Achievement | null
}

interface AchievementStatsProps {
  totalUnlocked: number
  totalAvailable: number
  userAchievements: UserAchievement[]
}

export default function AchievementStats({ totalUnlocked, totalAvailable, userAchievements }: AchievementStatsProps) {
  // Calculate stats by category
  const byCategory: Record<string, number> = {}
  userAchievements.forEach(ua => {
    const achievement = ua.achievements
    if (achievement) {
      const category = achievement.category
      byCategory[category] = (byCategory[category] || 0) + 1
    }
  })

  // Calculate stats by rarity
  const byRarity: Record<string, number> = {}
  userAchievements.forEach(ua => {
    const achievement = ua.achievements
    if (achievement) {
      const rarity = achievement.rarity
      byRarity[rarity] = (byRarity[rarity] || 0) + 1
    }
  })

  const completionPercentage = totalAvailable > 0 ? Math.round((totalUnlocked / totalAvailable) * 100) : 0

  return (
    <div className="bg-surface-container border border-surface-container-highest mb-8">
      <div className="px-6 py-4 border-b border-surface-container-highest">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Progress</p>
      </div>

      {/* Main stats */}
      <div className="p-6">
        <div className="flex items-center gap-6 mb-6">
          {/* Circular progress */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#353434"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#E05C00"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                strokeLinecap="square"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-on-surface">{completionPercentage}%</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="font-newsreader text-2xl italic font-bold text-on-surface mb-1">
              {totalUnlocked} of {totalAvailable}
            </p>
            <p className="font-sans text-sm text-on-surface-variant">achievements unlocked</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries({
            milestone: 'Milestones',
            streak: 'Streaks',
            consistency: 'Consistency',
            mastery: 'Mastery',
            special: 'Special',
          }).map(([key, label]) => (
            <div key={key} className="text-center p-3 bg-surface-container-high">
              <p className="font-mono text-xl font-bold text-on-surface">{byCategory[key] || 0}</p>
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
