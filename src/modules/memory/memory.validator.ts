import { z } from 'zod';

export const createMemorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateMemorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
