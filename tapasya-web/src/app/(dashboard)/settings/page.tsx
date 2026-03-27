'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface UserSettings {
  daily_goal_minutes: number
  timezone: string
  default_timer_mode: 'stopwatch' | 'pomodoro'
  default_pomodoro_minutes: number
  default_break_minutes: number
  notifications_enabled: boolean
  daily_reminder_time: string | null
  streak_risk_alerts: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [settings, setSettings] = useState<UserSettings>({
    daily_goal_minutes: 120,
    timezone: 'UTC',
    default_timer_mode: 'stopwatch',
    default_pomodoro_minutes: 25,
    default_break_minutes: 5,
    notifications_enabled: true,
    daily_reminder_time: null,
    streak_risk_alerts: true,
  })

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)
      setUserEmail(user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_goal_minutes, timezone, default_timer_mode, default_pomodoro_minutes, default_break_minutes, notifications_enabled, daily_reminder_time, streak_risk_alerts')
        .eq('id', user.id)
        .single()

      if (profile) {
        const timerMode = profile.default_timer_mode === 'pomodoro' ? 'pomodoro' : 'stopwatch'
        setSettings({
          daily_goal_minutes: profile.daily_goal_minutes ?? 120,
          timezone: profile.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
          default_timer_mode: timerMode,
          default_pomodoro_minutes: profile.default_pomodoro_minutes ?? 25,
          default_break_minutes: profile.default_break_minutes ?? 5,
          notifications_enabled: profile.notifications_enabled ?? true,
          daily_reminder_time: profile.daily_reminder_time,
          streak_risk_alerts: profile.streak_risk_alerts ?? true,
        })
      }

      setLoading(false)
    }

    loadSettings()
  }, [router, supabase])

  const updateSetting = async (key: keyof UserSettings, value: UserSettings[keyof UserSettings]) => {
    setSaving(true)
    setSettings(prev => ({ ...prev, [key]: value }))

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          [key]: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating setting:', error)
    } finally {
      setSaving(false)
    }
  }

  const exportData = async () => {
    try {
      const [profileRes, skillsRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('skills').select('*').eq('user_id', userId),
        supabase.from('focus_sessions').select('*').eq('user_id', userId),
      ])

      const exportData = {
        profile: profileRes.data,
        skills: skillsRes.data,
        sessions: sessionsRes.data,
        exported_at: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tapasya-data-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-copper" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mb-8">Settings</h1>

        {/* Account Settings */}
        <div className="bg-surface-container border border-surface-container-highest mb-6">
          <div className="px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Account</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">Email</label>
              <p className="font-sans text-sm text-on-surface">{userEmail}</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Managed by your authentication provider</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-surface-container border border-surface-container-highest mb-6">
          <div className="px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Preferences</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Daily Goal */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
                Daily Goal: {(settings.daily_goal_minutes / 60).toFixed(1)}h
              </label>
              <input
                type="range"
                min="30"
                max="480"
                step="15"
                value={settings.daily_goal_minutes}
                onChange={(e) => updateSetting('daily_goal_minutes', parseInt(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E05C00 0%, #E05C00 ${(settings.daily_goal_minutes / 480) * 100}%, #353434 ${(settings.daily_goal_minutes / 480) * 100}%, #353434 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                <span>30m</span>
                <span>8h</span>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-high border border-surface-container-highest text-on-surface font-sans text-sm focus:outline-none focus:border-brand-copper"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Shanghai">Shanghai</option>
                <option value="Asia/Kolkata">India</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Auto-detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
          </div>
        </div>

        {/* Focus Timer Defaults */}
        <div className="bg-surface-container border border-surface-container-highest mb-6">
          <div className="px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Focus Timer Defaults</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Default Mode */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
                Default Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSetting('default_timer_mode', 'stopwatch')}
                  className={`flex-1 px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                    settings.default_timer_mode === 'stopwatch'
                      ? 'bg-brand-copper text-white'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  Stopwatch
                </button>
                <button
                  onClick={() => updateSetting('default_timer_mode', 'pomodoro')}
                  className={`flex-1 px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                    settings.default_timer_mode === 'pomodoro'
                      ? 'bg-brand-copper text-white'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  Pomodoro
                </button>
              </div>
            </div>

            {/* Pomodoro Duration */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
                Pomodoro Duration
              </label>
              <div className="flex gap-3">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => updateSetting('default_pomodoro_minutes', mins)}
                    className={`flex-1 px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                      settings.default_pomodoro_minutes === mins
                        ? 'bg-brand-copper text-white'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Break Duration */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
                Break Duration
              </label>
              <div className="flex gap-3">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => updateSetting('default_break_minutes', mins)}
                    className={`flex-1 px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                      settings.default_break_minutes === mins
                        ? 'bg-brand-copper text-white'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container border border-surface-container-highest mb-6">
          <div className="px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Notifications</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Daily Practice Reminder */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-on-surface font-medium">Daily practice reminder</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Get reminded to practice every day</p>
              </div>
              <button
                onClick={() => updateSetting('notifications_enabled', !settings.notifications_enabled)}
                className={`w-12 h-6 flex items-center rounded-full transition-colors ${
                  settings.notifications_enabled ? 'bg-brand-copper' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.notifications_enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Streak Risk Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-on-surface font-medium">Streak risk alerts</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Warn when your streak is about to break</p>
              </div>
              <button
                onClick={() => updateSetting('streak_risk_alerts', !settings.streak_risk_alerts)}
                className={`w-12 h-6 flex items-center rounded-full transition-colors ${
                  settings.streak_risk_alerts ? 'bg-brand-copper' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.streak_risk_alerts ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-surface-container border border-surface-container-highest mb-6">
          <div className="px-6 py-4 border-b border-surface-container-highest">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Data Management</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="font-sans text-sm text-on-surface font-medium mb-2">Export all data</p>
              <p className="text-xs text-on-surface-variant mb-3">
                Download a JSON file with all your profile data, skills, and practice sessions
              </p>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-sm font-semibold transition-colors"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>

        {/* Save Indicator */}
        {saving && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-brand-copper text-white rounded-full shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-sans">Saving...</span>
          </div>
        )}
      </div>
    </div>
  )
}
