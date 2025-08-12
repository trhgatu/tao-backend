// src/core/middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AccessTokenPayload } from '@core/jwt';
import { AppError, isErrorWithName } from '@core';
import { UserStatus } from '@shared/enums';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const auth =
      req.headers.authorization ??
      (req.headers.Authorization as string | undefined);
    if (!auth || !auth.startsWith('Bearer '))
      throw new AppError('Missing authorization header', 401);

    const token = auth.slice(7).trim();
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded._id)
      throw new AppError('Invalid token payload', 401);
    if (decoded.status && decoded.status !== UserStatus.ACTIVE) {
      throw new AppError('Account is not active', 403);
    }
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      fullName: decoded.fullName,
      username: decoded.username,
      status: decoded.status as UserStatus,
      roleId: decoded.roleId,
      roleCode: decoded.roleCode,
      isAdmin: decoded.isAdmin,
    } as AccessTokenPayload;

    next();
  } catch (err) {
    if (isErrorWithName(err, 'TokenExpiredError'))
      return next(new AppError('Token expired', 401));
    if (isErrorWithName(err, 'JsonWebTokenError'))
      return next(new AppError('Invalid token', 401));
    next(new AppError('Authentication failed', 401, true, err));
  }
};
