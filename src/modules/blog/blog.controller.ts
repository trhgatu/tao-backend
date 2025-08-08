import { Request, Response, NextFunction } from 'express';
import { getBlogQueryDto } from './dtos/get-blog.dto';
import * as blogService from './blog.service';
import {
  sendPaginatedResponse,
  sendResponse,
  buildCommonQuery,
  AppError,
} from '@core';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { filters, sort } = buildCommonQuery(req, [
      'slug',
      'status',
      'tags',
      'publishedAt',
    ]);
    const result = await blogService.getAllBlogs(
      { page, limit },
      filters,
      sort
    );
    sendPaginatedResponse({
      res,
      message: 'All blogs fetched',
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const { lang } = getBlogQueryDto.parse(req.query);
    const blog = await blogService.getBlogBySlugLocalized(
      req.params.slug,
      lang
    );
    if (!blog) throw new AppError('Blog not found', 404);
    sendResponse({ res, message: 'Blog found', data: blog });
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) throw new AppError('Blog not found', 404);
    sendResponse({ res, message: 'Blog found', data: blog });
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogService.createBlog(req.body);
    sendResponse({ res, message: 'Blog created', statusCode: 201, data: blog });
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) throw new AppError('Blog not found', 404);
    sendResponse({ res, message: 'Blog updated', data: blog });
  } catch (err) {
    next(err);
  }
};

export const hardDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await blogService.deleteBlog(req.params.id);
    sendResponse({ res, message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};
