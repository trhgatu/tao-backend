import { z } from 'zod';
import { MemoryMoodEnum, ContentStatusEnum } from '@shared/enums';

export const createMemorySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
  mood: z.nativeEnum(MemoryMoodEnum),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(ContentStatusEnum).optional(),
});

export const updateMemorySchema = createMemorySchema.partial();

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
