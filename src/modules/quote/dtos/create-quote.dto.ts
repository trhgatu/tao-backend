// src/modules/quote/dtos/create-quote.dto.ts
import { z } from 'zod';
import { localeTextSchema } from '@shared/dtos/locale-text.dto';
import { ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeys = z
  .object({
    vi: localeTextSchema,
    en: localeTextSchema.optional(),
  })
  .strict();

export const createQuoteSchema = z
  .object({
    i18nText: i18nLocaleKeys,
    i18nAuthor: i18nLocaleKeys.optional(),
    tags: z.array(z.string()).optional(),
    status: z
      .nativeEnum(ContentStatusEnum)
      .optional()
      .default(ContentStatusEnum.DRAFT),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== ContentStatusEnum.PUBLISHED || !!d.publishedAt, {
    message: 'publishedAt is required when status is PUBLISHED',
    path: ['publishedAt'],
  });

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
