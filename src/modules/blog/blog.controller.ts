// src/modules/blog/blog.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getBlogQueryDto, BlogListItemDto } from './dtos';
import type { IBlog } from '@modules/blog/blog.model';
import * as blogService from './blog.service';
import {
  sendPaginatedResponse,
  sendResponse,
  buildCommonQuery,
  AppError,
  pickLocaleEntry,
} from '@core';
import type { LocaleText } from '@shared/i18n';

export const listPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { lang } = getBlogQueryDto.parse(req.query);

    const { filters, sort } = buildCommonQuery(req, [
      'slug',
      'tags',
      'publishedAt',
    ]);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
      status: 'published',
    };

    const result = await blogService.getAllBlogs(
      { page, limit },
      effectiveFilters,
      sort
    );

    const data: BlogListItemDto[] = result.data.map((doc: IBlog) => {
      const t = pickLocaleEntry<LocaleText>(doc.i18nTitle, lang);
      const c = pickLocaleEntry<LocaleText>(doc.i18nContent, lang);
      return {
        _id: String(doc._id),
        slug: doc.slug,
        title: t?.text ?? '',
        content: c?.text ?? '',
        tags: doc.tags ?? [],
        coverImage: doc.coverImage,
        publishedAt: doc.publishedAt,
        status: doc.status,
      };
    });

    sendPaginatedResponse<BlogListItemDto>({
      res,
      message: 'All blogs fetched',
      data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const listAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { filters, sort } = buildCommonQuery(req, [
      'slug',
      'status',
      'tags',
      'publishedAt',
    ]);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
    };

    const result = await blogService.getAllBlogs(
      { page, limit },
      effectiveFilters,
      sort
    );

    sendPaginatedResponse<IBlog>({
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

export const getBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const { lang } = getBlogQueryDto.parse(req.query);
    const blog = await blogService.getBlogById(req.params.id, lang);
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
