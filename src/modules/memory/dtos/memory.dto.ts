import { z } from 'zod';

export const createMemorySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['private', 'public', 'archived']).optional(),
});

export const updateMemorySchema = createMemorySchema.partial();

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
