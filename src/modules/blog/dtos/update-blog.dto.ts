import { z } from 'zod';
import { localeTextSchema } from './locale-text.dto';
import { ContentStatusEnum } from '@shared/enums';

const i18nLocaleKeysPartial = z
  .object({
    vi: localeTextSchema.partial().optional(),
    en: localeTextSchema.partial().optional(),
  })
  .strict();

const statusEnum = z.nativeEnum(ContentStatusEnum);

export const updateBlogSchema = z
  .object({
    i18nTitle: i18nLocaleKeysPartial.optional(),
    i18nContent: i18nLocaleKeysPartial.optional(),

    // meta
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    status: statusEnum.optional(),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== ContentStatusEnum.PUBLISHED || !!d.publishedAt, {
    message: 'publishedAt is required when status is PUBLISHED',
    path: ['publishedAt'],
  });

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
