import { Request, Response, NextFunction } from 'express';
import * as templateService from './log.service';
import { sendResponse } from '@common';

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getAllLogs();
    sendResponse({ res, message: 'Logs fetched successfully', data })
  } catch (err) {
    next(err)
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.getLogById(req.params.id)
    if (!data) return next(new Error('Log not found'))
    sendResponse({ res, message: 'Log found', data })
  } catch (err) {
    next(err)
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.createLog(req.body)
    sendResponse({ res, message: 'Log created successfully', data, statusCode: 201 })
  } catch (err) {
    next(err)
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await templateService.updateLog(req.params.id, req.body)
    if (!data) return next(new Error('Log not found to update'))
    sendResponse({ res, message: 'Log updated', data })
  } catch (err) {
    next(err)
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await templateService.deleteLog(req.params.id)
    sendResponse({ res, message: 'Log deleted successfully' })
  } catch (err) {
    next(err)
  }
};


