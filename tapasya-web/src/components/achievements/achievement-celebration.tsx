'use client'

import { useState } from 'react'
import type { Database } from '@/lib/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']

interface AchievementCelebrationProps {
  achievements: Achievement[]
  onDismiss: () => void
}

export default function AchievementCelebration({ achievements, onDismiss }: AchievementCelebrationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const achievement = achievements[currentIndex]

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onDismiss()
    }
  }

  const rarityColors: Record<string, string> = {
    common: 'text-on-surface-variant',
    rare: 'text-[#4A90E2]',
    epic: 'text-[#9B59B6]',
    legendary: 'text-secondary',
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest p-8 text-center max-w-md mx-auto">
      {/* Badge icon */}
      <p className="text-6xl mb-4">{achievement.icon}</p>

      {/* Label */}
      <p className="text-xs uppercase tracking-widest font-sans text-secondary mb-2">
        Achievement Unlocked
      </p>

      {/* Name */}
      <p className="font-newsreader text-3xl italic font-bold text-on-surface mb-2">
        {achievement.name}
      </p>

      {/* Description */}
      <p className="font-sans text-sm text-on-surface-variant mb-6">
        {achievement.description}
      </p>

      {/* Rarity badge */}
      <div className="inline-block px-3 py-1 bg-surface-container-highest mb-6">
        <span className={`text-xs uppercase tracking-widest font-sans ${rarityColors[achievement.rarity] || 'text-on-surface-variant'}`}>
          {achievement.rarity}
        </span>
      </div>

      {/* Progress indicator if multiple */}
      {achievements.length > 1 && (
        <p className="text-xs font-sans text-on-surface-variant mb-4">
          {currentIndex + 1} of {achievements.length} achievements
        </p>
      )}

      {/* Continue button */}
      <button
        onClick={handleNext}
        className="px-8 py-3 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors"
      >
        {currentIndex < achievements.length - 1 ? 'Next Achievement' : 'Continue Practice'}
      </button>
    </div>
  )
}
