import { paginate } from '@common'
import { CreateBlogInput, UpdateBlogInput } from './dtos'
import type { PaginationParams, PaginationResult } from '@common'
import { getCache, setCache, deleteKeysByPattern } from '@shared/services'
import Blog, { IBlog } from '@modules/blog/blog.model'

export const getAllBlogs = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IBlog>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters
  }

  const cacheKey = `blogs:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`
  const cached = await getCache<PaginationResult<IBlog>>(cacheKey)
  if (cached) return cached

  const result = await paginate(
    Blog,
    { page, limit },
    finalFilters,
    sort,
    //populate options can be added here if needed
  )

  await setCache(cacheKey, result)
  return result
}

export const getBlogById = (id: string) => {
  return Blog.findById(id)
}

export const createBlog = async (payload: CreateBlogInput) => {
  const blog = await Blog.create(payload)
  // Clear cache for blogs after creation
  await deleteKeysByPattern('blogs:*')
  return blog;
}

export const updateBlog = async (id: string, payload: UpdateBlogInput) => {
  const blog = Blog.findByIdAndUpdate(id, payload, { new: true })
  // Clear cache for blogs after update
  await deleteKeysByPattern('blogs:*')
  return blog
}

export const deleteBlog = async (id: string) => {
  const blog = Blog.findByIdAndDelete(id)
  await deleteKeysByPattern('blogs:*')
  return blog
}
