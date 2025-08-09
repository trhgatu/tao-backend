// src/modules/memory/dtos/create-memory.dto.ts
import { z } from 'zod';
import { localeTextSchema } from '@shared/dtos';
import { MemoryMoodEnum, ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeys = z
  .object({
    vi: localeTextSchema,
    en: localeTextSchema.optional(),
  })
  .strict();

export const createMemorySchema = z
  .object({
    i18nTitle: i18nLocaleKeys,
    i18nDescription: i18nLocaleKeys,
    imageUrl: z.string().url().optional(),
    location: z.string().optional(),
    mood: z.nativeEnum(MemoryMoodEnum),
    date: z.coerce.date().optional(),
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
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
