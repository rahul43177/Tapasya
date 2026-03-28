'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { calculateTimeOfDayDistribution } from '@/lib/utils/analytics'

interface Session {
  start_time: string
  duration: number
  skill_id: string
}

interface TimeOfDayChartProps {
  sessions: Session[]
}

export default function TimeOfDayChart({ sessions }: TimeOfDayChartProps) {
  // Get hour distribution
  const hourlyData = calculateTimeOfDayDistribution(sessions)

  // Transform for chart display
  const chartData = hourlyData.map(({ hour, minutes }) => ({
    hour,
    label: format(new Date().setHours(hour, 0, 0, 0), 'ha'),
    hours: parseFloat((minutes / 60).toFixed(2))
  }))

  // Check if there's any data
  const hasData = chartData.some(d => d.hours > 0)

  // For mobile, show fewer labels
  const showEveryNHours = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 3

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-6">
        Practice by Time of Day
      </p>
      {!hasData ? (
        <div className="h-48 flex items-center justify-center">
          <p className="font-sans text-sm text-on-surface-variant text-center">
            No sessions recorded yet.<br />Start practicing to see your patterns!
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={12}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#e1c0b2', fontSize: 10, fontFamily: 'var(--font-sans-var)' }}
              axisLine={false}
              tickLine={false}
              interval={showEveryNHours - 1}
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
              formatter={(v, name, props) => {
                const sessionCount = hourlyData[props.payload.hour].sessionCount
                return [
                  `${v}h (${sessionCount} session${sessionCount !== 1 ? 's' : ''})`,
                  'Hours'
                ]
              }}
            />
            <Bar dataKey="hours" fill="#E05C00" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
