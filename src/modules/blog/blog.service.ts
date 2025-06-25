import { Blog } from './blog.model';
import { CreateBlogInput, UpdateBlogInput } from './dtos/blog.dto';

export const getAllBlogs = () => Blog.find().sort({ createdAt: -1 });

export const getBlogById = (id: string) => Blog.findById(id);

export const createBlog = (data: CreateBlogInput) => Blog.create(data);

export const updateBlog = (id: string, data: UpdateBlogInput) =>
  Blog.findByIdAndUpdate(id, data, { new: true });

export const deleteBlog = (id: string) => Blog.findByIdAndDelete(id);
