import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { format, subDays } from 'date-fns'
import SkillProgressChart from '@/components/skills/skill-progress-chart'
import SkillHeatmap from '@/components/skills/skill-heatmap'
import SkillSessionHistory from '@/components/skills/skill-session-history'

interface Props {
  params: Promise<{ id: string }>
}

function ProgressRing({ percent, size = 160, stroke = 12 }: { percent: number; size?: number; stroke?: number }) {
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

export default async function SkillAnalyticsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const [skillRes, sessionsRes, allSessionsRes] = await Promise.all([
    supabase.from('skills').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('focus_sessions').select('*').eq('skill_id', id).order('start_time', { ascending: false }).limit(20),
    supabase.from('focus_sessions').select('start_time, duration').eq('skill_id', id).order('start_time', { ascending: true }),
  ])

  const skill = skillRes.data
  if (!skill) redirect('/skills')

  const sessions = sessionsRes.data ?? []
  const allSessions = allSessionsRes.data ?? []

  // Calculate stats
  const totalSessions = skill.total_sessions ?? 0
  const avgSessionLength = totalSessions > 0 ? (skill.total_minutes ?? 0) / totalSessions : 0
  const lastSession = sessions[0]
  const lastPracticeDate = lastSession ? format(new Date(lastSession.start_time), 'MMM d, yyyy') : 'Never'

  // This week stats
  const weekStart = subDays(new Date(), 6)
  const weekSessions = allSessions.filter(s => new Date(s.start_time) >= weekStart)
  const weekMinutes = weekSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  const weekHours = weekMinutes / 60

  // This month stats
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthSessions = allSessions.filter(s => new Date(s.start_time) >= monthStart)
  const monthMinutes = monthSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  const monthHours = monthMinutes / 60

  // Best day of week
  const dayStats: Record<string, number> = {}
  allSessions.forEach(s => {
    const day = format(new Date(s.start_time), 'EEEE')
    dayStats[day] = (dayStats[day] ?? 0) + (s.duration ?? 0)
  })
  const bestDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A'

  // Progress percentage (using total hours including initial)
  const totalHours = skill.total_hours + skill.initial_hours
  const progressPercent = Math.min(Math.round((totalHours / skill.target_hours) * 100), 100)

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/skills" className="text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors">
          ← Back to Skills
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Analytics</p>
            <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">
              {skill.icon} {skill.name}
            </h1>
          </div>
          <Link
            href={`/skills/${id}`}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-sm font-semibold transition-colors"
          >
            Edit Skill
          </Link>
        </div>
      </div>

      {/* Hero Section - Progress Overview */}
      <div className="bg-surface-container border border-surface-container-highest p-8 mb-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Progress Ring */}
          <div className="relative">
            <ProgressRing percent={progressPercent} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-mono text-3xl font-bold text-on-surface">{totalHours.toFixed(1)}h</p>
              <p className="text-xs text-on-surface-variant">/ {skill.target_hours}h</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">Current Streak</p>
              <p className="font-mono text-2xl font-bold text-on-surface">
                {skill.current_streak > 0 ? `🔥 ${skill.current_streak}d` : '0d'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">Total Sessions</p>
              <p className="font-mono text-2xl font-bold text-on-surface">{totalSessions}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">Avg Session</p>
              <p className="font-mono text-2xl font-bold text-on-surface">{avgSessionLength.toFixed(0)}m</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">Last Practice</p>
              <p className="font-sans text-sm font-medium text-on-surface">{lastPracticeDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Detailed Statistics</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-container-highest">
          {[
            { label: 'This Week', value: `${weekHours.toFixed(1)}h` },
            { label: 'This Month', value: `${monthHours.toFixed(1)}h` },
            { label: 'All Time', value: `${totalHours.toFixed(1)}h` },
            { label: 'Longest Streak', value: `${skill.longest_streak ?? 0}d` },
            { label: 'Best Day', value: bestDay },
            { label: 'Progress', value: `${progressPercent}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface-container px-6 py-4">
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-1">{label}</p>
              <p className="font-mono text-xl font-bold text-on-surface">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mb-6">
        <SkillProgressChart sessions={allSessions} targetHours={skill.target_hours} skillColor={skill.color} />
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <SkillHeatmap skillId={id} currentStreak={skill.current_streak ?? 0} longestStreak={skill.longest_streak ?? 0} />
      </div>

      {/* Session History */}
      <SkillSessionHistory sessions={sessions} />
    </div>
  )
}
