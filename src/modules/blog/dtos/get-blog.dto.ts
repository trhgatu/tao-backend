import { z } from 'zod';
export const getBlogQueryDto = z
  .object({
    lang: z.enum(['vi', 'en']).default('vi'),
  })
  .strict();
export type GetBlogQuery = z.infer<typeof getBlogQueryDto>;
