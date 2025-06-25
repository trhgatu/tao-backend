import { z } from 'zod';

export const createLogSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateLogSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
