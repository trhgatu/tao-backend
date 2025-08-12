// src/modules/project/dtos/create-project.dto.ts
import { z } from 'zod';
import { ContentStatusEnum, ProjectStatusEnum } from '@shared/enums';
import { localeTextSchema } from '@shared/dtos/locale-text.dto';

const i18nLocaleKeysPartial = z
  .object({
    vi: localeTextSchema.partial().optional(),
    en: localeTextSchema.partial().optional(),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    i18nName: i18nLocaleKeysPartial.optional(),
    i18nDescription: i18nLocaleKeysPartial.optional(),
    image: z.string().url().optional(),
    tech: z.array(z.string()).optional(),
    category: z.string().optional(),
    projectStatus: z
      .nativeEnum(ProjectStatusEnum)
      .optional()
      .default(ProjectStatusEnum.IN_PROGRESS),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    year: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
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

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
