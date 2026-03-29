import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database'
import { getAuthenticatedUser, hasSupabaseAuthCookie } from '@/lib/supabase/auth'

// Protected routes — require authentication
const PROTECTED_ROUTES = ['/dashboard', '/skills', '/analytics', '/onboarding', '/sessions', '/squads']

// Auth routes — redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup']

function clearSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse
) {
  const supabaseCookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith('sb-'))

  for (const cookie of supabaseCookies) {
    request.cookies.delete(cookie.name)
    response.cookies.delete(cookie.name)
  }
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const hasAuthCookie = hasSupabaseAuthCookie(request.cookies.getAll())

  if (!isProtected && !isAuthPage) {
    return NextResponse.next({ request })
  }

  if (!hasAuthCookie && isProtected) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  if (!hasAuthCookie && isAuthPage) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Must set on both request and response to keep session alive
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add code between createServerClient and getUser.
  // A subtle bug will make it very hard to debug intermittent session issues.
  const user = await getAuthenticatedUser(supabase)

  // Not logged in → trying to access protected route → redirect to login
  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    const redirectResponse = NextResponse.redirect(redirectUrl)
    clearSupabaseAuthCookies(request, redirectResponse)
    return redirectResponse
  }

  // Stale or invalid auth cookies should be cleared so the browser can recover
  // cleanly instead of retrying a broken refresh token on every request.
  if (!user && isAuthPage) {
    clearSupabaseAuthCookies(request, supabaseResponse)
  }

  // Logged in → trying to access login/signup → redirect to dashboard
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
