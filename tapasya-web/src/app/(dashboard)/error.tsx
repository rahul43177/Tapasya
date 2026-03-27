'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="font-newsreader text-2xl italic font-bold text-on-surface mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          {error.message || 'We encountered an unexpected error. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-brand-copper hover:bg-primary-container text-white font-sans text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
