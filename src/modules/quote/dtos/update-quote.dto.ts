// src/modules/quote/dtos/update-quote.dto.ts
import { z } from 'zod';
import { localeTextSchema } from '@shared/dtos/locale-text.dto';
import { ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeysPartial = z
  .object({
    vi: localeTextSchema.partial().optional(),
    en: localeTextSchema.partial().optional(),
  })
  .strict();

export const updateQuoteSchema = z
  .object({
    i18nText: i18nLocaleKeysPartial.optional(),
    i18nAuthor: i18nLocaleKeysPartial.optional(),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(ContentStatusEnum).optional(),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== ContentStatusEnum.PUBLISHED || !!d.publishedAt, {
    message: 'publishedAt is required when status is PUBLISHED',
    path: ['publishedAt'],
  });

export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
