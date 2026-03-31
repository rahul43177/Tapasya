'use client'

import Link from 'next/link'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

interface Session {
  duration: number
  start_time: string
}

interface WeekAtGlanceProps {
  sessions: Session[]
}

export default function WeekAtGlance({ sessions }: WeekAtGlanceProps) {
  // Build 7-day bar chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayStart = startOfDay(date).toISOString()
    const dayEnd = startOfDay(subDays(date, -1)).toISOString()
    const minutes = sessions
      .filter(s => s.start_time >= dayStart && s.start_time < dayEnd)
      .reduce((sum, s) => sum + (s.duration ?? 0), 0)
    return {
      day: format(date, 'EEE'),
      hours: parseFloat((minutes / 60).toFixed(2)),
    }
  })

  const weekTotal = last7Days.reduce((sum, d) => sum + d.hours, 0)

  return (
    <div className="bg-surface-container border border-surface-container-highest">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-surface-container-highest">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Week at a Glance</p>
        <Link href="/analytics" className="text-xs font-sans text-brand-copper hover:text-primary transition-colors">
          View detailed analytics →
        </Link>
      </div>
      <div className="p-4 sm:p-6">
        {weekTotal === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center">
            <p className="font-sans text-sm text-on-surface-variant mb-1">No sessions this week yet</p>
            <p className="text-xs text-on-surface-variant">Practice this week to see your progress</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-mono text-2xl font-bold text-on-surface">{weekTotal.toFixed(1)}h</p>
              <p className="text-xs font-sans text-on-surface-variant">Total this week</p>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={last7Days} barSize={20}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#e1c0b2', fontSize: 10, fontFamily: 'var(--font-sans-var)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#201f1f',
                    border: '1px solid #353434',
                    borderRadius: 0,
                    fontFamily: 'var(--font-sans-var)',
                    fontSize: 11
                  }}
                  labelStyle={{ color: '#e5e2e1' }}
                  formatter={(v) => [`${v}h`, 'Hours']}
                />
                <Bar dataKey="hours" fill="#E05C00" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  )
}
