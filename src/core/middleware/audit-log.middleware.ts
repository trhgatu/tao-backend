import { Request, Response, NextFunction } from 'express'
import AuditLog from '@modules/log/log.model'
import { Types } from 'mongoose'
import { LogAction } from '@shared/enums'

interface CreateAuditLogOptions {
  action?: LogAction
  targetModel?: string
  targetId?: string | Types.ObjectId | ((req: Request) => string | Types.ObjectId)
  description?: string | ((req: Request) => string)
}

export const createAuditLog = (options: CreateAuditLogOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()

    res.on('finish', async () => {
      try {
        const duration = Date.now() - start
        const user = req.user

        const resolvedTargetId =
          typeof options.targetId === 'function' ? options.targetId(req) : options.targetId

        const resolvedDescription =
          typeof options.description === 'function'
            ? options.description(req)
            : options.description ||
              `${user?.email || 'Unknown'} performed ${options.action || req.method} on ${
                options.targetModel || req.originalUrl
              }`

        const log = new AuditLog({
          userId: user?._id || null,
          action: options.action,
          targetModel: options.targetModel,
          targetId: resolvedTargetId,
          description: resolvedDescription,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          duration,
          metadata: {
            body: req.body,
            query: req.query,
            params: req.params,
            ip: req.ip,
          },
        })

        await log.save()
      } catch {
        // TODO: Replace with proper logger in production
        // console.error('[AuditLog] Failed:', err)
      }
    })

    next()
  }
}
