import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1),
  rawContent: z.string().min(1),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishedAt: z.coerce.date().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
