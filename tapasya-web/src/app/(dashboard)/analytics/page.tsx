import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { getDateRangeForPeriod } from '@/lib/utils/analytics'
import type { TimePeriod } from '@/lib/utils/analytics'
import AnalyticsPageClient from '@/components/analytics/analytics-page-client'

interface AnalyticsPageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = await searchParams
  const period = (params.period as TimePeriod) || 'week'

  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Use getDateRangeForPeriod() instead of hardcoded 7 days
  const { start, end } = getDateRangeForPeriod(period)

  const [skillsRes, sessionsRes, allSessionsRes] = await Promise.all([
    supabase.from('skills').select('id, name, icon, color, total_hours, total_minutes, total_sessions, target_hours, current_streak, longest_streak').eq('user_id', user.id).eq('is_active', true),
    supabase.from('focus_sessions').select('duration, start_time, skill_id').eq('user_id', user.id).gte('start_time', start.toISOString()).lte('start_time', end.toISOString()).order('start_time', { ascending: true }),
    supabase.from('focus_sessions').select('duration').eq('user_id', user.id),
  ])

  const skills = skillsRes.data ?? []
  const sessions = sessionsRes.data ?? []
  const totalSessionMinutes = (allSessionsRes.data ?? []).reduce((sum, s) => sum + (s.duration ?? 0), 0)

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Your</p>
        <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">Analytics</h1>
      </div>

      <AnalyticsPageClient
        initialData={{ skills, sessions, totalSessionMinutes }}
        initialPeriod={period}
      />
    </div>
  )
}
