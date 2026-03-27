interface SessionEntry {
  start_time: string
  duration: number
}

/** Step back one calendar day (UTC-safe, no DST issues) */
function prevDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/** Step forward one calendar day (UTC-safe, no DST issues) */
function nextDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

/** Returns an array of 'YYYY-MM-DD' strings where total practice was >= 30 min */
export function getQualifyingDates(sessions: SessionEntry[]): string[] {
  const map = new Map<string, number>()
  for (const s of sessions) {
    const dateStr = new Date(s.start_time).toISOString().slice(0, 10)
    map.set(dateStr, (map.get(dateStr) ?? 0) + (s.duration ?? 0))
  }
  const qualifying: string[] = []
  for (const [date, minutes] of map.entries()) {
    if (minutes >= 30) qualifying.push(date)
  }
  return qualifying
}

/** Calculates current and longest streak from qualifying practice day strings (YYYY-MM-DD, UTC) */
export function calculateStreak(qualifyingDates: string[]): { current: number; longest: number } {
  if (qualifyingDates.length === 0) return { current: 0, longest: 0 }

  const dateSet = new Set(qualifyingDates)
  const todayStr = new Date().toISOString().slice(0, 10)
  const yesterdayStr = prevDay(todayStr)

  // Current streak: count back from today (or yesterday if today not yet practiced)
  let current = 0
  const startStr = dateSet.has(todayStr) ? todayStr : dateSet.has(yesterdayStr) ? yesterdayStr : null

  if (startStr) {
    current = 1
    let check = prevDay(startStr)
    while (dateSet.has(check)) {
      current++
      check = prevDay(check)
    }
  }

  // Longest streak: iterate sorted dates, check consecutive using string comparison
  const sorted = [...dateSet].sort()
  let longest = 0
  let run = 0
  let prev: string | null = null

  for (const ds of sorted) {
    if (prev !== null && ds === nextDay(prev)) {
      run++
    } else {
      run = 1
    }
    if (run > longest) longest = run
    prev = ds
  }

  return { current, longest: Math.max(longest, current) }
}
