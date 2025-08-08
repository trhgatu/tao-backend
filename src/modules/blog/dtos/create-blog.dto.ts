import { z } from 'zod';
import { localeTextSchema } from './locale-text.dto';

const i18nLocaleKeys = z
  .object({
    vi: localeTextSchema,
    en: localeTextSchema.optional(),
  })
  .strict();

const statusEnum = z.enum(['draft', 'published', 'archived']);

export const createBlogSchema = z
  .object({
    i18nTitle: i18nLocaleKeys,
    i18nContent: i18nLocaleKeys,

    // meta
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    status: statusEnum.optional().default('draft'),
    publishedAt: z.coerce.date().optional(),
  })
  .strict()
  .refine((d) => d.status !== 'published' || !!d.publishedAt, {
    message: 'publishedAt is required when status is published',
    path: ['publishedAt'],
  });

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
