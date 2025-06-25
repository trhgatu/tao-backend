import { Request, Response, NextFunction } from 'express';
import * as templateService from './__template__.service';
import { sendResponse } from '@common';

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getAllTemplates();
    sendResponse({ res, message: 'Templates fetched successfully', data })
  } catch (err) {
    next(err)
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getTemplateById(req.params.id)
    if (!data) return next(new Error('Template not found'))
    sendResponse({ res, message: 'Template found', data })
  } catch (err) {
    next(err)
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.createTemplate(req.body)
    sendResponse({ res, message: 'Template created successfully', data, statusCode: 201 })
  } catch (err) {
    next(err)
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.updateTemplate(req.params.id, req.body)
    if (!data) return next(new Error('Template not found to update'))
    sendResponse({ res, message: 'Template updated', data })
  } catch (err) {
    next(err)
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await templateService.deleteTemplate(req.params.id)
    sendResponse({ res, message: 'Template deleted successfully' })
  } catch (err) {
    next(err)
  }
};


