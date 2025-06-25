import { Request, Response, NextFunction } from 'express';
import * as templateService from './blog.service';
import { sendResponse } from '@common';

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getAllBlogs();
    sendResponse({ res, message: 'Blogs fetched successfully', data })
  } catch (err) {
    next(err)
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getBlogById(req.params.id)
    if (!data) return next(new Error('Blog not found'))
    sendResponse({ res, message: 'Blog found', data })
  } catch (err) {
    next(err)
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.createBlog(req.body)
    sendResponse({ res, message: 'Blog created successfully', data, statusCode: 201 })
  } catch (err) {
    next(err)
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.updateBlog(req.params.id, req.body)
    if (!data) return next(new Error('Blog not found to update'))
    sendResponse({ res, message: 'Blog updated', data })
  } catch (err) {
    next(err)
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await templateService.deleteBlog(req.params.id)
    sendResponse({ res, message: 'Blog deleted successfully' })
  } catch (err) {
    next(err)
  }
};


