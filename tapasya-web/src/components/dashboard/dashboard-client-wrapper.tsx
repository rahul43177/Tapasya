'use client'

import { useRef } from 'react'
import FocusTimer from '@/components/focus-timer/focus-timer'
import type { Tables } from '@/lib/types'

type Skill = Tables<'skills'>

interface DashboardClientWrapperProps {
  skills: Skill[]
  userId: string
}

export default function DashboardClientWrapper({ skills, userId }: DashboardClientWrapperProps) {
  const timerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mb-6" ref={timerRef} data-timer-section>
      <FocusTimer skills={skills} userId={userId} />
    </div>
  )
}
