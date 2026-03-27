'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { EMOJI_OPTIONS, TARGET_HOURS, COLORS, skillNameSchema, type SkillNameValues } from '@/lib/utils/skill-form-config'
import type { Tables } from '@/lib/types'

type Skill = Tables<'skills'>

interface Props {
  skill: Skill
}

export default function EditSkillForm({ skill }: Props) {
  const router = useRouter()
  const [selectedIcon, setSelectedIcon] = useState(skill.icon)
  const [selectedColor, setSelectedColor] = useState(skill.color)
  const [selectedTarget, setSelectedTarget] = useState(skill.target_hours)
  const [dailyGoal, setDailyGoal] = useState(skill.daily_goal_minutes ?? 120)
  const [serverError, setServerError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillNameValues>({
    resolver: zodResolver(skillNameSchema),
    defaultValues: { name: skill.name },
  })

  async function onSubmit(values: SkillNameValues) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.from('skills').update({
      name: values.name,
      icon: selectedIcon,
      color: selectedColor,
      target_hours: selectedTarget,
      daily_goal_minutes: dailyGoal,
    }).eq('id', skill.id).eq('user_id', skill.user_id)

    if (error) {
      setServerError(error.message)
      return
    }

    router.push('/skills')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Archive this skill? Your session history will be preserved.')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('skills').update({ is_active: false }).eq('id', skill.id).eq('user_id', skill.user_id)
    router.push('/skills')
    router.refresh()
  }

  const isLoading = isSubmitting || deleting

  const goalHours = Math.floor(dailyGoal / 60)
  const goalMins = dailyGoal % 60
  const goalDisplay = goalHours > 0
    ? `${goalHours}h${goalMins > 0 ? ` ${goalMins}m` : ''}`
    : `${goalMins}m`

  return (
    <div className="w-full">
      {serverError && (
        <div className="mb-6 px-4 py-3 bg-error-container border-l-2 border-error text-sm font-sans text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

        {/* Skill name */}
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
            Skill Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Piano, Data Structures, Spanish"
            disabled={isLoading}
            {...register('name')}
            className={cn(
              'w-full px-4 py-3 bg-surface-container border border-surface-container-highest',
              'text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40',
              'focus:outline-none focus:border-outline transition-colors disabled:opacity-50'
            )}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs font-sans text-error">{errors.name.message}</p>
          )}
        </div>

        {/* Icon picker */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
            Choose an Icon
          </p>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedIcon(emoji)}
                disabled={isLoading}
                className={cn(
                  'w-10 h-10 text-xl flex items-center justify-center transition-colors',
                  selectedIcon === emoji
                    ? 'bg-brand-copper'
                    : 'bg-surface-container border border-surface-container-highest hover:border-outline'
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
            Color
          </p>
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                disabled={isLoading}
                style={{ backgroundColor: color }}
                className={cn(
                  'w-8 h-8 transition-all',
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' : ''
                )}
                aria-label={color}
              />
            ))}
          </div>
        </div>

        {/* Target hours */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
            Your Goal
          </p>
          <div className="space-y-2">
            {TARGET_HOURS.map(({ label, sublabel, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTarget(value)}
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 transition-colors',
                  selectedTarget === value
                    ? 'bg-surface-container border border-brand-copper'
                    : 'bg-surface-container border border-surface-container-highest hover:border-outline'
                )}
              >
                <span className="font-sans text-sm text-on-surface">{label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs font-sans text-on-surface-variant">{sublabel}</span>
                  {selectedTarget === value && (
                    <span className="text-brand-copper text-sm">✓</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily goal slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">
              Daily Target
            </p>
            <p className="font-mono text-sm text-secondary">{goalDisplay}/day</p>
          </div>
          <input
            type="range"
            min={15}
            max={480}
            step={15}
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            disabled={isLoading}
            className="w-full accent-brand-copper disabled:opacity-50"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-sans text-on-surface-variant">15m</span>
            <span className="text-xs font-sans text-on-surface-variant">8h</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className={cn(
              'px-4 py-3 font-sans text-sm border transition-colors disabled:opacity-50',
              'text-on-surface-variant border-surface-container-highest hover:border-error hover:text-error'
            )}
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
            Archive
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-6',
              'bg-brand-copper text-white font-sans font-semibold text-sm',
              'hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
