'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { getQualifyingDates, calculateStreak } from '@/lib/utils/streaks'
import { checkAchievementsAfterSession } from '@/lib/utils/achievements'
import { Loader2 } from 'lucide-react'
import type { Tables } from '@/lib/types'
import type { Database } from '@/lib/types/database'
import AchievementCelebration from '@/components/achievements/achievement-celebration'
import NavigationGuardModal from '@/components/focus-timer/navigation-guard-modal'
import { saveTimerState, loadTimerState, clearTimerState } from '@/lib/utils/timer-storage'

type Achievement = Database['public']['Tables']['achievements']['Row']

type Skill = Pick<Tables<'skills'>, 'id' | 'name' | 'icon' | 'color' | 'total_minutes' | 'total_hours' | 'total_sessions' | 'longest_streak'>
type TimerState = 'idle' | 'running' | 'paused'
type TimerMode = 'stopwatch' | 'pomodoro'

interface FocusTimerProps {
  skills: Skill[]
  userId: string
}

const POMODORO_PRESETS = [
  { label: '25 min', value: 25 },
  { label: '50 min', value: 50 },
  { label: '90 min', value: 90 },
]

const MILESTONES = [
  { hours: 20, label: '20 Hours', sublabel: 'First Steps', emoji: '🌱' },
  { hours: 50, label: '50 Hours', sublabel: 'Finding Rhythm', emoji: '🔥' },
  { hours: 100, label: '100 Hours', sublabel: 'Century Mark', emoji: '💯' },
  { hours: 200, label: '200 Hours', sublabel: 'Deep Work', emoji: '⚡' },
  { hours: 500, label: '500 Hours', sublabel: 'Half Thousand', emoji: '🏔️' },
  { hours: 1000, label: '1000 Hours', sublabel: 'Mastery Begins', emoji: '🎯' },
  { hours: 5000, label: '5000 Hours', sublabel: 'Expert Level', emoji: '🌟' },
  { hours: 10000, label: '10000 Hours', sublabel: 'True Master', emoji: '👑' },
]

