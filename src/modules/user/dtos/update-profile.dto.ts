import { z } from 'zod'

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  username: z.string().min(3).optional(),
  avatarUrl: z.string().url().optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthDate: z.string().datetime().optional(),
  phone: z.string().optional(),
})

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>
