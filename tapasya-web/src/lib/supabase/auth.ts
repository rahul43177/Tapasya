import { redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

export interface AuthenticatedUser {
  id: string
  email: string | null
}

type CookieLike = {
  name: string
}

function isLocalFetchFailure(error: unknown) {
  if (process.env.NODE_ENV === 'production') {
    return false
  }

  if (!(error instanceof Error)) {
    return false
  }

  return error.message.toLowerCase().includes('fetch failed')
}

function isMissingSessionError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes('auth session missing')
}

export function hasSupabaseAuthCookie(cookies: CookieLike[]) {
  return cookies.some(
    (cookie) =>
      cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  )
}

export async function getAuthenticatedUser(
  supabase: SupabaseClient<Database>
): Promise<AuthenticatedUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email ?? null,
    }
  } catch (error) {
    if (isMissingSessionError(error)) {
      return null
    }

    if (!isLocalFetchFailure(error)) {
      throw error
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email ?? null,
    }
  }
}

export async function requireAuthenticatedUser(
  supabase: SupabaseClient<Database>
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(supabase)

  if (!user) {
    redirect('/login')
  }

  return user
}
