'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface HeatmapDay {
  date: string // 'YYYY-MM-DD'
  minutes: number
}

interface Props {
  data: HeatmapDay[]
}

function getIntensityColor(minutes: number): string {
  if (minutes === 0) return '#353434'
  if (minutes < 30) return '#7a3200'
  if (minutes < 120) return '#b54d00'
  return '#E05C00'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export default function Heatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // Build a map from date string to minutes
  const minutesByDate = new Map<string, number>()
  data.forEach(d => minutesByDate.set(d.date, d.minutes))

  // Build 52 weeks of cells (364 days + today = 365 days max)
  // Start from 52 weeks ago, aligned to Sunday
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the most recent Sunday on or before today (start of the last week column)
  const dayOfWeek = today.getDay() // 0=Sun
  const endSunday = new Date(today)
  endSunday.setDate(today.getDate() - dayOfWeek + 6) // end on Saturday of this week

  // Start 52 weeks back from the first Sunday we display
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - dayOfWeek - 51 * 7) // 52 weeks back, starting on Sunday

  // Build weeks array: each week is an array of 7 day cells
  const weeks: Array<Array<{ dateStr: string | null; minutes: number }>> = []

  const cur = new Date(startDate)
  for (let w = 0; w < 52; w++) {
    const week: Array<{ dateStr: string | null; minutes: number }> = []
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(cur)
      if (cellDate > today) {
        week.push({ dateStr: null, minutes: 0 })
      } else {
        const dateStr = cellDate.toISOString().slice(0, 10)
        week.push({ dateStr, minutes: minutesByDate.get(dateStr) ?? 0 })
      }
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  // Derive month labels: for each week, check if first day of month falls in this week
  const monthLabels: Array<{ weekIdx: number; label: string }> = []
  weeks.forEach((week, wi) => {
    week.forEach(cell => {
      if (cell.dateStr) {
        const d = new Date(cell.dateStr + 'T00:00:00')
        if (d.getDate() === 1) {
          monthLabels.push({ weekIdx: wi, label: MONTHS[d.getMonth()] })
        }
      }
    })
  })

  const cellSize = 11
  const gap = 2

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-4">Activity</p>

      <div className="overflow-x-auto">
        <div className="relative inline-block">
          {/* Month labels row */}
          <div className="flex mb-1 ml-8">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.weekIdx === wi)
              return (
                <div
                  key={wi}
                  style={{ width: cellSize + gap, minWidth: cellSize + gap }}
                  className="text-[9px] font-sans text-on-surface-variant leading-none"
                >
                  {label ? label.label : ''}
                </div>
              )
            })}
          </div>

          {/* Grid: day-of-week labels + columns */}
          <div className="flex gap-0">
            {/* Day-of-week labels */}
            <div className="flex flex-col mr-1" style={{ gap: gap }}>
              {DAYS.map((day, i) => (
                <div
                  key={i}
                  style={{ height: cellSize, width: 24 }}
                  className="text-[9px] font-sans text-on-surface-variant flex items-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: gap, marginRight: gap }}>
                {week.map((cell, di) => (
                  <div
                    key={di}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cell.dateStr ? getIntensityColor(cell.minutes) : 'transparent',
                    }}
                    className={cn('transition-opacity', cell.dateStr ? 'cursor-pointer hover:opacity-80' : '')}
                    onMouseEnter={cell.dateStr ? (e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      const label = cell.minutes > 0
                        ? `${formatDate(cell.dateStr!)} — ${cell.minutes}m`
                        : `${formatDate(cell.dateStr!)} — no practice`
                      setTooltip({ text: label, x: rect.left + window.scrollX, y: rect.top + window.scrollY - 28 })
                    } : undefined}
                    onMouseLeave={cell.dateStr ? () => setTooltip(null) : undefined}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-surface-container-high border border-surface-container-highest font-sans text-xs text-on-surface pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[9px] font-sans text-on-surface-variant">Less</span>
        {['#353434', '#7a3200', '#b54d00', '#E05C00'].map(c => (
          <div key={c} style={{ width: cellSize, height: cellSize, backgroundColor: c }} />
        ))}
        <span className="text-[9px] font-sans text-on-surface-variant">More</span>
      </div>
    </div>
  )
}
