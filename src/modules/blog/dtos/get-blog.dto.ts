import { z } from 'zod';
export const getBlogQueryDto = z.object({
  lang: z.enum(['vi', 'en']).optional().default('vi'),
});
export type GetBlogQuery = z.infer<typeof getBlogQueryDto>;
