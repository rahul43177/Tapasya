import { Globe, TrendingUp, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { cn } from '@/lib/utils/cn'
import { getMedalForPosition } from '@/lib/utils/squads'
import { getMasteryLevel } from '@/lib/utils/mastery'

export default async function GlobalLeaderboardPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch top 100 users by total hours (only public profiles)
  const { data: topUsers, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, total_hours, total_sessions, current_global_streak, longest_streak')
    .eq('is_public_profile', true)
    .order('total_hours', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Failed to fetch leaderboard:', error)
  }

  // Check if current user is on the leaderboard
  const currentUserRank = (topUsers || []).findIndex(u => u.id === user.id)
  const isCurrentUserOnLeaderboard = currentUserRank !== -1

  // Get current user's profile
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('is_public_profile, total_hours, total_sessions, current_global_streak, longest_streak')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-secondary" />
            <h1 className="font-newsreader text-4xl italic font-bold text-on-surface">
              Global Leaderboard
            </h1>
          </div>
          <p className="font-sans text-sm text-on-surface-variant">
            Top practitioners worldwide by total practice hours. Only users who have opted in to public profiles are shown.
          </p>
        </div>

        {/* Opt-in Banner */}
        {!currentUserProfile?.is_public_profile && (
          <div className="mb-6 p-4 bg-secondary/10 border-l-2 border-secondary">
            <div className="flex items-start gap-3">
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

        {/* Current User Stats (if on leaderboard) */}
        {isCurrentUserOnLeaderboard && (
          <div className="mb-6 p-6 bg-brand-copper/5 border-l-4 border-brand-copper">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                  Your Rank
                </p>
                <p className="font-mono text-3xl font-bold text-on-surface">
                  #{currentUserRank + 1}
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                  Total Hours
                </p>
                <p className="font-mono text-3xl font-bold text-on-surface">
                  {currentUserProfile?.total_hours.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-surface-container border border-surface-container-highest">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-container-highest bg-surface-container-lowest">
            <div className="col-span-1 text-xs uppercase tracking-widest font-sans text-on-surface-variant">
              Rank
            </div>
            <div className="col-span-5 text-xs uppercase tracking-widest font-sans text-on-surface-variant">
              Practitioner
            </div>
            <div className="col-span-2 text-xs uppercase tracking-widest font-sans text-on-surface-variant text-center">
              Streak
            </div>
            <div className="col-span-2 text-xs uppercase tracking-widest font-sans text-on-surface-variant text-center">
              Sessions
            </div>
            <div className="col-span-2 text-xs uppercase tracking-widest font-sans text-on-surface-variant text-right">
              Hours
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div>
            {(topUsers || []).map((profile, index) => {
              const position = index + 1
              const medal = getMedalForPosition(position)
              const displayName = profile.full_name || profile.username || 'Anonymous'
              const isCurrentUser = profile.id === user.id
              const masteryLevel = getMasteryLevel(profile.total_hours)

              return (
                <div
                  key={profile.id}
                  className={cn(
                    'grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-container-highest transition-colors',
                    isCurrentUser
                      ? 'bg-brand-copper/5 border-l-4 border-brand-copper'
                      : position <= 3
                      ? 'bg-secondary/5'
                      : 'hover:bg-surface-container-lowest'
                  )}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {medal ? (
                      <span className="text-2xl">{medal}</span>
                    ) : (
                      <span className="font-mono text-sm text-on-surface-variant">
                        #{position}
                      </span>
                    )}
                  </div>

                  {/* User */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-sans text-sm font-medium text-on-surface truncate">
                          {displayName}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] uppercase tracking-widest font-mono text-brand-copper flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-sans text-on-surface-variant">
                        {masteryLevel}
                      </p>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-mono text-sm text-on-surface">
                        {profile.current_global_streak}d
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">
                        Current
                      </p>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="col-span-2 flex items-center justify-center">
                    <p className="font-mono text-sm text-on-surface">
                      {profile.total_sessions}
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-on-surface">
                        {profile.total_hours.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {(!topUsers || topUsers.length === 0) && (
            <div className="text-center py-20">
              <Award className="w-16 h-16 text-on-surface-variant/40 mx-auto mb-4" />
              <p className="font-sans text-sm text-on-surface-variant">
                No public profiles yet
              </p>
              <p className="font-sans text-xs text-on-surface-variant/60 mt-1">
                Be the first to enable your public profile
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {topUsers && topUsers.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs font-sans text-on-surface-variant">
              Showing top {topUsers.length} practitioners · Updated in real-time
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
