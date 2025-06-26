import { z } from 'zod';

export const createJournalSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateJournalSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
