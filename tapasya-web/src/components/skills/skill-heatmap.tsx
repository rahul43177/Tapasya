import { createClient } from '@/lib/supabase/server'
import Heatmap from '@/components/dashboard/heatmap'
import type { HeatmapDay } from '@/components/dashboard/heatmap'

interface SkillHeatmapProps {
  skillId: string
  currentStreak: number
  longestStreak: number
}

export default async function SkillHeatmap({ skillId, currentStreak, longestStreak }: SkillHeatmapProps) {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364)

  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('start_time, duration')
    .eq('skill_id', skillId)
    .gte('start_time', startDate.toISOString())

  // Aggregate by date
  const heatmapMap = new Map<string, number>()
  for (const s of sessions ?? []) {
    const dateStr = new Date(s.start_time).toISOString().slice(0, 10)
    heatmapMap.set(dateStr, (heatmapMap.get(dateStr) ?? 0) + (s.duration ?? 0))
  }
  const heatmapData: HeatmapDay[] = Array.from(heatmapMap.entries()).map(([date, minutes]) => ({ date, minutes }))

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Practice History (Last 365 Days)</p>
        <div className="flex gap-4 text-xs font-sans text-on-surface-variant">
          <span>Current: {currentStreak}d</span>
          <span>Best: {longestStreak}d</span>
        </div>
      </div>
      <Heatmap data={heatmapData} />
    </div>
  )
}
