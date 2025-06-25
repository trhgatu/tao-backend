import { Request, Response, NextFunction } from 'express'
import * as permissionService from './permission.service'
import {
  AppError,
  buildCommonQuery,
  sendPaginatedResponse,
  sendResponse
} from '@common'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { filters, sort } = buildCommonQuery(req, ['name'])
    const result = await permissionService.getAllPermissions({ page, limit }, filters, sort)
    sendPaginatedResponse({
      res,
      message: 'All permissions fetched',
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    })
  } catch (err) {
    next(err)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await permissionService.getPermissionById(req.params.id)
    if (!data) throw new AppError('Permission not found', 404)
    sendResponse({ res, message: 'Permission found', data })
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await permissionService.createPermission(req.body)
    sendResponse({ res, message: 'Permission created', statusCode: 201, data })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await permissionService.updatePermission(req.params.id, req.body)
    if (!data) throw new AppError('Permission not found', 404)
    sendResponse({ res, message: 'Permission updated', data })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await permissionService.deletePermission(req.params.id)
    if (!data) throw new AppError('Permission not found', 404)
    sendResponse({ res, message: 'Permission deleted', data })
  } catch (err) {
    next(err)
  }
}
