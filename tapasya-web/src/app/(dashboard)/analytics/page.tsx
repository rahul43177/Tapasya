import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import AnalyticsCharts from '@/components/analytics/analytics-charts'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [skillsRes, weekSessionsRes, allSessionsRes] = await Promise.all([
    supabase.from('skills').select('id, name, icon, color, total_hours, total_minutes, total_sessions, target_hours, current_streak, longest_streak').eq('user_id', user.id).eq('is_active', true),
    supabase.from('focus_sessions').select('duration, start_time, skill_id').eq('user_id', user.id).gte('start_time', sevenDaysAgo.toISOString()).order('start_time', { ascending: true }),
    supabase.from('focus_sessions').select('duration').eq('user_id', user.id),
  ])

  const skills = skillsRes.data ?? []
  const weekSessions = weekSessionsRes.data ?? []
  const totalSessionMinutes = (allSessionsRes.data ?? []).reduce((sum, s) => sum + (s.duration ?? 0), 0)

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Your</p>
        <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">Analytics</h1>
      </div>
      <AnalyticsCharts skills={skills} weekSessions={weekSessions} totalSessionMinutes={totalSessionMinutes} />
    </div>
  )
}
