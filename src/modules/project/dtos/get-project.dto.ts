import { z } from 'zod';

export const getProjectQueryDto = z
  .object({
    lang: z.enum(['vi', 'en']).default('vi'),
    featured: z.coerce.boolean().optional(),
    category: z.string().optional(),
    status: z.enum(['In Progress', 'Completed']).optional(),
    year: z.coerce.number().int().optional(),
  })
  .strict();

export type GetProjectQuery = z.infer<typeof getProjectQueryDto>;
