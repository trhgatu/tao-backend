// src/modules/memory/dtos/get-memory.dto.ts
import { z } from 'zod';
export const getMemoryQueryDto = z
  .object({
    lang: z.enum(['vi', 'en']).default('vi'),
    featured: z.coerce.boolean().optional(),
  })
  .strict();
export type GetMemoryQuery = z.infer<typeof getMemoryQueryDto>;
