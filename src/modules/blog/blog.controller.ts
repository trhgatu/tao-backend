import { Request, Response, NextFunction } from 'express';
import * as blogService from './blog.service';
import { sendPaginatedResponse, sendResponse, buildCommonQuery, AppError } from '@common';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { filters, sort } = buildCommonQuery(req, ['name'])
    const result = await blogService.getAllBlogs({ page, limit }, filters, sort)
    sendPaginatedResponse({
      res,
      message: 'All blogs fetched',
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    })
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await blogService.getBlogById(req.params.id)
    if (!role) throw new AppError('Role not found', 404)
    sendResponse({ res, message: 'Role found', data: role })
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await blogService.createBlog(req.body)
    sendResponse({ res, message: 'Role created', statusCode: 201, data: role })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await blogService.updateBlog(req.params.id, req.body)
    if (!role) throw new AppError('Role not found', 404)
    sendResponse({ res, message: 'Role updated', data: role })
  } catch (err) {
    next(err)
  }
}


export const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await blogService.deleteBlog(req.params.id);
    sendResponse({ res, message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};
