// src/core/middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express'
import {
  verifyAccessToken
} from '@common/jwt'
import { AppError, isErrorWithName } from '@common'
import { UserStatus } from '@shared/enums'

export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new AppError('Missing authorization header', 401)

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== 'object' || !decoded._id) {
      throw new AppError('Invalid token payload', 401)
    }

    req.user = {
      _id: decoded._id,
      username: decoded.username,
      roleId: decoded.roleId,
      email: decoded.email,
      fullName: decoded.fullName,
      status: decoded.status as UserStatus,
    }

    next()
  } catch (err: unknown) {
    if (isErrorWithName(err, 'TokenExpiredError')) {
      return next(new AppError('Token expired', 401))
    }

    if (isErrorWithName(err, 'JsonWebTokenError')) {
      return next(new AppError('Invalid token', 401))
    }

    next(new AppError('Authentication failed', 401, true, err))
  }
}
