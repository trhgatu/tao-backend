import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { getUserId, sendResponse } from '@common'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.register(req.body)
    sendResponse({ res, statusCode: 201, message: 'Register successful', data })
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    sendResponse({
      res,
      message: 'Login successful',
      data: {
        token: accessToken,
        user,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)
    const data = await authService.getMe(userId)
    sendResponse({ res, message: 'User info fetched', data })
  } catch (err) {
    next(err)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) throw new Error('Refresh token not provided')

    const data = await authService.refreshAccessToken(token)
    sendResponse({ res, message: 'Access token refreshed', data })
  } catch (err) {
    next(err)
  }
}

export const logout = async (_: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  sendResponse({ res, message: 'Logged out successfully' })
}
