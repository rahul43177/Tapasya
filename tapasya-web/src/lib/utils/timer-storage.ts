/**
 * Timer State Persistence Utilities
 * Saves and restores focus timer state to/from localStorage
 */

export interface TimerState {
  mode: 'stopwatch' | 'pomodoro'
  state: 'idle' | 'running' | 'paused'
  elapsed: number
  remaining: number
  pomodoroMinutes: number
  selectedSkillId: string
  startTimeMs: number | null
  elapsedBeforePause: number
  remainingBeforePause: number
  savedAt: number
}

const STORAGE_KEY = 'tapasya_timer_state'

export function saveTimerState(state: TimerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      savedAt: Date.now()
    }))
  } catch (error) {
    console.error('Failed to save timer state:', error)
  }
}

export function loadTimerState(): TimerState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const state = JSON.parse(stored) as TimerState

    // Only restore if saved within last 24 hours
    const ageMs = Date.now() - state.savedAt
    if (ageMs > 24 * 60 * 60 * 1000) {
      clearTimerState()
      return null
    }

    // Adjust elapsed time if timer was running
    if (state.state === 'running' && state.startTimeMs) {
      const timeSinceSave = Date.now() - state.savedAt
      state.elapsed = state.elapsedBeforePause + Math.floor(timeSinceSave / 1000)

      if (state.mode === 'pomodoro') {
        state.remaining = Math.max(0, state.remainingBeforePause - Math.floor(timeSinceSave / 1000))
      }
    }

    return state
  } catch (error) {
    console.error('Failed to load timer state:', error)
    return null
  }
}

export function clearTimerState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear timer state:', error)
  }
}
