import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateRoleSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
