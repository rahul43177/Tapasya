'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { getMedalForPosition } from '@/lib/utils/squads'
import { getMasteryLevel } from '@/lib/utils/mastery'

type LeaderboardMode = 'app_recorded' | 'total'

interface GlobalLeaderboardTableProps {
  topUsers: Array<{
    id: string | null
    full_name: string | null
    username: string | null
    avatar_url: string | null
    app_recorded_hours: number | null
    total_hours_with_initial: number | null
    total_sessions: number | null
    current_global_streak: number | null
    longest_streak: number | null
  }>
  currentUserId: string
}

export default function GlobalLeaderboardTable({
  topUsers,
  currentUserId
}: GlobalLeaderboardTableProps) {
  const [mode, setMode] = useState<LeaderboardMode>('app_recorded')

  const getHoursForMode = (
    profile: GlobalLeaderboardTableProps['topUsers'][number],
    selectedMode: LeaderboardMode
  ) => selectedMode === 'app_recorded'
    ? (profile.app_recorded_hours ?? 0)
    : (profile.total_hours_with_initial ?? 0)

  // Sort by selected mode and keep ties stable.
  const sortedUsers = [...topUsers].sort((a, b) => {
    const hourDifference = getHoursForMode(b, mode) - getHoursForMode(a, mode)
    if (hourDifference !== 0) return hourDifference

    const sessionDifference = (b.total_sessions ?? 0) - (a.total_sessions ?? 0)
    if (sessionDifference !== 0) return sessionDifference

    return (a.full_name || a.username || '').localeCompare(b.full_name || b.username || '')
  })
  const currentUserRank = sortedUsers.findIndex(user => user.id === currentUserId)
  const currentUserEntry = currentUserRank >= 0 ? sortedUsers[currentUserRank] : null
  const currentUserHours = currentUserEntry ? getHoursForMode(currentUserEntry, mode) : 0

  return (
    <div>
      {currentUserEntry && (
        <div className="mb-6 p-4 sm:p-6 bg-brand-copper/5 border-l-4 border-brand-copper">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                {mode === 'app_recorded' ? 'App Recorded' : 'Total Hours'}
              </p>
              <p className="font-mono text-3xl font-bold text-on-surface">
                {currentUserHours.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2 p-1 bg-surface-container-lowest w-fit">
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sortedUsers.map((profile, index) => {
          const position = index + 1
          const medal = getMedalForPosition(position)
          const displayName = profile.full_name || profile.username || 'Anonymous'
          const isCurrentUser = profile.id === currentUserId
          const displayHours = getHoursForMode(profile, mode)
          const masteryLevel = getMasteryLevel(displayHours)

          return (
            <div
              key={profile.id ?? `user-${index}`}
              className={cn(
                'bg-surface-container border border-surface-container-highest p-4 transition-colors',
                isCurrentUser
                  ? 'bg-brand-copper/5 border-l-4 border-brand-copper'
                  : position <= 3
                  ? 'bg-secondary/5'
                  : 'hover:bg-surface-container-lowest'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {medal ? (
                    <span className="text-2xl">{medal}</span>
                  ) : (
                    <span className="font-mono text-xs text-on-surface-variant">#{position}</span>
                  )}
                  {isCurrentUser && (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-brand-copper">
                      You
                    </span>
                  )}
                </div>
                <p className="font-mono text-base font-bold text-on-surface">{displayHours.toFixed(1)}h</p>
              </div>
              <div className="mb-3">
                <p className="font-sans text-sm font-medium text-on-surface truncate">{displayName}</p>
                <p className="text-xs font-sans text-on-surface-variant">{masteryLevel}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-high p-2">
                  <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Streak</p>
                  <p className="font-mono text-sm text-on-surface">{profile.current_global_streak ?? 0}d</p>
                </div>
                <div className="bg-surface-container-high p-2">
                  <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Sessions</p>
                  <p className="font-mono text-sm text-on-surface">{profile.total_sessions ?? 0}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="hidden md:block bg-surface-container border border-surface-container-highest">
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
            const displayHours = getHoursForMode(profile, mode)
            const masteryLevel = getMasteryLevel(displayHours)

            return (
              <div
                key={profile.id ?? `user-${index}`}
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
                      {profile.current_global_streak ?? 0}d
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">
                      Current
                    </p>
                  </div>
                </div>

                {/* Sessions */}
                <div className="col-span-2 flex items-center justify-center">
                  <p className="font-mono text-sm text-on-surface">
                    {profile.total_sessions ?? 0}
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
