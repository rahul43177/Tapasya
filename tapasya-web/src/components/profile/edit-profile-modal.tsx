'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  username: z.string()
    .min(3, 'Min 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only')
    .optional()
    .or(z.literal('')),
})

interface EditProfileModalProps {
  userId: string
  currentFullName: string
  currentUsername?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfileModal({
  userId,
  currentFullName,
  currentUsername,
  open,
  onOpenChange
}: EditProfileModalProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(currentFullName)
  const [username, setUsername] = useState(currentUsername ?? '')
  const [errors, setErrors] = useState<{ full_name?: string; username?: string; general?: string }>({})
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setErrors({})
    setSaving(true)

    try {
      // Validate form
      const result = profileSchema.safeParse({ full_name: fullName, username })
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        setSaving(false)
        return
      }

      const supabase = createClient()

      // Check username uniqueness if username is provided
      if (username && username !== currentUsername) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .neq('id', userId)
          .single()

        if (existing) {
          setErrors({ username: 'Username already taken' })
          setSaving(false)
          return
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Success! Close modal and refresh
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-surface-container border border-surface-container-highest w-full max-w-md p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-newsreader text-2xl italic font-bold text-on-surface">
              Edit Profile
            </Dialog.Title>
            <Dialog.Close className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <X className="w-4 h-4 text-on-surface-variant" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
                Full Name *
              </label>
              <input
                id="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-high border border-surface-container-highest text-on-surface font-sans text-sm focus:outline-none focus:border-brand-copper"
                disabled={saving}
              />
              {errors.full_name && (
                <p className="text-xs text-error mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">
                Username (optional)
              </label>
              <div className="flex items-center">
                <span className="text-on-surface-variant font-sans text-sm mr-1">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface-container-high border border-surface-container-highest text-on-surface font-sans text-sm focus:outline-none focus:border-brand-copper"
                  disabled={saving}
                  placeholder="yourname"
                />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Letters, numbers, and underscore only
              </p>
              {errors.username && (
                <p className="text-xs text-error mt-1">{errors.username}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-error/10 border border-error/20">
                <p className="text-xs text-error">{errors.general}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-sm font-semibold transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-brand-copper hover:bg-primary-container text-white font-sans text-sm font-semibold transition-colors flex items-center justify-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
