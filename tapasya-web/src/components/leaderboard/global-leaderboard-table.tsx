'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { getMedalForPosition } from '@/lib/utils/squads'
import { getMasteryLevel } from '@/lib/utils/mastery'

type LeaderboardMode = 'app_recorded' | 'total'

interface GlobalLeaderboardTableProps {
  topUsers: Array<{
    id: string
    full_name: string | null
    username: string | null
    avatar_url: string | null
    app_recorded_hours: number
    total_hours_with_initial: number
    total_sessions: number
    current_global_streak: number
    longest_streak: number
  }>
  currentUserId: string
}

export default function GlobalLeaderboardTable({
  topUsers,
  currentUserId
}: GlobalLeaderboardTableProps) {
  const [mode, setMode] = useState<LeaderboardMode>('app_recorded')

  // Sort by selected mode
  const sortedUsers = [...topUsers].sort((a, b) => {
    const aHours = mode === 'app_recorded' ? a.app_recorded_hours : a.total_hours_with_initial
    const bHours = mode === 'app_recorded' ? b.app_recorded_hours : b.total_hours_with_initial
    return bHours - aHours
  })

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="mb-6 flex items-center gap-2 p-1 bg-surface-container-lowest w-fit">
        <button
          onClick={() => setMode('app_recorded')}
          className={cn(
            'px-4 py-2 font-sans text-xs font-semibold transition-colors',
            mode === 'app_recorded'
              ? 'bg-brand-copper text-white'
              : 'text-on-surface-variant hover:text-on-surface'
          )}
        >
          App Recorded
        </button>
        <button
          onClick={() => setMode('total')}
          className={cn(
            'px-4 py-2 font-sans text-xs font-semibold transition-colors',
            mode === 'total'
              ? 'bg-brand-copper text-white'
              : 'text-on-surface-variant hover:text-on-surface'
          )}
        >
          Total Hours
        </button>
      </div>

      {/* Help Text */}
      <p className="mb-4 text-xs font-sans text-on-surface-variant">
        {mode === 'app_recorded'
          ? 'Showing only time logged in Tapasya (fair competition)'
          : 'Showing total hours including initial time added by users'}
      </p>

      {/* Table */}
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
          {sortedUsers.map((profile, index) => {
            const position = index + 1
            const medal = getMedalForPosition(position)
            const displayName = profile.full_name || profile.username || 'Anonymous'
            const isCurrentUser = profile.id === currentUserId
            const displayHours = mode === 'app_recorded'
              ? profile.app_recorded_hours
              : profile.total_hours_with_initial
            const masteryLevel = getMasteryLevel(displayHours)

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
                      {displayHours.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
