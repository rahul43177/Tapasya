import { z } from 'zod'

/**
 * Schema for creating a new squad
 */
export const createSquadSchema = z.object({
  name: z
    .string()
    .min(3, 'Squad name must be at least 3 characters')
    .max(50, 'Squad name must be 50 characters or less')
    .trim(),

  description: z
    .string()
    .max(200, 'Description must be 200 characters or less')
    .trim()
    .optional(),

  focus_skill_name: z
    .string()
    .max(50, 'Skill name must be 50 characters or less')
    .trim()
    .optional(),

  max_members: z
    .number()
    .int()
    .min(2, 'Squad must allow at least 2 members')
    .max(50, 'Squad cannot exceed 50 members')
    .optional(),

  is_public: z.boolean().optional(),
})

export type CreateSquadValues = z.infer<typeof createSquadSchema>

/**
 * Schema for joining a squad via invite code
 */
export const joinSquadSchema = z.object({
  invite_code: z
    .string()
    .length(8, 'Invite code must be exactly 8 characters')
    .regex(/^[A-Z0-9]+$/, 'Invite code must be uppercase letters and numbers only')
    .transform((val) => val.toUpperCase()),
})

export type JoinSquadValues = z.infer<typeof joinSquadSchema>
