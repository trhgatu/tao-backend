// src/modules/quote/quote.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as quoteService from './quote.service';
import {
  sendResponse,
  sendPaginatedResponse,
  buildCommonQuery,
  AppError,
  pickLocaleEntry,
} from '@core';
import type { LocaleText } from '@shared/i18n';
import { getQuoteQueryDto, QuoteListItemDto } from './dtos';
import { IQuote } from '@modules/quote/quote.model';

export const listPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { lang } = getQuoteQueryDto.parse(req.query);

    const { filters, sort } = buildCommonQuery(req, [
      'tags',
      'publishedAt',
      'createdAt',
    ]);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
      status: 'published',
    };
    const result = await quoteService.getAllQuotes(
      { page, limit },
      effectiveFilters,
      sort
    );
    const data: QuoteListItemDto[] = result.data.map((doc: IQuote) => {
      const text = pickLocaleEntry<LocaleText>(doc.i18nText, lang);
      const author = pickLocaleEntry<LocaleText>(doc.i18nAuthor, lang);
      return {
        _id: String(doc._id),
        text: text?.text ?? '',
        author: author?.text ?? '',
        tags: doc.tags ?? [],
        publishedAt: doc.publishedAt,
        status: doc.status,
      };
    });

    sendPaginatedResponse<QuoteListItemDto>({
      res,
      message: 'Quotes fetched successfully',
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
      'status',
      'tags',
      'publishedAt',
      'createdAt',
    ]);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
    };
    const result = await quoteService.getAllQuotes(
      { page, limit },
      effectiveFilters,
      sort
    );
    sendPaginatedResponse({
      res,
      message: 'Quotes fetched successfully',
      data: result.data, // raw maps
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const getByIdPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lang } = getQuoteQueryDto.parse(req.query);
    const data = await quoteService.getQuoteByIdLocalized(
      req.params.id,
      lang,
      false
    );
    if (!data) throw new AppError('Quote not found', 404);
    sendResponse({ res, message: 'Quote found', data });
  } catch (err) {
    next(err);
  }
};

export const getByIdAdmin = async (
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

export const getRandom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lang } = getQuoteQueryDto.parse(req.query);
    const data = await quoteService.getRandomQuoteLocalized(lang);
    if (!data) throw new AppError('No quote available', 404);
    sendResponse({ res, message: 'Random quote', data });
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
    await quoteService.hardDeleteQuote(req.params.id);
    sendResponse({ res, message: 'Quote deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const softDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await quoteService.softDeleteQuote(req.params.id);
    sendResponse({ res, message: 'Quote deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const restore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await quoteService.restoreQuote(req.params.id);
    sendResponse({ res, message: 'Quote restored successfully' });
  } catch (err) {
    next(err);
  }
};
