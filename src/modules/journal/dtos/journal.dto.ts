import { z } from 'zod';

export const createJournalSchema = z.object({
  rawContent: z.string().min(1),
  date: z.coerce.date().optional(),
  status: z.enum(['private', 'public', 'archived']).optional(),
});
export const updateJournalSchema = createJournalSchema.partial();

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
