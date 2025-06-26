import { Request, Response, NextFunction } from 'express';
import * as journalService from './journal.service';
import {
  sendPaginatedResponse,
  sendResponse,
  buildCommonQuery,
  AppError,
} from '@common';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { filters, sort } = buildCommonQuery(req, ['title']);
    const result = await journalService.getAllJournals(
      { page, limit },
      filters,
      sort
    );
    sendPaginatedResponse({
      res,
      message: 'All journals fetched',
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
    const journal = await journalService.getJournalById(req.params.id);
    if (!journal) throw new AppError('Journal not found', 404);
    sendResponse({ res, message: 'Journal found', data: journal });
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
    const journal = await journalService.createJournal(req.body);
    sendResponse({
      res,
      message: 'Journal created',
      statusCode: 201,
      data: journal,
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
    const journal = await journalService.updateJournal(req.params.id, req.body);
    if (!journal) throw new AppError('Journal not found', 404);
    sendResponse({ res, message: 'Journal updated', data: journal });
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
    await journalService.deleteJournal(req.params.id);
    sendResponse({ res, message: 'Journal deleted successfully' });
  } catch (err) {
    next(err);
  }
};
