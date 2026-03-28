import { Trophy, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getMedalForPosition } from '@/lib/utils/squads'

interface LeaderboardEntry {
  user_id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  current_global_streak: number
  weekly_hours: number
  weekly_sessions: number
}

interface SquadLeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

export default function SquadLeaderboard({ entries, currentUserId }: SquadLeaderboardProps) {
  // Sort by weekly_hours descending
  const sortedEntries = [...entries].sort((a, b) => b.weekly_hours - a.weekly_hours)

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-newsreader text-xl italic font-bold text-on-surface flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          Weekly Leaderboard
        </h2>
        <span className="font-mono text-xs text-on-surface-variant">
          Mon-Sun
        </span>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {sortedEntries.map((entry, index) => {
          const position = index + 1
          const medal = getMedalForPosition(position)
          const displayName = entry.full_name || entry.username || 'Anonymous'
          const isCurrentUser = entry.user_id === currentUserId

          return (
            <div
              key={entry.user_id}
              className={cn(
                'flex items-center gap-3 p-3 border transition-colors',
                isCurrentUser
                  ? 'bg-brand-copper/5 border-l-2 border-brand-copper'
                  : 'border-surface-container-highest',
                position <= 3 && !isCurrentUser
                  ? 'bg-secondary/5'
                  : ''
              )}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {medal ? (
                  <span className="text-xl">{medal}</span>
                ) : (
                  <span className="font-mono text-sm text-on-surface-variant">
                    #{position}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-sans text-sm font-medium text-on-surface truncate">
                    {displayName}
                  </p>
                  {isCurrentUser && (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-brand-copper">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans text-on-surface-variant">
                    🔥 {entry.current_global_streak}d
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">
                    {entry.weekly_sessions} sessions
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-on-surface">
                  {entry.weekly_hours.toFixed(1)}
                </p>
                <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">
                  Hours
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {sortedEntries.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <p className="font-sans text-sm text-on-surface-variant">
            No activity this week
          </p>
          <p className="font-sans text-xs text-on-surface-variant/60 mt-1">
            Be the first to log a session
          </p>
        </div>
      )}

      {/* Footer Info */}
      {sortedEntries.length > 0 && (
        <div className="mt-6 pt-4 border-t border-surface-container-highest">
          <p className="text-xs font-sans text-on-surface-variant text-center">
            Leaderboard resets every Monday
          </p>
        </div>
      )}
    </div>
  )
}
