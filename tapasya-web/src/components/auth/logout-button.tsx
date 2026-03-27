'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant font-sans text-sm',
        'hover:border-outline hover:text-on-surface transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
      Sign out
    </button>
  )
}
