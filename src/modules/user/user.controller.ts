import { Request, Response, NextFunction } from 'express'
import * as userService from './user.service'
import { sendResponse, getUserId, buildCommonQuery, sendPaginatedResponse } from '@common'

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)
    const data = await userService.getMe(userId)
    sendResponse({ res, message: 'Get current user', data })
  } catch (err) {
    next(err)
  }
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)
    const data = await userService.updateMe(userId, req.body)
    sendResponse({ res, message: 'Profile updated', data })
  } catch (err) {
    next(err)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { filters, sort } = buildCommonQuery(req, ['fullName', 'email'])
    const result = await userService.getAllUsers({ page, limit }, filters, sort)
    sendPaginatedResponse({
      res,
      message: 'All users fetched',
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err)
  }
}