function getNewMilestone(oldHours: number, newHours: number) {
  for (const m of MILESTONES) {
    if (oldHours < m.hours && newHours >= m.hours) return m
  }
  return null
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const RATINGS = [1, 2, 3, 4, 5]

interface MilestoneData {
  hours: number
  label: string
  sublabel: string
  emoji: string
}

export default function FocusTimer({ skills, userId }: FocusTimerProps) {
  const router = useRouter()
  const [mode, setMode] = useState<TimerMode>('stopwatch')
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(25 * 60)
  const [pomodoroComplete, setPomodoroComplete] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [focusRating, setFocusRating] = useState(3)
  const [notes, setNotes] = useState('')
  const [unlockedMilestone, setUnlockedMilestone] = useState<MilestoneData | null>(null)
  const [savedSkillName, setSavedSkillName] = useState('')
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [showNavigationWarning, setShowNavigationWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const elapsedBeforePauseRef = useRef(0)
  const remainingBeforePauseRef = useRef(25 * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset remaining when preset changes (only when idle)
  useEffect(() => {
    if (timerState === 'idle') {
      const secs = pomodoroMinutes * 60
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemaining(secs)
      remainingBeforePauseRef.current = secs
    }
  }, [pomodoroMinutes, timerState])

  useEffect(() => {
    if (timerState !== 'running') return

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const delta = Math.floor((now - (startTimeRef.current ?? now)) / 1000)

      if (mode === 'stopwatch') {
        setElapsed(elapsedBeforePauseRef.current + delta)
      } else {
        const newRemaining = remainingBeforePauseRef.current - delta
        if (newRemaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setRemaining(0)
          setElapsed(pomodoroMinutes * 60)
          setTimerState('paused')
          setPomodoroComplete(true)
          setShowRating(true)
        } else {
          setRemaining(newRemaining)
          setElapsed(elapsedBeforePauseRef.current + delta)
        }
      }
    }, 1000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerState, mode, pomodoroMinutes])

  // Warn on page close when timer is running
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (timerState === 'running' || timerState === 'paused') {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [timerState])

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = loadTimerState()
    if (savedState && savedState.state !== 'idle') {
      setMode(savedState.mode)
      setTimerState(savedState.state)
      setElapsed(savedState.elapsed)
      setRemaining(savedState.remaining)
      setPomodoroMinutes(savedState.pomodoroMinutes)
      setSelectedSkillId(savedState.selectedSkillId)
      elapsedBeforePauseRef.current = savedState.elapsedBeforePause
      remainingBeforePauseRef.current = savedState.remainingBeforePause

      // If was running, pause it and let user resume
      if (savedState.state === 'running') {
        setTimerState('paused')
      }
    }
  }, [])

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (timerState !== 'idle') {
      saveTimerState({
        mode,
        state: timerState,
        elapsed,
        remaining,
        pomodoroMinutes,
        selectedSkillId,
        startTimeMs: startTimeRef.current,
        elapsedBeforePause: elapsedBeforePauseRef.current,
        remainingBeforePause: remainingBeforePauseRef.current,
        savedAt: Date.now(),
      })
    } else {
      clearTimerState()
    }
  }, [timerState, elapsed, remaining, mode, pomodoroMinutes, selectedSkillId])

  // Block navigation when timer is running
  useEffect(() => {
    if (timerState !== 'running') return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.href && !link.href.includes('#')) {
        const url = new URL(link.href)
        const currentPath = window.location.pathname

        // If navigating away from current page
        if (url.pathname !== currentPath) {
          e.preventDefault()
          e.stopPropagation()
          setPendingNavigation(url.pathname)
          setShowNavigationWarning(true)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [timerState])

  function resetTimerState() {
    setElapsed(0)
    elapsedBeforePauseRef.current = 0
    startTimeRef.current = null
    const secs = pomodoroMinutes * 60
    setRemaining(secs)
    remainingBeforePauseRef.current = secs
    setTimerState('idle')
    setShowRating(false)
    setPomodoroComplete(false)
    setNotes('')
    setFocusRating(3)
    clearTimerState()
  }

  function handleStayOnPage() {
    setShowNavigationWarning(false)
    setPendingNavigation(null)
  }

  function handleLeaveAnyway() {
    setShowNavigationWarning(false)
    resetTimerState()
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  function handleModeSwitch(newMode: TimerMode) {
    if (timerState !== 'idle') return
    setMode(newMode)
    setElapsed(0)
    elapsedBeforePauseRef.current = 0
    const secs = pomodoroMinutes * 60
    setRemaining(secs)
    remainingBeforePauseRef.current = secs
  }

  function handleStart() {
    startTimeRef.current = Date.now()
    setSaveError(null)
    setPomodoroComplete(false)
    setTimerState('running')
  }

  function handlePause() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    elapsedBeforePauseRef.current = elapsed
    remainingBeforePauseRef.current = remaining
    startTimeRef.current = null
    setTimerState('paused')
  }

  function handleResume() {
    startTimeRef.current = Date.now()
    setTimerState('running')
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimerState('paused')
    setShowRating(true)
  }

  async function handleSave() {
    const durationMinutes = mode === 'pomodoro'
      ? pomodoroMinutes
      : Math.max(1, Math.round(elapsed / 60))
    setSaving(true)
    setSaveError(null)

    const supabase = createClient()
    const now = new Date()
    const startTime = new Date(now.getTime() - elapsed * 1000)

    // 1. Insert session
    const { error: sessionError } = await supabase.from('focus_sessions').insert({
      user_id: userId,
      skill_id: selectedSkillId,
      type: mode,
      duration: durationMinutes,
      start_time: startTime.toISOString(),
      end_time: now.toISOString(),
      focus_rating: focusRating,
      notes: notes.trim() || null,
    })

    if (sessionError) { setSaveError(sessionError.message); setSaving(false); return }

    const skill = skills.find(s => s.id === selectedSkillId)
    if (skill) {
      const newMinutes = skill.total_minutes + durationMinutes
      const newHours = newMinutes / 60

      // 2. Check milestone
      const milestone = getNewMilestone(skill.total_hours, newHours)

      // 3. Fetch recent sessions + profile in parallel for streak calc
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000).toISOString()
      const [skillSessionsRes, globalSessionsRes, profileRes] = await Promise.all([
        supabase.from('focus_sessions').select('start_time, duration').eq('skill_id', selectedSkillId).gte('start_time', ninetyDaysAgo),
        supabase.from('focus_sessions').select('start_time, duration').eq('user_id', userId).gte('start_time', ninetyDaysAgo),
        supabase.from('profiles').select('total_sessions, total_hours, longest_streak').eq('id', userId).single(),
      ])

      // 4. Calculate streaks
      const skillStreak = calculateStreak(getQualifyingDates(skillSessionsRes.data ?? []))
      const globalStreak = calculateStreak(getQualifyingDates(globalSessionsRes.data ?? []))

      const profile = profileRes.data
      const prevTotalSessions = profile?.total_sessions ?? 0
      const prevTotalHours = profile?.total_hours ?? 0
      const prevLongestStreak = profile?.longest_streak ?? 0

      // 5. Update skill
      await supabase.from('skills').update({
        total_minutes: newMinutes,
        total_hours: newHours,
        total_sessions: skill.total_sessions + 1,
        last_practice_date: now.toISOString(),
        current_streak: skillStreak.current,
        longest_streak: Math.max(skill.longest_streak ?? 0, skillStreak.longest),
      }).eq('id', selectedSkillId)

      // 6. Recalculate profile total_hours including initial hours from all skills
      const { data: allSkills } = await supabase
        .from('skills')
        .select('total_hours, initial_hours')
        .eq('user_id', userId)
        .eq('is_active', true)

      const recalculatedTotalHours = (allSkills || []).reduce(
        (sum, skill) => sum + (skill.total_hours + skill.initial_hours),
        0
      )

      await supabase.from('profiles').update({
        total_sessions: prevTotalSessions + 1,
        total_hours: recalculatedTotalHours,
        current_global_streak: globalStreak.current,
        longest_streak: Math.max(prevLongestStreak, globalStreak.longest),
        last_active_at: now.toISOString(),
      }).eq('id', userId)

      // 7. Check for newly unlocked achievements
      const newlyUnlockedAchievements = await checkAchievementsAfterSession(
        supabase,
        userId,
        selectedSkillId,
        {
          duration: durationMinutes,
          startTime: startTime.toISOString(),
          skillTotalHours: newHours,
          skillTotalSessions: skill.total_sessions + 1,
          globalTotalHours: recalculatedTotalHours,
          globalStreak: globalStreak.current,
          skillStreak: skillStreak.current,
        }
      )

      // 8. Show achievement celebration if achievements unlocked
      if (newlyUnlockedAchievements.length > 0) {
        setSavedSkillName(skill.name)
        setUnlockedAchievements(newlyUnlockedAchievements)
        setSaving(false)
        return
      }

      // 9. If milestone unlocked, show celebration before resetting
      if (milestone) {
        setSavedSkillName(skill.name)
        setUnlockedMilestone(milestone)
        setSaving(false)
        return
      }
    }

    resetTimerState()
    setSaving(false)
    router.refresh()
  }

  function handleDiscard() {
    resetTimerState()
  }

  function handleMilestoneDismiss() {
    setUnlockedMilestone(null)
    setSavedSkillName('')
    resetTimerState()
    router.refresh()
  }

  function handleAchievementsDismiss() {
    setUnlockedAchievements([])
    setSavedSkillName('')
    resetTimerState()
    router.refresh()
  }

  const selectedSkill = skills.find(s => s.id === selectedSkillId)
  const displayTime = mode === 'stopwatch' ? formatTime(elapsed) : formatTime(remaining)
  const sessionDurationLabel = mode === 'pomodoro'
    ? `${pomodoroMinutes}m`
    : formatTime(elapsed)

  // Achievement celebration screen
  if (unlockedAchievements.length > 0) {
    return <AchievementCelebration achievements={unlockedAchievements} onDismiss={handleAchievementsDismiss} />
  }

  // Milestone celebration screen
  if (unlockedMilestone) {
    return (
      <div className="bg-surface-container border border-surface-container-highest p-6 text-center">
        <p className="text-4xl mb-4">{unlockedMilestone.emoji}</p>
        <p className="text-xs uppercase tracking-widest font-sans text-secondary mb-2">Milestone Unlocked</p>
        <p className="font-newsreader text-3xl italic font-bold text-on-surface mb-1">{unlockedMilestone.label}</p>
        <p className="font-sans text-sm text-on-surface-variant mb-1">{unlockedMilestone.sublabel}</p>
        <p className="font-sans text-xs text-on-surface-variant mb-8">in {savedSkillName}</p>
        <button
          onClick={handleMilestoneDismiss}
          className="px-8 py-3 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors"
        >
          Continue the Practice
        </button>
      </div>
    )
  }

  // Save / rating screen
  if (showRating) {
    return (
      <div className="bg-surface-container border border-surface-container-highest p-6">
        <p className={cn('text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-4', pomodoroComplete ? 'text-secondary' : '')}>
          {pomodoroComplete ? 'Pomodoro complete!' : 'Session complete'}
        </p>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{selectedSkill?.icon}</span>
          <div>
            <p className="font-sans text-sm font-medium text-on-surface">{selectedSkill?.name}</p>
            <p className="font-mono text-2xl font-bold text-on-surface">{sessionDurationLabel}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">Focus quality</p>
          <div className="flex gap-2">
            {RATINGS.map(r => (
              <button key={r} onClick={() => setFocusRating(r)} className={cn('w-9 h-9 font-sans text-sm transition-colors', r <= focusRating ? 'bg-brand-copper text-white' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high')}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you work on?" rows={2} className="w-full px-3 py-2 bg-background border border-surface-container-highest text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-outline transition-colors resize-none" />
        </div>

        {saveError && <p className="mb-4 text-xs font-sans text-error">{saveError}</p>}

        <div className="flex gap-3">
          <button onClick={handleDiscard} disabled={saving} className="px-4 py-2 font-sans text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50">
            Discard
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      {/* Mode toggle */}
      <div className="flex mb-6 border border-surface-container-highest">
        
        <button
          onClick={() => handleModeSwitch('pomodoro')}
          disabled={timerState !== 'idle'}
          className={cn(
            'flex-1 py-2 text-xs uppercase tracking-widest font-sans transition-colors disabled:opacity-50',
            mode === 'pomodoro'
              ? 'bg-brand-copper text-white'
              : 'bg-transparent text-on-surface-variant hover:text-on-surface'
          )}
        >
          Pomodoro
        </button>
        <button
          onClick={() => handleModeSwitch('stopwatch')}
          disabled={timerState !== 'idle'}
          className={cn(
            'flex-1 py-2 text-xs uppercase tracking-widest font-sans transition-colors disabled:opacity-50',
            mode === 'stopwatch'
              ? 'bg-brand-copper text-white'
              : 'bg-transparent text-on-surface-variant hover:text-on-surface'
          )}
        >
          Flowmodoro
        </button>
      </div>

      {/* Pomodoro preset selector */}
      {mode === 'pomodoro' && timerState === 'idle' && (
        <div className="flex gap-2 mb-6">
          {POMODORO_PRESETS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPomodoroMinutes(value)}
              className={cn(
                'flex-1 py-2 text-xs font-sans font-semibold transition-colors',
                pomodoroMinutes === value
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'bg-transparent border border-surface-container-highest text-on-surface-variant hover:border-outline hover:text-on-surface'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Skill selector */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">Skill</label>
        <select
          value={selectedSkillId}
          onChange={e => setSelectedSkillId(e.target.value)}
          disabled={timerState !== 'idle'}
          className="w-full px-4 py-3 bg-background border border-surface-container-highest text-on-surface font-sans text-sm focus:outline-none focus:border-outline transition-colors disabled:opacity-50 appearance-none"
        >
          {skills.map(skill => (
            <option key={skill.id} value={skill.id}>{skill.icon} {skill.name}</option>
          ))}
        </select>
      </div>

      {/* Timer display */}
      <div className="text-center mb-6 py-4">
        <p className="font-mono text-6xl font-bold text-on-surface tracking-tight">
          {displayTime}
        </p>
        {timerState !== 'idle' && selectedSkill && (
          <p className="mt-2 font-sans text-sm text-on-surface-variant">{selectedSkill.icon} {selectedSkill.name}</p>
        )}
        {mode === 'pomodoro' && timerState === 'idle' && (
          <p className="mt-2 font-sans text-xs text-on-surface-variant">{pomodoroMinutes} min session</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {timerState === 'idle' && (
          <button onClick={handleStart} className="flex-1 py-4 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors">
            ▶ Start Focus
          </button>
        )}
        {timerState === 'running' && (
          <>
            <button onClick={handlePause} className="flex-1 py-4 bg-surface-container-highest text-on-surface font-sans font-semibold text-sm hover:bg-surface-bright transition-colors">
              ⏸ Pause
            </button>
            <button onClick={handleStop} className="px-6 py-4 border border-outline-variant text-on-surface-variant font-sans text-sm hover:border-outline hover:text-on-surface transition-colors">
              ■ Stop
            </button>
          </>
        )}
        {timerState === 'paused' && (
          <>
            <button onClick={handleResume} className="flex-1 py-4 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors">
              ▶ Resume
            </button>
            <button onClick={handleStop} className="px-6 py-4 border border-outline-variant text-on-surface-variant font-sans text-sm hover:border-outline hover:text-on-surface transition-colors">
              ■ Stop
            </button>
          </>
        )}
      </div>

      {/* Navigation Guard Modal */}
      <NavigationGuardModal
        isOpen={showNavigationWarning}
        onStay={handleStayOnPage}
        onLeave={handleLeaveAnyway}
        elapsedTime={formatTime(elapsed)}
      />
    </div>
  )
}
