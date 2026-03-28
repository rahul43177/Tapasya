'use client'

import { AlertTriangle } from 'lucide-react'

interface NavigationGuardModalProps {
  isOpen: boolean
  onStay: () => void
  onLeave: () => void
  elapsedTime: string
}

export default function NavigationGuardModal({ isOpen, onStay, onLeave, elapsedTime }: NavigationGuardModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-surface-container border-2 border-secondary p-8 max-w-md mx-4 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-secondary/20 rounded-full">
            <AlertTriangle className="w-8 h-8 text-secondary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-newsreader text-2xl italic font-bold text-on-surface mb-2">
          Focus Session In Progress
        </h2>

        {/* Message */}
        <p className="font-sans text-sm text-on-surface-variant mb-6">
          You have a timer running ({elapsedTime}). Leaving this page will lose your current session progress.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onStay}
            className="flex-1 px-6 py-3 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors"
          >
            Stay & Continue
          </button>
          <button
            onClick={onLeave}
            className="flex-1 px-6 py-3 bg-surface-container-highest border border-surface-container-highest text-on-surface font-sans font-semibold text-sm hover:border-outline transition-colors"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  )
}
