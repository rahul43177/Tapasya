'use client'

import { generateInsights } from '@/lib/utils/analytics'

interface Session {
  start_time: string
  duration: number
  skill_id: string
}

interface AnalyticsInsightsProps {
  sessions: Session[]
}

export default function AnalyticsInsights({ sessions }: AnalyticsInsightsProps) {
  const insights = generateInsights(sessions)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, index) => (
        <div
          key={`${insight.type}-${index}`}
          className="bg-surface-container-high border border-surface-container-highest p-4"
        >
          <span className="text-2xl mb-2 block">{insight.icon}</span>
          <p className="font-sans text-sm text-on-surface leading-relaxed">{insight.message}</p>
        </div>
      ))}
    </div>
  )
}
