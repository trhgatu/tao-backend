import { paginate } from '@core';
import type { PaginationParams, PaginationResult } from '@core';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Blog, { IBlog } from '@modules/blog/blog.model';
import type { CreateBlogInput, UpdateBlogInput } from './dtos';
import { toLocaleMap, mergeLocaleMap } from '@core';
import type { LocaleCode } from '@core';

export const getAllBlogs = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IBlog>> => {
  const finalFilters = { isDeleted: false, ...filters };

  const cacheKey =
    `blogs:list:page=${page}:limit=${limit}` +
    `:filters=${JSON.stringify(finalFilters)}` +
    `:sort=${JSON.stringify(sort)}`;

  const cached = await getCache<PaginationResult<IBlog>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(
    Blog,
    { page, limit },
    finalFilters,
    sort,
    undefined,
    { i18nTitle: 1, slug: 1, tags: 1, coverImage: 1, publishedAt: 1, status: 1 }
  );

  await setCache(cacheKey, result, 60); // TTL 60s
  return result;
};

export const getBlogById = (id: string) => {
  return Blog.findById(id).where({ isDeleted: false });
};

export const getBlogBySlugLocalized = async (
  slug: string,
  lang: LocaleCode
) => {
  const cacheKey = `blogs:slug:${slug}:lang:${lang}`;
  const cached = await getCache<unknown>(cacheKey);
  if (cached) return cached;

  const doc = await Blog.findOne({ slug, isDeleted: false });
  if (!doc) return null;

  const { title, content } = doc.getLocalized(lang);
  const payload = {
    slug: doc.slug,
    title,
    content,
    tags: doc.tags,
    coverImage: doc.coverImage,
    publishedAt: doc.publishedAt,
    status: doc.status,
    _id: doc._id,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

export const createBlog = async (payload: CreateBlogInput) => {
  const blog = await Blog.create({
    i18nTitle: toLocaleMap(payload.i18nTitle),
    i18nContent: toLocaleMap(payload.i18nContent),
    tags: payload.tags ?? [],
    coverImage: payload.coverImage,
    status: payload.status ?? 'draft',
    publishedAt: payload.publishedAt,
  });

  await deleteKeysByPattern('blogs:list:*');
  return blog;
};

export const updateBlog = async (id: string, payload: UpdateBlogInput) => {
  const doc = await Blog.findById(id).where({ isDeleted: false });
  if (!doc) return null;

  mergeLocaleMap(doc.i18nTitle, payload.i18nTitle);
  mergeLocaleMap(doc.i18nContent, payload.i18nContent);
  if (payload.tags !== undefined) doc.tags = payload.tags;
  if (payload.coverImage !== undefined) doc.coverImage = payload.coverImage;
  if (payload.status !== undefined) doc.status = payload.status;
  if (payload.publishedAt !== undefined) doc.publishedAt = payload.publishedAt;

  await doc.save();

  await deleteKeysByPattern('blogs:list:*');
  await deleteKeysByPattern(`blogs:slug:${doc.slug}:*`);

  return doc;
};

export const deleteBlog = async (id: string) => {
  const doc = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (doc) {
    await deleteKeysByPattern('blogs:list:*');
    await deleteKeysByPattern(`blogs:slug:${doc.slug}:*`);
  }
  return doc;
};
