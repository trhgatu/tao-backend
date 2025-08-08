import { z } from 'zod';
import { Types } from 'mongoose';

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const localeTextSchema = z
  .object({
    text: z.string().min(1, 'Text is required'),
    auto: z.boolean().optional(),
    updatedAt: z.coerce.date().optional(),
    updatedBy: z
      .string()
      .regex(objectIdRegex, 'Invalid ObjectId')
      .transform((s) => new Types.ObjectId(s))
      .optional(),
  })
  .strict();

export type LocaleTextDto = z.infer<typeof localeTextSchema>;
