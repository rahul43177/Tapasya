'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format, parseISO } from 'date-fns'

interface Session {
  start_time: string
  duration: number
}

interface SkillProgressChartProps {
  sessions: Session[]
  targetHours: number
  skillColor: string
}

export default function SkillProgressChart({ sessions, targetHours, skillColor }: SkillProgressChartProps) {
  // Calculate cumulative hours by month
  const monthlyData = sessions.reduce((acc, session) => {
    const month = format(parseISO(session.start_time), 'MMM yyyy')
    const existingMonth = acc.find(m => m.month === month)
    const hours = (session.duration ?? 0) / 60

    if (existingMonth) {
      existingMonth.hours += hours
    } else {
      acc.push({ month, hours })
    }
    return acc
  }, [] as { month: string; hours: number }[])

  // Convert to cumulative
  const cumulativeData = monthlyData.reduce((acc, m, index) => {
    const cumulative = index === 0 ? m.hours : acc[index - 1].hours + m.hours
    acc.push({ month: m.month, hours: parseFloat(cumulative.toFixed(2)) })
    return acc
  }, [] as { month: string; hours: number }[])

  if (cumulativeData.length === 0) {
    return (
      <div className="bg-surface-container border border-surface-container-highest p-6">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-6">Cumulative Progress</p>
        <div className="h-64 flex items-center justify-center">
          <p className="font-sans text-sm text-on-surface-variant">No practice data yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-6">Cumulative Progress</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cumulativeData}>
          <XAxis
            dataKey="month"
            tick={{ fill: '#e1c0b2', fontSize: 11, fontFamily: 'var(--font-sans-var)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#e1c0b2', fontSize: 11, fontFamily: 'var(--font-mono-var)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}h`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#201f1f',
              border: '1px solid #353434',
              borderRadius: 0,
              fontFamily: 'var(--font-sans-var)',
              fontSize: 12
            }}
            labelStyle={{ color: '#e5e2e1' }}
            formatter={(v) => [`${v}h`, 'Total Hours']}
          />
          <ReferenceLine
            y={targetHours}
            stroke="#e9c349"
            strokeDasharray="3 3"
            label={{ value: `Goal: ${targetHours}h`, fill: '#e9c349', fontSize: 11, position: 'right' }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke={skillColor || '#E05C00'}
            strokeWidth={3}
            dot={{ fill: skillColor || '#E05C00', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
