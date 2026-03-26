import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Auth route protection — fully implemented in Task 1.3.7
// Placeholder: pass all requests through until Supabase auth is wired up
export default function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
