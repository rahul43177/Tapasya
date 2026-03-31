import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { formatDistanceToNow } from 'date-fns'
import Heatmap from '@/components/dashboard/heatmap'
import type { HeatmapDay } from '@/components/dashboard/heatmap'
import { getMasteryLevel } from '@/lib/utils/mastery'
import { getTodayMessage } from '@/lib/utils/dashboard'
import DashboardClientWrapper from '@/components/dashboard/dashboard-client-wrapper'
import SkillsSection from '@/components/dashboard/skills-section'
import WeekAtGlance from '@/components/dashboard/week-at-glance'
import StreakWarning from '@/components/dashboard/streak-warning'
import RecentBadges from '@/components/dashboard/recent-badges'

// Revalidate this page every 60 seconds (ISR)
export const revalidate = 60

function ProgressRing({ percent, size = 120, stroke = 8 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(percent, 100) / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#353434" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E05C00" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="square"
        className="transition-all duration-700"
      />
    </svg>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const heatmapStart = new Date(today)
  heatmapStart.setDate(today.getDate() - 364)

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - 6)

  const [profileRes, skillsRes, todaySessionsRes, recentSessionsRes, heatmapRes, weekSessionsRes] = await Promise.all([
    supabase.from('profiles').select('full_name, username, total_hours, total_sessions, current_global_streak, longest_streak, daily_goal_minutes, last_active_at, streak_risk_alerts').eq('id', user.id).single(),
    supabase.from('skills').select('*').eq('user_id', user.id).eq('is_active', true).order('order', { ascending: true }),
    supabase.from('focus_sessions').select('duration').eq('user_id', user.id).gte('start_time', today.toISOString()),
    supabase.from('focus_sessions').select('id, duration, start_time, focus_rating, skill_id, skills(name, icon)').eq('user_id', user.id).order('start_time', { ascending: false }).limit(5),
    supabase.from('focus_sessions').select('start_time, duration').eq('user_id', user.id).gte('start_time', heatmapStart.toISOString()),
    supabase.from('focus_sessions').select('start_time, duration').eq('user_id', user.id).gte('start_time', weekStart.toISOString()),
  ])

  const profile = profileRes.data
  const skills = skillsRes.data ?? []
  const todaySessions = todaySessionsRes.data ?? []
  const recentSessions = recentSessionsRes.data ?? []
  const weekSessions = weekSessionsRes.data ?? []

  // Aggregate heatmap data by date
  const heatmapMap = new Map<string, number>()
  for (const s of heatmapRes.data ?? []) {
    const dateStr = new Date(s.start_time).toISOString().slice(0, 10)
    heatmapMap.set(dateStr, (heatmapMap.get(dateStr) ?? 0) + (s.duration ?? 0))
  }
  const heatmapData: HeatmapDay[] = Array.from(heatmapMap.entries()).map(([date, minutes]) => ({ date, minutes }))

  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  const dailyGoalMinutes = profile?.daily_goal_minutes ?? 120
  const todayPercent = Math.round((todayMinutes / dailyGoalMinutes) * 100)
  const totalHours = Number(profile?.total_hours ?? 0)
  const streak = profile?.current_global_streak ?? 0
  const displayName = profile?.full_name ?? profile?.username ?? 'Practitioner'
  const firstName = displayName.split(' ')[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Calculate hours for motivational message
  const todayHours = todayMinutes / 60
  const dailyGoalHours = dailyGoalMinutes / 60
  const motivationalMessage = getTodayMessage(todayHours, dailyGoalHours, streak)

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">{greeting}</p>
        <h1 className="font-newsreader text-3xl sm:text-4xl italic font-bold text-on-surface mt-1">{firstName}</h1>
      </div>

      {/* Streak Warning */}
      <StreakWarning
        currentStreak={streak}
        lastActiveAt={profile?.last_active_at ?? null}
        streakRiskAlertsEnabled={profile?.streak_risk_alerts ?? true}
      />

      {/* Recent Badges */}
      <div className="mb-6">
        <RecentBadges />
      </div>

      {/* Today's Tapa — hero section */}
      <div className="bg-surface-container border border-surface-container-highest p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Today&apos;s Tapa</p>
            {streak > 0 && (
              <p className="font-sans text-sm text-secondary mt-1">🔥 {streak}-day streak</p>
            )}
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-3xl font-bold text-on-surface">{(todayMinutes / 60).toFixed(1)}</p>
            <p className="text-xs font-sans text-on-surface-variant">/ {(dailyGoalMinutes / 60).toFixed(1)} hrs goal</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <ProgressRing percent={todayPercent} size={80} stroke={6} />
          <div className="flex-1">
            <div className="h-1.5 bg-surface-container-highest mb-2">
              <div className="h-full bg-brand-copper transition-all duration-700" style={{ width: `${Math.min(todayPercent, 100)}%` }} />
            </div>
            <p className="font-newsreader italic text-sm text-on-surface">{motivationalMessage}</p>
          </div>
        </div>
      </div>

      {/* Focus Timer */}
      {skills.length > 0 ? (
        <DashboardClientWrapper skills={skills} userId={user.id} />
      ) : (
        <div className="bg-surface-container border border-surface-container-highest p-6 mb-6 text-center">
          <p className="font-newsreader italic text-on-surface-variant mb-3">No skills yet</p>
          <Link href="/onboarding" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors">
            Add your first skill →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <SkillsSection skills={skills} />

        {/* Quick stats + recent sessions */}
        <div className="space-y-6">
          {/* Week at a Glance */}
          <WeekAtGlance sessions={weekSessions} />

          {/* Quick stats */}
          <div className="bg-surface-container border border-surface-container-highest">
            <div className="px-6 py-4 border-b border-surface-container-highest">
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">All Time</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-surface-container-highest">
              {[
                { label: 'Hours', value: totalHours.toFixed(1) },
                { label: 'Sessions', value: profile?.total_sessions ?? 0 },
                { label: 'Streak', value: `${streak}d` },
                { label: 'Level', value: getMasteryLevel(totalHours) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-container px-4 py-4">
                  <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-1">{label}</p>
                  <p className="font-mono text-xl font-bold text-on-surface">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="bg-surface-container border border-surface-container-highest">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-surface-container-highest">
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Recent Sessions</p>
              <Link href="/sessions" className="text-xs font-sans text-brand-copper hover:text-primary transition-colors">View all →</Link>
            </div>
            <div className="divide-y divide-surface-container-highest">
              {recentSessions.length === 0 && (
                <div className="px-6 py-6 text-center">
                  <p className="font-sans text-sm text-on-surface-variant">No sessions yet. Start your first focus session above.</p>
                </div>
              )}
              {recentSessions.map((session) => {
                const skill = Array.isArray(session.skills) ? session.skills[0] : session.skills
                return (
                  <div key={session.id} className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{skill?.icon ?? '⏱'}</span>
                      <div>
                        <p className="font-sans text-sm text-on-surface">{skill?.name ?? 'Unknown'}</p>
                        <p className="text-[10px] font-sans text-on-surface-variant">
                          {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono text-sm text-on-surface">{session.duration}m</p>
                      {session.focus_rating && (
                        <p className="text-[10px] font-sans text-secondary">{'★'.repeat(session.focus_rating)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="mt-6">
        <Heatmap data={heatmapData} />
      </div>
    </div>
  )
}
