// src/modules/project/dtos/create-project.dto.ts
import { z } from 'zod';
import {
  ContentStatusEnum,
  ProjectStatusEnum,
  ProjectTypeEnum,
} from '@shared/enums';
import { localeTextSchema } from '@shared/dtos/locale-text.dto';

const i18nLocaleKeys = z
  .object({
    vi: localeTextSchema,
    en: localeTextSchema.optional(),
  })
  .strict();

export const createProjectSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    i18nName: i18nLocaleKeys,
    i18nDescription: i18nLocaleKeys.optional(),
    image: z.string().url().optional(),
    tech: z.array(
      z.object({
        name: z.string(),
        icon: z.string(),
      })
    ),
    category: z.string().optional(),
    projectStatus: z
      .nativeEnum(ProjectStatusEnum)
      .optional()
      .default(ProjectStatusEnum.IN_PROGRESS),
    type: z
      .nativeEnum(ProjectTypeEnum)
      .optional()
      .default(ProjectTypeEnum.PROJECT),
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

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
