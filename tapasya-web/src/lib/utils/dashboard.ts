/**
 * Dashboard utility functions
 */

/**
 * Get a context-aware motivational message based on daily progress
 * @param hoursToday - Hours practiced today
 * @param dailyGoal - Daily goal in hours
 * @param streak - Current streak count
 * @returns Motivational message string
 */
export function getTodayMessage(hoursToday: number, dailyGoal: number, streak: number): string {
  const progress = (hoursToday / dailyGoal) * 100

  if (progress === 0) {
    return `Ready to start day ${streak + 1}? Let's begin! 💪`
  } else if (progress < 50) {
    return `Great start! Keep the momentum going 🔥`
  } else if (progress < 100) {
    const remaining = (dailyGoal - hoursToday).toFixed(1)
    return `You're crushing it! Only ${remaining}h to go 🚀`
  } else {
    return `Goal smashed! You're on fire 🔥 (${streak}-day streak)`
  }
}
