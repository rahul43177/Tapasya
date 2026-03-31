import { Globe, TrendingUp, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import GlobalLeaderboardTable from '@/components/leaderboard/global-leaderboard-table'

export default async function GlobalLeaderboardPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch top 100 users with both app-recorded and total hours
  const { data: topUsers, error } = await supabase
    .from('global_leaderboard_with_initial')
    .select('*')
    .order('app_recorded_hours', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Failed to fetch leaderboard:', error)
  }

  // Filter out any entries with null IDs (should not happen, but TypeScript safety)
  const validUsers = (topUsers || []).filter(u => u.id !== null)

  // Get current user's profile
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('is_public_profile')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" />
            <h1 className="font-newsreader text-3xl sm:text-4xl italic font-bold text-on-surface">
              Global Leaderboard
            </h1>
          </div>
          <p className="font-sans text-sm text-on-surface-variant">
            Compare Tapasya-recorded hours for fair competition or total practice hours including starting hours. Only users with public profiles are shown.
          </p>
        </div>

        {/* Opt-in Banner */}
        {!currentUserProfile?.is_public_profile && (
          <div className="mb-6 p-4 bg-secondary/10 border-l-2 border-secondary">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <TrendingUp className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-sm text-on-surface font-medium mb-1">
                  Want to appear on the global leaderboard?
                </p>
                <p className="font-sans text-xs text-on-surface-variant mb-3">
                  Enable your public profile in settings to compete globally and inspire others.
                </p>
                <a
                  href="/settings"
                  className="inline-block px-4 py-2 bg-brand-copper text-white font-sans text-xs font-semibold hover:bg-primary-container transition-colors"
                >
                  Go to Settings
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {validUsers.length === 0 ? (
          <div className="bg-surface-container border border-surface-container-highest text-center py-20">
            <Award className="w-16 h-16 text-on-surface-variant/40 mx-auto mb-4" />
            <p className="font-sans text-sm text-on-surface-variant">
              No public profiles yet
            </p>
            <p className="font-sans text-xs text-on-surface-variant/60 mt-1">
              Be the first to enable your public profile
            </p>
          </div>
        ) : (
          <GlobalLeaderboardTable topUsers={validUsers} currentUserId={user.id} />
        )}

        {/* Footer Info */}
        {validUsers.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs font-sans text-on-surface-variant">
              Showing top {validUsers.length} practitioners · Updated in real-time
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
