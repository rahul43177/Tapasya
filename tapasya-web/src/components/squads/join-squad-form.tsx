'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { joinSquadSchema, type JoinSquadValues } from '@/lib/schemas/squad-schema'

interface SquadPreview {
  id: string
  name: string
  description: string | null
  focus_skill_name: string | null
  max_members: number | null
  member_count: number
  is_full: boolean
  is_already_member: boolean
}

export default function JoinSquadForm() {
  const router = useRouter()
  const [squadPreview, setSquadPreview] = useState<SquadPreview | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [joining, setJoining] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<JoinSquadValues>({
    resolver: zodResolver(joinSquadSchema),
  })

  const inviteCode = watch('invite_code')

  async function handleLookup() {
    if (!inviteCode || inviteCode.length !== 8) return

    setLookingUp(true)
    setServerError(null)
    setSquadPreview(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setServerError('You must be logged in to join a squad')
        return
      }

      // Look up squad by invite code
      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .select('id, name, description, focus_skill_name, max_members')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()

      if (squadError || !squad) {
        setServerError('Invalid invite code. Please check and try again.')
        return
      }

      // Count current members
      const { data: members, error: membersError } = await supabase
        .from('squad_members')
        .select('user_id')
        .eq('squad_id', squad.id)

      if (membersError) {
        setServerError('Failed to load squad information')
        return
      }

      const memberCount = members?.length || 0
      const isFull = squad.max_members !== null && memberCount >= squad.max_members
      const isAlreadyMember = members?.some((m) => m.user_id === user.id) || false

      setSquadPreview({
        id: squad.id,
        name: squad.name,
        description: squad.description,
        focus_skill_name: squad.focus_skill_name,
        max_members: squad.max_members,
        member_count: memberCount,
        is_full: isFull,
        is_already_member: isAlreadyMember,
      })
    } catch (error) {
      console.error('Failed to look up squad:', error)
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setLookingUp(false)
    }
  }

  async function handleJoin() {
    if (!squadPreview) return

    setJoining(true)
    setServerError(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setServerError('You must be logged in to join a squad')
        return
      }

      // Check if already a member (double-check)
      if (squadPreview.is_already_member) {
        setServerError('You are already a member of this squad')
        return
      }

      // Check if squad is full (double-check)
      if (squadPreview.is_full) {
        setServerError('This squad is full')
        return
      }

      // Join the squad
      const { error: joinError } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squadPreview.id,
          user_id: user.id,
          role: 'member',
        })

      if (joinError) {
        setServerError(joinError.message)
        return
      }

      // Success - redirect to squad detail page
      router.push(`/squads/${squadPreview.id}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to join squad:', error)
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  const isLoading = lookingUp || joining

  return (
    <div className="w-full max-w-2xl mx-auto">
      {serverError && (
        <div className="mb-6 px-4 py-3 bg-error-container border-l-2 border-error text-sm font-sans text-error">
          {serverError}
        </div>
      )}

      <div className="space-y-6">
        {/* Invite Code Input */}
        <div>
          <label htmlFor="invite_code" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
            Enter Invite Code *
          </label>
          <div className="flex gap-3">
            <input
              id="invite_code"
              type="text"
              placeholder="A3K9XM2P"
              maxLength={8}
              disabled={isLoading}
              {...register('invite_code')}
              className={cn(
                'flex-1 px-4 py-3 bg-surface-container border border-surface-container-highest',
                'text-on-surface font-mono text-lg tracking-widest uppercase placeholder:text-on-surface-variant/40',
                'focus:outline-none focus:border-outline transition-colors disabled:opacity-50'
              )}
            />
            <button
              type="button"
              onClick={handleLookup}
              disabled={isLoading || !inviteCode || inviteCode.length !== 8}
              className={cn(
                'px-6 py-3 bg-brand-copper text-white font-sans font-semibold text-sm',
                'hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center gap-2'
              )}
            >
              {lookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Look Up
            </button>
          </div>
          {errors.invite_code && (
            <p className="mt-1.5 text-xs font-sans text-error">{errors.invite_code.message}</p>
          )}
          <p className="mt-1.5 text-xs font-sans text-on-surface-variant">
            Enter the 8-character code shared by your squad leader
          </p>
        </div>

        {/* Squad Preview */}
        {squadPreview && (
          <div className="p-6 bg-surface-container border border-surface-container-highest space-y-4">
            {/* Squad Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-copper/10 border border-brand-copper/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-brand-copper" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-newsreader text-xl italic font-bold text-on-surface mb-1">
                  {squadPreview.name}
                </h3>
                {squadPreview.description && (
                  <p className="font-sans text-sm text-on-surface-variant">
                    {squadPreview.description}
                  </p>
                )}
              </div>
            </div>

            {/* Squad Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-container-highest">
              <div>
                <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">
                  Members
                </p>
                <p className="font-mono text-sm text-on-surface">
                  {squadPreview.member_count} / {squadPreview.max_members ?? '∞'}
                </p>
              </div>
              {squadPreview.focus_skill_name && (
                <div>
                  <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-1">
                    Focus Skill
                  </p>
                  <p className="font-sans text-sm text-on-surface">
                    {squadPreview.focus_skill_name}
                  </p>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {squadPreview.is_already_member && (
              <div className="px-4 py-3 bg-secondary/10 border-l-2 border-secondary text-sm font-sans text-on-surface">
                You are already a member of this squad
              </div>
            )}

            {squadPreview.is_full && !squadPreview.is_already_member && (
              <div className="px-4 py-3 bg-error-container border-l-2 border-error text-sm font-sans text-error">
                This squad is full and not accepting new members
              </div>
            )}

            {/* Join Button */}
            {!squadPreview.is_already_member && !squadPreview.is_full && (
              <button
                type="button"
                onClick={handleJoin}
                disabled={joining}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 px-6',
                  'bg-brand-copper text-white font-sans font-semibold text-sm',
                  'hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Join Squad
              </button>
            )}

            {/* View Squad Button (if already member) */}
            {squadPreview.is_already_member && (
              <button
                type="button"
                onClick={() => router.push(`/squads/${squadPreview.id}`)}
                className={cn(
                  'w-full py-3 px-6 border border-surface-container-highest',
                  'text-on-surface font-sans font-semibold text-sm',
                  'hover:border-outline transition-colors'
                )}
              >
                View Squad
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
