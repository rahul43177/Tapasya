'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { TimePeriod } from '@/lib/utils/analytics'
import { fetchAnalyticsData } from '@/app/(dashboard)/analytics/actions'
import TimePeriodFilter from './time-period-filter'
import AnalyticsCharts from './analytics-charts'
import TimeOfDayChart from './time-of-day-chart'
import AnalyticsInsights from './analytics-insights'
import AnalyticsLoading from './analytics-loading'

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

interface AnalyticsPageClientProps {
  initialData: {
    skills: Skill[]
    sessions: Session[]
    totalSessionMinutes: number
  }
  initialPeriod: TimePeriod
}

export default function AnalyticsPageClient({ initialData, initialPeriod }: AnalyticsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState(initialData)
  const [currentPeriod, setCurrentPeriod] = useState(initialPeriod)
  const [isPending, startTransition] = useTransition()

  const handlePeriodChange = async (period: TimePeriod) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    router.push(`/analytics?${params.toString()}`)

    // Update current period immediately for UI feedback
    setCurrentPeriod(period)

    // Fetch new data via Server Action
    startTransition(async () => {
      const newData = await fetchAnalyticsData(period)
      setData(newData)
    })
  }

  return (
    <div className="space-y-6">
      <TimePeriodFilter
        currentPeriod={currentPeriod}
        onPeriodChange={handlePeriodChange}
      />

      {isPending ? (
        <AnalyticsLoading />
      ) : (
        <>
          <AnalyticsCharts
            skills={data.skills}
            sessions={data.sessions}
            totalSessionMinutes={data.totalSessionMinutes}
            timePeriod={currentPeriod}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeOfDayChart sessions={data.sessions} />
            <AnalyticsInsights sessions={data.sessions} />
          </div>
        </>
      )}
    </div>
  )
}
