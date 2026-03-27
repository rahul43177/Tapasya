'use client'

import { useState } from 'react'
import { X, Flame } from 'lucide-react'
import { differenceInHours } from 'date-fns'

interface StreakWarningProps {
  currentStreak: number
  lastActiveAt: string | null
  streakRiskAlertsEnabled: boolean
}

export default function StreakWarning({ currentStreak, lastActiveAt, streakRiskAlertsEnabled }: StreakWarningProps) {
  // Check if warning was dismissed today (lazy initialization)
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    const dismissedDate = localStorage.getItem('streak_warning_dismissed')
    const today = new Date().toISOString().slice(0, 10)
    return dismissedDate === today
  })

  // Determine if warning should show
  const shouldShowWarning = (): boolean => {
    if (!streakRiskAlertsEnabled) return false
    if (currentStreak === 0) return false
    if (isDismissed) return false
    if (!lastActiveAt) return false

    const lastActive = new Date(lastActiveAt)
    const now = new Date()
    const hoursSinceActive = differenceInHours(now, lastActive)

    // Warn if > 18 hours since last session (give buffer before midnight)
    return hoursSinceActive >= 18
  }

  const handleDismiss = () => {
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem('streak_warning_dismissed', today)
    setIsDismissed(true)
  }

  const handleStartSession = () => {
    // Scroll to timer section
    const timerElement = document.querySelector('[data-timer-section]')
    if (timerElement) {
      timerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!shouldShowWarning()) return null

  return (
    <div className="bg-amber-500/20 border border-amber-500/30 p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flame className="w-5 h-5 text-amber-500" />
        <div>
          <p className="font-sans text-sm font-medium text-amber-100">
            Your {currentStreak}-day streak is at risk!
          </p>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Practice today to keep it alive
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleStartSession}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-sans text-xs font-semibold transition-colors"
        >
          Start Session
        </button>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 flex items-center justify-center hover:bg-amber-500/20 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </div>
  )
}
