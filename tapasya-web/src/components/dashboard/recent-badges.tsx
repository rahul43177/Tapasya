import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@/lib/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']

export default async function RecentBadges() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const { data: recentAchievements } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })
    .limit(3)

  if (!recentAchievements || recentAchievements.length === 0) {
    return null // Don't show section if no achievements
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">
          Recent Achievements
        </p>
        <Link href="/achievements" className="text-xs font-sans text-brand-copper hover:text-primary-container">
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {recentAchievements.map(ua => {
          const achievement = ua.achievements as Achievement | null
          if (!achievement) return null

          return (
            <div key={ua.id} className="flex items-center gap-3">
              <p className="text-3xl">{achievement.icon}</p>
              <div className="flex-1">
                <p className="font-sans text-sm font-semibold text-on-surface">{achievement.name}</p>
                <p className="text-xs font-sans text-on-surface-variant">
                  {ua.unlocked_at && formatDistanceToNow(new Date(ua.unlocked_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
