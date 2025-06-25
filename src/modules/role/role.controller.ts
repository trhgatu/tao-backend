import { Request, Response, NextFunction } from 'express'
import * as roleService from './role.service'
import { AppError, sendResponse, sendPaginatedResponse, buildCommonQuery } from '@common'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { filters, sort } = buildCommonQuery(req, ['name'])
    const result = await roleService.getAllRoles({page, limit}, filters, sort)
    sendPaginatedResponse({
      res,
      message: 'All roles fetched',
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
    const role = await roleService.getRoleById(req.params.id)
    if (!role) throw new AppError('Role not found', 404)
    sendResponse({ res, message: 'Role found', data: role })
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await roleService.createRole(req.body)
    sendResponse({ res, message: 'Role created', statusCode: 201, data: role })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body)
    if (!role) throw new AppError('Role not found', 404)
    sendResponse({ res, message: 'Role updated', data: role })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await roleService.deleteRole(req.params.id)
    if (!role) throw new AppError('Role not found', 404)
    sendResponse({ res, message: 'Role deleted', data: role })
  } catch (err) {
    next(err)
  }
}
