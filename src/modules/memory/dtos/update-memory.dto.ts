// src/modules/memory/dtos/update-memory.dto.ts
import { z } from 'zod';
import { localeTextSchema } from '@shared/dtos';
import { MemoryMoodEnum, ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeysPartial = z
  .object({
    vi: localeTextSchema.partial().optional(),
    en: localeTextSchema.partial().optional(),
  })
  .strict();

export const updateMemorySchema = z
  .object({
    i18nTitle: i18nLocaleKeysPartial.optional(),
    i18nDescription: i18nLocaleKeysPartial.optional(),
    imageUrl: z.string().url().optional(),
    location: z.string().optional(),
    mood: z.nativeEnum(MemoryMoodEnum).optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(ContentStatusEnum).optional(),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== ContentStatusEnum.PUBLISHED || !!d.publishedAt, {
    message: 'publishedAt is required when status is PUBLISHED',
    path: ['publishedAt'],
  });
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
