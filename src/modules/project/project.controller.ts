import { Request, Response, NextFunction } from 'express';
import * as projectService from './project.service';
import {
  sendResponse,
  sendPaginatedResponse,
  buildCommonQuery,
  AppError,
  pickLocaleEntry,
} from '@core';
import type { LocaleText } from '@shared/i18n';
import { getProjectQueryDto, ProjectListItemDto } from './dtos';
import { IProject } from './project.model';

export const listPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { lang } = getProjectQueryDto.parse(req.query);

    const { filters, sort } = buildCommonQuery(req, ['year', 'createdAt']);
    const effectiveFilters: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
      status: 'published',
    };

    const result = await projectService.getAllProjects(
      { page, limit },
      effectiveFilters,
      sort
    );
    const data: ProjectListItemDto[] = result.data.map((doc: IProject) => {
      const name = pickLocaleEntry<LocaleText>(doc.i18nName, lang);
      const description = pickLocaleEntry<LocaleText>(
        doc.i18nDescription,
        lang
      );
      return {
        _id: String(doc._id),
        slug: doc.slug,
        name: name?.text ?? '',
        description: description?.text ?? '',
        image: doc.image,
        tech: doc.tech ?? [],
        category: doc.category,
        projectStatus: doc.projectStatus,
        link: doc.link,
        repo: doc.repo,
        featured: doc.featured,
        year: doc.year,
        status: doc.status,
        publishedAt: doc.publishedAt,
      };
    });

    sendPaginatedResponse<ProjectListItemDto>({
      res,
      message: 'Projects fetched successfully',
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
      'category',
      'projectStatus',
      'year',
      'createdAt',
    ]);

    const result = await projectService.getAllProjects(
      { page, limit },
      { ...filters, isDeleted: false },
      sort
    );

    sendPaginatedResponse({
      res,
      message: 'Projects fetched successfully',
      data: result.data, // raw i18n maps
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
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
    const project = await projectService.getProjectById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);
    sendResponse({ res, message: 'Project found', data: project });
  } catch (err) {
    next(err);
  }
};

export const getBySlugPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lang } = getProjectQueryDto.parse(req.query);
    const project = await projectService.getProjectBySlugLocalized(
      req.params.slug,
      lang
    );
    if (!project) throw new AppError('Project not found', 404);
    sendResponse({ res, message: 'Project found', data: project });
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
    const data = await projectService.createProject(req.body);
    sendResponse({
      res,
      message: 'Project created successfully',
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
    const data = await projectService.updateProject(req.params.id, req.body);
    if (!data) throw new AppError('Project not found', 404);
    sendResponse({ res, message: 'Project updated', data });
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
    await projectService.softDeleteProject(req.params.id);
    sendResponse({ res, message: 'Project deleted successfully' });
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
    await projectService.hardDeleteProject(req.params.id);
    sendResponse({ res, message: 'Project hard-deleted successfully' });
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
    await projectService.restoreProject(req.params.id);
    sendResponse({ res, message: 'Project restored successfully' });
  } catch (err) {
    next(err);
  }
};
