'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { generateInviteCode } from '@/lib/utils/squads'
import { createSquadSchema, type CreateSquadValues } from '@/lib/schemas/squad-schema'

const MAX_MEMBERS_OPTIONS = [
  { value: 3, label: '3 members', sublabel: 'Small & focused' },
  { value: 5, label: '5 members', sublabel: 'Recommended' },
  { value: 10, label: '10 members', sublabel: 'Larger group' },
  { value: 20, label: '20 members', sublabel: 'Community' },
]

export default function CreateSquadForm() {
  const router = useRouter()
  const [selectedMaxMembers, setSelectedMaxMembers] = useState(5)
  const [isPublic, setIsPublic] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSquadValues>({
    resolver: zodResolver(createSquadSchema),
    defaultValues: {
      max_members: 5,
      is_public: false,
    },
  })

  async function onSubmit(values: CreateSquadValues) {
    setServerError(null)
    const supabase = createClient()

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setServerError('You must be logged in to create a squad')
        return
      }

      // Generate unique invite code
      let inviteCode = generateInviteCode()
      let isUnique = false
      let attempts = 0
      const maxAttempts = 10

      // Ensure invite code is unique
      while (!isUnique && attempts < maxAttempts) {
        const { data, error } = await supabase
          .from('squads')
          .select('id')
          .eq('invite_code', inviteCode)
          .single()

        if (error && error.code === 'PGRST116') {
          // Code doesn't exist - we're good
          isUnique = true
        } else if (!error && data) {
          // Code exists - generate a new one
          inviteCode = generateInviteCode()
          attempts++
        } else {
          // Some other error
          setServerError('Failed to verify invite code uniqueness')
          return
        }
      }

      if (!isUnique) {
        setServerError('Failed to generate unique invite code. Please try again.')
        return
      }

      // Create the squad
      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .insert({
          name: values.name,
          description: values.description || null,
          focus_skill_name: values.focus_skill_name || null,
          invite_code: inviteCode,
          max_members: selectedMaxMembers,
          is_public: isPublic,
          created_by: user.id,
        })
        .select()
        .single()

      if (squadError) {
        setServerError(squadError.message)
        return
      }

      // Add creator as owner in squad_members
      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squad.id,
          user_id: user.id,
          role: 'owner',
        })

      if (memberError) {
        setServerError(memberError.message)
        return
      }

      // Success - redirect to squad detail page
      router.push(`/squads/${squad.id}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to create squad:', error)
      setServerError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {serverError && (
        <div className="mb-6 px-4 py-3 bg-error-container border-l-2 border-error text-sm font-sans text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

        {/* Squad Name */}
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
            Squad Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Morning Warriors, Code Crushers, Study Squad"
            disabled={isSubmitting}
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            placeholder="What's this squad about? What are your collective goals?"
            rows={3}
            disabled={isSubmitting}
            {...register('description')}
            className={cn(
              'w-full px-4 py-3 bg-surface-container border border-surface-container-highest',
              'text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40',
              'focus:outline-none focus:border-outline transition-colors disabled:opacity-50 resize-none'
            )}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-sans text-error">{errors.description.message}</p>
          )}
        </div>

        {/* Focus Skill */}
        <div>
          <label htmlFor="focus_skill_name" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
            Focus Skill (Optional)
          </label>
          <input
            id="focus_skill_name"
            type="text"
            placeholder="e.g. Piano, Coding, Spanish"
            disabled={isSubmitting}
            {...register('focus_skill_name')}
            className={cn(
              'w-full px-4 py-3 bg-surface-container border border-surface-container-highest',
              'text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40',
              'focus:outline-none focus:border-outline transition-colors disabled:opacity-50'
            )}
          />
          {errors.focus_skill_name && (
            <p className="mt-1.5 text-xs font-sans text-error">{errors.focus_skill_name.message}</p>
          )}
          <p className="mt-1.5 text-xs font-sans text-on-surface-variant">
            Optional: Specify a skill this squad focuses on
          </p>
        </div>

        {/* Max Members */}
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-3">
            Squad Size
          </p>
          <div className="space-y-2">
            {MAX_MEMBERS_OPTIONS.map(({ value, label, sublabel }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedMaxMembers(value)}
                disabled={isSubmitting}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 transition-colors',
                  selectedMaxMembers === value
                    ? 'bg-surface-container border border-brand-copper'
                    : 'bg-surface-container border border-surface-container-highest hover:border-outline'
                )}
              >
                <span className="font-sans text-sm text-on-surface">{label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs font-sans text-on-surface-variant">{sublabel}</span>
                  {selectedMaxMembers === value && (
                    <span className="text-brand-copper text-sm">✓</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Public Squad Toggle */}
        <div className="flex items-start gap-3 p-4 bg-surface-container border border-surface-container-highest">
          <input
            type="checkbox"
            id="is_public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 w-4 h-4 accent-brand-copper disabled:opacity-50"
          />
          <div className="flex-1">
            <label htmlFor="is_public" className="block text-sm font-sans text-on-surface cursor-pointer">
              Make this squad public
            </label>
            <p className="mt-1 text-xs font-sans text-on-surface-variant">
              Public squads appear in search results and anyone can view the leaderboard
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 px-6',
              'bg-brand-copper text-white font-sans font-semibold text-sm',
              'hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create Squad
          </button>
        </div>
      </form>
    </div>
  )
}
