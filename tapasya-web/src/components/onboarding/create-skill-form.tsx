'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { recalculateProfileTotalHours } from '@/lib/utils/profile'
import { EMOJI_OPTIONS, TARGET_HOURS, COLORS, createSkillSchema, type CreateSkillValues } from '@/lib/utils/skill-form-config'

const inputClass = 'w-full px-4 py-3 bg-surface-container border border-surface-container-highest text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-outline transition-colors disabled:opacity-50'

export default function CreateSkillForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [selectedIcon, setSelectedIcon] = useState('💻')
  const [selectedColor, setSelectedColor] = useState('#E05C00')
  const [selectedTarget, setSelectedTarget] = useState(10000)
  const [dailyGoal, setDailyGoal] = useState(120)
  const [initialHours, setInitialHours] = useState(0)
  const [serverError, setServerError] = useState<string | null>(null)
  const [skipping, setSkipping] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSkillValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: '',
      initial_hours: 0,
    },
  })

  async function onSubmit(values: CreateSkillValues) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.from('skills').insert({
      user_id: userId,
      name: values.name,
      icon: selectedIcon,
      color: selectedColor,
      target_hours: selectedTarget,
      daily_goal_minutes: dailyGoal,
      initial_hours: initialHours,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    await recalculateProfileTotalHours(userId)

    router.push('/dashboard')
    router.refresh()
  }

  async function handleSkip() {
    setSkipping(true)
    router.push('/dashboard')
  }

  const isLoading = isSubmitting || skipping
  const goalHours = Math.floor(dailyGoal / 60)
  const goalMins = dailyGoal % 60
  const goalDisplay = goalHours > 0 ? `${goalHours}h${goalMins > 0 ? ` ${goalMins}m` : ''}` : `${goalMins}m`

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="inline-block mb-6">
          <span className="font-newsreader text-2xl italic font-bold text-brand-copper">Tapasya</span>
        </Link>
        <h1 className="font-newsreader text-3xl italic font-bold text-on-surface">
          What skill do you want to master?
        </h1>
        <p className="mt-2 font-sans text-sm text-on-surface-variant">
          This is the beginning of 10,000 hours.
        </p>
      </div>

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
            className={inputClass}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs font-sans text-error">{errors.name.message}</p>
          )}
        </div>

        {/* Icon picker */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">Choose an Icon</p>
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
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">Color</p>
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                disabled={isLoading}
                style={{ backgroundColor: color }}
                className={cn('w-8 h-8 transition-all', selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' : '')}
                aria-label={color}
              />
            ))}
          </div>
        </div>

        {/* Target hours */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">Your Goal</p>
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
                  {selectedTarget === value && <span className="text-brand-copper text-sm">✓</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily goal slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Daily Target</p>
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

        {/* Initial hours (optional) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">
              Starting Hours <span className="text-on-surface-variant/60">(Optional)</span>
            </p>
            <p className="font-mono text-sm text-secondary">{initialHours.toFixed(1)}h</p>
          </div>
          <input
            type="number"
            min={0}
            max={10000}
            step={0.5}
            value={initialHours}
            onChange={(e) => setInitialHours(Math.max(0, Math.min(10000, Number(e.target.value))))}
            disabled={isLoading}
            className={inputClass}
            placeholder="0"
          />
          <p className="mt-1.5 text-xs font-sans text-on-surface-variant/60">
            Time already spent on this skill before joining Tapasya
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="px-4 py-3 font-sans text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
          >
            {skipping ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create Skill →
          </button>
        </div>
      </form>
    </div>
  )
}
