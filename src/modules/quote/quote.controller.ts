import { Request, Response, NextFunction } from 'express';
import * as quoteService from './quote.service';
import {
  sendResponse,
  sendPaginatedResponse,
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
    const { filters, sort } = buildCommonQuery(req, ['text', 'author', 'tags']);

    const result = await quoteService.getAllQuotes(
      { page, limit },
      filters,
      sort
    );

    sendPaginatedResponse({
      res,
      message: 'Quotes fetched successfully',
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
    const data = await quoteService.getQuoteById(req.params.id);
    if (!data) throw new AppError('Quote not found', 404);

    sendResponse({ res, message: 'Quote found', data });
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
    const data = await quoteService.createQuote(req.body);

    sendResponse({
      res,
      message: 'Quote created successfully',
      data,
      statusCode: 201,
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
    const data = await quoteService.updateQuote(req.params.id, req.body);
    if (!data) throw new AppError('Quote not found', 404);

    sendResponse({ res, message: 'Quote updated', data });
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
    await quoteService.deleteQuote(req.params.id);
    sendResponse({ res, message: 'Quote deleted successfully' });
  } catch (err) {
    next(err);
  }
};
