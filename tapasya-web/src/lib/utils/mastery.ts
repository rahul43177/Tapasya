export function getMasteryLevel(hours: number): string {
  if (hours >= 10000) return 'Master'
  if (hours >= 5000) return 'Expert'
  if (hours >= 3000) return 'Advanced'
  if (hours >= 1000) return 'Proficient'
  if (hours >= 500) return 'Competent'
  if (hours >= 200) return 'Novice'
  if (hours >= 20) return 'Beginner'
  return 'Aspirant'
}
