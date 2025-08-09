import { z } from 'zod';
import { localeTextSchema } from '@shared/dtos';
import { ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeys = z
  .object({
    vi: localeTextSchema,
    en: localeTextSchema.optional(),
  })
  .strict();

export const createBlogSchema = z
  .object({
    i18nTitle: i18nLocaleKeys,
    i18nContent: i18nLocaleKeys,

    // meta
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    status: z
      .nativeEnum(ContentStatusEnum)
      .optional()
      .default(ContentStatusEnum.DRAFT),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== 'published' || !!d.publishedAt, {
    message: 'publishedAt is required when status is published',
    path: ['publishedAt'],
  });

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
