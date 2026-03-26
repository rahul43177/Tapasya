import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import FocusTimer from '@/components/focus-timer/focus-timer'

function getMasteryLevel(hours: number): string {
  if (hours >= 10000) return 'Master'
  if (hours >= 5000) return 'Expert'
  if (hours >= 3000) return 'Advanced'
  if (hours >= 1000) return 'Proficient'
  if (hours >= 500) return 'Competent'
  if (hours >= 200) return 'Novice'
  if (hours >= 20) return 'Beginner'
  return 'Aspirant'
}

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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [profileRes, skillsRes, todaySessionsRes, recentSessionsRes] = await Promise.all([
    supabase.from('profiles').select('full_name, username, total_hours, total_sessions, current_global_streak, longest_streak, daily_goal_minutes').eq('id', user.id).single(),
    supabase.from('skills').select('*').eq('user_id', user.id).eq('is_active', true).order('order', { ascending: true }),
    supabase.from('focus_sessions').select('duration').eq('user_id', user.id).gte('start_time', today.toISOString()),
    supabase.from('focus_sessions').select('id, duration, start_time, focus_rating, skill_id, skills(name, icon)').eq('user_id', user.id).order('start_time', { ascending: false }).limit(5),
  ])

  const profile = profileRes.data
  const skills = skillsRes.data ?? []
  const todaySessions = todaySessionsRes.data ?? []
  const recentSessions = recentSessionsRes.data ?? []

  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  const dailyGoalMinutes = profile?.daily_goal_minutes ?? 120
  const todayPercent = Math.round((todayMinutes / dailyGoalMinutes) * 100)
  const totalHours = Number(profile?.total_hours ?? 0)
  const streak = profile?.current_global_streak ?? 0
  const displayName = profile?.full_name ?? profile?.username ?? 'Practitioner'
  const firstName = displayName.split(' ')[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">{greeting}</p>
        <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">{firstName}</h1>
      </div>

      {/* Today's Tapa — hero section */}
      <div className="bg-surface-container border border-surface-container-highest p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Today&apos;s Tapa</p>
            {streak > 0 && (
              <p className="font-sans text-sm text-secondary mt-1">🔥 {streak}-day streak</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-on-surface">{(todayMinutes / 60).toFixed(1)}</p>
            <p className="text-xs font-sans text-on-surface-variant">/ {(dailyGoalMinutes / 60).toFixed(1)} hrs goal</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing percent={todayPercent} size={80} stroke={6} />
          <div className="flex-1">
            <div className="h-1.5 bg-surface-container-highest mb-2">
              <div className="h-full bg-brand-copper transition-all duration-700" style={{ width: `${Math.min(todayPercent, 100)}%` }} />
            </div>
            <p className="font-sans text-xs text-on-surface-variant">{todayPercent}% of daily goal</p>
          </div>
        </div>
      </div>

      {/* Focus Timer */}
      {skills.length > 0 ? (
        <div className="mb-6">
          <FocusTimer skills={skills} userId={user.id} dailyGoalMinutes={dailyGoalMinutes} />
        </div>
      ) : (
        <div className="bg-surface-container border border-surface-container-highest p-6 mb-6 text-center">
          <p className="font-newsreader italic text-on-surface-variant mb-3">No skills yet</p>
          <a href="/onboarding" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors">
            Add your first skill →
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-surface-container border border-surface-container-highest">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Skills</p>
            <a href="/skills" className="text-xs font-sans text-brand-copper hover:text-primary transition-colors">Manage →</a>
          </div>
          <div className="divide-y divide-surface-container-highest">
            {skills.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="font-sans text-sm text-on-surface-variant">No skills yet.</p>
                <a href="/onboarding" className="text-xs text-brand-copper hover:text-primary transition-colors mt-1 inline-block">+ Add skill</a>
              </div>
            )}
            {skills.map((skill) => {
              const pct = Math.min(Math.round((skill.total_hours / skill.target_hours) * 100), 100)
              return (
                <div key={skill.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-sans text-sm font-medium text-on-surface">{skill.name}</span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">{skill.total_hours.toFixed(1)}/{skill.target_hours}h</span>
                  </div>
                  <div className="h-1 bg-surface-container-highest">
                    <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: skill.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-sans text-on-surface-variant">{pct}% to mastery</span>
                    {skill.current_streak > 0 && (
                      <span className="text-[10px] font-sans text-secondary">🔥 {skill.current_streak}d</span>
                    )}
                  </div>
                </div>
              )
            })}
            <div className="px-6 py-3">
              <a href="/skills/new" className="text-xs font-sans text-on-surface-variant hover:text-brand-copper transition-colors">+ Add skill</a>
            </div>
          </div>
        </div>

        {/* Quick stats + recent sessions */}
        <div className="space-y-6">
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
            <div className="px-6 py-4 border-b border-surface-container-highest">
              <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Recent Sessions</p>
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
                  <div key={session.id} className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{skill?.icon ?? '⏱'}</span>
                      <div>
                        <p className="font-sans text-sm text-on-surface">{skill?.name ?? 'Unknown'}</p>
                        <p className="text-[10px] font-sans text-on-surface-variant">
                          {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
    </div>
  )
}
