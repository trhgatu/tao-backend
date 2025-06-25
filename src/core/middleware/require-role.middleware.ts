import { Request, Response, NextFunction } from 'express'
import Role from '@modules/role/role.model'
import { AppError } from '@common'

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user
    if (!user || !user.roleId) {
      return next(new AppError('Access denied: no role assigned', 403))
    }

    const role = await Role.findById(user.roleId)
    if (!role) return next(new AppError('Role not found', 403))

    if (!allowedRoles.includes(role.name)) {
      return next(new AppError('Forbidden: insufficient role', 403))
    }

    next()
  }
}
