// src/modules/quote/dtos/get-quote.dto.ts
import { z } from 'zod';
export const getQuoteQueryDto = z
  .object({
    lang: z.enum(['vi', 'en']).default('vi'),
  })
  .strict();
export type GetQuoteQuery = z.infer<typeof getQuoteQueryDto>;
