import { z } from 'zod';
import { ContentStatusEnum } from '@shared/enums';

export const createQuoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required'),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  status: z.nativeEnum(ContentStatusEnum).optional(),
});

export const updateQuoteSchema = createQuoteSchema.partial();

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
