import { Request, Response, NextFunction } from 'express';
import * as memoryService from './memory.service';
import { getMemoryQueryDto, MemoryListItemDto } from './dtos';
import {
  sendPaginatedResponse,
  sendResponse,
  buildCommonQuery,
  AppError,
  pickLocaleEntry,
} from '@core';
import { IMemory } from '@modules/memory/memory.model';
import { LocaleText } from '@shared/i18n';

export const listPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { lang } = getMemoryQueryDto.parse(req.query);

    const { filters, sort } = buildCommonQuery(req, ['mood', 'featured']);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
      status: 'published',
    };

    const result = await memoryService.getAllMemories(
      { page, limit },
      effectiveFilters,
      sort
    );
    const data: MemoryListItemDto[] = result.data.map((doc: IMemory) => {
      const title = pickLocaleEntry<LocaleText>(doc.i18nTitle, lang);
      const description = pickLocaleEntry<LocaleText>(
        doc.i18nDescription,
        lang
      );
      return {
        _id: String(doc._id),
        slug: doc.slug,
        title: title?.text ?? '',
        description: description?.text ?? '',
        tags: doc.tags ?? [],
        imageUrl: doc.imageUrl,
        location: doc.location,
        featured: doc.featured,
        date: doc.date,
        status: doc.status,
        mood: doc.mood,
      };
    });

    sendPaginatedResponse<MemoryListItemDto>({
      res,
      message: 'Memories fetched successfully',
      data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

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
      'date',
      'mood',
      'location',
    ]);
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

export const getBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lang } = getMemoryQueryDto.parse(req.query);
    const memory = await memoryService.getMemoryBySlugLocalized(
      req.params.slug,
      lang
    );
    if (!memory) throw new AppError('Memory not found', 404);
    sendResponse({ res, message: 'Memory found', data: memory });
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

export const softDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memory = await memoryService.softDeleteMemory(req.params.id);
    sendResponse({ res, message: 'Memory deleted successfully', data: memory });
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
    await memoryService.hardDeleteMemory(req.params.id);
    sendResponse({ res, message: 'Memory deleted successfully' });
  } catch (err) {
    next(err);
  }
};
