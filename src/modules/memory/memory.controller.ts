import { Request, Response, NextFunction } from 'express';
import * as memoryService from './memory.service';
import {
  sendPaginatedResponse,
  sendResponse,
  buildCommonQuery,
  AppError,
} from '@common';
import logger from '@common/logger';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { filters, sort } = buildCommonQuery(req, ['title']);
    const result = await memoryService.getAllMemories(
      { page, limit },
      filters,
      sort
    );

    sendPaginatedResponse({
      res,
      message: 'All memories fetched',
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
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
    const memory = await memoryService.getMemoryById(req.params.id);
    if (!memory) throw new AppError('Memory not found', 404);
    sendResponse({ res, message: 'Memory found', data: memory });
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
    const memory = await memoryService.createMemory(req.body);
    logger.info(req.body);
    sendResponse({
      res,
      message: 'Memory created',
      statusCode: 201,
      data: memory,
    });
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
    const memory = await memoryService.updateMemory(req.params.id, req.body);
    if (!memory) throw new AppError('Memory not found', 404);
    sendResponse({ res, message: 'Memory updated', data: memory });
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
    await memoryService.deleteMemory(req.params.id);
    sendResponse({ res, message: 'Memory deleted successfully' });
  } catch (err) {
    next(err);
  }
};
