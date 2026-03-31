import { z } from 'zod'

export const EMOJI_OPTIONS = ['💻', '🎹', '🎨', '🏋️', '⚔️', '📚', '🎸', '🧠', '✍️', '🎯', '🌍', '🔬']

export const TARGET_HOURS = [
  { label: '1,000 hours', sublabel: 'Proficient', value: 1000 },
  { label: '5,000 hours', sublabel: 'Expert', value: 5000 },
  { label: '10,000 hours', sublabel: 'Mastery', value: 10000 },
]

export const COLORS = [
  '#E05C00', '#e9c349', '#3b82f6', '#10b981',
  '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4',
]

export const skillNameSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50, 'Keep it under 50 characters'),
})

export type SkillNameValues = z.infer<typeof skillNameSchema>

export const initialHoursSchema = z.object({
  initial_hours: z.number()
    .min(0, 'Initial hours cannot be negative')
    .max(10000, 'Maximum 10,000 initial hours'),
})

export type InitialHoursValues = z.infer<typeof initialHoursSchema>

export const createSkillSchema = skillNameSchema.merge(initialHoursSchema)
export type CreateSkillValues = z.infer<typeof createSkillSchema>
