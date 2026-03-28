import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, getDay, getHours } from 'date-fns'

export type TimePeriod = 'today' | 'week' | 'month' | 'all'

export interface HourDistribution {
  hour: number // 0-23
  minutes: number
  sessionCount: number
}

export interface Insight {
  type: 'best_day' | 'optimal_session_length' | 'peak_hours'
  message: string
  icon: string
}

/**
 * Get date range for a given time period
 */
export function getDateRangeForPeriod(period: TimePeriod): { start: Date; end: Date } {
  const now = new Date()

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      }
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }), // Sunday
        end: endOfWeek(now, { weekStartsOn: 0 })
      }
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      }
    case 'all':
      return {
        start: new Date(2020, 0, 1), // Far past date to get all records
        end: endOfDay(now)
      }
  }
}

/**
 * Calculate time-of-day distribution from sessions
 */
export function calculateTimeOfDayDistribution(
  sessions: Array<{ start_time: string; duration: number }>
): HourDistribution[] {
  // Initialize 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    minutes: 0,
    sessionCount: 0
  }))

  // Aggregate sessions by hour
  sessions.forEach(session => {
    const startHour = getHours(new Date(session.start_time))
    hourlyData[startHour].minutes += session.duration
    hourlyData[startHour].sessionCount += 1
  })

  return hourlyData
}

/**
 * Generate insights from session data
 */
export function generateInsights(
  sessions: Array<{ start_time: string; duration: number; skill_id: string }>
): Insight[] {
  const insights: Insight[] = []

  // No data case
  if (sessions.length === 0) {
    return [{
      type: 'best_day',
      message: 'Complete more sessions to unlock insights!',
      icon: '📊'
    }]
  }

  // Single session case
  if (sessions.length === 1) {
    return [{
      type: 'best_day',
      message: 'Just getting started! Complete more sessions to see patterns.',
      icon: '🌱'
    }]
  }

  // 1. Best Day Analysis
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayStats: { [key: number]: { minutes: number; count: number } } = {}

  sessions.forEach(session => {
    const day = getDay(new Date(session.start_time))
    if (!dayStats[day]) {
      dayStats[day] = { minutes: 0, count: 0 }
    }
    dayStats[day].minutes += session.duration
    dayStats[day].count += 1
  })

  const bestDay = Object.entries(dayStats).reduce((best, [day, stats]) => {
    return stats.minutes > best.minutes ? { day: parseInt(day), minutes: stats.minutes } : best
  }, { day: 0, minutes: 0 })

  if (bestDay.minutes > 0) {
    const avgHours = (bestDay.minutes / 60).toFixed(1)
    insights.push({
      type: 'best_day',
      message: `You're most productive on ${dayNames[bestDay.day]}s with ${avgHours}h average`,
      icon: '📅'
    })
  }

  // 2. Optimal Session Length
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
  const optimalMinutes = Math.round(avgDuration)

  insights.push({
    type: 'optimal_session_length',
    message: `Your best sessions are ${optimalMinutes} minutes long`,
    icon: '⏱️'
  })

  // 3. Peak Hours Analysis
  const hourStats: { [hour: number]: number } = {}

  sessions.forEach(session => {
    const hour = getHours(new Date(session.start_time))
    hourStats[hour] = (hourStats[hour] || 0) + session.duration
  })

  const sortedHours = Object.entries(hourStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  if (sortedHours.length > 0) {
    const peakHours = sortedHours.map(([hour]) => parseInt(hour)).sort((a, b) => a - b)
    const startHour = peakHours[0]
    const endHour = peakHours[peakHours.length - 1] + 1

    const formatHour = (h: number) => {
      const date = new Date()
      date.setHours(h, 0, 0, 0)
      return format(date, 'ha')
    }

    insights.push({
      type: 'peak_hours',
      message: `You practice most between ${formatHour(startHour)} and ${formatHour(endHour)}`,
      icon: '🌟'
    })
  }

  return insights.slice(0, 3) // Return max 3 insights
}
