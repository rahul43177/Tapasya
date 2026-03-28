'use client'

import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfDay, startOfMonth, eachDayOfInterval, eachMonthOfInterval, getHours } from 'date-fns'
import type { TimePeriod } from '@/lib/utils/analytics'

interface Skill {
  id: string
  name: string
  icon: string
  color: string
  total_hours: number
  total_minutes: number
  total_sessions: number
  target_hours: number
  current_streak: number
  longest_streak: number
}

interface Session {
  duration: number
  start_time: string
  skill_id: string
}

interface AnalyticsChartsProps {
  skills: Skill[]
  sessions: Session[]
  totalSessionMinutes: number
  timePeriod: TimePeriod
}

export default function AnalyticsCharts({ skills, sessions, totalSessionMinutes, timePeriod }: AnalyticsChartsProps) {
  // Build bar chart data based on time period
  let barChartData: { label: string; hours: number }[] = []
  let periodLabel = ''
  let avgDays = 7

  if (timePeriod === 'today') {
    // Show hours (24 bars)
    periodLabel = 'Today'
    avgDays = 1
    barChartData = Array.from({ length: 24 }, (_, hour) => {
      const minutes = sessions
        .filter(s => getHours(new Date(s.start_time)) === hour)
        .reduce((sum, s) => sum + (s.duration ?? 0), 0)
      return {
        label: format(new Date().setHours(hour, 0, 0, 0), 'ha'),
        hours: parseFloat((minutes / 60).toFixed(2))
      }
    })
  } else if (timePeriod === 'week') {
    // Show days (7 bars)
    periodLabel = 'This Week'
    avgDays = 7
    barChartData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      const dayStart = startOfDay(date).toISOString()
      const dayEnd = startOfDay(subDays(date, -1)).toISOString()
      const minutes = sessions
        .filter(s => s.start_time >= dayStart && s.start_time < dayEnd)
        .reduce((sum, s) => sum + (s.duration ?? 0), 0)
      return {
        label: format(date, 'EEE'),
        hours: parseFloat((minutes / 60).toFixed(2))
      }
    })
  } else if (timePeriod === 'month') {
    // Show days (30 bars) - aggregate into weeks for readability
    periodLabel = 'This Month'
    avgDays = 30
    const monthStart = startOfMonth(new Date())
    const days = eachDayOfInterval({ start: monthStart, end: new Date() })
    barChartData = days.map(date => {
      const dayStart = startOfDay(date).toISOString()
      const dayEnd = startOfDay(subDays(date, -1)).toISOString()
      const minutes = sessions
        .filter(s => s.start_time >= dayStart && s.start_time < dayEnd)
        .reduce((sum, s) => sum + (s.duration ?? 0), 0)
      return {
        label: format(date, 'd'),
        hours: parseFloat((minutes / 60).toFixed(2))
      }
    })
  } else {
    // All time - show months
    periodLabel = 'All Time'
    avgDays = 365
    if (sessions.length > 0) {
      const firstSession = new Date(sessions[0].start_time)
      const months = eachMonthOfInterval({ start: firstSession, end: new Date() })
      barChartData = months.map(month => {
        const monthStart = startOfMonth(month).toISOString()
        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
        const monthEnd = nextMonth.toISOString()
        const minutes = sessions
          .filter(s => s.start_time >= monthStart && s.start_time < monthEnd)
          .reduce((sum, s) => sum + (s.duration ?? 0), 0)
        return {
          label: format(month, 'MMM'),
          hours: parseFloat((minutes / 60).toFixed(2))
        }
      })
    }
  }

  // Pie chart — hours per skill
  const pieData = skills.filter(s => s.total_hours > 0).map(s => ({
    name: `${s.icon} ${s.name}`,
    value: parseFloat(s.total_hours.toFixed(2)),
    color: s.color,
  }))

  const periodTotal = barChartData.reduce((sum, d) => sum + d.hours, 0)

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-container-highest">
        {[
          { label: 'Total Hours', value: (totalSessionMinutes / 60).toFixed(1) },
          { label: periodLabel, value: periodTotal.toFixed(1) + 'h' },
          { label: 'Active Skills', value: skills.length },
          { label: `Avg/Day${timePeriod === 'week' ? ' (7d)' : ''}`, value: (periodTotal / avgDays).toFixed(1) + 'h' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-container px-6 py-5">
            <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-1">{label}</p>
            <p className="font-mono text-2xl font-bold text-on-surface">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period bar chart */}
        <div className="bg-surface-container border border-surface-container-highest p-6">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-6">Hours {periodLabel}</p>
          {periodTotal === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="font-sans text-sm text-on-surface-variant">No sessions in this period yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData} barSize={timePeriod === 'today' ? 12 : 24}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#e1c0b2', fontSize: 11, fontFamily: 'var(--font-sans-var)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={timePeriod === 'today' ? 2 : timePeriod === 'month' ? 2 : 0}
                />
                <YAxis tick={{ fill: '#e1c0b2', fontSize: 11, fontFamily: 'var(--font-mono-var)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #353434', borderRadius: 0, fontFamily: 'var(--font-sans-var)', fontSize: 12 }}
                  labelStyle={{ color: '#e5e2e1' }}
                  formatter={(v) => [`${v}h`, 'Hours']}
                />
                <Bar dataKey="hours" fill="#E05C00" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Skill distribution pie */}
        <div className="bg-surface-container border border-surface-container-highest p-6">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-6">Hours by Skill</p>
          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="font-sans text-sm text-on-surface-variant">No hours logged yet.</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-sans text-xs text-on-surface truncate">{entry.name}</span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant ml-2">{entry.value}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills breakdown table */}
      <div className="bg-surface-container border border-surface-container-highest">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Skills Breakdown</p>
        </div>
        {skills.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="font-sans text-sm text-on-surface-variant">No skills yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-highest">
            {skills.map(skill => {
              const pct = Math.min(Math.round((skill.total_hours / skill.target_hours) * 100), 100)
              return (
                <div key={skill.id} className="px-6 py-4 grid grid-cols-4 lg:grid-cols-6 gap-4 items-center hover:bg-surface-container-high transition-colors">
                  <Link href={`/skills/${skill.id}/analytics`} className="col-span-2 flex items-center gap-2 cursor-pointer group">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="font-sans text-sm font-medium text-on-surface group-hover:text-brand-copper transition-colors">{skill.name}</span>
                  </Link>
                  <div className="text-right lg:text-left">
                    <p className="font-mono text-sm text-on-surface">{skill.total_hours.toFixed(1)}h</p>
                    <p className="text-[10px] font-sans text-on-surface-variant">{skill.total_sessions} sessions</p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="font-mono text-sm text-secondary">{skill.current_streak > 0 ? `🔥 ${skill.current_streak}d` : '—'}</p>
                    <p className="text-[10px] font-sans text-on-surface-variant">best: {skill.longest_streak}d</p>
                  </div>
                  <div className="col-span-2 hidden lg:block">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-sans text-on-surface-variant">{pct}%</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">{skill.target_hours.toLocaleString()}h goal</span>
                    </div>
                    <div className="h-1 bg-surface-container-highest">
                      <div className="h-full" style={{ width: `${pct}%`, backgroundColor: skill.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
