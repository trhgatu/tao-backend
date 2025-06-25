import { z } from 'zod'

/* ----------------------- 🧪 Zod Schemas ----------------------- */
export const CreatePermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
})

export const UpdatePermissionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

/* ----------------------- 📦 Types (DTOs) ----------------------- */
export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>
